import { getBookingById } from "@/lib/bookings";

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {

    const bookingId = (await params).id;

    const booking = await getBookingById(bookingId);

    if (!booking) {
        return 404;
    }
    return (
        <div>
            <h1>{booking.customer_name}</h1>
            <p>{booking.customer_email}</p>
            <p>{booking.customer_phone}</p>
            <p>{booking.requested_date}</p>
            <p>{booking.requested_time}</p>
            <p>{booking.guests}</p>
            <p>{booking.status}</p>
            <p>{booking.customer_note}</p>
            <p>{booking.owner_note}</p>
            <p>{booking.created_at}</p>
            <p>{booking.updated_at}</p>
        </div>
    );
}