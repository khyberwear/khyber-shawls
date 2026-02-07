import Image from "next/image"
import Link from "next/link"
import { Search, Home, ShoppingBag, Phone, ArrowRight } from "lucide-react"

export const runtime = 'edge';

export default function NotFound() {
  const popularCategories = [
    { name: "Men Shawls", href: "/category/men-shawls", icon: "👔" },
    { name: "Women Shawls", href: "/category/women-shawls", icon: "👗" },
    { name: "Kids Shawls", href: "/category/kids-shawls", icon: "👶" },
  ]

  const helpfulLinks = [
    { name: "Shop All Products", href: "/shop", icon: ShoppingBag },
    { name: "Track Your Order", href: "/track-order", icon: Search },
    { name: "Contact Support", href: "/contact", icon: Phone },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-amber-50 px-4 py-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-amber-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-6xl">
        <div className="text-center mb-12">
          <div className="relative w-full max-w-lg mx-auto mb-8">
            <Image
              src="/hero-shawl.svg"
              alt="Lost in the shawls"
              width={340}
              height={340}
              className="mx-auto drop-shadow-2xl animate-float"
              priority
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span 
                className="text-[7rem] font-extrabold select-none bg-gradient-to-br from-amber-400 via-yellow-100 to-amber-700 bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(251,191,36,0.18)]" 
                style={{ WebkitTextStroke: '2px #fffbe6' }}
              >
                404
              </span>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-amber-900 drop-shadow-lg tracking-tight mb-6">
            Page Not Found
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-700 font-medium mb-4">
            Oops! The page you are looking for does not exist or has been moved.
          </p>
          <p className="text-lg text-gray-600">
            Let us get you back to something beautiful.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-500 px-8 py-4 text-lg font-bold text-white shadow-xl ring-2 ring-amber-200/40 hover:from-amber-800 hover:to-yellow-600 transition-all duration-200"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-amber-700 shadow-lg border-2 border-amber-700 hover:bg-amber-50 transition-all duration-200"
          >
            <ShoppingBag className="w-5 h-5" />
            Shop Now
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Explore Our Collections
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {popularCategories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="group flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-amber-500 hover:bg-amber-50 transition-all"
              >
                <span className="text-3xl">{category.icon}</span>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 group-hover:text-amber-700 transition">
                    {category.name}
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-amber-700 group-hover:translate-x-1 transition" />
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Need Help?
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {helpfulLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-3 p-6 rounded-lg bg-white hover:bg-amber-100 border border-amber-200 hover:border-amber-400 transition-all group"
              >
                <link.icon className="w-8 h-8 text-amber-700" />
                <span className="font-semibold text-gray-900 text-center group-hover:text-amber-700 transition">
                  {link.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Still cannot find what you are looking for?
          </p>
          <Link
            href="/contact"
            className="text-amber-700 hover:text-amber-800 font-semibold underline"
          >
            Contact our support team
          </Link>
        </div>
      </div>
    </div>
  )
}
