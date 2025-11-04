/**
 * Slot Mapper
 * ------------------------------------------------------------
 * Maps slot names from external sources (Maxroll, Wowhead, etc.)
 * to Blizzard-standard slot names.
 *
 * Source of truth: Blizzard
 * SRP: Single Responsibility — slot normalization only.
 * OCP: Open for extension — add new equivalences safely.
 */

const SLOT_EQUIVALENCES = {
    // Maxroll → Blizzard
    "Shoulder": "Shoulders",
    "Cloak": "Back",
    "Belt": "Waist",
    "Gloves": "Hands",
    "Weapon": "Main Hand",
    "Off-Hand": "Off Hand",
    "Trinket 1": "Trinket 1",
    "Trinket 2": "Trinket 2",
    "Ring 1": "Ring 1",
    "Ring 2": "Ring 2",

    // Extra normalization (future-proofing)
    "Bracers": "Wrist",
    "Pants": "Legs",
    "Boots": "Feet",
    "Chestpiece": "Chest",
    "Two-Hand": "Main Hand",
};

/**
 * Normalize slot name to Blizzard standard
 * @param {string} sourceSlot - Slot name from another source
 * @returns {string}
 */
export function normalizeSlotName(sourceSlot = "") {
    const key = sourceSlot.trim();
    return SLOT_EQUIVALENCES[key] || key;
}

/**
 * Utility for debugging mappings
 * e.g. `console.table(listEquivalences())`
 */
export function listEquivalences() {
    return Object.entries(SLOT_EQUIVALENCES).map(([from, to]) => ({
        from,
        to,
    }));
}
