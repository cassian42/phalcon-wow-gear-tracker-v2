/**
 * Comparison Service (Pair-aware)
 * ------------------------------------------------------------
 * Pairs character gear with BiS gear intelligently:
 * - Matches by item name first (across flexible slots)
 * - Falls back to slot-based comparison
 */

import { fetchCharacterAggregated } from "./blizzardService.js";
import { getMaxrollGear } from "./maxrollService.js";

/**
 * Normalize string for consistent comparison
 */
function normalize(s) {
    return String(s || "").trim().toLowerCase();
}

/**
 * Returns the group name a slot belongs to, or null
 */
function getSlotGroup(slot) {
    if (!slot) return null;
    const s = slot.toLowerCase();
    if (s.startsWith("ring")) return "rings";
    if (s.startsWith("trinket")) return "trinkets";
    if (s.includes("hand")) return "weapons";
    return null;
}

/**
 * Core pairing algorithm
 * ------------------------------------------------------------
 * 1. Try to match by exact item name (case-insensitive)
 * 2. Remaining unmatched items → slot-by-slot comparison
 * 3. Keeps one-to-one pairing (no duplicates)
 */
function compareGearSets(currentGear = [], bisGear = []) {
    const results = [];
    const usedCurrent = new Set();

    for (const bis of bisGear) {
        const group = getSlotGroup(bis.slot);
        let current = null;

        // 1️⃣ Exact name match (ignores slot)
        current = currentGear.find(
            (c, idx) =>
                !usedCurrent.has(idx) &&
                normalize(c.itemName) === normalize(bis.itemName)
        );

        // 2️⃣ Same slot / group if not found
        if (!current) {
            current = currentGear.find(
                (c, idx) =>
                    !usedCurrent.has(idx) &&
                    (c.slot === bis.slot ||
                        (group && getSlotGroup(c.slot) === group))
            );
        }

        if (current) {
            usedCurrent.add(currentGear.indexOf(current));
        }

        const match = current
            ? normalize(current.itemName) === normalize(bis.itemName)
            : false;
        const diff = current
            ? (current.iLvl || 0) - (bis.iLvl || 0)
            : 0;

        results.push({
            slot: bis.slot,
            currentItem: current?.itemName || null,
            bisItem: bis.itemName,
            match,
            diff,
            notes: current
                ? match
                    ? "✔ Perfect match"
                    : diff > 0
                        ? "↑ Higher iLvl"
                        : "↓ Needs upgrade"
                : "✖ Not equipped",
        });
    }

    // 3️⃣ Add extra equipped items not in BiS
    currentGear.forEach((c, idx) => {
        if (!usedCurrent.has(idx)) {
            results.push({
                slot: c.slot,
                currentItem: c.itemName,
                bisItem: null,
                match: false,
                diff: 0,
                notes: "✖ Not found in BiS list",
            });
        }
    });

    return results;
}

/**
 * Full comparison workflow — no query params required.
 */
export async function compareCharacterGear(region, realm, name) {
    try {
        // 1️⃣ Blizzard data
        const { profile, equipment } = await fetchCharacterAggregated({
            region,
            realm,
            name,
        });

        const spec = profile?.active_spec?.name ?? "Unknown";
        const klass = profile?.character_class?.name ?? "Unknown";

        const characterGear = Array.isArray(equipment?.equipped_items)
            ? equipment.equipped_items.map((it) => ({
                slot: it?.slot?.name ?? "Unknown",
                itemName: it?.name ?? "Unknown",
                iLvl: it?.level?.value ?? 0,
            }))
            : [];

        // 2️⃣ Maxroll data (context auto-set to "raid")
        const maxroll = await getMaxrollGear({
            className: klass,
            specName: spec,
            context: "raid",
        });
        const bisGear = maxroll?.rows ?? [];

        // 3️⃣ Pair and compare
        const comparison = compareGearSets(characterGear, bisGear);

        const total = comparison.length;
        const perfect = comparison.filter((r) => r.match).length;
        const missing = comparison.filter((r) => !r.currentItem).length;

        return {
            metadata: {
                character: profile?.name ?? name,
                class: klass,
                spec,
                source: "maxroll",
                timestamp: new Date().toISOString(),
                summary: {
                    total,
                    perfect,
                    missing,
                    completion: `${((perfect / total) * 100).toFixed(1)}%`,
                },
            },
            comparison,
        };
    } catch (err) {
        console.error("[ComparisonService]", err);
        throw err;
    }
}
