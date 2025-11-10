"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * 🧍 Character Profile
 *
 * Displays character info from the Blizzard API.
 * Automatically renders skeletons when loading or empty.
 */

export function CharacterProfile({
                                     loading,
                                     data,
                                 }: {
    loading: boolean
    data: any
}) {
    if (loading) {
        return (
            <Card className="border-border/60 bg-card/70 backdrop-blur-md shadow-md">
                <CardContent className="flex flex-col sm:flex-row items-center gap-6 p-6">
                    <Skeleton className="w-24 h-24 rounded-full" />
                    <div className="flex flex-col space-y-2 w-full sm:w-auto text-center sm:text-left">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-56" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!data) {
        return (
            <Card className="border-border/60 bg-card/70 backdrop-blur-md shadow-md">
                <CardContent className="p-6 text-center text-sm text-muted-foreground">
                    <p>No character loaded yet.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-border/60 bg-card/70 backdrop-blur-md shadow-md">
            <CardContent className="flex flex-col sm:flex-row items-center gap-6 p-6">
                <img
                    src={data.media?.inset}
                    alt="Character portrait"
                    className="w-24 h-24 rounded-full ring-2 ring-destructive shadow-md object-cover"
                />
                <div className="flex flex-col space-y-1 text-center sm:text-left">
                    <h2 className="text-xl font-semibold">{data.name}</h2>
                    <p className="text-muted-foreground text-sm">
                        Level {data.level} {data.class} • {data.spec} —{" "}
                        <span className="italic">{data.realm}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Guild: <span className="font-medium">{data.guild}</span> | ilvl:{" "}
                        <span className="font-semibold text-foreground">
              {data.averageIlvl}
            </span>
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
