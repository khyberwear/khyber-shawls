// lib/journal.ts
import { prisma } from "@/lib/prisma";
import type { BlogPost } from "@prisma/client";

// Note: unstable_cache is not supported on Cloudflare Pages.
// D1 queries are fast enough without an application-level cache.

export type SerializedPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  imageUrl: string | null;
  publishedAt: string;
};

function serializePost(post: BlogPost): SerializedPost {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    imageUrl: post.image,
    publishedAt: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(post.createdAt),
  };
}


export async function fetchLatestPosts(limit: number = 3): Promise<SerializedPost[]> {
    try {
      const posts = await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: limit,
      });
      return posts.map(serializePost);
    } catch (error) {
      console.warn("[database] Failed to fetch latest posts. Returning empty list.", error);
      return [];
    }
}
