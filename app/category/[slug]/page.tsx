// export const runtime = 'edge';
// app/category/[slug]/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchProductsByCategorySlug } from "@/lib/products";
import { CategoryView } from "./view";



type PageProps = { params: { slug?: string } | Promise<{ slug?: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams =
    typeof (params as unknown as Promise<unknown>)?.then === "function"
      ? await (params as Promise<{ slug?: string }>)
      : (params as { slug?: string });

  const slug = resolvedParams?.slug;
  if (!slug) return {};

  const data = await fetchProductsByCategorySlug(slug);
  if (!data) return {};

  const { category } = data;

  return {
    title: category.seoTitle || `${category.name} | Khyber Shawls`,
    description: category.seoDescription || category.summary || `Shop our collection of ${category.name.toLowerCase()}`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams =
    typeof (params as unknown as Promise<unknown>)?.then === "function"
      ? await (params as Promise<{ slug?: string }>)
      : (params as { slug?: string });

  const slug = resolvedParams?.slug;
  if (!slug) notFound();

  const data = await fetchProductsByCategorySlug(slug);
  if (!data) notFound();

  return (
    <CategoryView
      category={data.category}
      products={data.products}
    />
  );
}
