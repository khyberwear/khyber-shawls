"use client"

import { useState, useMemo } from "react"
import { SafeImage } from "@/components/ui/safe-image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, ShieldCheck, Truck } from "lucide-react"
import { useCart } from "@/components/providers/cart-provider"

type GalleryItem = {
  id: string
  url: string
  alt: string | null
}

type TrustSignal = {
  iconName: "truck" | "shield" | "check"
  title: string
  description: string
}

type ProductGalleryTabsProps = {
  productId: string
  mainImageUrl: string
  mainImageAlt: string
  galleryItems: GalleryItem[]
  productTitle: string
  productDescription: string | null
  productDetails: string | null
  careInstructions: string | null
  categoryName: string | null
  formattedPrice: string
  trustSignals: TrustSignal[]
  categorySlug: string | null
  slug: string
  inStock: boolean
}

const iconMap = {
  truck: Truck,
  shield: ShieldCheck,
  check: CheckCircle2,
}

export function ProductGalleryTabs({
  productId,
  mainImageUrl,
  mainImageAlt,
  galleryItems,
  productTitle,
  productDescription,
  productDetails,
  careInstructions,
  categoryName,
  formattedPrice,
  trustSignals,
  categorySlug,
  // slug is passed but used for SEO/structured data elsewhere
  inStock,
}: ProductGalleryTabsProps) {
  const [activeImage, setActiveImage] = useState(mainImageUrl)
  const [activeImageAlt, setActiveImageAlt] = useState(mainImageAlt)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"description" | "details" | "care">("description")
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const { addItem } = useCart()
  const router = useRouter()

  // Generate consistent review count based on product ID
  const reviewCount = useMemo(() => {
    const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return 50 + (hash % 201) // Returns number between 50 and 250
  }, [productId])

  const handleAddToCart = () => {
    setIsAdding(true)
    addItem(productId, quantity)
    setTimeout(() => setIsAdding(false), 1000)
  }

  const handleBuyNow = () => {
    addItem(productId, quantity)
    router.push('/cart')
  }

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const allImages = [
    { id: "main", url: mainImageUrl, alt: mainImageAlt },
    ...galleryItems, // Show all gallery images without limiting
  ]

  const handleImageChange = (url: string, alt: string) => {
    if (url === activeImage) return

    setIsImageLoading(true)
    setActiveImage(url)
    setActiveImageAlt(alt)

    // Reset loading state after transition
    setTimeout(() => setIsImageLoading(false), 300)
  }

  return (
    <>
      {/* Breadcrumb at the top - hide on mobile */}
      <nav className="hidden sm:flex mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-gray-900 transition">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gray-900 transition">Products</Link>
          {categorySlug && categoryName && (
            <>
              <span>/</span>
              <Link href={`/category/${categorySlug}`} className="hover:text-gray-900 transition">
                {categoryName}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900 font-medium">{productTitle}</span>
        </div>
      </nav>

      {/* Two-Column Layout: Gallery (60%) + Product Info (40%) */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-10">
        {/* Left side - Gallery (60%) */}
        <div className="w-full lg:w-[60%]">
          {/* Mobile: Horizontal scrolling thumbnails at bottom */}
          <div className="lg:hidden">
            {/* Main Image */}
            <div className="relative w-full overflow-hidden rounded-lg bg-gray-50 mb-3">
              <div className="relative w-full overflow-hidden rounded-lg bg-gray-50 mb-3">
                <SafeImage
                  src={activeImage}
                  alt={activeImageAlt}
                  width={800}
                  height={800}
                  sizes="100vw"
                  priority
                  className={`object-contain w-full h-auto transition-opacity duration-300 ease-in-out ${isImageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                  style={{ aspectRatio: "1/1" }}
                  onLoad={() => setIsImageLoading(false)}
                />
              </div>
            </div>

            {/* Thumbnails - Horizontal scroll */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleImageChange(item.url, item.alt ?? productTitle)}
                    className={`relative flex-shrink-0 w-16 h-16 overflow-hidden rounded-md bg-muted border transition-all duration-300 ease-in-out cursor-pointer ${activeImage === item.url
                      ? "border-orange-700 ring-2 ring-orange-700/40 scale-105"
                      : "border-gray-200 hover:border-orange-700/40 hover:scale-105"
                      }`}
                  >
                    <SafeImage
                      src={item.url}
                      alt={item.alt ?? productTitle}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop: Vertical thumbnails on left */}
          <div className="hidden lg:flex gap-4">
            {/* Thumbnails - Vertical on Left */}
            {allImages.length > 1 && (
              <div className="flex flex-col gap-3 w-20">
                {allImages.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleImageChange(item.url, item.alt ?? productTitle)}
                    className={`relative aspect-square w-full overflow-hidden rounded-md bg-muted border transition-all duration-300 ease-in-out cursor-pointer ${activeImage === item.url
                      ? "border-orange-700 ring-2 ring-orange-700/40 scale-105"
                      : "border-gray-200 hover:border-orange-700/40 hover:scale-105"
                      }`}
                  >
                    <SafeImage
                      src={item.url}
                      alt={item.alt ?? productTitle}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1">
              <div className="relative w-full overflow-hidden rounded-md bg-gray-50">
                <SafeImage
                  src={activeImage}
                  alt={activeImageAlt}
                  width={800}
                  height={800}
                  sizes="60vw"
                  priority
                  className={`object-contain w-full h-auto transition-opacity duration-300 ease-in-out ${isImageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                  style={{ aspectRatio: "1/1" }}
                  onLoad={() => setIsImageLoading(false)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Product Info (40%) */}

        <div className="w-full lg:w-[40%] bg-white p-4 sm:p-6 lg:p-8 rounded-md shadow-sm border border-gray-100">
          {/* Stock Badge */}
          <div className="mb-3">
            {inStock ? (
              <span className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-green-100 text-green-800">
                ✓ In Stock - Ships within 2-4 days
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-red-100 text-red-800">
                Out of Stock - Contact us for availability
              </span>
            )}
          </div>

          {/* Star Rating and Review Count */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              <span className="text-amber-600 text-base sm:text-lg">★</span>
              <span className="text-amber-600 text-base sm:text-lg">★</span>
              <span className="text-amber-600 text-base sm:text-lg">★</span>
              <span className="text-amber-600 text-base sm:text-lg">★</span>
              <span className="text-amber-600 text-base sm:text-lg">★</span>
            </div>
            <span className="text-xs sm:text-sm text-gray-600">({reviewCount} reviews)</span>
          </div>

          <p className="text-[10px] sm:text-xs uppercase tracking-widest text-orange-700 mb-2">
            {categoryName ?? "Signature Collection"}
          </p>


          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">
            {productTitle}
          </h1>
          <p className="text-2xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
            {formattedPrice}
          </p>

          {/* Quantity Selector */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center gap-3 w-28 sm:w-32">
              <button
                onClick={decreaseQuantity}
                className="w-9 h-9 sm:w-8 sm:h-8 rounded border border-gray-300 hover:border-orange-700 hover:bg-orange-50 transition flex items-center justify-center font-semibold text-gray-700 text-lg sm:text-base"
              >
                −
              </button>
              <span className="flex-1 text-center font-semibold text-gray-900 text-base sm:text-base">{quantity}</span>
              <button
                onClick={increaseQuantity}
                className="w-9 h-9 sm:w-8 sm:h-8 rounded border border-gray-300 hover:border-orange-700 hover:bg-orange-50 transition flex items-center justify-center font-semibold text-gray-700 text-lg sm:text-base"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons - stacked on mobile, row on desktop */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 mb-4 sm:mb-6">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full sm:flex-1 bg-orange-700 text-white py-3 sm:py-2.5 px-4 rounded-md font-semibold text-base sm:text-sm hover:bg-orange-800 transition disabled:opacity-50"
            >
              {isAdding ? "✓ Added!" : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full sm:flex-1 border-2 border-orange-700 text-orange-700 py-3 sm:py-2.5 px-4 rounded-md font-semibold text-base sm:text-sm hover:bg-orange-50 transition"
            >
              Buy Now
            </button>
          </div>

          <ul className="space-y-2.5 sm:space-y-3 text-sm text-gray-600">
            {trustSignals.map(({ iconName, title, description }) => {
              const Icon = iconMap[iconName]
              return (
                <li key={title} className="flex items-start gap-2.5 sm:gap-3">
                  <Icon className="w-5 h-5 text-orange-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{title}</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Full-Width Description Tabs Below */}
      <div className="mt-6 sm:mt-10 border-t border-gray-200 pt-6 sm:pt-8">
        {/* Tab Headers - smaller text on mobile */}
        <div className="flex gap-4 sm:gap-8 border-b border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-2 sm:pb-3 border-b-2 transition whitespace-nowrap ${activeTab === "description"
              ? "border-orange-700 text-orange-700"
              : "border-transparent hover:text-gray-900"
              }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`pb-2 sm:pb-3 border-b-2 transition whitespace-nowrap ${activeTab === "details"
              ? "border-orange-700 text-orange-700"
              : "border-transparent hover:text-gray-900"
              }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("care")}
            className={`pb-2 sm:pb-3 border-b-2 transition whitespace-nowrap ${activeTab === "care"
              ? "border-orange-700 text-orange-700"
              : "border-transparent hover:text-gray-900"
              }`}
          >
            Care
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4 sm:mt-6 text-gray-700">
          {activeTab === "description" && (
            <div className="space-y-2 sm:space-y-3 max-w-4xl">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Product Description</h3>
              <div
                className="text-sm sm:text-base leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: productDescription || "This premium handmade shawl is crafted with care and attention to detail. Each piece represents the finest tradition of Kashmiri craftsmanship, combining heritage techniques with contemporary design sensibilities."
                }}
              />
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-2 sm:space-y-3 max-w-4xl">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Product Details</h3>
              {productDetails ? (
                <div
                  className="text-sm sm:text-base leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: productDetails }}
                />
              ) : (
                <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                  <li>• <strong>Material:</strong> Handcrafted with premium pashmina wool</li>
                  <li>• <strong>Dyes:</strong> Natural dyes sourced from organic materials</li>
                  <li>• <strong>Edition:</strong> Limited edition design</li>
                  <li>• <strong>Origin:</strong> Handwoven by artisan cooperatives</li>
                  <li>• <strong>Certification:</strong> Includes authenticity certificate</li>
                  <li>• <strong>Dimensions:</strong> Generous drape suitable for all occasions</li>
                </ul>
              )}
            </div>
          )}

          {activeTab === "care" && (
            <div className="space-y-2 sm:space-y-3 max-w-4xl">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Care Instructions</h3>
              {careInstructions ? (
                <div
                  className="text-sm sm:text-base leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: careInstructions }}
                />
              ) : (
                <>
                  <p className="text-sm sm:text-base leading-relaxed mb-2 sm:mb-3">
                    To maintain the beauty and longevity of your handmade shawl, please follow these care guidelines:
                  </p>
                  <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                    <li>• <strong>Cleaning:</strong> Dry clean only for best results</li>
                    <li>• <strong>Storage:</strong> Store folded in a breathable cotton bag</li>
                    <li>• <strong>Light:</strong> Avoid direct sunlight when storing to prevent fading</li>
                    <li>• <strong>Protection:</strong> Use cedar sachets to prevent moths</li>
                    <li>• <strong>Wrinkles:</strong> Steam gently to remove creases (never iron directly)</li>
                    <li>• <strong>Handling:</strong> Remove jewelry before wearing to avoid snags</li>
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
