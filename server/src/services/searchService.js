/**
 * Search Service — intelligent product search.
 *
 * Strategy:
 *  1. Try MongoDB Atlas Search ($search) when index exists
 *  2. Fall back to normalized regex + synonym expansion + fuzzy ranking
 *
 * Matches: title, author, publisher, category, keywords, tags, searchIndex
 */
import Product from "../models/Product.js";
import SearchLog from "../models/SearchLog.js";
import { escapeRegex, normalizeSearch, tokenizeQuery } from "../utils/normalize.js";
import {
  expandSynonyms,
  POPULAR_SEARCHES,
  suggestSpellings,
  buildSuggestionPhrases,
} from "../utils/synonyms.js";
import { scoreRelevance, isFuzzyMatch, maxEditsFor, levenshtein } from "../utils/fuzzy.js";
import {
  buildAtlasSearchPipeline,
  buildAtlasSuggestPipeline,
  isAtlasSearchUnavailable,
} from "../utils/searchPipeline.js";

const LIST_FIELDS =
  "title titleEn titleUr author publisher source category price regularPrice onSale available localImage image slug keywords tags";

/** Cache: whether Atlas Search index is available (null = unknown). */
let atlasAvailable = null;
/** Skip Atlas after repeated empty responses (misconfigured index). */
let atlasEmptyStreak = 0;

/** Atlas is opt-in — broken/empty indexes must not block regex search. */
function isAtlasEnabled() {
  return process.env.ATLAS_SEARCH_ENABLED === "true" && atlasAvailable !== false;
}

const suggestCache = new Map();
const SUGGEST_TTL = 30_000;

function getSuggestCache(key) {
  const hit = suggestCache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > SUGGEST_TTL) {
    suggestCache.delete(key);
    return null;
  }
  return hit.value;
}

function setSuggestCache(key, value) {
  if (suggestCache.size > 100) {
    const first = suggestCache.keys().next().value;
    suggestCache.delete(first);
  }
  suggestCache.set(key, { at: Date.now(), value });
}

/**
 * Build a Mongo $or filter across searchable fields for one term (partial / prefix).
 */
function fieldClauses(term) {
  const a = escapeRegex(term);
  return [
    { searchIndex: { $regex: a, $options: "i" } },
    { title: { $regex: a, $options: "i" } },
    { titleEn: { $regex: a, $options: "i" } },
    { titleUr: { $regex: a, $options: "i" } },
    { author: { $regex: a, $options: "i" } },
    { publisher: { $regex: a, $options: "i" } },
    { source: { $regex: a, $options: "i" } },
    { category: { $regex: a, $options: "i" } },
    { keywords: { $regex: a, $options: "i" } },
    { tags: { $regex: a, $options: "i" } },
  ];
}

/** True if two token expansions share any synonym (same concept). */
function expansionsOverlap(a, b) {
  const setA = new Set(a);
  return b.some((t) => setA.has(t));
}

/**
 * Group query tokens that mean the same thing (e.g. "Parda" + "پردہ").
 * Different concepts stay in separate clusters and are AND-ed.
 */
function clusterSynonymTokens(tokens) {
  const clusters = [];
  const used = new Set();

  for (let i = 0; i < tokens.length; i++) {
    if (used.has(i)) continue;
    const cluster = [tokens[i]];
    let clusterExp = new Set(expandSynonyms(tokens[i]));
    used.add(i);

    for (let j = i + 1; j < tokens.length; j++) {
      if (used.has(j)) continue;
      const expJ = expandSynonyms(tokens[j]);
      if (expansionsOverlap([...clusterExp], expJ)) {
        cluster.push(tokens[j]);
        expJ.forEach((t) => clusterExp.add(t));
        used.add(j);
      }
    }
    clusters.push(cluster);
  }
  return clusters;
}

/** Latin + Urdu in one query usually means one bilingual title, not two filters. */
function isMixedScriptBilingualQuery(tokens) {
  if (tokens.length < 2) return false;
  const hasLatin = tokens.some((t) => /[a-z0-9]/i.test(t));
  const hasUrdu = tokens.some((t) => /[\u0600-\u06FF]/.test(t));
  return hasLatin && hasUrdu;
}

/**
 * Fallback Mongo filter from query (synonyms + partial).
 * Exported so products route can reuse when not using full service ranking.
 */
