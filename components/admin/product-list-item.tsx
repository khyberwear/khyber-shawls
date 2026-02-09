"use client"

import { useActionState, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Pencil, Trash, X, Link as LinkIcon, Package, Layers, Tag as TagIcon, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react"

import { deleteProductAction, updateProductAction, deleteProductImageAction, removeFeaturedImageAction } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { RichTextEditor } from "@/components/admin/rich-text-editor"

type ActionState = { error?: string; success?: string }

type ProductData = {
  id: string
  title: string
  description: string
  details?: string | null
  careInstructions?: string | null
  price: number
  priceLabel: string
  inventory: number
  categoryId: string
  categoryName?: string | null
  published: boolean
  featuredImageId: string | null
  featuredImageUrl: string | null
  featuredImageAlt: string | null
  galleryMediaIds: string[]
  galleryImages?: Array<{ url: string; alt: string | null }>
  tags?: string[]
}

type ProductListItemProps = {
  product: ProductData
  categories: Array<{ id: string; name: string }>
  mediaLibrary: Array<{ id: string; url: string; alt: string | null }>
}

const initialState: ActionState = { error: undefined, success: undefined }

export function ProductListItem({ product, categories, mediaLibrary }: ProductListItemProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [removingImageUrl, setRemovingImageUrl] = useState<string | null>(null)

  // Rich text editor state
  const [description, setDescription] = useState(product.description)
  const [details, setDetails] = useState(product.details || "")
  const [careInstructions, setCareInstructions] = useState(product.careInstructions || "")

  // Image URL state
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>(product.featuredImageUrl || "")
  const [galleryUrls, setGalleryUrls] = useState<string[]>(product.galleryImages?.map(img => img.url) || [])
  const [newGalleryUrl, setNewGalleryUrl] = useState("")

  // Reset edit mode
  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    if (!isEditing) {
      setDescription(product.description)
      setDetails(product.details || "")
      setCareInstructions(product.careInstructions || "")
      setFeaturedImageUrl(product.featuredImageUrl || "")
      setGalleryUrls(product.galleryImages?.map(img => img.url) || [])
      setNewGalleryUrl("")
    }
  };

  const addGalleryUrl = () => {
    if (newGalleryUrl.trim() && !galleryUrls.includes(newGalleryUrl.trim())) {
      setGalleryUrls([...galleryUrls, newGalleryUrl.trim()])
      setNewGalleryUrl("")
    }
  }

  const removeGalleryUrl = (urlToRemove: string) => {
    setGalleryUrls(galleryUrls.filter((url) => url !== urlToRemove))
  }

  const [updateState, updateAction, isUpdating] = useActionState<ActionState, FormData>(
    async (prev, formData) => {
      // Add gallery URLs manually since they're not inputs in a simple form anymore
      galleryUrls.forEach(url => formData.append("galleryImageUrls", url))

      const result = await updateProductAction(prev, formData)
      if (result.success) {
        setIsEditing(false)
        router.refresh()
      }
      return result
    },
    initialState
  )

  const [deleteState, deleteAction, isDeleting] = useActionState<ActionState, FormData>(
    async (prev, formData) => {
      const result = await deleteProductAction(prev, formData)
      if (result.success) {
        router.refresh()
      }
      return result
    },
    initialState
  )

  const inputClasses = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#B3702B] focus:ring-2 focus:ring-[#B3702B]/20 transition-all placeholder:text-muted-foreground/50"

  return (
    <div className={`group relative flex flex-col gap-6 rounded-[2.5rem] border border-white/10 bg-white/5 p-4 md:p-6 transition-all duration-500 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-[#B3702B]/5 ${isEditing ? 'border-[#B3702B]/30' : ''}`}>
      {!isEditing && (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="relative w-full md:w-48 aspect-square overflow-hidden rounded-3xl bg-white/5 flex-shrink-0 border border-white/5 shadow-inner">
            {product.featuredImageUrl ? (
              <Image
                src={product.featuredImageUrl}
                alt={product.featuredImageAlt ?? product.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 192px"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground/30">
                <Package className="w-12 h-12 mb-2" />
                <span className="text-xs font-medium">No Image</span>
              </div>
            )}

            {/* Overlay Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              <span className={`flex items-center gap-1 xl rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-lg backdrop-blur-md ${product.published
                  ? "bg-green-500/80 text-white"
                  : "bg-white/20 text-white"
                }`}>
                {product.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                {product.published ? "Live" : "Draft"}
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col flex-1 min-w-0 py-2">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-foreground group-hover:text-[#B3702B] transition-colors line-clamp-1">{product.title}</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Layers className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">{product.categoryName ?? "Uncategorised"}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-[#B3702B]">{product.priceLabel}</p>
                <p className="text-xs font-medium text-muted-foreground mt-1">
                  Qty: <span className={product.inventory > 0 ? "text-foreground font-bold" : "text-red-500 font-bold"}>{product.inventory}</span> in stock
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mt-4 line-clamp-3">
              {product.description.replace(/<[^>]*>/g, '')}
            </p>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {product.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 rounded-lg bg-white/5 border border-white/5 px-2 py-0.5 text-[10px] font-bold text-[#B3702B]">
                    <TagIcon className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 mt-auto pt-6">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleEditToggle}
                className="rounded-xl border-white/10 bg-white/5 hover:bg-[#B3702B]/10 hover:text-[#B3702B] hover:border-[#B3702B]/30 transition-all font-bold text-xs"
              >
                <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
              </Button>
              <form action={deleteAction} className="inline">
                <input type="hidden" name="productId" value={product.id} />
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all font-bold text-xs"
                  disabled={isDeleting}
                  onClick={(e) => {
                    if (!window.confirm(`Delete "${product.title}"? This cannot be undone.`)) {
                      e.preventDefault()
                    }
                  }}
                >
                  <Trash className="w-3.5 h-3.5 mr-2" /> {isDeleting ? "..." : "Delete"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <form action={updateAction} className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <input type="hidden" name="productId" value={product.id} />

          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Pencil className="w-5 h-5 text-[#B3702B]" /> Editing Product
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleEditToggle}
              className="rounded-full hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid gap-8">
            {/* Title & Category */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Title</label>
                <input
                  name="title"
                  defaultValue={product.title}
                  required
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Category</label>
                <select
                  name="categoryId"
                  defaultValue={product.categoryId}
                  required
                  className={inputClasses}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Inventory */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Price (PKR)</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={product.price}
                  required
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Inventory</label>
                <input
                  name="inventory"
                  type="number"
                  defaultValue={product.inventory}
                  required
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Description</label>
              <RichTextEditor
                content={description}
                onChange={setDescription}
                id={`${product.id}-description`}
              />
              <input type="hidden" name="description" value={description} />
            </div>

            {/* Images - URL Based */}
            <div className="grid gap-8 md:grid-cols-2">
              {/* Featured Image URL */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Featured Image URL</label>
                <div className="flex gap-2">
                  <input
                    name="featuredImageUrl"
                    value={featuredImageUrl}
                    onChange={(e) => setFeaturedImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className={inputClasses}
                  />
                </div>
                {featuredImageUrl && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 group">
                    <Image src={featuredImageUrl} alt="Preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setFeaturedImageUrl("")}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Gallery URLS */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Gallery Image URLs</label>
                <div className="flex gap-2">
                  <input
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="https://example.com/gallery.jpg"
                    className={inputClasses}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addGalleryUrl()
                      }
                    }}
                  />
                  <Button type="button" onClick={addGalleryUrl} variant="outline" className="shrink-0 rounded-xl">Add</Button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {galleryUrls.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                      <Image src={url} alt="Gallery" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryUrl(url)}
                        className="absolute top-1 right-1 p-1 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Toggle Published */}
            <div className="flex items-center gap-3 py-2">
              <div className="relative">
                <input type="checkbox" name="published" defaultChecked={product.published} className="sr-only peer" />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B3702B]"></div>
              </div>
              <span className="text-sm font-bold text-foreground">Published & Live</span>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Tags (comma-separated)</label>
              <input
                name="tags"
                type="text"
                defaultValue={product.tags?.join(", ") || ""}
                placeholder="e.g. wool, winter, luxury"
                className={inputClasses}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
            {updateState.error && (
              <div className="text-sm font-bold text-red-500 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {updateState.error}
              </div>
            )}
            {updateState.success && (
              <div className="text-sm font-bold text-green-500 p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {updateState.success}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isUpdating}
                className="flex-1 bg-gradient-to-r from-[#B3702B] to-[#8B5A2B] text-white border-0 font-black tracking-widest uppercase py-6 rounded-2xl shadow-xl shadow-[#B3702B]/20 transition-all hover:shadow-[#B3702B]/40 active:scale-95"
              >
                {isUpdating ? "Saving..." : "Save Product Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleEditToggle}
                className="rounded-2xl border-white/10 px-8"
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
