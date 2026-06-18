"use client"

import Link from "next/link"
import { CloudUpload } from "lucide-react"
import { createDestination } from "@/app/actions/destination-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useActionState } from "react"

export default function NewDestination() {
    const [state, formAction, isPending] = useActionState(createDestination, { error: "" });

    return (
        <form action={formAction} className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">New Destination</h2>
                    <p className="text-muted-foreground">
                        Configure profile and content for Moroccool platform.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button asChild type="button" variant="secondary" className="h-9 px-4">
                        <Link href="/destinations">Cancel</Link>
                    </Button>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="h-9 bg-primary-container px-4 font-bold text-white hover:bg-primary-container/90"
                    >
                        {isPending ? "Saving..." : "Save destination"}
                    </Button>
                </div>
            </div>

            {state.error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {state.error}
                </div>
            ) : null}

            <section className="admin-card p-4">
                <h2 className="mb-5 text-xl font-bold">General Information</h2>

                <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="name">City Name</Label>
                        <Input id="name" name="name" required placeholder="e.g. Marrakech" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="slug">City Slug</Label>
                        <Input id="slug" name="slug" placeholder="e.g. marrakech" />
                    </div>

                    <div className="col-span-2 flex flex-col gap-1">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" required />
                    </div>
                </div>
            </section>

            <section className="admin-card p-4">
                <h2 className="text-xl font-bold">Upload Media</h2>
                <p className="text-muted-foreground">
                    Upload one high-quality city image.
                </p>

                <label
                    htmlFor="image"
                    className="mt-4 flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-gray-50/50 p-6 text-center transition hover:bg-gray-100"
                >
                    <CloudUpload size={56} className="mb-2 text-gray-400" />
                    <p className="text-sm font-medium text-gray-600">
                        Click to upload city image
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        JPG, PNG, or WEBP
                    </p>

                    <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        required
                        className="sr-only"
                    />
                </label>
            </section>
        </form>
    )
}
