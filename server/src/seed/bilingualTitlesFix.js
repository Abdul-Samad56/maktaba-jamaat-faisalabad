import { applyBilingualFields, splitBilingualTitle } from "../utils/bilingual.js";

/**
 * Fill titleEn / titleUr / searchIndex from existing title for every product.
 */
export async function applyBilingualTitlesFix(Product) {
  const cursor = Product.find({})
    .select("title titleEn titleUr author tags publisher source searchIndex")
    .cursor();
  let updated = 0;
  let scanned = 0;

  for await (const doc of cursor) {
    scanned += 1;
    const split = splitBilingualTitle(doc.title);
    const next = applyBilingualFields({
      title: doc.title,
      titleEn: doc.titleEn || split.titleEn,
      titleUr: doc.titleUr || split.titleUr,
      author: doc.author,
      tags: doc.tags,
      publisher: doc.publisher,
      source: doc.source,
    });

    const changed =
      next.titleEn !== (doc.titleEn || "") ||
      next.titleUr !== (doc.titleUr || "") ||
      next.searchIndex !== (doc.searchIndex || "") ||
      next.title !== doc.title;

    if (changed) {
      await Product.updateOne(
        { _id: doc._id },
        {
          $set: {
            title: next.title,
            titleEn: next.titleEn,
            titleUr: next.titleUr,
            searchIndex: next.searchIndex,
          },
        }
      );
      updated += 1;
    }
  }

  return { scanned, updated };
}
