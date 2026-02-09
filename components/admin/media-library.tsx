"use client"

import { useActionState, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Check, Copy, Pencil, Trash, X, Calendar, ImageIcon, AlertCircle } from "lucide-react"

import { deleteMediaAction, updateMediaAction } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"

type ActionState = { error?: string; success?: string }

export type MediaLibraryItem = {
  id: string
  url: string
  alt: string | null
  uploadedAtLabel: string
  createdAtISO: string
}

const initialActionState: ActionState = { error: undefined, success: undefined }

function MediaCard({ item }: { item: MediaLibraryItem }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (prev, formData) => {
      const result = await updateMediaAction(prev, formData)
      if (result.success) {
        setIsEditing(false)
        router.refresh()
      }
      return result
    },
    initialActionState
  )
  const [deleteState, deleteAction, isDeleting] = useActionState<ActionState, FormData>(
    async (prev, formData) => {
      const result = await deleteMediaAction(prev, formData)
      if (result.success) {
        router.refresh()
      }
      return result
    },
    initialActionState
  )

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  const handleCopyLink = async () => {
    const origin = window.location.origin
    const link = item.url.startsWith("http") ? item.url : `${origin}${item.url}`

    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
    } catch (error) {
      console.error("Failed to copy", error)
    }
  }

  const isExternal = item.url.startsWith("http://") || item.url.startsWith("https://")
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|avif|bmp|ico)$/i
  const isImage = imageExtensions.test(item.url)

  const inputClasses = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#B3702B] focus:ring-2 focus:ring-[#B3702B]/20 transition-all placeholder:text-muted-foreground/50"

  return (
    <li className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 transition-all duration-500 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-[#B3702B]/5">
      {/* Image Preview Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
        {isImage ? (
          imageError || isExternal ? (
            <img
              src={item.url}
              alt={item.alt ?? "Media"}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <Image
              src={item.url}
              alt={item.alt ?? "Media"}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              unoptimized={item.url.endsWith('.svg')}
              onError={() => setImageError(true)}
            />
          )
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground/30">
            <ImageIcon className="h-10 w-10" />
            <span className="text-[10px] uppercase tracking-widest font-bold">Files Asset</span>
          </div>
        )}

        {/* Floating Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center gap-2 backdrop-blur-sm">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="rounded-xl border-white/20 bg-white/10 text-white hover:bg-[#B3702B] hover:border-[#B3702B] transition-all font-bold text-xs"
          >
            {copied ? <Check className="h-3.5 w-3.5 mr-1.5" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
            {copied ? "Copied" : "Copy Link"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all font-bold text-xs"
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
          </Button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="font-bold text-foreground line-clamp-1">{item.alt ?? "Untitled Asset"}</h4>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
              <Calendar className="h-3 w-3" /> {item.uploadedAtLabel}
            </div>
          </div>
          <form action={deleteAction} className="shrink-0">
            <input type="hidden" name="id" value={item.id} />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all"
              disabled={isDeleting}
              onClick={(e) => {
                if (!window.confirm("Delete this asset permanently?")) e.preventDefault()
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {isEditing && (
          <form action={formAction} className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
            <input type="hidden" name="id" value={item.id} />
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Alt Text</label>
              <input
                name="alt"
                defaultValue={item.alt ?? ""}
                placeholder="Accessibility description..."
                className={inputClasses}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isPending} size="sm" className="flex-1 bg-[#B3702B] hover:bg-[#8B5A2B] text-white rounded-xl font-bold">
                {isPending ? "..." : "Save"}
              </Button>
              <Button type="button" onClick={() => setIsEditing(false)} variant="ghost" size="sm" className="rounded-xl font-bold">
                Cancel
              </Button>
            </div>

            {state?.error && <p className="text-[10px] font-bold text-red-500 px-1">{state.error}</p>}
          </form>
        )}

        <div className="flex items-center p-2.5 rounded-xl bg-white/5 border border-white/5 overflow-hidden">
          <p className="text-[10px] font-mono text-muted-foreground truncate w-full">{item.url}</p>
        </div>
      </div>
    </li>
  )
}

export function MediaLibrary({ items }: { items: MediaLibraryItem[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const sorted = useMemo(
    () => [...items].sort((a, b) => new Date(b.createdAtISO).getTime() - new Date(a.createdAtISO).getTime()),
    [items]
  )

  const totalPages = Math.ceil(sorted.length / itemsPerPage)
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sorted.slice(startIndex, startIndex + itemsPerPage)
  }, [sorted, currentPage, itemsPerPage])

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(1)
  }, [items.length, currentPage, totalPages])

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 rounded-[2.5rem] border border-dashed border-white/10 bg-white/5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#B3702B]/10 text-[#B3702B] mb-4">
          <ImageIcon className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Empty Gallery</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-[250px]">
          Your assets will appear here once you add products or categories with image URLs.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedItems.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-2xl border-white/10 bg-white/5 hover:bg-[#B3702B]/10 text-foreground"
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${currentPage === i + 1 ? 'bg-[#B3702B] w-6' : 'bg-white/10 hover:bg-white/20'
                  }`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-2xl border-white/10 bg-white/5 hover:bg-[#B3702B]/10 text-foreground"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
