/**
 * Local SEO: Mansoora Lahore / منصورہ لاہور
 * (Jamaat-e-Islami Markaz / Mansoorah)
 */

export const MANSOORA_LAHORE = {
  id: "mansoora-lahore",
  en: "Mansoora Lahore",
  ur: "منصورہ لاہور",
  searchQuery: "Mansoora Lahore",
  aliases: [
    "Mansoora Lahore",
    "Mansoorah Lahore",
    "Mansura Lahore",
    "Mansoorah",
    "Mansoora",
    "Mansura",
    "Mansoora Markaz Lahore",
    "Mansoorah Markaz",
    "Jamaat e Islami Mansoora",
    "Jamaat e Islami Mansoorah Lahore",
    "Islamic books Mansoora Lahore",
    "Buy Islamic books Mansoora Lahore",
    "منصورہ لاہور",
    "منصورہ",
    "منصورہ لاہور جماعت اسلامی",
    "جماعت اسلامی منصورہ لاہور",
    "مرکز منصورہ لاہور",
    "اسلامی کتب منصورہ لاہور",
    "اسلامی کتب آن لائن منصورہ",
    "مکتبہ منصورہ لاہور",
  ],
};

export function mansooraLahoreKeywords() {
  return [
    MANSOORA_LAHORE.en,
    MANSOORA_LAHORE.ur,
    ...MANSOORA_LAHORE.aliases,
    "Mansoora Lahore Islamic books",
    "منصورہ لاہور اسلامی کتب",
  ];
}

export function mansooraLahoreSeoBlurb() {
  return (
    "Islamic books related to Mansoora Lahore (منصورہ لاہور / Mansoorah) — " +
    "order online from Maktaba Jamaat e Islami Faisalabad. منصورہ لاہور سے وابستہ کتب آن لائن آرڈر کریں۔"
  );
}

export function isMansooraLahoreQuery(search = "") {
  const s = String(search || "").toLowerCase();
  return (
    /mansoo?ra[h]?(\s*lahore)?|mansura(\s*lahore)?/.test(s) ||
    /منصورہ(\s*لاہور)?|منصوره/.test(search || "")
  );
}
