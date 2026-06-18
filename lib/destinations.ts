import { createClient } from "@/lib/supabase/server"


export async function getDestinations() {
    const supabase = await createClient();

    const { data: destinations, error } = await supabase
        .from('city')
        .select("*")
        .order("name")


    if (error) {
        console.log('error fetching destinations ', error)
        return []
    }

    return destinations ?? [];
}


export async function getDestinationById(id: number) {
    const supabase = await createClient();

    const { data: destination, error } = await supabase.from('city').select("*").eq("id", id)

    if (error) {
        return null
    }
    return destination?.[0] ?? null

}