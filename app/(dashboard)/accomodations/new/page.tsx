import { getDestinations } from "@/lib/destinations"
import { NewAccomodationForm } from "@/components/NewAccomodationForm"

export default async function NewAccomodationPage() {
    const cities = await getDestinations()

    return <NewAccomodationForm cities={cities} />
}