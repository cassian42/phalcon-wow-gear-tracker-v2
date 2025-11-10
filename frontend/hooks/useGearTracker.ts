"use client"

import { useState } from "react"

/**
 * ⚙️ Custom Hook: useGearTracker
 *
 * Centralizes API calls and state for the Phalcon Gear Tracker dashboard.
 * Follows the Single Responsibility Principle — this hook only manages data logic.
 */

export function useGearTracker() {
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("Ready")
    const [character, setCharacter] = useState<any>(null)
    const [comparison, setComparison] = useState<any>(null)
    const [context, setContext] = useState<"raid" | "mythic-plus">("raid")

    /**
     * Fetches full character data from backend.
     */
    const fetchCharacter = async (region: string, realm: string, name: string) => {
        try {
            setLoading(true)
            setStatus("Fetching character data...")
            const res = await fetch(
                `http://localhost:4000/api/character/${region}/${realm}/${name}`
            )
            const json = await res.json()
            setCharacter(json.data)
            setStatus("Character loaded")
        } catch (err) {
            console.error(err)
            setStatus("❌ Error fetching character data")
        } finally {
            setLoading(false)
        }
    }

    /**
     * Fetches comparison data (current vs BiS).
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
                `http://localhost:4000/api/comparison/${region}/${realm}/${name}?context=${selectedContext}`
            )
            const json = await res.json()
            setComparison(json)
            setStatus("✅ Comparison complete")
        } catch (err) {
            console.error(err)
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
