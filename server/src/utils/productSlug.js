/**
 * SEO-friendly product URL slugs.
 * Every book/item gets a unique public path: /product/{slug}
 * Format: {latin-title}-{last8OfId} (id suffix guarantees uniqueness).
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

/** Canonical public path for a product — always unique per item. */
export function productPath(product) {
  if (!product) return "/";
  const key = product.slug || product._id;
  return `/product/${key}`;
}

async function writeSlug(Product, product, slug) {
  try {
    await Product.updateOne({ _id: product._id }, { $set: { slug } });
    return slug;
  } catch (err) {
    // Unique index collision — fall back to full ObjectId suffix
    const fallback = `book-${String(product._id)}`;
    await Product.updateOne({ _id: product._id }, { $set: { slug: fallback } });
    return fallback;
  }
}

export async function ensureProductSlug(Product, product) {
  if (!product) return product;
  if (product.slug) return product;
  const slug = await writeSlug(Product, product, buildProductSlug(product, product._id));
  return { ...product, slug };
}

/**
 * Ensure every item in a list payload has its own slug (for card links / SEO).
 * Mutates and returns the same array.
 */
export async function ensureListItemSlugs(Product, items = []) {
  if (!items.length) return items;
  const missing = items.filter((p) => p && p._id && !p.slug);
  if (!missing.length) return items;

  await Promise.all(
    missing.map(async (p) => {
      p.slug = await writeSlug(Product, p, buildProductSlug(p, p._id));
    })
  );
  return items;
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

/**
 * Assign a unique /product/{slug} URL to every book missing one.
 */
export async function backfillProductSlugs(Product, { limit = 10000 } = {}) {
  let updated = 0;
  let scanned = 0;

  while (scanned < limit) {
    const batchSize = Math.min(200, limit - scanned);
    const missing = await Product.find({
      $or: [{ slug: { $exists: false } }, { slug: "" }, { slug: null }],
    })
      .select("_id title titleEn author")
      .limit(batchSize)
      .lean();

    if (!missing.length) break;

    for (const p of missing) {
      await writeSlug(Product, p, buildProductSlug(p, p._id));
      updated += 1;
    }
    scanned += missing.length;
  }

  return { scanned, updated };
}
