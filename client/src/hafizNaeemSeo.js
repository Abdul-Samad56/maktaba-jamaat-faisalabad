/**
 * Author / personality SEO: Hafiz Naeem ur Rehman / حافظ نعیم الرحمٰن
 */

export const HAFIZ_NAEEM = {
  id: "hafiz-naeem",
  en: "Hafiz Naeem ur Rehman",
  ur: "حافظ نعیم الرحمٰن",
  searchQuery: "Hafiz Naeem",
  aliases: [
    "Hafiz Naeem",
    "Hafiz Naeem ur Rehman",
    "Hafiz Naeem-ur-Rehman",
    "Hafiz Naeem ur Rahman",
    "Hafiz Naeem-ur-Rahman",
    "Hafiz Naeem Rehman",
    "Hafiz Naeem Rahman",
    "Hafez Naeem",
    "Hafiz Naeem Jamaat e Islami",
    "Hafiz Naeem books",
    "Buy Hafiz Naeem books",
    "حافظ نعیم",
    "حافظ نعیم الرحمٰن",
    "حافظ نعیم الرحمن",
    "حافظ نعیم الرحمان",
    "حافظ نعیم الرحمٰن کی کتابیں",
    "حافظ نعیم کی کتب",
    "حافظ نعیم آن لائن",
    "حافظ نعیم خریدیں",
    "حافظ نعیم جماعت اسلامی",
  ],
};

export function hafizNaeemKeywords() {
  return [
    HAFIZ_NAEEM.en,
    HAFIZ_NAEEM.ur,
    ...HAFIZ_NAEEM.aliases,
    "Hafiz Naeem ur Rehman books online",
    "حافظ نعیم الرحمٰن کی کتابیں آن لائن",
  ];
}

export function hafizNaeemSeoBlurb() {
  return (
    "Buy Hafiz Naeem ur Rehman (حافظ نعیم الرحمٰن) books and related Islamic titles online " +
    "from Maktaba Jamaat e Islami Faisalabad. حافظ نعیم کی کتب آن لائن آرڈر کریں۔"
  );
}

export function isHafizNaeemQuery(search = "") {
  const s = String(search || "").toLowerCase();
  return (
    /hafiz\s*naeem|hafez\s*naeem|naeem\s*ur[\s-]*reh?man|naeem\s*rehman/.test(s) ||
    /حافظ\s*نعیم|نعیم\s*الرحم/.test(search || "")
  );
}
