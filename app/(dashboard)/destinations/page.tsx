import { Button } from "@/components/ui/button"
import { DestinationsTable, type DestinationRow } from "@/components/DestinationsTable"
import { getDestinations } from "@/lib/destinations"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function DestinationsPage() {
    const data = await getDestinations() as DestinationRow[];
    return <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-normal text-on-surface">Destinations</h1>
                    <Badge variant="outline" className="h-6 text-on-surface-variant">
                        {data.length} total
                    </Badge>
                </div>
                <p className="text-sm leading-5 text-on-surface-variant">
                    Manage city hubs, images, and destination copy.
                </p>
            </div>
            <Link href={"/destinations/new"}>
                <Button className="h-9 bg-primary-container px-3 font-bold text-white hover:bg-primary-container/90">
                    <Plus className="size-4" />
                    New destination
                </Button>
            </Link>
        </div>
        <DestinationsTable data={data} />
    </div>
}
