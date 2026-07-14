/** Urdu/Arabic letter range */
const URDU_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const LATIN_RE = /[A-Za-z]/;

export function hasUrdu(text) {
  return URDU_RE.test(String(text || ""));
}

export function hasLatin(text) {
  return LATIN_RE.test(String(text || ""));
}

/** Normalize for reliable Urdu + English search matching. */
export function normalizeSearch(text) {
  return String(text || "")
    .normalize("NFKC")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/ةهۀھ/g, "ہ")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ی")
    .replace(/ؓ|ؐ|ؑ|ؒ/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Split a single title that may contain both languages
 * e.g. "Tafheem ul Quran / تفہیم القرآن"
 */
export function splitBilingualTitle(title) {
  const raw = String(title || "").trim();
  if (!raw) return { titleEn: "", titleUr: "" };

  const parts = raw
    .split(/\s*(?:\/|\||｜|—|–)\s*/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    let titleEn = "";
    let titleUr = "";
    for (const part of parts) {
      const ur = hasUrdu(part);
      const la = hasLatin(part);
      if (ur && !la && !titleUr) titleUr = part;
      else if (la && !ur && !titleEn) titleEn = part;
      else if (ur && !titleUr) titleUr = part;
      else if (la && !titleEn) titleEn = part;
    }
    if (titleEn || titleUr) return { titleEn, titleUr };
  }

  if (hasUrdu(raw) && !hasLatin(raw)) return { titleEn: "", titleUr: raw };
  if (hasLatin(raw) && !hasUrdu(raw)) return { titleEn: raw, titleUr: "" };
  return { titleEn: raw, titleUr: hasUrdu(raw) ? raw : "" };
}

export function buildSearchIndex({
  title,
  titleEn,
  titleUr,
  author,
  tags,
  publisher,
  source,
} = {}) {
  const bits = [
    title,
    titleEn,
    titleUr,
    author,
    publisher,
    source,
    ...(Array.isArray(tags) ? tags : []),
  ]
    .filter(Boolean)
    .join(" ");
  return normalizeSearch(bits);
}

export function displayTitle(product) {
  if (!product) return "";
  const en = product.titleEn || "";
  const ur = product.titleUr || "";
  if (en && ur) return en;
  return en || ur || product.title || "";
}

export function displayTitleUr(product) {
  if (!product) return "";
  return product.titleUr || (hasUrdu(product.title) ? product.title : "") || "";
}

export function displayTitleEn(product) {
  if (!product) return "";
  return product.titleEn || (hasLatin(product.title) && !hasUrdu(product.title) ? product.title : "") || "";
}

/** Common Islamic-book aliases so Urdu ↔ English search both work. */
const SEARCH_ALIASES = [
  ["quran", "quraan", "koran", "قرآن", "القرآن", "قرآن", "mushaf", "مصحف"],
  ["para", "sipara", "siparah", "juz", "پارہ", "سیپارہ", "جزو"],
  ["tarjuma", "tarjama", "translation", "ترجمہ", "ترجمه", "tarjuma quran"],
  ["tafseer", "tafsir", "تفسیر", "تفسير"],
  ["hadith", "hadees", "ahadees", "حدیث", "احادیث", "حديث"],
  ["fiqh", "fiqa", "فقہ", "فقه", "masail", "مسائل"],
  ["tarikh", "tareekh", "history", "تاریخ", "تاريخ"],
  ["seerat", "seerah", "sirah", "سیرت", "سيرة"],
  ["namaz", "salah", "salat", "نماز", "صلاة"],
  ["dua", "دعاء", "دعا"],
  ["bukhari", "بخاری"],
  ["muslim", "مسلم"],
  [
    "maktaba jamaat e islami faisalabad",
    "maktaba jamaat e islami",
    "maktaba jamaat-e-islami",
    "maktaba ji faisalabad",
    "maktaba ji fsd",
    "مکتبہ جماعت اسلامی فیصل آباد",
    "مکتبہ جماعت اسلامی",
    "مکتبہ جماعتِ اسلامی فیصل آباد",
  ],
  [
    "mushtaq ahmad khan",
    "mushtaq ahmed khan",
    "senator mushtaq ahmad khan",
    "senator mushtaq ahmed khan",
    "senotor mushtaq ahmad khan",
    "senotor mushtaq ahmed khan",
    "mushtak ahmad khan",
    "mushtaq ahmad",
    "سینیٹر مشتاق احمد خان",
    "مشتاق احمد خان",
    "سینیٹر مشتاق احمد",
  ],
  [
    "munawar hassan",
    "munawwar hassan",
    "munar hassan",
    "munawar hasan",
    "munawwar hasan",
    "syed munawar hassan",
    "syed munawwar hassan",
    "منور حسن",
    "سید منور حسن",
  ],
  [
    "mian muhammad tufail",
    "mian mohammad tufail",
    "miyan muhammad tufail",
    "mian muhammad fufail",
    "mian mohammad fufail",
    "mian tufail",
    "میاں محمد طفیل",
    "میاں محمّد طفیل",
  ],
  [
    "qazi hussain ahmad",
    "qazi hussain ahmed",
    "qazi husain ahmad",
    "qazi hussein ahmad",
    "qaazi hussain ahmad",
    "قاضی حسین احمد",
  ],
  [
    "siraj ul haq",
    "sirajul haq",
    "siraj-ul-haq",
    "siraj ul haque",
    "siraj-ul-haque",
    "سراج الحق",
    "سینیٹر سراج الحق",
  ],
  [
    "hafiz naeem",
    "hafez naeem",
    "hafiz naeem ur rehman",
    "hafiz naeem ur rahman",
    "hafiz naeem rehman",
    "حافظ نعیم",
    "حافظ نعیم الرحمٰن",
    "حافظ نعیم الرحمن",
    "حافظ نعیم الرحمان",
  ],
  [
    "maududi",
    "maudoodi",
    "mawdudi",
    "modudi",
    "maododi",
    "moududi",
    "maulana maududi",
    "molana maududi",
    "molana maododi",
    "abul ala maududi",
    "مودودی",
    "مولانا مودودی",
    "سید ابو الاعلی مودودی",
  ],
  [
    "mansoora lahore",
    "mansoorah lahore",
    "mansura lahore",
    "mansoorah",
    "mansoora",
    "mansura",
    "منصورہ لاہور",
    "منصورہ",
  ],
  [
    "faisalabad",
    "fsd",
    "فیصل آباد",
    "فیصل اباد",
    "lyallpur",
    "لائل پور",
    "chiniot bazaar",
    "چنیوٹ بازار",
    "islamic books faisalabad",
    "اسلامی کتب فیصل آباد",
    "madina town",
    "مدینہ ٹاؤن",
    "people's colony",
    "peoples colony",
    "پیپلز کالونی",
    "gulberg",
    "گلبرگ",
    "d ground",
    "ڈی گراؤنڈ",
    "susan road",
    "سوسن روڈ",
    "ghulam muhammad abad",
    "g.m. abad",
    "غلام محمد آباد",
    "kohinoor city",
    "کوہ نور سٹی",
    "jaranwala road",
    "جڑانوالہ روڈ",
    "sargodha road",
    "سرگودھا روڈ",
    "canal road",
    "کینال روڈ",
    "mansoorabad",
    "منصورآباد",
    "millat town",
    "ملت ٹاؤن",
    "batala colony",
    "بٹالہ کالونی",
    "clock tower",
    "گھنٹہ گھر",
  ],
  [
    "islam",
    "islami",
    "islamic",
    "islamiat",
    "islamiyat",
    "اسلام",
    "اسلامی",
    "اسلامیات",
  ],
  [
    "islamic books",
    "islamic book",
    "islamic books online",
    "buy islamic books",
    "اسلامی کتب",
    "اسلامی کتاب",
    "اسلامی کتب آن لائن",
    "آن لائن اسلامی کتب",
  ],
  [
    "ameer jamaat e islami",
    "ameer jamaat-e-islami",
    "amir jamaat e islami",
    "ameer of jamaat e islami",
    "ameer ji",
    "amir ji",
    "امیر جماعت اسلامی",
    "امیرِ جماعت اسلامی",
    "امیر جماعتِ اسلامی",
  ],
  [
    "al khidmat foundation",
    "al-khidmat foundation",
    "alkhidmat foundation",
    "al khidmat foudation",
    "al khidmat foundaton",
    "khidmat foundation",
    "al khidmat",
    "alkhidmat",
    "الخدمت فاؤنڈیشن",
    "ال خدمت فاؤنڈیشن",
    "الخدمت فاونڈیشن",
    "الخدمت",
  ],
  [
    "bano qabil",
    "bano-e-qabil",
    "bano e qabil",
    "banoqabil",
    "bano qaabil",
    "bano kabil",
    "banu qabil",
    "بنو قابل",
    "بنوِ قابل",
  ],
  [
    "tarjuman ul quran",
    "tarjumaan ul quran",
    "tarjuman-ul-quran",
    "tarjaman ul quran",
    "tarjumanul quran",
    "idara tarjuman ul quran",
    "idara tarjumaan ul quran",
    "ترجمان القرآن",
    "ادارہ ترجمان القرآن",
    "رسالہ ترجمان القرآن",
  ],
  ["tafheem", "tafhim", "tafheem ul quran", "tafheem-ul-quran", "tafhim ul quran", "تفہیم", "تفهيم", "تفہیم القرآن", "تفهيم القرآن"],
  [
    "jamaat e islami faisalabad",
    "jamaat-e-islami faisalabad",
    "jamaate islami faisalabad",
    "ji faisalabad",
    "ji fsd",
    "jamaat e islami fsd",
    "جماعت اسلامی فیصل آباد",
    "جماعتِ اسلامی فیصل آباد",
    "دفتر جماعت اسلامی فیصل آباد",
  ],
  [
    "jamaat e islami",
    "jamaat-e-islami",
    "jamaate islami",
    "maktaba jamaat e islami",
    "جماعت اسلامی",
    "جماعتِ اسلامی",
    "مکتبہ جماعت اسلامی",
  ],
  [
    "maktaba islamia",
    "maktabah islamia",
    "maktaba-e-islamia",
    "maktaba e islamia",
    "مکتبہ اسلامیہ",
    "مکتبه اسلامیه",
  ],
  [
    "tariq jameel",
    "tariq jamil",
    "molana tariq jameel",
    "maulana tariq jameel",
    "طارق جمیل",
    "مولانا طارق جمیل",
  ],
  [
    "taqi usmani",
    "mufti taqi usmani",
    "taqi usmani books",
    "مفتی تقی عثمانی",
    "تقی عثمانی",
  ],
  [
    "israr ahmad",
    "dr israr ahmad",
    "doctor israr ahmad",
    "ڈاکٹر اسرار احمد",
    "اسرار احمد",
  ],
  [
    "tariq masood",
    "mufti tariq masood",
    "مفتی طارق مسعود",
    "طارق مسعود",
  ],
  [
    "zakir naik",
    "dr zakir naik",
    "dr. zakir naik",
    "doctor zakir naik",
    "ڈاکٹر ذاکر نائیک",
    "ذاکر نائیک",
  ],
  [
    "makkah madina",
    "makkah madinah",
    "mecca medina",
    "مکہ مدینہ",
    "مکہ مکرمہ",
    "مدینہ منورہ",
  ],
];

function searchFieldClauses(term) {
  const a = escapeRegex(term);
  return [
    { searchIndex: { $regex: a, $options: "i" } },
    { title: { $regex: a, $options: "i" } },
    { titleEn: { $regex: a, $options: "i" } },
    { titleUr: { $regex: a, $options: "i" } },
    { author: { $regex: a, $options: "i" } },
    { publisher: { $regex: a, $options: "i" } },
    { source: { $regex: a, $options: "i" } },
  ];
}

export function expandSearchTerms(query) {
  const raw = String(query || "").trim();
  if (!raw) return [];

  const normalized = normalizeSearch(raw);
  const tokens = normalized.split(/\s+/).filter(Boolean);
  const terms = new Set();

  // Full phrase
  terms.add(normalized);
  // Individual tokens
  tokens.forEach((t) => terms.add(t));

  // Alias expansion (phrase + tokens)
  const candidates = [normalized, raw, ...tokens];
  for (const c of candidates) {
    const n = normalizeSearch(c);
    for (const group of SEARCH_ALIASES) {
      const hit = group.some((a) => normalizeSearch(a) === n || n.includes(normalizeSearch(a)));
      if (hit) group.forEach((a) => terms.add(normalizeSearch(a)));
    }
  }

  return [...terms].filter((t) => t.length >= 1);
}

/**
 * Build Mongo query for bilingual search against searchIndex + title fields.
 */
export function buildBilingualSearchQuery(search) {
  const terms = expandSearchTerms(search);
  if (!terms.length) return null;

  // Prefer AND of significant tokens from the original query for precision
  const primaryTokens = normalizeSearch(search)
    .split(/\s+/)
    .filter((t) => t.length >= 2);

  if (primaryTokens.length >= 2) {
    return {
      $and: primaryTokens.map((token) => {
        const aliases = expandSearchTerms(token);
        return { $or: aliases.flatMap((a) => searchFieldClauses(a)) };
      }),
    };
  }

  // Single term / short query: match any expanded alias
  return {
    $or: terms.flatMap((a) => searchFieldClauses(a)),
  };
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function applyBilingualFields(doc) {
  const title = String(doc.title || "").trim();
  let titleEn = String(doc.titleEn || "").trim();
  let titleUr = String(doc.titleUr || "").trim();

  if (!titleEn && !titleUr && title) {
    const split = splitBilingualTitle(title);
    titleEn = split.titleEn;
    titleUr = split.titleUr;
  }

  // Keep legacy title filled for older clients / SEO
  const primary = titleEn || titleUr || title;
  const searchIndex = buildSearchIndex({
    title: primary,
    titleEn,
    titleUr,
    author: doc.author,
    tags: doc.tags,
    publisher: doc.publisher,
    source: doc.source,
  });

  return {
    ...doc,
    title: primary,
    titleEn,
    titleUr,
    searchIndex,
  };
}
