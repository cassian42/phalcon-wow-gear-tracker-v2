"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
    return (
        <nav className="flex justify-between items-center py-3 border-b border-border/40">
            <Link href="/" className="text-lg font-semibold">
                Phalcon Gear Tracker v2
            </Link>
            <ThemeToggle />
        </nav>
    )
}
