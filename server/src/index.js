import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import productsRouter from "./routes/products.js";
import adminRouter from "./routes/admin.js";
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

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
  })
);
app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/admin", adminRouter);

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

if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/images")) return next();
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
