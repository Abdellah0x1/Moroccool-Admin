"use client"

import { useActionState, useState, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, CloudUpload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { updateDestination } from "@/app/actions/destination-actions"

type Destination = {
    id: number
    name: string
    slug: string
    description: string
    image: string
}

export function EditDestinationForm({ destination }: { destination: Destination }) {
    const [state, formAction, isPending] = useActionState(updateDestination, { error: "", success: "" })
    const [previewUrl, setPreviewUrl] = useState(destination.image)
    const fileInputRef = useRef<HTMLInputElement>(null)

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (!file) {
            setPreviewUrl(destination.image)
            return
        }
        setPreviewUrl(URL.createObjectURL(file))
    }

    return (
        <form action={formAction} className="space-y-6">
            {/* Hidden input to pass the destination id */}
            <input type="hidden" name="id" value={destination.id} />

            <div className="flex justify-between items-center">
                <div>
                    <Link href="/destinations" className="text-muted-foreground flex gap-2 items-center mb-2">
                        <ArrowLeft />
                        Back to Destination
                    </Link>
                    <h2 className="font-bold text-xl">Edit Destination</h2>
                </div>

                <div className="space-x-2">
                    <Button variant="secondary" className="h-9 px-4" type="button" asChild>
                        <Link href="/destinations">Cancel</Link>
                    </Button>
                    <Button
                        type="submit"
                        className="h-9 px-4 bg-primary-container text-white"
                        disabled={isPending}
                    >
                        {isPending ? "Saving…" : "Save Changes"}
                    </Button>
                </div>
            </div>

            {state.error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {state.error}
                </div>
            )}

            <section className="admin-card p-4 space-y-2 grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-gray-900">Destination Name</Label>
                    <Input className="p-4" type="text" placeholder="e.g, Marrakech" name="name" defaultValue={destination.name} />
                </div>
                <div className="space-y-2">
                    <Label className="text-gray-900">Destination Slug</Label>
                    <Input className="p-4" type="text" placeholder="e.g, marrakech" name="slug" defaultValue={destination.slug} />
                </div>
                <div className="space-y-2 col-span-2">
                    <Label className="text-gray-900">Description</Label>
                    <Textarea className="p-4" placeholder="e.g, Marrakech" name="description" defaultValue={destination.description} />
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
                    {/* Image preview: shows new file preview or current image */}
                    <img
                        src={previewUrl}
                        alt={destination.name}
                        className="w-48 h-64 object-cover object-center rounded-md mt-4"
                    />
                    <Input
                        ref={fileInputRef}
                        id="image"
                        name="image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="sr-only"
                        onChange={handleImageChange}
                    />
                </label>
            </section>
        </form>
    )
}
