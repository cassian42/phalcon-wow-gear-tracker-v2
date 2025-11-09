/**
 * Equipment Mapper
 * ------------------------------------------------------------
 * Pure functions to normalize Blizzard payloads into a stable,
 * frontend-friendly shape. No I/O or side-effects.
 * Returns strings for everything user-facing; never "Unnamed".
 */

function safeName(input) {
    if (!input) return "Unknown";
    if (typeof input === "string") return input;
    // Blizzard sometimes returns localized name objects; try common fields defensively.
    return input.en_US || input.es_MX || input.en_GB || input["zh_TW"] || input["pt_BR"] || "Unknown";
}

function pickString(...candidates) {
    for (const c of candidates) {
        if (typeof c === "string" && c.trim()) return c;
    }
    return null;
}

function mapEnchantments(item) {
    const list = item?.enchantments || [];
    const out = list
        .map((e) => pickString(e?.display_string, safeName(e?.enchantment)))
        .filter(Boolean);
    return out.length ? out.join(", ") : null;
}

function mapGems(item) {
    const sockets = item?.sockets || [];
    const out = sockets
        .map((s) => safeName(s?.item?.name) || s?.display_string || null)
        .filter(Boolean);
    return out.length ? out.join(", ") : null;
}

/**
 * Maps gear array from Blizzard equipment endpoint into our canonical shape.
 * Each element:
 *  - slot        (string)
 *  - itemName    (string)
 *  - itemId      (number|null)
 *  - iLvl        (number|null)
 *  - quality     (string)
 *  - enchantments(string|null)
 *  - gems        (string|null)
 */
export function mapEquipment(equipment) {
    const items = Array.isArray(equipment?.equipped_items) ? equipment.equipped_items : [];
    return items.map((it) => {
        const slotName =
            safeName(it?.slot?.name) ||
            safeName(it?.slot?.type)?.replace(/_/g, " ") ||
            "Unknown";

        const nameCandidate =
            safeName(it?.name) ||
            safeName(it?.item?.name) ||
            safeName(it?.media?.display_name);

        return {
            slot: slotName,
            itemName: nameCandidate || "Unknown",
            itemId: it?.item?.id ?? null,
            iLvl: it?.level?.value ?? null,
            quality: safeName(it?.quality?.name) || it?.quality?.type || "Unknown",
            enchantments: mapEnchantments(it),
            gems: mapGems(it),
        };
    });
}

/**
 * Maps profile + equipment to the response we serve.
 */
export function mapCharacterData(profile, equipment) {
    return {
        name: safeName(profile?.name),
        class: safeName(profile?.character_class?.name),
        spec: safeName(profile?.active_spec?.name),
        race: safeName(profile?.race?.name),
        averageIlvl: profile?.average_item_level ?? null,
        guild: safeName(profile?.guild?.name) || "Unguilded",
        faction: safeName(profile?.faction?.name),
        gear: mapEquipment(equipment),
    };
}
