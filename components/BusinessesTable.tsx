"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { Building2, MoreHorizontal } from "lucide-react"

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

import { approveBusiness } from "@/app/actions/business-actions";

export type BusinessRow = {
    id: number
    owner_id: string
    name: string
    city: string | null
    address: string | null
    phone: string | null
    email: string | null
    status: "pending_review" | "approved" | "needs_changes" | "rejected" | string | null
    commission_model: string | null
    commission_value: number | null
    created_at: string | null
    updated_at: string | null
    profile: {
        name: string | null
        email: string | null
    } | null
}

function formatStatus(status: BusinessRow["status"]) {
    if (!status) return "Unknown"

    return status
        .split("_")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
}

function getStatusClass(status: BusinessRow["status"]) {
    switch (status) {
        case "approved":
            return "border-green-200 bg-green-50 text-green-700"
        case "needs_changes":
            return "border-amber-200 bg-amber-50 text-amber-700"
        case "rejected":
            return "border-red-200 bg-red-50 text-red-700"
        case "pending_review":
            return "border-blue-200 bg-blue-50 text-blue-700"
        default:
            return "border-border text-on-surface-variant"
    }
}

function formatDate(value: string | null) {
    if (!value) return "-"

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "-"

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date)
}

function formatCommission(row: BusinessRow) {
    if (row.commission_value === null || row.commission_value === undefined) {
        return "-"
    }

    if (row.commission_model === "per_booking") {
        return `${row.commission_value}% per booking`
    }

    return `${row.commission_value} ${row.commission_model || "commission"}`
}

const columns: ColumnDef<BusinessRow>[] = [
    {
        accessorKey: "name",
        header: "Business",
        cell: ({ row }) => {
            const business = row.original
            const initial = business.name?.charAt(0).toUpperCase() || "B"

            return (
                <div className="flex min-w-[240px] items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border bg-surface-container text-sm font-bold text-on-surface-variant">
                        {business.name ? initial : <Building2 className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                        <div className="truncate font-semibold text-on-surface">
                            {business.name || "Untitled business"}
                        </div>
                        <div className="truncate text-xs text-on-surface-variant">
                            {business.address || `ID ${business.id}`}
                        </div>
                    </div>
                </div>
            )
        },
    },
    {
        id: "owner",
        header: "Owner",
        cell: ({ row }) => (
            <div className="min-w-[220px]">
                <div className="truncate font-medium text-on-surface">
                    {row.original.profile?.name || "Unknown owner"}
                </div>
                <div className="truncate text-xs text-on-surface-variant">
                    {row.original.profile?.email || row.original.email || "-"}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "city",
        header: "City",
        cell: ({ row }) => (
            <Badge variant="outline" className="font-medium text-on-surface-variant">
                {row.original.city || "-"}
            </Badge>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant="outline" className={getStatusClass(row.original.status)}>
                {formatStatus(row.original.status)}
            </Badge>
        ),
    },
    {
        id: "commission",
        header: "Commission",
        cell: ({ row }) => (
            <span className="text-sm text-on-surface-variant">
                {formatCommission(row.original)}
            </span>
        ),
    },
    {
        accessorKey: "created_at",
        header: "Submitted",
        cell: ({ row }) => (
            <span className="text-sm text-on-surface-variant">
                {formatDate(row.original.created_at)}
            </span>
        ),
    },
    {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
            const business = row.original

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
                                <Link href={`/businesses/${business.id}`}>Review application</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => approveBusiness(business.id)}>
                                Approve application
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]

export function BusinessesTable({ data }: { data: BusinessRow[] }) {
    return <DataTable columns={columns} data={data} />
}
