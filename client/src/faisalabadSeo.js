/**
 * Local SEO: Faisalabad / فیصل آباد / FSD + city areas
 */

import {
  FAISALABAD_AREAS,
  FAISALABAD_AREAS_FEATURED,
  faisalabadAreaKeywords,
  faisalabadAreasSeoBlurb,
  isFaisalabadAreaQuery,
} from "./faisalabadAreas";

export { FAISALABAD_AREAS, FAISALABAD_AREAS_FEATURED, faisalabadAreaKeywords, faisalabadAreasSeoBlurb, isFaisalabadAreaQuery };

export const FAISALABAD_SEO = {
  id: "faisalabad",
  en: "Faisalabad",
  ur: "فیصل آباد",
  short: "FSD",
  searchQuery: "Faisalabad",
  aliases: [
    "Faisalabad",
    "Fsd",
    "FSD",
    "Faisalabad Pakistan",
    "Faisalabad Punjab",
    "Lyallpur",
    "Islamic books Faisalabad",
    "Islamic bookstore Faisalabad",
    "Buy Islamic books Faisalabad",
    "Islamic books online Faisalabad",
    "Bookstore Faisalabad",
    "Book shop Faisalabad",
    "Chiniot Bazaar Faisalabad",
    "فیصل آباد",
    "فیصل اباد",
    "لائل پور",
    "اسلامی کتب فیصل آباد",
    "اسلامی کتب آن لائن فیصل آباد",
    "مکتبہ فیصل آباد",
    "کتابوں کی دکان فیصل آباد",
    "چنیوٹ بازار فیصل آباد",
    "جماعت اسلامی فیصل آباد",
    "مکتبہ جماعت اسلامی فیصل آباد",
    ...FAISALABAD_AREAS_FEATURED.slice(0, 40).flatMap((a) => [a.en, a.ur]),
  ],
};

export function faisalabadKeywords() {
  return [
    FAISALABAD_SEO.en,
    FAISALABAD_SEO.ur,
    FAISALABAD_SEO.short,
    ...FAISALABAD_SEO.aliases,
    ...faisalabadAreaKeywords().slice(0, 80),
    "Faisalabad Islamic books WhatsApp",
    "فیصل آباد اسلامی کتب واٹس ایپ",
    "Islamic books delivery Faisalabad areas",
    "فیصل آباد علاقوں میں اسلامی کتب",
  ];
}

export function faisalabadSeoBlurb() {
  return (
    "Islamic books online in Faisalabad (فیصل آباد / FSD) from Maktaba Jamaat e Islami — " +
    "گلی نمبر 8، چنیوٹ بازار، فیصل آباد۔ " +
    faisalabadAreasSeoBlurb()
  );
}

export function isFaisalabadQuery(search = "") {
  if (isFaisalabadAreaQuery(search)) return true;
  const s = String(search || "").toLowerCase();
  return (
    /faisalabad|\bfsd\b|chiniot\s*bazaar|lyallpur/.test(s) ||
    /فیصل\s*آباد|فیصل\s*اباد|چنیوٹ\s*بازار|لائل\s*پور/.test(search || "")
  );
}
