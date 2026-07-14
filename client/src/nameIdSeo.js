/**
 * NAME ID.xlsm SEO: bilingual / person name lists × 200 keywords each.
 */

import {
  NAME_ID_FEATURED,
  NAME_ID_KEYWORDS_PER_TERM,
  NAME_ID_TERM_COUNT,
  NAME_ID_TERMS,
} from "./nameIdSeoData";
import { expandRoadmapKeywords, roadmapKeywordsForMeta } from "./roadmapKeywordExpand";

export {
  NAME_ID_FEATURED,
  NAME_ID_KEYWORDS_PER_TERM,
  NAME_ID_TERM_COUNT,
  NAME_ID_TERMS,
};

const TERMS_LOWER = NAME_ID_TERMS.map((t) => String(t).toLowerCase());
const TERMS_SORTED = [...NAME_ID_TERMS].sort((a, b) => b.length - a.length);

/**
 * @param {string} search
 * @returns {string|null}
 */
export function matchNameIdTerm(search = "") {
  const raw = String(search || "").trim();
  if (raw.length < 2) return null;
  const s = raw.toLowerCase();

  const exactIdx = TERMS_LOWER.indexOf(s);
  if (exactIdx >= 0) return NAME_ID_TERMS[exactIdx];

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

export function isNameIdQuery(search = "") {
  return Boolean(matchNameIdTerm(search));
}

export function nameIdKeywords(termOrSearch, limit = NAME_ID_KEYWORDS_PER_TERM) {
  const term = matchNameIdTerm(termOrSearch) || String(termOrSearch || "").trim();
  if (!term) return [];
  return expandRoadmapKeywords(term, limit);
}

export function nameIdKeywordsForMeta(term, max = 40) {
  return roadmapKeywordsForMeta(term, max);
}

export function nameIdFeaturedKeywords(max = 60) {
  const out = [];
  for (const t of NAME_ID_FEATURED) {
    out.push(t, `${t} books`, `${t} کی کتابیں`);
    if (out.length >= max) break;
  }
  return out.slice(0, max);
}

export function nameIdSeoBlurb(term) {
  const t = term || "popular Islamic names";
  return (
    `Buy books related to ${t} online from Maktaba Jamaat e Islami Faisalabad. ` +
    `${t} کی متعلقہ اسلامی کتب آن لائن آرڈر کریں۔ ` +
    `(NAME ID: ${NAME_ID_TERM_COUNT}+ seeds × ${NAME_ID_KEYWORDS_PER_TERM} keywords.)`
  );
}
