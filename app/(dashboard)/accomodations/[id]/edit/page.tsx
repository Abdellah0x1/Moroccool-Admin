import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EditAccomodationForm } from "@/components/EditAccomodationForm"
import { getDestinations } from "@/lib/destinations";
import { getHotelById } from "@/lib/Accomodation";
import { notFound } from "next/navigation";


export default async function EditAccomodationPage({ params }: { params: Promise<{ id: string }> }) {
    const cities = await getDestinations()
    const { id } = await params
    const accomodation = await getHotelById(Number(id))
    if (!accomodation) {
        notFound()
    }
    return <div>

        <EditAccomodationForm accomodation={accomodation} cities={cities} />
    </div>

}