/**
 * Comparison Service
 * ------------------------------------------------------------
 * Compares a character's current gear (from Blizzard API)
 * against a reference BiS dataset from any source.
 * ------------------------------------------------------------
 */

import { getCharacterData } from "./blizzardService.js";
import { getMaxrollBisData } from "./maxrollService.js";

/**
 * Compares two gear datasets slot-by-slot
 */
function compareGearSets(current, bis) {
    const results = [];

    for (const slot in current) {
        const currentItem = current[slot];
        const bisItem = bis.find(i => i.slot === slot);

        if (!bisItem) continue;

        const match = currentItem.itemId === bisItem.itemId;
        const diff = (currentItem.iLvl || 0) - (bisItem.iLvl || 0);

        results.push({
            slot,
            currentItem: currentItem.itemName,
            bisItem: bisItem.itemName,
            match,
            diff,
            notes: match ? "✔ Perfect match" : diff > 0 ? "↑ Higher iLvl" : "↓ Needs upgrade"
        });
    }

    return results;
}

/**
 * Entry point: performs full comparison workflow
 * @param {string} region - e.g., "us"
 * @param {string} realm - e.g., "quelthalas"
 * @param {string} name - e.g., "phalcon"
 * @param {string} spec - specialization (optional)
 * @param {string} source - source of BiS ("maxroll", "local", etc.)
 */
export async function compareCharacterGear(region, realm, name, spec = "default", source = "maxroll") {
    const character = await getCharacterData(region, realm, name);

    let bisData;
    if (source === "maxroll") {
        bisData = await getMaxrollBisData(character.class, spec);
    } else {
        throw new Error(`Unsupported BiS source: ${source}`);
    }

    const comparison = compareGearSets(character.gear, bisData);

    return {
        metadata: {
            character: character.name,
            class: character.class,
            spec,
            source,
            timestamp: new Date().toISOString()
        },
        comparison
    };
}
