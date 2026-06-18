"use server"

import { createClient } from "@/lib/supabase/server";
import { uploadToCloudinary } from "./destination-actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function createRestaurant(_prevState: { error?: string, success?: string }, formData: FormData): Promise<{ error?: string, success?: string }> {
    const supabase = await createClient();
    const name = String(formData.get("name")).trim()
    const description = String(formData.get("description")).trim()
    const address = String(formData.get("address")).trim()
    const phone = String(formData.get("phone")).trim()
    const website = String(formData.get("website")).trim()
    const cityId = Number(formData.get("city_id"))
    const rating = parseFloat(String(formData.get("rating") || "0"))
    const openingHoursRaw = String(formData.get("openingHours") || "{}")
    const images = formData.getAll("images") as File[]

    if (!name || !description || !address || !phone || !cityId) {
        return { error: 'Name, description, address, phone, and city are required' }
    }

    // Filter out empty file entries (browsers send an empty File when nothing is selected)
    const validImages = images.filter(img => img instanceof File && img.size > 0)

    if (validImages.some(img => !img.type.startsWith('image/'))) {
        return { error: "Only image files are allowed" }
    }

    // Upload all images in parallel — forEach(async ...) does NOT await!
    let imageUrls: string[] = []
    if (validImages.length > 0) {
        try {
            imageUrls = await Promise.all(
                validImages.map((image) => uploadToCloudinary(image, name, "restaurants"))
            )
        } catch (err) {
            console.log("Error uploading images: ", err)
            return { error: "Error uploading images" }
        }
    }

    // Look up the city name from the city table
    const { data: cityRow } = await supabase.from('city').select('name').eq('id', cityId).single()
    if (!cityRow) {
        return { error: "Selected city not found" }
    }

    const { error } = await supabase.from('etablissement').insert({
        name,
        description,
        address,
        phone,
        website,
        images: imageUrls,
        type: "restaurant",
        city_id: cityId,
        city: cityRow.name,
        rating,
        openingHours: JSON.parse(openingHoursRaw),
    })

    if (error) {
        console.log("Error creating restaurant: ", error)
        return { error: "Error creating restaurant" }
    }

    revalidatePath("/restaurants")
    redirect("/restaurants")
}


function parseOpeningHours(value: string) {
    try {
        const parsed = JSON.parse(value || "{}")
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            return {}
        }

        return parsed as Record<string, string>
    } catch {
        return {}
    }
}

export async function updateRestaurant(_prevState: { error?: string, success?: string }, formData: FormData): Promise<{ error?: string, success?: string }> {
    const supabase = await createClient();
    const id = Number(formData.get("id"));
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const website = String(formData.get("website") ?? "").trim();
    const cityId = Number(formData.get("city_id"));
    const rating = Number.parseFloat(String(formData.get("rating") || "0"));
    const openingHours = parseOpeningHours(String(formData.get("openingHours") || "{}"));
    const images = formData.getAll("images") as File[];

    if (!id) {
        return { error: "Restaurant ID is missing" }
    }

    if (!name || !description || !address || !phone || !cityId) {
        return { error: "Name, description, address, phone, and city are required" }
    }

    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
        return { error: "Rating must be between 0 and 5" }
    }

    const { data: existingRestaurant, error: existingError } = await supabase
        .from("etablissement")
        .select("images")
        .eq("id", id)
        .eq("type", "restaurant")
        .single();

    if (existingError || !existingRestaurant) {
        console.log("Error fetching restaurant before update: ", existingError)
        return { error: "Restaurant not found" }
    }

    const validImages = images.filter((image) => image instanceof File && image.size > 0);

    if (validImages.some((image) => !image.type.startsWith("image/"))) {
        return { error: "Only image files are allowed" }
    }

    let newImageUrls: string[] = [];
    if (validImages.length > 0) {
        try {
            newImageUrls = await Promise.all(
                validImages.map((image) => uploadToCloudinary(image, name, "restaurants"))
            );
        } catch (error) {
            console.log("Error uploading restaurant images: ", error)
            return { error: "Error uploading restaurant images" }
        }
    }

    const { data: cityRow } = await supabase
        .from("city")
        .select("name")
        .eq("id", cityId)
        .single();

    if (!cityRow) {
        return { error: "Selected city not found" }
    }

    const existingImages = Array.isArray(existingRestaurant.images)
        ? existingRestaurant.images
        : [];

    const updateData = {
        name,
        description,
        address,
        phone,
        website,
        city_id: cityId,
        city: cityRow.name,
        rating,
        openingHours,
        images: newImageUrls.length > 0 ? [...existingImages, ...newImageUrls] : existingImages,
    };

    const { error } = await supabase
        .from("etablissement")
        .update(updateData)
        .eq("id", id)
        .eq("type", "restaurant");

    if (error) {
        console.log("Error updating restaurant: ", error)
        return { error: "Error updating restaurant" }
    }

    revalidatePath("/restaurants");
    revalidatePath(`/restaurants/${id}/edit`);
    redirect("/restaurants");
}




export async function deleteRestaurant(id: number) {
    const supabase = await createClient();

    const { error } = await supabase.from('etablissement').delete().eq('id', id);

    if (error) {
        console.log("error deleting restaurant : ", error.message);
    }

    revalidatePath("/restaurants");
    redirect("/restaurants");
}
