/**
 * Personality SEO: Mian Muhammad Tufail / میاں محمد طفیل
 * (common misspellings: Fufail, Toofail…)
 */

export const MIAN_MUHAMMAD_TUFAIL = {
  id: "mian-muhammad-tufail",
  en: "Mian Muhammad Tufail",
  ur: "میاں محمد طفیل",
  searchQuery: "Mian Muhammad Tufail",
  aliases: [
    "Mian Muhammad Tufail",
    "Mian Mohammad Tufail",
    "Miyan Muhammad Tufail",
    "Mian Muhammed Tufail",
    "Mian Muhammad Fufail",
    "Mian Mohammad Fufail",
    "Mian Tufail",
    "Mian Muhammad Tufail Jamaat e Islami",
    "Mian Muhammad Tufail books",
    "Buy Mian Muhammad Tufail books",
    "میاں محمد طفیل",
    "میاں محمّد طفیل",
    "میاں محمد طفیل صاحب",
    "میاں محمد طفیل جماعت اسلامی",
    "میاں محمد طفیل کی کتابیں",
    "میاں محمد طفیل کی کتب",
    "میاں محمد طفیل آن لائن",
    "میاں محمد طفیل خریدیں",
    "طفیل محمد",
  ],
};

export function mianMuhammadTufailKeywords() {
  return [
    MIAN_MUHAMMAD_TUFAIL.en,
    MIAN_MUHAMMAD_TUFAIL.ur,
    ...MIAN_MUHAMMAD_TUFAIL.aliases,
    "Mian Muhammad Tufail books online",
    "میاں محمد طفیل کی کتابیں آن لائن",
  ];
}

export function mianMuhammadTufailSeoBlurb() {
  return (
    "Buy Mian Muhammad Tufail (میاں محمد طفیل) related Islamic books online from Maktaba Jamaat e Islami Faisalabad. " +
    "میاں محمد طفیل کی کتب آن لائن آرڈر کریں۔"
  );
}

export function isMianMuhammadTufailQuery(search = "") {
  const s = String(search || "").toLowerCase();
  return (
    /mian\s*(muhamm?ad|mohamm?ad|muhammed)?\s*(tufail|fufail|toofail)|miyan\s*muhammad\s*tufail/.test(
      s
    ) || /میاں\s*محمد\s*طفیل|میاں\s*محمّد\s*طفیل/.test(search || "")
  );
}
