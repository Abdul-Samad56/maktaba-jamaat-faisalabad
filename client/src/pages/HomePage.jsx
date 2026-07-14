import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { fetchFilters, fetchProducts, peekFilters, peekProducts, wakeApi } from "../api";
import Pagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";
import Seo from "../components/Seo";
import Sidebar from "../components/Sidebar";
import {
  SITE_DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_PHONE_DISPLAY,
  SITE_URL,
  absoluteUrl,
} from "../siteConfig";
import {
  homeKeywords,
  homeSeoDescription,
  homeSeoTitle,
  faisalabadSeoBlurb,
  faisalabadAreasSeoBlurb,
  mansooraLahoreSeoBlurb,
  hafizNaeemSeoBlurb,
  islamicBooksOnlineSeoBlurb,
  jamaatFaisalabadSeoBlurb,
  maktabaJiSeoBlurb,
  maududiSeoBlurb,
  maktabaIslamiaSeoBlurb,
  mianMuhammadTufailSeoBlurb,
  munawarHassanSeoBlurb,
  mushtaqAhmadKhanSeoBlurb,
  banoQabilSeoBlurb,
  alKhidmatSeoBlurb,
  ameerJamaatSeoBlurb,
  islamSeoBlurb,
  publishersSeoBlurb,
  qaziHussainAhmadSeoBlurb,
  sirajUlHaqSeoBlurb,
  tafheemSeoBlurb,
  tarjumanSeoBlurb,
  roadmapAreasCitiesBlurb,
  roadmapSeoBlurb,
  ROADMAP_FEATURED,
  ROADMAP_TERM_COUNT,
  numbersWiseSeoBlurb,
  NUMBERS_WISE_FEATURED,
  NUMBERS_WISE_TERM_COUNT,
  joiningKSeoBlurb,
  JOINING_K_FEATURED,
  JOINING_K_TERM_COUNT,
  nameIdSeoBlurb,
  NAME_ID_FEATURED,
  NAME_ID_TERM_COUNT,
} from "../seoKeywords";
import { ROADMAP_CITIES } from "../roadmapSeo";
import { MAKTABA_ISLAMIA, PUBLISHER_SEO } from "../publishersSeo";
import { FAISALABAD_SEO, FAISALABAD_AREAS, FAISALABAD_AREAS_FEATURED } from "../faisalabadSeo";
import { MANSOORA_LAHORE } from "../mansooraLahoreSeo";
import { HAFIZ_NAEEM } from "../hafizNaeemSeo";
import { ISLAMIC_BOOKS_ONLINE } from "../islamicBooksSeo";
import { JAMAAT_E_ISLAMI, JAMAAT_E_ISLAMI_FAISALABAD, MAKTABA_JI_FAISALABAD } from "../jamaatSeo";
import { MAULANA_MAUDUDI } from "../maududiSeo";
import { MIAN_MUHAMMAD_TUFAIL } from "../mianMuhammadTufailSeo";
import { MUNAWAR_HASSAN } from "../munawarHassanSeo";
import { MUSHTAQ_AHMAD_KHAN } from "../mushtaqAhmadKhanSeo";
import { BANO_QABIL } from "../banoQabilSeo";
import { AL_KHIDMAT_FOUNDATION } from "../alKhidmatSeo";
import { AMEER_JAMAAT_E_ISLAMI } from "../ameerJamaatSeo";
import { ISLAM_SEO } from "../islamSeo";
import { QAZI_HUSSAIN_AHMAD } from "../qaziHussainAhmadSeo";
import { SIRAJ_UL_HAQ } from "../sirajUlHaqSeo";
import { TAFHEEM_UL_QURAN } from "../tafheemSeo";
import { TARJUMAN_UL_QURAN } from "../tarjumanSeo";
import { TOPIC_SEO } from "../topicSeo";
import { fullTitle } from "../bilingual";
import { productPath } from "../productUrl";

const CATEGORY_LABELS = {
  all: "All Books",
  quran: "Quran / قرآن",
  para: "Para / پارہ",
  tarjuma: "Tarjuma / ترجمہ",
  hadees: "Hadees / حدیث",
  hadith: "Hadees / حدیث",
  fiqa: "Fiqa / فقہ",
  fiqh: "Fiqa / فقہ",
  tarikh: "Tarikh / تاریخ",
  tafseer: "Tafheem / Tafseer / تفہیم القرآن",
  seerat: "Seerat un Nabi",
  "dars-e-nizami": "Dars e Nizami",
};

function ProductSkeleton() {
  return (
    <div className="product-card skeleton-card">
      <div className="skeleton-image" />
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
      <div className="skeleton-line price" />
    </div>
  );
}

