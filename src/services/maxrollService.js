/**
 * Maxroll Service
 * ------------------------------------------------------------
 * Fetches Best-in-Slot (BiS) data for a given class/spec
 * from Maxroll.gg or local fallback JSON.
 * Normalizes the data to match Blizzard slot naming conventions.
 * ------------------------------------------------------------
 */

import axios from "axios";
import fs from "fs/promises";
import path from "path";

/**
 * Standard slot mapping to Blizzard's terminology
 */
const SLOT_MAP = {
    Head: "Head",
    Neck: "Neck",
    Shoulders: "Shoulder",
    Back: "Back",
    Chest: "Chest",
    Wrist: "Wrist",
    Hands: "Hands",
    Waist: "Waist",
    Legs: "Legs",
    Feet: "Feet",
    Finger1: "Finger1",
    Finger2: "Finger2",
    Trinket1: "Trinket1",
    Trinket2: "Trinket2",
    MainHand: "MainHand",
    OffHand: "OffHand"
};

/**
 * Attempts to fetch BiS data from local or remote source (Maxroll)
 * @param {string} className - Character class (e.g., "Warrior")
 * @param {string} spec - Specialization (e.g., "Fury")
 * @returns {Promise<Object[]>} Normalized BiS data
 */
export async function getMaxrollBisData(className, spec) {
    try {
        const localPath = path.resolve(`./data/bis/${className.toLowerCase()}_${spec.toLowerCase()}.json`);
        const localExists = await fs.access(localPath).then(() => true).catch(() => false);

        let bisData = [];

        if (localExists) {
            const data = await fs.readFile(localPath, "utf-8");
            bisData = JSON.parse(data);
            console.log(`[MaxrollService] Loaded local BiS for ${className} (${spec})`);
        } else {
            const url = `https://maxroll.gg/wow/tools/bis/${className.toLowerCase()}`;
            const { data: html } = await axios.get(url);
            const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/);

            if (!match) throw new Error("BiS data not found in Maxroll HTML");
            const json = JSON.parse(match[1]);
            bisData = json?.props?.pageProps?.items || [];
            console.log(`[MaxrollService] Fetched remote BiS for ${className} (${spec})`);
        }

        // Normalize and map to Blizzard slots
        const normalized = bisData
            .filter(item => item.slot && item.name)
            .map(item => ({
                slot: SLOT_MAP[item.slot] || item.slot,
                itemName: item.name,
                itemId: item.id || null,
                iLvl: item.iLvl || null,
                quality: item.quality || null,
                source: "Maxroll.gg"
            }));

        return normalized;
    } catch (err) {
        console.error(`[MaxrollService] Error fetching BiS: ${err.message}`);
        throw err;
    }
}
