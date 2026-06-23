"use client"

import { Label } from "./ui/label"
import { Button } from "./ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog"

import { Plus } from "lucide-react"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useActionState } from "react"
import { Badge } from "./ui/badge"

import { generateMonthlyInvoiceAction } from "@/app/actions/invoice-actions";
import { Alert, AlertDescription } from "./ui/alert"



export function GenerateInvoiceDialog({ businesses }: { businesses: Record<string, any> }) {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const defaultMonth = lastMonth.toISOString().slice(0, 7);
    const [businessType, setBusinessType] = useState<"hotel" | "restaurant">("hotel");
    const filteredBusinesses = businesses.filter((b: Record<string, any>) => b.type?.toLowerCase() == businessType);

    const [state, formAction, isPending] = useActionState(generateMonthlyInvoiceAction, { error: undefined, generated: false });


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="h-9 bg-primary-container px-3 cursor-pointer text-center font-bold text-white hover:bg-primary-container/90">
                    <Plus className="size-4" />
                    Generate Invoice
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Generate Monthly Invoice</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" action={formAction}>
                    <div className="space-y-4">
                        <Label htmlFor="business-type">Business Type</Label>
                        <Select onValueChange={(value) => setBusinessType(value as "hotel" | "restaurant")} defaultValue="hotel" name="business-type">
                            <SelectTrigger id="business-type" className="w-full">
                                <SelectValue className="business type (hotel/restaurant)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hotel">Hotel</SelectItem>
                                <SelectItem value="restaurant">Restaurant</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-4">
                        <Label htmlFor="business-select">Select Business</Label>
                        <Select name="business-id">
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Business" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredBusinesses.map((business: Record<string, any>) => <SelectItem key={business.id} value={business.id.toString()} className="w-full flex justify-between items-center">
                                    {business.name}
                                    <Badge className="text-xs rounded-sm" variant="secondary">{businessType}</Badge>
                                </SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-4">
                        <Label>Note</Label>
                        <Input name="note" type="text" placeholder="Any additions to the invoice" />
                    </div>
                    <div className="space-y-4">
                        <Label htmlFor="period-month">Month</Label>
                        <Input type="month" defaultValue={defaultMonth} max={new Date().toISOString().slice(0, 7)} name="period-month" id="period-month" />
                    </div>
                    <div className="space-y-4">
                        <Label>{businessType == 'hotel' ? 'Commission Rate (%)' : 'Fee per confirmed Booking (MAD)'}</Label>
                        <Input type="number" placeholder={businessType == 'hotel' ? 'Commission rate in percent' : 'Fee per confirmed Booking (MAD)'} min={5} max={10} defaultValue={businessType == 'hotel' ? 10 : 50} name="commission-value" />
                    </div>
                    {state.error && <div className="mt-10">

                        <Alert variant="destructive" className="border border-red-600 bg-red-50">

                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    </div>}
                    <Button className="bg-primary-container px-3 w-full">Generate</Button>
                </form>
            </DialogContent>
        </Dialog>)
}