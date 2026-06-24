"use client"

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./Table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { MoreHorizontal, Download, CheckCircle2, FileText, Building2, Send } from "lucide-react";
import { markAsPaid, sendInvoiceByMail } from "@/app/actions/invoice-actions";
import { useRouter } from "next/router";

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

function getStatusStyle(status: string) {
    switch (status) {
        case "paid":
            return "border-green-200 bg-green-50 text-green-700";
        case "sent":
            return "border-blue-200 bg-blue-50 text-blue-700";
        case "overdue":
            return "border-red-200 bg-red-50 text-red-700";
        case "disputed":
            return "border-amber-200 bg-amber-50 text-amber-700";
        case "draft":
        default:
            return "border-border text-on-surface-variant";
    }
}

function formatStatus(status: string) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDate(value: string | null) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en", {
        style: "currency",
        currency: "MAD",
        maximumFractionDigits: 0,
    }).format(amount);
}


const columns: ColumnDef<InvoiceRow>[] = [
    {
        accessorKey: "name",
        header: "Business",
        cell: ({ row }) => {
            const business = row.original.business;
            const initial = business?.name?.charAt(0).toUpperCase() || "B";

            return (
                <div className="flex min-w-[200px] items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface-container text-sm font-bold text-on-surface-variant">
                        {business?.name ? initial : <Building2 className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                        <div className="truncate font-semibold text-on-surface">
                            {business?.name ?? "Unknown business"}
                        </div>
                        <div className="truncate text-xs text-on-surface-variant">
                            {business?.city ?? "-"}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "business_type",
        header: "Type",
        cell: ({ row }) => (
            <Badge variant="outline" className="font-medium text-on-surface-variant">
                {row.original.business?.type ?? "-"}
            </Badge>
        ),
    },
    {
        accessorKey: "invoice_number",
        header: "Invoice",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <FileText className="size-3.5 text-on-surface-variant" />
                <span className="font-mono text-xs text-on-surface-variant">
                    {row.original.invoice_number ?? `#${row.original.id}`}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "period_month",
        header: "Period",
        cell: ({ row }) => {
            const month = row.original.period_month;
            if (!month) return <span className="text-sm text-on-surface-variant">-</span>;
            const [year, m] = month.split("-");
            const date = new Date(Number(year), Number(m) - 1);
            return (
                <span className="text-sm text-on-surface-variant">
                    {date.toLocaleDateString("en", { month: "short", year: "numeric" })}
                </span>
            );
        },
    },
    {
        accessorKey: "total_amount",
        header: "Amount",
        cell: ({ row }) => (
            <span className="font-semibold text-on-surface">
                {formatCurrency(row.original.total_amount)}
            </span>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant="outline" className={getStatusStyle(row.original.status)}>
                {formatStatus(row.original.status)}
            </Badge>
        ),
    },
    {
        accessorKey: "created_at",
        header: "Created",
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
            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm" className="rounded-md">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <a href={`/api/invoices/${row.original.id}/pdf`} download>
                                    <Download className="size-4" />
                                    Download PDF
                                </a>
                            </DropdownMenuItem>
                            {row.original.status !== "paid" && (
                                <DropdownMenuItem onClick={() => markAsPaid(Number(row.original.id))}>
                                    <CheckCircle2 className="size-4" />
                                    Mark as paid
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={async () => {
                                const result = await sendInvoiceByMail(row.original.id);

                                if (result.error) {
                                    window.alert(result.error);
                                    return;
                                }

                                window.alert(result.success);

                            }}>
                                <Send className="h-4 w-4" />
                                Send By Mail
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        }
    }
];

export function InvoicesTable({ data }: { data: InvoiceRow[] }) {
    return <DataTable data={data} columns={columns} />;
}
