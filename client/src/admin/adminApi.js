import { API_BASE } from "../config";

const TOKEN_KEY = "admin_token";
const ADMIN_BASE = `${API_BASE}/admin`;

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn() {
  return !!getToken();
}

async function adminFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${ADMIN_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export async function adminLogin(username, password) {
  const data = await adminFetch("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  setToken(data.token);
  return data;
}

export function adminLogout() {
  setToken(null);
}

export async function fetchAdminStats() {
  return adminFetch("/stats");
}

export async function fetchAdminProducts(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, v);
  });
  return adminFetch(`/products?${qs}`);
}

export async function fetchAdminProduct(id) {
  return adminFetch(`/products/${id}`);
}

export async function createAdminProduct(body) {
  return adminFetch("/products", { method: "POST", body: JSON.stringify(body) });
}

export async function updateAdminProduct(id, body) {
  return adminFetch(`/products/${id}`, { method: "PUT", body: JSON.stringify(body) });
}

export async function deleteAdminProduct(id) {
  return adminFetch(`/products/${id}`, { method: "DELETE" });
}

export const EMPTY_PRODUCT = {
  title: "",
  author: "",
  publisher: "",
  source: "Maktaba Jamaat e Islami Faisalabad",
  category: "General",
  categories: "",
  bookLanguage: "",
  price: "",
  regularPrice: "",
  onSale: false,
  available: true,
  sku: "",
  isbn: "",
  pages: "",
  description: "",
  image: "",
  localImage: "",
  productLink: "",
  tags: "",
};

export function productToForm(p) {
  return {
    title: p.title || "",
    author: p.author || "",
    publisher: p.publisher || "",
    source: p.source || "",
    category: p.category || "General",
    categories: Array.isArray(p.categories) ? p.categories.join(", ") : "",
    bookLanguage: p.bookLanguage || "",
    price: p.price ?? "",
    regularPrice: p.regularPrice ?? "",
    onSale: !!p.onSale,
    available: p.available !== false,
    sku: p.sku || "",
    isbn: p.isbn || "",
    pages: p.pages || "",
    description: p.description || "",
    image: p.image || "",
    localImage: p.localImage || "",
    productLink: p.productLink || "",
    tags: Array.isArray(p.tags) ? p.tags.join(", ") : "",
  };
}
