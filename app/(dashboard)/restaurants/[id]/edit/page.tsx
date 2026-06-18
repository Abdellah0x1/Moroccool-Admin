import { getRestaurant } from "@/lib/Restaurants"
import { getDestinations } from "@/lib/destinations"
import { EditRestaurantForm } from "@/components/EditRestaurantForm"

export default async function EditRestaurantPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const [restaurant, cities] = await Promise.all([
        getRestaurant(Number(id)),
        getDestinations(),
    ])

    if (!restaurant) {
        return (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
                Restaurant not found
            </div>
        )
    }

    return <EditRestaurantForm restaurant={restaurant} cities={cities} />
}