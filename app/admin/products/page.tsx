// // // // export const runtime = 'edge';
// app/admin/products/page.tsx
import Link from "next/link";
import { ProductListItem } from "@/components/admin/product-list-item";
import { fetchMediaLibrary } from "@/lib/media";
import { formatCurrency } from "@/lib/currency";
import prisma from "@/lib/prisma";
import {
  Package,
  Plus,
  AlertCircle,
  Search,
  Filter
} from "lucide-react";

type CategoryOption = { id: string; name: string };
type MediaOption = { id: string; url: string; alt: string | null };

type AdminProductRow = {
  id: string;
  title: string;
  description: string;
  details: string | null;
  careInstructions: string | null;
  price: number;
  priceLabel: string;
  inventory: number;
  categoryId: string;
  categoryName: string | null;
  published: boolean;
  featuredImageId: string | null;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  galleryMediaIds: string[];
  galleryImages: Array<{ url: string; alt: string | null }>;
};

const toStringOr = (v: unknown, fallback = ""): string =>
  typeof v === "string" ? v : v == null ? fallback : String(v);

export default async function AdminProductsPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-foreground mb-2">Database not configured</h1>
          <p className="text-muted-foreground">
            Add a valid <code className="px-2 py-1 bg-white/10 rounded">DATABASE_URL</code> to your environment and restart the server.
          </p>
        </div>
      </div>
    );
  }

  const [categories, products, mediaLibrary] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      include: {
        category: true,
        product_images: { orderBy: { position: "asc" } },
        tags: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    fetchMediaLibrary(),
  ]);

  const categoryOptions: CategoryOption[] = categories.map((c: { id: string; name: string }) => ({
    id: c.id,
    name: c.name,
  }));

  const mediaOptions: MediaOption[] = (mediaLibrary ?? [])
    .map((m: any) => ({
      id: toStringOr(m?.id ?? m?.url),
      url: toStringOr(m?.url),
      alt: m?.alt ?? null,
    }))
    .filter((m) => m.id && m.url);

  const productsForDisplay: AdminProductRow[] = products.map((p: any) => ({
    id: p.id,
    title: toStringOr(p.name),
    description: toStringOr(p.description, ""),
    details: p.details ?? null,
    careInstructions: p.careInstructions ?? null,
    price: Number(p.price),
    priceLabel: formatCurrency(p.price),
    inventory: 0,
    categoryId: toStringOr(p.categoryId ?? ""),
    categoryName: p.category?.name ?? null,
    published: !!p.inStock,
    featuredImageId: null,
    featuredImageUrl: p.image ?? null,
    featuredImageAlt: null,
    galleryMediaIds: [],
    galleryImages: p.product_images?.map((img: any) => ({
      url: img.url,
      alt: img.alt
    })) ?? [],
    tags: p.tags ? p.tags.map((t: any) => t.name) : [],
  }));

  const inStockCount = productsForDisplay.filter(p => p.published).length;
  const outOfStockCount = productsForDisplay.length - inStockCount;

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-background to-blue-600/5 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20 text-blue-500">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Products</h1>
              <p className="text-muted-foreground mt-1">
                Manage your product catalog, prices, and inventory
              </p>
            </div>
          </div>

          <Link
            href="/admin/products/add"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#B3702B] to-[#8B5A2B] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#B3702B]/25 hover:shadow-[#B3702B]/40 hover:scale-105 transition-all"
          >
            Add Product
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="relative mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/10 bg-background/50 p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total</p>
            <p className="text-2xl font-bold text-foreground mt-1">{productsForDisplay.length}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-background/50 p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">In Stock</p>
            <p className="text-2xl font-bold text-green-500 mt-1">{inStockCount}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-background/50 p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Out of Stock</p>
            <p className="text-2xl font-bold text-red-500 mt-1">{outOfStockCount}</p>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="rounded-2xl border border-white/10 bg-background/80 backdrop-blur-sm shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-lg font-semibold text-foreground">All Products</h2>
            <p className="text-sm text-muted-foreground">{productsForDisplay.length} items in catalog</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {productsForDisplay.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No products yet</h3>
              <p className="text-muted-foreground mb-6">Start by adding your first product to the catalog</p>
              <Link
                href="/admin/products/add"
                className="inline-flex items-center gap-2 rounded-lg bg-[#B3702B] px-4 py-2 text-sm font-medium text-white hover:bg-[#8B5A2B] transition-colors"
              >
                Add Your First Product
              </Link>
            </div>
          ) : (
            productsForDisplay.map((product) => (
              <ProductListItem
                key={product.id}
                product={product}
                categories={categoryOptions}
                mediaLibrary={mediaOptions}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
