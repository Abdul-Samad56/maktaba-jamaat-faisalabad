import { Router } from "express";
import Product from "../models/Product.js";
import { authAdmin, signAdminToken } from "../middleware/authAdmin.js";
import { applyBilingualFields, buildBilingualSearchQuery } from "../utils/bilingual.js";
import { buildProductSlug } from "../utils/productSlug.js";

const router = Router();

function parseTags(val) {
  if (Array.isArray(val)) return val.map(String);
  if (!val) return [];
  return String(val)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function productPayload(body) {
  const price = Number(body.price) || 0;
  const regularPrice = Number(body.regularPrice) || price;
  const tags = parseTags(body.tags);
  const keywords = parseTags(body.keywords);
  const bilingual = applyBilingualFields({
    title: String(body.title || body.titleEn || body.titleUr || "").trim(),
    titleEn: String(body.titleEn || "").trim(),
    titleUr: String(body.titleUr || "").trim(),
    author: String(body.author || "").trim(),
    tags,
    keywords,
    publisher: String(body.publisher || "").trim(),
    source: String(body.source || "").trim(),
    category: String(body.category || "General").trim(),
  });

  return {
    title: bilingual.title,
    titleEn: bilingual.titleEn,
    titleUr: bilingual.titleUr,
    searchIndex: bilingual.searchIndex,
    author: String(body.author || "").trim(),
    publisher: String(body.publisher || "").trim(),
    source: String(body.source || "").trim(),
    category: String(body.category || "General").trim(),
    categories: parseTags(body.categories),
    bookLanguage: String(body.bookLanguage || "").trim(),
    price,
    regularPrice,
    onSale: body.onSale === true || body.onSale === "true" || regularPrice > price,
    available: body.available !== false && body.available !== "false",
    sku: String(body.sku || "").trim(),
    isbn: String(body.isbn || "").trim(),
    pages: String(body.pages || "").trim(),
    description: String(body.description || "").trim(),
    image: String(body.image || "").trim(),
    localImage: String(body.localImage || "").trim(),
    productLink: String(body.productLink || "").trim(),
    tags,
    keywords,
  };
}

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  const adminUser = process.env.ADMIN_USERNAME || "admin";
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!adminPass) {
    return res.status(500).json({ error: "ADMIN_PASSWORD not set in server/.env" });
  }
  if (username !== adminUser || password !== adminPass) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  try {
    const token = signAdminToken(username);
    res.json({ token, username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/me", authAdmin, (req, res) => {
  res.json({ username: req.admin.username });
});

router.get("/stats", authAdmin, async (_req, res) => {
  try {
    const [total, available, onSale] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ available: true }),
      Product.countDocuments({ onSale: true }),
    ]);
    res.json({ total, available, onSale });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/filters", authAdmin, async (_req, res) => {
  try {
    const [authors, publishers, sources, languages, categories, priceRange] = await Promise.all([
      Product.distinct("author"),
      Product.distinct("publisher"),
      Product.distinct("source"),
      Product.distinct("bookLanguage"),
      Product.distinct("category"),
      Product.aggregate([
        { $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } },
      ]),
    ]);

    res.json({
      authors: authors.filter(Boolean).sort(),
      publishers: publishers.filter(Boolean).sort(),
      sources: sources.filter(Boolean).sort(),
      languages: languages.filter(Boolean).sort(),
      categories: categories.filter(Boolean).sort(),
      priceMin: priceRange[0]?.min || 0,
      priceMax: priceRange[0]?.max || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/products", authAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      author,
      publisher,
      source,
      language,
      category,
      minPrice,
      maxPrice,
      available,
      onSale,
    } = req.query;

    const filter = {};
    const term = String(search || "").trim();
    if (term) {
      Object.assign(filter, buildBilingualSearchQuery(term) || {});
    }
    if (author) filter.author = new RegExp(String(author).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    if (publisher) {
      filter.publisher = new RegExp(String(publisher).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    }
    if (source) filter.source = source;
    if (language) {
      filter.bookLanguage = new RegExp(String(language).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    }
    if (category) {
      filter.category = new RegExp(String(category).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    }
    if (available === "true") filter.available = true;
    if (available === "false") filter.available = false;
    if (onSale === "true") filter.onSale = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const pageNum = Math.max(1, Number(page));
    const pageSize = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * pageSize;

    const [total, items] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(pageSize).lean(),
    ]);

    res.json({
      items,
      total,
      page: pageNum,
      pages: Math.ceil(total / pageSize) || 1,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/products/:id", authAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/products", authAdmin, async (req, res) => {
  try {
    const data = productPayload(req.body);
    if (!data.title) return res.status(400).json({ error: "Title is required" });
    if (!data.source) return res.status(400).json({ error: "Source is required" });

    const product = await Product.create(data);
    if (!product.slug) {
      product.slug = buildProductSlug(product, product._id);
      await product.save();
    }
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/products/:id", authAdmin, async (req, res) => {
  try {
    const data = productPayload(req.body);
    if (!data.title) return res.status(400).json({ error: "Title is required" });
    if (!data.source) return res.status(400).json({ error: "Source is required" });

    const existing = await Product.findById(req.params.id).lean();
    if (!existing) return res.status(404).json({ error: "Not found" });

    data.slug = existing.slug || buildProductSlug({ ...existing, ...data }, existing._id);

    const product = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/products/:id", authAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id).lean();
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true, deleted: product._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** One-click: all books in stock + reduce discounts by 10 percentage points. */
router.post("/maintenance/stock-discount", authAdmin, async (_req, res) => {
  try {
    const { applyStockAndDiscountFix } = await import("../seed/stockDiscountFix.js");
    const result = await applyStockAndDiscountFix(Product);
    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** Backfill titleEn / titleUr / searchIndex for bilingual display + search. */
router.post("/maintenance/bilingual-titles", authAdmin, async (_req, res) => {
  try {
    const { applyBilingualTitlesFix } = await import("../seed/bilingualTitlesFix.js");
    const result = await applyBilingualTitlesFix(Product);
    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** Backfill unique SEO slugs for every book (/product/{slug}). */
router.post("/maintenance/product-slugs", authAdmin, async (_req, res) => {
  try {
    const { backfillProductSlugs } = await import("../utils/productSlug.js");
    const result = await backfillProductSlugs(Product, { limit: 50000 });
    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
