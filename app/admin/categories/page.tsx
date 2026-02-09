// // // // export const runtime = 'edge';
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/category-form";
import { Tags, AlertCircle, FolderOpen } from "lucide-react";

export default async function AdminCategoriesPage() {
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

  const categories = await prisma.category.findMany({
    include: { products: true },
    orderBy: { name: "asc" },
  });

  const totalProducts = categories.reduce((acc, c) => acc + (c.products?.length ?? 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 via-background to-purple-600/5 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/20 text-purple-500">
              <Tags className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Categories</h1>
              <p className="text-muted-foreground mt-1">
                Organize products into collections for easy browsing
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4">
            <div className="rounded-xl border border-white/10 bg-background/50 px-4 py-3 min-w-[100px]">
              <p className="text-xs text-muted-foreground">Categories</p>
              <p className="text-xl font-bold text-purple-500">{categories.length}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-background/50 px-4 py-3 min-w-[100px]">
              <p className="text-xs text-muted-foreground">Products</p>
              <p className="text-xl font-bold text-foreground">{totalProducts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Form */}
      <div className="rounded-2xl border border-white/10 bg-background/80 backdrop-blur-sm p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Add New Category
        </h2>
        <CategoryForm />
      </div>

      {/* Categories Grid */}
      <div className="rounded-2xl border border-white/10 bg-background/80 backdrop-blur-sm shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-lg font-semibold text-foreground">All Categories</h2>
            <p className="text-sm text-muted-foreground">{categories.length} collections</p>
          </div>
        </div>

        <div className="p-6">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No categories yet</h3>
              <p className="text-muted-foreground">Create your first category using the form above</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c) => {
                const url = c.featuredImageUrl || '';
                const alt = c.featuredImageAlt || c.name || 'Category';

                return (
                  <div
                    key={c.id}
                    className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-all hover:border-[#B3702B]/40 hover:shadow-lg hover:shadow-[#B3702B]/5"
                  >
                    {/* Image */}
                    <div className="relative h-40 bg-gradient-to-br from-white/5 to-white/10 overflow-hidden">
                      {url ? (
                        <Image
                          src={url}
                          alt={alt}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Tags className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                      )}
                      {/* Product count badge */}
                      <div className="absolute top-3 right-3 rounded-full bg-background/80 backdrop-blur-sm px-3 py-1 text-xs font-medium">
                        {c.products?.length ?? 0} products
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-[#B3702B] transition-colors">
                        {c.name}
                      </h3>
                      {c.summary && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{c.summary}</p>
                      )}
                      <p className="mt-2 text-xs text-muted-foreground font-mono">/{c.slug}</p>

                      <Link
                        href={`/admin/categories/${c.id}`}
                        className="mt-4 block w-full text-center rounded-xl bg-gradient-to-r from-[#B3702B] to-[#8B5A2B] px-4 py-2.5 text-sm font-medium text-white hover:shadow-lg hover:shadow-[#B3702B]/25 transition-all"
                      >
                        Edit Category
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
