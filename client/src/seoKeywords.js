import { fullTitle, titleEn, titleUr } from "./bilingual";
import {
  allPublisherKeywords,
  keywordsForPublisherFields,
  isMaktabaIslamiaQuery,
  maktabaIslamiaKeywords,
  maktabaIslamiaSeoBlurb,
  publishersSeoBlurb,
} from "./publishersSeo";
import { TOPIC_SEO, allTopicKeywords, topicSeoBlurb } from "./topicSeo";
import {
  TAFHEEM_UL_QURAN,
  isTafheemQuery,
  tafheemKeywords,
  tafheemSeoBlurb,
} from "./tafheemSeo";
import {
  TARJUMAN_UL_QURAN,
  isTarjumanQuery,
  tarjumanKeywords,
  tarjumanSeoBlurb,
} from "./tarjumanSeo";
import {
  BANO_QABIL,
  isBanoQabilQuery,
  banoQabilKeywords,
  banoQabilSeoBlurb,
} from "./banoQabilSeo";
import {
  AL_KHIDMAT_FOUNDATION,
  isAlKhidmatQuery,
  alKhidmatKeywords,
  alKhidmatSeoBlurb,
} from "./alKhidmatSeo";
import {
  AMEER_JAMAAT_E_ISLAMI,
  isAmeerJamaatQuery,
  ameerJamaatKeywords,
  ameerJamaatSeoBlurb,
} from "./ameerJamaatSeo";
import {
  ISLAM_SEO,
  isIslamQuery,
  islamKeywords,
  islamSeoBlurb,
} from "./islamSeo";
import {
  JAMAAT_E_ISLAMI,
  JAMAAT_E_ISLAMI_FAISALABAD,
  MAKTABA_JI_FAISALABAD,
  isJamaatFaisalabadQuery,
  isJamaatQuery,
  isMaktabaJiQuery,
  jamaatFaisalabadKeywords,
  jamaatFaisalabadSeoBlurb,
  jamaatKeywords,
  jamaatSeoBlurb,
  maktabaJiKeywords,
  maktabaJiSeoBlurb,
} from "./jamaatSeo";
import {
  ISLAMIC_BOOKS_ONLINE,
  isIslamicBooksOnlineQuery,
  islamicBooksOnlineKeywords,
  islamicBooksOnlineSeoBlurb,
} from "./islamicBooksSeo";
import {
  FAISALABAD_SEO,
  FAISALABAD_AREAS,
  isFaisalabadQuery,
  isFaisalabadAreaQuery,
  faisalabadKeywords,
  faisalabadAreaKeywords,
  faisalabadSeoBlurb,
  faisalabadAreasSeoBlurb,
} from "./faisalabadSeo";
import {
  MANSOORA_LAHORE,
  isMansooraLahoreQuery,
  mansooraLahoreKeywords,
  mansooraLahoreSeoBlurb,
} from "./mansooraLahoreSeo";
import {
  MAULANA_MAUDUDI,
  isMaududiQuery,
  maududiKeywords,
  maududiSeoBlurb,
} from "./maududiSeo";
import {
  HAFIZ_NAEEM,
  isHafizNaeemQuery,
  hafizNaeemKeywords,
  hafizNaeemSeoBlurb,
} from "./hafizNaeemSeo";
import {
  SIRAJ_UL_HAQ,
  isSirajUlHaqQuery,
  sirajUlHaqKeywords,
  sirajUlHaqSeoBlurb,
} from "./sirajUlHaqSeo";
import {
  QAZI_HUSSAIN_AHMAD,
  isQaziHussainAhmadQuery,
  qaziHussainAhmadKeywords,
  qaziHussainAhmadSeoBlurb,
} from "./qaziHussainAhmadSeo";
import {
  MIAN_MUHAMMAD_TUFAIL,
  isMianMuhammadTufailQuery,
  mianMuhammadTufailKeywords,
  mianMuhammadTufailSeoBlurb,
} from "./mianMuhammadTufailSeo";
import {
  MUNAWAR_HASSAN,
  isMunawarHassanQuery,
  munawarHassanKeywords,
  munawarHassanSeoBlurb,
} from "./munawarHassanSeo";
import {
  MUSHTAQ_AHMAD_KHAN,
  isMushtaqAhmadKhanQuery,
  mushtaqAhmadKhanKeywords,
  mushtaqAhmadKhanSeoBlurb,
} from "./mushtaqAhmadKhanSeo";
import {
  ROADMAP_FEATURED,
  ROADMAP_TERM_COUNT,
  ROADMAP_KEYWORDS_PER_TERM,
  expandRoadmapKeywords,
  isRoadmapQuery,
  matchRoadmapTerm,
  roadmapFeaturedKeywords,
  roadmapKeywords,
  roadmapSeoBlurb,
  roadmapAreasCitiesBlurb,
} from "./roadmapSeo";
import {
  NUMBERS_WISE_FEATURED,
  NUMBERS_WISE_TERM_COUNT,
  NUMBERS_WISE_KEYWORDS_PER_TERM,
  isNumbersWiseQuery,
  matchNumbersWiseTerm,
  numbersWiseFeaturedKeywords,
  numbersWiseKeywords,
  numbersWiseSeoBlurb,
} from "./numbersWiseSeo";
import {
  JOINING_K_FEATURED,
  JOINING_K_TERM_COUNT,
  JOINING_K_KEYWORDS_PER_TERM,
  isJoiningKQuery,
  matchJoiningKTerm,
  joiningKFeaturedKeywords,
  joiningKKeywords,
  joiningKSeoBlurb,
} from "./joiningKSeo";
import {
  NAME_ID_FEATURED,
  NAME_ID_TERM_COUNT,
  NAME_ID_KEYWORDS_PER_TERM,
  isNameIdQuery,
  matchNameIdTerm,
  nameIdFeaturedKeywords,
  nameIdKeywords,
  nameIdSeoBlurb,
} from "./nameIdSeo";
import {
  SITE_CITY,
  SITE_DEFAULT_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_PHONE_DISPLAY,
  stripHtml,
  truncate,
} from "./siteConfig";

