import mongoose from "mongoose";

/**
 * Tracks search queries for Popular Searches analytics.
 */
const searchLogSchema = new mongoose.Schema(
  {
    query: { type: String, required: true, index: true },
    normalized: { type: String, required: true, index: true },
    count: { type: Number, default: 1 },
    lastSearchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

searchLogSchema.index({ count: -1, lastSearchedAt: -1 });

export default mongoose.model("SearchLog", searchLogSchema);
