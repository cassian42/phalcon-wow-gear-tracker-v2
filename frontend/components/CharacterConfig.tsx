"use client"

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

/**
 * ⚙️ Character Configuration
 *
 * Inputs are now fully controlled from parent state.
 * Updates flow upward through setters (lifting state up).
 */

export function CharacterConfig({
                                    loading,
                                    onSync,
                                    context,
                                    setContext,
                                    region,
                                    setRegion,
                                    realm,
                                    setRealm,
                                    name,
                                    setName,
                                }: {
    loading: boolean
    onSync: () => void
    context: "raid" | "mythic-plus"
    setContext: (value: "raid" | "mythic-plus") => void
    region: string
    setRegion: (v: string) => void
    realm: string
    setRealm: (v: string) => void
    name: string
    setName: (v: string) => void
}) {
    return (
        <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-md">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">
                    Character Configuration
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm text-muted-foreground">Character</label>
                        <Input
                            placeholder="Phalcon"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Realm</label>
                        <Input
                            placeholder="quelthalas"
                            value={realm}
                            onChange={(e) => setRealm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm text-muted-foreground">Region</label>
                        <Input
                            placeholder="us"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Namespace</label>
                        <Input placeholder="profile-us" disabled />
                    </div>
                </div>

                <div className="mt-2">
                    <label className="text-sm text-muted-foreground">Content Type</label>
                    <Select
                        value={context}
                        onValueChange={(value) =>
                            setContext(value as "raid" | "mythic-plus")
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select context" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="raid">Raid</SelectItem>
                            <SelectItem value="mythic-plus">Mythic+</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end mt-4">
                    <Button
                        variant="destructive"
                        onClick={onSync}
                        disabled={loading}
                        className="w-full md:w-auto"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? "Syncing..." : "Run Sync"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
