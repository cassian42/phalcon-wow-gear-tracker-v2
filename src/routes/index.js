/**
 * Main API Routes
 * ------------------------------------------------------------
 * Central entry point for all route modules.
 * ------------------------------------------------------------
 */

import express from "express";
import characterRoutes from "./characterRoutes.js";
import maxrollRoutes from "./maxrollRoutes.js";
import comparisonRoutes from "./comparisonRoutes.js";

const router = express.Router();

// Mount route groups
router.use("/character", characterRoutes);
router.use("/maxroll", maxrollRoutes);
router.use("/comparison", comparisonRoutes);

export default router;
