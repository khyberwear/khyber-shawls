"use client"

import Image, { ImageProps } from "next/image"
import { useState, useMemo } from "react"

interface SafeImageProps extends ImageProps {
    fallbackSrc?: string
}

export function SafeImage({ src, alt, fallbackSrc = "/placeholder.svg", className, ...props }: SafeImageProps) {
    const [errorKey, setErrorKey] = useState<string | null>(null)

    // Reset error state when src changes by tracking the src that errored
    const hasError = errorKey === String(src)

    // Compute the actual source to use
    const imgSrc = useMemo(() => {
        return hasError ? fallbackSrc : src
    }, [src, hasError, fallbackSrc])

    const handleError = () => {
        if (!hasError) {
            setErrorKey(String(src))
        }
    }

    return (
        <Image
            {...props}
            src={imgSrc}
            alt={alt}
            className={className}
            onError={handleError}
        />
    )
}