export function buildSmartSearchFilter(search) {
  const terms = expandSynonyms(search);
  if (!terms.length) return null;

  const primaryTokens = tokenizeQuery(search).filter((t) => t.length >= 2);

  // Single token / short query: match any expanded alias
  if (primaryTokens.length < 2) {
    return { $or: terms.flatMap((a) => fieldClauses(a)) };
  }

  // "Parda پردہ" / "Quran قرآن" — bilingual same-concept → OR, not AND
  if (isMixedScriptBilingualQuery(primaryTokens)) {
    const clusters = clusterSynonymTokens(primaryTokens);
    // If every Latin/Urdu pair collapsed into one concept cluster, OR is enough
    if (clusters.length === 1) {
      const aliases = [
        ...new Set(clusters[0].flatMap((token) => expandSynonyms(token))),
      ];
      return { $or: aliases.flatMap((a) => fieldClauses(a)) };
    }
  }

  // Multi-concept queries: AND across synonym clusters, OR within each cluster
  const clusters = clusterSynonymTokens(primaryTokens);
  if (clusters.length === 1) {
    const aliases = [
      ...new Set(clusters[0].flatMap((token) => expandSynonyms(token))),
    ];
    return { $or: aliases.flatMap((a) => fieldClauses(a)) };
  }

  return {
    $and: clusters.map((cluster) => {
      const aliases = [...new Set(cluster.flatMap((token) => expandSynonyms(token)))];
      return { $or: aliases.flatMap((a) => fieldClauses(a)) };
    }),
  };
}

/**
 * Broader candidate filter for fuzzy recovery when exact/partial finds nothing.
 * Uses first 2 characters of the query against searchIndex.
 */
function buildPrefixCandidateFilter(search) {
  const tokens = tokenizeQuery(search);
  if (!tokens.length) return null;
  const prefix = tokens[0].slice(0, Math.min(2, tokens[0].length));
  if (prefix.length < 1) return null;
  return {
    $or: [
      { searchIndex: { $regex: escapeRegex(prefix), $options: "i" } },
      { title: { $regex: escapeRegex(prefix), $options: "i" } },
      { titleUr: { $regex: escapeRegex(prefix), $options: "i" } },
      { author: { $regex: escapeRegex(prefix), $options: "i" } },
    ],
  };
}

function mergeFilters(base, extra) {
  if (!extra || !Object.keys(extra).length) return base && Object.keys(base).length ? base : null;
  if (!base || !Object.keys(base).length) return extra;
  return { $and: [base, extra] };
}

/**
 * Rank and paginate an array of products by relevance.
 * Exact query matches first, then near/synonym matches.
 */
function rankAndPaginate(items, query, { skip, limit }) {
  const expanded = expandSynonyms(query);
  const qNorm = normalizeSearch(query);

  const scored = items
    .map((p) => {
      const relevance = scoreRelevance(p, query, expanded);
      const titleNorm = normalizeSearch(p.title || p.titleEn || p.titleUr || "");
      return {
        ...p,
        _relevance: relevance,
        _exact: titleNorm === qNorm || normalizeSearch(p.titleUr || "") === qNorm || normalizeSearch(p.titleEn || "") === qNorm,
        _titleLen: titleNorm.length,
      };
    })
    .filter(
      (p) =>
        p._relevance > 0 ||
        isFuzzyMatch(
          query,
          [p.title, p.titleEn, p.titleUr, p.author, ...(p.keywords || [])].join(" ")
        )
    )
    .sort((a, b) => {
      // Exact title === query always first
      if (a._exact !== b._exact) return a._exact ? -1 : 1;
      if (b._relevance !== a._relevance) return b._relevance - a._relevance;
      // Prefer shorter titles among equal scores (closer to the search word)
      if (a._titleLen !== b._titleLen) return a._titleLen - b._titleLen;
      return String(a.title || "").localeCompare(String(b.title || ""));
    });

  const ranked =
    scored.length > 0
      ? scored
      : items
          .map((p) => ({
            ...p,
            _relevance: scoreRelevance(p, query, expanded) || (isFuzzyMatch(query, p.title) ? 50 : 0),
            _exact: false,
            _titleLen: String(p.title || "").length,
          }))
          .filter((p) => p._relevance > 0)
          .sort((a, b) => b._relevance - a._relevance || a._titleLen - b._titleLen);

  const total = ranked.length;
  const pageItems = ranked.slice(skip, skip + limit).map(({ _relevance, _exact, _titleLen, ...rest }) => ({
    ...rest,
    relevance: _relevance,
  }));

  return { items: pageItems, total };
}

/**
 * Fallback search without Atlas Search.
 */
