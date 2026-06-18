import { createClient } from "./supabase/server";
import type { RestaurantRow } from "@/components/RestaurantsTable"



export async function getRestaurants() {
    const supabase = await createClient();

    const { data: Restaurants, error } = await supabase.from("etablissement").select("id, name, description, address, phone, images, city, city_id, rating, website, openingHours").eq("type", "restaurant")

    if (error) {
        console.log("error fetching restaurant from supabase", error);
        return []
    }

    return Restaurants as RestaurantRow[]
}



export async function getRestaurant(id: number) {
    const supabase = await createClient();
    const { data: restaurant, error } = await supabase.from("etablissement")
        .select("id,name,description,address,phone,images,city,city_id,rating,website,openingHours").eq("id", id).single();

    if (error) {
        console.log("error fetching restaurant from supabase", error);
        return null
    }
    return restaurant as RestaurantRow
}
