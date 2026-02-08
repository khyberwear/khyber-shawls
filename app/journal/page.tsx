// // // export const runtime = 'edge';
import Link from "next/link"
import Image from "next/image"
import { Calendar, User, ArrowRight } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const metadata = {
  title: "Journal | Khyber Shawls",
  description: "Discover artisan stories, styling guides, and the rich heritage behind our handcrafted shawls.",
}

export default async function JournalPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  })

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8">
        <Link href="/" className="text-sm text-amber-700 hover:text-amber-800 transition">
          ← Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Journal</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the stories behind our craft, meet the artisans, and explore the rich heritage 
          of Khyber shawl-making traditions
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Coming Soon
            </h2>
            <p className="text-gray-600 mb-6">
              We're working on bringing you inspiring stories and insights from our artisan community. 
              Check back soon!
            </p>
            <Link
              href="/shop"
              className="inline-block bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-800 transition"
            >
              Explore Our Products
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Featured Post (First Post) */}
          {posts[0] && (
            <div className="mb-16">
              <Link href={`/journal/${posts[0].slug}`} className="group">
                <div className="grid md:grid-cols-2 gap-8 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl overflow-hidden border border-amber-200 hover:shadow-xl transition-all duration-300">
                  {posts[0].image && (
                    <div className="relative h-80 md:h-auto overflow-hidden">
                      <Image
                        src={posts[0].image}
                        alt={posts[0].title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className={`p-8 flex flex-col justify-center ${!posts[0].image ? 'md:col-span-2' : ''}`}>
                    <div className="inline-block mb-4">
                      <span className="bg-amber-700 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Featured
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 group-hover:text-amber-900 transition">
                      {posts[0].title}
                    </h2>
                    {posts[0].excerpt && (
                      <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                        {posts[0].excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{dateFormatter.format(new Date(posts[0].createdAt))}</span>
                      </div>
                      {posts[0].author && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{posts[0].author.name || posts[0].author.email}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-amber-700 font-semibold group-hover:gap-3 transition-all">
                      <span>Read More</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Other Posts Grid */}
          {posts.length > 1 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(1).map((post) => (
                <Link
                  key={post.id}
                  href={`/journal/${post.slug}`}
                  className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {post.image && (
                    <div className="relative h-56 overflow-hidden bg-gray-100">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-700 transition line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{dateFormatter.format(new Date(post.createdAt))}</span>
                      </div>
                      {post.author && (
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          <span>{post.author.name || "Staff"}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm group-hover:gap-3 transition-all">
                      <span>Read Article</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* Newsletter CTA */}
      <div className="mt-16 bg-gradient-to-r from-amber-700 to-amber-800 rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Stay Inspired</h2>
        <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
          Subscribe to our newsletter and be the first to read our latest stories, styling tips, 
          and exclusive offers
        </p>
        <Link
          href="/#newsletter"
          className="inline-block bg-white text-amber-700 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition"
        >
          Subscribe Now
        </Link>
      </div>
    </main>
  )
}

