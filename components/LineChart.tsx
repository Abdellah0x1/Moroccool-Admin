"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import type {
    ActivityFilter,
    RestaurantAccommodationActivity,
} from "@/lib/admin/overview"

const chartConfig = {
    restaurants: {
        label: "Restaurants",
        color: "var(--primary-container)",
    },
    accommodations: {
        label: "Accommodations",
        color: "var(--success-text)",
    },
} satisfies ChartConfig

const filters: { value: ActivityFilter; label: string; description: string }[] = [
    { value: "day", label: "Day", description: "Last 30 days" },
    { value: "month", label: "Month", description: "Last 12 months" },
    { value: "year", label: "Year", description: "Last 5 years" },
]

export function ChartLine({ data }: { data: RestaurantAccommodationActivity }) {
    const [filter, setFilter] = React.useState<ActivityFilter>("month")
    const activeFilter = filters.find((item) => item.value === filter) ?? filters[1]

    return (
        <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <CardTitle>Restaurants and accommodations</CardTitle>
                    <CardDescription>{activeFilter.description}</CardDescription>
                </div>
                <div className="flex rounded-lg border border-outline-variant bg-surface-container-low p-1">
                    {filters.map((item) => (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => setFilter(item.value)}
                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${filter === item.value
                                ? "bg-surface text-on-surface shadow-sm"
                                : "text-on-surface-variant hover:text-on-surface"
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
                    <LineChart
                        accessibilityLayer
                        data={data[filter]}
                        margin={{
                            left: 12,
                            right: 12,
                            top: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="period"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis
                            allowDecimals={false}
                            axisLine={false}
                            tickLine={false}
                            tickMargin={8}
                            width={32}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Line
                            dataKey="restaurants"
                            type="monotone"
                            stroke="var(--color-restaurants)"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                        <Line
                            dataKey="accommodations"
                            type="monotone"
                            stroke="var(--color-accommodations)"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
