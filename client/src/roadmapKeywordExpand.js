/**
 * Expand any seed term into ~200 bookstore SEO keyword variants (EN + UR).
 * Keywords are generated programmatically — not stored as millions of strings.
 */

const EN_SUFFIXES = [
  "books",
  "book",
  "Islamic books",
  "books online",
  "book online",
  "buy books",
  "order books",
  "WhatsApp order",
  "Faisalabad",
  "FSD",
  "Pakistan",
  "Maktaba Jamaat e Islami",
  "Maktaba JI Faisalabad",
  "Islamic bookstore",
  "online bookstore",
  "delivery",
  "cheap books",
  "best books",
  "new books",
  "Urdu books",
  "Arabic books",
  "English books",
  "PDF",
  "hard copy",
  "publisher",
  "author",
  "biography",
  "speeches",
  "lectures",
  "quotes",
  "bayaan",
  "kitab",
  "kutub",
  "shop",
  "store",
  "near me",
  "price",
  "list",
  "collection",
  "series",
  "complete set",
  "gift",
  "students",
  "library",
  "madrasah",
  "masjid",
  "Jamaat e Islami",
  "Islami literature",
];

const EN_PREFIXES = [
  "Buy",
  "Order",
  "Online",
  "Best",
  "Cheap",
  "Download",
  "Read",
  "Shop",
  "Find",
  "Search",
  "Get",
  "Purchase",
];

const UR_SUFFIXES = [
  "کی کتابیں",
  "کی کتب",
  "کتاب",
  "کتب",
  "اسلامی کتب",
  "کتابیں آن لائن",
  "آن لائن آرڈر",
  "واٹس ایپ آرڈر",
  "فیصل آباد",
  "پاکستان",
  "مکتبہ جماعت اسلامی",
  "مکتبہ جماعت اسلامی فیصل آباد",
  "اسلامی بک اسٹور",
  "آن لائن بک اسٹور",
  "ڈیلیوری",
  "سستی کتابیں",
  "بہترین کتب",
  "اردو کتب",
  "عربی کتب",
  "انگریزی کتب",
  "قیمت",
  "لسٹ",
  "کلکشن",
  "مکمل سیٹ",
  "تحفہ",
  "طلبہ",
  "لائبریری",
  "مدرسہ",
  "مسجد",
  "جماعت اسلامی",
  "اسلامی لٹریچر",
  "بیان",
  "خطبات",
  "اقوال",
  "سوانح",
  "مصنف",
  "پبلیشر",
];

const UR_PREFIXES = [
  "خریدیں",
  "آرڈر کریں",
  "آن لائن",
  "بہترین",
  "سستا",
  "تلاش",
  "حاصل کریں",
];

const COMBO = [
  (t) => `${t} books Faisalabad`,
  (t) => `${t} Islamic books online`,
  (t) => `Buy ${t} books WhatsApp`,
  (t) => `${t} books Maktaba Jamaat e Islami Faisalabad`,
  (t) => `${t} کتب فیصل آباد`,
  (t) => `${t} کی کتابیں آن لائن آرڈر`,
  (t) => `${t} واٹس ایپ آرڈر مکتبہ جماعت اسلامی`,
  (t) => `${t} اسلامی کتب مکتبہ JI FSD`,
  (t) => `Order ${t} books Pakistan`,
  (t) => `${t} books near me Faisalabad`,
];

/**
 * @param {string} term
 * @param {number} [limit=200]
 * @returns {string[]}
 */
export function expandRoadmapKeywords(term, limit = 200) {
  const t = String(term || "").trim();
  if (!t) return [];

  const out = [];
  const seen = new Set();

  const push = (k) => {
    const s = String(k || "").trim();
    if (!s || s.length < 2) return;
    const key = s.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(s);
  };

  push(t);
  push(`${t} books`);
  push(`${t} کتاب`);
  push(`${t} کتب`);
  push(`${t} کی کتابیں`);
  push(`Buy ${t}`);
  push(`${t} online`);
  push(`${t} آن لائن`);

  for (const s of EN_SUFFIXES) push(`${t} ${s}`);
  for (const p of EN_PREFIXES) push(`${p} ${t}`);
  for (const p of EN_PREFIXES) push(`${p} ${t} books`);
  for (const s of UR_SUFFIXES) push(`${t} ${s}`);
  for (const p of UR_PREFIXES) push(`${p} ${t}`);
  for (const p of UR_PREFIXES) push(`${p} ${t} کی کتابیں`);
  for (const fn of COMBO) push(fn(t));

  // Extra long-tail fillers to reach ~200
  const fillers = [
    "in Faisalabad",
    "Pakistan delivery",
    "cash on delivery",
    "COD",
    "home delivery",
    "Chiniot Bazar",
    "گلی نمبر 8",
    "چنیوٹ بازار",
    "0321-5315603",
    "WhatsApp 0321-5315603",
    "Islamic Publications",
    "Idara Tarjuman ul Quran",
    "for students",
    "for library",
    "gift pack",
    "wholesale",
    "retail",
    "latest edition",
    "urdu edition",
    "english edition",
  ];
  for (const f of fillers) {
    push(`${t} ${f}`);
    if (out.length >= limit) break;
  }

  // If still short, numbered variants (rare)
  let i = 1;
  while (out.length < limit) {
    push(`${t} books online ${i}`);
    push(`${t} کی کتابیں ${i}`);
    i += 1;
    if (i > 50) break;
  }

  return out.slice(0, limit);
}

/** Meta-tag safe slice (search engines ignore huge keyword lists). */
export function roadmapKeywordsForMeta(term, max = 40) {
  return expandRoadmapKeywords(term, 200).slice(0, max);
}
