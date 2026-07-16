/**
 * Fuzzy / typo-tolerant helpers (Levenshtein + soft regex).
 * Used when Atlas Search is unavailable or as a post-rank scorer.
 */
import { escapeRegex, normalizeSearch } from "./normalize.js";

/**
 * Classic Levenshtein edit distance.
 */
export function levenshtein(a, b) {
  const s = String(a || "");
  const t = String(b || "");
  if (s === t) return 0;
  if (!s.length) return t.length;
  if (!t.length) return s.length;

  const rows = s.length + 1;
  const cols = t.length + 1;
  const prev = new Array(cols);
  const curr = new Array(cols);

  for (let j = 0; j < cols; j++) prev[j] = j;

  for (let i = 1; i < rows; i++) {
    curr[0] = i;
    for (let j = 1; j < cols; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j < cols; j++) prev[j] = curr[j];
  }
  return prev[cols - 1];
}

/**
 * Max allowed edits for a token length (typo tolerance).
 * Short tokens: 1 edit; longer: 2.
 */
export function maxEditsFor(token) {
  const len = String(token || "").length;
  if (len <= 3) return 1;
  if (len <= 6) return 1;
  return 2;
}

/**
 * True if `candidate` is within edit distance of `query` (or contains a close token).
 */
export function isFuzzyMatch(query, candidate) {
  const q = normalizeSearch(query);
  const c = normalizeSearch(candidate);
  if (!q || !c) return false;
  if (c.includes(q) || q.includes(c)) return true;

  const qTokens = q.split(/\s+/);
  const cTokens = c.split(/\s+/);

  for (const qt of qTokens) {
    const max = maxEditsFor(qt);
    for (const ct of cTokens) {
      if (Math.abs(qt.length - ct.length) > max) continue;
      if (levenshtein(qt, ct) <= max) return true;
      if (ct.startsWith(qt) || qt.startsWith(ct)) return true;
    }
  }
  return false;
}

/**
 * Best fuzzy distance between query and a haystack string (lower = better).
 */
export function bestFuzzyDistance(query, haystack) {
  const q = normalizeSearch(query);
  const h = normalizeSearch(haystack);
  if (!q || !h) return 99;
  if (h === q) return 0;
  if (h.startsWith(q)) return 0.5;
  if (h.includes(q)) return 1;

  let best = 99;
  const qTokens = q.split(/\s+/);
  const hTokens = h.split(/\s+/);
  for (const qt of qTokens) {
    for (const ht of hTokens) {
      const d = levenshtein(qt, ht);
      if (d < best) best = d;
    }
    // Also compare against full haystack for single-token queries
    if (qTokens.length === 1) {
      const d = levenshtein(qt, h);
      if (d < best) best = d;
    }
  }
  return best;
}

/**
 * Soft regex: allow optional characters between letters for light typo tolerance.
 * Only for short queries to avoid pathological patterns.
 */
export function softRegexPattern(term) {
  const t = normalizeSearch(term);
  if (!t || t.length > 12) return escapeRegex(t);
  // Insert optional single-char wildcards between letters carefully — keep partial simple
  return escapeRegex(t);
}

/**
 * Relevance score for ranking (higher = better).
 * Priority: exact title → title starts with → author → keywords → publisher → category.
 */
export function scoreRelevance(product, query, expandedTerms = []) {
  const q = normalizeSearch(query);
  if (!q) return 0;

  const title = normalizeSearch(
    [product.title, product.titleEn, product.titleUr].filter(Boolean).join(" ")
  );
  const author = normalizeSearch(product.author);
  const publisher = normalizeSearch(product.publisher || product.source);
  const category = normalizeSearch(product.category);
  const keywords = normalizeSearch(
    [...(product.keywords || []), ...(product.tags || [])].join(" ")
  );

  let score = 0;
  const terms = expandedTerms.length ? expandedTerms : [q];

  for (const term of terms) {
    if (!term) continue;

    // 1. Exact title match
    if (title === term) score = Math.max(score, 1000);
    // 2. Title starts with
    else if (title.startsWith(term)) score = Math.max(score, 800);
    else if (title.includes(term)) score = Math.max(score, 600);

    // 3. Author
    if (author === term) score = Math.max(score, 500);
    else if (author.startsWith(term) || author.includes(term)) score = Math.max(score, 450);

    // 4. Keywords / tags
    if (keywords.includes(term)) score = Math.max(score, 350);

    // 5. Publisher
    if (publisher.includes(term)) score = Math.max(score, 250);

    // 6. Category
    if (category.includes(term)) score = Math.max(score, 150);
  }

  // Fuzzy bump when close but not substring
  const fuzzyDist = bestFuzzyDistance(q, title);
  if (fuzzyDist <= 2 && score < 200) {
    score = Math.max(score, 200 - fuzzyDist * 40);
  }
  const authorDist = bestFuzzyDistance(q, author);
  if (authorDist <= 2 && score < 180) {
    score = Math.max(score, 180 - authorDist * 30);
  }

  return score;
}
