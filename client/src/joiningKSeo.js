/**
 * Joining K data.xlsm SEO: joined/group name lists × 200 keywords each.
 */

import {
  JOINING_K_FEATURED,
  JOINING_K_KEYWORDS_PER_TERM,
  JOINING_K_TERM_COUNT,
  JOINING_K_TERMS,
} from "./joiningKSeoData";
import { expandRoadmapKeywords, roadmapKeywordsForMeta } from "./roadmapKeywordExpand";

export {
  JOINING_K_FEATURED,
  JOINING_K_KEYWORDS_PER_TERM,
  JOINING_K_TERM_COUNT,
  JOINING_K_TERMS,
};

const TERMS_LOWER = JOINING_K_TERMS.map((t) => String(t).toLowerCase());
const TERMS_SORTED = [...JOINING_K_TERMS].sort((a, b) => b.length - a.length);

/**
 * @param {string} search
 * @returns {string|null}
 */
export function matchJoiningKTerm(search = "") {
  const raw = String(search || "").trim();
  if (raw.length < 2) return null;
  const s = raw.toLowerCase();

  const exactIdx = TERMS_LOWER.indexOf(s);
  if (exactIdx >= 0) return JOINING_K_TERMS[exactIdx];

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

export function isJoiningKQuery(search = "") {
  return Boolean(matchJoiningKTerm(search));
}

export function joiningKKeywords(termOrSearch, limit = JOINING_K_KEYWORDS_PER_TERM) {
  const term = matchJoiningKTerm(termOrSearch) || String(termOrSearch || "").trim();
  if (!term) return [];
  return expandRoadmapKeywords(term, limit);
}

export function joiningKKeywordsForMeta(term, max = 40) {
  return roadmapKeywordsForMeta(term, max);
}

export function joiningKFeaturedKeywords(max = 60) {
  const out = [];
  for (const t of JOINING_K_FEATURED) {
    out.push(t, `${t} books`, `${t} کی کتابیں`);
    if (out.length >= max) break;
  }
  return out.slice(0, max);
}

export function joiningKSeoBlurb(term) {
  const t = term || "Faisalabad Islamic communities";
  return (
    `Buy books related to ${t} online from Maktaba Jamaat e Islami Faisalabad. ` +
    `${t} کی متعلقہ اسلامی کتب آن لائن آرڈر کریں۔ ` +
    `(Joining K: ${JOINING_K_TERM_COUNT}+ seeds × ${JOINING_K_KEYWORDS_PER_TERM} keywords.)`
  );
}
