/** Shared bilingual title helpers for client display. */

const URDU_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const LATIN_RE = /[A-Za-z]/;

export function hasUrdu(text) {
  return URDU_RE.test(String(text || ""));
}

export function hasLatin(text) {
  return LATIN_RE.test(String(text || ""));
}

export function titleEn(product) {
  if (!product) return "";
  if (product.titleEn) return product.titleEn;
  if (product.title && hasLatin(product.title) && !hasUrdu(product.title)) return product.title;
  return "";
}

export function titleUr(product) {
  if (!product) return "";
  if (product.titleUr) return product.titleUr;
  if (product.title && hasUrdu(product.title)) return product.title;
  return "";
}

/** Primary line for cards/headings: English preferred, else Urdu, else title. */
export function primaryTitle(product) {
  return titleEn(product) || titleUr(product) || product?.title || "";
}

/** Full bilingual label for WhatsApp / SEO. */
export function fullTitle(product) {
  const en = titleEn(product);
  const ur = titleUr(product);
  if (en && ur && en !== ur) return `${en} / ${ur}`;
  return en || ur || product?.title || "";
}
