'use client'

import { useActionState, useState } from 'react'
import Image from 'next/image'
import { updateCategoryAction, type CategoryActionState } from '@/app/admin/categories/actions'
import { Button } from '@/components/ui/button'
import { Link as LinkIcon, X } from 'lucide-react'

const initialState: CategoryActionState = {}

export function CategoryEditForm(props: {
  id: string
  name: string
  summary?: string | null
  featuredImageUrl?: string | null
  featuredImageAlt?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  sections?: string | null
  uiConfig?: string | null
}) {
  const [state, action, pending] = useActionState<CategoryActionState, FormData>(
    updateCategoryAction,
    initialState
  )
  const [activeTab, setActiveTab] = useState<'basic' | 'seo' | 'sections'>('basic')
  const [featuredImageUrl, setFeaturedImageUrl] = useState(props.featuredImageUrl || '')

  // Parse JSON fields
  let sectionsData = [
    { title: '', description: '', image: { url: '', alt: '' } },
    { title: '', description: '', image: { url: '', alt: '' } },
    { title: '', description: '', image: { url: '', alt: '' } },
  ]

  try {
    if (props.sections) {
      const parsed = JSON.parse(props.sections)
      if (Array.isArray(parsed)) sectionsData = parsed
    }
  } catch (e) {
    console.error('Failed to parse sections')
  }

  const [sectionImages, setSectionImages] = useState([
    sectionsData[0]?.image?.url || '',
    sectionsData[1]?.image?.url || '',
    sectionsData[2]?.image?.url || '',
  ])

  const inputClasses = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#B3702B] focus:ring-2 focus:ring-[#B3702B]/20 transition-all placeholder:text-muted-foreground/50"

  const tabClasses = (isActive: boolean) => `px-4 py-2 text-sm font-medium rounded-t-lg transition ${isActive
      ? 'bg-[#B3702B] text-white'
      : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
    }`

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab('basic')}
          className={tabClasses(activeTab === 'basic')}
        >
          Basic Info
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={tabClasses(activeTab === 'seo')}
        >
          SEO
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={tabClasses(activeTab === 'sections')}
        >
          Content Sections
        </button>
      </div>

      <form action={action} className="space-y-6">
        <input type="hidden" name="id" value={props.id} />

        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                defaultValue={props.name}
                required
                className={inputClasses}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Summary</label>
              <textarea
                name="summary"
                defaultValue={props.summary ?? ''}
                rows={3}
                className={inputClasses}
                placeholder="Describe what makes this category distinct..."
              />
            </div>

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
                className={inputClasses}
                placeholder="https://example.com/category-image.jpg"
              />
              {featuredImageUrl && (
                <div className="relative h-40 w-full overflow-hidden rounded-xl border border-white/10 mt-3">
                  <Image
                    src={featuredImageUrl}
                    alt="Featured image preview"
                    fill
                    className="object-cover"
                    onError={() => setFeaturedImageUrl('')}
                  />
                  <button
                    type="button"
                    onClick={() => setFeaturedImageUrl('')}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Alt Text</label>
              <input
                name="featuredImageAlt"
                defaultValue={props.featuredImageAlt ?? ''}
                className={inputClasses}
                placeholder="Describe the image for accessibility"
              />
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">SEO Title</label>
              <input
                name="seoTitle"
                defaultValue={props.seoTitle ?? ''}
                placeholder={`${props.name} | Khyber Shawls`}
                className={inputClasses}
              />
              <p className="text-xs text-muted-foreground">Leave empty to use default</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">SEO Description</label>
              <textarea
                name="seoDescription"
                defaultValue={props.seoDescription ?? ''}
                rows={3}
                placeholder="Shop our collection of..."
                className={inputClasses}
              />
              <p className="text-xs text-muted-foreground">Recommended: 150-160 characters</p>
            </div>
          </div>
        )}

        {/* Content Sections Tab */}
        {activeTab === 'sections' && (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              These 3 sections appear below the products grid. Leave fields empty to hide a section.
            </p>

            {[0, 1, 2].map((index) => (
              <div key={index} className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
                <h4 className="font-semibold text-foreground">Section {index + 1}</h4>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Title</label>
                  <input
                    name={`section${index}Title`}
                    defaultValue={sectionsData[index]?.title || ''}
                    placeholder="Heritage & Craftsmanship"
                    className={inputClasses}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <textarea
                    name={`section${index}Description`}
                    defaultValue={sectionsData[index]?.description || ''}
                    rows={3}
                    placeholder="Each piece tells a story..."
                    className={inputClasses}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-[#B3702B]" />
                    Image URL
                  </label>
                  <input
                    type="url"
                    name={`section${index}ImageUrl`}
                    value={sectionImages[index]}
                    onChange={(e) => {
                      const newImages = [...sectionImages]
                      newImages[index] = e.target.value
                      setSectionImages(newImages)
                    }}
                    placeholder="https://example.com/section-image.jpg"
                    className={inputClasses}
                  />
                  {sectionImages[index] && (
                    <div className="relative h-32 w-full overflow-hidden rounded-xl border border-white/10 mt-2">
                      <Image
                        src={sectionImages[index]}
                        alt={`Section ${index + 1} preview`}
                        fill
                        className="object-cover"
                        onError={() => {
                          const newImages = [...sectionImages]
                          newImages[index] = ''
                          setSectionImages(newImages)
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Image Alt Text</label>
                  <input
                    name={`section${index}ImageAlt`}
                    defaultValue={sectionsData[index]?.image?.alt || ''}
                    placeholder="Artisan weaving shawl"
                    className={inputClasses}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

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
          disabled={pending}
          className="bg-gradient-to-r from-[#B3702B] to-[#8B5A2B] hover:shadow-lg hover:shadow-[#B3702B]/25 text-white border-0"
        >
          {pending ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </div>
  )
}
