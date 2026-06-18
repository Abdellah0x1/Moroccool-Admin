import { BookingsTable } from "@/components/BookingsTable"
import { getAllBookings } from "@/lib/bookings";


export default async function Bookings() {
    const bookings = await getAllBookings();
    return <div className="space-y-6" >
        <div className="flex justify-between items-center">
            <div className="space-y-1">
                <h1 className="font-bold text-3xl">Bookings</h1>
                <p className="text-gray-800">Manage all the bookings here.</p>
            </div>
        </div>
        <BookingsTable bookings={bookings} />

    </div>
}