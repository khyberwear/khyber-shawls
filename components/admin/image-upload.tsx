"use client"

import { useState } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { uploadFileToR2 } from "@/lib/cloudflare-r2"

interface ImageUploadProps {
    value?: string | null
    onChange: (url: string) => void
    disabled?: boolean
    bucket?: string
    label?: string
}

export function ImageUpload({
    value,
    onChange,
    disabled,
    bucket = "uploads",
    label = "Click to upload",
    multiple = false
}: ImageUploadProps & { multiple?: boolean }) {
    const [isUploading, setIsUploading] = useState(false)

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        setIsUploading(true)
        const files = Array.from(e.target.files)

        try {
            await Promise.all(files.map(async (file) => {
                const url = await uploadFileToR2(file, bucket)
                onChange(url)
            }))
        } catch (error) {
            console.error("Upload failed:", error)
            alert(`Upload failed: ${(error as any).message || "Unknown error"}`)
        } finally {
            setIsUploading(false)
            // Reset input so functionality works if same files are selected again
            e.target.value = ''
        }
    }

    if (value) {
        return (
            <div className="relative w-full max-w-[200px] h-32 rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                <Image
                    src={value}
                    alt="Upload"
                    fill
                    className="object-cover"
                />
                <button
                    onClick={() => onChange("")}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full hover:bg-destructive/90 transition-colors shadow-sm"
                    type="button"
                    disabled={disabled}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        )
    }

    return (
        <div className="w-full">
            <label className={`
        flex flex-col items-center justify-center w-full h-32 
        border-2 border-dashed rounded-lg cursor-pointer 
        transition-colors duration-200
        ${isUploading ? 'bg-gray-100 border-gray-400' : 'bg-background hover:bg-gray-50 border-gray-300'}
      `}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isUploading ? (
                        <Loader2 className="w-8 h-8 mb-2 text-primary animate-spin" />
                    ) : (
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    )}
                    <p className="mb-2 text-xs text-muted-foreground">
                        <span className="font-semibold">{isUploading ? 'Uploading...' : label}</span>
                    </p>
                </div>
                <input
                    type="file"
                    className="hidden"
                    onChange={onUpload}
                    disabled={disabled || isUploading}
                    accept="image/*"
                    multiple={multiple}
                />
            </label>
        </div>
    )
}
