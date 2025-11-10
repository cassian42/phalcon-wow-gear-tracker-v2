/**
 * Comparison Controller
 * ------------------------------------------------------------
 * Handles requests for gear comparison.
 * Optional query param `?context=raid|mythic-plus`
 *
 * Example:
 *   GET /api/comparison/us/quelthalas/phalcon?context=mythic-plus
 */

import { compareCharacterGear } from "../services/comparisonService.js";

export async function getCharacterComparison(req, res) {
    const { region, realm, name } = req.params;
    const { context = "raid" } = req.query; // ← context param added

    if (!region || !realm || !name) {
        return res.status(400).json({
            error: "Missing required parameters: region, realm, or name.",
            example: "/api/comparison/us/quelthalas/phalcon?context=raid",
        });
    }

    try {
        const result = await compareCharacterGear(region, realm, name, context);

        return res.status(200).json({
            success: true,
            ...result.metadata,
            resultsCount: result.comparison.length,
            comparison: result.comparison,
        });
    } catch (err) {
        console.error(`[ComparisonController] ${err.message}`);
        return res.status(502).json({
            success: false,
            error: "Failed to perform gear comparison.",
            details: err.message,
        });
    }
}
