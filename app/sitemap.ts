import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://khybershawls.store'

  // Static pages
  const staticPages = [
    '',
    '/shop',
    '/about',
    '/contact',
    '/cart',
    '/checkout',
    '/collections',
    '/faq',
    '/track-order',
    '/journal',
    '/policies/shipping',
    '/policies/returns',
    '/policies/privacy',
    '/policies/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  try {
    // Get all published products with timeout
    const products = await Promise.race([
      prisma.product.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
        take: 1000, // Limit to prevent huge sitemaps
      }),
      new Promise<[]>((_, reject) => 
        setTimeout(() => reject(new Error('Products query timeout')), 5000)
      )
    ]).catch(() => [])

    const productPages = (products as any[]).map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    // Get all categories with timeout
    const categories = await Promise.race([
      prisma.category.findMany({
        select: { slug: true, updatedAt: true },
      }),
      new Promise<[]>((_, reject) => 
        setTimeout(() => reject(new Error('Categories query timeout')), 5000)
      )
    ]).catch(() => [])

    const categoryPages = (categories as any[]).map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Get all published blog posts with timeout
    const posts = await Promise.race([
      prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
        take: 500, // Limit blog posts
      }),
      new Promise<[]>((_, reject) => 
        setTimeout(() => reject(new Error('Posts query timeout')), 5000)
      )
    ]).catch(() => [])

    const blogPages = (posts as any[]).map((post) => ({
      url: `${baseUrl}/journal/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    return [...staticPages, ...productPages, ...categoryPages, ...blogPages]
  } catch (error) {
    console.error('Sitemap generation error:', error)
    // Return at least static pages if database fails
    return staticPages
  }
}
