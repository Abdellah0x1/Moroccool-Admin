"use server"

import { createClient } from "@/lib/supabase/server";

import { createHash } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


function slugify(value: string) {

    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
}



export async function uploadToCloudinary(file: File, slug: string, folderName = "destinations") {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error("cloudinary env vars missing");

    }
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = `moroccool/${folderName}/${slugify(slug)}`


    const signaturePayload = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
    const signature = createHash("sha1").update(signaturePayload).digest("hex")

    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', apiKey)
    formData.append('timestamp', String(timestamp))
    formData.append('folder', folder)
    formData.append('signature', signature)

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
            method: 'POST',
            body: formData
        }
    )

    if (!response.ok) {
        const message = await response.text()
        throw new Error(`Cloudinary upload failed: ${message}`)
    }
    const result = await response.json();
    return result.secure_url as string
}


export async function createDestination(_prevState: { error?: string, success?: string }, formData: FormData): Promise<{ error?: string, success?: string }> {
    const supabase = await createClient()
    const name = String(formData.get('name') ?? "").trim()
    const description = String(formData.get('description') ?? "").trim()
    const rawSlug = String(formData.get('slug') ?? "").trim()
    const imageFile = formData.get('image')
    const slug = slugify(rawSlug || name)

    if (!name || !description || !slug) {
        return {
            error: 'Name, description, and image are required'
        }
    }

    if (!(imageFile instanceof File) || imageFile.size == 0) {
        return {
            error: 'destination file is required'
        }
    }

    if (!imageFile.type.startsWith('image/')) {
        return {
            error: "Only image file are allowed"
        }
    }
    let imageUrl: string;
    try {
        imageUrl = await uploadToCloudinary(imageFile, slug)
    } catch (error) {
        console.log("Error uploading destination image: ", error)
        return {
            error: "Error uploading destination image"
        }
    }

    const { error } = await supabase.from("city").insert({
        name,
        description,
        slug,
        image: imageUrl,
    })

    if (error) {
        console.log("Error creating destination: ", error)
        return {
            error: "Error creating destination"
        }
    }

    revalidatePath("/destinations")
    redirect("/destinations")
}



export async function updateDestination(_prevState: { error?: string, success?: string }, formData: FormData): Promise<{ error?: string, success?: string }> {
    const supabase = await createClient();
    const id = Number(formData.get('id'));
    const name = String(formData.get('name')).trim();
    const slug = String(formData.get('slug')).trim() || slugify(name);
    const description = String(formData.get('description')).trim();
    const imageFile = formData.get("image");

    if (!id) {
        return { error: "Destination ID is missing" }
    }

    if (!name || !slug || !description) {
        return {
            error: "All fields are required"
        }
    }

    const updateData: Record<string, string> = {
        name,
        slug,
        description
    }

    if (imageFile instanceof File && imageFile.size > 0) {
        if (!imageFile.type.startsWith("image/")) {
            return { error: "Only image files are allowed" }
        }

        try {
            const imageUrl = await uploadToCloudinary(imageFile, slug)
            updateData.image = imageUrl;
        } catch (err) {
            console.log("Error uploading image: ", err)
            return { error: "Error uploading image" }
        }
    }

    const { error: dbError } = await supabase.from('city').update(updateData).eq('id', id)

    if (dbError) {
        console.log("Error updating destination: ", dbError)
        return {
            error: "Error updating destination"
        }
    }

    revalidatePath('/destinations')
    redirect('/destinations')
}


export async function DeleteDestination(id: number) {
    const supabase = await createClient();

    const { error } = await supabase.from('city').delete().eq('id', id)

    if (error) {
        console.log(`error deleting destination with id: ${id}`)
        return { error: 'Error deleting destination' }
    }

    revalidatePath('/destinations')
    return { success: 'Destination deleted successfully' }
}
