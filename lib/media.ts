"use server";

import { uploadFileToR2 } from "@/lib/cloudflare-r2";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

import { requireUser } from "@/lib/auth";
import { slugify } from "@/lib/slugify";
import { ensurePrismaClient } from "@/lib/prisma";

/* ───────────────────────────────────────────────
   Shared helpers & types
   ─────────────────────────────────────────────── */

export type MediaActionState = { error?: string; success?: string };
export type CategoryActionState =
  | { ok: true; message: string }
  | { ok: false; message: string; issues?: string[] };

/* ───────────────────────────────────────────────
   CATEGORY: create
   ─────────────────────────────────────────────── */

const CategoryInput = z.object({
  name: z.string().min(1),
  summary: z.string().optional().nullable(),
  featuredImageUrl: z.string().url().optional().nullable(),
  featuredImageAlt: z.string().optional().nullable(),
});

export async function createCategoryAction(
  _prev: CategoryActionState | null,
  formData: FormData
): Promise<CategoryActionState> {
  const user = await requireUser();
  if (!user) return { ok: false, message: "Unauthorized" };

  const parsed = CategoryInput.safeParse({
    name: formData.get("name"),
    summary: formData.get("summary"),
    featuredImageUrl: formData.get("featuredImageUrl"),
    featuredImageAlt: formData.get("featuredImageAlt"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid input",
      issues: parsed.error.issues.map((i) => i.message),
    };
  }

  const db = ensurePrismaClient();

  // Build exact input (no extra keys)
  // Use inline spreads to keep type-narrowing correct for Prisma
  const data: Prisma.CategoryCreateInput = {
    name: parsed.data.name,
    slug: slugify(parsed.data.name),
    ...(parsed.data.summary != null && parsed.data.summary !== ""
      ? { summary: parsed.data.summary }
      : {}),
    ...(parsed.data.featuredImageUrl != null && parsed.data.featuredImageUrl !== ""
      ? { featuredImageUrl: parsed.data.featuredImageUrl }
      : {}),
    ...(parsed.data.featuredImageAlt != null && parsed.data.featuredImageAlt !== ""
      ? { featuredImageAlt: parsed.data.featuredImageAlt }
      : {}),
  };

  try {
    await db.category.create({ data });
    return { ok: true, message: "Category created" };
  } catch (err: any) {
    return {
      ok: false,
      message: "Failed to create category",
      issues: [String(err?.message ?? err)],
    };
  }
}

/* ───────────────────────────────────────────────
   PRODUCT: create / update / delete
   ─────────────────────────────────────────────── */

const CreateProductInput = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().positive(),
  inventory: z.coerce.number().int().min(0).optional().default(0),
  categoryId: z.string().min(1),
  published: z.union([z.literal("on"), z.string()]).optional().nullable(),
});

export async function createProductAction(
  _prev: MediaActionState | null,
  formData: FormData
): Promise<MediaActionState> {
  const user = await requireUser();
  if (!user) return { error: "Unauthorized" };

  const parsed = CreateProductInput.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    inventory: formData.get("inventory"),
    categoryId: formData.get("categoryId"),
    published: formData.get("published"),
  });
  if (!parsed.success) return { error: "Please check the form fields and try again." };

  const db = ensurePrismaClient();

  // Use UncheckedCreate so we can set foreign keys directly
  const data: Prisma.ProductUncheckedCreateInput = {
    name: parsed.data.title,
    slug: slugify(parsed.data.title),
    description: parsed.data.description,
    price: parsed.data.price as any, // Decimal accepts number in JS
    image: "", // Default empty image
    inStock: !!parsed.data.published,
    published: !!parsed.data.published,
    categoryId: parsed.data.categoryId,
    // createdAt/updatedAt will be defaulted by the DB
  };

  try {
    await db.product.create({ data });
    return { success: "Product saved" };
  } catch (e: any) {
    return { error: `Failed to save product: ${String(e?.message ?? e)}` };
  }
}

const UpdateProductInput = z.object({
  id: z.string().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().optional(),
  inventory: z.coerce.number().int().optional(),
  categoryId: z.string().optional(),
  published: z.union([z.boolean(), z.string()]).optional(),
});

