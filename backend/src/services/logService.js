// ──────────────────────────────────────────────────────────────
// logService.js
// ──────────────────────────────────────────────────────────────
// Handles anonymous system telemetry logging through Prisma ORM.
// All logs are non-personal and only include operational metadata.
// ──────────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Records an anonymous query log into the database.
 * @param {string} action - Type of operation (e.g., fetch_character, compare, etc.)
 * @param {string} region - Blizzard API region (e.g., "us")
 * @param {string} realm - Character realm name
 * @param {number} durationMs - Operation duration in milliseconds
 */
export async function logQuery(action, region, realm, durationMs) {
    try {
        await prisma.queryLog.create({
            data: { action, region, realm, durationMs },
        });
    } catch (error) {
        console.warn(`⚠️ [LogService] Failed to store query log: ${error.message}`);
    }
}
