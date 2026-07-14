/**
 * Core commercial SEO: Islamic books online / اسلامی کتب آن لائن
 */

export const ISLAMIC_BOOKS_ONLINE = {
  id: "islamic-books-online",
  en: "Islamic books online",
  ur: "اسلامی کتب آن لائن",
  searchQuery: "Islamic books",
  aliases: [
    "Islamic books Online",
    "Islamic Books Online",
    "buy Islamic books online",
    "Buy Islamic books online Pakistan",
    "Islamic books online Pakistan",
    "Islamic books online Faisalabad",
    "Islamic book store online",
    "Online Islamic books",
    "order Islamic books online",
    "Islamic bookstore Pakistan",
    "اسلامی کتب آن لائن",
    "اسلامی کتب آن لائن پاکستان",
    "اسلامی کتب آن لائن فیصل آباد",
    "اسلامی کتاب آن لائن",
    "اسلامی کتب خریدیں",
    "اسلامی کتب آن لائن خریدیں",
    "آن لائن اسلامی کتب",
    "اسلامی کتب آرڈر",
    "اسلامی کتابیں آن لائن",
  ],
};

export function islamicBooksOnlineKeywords() {
  return [
    ISLAMIC_BOOKS_ONLINE.en,
    ISLAMIC_BOOKS_ONLINE.ur,
    ...ISLAMIC_BOOKS_ONLINE.aliases,
    "Islamic books WhatsApp order",
    "اسلامی کتب واٹس ایپ آرڈر",
  ];
}

export function islamicBooksOnlineSeoBlurb() {
  return (
    "Buy Islamic books online (اسلامی کتب آن لائن) from Maktaba Jamaat e Islami Faisalabad. " +
    "پاکستان سے اسلامی کتب آن لائن آرڈر کریں — WhatsApp پر فوری آرڈر۔"
  );
}

export function isIslamicBooksOnlineQuery(search = "") {
  const s = String(search || "").toLowerCase();
  return (
    /islamic\s*books?\s*(online)?|buy\s*islamic\s*books|online\s*islamic\s*books/.test(s) ||
    /اسلامی\s*کتب(\s*آن\s*لائن)?|اسلامی\s*کتاب|آن\s*لائن\s*اسلامی/.test(search || "")
  );
}
