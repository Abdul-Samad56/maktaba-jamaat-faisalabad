export const SITE_NAME = "Maktaba Jamaat e Islami Faisalabad";
export const SITE_URL = "https://maktaba-jamaat-e-islami-faisalabad.vercel.app";
export const SITE_PHONE = "+923215315603";
export const SITE_PHONE_DISPLAY = "0321-5315603";
export const SITE_WHATSAPP = "923215315603";
export const SITE_ADDRESS = "دفتر جماعت اسلامی، گلی نمبر 8، چنیوٹ بازار، فیصل آباد";
export const SITE_CITY = "Faisalabad";
export const SITE_REGION = "Punjab";
export const SITE_COUNTRY = "PK";
export const SITE_DEFAULT_DESCRIPTION =
  "Islamic books for Faisalabad areas — Madina Town, People's Colony, Gulberg, D Ground, Susan Road, G.M. Abad (اسلام، اسلامی، اسلامیات) from Maktaba Jamaat e Islami. WhatsApp 0321-5315603.";
export const SITE_KEYWORDS =
  "Faisalabad, فیصل آباد, Madina Town, مدینہ ٹاؤن, People's Colony, پیپلز کالونی, Gulberg, گلبرگ, D Ground, ڈی گراؤنڈ, Susan Road, سوسن روڈ, Ghulam Muhammad Abad, غلام محمد آباد, Chiniot Bazaar, چنیوٹ بازار, Islam, Islamic, Islamiat, اسلام, اسلامی, اسلامیات, Maktaba Jamaat e Islami Faisalabad, مکتبہ جماعت اسلامی فیصل آباد, WhatsApp book order 0321-5315603";

export function absoluteUrl(path = "/") {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(text, max = 155) {
  const s = String(text || "").trim();
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1).trim()}…`;
}
