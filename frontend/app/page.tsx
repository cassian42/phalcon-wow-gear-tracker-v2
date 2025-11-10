"use client"

import { useState } from "react"
import { CharacterProfile } from "@/components/CharacterProfile"
import { CharacterConfig } from "@/components/CharacterConfig"
import { SyncProgress } from "@/components/SyncProgress"
import { GearTables } from "@/components/GearTables"
import { Footer } from "@/components/Footer"
import { useGearTracker } from "@/hooks/useGearTracker"

/**
 * 🧭 Phalcon Gear Tracker v2.3
 * - Inputs now fully dynamic and reactive
 * - Added support for BiS location column
 */

export default function Dashboard() {
    const {
        loading,
        status,
        character,
        comparison,
        context,
        setContext,
        fetchCharacter,
        fetchComparison,
    } = useGearTracker()

    // Local controlled form state
    const [region, setRegion] = useState("us")
    const [realm, setRealm] = useState("quelthalas")
    const [name, setName] = useState("phalcon")

    // Full sync pipeline
    const handleSync = async () => {
        if (!region || !realm || !name) return
        await fetchCharacter(region, realm, name)
        await fetchComparison(region, realm, name, context)
    }

    return (
        <div className="min-h-screen bg-background text-foreground py-10 px-4">
            <div className="max-w-7xl mx-auto space-y-8">
                <CharacterProfile loading={loading} data={character} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CharacterConfig
                        loading={loading}
                        onSync={handleSync}
                        context={context}
                        setContext={setContext}
                        region={region}
                        setRegion={setRegion}
                        realm={realm}
                        setRealm={setRealm}
                        name={name}
                        setName={setName}
                    />
                    <SyncProgress loading={loading} status={status} />
                </div>
                <GearTables loading={loading} comparison={comparison} />
                <Footer />
            </div>
        </div>
    )
}
