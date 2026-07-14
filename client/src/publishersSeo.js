/**
 * Publisher / institution SEO keywords.
 * Used so searches for these publishers can surface this store.
 * Names match catalog sources + common publisher labels.
 */

/** Priority publisher for ranking: Maktaba Islamia books sold at this store. */
export const MAKTABA_ISLAMIA = {
  id: "maktaba-islamia",
  en: "Maktaba Islamia",
  ur: "مکتبہ اسلامیہ",
  searchQuery: "Maktaba Islamia",
  aliases: [
    "Maktaba Islamia books",
    "Maktaba Islamia online",
    "Buy Maktaba Islamia books",
    "Maktaba Islamia Pakistan",
    "Maktaba Islamia Faisalabad",
    "Maktabah Islamia",
    "Maktaba-e-Islamia",
    "Maktaba e Islamia",
    "MaktabaIslamia",
    "مکتبہ اسلامیہ",
    "مکتبہ اسلامیہ کی کتابیں",
    "مکتبہ اسلامیہ آن لائن",
    "مکتبہ اسلامیہ خریدیں",
    "مکتبہ اسلامیہ پاکستان",
    "مکتبہ اسلامیہ فیصل آباد",
    "مکتبه اسلامیه",
  ],
};

export const PUBLISHER_SEO = [
  MAKTABA_ISLAMIA,
  {
    id: "islamic-publications",
    en: "Islamic Publications",
    ur: "اسلامک پبلیکیشنز",
    aliases: [
      "Islamic Publications Pakistan",
      "Islamic Publications books",
      "اسلامک پبلیکیشنز کی کتابیں",
      "Islamic Publications Faisalabad",
      "Islamic Publications online",
    ],
  },
  {
    id: "tarjuman",
    en: "Idara Tarjuman ul Quran",
    ur: "ادارہ ترجمان القرآن",
    searchQuery: "Tarjuman ul Quran",
    aliases: [
      "Tarjuman ul Quran",
      "Tarjumaan ul Quran",
      "Tarjumaan ul quran",
      "Tarjuman-ul-Quran",
      "Tarjaman ul Quran",
      "Idara Publications",
      "ترجمان القرآن",
      "ادارہ ترجمان القرآن",
      "ادارہ ترجمان القرآن کی کتابیں",
      "Tarjuman ul Quran books",
      "Idara Tarjuman ul Qur'an",
      "رسالہ ترجمان القرآن",
    ],
  },
  {
    id: "darussalam",
    en: "Darussalam",
    ur: "دارالسلام",
    aliases: [
      "Dar-us-Salam",
      "Darussalam Publishers",
      "Darussalam books",
      "دارالسلام کی کتابیں",
      "Darussalam Pakistan",
    ],
  },
  {
    id: "manshurat",
    en: "Manshurat",
    ur: "منشورات",
    aliases: ["Manshurat Islami", "منشورات اسلامی", "idara Manshurat Islami", "Manshurat books"],
  },
  {
    id: "nbf",
    en: "NBF",
    ur: "نیشنل بک فاؤنڈیشن",
    aliases: ["National Book Foundation", "NBF books", "NBF Pakistan", "نیشنل بک فاؤنڈیشن"],
  },
  {
    id: "tajquran",
    en: "Taj Company / Taj Quran",
    ur: "تاج کمپنی قرآن",
    aliases: ["TajQuran", "Taj Quran", "Taj Company books", "تاج قرآن"],
  },
  {
    id: "imt",
    en: "IMT Books",
    ur: "ادارہ مطبوعات طلبہ",
    aliases: [
      "IMTBooks",
      "Idara Matbout e Talaba",
      "Idara Matbuat e Talaba",
      "ادارہ مطبوعات طلبہ",
      "IMT Islamic books",
    ],
  },
  {
    id: "maktaba-ji",
    en: "Maktaba Jamaat e Islami Faisalabad",
    ur: "مکتبہ جماعت اسلامی فیصل آباد",
    searchQuery: "Maktaba Jamaat e Islami Faisalabad",
    aliases: [
      "Maktaba Jamaat e Islami",
      "مکتبہ جماعت اسلامی",
      "Maktaba JI Faisalabad",
      "Jamaat e Islami",
      "Jamaat-e-Islami",
      "Jamaat e Islami Pakistan",
      "Jamaat e Islami Faisalabad",
      "Jamaat e Islami bookstore Faisalabad",
      "JI Faisalabad",
      "جماعت اسلامی",
      "جماعت اسلامی فیصل آباد",
      "جماعت اسلامی فیصل آباد مکتبہ",
      "جماعت اسلامی پاکستان",
      "مکتبہ جماعت اسلامی فیصل آباد",
    ],
  },
];

/** Flat keyword list for meta tags (EN + UR + aliases). */
export function allPublisherKeywords() {
  const out = [];
  for (const p of PUBLISHER_SEO) {
    out.push(p.en, p.ur, ...p.aliases);
    out.push(`${p.en} books`, `${p.en} buy online`, `${p.ur} کتابیں`, `${p.ur} خریدیں`);
  }
  return out;
}

/** Strong keywords aimed at ranking for “Maktaba Islamia”. */
export function maktabaIslamiaKeywords() {
  return [
    MAKTABA_ISLAMIA.en,
    MAKTABA_ISLAMIA.ur,
    ...MAKTABA_ISLAMIA.aliases,
    "Maktaba Islamia books online",
    "Maktaba Islamia store Faisalabad",
    "order Maktaba Islamia books WhatsApp",
    "مکتبہ اسلامیہ واٹس ایپ آرڈر",
  ];
}

export function maktabaIslamiaSeoBlurb() {
  return (
    "Buy Maktaba Islamia (مکتبہ اسلامیہ) Islamic books online from Maktaba Jamaat e Islami Faisalabad. " +
    "مکتبہ اسلامیہ کی کتب فیصل آباد سے آن لائن آرڈر کریں۔"
  );
}

export function isMaktabaIslamiaQuery(search = "") {
  const s = String(search || "").toLowerCase();
  return /maktaba\s*islamia|maktabah\s*islamia|مکتبہ\s*اسلامیہ|مکتبه\s*اسلامیه/.test(s);
}

/** Short readable line for crawlable page copy. */
export function publishersSeoBlurb() {
  return (
    `${maktabaIslamiaSeoBlurb()} Also stocked: ` +
    PUBLISHER_SEO.filter((p) => p.id !== "maktaba-islamia")
      .map((p) => `${p.en} (${p.ur})`)
      .join(", ") +
    "."
  );
}

/** Map a product's source/publisher string to matching SEO terms. */
export function keywordsForPublisherFields(publisher = "", source = "") {
  const hay = `${publisher} ${source}`.toLowerCase();
  const hits = [];
  for (const p of PUBLISHER_SEO) {
    const needles = [p.en, p.ur, p.id, ...p.aliases].map((x) => x.toLowerCase());
    if (needles.some((n) => n && hay.includes(n.replace(/\s+/g, " ").slice(0, 18)))) {
      hits.push(p.en, p.ur, ...p.aliases.slice(0, 4));
    }
  }
  // Always include raw fields when present
  if (publisher) {
    hits.push(publisher, `${publisher} books`, `${publisher} کی کتابیں`);
  }
  if (source) {
    const clean = source.replace(/\s*Website$/i, "").trim();
    hits.push(clean, `${clean} books`, source);
  }
  return hits;
}
