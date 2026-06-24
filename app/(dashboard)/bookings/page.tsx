import { BookingsTable } from "@/components/BookingsTable"
import { Input } from "@/components/ui/input";
import { getAllBookings } from "@/lib/bookings";
import { Filter } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";


export default async function Bookings({ searchParams }: { searchParams: { status: string, q: string, checkIn: string } }) {
    const params = await searchParams;
    const bookings = await getAllBookings();
    const filteredBookings = bookings.filter((b) => {
        const searchString = `${b.customer_name} ${b.customer_email} ${b.customer_phone}`;
        if (params.status && b.status?.toLowerCase() !== params.status.toLowerCase()) return false;
        if (params.q && !searchString.toLowerCase().includes(params.q.toLowerCase())) return false;
        if (params.checkIn && b.requested_date !== params.checkIn) return false;
        return true;
    });
    return <div className="space-y-6" >
        <div className="flex justify-between items-center">
            <div className="space-y-1">
                <h1 className="font-bold text-3xl">Bookings</h1>
                <p className="text-gray-800">Manage all the bookings here.</p>
            </div>
        </div>

        <div className="shadow-sm p-4 bg-white/50 border border-gray-200 rounded-xl space-y-4">
            <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <p className="text-sm font-semibold"> Filter</p>
            </div>
            <p className="text-sm text-muted-foreground "> Filter the bookings based on the status.</p>
            <form method="GET" className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-end">
                <div className="space-y-2">
                    <Label>Search (Name, Email, phone)</Label>
                    <Input name="q" placeholder="Search Name Email, phone.." type="text" />
                </div>

                <div className="space-y-2">
                    <Label>Check in date</Label>
                    <Input name="checkIn" type="date" />
                </div>
                <div className="space-y-2">
                    <Label>Status</Label>
                    <Select name="status" >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label />
                    <Button type="submit" className="text-white transition-all duration-150" style={{ background: "var(--primary-container)" }} size="sm">Apply Filters</Button>
                </div>
            </form>
        </div>

        <BookingsTable bookings={filteredBookings} />

    </div>
}