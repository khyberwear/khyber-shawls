import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/khyberopen/',
          '/khybercreate/',
        ],
      },
    ],
    sitemap: 'https://khybershawls.store/sitemap.xml',
  }
}
