/**
 * Blizzard Service
 * ------------------------------------------------------------
 * Responsibilities (SRP):
 *  - OAuth2 Client Credentials token management (with cache)
 *  - Fetching character profile & equipment from Blizzard API
 *  - Zero knowledge of mapping/formatting (that’s the mapper’s job)
 *
 * Open for extension (OCP): if later you add media, mythic+, etc.,
 * add small, focused functions here that reuse the auth & http plumbing.
 */

import axios from "axios";
import cache from "../utils/cache.js";

const TOKEN_CACHE_KEY = "blizz:token";
const TOKEN_TTL_SEC = 3300; // ~55 minutes (shorter than 3600 to refresh safely)

/**
 * Small, testable provider for environment/config.
 * If later you move to a config module or secret manager,
 * you only change this one place.
 */
function getBlizzardConfig() {
    const clientId = process.env.BLIZZARD_CLIENT_ID;
    const clientSecret = process.env.BLIZZARD_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        throw new Error("[BlizzardService] Missing BLIZZARD_CLIENT_ID/BLIZZARD_CLIENT_SECRET");
    }
    return { clientId, clientSecret };
}

async function getAccessToken() {
    const cached = cache.get(TOKEN_CACHE_KEY);
    if (cached) return cached;

    const { clientId, clientSecret } = getBlizzardConfig();

    const body = new URLSearchParams();
    body.set("grant_type", "client_credentials");

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

/**
 * Shared axios GET with auth + standard query params.
 * Namespace format per Blizzard docs: "profile-{region}"
 */
async function blizzardGet(region, path, { locale = "en_US" } = {}) {
    const token = await getAccessToken();
    const baseURL = `https://${region}.api.blizzard.com`;
    const params = {
        namespace: `profile-${region}`,
        locale,
    };

    const { data } = await axios.get(`${baseURL}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
        timeout: 12_000,
    });

    return data;
}

/**
 * Public API — fetchers (ISP-friendly signatures)
 * Accepts raw values; slugging is handled internally.
 */

export async function getCharacterProfile({ region, realm, name, locale = "en_US" }) {
    const realmSlug = slug(realm);
    const nameSlug = slug(name);
    return blizzardGet(region, `/profile/wow/character/${realmSlug}/${nameSlug}`, { locale });
}

export async function getCharacterEquipment({ region, realm, name, locale = "en_US" }) {
    const realmSlug = slug(realm);
    const nameSlug = slug(name);
    return blizzardGet(
        region,
        `/profile/wow/character/${realmSlug}/${nameSlug}/equipment`,
        { locale }
    );
}

/**
 * Convenience facade combining profile + equipment with short TTL.
 * Controller may call fetchCharacterAggregated or call each fetcher separately.
 */
export async function fetchCharacterAggregated({ region, realm, name, locale = "en_US" }) {
    const cacheKey = `char:${region}:${slug(realm)}:${slug(name)}:${locale}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const [profile, equipment] = await Promise.all([
        getCharacterProfile({ region, realm, name, locale }),
        getCharacterEquipment({ region, realm, name, locale }),
    ]);

    const payload = { profile, equipment };
    cache.set(cacheKey, payload, 60); // 1 minute: avoids hammering when users refresh
    return payload;
}

/** utils */
function slug(s) {
    return String(s).trim().toLowerCase().replace(/\s+/g, "-");
}
