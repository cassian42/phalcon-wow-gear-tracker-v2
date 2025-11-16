"use client"

import { PropsWithChildren, useEffect, useState } from "react"

/**
 * 💧 HydrationProvider — Global hydration guard
 */
export function HydrationProvider({ children }: PropsWithChildren) {
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => {
        setHydrated(true)
    }, [])

    if (!hydrated) return null
    return <>{children}</>
}
