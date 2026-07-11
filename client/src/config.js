const API_ROOT = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

/** Public API base, e.g. /api or https://api.example.com/api */
export const API_BASE = API_ROOT ? `${API_ROOT}/api` : "/api";

/** Book cover images base, e.g. /images or https://api.example.com/images */
export const IMAGE_BASE = (import.meta.env.VITE_IMAGE_BASE || (API_ROOT ? `${API_ROOT}/images` : "/images")).replace(
  /\/$/,
  ""
);

export function imagePath(relativePath) {
  if (!relativePath) return "";
  const encoded = relativePath
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `${IMAGE_BASE}/${encoded}`;
}
