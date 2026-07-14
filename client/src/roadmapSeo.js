/**
 * Road Map workbook SEO: thousands of person/city/area seeds × 200 keywords each.
 */

import {
  ROADMAP_CITIES,
  ROADMAP_FEATURED,
  ROADMAP_KEYWORDS_PER_TERM,
  ROADMAP_TERM_COUNT,
  ROADMAP_TERMS,
} from "./roadmapSeoData";
import {
  expandRoadmapKeywords,
  roadmapKeywordsForMeta,
} from "./roadmapKeywordExpand";

export {
  ROADMAP_CITIES,
  ROADMAP_FEATURED,
  ROADMAP_KEYWORDS_PER_TERM,
  ROADMAP_TERM_COUNT,
  ROADMAP_TERMS,
  expandRoadmapKeywords,
  roadmapKeywordsForMeta,
};

const TERMS_LOWER = ROADMAP_TERMS.map((t) => String(t).toLowerCase());
const FEATURED_LOWER = new Set(ROADMAP_FEATURED.map((t) => String(t).toLowerCase()));

/** Longest-first match so "Hafiz Naeem" beats "Naeem". */
const TERMS_SORTED = [...ROADMAP_TERMS].sort((a, b) => b.length - a.length);

/**
 * Find best matching roadmap seed for a search query.
 * @param {string} search
 * @returns {string|null}
 */
export function matchRoadmapTerm(search = "") {
  const raw = String(search || "").trim();
  if (raw.length < 2) return null;
  const s = raw.toLowerCase();

  // Exact
  const exactIdx = TERMS_LOWER.indexOf(s);
  if (exactIdx >= 0) return ROADMAP_TERMS[exactIdx];

  // Contains (prefer longer terms)
  for (const t of TERMS_SORTED) {
    if (t.length < 3) continue;
    const tl = t.toLowerCase();
    if (s.includes(tl) || tl.includes(s)) {
      // Avoid matching very short queries against long lists incorrectly
      if (s.length < 4 && tl.length > s.length + 2) continue;
      return t;
    }
  }
  return null;
}

export function isRoadmapQuery(search = "") {
  return Boolean(matchRoadmapTerm(search));
}

/**
 * Up to 200 keywords for a matched (or explicit) term.
 */
export function roadmapKeywords(termOrSearch, limit = ROADMAP_KEYWORDS_PER_TERM) {
  const term = matchRoadmapTerm(termOrSearch) || String(termOrSearch || "").trim();
  if (!term) return [];
  return expandRoadmapKeywords(term, limit);
}

/** Flat featured keywords for default homepage meta (capped). */
export function roadmapFeaturedKeywords(max = 80) {
  const out = [];
  for (const t of ROADMAP_FEATURED) {
    out.push(t, `${t} books`, `${t} کی کتابیں`);
    if (out.length >= max) break;
  }
  return out.slice(0, max);
}

export function roadmapSeoBlurb(term) {
  const t = term || "Islamic personalities, cities & topics";
  return (
    `Buy books related to ${t} online from Maktaba Jamaat e Islami Faisalabad. ` +
    `${t} کی متعلقہ اسلامی کتب آن لائن آرڈر کریں — مکتبہ جماعت اسلامی فیصل آباد۔ ` +
    `(${ROADMAP_TERM_COUNT}+ search seeds × ${ROADMAP_KEYWORDS_PER_TERM} SEO keywords each.)`
  );
}

export function roadmapAreasCitiesBlurb() {
  return (
    `Islamic books for readers across ${ROADMAP_CITIES.length}+ Pakistani cities ` +
    `and thousands of search topics from our Road Map list. ` +
    `پاکستان کے ${ROADMAP_CITIES.length}+ شہروں اور مشہور شخصیات/موضوعات کے لیے اسلامی کتب۔`
  );
}

export function isFeaturedRoadmapTerm(term) {
  return FEATURED_LOWER.has(String(term || "").toLowerCase());
}
