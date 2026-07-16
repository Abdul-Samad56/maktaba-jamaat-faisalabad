const HISTORY_KEY = "maktaba_search_history";
const MAX_HISTORY = 10;

export function getSearchHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((s) => typeof s === "string" && s.trim()) : [];
  } catch {
    return [];
  }
}

export function addSearchHistory(query) {
  const q = String(query || "").trim();
  if (!q) return getSearchHistory();
  const prev = getSearchHistory().filter((s) => s.toLowerCase() !== q.toLowerCase());
  const next = [q, ...prev].slice(0, MAX_HISTORY);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    /* private mode */
  }
  return next;
}

export function clearSearchHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    /* ignore */
  }
  return [];
}

export function removeSearchHistoryItem(query) {
  const next = getSearchHistory().filter((s) => s !== query);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}
