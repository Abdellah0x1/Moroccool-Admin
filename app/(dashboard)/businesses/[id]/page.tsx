import Link from "next/link"
import { notFound } from "next/navigation"
import type { ComponentType, ReactNode } from "react"
import {
    ArrowLeft,
    BadgeCheck,
    Building2,
    CalendarDays,
    CheckCircle2,
    CircleDollarSign,
    Clock,
    FileText,
    Mail,
    MapPin,
    PencilLine,
    Phone,
    ReceiptText,
    Store,
    UserRound,
    XCircle,
} from "lucide-react"

import {
    approveBusiness,
    rejectBusiness,
    requestBusinessChanges,
} from "@/app/actions/business-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    type BusinessBookingSummary,
    type BusinessInvoiceSummary,
    getBusinessReviewDetails,
} from "@/lib/admin/businesses"

type BusinessReviewPageProps = {
    params: Promise<{
        id: string
    }>
}

function formatLabel(value: string | null | undefined) {
    if (!value) return "-"

    return value
        .split("_")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
}

function formatDate(value: string | null | undefined) {
    if (!value) return "-"

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "-"

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date)
}

function formatCurrency(value: number | null | undefined) {
    if (value === null || value === undefined) return "-"

    return new Intl.NumberFormat("en", {
        style: "currency",
        currency: "MAD",
        maximumFractionDigits: 0,
    }).format(value)
}

function getStatusClass(status: string | null) {
    switch (status) {
        case "approved":
            return "border-green-200 bg-green-50 text-green-700"
        case "needs_changes":
            return "border-amber-200 bg-amber-50 text-amber-700"
        case "rejected":
            return "border-red-200 bg-red-50 text-red-700"
        case "pending_review":
            return "border-blue-200 bg-blue-50 text-blue-700"
        default:
            return "border-border text-on-surface-variant"
    }
}

function getBookingStatusClass(status: string) {
    switch (status) {
        case "confirmed":
            return "border-green-200 bg-green-50 text-green-700"
        case "pending":
            return "border-amber-200 bg-amber-50 text-amber-700"
        case "rejected":
        case "cancelled":
            return "border-red-200 bg-red-50 text-red-700"
        default:
            return "border-border text-on-surface-variant"
    }
}

function getListingEditHref(listing: { id: number; type: string | null } | null) {
    if (!listing) return null

    const type = listing.type?.toLowerCase()

    if (type === "hotel" || type === "riad") {
        return `/accomodations/${listing.id}/edit`
    }

    if (type === "restaurant" || type === "cafe") {
        return `/restaurants/${listing.id}/edit`
    }

    return null
}

function formatCommission(model: string | null, value: number | null) {
    if (value === null || value === undefined) return "-"

    if (model === "per_booking") {
        return `${formatCurrency(value)} per booking`
    }

    if (model === "percentage") {
        return `${value}%`
    }

    return `${value} ${formatLabel(model)}`
}

function DetailItem({
    icon: Icon,
    label,
    value,
}: {
    icon: ComponentType<{ className?: string }>
    label: string
    value: ReactNode
}) {
    return (
        <div className="flex min-h-[68px] gap-3 rounded-lg border border-border bg-surface-container-low p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white text-on-surface-variant shadow-sm">
                <Icon className="size-4" />
            </div>
            <div className="min-w-0">
                <p className="eyebrow">{label}</p>
                <div className="mt-1 break-words text-sm font-semibold text-on-surface">
                    {value || "-"}
                </div>
            </div>
        </div>
    )
}

function StatCard({
    label,
    value,
    icon: Icon,
}: {
    label: string
    value: ReactNode
    icon: ComponentType<{ className?: string }>
}) {
    return (
        <div className="admin-card admin-card-padded min-h-[132px] shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                    <p className="eyebrow">{label}</p>
                    <p className="text-2xl font-bold text-on-surface">{value}</p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant">
                    <Icon className="size-5" />
                </div>
            </div>
        </div>
    )
}

