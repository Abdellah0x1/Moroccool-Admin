import { createClient } from "./supabase/server";

export async function getAllBookings() {
    const supabase = await createClient();

    const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
            *,
            restaurant_booking_details (
                requested_date,
                requested_time,
                guests
            ),
            accommodation_booking_details (
                check_in,
                check_out,
                guests
            )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

    if (error) {
        console.log('error fetching bookings :', error);
        return [];
    }

    // Flatten the joined detail data so the table columns can access
    // requested_date, requested_time, and guests directly.
    return (bookings ?? []).map((b: any) => {
        const rest = Array.isArray(b.restaurant_booking_details)
            ? b.restaurant_booking_details[0]
            : b.restaurant_booking_details;
        const acc = Array.isArray(b.accommodation_booking_details)
            ? b.accommodation_booking_details[0]
            : b.accommodation_booking_details;

        return {
            ...b,
            requested_date: rest?.requested_date ?? acc?.check_in ?? null,
            requested_time: rest?.requested_time ?? null,
            guests: rest?.guests ?? acc?.guests ?? null,
            check_in: acc?.check_in ?? null,
            check_out: acc?.check_out ?? null,
        };
    });
}



export async function getBookingById(id: string) {
    const supabase = await createClient()
    const { data: booking, error } = await supabase.from('bookings').select('*').eq('id', Number(id)).single()

    if (error) {
        console.log('error fetching booking by id', error);
        return null
    }
    return booking
}
