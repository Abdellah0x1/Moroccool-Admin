import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  MapPin,
  Plus,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { getAdminDashboardOverview, getRecentReviews } from "@/lib/admin/overview"

import { ChartLine } from "@/components/LineChart"



export default async function Home() {
  const { stats: overviewStats, weeklyReviewActivity, recentReviews } = await getAdminDashboardOverview()

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
        <Button className="h-9 bg-primary-container px-3 font-bold text-white hover:bg-primary-container/90">
          <Plus className="size-4" />
          New listing
        </Button>
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
          <ChartLine data={weeklyReviewActivity} />
        </div>
        <div className="admin-card admin-card-padded">
          <h2 className="font-bold text-xl text-center">New Reviews</h2>
          <div className="flex flex-col gap-2">
            {recentReviews.map((review) => <div>
              <p>
                {review.comment}
              </p>
              <span>{review.rating}</span>
            </div>)}
          </div>
        </div>
      </section>

      <section className="flex gap-10 justify-between">
        <div>
          <h2 className="font-bold text-xl">Recent Bookings</h2>
        </div>
      </section>
    </div>
  );
}
