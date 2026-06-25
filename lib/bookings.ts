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
    }).filter(b => b.check_out >= new Date().toISOString().split('T')[0]);
}

export async function getBookingById(id: string) {
    const supabase = await createClient()
    const { data: booking, error } = await supabase
        .from('bookings')
        .select(`
            *,
            etablissement ( name ),
            restaurant_booking_details (
                requested_date,
                requested_time,
                guests
            ),
            accommodation_booking_details (
                check_in,
                check_out,
                guests,
                rooms,
                arrival_time,
                quoted_price
            )
        `)
        .eq('id', Number(id))
        .single()

    if (error) {
        console.log('error fetching booking by id', error);
        return null
    }

    const rest = Array.isArray(booking.restaurant_booking_details)
        ? booking.restaurant_booking_details[0]
        : booking.restaurant_booking_details;
    const acc = Array.isArray(booking.accommodation_booking_details)
        ? booking.accommodation_booking_details[0]
        : booking.accommodation_booking_details;
    const listing = Array.isArray(booking.etablissement)
        ? booking.etablissement[0]
        : booking.etablissement;

    return {
        ...booking,
        listing_name: listing?.name ?? null,
        requested_date: rest?.requested_date ?? acc?.check_in ?? null,
        requested_time: rest?.requested_time ?? null,
        guests: rest?.guests ?? acc?.guests ?? null,
        check_in: acc?.check_in ?? null,
        check_out: acc?.check_out ?? null,
        rooms: acc?.rooms ?? null,
        arrival_time: acc?.arrival_time ?? null,
        quoted_price: acc?.quoted_price ?? null,
    };
}


