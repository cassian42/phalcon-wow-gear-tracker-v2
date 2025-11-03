import { Router } from "express";
import { syncCharacter } from "../controllers/characterController.js";

const router = Router();
router.post("/character/sync", syncCharacter);

export default router;
