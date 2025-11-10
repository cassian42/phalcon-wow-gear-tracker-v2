"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

/**
 * ⚔️ Gear Tables (v2.3)
 *
 * Now displays BiS item location (source) directly from API.
 * The new API returns `location` within each comparison item.
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
                <CardTitle>
                    Gear Comparison ({comparison.context})
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                    Showing current equipment vs. BiS from Maxroll.gg
                </p>
            </CardHeader>

            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                        <tr className="text-muted-foreground border-b border-border text-left">
                            <th className="p-2">Slot</th>
                            <th className="p-2">Current</th>
                            <th className="p-2">BiS</th>
                            <th className="p-2">Location</th>
                            <th className="p-2">Notes</th>
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
                                <td className="p-2 font-semibold">{item.bisItem || "—"}</td>

                                <td className="p-2">
                                    {item.location ? (
                                        <span className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
                        {item.location}
                      </span>
                                    ) : (
                                        <span className="text-muted-foreground">—</span>
                                    )}
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
