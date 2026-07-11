import dotenv from "dotenv";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";
import Product from "../models/Product.js";
import { connectDb } from "../db.js";

dotenv.config();

const WEBSITE_FILES = [
  "Maktaba Islamia Website.xlsx",
  "Darussalam Website.xlsx",
  "TajQuran Website.xlsx",
  "NBF Website.xlsx",
  "Manshurat Website.xlsx",
  "IMTBooks Website.xlsx",
  "Idara Publications Website.xlsx",
  "Islamic Publications Website.xlsx",
];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_ROOT = path.resolve(__dirname, "../../../..");

const IMAGE_COLS = ["Image URL", "image url"];
const TITLE_COLS = ["کتاب / Product", "کتاب / Book", "کتاب (اردو)", "Product", "Book"];
const AUTHOR_COLS = ["مصنف / Author", "Author"];
const PUBLISHER_COLS = ["ناشر / Publisher", "Publisher", "vendor"];
const PRICE_COLS = ["Price (Rs.)", "قیمت (روپے)", "price"];
const REG_COLS = ["Regular Price (Rs.)", "Regular Price", "regularPrice"];
const CAT_COLS = ["Category", "Collections", "Product Type"];
const LANG_COLS = ["Language", "language"];
const LINK_COLS = ["Product Link", "productLink"];
const DESC_COLS = ["Description", "Short Description", "description"];
const SKU_COLS = ["SKU", "sku"];
const ISBN_COLS = ["ISBN", "isbn"];
const PAGES_COLS = ["صفحات / Pages", "Pages"];
const AVAIL_COLS = ["Available", "In Stock"];
const SALE_COLS = ["On Sale"];
const TAG_COLS = ["Tags", "tags"];

function findCol(cols, names) {
  for (const n of names) {
    const hit = cols.find((c) => String(c).trim() === n);
    if (hit) return hit;
  }
  for (const col of cols) {
    for (const n of names) {
      if (String(col).toLowerCase().includes(n.toLowerCase())) return col;
    }
  }
  return null;
}

function val(row, col) {
  if (!col) return "";
  const v = row[col];
  if (v === undefined || v === null || (typeof v === "number" && Number.isNaN(v))) return "";
  return String(v).trim();
}

function num(v) {
  const n = parseFloat(String(v).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function inferCategory(title, category) {
  const t = `${title} ${category}`.toLowerCase();
  if (/quran|qaidah|qaida|tajweed|sipara|para|surah|قرآن/i.test(t)) return "Quran";
  if (/tafseer|tafsir|tafheem|تفسیر/i.test(t)) return "Tafseer";
  if (/hadith|hadees|bukhari|muslim|mishkat|حدیث/i.test(t)) return "Hadith";
  if (/seerat|seerah|sirah|biography|سیرت/i.test(t)) return "Seerat un Nabi";
  if (/fiqh|dars|nizami|فقہ/i.test(t)) return "Dars e Nizami";
  return category || "General";
}

function findLocalImage(source, title, rowNum) {
  const folder = path.join(DATA_ROOT, source);
  if (!fs.existsSync(folder)) return "";

  const files = [];
  const walk = (dir) => {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, f.name);
      if (f.isDirectory()) walk(full);
      else if (/\.(jpg|jpeg|png|webp|gif)$/i.test(f.name)) files.push(full);
    }
  };
  walk(folder);

  const prefix = `${rowNum}_`;
  const hit = files.find((f) => path.basename(f).startsWith(prefix));
  if (hit) return path.relative(DATA_ROOT, hit).replace(/\\/g, "/");

  const safe = title.slice(0, 30).replace(/[^\w\s-]/g, "");
  const hit2 = files.find((f) => f.toLowerCase().includes(safe.toLowerCase().slice(0, 15)));
  if (hit2) return path.relative(DATA_ROOT, hit2).replace(/\\/g, "/");
  return "";
}

function rowToProduct(row, cols, meta) {
  const title = val(row, findCol(cols, TITLE_COLS));
  if (!title) return null;

  const price = num(val(row, findCol(cols, PRICE_COLS)));
  const regularPrice = num(val(row, findCol(cols, REG_COLS))) || price;
  const categoryRaw = val(row, findCol(cols, CAT_COLS));
  const onSaleVal = val(row, findCol(cols, SALE_COLS)).toLowerCase();
  const availVal = val(row, findCol(cols, AVAIL_COLS)).toLowerCase();

  const rowNum = val(row, findCol(cols, ["نمبر", "Product No.", "Sr #"])) || meta.index;
  const localImage = findLocalImage(meta.sourceFolder, title, rowNum);
  const remoteImage = val(row, findCol(cols, IMAGE_COLS));

  return {
    title,
    author: val(row, findCol(cols, AUTHOR_COLS)),
    publisher: val(row, findCol(cols, PUBLISHER_COLS)) || meta.sourceFolder,
    source: meta.sourceFolder,
    category: inferCategory(title, categoryRaw),
    categories: categoryRaw ? categoryRaw.split(",").map((s) => s.trim()) : [],
    bookLanguage: val(row, findCol(cols, LANG_COLS)),
    price,
    regularPrice,
    onSale: onSaleVal === "yes" || (regularPrice > price && price > 0),
    available: availVal !== "no" && availVal !== "false",
    sku: val(row, findCol(cols, SKU_COLS)),
    isbn: val(row, findCol(cols, ISBN_COLS)),
    pages: val(row, findCol(cols, PAGES_COLS)),
    description: val(row, findCol(cols, DESC_COLS)),
    image: remoteImage,
    localImage,
    productLink: val(row, findCol(cols, LINK_COLS)),
    tags: val(row, findCol(cols, TAG_COLS))
      ? val(row, findCol(cols, TAG_COLS)).split(",").map((s) => s.trim())
      : [],
  };
}

function loadWorkbook(filePath) {
  const wb = XLSX.readFile(filePath);
  const products = [];
  const sourceFolder = path.basename(filePath, ".xlsx");

  for (const sheet of wb.SheetNames) {
    const sheetLower = sheet.toLowerCase();
    if (sheetLower === "summary") continue;
    if (sheetLower.includes("variant")) continue;
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheet]);
    if (!rows.length) continue;
    const cols = Object.keys(rows[0]);
    if (!findCol(cols, IMAGE_COLS) && !findCol(cols, TITLE_COLS)) continue;

    rows.forEach((row, i) => {
      const p = rowToProduct(row, cols, { sourceFolder, index: i + 1 });
      if (p) products.push(p);
    });
  }
  return products;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes("USERNAME")) {
    console.error("Set MONGODB_URI in server/.env before seeding.");
    process.exit(1);
  }

  await connectDb(uri);
  console.log("Connected to MongoDB Atlas");

  const files = WEBSITE_FILES.filter((f) => fs.existsSync(path.join(DATA_ROOT, f)));
  if (!files.length) {
    console.error("No website Excel files found in", DATA_ROOT);
    process.exit(1);
  }

  let all = [];
  for (const f of files) {
    const fp = path.join(DATA_ROOT, f);
    const items = loadWorkbook(fp);
    console.log(`${f}: ${items.length} products`);
    all = all.concat(items);
  }

  console.log(`Total: ${all.length} products`);
  await Product.deleteMany({});
  await Product.insertMany(all, { ordered: false });
  console.log("Database seeded successfully");
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