async function fallbackSearch(query, { skip, limit, extraFilter, sort }) {
  const filter = mergeFilters(buildSmartSearchFilter(query) || {}, extraFilter);
  let candidates = await Product.find(filter)
    .select(LIST_FIELDS)
    .limit(400)
    .maxTimeMS(10000)
    .lean();

  // Fuzzy recovery: no hits → prefix candidates + Levenshtein filter
  if (!candidates.length) {
    const prefixFilter = mergeFilters(buildPrefixCandidateFilter(query) || {}, extraFilter);
    if (prefixFilter) {
      const broad = await Product.find(prefixFilter)
        .select(LIST_FIELDS)
        .limit(300)
        .maxTimeMS(8000)
        .lean();
      const q = normalizeSearch(query);
      const maxEd = maxEditsFor(q);
      candidates = broad.filter((p) => {
        const hay = normalizeSearch(
          [p.title, p.titleEn, p.titleUr, p.author, ...(p.keywords || []), ...(p.tags || [])].join(" ")
        );
        if (hay.includes(q)) return true;
        return hay.split(/\s+/).some((tok) => {
          if (Math.abs(tok.length - q.length) > maxEd + 1) return false;
          return levenshtein(tok, q) <= maxEd || tok.startsWith(q) || q.startsWith(tok.slice(0, 3));
        });
      });
    }
  }

  // Custom sort overrides relevance when explicitly requested
  if (sort && sort !== "featured" && sort !== "relevance") {
    const sortMap = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      "title-asc": (a, b) => String(a.title).localeCompare(String(b.title)),
      "title-desc": (a, b) => String(b.title).localeCompare(String(a.title)),
      newest: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    };
    if (sortMap[sort]) {
      candidates.sort(sortMap[sort]);
      return {
        items: candidates.slice(skip, skip + limit),
        total: candidates.length,
        engine: "fallback",
      };
    }
  }

  const ranked = rankAndPaginate(candidates, query, { skip, limit });
  return { ...ranked, engine: "fallback" };
}

/**
 * Primary search entry — Atlas first, then fallback.
 */
