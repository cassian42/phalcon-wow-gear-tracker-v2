/**
 * Simple in-memory cache
 * ------------------------------------------------------------
 * Exported as a DEFAULT instance so callers can just:
 *   import cache from "../utils/cache.js"
 * Keeping it as a thin wrapper for future swap to LRU/Redis.
 */
import NodeCache from "node-cache";

const cache = new NodeCache({
    stdTTL: 300, // 5 minutes default
    checkperiod: 60,
    useClones: false,
});

export default cache;
