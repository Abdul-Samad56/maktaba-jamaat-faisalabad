/**
 * Local SEO: Faisalabad neighbourhoods / فیصل آباد کے علاقے و بلاکس
 * Data sourced from Block Codes.xlsx (2286+ areas)
 */

import { FAISALABAD_AREAS as ALL_AREAS } from "./faisalabadAreasData";

/** Full list from Block Codes workbook. */
export const FAISALABAD_AREAS = ALL_AREAS;

/** Priority localities for homepage links & meta (named areas first). */
export const FAISALABAD_AREAS_FEATURED = ALL_AREAS.filter(
  (a) => !/^chak\s/i.test(a.en)
).slice(0, 120);

/** Flat keyword list for meta / search (EN + UR) — capped for meta tags. */
export function faisalabadAreaKeywords(max = 120) {
  const out = [];
  for (const a of FAISALABAD_AREAS_FEATURED.slice(0, Math.ceil(max / 2))) {
    out.push(a.en, a.ur);
    out.push(`${a.en} Faisalabad`);
    out.push(`${a.ur} فیصل آباد`);
  }
  return out;
}

export function faisalabadAreasSeoBlurb() {
  return (
    `Islamic books delivery across ${FAISALABAD_AREAS.length}+ Faisalabad blocks & areas ` +
    "(Chiniot Bazar, Madina Town, People's Colony, Gulberg, D Ground, Susan Road, G.M. Abad, Kohinoor City, " +
    "Jaranwala Road, Sargodha Road, Canal Road, Clock Tower, Rail Bazar, Jhang Bazar and more). " +
    `فیصل آباد کے ${FAISALABAD_AREAS.length}+ علاقوں اور بلاکس میں اسلامی کتب — چنیوٹ بازار، مدینہ ٹاؤن، پیپلز کالونی، گلبرگ، ڈی گراؤنڈ۔`
  );
}

const AREA_EN_LOWER = FAISALABAD_AREAS.map((a) => a.en.toLowerCase());
const AREA_UR = FAISALABAD_AREAS.map((a) => a.ur).filter(Boolean);

export function isFaisalabadAreaQuery(search = "") {
  const s = String(search || "").toLowerCase().trim();
  if (!s || s.length < 3) return false;
  // Prefer exact / starts-with to avoid short false positives
  if (AREA_EN_LOWER.some((a) => a === s || a.startsWith(s) || (s.length >= 5 && a.includes(s)))) {
    return true;
  }
  const raw = String(search || "").trim();
  if (raw.length < 3) return false;
  return AREA_UR.some((a) => a && a.length >= 3 && (raw.includes(a) || a.includes(raw)));
}
