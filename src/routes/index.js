/**
 * Main API Routes
 * ------------------------------------------------------------
 * Central entry point for all route modules.
 * ------------------------------------------------------------
 */

import express from "express";
import characterRoutes from "./characterRoutes.js";

const router = express.Router();

// Mount route groups
router.use("/character", characterRoutes);

export default router;
