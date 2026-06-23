import { createClient } from "../supabase/server"


type filters = {
    q?: string,
    status?: string,
    city?: string
}

export async function getBusinesses(filters: filters = {}) {
    const supabase = await createClient();

    let query = supabase.from('businesses')
        .select(`
            id,
            owner_id,
            name,
            city,
            address,
            phone,
            email,
            status,
            commission_model,
            commission_value,
            created_at,
            updated_at,
            type,
            profile:owner_id(name,email)
            `).order("created_at", { ascending: false })

    if (filters.city) {
        query = query.eq('city', filters.city)
    }

    if (filters.status) {
        query = query.eq('status', filters.status)
    }

    if (filters.q) {
        query = query.or(`name.ilike.%${filters.q}%,email.ilike.%${filters.q}%,city.ilike.%${filters.q}%`)
    }

    const { data, error } = await query;

    if (error) {
        console.log('businesses admin lookup error', error)
        return []
    }


    return data ?? []
}


