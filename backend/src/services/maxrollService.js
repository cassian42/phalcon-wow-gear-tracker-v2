/**
 * Maxroll Service (refactored)
 * ------------------------------------------------------------
 * Fetches, extracts, and parses gear recommendations from Maxroll.
 * Uses slotMapper to align slot names with Blizzard's canonical naming.
 *
 * SRP: Fetch + parse Maxroll data only.
 * LSP: Pure, testable mappers with no controller logic.
 * DIP: Depends on slotMapper abstraction, not hardcoded mapping.
 */

import axios from "axios";
import cache from "../utils/cache.js";
import { normalizeSlotName } from "../mappers/slotMapper.js";

export async function getMaxrollGear({
                                         className,
                                         specName,
                                         context = "raid",
                                     }) {
    validateInputs(className, specName, context);
    const guideUrl = buildMaxrollGuideUrl({ className, specName, context });

    const cacheKey = `maxroll:gear:${guideUrl}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const html = await fetchHtml(guideUrl);
    const section = extractGearSection(html);

    if (!section) {
        const result = {
            guideUrl,
            context,
            generatedAt: new Date().toISOString(),
            rows: [],
            note: "Gear section not found on Maxroll.",
        };
        cache.set(cacheKey, result, 300);
        return result;
    }

    const rows = parseGearTable(section);

    const payload = {
        guideUrl,
        context,
        generatedAt: new Date().toISOString(),
        rows,
    };
    cache.set(cacheKey, payload, 600);
    return payload;
}

/* -------------------------------------------------------------------------- */
/*                          Internal Helpers (Private)                        */
/* -------------------------------------------------------------------------- */

function validateInputs(className, specName, context) {
    if (!className || !specName)
        throw new Error("[MaxrollService] Missing class/spec names.");
    if (!["raid", "mythic-plus"].includes(context))
        throw new Error("[MaxrollService] Invalid context type.");
}

function slugify(s) {
    return String(s || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function buildMaxrollGuideUrl({ className, specName, context }) {
    const base = "https://maxroll.gg/wow/class-guides";
    return `${base}/${slugify(specName)}-${slugify(className)}-${slugify(
        context
    )}-guide#gear-header`;
}

async function fetchHtml(url) {
    const { data } = await axios.get(url, {
        headers: {
            "User-Agent":
                "PhalconGearTracker/2.0 (+https://github.com/phalcon-dev)",
        },
        timeout: 15000,
    });
    return String(data || "");
}

function extractGearSection(html) {
    const regex =
        /<h2[^>]*id=["']gear-header["'][^>]*>[\s\S]*?<\/h2>([\s\S]*?)(?=<h2\b|$)/i;
    const match = html.match(regex);
    return match ? match[1] : null;
}

function parseGearTable(sectionHtml) {
    const table = sectionHtml.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
    if (!table) return [];

    const rows = [...table[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
    return rows
        .map((r) => r[1])
        .map(parseRow)
        .filter(Boolean)
        .filter((r) => r.slot && r.itemName);
}

function parseRow(rowHtml) {
    const cols = [
        ...rowHtml.matchAll(/<(?:th|td)[^>]*>([\s\S]*?)<\/(?:th|td)>/gi),
    ].map((m) => cleanCell(m[1]));

    // Expect [Slot, Item, Location]
    const [slot, item, location] = pad(cols, 3);
    const normSlot = normalizeSlotName(slot);

    if (/^slot$/i.test(normSlot)) return null; // header row
    return {
        slot: normSlot,
        itemName: item || "Unknown",
        location: location || "",
    };
}

function cleanCell(html) {
    return decodeEntities(stripTags(html))
        .replace(/\s+/g, " ")
        .trim();
}

function stripTags(s) {
    return s
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<[^>]+>/g, "");
}

/**
 * Decodes both named and numeric HTML entities (decimal & hex)
 * e.g. &amp; → &, &#39; → ', &#x27; → '
 */
function decodeEntities(s) {
    if (!s) return "";
    return String(s)
        // Named entities
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        // Numeric (decimal)
        .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
        // Numeric (hex)
        .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
            String.fromCharCode(parseInt(hex, 16))
        );
}


function pad(arr, n) {
    const copy = [...arr];
    while (copy.length < n) copy.push("");
    return copy;
}
