/**
 * One-time DB update (local/CLI):
 * 1) Mark every product available (in stock)
 * 2) Reduce sale discount by 10 percentage points (e.g. 50% → 40%)
 */
import dotenv from "dotenv";
import Product from "../models/Product.js";
import { connectDb } from "../db.js";
import { applyStockAndDiscountFix } from "./stockDiscountFix.js";

dotenv.config();

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes("USERNAME")) {
    throw new Error("MONGODB_URI not configured in server/.env");
  }

  await connectDb(uri);
  const result = await applyStockAndDiscountFix(Product);
  console.log(result);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
