/**
 * Author & publisher URL helpers (mirrors server nameSlug).
 * /author/{slug}  ·  /publisher/{slug}
 */

const URDU_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

function slugifyAscii(text = "") {
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

function slugifyUrdu(text = "") {
  return String(text || "")
    .normalize("NFKC")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[يىۍې]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[ةهۀھ]/g, "ہ")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/[^\u0600-\u06FF\u0750-\u077Fa-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 70);
}

export function buildNameSlug(name) {
  return slugifyAscii(name) || slugifyUrdu(name) || "name";
}

export function authorPath(name, slug) {
  if (slug) return `/author/${slug}`;
  if (!name) return "/";
  return `/author/${buildNameSlug(name)}`;
}

export function publisherPath(name, slug) {
  if (slug) return `/publisher/${slug}`;
  if (!name) return "/";
  return `/publisher/${buildNameSlug(name)}`;
}

/** Prefer precomputed slug from API when available. */
export function authorHref(product) {
  if (!product?.author) return null;
  return authorPath(product.author, product.authorSlug);
}

export function publisherHref(product) {
  const name = product?.publisher || product?.source;
  if (!name) return null;
  return publisherPath(name, product.publisherSlug);
}
