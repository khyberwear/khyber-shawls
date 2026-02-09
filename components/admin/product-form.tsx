'use client'

import { useActionState, useEffect, useRef, useState } from "react"
import Image from "next/image"

import { createProductAction } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Link as LinkIcon, ImagePlus, X, Upload } from "lucide-react"

type ProductFormProps = {
  categories: Array<{ id: string; name: string }>
  product?: {
    featured?: boolean;
    [key: string]: any;
  }
}

const initialState = { error: undefined as string | undefined, success: undefined as string | undefined }

export function ProductForm({ categories, product }: ProductFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>("")
  const [galleryUrls, setGalleryUrls] = useState<string[]>([])
  const [newGalleryUrl, setNewGalleryUrl] = useState("")
  const [state, formAction, isPending] = useActionState(createProductAction, initialState)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
      setFeaturedImageUrl("")
      setGalleryUrls([])
    }
  }, [state.success])

  const addGalleryUrl = () => {
    if (newGalleryUrl.trim() && !galleryUrls.includes(newGalleryUrl.trim())) {
      setGalleryUrls([...galleryUrls, newGalleryUrl.trim()])
      setNewGalleryUrl("")
    }
  }

  const removeGalleryUrl = (indexToRemove: number) => {
    setGalleryUrls(galleryUrls.filter((_, index) => index !== indexToRemove))
  }

  const inputClasses = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#B3702B] focus:ring-2 focus:ring-[#B3702B]/20 transition-all placeholder:text-muted-foreground/50"

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="product-title">
          Product Title <span className="text-red-500">*</span>
        </label>
        <input
          id="product-title"
          name="title"
          required
          placeholder="Aurora Pashmina Shawl"
          className={inputClasses}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="product-description">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="product-description"
          name="description"
          rows={4}
          required
          placeholder="Describe the product - fibres, patterns, styling suggestions..."
          className={inputClasses}
        />
      </div>

      {/* Details & Care - Two columns */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="product-details">
            Product Details
          </label>
          <textarea
            id="product-details"
            name="details"
            rows={4}
            placeholder="Material, dimensions, origin..."
            className={inputClasses}
          />
          <p className="text-xs text-muted-foreground">Shows in Details tab</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="product-care">
            Care Instructions
          </label>
          <textarea
            id="product-care"
            name="careInstructions"
            rows={4}
            placeholder="Cleaning, storage, handling..."
            className={inputClasses}
          />
          <p className="text-xs text-muted-foreground">Shows in Care tab</p>
        </div>
      </div>

      {/* Price & Inventory */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="product-price">
            Price (PKR) <span className="text-red-500">*</span>
          </label>
          <input
            id="product-price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="0.00"
            className={inputClasses}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="product-inventory">
            Inventory
          </label>
          <input
            id="product-inventory"
            name="inventory"
            type="number"
            min="0"
            placeholder="0"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Featured Image URL */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-[#B3702B]" />
          Featured Image URL
        </label>
        <input
          type="url"
          name="featuredImageUrl"
          value={featuredImageUrl}
          onChange={(e) => setFeaturedImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className={inputClasses}
        />
        {featuredImageUrl && (
          <div className="relative h-48 w-full overflow-hidden rounded-xl border border-white/10 mt-3">
            <Image
              src={featuredImageUrl}
              alt="Featured image preview"
              fill
              className="object-contain"
              onError={() => setFeaturedImageUrl("")}
            />
            <button
              type="button"
              onClick={() => setFeaturedImageUrl("")}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Paste the direct URL to your product image
        </p>
      </div>

      {/* Gallery Images URLs */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <ImagePlus className="w-4 h-4 text-[#B3702B]" />
          Gallery Images
        </label>

        <div className="flex gap-2">
          <input
            type="url"
            value={newGalleryUrl}
            onChange={(e) => setNewGalleryUrl(e.target.value)}
            placeholder="https://example.com/gallery-image.jpg"
            className={inputClasses}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addGalleryUrl()
              }
            }}
          />
          <Button
            type="button"
            onClick={addGalleryUrl}
            variant="outline"
            className="shrink-0"
          >
            Add
          </Button>
        </div>

        {/* Hidden inputs to send gallery URLs */}
        {galleryUrls.map((url, index) => (
          <input key={index} type="hidden" name="galleryImageUrls" value={url} />
        ))}

        {galleryUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            {galleryUrls.map((url, index) => (
              <div key={index} className="relative h-32 overflow-hidden rounded-xl border border-white/10">
                <Image
                  src={url}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryUrl(index)}
                  className="absolute top-2 right-2 p-1 rounded-lg bg-red-500/80 text-white hover:bg-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Add multiple gallery image URLs. Press Enter or click Add after each URL.
        </p>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="product-category">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="product-category"
          name="categoryId"
          required
          className={inputClasses}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="product-tags">
          Tags
        </label>
        <input
          id="product-tags"
          name="tags"
          type="text"
          placeholder="pashmina, winter, luxury (comma-separated)"
          className={inputClasses}
          defaultValue={product?.tags ? product.tags.map((t: any) => t.name ? t.name : t).join(", ") : ""}
        />
        <p className="text-xs text-muted-foreground">Separate tags with commas</p>
      </div>

      {/* Publish Toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div className="relative">
          <input type="checkbox" name="published" className="sr-only peer" />
          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B3702B]"></div>
        </div>
        <span className="text-sm font-medium text-foreground">Publish product immediately</span>
      </label>

      {/* Status Messages */}
      {state.error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 px-4 py-3 text-sm">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 text-green-500 px-4 py-3 text-sm">
          {state.success}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-r from-[#B3702B] to-[#8B5A2B] hover:shadow-lg hover:shadow-[#B3702B]/25 text-white border-0"
      >
        {isPending ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </>
        ) : (
          "Save Product"
        )}
      </Button>
    </form>
  )
}
