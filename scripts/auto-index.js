#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client')
require('dotenv').config()
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`,
    },
  },
})
const fetchFn = typeof globalThis.fetch === 'function' ? (...args) => globalThis.fetch(...args) : null

const DEFAULT_BASE_URL = 'https://khybershawls.store'
const STATIC_ROUTES = [
  '/',
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
]

function getBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL
  try {
    const url = new URL(raw)
    return url
  } catch (error) {
    console.warn(`Invalid NEXT_PUBLIC_BASE_URL (\"${raw}\"), falling back to ${DEFAULT_BASE_URL}`)
    return new URL(DEFAULT_BASE_URL)
  }
}

async function fetchDynamicRoutes(baseUrl) {
  const urls = new Set()
  const staticHost = baseUrl.origin

  const safeQuery = async (cb, label) => {
    try {
      return await cb()
    } catch (error) {
      console.warn(`Skipping ${label} URLs. Reason:`, error.message)
      return []
    }
  }

  const products = await safeQuery(
    () =>
      prisma.product.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
        take: 1000,
      }),
    'product'
  )

  products.forEach((product) => {
    urls.add(`${staticHost}/products/${product.slug}`)
  })

  const categories = await safeQuery(
    () => prisma.category.findMany({ select: { slug: true }, take: 500 }),
    'category'
  )

  categories.forEach((category) => {
    urls.add(`${staticHost}/category/${category.slug}`)
  })

  const posts = await safeQuery(
    () =>
      prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true },
        take: 500,
      }),
    'blog'
  )

  posts.forEach((post) => {
    urls.add(`${staticHost}/journal/${post.slug}`)
  })

  return Array.from(urls)
}

async function collectAllUrls(baseUrl) {
  const urls = new Set()
  const origin = baseUrl.origin.replace(/\/$/, '')
  STATIC_ROUTES.forEach((route) => {
    urls.add(`${origin}${route}`)
  })

  const dynamicUrls = await fetchDynamicRoutes(baseUrl)
  dynamicUrls.forEach((url) => urls.add(url))

  return Array.from(urls)
}

function chunk(array, size = 100) {
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

function ensureIndexNowKey(baseUrl, key) {
  const publicDir = path.join(process.cwd(), 'public')
  const keyFilePath = path.join(publicDir, `${key}.txt`)
  try {
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }
    if (!fs.existsSync(keyFilePath)) {
      fs.writeFileSync(keyFilePath, key, 'utf8')
      console.log(`Created IndexNow key file at public/${key}.txt`)
    }
  } catch (error) {
    console.warn('Failed to write IndexNow key file:', error.message)
  }

  return `${baseUrl.origin}/${key}.txt`
}

async function notifyIndexNow(baseUrl, urls) {
  if (!fetchFn) {
    console.warn('Fetch API unavailable in this Node version. Skipping IndexNow submission.')
    return
  }
  const key = process.env.INDEXNOW_KEY
  if (!key) {
    console.log('INDEXNOW_KEY not set. Skipping IndexNow submission.')
    return
  }

  const keyLocation = ensureIndexNowKey(baseUrl, key)
  const payloadTemplate = {
    host: baseUrl.host,
    key,
    keyLocation,
  }

  const urlChunks = chunk(urls, 100)
  for (const urlList of urlChunks) {
    const payload = { ...payloadTemplate, urlList }
    try {
      const response = await fetchFn('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        console.warn('IndexNow submission failed:', response.status, response.statusText)
      } else {
        console.log(`Indexed ${urlList.length} URLs via IndexNow`)
      }
    } catch (error) {
      console.warn('IndexNow request error:', error.message)
    }
  }
}

async function main() {
  const baseUrl = getBaseUrl()
  try {
    const urls = await collectAllUrls(baseUrl)
    if (!urls.length) {
      console.warn('No URLs collected for indexing. Skipping notifications.')
      return
    }

    await notifyIndexNow(baseUrl, urls)
  } catch (error) {
    console.warn('Auto-index script encountered an error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
