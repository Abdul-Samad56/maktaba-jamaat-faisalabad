/**
 * High-priority topic keywords: Quran, Para, Tarjuma, Hadees, Fiqa, Tarikh
 * Used for SEO meta + on-page topic copy.
 */

export const TOPIC_SEO = {
  quran: {
    id: "quran",
    label: "Quran / قرآن",
    keys: [
      "Quran",
      "Quraan",
      "Holy Quran",
      "Quran Majeed",
      "قرآن",
      "قرآن مجید",
      "القرآن",
      "Quran buy Pakistan",
      "قرآن خریدیں",
      "Quran book online",
      "اسلامی قرآن کتب",
    ],
  },
  para: {
    id: "para",
    label: "Para / پارہ",
    keys: [
      "Para",
      "Sipara",
      "Siparah",
      "Juz",
      "Para Quran",
      "30 Para",
      "پارہ",
      "سیپارہ",
      "جزو",
      "پارہ قرآن",
      "تیس پارے",
      "Quran Para buy",
      "پارہ خریدیں",
    ],
  },
  tarjuma: {
    id: "tarjuma",
    label: "Tarjuma / ترجمہ",
    keys: [
      "Tarjuma",
      "Tarjama",
      "Translation",
      "Quran Translation",
      "Tarjuma Quran",
      "ترجمہ",
      "ترجمہ قرآن",
      "قرآن کا ترجمہ",
      "Urdu Tarjuma",
      "اردو ترجمہ",
      "Tarjuma book",
      "ترجمہ کتاب",
    ],
  },
  hadees: {
    id: "hadees",
    label: "Hadees / حدیث",
    keys: [
      "Hadees",
      "Hadith",
      "Ahadees",
      "Hadith books",
      "حدیث",
      "احادیث",
      "حديث",
      "Hadees books Pakistan",
      "حدیث کی کتابیں",
      "Bukhari",
      "بخاری",
      "Muslim Shareef",
      "مسلم شریف",
      "Mishkat",
      "مشکوٰۃ",
    ],
  },
  fiqa: {
    id: "fiqa",
    label: "Fiqa / فقہ",
    keys: [
      "Fiqa",
      "Fiqh",
      "Islamic Fiqh",
      "Fiqh books",
      "فقہ",
      "فقه",
      "فقہی کتب",
      "Fiqa books Pakistan",
      "فقہ خریدیں",
      "Hanafi Fiqh",
      "حنفی فقہ",
      "Masail",
      "مسائل",
    ],
  },
  tarikh: {
    id: "tarikh",
    label: "Tarikh / تاریخ",
    keys: [
      "Tarikh",
      "Tareekh",
      "Islamic History",
      "History books",
      "تاریخ",
      "اسلامی تاریخ",
      "Tarikh Islam",
      "تاریخ اسلام",
      "Islamic tarikh books",
      "تاریخی کتب",
      "تاریخ خریدیں",
    ],
  },
};

export function allTopicKeywords() {
  return Object.values(TOPIC_SEO).flatMap((t) => t.keys);
}

export function topicSeoBlurb() {
  return (
    "Shop Quran (قرآن), Para / Sipara (پارہ), Tarjuma (ترجمہ), Hadees (حدیث), Fiqa / Fiqh (فقہ) " +
    "and Tarikh (تاریخ) Islamic books online at Maktaba Jamaat e Islami Faisalabad."
  );
}
