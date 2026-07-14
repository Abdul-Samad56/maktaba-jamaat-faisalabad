/**
 * Personality SEO: Syed Munawar Hassan / منور حسن
 * (common misspellings: Munar, Munawwar…)
 */

export const MUNAWAR_HASSAN = {
  id: "munawar-hassan",
  en: "Munawar Hassan",
  ur: "منور حسن",
  searchQuery: "Munawar Hassan",
  aliases: [
    "Munawar Hassan",
    "Munawwar Hassan",
    "Munar Hassan",
    "Munawar Hasan",
    "Munawwar Hasan",
    "Syed Munawar Hassan",
    "Syed Munawwar Hassan",
    "Munawar Hassan Jamaat e Islami",
    "Munawar Hassan books",
    "Buy Munawar Hassan books",
    "منور حسن",
    "سید منور حسن",
    "منور حسن صاحب",
    "منور حسن جماعت اسلامی",
    "منور حسن کی کتابیں",
    "منور حسن کی کتب",
    "منور حسن آن لائن",
    "منور حسن خریدیں",
  ],
};

export function munawarHassanKeywords() {
  return [
    MUNAWAR_HASSAN.en,
    MUNAWAR_HASSAN.ur,
    ...MUNAWAR_HASSAN.aliases,
    "Munawar Hassan books online",
    "منور حسن کی کتابیں آن لائن",
  ];
}

export function munawarHassanSeoBlurb() {
  return (
    "Buy Munawar Hassan (منور حسن / Syed Munawar Hassan) related Islamic books online from " +
    "Maktaba Jamaat e Islami Faisalabad. منور حسن کی کتب آن لائن آرڈر کریں۔"
  );
}

export function isMunawarHassanQuery(search = "") {
  const s = String(search || "").toLowerCase();
  return (
    /munaw+ar\s*hass?an|munar\s*hass?an|syed\s*munaw+ar/.test(s) ||
    /منور\s*حسن|سید\s*منور\s*حسن/.test(search || "")
  );
}
