// // // export const runtime = 'edge';
import { ProductForm } from "@/components/admin/product-form";
import prisma from "@/lib/prisma";

export default async function AddProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="mx-auto max-w-2xl py-10">
      <h1 className="mb-6 text-3xl font-semibold text-foreground">Add Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}

