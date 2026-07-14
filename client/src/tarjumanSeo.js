/**
 * High-priority SEO: Tarjuman ul Quran / ترجمان القرآن
 * (Idara Tarjuman ul Quran; common spellings: Tarjumaan, Tarjaman…)
 */

export const TARJUMAN_UL_QURAN = {
  id: "tarjuman-ul-quran",
  en: "Tarjuman ul Quran",
  ur: "ترجمان القرآن",
  searchQuery: "Tarjuman ul Quran",
  aliases: [
    "Tarjuman ul Quran",
    "Tarjumaan ul Quran",
    "Tarjumaan ul quran",
    "Tarjuman-ul-Quran",
    "Tarjumanul Quran",
    "Tarjuman al Quran",
    "Tarjaman ul Quran",
    "Tarjuman Quran",
    "Idara Tarjuman ul Quran",
    "Idara Tarjumaan ul Quran",
    "Idara Tarjuman ul Qur'an",
    "Tarjuman ul Quran magazine",
    "Tarjuman ul Quran books",
    "Buy Tarjuman ul Quran",
    "Tarjuman ul Quran online",
    "Tarjuman ul Quran Pakistan",
    "Tarjuman ul Quran Faisalabad",
    "ترجمان القرآن",
    "ترجمان القرآن کی کتابیں",
    "ترجمان القرآن خریدیں",
    "ترجمان القرآن آن لائن",
    "ترجمان القرآن پاکستان",
    "ترجمان القرآن فیصل آباد",
    "ادارہ ترجمان القرآن",
    "ادارہ ترجمان القرآن کی کتابیں",
    "رسالہ ترجمان القرآن",
  ],
};

export function tarjumanKeywords() {
  return [
    TARJUMAN_UL_QURAN.en,
    TARJUMAN_UL_QURAN.ur,
    ...TARJUMAN_UL_QURAN.aliases,
    "Tarjumaan ul Quran books",
    "ترجمان القرآن میگزین",
  ];
}

export function tarjumanSeoBlurb() {
  return (
    "Buy Tarjuman ul Quran (ترجمان القرآن / Tarjumaan ul Quran) books and magazine issues online from " +
    "Maktaba Jamaat e Islami Faisalabad. ادارہ ترجمان القرآن کی کتب آن لائن آرڈر کریں۔"
  );
}

export function isTarjumanQuery(search = "") {
  const s = String(search || "").toLowerCase();
  return (
    /tarjumaa?n(\s*ul)?(\s*quran)?|tarjaman(\s*ul)?(\s*quran)?|idara\s*tarjumaa?n/.test(s) ||
    /ترجمان(\s*القرآن)?|ادارہ\s*ترجمان/.test(search || "")
  );
}
