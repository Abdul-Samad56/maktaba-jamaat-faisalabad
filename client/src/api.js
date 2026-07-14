import { API_BASE, imagePath } from "./config";
import { cacheGetStale, cacheSet, productsCacheKey } from "./cache";
import { parseJsonResponse } from "./parseJson";

const FILTERS_KEY = "filters";
const FILTERS_TTL = 30 * 60 * 1000;
const PRODUCTS_TTL = 10 * 60 * 1000;
const PRODUCT_TTL = 30 * 60 * 1000;

let wakePromise = null;

/** Ping API early so Render cold-start begins while UI paints. */
export function wakeApi() {
  if (wakePromise) return wakePromise;
  const root = API_BASE.replace(/\/api\/?$/, "");
  wakePromise = fetch(`${root}/api/health`, { cache: "no-store" })
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        wakePromise = null;
      }, 60_000);
    });
  return wakePromise;
}

async function fetchNetwork(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return parseJsonResponse(res);
  } finally {
    clearTimeout(timer);
  }
}

async function fetchFresh(url, cacheKey, ttlMs, timeouts = [10000, 22000, 40000]) {
  wakeApi();
  let lastError;
  for (let i = 0; i < timeouts.length; i++) {
    try {
      const data = await fetchNetwork(url, timeouts[i]);
      cacheSet(cacheKey, data, ttlMs);
      return data;
    } catch (err) {
      lastError = err;
      if (i < timeouts.length - 1) await new Promise((r) => setTimeout(r, 600 * (i + 1)));
    }
  }
  const stale = cacheGetStale(cacheKey);
  if (stale?.value != null) return stale.value;
  throw lastError?.name === "AbortError"
    ? new Error("Server is waking up — wait a moment and try again.")
    : lastError || new Error("Failed to fetch");
}

export function peekProducts(params = {}) {
  return cacheGetStale(productsCacheKey(params))?.value ?? null;
}

export function peekFilters() {
  return cacheGetStale(FILTERS_KEY)?.value ?? null;
}

export function peekProduct(id) {
  return (
    cacheGetStale(`product:${id}`)?.value ??
    null
  );
}

export async function fetchProducts(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, v);
  });
  return fetchFresh(`${API_BASE}/products?${qs}`, productsCacheKey(params), PRODUCTS_TTL);
}

export async function fetchFilters() {
  return fetchFresh(`${API_BASE}/products/filters`, FILTERS_KEY, FILTERS_TTL, [8000, 18000, 35000]);
}

export async function fetchProduct(id) {
  const data = await fetchFresh(`${API_BASE}/products/${id}`, `product:${id}`, PRODUCT_TTL);
  // Cache under both slug and _id so cards/pages resolve either key
  if (data?._id) cacheSet(`product:${data._id}`, data, PRODUCT_TTL);
  if (data?.slug) cacheSet(`product:${data.slug}`, data, PRODUCT_TTL);
  return data;
}

/** Warm product cache on hover for instant product page. */
export function prefetchProduct(id) {
  if (!id || peekProduct(id)) return;
  fetchProduct(id).catch(() => {});
}

export function imageUrl(product) {
  if (product.image) return product.image;
  if (product.localImage) return imagePath(product.localImage);
  return "/placeholder-book.svg";
}

export function formatPrice(n) {
  if (!n || n <= 0) return "Contact for price";
  return `Rs.${Number(n).toLocaleString("en-PK")}.00 PKR`;
}
