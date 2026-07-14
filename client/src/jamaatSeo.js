/**
 * SEO: Jamaat e Islami Faisalabad / جماعت اسلامی فیصل آباد
 * + brand: Maktaba Jamaat e Islami Faisalabad
 */

export const JAMAAT_E_ISLAMI_FAISALABAD = {
  id: "jamaat-e-islami-faisalabad",
  en: "Jamaat e Islami Faisalabad",
  ur: "جماعت اسلامی فیصل آباد",
  searchQuery: "Jamaat e Islami Faisalabad",
  aliases: [
    "Jamaat e Islami Faisalabad",
    "Jamaat-e-Islami Faisalabad",
    "Jamaate Islami Faisalabad",
    "JI Faisalabad",
    "JI FSD",
    "Jamaat e Islami FSD",
    "Jamaat Islami Faisalabad",
    "Jamaat e Islami office Faisalabad",
    "Jamaat e Islami Chiniot Bazaar",
    "دفتر جماعت اسلامی فیصل آباد",
    "جماعت اسلامی فیصل آباد",
    "جماعتِ اسلامی فیصل آباد",
    "جماعت اسلامی فیصل اباد",
    "جماعت اسلامی ایف ایس ڈی",
    "جماعت اسلامی چنیوٹ بازار",
    "جماعت اسلامی فیصل آباد مکتبہ",
    "جماعت اسلامی فیصل آباد کی کتابیں",
    "جماعت اسلامی فیصل آباد آن لائن",
  ],
};

export const MAKTABA_JI_FAISALABAD = {
  id: "maktaba-jamaat-e-islami-faisalabad",
  en: "Maktaba Jamaat e Islami Faisalabad",
  ur: "مکتبہ جماعت اسلامی فیصل آباد",
  searchQuery: "Maktaba Jamaat e Islami Faisalabad",
  aliases: [
    "Maktaba Jamaat e Islami Faisalabad",
    "Maktaba Jamaat-e-Islami Faisalabad",
    "Maktaba Jamaate Islami Faisalabad",
    "Maktaba Jamaat e Islami",
    "Maktaba JI Faisalabad",
    "Maktaba JI FSD",
    "Maktaba Jamaat Islami Faisalabad",
    "Jamaat e Islami Maktaba Faisalabad",
    "Islamic bookstore Faisalabad Jamaat e Islami",
    "Buy books Maktaba Jamaat e Islami Faisalabad",
    "مکتبہ جماعت اسلامی فیصل آباد",
    "مکتبہ جماعت اسلامی",
    "مکتبہ جماعتِ اسلامی فیصل آباد",
    "جماعت اسلامی فیصل آباد مکتبہ",
    "مکتبہ جماعت اسلامی آن لائن",
    "مکتبہ جماعت اسلامی کی کتابیں",
    "مکتبہ جماعت اسلامی خریدیں",
    "دفتر جماعت اسلامی فیصل آباد مکتبہ",
    "چنیوٹ بازار مکتبہ جماعت اسلامی",
  ],
};

/** Broader Jamaat e Islami terms (party + bookstore). */
export const JAMAAT_E_ISLAMI = {
  id: "jamaat-e-islami",
  en: "Jamaat e Islami",
  ur: "جماعت اسلامی",
  searchQuery: "Jamaat e Islami",
  aliases: [
    "Jamaat-e-Islami",
    "Jamaat-e-Islami Pakistan",
    "Jamaate Islami",
    "JI Pakistan",
    "Jamaat e Islami Pakistan",
    "Jamaat e Islami bookstore",
    "Jamaat e Islami books",
    "Buy Jamaat e Islami books",
    "جماعت اسلامی",
    "جماعتِ اسلامی",
    "جماعت اسلامی پاکستان",
    "جماعت اسلامی کی کتابیں",
    "جماعت اسلامی مکتبہ",
    "جماعت اسلامی آن لائن",
  ],
};

export function jamaatFaisalabadKeywords() {
  return [
    JAMAAT_E_ISLAMI_FAISALABAD.en,
    JAMAAT_E_ISLAMI_FAISALABAD.ur,
    ...JAMAAT_E_ISLAMI_FAISALABAD.aliases,
    "Jamaat e Islami Faisalabad books",
    "جماعت اسلامی فیصل آباد کتب",
    "Islamic books Jamaat e Islami Faisalabad",
  ];
}

export function maktabaJiKeywords() {
  return [
    MAKTABA_JI_FAISALABAD.en,
    MAKTABA_JI_FAISALABAD.ur,
    ...MAKTABA_JI_FAISALABAD.aliases,
    "Maktaba Jamaat e Islami Faisalabad online",
    "مکتبہ جماعت اسلامی فیصل آباد آن لائن",
    "order books WhatsApp Maktaba Jamaat e Islami",
    "مکتبہ جماعت اسلامی واٹس ایپ آرڈر",
  ];
}

export function jamaatKeywords() {
  return [
    ...jamaatFaisalabadKeywords(),
    ...maktabaJiKeywords(),
    JAMAAT_E_ISLAMI.en,
    JAMAAT_E_ISLAMI.ur,
    ...JAMAAT_E_ISLAMI.aliases,
    "Jamaat e Islami book store online",
    "جماعت اسلامی کتب آن لائن",
  ];
}

export function jamaatFaisalabadSeoBlurb() {
  return (
    "Jamaat e Islami Faisalabad (جماعت اسلامی فیصل آباد) — Islamic books from " +
    "دفتر جماعت اسلامی، چنیوٹ بازار، فیصل آباد via Maktaba Jamaat e Islami. " +
    "جماعت اسلامی فیصل آباد سے اسلامی کتب آن لائن آرڈر کریں۔"
  );
}

export function maktabaJiSeoBlurb() {
  return (
    "Maktaba Jamaat e Islami Faisalabad (مکتبہ جماعت اسلامی فیصل آباد) — " +
    "Islamic books online from چنیوٹ بازار، فیصل آباد. " +
    "مکتبہ جماعت اسلامی سے اسلامی کتب آن لائن آرڈر کریں۔"
  );
}

export function jamaatSeoBlurb() {
  return jamaatFaisalabadSeoBlurb();
}

export function isMaktabaJiQuery(search = "") {
  const s = String(search || "").toLowerCase();
  return (
    /maktaba\s*jamaat|maktaba\s*ji|مکتبہ\s*جماعت/.test(s) ||
    /مکتبہ جماعت اسلامی فیصل آباد/.test(search || "")
  );
}

export function isJamaatFaisalabadQuery(search = "") {
  if (isMaktabaJiQuery(search)) return false;
  const s = String(search || "").toLowerCase();
  return (
    /jamaat[\s-]*e[\s-]*islami[\s-]*(faisalabad|fsd)|jamaate\s*islami\s*(faisalabad|fsd)|\bji\b[\s-]*(faisalabad|fsd)/.test(
      s
    ) ||
    /جماعت\s*اسلامی\s*فیصل\s*آباد|جماعتِ\s*اسلامی\s*فیصل\s*آباد|جماعت\s*اسلامی\s*ایف\s*ایس\s*ڈی|دفتر\s*جماعت\s*اسلامی/.test(
      search || ""
    )
  );
}

export function isJamaatQuery(search = "") {
  if (isMaktabaJiQuery(search) || isJamaatFaisalabadQuery(search)) return true;
  const s = String(search || "").toLowerCase();
  return (
    /jamaat[\s-]*e[\s-]*islami|jamaate\s*islami|جماعت\s*اسلامی|جماعتِ\s*اسلامی/.test(s)
  );
}
