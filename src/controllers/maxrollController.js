/**
 * Maxroll Controller
 * ------------------------------------------------------------
 * Exposes Maxroll gear recommendations via API.
 *
 * Endpoint example:
 *   GET /api/maxroll/:context/:className/:specName
 *
 * Query params:
 *   - context: "raid" or "mythic-plus"
 *   - className: e.g. "Mage"
 *   - specName: e.g. "Frost"
 *
 * Example:
 *   /api/maxroll/raid/Mage/Frost
 *
 * Responsibilities (SRP):
 *   - Validate input params
 *   - Call MaxrollService
 *   - Return structured JSON response
 */

import { getMaxrollGear } from "../services/maxrollService.js";

/**
 * GET /api/maxroll/:context/:className/:specName
 */
export async function getMaxrollGuide(req, res) {
    const { context, className, specName } = req.params;

    if (!className || !specName || !context) {
        return res.status(400).json({
            error: "Missing required parameters: context, className, specName.",
            example: "/api/maxroll/raid/Mage/Frost",
        });
    }

    try {
        const result = await getMaxrollGear({
            className,
            specName,
            context,
        });

        return res.status(200).json({
            source: "Maxroll.gg",
            guideUrl: result.guideUrl,
            context: result.context,
            fetchedAt: result.generatedAt,
            itemCount: result.rows.length,
            data: result.rows,
        });
    } catch (err) {
        console.error(`[MaxrollController] ${err.message}`);
        return res.status(502).json({
            error: "Failed to fetch data from Maxroll.",
            details: err.message,
        });
    }
}
