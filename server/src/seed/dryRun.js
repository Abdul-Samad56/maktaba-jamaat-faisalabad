import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_ROOT = path.resolve(__dirname, "../../../..");

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

const TITLE_COLS = ["کتاب / Product", "کتاب / Book", "کتاب (اردو)", "Product", "Book"];
const IMAGE_COLS = ["Image URL", "image url"];

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

function countFile(filePath) {
  const wb = XLSX.readFile(filePath);
  let n = 0;
  for (const sheet of wb.SheetNames) {
    const sheetLower = sheet.toLowerCase();
    if (sheetLower === "summary") continue;
    if (sheetLower.includes("variant")) continue;
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheet]);
    if (!rows.length) continue;
    const cols = Object.keys(rows[0]);
    if (!findCol(cols, IMAGE_COLS) && !findCol(cols, TITLE_COLS)) continue;
    n += rows.filter((r) => {
      const title = findCol(cols, TITLE_COLS);
      return title && String(r[title] || "").trim();
    }).length;
  }
  return n;
}

let total = 0;
console.log("DATA_ROOT:", DATA_ROOT);
for (const f of WEBSITE_FILES) {
  const fp = path.join(DATA_ROOT, f);
  if (!fs.existsSync(fp)) {
    console.log(`${f}: (not found)`);
    continue;
  }
  const n = countFile(fp);
  console.log(`${f}: ${n}`);
  total += n;
}
console.log(`\nTotal products ready to import: ${total}`);
