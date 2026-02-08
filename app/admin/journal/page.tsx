// // // // export const runtime = 'edge';
import { NotebookPen } from "lucide-react"

import { BlogForm } from "@/components/admin/blog-form"
import { prisma } from "@/lib/prisma"
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"



const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

export default async function AdminJournalPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <div className="overflow-hidden rounded-4xl border border-primary/20 bg-gradient-to-br from-background via-background/90 to-primary/10 p-12 shadow-xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Database not configured
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
          Add a valid <code>DATABASE_URL</code> to <code>.env.local</code> and restart the
          server to manage journal entries.
        </p>
      </div>
    )
  }

  const posts = await prisma.blogPost.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-10 pb-16">
      <section className="rounded-4xl border border-white/10 bg-background/90 p-4 md:p-8 shadow-lg backdrop-blur">
        <div className="flex items-center gap-3">
          <NotebookPen className="size-6 text-primary" />
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Journal</h1>
            <p className="text-sm text-muted-foreground">
              Share studio stories, reveal artisan journeys, and publish styling notes.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <BlogForm />
        </div>
      </section>

      <section className="rounded-4xl border border-white/10 bg-background/90 p-4 md:p-8 shadow-lg backdrop-blur">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Journal timeline</h2>
          <span className="text-xs text-muted-foreground">{posts.length} total entries</span>
        </div>
        <div className="mt-6 space-y-4">
          {posts.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-muted-foreground/30 p-6 text-sm text-muted-foreground">
              No journal entries yetâ€”craft your narrative to enrich the brand voice.
            </p>
          ) : (
            posts.map((post: { id: string; title: string; excerpt: string | null; createdAt: Date; published: boolean; author: { name: string | null; email: string; } | null; }) => (
              <div
                key={post.id}
                className="rounded-3xl border border-white/10 bg-background/70 p-5 shadow-sm transition hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">{post.title}</p>
                    <p className="text-xs text-muted-foreground">
                      By {post.author?.name ?? post.author?.email ?? "Unknown stylist"}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{dateFormatter.format(post.createdAt)}</p>
                    <p>{post.published ? "Published" : "Draft"}</p>
                  </div>
                </div>
                {post.excerpt && (
                  <p className="mt-3 text-xs text-muted-foreground">{post.excerpt}</p>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}


