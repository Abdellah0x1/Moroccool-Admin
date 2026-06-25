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
import { DeleteDestination } from "@/app/actions/destination-actions"

export type DestinationRow = {
    id: number;
    name: string;
    slug?: string | null;
    description: string | null;
    image: string | null;
}
import Link from "next/link"

const columns: ColumnDef<DestinationRow>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const destination = row.original
            const initial = destination.name.charAt(0).toUpperCase()

            return (
                <div className="flex min-w-[240px] items-center gap-3">
                    <div
                        className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md border border-border bg-surface-container bg-cover bg-center text-sm font-bold text-on-surface-variant"
                        style={destination.image ? { backgroundImage: `url(${destination.image})` } : undefined}
                    >
                        {!destination.image ? initial : null}
                    </div>
                    <div className="min-w-0">
                        <div className="truncate font-semibold text-on-surface">{destination.name}</div>
                        <div className="text-xs text-on-surface-variant">ID {destination.id}</div>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => row.original.slug ? (
            <Badge variant="outline" className="font-mono text-[0.72rem] text-on-surface-variant">
                {row.original.slug}
            </Badge>
        ) : (
            <span className="text-on-surface-variant">-</span>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <span className="line-clamp-2 max-w-[460px] whitespace-normal leading-5 text-on-surface-variant">
                {row.original.description || "No description"}
            </span>
        ),
    },
    {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
            const destination = row.original

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
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(destination.slug || destination.name)}
                            >
                                Copy slug
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {/* <DropdownMenuItem asChild>
                                <Link href={`/destinations/${destination.id}`}>View destination</Link>
                            </DropdownMenuItem> */}
                            <DropdownMenuItem asChild>
                                <Link href={`/destinations/${destination.id}/edit`}>Edit destination</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => DeleteDestination(destination.id)}>
                                Remvove destination
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]

export function DestinationsTable({ data }: { data: DestinationRow[] }) {
    return <DataTable columns={columns} data={data} />
}
