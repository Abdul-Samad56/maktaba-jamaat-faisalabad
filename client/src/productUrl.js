/**
 * Canonical product URL path for SEO links.
 * Prefer slug when present: /product/{slug}
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