export async function updateProductAction(
  _prev: MediaActionState | null,
  formData: FormData
): Promise<MediaActionState> {
  const user = await requireUser();
  if (!user) return { error: "Unauthorized" };

  const parsed = UpdateProductInput.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    inventory: formData.get("inventory"),
    categoryId: formData.get("categoryId"),
    published: formData.get("published"),
  });
  if (!parsed.success) return { error: "Invalid update data" };

  const db = ensurePrismaClient();

  try {
    const { id, ...rest } = parsed.data;

    // Build a partial update with precise keys
    const data: Prisma.ProductUncheckedUpdateInput = {};
    if (rest.title !== undefined) data.name = rest.title;
    if (rest.description !== undefined) data.description = rest.description;
    if (rest.price !== undefined) data.price = rest.price as any;
    if (rest.categoryId !== undefined) data.categoryId = rest.categoryId;
    if (rest.published !== undefined) {
      data.published = rest.published === "true" || rest.published === true;
      data.inStock = rest.published === "true" || rest.published === true;
    }

    await db.product.update({ where: { id }, data });
    return { success: "Product updated" };
  } catch (e: any) {
    return { error: `Failed to update: ${String(e.message ?? e)}` };
  }
}

const DeleteProductInput = z.object({ id: z.string().min(1) });

export async function deleteProductAction(
  _prev: MediaActionState | null,
  formData: FormData
): Promise<MediaActionState> {
  const user = await requireUser();
  if (!user) return { error: "Unauthorized" };

  const parsed = DeleteProductInput.safeParse({ id: formData.get("id") });
  if (!parsed.success) return { error: "Invalid product id" };

  const db = ensurePrismaClient();
  try {
    await db.product.delete({
      where: { id: parsed.data.id },
    });
    return { success: "Product deleted" };
  } catch (e: any) {
    return { error: `Failed to delete: ${String(e.message ?? e)}` };
  }
}

/* ───────────────────────────────────────────────
   HERO MEDIA: upsert (schema-aligned)
   ─────────────────────────────────────────────── */

const HeroUpsertInput = z.object({
  key: z.string().min(1),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  backgroundImageUrl: z.string().url().optional().nullable(),
  backgroundImageAlt: z.string().optional().nullable(),

  // accepted but NOT persisted unless you add columns
  description: z.string().optional().nullable(),
  ctaLabel: z.string().optional().nullable(),
  ctaHref: z.string().optional().nullable(),
});

