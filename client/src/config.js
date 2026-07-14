/** Retired Render hosts that must not be used (404 / deleted services). */
const DEAD_API_HOSTS = new Set([
  "maktaba-jamaat-faisalabad-5.onrender.com",
]);

/**
 * Prefer same-origin `/api` (Vercel rewrites → Render) when env is empty or points at a dead host.
 */
function resolveApiRoot(raw) {
  const root = String(raw || "")
    .trim()
    .replace(/\/$/, "");
  if (!root) return "";
  try {
    const host = new URL(root).hostname;
    if (DEAD_API_HOSTS.has(host)) return "";
  } catch {
    return "";
  }
  return root;
}

const API_ROOT = resolveApiRoot(import.meta.env.VITE_API_URL);

/** Public API base, e.g. /api or https://api.example.com/api */
export const API_BASE = API_ROOT ? `${API_ROOT}/api` : "/api";

const rawImageBase = String(import.meta.env.VITE_IMAGE_BASE || "").trim().replace(/\/$/, "");
let imageRoot = rawImageBase;
if (imageRoot) {
  try {
    if (DEAD_API_HOSTS.has(new URL(imageRoot).hostname)) imageRoot = "";
  } catch {
    imageRoot = "";
  }
}

/** Book cover images base, e.g. /images or https://api.example.com/images */
export const IMAGE_BASE = (
  imageRoot || (API_ROOT ? `${API_ROOT}/images` : "/images")
).replace(/\/$/, "");

export function imagePath(relativePath) {
  if (!relativePath) return "";
  const encoded = relativePath
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `${IMAGE_BASE}/${encoded}`;
}
