/**
 * SEO-friendly product URL slugs.
 * Format: {latin-title}-{last8OfId} for uniqueness.
 */

const URDU_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

export function isMongoObjectId(value) {
  return /^[a-fA-F0-9]{24}$/.test(String(value || ""));
}

export function slugifyAscii(text = "") {
  return String(text)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(URDU_RE, " ")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 70);
}

export function buildProductSlug(product, id = product?._id) {
  const idStr = String(id || "");
  const suffix = idStr.slice(-8) || "book";
  const base =
    slugifyAscii(product?.titleEn) ||
    slugifyAscii(product?.title) ||
    slugifyAscii(product?.author) ||
    "islamic-book";
  return `${base || "islamic-book"}-${suffix}`;
}

/** Canonical public path for a product. */
export function productPath(product) {
  if (!product) return "/";
  const key = product.slug || product._id;
  return `/product/${key}`;
}

export async function ensureProductSlug(Product, product) {
  if (!product) return product;
  if (product.slug) return product;
  const slug = buildProductSlug(product, product._id);
  await Product.updateOne({ _id: product._id }, { $set: { slug } });
  return { ...product, slug };
}

export async function findProductByParam(Product, idOrSlug) {
  const key = String(idOrSlug || "").trim();
  if (!key) return null;

  let product = null;
  if (isMongoObjectId(key)) {
    product = await Product.findById(key).maxTimeMS(8000).lean();
  }
  if (!product) {
    product = await Product.findOne({ slug: key }).maxTimeMS(8000).lean();
  }
  if (!product) return null;
  return ensureProductSlug(Product, product);
}

export async function backfillProductSlugs(Product, { limit = 500 } = {}) {
  const missing = await Product.find({
    $or: [{ slug: { $exists: false } }, { slug: "" }, { slug: null }],
  })
    .select("_id title titleEn author")
    .limit(limit)
    .lean();

  let updated = 0;
  for (const p of missing) {
    const slug = buildProductSlug(p, p._id);
    await Product.updateOne({ _id: p._id }, { $set: { slug } });
    updated += 1;
  }
  return { scanned: missing.length, updated };
}
