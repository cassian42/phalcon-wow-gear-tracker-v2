import express from "express";
import { getMaxrollGuide } from "../controllers/maxrollController.js";

const router = express.Router();

// Example: /api/maxroll/raid/Mage/Frost
router.get("/:context/:className/:specName", getMaxrollGuide);

export default router;
