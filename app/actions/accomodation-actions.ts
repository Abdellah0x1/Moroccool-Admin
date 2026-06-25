"use server"

import { createClient } from "@/lib/supabase/server";
import { uploadToCloudinary } from "./destination-actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function createAccomodation(_prevState: { error?: string; success?: string }, formData: FormData): Promise<{ error?: string; success?: string }> {
    const supabase = await createClient();
    const name = String(formData.get('name')).trim()
    const address = String(formData.get('address')).trim()
    const phone = String(formData.get('phone')).trim()
    const website = String(formData.get('website')).trim()
    const rating = parseFloat(String(formData.get('rating') || '0'))
    const cityId = Number(formData.get('city_id'))
    const description = String(formData.get('description')).trim()
    const openingHoursRaw = String(formData.get('openingHours') || '{}')
    const images = formData.getAll('images') as File[]

    if (!name || !address || !cityId) {
        return { error: 'Name, address, and city are required' }
    }

    // Look up city name
    const { data: cityRow } = await supabase.from('city').select('name').eq('id', cityId).single()
    if (!cityRow) {
        return { error: 'Selected city not found' }
    }

    // Upload images
    const validImages = images.filter(img => img instanceof File && img.size > 0)
    if (validImages.some(img => !img.type.startsWith('image/'))) {
        return { error: 'Only image files are allowed' }
    }

    let imageUrls: string[] = []
    if (validImages.length > 0) {
        try {
            imageUrls = await Promise.all(
                validImages.map((image) => uploadToCloudinary(image, name))
            )
        } catch (err) {
            console.log('Error uploading images: ', err)
            return { error: 'Error uploading images' }
        }
    }

    const { error } = await supabase.from('etablissement').insert({
        name,
        address,
        phone,
        website,
        rating,
        city: cityRow.name,
        city_id: cityId,
        description,
        openingHours: JSON.parse(openingHoursRaw),
        images: imageUrls,
        type: 'hotel',
    })

    if (error) {
        console.log('create error', error)
        return { error: 'Error creating accommodation' }
    }

    revalidatePath('/accomodations')
    redirect('/accomodations')
}





export async function deleteAccomodation(id: number) {
    const supabase = await createClient();
    const { error } = await supabase.from("etablissement").delete().eq("id", id)

    if (error) {
        console.log('delete error', error)
        return null
    }
    revalidatePath('/accomodations')
    redirect('/accomodations')
}

export async function updateAccomodation(_prevState: { error?: string, success?: string }, formData: FormData): Promise<{ error?: string, success?: string }> {
    const supabase = await createClient()
    const id = Number(formData.get('id'))
    const name = String(formData.get('name'))
    const city = String(formData.get('city'))
    const address = String(formData.get('address'))
    const phone = String(formData.get('phone'));
    const website = String(formData.get('website'));
    const description = String(formData.get('description'));
    const imagesFiles = formData.getAll('images') as File[];
    const city_id = Number(formData.get('city_id'))
    const rating = parseFloat(String(formData.get('rating') || '0'))
    const openingHoursRaw = String(formData.get('openingHours') || '{}');
    const openingHours = JSON.parse(openingHoursRaw) || "{}"

    if (!name || !city || !address || !phone) {
        return { error: 'Name, city, address, and phone are required' }
    }


    const { data: cityRow } = await supabase.from('city').select('*').eq('id', city_id).single();

    if (!cityRow) {
        return {
            error: "City not found"
        }
    }

    const { data: existingAccomodation, error: existingError } = await supabase.from('etablissement').select('*').eq('id', id).eq('type', 'hotel').single();

    if (existingError || !existingAccomodation) {
        console.log("accomodatione existing error :", existingError)
        return {
            error: "Accomodation not found"
        }
    }

    const validImages = imagesFiles.filter(image => image instanceof File && image.size > 0);

    let imagesUrls: string[] = []

    if (validImages.length > 0) {
        try {
            imagesUrls = await Promise.all(
                validImages.map((image) => uploadToCloudinary(image, name))
            )
        }
        catch (err) {
            console.log('id in upload : ', id)
            console.log('Error uploading images: ', err);
            return { error: 'Error uploading images' }
        }
    }
    const { error } = await supabase.from('etablissement').update({
        name,
        city: cityRow.name ? cityRow.name : existingAccomodation.city,
        city_id,
        address,
        phone,
        website,
        rating,
        description,
        openingHours,
        images: imagesUrls.length > 0 ? imagesUrls : existingAccomodation.images
    }).eq('id', id).eq('type', 'hotel');

    if (error) {
        console.log('Update error: ', error);
        return { error: 'Error updating accomodation' }
    }
    revalidatePath('/accomodations');
    redirect('/accomodations');
}

