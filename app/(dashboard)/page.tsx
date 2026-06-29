import {
  CalendarCheck,
  MapPin,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { getAdminDashboardOverview } from "@/lib/admin/overview"

import { ChartLine } from "@/components/LineChart"
import { ChartBar } from "@/components/BarChart";



export default async function Home() {
  const { stats: overviewStats, recentReviews, topDestinations, restaurantAccommodationStats } = await getAdminDashboardOverview()

  const metrics = [
    {
      label: "Total destinations",
      value: overviewStats.destinations,
      icon: MapPin,
      tone: "bg-indigo-50 text-primary-container",
    },
    {
      label: "Restaurants",
      value: overviewStats.restaurants,
      icon: UtensilsCrossed,
      tone: "bg-[var(--info-bg)] text-[var(--info-text)]",
    },
    {
      label: "Hotels",
      value: overviewStats.hotels,
      icon: CalendarCheck,
      tone: "bg-[var(--success-bg)] text-[var(--success-text)]",
    },
    {
      label: "Reviews",
      value: overviewStats.reviews,
      icon: Star,
      tone: "bg-[var(--warning-bg)] text-[var(--warning-text)]",
    },
  ];


  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="eyebrow">Admin overview</p>
          <h1 className="text-3xl font-bold tracking-normal text-on-surface">
            Overview
          </h1>
          <p className="max-w-2xl text-sm leading-5 text-on-surface-variant">
            Monitor listings, bookings, and partner activity across Moroccool.
          </p>
        </div>

      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            className="admin-card admin-card-padded min-h-[156px] shadow-sm"
            key={metric.label}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="eyebrow">{metric.label}</p>
                <p className="metric-value">{metric.value}</p>
              </div>
              <div
                className={`flex size-10 items-center justify-center rounded-lg ${metric.tone}`}
              >
                <metric.icon className="size-5" />
              </div>
            </div>

          </div>
        ))}
      </section>



      <section className="grid gap-4 md:grid-cols-[2fr_minmax(150px,1fr)] lg:grid-cols-[minmax(0px_2fr)_minmax(280px_1fr)]">
        <div className="min-w-0 shadow-sm">
          <ChartLine data={restaurantAccommodationStats} />
        </div>
        <section className="flex gap-10 justify-between">


          <ChartBar data={topDestinations} className="w-[100%] h-full" />

        </section>
      </section>
      <div className="admin-card admin-card-padded flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-on-surface">New Reviews</h2>
          <span className="eyebrow">{recentReviews.length} latest</span>
        </div>


        <div className="flex flex-col gap-3">
          {recentReviews.map((review) => (
            <div
              key={review.id}
              className="group relative rounded-lg border border-transparent bg-surface-container-low p-3.5 transition-all duration-200 hover:border-outline-variant hover:shadow-sm"
            >
              {/* Star rating row */}
              <div className="mb-2 flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-3.5 ${i < review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-surface-container-high text-surface-container-high"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-on-surface-variant">
                  {review.rating.toFixed(1)}
                </span>
              </div>

              {/* Comment */}
              <p className="line-clamp-2 text-sm leading-relaxed text-on-surface">
                {review.comment || "No comment provided."}
              </p>

              {/* Timestamp */}
              {review.created_at && (
                <p className="mt-2 text-xs text-outline">
                  {new Date(review.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          ))}

          {recentReviews.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
              <Star className="size-8 text-outline-variant" />
              <p className="text-sm text-on-surface-variant">No reviews yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
