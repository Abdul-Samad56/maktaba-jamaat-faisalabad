import { Router } from "express";
import {
  search,
  suggestions,
  popular,
  noResults,
  track,
} from "../controllers/searchController.js";

const router = Router();

/** GET /api/search?q=مودودی&page=1&limit=24 */
router.get("/", search);

/** GET /api/search/suggest?q=مو */
router.get("/suggest", suggestions);

/** GET /api/search/popular */
router.get("/popular", popular);

/** GET /api/search/no-results?q=xyz */
router.get("/no-results", noResults);

/** POST /api/search/track  { query: "..." } */
router.post("/track", track);

export default router;
