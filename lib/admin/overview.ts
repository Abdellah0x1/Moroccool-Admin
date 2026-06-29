import requireAdmin from "../auth/require-admin";
import { createClient } from "../supabase/server";

type AdminSupabaseClient = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

export type WeeklyReviewActivityPoint = {
    period: string;
    reviews: number;
}

export type AdminOverviewStats = {
    destinations: number;
    restaurants: number;
    hotels: number;
    reviews: number;
}

async function getAdminOverViewStatsFromClient(supabase: AdminSupabaseClient): Promise<AdminOverviewStats> {
    const [destinations, restaurants, hotels, reviews] = await Promise.all([
        supabase.from('city').select("*", { count: "exact", head: true }),
        supabase.from('etablissement').select("*", { count: "exact", head: true }).eq('type', 'restaurant'),
        supabase.from('etablissement').select("*", { count: "exact", head: true }).eq('type', 'hotel'),
        supabase.from('review').select("*", { count: "exact", head: true })
    ])

    return {
        destinations: destinations.count ?? 0,
        restaurants: restaurants.count ?? 0,
        hotels: hotels.count ?? 0,
        reviews: reviews.count ?? 0
    }
}

export async function getAdminOverViewStats() {
    const { supabase } = await requireAdmin();
    return getAdminOverViewStatsFromClient(supabase);
}


const DEFAULT_WEEK_COUNT = 8;


function startOfUtcWeek(date: Date) {
    const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
    const daysSinceMonday = (start.getUTCDay() + 6) % 7;
    start.setUTCDate(start.getUTCDate() - daysSinceMonday);
    return start;
}


function formatWeekLabel(date: Date) {
    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        timeZone: "UTC"
    }).format(date)
}

function getWeekKey(date: Date) {
    return startOfUtcWeek(date).toISOString().slice(0, 10)
}





async function getWeeklyReviewActivityFromClient(
    supabase: AdminSupabaseClient,
    weekCount = DEFAULT_WEEK_COUNT
): Promise<WeeklyReviewActivityPoint[]> {
    const currentWeekStart = startOfUtcWeek(new Date());
    const weeks = Array.from({ length: weekCount }, (_, index) => {
        const start = new Date(currentWeekStart);
        start.setUTCDate(start.getUTCDate() - (weekCount - 1 - index) * 7);

        return {
            key: getWeekKey(start),
            period: formatWeekLabel(start),
            reviews: 0
        }
    })

    const firstWeek = weeks[0];

    if (!firstWeek) return [];

    const { data, error } = await supabase
        .from('review')
        .select('created_at')
        .gte('created_at', `${firstWeek.key}T00:00:00.000Z`)
        .lte("created_at", new Date().toISOString())
        .order("created_at", { ascending: false })

    if (error) {
        console.log("Error fetching weekly review activity", error);
        return weeks.map(({ period, reviews }) => ({ period, reviews }))
    }

    const weekByKey = new Map(weeks.map(week => [week.key, week]));

    for (const review of data ?? []) {
        if (!review.created_at) continue;

        const week = weekByKey.get(getWeekKey(new Date(review.created_at)));
        if (week) {
            week.reviews += 1;
        }
    }
    return weeks.map(({ period, reviews }) => ({ period, reviews }));
}

export async function getWeeklyReviewActivity(weekCount = DEFAULT_WEEK_COUNT): Promise<WeeklyReviewActivityPoint[]> {
    const { supabase } = await requireAdmin();
    return getWeeklyReviewActivityFromClient(supabase, weekCount);
}

export async function getAdminDashboardOverview() {
    const supabase = await createClient();
    const [stats, recentReviews, topDestinations, restaurantAccommodationStats] = await Promise.all([
        getAdminOverViewStatsFromClient(supabase),
        getRecentReviews(supabase),
        getTopDestinations(supabase),
        getRestaurantAccommodationStatsBy(supabase)
    ]);

    return {
        stats,
        recentReviews,
        topDestinations,
        restaurantAccommodationStats
    };
}


export async function getRecentReviews(supabase: AdminSupabaseClient) {

    const { data: reviews, error: ReviewsError } = await supabase.from('review').select('*').limit(4).order('created_at', { ascending: false })

    if (!reviews || ReviewsError) {
        console.log('recent reviews fetching error ', ReviewsError)
        return []
    }
    console.log('reviews ', reviews)

    return reviews;
}


export async function getRecentBookings(supabase: AdminSupabaseClient) {
    const { data: bookings, error: BookingsError } = await supabase.from('bookings').select("*", { count: "exact" }).limit(4).order('created_at', { ascending: false })


    if (!bookings || BookingsError) {
        console.log('recent bookings fetching error ', BookingsError)
        return []
    }
    console.log('bookings ', bookings)

    return bookings;
}