const CATEGORY_KEYWORDS = {
  all: [
    ...islamKeywords().slice(0, 10),
    ...ameerJamaatKeywords().slice(0, 4),
    ...alKhidmatKeywords().slice(0, 4),
    ...banoQabilKeywords().slice(0, 4),
    ...tarjumanKeywords().slice(0, 4),
    ...mansooraLahoreKeywords().slice(0, 4),
    ...mushtaqAhmadKhanKeywords().slice(0, 4),
    ...jamaatFaisalabadKeywords(),
    ...maktabaJiKeywords().slice(0, 10),
    ...islamicBooksOnlineKeywords().slice(0, 8),
    ...faisalabadKeywords().slice(0, 6),
    ...jamaatKeywords().slice(0, 8),
    ...munawarHassanKeywords().slice(0, 4),
    ...mianMuhammadTufailKeywords().slice(0, 4),
    ...qaziHussainAhmadKeywords().slice(0, 3),
    ...sirajUlHaqKeywords().slice(0, 3),
    ...hafizNaeemKeywords().slice(0, 3),
    ...maududiKeywords().slice(0, 3),
    "Islamic books Pakistan",
    "اسلامی کتب پاکستان",
    ...tafheemKeywords().slice(0, 2),
    ...allTopicKeywords(),
  ],
  quran: TOPIC_SEO.quran.keys,
  para: TOPIC_SEO.para.keys,
  tarjuma: TOPIC_SEO.tarjuma.keys,
  hadees: TOPIC_SEO.hadees.keys,
  hadith: TOPIC_SEO.hadees.keys,
  fiqa: TOPIC_SEO.fiqa.keys,
  fiqh: TOPIC_SEO.fiqa.keys,
  tarikh: TOPIC_SEO.tarikh.keys,
  tafseer: [
    "Tafseer",
    "Tafsir",
    "تفسیر",
    ...tafheemKeywords(),
  ],
  seerat: ["Seerat", "Seerah", "سیرت النبی", "Seerat un Nabi", "Prophet biography"],
  "dars-e-nizami": ["Dars e Nizami", "درس نظامی", "Fiqh", "فقہ", "Fiqa", "Islamic curriculum"],
};

const BASE_STORE_KEYS = [
  SITE_NAME,
  "Maktaba Jamaat e Islami",
  "مکتبہ جماعت اسلامی",
  "مکتبہ جماعت اسلامی فیصل آباد",
  "Jamaat e Islami Faisalabad",
  "جماعت اسلامی فیصل آباد",
  "JI Faisalabad",
  "Jamaat e Islami",
  "Jamaat-e-Islami",
  "جماعت اسلامی",
  "Islamic books online",
  "Islamic Books Online",
  "اسلامی کتب آن لائن",
  "buy Islamic books online",
  "اسلامی کتب آن لائن خریدیں",
  "Islamic bookstore Faisalabad",
  "Mansoora Lahore",
  "منصورہ لاہور",
  "Mansoorah Lahore",
  "Tarjuman ul Quran",
  "Tarjumaan ul Quran",
  "ترجمان القرآن",
  "ادارہ ترجمان القرآن",
  "Bano Qabil",
  "بنو قابل",
  "Bano-e-Qabil",
  "Al Khidmat Foundation",
  "الخدمت فاؤنڈیشن",
  "Alkhidmat Foundation",
  "Al Khidmat FouDation",
  "Ameer Jamaat e Islami",
  "امیر جماعت اسلامی",
  "Amir Jamaat e Islami",
  "Islam",
  "Islami",
  "Islamic",
  "Islamiat",
  "اسلام",
  "اسلامی",
  "اسلامیات",
  "Faisalabad",
  "FSD",
  "فیصل آباد",
  "اسلامی کتب فیصل آباد",
  "Islamic books Faisalabad",
  "Chiniot Bazaar Faisalabad",
  "چنیوٹ بازار فیصل آباد",
  `WhatsApp ${SITE_PHONE_DISPLAY}`,
];