function RecentBookingRow({ booking }: { booking: BusinessBookingSummary }) {
    return (
        <div className="grid gap-3 rounded-lg border border-border bg-surface-container-low p-3 md:grid-cols-[1fr_140px_140px] md:items-center">
            <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-on-surface">
                    {booking.customer_name}
                </p>
                <p className="truncate text-xs text-on-surface-variant">
                    {booking.customer_email}
                </p>
            </div>
            <Badge variant="outline" className={getBookingStatusClass(booking.status)}>
                {formatLabel(booking.status)}
            </Badge>
            <div className="text-sm text-on-surface-variant md:text-right">
                {formatDate(booking.created_at)}
            </div>
        </div>
    )
}

function RecentInvoiceRow({ invoice }: { invoice: BusinessInvoiceSummary }) {
    return (
        <div className="grid gap-3 rounded-lg border border-border bg-surface-container-low p-3 md:grid-cols-[1fr_120px_120px] md:items-center">
            <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-on-surface">
                    {invoice.invoice_number ?? `Invoice #${invoice.id}`}
                </p>
                <p className="truncate text-xs text-on-surface-variant">
                    {invoice.period_month ? formatDate(invoice.period_month) : "No period set"}
                </p>
            </div>
            <Badge variant="outline" className={getStatusClass(invoice.status)}>
                {formatLabel(invoice.status)}
            </Badge>
            <div className="text-sm font-semibold text-on-surface md:text-right">
                {formatCurrency(invoice.total_amount)}
            </div>
        </div>
    )
}

