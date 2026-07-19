/**
 * Search Controller — HTTP handlers for intelligent search endpoints.
 */
import {
  searchProducts,
  getSuggestions,
  getPopularSearches,
  getNoResultSuggestions,
  logSearch,
} from "../services/searchService.js";

export async function search(req, res) {
  try {
    const {
      q,
      search,
      page = 1,
      limit = 24,
      sort = "relevance",
      available,
      onSale,
      author,
      category,
    } = req.query;

    const query = String(q || search || "").trim();
    if (!query) {
      return res.status(400).json({ error: "Missing search query (q)" });
    }

    const extraFilter = {};
    if (available === "true") extraFilter.available = true;
    if (onSale === "true") extraFilter.onSale = true;
    if (author) extraFilter.author = new RegExp(String(author).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    const result = await searchProducts(query, {
      page,
      limit,
      sort,
      extraFilter: Object.keys(extraFilter).length ? extraFilter : null,
    });

    // Attach no-result helpers when empty
    if (!result.items.length) {
      const empty = await getNoResultSuggestions(query);
      return res.json({ ...result, empty });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function suggestions(req, res) {
  try {
    const q = String(req.query.q || req.query.search || "").trim();
    const limit = Math.min(40, Math.max(1, Number(req.query.limit) || 8));
    const data = await getSuggestions(q, limit);
    res.setHeader("Cache-Control", "public, max-age=15, stale-while-revalidate=60");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function popular(req, res) {
  try {
    const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 8));
    const items = await getPopularSearches(limit);
    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function noResults(req, res) {
  try {
    const q = String(req.query.q || req.query.search || "").trim();
    if (!q) return res.status(400).json({ error: "Missing query" });
    const data = await getNoResultSuggestions(q);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** Optional: client can POST to record a committed search (history sync). */
export async function track(req, res) {
  try {
    const q = String(req.body?.query || req.body?.q || "").trim();
    if (!q) return res.status(400).json({ error: "Missing query" });
    await logSearch(q);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
