"use client"

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
import type { WeeklyReviewActivityPoint } from "@/lib/admin/overview"


export const description = "A line chart"


const chartConfig = {
    reviews: {
        label: "Reviews",
        color: "var(--primary-container)",
    },
} satisfies ChartConfig





export function ChartLine({ data }: { data: WeeklyReviewActivityPoint[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Reviews by week</CardTitle>
                <CardDescription>Last 8 weeks</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
                    <LineChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: 12,
                            right: 12,
                            top: 12
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="period"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}

                        />
                        <YAxis allowDecimals={false} axisLine={false} tickLine={false} tickMargin={8} width={32} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Line
                            dataKey="reviews"
                            type="monotone"
                            stroke="var(--color-reviews)"
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
