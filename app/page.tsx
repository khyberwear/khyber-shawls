// // // // export const runtime = 'edge';
// app/page.tsx
import Image from "next/image"
import { SafeImage } from "@/components/ui/safe-image"
import Link from "next/link"

import { HeroCarousel } from "@/components/hero-carousel"
import { fetchAllHeroContent } from "@/lib/hero"
import { fetchCategoriesWithProducts, fetchPublishedProducts } from "@/lib/products"
import { formatCurrency } from "@/lib/currency";
import { FromTheJournal } from "@/components/from-the-journal";
import { fetchLatestPosts, SerializedPost } from "@/lib/journal";
import { Testimonials } from "@/components/testimonials";
import { ProductCard } from "@/components/product-card";

export const revalidate = 1800; // Revalidate every 30 minutes (ISR)

export default async function HomePage() {
  const [heroSlides, products, categories] = await Promise.all([
    fetchAllHeroContent(),
    fetchPublishedProducts(),
    fetchCategoriesWithProducts(),
  ]);

  // Featured, Men, Women, Kids logic
  const featuredProducts = products.filter((p) => (p as any).featured === true);
  // Shawls with the 'Featured' tag
  const tagFeaturedProducts = products.filter((p) => Array.isArray((p as any).tags) && (p as any).tags.includes('Featured'));

  const khaddarCategory = categories.find((c) => c.slug.toLowerCase().includes("khaddar"));
  const menCategory = categories.find((c) => c.slug.toLowerCase().includes("men"));
  const womenCategory = categories.find((c) => c.slug.toLowerCase().includes("women"));
  const kidsCategory = categories.find((c) => c.slug.toLowerCase().includes("kid"));

  const khaddarProducts = khaddarCategory ? products.filter((p) => p.categorySlug === khaddarCategory.slug) : [];
  const menProducts = menCategory ? products.filter((p) => p.categorySlug === menCategory.slug) : [];
  const womenProducts = womenCategory ? products.filter((p) => p.categorySlug === womenCategory.slug) : [];
  const kidsProducts = kidsCategory ? products.filter((p) => p.categorySlug === kidsCategory.slug) : [];
  const newArrivals = products.slice(0, 6);


  return (
    <div className="bg-white -mt-8">
      {/* ======================= HERO ======================= */}
      <HeroCarousel slides={heroSlides} fallbackImage="/hero/khyber-hero.jpg" />

      {/* ======================= FEATURED PRODUCTS ======================= */}
      {featuredProducts.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-0 sm:px-4 md:px-6 py-8 md:py-12 lg:py-16">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-800">Featured Shawls</h2>
            <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-700 font-medium px-4">"Hand-selected creations woven from pure heritage and luxury."</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
            {featuredProducts.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-6 md:mt-10 flex justify-center">
            <Link href="/products" className="px-6 md:px-8 py-2 md:py-3 rounded-full bg-amber-700 text-white font-bold text-sm md:text-base lg:text-lg hover:bg-amber-100 hover:text-amber-900 transition">View All Shawls</Link>
          </div>
        </section>
      )}

      {/* ======================= SHOP BY CATEGORY (3 Main Blocks) ======================= */}
      <section className="mx-auto max-w-[1600px] px-0 sm:px-4 md:px-6 py-8 md:py-12 lg:py-16 grid grid-cols-2 gap-1 sm:gap-3 md:gap-6 lg:gap-8">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/category/${cat.slug}`} className="relative group rounded-2xl md:rounded-3xl overflow-hidden min-h-[180px] sm:min-h-[200px] md:min-h-[220px] flex flex-col justify-end shadow-lg">
            <div className="absolute inset-0 w-full h-full">
              <SafeImage src={cat.featuredImageUrl ?? "/placeholder.svg"} alt={cat.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition" />
            </div>
            <div className="relative z-10 p-4 sm:p-5 md:p-6 flex flex-col items-start">
              <h3 className="text-xl sm:text-xl md:text-2xl font-bold text-white mb-1 md:mb-2 drop-shadow-lg">{cat.name}</h3>
              <p className="text-xs sm:text-sm md:text-base text-white/90 mb-3 md:mb-4 drop-shadow">Explore our collection</p>
              <span className="px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-2 rounded-full bg-amber-700 text-white font-semibold text-sm md:text-base lg:text-lg shadow mt-1 md:mt-2">Shop Now</span>
            </div>
          </Link>
        ))}
      </section>

      {/* ======================= FEATURED TAG SHAWLS ======================= */}
      {tagFeaturedProducts.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-0 sm:px-4 md:px-6 py-8 md:py-12 lg:py-16">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-800">Featured Products</h2>
            <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-700 font-medium">"Best"</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {tagFeaturedProducts.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ======================= MEN SHAWLS ======================= */}
      {menCategory && menProducts.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-0 sm:px-4 md:px-6 py-8 md:py-12 lg:py-16">
          <div className="flex items-end justify-between gap-2 sm:gap-4 mb-6 md:mb-8 px-1">
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-amber-700">For Him</p>
              <h2 className="mt-1 sm:mt-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900">Men's Shawls</h2>
            </div>
            <Link href={`/category/${menCategory.slug}`} className="text-xs sm:text-sm font-medium text-amber-700 hover:text-amber-800 whitespace-nowrap">
              Explore â†’
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {menProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-6 md:mt-10 flex justify-center">
            <Link href={`/category/${menCategory.slug}`} className="px-6 md:px-8 py-2 md:py-3 rounded-full bg-amber-700 text-white font-bold text-sm md:text-base hover:bg-amber-100 hover:text-amber-900 transition">View All Men's Shawls</Link>
          </div>
        </section>
      )}

      {/* ======================= PROMO BANNER ======================= */}
      {(() => {
        const promoSlide = heroSlides.find(s => s.key === "promo");
        const bannerSrc = promoSlide?.backgroundImageUrl || "/uploads/default-banner.jpg";

        return (
          <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] my-8 md:my-12">
            <div className="relative w-full aspect-[21/9] sm:aspect-[21/7] md:aspect-[21/5] overflow-hidden">
              <SafeImage
                src={bannerSrc}
                alt={promoSlide?.backgroundImageAlt || "Promotional Banner"}
                fill
                className="object-cover"
                priority
              />
            </div>
          </section>
        );
      })()}

      {/* ======================= WOMEN SHAWLS ======================= */}
      {womenCategory && womenProducts.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-0 sm:px-4 md:px-6 py-8 md:py-12 lg:py-16">
          <div className="flex items-end justify-between gap-2 sm:gap-4 mb-6 md:mb-8 px-1">
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-amber-700">For Her</p>
              <h2 className="mt-1 sm:mt-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900">Women's Shawls</h2>
            </div>
            <Link href={`/category/${womenCategory.slug}`} className="text-xs sm:text-sm font-medium text-amber-700 hover:text-amber-800 whitespace-nowrap">
              Explore â†’
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
            {womenProducts.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-6 md:mt-10 flex justify-center">
            <Link href={`/category/${womenCategory.slug}`} className="px-6 md:px-8 py-2 md:py-3 rounded-full bg-amber-700 text-white font-bold text-sm md:text-base hover:bg-amber-100 hover:text-amber-900 transition">View All Women's Shawls</Link>
          </div>
        </section>
      )}

      {/* ======================= CHARSADDA KHADDAR ======================= */}
      {khaddarCategory && khaddarProducts.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-0 sm:px-4 md:px-6 py-8 md:py-12 lg:py-16">
          <div className="flex items-end justify-between gap-2 sm:gap-4 mb-6 md:mb-8 px-1">
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-amber-700">Premium Handloom</p>
              <h2 className="mt-1 sm:mt-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900">Charsadda Khaddar</h2>
            </div>
            <Link href={`/category/${khaddarCategory.slug}`} className="text-xs sm:text-sm font-medium text-amber-700 hover:text-amber-800 whitespace-nowrap">
              Explore â†’
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
            {khaddarProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-6 md:mt-10 flex justify-center">
            <Link href={`/category/${khaddarCategory.slug}`} className="px-6 md:px-8 py-2 md:py-3 rounded-full bg-amber-700 text-white font-bold text-sm md:text-base hover:bg-amber-100 hover:text-amber-900 transition">View All Khaddar</Link>
          </div>
        </section>
      )}

      {/* ======================= KIDS SHAWLS ======================= */}
      {kidsCategory && kidsProducts.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-0 sm:px-4 md:px-6 py-8 md:py-12 lg:py-16">
          <div className="flex items-end justify-between gap-2 sm:gap-4 mb-6 md:mb-8 px-1">
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-amber-700">For Kids</p>
              <h2 className="mt-1 sm:mt-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900">Kids' Shawls</h2>
            </div>
            <Link href={`/category/${kidsCategory.slug}`} className="text-xs sm:text-sm font-medium text-amber-700 hover:text-amber-800 whitespace-nowrap">
              Explore â†’
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {kidsProducts.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-6 md:mt-10 flex justify-center">
            <Link href={`/category/${kidsCategory.slug}`} className="px-6 md:px-8 py-2 md:py-3 rounded-full bg-amber-700 text-white font-bold text-sm md:text-base hover:bg-amber-100 hover:text-amber-900 transition">View All Kids' Shawls</Link>
          </div>
        </section>
      )}

      {/* ======================= WHY KHYBER SHAWLS (Trust & Craft) ======================= */}
      <section className="bg-gradient-to-b from-amber-50 via-[#f4ede3] to-amber-50 py-10 sm:py-14 md:py-20">
        <div className="mx-auto max-w-4xl text-center mb-8 sm:mb-10 md:mb-12 px-4">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-amber-700 mb-3 md:mb-4 font-semibold">Heritage Meets Excellence</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
            Where Tradition Meets <span className="text-amber-700">Timeless Elegance</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            For generations, master artisans in Peshawar have crafted each Khyber Shawl with unmatched precision and care.
            Every thread tells a story of heritage, warmth, and authentic Pakistani craftsmanship that families trust.
          </p>
        </div>

        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow border border-amber-100">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-700 to-amber-600 flex items-center justify-center mb-4 sm:mb-5">
                <span className="text-3xl sm:text-4xl">âœ¨</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">100% Pure Wool</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Premium quality wool sourced ethically, ensuring unmatched softness, warmth, and durability in every piece.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow border border-amber-100">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-700 to-amber-600 flex items-center justify-center mb-4 sm:mb-5">
                <span className="text-3xl sm:text-4xl">ðŸ§µ</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Master Craftsmanship</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Handwoven by skilled artisans using techniques passed down through generations, creating timeless masterpieces.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow border border-amber-100">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-700 to-amber-600 flex items-center justify-center mb-4 sm:mb-5">
                <span className="text-3xl sm:text-4xl">ðŸšš</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Delivered Nationwide</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Fast, secure shipping to every corner of Pakistan. Your heritage shawl arrives safely at your doorstep.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Link
              href="/shop"
              className="group px-8 sm:px-10 py-3 sm:py-4 rounded-full bg-gradient-to-r from-amber-700 to-amber-600 text-white font-bold text-base sm:text-lg md:text-xl shadow-lg hover:shadow-xl hover:from-amber-800 hover:to-amber-700 transition-all transform hover:scale-105 inline-flex items-center gap-2"
            >
              Discover Our Collection
              <span className="group-hover:translate-x-1 transition-transform">â†’</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ======================= CUSTOMER REVIEWS / SOCIAL PROOF ======================= */}
      <section className="mx-auto max-w-[1000px] px-2.5 sm:px-4 md:px-6 py-10 sm:py-14 md:py-20">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-800 mb-3">What Our Customers Say</h2>
          <p className="text-sm sm:text-base text-gray-600">Real experiences from our valued customers</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Review 1 */}
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg sm:rounded-xl border-l-4 border-amber-700 p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex gap-1 mb-3 text-amber-600">
              {Array(5).fill(0).map((_, i) => <span key={i} className="text-lg sm:text-xl">â˜…</span>)}
            </div>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4 italic">
              "The softest shawl I've ever owned â€” worth every rupee. The craftsmanship is exceptional!"
            </p>
            <div className="flex items-center gap-2 pt-3 border-t border-amber-200">
              <div className="w-10 h-10 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">Aisha</p>
                <p className="text-xs sm:text-sm text-gray-600">Lahore</p>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg sm:rounded-xl border-l-4 border-amber-700 p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex gap-1 mb-3 text-amber-600">
              {Array(5).fill(0).map((_, i) => <span key={i} className="text-lg sm:text-xl">â˜…</span>)}
            </div>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4 italic">
              "Incredible quality and fast delivery. My family loves them! Highly recommend to everyone."
            </p>
            <div className="flex items-center gap-2 pt-3 border-t border-amber-200">
              <div className="w-10 h-10 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold">
                D
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">David</p>
                <p className="text-xs sm:text-sm text-gray-600">Islamabad</p>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg sm:rounded-xl border-l-4 border-amber-700 p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex gap-1 mb-3 text-amber-600">
              {Array(5).fill(0).map((_, i) => <span key={i} className="text-lg sm:text-xl">â˜…</span>)}
            </div>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-4 italic">
              "Beautifully made, soft, and so warm. The attention to detail is remarkable. Love it!"
            </p>
            <div className="flex items-center gap-2 pt-3 border-t border-amber-200">
              <div className="w-10 h-10 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold">
                F
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">Fatima</p>
                <p className="text-xs sm:text-sm text-gray-600">Karachi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= FINAL CALL TO ACTION ======================= */}
      <section className="relative py-12 sm:py-16 md:py-20 flex flex-col items-center justify-center bg-[url('/uploads/1761561828519-1.avif')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-5 md:mb-6 drop-shadow-lg">Wrap Yourself in Heritage Today</h2>
          <Link href="/products" className="inline-block px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-full bg-amber-700 text-white font-bold text-base sm:text-lg md:text-xl lg:text-2xl hover:bg-amber-100 hover:text-amber-900 transition">Shop Now â†’</Link>
        </div>
      </section>
    </div>
  )
}


