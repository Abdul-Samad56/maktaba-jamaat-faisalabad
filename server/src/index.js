import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import zlib from "zlib";
import { fileURLToPath } from "url";
import productsRouter from "./routes/products.js";
import adminRouter from "./routes/admin.js";
import searchRouter from "./routes/search.js";
import { connectDb } from "./db.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
const DATA_ROOT = process.env.DATA_ROOT
  ? path.resolve(process.env.DATA_ROOT)
  : path.resolve(__dirname, "../../..");
const CLIENT_DIST = path.resolve(__dirname, "../../client/dist");

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

/** Tiny gzip middleware (no extra dependency). */
function gzipMiddleware(req, res, next) {
  const accept = req.headers["accept-encoding"] || "";
  if (!/\bgzip\b/.test(accept)) return next();

  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);

  const wrap = (payload, isJson) => {
    const body = Buffer.isBuffer(payload)
      ? payload
      : Buffer.from(isJson ? JSON.stringify(payload) : String(payload ?? ""), "utf8");
    if (body.length < 1024) {
      return isJson ? originalJson(payload) : originalSend(payload);
    }
    zlib.gzip(body, (err, compressed) => {
      if (err) return isJson ? originalJson(payload) : originalSend(payload);
      res.setHeader("Content-Encoding", "gzip");
      res.setHeader("Vary", "Accept-Encoding");
      if (isJson) res.type("json");
      res.removeHeader("Content-Length");
      originalSend(compressed);
    });
  };

  res.json = (payload) => wrap(payload, true);
  res.send = (payload) => {
    if (typeof payload === "object" && payload !== null && !Buffer.isBuffer(payload)) {
      return wrap(payload, true);
    }
    return wrap(payload, false);
  };
  next();
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (/^https:\/\/[\w.-]+\.vercel\.app$/i.test(origin)) return callback(null, true);
      return callback(null, false);
    },
  })
);
app.use(gzipMiddleware);
app.use(express.json());

app.use((req, res, next) => {
  if (req.path.startsWith("/api/products") || req.path.startsWith("/api/search")) {
    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  } else if (req.path.startsWith("/api/admin")) {
    res.setHeader("Cache-Control", "no-store");
  }
  next();
});

app.use("/api/products", productsRouter);
app.use("/api/search", searchRouter);
app.use("/api/admin", adminRouter);

const PUBLIC_SITE_URL = (
  process.env.PUBLIC_SITE_URL ||
  process.env.CLIENT_URL?.split(",")[0] ||
  "https://maktaba-jamaat-e-islami-faisalabad.vercel.app"
).replace(/\/$/, "");

