"use client"

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./Table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail, Phone, CalendarDays, Clock, Users, Eye, CheckCircle, XCircle } from "lucide-react";

export type BookingRow = {
    id: string,
    customer_name: string,
    customer_email: string,
    customer_phone: string,
    requested_date: string,
    requested_time: string,
    guests: number,
    status: string,
    customer_note: string,
    owner_note: string,
    created_at: string,
    updated_at: string,
};

const columns: ColumnDef<BookingRow>[] = [
    {
        accessorKey: "customer",
        header: "Customer",
        cell: ({ row }) => {
            const name = row.original.customer_name;
            const email = row.original.customer_email;
            const phone = row.original.customer_phone;

            return (
                <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm">{name}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{email}</span>
                    </div>
                    {phone && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{phone}</span>
                        </div>
                    )}
                </div>
            )
        }
    },
    {
        accessorKey: "datetime",
        header: "Date & Time",
        cell: ({ row }) => {
            const dateStr = row.original.requested_date;
            const timeStr = row.original.requested_time;
            
            // Format date nicely if possible
            let formattedDate = dateStr;
            try {
                if (dateStr) {
                    formattedDate = new Intl.DateTimeFormat("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                    }).format(new Date(dateStr));
                }
            } catch (e) {
                // Ignore parsing errors
            }

            return (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                        <CalendarDays className="h-4 w-4 text-blue-500" />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{timeStr}</span>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "guests",
        header: "Guests",
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{row.original.guests}</span>
            </div>
        )
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status?.toLowerCase() || "unknown";
            
            let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
            let customClass = "";

            if (status === "confirmed" || status === "approved") {
                customClass = "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
            } else if (status === "pending") {
                customClass = "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200";
            } else if (status === "rejected" || status === "cancelled") {
                variant = "destructive";
            }

            return (
                <Badge variant={variant} className={`capitalize ${customClass}`}>
                    {status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "notes",
        header: "Notes",
        cell: ({ row }) => {
            const cNote = row.original.customer_note;
            const oNote = row.original.owner_note;

            if (!cNote && !oNote) return <span className="text-muted-foreground text-xs italic">No notes</span>;

            return (
                <div className="flex flex-col gap-2 max-w-[250px]">
                    {cNote && (
                        <div className="text-xs">
                            <span className="font-semibold text-gray-700">Customer: </span>
                            <span className="text-gray-600 line-clamp-2" title={cNote}>{cNote}</span>
                        </div>
                    )}
                    {oNote && (
                        <div className="text-xs">
                            <span className="font-semibold text-blue-700">Owner: </span>
                            <span className="text-blue-600 line-clamp-2" title={oNote}>{oNote}</span>
                        </div>
                    )}
                </div>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const booking = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(booking.id)}>
                            Copy booking ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> View details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-green-600">
                            <CheckCircle className="mr-2 h-4 w-4" /> Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                            <XCircle className="mr-2 h-4 w-4" /> Reject
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export function BookingsTable({ bookings }: { bookings: BookingRow[] }) {
    return (
        <DataTable columns={columns} data={bookings} />
    )
}