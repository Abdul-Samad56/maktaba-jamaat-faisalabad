import { normalizeSearch as normalizeSearchCore } from "./normalize.js";
import { expandSynonyms } from "./synonyms.js";

/** Urdu/Arabic letter range */
const URDU_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const LATIN_RE = /[A-Za-z]/;

export function hasUrdu(text) {
  return URDU_RE.test(String(text || ""));
}

export function hasLatin(text) {
  return LATIN_RE.test(String(text || ""));
}

/** Normalize for reliable Urdu + English search matching. */
export function normalizeSearch(text) {
  return normalizeSearchCore(text);
}

/**
 * Split a single title that may contain both languages
 * e.g. "Tafheem ul Quran / تفہیم القرآن"
 */
export function splitBilingualTitle(title) {
  const raw = String(title || "").trim();
  if (!raw) return { titleEn: "", titleUr: "" };

  const parts = raw
    .split(/\s*(?:\/|\||｜|—|–)\s*/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    let titleEn = "";
    let titleUr = "";
    for (const part of parts) {
      const ur = hasUrdu(part);
      const la = hasLatin(part);
      if (ur && !la && !titleUr) titleUr = part;
      else if (la && !ur && !titleEn) titleEn = part;
      else if (ur && !titleUr) titleUr = part;
      else if (la && !titleEn) titleEn = part;
    }
    if (titleEn || titleUr) return { titleEn, titleUr };
  }

  if (hasUrdu(raw) && !hasLatin(raw)) return { titleEn: "", titleUr: raw };
  if (hasLatin(raw) && !hasUrdu(raw)) return { titleEn: raw, titleUr: "" };
  return { titleEn: raw, titleUr: hasUrdu(raw) ? raw : "" };
}

export function buildSearchIndex({
  title,
  titleEn,
  titleUr,
  author,
  tags,
  keywords,
  publisher,
  source,
  category,
} = {}) {
  const bits = [
    title,
    titleEn,
    titleUr,
    author,
    publisher,
    source,
    category,
    ...(Array.isArray(tags) ? tags : []),
    ...(Array.isArray(keywords) ? keywords : []),
  ]
    .filter(Boolean)
    .join(" ");
  return normalizeSearch(bits);
}

export function displayTitle(product) {
  if (!product) return "";
  const en = product.titleEn || "";
  const ur = product.titleUr || "";
  if (en && ur) return en;
  return en || ur || product.title || "";
}

export function displayTitleUr(product) {
  if (!product) return "";
  return product.titleUr || (hasUrdu(product.title) ? product.title : "") || "";
}

export function displayTitleEn(product) {
  if (!product) return "";
  return product.titleEn || (hasLatin(product.title) && !hasUrdu(product.title) ? product.title : "") || "";
}

/** Synonym dictionary lives in synonyms.js — expandSearchTerms re-exports it. */

function searchFieldClauses(term) {
  const a = escapeRegex(term);
  return [
    { searchIndex: { $regex: a, $options: "i" } },
    { title: { $regex: a, $options: "i" } },
    { titleEn: { $regex: a, $options: "i" } },
    { titleUr: { $regex: a, $options: "i" } },
    { author: { $regex: a, $options: "i" } },
    { publisher: { $regex: a, $options: "i" } },
    { source: { $regex: a, $options: "i" } },
    { category: { $regex: a, $options: "i" } },
    { keywords: { $regex: a, $options: "i" } },
    { tags: { $regex: a, $options: "i" } },
  ];
}

export function expandSearchTerms(query) {
  return expandSynonyms(query);
}

/**
 * Build Mongo query for bilingual search against searchIndex + title fields.
 */
export function buildBilingualSearchQuery(search) {
  const terms = expandSearchTerms(search);
  if (!terms.length) return null;

  // Prefer AND of significant tokens from the original query for precision
  const primaryTokens = normalizeSearch(search)
    .split(/\s+/)
    .filter((t) => t.length >= 2);

  if (primaryTokens.length >= 2) {
    return {
      $and: primaryTokens.map((token) => {
        const aliases = expandSearchTerms(token);
        return { $or: aliases.flatMap((a) => searchFieldClauses(a)) };
      }),
    };
  }

  // Single term / short query: match any expanded alias
  return {
    $or: terms.flatMap((a) => searchFieldClauses(a)),
  };
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function applyBilingualFields(doc) {
  const title = String(doc.title || "").trim();
  let titleEn = String(doc.titleEn || "").trim();
  let titleUr = String(doc.titleUr || "").trim();

  if (!titleEn && !titleUr && title) {
    const split = splitBilingualTitle(title);
    titleEn = split.titleEn;
    titleUr = split.titleUr;
  }

  // Keep legacy title filled for older clients / SEO
  const primary = titleEn || titleUr || title;
  const keywords = Array.isArray(doc.keywords) ? doc.keywords : [];
  const searchIndex = buildSearchIndex({
    title: primary,
    titleEn,
    titleUr,
    author: doc.author,
    tags: doc.tags,
    keywords,
    publisher: doc.publisher,
    source: doc.source,
    category: doc.category,
  });

  return {
    ...doc,
    title: primary,
    titleEn,
    titleUr,
    keywords,
    searchIndex,
  };
}
