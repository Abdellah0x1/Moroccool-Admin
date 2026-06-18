import { createClient } from "./supabase/server";

export async function getHotels() {
    const supabase = await createClient();
    const { data: hotels, error } = await supabase
        .from('etablissement')
        .select('*')
        .eq('type', 'hotel')

    if (error) {
        console.log('hotels fetch error', error)
        return []
    }

    return hotels ?? []
}


export async function getHotelById(id: number) {
    const supabase = await createClient();
    const { data: hotel, error } = await supabase
        .from('etablissement')
        .select("*")
        .eq('id', id)
        .single()

    if (error) {
        console.log('hotel fetch error', error)
        return null
    }

    return hotel
}