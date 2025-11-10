"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

/**
 * ⚔️ Gear Tables
 *
 * Includes "Location" column showing BiS item source.
 * Highlights perfect matches in green, mismatches in red tint.
 */

export function GearTables({
                               loading,
                               comparison,
                           }: {
    loading: boolean
    comparison: any
}) {
    if (loading) {
        return (
            <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-md">
                <CardHeader>
                    <CardTitle>Gear Comparison</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center h-32 text-sm text-muted-foreground">
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Loading comparison data...
                </CardContent>
            </Card>
        )
    }

    if (!comparison?.comparison) return null

    return (
        <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-md">
            <CardHeader>
                <CardTitle>Gear Comparison ({comparison.context})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                        <tr className="text-muted-foreground border-b border-border">
                            <th className="p-2 text-left">Slot</th>
                            <th className="p-2 text-left">Current</th>
                            <th className="p-2 text-left">BiS</th>
                            <th className="p-2 text-left">Location</th>
                            <th className="p-2 text-left">Notes</th>
                        </tr>
                        </thead>
                        <tbody>
                        {comparison.comparison.map((item: any, idx: number) => (
                            <tr
                                key={idx}
                                className={`border-b border-border/30 ${
                                    item.match
                                        ? "bg-green-950/30"
                                        : "hover:bg-destructive/10 transition"
                                }`}
                            >
                                <td className="p-2 font-medium">{item.slot}</td>
                                <td className="p-2">{item.currentItem || "—"}</td>
                                <td className="p-2">{item.bisItem || "—"}</td>
                                <td className="p-2 text-muted-foreground">
                                    {item.bisLocation || "—"}
                                </td>
                                <td className="p-2 text-muted-foreground">{item.notes}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
