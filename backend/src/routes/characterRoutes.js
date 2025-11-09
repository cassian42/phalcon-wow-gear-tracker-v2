/**
 * Character Routes
 * ------------------------------------------------------------
 * Defines endpoints related to World of Warcraft character data.
 * Delegates logic to CharacterController.
 * ------------------------------------------------------------
 */

import express from "express";
import { getCharacter } from "../controllers/characterController.js";

const router = express.Router();

// GET /api/character/:region/:realm/:name
router.get("/:region/:realm/:name", getCharacter);

export default router;