export async function getTopDestinations(supabase: AdminSupabaseClient) {
    const { data, error } = await supabase.from('bookings').select("etablissement(city)")
        .ilike("status", "confirmed");

    if (!data || error) {
        console.log('weekly booking activity fetching error ', error)
        return []
    }
    const cityCount = new Map<string, number>();
    for (const booking of data) {
        let city = null;
        if (Array.isArray(booking?.etablissement)) {
            city = booking.etablissement[0]?.city;
        } else {
            city = booking?.etablissement?.city;
        }

        if (!city) continue;
        const currentCount = cityCount.get(city) ?? 0;
        cityCount.set(city, currentCount + 1);
    }


    return Array.from(cityCount.entries()).map(([city, booking]) => ({ city, booking })).sort((a, b) => b.booking - a.booking).slice(0, 6);
}



function startOfUtcDay(date: Date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}


function getActivityKey(date: Date, filter: "day" | "month" | "year") {
    if (filter == "year") return String(date.getUTCFullYear())

    if (filter == "month") return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`

    return date.toISOString().slice(0, 10);
}

const ACTIVITY_BUCKETS = {
    day: 30,
    month: 12,
    year: 5
} satisfies Record<"day" | "month" | "year", number>

type ListingActivityRow = {
    type: string | null;
    created_at: string | null;
};

function formatActivityLabel(date: Date, filter: "day" | "month" | "year") {
    if (filter == 'year') {
        return String(date.getUTCFullYear())
    }

    if (filter == "month") {
        return new Intl.DateTimeFormat("en", {
            month: 'short',
            day: 'numeric',
            timeZone: "UTC"
        }).format(date)
    }

    return new Intl.DateTimeFormat("en", {
        timeZone: "UTC",
        day: "numeric",
        month: "short"
    }).format(date)
}

function buildActivityBuckets(filter: "year" | "day" | "month") {
    const count = ACTIVITY_BUCKETS[filter];
    const now = new Date();

    return Array.from({ length: count }, (_, index) => {
        const date = startOfUtcDay(now);

        if (filter === "year") {
            date.setUTCFullYear(date.getUTCFullYear() - (count - 1 - index));
            date.setUTCMonth(0, 1);
        }

        if (filter === "month") {
            date.setUTCMonth(date.getUTCMonth() - (count - 1 - index), 1);
        }

        if (filter === "day") {
            date.setUTCDate(date.getUTCDate() - (count - 1 - index));
        }

        return {
            period: formatActivityLabel(date, filter),
            restaurants: 0,
            accommodations: 0,
        };
    });
}


function getActivityStartDate(filter: "year" | "day" | "month") {
    const count = ACTIVITY_BUCKETS[filter];
    const date = startOfUtcDay(new Date());

    if (filter == 'year') {
        date.setUTCFullYear(date.getUTCFullYear() - (count - 1))
    }

    if (filter == 'month') {
        date.setUTCMonth(date.getUTCMonth() - (count - 1), 1)
    }

    if (filter == 'day') {
        date.setUTCDate(date.getUTCDate() - (count - 1));
    }
    return date;
}

export type ActivityFilter = "day" | "month" | "year";

export type RestaurantAccommodationActivityPoint = {
    period: string;
    restaurants: number;
    accommodations: number;
}

export type RestaurantAccommodationActivity = Record<ActivityFilter, RestaurantAccommodationActivityPoint[]>;

function fillActivityRows(rows: RestaurantAccommodationActivityPoint[], listings: ListingActivityRow[], filter: ActivityFilter) {
    const bucketByKey = new Map<string, RestaurantAccommodationActivityPoint>();

    rows.forEach((row, index) => {
        const date = getActivityStartDate(filter);

        if (filter == "year") {
            date.setUTCFullYear(date.getUTCFullYear() + index);
        }
        if (filter == "month") {
            date.setUTCMonth(date.getUTCMonth() + index)
        }

        if (filter == "day") {
            date.setUTCDate(date.getUTCDate() + index)
        }

        bucketByKey.set(getActivityKey(date, filter), row);
    });


    listings.forEach((listing) => {
        if (!listing.created_at) return;

        const row = bucketByKey.get(getActivityKey(new Date(listing.created_at), filter));
        if (!row) return;

        if (listing.type === "restaurant") {
            row.restaurants += 1;
        }

        if (listing.type === "hotel") {
            row.accommodations += 1;
        }
    });

    return rows;
}

export async function getRestaurantAccommodationStatsBy(
    supabase: AdminSupabaseClient
): Promise<RestaurantAccommodationActivity> {
    const startDate = getActivityStartDate("year");

    const { data, error } = await supabase
        .from("etablissement")
        .select("type, created_at")
        .in("type", ["restaurant", "hotel"])
        .gte("created_at", startDate.toISOString())
        .lte("created_at", new Date().toISOString())
        .order("created_at", { ascending: true });

    const listings = (data ?? []) as ListingActivityRow[];

    if (error) {
        console.log("Error fetching restaurant/accommodation activity", error);
    }

    return {
        day: fillActivityRows(buildActivityBuckets("day"), listings, "day"),
        month: fillActivityRows(buildActivityBuckets("month"), listings, "month"),
        year: fillActivityRows(buildActivityBuckets("year"), listings, "year"),
    };
}




