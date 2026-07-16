/**
 * Text text normalization for Urdu + English.
 * Different Unicode forms of the same letter collapse to one shape.
 */

const DIACRITICS_RE = /[\u064B-\u065F\u0670\u0640]/g; // harakat + tatweel
const HONORIFICS_RE = /[\u0610-\u061A\u06D6-\u06ED\uFDFA\uFDFB]/g;

/** Normalize Urdu/Arabic letters to a single canonical form. */
export function normalizeUrdu(text) {
  return String(text || "")
    .normalize("NFKC")
    .replace(DIACRITICS_RE, "")
    .replace(HONORIFICS_RE, "")
    .replace(/[يىۍې]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[ةهۀھۀ]/g, "ہ")
    .replace(/ھ/g, "ہ")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ی")
    .replace(/ؓ|ؐ|ؑ|ؒ/g, "");
}

/**
 * Normalize English: lowercase, collapse hyphens/spaces, strip punctuation noise.
 * Maududi / maudoodi / Maw-dudi → comparable tokens.
 */
export function normalizeEnglish(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[-_–—]+/g, " ")
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Full search normalization (Urdu letter unify + English case/hyphen/space).
 */
export function normalizeSearch(text) {
  const urduFixed = normalizeUrdu(text);
  return normalizeEnglish(urduFixed);
}

/** Escape a string for safe use inside a RegExp. */
export function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Detect if text contains Urdu/Arabic script. */
export function hasUrdu(text) {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(
    String(text || "")
  );
}

/** Detect Latin letters. */
export function hasLatin(text) {
  return /[A-Za-z]/.test(String(text || ""));
}

/**
 * Tokenize a query into significant search tokens.
 * Keeps short Urdu prefixes (e.g. "مو", "تف") for partial search.
 */
export function tokenizeQuery(query) {
  const normalized = normalizeSearch(query);
  if (!normalized) return [];
  return normalized.split(/\s+/).filter((t) => t.length >= 1);
}
