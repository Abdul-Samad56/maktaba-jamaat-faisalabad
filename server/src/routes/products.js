import { Router } from "express";
import Product from "../models/Product.js";

const router = Router();

const CATEGORY_MAP = {
  quran: ["quran", "قرآن", "qaidah", "qaida", "tajweed", "sipara", "para", "surah"],
  tafseer: ["tafseer", "tafsir", "تفسیر", "tafheem"],
  hadith: ["hadith", "hadees", "ahadees", "حدیث", "bukhari", "muslim", "mishkat"],
  seerat: ["seerat", "seerah", "sirah", "سیرت", "biography", "prophet"],
  "dars-e-nizami": ["dars", "nizami", "fiqh", "فقہ"],
};

const LIST_FIELDS =
  "title author publisher source category price regularPrice onSale available localImage image";

function buildCategoryQuery(category) {
  if (!category || category === "all") return null;
  const keywords = CATEGORY_MAP[category.toLowerCase()] || [category];
  return {
    $or: keywords.flatMap((k) => [
      { category: { $regex: k, $options: "i" } },
      { title: { $regex: k, $options: "i" } },
      { description: { $regex: k, $options: "i" } },
      { tags: { $regex: k, $options: "i" } },
      { categories: { $regex: k, $options: "i" } },
    ]),
  };
}

function mergeFilters(base, extra) {
  if (!extra) return base;
  if (!Object.keys(base).length) return extra;
  return { $and: [base, extra] };
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
    } = req.query;

    const filter = {};
    if (author) filter.author = new RegExp(author, "i");
    if (publisher) filter.publisher = new RegExp(publisher, "i");
    if (source) filter.source = source;
    if (language) filter.bookLanguage = new RegExp(language, "i");
    if (available === "true") filter.available = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.$text = { $search: search };

    const mongoFilter = mergeFilters(filter, buildCategoryQuery(category));

    const sortMap = {
      featured: { onSale: -1, createdAt: -1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      "title-asc": { title: 1 },
      "title-desc": { title: -1 },
      newest: { createdAt: -1 },
    };

    const pageNum = Math.max(1, Number(page));
    const pageSize = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * pageSize;

    const [total, items] = await Promise.all([
      Product.countDocuments(mongoFilter),
      Product.find(mongoFilter)
        .sort(sortMap[sort] || sortMap.featured)
        .skip(skip)
        .limit(pageSize)
        .select(LIST_FIELDS)
        .lean(),
    ]);

    res.json({
      items,
      total,
      page: pageNum,
      pages: Math.ceil(total / pageSize) || 1,
      limit: pageSize,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/filters", async (_req, res) => {
  try {
    const [authors, publishers, sources, languages, priceRange] = await Promise.all([
      Product.distinct("author"),
      Product.distinct("publisher"),
      Product.distinct("source"),
      Product.distinct("bookLanguage"),
      Product.aggregate([
        { $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } },
      ]),
    ]);

    res.json({
      authors: authors.filter(Boolean).sort(),
      publishers: publishers.filter(Boolean).sort(),
      sources: sources.filter(Boolean).sort(),
      languages: languages.filter(Boolean).sort(),
      priceMin: priceRange[0]?.min || 0,
      priceMax: priceRange[0]?.max || 0,
      categories: [
        { id: "all", label: "All Books" },
        { id: "quran", label: "Quran" },
        { id: "tafseer", label: "Tafseer" },
        { id: "hadith", label: "Hadith" },
        { id: "seerat", label: "Seerat un Nabi" },
        { id: "dars-e-nizami", label: "Dars e Nizami" },
      ],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
