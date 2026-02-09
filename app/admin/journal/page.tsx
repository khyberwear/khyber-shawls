// // // // export const runtime = 'edge';
import Link from "next/link";
import { FileText, AlertCircle, Calendar, User, Eye, EyeOff } from "lucide-react"
import { BlogForm } from "@/components/admin/blog-form"
import { prisma } from "@/lib/prisma"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

export default async function AdminJournalPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-foreground mb-2">Database not configured</h1>
          <p className="text-muted-foreground">
            Add a valid <code className="px-2 py-1 bg-white/10 rounded">DATABASE_URL</code> to your environment.
          </p>
        </div>
      </div>
    )
  }

  const posts = await prisma.blogPost.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
  })

  const publishedCount = posts.filter((p: any) => p.published).length
  const draftCount = posts.length - publishedCount

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-background to-emerald-600/5 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-500">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Blog / Journal</h1>
              <p className="text-muted-foreground mt-1">
                Share stories, styling tips, and brand updates
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4">
            <div className="rounded-xl border border-white/10 bg-background/50 px-4 py-3 min-w-[100px]">
              <p className="text-xs text-muted-foreground">Published</p>
              <p className="text-xl font-bold text-emerald-500">{publishedCount}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-background/50 px-4 py-3 min-w-[100px]">
              <p className="text-xs text-muted-foreground">Drafts</p>
              <p className="text-xl font-bold text-yellow-500">{draftCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Blog Form */}
      <div className="rounded-2xl border border-white/10 bg-background/80 backdrop-blur-sm p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Create New Post
        </h2>
        <BlogForm />
      </div>

      {/* Posts List */}
      <div className="rounded-2xl border border-white/10 bg-background/80 backdrop-blur-sm shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-lg font-semibold text-foreground">All Posts</h2>
            <p className="text-sm text-muted-foreground">{posts.length} entries</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No posts yet</h3>
              <p className="text-muted-foreground">Create your first blog post using the form above</p>
            </div>
          ) : (
            posts.map((post: { id: string; title: string; excerpt: string | null; createdAt: Date; published: boolean; author: { name: string | null; email: string; } | null; }) => (
              <div
                key={post.id}
                className="group rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:border-[#B3702B]/40 hover:bg-[#B3702B]/5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-[#B3702B] transition-colors">
                        {post.title}
                      </h3>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${post.published
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                        {post.published ? (
                          <>
                            <Eye className="w-3 h-3" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            Draft
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author?.name ?? post.author?.email ?? "Unknown"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {dateFormatter.format(post.createdAt)}
                      </span>
                    </div>

                    {post.excerpt && (
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
