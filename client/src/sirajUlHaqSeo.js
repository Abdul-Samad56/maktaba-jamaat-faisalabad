/**
 * Personality SEO: Siraj ul Haq / سراج الحق
 */

export const SIRAJ_UL_HAQ = {
  id: "siraj-ul-haq",
  en: "Siraj ul Haq",
  ur: "سراج الحق",
  searchQuery: "Siraj ul Haq",
  aliases: [
    "Siraj ul Haq",
    "Sirajul Haq",
    "Siraj-ul-Haq",
    "Siraj ul Haque",
    "Siraj-ul-Haque",
    "Senator Siraj ul Haq",
    "Siraj ul Haq Jamaat e Islami",
    "Siraj ul Haq books",
    "Buy Siraj ul Haq books",
    "سراج الحق",
    "سراج الحق صاحب",
    "سینیٹر سراج الحق",
    "سراج الحق جماعت اسلامی",
    "سراج الحق کی کتابیں",
    "سراج الحق کی کتب",
    "سراج الحق آن لائن",
    "سراج الحق خریدیں",
  ],
};

export function sirajUlHaqKeywords() {
  return [
    SIRAJ_UL_HAQ.en,
    SIRAJ_UL_HAQ.ur,
    ...SIRAJ_UL_HAQ.aliases,
    "Siraj ul Haq books online",
    "سراج الحق کی کتابیں آن لائن",
  ];
}

export function sirajUlHaqSeoBlurb() {
  return (
    "Buy Siraj ul Haq (سراج الحق) related Islamic books online from Maktaba Jamaat e Islami Faisalabad. " +
    "سراج الحق کی کتب آن لائن آرڈر کریں۔"
  );
}

export function isSirajUlHaqQuery(search = "") {
  const s = String(search || "").toLowerCase();
  return (
    /siraj[\s-]*ul[\s-]*haq|sirajul\s*haq|siraj[\s-]*ul[\s-]*haque/.test(s) ||
    /سراج\s*الحق/.test(search || "")
  );
}
