// // // // export const runtime = 'edge';
// app/admin/media/page.tsx
import { HeroMediaForm } from "@/components/admin/hero-media-form"
import { HERO_CONFIGS, fetchAllHeroContent } from "@/lib/hero"
import { Images, Link as LinkIcon, Globe } from "lucide-react"

export default async function AdminMediaPage() {
  const heroes = await fetchAllHeroContent()
  const heroMap = new Map<string, any>(heroes.map((h: any) => [h.key, h]))

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/10 via-background to-pink-600/5 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-pink-500/20 text-pink-500">
              <Images className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Media & Banners</h1>
              <p className="text-muted-foreground mt-1">
                Manage hero banners and homepage content with URL-based media
              </p>
            </div>
          </div>

          {/* Info Badge */}
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-background/50 px-4 py-2">
            <Globe className="w-4 h-4 text-pink-500" />
            <span className="text-sm text-muted-foreground">Using URL-based media</span>
          </div>
        </div>
      </div>

      {/* URL Media Info */}
      <div className="rounded-2xl border border-[#B3702B]/20 bg-[#B3702B]/5 p-6">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#B3702B]/20 text-[#B3702B]">
            <LinkIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">URL-Based Media</h3>
            <p className="text-sm text-muted-foreground mt-1">
              All media uses external URLs. Simply paste image URLs from your hosting service, CDN, or any public image link.
              No file uploads required - just provide the direct URL to your images.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Banners */}
      <div className="rounded-2xl border border-white/10 bg-background/80 backdrop-blur-sm shadow-lg overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-foreground">Hero Banners</h2>
          <p className="text-sm text-muted-foreground">Configure up to {HERO_CONFIGS.length} rotating homepage banners</p>
        </div>

        <div className="p-6 space-y-6">
          {HERO_CONFIGS.map((config, index) => {
            const h: any = heroMap.get(config.key)

            return (
              <div
                key={config.key}
                className="rounded-xl border border-white/10 bg-white/5 p-6 hover:border-[#B3702B]/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#B3702B]/20 text-[#B3702B] text-sm font-bold">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">{config.label}</h3>
                </div>

                <HeroMediaForm
                  heading={config.label}
                  heroKey={config.key}
                  initial={{
                    title: h?.title ?? "",
                    subtitle: h?.subtitle ?? "",
                    description: h?.description ?? "",
                    ctaLabel: h?.ctaLabel ?? "",
                    ctaHref: h?.ctaHref ?? "",
                    backgroundImageUrl: h?.backgroundImageUrl ?? null,
                    backgroundImageAlt: h?.backgroundImageAlt ?? null,
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
