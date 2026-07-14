/**
 * Author SEO: Maulana Maududi / مولانا مودودی
 * (common misspellings: Molana, Maododi, Modudi…)
 */

export const MAULANA_MAUDUDI = {
  id: "maulana-maududi",
  en: "Maulana Maududi",
  ur: "مولانا مودودی",
  searchQuery: "Maududi",
  aliases: [
    "Maulana Maududi",
    "Molana Maududi",
    "Molana Maododi",
    "Maulana Maododi",
    "Syed Abul A'la Maududi",
    "Abul Ala Maududi",
    "Abul A'la Maududi",
    "Sayyid Abul A'la Maududi",
    "Maududi",
    "Mawdudi",
    "Modudi",
    "Maododi",
    "Moududi",
    "Maulana Syed Abul Aala Maududi",
    "Maududi books",
    "Buy Maududi books",
    "Maududi Islamic books",
    "Maududi Faisalabad",
    "مولانا مودودی",
    "سید ابو الاعلی مودودی",
    "ابو الاعلی مودودی",
    "مودودی",
    "مولانا مودودی کی کتابیں",
    "مودودی کی کتب",
    "مودودی آن لائن",
    "مودودی خریدیں",
    "تفہیم القرآن مودودی",
  ],
};

export function maududiKeywords() {
  return [
    MAULANA_MAUDUDI.en,
    MAULANA_MAUDUDI.ur,
    ...MAULANA_MAUDUDI.aliases,
    "Maulana Maududi books online",
    "مولانا مودودی کی کتابیں آن لائن",
  ];
}

export function maududiSeoBlurb() {
  return (
    "Buy Maulana Maududi (مولانا مودودی / Syed Abul A'la Maududi) books online — " +
    "including Tafheem ul Quran — from Maktaba Jamaat e Islami Faisalabad. " +
    "مودودی کی اسلامی کتب آن لائن آرڈر کریں۔"
  );
}

export function isMaududiQuery(search = "") {
  const s = String(search || "").toLowerCase();
  return (
    /maududi|mawdudi|modudi|maododi|moududi|abul\s*a'?la|abul\s*ala/.test(s) ||
    /مودودی|مولانا\s*مودودی|ابو\s*الاعلی/.test(search || "")
  );
}
