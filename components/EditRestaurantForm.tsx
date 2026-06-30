"use client"

import { useActionState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { MultiImageUpload } from "@/components/MultiImageUpload"
import { LogoImageInput } from "@/components/LogoImageInput"
import { OpeningHoursInput } from "@/components/OpeningHoursInput"
import { updateRestaurant } from "@/app/actions/restaurants"

type City = {
    id: number
    name: string
}

type Restaurant = {
    id: number
    name: string
    city: string
    description: string | null
    address: string
    rating: number
    website: string | null
    phone: string | null
    openingHours: Record<string, string> | null
    images: string[] | null
    logo?: string | null
    city_id?: number | null
}

export function EditRestaurantForm({
    restaurant,
    cities,
}: {
    restaurant: Restaurant
    cities: City[]
}) {
    const [state, formAction, isPending] = useActionState(updateRestaurant, {
        error: "",
        success: "",
    })

    // Find current city id from the city name
    const currentCityId = restaurant.city_id ?? cities.find((c) => c.name === restaurant.city)?.id

    return (
        <form action={formAction} className="space-y-6 max-w-7xl mx-auto">
            <input type="hidden" name="id" value={restaurant.id} />

            <div className="flex items-center justify-between">
                <div>
                    <Link
                        href="/restaurants"
                        className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface mb-1"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to list</span>
                    </Link>
                    <h2 className="font-bold text-xl">Edit Restaurant</h2>
                    <p className="text-gray-800">
                        Update details for <span className="font-semibold">{restaurant.name}</span>
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" className="h-9 px-4" type="button" asChild>
                        <Link href="/restaurants">Cancel</Link>
                    </Button>
                    <Button
                        type="submit"
                        className="h-9 px-4 bg-primary-container text-white hover:bg-primary-container/90"
                        disabled={isPending}
                    >
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            {state.error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {state.error}
                </div>
            )}

            {/* General Information */}
            <section className="admin-card p-4">
                <h2 className="font-bold text-xl text-primary-cotainer mb-8">General Information</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            className="p-2"
                            id="name"
                            name="name"
                            placeholder="Restaurant Name"
                            defaultValue={restaurant.name}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city_id">City</Label>
                        <Select name="city_id" defaultValue={currentCityId ? String(currentCityId) : undefined}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a city" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {cities.map((city) => (
                                        <SelectItem key={city.id} value={String(city.id)}>
                                            {city.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rating">Rating</Label>
                        <Input
                            id="rating"
                            name="rating"
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            placeholder="e.g, 4.5"
                            defaultValue={restaurant.rating}
                        />
                    </div>
                </div>
            </section>

            {/* Location & Contact */}
            <section className="admin-card p-4">
                <h2 className="font-bold text-xl text-primary-cotainer mb-8">Location & Contact</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            name="address"
                            placeholder="Restaurant Address"
                            defaultValue={restaurant.address}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            name="phone"
                            placeholder="+212 6 12 34 56 78"
                            defaultValue={restaurant.phone ?? ""}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                            id="website"
                            name="website"
                            placeholder="e.g, https://www.restaurant.com"
                            defaultValue={restaurant.website ?? ""}
                        />
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="admin-card p-4">
                <h2 className="font-bold text-xl text-primary-cotainer mb-8">Content</h2>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        name="description"
                        id="description"
                        className="w-full rounded-lg border border-border bg-surface-container-lowest px-4 py-3 text-on-surface-variant placeholder:text-on-surface-variant/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                        placeholder="Describe the restaurant, its cuisine, and the atmosphere..."
                        defaultValue={restaurant.description ?? ""}
                    />
                </div>
            </section>

            {/* Opening Hours */}
            <section className="admin-card p-4">
                <h2 className="font-bold text-xl text-primary-cotainer mb-2">Opening Hours</h2>
                <p className="text-muted-foreground mb-4">Update the restaurant&apos;s operating schedule.</p>
                <OpeningHoursInput name="openingHours" defaultValue={restaurant.openingHours ?? undefined} />
            </section>

            {/* Media */}
            <section className="admin-card p-4">
                <h2 className="font-bold text-xl text-primary-cotainer mb-2">Media</h2>
                <p className="text-muted-foreground mb-4">Upload a logo and new gallery images, or keep existing media.</p>

                <div className="mb-6">
                    <LogoImageInput label="Restaurant logo" currentLogo={restaurant.logo ?? null} />
                </div>

                {/* Existing images */}
                {restaurant.images && restaurant.images.length > 0 && (
                    <div className="mb-4">
                        <p className="text-sm font-medium text-on-surface-variant mb-2">Current images</p>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            {restaurant.images.map((url, i) => (
                                <div
                                    key={url}
                                    className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted"
                                >
                                    <img
                                        src={url}
                                        alt={`${restaurant.name} image ${i + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <p className="text-sm font-medium text-on-surface-variant mb-2">Add new images</p>
                <MultiImageUpload name="images" />
            </section>

            {/* Actions */}
            <div className="flex justify-center gap-4 pb-8">
                <Link href="/restaurants">
                    <Button variant="outline" className="w-48" type="button">
                        Cancel
                    </Button>
                </Link>
                <Button
                    type="submit"
                    className="w-48 cursor-pointer bg-primary-container text-white hover:bg-primary-container/90"
                    disabled={isPending}
                >
                    {isPending ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    )
}
