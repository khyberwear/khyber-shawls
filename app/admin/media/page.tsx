// export const runtime = 'edge';
// app/admin/media/page.tsx
import { HeroMediaForm } from "@/components/admin/hero-media-form"
import { MediaLibrary } from "@/components/admin/media-library"
import { MediaUploadForm } from "@/components/admin/media-upload-form"
import { HERO_CONFIGS, fetchAllHeroContent } from "@/lib/hero"
import fetchMediaLibrary from "@/lib/media"

function createMediaUrlKey(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ""
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed)
      const normalizedPath = parsed.pathname.replace(/^\/+/g, "/") || "/"
      return normalizedPath.toLowerCase()
    } catch {
      return trimmed.toLowerCase()
    }
  }
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`
  return withLeadingSlash.replace(/\/+/g, "/").toLowerCase()
}

const uploadedAtFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

function toDate(value: string | Date | undefined): Date | undefined {
  if (!value) return undefined
  const d = value instanceof Date ? value : new Date(value)
  return isNaN(d.getTime()) ? undefined : d
}

export default async function AdminMediaPage() {
  const [heroes, mediaLibrary] = await Promise.all([
    fetchAllHeroContent(),
    fetchMediaLibrary(30), // Fetch 30 items for pagination (10 pages of 3 items)
  ])

  const heroMap = new Map<string, any>(heroes.map((h: any) => [h.key, h]))

  // Deduplicate by normalized path
  const uniqueMedia = [] as typeof mediaLibrary
  const seen = new Set<string>()
  for (const item of mediaLibrary) {
    const urlKey = createMediaUrlKey(item.url)
    if (seen.has(urlKey)) continue
    seen.add(urlKey)
    uniqueMedia.push(item)
  }

  const mediaLibraryItems = uniqueMedia.map((item: any) => {
    const createdAt = toDate(item.createdAt as any)
    return {
      id: String(item.id),
      url: item.url,
      alt: item.alt ?? null,
      uploadedAtLabel: createdAt ? uploadedAtFormatter.format(createdAt) : "—",
      createdAtISO: createdAt ? createdAt.toISOString() : "",
    }
  })

  return (
    <div className="space-y-10 pb-16">
      <section className="rounded-4xl border border-white/10 bg-background/90 p-4 md:p-8 shadow-lg backdrop-blur">
        <h1 className="text-3xl font-semibold text-foreground">Media Library</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update hero banners and supporting copy. Use the three panels below to prepare up to three homepage hero rotations. All changes publish instantly—no backup approvals required.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.5fr),minmax(0,1fr)]">
        <MediaUploadForm />
        <div className="space-y-4 rounded-3xl border border-white/10 bg-background/90 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Recent uploads</h3>
              <p className="text-xs text-muted-foreground">Newest files appear first.</p>
            </div>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
              {mediaLibraryItems.length} assets
            </span>
          </div>

          <MediaLibrary items={mediaLibraryItems} />
        </div>
      </section>

      <div className="grid gap-4 md:p-8">
        {HERO_CONFIGS.map((config) => {
          const h: any = heroMap.get(config.key) // may not contain all fields

          const backgroundImageUrl =
            h?.backgroundImageUrl ?? null
          const backgroundImageAlt =
            h?.backgroundImageAlt ?? null

          return (
            <HeroMediaForm
              key={config.key}
              heading={config.label}
              heroKey={config.key}
              initial={{
                title: h?.title ?? "",
                subtitle: h?.subtitle ?? "",
                // description / CTA not in schema yet; keep inputs blank-friendly
                description: h?.description ?? "",
                ctaLabel: h?.ctaLabel ?? "",
                ctaHref: h?.ctaHref ?? "",
                backgroundImageUrl,
                backgroundImageAlt,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
