/**
 * Personality SEO: Qazi Hussain Ahmad / قاضی حسین احمد
 */

export const QAZI_HUSSAIN_AHMAD = {
  id: "qazi-hussain-ahmad",
  en: "Qazi Hussain Ahmad",
  ur: "قاضی حسین احمد",
  searchQuery: "Qazi Hussain Ahmad",
  aliases: [
    "Qazi Hussain Ahmad",
    "Qazi Hussain Ahmed",
    "Qazi Husain Ahmad",
    "Qazi Hussein Ahmad",
    "Qaazi Hussain Ahmad",
    "Qazi Hussain Ahmad Jamaat e Islami",
    "Qazi Hussain Ahmad books",
    "Buy Qazi Hussain Ahmad books",
    "قاضی حسین احمد",
    "قاضی حسین احمد صاحب",
    "قاضی حسین احمد جماعت اسلامی",
    "قاضی حسین احمد کی کتابیں",
    "قاضی حسین احمد کی کتب",
    "قاضی حسین احمد آن لائن",
    "قاضی حسین احمد خریدیں",
  ],
};

export function qaziHussainAhmadKeywords() {
  return [
    QAZI_HUSSAIN_AHMAD.en,
    QAZI_HUSSAIN_AHMAD.ur,
    ...QAZI_HUSSAIN_AHMAD.aliases,
    "Qazi Hussain Ahmad books online",
    "قاضی حسین احمد کی کتابیں آن لائن",
  ];
}

export function qaziHussainAhmadSeoBlurb() {
  return (
    "Buy Qazi Hussain Ahmad (قاضی حسین احمد) related Islamic books online from Maktaba Jamaat e Islami Faisalabad. " +
    "قاضی حسین احمد کی کتب آن لائن آرڈر کریں۔"
  );
}

export function isQaziHussainAhmadQuery(search = "") {
  const s = String(search || "").toLowerCase();
  return (
    /qazi\s*huss?e?i?n\s*ahm[ae]d|qaazi\s*hussain/.test(s) ||
    /قاضی\s*حسین\s*احمد/.test(search || "")
  );
}
