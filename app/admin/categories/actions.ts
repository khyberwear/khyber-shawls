'use server'

// Server actions for category CRUD operations
import prisma from '@/lib/prisma'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { uploadFileToR2 } from '@/lib/cloudflare-r2'

// ---- Shared Type ----
export type CategoryActionState = {
  success?: string
  error?: string
}

// ---- Helper for Saving Upload ----
// Removed saveUpload local FS helper in favor of direct Supabase uploads in actions

// ---- CREATE ----
export async function createCategoryAction(
  _prev: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  try {
    const name = formData.get('name')?.toString().trim()
    const summary = formData.get('summary')?.toString().trim() || null
    const featuredImageFile = formData.get('featuredImageFile') as File | null
    const featuredImageAlt = formData.get('featuredImageAlt')?.toString().trim() || null

    if (!name) return { error: 'Name is required' }

    let featuredImageUrl: string | null = null
    if (featuredImageFile && featuredImageFile.size > 0) {
      featuredImageUrl = await uploadFileToR2(featuredImageFile, 'categories')
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    await prisma.category.create({
      data: { name, slug, summary, featuredImageUrl, featuredImageAlt },
    })

    revalidatePath('/admin/categories')
    revalidateTag('categories', 'max')
    return { success: 'Category created' }
  } catch (e: any) {
    return { error: e?.message || 'Failed to create category' }
  }
}

// ---- UPDATE ----
export async function updateCategoryAction(
  _prev: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  try {
    const id = formData.get('id')?.toString()
    const name = formData.get('name')?.toString().trim()
    const summary = formData.get('summary')?.toString().trim() || null
    const featuredImageFile = formData.get('featuredImageFile') as File | null
    const featuredImageAlt = formData.get('featuredImageAlt')?.toString().trim() || null

    // SEO fields
    const seoTitle = formData.get('seoTitle')?.toString().trim() || null
    const seoDescription = formData.get('seoDescription')?.toString().trim() || null

    // Get existing category data to preserve images
    const existing = await prisma.category.findUnique({
      where: { id },
      select: { slug: true, sections: true }
    })

    // Parse existing data
    let existingSections: any[] = []
    try {
      if (existing?.sections) {
        existingSections = JSON.parse(existing.sections)
      }
    } catch (e) {
      console.error('Failed to parse existing sections:', e)
    }

    // Content sections (3 sections)
    const sections = []
    for (let i = 0; i < 3; i++) {
      const title = formData.get(`section${i}Title`)?.toString().trim()
      const description = formData.get(`section${i}Description`)?.toString().trim()
      const imageFile = formData.get(`section${i}ImageFile`) as File | null
      const imageAlt = formData.get(`section${i}ImageAlt`)?.toString().trim()

      // Upload section image if provided, otherwise keep existing
      let imageUrl = existingSections[i]?.image?.url || ''
      if (imageFile && imageFile.size > 0) {
        imageUrl = await uploadFileToR2(imageFile, 'categories')
      }

      // Only include section if it has at least a title and description
      if (title && description) {
        sections.push({
          title,
          description,
          image: { url: imageUrl, alt: imageAlt || '' }
        })
      }
    }

    if (!id) return { error: 'Missing category ID' }

    if (!existing) return { error: 'Category not found' }

    let featuredImageUrl: string | null | undefined = undefined
    if (featuredImageFile && featuredImageFile.size > 0) {
      featuredImageUrl = await uploadFileToR2(featuredImageFile, 'categories')
    }

    // Build sections JSON (already processed with file uploads above)
    const sectionsJson = sections.length > 0 ? JSON.stringify(sections) : null

    await prisma.category.update({
      where: { id },
      data: {
        name,
        summary,
        featuredImageAlt,
        seoTitle,
        seoDescription,
        sections: sectionsJson,
        ...(featuredImageUrl !== undefined ? { featuredImageUrl } : {}),
      },
    })

    revalidatePath('/admin/categories')
    revalidatePath(`/admin/categories/${id}`)
    revalidatePath(`/category/${existing.slug}`)
    revalidateTag('categories', 'max')
    return { success: 'Category updated successfully!' }
  } catch (e: any) {
    return { error: e?.message || 'Failed to update category' }
  }
}

// ---- DELETE ----
export async function deleteCategoryAction(formData: FormData): Promise<void> {
  const id = formData.get('id')?.toString()
  if (!id) return
  await prisma.category.delete({ where: { id } })
  revalidatePath('/admin/categories')
  revalidateTag('categories', 'max')
  redirect('/admin/categories')
}

