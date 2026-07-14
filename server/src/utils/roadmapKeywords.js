/**
 * Server-side mirror of client expandRoadmapKeywords (200 variants per seed).
 */
export function expandRoadmapKeywords(term, limit = 200) {
  const t = String(term || "").trim();
  if (!t) return [];

  const enSuffixes = [
    "books", "book", "Islamic books", "books online", "buy books", "order books",
    "WhatsApp order", "Faisalabad", "FSD", "Pakistan", "Maktaba Jamaat e Islami",
    "Islamic bookstore", "delivery", "Urdu books", "author", "biography", "kitab",
  ];
  const urSuffixes = [
    "کی کتابیں", "کی کتب", "کتاب", "اسلامی کتب", "آن لائن آرڈر", "واٹس ایپ آرڈر",
    "فیصل آباد", "مکتبہ جماعت اسلامی", "سستی کتابیں", "بیان", "خطبات",
  ];
  const prefixes = ["Buy", "Order", "Online", "Best", "خریدیں", "آرڈر کریں", "آن لائن"];

  const out = [];
  const seen = new Set();
  const push = (k) => {
    const s = String(k || "").trim();
    if (!s) return;
    const key = s.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(s);
  };

  push(t);
  push(`${t} books`);
  push(`${t} کی کتابیں`);
  for (const s of enSuffixes) push(`${t} ${s}`);
  for (const s of urSuffixes) push(`${t} ${s}`);
  for (const p of prefixes) push(`${p} ${t}`);
  for (const p of prefixes) push(`${p} ${t} books`);

  const fillers = [
    "in Faisalabad", "Pakistan delivery", "COD", "WhatsApp 0321-5315603",
    "Chiniot Bazar", "چنیوٹ بازار", "Islamic Publications", "for students",
  ];
  let i = 1;
  while (out.length < limit) {
    if (i <= fillers.length) push(`${t} ${fillers[i - 1]}`);
    else {
      push(`${t} books online ${i}`);
      push(`${t} کی کتابیں ${i}`);
    }
    i += 1;
    if (i > 120) break;
  }
  return out.slice(0, limit);
}
