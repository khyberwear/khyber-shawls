'use client'

import { useActionState, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { createBlogPostAction } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Link as LinkIcon, X, FileText } from "lucide-react"

const initialState = { error: undefined as string | undefined, success: undefined as string | undefined }

export function BlogForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [state, formAction, isPending] = useActionState(createBlogPostAction, initialState)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
      setImageUrl("")
    }
  }, [state.success])

  const inputClasses = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#B3702B] focus:ring-2 focus:ring-[#B3702B]/20 transition-all placeholder:text-muted-foreground/50"

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="blog-title">
          Post Title <span className="text-red-500">*</span>
        </label>
        <input
          id="blog-title"
          name="title"
          required
          placeholder="Behind the craftsmanship"
          className={inputClasses}
        />
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="blog-excerpt">
          Excerpt
        </label>
        <textarea
          id="blog-excerpt"
          name="excerpt"
          rows={2}
          placeholder="A short summary that appears in listings..."
          className={inputClasses}
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="blog-content">
          Body Content <span className="text-red-500">*</span>
        </label>
        <textarea
          id="blog-content"
          name="content"
          rows={6}
          required
          placeholder="Write the story behind a recent piece, artisan, or tradition..."
          className={inputClasses}
        />
      </div>

      {/* Image URL */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-[#B3702B]" />
          Feature Image URL
        </label>
        <input
          type="url"
          name="image"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/blog-image.jpg"
          className={inputClasses}
        />
        {imageUrl && (
          <div className="relative h-48 w-full overflow-hidden rounded-xl border border-white/10 mt-3">
            <Image
              src={imageUrl}
              alt="Blog post preview"
              fill
              className="object-cover"
              onError={() => setImageUrl("")}
            />
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Publish Toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div className="relative">
          <input type="checkbox" name="published" className="sr-only peer" />
          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B3702B]"></div>
        </div>
        <span className="text-sm font-medium text-foreground">Publish immediately</span>
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
        className="w-full sm:w-auto bg-gradient-to-r from-[#B3702B] to-[#8B5A2B] hover:shadow-lg hover:shadow-[#B3702B]/25 text-white border-0"
      >
        {isPending ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Publishing...
          </>
        ) : (
          "Publish Entry"
        )}
      </Button>
    </form>
  )
}
