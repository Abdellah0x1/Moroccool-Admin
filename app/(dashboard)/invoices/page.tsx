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


type params = {
    month?: string,
    type?: string,
    status?: "paid" | "draft"
}


export default async function InvoicePage({ searchParams }: { searchParams: Promise<params> }) {
    const filters = await searchParams;

    const invoices = await getInvoices(filters);
    const businesses = await getBusinesses({ status: 'approved' });
    return <div className="space-y-6">
        <section className="flex items-center justify-between">
            <div>
                <h1 className="font-bold text-3xl">
                    Invoices
                </h1>
                <p className="text-muted-foreground mt-2">
                    Generate invoices for your businesses and manage payments.
                </p>
            </div>
            <div>
                <GenerateInvoiceDialog businesses={businesses} />
            </div>
        </section>
        <section className="p-4 bg-white/80 rounded-lg border border-gray-200 space-y-6">
            <div className="flex items-center gap-2  text-muted-foreground font-bold">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-bold">Filter by</span>
            </div>
            <form className=" grid grid-cols-4 gap-5" method="GET">
                <div className="space-y-4">
                    <Label>Month</Label>
                    <Input name="month" defaultValue={new Date().toISOString().slice(0, 7)} type="month" max={new Date().toISOString().slice(0, 7)} />
                </div>
                <div className="space-y-4">
                    <Label>Type</Label>
                    <Select name="type">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="hotel">Hotel</SelectItem>
                            <SelectItem value="restaurant">Restaurant</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-4">
                    <Label>Status</Label>
                    <Select name="status">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="unpaid">Unpaid</SelectItem>
                        </SelectContent>
                    </Select>

                </div>
                <div className="flex items-center">
                    <Button className="w-full bg-primary-container  ">Filter</Button>
                </div>
            </form>
        </section>
        <section>
            <InvoicesTable data={invoices} />
        </section>
    </div>
} 