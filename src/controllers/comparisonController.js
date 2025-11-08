/**
 * Comparison Controller (simplified)
 * ------------------------------------------------------------
 * No need for query params — class and spec come from Blizzard.
 *
 * Example:
 *   GET /api/comparison/us/quelthalas/phalcon
 */

import { compareCharacterGear } from "../services/comparisonService.js";

export async function getCharacterComparison(req, res) {
    const { region, realm, name } = req.params;

    if (!region || !realm || !name) {
        return res.status(400).json({
            error: "Missing required parameters: region, realm, or name.",
            example: "/api/comparison/us/quelthalas/phalcon",
        });
    }

    try {
        const result = await compareCharacterGear(region, realm, name);
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
