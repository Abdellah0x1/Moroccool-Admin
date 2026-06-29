import { BookingsTable } from "@/components/BookingsTable"
import { Input } from "@/components/ui/input";
import { getAllBookings } from "@/lib/bookings";
import { Filter, Search } from "lucide-react";
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

        <form method="GET" className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white/60 px-4 py-3 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">Filters</span>
            </div>

            <div className="h-5 w-px bg-gray-200" />

            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                    name="q"
                    placeholder="Search by name, email, phone…"
                    type="text"
                    defaultValue={params.q ?? ""}
                    className="h-9 pl-8 bg-gray-50/80 border-gray-200 focus:bg-white"
                />
            </div>

            <Input
                name="checkIn"
                type="date"
                defaultValue={params.checkIn ?? ""}
                className="h-9 w-[160px] bg-gray-50/80 border-gray-200 focus:bg-white"
            />

            <Select name="status" defaultValue={params.status ?? ""}>
                <SelectTrigger className="h-9 w-[150px] bg-gray-50/80 border-gray-200">
                    <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
            </Select>

            <Button
                type="submit"
                size="sm"
                className="h-9 px-4 text-white shadow-sm transition-all duration-150 hover:opacity-90"
                style={{ background: "var(--primary-container)" }}
            >
                Apply
            </Button>
        </form>
        <BookingsTable bookings={filteredBookings} />
    </div>
}