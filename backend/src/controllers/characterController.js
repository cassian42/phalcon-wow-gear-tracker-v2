/**
 * Character Controller
 * ------------------------------------------------------------
 * Orchestrates the “character” use case:
 *  - Validates inputs
 *  - Gets profile+equipment (via BlizzardService)
 *  - Maps the payload (via EquipmentMapper)
 *  - Returns a stable, cache-friendly JSON
 */

import { fetchCharacterAggregated } from "../services/blizzardService.js";
import { mapCharacterData } from "../services/equipmentMapper.js";

function badRequest(res, message) {
    return res.status(400).json({ error: message });
}

export async function getCharacter(req, res) {
    const { region, realm, name } = req.params;
    const { locale = "en_US" } = req.query;

    if (!region) return badRequest(res, "Missing region");
    if (!realm) return badRequest(res, "Missing realm");
    if (!name) return badRequest(res, "Missing name");

    try {
        const { profile, equipment } = await fetchCharacterAggregated({
            region,
            realm,
            name,
            locale,
        });

        const mapped = mapCharacterData(profile, equipment);

        return res.status(200).json({
            source: "Blizzard API / Cached",
            timestamp: new Date().toISOString(),
            data: mapped,
        });
    } catch (err) {
        // Keep details for logs; send safe message to caller
        console.error(`[CharacterController] ${err.stack || err.message}`);
        return res.status(502).json({
            error: "Failed to fetch character data from Blizzard API",
            details: err.message,
        });
    }
}
