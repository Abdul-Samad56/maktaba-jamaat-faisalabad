/**
 * Highlight matched search terms inside a string.
 * Returns an array of React-ready { text, match } segments.
 */
export function splitHighlight(text, terms = []) {
  const source = String(text || "");
  if (!source || !terms?.length) return [{ text: source, match: false }];

  const cleaned = [...new Set(terms.map((t) => String(t || "").trim()).filter((t) => t.length >= 1))];
  if (!cleaned.length) return [{ text: source, match: false }];

  // Longest-first so "مولانا مودودی" wins over "مودودی"
  cleaned.sort((a, b) => b.length - a.length);

  const escaped = cleaned.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  let re;
  try {
    re = new RegExp(`(${escaped.join("|")})`, "gi");
  } catch {
    return [{ text: source, match: false }];
  }

  const parts = source.split(re);
  return parts.filter(Boolean).map((part) => ({
    text: part,
    match: cleaned.some((t) => t.toLowerCase() === part.toLowerCase() || part.includes(t)),
  }));
}