function uniq(list) {
  const seen = new Set();
  const out = [];
  for (const raw of list) {
    const s = String(raw || "").trim();
    if (!s) continue;
    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

/** Build comma-separated keywords string. */
export function joinKeywords(list, max = 40) {
  return uniq(list).slice(0, max).join(", ");
}

export function homeKeywords({ category = "all", search = "" } = {}) {
  const catKeys = CATEGORY_KEYWORDS[category] || CATEGORY_KEYWORDS.all;
  const jiFsdBoost = isJamaatFaisalabadQuery(search)
    ? jamaatFaisalabadKeywords()
    : jamaatFaisalabadKeywords().slice(0, 10);
  const brandBoost =
    isMaktabaJiQuery(search) || isJamaatQuery(search)
      ? maktabaJiKeywords()
      : maktabaJiKeywords().slice(0, 14);
  const fsdBoost = isFaisalabadQuery(search)
    ? faisalabadKeywords()
    : faisalabadKeywords().slice(0, 6);
  const mansooraBoost = isMansooraLahoreQuery(search)
    ? mansooraLahoreKeywords()
    : mansooraLahoreKeywords().slice(0, 4);
  const maududiBoost = isMaududiQuery(search)
    ? maududiKeywords()
    : maududiKeywords().slice(0, 4);
  const naeemBoost = isHafizNaeemQuery(search)
    ? hafizNaeemKeywords()
    : hafizNaeemKeywords().slice(0, 4);
  const sirajBoost = isSirajUlHaqQuery(search)
    ? sirajUlHaqKeywords()
    : sirajUlHaqKeywords().slice(0, 4);
  const qaziBoost = isQaziHussainAhmadQuery(search)
    ? qaziHussainAhmadKeywords()
    : qaziHussainAhmadKeywords().slice(0, 4);
  const tufailBoost = isMianMuhammadTufailQuery(search)
    ? mianMuhammadTufailKeywords()
    : mianMuhammadTufailKeywords().slice(0, 4);
  const munawarBoost = isMunawarHassanQuery(search)
    ? munawarHassanKeywords()
    : munawarHassanKeywords().slice(0, 4);
  const mushtaqBoost = isMushtaqAhmadKhanQuery(search)
    ? mushtaqAhmadKhanKeywords()
    : mushtaqAhmadKhanKeywords().slice(0, 4);
  const onlineBoost = isIslamicBooksOnlineQuery(search)
    ? islamicBooksOnlineKeywords()
    : islamicBooksOnlineKeywords().slice(0, 6);
  const islamiaBoost = isMaktabaIslamiaQuery(search)
    ? maktabaIslamiaKeywords()
    : maktabaIslamiaKeywords().slice(0, 2);
  const tafheemBoost = isTafheemQuery(search)
    ? tafheemKeywords()
    : tafheemKeywords().slice(0, 2);
  const tarjumanBoost = isTarjumanQuery(search)
    ? tarjumanKeywords()
    : tarjumanKeywords().slice(0, 4);
  const banoQabilBoost = isBanoQabilQuery(search)
    ? banoQabilKeywords()
    : banoQabilKeywords().slice(0, 4);
  const alKhidmatBoost = isAlKhidmatQuery(search)
    ? alKhidmatKeywords()
    : alKhidmatKeywords().slice(0, 4);
  const ameerBoost = isAmeerJamaatQuery(search)
    ? ameerJamaatKeywords()
    : ameerJamaatKeywords().slice(0, 4);
  const islamBoost = isIslamQuery(search)
    ? islamKeywords()
    : islamKeywords().slice(0, 8);
  const roadmapTerm = search ? matchRoadmapTerm(search) : null;
  const numbersTerm = !roadmapTerm && search ? matchNumbersWiseTerm(search) : null;
  const joiningTerm =
    !roadmapTerm && !numbersTerm && search ? matchJoiningKTerm(search) : null;
  const nameIdTerm =
    !roadmapTerm && !numbersTerm && !joiningTerm && search
      ? matchNameIdTerm(search)
      : null;
  const seedHit = roadmapTerm || numbersTerm || joiningTerm || nameIdTerm;
  const seedBoost = roadmapTerm
    ? expandRoadmapKeywords(roadmapTerm, ROADMAP_KEYWORDS_PER_TERM)
    : numbersTerm
      ? expandRoadmapKeywords(numbersTerm, NUMBERS_WISE_KEYWORDS_PER_TERM)
      : joiningTerm
        ? expandRoadmapKeywords(joiningTerm, JOINING_K_KEYWORDS_PER_TERM)
        : nameIdTerm
          ? expandRoadmapKeywords(nameIdTerm, NAME_ID_KEYWORDS_PER_TERM)
          : [
              ...roadmapFeaturedKeywords(10),
              ...numbersWiseFeaturedKeywords(10),
              ...joiningKFeaturedKeywords(8),
              ...nameIdFeaturedKeywords(8),
            ];
  return joinKeywords(
    [
      ...seedBoost,
      ...islamBoost,
      ...ameerBoost,
      ...alKhidmatBoost,
      ...banoQabilBoost,
      ...tarjumanBoost,
      ...jiFsdBoost,
      ...brandBoost,
      ...onlineBoost,
      ...mansooraBoost,
      ...fsdBoost,
      ...mushtaqBoost,
      ...munawarBoost,
      ...tufailBoost,
      ...qaziBoost,
      ...sirajBoost,
      ...naeemBoost,
      ...maududiBoost,
      ...tafheemBoost,
      ...islamiaBoost,
      ...BASE_STORE_KEYS,
      ...catKeys,
      ...allPublisherKeywords(),
      ...(search ? [search, `${search} book`, `${search} کتاب`, `buy ${search}`, `${search} publisher`] : []),
      ...SITE_KEYWORDS.split(","),
    ],
    seedHit ? 90 : 70
  );
}

export function productKeywords(product) {
  if (!product) return SITE_KEYWORDS;
  const en = titleEn(product);
  const ur = titleUr(product);
  const name = fullTitle(product);
  const author = product.author || "";
  const category = product.category || "";
  const lang = product.bookLanguage || "";
  const isbn = product.isbn || "";
  const pubKeys = keywordsForPublisherFields(product.publisher, product.source);
  const hay = `${name} ${category} ${en} ${ur} ${product.publisher || ""} ${product.source || ""}`.toLowerCase();
  const matchedTopics = Object.values(TOPIC_SEO).flatMap((t) =>
    t.keys.some((k) => hay.includes(String(k).toLowerCase())) ? t.keys.slice(0, 6) : []
  );
  const islamiaHit =
    /islamia|اسلامیہ|اسلاميه/.test(hay) || /maktaba islamia/i.test(`${product.publisher} ${product.source}`);
  const islamiaKeys = islamiaHit ? maktabaIslamiaKeywords() : [];
  const tafheemHit = /tafheem|tafhim|تفہیم|تفهيم|towards understanding/.test(hay);
  const tafheemKeys = tafheemHit ? tafheemKeywords() : [];
  const tarjumanHit =
    /tarjumaa?n|tarjaman|ترجمان/.test(hay) || /tarjumaa?n|ترجمان/i.test(`${product.publisher} ${product.source}`);
  const tarjumanKeys = tarjumanHit ? tarjumanKeywords() : [];
  const banoQabilHit =
    /bano[\s-]*qa|banu[\s-]*qa|بنو قابل/.test(hay) || /bano\s*qabil|بنو قابل/i.test(author);
  const banoQabilKeys = banoQabilHit ? banoQabilKeywords() : [];
  const alKhidmatHit =
    /khidmat|الخدمت/.test(hay) || /khidmat|الخدمت/i.test(author);
  const alKhidmatKeys = alKhidmatHit ? alKhidmatKeywords() : [];
  const ameerHit =
    /amee?r\s*(jamaat|ji)|امیر جماعت/.test(hay) || /amee?r|امیر جماعت/i.test(author);
  const ameerKeys = ameerHit ? ameerJamaatKeywords() : [];
  const islamHit =
    /\bislam|\bislami|\bislamiat|اسلام/.test(hay) || /\bislam|اسلام/i.test(author);
  const islamKeys = islamHit ? islamKeywords().slice(0, 8) : [];
  const maududiHit =
    /maududi|mawdudi|modudi|maododi|مودودی|ابو الاعلی|abul a/.test(hay) ||
    /maududi|مودودی/i.test(author);
  const maududiKeys = maududiHit ? maududiKeywords() : [];
  const naeemHit =
    /hafiz\s*naeem|naeem\s*ur|حافظ نعیم|نعیم الرحم/.test(hay) ||
    /hafiz naeem|حافظ نعیم/i.test(author);
  const naeemKeys = naeemHit ? hafizNaeemKeywords() : [];
  const sirajHit =
    /siraj[\s-]*ul[\s-]*haq|sirajul\s*haq|سراج الحق/.test(hay) ||
    /siraj[\s-]*ul|سراج الحق/i.test(author);
  const sirajKeys = sirajHit ? sirajUlHaqKeywords() : [];
  const qaziHit =
    /qazi\s*huss|قاضی حسین احمد/.test(hay) || /qazi huss|قاضی حسین/i.test(author);
  const qaziKeys = qaziHit ? qaziHussainAhmadKeywords() : [];
  const tufailHit =
    /(mian|miyan|میاں).{0,24}(tufail|fufail|طفیل)|(tufail|fufail).{0,12}(mian|miyan)|میاں محمد طفیل/.test(
      hay
    ) || /tufail|fufail|طفیل/i.test(author);
  const tufailKeys = tufailHit ? mianMuhammadTufailKeywords() : [];
  const munawarHit =
    /munaw+ar|munar\s*hass|منور حسن/.test(hay) || /munaw+ar|munar|منور حسن/i.test(author);
  const munawarKeys = munawarHit ? munawarHassanKeywords() : [];
  const mushtaqHit =
    /mushta[qk]|senat[oa]r\s*musht|مشتاق احمد/.test(hay) ||
    /mushta[qk]|مشتاق احمد|سینیٹر مشتاق/i.test(author);
  const mushtaqKeys = mushtaqHit ? mushtaqAhmadKhanKeywords() : [];

  return joinKeywords(
    [
      name,
      en,
      ur,
      author,
      author ? `${author} books` : "",
      author ? `${author} کی کتابیں` : "",
      ...pubKeys,
      ...mushtaqKeys,
      ...munawarKeys,
      ...tufailKeys,
      ...qaziKeys,
      ...sirajKeys,
      ...naeemKeys,
      ...maududiKeys,
      ...tafheemKeys,
      ...tarjumanKeys,
      ...banoQabilKeys,
      ...alKhidmatKeys,
      ...ameerKeys,
      ...islamKeys,
      ...islamiaKeys,
      ...matchedTopics,
      category,
      category ? `${category} books` : "",
      category ? `${category} کتب` : "",
      lang,
      isbn ? `ISBN ${isbn}` : "",
      en ? `buy ${en}` : "",
      en ? `${en} online` : "",
      en ? `${en} price Pakistan` : "",
      ur ? `${ur} خریدیں` : "",
      ur ? `${ur} آن لائن` : "",
      ur ? `${ur} قیمت` : "",
      `${SITE_CITY} Islamic books`,
      "FSD",
      "فیصل آباد",
      "اسلامی کتب فیصل آباد",
      "Islamic books Faisalabad",
      "Islamic books online",
      "اسلامی کتب آن لائن",
      "buy Islamic books online",
      SITE_NAME,
      "مکتبہ جماعت اسلامی فیصل آباد",
      "order Islamic book WhatsApp",
      "اسلامی کتاب واٹس ایپ آرڈر",
      ...faisalabadKeywords().slice(0, 8),
      ...islamicBooksOnlineKeywords().slice(0, 6),
      ...BASE_STORE_KEYS,
    ],
    50
  );
}

export function productSeoTitle(product) {
  const name = fullTitle(product);
  const author = product.author ? ` — ${product.author}` : "";
  return `${name}${author} | ${SITE_NAME} | مکتبہ جماعت اسلامی فیصل آباد`;
}

export function productSeoDescription(product, priceText) {
  const name = fullTitle(product);
  const en = titleEn(product);
  const ur = titleUr(product);
  const authorBit = product.author ? ` by ${product.author}` : "";
  const pub =
    product.publisher ||
    (product.source ? String(product.source).replace(/\s*Website$/i, "").trim() : "");
  const pubBit = pub ? ` Publisher/source catalog: ${pub}.` : "";
  const cat = product.category ? ` ${product.category}.` : "";
  const priceBit = priceText ? ` ${priceText}.` : "";
  const desc = truncate(stripHtml(product.description), 70);
  return truncate(
    [
      `Buy "${name}"${authorBit} from ${SITE_NAME}, ${SITE_CITY}.`,
      en && ur && en !== ur ? `English: ${en}. اردو: ${ur}.` : "",
      pubBit,
      cat,
      priceBit,
      desc,
      `Order on WhatsApp ${SITE_PHONE_DISPLAY}.`,
    ]
      .filter(Boolean)
      .join(" "),
    170
  );
}

export function homeSeoTitle({ category = "all", search = "", page = 1 } = {}) {
  const pageBit = page > 1 ? ` — Page ${page}` : "";
  if (search) {
    if (isAmeerJamaatQuery(search)) {
      return `Ameer Jamaat e Islami Books | امیر جماعت اسلامی کی کتابیں${pageBit}`;
    }
    if (isAlKhidmatQuery(search)) {
      return `Al Khidmat Foundation Books | الخدمت فاؤنڈیشن کی کتابیں${pageBit}`;
    }
    if (isBanoQabilQuery(search)) {
      return `Bano Qabil Books | بنو قابل کی کتابیں${pageBit}`;
    }
    if (isTarjumanQuery(search)) {
      return `Tarjuman ul Quran | ترجمان القرآن — Tarjumaan ul Quran${pageBit}`;
    }
    if (isMansooraLahoreQuery(search)) {
      return `Mansoora Lahore Books | منصورہ لاہور کی کتابیں${pageBit}`;
    }
    if (isMushtaqAhmadKhanQuery(search)) {
      return `Senator Mushtaq Ahmad Khan Books | سینیٹر مشتاق احمد خان کی کتابیں${pageBit}`;
    }
    if (isJamaatFaisalabadQuery(search) || (isJamaatQuery(search) && !isMaktabaJiQuery(search))) {
      return `Jamaat e Islami Faisalabad | جماعت اسلامی فیصل آباد${pageBit}`;
    }
    if (isMaktabaJiQuery(search)) {
      return `Maktaba Jamaat e Islami Faisalabad | مکتبہ جماعت اسلامی فیصل آباد${pageBit}`;
    }
    if (isMunawarHassanQuery(search)) {
      return `Munawar Hassan Books Online | منور حسن کی کتابیں${pageBit}`;
    }
    if (isMianMuhammadTufailQuery(search)) {
      return `Mian Muhammad Tufail Books | میاں محمد طفیل کی کتابیں${pageBit}`;
    }
    if (isQaziHussainAhmadQuery(search)) {
      return `Qazi Hussain Ahmad Books | قاضی حسین احمد کی کتابیں${pageBit}`;
    }
    if (isSirajUlHaqQuery(search)) {
      return `Siraj ul Haq Books Online | سراج الحق کی کتابیں${pageBit}`;
    }
    if (isHafizNaeemQuery(search)) {
      return `Hafiz Naeem ur Rehman Books | حافظ نعیم الرحمٰن کی کتابیں${pageBit}`;
    }
    if (isMaududiQuery(search)) {
      return `Maulana Maududi Books Online | مولانا مودودی کی کتابیں${pageBit}`;
    }
    if (isFaisalabadQuery(search)) {
      return isFaisalabadAreaQuery(search)
        ? `Islamic Books ${search} Faisalabad | اسلامی کتب فیصل آباد${pageBit}`
        : `Islamic Books Faisalabad | اسلامی کتب فیصل آباد — FSD${pageBit}`;
    }
    if (isIslamicBooksOnlineQuery(search)) {
      return `Buy Islamic Books Online | اسلامی کتب آن لائن — ${SITE_CITY}${pageBit}`;
    }
    if (isIslamQuery(search)) {
      return `Islam Islami Islamic Islamiat Books | اسلام اسلامی اسلامیات${pageBit}`;
    }
    if (isTafheemQuery(search)) {
      return `Buy Tafheem ul Quran Online | تفہیم القرآن — ${SITE_CITY}${pageBit}`;
    }
    if (isMaktabaIslamiaQuery(search)) {
      return `Buy Maktaba Islamia Books Online | مکتبہ اسلامیہ — ${SITE_CITY}${pageBit}`;
    }
    const roadmapHit = matchRoadmapTerm(search);
    if (roadmapHit) {
      return `${roadmapHit} Books Online | ${roadmapHit} کی کتابیں — ${SITE_NAME}${pageBit}`;
    }
    const numbersHit = matchNumbersWiseTerm(search);
    if (numbersHit) {
      return `${numbersHit} Books Online | ${numbersHit} کی کتابیں — ${SITE_NAME}${pageBit}`;
    }
    const joiningHit = matchJoiningKTerm(search);
    if (joiningHit) {
      return `${joiningHit} Books Online | ${joiningHit} کی کتابیں — ${SITE_NAME}${pageBit}`;
    }
    const nameIdHit = matchNameIdTerm(search);
    if (nameIdHit) {
      return `${nameIdHit} Books Online | ${nameIdHit} کی کتابیں — ${SITE_NAME}${pageBit}`;
    }
    return `${search} — ${SITE_NAME} | مکتبہ جماعت اسلامی${pageBit}`;
  }
  if (category && category !== "all") {
    if (category === "tafseer") {
      return `Tafheem ul Quran | تفہیم القرآن — ${SITE_NAME}${pageBit}`;
    }
    const topic = TOPIC_SEO[category];
    const label =
      topic?.label ||
      {
        seerat: "Seerat / سیرت",
        "dars-e-nizami": "Dars e Nizami / درس نظامی",
        hadith: "Hadees / حدیث",
      }[category] ||
      category;
    return `Buy ${label} — ${SITE_NAME} | مکتبہ جماعت اسلامی فیصل آباد${pageBit}`;
  }
  return page > 1
    ? `Islamic Books Online — Page ${page} | ${SITE_NAME}`
    : SITE_NAME;
}

export function homeSeoDescription({ category = "all", search = "", page = 1 } = {}) {
  const pageBit = page > 1 ? ` Page ${page}.` : "";
  if (search) {
    if (isAmeerJamaatQuery(search)) {
      return truncate(`${ameerJamaatSeoBlurb()} WhatsApp ${SITE_PHONE_DISPLAY}.${pageBit}`, 170);
    }
    if (isAlKhidmatQuery(search)) {
      return truncate(`${alKhidmatSeoBlurb()} WhatsApp ${SITE_PHONE_DISPLAY}.`, 170);
    }
    if (isBanoQabilQuery(search)) {
      return truncate(`${banoQabilSeoBlurb()} WhatsApp ${SITE_PHONE_DISPLAY}.`, 170);
    }
    if (isTarjumanQuery(search)) {
      return truncate(`${tarjumanSeoBlurb()} WhatsApp ${SITE_PHONE_DISPLAY}.`, 170);
    }
    if (isMansooraLahoreQuery(search)) {
      return truncate(`${mansooraLahoreSeoBlurb()} WhatsApp ${SITE_PHONE_DISPLAY}.`, 170);
    }
    if (isMushtaqAhmadKhanQuery(search)) {
      return truncate(`${mushtaqAhmadKhanSeoBlurb()} WhatsApp ${SITE_PHONE_DISPLAY}.`, 170);
    }
    if (isJamaatFaisalabadQuery(search) || (isJamaatQuery(search) && !isMaktabaJiQuery(search))) {
      return truncate(`${jamaatFaisalabadSeoBlurb()} WhatsApp ${SITE_PHONE_DISPLAY}.`, 170);
    }
    if (isMaktabaJiQuery(search)) {
      return truncate(`${maktabaJiSeoBlurb()} WhatsApp ${SITE_PHONE_DISPLAY}.`, 170);
    }
    if (isMunawarHassanQuery(search)) {
      return truncate(`${munawarHassanSeoBlurb()} WhatsApp ${SITE_PHONE_DISPLAY}.`, 170);
    }
    if (isMianMuhammadTufailQuery(search)) {
      return truncate(`${mianMuhammadTufailSeoBlurb()} WhatsApp ${SITE_PHONE_DISPLAY}.`, 170);
    }
    if (isQaziHussainAhmadQuery(search)) {
      return truncate(`${qaziHussainAhmadSeoBlurb()} WhatsApp ${SITE_PHONE_DISPLAY}.`, 170);
    }
    if (isSirajUlHaqQuery(search)) {
      return truncate(`${sirajUlHaqSeoBlurb()} WhatsApp ${SITE_PHONE_DISPLAY}.`, 170);
    }
    if (isHafizNaeemQuery(search)) {
      return truncate(`${hafizNaeemSeoBlurb()} WhatsApp ${SITE_PHONE_DISPLAY}.`, 170);
    }
    if (isMaududiQuery(search)) {
      return truncate(`${maududiSeoBlurb()} WhatsApp ${SITE_PHONE_DISPLAY}.`, 170);
    }
    if (isFaisalabadQuery(search)) {
      return truncate(
        `${isFaisalabadAreaQuery(search) ? faisalabadAreasSeoBlurb() : faisalabadSeoBlurb()} WhatsApp ${SITE_PHONE_DISPLAY}.`,
        170
      );
    }
    if (isIslamicBooksOnlineQuery(search)) {
      return truncate(`${islamicBooksOnlineSeoBlurb()} WhatsApp ${SITE_PHONE_DISPLAY}.`, 170);
    }
    if (isIslamQuery(search)) {
      return truncate(`${islamSeoBlurb()} WhatsApp ${SITE_PHONE_DISPLAY}.${pageBit}`, 170);
    }
    if (isTafheemQuery(search)) {
      return truncate(`${tafheemSeoBlurb()} WhatsApp ${SITE_PHONE_DISPLAY}.`, 170);
    }
    if (isMaktabaIslamiaQuery(search)) {
      return truncate(
        `${maktabaIslamiaSeoBlurb()} WhatsApp ${SITE_PHONE_DISPLAY}.`,
        170
      );
    }
    const roadmapHit = matchRoadmapTerm(search);
    if (roadmapHit) {
      return truncate(
        `${roadmapSeoBlurb(roadmapHit)} WhatsApp ${SITE_PHONE_DISPLAY}.${pageBit}`,
        170
      );
    }
    const numbersHit = matchNumbersWiseTerm(search);
    if (numbersHit) {
      return truncate(
        `${numbersWiseSeoBlurb(numbersHit)} WhatsApp ${SITE_PHONE_DISPLAY}.${pageBit}`,
        170
      );
    }
    const joiningHit = matchJoiningKTerm(search);
    if (joiningHit) {
      return truncate(
        `${joiningKSeoBlurb(joiningHit)} WhatsApp ${SITE_PHONE_DISPLAY}.${pageBit}`,
        170
      );
    }
    const nameIdHit = matchNameIdTerm(search);
    if (nameIdHit) {
      return truncate(
        `${nameIdSeoBlurb(nameIdHit)} WhatsApp ${SITE_PHONE_DISPLAY}.${pageBit}`,
        170
      );
    }
    return truncate(
      `Buy "${search}" at ${SITE_NAME} (مکتبہ جماعت اسلامی فیصل آباد). WhatsApp ${SITE_PHONE_DISPLAY}.`,
      170
    );
  }
  if (category && category !== "all") {
    if (category === "tafseer") {
      return truncate(`${tafheemSeoBlurb()} ${maktabaJiSeoBlurb()} WhatsApp ${SITE_PHONE_DISPLAY}.`, 170);
    }
    const keys = (CATEGORY_KEYWORDS[category] || []).slice(0, 6).join(", ");
    return truncate(
      `Buy ${keys} from ${SITE_NAME} — مکتبہ جماعت اسلامی فیصل آباد. WhatsApp ${SITE_PHONE_DISPLAY}.`,
      170
    );
  }
  return truncate(SITE_DEFAULT_DESCRIPTION, 170);
}

export {
  publishersSeoBlurb,
  allPublisherKeywords,
  topicSeoBlurb,
  allTopicKeywords,
  maktabaIslamiaSeoBlurb,
  maktabaIslamiaKeywords,
  tafheemSeoBlurb,
  tafheemKeywords,
  TAFHEEM_UL_QURAN,
  tarjumanSeoBlurb,
  tarjumanKeywords,
  TARJUMAN_UL_QURAN,
  banoQabilSeoBlurb,
  banoQabilKeywords,
  BANO_QABIL,
  alKhidmatSeoBlurb,
  alKhidmatKeywords,
  AL_KHIDMAT_FOUNDATION,
  ameerJamaatSeoBlurb,
  ameerJamaatKeywords,
  AMEER_JAMAAT_E_ISLAMI,
  islamSeoBlurb,
  islamKeywords,
  ISLAM_SEO,
  jamaatSeoBlurb,
  jamaatKeywords,
  jamaatFaisalabadSeoBlurb,
  jamaatFaisalabadKeywords,
  JAMAAT_E_ISLAMI,
  JAMAAT_E_ISLAMI_FAISALABAD,
  maktabaJiSeoBlurb,
  maktabaJiKeywords,
  MAKTABA_JI_FAISALABAD,
  islamicBooksOnlineSeoBlurb,
  islamicBooksOnlineKeywords,
  ISLAMIC_BOOKS_ONLINE,
  faisalabadSeoBlurb,
  faisalabadAreasSeoBlurb,
  faisalabadKeywords,
  faisalabadAreaKeywords,
  FAISALABAD_SEO,
  FAISALABAD_AREAS,
  mansooraLahoreSeoBlurb,
  mansooraLahoreKeywords,
  MANSOORA_LAHORE,
  maududiSeoBlurb,
  maududiKeywords,
  MAULANA_MAUDUDI,
  hafizNaeemSeoBlurb,
  hafizNaeemKeywords,
  HAFIZ_NAEEM,
  sirajUlHaqSeoBlurb,
  sirajUlHaqKeywords,
  SIRAJ_UL_HAQ,
  qaziHussainAhmadSeoBlurb,
  qaziHussainAhmadKeywords,
  QAZI_HUSSAIN_AHMAD,
  mianMuhammadTufailSeoBlurb,
  mianMuhammadTufailKeywords,
  MIAN_MUHAMMAD_TUFAIL,
  munawarHassanSeoBlurb,
  munawarHassanKeywords,
  MUNAWAR_HASSAN,
  mushtaqAhmadKhanSeoBlurb,
  mushtaqAhmadKhanKeywords,
  MUSHTAQ_AHMAD_KHAN,
  roadmapSeoBlurb,
  roadmapAreasCitiesBlurb,
  roadmapKeywords,
  roadmapFeaturedKeywords,
  expandRoadmapKeywords,
  matchRoadmapTerm,
  isRoadmapQuery,
  ROADMAP_FEATURED,
  ROADMAP_TERM_COUNT,
  ROADMAP_KEYWORDS_PER_TERM,
  numbersWiseSeoBlurb,
  numbersWiseKeywords,
  numbersWiseFeaturedKeywords,
  matchNumbersWiseTerm,
  isNumbersWiseQuery,
  NUMBERS_WISE_FEATURED,
  NUMBERS_WISE_TERM_COUNT,
  NUMBERS_WISE_KEYWORDS_PER_TERM,
  joiningKSeoBlurb,
  joiningKKeywords,
  joiningKFeaturedKeywords,
  matchJoiningKTerm,
  isJoiningKQuery,
  JOINING_K_FEATURED,
  JOINING_K_TERM_COUNT,
  JOINING_K_KEYWORDS_PER_TERM,
  nameIdSeoBlurb,
  nameIdKeywords,
  nameIdFeaturedKeywords,
  matchNameIdTerm,
  isNameIdQuery,
  NAME_ID_FEATURED,
  NAME_ID_TERM_COUNT,
  NAME_ID_KEYWORDS_PER_TERM,
};
