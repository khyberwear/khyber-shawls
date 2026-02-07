// lib/products.ts
import { prisma } from "@/lib/prisma";
import { product_images } from "@prisma/client";

// Note: unstable_cache is not supported on Cloudflare Pages.
// D1 queries are fast enough without an application-level cache.

export type SerializedProduct = {
  id: string;
  title: string;
  description: string;
  details: string | null;
  careInstructions: string | null;
  price: number;
  slug: string;
  published: boolean;
  inStock: boolean;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  gallery: Array<{ id: string; url: string; alt: string | null; position: number }>;
  categoryName?: string | null;
  categorySlug?: string | null;
};

export type SerializedProductDetail = SerializedProduct & { inventory: number };

export type SerializedCategory = {
  id: string;
  name: string;
  slug: string;
  summary: string | null;
  productCount: number;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  intro: {
    title: string;
    description: string;
    image: { url: string; alt: string };
  } | null;
  sections: Array<{
    title: string;
    description: string;
    image: { url: string; alt: string };
  }>;
  uiConfig: {
    showFilters: boolean;
    gridColumns: { mobile: number; tablet: number; desktop: number };
  } | null;
};

// -------- Minimal local types to avoid stale @prisma/client ----------
type CategoryLite = {
  id: string;
  name: string;
  slug: string;
  summary: string | null;
  featuredImageUrl?: string | null;
  featuredImageAlt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  intro?: string | null;
  sections?: string | null;
  uiConfig?: string | null;
};

type ProductWithRelations = {
  id: string;
  name: string;
  slug: string;
  description: string;
  details?: string | null;
  careInstructions?: string | null;
  price: any;
  image: string;
  inStock: boolean;
  published: boolean;
  category?: Pick<CategoryLite, "name" | "slug"> | null;
  categoryId: string;
  product_images: product_images[];
};

type CategoryWithRelations = CategoryLite & {
  products?: Array<ProductWithRelations>;
};
// -------------------------------------------------------------------

function serializeProduct(product: ProductWithRelations): SerializedProduct {
  return {
    id: product.id,
    title: product.name,
    description: product.description,
    details: product.details ?? null,
    careInstructions: product.careInstructions ?? null,
    price: Number(product.price),
    slug: product.slug,
    published: product.published,
    inStock: product.inStock,
    featuredImageUrl: product.image || null,
    featuredImageAlt: product.name || null,
    gallery: product.product_images.map(img => ({ ...img, alt: img.alt ?? "" })),
    categoryName: product.category?.name ?? null,
    categorySlug: product.category?.slug ?? null,
  };
}

function serializeCategory(category: CategoryWithRelations): SerializedCategory {
  // Parse JSON fields safely
  let intro = null;
  let sections: Array<{ title: string; description: string; image: { url: string; alt: string } }> = [];
  let uiConfig = null;

  try {
    if (category.intro) {
      intro = JSON.parse(category.intro);
    }
  } catch (e) {
    console.error('Failed to parse category intro:', e);
  }

  try {
    if (category.sections) {
      sections = JSON.parse(category.sections);
    }
  } catch (e) {
    console.error('Failed to parse category sections:', e);
  }

  try {
    if (category.uiConfig) {
      uiConfig = JSON.parse(category.uiConfig);
    }
  } catch (e) {
    console.error('Failed to parse category uiConfig:', e);
  }

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    summary: category.summary ?? null,
    productCount: category.products?.length ?? 0,
    featuredImageUrl: (category as any).featuredImageUrl ?? null,
    featuredImageAlt: (category as any).featuredImageAlt ?? null,
    seoTitle: (category as any).seoTitle ?? null,
    seoDescription: (category as any).seoDescription ?? null,
    intro,
    sections,
    uiConfig,
  };
}

export async function fetchPublishedProducts() {
    const products = await prisma.product.findMany({
      where: { published: true, inStock: true },
      include: {
        category: true,
        product_images: true,
        tags: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return products.map(p => ({
      ...serializeProduct(p as unknown as ProductWithRelations),
      tags: (p as any).tags ? (p as any).tags.map((t: any) => t.name) : [],
    }));
}

export async function fetchProductsByCategorySlug(slug: string) {
    if (!slug) {
      return null;
    }

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { published: true },
          include: {
            category: true,
            product_images: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!category) return null;

    const serializedCategory = serializeCategory(category as unknown as CategoryWithRelations);
    const serializedProducts = (category.products as unknown as ProductWithRelations[]).map(p => serializeProduct(p));

    return {
      category: { ...serializedCategory, productCount: serializedProducts.length },
      products: serializedProducts,
    };
}

export async function fetchCategoriesWithProducts() {
    const categories = await prisma.category.findMany({
      include: {
        products: { where: { published: true } },
      },
      orderBy: { name: "asc" },
    });

    return (categories as unknown as CategoryWithRelations[]).map(serializeCategory);
}

export async function fetchAllCategories() {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: { name: "asc" },
    });

    return categories;
}

export async function fetchProductSummariesByIds(ids: string[]) {
  if (ids.length === 0) return [];

  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    include: {
      category: true,
      product_images: true,
    },
  });

  return (products as unknown as ProductWithRelations[]).map(serializeProduct);
}

export async function fetchProductBySlug(slug: string): Promise<SerializedProductDetail | null> {
    if (!slug) {
      return null;
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        product_images: true,
      },
    });

    if (!product) return null;

    // The `product_variants` table has an inventory count, but for now we return 0
    return { ...(serializeProduct(product as unknown as ProductWithRelations)), inventory: 0 };
}

export async function fetchRelatedProducts(categorySlug: string, currentProductId: string) {
    if (!categorySlug) return [];

    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      include: {
        products: {
          where: {
            published: true,
            id: { not: currentProductId },
          },
          take: 4,
          include: { product_images: true, category: true },
        },
      },
    });

    return (category?.products || []).map(p => ({
      id: p.id,
      title: p.name,
      slug: p.slug,
      price: Number(p.price),
      featuredImage: { url: p.image, alt: p.name },
    }));
}
);
