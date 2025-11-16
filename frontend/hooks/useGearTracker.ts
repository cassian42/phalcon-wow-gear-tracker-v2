"use client"

import { useState } from "react"
import { apiUrl } from "@/lib/api" // ✅ central API helper

/**
 * ⚙️ Custom Hook: useGearTracker
 *
 * Centralizes API calls and state for the Phalcon Gear Tracker dashboard.
 * - Follows SRP (Single Responsibility Principle)
 * - Reads API base URL from environment (via apiUrl helper)
 * - Keeps data fetching logic separate from UI rendering
 */

export function useGearTracker() {
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("Ready")
    const [character, setCharacter] = useState<any>(null)
    const [comparison, setComparison] = useState<any>(null)
    const [context, setContext] = useState<"raid" | "mythic-plus">("raid")

    /**
     * Fetches full character data from backend (Blizzard API via backend proxy).
     */
    const fetchCharacter = async (region: string, realm: string, name: string) => {
        try {
            setLoading(true)
            setStatus("Fetching character data...")

            const res = await fetch(apiUrl(`/api/character/${region}/${realm}/${name}`))
            if (!res.ok) throw new Error(`HTTP ${res.status}`)

            const json = await res.json()
            setCharacter(json.data)
            setStatus("Character loaded ✅")
        } catch (err) {
            console.error("[fetchCharacter] Error:", err)
            setStatus("❌ Error fetching character data")
        } finally {
            setLoading(false)
        }
    }

    /**
     * Fetches comparison data (current gear vs BiS from Maxroll).
     */
    const fetchComparison = async (
        region: string,
        realm: string,
        name: string,
        selectedContext: "raid" | "mythic-plus"
    ) => {
        try {
            setLoading(true)
            setStatus(`Comparing gear (${selectedContext})...`)

            const res = await fetch(
                apiUrl(`/api/comparison/${region}/${realm}/${name}?context=${selectedContext}`)
            )
            if (!res.ok) throw new Error(`HTTP ${res.status}`)

            const json = await res.json()
            setComparison(json)
            setStatus("✅ Comparison complete")
        } catch (err) {
            console.error("[fetchComparison] Error:", err)
            setStatus("❌ Error fetching comparison")
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        status,
        character,
        comparison,
        context,
        setContext,
        fetchCharacter,
        fetchComparison,
    }
}
