"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

/**
 * 🔄 Sync Progress
 *
 * Shows current status and three animated dots indicating
 * background sync activity. Minimal, subtle, and informative.
 */

export function SyncProgress({
                                 loading,
                                 status,
                             }: {
    loading: boolean
    status: string
}) {
    return (
        <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-md">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Sync Progress</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <span className="text-sm text-muted-foreground">Current Status</span>
                        <span className="font-medium">{status}</span>
                    </div>

                    {/* Animated dots */}
                    <div className="mt-4 md:mt-0 flex gap-4">
                        {["bg-destructive", "bg-yellow-400", "bg-green-500"].map(
                            (color, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ opacity: loading ? [0.3, 1, 0.3] : 1 }}
                                    transition={{
                                        repeat: loading ? Infinity : 0,
                                        duration: 1.5,
                                        delay: i * 0.2,
                                    }}
                                    className={`w-3 h-3 rounded-full ${color}`}
                                />
                            )
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
