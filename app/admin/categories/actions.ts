'use server'

// Server actions for category CRUD operations
import prisma from '@/lib/prisma'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

// ---- Shared Type ----
export type CategoryActionState = {
  success?: string
  error?: string
}

// ---- CREATE ----
export async function createCategoryAction(
  _prev: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  try {
    const name = formData.get('name')?.toString().trim()
    const summary = formData.get('summary')?.toString().trim() || null
    const featuredImageUrl = formData.get('featuredImageUrl')?.toString().trim() || null
    const featuredImageAlt = formData.get('featuredImageAlt')?.toString().trim() || null

    if (!name) return { error: 'Name is required' }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    await prisma.category.create({
      data: { name, slug, summary, featuredImageUrl, featuredImageAlt },
    })

    revalidatePath('/admin/categories')
    revalidatePath('/shop')
    revalidatePath('/collections')
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
    const featuredImageUrl = formData.get('featuredImageUrl')?.toString().trim() || null
    const featuredImageAlt = formData.get('featuredImageAlt')?.toString().trim() || null

    // SEO fields
    const seoTitle = formData.get('seoTitle')?.toString().trim() || null
    const seoDescription = formData.get('seoDescription')?.toString().trim() || null

    // Get existing category data
    const existing = await prisma.category.findUnique({
      where: { id },
      select: { slug: true, sections: true }
    })

    if (!id) return { error: 'Missing category ID' }
    if (!existing) return { error: 'Category not found' }

    // Parse existing data
    let existingSections: any[] = []
    try {
      if (existing?.sections) {
        existingSections = JSON.parse(existing.sections)
      }
    } catch (e) {
      console.error('Failed to parse existing sections:', e)
    }

    // Content sections (3 sections) - now using URL-based images
    const sections = []
    for (let i = 0; i < 3; i++) {
      const title = formData.get(`section${i}Title`)?.toString().trim()
      const description = formData.get(`section${i}Description`)?.toString().trim()
      const imageUrl = formData.get(`section${i}ImageUrl`)?.toString().trim() || existingSections[i]?.image?.url || ''
      const imageAlt = formData.get(`section${i}ImageAlt`)?.toString().trim()

      // Only include section if it has at least a title and description
      if (title && description) {
        sections.push({
          title,
          description,
          image: { url: imageUrl, alt: imageAlt || '' }
        })
      }
    }

    // Build sections JSON
    const sectionsJson = sections.length > 0 ? JSON.stringify(sections) : null

    await prisma.category.update({
      where: { id },
      data: {
        name,
        summary,
        featuredImageUrl,
        featuredImageAlt,
        seoTitle,
        seoDescription,
        sections: sectionsJson,
      },
    })

    revalidatePath('/admin/categories')
    revalidatePath(`/admin/categories/${id}`)
    revalidatePath(`/category/${existing.slug}`)
    revalidatePath('/shop')
    revalidatePath('/collections')
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
  revalidatePath('/shop')
  revalidatePath('/collections')
  redirect('/admin/categories')
}
