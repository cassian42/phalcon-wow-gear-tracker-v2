// ──────────────────────────────────────────────────────────────
// blizzardService.js
// ──────────────────────────────────────────────────────────────
// Provides interaction with the Blizzard API for character data.
// Includes secure caching, token management, and anonymous telemetry.
// ──────────────────────────────────────────────────────────────

import axios from 'axios';
import NodeCache from 'node-cache';
import dotenv from 'dotenv';
import { logQuery } from './logService.js';

dotenv.config();

const cache = new NodeCache({ stdTTL: 900 }); // 15 min cache
const BASE_URL = 'https://us.api.blizzard.com/profile/wow/character';

/**
 * Retrieves and caches the Blizzard API access token.
 * @returns {Promise<string>} OAuth access token
 */
async function getAccessToken() {
    const cached = cache.get('blizzard_token');
    if (cached) return cached;

    const response = await axios.post(
        'https://oauth.battle.net/token',
        new URLSearchParams({ grant_type: 'client_credentials' }),
        {
            auth: {
                username: process.env.BLIZZARD_CLIENT_ID,
                password: process.env.BLIZZARD_CLIENT_SECRET,
            },
        }
    );

    const token = response.data.access_token;
    cache.set('blizzard_token', token, 3400);
    return token;
}

/**
 * Fetches the character profile from the Blizzard API.
 * @param {string} region - Blizzard API region
 * @param {string} realm - Character realm
 * @param {string} character - Character name
 * @returns {Promise<Object>} Blizzard API response (character profile)
 */
export async function getCharacterProfile(region, realm, character) {
    const cacheKey = `${region}-${realm}-${character}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const start = Date.now();
    try {
        const token = await getAccessToken();
        const url = `${BASE_URL}/${realm}/${character}?namespace=profile-${region}&locale=en_US&access_token=${token}`;
        const { data } = await axios.get(url);

        // Cache the response
        cache.set(cacheKey, data, 900);

        // Log anonymous telemetry
        await logQuery('fetch_character', region, realm, Date.now() - start);

        return data;
    } catch (error) {
        await logQuery('fetch_character_error', region, realm, Date.now() - start);
        console.error(`❌ [BlizzardService] Failed to fetch profile: ${error.message}`);
        throw error;
    }
}
