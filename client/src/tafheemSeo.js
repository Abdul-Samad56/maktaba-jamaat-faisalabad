/**
 * High-priority book SEO: Tafheem ul Quran / تفہیم القرآن (Maududi)
 */

export const TAFHEEM_UL_QURAN = {
  id: "tafheem-ul-quran",
  en: "Tafheem ul Quran",
  ur: "تفہیم القرآن",
  searchQuery: "Tafheem ul Quran",
  category: "tafseer",
  aliases: [
    "Tafheem-ul-Quran",
    "Tafheemul Quran",
    "Tafheem al Quran",
    "Tafhim ul Quran",
    "Tafhimul Quran",
    "Tafheem Quran",
    "Towards Understanding the Quran",
    "Tafheem ul Quran Maududi",
    "Tafheem ul Quran books",
    "Buy Tafheem ul Quran",
    "Tafheem ul Quran online",
    "Tafheem ul Quran Pakistan",
    "Tafheem ul Quran Faisalabad",
    "تفہیم القرآن",
    "تفهيم القرآن",
    "تفہیم القرآن کی کتابیں",
    "تفہیم القرآن خریدیں",
    "تفہیم القرآن آن لائن",
    "تفہیم القرآن پاکستان",
    "تفہیم القرآن فیصل آباد",
    "تفہیم القرآن مودودی",
    "سید ابو الاعلی مودودی تفہیم",
  ],
};

export function tafheemKeywords() {
  return [
    TAFHEEM_UL_QURAN.en,
    TAFHEEM_UL_QURAN.ur,
    ...TAFHEEM_UL_QURAN.aliases,
    "Tafseer Tafheem ul Quran",
    "تفسير تفہیم القرآن",
    "Maududi Tafheem",
    "مودودی تفسیر",
  ];
}

export function tafheemSeoBlurb() {
  return (
    "Buy Tafheem ul Quran (تفہیم القرآن) by Syed Abul A'la Maududi online from " +
    "Maktaba Jamaat e Islami Faisalabad. تفہیم القرآن کی مکمل جلدیں آن لائن آرڈر کریں۔"
  );
}

export function isTafheemQuery(search = "") {
  const s = String(search || "").toLowerCase();
  return /tafheem|tafhim|تفہیم|تفهيم|towards understanding the quran/.test(s);
}
