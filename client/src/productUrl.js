/**
 * Canonical product URL path — every book/item has its own unique URL.
 * Prefer SEO slug: /product/{slug}  (falls back to /product/{_id})
 */

export function productPath(product) {
  if (!product) return "/";
  const key = product.slug || product._id;
  return `/product/${key}`;
}

export function productAbsolutePath(product, siteUrl) {
  const path = productPath(product);
  if (!siteUrl) return path;
  return `${String(siteUrl).replace(/\/$/, "")}${path}`;
}
