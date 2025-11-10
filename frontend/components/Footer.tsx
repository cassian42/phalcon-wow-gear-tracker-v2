"use client"

import { Separator } from "@/components/ui/separator"

export function Footer() {
    return (
        <div className="text-center text-xs text-muted-foreground pt-10">
            <Separator className="mb-4" />
            <p>
                © {new Date().getFullYear()} Phalcon Gear Tracker v2 — Designed with
                precision and elegance.
            </p>
        </div>
    )
}
