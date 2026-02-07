import type { NextConfig } from "next"

const ALLOWED_HOSTNAMES = [
  "images.unsplash.com",
  "res.cloudinary.com",
  "wobbly-swordfish.org",
  "images.pexels.com",
  "images.khybershawls.com",
  "uncomfortable-dress.info",
  "khybershawls.store",
  "pure-e-mail.com",
  // Add your R2 bucket domain here when configured
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: ALLOWED_HOSTNAMES.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // output: \"standalone\", // Removed as it creates symlinks incompatible with Cloudflare Pages
  async rewrites() {
    // Proxy /images/* to Cloudflare R2 bucket
    // This allows images to be accessed at khybershawls.store/images/...
    const r2PublicUrl = process.env.R2_PUBLIC_URL;

    if (r2PublicUrl) {
      return [
        {
          source: '/images/:path*',
          destination: `${r2PublicUrl}/:path*`,
        },
      ];
    }
    return [];
  },
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
    ]
  },
}

export default nextConfig
