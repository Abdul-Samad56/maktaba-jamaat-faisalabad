/**
 * Core topic SEO: Islam / Islami / Islamic / Islamiat
 * اسلام / اسلامی / اسلامیات
 */

export const ISLAM_SEO = {
  id: "islam-islami-islamic",
  en: "Islam",
  ur: "اسلام",
  searchQuery: "Islam",
  aliases: [
    "Islam",
    "Islami",
    "Islamic",
    "Islamiat",
    "Islamiyat",
    "Islamic studies",
    "Islamiyat books",
    "Islamiat books",
    "Islamic books",
    "Islami books",
    "Buy Islamic books",
    "Buy Islamiat books",
    "Islamic literature",
    "اسلام",
    "اسلامی",
    "اسلامیات",
    "اسلام اور اسلامی",
    "اسلامی کتب",
    "اسلامیات کی کتابیں",
    "اسلامی تعلیم",
    "اسلامی مطالعات",
    "اسلام کی کتابیں",
    "اسلامی کتابیں",
    "اسلامیات خریدیں",
    "اسلامی آن لائن",
  ],
};

export function islamKeywords() {
  return [
    ISLAM_SEO.en,
    ISLAM_SEO.ur,
    "Islami",
    "Islamic",
    "Islamiat",
    "اسلامی",
    "اسلامیات",
    ...ISLAM_SEO.aliases,
    "Islam books online",
    "اسلامی کتب آن لائن",
  ];
}

export function islamSeoBlurb() {
  return (
    "Buy Islam, Islami, Islamic and Islamiat (اسلام، اسلامی، اسلامیات) books online from " +
    "Maktaba Jamaat e Islami Faisalabad. اسلام اور اسلامی کتب آن لائن آرڈر کریں۔"
  );
}

export function isIslamQuery(search = "") {
  const s = String(search || "").toLowerCase().trim();
  if (!s) return false;
  return (
    /\bislamiat\b|\bislamiyat\b|\bislami\b|\bislamic\b|\bislam\b/.test(s) ||
    /اسلامیات|اسلامی|اسلام/.test(search || "")
  );
}
