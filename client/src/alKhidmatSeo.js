/**
 * Organization SEO: Al Khidmat Foundation / الخدمت فاؤنڈیشن
 * (common misspellings: FouDation, Khidmat Foundation…)
 */

export const AL_KHIDMAT_FOUNDATION = {
  id: "al-khidmat-foundation",
  en: "Al Khidmat Foundation",
  ur: "الخدمت فاؤنڈیشن",
  searchQuery: "Al Khidmat Foundation",
  aliases: [
    "Al Khidmat Foundation",
    "Al-Khidmat Foundation",
    "Alkhidmat Foundation",
    "Al Khidmat FouDation",
    "Al Khidmat Foudation",
    "Al Khidmat Foundaton",
    "Khidmat Foundation",
    "Al Khidmat",
    "Alkhidmat",
    "Al Khidmat Foundation Pakistan",
    "Al Khidmat Foundation books",
    "Buy Al Khidmat Foundation books",
    "الخدمت فاؤنڈیشن",
    "ال خدمت فاؤنڈیشن",
    "الخدمت فاونڈیشن",
    "الخدمت فاؤنڈیشن پاکستان",
    "الخدمت",
    "الخدمت فاؤنڈیشن کی کتابیں",
    "الخدمت فاؤنڈیشن کی کتب",
    "الخدمت فاؤنڈیشن آن لائن",
    "الخدمت فاؤنڈیشن خریدیں",
  ],
};

export function alKhidmatKeywords() {
  return [
    AL_KHIDMAT_FOUNDATION.en,
    AL_KHIDMAT_FOUNDATION.ur,
    ...AL_KHIDMAT_FOUNDATION.aliases,
    "Al Khidmat Foundation books online",
    "الخدمت فاؤنڈیشن کتب آن لائن",
  ];
}

export function alKhidmatSeoBlurb() {
  return (
    "Buy Al Khidmat Foundation (الخدمت فاؤنڈیشن) related Islamic books online from " +
    "Maktaba Jamaat e Islami Faisalabad. الخدمت فاؤنڈیشن سے وابستہ کتب آن لائن آرڈر کریں۔"
  );
}

export function isAlKhidmatQuery(search = "") {
  const s = String(search || "").toLowerCase();
  return (
    /al[\s-]*khidmat|alkhidmat|khidmat\s*fou[dn]d?ation|khidmat\s*foundation/.test(s) ||
    /الخدمت|ال\s*خدمت\s*فاؤنڈیشن|الخدمت\s*فاؤنڈیشن|الخدمت\s*فاونڈیشن/.test(search || "")
  );
}
