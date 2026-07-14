/**
 * Initiative SEO: Bano Qabil / بنو قابل
 * (Jamaat-e-Islami related; common spellings: Bano Qabil, Bano-e-Qabil…)
 */

export const BANO_QABIL = {
  id: "bano-qabil",
  en: "Bano Qabil",
  ur: "بنو قابل",
  searchQuery: "Bano Qabil",
  aliases: [
    "Bano Qabil",
    "Bano-e-Qabil",
    "Bano e Qabil",
    "BanoQabil",
    "Bano Qaabil",
    "Bano Kabil",
    "Banu Qabil",
    "Bano Qabil books",
    "Bano Qabil Jamaat e Islami",
    "Buy Bano Qabil books",
    "Bano Qabil online",
    "بنو قابل",
    "بنوِ قابل",
    "بنو قابل جماعت اسلامی",
    "بنو قابل کی کتابیں",
    "بنو قابل کی کتب",
    "بنو قابل آن لائن",
    "بنو قابل خریدیں",
    "پروگرام بنو قابل",
  ],
};

export function banoQabilKeywords() {
  return [
    BANO_QABIL.en,
    BANO_QABIL.ur,
    ...BANO_QABIL.aliases,
    "Bano Qabil books online",
    "بنو قابل کتب آن لائن",
  ];
}

export function banoQabilSeoBlurb() {
  return (
    "Buy Bano Qabil (بنو قابل) related Islamic books and materials online from " +
    "Maktaba Jamaat e Islami Faisalabad. بنو قابل سے وابستہ کتب آن لائن آرڈر کریں۔"
  );
}

export function isBanoQabilQuery(search = "") {
  const s = String(search || "").toLowerCase();
  return (
    /bano[\s-]*e?[\s-]*qa+bil|banu[\s-]*qa+bil|banoqabil/.test(s) ||
    /بنو\s*قابل|بنوِ\s*قابل/.test(search || "")
  );
}
