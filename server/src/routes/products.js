import { Router } from "express";
import Product from "../models/Product.js";
import { buildBilingualSearchQuery } from "../utils/bilingual.js";
import { searchProducts, buildSmartSearchFilter } from "../services/searchService.js";

const router = Router();

const CATEGORY_MAP = {
  quran: ["quran", "quraan", "koran", "قرآن", "القرآن", "mushaf", "مصحف"],
  para: ["para", "sipara", "siparah", "juz", "پارہ", "سيپارہ", "سیپارہ", "جزو", "para Quran"],
  tarjuma: ["tarjuma", "tarjama", "translation", "ترجمہ", "ترجمه", "tarjuma quran", "ترجمہ قرآن"],
  tafseer: [
    "tafseer",
    "tafsir",
    "تفسیر",
    "تفسير",
    "tafheem",
    "tafhim",
    "tafheem ul quran",
    "تفہیم",
    "تفہیم القرآن",
  ],
  hadees: ["hadith", "hadees", "ahadees", "حدیث", "احادیث", "حديث", "bukhari", "muslim", "mishkat"],
  hadith: ["hadith", "hadees", "ahadees", "حدیث", "احادیث", "حديث", "bukhari", "muslim", "mishkat"],
  fiqa: ["fiqa", "fiqh", "فقہ", "فقه", "masail", "مسائل", "hanafi"],
  fiqh: ["fiqa", "fiqh", "فقہ", "فقه", "masail", "مسائل"],
  tarikh: ["tarikh", "tareekh", "history", "تاریخ", "تاريخ", "islami tarikh", "اسلامی تاریخ"],
  seerat: ["seerat", "seerah", "sirah", "سیرت", "biography", "prophet"],
  "dars-e-nizami": ["dars", "nizami", "fiqh", "فقہ", "fiqa"],
};

const LIST_FIELDS =
  "title titleEn titleUr author publisher source category price regularPrice onSale available localImage image";

const listCache = new Map();
const LIST_CACHE_TTL = 60_000;
const FILTERS_CACHE_TTL = 10 * 60_000;
let filtersCache = null;
let filtersCacheAt = 0;

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Match book fields only — not description (often contains publisher/institution names). */
function buildCategoryQuery(category) {
  if (!category || category === "all") return null;
  const keywords = CATEGORY_MAP[category.toLowerCase()] || [category];
  return {
    $or: keywords.flatMap((k) => [
      { category: { $regex: k, $options: "i" } },
      { title: { $regex: k, $options: "i" } },
      { titleEn: { $regex: k, $options: "i" } },
      { titleUr: { $regex: k, $options: "i" } },
      { tags: { $regex: k, $options: "i" } },
      { categories: { $regex: k, $options: "i" } },
      { searchIndex: { $regex: escapeRegex(k), $options: "i" } },
    ]),
  };
}

function buildSearchQuery(search) {
  // Prefer smart filter (keywords + synonyms); fall back to legacy bilingual query
  return buildSmartSearchFilter(search) || buildBilingualSearchQuery(search);
}

function mergeFilters(base, extra) {
  if (!extra) return base;
  if (!Object.keys(base).length) return extra;
  return { $and: [base, extra] };
}

function getCached(map, key, ttl) {
  const hit = map.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > ttl) {
    map.delete(key);
    return null;
  }
  return hit.value;
}

function setCached(map, key, value, maxEntries = 80) {
  if (map.size >= maxEntries) {
    const first = map.keys().next().value;
    map.delete(first);
  }
  map.set(key, { at: Date.now(), value });
}

