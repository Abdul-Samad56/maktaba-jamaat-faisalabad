/**
 * Personality SEO: Senator Mushtaq Ahmad Khan / سینیٹر مشتاق احمد خان
 * (common misspellings: Senotor, Mushtak, Ahmed…)
 */

export const MUSHTAQ_AHMAD_KHAN = {
  id: "mushtaq-ahmad-khan",
  en: "Senator Mushtaq Ahmad Khan",
  ur: "سینیٹر مشتاق احمد خان",
  searchQuery: "Mushtaq Ahmad Khan",
  aliases: [
    "Mushtaq Ahmad Khan",
    "Mushtaq Ahmed Khan",
    "Senator Mushtaq Ahmad Khan",
    "Senator Mushtaq Ahmed Khan",
    "Senotor Mushtaq Ahmad Khan",
    "Senotor Mushtaq Ahmed Khan",
    "Mushtak Ahmad Khan",
    "Mushtak Ahmed Khan",
    "Mushtaq Ahmad",
    "Mushtaq Ahmed",
    "Senator Mushtaq",
    "Mushtaq Ahmad Khan Jamaat e Islami",
    "Mushtaq Ahmad Khan books",
    "Buy Mushtaq Ahmad Khan books",
    "سینیٹر مشتاق احمد خان",
    "مشتاق احمد خان",
    "سینیٹر مشتاق احمد",
    "مشتاق احمد خان سینیٹر",
    "مشتاق احمد خان جماعت اسلامی",
    "مشتاق احمد خان کی کتابیں",
    "مشتاق احمد خان کی کتب",
    "مشتاق احمد خان آن لائن",
    "مشتاق احمد خان خریدیں",
  ],
};

export function mushtaqAhmadKhanKeywords() {
  return [
    MUSHTAQ_AHMAD_KHAN.en,
    MUSHTAQ_AHMAD_KHAN.ur,
    ...MUSHTAQ_AHMAD_KHAN.aliases,
    "Mushtaq Ahmad Khan books online",
    "سینیٹر مشتاق احمد خان کی کتابیں آن لائن",
  ];
}

export function mushtaqAhmadKhanSeoBlurb() {
  return (
    "Buy Senator Mushtaq Ahmad Khan (سینیٹر مشتاق احمد خان) related Islamic books online from " +
    "Maktaba Jamaat e Islami Faisalabad. مشتاق احمد خان کی کتب آن لائن آرڈر کریں۔"
  );
}

export function isMushtaqAhmadKhanQuery(search = "") {
  const s = String(search || "").toLowerCase();
  return (
    /senat[oa]r\s*mushta[qk]|mushta[qk]\s*ahm[ae]d(\s*khan)?/.test(s) ||
    /سینیٹر\s*مشتاق|مشتاق\s*احمد\s*خان|مشتاق\s*احمد/.test(search || "")
  );
}
