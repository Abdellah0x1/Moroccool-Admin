import { createClient } from "./supabase/server";

export async function getAllBookings() {
    const supabase = await createClient();

    const { data: bookings, error } = await supabase.from('bookings').select("*", {

    }).order('created_at', { ascending: false }).limit(100)

    if (error) {
        console.log('error fetching bookings :', error);
        return []
    }
    return bookings
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