router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 24,
      category = "all",
      author,
      publisher,
      source,
      language,
      minPrice,
      maxPrice,
      available,
      search,
      sort = "featured",
      onSale,
    } = req.query;

    const cacheKey = JSON.stringify({
      page,
      limit,
      category,
      author,
      publisher,
      source,
      language,
      minPrice,
      maxPrice,
      available,
      search,
      sort,
      onSale,
    });
    const cached = getCached(listCache, cacheKey, LIST_CACHE_TTL);
    if (cached) {
      res.setHeader("X-Cache", "HIT");
      return res.json(cached);
    }

    const filter = {};
    if (author) filter.author = new RegExp(escapeRegex(author), "i");
    if (publisher) filter.publisher = new RegExp(escapeRegex(publisher), "i");
    if (source) filter.source = source;
    if (language) filter.bookLanguage = new RegExp(escapeRegex(language), "i");
    if (available === "true") filter.available = true;
    if (onSale === "true") filter.onSale = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const mongoFilter = mergeFilters(
      mergeFilters(filter, buildSearchQuery(search)),
      buildCategoryQuery(category)
    );

    const sortMap = {
      featured: null, // custom priority sort below
      relevance: null,
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      "title-asc": { title: 1 },
      "title-desc": { title: -1 },
      newest: { createdAt: -1 },
    };

    const pageNum = Math.max(1, Number(page));
    const pageSize = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * pageSize;
    const useFeatured = !sort || sort === "featured" || !sortMap[sort];
    const hasSearch = Boolean(String(search || "").trim());

    // Intelligent ranked search when user typed a query
    if (hasSearch && (useFeatured || sort === "relevance")) {
      const result = await searchProducts(String(search).trim(), {
        page: pageNum,
        limit: pageSize,
        sort: "relevance",
        extraFilter: mergeFilters(filter, buildCategoryQuery(category)),
      });
      const payload = {
        items: result.items,
        total: result.total,
        page: result.page,
        pages: result.pages,
        limit: result.limit,
        highlightTerms: result.highlightTerms || [],
        engine: result.engine,
      };
      if (!result.items.length) {
        try {
          const { getNoResultSuggestions } = await import("../services/searchService.js");
          payload.empty = await getNoResultSuggestions(String(search).trim());
        } catch {
          /* optional */
        }
      }
      setCached(listCache, cacheKey, payload);
      res.setHeader("X-Cache", "MISS");
      return res.json(payload);
    }

    let items;
    const total = await Product.countDocuments(mongoFilter).maxTimeMS(8000);

    if (useFeatured) {
      // Default open order: Islamic Publications → Tarjuman (Idara) → others
      const rows = await Product.aggregate([
        { $match: mongoFilter },
        {
          $addFields: {
            _src: { $toLower: { $ifNull: ["$source", ""] } },
            _pub: { $toLower: { $ifNull: ["$publisher", ""] } },
          },
        },
        {
          $addFields: {
            sourceRank: {
              $switch: {
                branches: [
                  {
                    case: {
                      $or: [
                        { $regexMatch: { input: "$_src", regex: "islamic\\s*publications" } },
                        { $regexMatch: { input: "$_pub", regex: "islamic\\s*publications" } },
                      ],
                    },
                    then: 1,
                  },
                  {
                    case: {
                      $or: [
                        { $regexMatch: { input: "$_src", regex: "idara\\s*publications" } },
                        { $regexMatch: { input: "$_pub", regex: "tarjuman" } },
                      ],
                    },
                    then: 2,
                  },
                ],
                default: 50,
              },
            },
          },
        },
        { $sort: { sourceRank: 1, onSale: -1, createdAt: -1, _id: 1 } },
        { $skip: skip },
        { $limit: pageSize },
        {
          $project: {
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
          },
        },
      ]).option({ maxTimeMS: 12000 });
      items = rows;
    } else {
      items = await Product.find(mongoFilter)
        .sort(sortMap[sort])
        .skip(skip)
        .limit(pageSize)
        .select(LIST_FIELDS)
        .maxTimeMS(8000)
        .lean();
    }

    const payload = {
      items,
      total,
      page: pageNum,
      pages: Math.ceil(total / pageSize) || 1,
      limit: pageSize,
    };
    setCached(listCache, cacheKey, payload);
    res.setHeader("X-Cache", "MISS");
    res.json(payload);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/filters", async (_req, res) => {
  try {
    if (filtersCache && Date.now() - filtersCacheAt < FILTERS_CACHE_TTL) {
      res.setHeader("X-Cache", "HIT");
      return res.json(filtersCache);
    }

    const [authors, languages, priceRange] = await Promise.all([
      Product.distinct("author").maxTimeMS(8000),
      Product.distinct("bookLanguage").maxTimeMS(8000),
      Product.aggregate([
        { $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } },
      ]).option({ maxTimeMS: 8000 }),
    ]);

    const payload = {
      authors: authors.filter(Boolean).sort(),
      publishers: [],
      sources: [],
      languages: languages.filter(Boolean).sort(),
      priceMin: priceRange[0]?.min || 0,
      priceMax: priceRange[0]?.max || 0,
      categories: [
        { id: "all", label: "All Books" },
        { id: "quran", label: "Quran / قرآن" },
        { id: "para", label: "Para / پارہ" },
        { id: "tarjuma", label: "Tarjuma / ترجمہ" },
        { id: "hadees", label: "Hadees / حدیث" },
        { id: "fiqa", label: "Fiqa / فقہ" },
        { id: "tarikh", label: "Tarikh / تاریخ" },
        { id: "tafseer", label: "Tafheem / Tafseer / تفہیم القرآن" },
        { id: "seerat", label: "Seerat / سیرت" },
        { id: "dars-e-nizami", label: "Dars e Nizami" },
      ],
    };
    filtersCache = payload;
    filtersCacheAt = Date.now();
    res.setHeader("X-Cache", "MISS");
    res.json(payload);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cacheKey = `id:${req.params.id}`;
    const cached = getCached(listCache, cacheKey, LIST_CACHE_TTL);
    if (cached) {
      res.setHeader("X-Cache", "HIT");
      return res.json(cached);
    }
    const { findProductByParam } = await import("../utils/productSlug.js");
    const product = await findProductByParam(Product, req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });
    setCached(listCache, cacheKey, product);
    if (product.slug) setCached(listCache, `id:${product.slug}`, product);
    if (product._id) setCached(listCache, `id:${product._id}`, product);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
