/**
 * Blizzard Service
 * ------------------------------------------------------------
 * Handles all communication with the Blizzard World of Warcraft Profile API.
 *
 * Responsibilities:
 *  - OAuth2 token management (cached)
 *  - Fetching character profile, equipment, and media
 *  - Providing simple, composable functions with no mapping logic
 *
 * Design:
 *  - SRP: Each function has one clear responsibility.
 *  - OCP: New endpoints can be added safely without altering existing logic.
 *  - DRY: Shared constants and helpers avoid duplicated URL fragments.
 */

import axios from "axios";
import cache from "../utils/cache.js";

/* -------------------------------------------------------------------------- */
/*                                   Constants                                */
/* -------------------------------------------------------------------------- */

const TOKEN_CACHE_KEY = "blizz:token";
const TOKEN_TTL_SEC = 3300; // ~55 minutes
const PROFILE_BASE_PATH = "/profile/wow/character";

/* -------------------------------------------------------------------------- */
/*                              Auth Token Logic                              */
/* -------------------------------------------------------------------------- */

/**
 * Returns Blizzard API client credentials from environment.
 * Throws a clear error if missing.
 */
function getBlizzardConfig() {
    const clientId = process.env.BLIZZARD_CLIENT_ID;
    const clientSecret = process.env.BLIZZARD_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        throw new Error(
            "[BlizzardService] Missing BLIZZARD_CLIENT_ID or BLIZZARD_CLIENT_SECRET"
        );
    }
    return { clientId, clientSecret };
}

/**
 * Retrieves (and caches) an OAuth2 access token using the Client Credentials flow.
 */
async function getAccessToken() {
    const cached = cache.get(TOKEN_CACHE_KEY);
    if (cached) return cached;

    const { clientId, clientSecret } = getBlizzardConfig();
    const body = new URLSearchParams({ grant_type: "client_credentials" });

    const { data } = await axios.post("https://oauth.battle.net/token", body, {
        auth: { username: clientId, password: clientSecret },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 10_000,
    });

    if (!data?.access_token) {
        throw new Error("[BlizzardService] OAuth response missing access_token");
    }

    cache.set(TOKEN_CACHE_KEY, data.access_token, TOKEN_TTL_SEC);
    return data.access_token;
}

/* -------------------------------------------------------------------------- */
/*                             Generic Fetch Helper                           */
/* -------------------------------------------------------------------------- */

/**
 * Performs a Blizzard API GET request with automatic token handling and locale.
 */
async function blizzardGet(region, path, { locale = "en_US" } = {}) {
    const token = await getAccessToken();
    const baseURL = `https://${region}.api.blizzard.com`;
    const params = { namespace: `profile-${region}`, locale };

    const { data } = await axios.get(`${baseURL}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
        timeout: 12_000,
    });

    return data;
}

/* -------------------------------------------------------------------------- */
/*                             Character Endpoints                            */
/* -------------------------------------------------------------------------- */

/**
 * Fetches a character profile (general info).
 */
export async function getCharacterProfile({ region, realm, name, locale = "en_US" }) {
    const realmSlug = slug(realm);
    const nameSlug = slug(name);
    return blizzardGet(region, `${PROFILE_BASE_PATH}/${realmSlug}/${nameSlug}`, {
        locale,
    });
}

/**
 * Fetches a character's equipment list.
 */
export async function getCharacterEquipment({ region, realm, name, locale = "en_US" }) {
    const realmSlug = slug(realm);
    const nameSlug = slug(name);
    return blizzardGet(
        region,
        `${PROFILE_BASE_PATH}/${realmSlug}/${nameSlug}/equipment`,
        { locale }
    );
}

/**
 * Fetches a character's media assets (avatar, inset, main).
 */
export async function getCharacterMedia({ region, realm, name, locale = "en_US" }) {
    const realmSlug = slug(realm);
    const nameSlug = slug(name);
    const data = await blizzardGet(
        region,
        `${PROFILE_BASE_PATH}/${realmSlug}/${nameSlug}/character-media`,
        { locale }
    );

    const assets = Array.isArray(data.assets) ? data.assets : [];
    const media = {
        avatar: assets.find((a) => a.key === "avatar")?.value || null,
        inset: assets.find((a) => a.key === "inset")?.value || null,
        main: assets.find((a) => a.key === "main-raw")?.value || null,
    };

    return media;
}

/* -------------------------------------------------------------------------- */
/*                        Aggregated Fetch Convenience API                    */
/* -------------------------------------------------------------------------- */

/**
 * Fetches profile + equipment + media in parallel and caches result briefly.
 */
export async function fetchCharacterAggregated({ region, realm, name, locale = "en_US" }) {
    const cacheKey = `char:${region}:${slug(realm)}:${slug(name)}:${locale}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const [profile, equipment, media] = await Promise.all([
        getCharacterProfile({ region, realm, name, locale }),
        getCharacterEquipment({ region, realm, name, locale }),
        getCharacterMedia({ region, realm, name, locale }),
    ]);

    const payload = { profile, equipment, media };
    cache.set(cacheKey, payload, 60); // 1 minute cache
    return payload;
}

/* -------------------------------------------------------------------------- */
/*                                   Utils                                    */
/* -------------------------------------------------------------------------- */

/**
 * Converts text into a Blizzard-compatible slug.
 */
function slug(s) {
    return String(s).trim().toLowerCase().replace(/\s+/g, "-");
}
