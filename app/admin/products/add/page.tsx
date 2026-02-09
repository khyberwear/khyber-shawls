// // // // export const runtime = 'edge';
import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";
import prisma from "@/lib/prisma";
import { ArrowLeft, Package } from "lucide-react";

export default async function AddProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4 md:p-8">
      {/* Back Link */}
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#B3702B] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-background to-blue-600/5 p-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20 text-blue-500">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Add New Product</h1>
            <p className="text-muted-foreground mt-1">
              Create a new product for your catalog
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-white/10 bg-background/80 backdrop-blur-sm p-6 shadow-lg">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
