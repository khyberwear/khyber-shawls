// export const runtime = 'edge';
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Calendar, User, ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import sanitizeHtml from 'sanitize-html'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
  })

  if (!post) {
    return {
      title: "Post Not Found | Khyber Shawls",
    }
  }

  return {
    title: `${post.title} | Khyber Shawls Journal`,
    description: post.excerpt || "Read more on the Khyber Shawls journal",
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
    include: { author: true },
  })

  if (!post) {
    notFound()
  }

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  // Get related posts (3 most recent, excluding current)
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      published: true,
      id: { not: post.id },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8">
        <Link href="/journal" className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 transition">
          <ArrowLeft className="w-4 h-4" />
          Back to Journal
        </Link>
      </div>

      {/* Featured Image */}
      {post.image && (
        <div className="relative h-96 rounded-2xl overflow-hidden mb-8 bg-gray-100">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article Header */}
      <article className="prose prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          {post.title}
        </h1>

        <div className="flex items-center gap-6 text-sm text-gray-600 mb-8 not-prose">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{dateFormatter.format(new Date(post.createdAt))}</span>
          </div>
          {post.author && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author.name || post.author.email}</span>
            </div>
          )}
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        <div
          className="prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-amber-700 hover:prose-a:text-amber-800 prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(post.content, {
              allowedTags: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre'],
              allowedAttributes: {
                'a': ['href', 'title'],
                'img': ['src', 'alt', 'title'],
                '*': ['class']
              }
            })
          }}
        />
      </article>

      {/* Share & Back */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-semibold transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to All Articles
        </Link>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/journal/${relatedPost.slug}`}
                className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                {relatedPost.image && (
                  <div className="relative h-40 overflow-hidden bg-gray-100">
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-amber-700 transition line-clamp-2 mb-2">
                    {relatedPost.title}
                  </h3>
                  {relatedPost.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter CTA */}
      <div className="mt-16 bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          Enjoy This Article?
        </h3>
        <p className="text-gray-700 mb-6">
          Subscribe to our newsletter for more inspiring stories and exclusive updates
        </p>
        <Link
          href="/#newsletter"
          className="inline-block bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-800 transition"
        >
          Subscribe to Newsletter
        </Link>
      </div>
    </main>
  )
}