app.get("/sitemap.xml", async (_req, res) => {
  try {
    const Product = (await import("./models/Product.js")).default;
    const { productPath, backfillProductSlugs } = await import("./utils/productSlug.js");
    // Ensure slugs exist so sitemap has SEO-friendly URLs
    await backfillProductSlugs(Product, { limit: 5000 });
    const products = await Product.find({}, "_id slug updatedAt").sort({ updatedAt: -1 }).lean();
    const today = new Date().toISOString().slice(0, 10);
    const urls = [
      {
        loc: `${PUBLIC_SITE_URL}/`,
        lastmod: today,
        changefreq: "daily",
        priority: "1.0",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Islam")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.98",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("اسلام")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.98",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Islami")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("اسلامی")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Islamic")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Islamiat")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("اسلامیات")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Ameer Jamaat e Islami")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.98",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("امیر جماعت اسلامی")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.98",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Amir Jamaat e Islami")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Al Khidmat Foundation")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.98",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("الخدمت فاؤنڈیشن")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.98",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Al Khidmat FouDation")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.9",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Bano Qabil")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.98",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("بنو قابل")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.98",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Bano-e-Qabil")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Tarjuman ul Quran")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.98",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("ترجمان القرآن")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.98",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Tarjumaan ul Quran")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Mansoora Lahore")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.98",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("منصورہ لاہور")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.98",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Mansoorah Lahore")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Jamaat e Islami Faisalabad")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.98",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("جماعت اسلامی فیصل آباد")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.98",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Mushtaq Ahmad Khan")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.98",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("سینیٹر مشتاق احمد خان")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.98",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Senator Mushtaq Ahmad Khan")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Senotor Mushtaq Ahmad Khan")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.9",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Maktaba Jamaat e Islami Faisalabad")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.98",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("مکتبہ جماعت اسلامی فیصل آباد")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.98",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Maktaba Jamaat e Islami")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Munawar Hassan")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("منور حسن")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Munar Hassan")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.9",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Mian Muhammad Tufail")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("میاں محمد طفیل")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Mian Muhammad Fufail")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.9",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Qazi Hussain Ahmad")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("قاضی حسین احمد")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Siraj ul Haq")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("سراج الحق")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Hafiz Naeem")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("حافظ نعیم")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Hafiz Naeem ur Rehman")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Maududi")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("مولانا مودودی")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Molana Maododi")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.9",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Faisalabad")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("فیصل آباد")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("FSD")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.9",
      },
      ...( (() => {
        try {
          const areasPath = path.join(__dirname, "data", "faisalabadAreas.json");
          const areas = JSON.parse(fs.readFileSync(areasPath, "utf8"));
          const named = areas.filter((a) => !/^chak\s/i.test(a.en)).slice(0, 400);
          return named.map((a) => ({
            loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent(a.en)}`,
            lastmod: today,
            changefreq: "weekly",
            priority: "0.8",
          }));
        } catch {
          return [];
        }
      })()),
      ...( (() => {
        try {
          const roadmapPath = path.join(__dirname, "data", "roadmapTerms.json");
          const roadmap = JSON.parse(fs.readFileSync(roadmapPath, "utf8"));
          const persons = (roadmap.sitemapPersons || []).slice(0, 500).map((row) => ({
            loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent(row.term || row)}`,
            lastmod: today,
            changefreq: "weekly",
            priority: "0.75",
          }));
          const cities = (roadmap.sitemapCities || roadmap.cities || [])
            .slice(0, 200)
            .map((row) => ({
              loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent(row.term || row)}`,
              lastmod: today,
              changefreq: "weekly",
              priority: "0.8",
            }));
          const featured = (roadmap.featured || []).slice(0, 120).map((row) => ({
            loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent(row.term || row)}`,
            lastmod: today,
            changefreq: "weekly",
            priority: "0.85",
          }));
          return [...featured, ...cities, ...persons];
        } catch {
          return [];
        }
      })()),
      ...( (() => {
        try {
          const numbersPath = path.join(__dirname, "data", "numbersWiseTerms.json");
          const numbers = JSON.parse(fs.readFileSync(numbersPath, "utf8"));
          return (numbers.sitemapTerms || numbers.featured || [])
            .slice(0, 800)
            .map((row) => ({
              loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent(row.term || row)}`,
              lastmod: today,
              changefreq: "weekly",
              priority: "0.72",
            }));
        } catch {
          return [];
        }
      })()),
      ...( (() => {
        try {
          const joiningPath = path.join(__dirname, "data", "joiningKTerms.json");
          const joining = JSON.parse(fs.readFileSync(joiningPath, "utf8"));
          return (joining.sitemapTerms || joining.featured || [])
            .slice(0, 600)
            .map((row) => ({
              loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent(row.term || row)}`,
              lastmod: today,
              changefreq: "weekly",
              priority: "0.7",
            }));
        } catch {
          return [];
        }
      })()),
      ...( (() => {
        try {
          const nameIdPath = path.join(__dirname, "data", "nameIdTerms.json");
          const nameId = JSON.parse(fs.readFileSync(nameIdPath, "utf8"));
          return (nameId.sitemapTerms || nameId.featured || [])
            .slice(0, 600)
            .map((row) => ({
              loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent(row.term || row)}`,
              lastmod: today,
              changefreq: "weekly",
              priority: "0.68",
            }));
        } catch {
          return [];
        }
      })()),
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Islamic books online")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("اسلامی کتب آن لائن")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.95",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Maktaba Islamia")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.9",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Jamaat e Islami")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.9",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("Tafheem ul Quran")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.9",
      },
      {
        loc: `${PUBLIC_SITE_URL}/?search=${encodeURIComponent("ادارہ ترجمان القرآن")}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.9",
      },
      ...["quran", "para", "tarjuma", "hadees", "fiqa", "tarikh", "tafseer", "seerat", "dars-e-nizami"].map((cat) => ({
        loc: `${PUBLIC_SITE_URL}/?category=${cat}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.8",
      })),
      ...products.map((p) => ({
        loc: `${PUBLIC_SITE_URL}${productPath(p)}`,
        lastmod: (p.updatedAt ? new Date(p.updatedAt) : new Date()).toISOString().slice(0, 10),
        changefreq: "weekly",
        priority: "0.7",
      })),
    ];

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.type("application/xml").send(body);
  } catch (err) {
    res.status(500).type("text/plain").send(`Sitemap error: ${err.message}`);
  }
});

app.get("/robots.txt", (_req, res) => {
  res.type("text/plain").send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/

Sitemap: ${PUBLIC_SITE_URL}/sitemap.xml
`);
});

if (fs.existsSync(DATA_ROOT)) {
  app.use("/images", express.static(DATA_ROOT, { index: false }));
} else {
  console.warn(`Image folder not found: ${DATA_ROOT}`);
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    db: mongoose.connection.readyState === 1,
    images: fs.existsSync(DATA_ROOT),
    mode: process.env.NODE_ENV || "development",
  });
});

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Inject per-book meta into SPA HTML so crawlers see unique SEO links. */
async function renderProductSeoHtml(product) {
  const { productPath } = await import("./utils/productSlug.js");
  const productUrlPath = productPath(product);
  const url = `${PUBLIC_SITE_URL}${productUrlPath}`;
  const en = product.titleEn || "";
  const ur = product.titleUr || "";
  const name = [en, ur].filter(Boolean).join(" / ") || product.title || "Islamic Book";
  const author = product.author ? ` — ${product.author}` : "";
  const title = `${name}${author} | Maktaba Jamaat e Islami Faisalabad`;
  const description = escapeHtml(
    `Buy "${name}"${product.author ? ` by ${product.author}` : ""} online from Maktaba Jamaat e Islami Faisalabad. WhatsApp 0321-5315603.`
  ).slice(0, 170);
  const image = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${PUBLIC_SITE_URL}${product.image}`
    : `${PUBLIC_SITE_URL}/logo.png`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: en || name,
    alternateName: [en, ur].filter(Boolean),
    ...(product.author ? { author: { "@type": "Person", name: product.author } } : {}),
    description,
    image,
    url,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "PKR",
      price: product.price > 0 ? product.price : undefined,
      availability: "https://schema.org/InStock",
    },
  };

  let html = "";
  try {
    const spaRes = await fetch(`${PUBLIC_SITE_URL}/`, {
      headers: { Accept: "text/html" },
      signal: AbortSignal.timeout(8000),
    });
    if (spaRes.ok) html = await spaRes.text();
  } catch {
    html = "";
  }

  if (!html && fs.existsSync(path.join(CLIENT_DIST, "index.html"))) {
    html = fs.readFileSync(path.join(CLIENT_DIST, "index.html"), "utf8");
  }

  if (!html) {
    html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>${escapeHtml(title)}</title></head><body><div id="root"></div><p><a href="${escapeHtml(url)}">${escapeHtml(name)}</a></p></body></html>`;
  }

  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${description}" />`
  );
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(url)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(title)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${description}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${escapeHtml(url)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${escapeHtml(image)}" />`
  );

  const inject = `
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta property="og:type" content="product" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <script type="application/ld+json" id="ssr-product-jsonld">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>
    <noscript><h1>${escapeHtml(name)}</h1><p>${description}</p><p><a href="${escapeHtml(url)}">${escapeHtml(name)}</a></p></noscript>
  `;
  if (html.includes("</head>")) {
    html = html.replace("</head>", `${inject}</head>`);
  } else {
    html = inject + html;
  }
  return html;
}

