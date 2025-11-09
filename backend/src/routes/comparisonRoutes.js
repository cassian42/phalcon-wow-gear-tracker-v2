import express from "express";
import { getCharacterComparison } from "../controllers/comparisonController.js";

const router = express.Router();

// Example: /api/comparison/us/quelthalas/phalcon?spec=Frost&source=maxroll
router.get("/:region/:realm/:name", getCharacterComparison);

export default router;
