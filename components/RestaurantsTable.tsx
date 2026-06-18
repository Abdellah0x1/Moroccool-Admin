"use client"


import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { DataTable } from "@/components/Table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"



export type RestaurantRow = {
    id: number,
    name: string,
    city: string,
    city_id?: number | null,
    description: string | null,
    address: string,
    rating: number,
    website: string | null,
    phone: string | null,
    openingHours: Record<string, string> | null,
    images: string[] | null
}
import { deleteRestaurant } from "@/app/actions/restaurants"


const columns: ColumnDef<RestaurantRow>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const restaurant = row.original
            const initial = restaurant.name.charAt(0).toUpperCase()
            const thumb = restaurant.images?.[0]

            return (
                <div className="flex min-w-[240px] items-center gap-3">
                    <div
                        className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md border border-border bg-surface-container bg-cover bg-center text-sm font-bold text-on-surface-variant"
                        style={thumb ? { backgroundImage: `url(${thumb})` } : undefined}
                    >
                        {!thumb ? initial : null}
                    </div>
                    <div className="min-w-0">
                        <div className="truncate font-semibold text-on-surface">{restaurant.name}</div>
                        <div className="truncate text-xs text-on-surface-variant">{restaurant.address || `ID ${restaurant.id}`}</div>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "city",
        header: "City",
        cell: ({ row }) => (
            <Badge variant="outline" className="font-medium text-on-surface-variant">
                {row.original.city}
            </Badge>
        ),
    },
    {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => {
            const rating = row.original.rating
            return (
                <div className="flex items-center gap-1.5">
                    <span className="text-amber-500">★</span>
                    <span className="font-medium text-on-surface">{rating ?? "–"}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <span className="line-clamp-2 max-w-[360px] whitespace-normal leading-5 text-on-surface-variant">
                {row.original.description || "No description"}
            </span>
        ),
    },
    {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
            const restaurant = row.original

            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm" className="rounded-md">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href={`/restaurants/${restaurant.id}`}>View restaurant</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/restaurants/${restaurant.id}/edit`}>Edit restaurant</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => deleteRestaurant(restaurant.id)}
                            >
                                Delete restaurant
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]

export function RestaurantsTable({ data }: { data: RestaurantRow[] }) {
    return <DataTable columns={columns} data={data} />

}
