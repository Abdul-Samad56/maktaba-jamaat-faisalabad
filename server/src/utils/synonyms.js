/**
 * Synonym / alias dictionary for Islamic book search.
 * Searching any form returns the same books.
 */
import { normalizeSearch } from "./normalize.js";

/** Curated synonym groups — each array is one concept. */
export const SYNONYM_GROUPS = [
  [
    "قرآن",
    "قران",
    "القرآن",
    "قرآن",
    "quran",
    "quraan",
    "koran",
    "holy quran",
    "mushaf",
    "مصحف",
  ],
  ["para", "sipara", "siparah", "juz", "پارہ", "سیپارہ", "جزو"],
  ["tarjuma", "tarjama", "translation", "ترجمہ", "ترجمه", "tarjuma quran"],
  ["tafseer", "tafsir", "تفسیر", "تفسير"],
  [
    "tafheem",
    "tafhim",
    "tafheem ul quran",
    "tafheem-ul-quran",
    "tafhim ul quran",
    "تفہیم",
    "تفهيم",
    "تفہیم القرآن",
    "تفهيم القرآن",
  ],
  ["hadith", "hadees", "ahadees", "حدیث", "احادیث", "حديث"],
  ["fiqh", "fiqa", "فقہ", "فقه", "masail", "مسائل"],
  ["tarikh", "tareekh", "history", "تاریخ", "تاريخ"],
  ["seerat", "seerah", "sirah", "سیرت", "سيرة"],
  ["namaz", "salah", "salat", "نماز", "صلاة"],
  ["dua", "دعاء", "دعا"],
  ["bukhari", "بخاری"],
  ["muslim", "مسلم"],
  [
    "مودودی",
    "مودوی",
    "مولانا مودودی",
    "سید ابو الاعلی مودودی",
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
  ],
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

/** Default popular searches shown when the box is empty / focused. */
export const POPULAR_SEARCHES = [
  "قرآن",
  "تفسیر",
  "حدیث",
  "مولانا مودودی",
  "سیرت",
  "تفہیم القرآن",
  "فقہ",
  "نماز",
];

/** Lookup: normalized term → full synonym group (normalized). */
const synonymIndex = new Map();

function rebuildIndex() {
  synonymIndex.clear();
  for (const group of SYNONYM_GROUPS) {
    const normalizedGroup = [...new Set(group.map((g) => normalizeSearch(g)).filter(Boolean))];
    for (const term of normalizedGroup) {
      const existing = synonymIndex.get(term) || [];
      synonymIndex.set(term, [...new Set([...existing, ...normalizedGroup])]);
    }
  }
}

rebuildIndex();

/**
 * Expand a query into all synonym variants (normalized).
 * Also keeps original tokens for partial matching.
 * Typo-tolerant: edit distance ≤ 2 against synonym keys (e.g. Qran → Quran).
 */
export function expandSynonyms(query) {
  const raw = String(query || "").trim();
  if (!raw) return [];

  const normalized = normalizeSearch(raw);
  const tokens = normalized.split(/\s+/).filter(Boolean);
  const terms = new Set([normalized, ...tokens]);

  const candidates = [normalized, raw, ...tokens];
  for (const c of candidates) {
    const n = normalizeSearch(c);
    if (!n) continue;

    // Exact synonym hit
    const exact = synonymIndex.get(n);
    if (exact) exact.forEach((t) => terms.add(t));

    // Partial / contains / fuzzy hit (e.g. "مودو" / "qran" → Quran group)
    for (const [key, group] of synonymIndex) {
      if (key.includes(n) || n.includes(key)) {
        group.forEach((t) => terms.add(t));
        continue;
      }
      if (n.length >= 3 && key.length >= 3 && Math.abs(n.length - key.length) <= 2) {
        if (levenshteinLite(n, key) <= (n.length <= 4 ? 1 : 2)) {
          group.forEach((t) => terms.add(t));
        }
      }
    }
  }

  return [...terms].filter((t) => t.length >= 1);
}

/**
 * Find the best synonym group for spelling suggestions.
 * Returns display forms (original dictionary strings), not only normalized.
 */
export function suggestSpellings(query, limit = 5) {
  const n = normalizeSearch(query);
  if (!n || n.length < 2) return [];

  const suggestions = [];
  for (const group of SYNONYM_GROUPS) {
    const hit = group.some((a) => {
      const na = normalizeSearch(a);
      return na === n || na.includes(n) || n.includes(na) || levenshteinLite(n, na) <= 2;
    });
    if (hit) {
      for (const label of group) {
        if (!suggestions.includes(label)) suggestions.push(label);
        if (suggestions.length >= limit) return suggestions;
      }
    }
  }
  return suggestions;
}

/** Tiny Levenshtein for synonym suggestion only (avoids circular import with fuzzy.js). */
function levenshteinLite(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  if (Math.abs(a.length - b.length) > 2) return 99;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prevDiag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = prev[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, prevDiag + cost);
      prevDiag = temp;
    }
  }
  return prev[b.length];
}

/**
 * Build suggestion phrases for autocomplete (author-style + "all books" variants).
 */
export function buildSuggestionPhrases(seed) {
  const n = normalizeSearch(seed);
  if (!n) return [];

  const phrases = new Set();
  for (const group of SYNONYM_GROUPS) {
    for (const label of group) {
      const nl = normalizeSearch(label);
      if (nl.startsWith(n) || nl.includes(n)) {
        phrases.add(label);
        // Urdu “all books by …” style hints
        if (/[\u0600-\u06FF]/.test(label) && label.length >= 3) {
          phrases.add(`${label} کی تمام کتابیں`);
        }
        if (/^[a-z]/.test(nl) && nl.length >= 4) {
          phrases.add(`All books by ${label}`);
        }
      }
    }
  }
  return [...phrases].slice(0, 12);
}
