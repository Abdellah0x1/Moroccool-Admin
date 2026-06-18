import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { AccomodationTable } from "@/components/AccomodationTable"
import { getHotels } from "@/lib/Accomodation"


export default async function AccomodationsPage() {
    const accomodations = await getHotels()
    return <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div className="space-y-1">
                <h1 className="font-bold text-3xl">Accomodations</h1>
                <p className="text-muted-foreground">
                    Manage your accomodations here
                </p>
            </div>
            <Link href="/accomodations/new">
                <Button className="bg-primary-container"><Plus /> Add Hotel</Button>
            </Link>
        </div>
        <AccomodationTable data={accomodations} />
    </div>
}
