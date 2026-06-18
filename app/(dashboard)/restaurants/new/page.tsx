import { getDestinations } from "@/lib/destinations"
import { NewRestaurantForm } from "@/components/NewRestaurantForm"

export default async function NewRestaurant() {
    const cities = await getDestinations()

    return <NewRestaurantForm cities={cities} />
}