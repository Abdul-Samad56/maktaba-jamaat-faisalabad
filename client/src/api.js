import { API_BASE, imagePath } from "./config";
import { parseJsonResponse } from "./parseJson";

async function fetchJson(url, retries = 2) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 90000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      return parseJsonResponse(res);
    } catch (err) {
      lastError = err;
      if (attempt < retries) await new Promise((r) => setTimeout(r, 4000));
    }
  }
  throw lastError?.name === "AbortError"
    ? new Error("Server is waking up — wait 60 seconds and refresh the page.")
    : lastError || new Error("Failed to fetch");
}

export async function fetchProducts(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, v);
  });
  return fetchJson(`${API_BASE}/products?${qs}`);
}

export async function fetchFilters() {
  return fetchJson(`${API_BASE}/products/filters`);
}

export async function fetchProduct(id) {
  return fetchJson(`${API_BASE}/products/${id}`);
}

export function imageUrl(product) {
  // Prefer online URL (works on Render/Vercel); local files only on PC/VPS
  if (product.image) return product.image;
  if (product.localImage) return imagePath(product.localImage);
  return "/placeholder-book.svg";
}

export function formatPrice(n) {
  if (!n || n <= 0) return "Contact for price";
  return `Rs.${Number(n).toLocaleString("en-PK")}.00 PKR`;
}