export async function upsertHeroMediaAction(
  _prev: CategoryActionState | null,
  formData: FormData
): Promise<CategoryActionState> {
  const user = await requireUser();
  if (!user) return { ok: false, message: "Unauthorized" };

  const parsed = HeroUpsertInput.safeParse({
    key: formData.get("heroKey") ?? formData.get("key"),
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    description: formData.get("description"),
    ctaLabel: formData.get("ctaLabel"),
    ctaHref: formData.get("ctaHref"),
    backgroundImageUrl: formData.get("backgroundImageUrl"),
    backgroundImageAlt: formData.get("backgroundImageAlt"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid hero data",
      issues: parsed.error.issues.map((i) => i.message),
    };
  }

  const db = ensurePrismaClient();

  // Ensure Media row for background image if a URL was provided
  let backgroundImageId: string | null = null;
  if (parsed.data.backgroundImageUrl) {
    const existing = await db.media.findFirst({
      where: { url: parsed.data.backgroundImageUrl },
      select: { id: true },
    });

    if (existing) {
      backgroundImageId = existing.id;
      if (parsed.data.backgroundImageAlt !== undefined) {
        await db.media.update({
          where: { id: existing.id },
          data: { alt: parsed.data.backgroundImageAlt ?? null },
        });
      }
    } else {
      const created = await db.media.create({
        data: {
          url: parsed.data.backgroundImageUrl,
          alt: parsed.data.backgroundImageAlt ?? null,
        },
        select: { id: true },
      });
      backgroundImageId = created.id;
    }
  }

  // title is required in your schema → never write null
  const safeTitle = parsed.data.title ?? "";

  const dataCreate: Prisma.HeroMediaCreateInput = {
    key: parsed.data.key,
    title: safeTitle,
    ...(parsed.data.subtitle != null ? { subtitle: parsed.data.subtitle } : {}),
    ...(backgroundImageId
      ? { backgroundImage: { connect: { id: backgroundImageId } } }
      : {}),
  };

  const dataUpdate: Prisma.HeroMediaUpdateInput = {
    title: safeTitle,
    subtitle: parsed.data.subtitle ?? null,
    ...(backgroundImageId
      ? { backgroundImage: { connect: { id: backgroundImageId } } }
      : { backgroundImage: { disconnect: true } }),
  };

  await db.heroMedia.upsert({
    where: { key: parsed.data.key },
    update: dataUpdate,
    create: dataCreate,
  });

  revalidatePath("/admin/media");
  revalidatePath("/");

  return { ok: true, message: "Hero banner saved" };
}

/* ───────────────────────────────────────────────
   MEDIA: upload / update / delete
   ─────────────────────────────────────────────── */

const UploadMediaInput = z.object({
  file: z.instanceof(File),
  alt: z.string().optional().nullable(),
});

export async function uploadMediaAction(
  _prev: MediaActionState | null,
  formData: FormData
): Promise<MediaActionState> {
  const user = await requireUser();
  if (!user) return { error: "Unauthorized" };

  const parsed = UploadMediaInput.safeParse({
    file: formData.get("file"),
    alt: formData.get("alt"),
  });
  if (!parsed.success) return { error: "Invalid upload data" };

  const db = ensurePrismaClient();

  try {
    const publicUrl = await uploadFileToR2(parsed.data.file, 'uploads');

    const data: Prisma.MediaCreateInput = {
      url: publicUrl,
      ...(parsed.data.alt != null ? { alt: parsed.data.alt } : {}),
    };

    await db.media.create({ data });

    revalidatePath("/admin/media");
    return { success: "File uploaded successfully" };
  } catch (e: any) {
    console.error(e);
    return { error: "Upload failed. Please try again." };
  }
}

const UpdateMediaInput = z.object({
  id: z.string().min(1),
  url: z.string().url().optional().nullable(),
  alt: z.string().optional().nullable(),
});

export async function updateMediaAction(
  _prev: MediaActionState | null,
  formData: FormData
): Promise<MediaActionState> {
  const user = await requireUser();
  if (!user) return { error: "Unauthorized" };

  const parsed = UpdateMediaInput.safeParse({
    id: formData.get("id"),
    url: formData.get("url"),
    alt: formData.get("alt"),
  });
  if (!parsed.success) return { error: "Invalid media data" };

  const db = ensurePrismaClient();

  try {
    const data: Prisma.MediaUpdateInput = {};
    if (typeof parsed.data.url === "string") data.url = parsed.data.url;
    if (parsed.data.alt !== undefined) data.alt = parsed.data.alt ?? null;

    await db.media.update({ where: { id: parsed.data.id }, data });
    revalidatePath("/admin/media");
    return { success: "Media updated" };
  } catch (e: any) {
    return { error: `Failed to update media: ${String(e?.message ?? e)}` };
  }
}

const DeleteMediaInput = z.object({ id: z.string().min(1) });

export async function deleteMediaAction(
  _prev: MediaActionState | null,
  formData: FormData
): Promise<MediaActionState> {
  const user = await requireUser();
  if (!user) return { error: "Unauthorized" };

  const parsed = DeleteMediaInput.safeParse({ id: formData.get("id") });
  if (!parsed.success) return { error: "Invalid media id" };

  const db = ensurePrismaClient();

  try {
    const media = await db.media.findUnique({ where: { id: parsed.data.id } });
    if (!media) return { error: "Media not found" };

    await db.media.delete({ where: { id: parsed.data.id } });

    // file deletion skipped (Supabase buckets)

    revalidatePath("/admin/media");
    return { success: "Media deleted" };
  } catch (e: any) {
    return { error: `Failed to delete media: ${String(e?.message ?? e)}` };
  }
}

// Utility: fetch media library items for admin UIs
export async function fetchMediaLibrary(limit = 24) {
  const db = ensurePrismaClient();
  try {
    const items = await db.media.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return items;
  } catch (err) {
    console.error("[media] fetchMediaLibrary failed:", err);
    return [];
  }
}

export default fetchMediaLibrary;
