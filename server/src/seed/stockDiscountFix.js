/** Reduce sale discount by 10 percentage points (e.g. 50% → 40%). */
export function adjustDiscount(regularPrice, price) {
  const reg = Number(regularPrice) || 0;
  const pr = Number(price) || 0;
  if (reg <= 0 || pr <= 0 || pr >= reg) {
    return { price: pr, onSale: false };
  }

  const currentPct = (reg - pr) / reg;
  const newPct = currentPct - 0.1;

  if (newPct <= 0.005) {
    return { price: Math.round(reg), onSale: false };
  }

  const newPrice = Math.round(reg * (1 - newPct));
  const finalPrice = Math.min(newPrice, reg - 1);
  return { price: Math.max(1, finalPrice), onSale: finalPrice < reg };
}

export async function applyStockAndDiscountFix(Product) {
  const availableResult = await Product.updateMany({}, { $set: { available: true } });

  const onSale = await Product.find({
    onSale: true,
    regularPrice: { $gt: 0 },
    $expr: { $lt: ["$price", "$regularPrice"] },
  }).select("_id price regularPrice");

  let discountUpdated = 0;
  let saleCleared = 0;

  for (const doc of onSale) {
    const next = adjustDiscount(doc.regularPrice, doc.price);
    await Product.updateOne(
      { _id: doc._id },
      { $set: { price: next.price, onSale: next.onSale } }
    );
    if (next.onSale) discountUpdated += 1;
    else saleCleared += 1;
  }

  return {
    availableMatched: availableResult.matchedCount,
    availableModified: availableResult.modifiedCount,
    discountCandidates: onSale.length,
    discountUpdated,
    saleCleared,
  };
}