app.get("/ssr/product/:idOrSlug", async (req, res) => {
  try {
    const Product = (await import("./models/Product.js")).default;
    const { findProductByParam } = await import("./utils/productSlug.js");
    const product = await findProductByParam(Product, req.params.idOrSlug);
    if (!product) return res.status(404).type("text/plain").send("Product not found");
    const html = await renderProductSeoHtml(product);
    res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    res.type("html").send(html);
  } catch (err) {
    res.status(500).type("text/plain").send(`SSR error: ${err.message}`);
  }
});

if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get("*", async (req, res, next) => {
    if (
      req.path.startsWith("/api") ||
      req.path.startsWith("/images") ||
      req.path.startsWith("/ssr/") ||
      req.path === "/sitemap.xml" ||
      req.path === "/robots.txt"
    ) {
      return next();
    }
    // Local/Render SPA: inject product meta when serving /product/*
    const productMatch = req.path.match(/^\/product\/([^/]+)\/?$/);
    if (productMatch) {
      try {
        const Product = (await import("./models/Product.js")).default;
        const { findProductByParam } = await import("./utils/productSlug.js");
        const product = await findProductByParam(Product, decodeURIComponent(productMatch[1]));
        if (product) {
          const html = await renderProductSeoHtml(product);
          return res.type("html").send(html);
        }
      } catch {
        /* fall through to SPA */
      }
    }
    res.sendFile(path.join(CLIENT_DIST, "index.html"));
  });
}

async function start() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes("USERNAME") || uri.includes("<db_password>")) {
    console.warn("MONGODB_URI not configured — API will fail on DB routes.");
  } else {
    try {
      await connectDb(uri);
      console.log("MongoDB Atlas connected");
    } catch (err) {
      console.error("MongoDB connection failed:", err.message);
      console.error("Check MONGODB_URI, Atlas Network Access (0.0.0.0/0), and password.");
    }
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Images folder: ${DATA_ROOT}`);
    if (fs.existsSync(CLIENT_DIST)) console.log(`Serving frontend from ${CLIENT_DIST}`);
  });
}

start().catch((err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});
