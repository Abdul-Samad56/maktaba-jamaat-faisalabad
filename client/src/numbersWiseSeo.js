/**
 * NUMBERS Wise G.xlsm SEO: Facebook audience-bucket name lists × 200 keywords each.
 * Reuses expandRoadmapKeywords for consistent bookstore long-tails.
 */

import {
  NUMBERS_WISE_FEATURED,
  NUMBERS_WISE_KEYWORDS_PER_TERM,
  NUMBERS_WISE_TERM_COUNT,
  NUMBERS_WISE_TERMS,
} from "./numbersWiseSeoData";
import { expandRoadmapKeywords, roadmapKeywordsForMeta } from "./roadmapKeywordExpand";

export {
  NUMBERS_WISE_FEATURED,
  NUMBERS_WISE_KEYWORDS_PER_TERM,
  NUMBERS_WISE_TERM_COUNT,
  NUMBERS_WISE_TERMS,
};

const TERMS_LOWER = NUMBERS_WISE_TERMS.map((t) => String(t).toLowerCase());
const TERMS_SORTED = [...NUMBERS_WISE_TERMS].sort((a, b) => b.length - a.length);

/**
 * @param {string} search
 * @returns {string|null}
 */
export function matchNumbersWiseTerm(search = "") {
  const raw = String(search || "").trim();
  if (raw.length < 2) return null;
  const s = raw.toLowerCase();

  const exactIdx = TERMS_LOWER.indexOf(s);
  if (exactIdx >= 0) return NUMBERS_WISE_TERMS[exactIdx];

  for (const t of TERMS_SORTED) {
    if (t.length < 3) continue;
    const tl = t.toLowerCase();
    if (s.includes(tl) || tl.includes(s)) {
      if (s.length < 4 && tl.length > s.length + 2) continue;
      return t;
    }
  }
  return null;
}

export function isNumbersWiseQuery(search = "") {
  return Boolean(matchNumbersWiseTerm(search));
}

export function numbersWiseKeywords(termOrSearch, limit = NUMBERS_WISE_KEYWORDS_PER_TERM) {
  const term = matchNumbersWiseTerm(termOrSearch) || String(termOrSearch || "").trim();
  if (!term) return [];
  return expandRoadmapKeywords(term, limit);
}

export function numbersWiseKeywordsForMeta(term, max = 40) {
  return roadmapKeywordsForMeta(term, max);
}

export function numbersWiseFeaturedKeywords(max = 60) {
  const out = [];
  for (const t of NUMBERS_WISE_FEATURED) {
    out.push(t, `${t} books`, `${t} کی کتابیں`);
    if (out.length >= max) break;
  }
  return out.slice(0, max);
}

export function numbersWiseSeoBlurb(term) {
  const t = term || "popular Islamic topics";
  return (
    `Buy books related to ${t} online from Maktaba Jamaat e Islami Faisalabad. ` +
    `${t} کی متعلقہ اسلامی کتب آن لائن آرڈر کریں۔ ` +
    `(NUMBERS Wise: ${NUMBERS_WISE_TERM_COUNT}+ seeds × ${NUMBERS_WISE_KEYWORDS_PER_TERM} keywords.)`
  );
}
