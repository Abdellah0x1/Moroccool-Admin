"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

type Entry = {
    id: string
    days: string
    hours: string
}

type OpeningHoursData = Record<string, string>

export function OpeningHoursInput({
    name = "openingHours",
    defaultValue,
}: {
    name?: string
    defaultValue?: OpeningHoursData
}) {
    const initial: Entry[] = defaultValue
        ? Object.entries(defaultValue).map(([days, hours]) => ({
              id: crypto.randomUUID(),
              days,
              hours,
          }))
        : [{ id: crypto.randomUUID(), days: "", hours: "" }]

    const [entries, setEntries] = useState<Entry[]>(initial)

    function addEntry() {
        setEntries((prev) => [
            ...prev,
            { id: crypto.randomUUID(), days: "", hours: "" },
        ])
    }

    function removeEntry(id: string) {
        setEntries((prev) => prev.filter((e) => e.id !== id))
    }

    function updateEntry(id: string, field: "days" | "hours", value: string) {
        setEntries((prev) =>
            prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
        )
    }

    // Build the JSON object from entries and put it in a hidden input
    const jsonValue: OpeningHoursData = {}
    for (const entry of entries) {
        if (entry.days.trim()) {
            jsonValue[entry.days.trim()] = entry.hours.trim()
        }
    }

    return (
        <div className="space-y-3">
            {entries.map((entry, index) => (
                <div key={entry.id} className="flex items-end gap-3">
                    <div className="flex-1 space-y-1">
                        {index === 0 && (
                            <label className="text-xs font-medium text-muted-foreground">
                                Days
                            </label>
                        )}
                        <Input
                            placeholder="e.g. Mon-Fri"
                            value={entry.days}
                            onChange={(e) =>
                                updateEntry(entry.id, "days", e.target.value)
                            }
                        />
                    </div>
                    <div className="flex-1 space-y-1">
                        {index === 0 && (
                            <label className="text-xs font-medium text-muted-foreground">
                                Hours
                            </label>
                        )}
                        <Input
                            placeholder="e.g. 12:00 PM - 01:00 AM"
                            value={entry.hours}
                            onChange={(e) =>
                                updateEntry(entry.id, "hours", e.target.value)
                            }
                        />
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-muted-foreground hover:text-red-600"
                        onClick={() => removeEntry(entry.id)}
                        disabled={entries.length === 1}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}

            <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={addEntry}
            >
                <Plus className="h-3.5 w-3.5" />
                Add time slot
            </Button>

            {/* Hidden input that submits the JSON string */}
            <input
                type="hidden"
                name={name}
                value={JSON.stringify(jsonValue)}
            />
        </div>
    )
}
