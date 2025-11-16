/**
 * 🌐 Phalcon Gear Tracker v2 — API Helper (multi-environment)
 * --------------------------------------------------------
 * Elegantly handles internal (Docker), external (browser),
 * and production API URLs, based on execution context.
 *
 * Priority:
 *  1️⃣ If running in production and NEXT_PUBLIC_API_URL_PROD is defined → use it.
 *  2️⃣ If running on the server (SSR) → use INTERNAL URL.
 *  3️⃣ If running in the browser → use EXTERNAL URL.
 */

const isServer = typeof window === "undefined"
const isProd = process.env.NODE_ENV === "production"

// 🧭 Determine base URL by context
export const API_BASE =
    (isProd && process.env.NEXT_PUBLIC_API_URL_PROD?.replace(/\/$/, "")) ||
    (isServer
        ? process.env.NEXT_PUBLIC_API_URL_INTERNAL?.replace(/\/$/, "") || "http://api:4000"
        : process.env.NEXT_PUBLIC_API_URL_EXTERNAL?.replace(/\/$/, "") || "http://localhost:4000")

/**
 * 📡 Builds the full API URL safely.
 * Removes double slashes, logs context for debugging.
 *
 * @example apiUrl("/api/character/us/quelthalas/phalcon")
 */
export function apiUrl(path: string): string {
    const cleanPath = path.startsWith("/") ? path : `/${path}`
    const url = `${API_BASE}${cleanPath}`
    console.log(`🌐 [apiUrl] Base: ${API_BASE} → ${url}`)
    return url
}
