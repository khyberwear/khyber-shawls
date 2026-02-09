// export const runtime = 'edge';
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { CategoryEditForm } from "@/components/admin/category-edit-form";
import { DeleteCategoryButton } from "@/components/admin/delete-category-button";
import { ArrowLeft, Tags, AlertTriangle, Package } from "lucide-react";

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
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-8">
      {/* Back Link */}
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#B3702B] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Categories
      </Link>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 via-background to-purple-600/5 p-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/20 text-purple-500">
            <Tags className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-foreground">Edit Category</h1>
            <p className="text-lg text-[#B3702B] font-medium mt-1">{category.name}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Package className="w-4 h-4" />
              <span>{category.products.length} product{category.products.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="rounded-2xl border border-white/10 bg-background/80 backdrop-blur-sm p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-foreground mb-6">Category Details</h2>
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
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/20 text-red-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground mb-1">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Deleting this category will also remove all associated products. This action cannot be undone.
            </p>
            <DeleteCategoryButton id={category.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
