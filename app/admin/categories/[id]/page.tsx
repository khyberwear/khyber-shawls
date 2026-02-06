export const runtime = 'edge';
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { CategoryEditForm } from "@/components/admin/category-edit-form";
import { DeleteCategoryButton } from "@/components/admin/delete-category-button";

export const runtime = "nodejs";

type PageProps = { params: { id?: string } | Promise<{ id?: string }> };

export default async function EditCategoryPage({ params }: PageProps) {
  const resolvedParams =
    typeof (params as unknown as Promise<unknown>)?.then === "function"
      ? await (params as Promise<{ id?: string }>)
      : (params as { id?: string });
  
  const id = resolvedParams?.id;
  if (!id) notFound();

  const category = await prisma.category.findUnique({
    where: { id },
    include: { products: true },
  });

  if (!category) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/categories"
            className="text-sm text-amber-700 hover:text-amber-800 mb-2 inline-block"
          >
            ← Back to Categories
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900">
            Edit Category: {category.name}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {category.products.length} product{category.products.length !== 1 ? 's' : ''} in this category
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-8 shadow-sm">
        <CategoryEditForm
          id={category.id}
          name={category.name}
          summary={category.summary}
          featuredImageUrl={category.featuredImageUrl}
          featuredImageAlt={category.featuredImageAlt}
          seoTitle={(category as any).seoTitle}
          seoDescription={(category as any).seoDescription}
          sections={(category as any).sections}
          uiConfig={(category as any).uiConfig}
        />
      </div>

      {/* Delete Section */}
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 md:p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-600 mb-4">
          Deleting this category will also remove all associated products. This action cannot be undone.
        </p>
        <DeleteCategoryButton id={category.id} />
      </div>
    </div>
  );
}
