import { useEffect } from "react";
import { SITE_KEYWORDS, SITE_NAME, SITE_URL, absoluteUrl } from "../siteConfig";

function upsertMeta(attr, key, content) {
  if (content == null || content === "") return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href, attrs = {}) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]${attrs.hreflang ? `[hreflang="${attrs.hreflang}"]` : ""}`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    if (attrs.hreflang) el.setAttribute("hreflang", attrs.hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!data) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Per-page SEO: title, description, keywords, OG, Twitter, canonical, JSON-LD.
 */
export default function Seo({
  title,
  description,
  keywords,
  path = "/",
  image,
  type = "website",
  noindex = false,
  jsonLd,
  jsonLdId = "seo-jsonld",
  jsonLdExtra,
  jsonLdExtraId = "seo-jsonld-extra",
}) {
  useEffect(() => {
    const fullTitle = title?.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const url = absoluteUrl(path);
    const img = image ? absoluteUrl(image) : absoluteUrl("/logo.png");
    const keys = keywords || SITE_KEYWORDS;

    document.title = fullTitle;
    upsertMeta("name", "description", description);
    upsertMeta("name", "keywords", keys);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    upsertMeta("name", "author", SITE_NAME);
    upsertMeta("name", "geo.region", "PK-PB");
    upsertMeta("name", "geo.placename", "Faisalabad");
    upsertLink("canonical", url);
    upsertLink("alternate", url, { hreflang: "en-PK" });
    upsertLink("alternate", url, { hreflang: "ur" });
    upsertLink("alternate", url, { hreflang: "x-default" });

    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", img);
    upsertMeta("property", "og:locale", "en_PK");
    upsertMeta("property", "og:locale:alternate", "ur_PK");

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", img);

    upsertJsonLd(jsonLdId, jsonLd);
    upsertJsonLd(jsonLdExtraId, jsonLdExtra || null);
  }, [title, description, keywords, path, image, type, noindex, jsonLd, jsonLdId, jsonLdExtra, jsonLdExtraId]);

  return null;
}

export { SITE_URL };
