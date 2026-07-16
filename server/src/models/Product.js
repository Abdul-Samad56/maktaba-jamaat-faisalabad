import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    titleEn: { type: String, default: "", index: true },
    titleUr: { type: String, default: "", index: true },
    searchIndex: { type: String, default: "", index: true },
    author: { type: String, default: "", index: true },
    publisher: { type: String, default: "", index: true },
    source: { type: String, required: true, index: true },
    category: { type: String, default: "General", index: true },
    categories: [{ type: String }],
    bookLanguage: { type: String, default: "" },
    price: { type: Number, default: 0, index: true },
    regularPrice: { type: Number, default: 0 },
    onSale: { type: Boolean, default: false },
    available: { type: Boolean, default: true, index: true },
    sku: { type: String, default: "" },
    isbn: { type: String, default: "" },
    pages: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    localImage: { type: String, default: "" },
    productLink: { type: String, default: "" },
    /** SEO URL slug — unique public path /product/{slug} */
    slug: { type: String, index: true, unique: true, sparse: true },
    tags: [{ type: String }],
    /** Extra search keywords (Urdu + English aliases, typos, topics). */
    keywords: [{ type: String }],
  },
  { timestamps: true }
);

productSchema.index({ title: "text", titleEn: "text", titleUr: "text", author: "text", keywords: "text" });
productSchema.index({ searchIndex: 1 });
productSchema.index({ keywords: 1 });

export default mongoose.model("Product", productSchema);
