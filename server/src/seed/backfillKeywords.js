/**
 * Backfill Product.keywords from title/author + synonym dictionary.
 * Run: node src/seed/backfillKeywords.js
 *
 * Safe to re-run — merges without wiping custom keywords.
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import { applyBilingualFields } from "../utils/bilingual.js";
import { SYNONYM_GROUPS } from "../utils/synonyms.js";
import { normalizeSearch } from "../utils/normalize.js";
import { connectDb } from "../db.js";

dotenv.config();

function inferKeywords(doc) {
  const hay = normalizeSearch(
    [doc.title, doc.titleEn, doc.titleUr, doc.author, doc.category, ...(doc.tags || [])].join(" ")
  );
  const found = new Set(doc.keywords || []);

  for (const group of SYNONYM_GROUPS) {
    const hit = group.some((a) => hay.includes(normalizeSearch(a)));
    if (hit) group.forEach((a) => found.add(a));
  }

  return [...found];
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing");
  await connectDb(uri);
  const cursor = Product.find({}).cursor();
  let updated = 0;
  let scanned = 0;

  for await (const doc of cursor) {
    scanned++;
    const keywords = inferKeywords(doc);
    if (!keywords.length) continue;

    const bilingual = applyBilingualFields({
      title: doc.title,
      titleEn: doc.titleEn,
      titleUr: doc.titleUr,
      author: doc.author,
      tags: doc.tags,
      keywords,
      publisher: doc.publisher,
      source: doc.source,
      category: doc.category,
    });

    const same =
      JSON.stringify([...(doc.keywords || [])].sort()) === JSON.stringify([...keywords].sort()) &&
      doc.searchIndex === bilingual.searchIndex;

    if (same) continue;

    doc.keywords = keywords;
    doc.searchIndex = bilingual.searchIndex;
    doc.titleEn = bilingual.titleEn;
    doc.titleUr = bilingual.titleUr;
    await doc.save();
    updated++;
    if (updated % 50 === 0) console.log(`Updated ${updated} / scanned ${scanned}`);
  }

  console.log(`Done. Scanned ${scanned}, updated ${updated}.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
