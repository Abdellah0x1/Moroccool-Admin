import Link from "next/link"

import { BusinessesTable, type BusinessRow } from "@/components/BusinessesTable"
import { Button } from "@/components/ui/button"
import { getBusinesses } from "@/lib/admin/businesses"

type SearchParams = {
    q?: string
    status?: string
    city?: string
}

export default async function BusinessPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams
    const businesses = await getBusinesses(params) as unknown as BusinessRow[]

    return (
        <main className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold">Business Applications</h1>
                    <p className="text-on-surface-variant">
                        Review partner applications before they go live.
                    </p>
                </div>
            </div>

            <form
                className="admin-card grid gap-3 p-4 md:grid-cols-[1fr_180px_180px_auto_auto]"
                method="GET"
                action="/businesses"
            >
                <input
                    name="q"
                    defaultValue={params.q ?? ""}
                    placeholder="Search business, email, or city"
                    className="text-input h-9"
                />
                <select
                    name="status"
                    defaultValue={params.status ?? ""}
                    className="text-input h-9"
                >
                    <option value="">All statuses</option>
                    <option value="pending_review">Pending review</option>
                    <option value="approved">Approved</option>
                    <option value="needs_changes">Needs changes</option>
                    <option value="rejected">Rejected</option>
                </select>
                <input
                    name="city"
                    defaultValue={params.city ?? ""}
                    placeholder="City"
                    className="text-input h-9"
                />
                <Button type="submit" className="bg-primary-container font-bold">
                    Filter
                </Button>
                <Button asChild variant="outline">
                    <Link href="/businesses">Clear</Link>
                </Button>
            </form>

            <BusinessesTable data={businesses} />
        </main>
    )
}