export default function HomePage() {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const productsRef = useRef(null);

  const category = params.get("category") || "all";
  const page = Number(params.get("page") || 1);
  const sort = params.get("sort") || "featured";
  const search = params.get("search") || "";

  const homeJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Bookstore",
          "@id": `${SITE_URL}/#store`,
          name: SITE_NAME,
          url: SITE_URL,
          telephone: SITE_PHONE_DISPLAY,
          address: {
            "@type": "PostalAddress",
            streetAddress: "گلی نمبر 8، چنیوٹ بازار",
            addressLocality: "Faisalabad",
            addressRegion: "Punjab",
            addressCountry: "PK",
          },
          image: absoluteUrl("/logo.png"),
          description: `${SITE_DEFAULT_DESCRIPTION} ${maktabaJiSeoBlurb()}`,
          alternateName: [
            MAKTABA_JI_FAISALABAD.ur,
            "Maktaba Jamaat e Islami",
            "مکتبہ جماعت اسلامی",
            "Maktaba JI Faisalabad",
          ],
          knowsAbout: [
            JAMAAT_E_ISLAMI_FAISALABAD.en,
            JAMAAT_E_ISLAMI_FAISALABAD.ur,
            ...JAMAAT_E_ISLAMI_FAISALABAD.aliases.slice(0, 8),
            MAKTABA_JI_FAISALABAD.en,
            MAKTABA_JI_FAISALABAD.ur,
            ...MAKTABA_JI_FAISALABAD.aliases.slice(0, 8),
            JAMAAT_E_ISLAMI.en,
            JAMAAT_E_ISLAMI.ur,
            MUSHTAQ_AHMAD_KHAN.en,
            BANO_QABIL.en,
            AL_KHIDMAT_FOUNDATION.en,
            AMEER_JAMAAT_E_ISLAMI.en,
            ISLAM_SEO.en,
            "Islami",
            "Islamic",
            "Islamiat",
            MUNAWAR_HASSAN.en,
            MIAN_MUHAMMAD_TUFAIL.en,
            QAZI_HUSSAIN_AHMAD.en,
            SIRAJ_UL_HAQ.en,
            HAFIZ_NAEEM.en,
            MAULANA_MAUDUDI.en,
            TAFHEEM_UL_QURAN.en,
            TARJUMAN_UL_QURAN.en,
            MAKTABA_ISLAMIA.en,
            ISLAMIC_BOOKS_ONLINE.en,
            FAISALABAD_SEO.en,
            MANSOORA_LAHORE.en,
            ...Object.values(TOPIC_SEO).flatMap((t) => [t.label]),
            ...PUBLISHER_SEO.flatMap((p) => [p.en, p.ur]),
          ],
          areaServed: {
            "@type": "City",
            name: "Faisalabad",
            alternateName: ["فیصل آباد", "FSD"],
          },
        },
        {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          url: SITE_URL,
          name: SITE_NAME,
          alternateName: [
            "مکتبہ جماعت اسلامی فیصل آباد",
            "Jamaat e Islami Faisalabad",
            "جماعت اسلامی فیصل آباد",
            "Mansoora Lahore",
            "منصورہ لاہور",
            "Maktaba Jamaat e Islami",
            "مکتبہ جماعت اسلامی",
            "Maktaba JI Faisalabad",
            "Islamic books online Faisalabad",
          ],
          publisher: { "@id": `${SITE_URL}/#store` },
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/?search={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        },
        {
          "@type": "CollectionPage",
          "@id": `${SITE_URL}/#maktaba-jamaat-e-islami-faisalabad`,
          name: "Maktaba Jamaat e Islami Faisalabad | مکتبہ جماعت اسلامی فیصل آباد",
          url: SITE_URL,
          description: maktabaJiSeoBlurb(),
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: {
            "@type": "Bookstore",
            name: MAKTABA_JI_FAISALABAD.en,
            alternateName: MAKTABA_JI_FAISALABAD.aliases.slice(0, 6),
          },
        },
        {
          "@type": "CollectionPage",
          "@id": `${SITE_URL}/#mushtaq-ahmad-khan`,
          name: "Senator Mushtaq Ahmad Khan Books | سینیٹر مشتاق احمد خان کی کتابیں",
          url: `${SITE_URL}/?search=${encodeURIComponent(MUSHTAQ_AHMAD_KHAN.searchQuery)}`,
          description: mushtaqAhmadKhanSeoBlurb(),
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: {
            "@type": "Person",
            name: "Senator Mushtaq Ahmad Khan",
            alternateName: [
              "سینیٹر مشتاق احمد خان",
              "مشتاق احمد خان",
              "Mushtaq Ahmad Khan",
              "Mushtaq Ahmed Khan",
              "Senotor Mushtaq Ahmad Khan",
            ],
          },
        },
        {
          "@type": "CollectionPage",
          "@id": `${SITE_URL}/#munawar-hassan`,
          name: "Munawar Hassan Books | منور حسن کی کتابیں",
          url: `${SITE_URL}/?search=${encodeURIComponent(MUNAWAR_HASSAN.searchQuery)}`,
          description: munawarHassanSeoBlurb(),
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: {
            "@type": "Person",
            name: "Syed Munawar Hassan",
            alternateName: [
              "منور حسن",
              "Munawar Hassan",
              "Munawwar Hassan",
              "Munar Hassan",
              "سید منور حسن",
            ],
          },
        },
        {
          "@type": "CollectionPage",
          "@id": `${SITE_URL}/#mian-muhammad-tufail`,
          name: "Mian Muhammad Tufail Books | میاں محمد طفیل کی کتابیں",
          url: `${SITE_URL}/?search=${encodeURIComponent(MIAN_MUHAMMAD_TUFAIL.searchQuery)}`,
          description: mianMuhammadTufailSeoBlurb(),
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: {
            "@type": "Person",
            name: "Mian Muhammad Tufail",
            alternateName: [
              "میاں محمد طفیل",
              "Mian Mohammad Tufail",
              "Mian Muhammad Fufail",
              "Mian Tufail",
            ],
          },
        },
        {
          "@type": "CollectionPage",
          "@id": `${SITE_URL}/#qazi-hussain-ahmad`,
          name: "Qazi Hussain Ahmad Books | قاضی حسین احمد کی کتابیں",
          url: `${SITE_URL}/?search=${encodeURIComponent(QAZI_HUSSAIN_AHMAD.searchQuery)}`,
          description: qaziHussainAhmadSeoBlurb(),
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: {
            "@type": "Person",
            name: "Qazi Hussain Ahmad",
            alternateName: [
              "قاضی حسین احمد",
              "Qazi Hussain Ahmed",
              "Qazi Husain Ahmad",
            ],
          },
        },
        {
          "@type": "CollectionPage",
          "@id": `${SITE_URL}/#siraj-ul-haq`,
          name: "Siraj ul Haq Books | سراج الحق کی کتابیں",
          url: `${SITE_URL}/?search=${encodeURIComponent(SIRAJ_UL_HAQ.searchQuery)}`,
          description: sirajUlHaqSeoBlurb(),
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: {
            "@type": "Person",
            name: "Siraj ul Haq",
            alternateName: ["سراج الحق", "Sirajul Haq", "Siraj-ul-Haq", "سینیٹر سراج الحق"],
          },
        },
        {
          "@type": "CollectionPage",
          "@id": `${SITE_URL}/#hafiz-naeem`,
          name: "Hafiz Naeem ur Rehman Books | حافظ نعیم الرحمٰن کی کتابیں",
          url: `${SITE_URL}/?search=${encodeURIComponent(HAFIZ_NAEEM.searchQuery)}`,
          description: hafizNaeemSeoBlurb(),
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: {
            "@type": "Person",
            name: "Hafiz Naeem ur Rehman",
            alternateName: [
              "حافظ نعیم الرحمٰن",
              "حافظ نعیم",
              "Hafiz Naeem",
              "Hafiz Naeem ur Rahman",
            ],
          },
        },
        {
          "@type": "CollectionPage",
          "@id": `${SITE_URL}/#maulana-maududi`,
          name: "Maulana Maududi Books | مولانا مودودی کی کتابیں",
          url: `${SITE_URL}/?search=${encodeURIComponent(MAULANA_MAUDUDI.searchQuery)}`,
          description: maududiSeoBlurb(),
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: {
            "@type": "Person",
            name: "Syed Abul A'la Maududi",
            alternateName: [
              "Maulana Maududi",
              "مولانا مودودی",
              "Molana Maododi",
              "Abul Ala Maududi",
              "مودودی",
            ],
          },
        },
        {
          "@type": "CollectionPage",
          "@id": `${SITE_URL}/#mansoora-lahore`,
          name: "Mansoora Lahore | منصورہ لاہور",
          url: `${SITE_URL}/?search=${encodeURIComponent(MANSOORA_LAHORE.searchQuery)}`,
          description: mansooraLahoreSeoBlurb(),
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: {
            "@type": "Place",
            name: "Mansoora Lahore",
            alternateName: [
              "منصورہ لاہور",
              "Mansoorah Lahore",
              "Mansura Lahore",
              "منصورہ",
              "Mansoora Markaz",
            ],
          },
        },
        {
          "@type": "CollectionPage",
          "@id": `${SITE_URL}/#faisalabad`,
          name: "Islamic Books Faisalabad | اسلامی کتب فیصل آباد — FSD",
          url: SITE_URL,
          description: faisalabadSeoBlurb(),
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: {
            "@type": "City",
            name: "Faisalabad",
            alternateName: [
              "فیصل آباد",
              "FSD",
              "Faisalabad Pakistan",
              "Lyallpur",
              ...FAISALABAD_AREAS_FEATURED.slice(0, 20).map((a) => a.en),
              ...FAISALABAD_AREAS_FEATURED.slice(0, 20).map((a) => a.ur),
            ],
          },
        },
        {
          "@type": "ItemList",
          "@id": `${SITE_URL}/#faisalabad-areas`,
          name: "Faisalabad areas — فیصل آباد کے علاقے",
          description: faisalabadAreasSeoBlurb(),
          numberOfItems: FAISALABAD_AREAS.length,
          itemListElement: FAISALABAD_AREAS_FEATURED.slice(0, 60).map((a, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${a.en} / ${a.ur}`,
            url: `${SITE_URL}/?search=${encodeURIComponent(a.en)}`,
          })),
        },
        {
          "@type": "ItemList",
          "@id": `${SITE_URL}/#roadmap-topics`,
          name: "Famous persons, cities & search topics — مشہور شخصیات و شہر",
          description: roadmapAreasCitiesBlurb(),
          numberOfItems: ROADMAP_TERM_COUNT,
          itemListElement: ROADMAP_FEATURED.slice(0, 50).map((term, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: term,
            url: `${SITE_URL}/?search=${encodeURIComponent(term)}`,
          })),
        },
        {
          "@type": "ItemList",
          "@id": `${SITE_URL}/#pakistan-cities`,
          name: "Pakistan cities — پاکستان کے شہر",
          description: roadmapSeoBlurb("Pakistan cities"),
          numberOfItems: ROADMAP_CITIES.length,
          itemListElement: ROADMAP_CITIES.filter((c) => !/punjab|پنجاب/i.test(c))
            .slice(0, 40)
            .map((city, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: city,
              url: `${SITE_URL}/?search=${encodeURIComponent(city)}`,
            })),
        },
        {
          "@type": "ItemList",
          "@id": `${SITE_URL}/#numbers-wise-topics`,
          name: "NUMBERS Wise topics — بڑے سرچ موضوعات",
          description: numbersWiseSeoBlurb("Islamic & popular topics"),
          numberOfItems: NUMBERS_WISE_TERM_COUNT,
          itemListElement: NUMBERS_WISE_FEATURED.slice(0, 50).map((term, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: term,
            url: `${SITE_URL}/?search=${encodeURIComponent(term)}`,
          })),
        },
        {
          "@type": "ItemList",
          "@id": `${SITE_URL}/#joining-k-topics`,
          name: "Joining K topics — فیصل آباد کمیونٹیز",
          description: joiningKSeoBlurb("Faisalabad Islamic communities"),
          numberOfItems: JOINING_K_TERM_COUNT,
          itemListElement: JOINING_K_FEATURED.slice(0, 50).map((term, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: term,
            url: `${SITE_URL}/?search=${encodeURIComponent(term)}`,
          })),
        },
        {
          "@type": "ItemList",
          "@id": `${SITE_URL}/#name-id-topics`,
          name: "NAME ID search names — سرچ نام",
          description: nameIdSeoBlurb("Islamic & popular names"),
          numberOfItems: NAME_ID_TERM_COUNT,
          itemListElement: NAME_ID_FEATURED.slice(0, 50).map((term, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: term,
            url: `${SITE_URL}/?search=${encodeURIComponent(term)}`,
          })),
        },
        {
          "@type": "CollectionPage",
          "@id": `${SITE_URL}/#islamic-books-online`,
          name: "Islamic Books Online | اسلامی کتب آن لائن",
          url: SITE_URL,
          description: islamicBooksOnlineSeoBlurb(),
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: {
            "@type": "Thing",
            name: "Islamic books online",
            alternateName: ["اسلامی کتب آن لائن", "Buy Islamic books online"],
          },
        },
        {
          "@type": "CollectionPage",
          "@id": `${SITE_URL}/#jamaat-e-islami-faisalabad`,
          name: "Jamaat e Islami Faisalabad | جماعت اسلامی فیصل آباد",
          url: `${SITE_URL}/?search=${encodeURIComponent(JAMAAT_E_ISLAMI_FAISALABAD.searchQuery)}`,
          description: jamaatFaisalabadSeoBlurb(),
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: {
            "@type": "Organization",
            name: JAMAAT_E_ISLAMI_FAISALABAD.en,
            alternateName: [
              JAMAAT_E_ISLAMI_FAISALABAD.ur,
              "JI Faisalabad",
              "JI FSD",
              JAMAAT_E_ISLAMI.en,
              JAMAAT_E_ISLAMI.ur,
              ...JAMAAT_E_ISLAMI_FAISALABAD.aliases.slice(0, 6),
            ],
          },
        },
        {
          "@type": "CollectionPage",
          "@id": `${SITE_URL}/#jamaat-e-islami`,
          name: "Jamaat e Islami Faisalabad | جماعت اسلامی فیصل آباد",
          url: `${SITE_URL}/?search=${encodeURIComponent(JAMAAT_E_ISLAMI_FAISALABAD.searchQuery)}`,
          description: jamaatFaisalabadSeoBlurb(),
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: {
            "@type": "Organization",
            name: JAMAAT_E_ISLAMI_FAISALABAD.en,
            alternateName: [
              JAMAAT_E_ISLAMI_FAISALABAD.ur,
              JAMAAT_E_ISLAMI.en,
              JAMAAT_E_ISLAMI.ur,
              MAKTABA_JI_FAISALABAD.en,
            ],
          },
        },
        {
          "@type": "CollectionPage",
          "@id": `${SITE_URL}/#islam-islami-islamic`,
          name: "Islam | Islami | Islamic | Islamiat | اسلام اسلامی اسلامیات",
          url: `${SITE_URL}/?search=${encodeURIComponent(ISLAM_SEO.searchQuery)}`,
          description: islamSeoBlurb(),
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: {
            "@type": "Thing",
            name: "Islam",
            alternateName: [
              "اسلام",
              "Islami",
              "Islamic",
              "Islamiat",
              "اسلامی",
              "اسلامیات",
            ],
          },
        },
        {
          "@type": "CollectionPage",
          "@id": `${SITE_URL}/#ameer-jamaat-e-islami`,
          name: "Ameer Jamaat e Islami | امیر جماعت اسلامی",
          url: `${SITE_URL}/?search=${encodeURIComponent(AMEER_JAMAAT_E_ISLAMI.searchQuery)}`,
          description: ameerJamaatSeoBlurb(),
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: {
            "@type": "Role",
            name: "Ameer Jamaat e Islami",
            alternateName: [
              "امیر جماعت اسلامی",
              "Amir Jamaat e Islami",
              "Ameer JI",
              "امیرِ جماعت اسلامی",
              "جماعت اسلامی کے امیر",
            ],
          },
        },
        {
          "@type": "CollectionPage",
          "@id": `${SITE_URL}/#al-khidmat-foundation`,
          name: "Al Khidmat Foundation | الخدمت فاؤنڈیشن",
          url: `${SITE_URL}/?search=${encodeURIComponent(AL_KHIDMAT_FOUNDATION.searchQuery)}`,
          description: alKhidmatSeoBlurb(),
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: {
            "@type": "Organization",
            name: "Al Khidmat Foundation",
            alternateName: [
              "الخدمت فاؤنڈیشن",
              "Alkhidmat Foundation",
              "Al-Khidmat Foundation",
              "Al Khidmat FouDation",
              "الخدمت",
            ],
          },
        },
        {
          "@type": "CollectionPage",
          "@id": `${SITE_URL}/#bano-qabil`,
          name: "Bano Qabil | بنو قابل",
          url: `${SITE_URL}/?search=${encodeURIComponent(BANO_QABIL.searchQuery)}`,
          description: banoQabilSeoBlurb(),
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: {
            "@type": "Thing",
            name: "Bano Qabil",
            alternateName: [
              "بنو قابل",
              "Bano-e-Qabil",
              "Bano e Qabil",
              "Banu Qabil",
              "بنو قابل جماعت اسلامی",
            ],
          },
        },
        {
          "@type": "CollectionPage",
          "@id": `${SITE_URL}/#tarjuman-ul-quran`,
          name: "Tarjuman ul Quran | ترجمان القرآن",
          url: `${SITE_URL}/?search=${encodeURIComponent(TARJUMAN_UL_QURAN.searchQuery)}`,
          description: tarjumanSeoBlurb(),
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: {
            "@type": "Organization",
            name: "Idara Tarjuman ul Quran",
            alternateName: [
              "ترجمان القرآن",
              "Tarjumaan ul Quran",
              "Tarjuman ul Quran",
              "ادارہ ترجمان القرآن",
              "رسالہ ترجمان القرآن",
            ],
          },
        },
        {
          "@type": "CollectionPage",
          "@id": `${SITE_URL}/#tafheem-ul-quran`,
          name: "Tafheem ul Quran | تفہیم القرآن",
          url: `${SITE_URL}/?search=${encodeURIComponent(TAFHEEM_UL_QURAN.searchQuery)}`,
          description: tafheemSeoBlurb(),
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: {
            "@type": "Book",
            name: "Tafheem ul Quran",
            alternateName: ["تفہیم القرآن", "Tafheem-ul-Quran", "Towards Understanding the Quran"],
            author: {
              "@type": "Person",
              name: "Syed Abul A'la Maududi",
              alternateName: ["سید ابو الاعلی مودودی", "Maududi"],
            },
          },
        },
        {
          "@type": "CollectionPage",
          "@id": `${SITE_URL}/#maktaba-islamia`,
          name: "Maktaba Islamia Books | مکتبہ اسلامیہ کی کتابیں",
          url: `${SITE_URL}/?search=${encodeURIComponent(MAKTABA_ISLAMIA.searchQuery)}`,
          description: maktabaIslamiaSeoBlurb(),
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: {
            "@type": "Organization",
            name: "Maktaba Islamia",
            alternateName: ["مکتبہ اسلامیہ", "Maktabah Islamia"],
          },
        },
        {
          "@type": "ItemList",
          "@id": `${SITE_URL}/#topics`,
          name: "Quran, Para, Tarjuma, Hadees, Fiqa, Tarikh — Islamic book topics",
          description: "Browse Islamic books by topic at Maktaba Jamaat e Islami Faisalabad",
          numberOfItems: Object.keys(TOPIC_SEO).length,
          itemListElement: Object.values(TOPIC_SEO).map((t, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: t.label,
            url: `${SITE_URL}/?category=${t.id}`,
          })),
        },
        {
          "@type": "ItemList",
          "@id": `${SITE_URL}/#publishers`,
          name: "Islamic publishers available at Maktaba Jamaat e Islami Faisalabad",
          description: publishersSeoBlurb(),
          numberOfItems: PUBLISHER_SEO.length,
          itemListElement: PUBLISHER_SEO.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${p.en} / ${p.ur}`,
            url: `${SITE_URL}/?search=${encodeURIComponent(p.searchQuery || p.en)}`,
            item: {
              "@type": "Organization",
              name: p.en,
              alternateName: [p.ur, ...(p.aliases || []).slice(0, 3)],
            },
          })),
        },
        ...(data?.items?.length
          ? [
              {
                "@type": "ItemList",
                "@id": `${SITE_URL}/#books-page-${page}`,
                name:
                  category !== "all"
                    ? `${CATEGORY_LABELS[category] || category} books — page ${page}`
                    : search
                      ? `Search "${search}" — page ${page}`
                      : `Islamic books online — page ${page}`,
                numberOfItems: data.items.length,
                itemListElement: data.items.map((p, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: fullTitle(p),
                  url: absoluteUrl(productPath(p)),
                })),
              },
            ]
          : []),
      ],
    }),
    [data?.items, page, category, search]
  );

  const query = {
    page,
    limit: 24,
    category,
    sort,
    search,
    author: params.get("author") || "",
    language: params.get("language") || "",
    minPrice: params.get("minPrice") || "",
    maxPrice: params.get("maxPrice") || "",
    available: params.get("available") || "",
    onSale: params.get("onSale") || "",
  };

  const queryKey = JSON.stringify(query);

  const load = useCallback(async () => {
    const q = JSON.parse(queryKey);
    const cached = peekProducts(q);
    if (cached) {
      setData(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    setError("");
    try {
      const result = await fetchProducts(q);
      setData(result);
      setError("");
    } catch (e) {
      if (!peekProducts(q)) setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [queryKey]);

  useEffect(() => {
    wakeApi();
    const cachedFilters = peekFilters();
    if (cachedFilters) setFilters(cachedFilters);
    fetchFilters().then(setFilters).catch(() => {});
  }, []);

  useEffect(() => {
    const q = JSON.parse(queryKey);
    setDraft({
      category: q.category || "all",
      author: q.author,
      language: q.language,
      minPrice: q.minPrice,
      maxPrice: q.maxPrice,
      available: q.available,
      onSale: q.onSale,
    });
    setShowFilters(false);
    load();
  }, [load, queryKey]);

  useEffect(() => {
    document.body.style.overflow = showFilters ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showFilters]);

  const applyFilters = () => {
    const next = new URLSearchParams(params);
    ["author", "language", "minPrice", "maxPrice", "available", "onSale"].forEach((k) => {
      if (draft[k]) next.set(k, draft[k]);
      else next.delete(k);
    });
    if (draft.category && draft.category !== "all") next.set("category", draft.category);
    else next.delete("category");
    next.delete("publisher");
    next.delete("source");
    next.delete("page");
    setParams(next);
    setShowFilters(false);
    document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    if (search) next.set("search", search);
    setParams(next);
    setDraft({
      category: "all",
      author: "",
      language: "",
      minPrice: "",
      maxPrice: "",
      available: "",
      onSale: "",
    });
    setShowFilters(false);
  };

  const setPage = (p) => {
    const next = new URLSearchParams(params);
    next.set("page", String(p));
    setParams(next);
  };

  const setSort = (e) => {
    const next = new URLSearchParams(params);
    next.set("sort", e.target.value);
    next.delete("page");
    setParams(next);
  };

  const showGrid = !error && data?.items?.length > 0;
  const showEmpty = !loading && !error && data?.items?.length === 0;
  const showSkeleton = loading && !data?.items?.length;

  const categoryLabel = CATEGORY_LABELS[category] || category;
  const seoTitle = homeSeoTitle({ category, search, page });
  const seoDescription = homeSeoDescription({ category, search, page });
  const seoKeywords = homeKeywords({ category, search });

  const seoPath =
    search || category !== "all" || page > 1
      ? `${location.pathname}${location.search}`
      : "/";

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        path={seoPath}
        jsonLd={homeJsonLd}
        jsonLdId="home-jsonld"
      />
      <section className="hero hero-compact">
        <div className="container">
          <p className="hero-brand">{SITE_NAME}</p>
          <h1>Islam | Islami | Islamic | Islamiat | اسلام اسلامی اسلامیات</h1>
          <p>
            اسلام، اسلامی اور اسلامیات کی کتب آن لائن — مکتبہ جماعت اسلامی فیصل آباد۔ WhatsApp{" "}
            {SITE_PHONE_DISPLAY}
          </p>
        </div>
      </section>

      <div className="container page-layout">
        {showFilters && (
          <button
            type="button"
            className="filter-backdrop"
            aria-label="Close filters"
            onClick={() => setShowFilters(false)}
          />
        )}
        <div className={`sidebar-wrap ${showFilters ? "open" : ""}`}>
          <Sidebar
            filters={filters}
            values={draft}
            onChange={setDraft}
            onApply={applyFilters}
            onClear={clearFilters}
            onClose={() => setShowFilters(false)}
          />
        </div>

        <main id="products-section" ref={productsRef} className="products-main">
          <div className="collection-header">
            <h2 className="collection-heading">
              {category === "all" && !search
                ? "اسلام اسلامی اسلامیات / Islam Islami Islamic Islamiat"
                : `Collection: ${CATEGORY_LABELS[category] || category}`}
            </h2>
            <div className="collection-meta">
              <span className="product-count">
                {loading && !data ? "Loading..." : `${data?.total ?? 0} products`}
              </span>
              <div className="toolbar-actions">
                <button
                  type="button"
                  className="btn btn-outline filter-toggle"
                  onClick={() => setShowFilters((v) => !v)}
                >
                  {showFilters ? "Hide filters" : "Filter & sort"}
                </button>
                <div className="sort-bar">
                  <label>
                    Sort:{" "}
                    <select value={sort} onChange={setSort}>
                      <option value="featured">Featured</option>
                      <option value="title-asc">A-Z</option>
                      <option value="title-desc">Z-A</option>
                      <option value="price-asc">Price ↑</option>
                      <option value="price-desc">Price ↓</option>
                      <option value="newest">Newest</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          {loading && data?.items?.length > 0 && (
            <p className="loading-inline">Updating books...</p>
          )}

          {showSkeleton && (
            <div className="product-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          )}

          {showEmpty && <p className="empty">No products found. Try changing filters.</p>}

          {showGrid && (
            <>
              <div className={`product-grid ${loading ? "loading-blur" : ""}`}>
                {data.items.map((p, i) => (
                  <ProductCard key={p._id} product={p} priority={i < 4} />
                ))}
              </div>
              <Pagination page={data.page} pages={data.pages} onChange={setPage} />
            </>
          )}
        </main>
      </div>

      <section
        className="seo-featured-publisher container"
        aria-label="Maktaba Jamaat e Islami Faisalabad"
      >
        <h2>Maktaba Jamaat e Islami Faisalabad / مکتبہ جماعت اسلامی فیصل آباد</h2>
        <p>
          {maktabaJiSeoBlurb()} دفتر جماعت اسلامی، گلی نمبر 8، چنیوٹ بازار، فیصل آباد۔ WhatsApp{" "}
          {SITE_PHONE_DISPLAY}.
        </p>
        <p>
          <a className="seo-featured-link" href="/">
            مکتبہ جماعت اسلامی فیصل آباد — Home
          </a>
          {" · "}
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent(MAKTABA_JI_FAISALABAD.searchQuery)}`}
          >
            Search Maktaba Jamaat e Islami
          </a>
        </p>
      </section>

      <section className="seo-featured-publisher container" aria-label="Senator Mushtaq Ahmad Khan books">
        <h2>Senator Mushtaq Ahmad Khan / سینیٹر مشتاق احمد خان</h2>
        <p>
          {mushtaqAhmadKhanSeoBlurb()} مشتاق احمد خان (Senotor Mushtaq) کی کتب تلاش کریں۔ WhatsApp{" "}
          {SITE_PHONE_DISPLAY}.
        </p>
        <p>
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent(MUSHTAQ_AHMAD_KHAN.searchQuery)}`}
          >
            Browse Mushtaq Ahmad Khan books / مشتاق احمد خان کی کتابیں
          </a>
        </p>
      </section>

      <section className="seo-featured-publisher container" aria-label="Munawar Hassan books">
        <h2>Munawar Hassan / منور حسن</h2>
        <p>
          {munawarHassanSeoBlurb()} منور حسن (Munar Hassan) کی کتب تلاش کریں۔ WhatsApp{" "}
          {SITE_PHONE_DISPLAY}.
        </p>
        <p>
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent(MUNAWAR_HASSAN.searchQuery)}`}
          >
            Browse Munawar Hassan books / منور حسن کی کتابیں
          </a>
        </p>
      </section>

      <section className="seo-featured-publisher container" aria-label="Mian Muhammad Tufail books">
        <h2>Mian Muhammad Tufail / میاں محمد طفیل</h2>
        <p>
          {mianMuhammadTufailSeoBlurb()} میاں محمد طفیل (Fufail) کی کتب تلاش کریں۔ WhatsApp{" "}
          {SITE_PHONE_DISPLAY}.
        </p>
        <p>
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent(MIAN_MUHAMMAD_TUFAIL.searchQuery)}`}
          >
            Browse Mian Muhammad Tufail books / میاں محمد طفیل کی کتابیں
          </a>
        </p>
      </section>

      <section className="seo-featured-publisher container" aria-label="Qazi Hussain Ahmad books">
        <h2>Qazi Hussain Ahmad / قاضی حسین احمد</h2>
        <p>
          {qaziHussainAhmadSeoBlurb()} قاضی حسین احمد کی کتب تلاش کریں۔ WhatsApp {SITE_PHONE_DISPLAY}.
        </p>
        <p>
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent(QAZI_HUSSAIN_AHMAD.searchQuery)}`}
          >
            Browse Qazi Hussain Ahmad books / قاضی حسین احمد کی کتابیں
          </a>
        </p>
      </section>

      <section className="seo-featured-publisher container" aria-label="Siraj ul Haq books">
        <h2>Siraj ul Haq / سراج الحق</h2>
        <p>
          {sirajUlHaqSeoBlurb()} سراج الحق کی کتب تلاش کریں۔ WhatsApp {SITE_PHONE_DISPLAY}.
        </p>
        <p>
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent(SIRAJ_UL_HAQ.searchQuery)}`}
          >
            Browse Siraj ul Haq books / سراج الحق کی کتابیں
          </a>
        </p>
      </section>

      <section className="seo-featured-publisher container" aria-label="Hafiz Naeem ur Rehman books">
        <h2>Hafiz Naeem ur Rehman / حافظ نعیم الرحمٰن</h2>
        <p>
          {hafizNaeemSeoBlurb()} حافظ نعیم کی کتب تلاش کریں۔ WhatsApp {SITE_PHONE_DISPLAY}.
        </p>
        <p>
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent(HAFIZ_NAEEM.searchQuery)}`}
          >
            Browse Hafiz Naeem books / حافظ نعیم کی کتابیں
          </a>
        </p>
      </section>

      <section className="seo-featured-publisher container" aria-label="Maulana Maududi books">
        <h2>Maulana Maududi / مولانا مودودی</h2>
        <p>
          {maududiSeoBlurb()} Molana Maododi / Maulana Maududi کی کتب تلاش کریں۔ WhatsApp{" "}
          {SITE_PHONE_DISPLAY}.
        </p>
        <p>
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent(MAULANA_MAUDUDI.searchQuery)}`}
          >
            Browse Maududi books / مودودی کی کتابیں
          </a>
          {" · "}
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent(TAFHEEM_UL_QURAN.searchQuery)}`}
          >
            Tafheem ul Quran / تفہیم القرآن
          </a>
        </p>
      </section>

      <section className="seo-featured-publisher container" aria-label="Mansoora Lahore books">
        <h2>Mansoora Lahore / منصورہ لاہور</h2>
        <p>
          {mansooraLahoreSeoBlurb()} Mansoorah / Mansura کی کتب تلاش کریں۔ WhatsApp {SITE_PHONE_DISPLAY}.
        </p>
        <p>
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent(MANSOORA_LAHORE.searchQuery)}`}
          >
            Search Mansoora Lahore / منصورہ لاہور
          </a>
          {" · "}
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent("منصورہ لاہور")}`}
          >
            اردو تلاش
          </a>
        </p>
      </section>

      <section className="seo-featured-publisher container" aria-label="Faisalabad Islamic books">
        <h2>Islamic Books Faisalabad / اسلامی کتب فیصل آباد</h2>
        <p>
          {faisalabadSeoBlurb()} دفتر: گلی نمبر 8، چنیوٹ بازار۔ WhatsApp {SITE_PHONE_DISPLAY}.
        </p>
        <p>
          <a className="seo-featured-link" href="/">
            Islamic books Faisalabad / اسلامی کتب فیصل آباد
          </a>
          {" · "}
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent(FAISALABAD_SEO.searchQuery)}`}
          >
            Search Faisalabad
          </a>
        </p>
      </section>

      <section className="seo-featured-publisher container" aria-label="Islamic books online">
        <h2>Islamic Books Online / اسلامی کتب آن لائن</h2>
        <p>
          {islamicBooksOnlineSeoBlurb()} {SITE_NAME} سے پاکستان بھر میں اسلامی کتب WhatsApp پر آرڈر کریں{" "}
          {SITE_PHONE_DISPLAY}.
        </p>
        <p>
          <a className="seo-featured-link" href="/">
            Shop Islamic books online / اسلامی کتب آن لائن خریدیں
          </a>
          {" · "}
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent(ISLAMIC_BOOKS_ONLINE.searchQuery)}`}
          >
            Search Islamic books
          </a>
        </p>
      </section>

      <section className="seo-featured-publisher container" aria-label="Jamaat e Islami Faisalabad">
        <h2>Jamaat e Islami Faisalabad / جماعت اسلامی فیصل آباد</h2>
        <p>
          {jamaatFaisalabadSeoBlurb()} مکتبہ جماعت اسلامی سے اسلامی کتب WhatsApp پر آرڈر کریں{" "}
          {SITE_PHONE_DISPLAY}.
        </p>
        <p>
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent(JAMAAT_E_ISLAMI_FAISALABAD.searchQuery)}`}
          >
            Search Jamaat e Islami Faisalabad / جماعت اسلامی فیصل آباد
          </a>
          {" · "}
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent(JAMAAT_E_ISLAMI.searchQuery)}`}
          >
            Search Jamaat e Islami / جماعت اسلامی
          </a>
        </p>
      </section>

      <section className="seo-featured-publisher container" aria-label="Islam Islami Islamic Islamiat books">
        <h2>Islam / Islami / Islamic / Islamiat — اسلام / اسلامی / اسلامیات</h2>
        <p>
          {islamSeoBlurb()} اسلام، اسلامی اور اسلامیات کی کتب تلاش کریں۔ WhatsApp {SITE_PHONE_DISPLAY}.
        </p>
        <p>
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent(ISLAM_SEO.searchQuery)}`}
          >
            Search Islam / اسلام
          </a>
          {" · "}
          <a className="seo-featured-link" href={`/?search=${encodeURIComponent("Islami")}`}>
            Islami / اسلامی
          </a>
          {" · "}
          <a className="seo-featured-link" href={`/?search=${encodeURIComponent("Islamic")}`}>
            Islamic
          </a>
          {" · "}
          <a className="seo-featured-link" href={`/?search=${encodeURIComponent("Islamiat")}`}>
            Islamiat / اسلامیات
          </a>
        </p>
      </section>

      <section className="seo-featured-publisher container" aria-label="Ameer Jamaat e Islami books">
        <h2>Ameer Jamaat e Islami / امیر جماعت اسلامی</h2>
        <p>
          {ameerJamaatSeoBlurb()} امیر جماعت اسلامی (Ameer / Amir JI) سے وابستہ کتب تلاش کریں۔ WhatsApp{" "}
          {SITE_PHONE_DISPLAY}.
        </p>
        <p>
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent(AMEER_JAMAAT_E_ISLAMI.searchQuery)}`}
          >
            Browse Ameer Jamaat e Islami / امیر جماعت اسلامی
          </a>
          {" · "}
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent("امیر جماعت اسلامی")}`}
          >
            اردو تلاش
          </a>
        </p>
      </section>

      <section className="seo-featured-publisher container" aria-label="Al Khidmat Foundation books">
        <h2>Al Khidmat Foundation / الخدمت فاؤنڈیشن</h2>
        <p>
          {alKhidmatSeoBlurb()} الخدمت فاؤنڈیشن (Al Khidmat FouDation) سے وابستہ کتب تلاش کریں۔ WhatsApp{" "}
          {SITE_PHONE_DISPLAY}.
        </p>
        <p>
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent(AL_KHIDMAT_FOUNDATION.searchQuery)}`}
          >
            Browse Al Khidmat Foundation / الخدمت فاؤنڈیشن
          </a>
          {" · "}
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent("الخدمت فاؤنڈیشن")}`}
          >
            اردو تلاش
          </a>
        </p>
      </section>

      <section className="seo-featured-publisher container" aria-label="Bano Qabil books">
        <h2>Bano Qabil / بنو قابل</h2>
        <p>
          {banoQabilSeoBlurb()} بنو قابل (Bano-e-Qabil) سے وابستہ کتب تلاش کریں۔ WhatsApp{" "}
          {SITE_PHONE_DISPLAY}.
        </p>
        <p>
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent(BANO_QABIL.searchQuery)}`}
          >
            Browse Bano Qabil / بنو قابل
          </a>
          {" · "}
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent("بنو قابل")}`}
          >
            اردو تلاش
          </a>
        </p>
      </section>

      <section className="seo-featured-publisher container" aria-label="Tarjuman ul Quran">
        <h2>Tarjuman ul Quran / ترجمان القرآن</h2>
        <p>
          {tarjumanSeoBlurb()} ادارہ ترجمان القرآن (Tarjumaan) کی کتب اور رسائل تلاش کریں۔ WhatsApp{" "}
          {SITE_PHONE_DISPLAY}.
        </p>
        <p>
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent(TARJUMAN_UL_QURAN.searchQuery)}`}
          >
            Browse Tarjuman ul Quran / ترجمان القرآن دیکھیں
          </a>
          {" · "}
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent("ترجمان القرآن")}`}
          >
            اردو تلاش
          </a>
        </p>
      </section>

      <section className="seo-featured-publisher container" aria-label="Tafheem ul Quran">
        <h2>Tafheem ul Quran / تفہیم القرآن</h2>
        <p>
          {tafheemSeoBlurb()} سید ابو الاعلی مودودی کی مشہور تفسیر — جلدیں تلاش کریں یا نیچے لنک کھولیں۔
          WhatsApp {SITE_PHONE_DISPLAY}.
        </p>
        <p>
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent(TAFHEEM_UL_QURAN.searchQuery)}`}
          >
            Browse Tafheem ul Quran / تفہیم القرآن دیکھیں
          </a>
          {" · "}
          <a className="seo-featured-link" href="/?category=tafseer">
            All Tafseer / تمام تفاسیر
          </a>
        </p>
      </section>

      <section className="seo-featured-publisher container" aria-label="Maktaba Islamia books">
        <h2>Maktaba Islamia / مکتبہ اسلامیہ</h2>
        <p>
          {maktabaIslamiaSeoBlurb()} {SITE_NAME} پر Maktaba Islamia کی اصل اسلامی کتب دستیاب ہیں — search
          کریں یا نیچے لنک کھولیں۔ WhatsApp {SITE_PHONE_DISPLAY}.
        </p>
        <p>
          <a
            className="seo-featured-link"
            href={`/?search=${encodeURIComponent(MAKTABA_ISLAMIA.searchQuery)}`}
          >
            Browse Maktaba Islamia books / مکتبہ اسلامیہ کی کتابیں دیکھیں
          </a>
        </p>
      </section>

      <section className="seo-topics container" aria-label="Book topics">
        <h2>Quran · Para · Tarjuma · Hadees · Fiqa · Tarikh</h2>
        <p>
          {SITE_NAME} سے قرآن، پارہ / سیپارہ، ترجمہ قرآن، حدیث، فقہ (Fiqa) اور تاریخ (Tarikh) کی کتب
          آن لائن آرڈر کریں۔ Search in اردو or English.
        </p>
        <ul className="seo-topics-list">
          {Object.values(TOPIC_SEO).map((t) => (
            <li key={t.id}>
              <a href={`/?category=${t.id}`}>{t.label}</a>
            </li>
          ))}
        </ul>
      </section>

      <section className="seo-publishers container" aria-label="Islamic publishers">
        <h2>Islamic Publishers / اسلامی پبلیشرز</h2>
        <p>
          {SITE_NAME} پر <strong>Maktaba Islamia (مکتبہ اسلامیہ)</strong>، Islamic Publications، Idara
          Tarjuman ul Quran، Darussalam، Manshurat، NBF، Taj Quran، IMT Books اور دیگر اداروں کی کتب
          دستیاب ہیں۔ Order on WhatsApp {SITE_PHONE_DISPLAY}.
        </p>
        <ul className="seo-publishers-list">
          {PUBLISHER_SEO.map((p) => (
            <li key={p.id}>
              <a href={`/?search=${encodeURIComponent(p.searchQuery || p.en)}`}>
                <strong>{p.en}</strong>
                <span lang="ur" dir="rtl">
                  {" "}
                  — {p.ur}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
