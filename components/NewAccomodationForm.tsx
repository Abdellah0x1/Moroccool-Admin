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
import { OpeningHoursInput } from "@/components/OpeningHoursInput"
import { createAccomodation } from "@/app/actions/accomodation-actions"

type City = {
    id: number
    name: string
}

export function NewAccomodationForm({ cities }: { cities: City[] }) {
    const [state, formAction, isPending] = useActionState(createAccomodation, { error: "", success: "" })

    return (
        <form action={formAction} className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="space-y-1">
                <Link href="/accomodations" className="text-gray-800 font-semibold hover:text-primary flex items-center gap-1">
                    <ArrowLeft className="h-4 w-4" /> Back to list
                </Link>
                <h1 className="font-bold text-xl">Add New Accommodation</h1>
                <p className="text-muted-foreground">Create a new hotel or riad listing for the destination guide.</p>
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
                        <Input id="name" name="name" placeholder="e.g, Riad Marrakech" />
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

            {/* Location & Contact */}
            <section className="admin-card p-4">
                <h2 className="font-bold text-xl text-primary-cotainer mb-8">Location & Contact</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="address" placeholder="Full street address" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" placeholder="+212 6 12 34 56 78" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" name="website" placeholder="e.g, https://www.riad.com" />
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
                        rows={4}
                        className="w-full rounded-lg border border-border bg-surface-container-lowest px-4 py-3 text-on-surface-variant placeholder:text-on-surface-variant/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                        placeholder="Describe the accommodation, its amenities, and the atmosphere..."
                    />
                </div>
            </section>

            {/* Opening Hours */}
            <section className="admin-card p-4">
                <h2 className="font-bold text-xl text-primary-cotainer mb-2">Opening Hours</h2>
                <p className="text-muted-foreground mb-4">Add check-in/check-out times or reception hours.</p>
                <OpeningHoursInput name="openingHours" />
            </section>

            {/* Media */}
            <section className="admin-card p-4">
                <h2 className="font-bold text-xl text-primary-cotainer mb-2">Media</h2>
                <p className="text-muted-foreground mb-4">Upload high-quality images of the accommodation. You can select multiple.</p>
                <MultiImageUpload name="images" />
            </section>

            {/* Actions */}
            <div className="flex justify-center gap-4 pb-8">
                <Link href="/accomodations">
                    <Button variant="outline" className="w-48" type="button">Cancel</Button>
                </Link>
                <Button
                    type="submit"
                    className="w-48 cursor-pointer bg-primary-container text-white hover:bg-primary-container/90"
                    disabled={isPending}
                >
                    {isPending ? "Creating…" : "Create Accommodation"}
                </Button>
            </div>
        </form>
    )
}
