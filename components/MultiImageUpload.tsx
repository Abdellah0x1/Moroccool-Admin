"use client"

import { useState, useRef } from "react"
import { CloudUpload, X } from "lucide-react"
import { Input } from "@/components/ui/input"

type PreviewFile = {
    id: string
    file: File
    url: string
}

export function MultiImageUpload({ name = "images" }: { name?: string }) {
    const [previews, setPreviews] = useState<PreviewFile[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    function handleFiles(files: FileList | null) {
        if (!files) return

        const newPreviews: PreviewFile[] = Array.from(files)
            .filter((f) => f.type.startsWith("image/"))
            .map((file) => ({
                id: crypto.randomUUID(),
                file,
                url: URL.createObjectURL(file),
            }))

        setPreviews((prev) => [...prev, ...newPreviews])

        // Reset the input so re-selecting the same file still triggers onChange
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    function removeImage(id: string) {
        setPreviews((prev) => {
            const target = prev.find((p) => p.id === id)
            if (target) URL.revokeObjectURL(target.url)
            return prev.filter((p) => p.id !== id)
        })
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        handleFiles(e.dataTransfer.files)
    }

    return (
        <div className="space-y-4">
            {/* Drop zone */}
            <label
                htmlFor="multi-image-input"
                className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-gray-50/50 p-6 text-center transition hover:border-primary/40 hover:bg-gray-100/60"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <CloudUpload size={48} className="mb-3 text-gray-400" />
                <p className="text-sm font-medium text-gray-600">
                    Click or drag images here
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG, or WEBP — select multiple
                </p>
                <Input
                    ref={fileInputRef}
                    id="multi-image-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="sr-only"
                    onChange={(e) => handleFiles(e.target.files)}
                />
            </label>

            {/* Preview grid */}
            {previews.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {previews.map((p) => (
                        <div
                            key={p.id}
                            className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted"
                        >
                            <img
                                src={p.url}
                                alt="Preview"
                                className="h-full w-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(p.id)}
                                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Hidden file inputs so FormData includes all files under the same `name` */}
            {previews.length > 0 && (
                <input
                    type="hidden"
                    name={`${name}_count`}
                    value={previews.length}
                />
            )}

            {/*
              Because we can't stuff multiple Files into a single hidden input,
              we use a DataTransfer trick to build a real FileList for a hidden input.
              This keeps all files accessible via formData.getAll(name).
            */}
            <input
                type="file"
                name={name}
                multiple
                className="sr-only"
                ref={(el) => {
                    if (!el) return
                    const dt = new DataTransfer()
                    previews.forEach((p) => dt.items.add(p.file))
                    el.files = dt.files
                }}
            />
        </div>
    )
}
