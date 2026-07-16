/**
 * MongoDB Atlas Search aggregation pipeline builders.
 *
 * Index name: products_search
 * Definition: server/src/data/atlas-search-index.json
 *
 * Create in Atlas UI:
 *   Cluster → Search → Create Search Index → JSON Editor → paste that file.
 */
import { expandSynonyms } from "./synonyms.js";
import { normalizeSearch } from "./normalize.js";

export const ATLAS_SEARCH_INDEX = process.env.ATLAS_SEARCH_INDEX || "products_search";

const LIST_PROJECT = {
  title: 1,
  titleEn: 1,
  titleUr: 1,
  author: 1,
  publisher: 1,
  source: 1,
  category: 1,
  price: 1,
  regularPrice: 1,
  onSale: 1,
  available: 1,
  localImage: 1,
  image: 1,
  slug: 1,
  keywords: 1,
  tags: 1,
  score: { $meta: "searchScore" },
};

/**
 * Build a compound $search stage with fuzzy + autocomplete + synonym-expanded terms.
 */
export function buildAtlasSearchStage(query, { fuzzy = true } = {}) {
  const q = String(query || "").trim();
  if (!q) return null;

  const expanded = expandSynonyms(q);
  const primary = normalizeSearch(q) || q;
  const clauses = [];

  const paths = {
    title: ["title", "titleEn", "titleUr"],
    author: ["author"],
    keywords: ["keywords", "tags", "searchIndex"],
    publisher: ["publisher", "source"],
    category: ["category"],
  };

  clauses.push({
    text: {
      query: primary,
      path: paths.title,
      ...(fuzzy ? { fuzzy: { maxEdits: 2, prefixLength: 1 } } : {}),
      score: { boost: { value: 10 } },
    },
  });

  clauses.push({
    autocomplete: {
      query: primary,
      path: "title",
      score: { boost: { value: 8 } },
      ...(fuzzy ? { fuzzy: { maxEdits: 1, prefixLength: 1 } } : {}),
    },
  });

  clauses.push({
    text: {
      query: primary,
      path: paths.author,
      ...(fuzzy ? { fuzzy: { maxEdits: 2, prefixLength: 1 } } : {}),
      score: { boost: { value: 6 } },
    },
  });

  clauses.push({
    text: {
      query: primary,
      path: paths.keywords,
      ...(fuzzy ? { fuzzy: { maxEdits: 1, prefixLength: 1 } } : {}),
      score: { boost: { value: 4 } },
    },
  });

  clauses.push({
    text: {
      query: primary,
      path: paths.publisher,
      score: { boost: { value: 2 } },
    },
  });

  clauses.push({
    text: {
      query: primary,
      path: paths.category,
      score: { boost: { value: 1 } },
    },
  });

  for (const term of expanded.slice(0, 12)) {
    if (term === primary) continue;
    clauses.push({
      text: {
        query: term,
        path: [...paths.title, ...paths.author, ...paths.keywords],
        score: { boost: { value: 3 } },
      },
    });
  }

  if (primary.length >= 2 && primary.length <= 4) {
    clauses.push({
      wildcard: {
        query: `${primary}*`,
        path: paths.title,
        allowAnalyzedField: true,
        score: { boost: { value: 5 } },
      },
    });
  }

  return {
    $search: {
      index: ATLAS_SEARCH_INDEX,
      compound: {
        should: clauses,
        minimumShouldMatch: 1,
      },
    },
  };
}

/**
 * Full Atlas Search pipeline with pagination + projection.
 */
export function buildAtlasSearchPipeline(query, { skip = 0, limit = 24, extraMatch = null } = {}) {
  const searchStage = buildAtlasSearchStage(query);
  if (!searchStage) return null;

  const pipeline = [searchStage];

  if (extraMatch && Object.keys(extraMatch).length) {
    pipeline.push({ $match: extraMatch });
  }

  pipeline.push({
    $facet: {
      items: [{ $skip: skip }, { $limit: limit }, { $project: LIST_PROJECT }],
      meta: [{ $replaceWith: "$$SEARCH_META" }, { $limit: 1 }],
      totalCount: [{ $count: "count" }],
    },
  });

  return pipeline;
}

/**
 * Autocomplete-focused Atlas pipeline for suggestions.
 */
export function buildAtlasSuggestPipeline(query, limit = 8) {
  const q = String(query || "").trim();
  if (!q) return null;

  return [
    {
      $search: {
        index: ATLAS_SEARCH_INDEX,
        compound: {
          should: [
            {
              autocomplete: {
                query: q,
                path: "title",
                fuzzy: { maxEdits: 1, prefixLength: 1 },
                score: { boost: { value: 10 } },
              },
            },
            {
              autocomplete: {
                query: q,
                path: "author",
                fuzzy: { maxEdits: 1, prefixLength: 1 },
                score: { boost: { value: 6 } },
              },
            },
            {
              text: {
                query: q,
                path: ["keywords", "tags", "titleUr", "titleEn"],
                fuzzy: { maxEdits: 1 },
                score: { boost: { value: 3 } },
              },
            },
          ],
          minimumShouldMatch: 1,
        },
      },
    },
    { $limit: limit },
    {
      $project: {
        title: 1,
        titleEn: 1,
        titleUr: 1,
        author: 1,
        slug: 1,
        score: { $meta: "searchScore" },
      },
    },
  ];
}

/**
 * Detect Atlas Search index-missing / unsupported errors so we can fall back.
 */
export function isAtlasSearchUnavailable(err) {
  const msg = String(err?.message || err || "").toLowerCase();
  return (
    msg.includes("planexecutor error") ||
    msg.includes("index not found") ||
    msg.includes("no search indexes") ||
    msg.includes("$search") ||
    msg.includes("search not enabled") ||
    msg.includes("unrecognized pipeline stage") ||
    err?.code === 31082 ||
    err?.codeName === "IndexNotFound"
  );
}
