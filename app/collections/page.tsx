// // export const runtime = 'edge';

import Image from "next/image"
import { SafeImage } from "@/components/ui/safe-image"
import Link from "next/link"
import { fetchCategoriesWithProducts, fetchPublishedProducts } from "@/lib/products"
import { formatCurrency } from "@/lib/currency"

export default async function CollectionsPage() {
  const [categories, products] = await Promise.all([
    fetchCategoriesWithProducts(),
    fetchPublishedProducts(),
  ])

  const spotlight = products.slice(0, 6)

  return (
    <div className="space-y-24 bg-white pb-24">
      {/* Hero Section with SVG and animation */}
      <section className="relative isolate left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-white">
        <div className="mx-auto max-w-[1600px] px-6 py-28 text-center text-amber-900 sm:py-36">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-700 animate-fade-in-down">
            Curated by our studio
          </p>
          <h1 className="mt-4 text-5xl font-bold tracking-tight drop-shadow-lg animate-fade-in-up sm:text-6xl">
            Signature Collections
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-amber-900/80 animate-fade-in-up delay-100">
            Explore heritage embroideries, contemporary silhouettes, and limited-edition colourways—handpicked for every season.
          </p>
        </div>
      </section>

      {/* Shop by Story - Glassmorphism Cards */}
      <section className="mx-auto max-w-[1600px] px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Shop by story</h2>
        <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/60 shadow-xl backdrop-blur-lg transition-all hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="absolute inset-0">
                <SafeImage
                  src={category.featuredImageUrl ?? "/placeholder.svg"}
                  alt={category.featuredImageAlt ?? category.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
              </div>
              <div className="relative flex h-64 flex-col justify-end space-y-3 p-7 text-white">
                <span className="absolute top-5 right-5 rounded-full bg-amber-600/80 px-4 py-1 text-xs font-semibold uppercase tracking-widest shadow-lg ring-2 ring-white/30">
                  {category.productCount} styles
                </span>
                <h3 className="text-2xl font-bold drop-shadow-lg">{category.name}</h3>
                {category.summary && (
                  <p className="text-base text-white/90 drop-shadow-md">{category.summary}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Studio Favourites - Premium Product Cards */}
      <section className="mx-auto max-w-[1600px] px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-2">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Studio favourites</h2>
          <Link href="/about" className="text-sm font-semibold text-amber-700 hover:text-amber-800 underline underline-offset-4">
            Learn about our craftsmanship
          </Link>
        </div>
        <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {spotlight.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/70 shadow-xl backdrop-blur-lg transition-all hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <SafeImage
                  src={product.featuredImageUrl ?? "/placeholder.svg"}
                  alt={product.featuredImageAlt ?? product.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                  priority
                />
                <span className="absolute top-4 left-4 rounded-full bg-white/80 px-4 py-1 text-xs font-bold text-amber-700 shadow ring-2 ring-amber-100">
                  {formatCurrency(product.price)}
                </span>
                <span className="absolute bottom-4 right-4 rounded-full bg-amber-700/90 px-3 py-1 text-xs font-semibold text-white shadow-lg ring-2 ring-white/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  Quick view
                </span>
              </div>
              <div className="space-y-2 p-7">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-700 font-semibold">
                  {product.categoryName ?? "Signature"}
                </p>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                  {product.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
