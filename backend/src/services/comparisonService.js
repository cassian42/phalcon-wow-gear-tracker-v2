/**
 * Comparison Service (Pair-aware + Context Support)
 * ------------------------------------------------------------
 * Pairs character gear with BiS gear intelligently and compares it.
 * Now supports context selection (raid / mythic-plus).
 */

import { fetchCharacterAggregated } from "./blizzardService.js";
import { getMaxrollGear } from "./maxrollService.js";

/* -------------------------------------------------------------------------- */
/*                               Helper Functions                             */
/* -------------------------------------------------------------------------- */

/**
 * Normalize string for consistent comparison.
 */
function normalize(s) {
    return String(s || "").trim().toLowerCase();
}

/**
 * Returns the logical group a slot belongs to (rings, trinkets, weapons).
 */
function getSlotGroup(slot) {
    if (!slot) return null;
    const s = slot.toLowerCase();
    if (s.startsWith("ring")) return "rings";
    if (s.startsWith("trinket")) return "trinkets";
    if (s.includes("hand")) return "weapons";
    return null;
}

/* -------------------------------------------------------------------------- */
/*                           Core Comparison Logic                            */
/* -------------------------------------------------------------------------- */

/**
 * Performs one-to-one pairing between current gear and BiS gear.
 * 1. Tries to match by exact item name.
 * 2. Falls back to slot/group-based pairing.
 */
function compareGearSets(currentGear = [], bisGear = []) {
    const results = [];
    const usedCurrent = new Set();

    for (const bis of bisGear) {
        const group = getSlotGroup(bis.slot);
        let current = null;

        // 1️⃣ Name-based pairing (case-insensitive)
        current = currentGear.find(
            (c, idx) =>
                !usedCurrent.has(idx) &&
                normalize(c.itemName) === normalize(bis.itemName)
        );

        // 2️⃣ Fallback: same slot or same group
        if (!current) {
            current = currentGear.find(
                (c, idx) =>
                    !usedCurrent.has(idx) &&
                    (c.slot === bis.slot ||
                        (group && getSlotGroup(c.slot) === group))
            );
        }

        if (current) usedCurrent.add(currentGear.indexOf(current));

        const match = current
            ? normalize(current.itemName) === normalize(bis.itemName)
            : false;
        const diff = current ? (current.iLvl || 0) - (bis.iLvl || 0) : 0;

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

/* -------------------------------------------------------------------------- */
/*                           Public Comparison API                            */
/* -------------------------------------------------------------------------- */

/**
 * Full comparison workflow.
 * Fetches Blizzard data and compares against Maxroll BiS by context.
 *
 * @param {string} region - e.g. "us"
 * @param {string} realm - e.g. "quelthalas"
 * @param {string} name  - character name
 * @param {string} context - "raid" | "mythic-plus" (default: "raid")
 */
export async function compareCharacterGear(region, realm, name, context = "raid") {
    try {
        // 1️⃣ Fetch data from Blizzard
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

        // 2️⃣ Fetch BiS gear from Maxroll based on context
        const maxroll = await getMaxrollGear({
            className: klass,
            specName: spec,
            context,
        });
        const bisGear = maxroll?.rows ?? [];

        // 3️⃣ Compare sets
        const comparison = compareGearSets(characterGear, bisGear);

        // 4️⃣ Summary
        const total = comparison.length;
        const perfect = comparison.filter((r) => r.match).length;
        const missing = comparison.filter((r) => !r.currentItem).length;

        return {
            metadata: {
                character: profile?.name ?? name,
                class: klass,
                spec,
                source: "maxroll",
                context,
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
