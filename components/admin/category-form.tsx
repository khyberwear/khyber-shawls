'use client'

import { useActionState, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { createCategoryAction, type CategoryActionState } from "@/app/admin/categories/actions"
import { Button } from "@/components/ui/button"
import { Link as LinkIcon, X } from "lucide-react"

const initialState: CategoryActionState = {}

export function CategoryForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [featuredImageUrl, setFeaturedImageUrl] = useState("")
  const [state, formAction, isPending] = useActionState<CategoryActionState, FormData>(
    createCategoryAction,
    initialState
  )

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
      setFeaturedImageUrl("")
    }
  }, [state?.success])

  const inputClasses = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#B3702B] focus:ring-2 focus:ring-[#B3702B]/20 transition-all placeholder:text-muted-foreground/50"

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {/* Category Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="category-name">
          Category Name <span className="text-red-500">*</span>
        </label>
        <input
          id="category-name"
          name="name"
          required
          placeholder="Heritage Looms"
          className={inputClasses}
        />
      </div>

      {/* Summary */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="category-summary">
          Summary
        </label>
        <textarea
          id="category-summary"
          name="summary"
          rows={3}
          placeholder="Describe what makes this category distinct..."
          className={inputClasses}
        />
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
          placeholder="https://example.com/category-image.jpg"
          className={inputClasses}
        />
        {featuredImageUrl && (
          <div className="relative h-40 w-full overflow-hidden rounded-xl border border-white/10 mt-3">
            <Image
              src={featuredImageUrl}
              alt="Featured image preview"
              fill
              className="object-cover"
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
          Paste the direct URL to your category hero image
        </p>
      </div>

      {/* Featured Image Alt */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="category-featured-alt">
          Image Alt Text
        </label>
        <input
          id="category-featured-alt"
          name="featuredImageAlt"
          type="text"
          placeholder="Describe the collection imagery"
          className={inputClasses}
        />
        <p className="text-xs text-muted-foreground">Alt text for accessibility and SEO</p>
      </div>

      {/* Status Messages */}
      {state?.error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 px-4 py-3 text-sm">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 text-green-500 px-4 py-3 text-sm">
          {state.success}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto bg-gradient-to-r from-[#B3702B] to-[#8B5A2B] hover:shadow-lg hover:shadow-[#B3702B]/25 text-white border-0"
      >
        {isPending ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
          </>
        ) : (
          "Create Category"
        )}
      </Button>
    </form>
  )
}
