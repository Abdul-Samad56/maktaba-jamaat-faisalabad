import { API_BASE, imagePath } from "./config";

export async function fetchProducts(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, v);
  });
  const res = await fetch(`${API_BASE}/products?${qs}`);
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

export async function fetchFilters() {
  const res = await fetch(`${API_BASE}/products/filters`);
  if (!res.ok) throw new Error("Failed to load filters");
  return res.json();
}

export async function fetchProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

export function imageUrl(product) {
  if (product.localImage) return imagePath(product.localImage);
  if (product.image) return product.image;
  return "/placeholder-book.svg";
}

export function formatPrice(n) {
  if (!n || n <= 0) return "Contact for price";
  return `Rs.${Number(n).toLocaleString("en-PK")}.00 PKR`;
}
