"use server"

import { GenerateInvoiceDialog } from "@/components/GenerateInvoiceDialog"
import { InvoicesTable } from "@/components/InvoicesTable";
import { getBusinesses } from "@/lib/admin/businesses"
import { getInvoices } from "@/lib/admin/invoices";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";


type params = {
    month?: string,
    type?: string,
    status?: "paid" | "draft"
}


export default async function InvoicePage({ searchParams }: { searchParams: Promise<params> }) {
    const filters = await searchParams;

    const invoices = await getInvoices(filters);
    const businesses = await getBusinesses({ status: 'approved' });

    return (
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <p className="eyebrow">Billing</p>
                    <h1 className="text-3xl font-bold tracking-normal text-on-surface">
                        Invoices
                    </h1>
                    <p className="max-w-2xl text-sm leading-5 text-on-surface-variant">
                        Generate invoices for your businesses and manage payments.
                    </p>
                </div>
                <GenerateInvoiceDialog businesses={businesses} />
            </div>

            {/* Filters */}
            <section className="admin-card admin-card-padded shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex size-7 items-center justify-center rounded-md bg-surface-container-low">
                        <Filter className="size-3.5 text-on-surface-variant" />
                    </div>
                    <span className="eyebrow">Filter invoices</span>
                </div>
                <form
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto_auto]"
                    method="GET"
                    action="/invoices"
                >
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">Month</Label>
                        <Input
                            name="month"
                            defaultValue={filters.month ?? new Date().toISOString().slice(0, 7)}
                            type="month"
                            max={new Date().toISOString().slice(0, 7)}
                            className="h-9"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">Business Type</Label>
                        <Select name="type" defaultValue={filters.type ?? ""}>
                            <SelectTrigger className="w-full h-9">
                                <SelectValue placeholder="All types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hotel">Hotel</SelectItem>
                                <SelectItem value="restaurant">Restaurant</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">Status</Label>
                        <Select name="status" defaultValue={filters.status ?? ""}>
                            <SelectTrigger className="w-full h-9">
                                <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="sent">Sent</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-end">
                        <Button type="submit" className="h-9 bg-primary-container font-bold text-white hover:bg-primary-container/90">
                            Filter
                        </Button>
                    </div>
                    <div className="flex items-end">
                        <Button asChild variant="outline" className="h-9">
                            <Link href="/invoices">Clear</Link>
                        </Button>
                    </div>
                </form>
            </section>

            {/* Table */}
            <section>
                <InvoicesTable data={invoices} />
            </section>
        </div>
    );
}