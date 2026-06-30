"use client"

import { useEffect, useRef, useState } from "react"
import { ImagePlus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type LogoImageInputProps = {
    name?: string
    label?: string
    currentLogo?: string | null
}

export function LogoImageInput({
    name = "logo",
    label = "Logo",
    currentLogo = null,
}: LogoImageInputProps) {
    const [previewUrl, setPreviewUrl] = useState(currentLogo ?? "")
    const [hasSelectedLogo, setHasSelectedLogo] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const objectUrlRef = useRef<string | null>(null)

    useEffect(() => {
        return () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current)
            }
        }
    }, [])

    function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]

        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current)
            objectUrlRef.current = null
        }

        if (!file) {
            setPreviewUrl(currentLogo ?? "")
            setHasSelectedLogo(false)
            return
        }

        const nextPreviewUrl = URL.createObjectURL(file)
        objectUrlRef.current = nextPreviewUrl
        setPreviewUrl(nextPreviewUrl)
        setHasSelectedLogo(true)
    }

    function clearSelectedLogo() {
        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current)
            objectUrlRef.current = null
        }

        if (inputRef.current) {
            inputRef.current.value = ""
        }

        setPreviewUrl(currentLogo ?? "")
        setHasSelectedLogo(false)
    }

    return (
        <div className="space-y-3">
            <Label htmlFor={name}>{label}</Label>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-gray-50">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt={`${label} preview`}
                            className="h-full w-full object-contain p-2"
                        />
                    ) : (
                        <ImagePlus className="h-8 w-8 text-gray-400" aria-hidden="true" />
                    )}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                    <Input
                        ref={inputRef}
                        id={name}
                        name={name}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleLogoChange}
                    />
                    <p className="text-xs text-muted-foreground">
                        JPG, PNG, or WEBP. A square transparent image works best.
                    </p>
                    {previewUrl && hasSelectedLogo ? (
                        <button
                            type="button"
                            onClick={clearSelectedLogo}
                            className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                        >
                            <X className="h-3.5 w-3.5" />
                            Remove selected logo
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
