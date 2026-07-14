const MEMORY = new Map();
const PREFIX = "maktaba-cache:v6:";

function canUseStorage() {
  try {
    return typeof localStorage !== "undefined";
  } catch {
    return false;
  }
}

export function cacheGet(key) {
  const mem = MEMORY.get(key);
  if (mem && mem.expires > Date.now()) return mem.value;

  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.expires < Date.now()) {
      localStorage.removeItem(PREFIX + key);
      return null;
    }
    MEMORY.set(key, parsed);
    return parsed.value;
  } catch {
    return null;
  }
}

/** Return stale data even if expired (for offline / slow network). */
export function cacheGetStale(key) {
  const fresh = cacheGet(key);
  if (fresh != null) return { value: fresh, stale: false };

  const mem = MEMORY.get(key);
  if (mem?.value != null) return { value: mem.value, stale: true };

  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.value == null) return null;
    MEMORY.set(key, parsed);
    return { value: parsed.value, stale: true };
  } catch {
    return null;
  }
}

export function cacheSet(key, value, ttlMs = 5 * 60 * 1000) {
  const entry = { value, expires: Date.now() + ttlMs };
  MEMORY.set(key, entry);
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(entry));
  } catch {
    // Quota exceeded — drop oldest keys
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith(PREFIX));
      keys.slice(0, Math.ceil(keys.length / 3)).forEach((k) => localStorage.removeItem(k));
      localStorage.setItem(PREFIX + key, JSON.stringify(entry));
    } catch {
      /* ignore */
    }
  }
}

export function productsCacheKey(params) {
  const sorted = Object.keys(params)
    .sort()
    .reduce((acc, k) => {
      const v = params[k];
      if (v !== undefined && v !== null && v !== "") acc[k] = String(v);
      return acc;
    }, {});
  return `products:${JSON.stringify(sorted)}`;
}
