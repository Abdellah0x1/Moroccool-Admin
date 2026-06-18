"use client"

import { useState } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
    currentImage: string
    cityName: string
}

export function DestinationImageInput({ currentImage, cityName }: Props) {
    const [previewUrl, setPreviewUrl] = useState(currentImage)

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]

        if (!file) {
            setPreviewUrl(currentImage)
            return
        }

        const nextPreviewUrl = URL.createObjectURL(file)
        setPreviewUrl(nextPreviewUrl)
    }

    return (
        <div className="space-y-3">
            <Label htmlFor="image">Destination image</Label>

            <div className="relative h-64 w-full overflow-hidden rounded-lg border bg-gray-100">
                <Image
                    src={previewUrl}
                    alt={cityName}
                    fill
                    className="object-cover"
                    unoptimized
                />
            </div>

            <Input
                id="image"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
            />
        </div>
    )
}