export async function searchProducts(query, options = {}) {
  const {
    page = 1,
    limit = 24,
    extraFilter = null,
    sort = "relevance",
  } = options;

  const q = String(query || "").trim();
  const pageNum = Math.max(1, Number(page));
  const pageSize = Math.min(100, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * pageSize;

  if (!q) {
    return { items: [], total: 0, page: pageNum, pages: 0, limit: pageSize, engine: "none", query: q };
  }

  // Fire-and-forget analytics
  logSearch(q).catch(() => {});

  // Try Atlas Search only when explicitly enabled and not marked unavailable
  if (isAtlasEnabled()) {
    try {
      const pipeline = buildAtlasSearchPipeline(q, {
        skip,
        limit: pageSize,
        extraMatch: extraFilter && Object.keys(extraFilter).length ? extraFilter : null,
      });
      if (pipeline) {
        const [facet] = await Product.aggregate(pipeline).option({ maxTimeMS: 12000 });
        const items = facet?.items || [];
        const total = facet?.totalCount?.[0]?.count ?? items.length;
        atlasAvailable = true;

        // Atlas index may exist but return nothing (misconfigured / stale).
        // Fall through to regex search so real catalog matches still work.
        if (total > 0 && items.length > 0) {
          atlasEmptyStreak = 0;
          return {
            items,
            total,
            page: pageNum,
            pages: Math.ceil(total / pageSize) || 1,
            limit: pageSize,
            engine: "atlas",
            query: q,
            highlightTerms: expandSynonyms(q).slice(0, 20),
          };
        }
        atlasEmptyStreak += 1;
        if (atlasEmptyStreak >= 2) {
          atlasAvailable = false;
          console.warn("[search] Atlas disabled after repeated empty results");
        } else {
          console.warn("[search] Atlas returned 0 hits — using fallback for:", q);
        }
      }
    } catch (err) {
      if (isAtlasSearchUnavailable(err)) {
        atlasAvailable = false;
        console.warn("[search] Atlas Search unavailable — using fallback:", err.message);
      } else {
        console.warn("[search] Atlas Search error, falling back:", err.message);
      }
    }
  }

  const result = await fallbackSearch(q, {
    skip,
    limit: pageSize,
    extraFilter,
    sort,
  });

  return {
    ...result,
    page: pageNum,
    pages: Math.ceil(result.total / pageSize) || 1,
    limit: pageSize,
    query: q,
    highlightTerms: expandSynonyms(q).slice(0, 20),
  };
}

/**
 * Instant autocomplete suggestions while typing.
 */
export async function getSuggestions(query, limit = 8) {
  const q = String(query || "").trim();
  if (!q || q.length < 1) {
    return {
      suggestions: POPULAR_SEARCHES.slice(0, limit).map((text) => ({
        type: "popular",
        text,
      })),
      products: [],
    };
  }

  const cacheKey = normalizeSearch(q) + ":" + limit;
  const cached = getSuggestCache(cacheKey);
  if (cached) return cached;

  const phraseSuggestions = buildSuggestionPhrases(q).slice(0, limit);
  let products = [];

  if (isAtlasEnabled()) {
    try {
      const pipeline = buildAtlasSuggestPipeline(q, limit);
      if (pipeline) {
        products = await Product.aggregate(pipeline).option({ maxTimeMS: 5000 });
        atlasAvailable = true;
        if (!products.length) {
          // fall through to regex suggestions below
        }
      }
    } catch (err) {
      if (isAtlasSearchUnavailable(err)) atlasAvailable = false;
    }
  }

  if (!products.length) {
    const filter = buildSmartSearchFilter(q);
    if (filter) {
      products = await Product.find(filter)
        .select("title titleEn titleUr author slug")
        .limit(limit)
        .maxTimeMS(5000)
        .lean();
    }
  }

  // Build unified suggestion list
  const suggestions = [];
  const seen = new Set();

  for (const text of phraseSuggestions) {
    const key = normalizeSearch(text);
    if (seen.has(key)) continue;
    seen.add(key);
    suggestions.push({ type: "synonym", text });
    if (suggestions.length >= limit) break;
  }

  for (const p of products) {
    const label = p.titleUr || p.titleEn || p.title;
    const key = normalizeSearch(label);
    if (!label || seen.has(key)) continue;
    seen.add(key);
    suggestions.push({
      type: "product",
      text: label,
      author: p.author || "",
      slug: p.slug,
      id: p._id,
    });
    if (suggestions.length >= limit + 4) break;
  }

  // Author suggestions
  for (const p of products) {
    if (!p.author) continue;
    const key = normalizeSearch(p.author);
    if (seen.has(key)) continue;
    const nq = normalizeSearch(q);
    if (!key.includes(nq) && !nq.includes(key.slice(0, 3))) continue;
    seen.add(key);
    suggestions.push({ type: "author", text: p.author });
    if (/[\u0600-\u06FF]/.test(p.author)) {
      suggestions.push({ type: "author", text: `${p.author} کی تمام کتابیں` });
    }
  }

  const payload = {
    suggestions: suggestions.slice(0, Math.max(limit, 10)),
    products: products.slice(0, limit),
  };
  setSuggestCache(cacheKey, payload);
  return payload;
}

/**
 * Log a search for popular-searches analytics.
 */
export async function logSearch(query) {
  const q = String(query || "").trim();
  if (!q || q.length < 2) return;
  const normalized = normalizeSearch(q);
  if (!normalized) return;

  await SearchLog.findOneAndUpdate(
    { normalized },
    {
      $set: { query: q, lastSearchedAt: new Date() },
      $inc: { count: 1 },
      $setOnInsert: { normalized },
    },
    { upsert: true }
  );
}

/**
 * Popular searches — DB analytics merged with curated defaults.
 */
export async function getPopularSearches(limit = 8) {
  try {
    const rows = await SearchLog.find({})
      .sort({ count: -1, lastSearchedAt: -1 })
      .limit(limit)
      .select("query count")
      .lean();
    if (rows.length) {
      const fromDb = rows.map((r) => r.query);
      const merged = [...new Set([...fromDb, ...POPULAR_SEARCHES])];
      return merged.slice(0, limit);
    }
  } catch {
    /* collection may not exist yet */
  }
  return POPULAR_SEARCHES.slice(0, limit);
}

/**
 * No-result helpers: spellings, similar books, related authors.
 */
export async function getNoResultSuggestions(query) {
  const q = String(query || "").trim();
  const spellings = suggestSpellings(q, 6);

  let similar = [];
  let authors = [];

  // Try searching with suggested spellings
  for (const alt of spellings.slice(0, 3)) {
    const filter = buildSmartSearchFilter(alt);
    if (!filter) continue;
    const found = await Product.find(filter)
      .select(LIST_FIELDS)
      .limit(6)
      .maxTimeMS(6000)
      .lean();
    similar.push(...found);
    if (similar.length >= 8) break;
  }

  // Deduplicate
  const seen = new Set();
  similar = similar.filter((p) => {
    const id = String(p._id);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  }).slice(0, 8);

  authors = [
    ...new Set(
      similar
        .map((p) => p.author)
        .filter(Boolean)
    ),
  ].slice(0, 5);

  // If still empty, show featured-ish recent books
  if (!similar.length) {
    similar = await Product.find({})
      .sort({ onSale: -1, createdAt: -1 })
      .select(LIST_FIELDS)
      .limit(6)
      .maxTimeMS(5000)
      .lean();
  }

  return {
    query: q,
    suggestedSpellings: spellings,
    similarBooks: similar,
    relatedAuthors: authors,
  };
}

/** Reset Atlas availability probe (e.g. after admin creates index). */
export function resetAtlasProbe() {
  atlasAvailable = null;
}
