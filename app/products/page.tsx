// export const runtime = 'edge';
// app/products/page.tsx
import { fetchPublishedProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export const revalidate = 900;

export const metadata = {
  title: "Products | Khybershawls",
  description: "Explore our latest shawls and wraps.",
};

export default async function ProductsIndex() {
  const products = await fetchPublishedProducts();

  return (
    <main className="container mx-auto px-2.5 sm:px-4 md:px-6 py-8 md:py-12">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 md:mb-8">All Products</h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-600 py-12">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
