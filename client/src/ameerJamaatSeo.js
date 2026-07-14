/**
 * Role SEO: Ameer Jamaat e Islami / امیر جماعت اسلامی
 */

export const AMEER_JAMAAT_E_ISLAMI = {
  id: "ameer-jamaat-e-islami",
  en: "Ameer Jamaat e Islami",
  ur: "امیر جماعت اسلامی",
  searchQuery: "Ameer Jamaat e Islami",
  aliases: [
    "Ameer Jamaat e Islami",
    "Ameer Jamaat-e-Islami",
    "Ameer of Jamaat e Islami",
    "Amir Jamaat e Islami",
    "Ameer JI",
    "Amir JI",
    "Ameer Jamaat e Islami Pakistan",
    "Ameer Jamaat e Islami books",
    "Buy Ameer Jamaat e Islami books",
    "امیر جماعت اسلامی",
    "امیرِ جماعت اسلامی",
    "امیر جماعتِ اسلامی",
    "جماعت اسلامی کے امیر",
    "امیر جماعت اسلامی پاکستان",
    "امیر جماعت اسلامی کی کتابیں",
    "امیر جماعت اسلامی کی کتب",
    "امیر جماعت اسلامی آن لائن",
    "امیر جماعت اسلامی خریدیں",
  ],
};

export function ameerJamaatKeywords() {
  return [
    AMEER_JAMAAT_E_ISLAMI.en,
    AMEER_JAMAAT_E_ISLAMI.ur,
    ...AMEER_JAMAAT_E_ISLAMI.aliases,
    "Ameer Jamaat e Islami books online",
    "امیر جماعت اسلامی کتب آن لائن",
  ];
}

export function ameerJamaatSeoBlurb() {
  return (
    "Buy Ameer Jamaat e Islami (امیر جماعت اسلامی) related Islamic books online from " +
    "Maktaba Jamaat e Islami Faisalabad. امیر جماعت اسلامی سے وابستہ کتب آن لائن آرڈر کریں۔"
  );
}

export function isAmeerJamaatQuery(search = "") {
  const s = String(search || "").toLowerCase();
  return (
    /amee?r\s*(of\s*)?jamaat[\s-]*e[\s-]*islami|amee?r\s*ji\b|amir\s*jamaat/.test(s) ||
    /امیر\s*جماعت\s*اسلامی|امیرِ\s*جماعت|جماعت\s*اسلامی\s*کے\s*امیر/.test(search || "")
  );
}
