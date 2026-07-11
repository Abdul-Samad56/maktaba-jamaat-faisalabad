import { Router } from "express";
import Product from "../models/Product.js";
import { authAdmin, signAdminToken } from "../middleware/authAdmin.js";

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
  return {
    title: String(body.title || "").trim(),
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
    tags: parseTags(body.tags),
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

router.get("/products", authAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;
    const filter = {};
    if (search) filter.$text = { $search: search };

    const pageNum = Math.max(1, Number(page));
    const pageSize = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * pageSize;

    const [total, items] = await Promise.all([
      search ? Product.countDocuments(filter) : Product.countDocuments(filter),
      Product.find(filter)
        .sort(search ? { score: { $meta: "textScore" } } : { updatedAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
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

export default router;
