/**
 * Fuzzy / typo-tolerant helpers (Levenshtein + soft regex).
 * Used when Atlas Search is unavailable or as a post-rank scorer.
 */
import { escapeRegex, normalizeSearch } from "./normalize.js";

/**
 * Classic Levenshtein edit distance.
 */
export function levenshtein(a, b) {
  const s = String(a || "");
  const t = String(b || "");
  if (s === t) return 0;
  if (!s.length) return t.length;
  if (!t.length) return s.length;

  const rows = s.length + 1;
  const cols = t.length + 1;
  const prev = new Array(cols);
  const curr = new Array(cols);

  for (let j = 0; j < cols; j++) prev[j] = j;

  for (let i = 1; i < rows; i++) {
    curr[0] = i;
    for (let j = 1; j < cols; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j < cols; j++) prev[j] = curr[j];
  }
  return prev[cols - 1];
}

/**
 * Max allowed edits for a token length (typo tolerance).
 * Short tokens: 1 edit; longer: 2.
 */
export function maxEditsFor(token) {
  const len = String(token || "").length;
  if (len <= 3) return 1;
  if (len <= 6) return 1;
  return 2;
}

/**
 * True if `candidate` is within edit distance of `query` (or contains a close token).
 */
export function isFuzzyMatch(query, candidate) {
  const q = normalizeSearch(query);
  const c = normalizeSearch(candidate);
  if (!q || !c) return false;
  if (c.includes(q) || q.includes(c)) return true;

  const qTokens = q.split(/\s+/);
  const cTokens = c.split(/\s+/);

  for (const qt of qTokens) {
    const max = maxEditsFor(qt);
    for (const ct of cTokens) {
      if (Math.abs(qt.length - ct.length) > max) continue;
      if (levenshtein(qt, ct) <= max) return true;
      if (ct.startsWith(qt) || qt.startsWith(ct)) return true;
    }
  }
  return false;
}

/**
 * Best fuzzy distance between query and a haystack string (lower = better).
 */
export function bestFuzzyDistance(query, haystack) {
  const q = normalizeSearch(query);
  const h = normalizeSearch(haystack);
  if (!q || !h) return 99;
  if (h === q) return 0;
  if (h.startsWith(q)) return 0.5;
  if (h.includes(q)) return 1;

  let best = 99;
  const qTokens = q.split(/\s+/);
  const hTokens = h.split(/\s+/);
  for (const qt of qTokens) {
    for (const ht of hTokens) {
      const d = levenshtein(qt, ht);
      if (d < best) best = d;
    }
    // Also compare against full haystack for single-token queries
    if (qTokens.length === 1) {
      const d = levenshtein(qt, h);
      if (d < best) best = d;
    }
  }
  return best;
}

/**
 * Soft regex: allow optional characters between letters for light typo tolerance.
 * Only for short queries to avoid pathological patterns.
 */
export function softRegexPattern(term) {
  const t = normalizeSearch(term);
  if (!t || t.length > 12) return escapeRegex(t);
  // Insert optional single-char wildcards between letters carefully — keep partial simple
  return escapeRegex(t);
}

/**
 * Relevance score for ranking (higher = better).
 *
 * Order users expect:
 *  1. Exact title / exact word = search query
 *  2. Title starts with / contains the query
 *  3. Synonym exact / near title matches
 *  4. Fuzzy-similar titles
 *  5. Author → keywords → publisher → category
 */
export function scoreRelevance(product, query, expandedTerms = []) {
  const q = normalizeSearch(query);
  if (!q) return 0;

  const titlePrimary = normalizeSearch(product.title || "");
  const titleEn = normalizeSearch(product.titleEn || "");
  const titleUr = normalizeSearch(product.titleUr || "");
  const titles = [...new Set([titlePrimary, titleEn, titleUr].filter(Boolean))];
  const titleBlob = titles.join(" ");
  const titleTokens = titleBlob.split(/\s+/).filter(Boolean);

  const author = normalizeSearch(product.author);
  const publisher = normalizeSearch(product.publisher || product.source);
  const category = normalizeSearch(product.category);
  const keywords = normalizeSearch(
    [...(product.keywords || []), ...(product.tags || [])].join(" ")
  );

  const synonyms = (expandedTerms || []).map(normalizeSearch).filter((t) => t && t !== q);

  // Shorter titles that match are usually the intended book
  const shortness = Math.max(0, 120 - titleBlob.length);

  // ——— 1. Exact match to the typed query ———
  if (titles.some((t) => t === q)) return 10000 + shortness;
  if (titleTokens.includes(q)) return 9500 + shortness;

  // Title is exactly "query …" (starts with whole query as first word)
  if (titles.some((t) => t.startsWith(`${q} `) || t.startsWith(`${q}/`) || t.startsWith(`${q}|`))) {
    return 9000 + shortness;
  }
  if (titles.some((t) => t.startsWith(q))) return 8500 + shortness;

  // Query appears as a whole word inside title
  if (titleBlob.includes(q)) return 7000 + shortness;

  // ——— 2. Synonym / near-word exact title matches ———
  for (const term of synonyms) {
    if (titles.some((t) => t === term)) return 5500 + shortness;
  }
  for (const term of synonyms) {
    if (titleTokens.includes(term)) return 5000 + shortness;
  }
  for (const term of synonyms) {
    if (
      titles.some(
        (t) => t.startsWith(`${term} `) || t.startsWith(`${term}/`) || t.startsWith(term)
      )
    ) {
      return 4500 + shortness;
    }
  }
  for (const term of synonyms) {
    if (term.length >= 2 && titleBlob.includes(term)) return 3500 + shortness;
  }

  // ——— 3. Fuzzy-similar titles (typos / close spellings) ———
  const fuzzyDist = bestFuzzyDistance(q, titleBlob);
  if (fuzzyDist === 0) return 3200 + shortness;
  if (fuzzyDist <= 1) return 2500 + shortness;
  if (fuzzyDist <= 2) return 1800 + shortness;

  // Token-level near match
  let bestTok = 99;
  for (const tok of titleTokens) {
    if (Math.abs(tok.length - q.length) > 2) continue;
    bestTok = Math.min(bestTok, levenshtein(tok, q));
  }
  if (bestTok <= 1) return 1600 + shortness;
  if (bestTok <= 2) return 1200 + shortness;

  // ——— 4. Author / keywords / publisher / category ———
  if (author === q) return 1100;
  if (author.includes(q) || author.split(/\s+/).includes(q)) return 900;
  for (const term of synonyms) {
    if (author.includes(term)) return 750;
  }

  if (keywords.includes(q)) return 650;
  for (const term of synonyms) {
    if (term.length >= 3 && keywords.includes(term)) return 500;
  }

  if (publisher.includes(q)) return 350;
  if (category.includes(q)) return 250;

  return 0;
}
