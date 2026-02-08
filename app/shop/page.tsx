// // export const runtime = 'edge';
// app/shop/page.tsx
import { fetchPublishedProducts, fetchCategoriesWithProducts } from "@/lib/products";
import { ShopClient } from "@/components/shop/shop-client";

export const revalidate = 900;

export const metadata = {
  title: "Shop | Khyber Shawls",
  description: "Browse our complete collection of handcrafted Kashmiri shawls.",
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    fetchPublishedProducts(),
    fetchCategoriesWithProducts(),
  ]);

  return (
    <main className="w-full">
      <ShopClient products={products} categories={categories} />
    </main>
  );
}
