/** Google Analytics 4 — set VITE_GA_MEASUREMENT_ID (e.g. G-XXXXXXXXXX). */

const GA_ID = String(
  import.meta.env.VITE_GA_MEASUREMENT_ID || "G-WTLBZNRJB5"
).trim();

function gtag(...args) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag(...args);
}

export function isAnalyticsEnabled() {
  return Boolean(GA_ID && typeof window !== "undefined");
}

/** Load gtag.js once. Safe to call multiple times. */
export function initAnalytics() {
  if (!GA_ID || typeof window === "undefined") return;
  if (window.__maktabaGaReady) return;
  window.__maktabaGaReady = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtagFn() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, {
    send_page_view: false,
    anonymize_ip: true,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);
}

/** SPA route change → page_view */
export function trackPageView(path, title) {
  if (!isAnalyticsEnabled()) return;
  gtag("event", "page_view", {
    page_path: path || "/",
    page_title: title || document.title,
    page_location: window.location.href,
  });
}

export function trackEvent(name, params = {}) {
  if (!isAnalyticsEnabled()) return;
  gtag("event", name, params);
}

/** Book product page opened */
export function trackBookView(product) {
  if (!product) return;
  trackEvent("view_item", {
    item_id: String(product._id || product.slug || ""),
    item_name: String(product.title || product.titleUr || product.titleEn || "").slice(0, 120),
    item_category: String(product.category || ""),
    currency: "PKR",
    value: Number(product.price) || 0,
  });
}

/** PWA install prompt result */
export function trackAppInstall(outcome) {
  trackEvent("app_install", {
    outcome: outcome || "unknown",
  });
}
