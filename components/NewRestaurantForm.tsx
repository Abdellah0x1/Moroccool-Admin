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
import { createRestaurant } from "@/app/actions/restaurants"

type City = {
    id: number
    name: string
}

export function NewRestaurantForm({ cities }: { cities: City[] }) {
    const [state, formAction, isPending] = useActionState(createRestaurant, { error: "", success: "" })

    return (
        <form action={formAction} className="space-y-6 max-w-7xl mx-auto">
            <div className="space-y-4">
                <Link href="/restaurants" className="text-gray-800 font-semibold hover:text-primary flex items-center gap-1">
                    <ArrowLeft /> Go Back
                </Link>
                <h2 className="font-bold text-xl">Add New Restaurant</h2>
                <p className="text-gray-800">Create a new dining profile to be displayed in the destination guide.</p>
            </div>

            {state.error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {state.error}
                </div>
            )}

            <section className="admin-card p-4">
                <h2 className="font-bold text-xl text-primary-cotainer mb-8">General Information</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input className="p-2" id="name" name="name" placeholder="Restaurant Name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city_id">City</Label>
                        <Select name="city_id">
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
                        />
                    </div>
                </div>
            </section>

            <section className="admin-card p-4">
                <h2 className="font-bold text-xl text-primary-cotainer mb-8">Location & Contact</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="address" placeholder="Restaurant Address" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" placeholder="+212 6 12 34 56 78" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" name="website" placeholder="e.g, https://www.restaurant.com" />
                    </div>
                </div>
            </section>

            <section className="admin-card p-4">
                <h2 className="font-bold text-xl text-primary-cotainer mb-8">Content</h2>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        name="description"
                        id="description"
                        className="w-full rounded-lg border border-border bg-surface-container-lowest px-4 py-3 text-on-surface-variant placeholder:text-on-surface-variant/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                        placeholder="Describe the restaurant, its cuisine, and the atmosphere..."
                    />
                </div>
            </section>

            <section className="admin-card p-4">
                <h2 className="font-bold text-xl text-primary-cotainer mb-2">Opening Hours</h2>
                <p className="text-muted-foreground mb-4">Add the restaurant&apos;s operating schedule.</p>
                <OpeningHoursInput name="openingHours" />
            </section>

            <section className="admin-card p-4">
                <h2 className="font-bold text-xl text-primary-cotainer mb-2">Media</h2>
                <div className="space-y-6">
                    <LogoImageInput label="Restaurant logo" />
                    <div>
                        <p className="text-muted-foreground mb-4">Upload high-quality images of the restaurant. You can select multiple.</p>
                        <MultiImageUpload name="images" />
                    </div>
                </div>
            </section>

            <div className="flex justify-center gap-4">
                <Link href="/restaurants">
                    <Button variant="outline" className="w-48" type="button">Cancel</Button>
                </Link>
                <Button
                    type="submit"
                    className="w-48 cursor-pointer font-white bg-primary-container hover:bg-primary-container/90"
                    disabled={isPending}
                >
                    {isPending ? "Creating…" : "Create Restaurant"}
                </Button>
            </div>
        </form>
    )
}
