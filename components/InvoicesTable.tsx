"use client"

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./Table";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { markAsPaid } from "@/app/actions/invoice-actions";

export type InvoiceRow = {
    id: number;
    invoice_number: string | null;
    bussiness_id: number;
    period_month: string | null;
    booking_count: number;
    commission_value: number;
    total_amount: number;
    status: string;
    sent_at: string | null;
    paid_at: string | null;
    created_at: string;
    updated_at: string;
    business: {
        name: string | null;
        city: string | null;
        type: string | null;
    } | null;
};

const columns: ColumnDef<InvoiceRow>[] = [
    {
        accessorKey: "name",
        header: "Business Name",
        cell: ({ row }) => <span className="font-bold">{row.original.business?.name ?? "-"}</span>,
    },
    {
        accessorKey: "business_type",
        header: "Business Type",
        cell: ({ row }) => <Badge variant="outline">{row.original.business?.type ?? "-"}</Badge>,
    },
    {
        accessorKey: "period_month",
        header: "Period Month",
        cell: ({ row }) => row.original.period_month ?? "-",
    },
    {
        accessorKey: "total_amount",
        header: "Total Amount",
        cell: ({ row }) => row.original.total_amount + " MAD",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <Badge variant={row.original.status === "paid" ? "secondary" : row.original.status === "overdue" ? "destructive" : row.original.status === "disputed" ? "destructive" : "default"}>{row.original.status}</Badge>
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString("en-GB"),
    },

    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            return <div className="flex justify-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <a href={`/api/invoices/${row.original.id}/pdf`} download>
                                Download as pdf
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => markAsPaid(Number(row.original.id))}>
                            Mark as paid
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        }
    }
]

export function InvoicesTable({ data }: { data: InvoiceRow[] }) {
    return <div>
        <DataTable data={data} columns={columns} />
    </div>
}
