import express from "express";
import { compareCharacterGear } from "../services/comparisonService.js";

const router = express.Router();

router.get("/:region/:realm/:name", async (req, res) => {
    const { region, realm, name } = req.params;
    const { spec = "default", source = "maxroll" } = req.query;

    try {
        const result = await compareCharacterGear(region, realm, name, spec, source);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