export default async function BusinessReviewPage({ params }: BusinessReviewPageProps) {
    const { id } = await params
    const businessId = Number(id)
    const details = await getBusinessReviewDetails(businessId)

    if (!details) {
        notFound()
    }

    const { business, listing, bookings, invoices, stats } = details
    const listingHref = getListingEditHref(listing)

    async function approveDetailAction() {
        "use server"
        await approveBusiness(business.id, "detail")
    }

    async function requestChangesDetailAction() {
        "use server"
        await requestBusinessChanges(business.id, "detail")
    }

    async function rejectDetailAction() {
        "use server"
        await rejectBusiness(business.id, "detail")
    }

    return (
        <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                    <Button asChild variant="ghost" className="w-fit px-0 text-on-surface-variant hover:bg-transparent">
                        <Link href="/businesses">
                            <ArrowLeft className="size-4" />
                            Back to applications
                        </Link>
                    </Button>
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="eyebrow">Business review</p>
                            <Badge variant="outline" className={getStatusClass(business.status)}>
                                {formatLabel(business.status)}
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-bold tracking-normal text-on-surface">
                            {business.name}
                        </h1>
                        <p className="max-w-2xl text-sm leading-5 text-on-surface-variant">
                            Review owner details, business information, listing readiness, and partner billing context.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <form action={approveDetailAction}>
                        <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
                            <CheckCircle2 className="size-4" />
                            Approve
                        </Button>
                    </form>
                    <form action={requestChangesDetailAction}>
                        <Button type="submit" variant="outline">
                            <PencilLine className="size-4" />
                            Needs changes
                        </Button>
                    </form>
                    <form action={rejectDetailAction}>
                        <Button type="submit" variant="destructive">
                            <XCircle className="size-4" />
                            Reject
                        </Button>
                    </form>
                </div>
            </div>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Listing"
                    value={listing ? "Created" : "Not created"}
                    icon={Store}
                />
                <StatCard
                    label="Bookings"
                    value={stats.bookings}
                    icon={CalendarDays}
                />
                <StatCard
                    label="Confirmed"
                    value={stats.confirmedBookings}
                    icon={BadgeCheck}
                />
                <StatCard
                    label="Invoices"
                    value={stats.invoices}
                    icon={ReceiptText}
                />
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
                <div className="admin-card admin-card-padded space-y-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="eyebrow">Application details</p>
                            <h2 className="text-lg font-bold text-on-surface">Business information</h2>
                        </div>
                        <Badge variant="outline" className="font-medium text-on-surface-variant">
                            ID {business.id}
                        </Badge>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        <DetailItem icon={Building2} label="Business type" value={formatLabel(business.type)} />
                        <DetailItem icon={MapPin} label="City" value={formatLabel(business.city)} />
                        <DetailItem icon={MapPin} label="Address" value={business.address} />
                        <DetailItem icon={Mail} label="Business email" value={business.email} />
                        <DetailItem icon={Phone} label="Business phone" value={business.phone} />
                        <DetailItem
                            icon={CircleDollarSign}
                            label="Commission"
                            value={formatCommission(business.commission_model, business.commission_value)}
                        />
                        <DetailItem icon={Clock} label="Submitted" value={formatDate(business.created_at)} />
                        <DetailItem icon={Clock} label="Last updated" value={formatDate(business.updated_at)} />
                    </div>
                </div>

                <div className="admin-card admin-card-padded space-y-4 shadow-sm">
                    <div>
                        <p className="eyebrow">Owner account</p>
                        <h2 className="text-lg font-bold text-on-surface">Applicant</h2>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-container-low p-3">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-white text-on-surface-variant shadow-sm">
                            <UserRound className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate font-semibold text-on-surface">
                                {business.profile?.name ?? "Unknown owner"}
                            </p>
                            <p className="truncate text-sm text-on-surface-variant">
                                {business.profile?.email ?? "No owner email"}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                            <span className="text-on-surface-variant">Owner id</span>
                            <span className="truncate font-mono text-xs text-on-surface">{business.owner_id}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-on-surface-variant">Account created</span>
                            <span className="font-medium text-on-surface">
                                {formatDate(business.profile?.created_at)}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="admin-card admin-card-padded space-y-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="eyebrow">Public listing</p>
                        <h2 className="text-lg font-bold text-on-surface">Listing readiness</h2>
                    </div>
                    {listingHref && (
                        <Button asChild variant="outline">
                            <Link href={listingHref}>
                                <PencilLine className="size-4" />
                                Edit listing
                            </Link>
                        </Button>
                    )}
                </div>

                {listing ? (
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <DetailItem icon={Store} label="Listing name" value={listing.name} />
                        <DetailItem icon={Building2} label="Listing type" value={formatLabel(listing.type)} />
                        <DetailItem icon={MapPin} label="Listing city" value={formatLabel(listing.city)} />
                        <DetailItem icon={BadgeCheck} label="Rating" value={listing.rating ?? "No rating"} />
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed border-outline-variant bg-surface-container-low p-6 text-center">
                        <Store className="mx-auto size-8 text-on-surface-variant" />
                        <p className="mt-3 font-semibold text-on-surface">No public listing yet</p>
                        <p className="mt-1 text-sm text-on-surface-variant">
                            The owner has not created the traveler-facing listing for this business.
                        </p>
                    </div>
                )}
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
                <div className="admin-card admin-card-padded space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="eyebrow">Recent activity</p>
                            <h2 className="text-lg font-bold text-on-surface">Bookings</h2>
                        </div>
                        <Badge variant="outline" className="font-medium text-on-surface-variant">
                            {stats.pendingBookings} pending
                        </Badge>
                    </div>

                    <div className="space-y-2">
                        {bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <RecentBookingRow key={booking.id} booking={booking} />
                            ))
                        ) : (
                            <div className="rounded-lg border border-dashed border-outline-variant bg-surface-container-low p-6 text-center">
                                <CalendarDays className="mx-auto size-8 text-on-surface-variant" />
                                <p className="mt-3 text-sm text-on-surface-variant">No bookings yet</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="admin-card admin-card-padded space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="eyebrow">Billing</p>
                            <h2 className="text-lg font-bold text-on-surface">Invoices</h2>
                        </div>
                        <Button asChild variant="outline">
                            <Link href="/invoices">
                                <FileText className="size-4" />
                                Manage invoices
                            </Link>
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {invoices.length > 0 ? (
                            invoices.map((invoice) => (
                                <RecentInvoiceRow key={invoice.id} invoice={invoice} />
                            ))
                        ) : (
                            <div className="rounded-lg border border-dashed border-outline-variant bg-surface-container-low p-6 text-center">
                                <ReceiptText className="mx-auto size-8 text-on-surface-variant" />
                                <p className="mt-3 text-sm text-on-surface-variant">No invoices generated yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}
