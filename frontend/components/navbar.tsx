"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
    return (
        <nav className="flex items-center justify-between border-b px-6 py-3 bg-background/70 backdrop-blur">
            <Link href="/" className="font-bold text-lg">
                Phalcon Gear Tracker v2
            </Link>
            <div className="flex items-center gap-2">
                <Button asChild variant="ghost">
                    <Link href="/compare">Compare</Link>
                </Button>
                <ThemeToggle />
            </div>
        </nav>
    )
}
