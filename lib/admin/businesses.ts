import { createClient } from "../supabase/server"

export type BusinessStatus =
    | "pending_review"
    | "approved"
    | "needs_changes"
    | "rejected"
    | string
    | null

export type BusinessOwnerProfile = {
    name: string | null
    email: string | null
    created_at?: string | null
} | null

export type BusinessDetail = {
    id: number
    owner_id: string
    name: string
    city: string | null
    address: string | null
    phone: string | null
    email: string | null
    type: string | null
    status: BusinessStatus
    commission_model: string | null
    commission_value: number | null
    created_at: string | null
    updated_at: string | null
    profile: BusinessOwnerProfile
}

export type BusinessListingSummary = {
    id: number
    name: string | null
    type: string | null
    city: string | null
    address: string | null
    phone: string | null
    website: string | null
    rating: number | null
    created_at: string | null
    updated_at: string | null
} | null

export type BusinessBookingSummary = {
    id: number
    type: string
    status: string
    customer_name: string
    customer_email: string
    created_at: string
}

export type BusinessInvoiceSummary = {
    id: number
    invoice_number: string | null
    period_month: string | null
    total_amount: number
    status: string
    created_at: string
}

export type BusinessReviewDetails = {
    business: BusinessDetail
    listing: BusinessListingSummary
    bookings: BusinessBookingSummary[]
    invoices: BusinessInvoiceSummary[]
    stats: {
        bookings: number
        confirmedBookings: number
        pendingBookings: number
        invoices: number
    }
}


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

export async function getBusinessReviewDetails(id: number): Promise<BusinessReviewDetails | null> {
    if (!Number.isSafeInteger(id) || id <= 0) return null

    const supabase = await createClient();

    const { data: business, error: businessError } = await supabase
        .from('businesses')
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
            profile:owner_id(name,email,created_at)
        `)
        .eq('id', id)
        .maybeSingle()

    if (businessError || !business) {
        console.log('business detail lookup error', businessError)
        return null
    }

    const [
        listingResult,
        bookingsResult,
        confirmedBookingsResult,
        pendingBookingsResult,
        invoicesResult,
    ] = await Promise.all([
        supabase
            .from('etablissement')
            .select('id, name, type, city, address, phone, website, rating, created_at, updated_at')
            .eq('business_id', id)
            .maybeSingle(),
        supabase
            .from('bookings')
            .select('id, type, status, customer_name, customer_email, created_at', { count: 'exact' })
            .eq('business_id', id)
            .order('created_at', { ascending: false })
            .limit(5),
        supabase
            .from('bookings')
            .select('id', { count: 'exact', head: true })
            .eq('business_id', id)
            .eq('status', 'confirmed'),
        supabase
            .from('bookings')
            .select('id', { count: 'exact', head: true })
            .eq('business_id', id)
            .eq('status', 'pending'),
        supabase
            .from('monthly_invoice')
            .select('id, invoice_number, period_month, total_amount, status, created_at', { count: 'exact' })
            .eq('bussiness_id', id)
            .order('period_month', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(5),
    ])

    if (listingResult.error) {
        console.log('business listing lookup error', listingResult.error)
    }

    if (bookingsResult.error) {
        console.log('business bookings lookup error', bookingsResult.error)
    }

    if (confirmedBookingsResult.error) {
        console.log('business confirmed bookings lookup error', confirmedBookingsResult.error)
    }

    if (pendingBookingsResult.error) {
        console.log('business pending bookings lookup error', pendingBookingsResult.error)
    }

    if (invoicesResult.error) {
        console.log('business invoices lookup error', invoicesResult.error)
    }

    return {
        business: business as BusinessDetail,
        listing: (listingResult.data ?? null) as BusinessListingSummary,
        bookings: (bookingsResult.data ?? []) as BusinessBookingSummary[],
        invoices: (invoicesResult.data ?? []) as BusinessInvoiceSummary[],
        stats: {
            bookings: bookingsResult.count ?? 0,
            confirmedBookings: confirmedBookingsResult.count ?? 0,
            pendingBookings: pendingBookingsResult.count ?? 0,
            invoices: invoicesResult.count ?? 0,
        },
    }
}


