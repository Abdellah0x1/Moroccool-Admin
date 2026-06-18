import { Button } from "@/components/ui/button"
import Link from "next/link"
import { RestaurantsTable, type RestaurantRow } from "@/components/RestaurantsTable"
import { getRestaurants } from "@/lib/Restaurants"


export default async function RestaurantsPage() {
    const restaurants: RestaurantRow[] = await getRestaurants();


    return <div >
        <div className="flex justify-between items-center space-y-6">
            <div className="space-y-1">
                <h1 className="font-bold text-3xl">Restaurants</h1>
                <p className="text-gray-800">Manage cities and Destination</p>
            </div>
            <Link href="/restaurants/new"><Button className="bg-primary-container font-bold">+ New Restaurant</Button></Link>
        </div>

        <RestaurantsTable data={restaurants} />

    </div>
}