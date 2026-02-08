// // // // export const runtime = 'edge';
// app/admin/products/page.tsx
import { ProductForm } from "@/components/admin/product-form";
import { ProductListItem } from "@/components/admin/product-list-item";
import { fetchMediaLibrary } from "@/lib/media";
import { formatCurrency } from "@/lib/currency";
import prisma from "@/lib/prisma"; // âœ… default import (singleton)



type CategoryOption = { id: string; name: string };
type MediaOption = { id: string; url: string; alt: string | null };

// Match (or be compatible with) what ProductListItem expects.
// Key change: `description` is now always a string.
type AdminProductRow = {
  id: string;
  title: string;
  description: string; // âœ… coerced to string
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

// Helpers
const toStringOr = (v: unknown, fallback = ""): string =>
  typeof v === "string" ? v : v == null ? fallback : String(v);

export default async function AdminProductsPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <div className="overflow-hidden rounded-4xl border border-primary/20 bg-gradient-to-br from-background via-background/90 to-primary/10 p-12 shadow-xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Database not configured
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
          Add a valid <code>DATABASE_URL</code> to <code>.env.local</code> and restart the
          server to manage products.
        </p>
      </div>
    );
  }

  const [categories, products, mediaLibrary] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      include: {
        category: true,
        product_images: {
          orderBy: { position: "asc" }
        },
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

  // âœ… Normalize media IDs to guaranteed strings to satisfy MediaOption
  const mediaOptions: MediaOption[] = (mediaLibrary ?? [])
    .map((m: any) => ({
      id: toStringOr(m?.id ?? m?.url), // fall back to URL if id missing
      url: toStringOr(m?.url),
      alt: m?.alt ?? null,
    }))
    .filter((m) => m.id && m.url); // keep only valid entries

  // âœ… Ensure description is a string (not null) to satisfy ProductListItem prop type
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

  return (
    <div className="space-y-10 pb-16">
      <section className="rounded-4xl border border-white/10 bg-background/90 p-4 md:p-8 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Products</h1>
            <p className="text-sm text-muted-foreground">
              Launch new shawls, wraps, and accessoriesâ€”all changes publish instantly.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <a
            href="/admin/products/add"
            className="inline-block rounded-full bg-primary px-6 py-3 text-base font-semibold text-white shadow hover:bg-primary/90 transition"
          >
            + Add Product
          </a>
        </div>
      </section>

      <section className="rounded-4xl border border-white/10 bg-background/90 p-4 md:p-8 shadow-lg backdrop-blur">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Collection spotlight</h2>
          <span className="text-xs text-muted-foreground">{productsForDisplay.length} total styles</span>
        </div>
        <div className="mt-6 space-y-4">
          {productsForDisplay.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-muted-foreground/30 p-6 text-sm text-muted-foreground">
              No products yetâ€”publish your first handcrafted shawl to showcase it here.
            </p>
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
      </section>
    </div>
  );
}


