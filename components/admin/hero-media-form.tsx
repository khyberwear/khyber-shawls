"use client"

import { useActionState, useState } from "react"
import { upsertHeroMediaAction } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Link as LinkIcon, X, Layout, Type, AlignLeft, MousePointer2 } from "lucide-react"
import Image from "next/image"

type CategoryActionState = { ok: boolean; message: string; issues?: string[] }
const initialState: CategoryActionState = { ok: false, message: "" }

export type HeroMediaFormProps = {
  heading: string
  heroKey: string
  initial: {
    title: string
    subtitle: string
    description: string
    ctaLabel: string
    ctaHref: string
    backgroundImageUrl: string | null
    backgroundImageAlt: string | null
    backgroundImageId?: string | null
  }
}

export function HeroMediaForm({ heading, heroKey, initial }: HeroMediaFormProps) {
  const [state, formAction, isPending] = useActionState(upsertHeroMediaAction, initialState)
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(initial.backgroundImageUrl || "")

  const inputClasses = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#B3702B] focus:ring-2 focus:ring-[#B3702B]/20 transition-all placeholder:text-muted-foreground/50"

  return (
    <form action={formAction} className="space-y-6 rounded-3xl border border-white/10 bg-background/80 p-6 md:p-8 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B3702B]/10 text-[#B3702B]">
            <Layout className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{heading}</h3>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">ID: {heroKey}</p>
          </div>
        </div>
        <input type="hidden" name="heroKey" value={heroKey} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2" htmlFor={`${heroKey}-title`}>
            <Type className="h-3.5 w-3.5 text-muted-foreground" /> Headline
          </label>
          <input
            id={`${heroKey}-title`}
            name="title"
            defaultValue={initial.title}
            placeholder="Discover the art of Kashmiri craftsmanship"
            className={inputClasses}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2" htmlFor={`${heroKey}-subtitle`}>
            <AlignLeft className="h-3.5 w-3.5 text-muted-foreground" /> Subtitle
          </label>
          <input
            id={`${heroKey}-subtitle`}
            name="subtitle"
            defaultValue={initial.subtitle}
            placeholder="Each shawl tells a story"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2" htmlFor={`${heroKey}-description`}>
          <AlignLeft className="h-3.5 w-3.5 text-muted-foreground" /> Description
        </label>
        <textarea
          id={`${heroKey}-description`}
          name="description"
          defaultValue={initial.description}
          rows={3}
          placeholder="Share the story or value proposition for this banner."
          className={inputClasses}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2" htmlFor={`${heroKey}-cta-label`}>
            <MousePointer2 className="h-3.5 w-3.5 text-muted-foreground" /> Button Label
          </label>
          <input
            id={`${heroKey}-cta-label`}
            name="ctaLabel"
            defaultValue={initial.ctaLabel}
            placeholder="Explore collections"
            className={inputClasses}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2" htmlFor={`${heroKey}-cta-href`}>
            <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" /> Button Link
          </label>
          <input
            id={`${heroKey}-cta-href`}
            name="ctaHref"
            defaultValue={initial.ctaHref}
            placeholder="/shop"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2" htmlFor={`${heroKey}-background-url`}>
          <LinkIcon className="h-3.5 w-3.5 text-[#B3702B]" /> Background Image URL
        </label>
        <div className="flex gap-2">
          <input
            id={`${heroKey}-background-url`}
            name="backgroundImageUrl"
            value={backgroundImageUrl}
            onChange={(e) => setBackgroundImageUrl(e.target.value)}
            placeholder="https://example.com/banner.jpg"
            className={inputClasses}
          />
          {backgroundImageUrl && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setBackgroundImageUrl("")}
              className="shrink-0 border-white/10 hover:bg-red-500/10 hover:text-red-500 rounded-xl"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {backgroundImageUrl && (
          <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-white/10 mt-3 group">
            <Image
              src={backgroundImageUrl}
              alt="Preview"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setBackgroundImageUrl("")}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor={`${heroKey}-background-alt`}>
          Alt Text
        </label>
        <input
          id={`${heroKey}-background-alt`}
          name="backgroundImageAlt"
          defaultValue={initial.backgroundImageAlt ?? ""}
          placeholder="Describe the banner image"
          className={inputClasses}
        />
      </div>

      {state.message && (
        <div className={`rounded-xl border px-4 py-3 text-sm ${state.ok
            ? "border-green-500/30 bg-green-500/10 text-green-500"
            : "border-red-500/30 bg-red-500/10 text-red-500"
          }`}>
          {state.message}
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-r from-[#B3702B] to-[#8B5A2B] hover:shadow-lg hover:shadow-[#B3702B]/25 text-white border-0 transition-all active:scale-[0.98]"
      >
        {isPending ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving Changes...
          </>
        ) : (
          "Save Hero Banner"
        )}
      </Button>
    </form>
  )
}
