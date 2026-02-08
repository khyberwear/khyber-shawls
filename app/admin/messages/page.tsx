// // export const runtime = 'edge';
import { prisma } from "@/lib/prisma"



const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

export default async function AdminMessagesPage() {
  if (!prisma) {
    return (
      <div className="overflow-hidden rounded-4xl border border-primary/20 bg-gradient-to-br from-background via-background/90 to-primary/10 p-12 shadow-xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Database not configured
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
          Add a valid <code>DATABASE_URL</code> to <code>.env.local</code> and restart the
          server to manage client messages.
        </p>
      </div>
    )
  }

  const entries = await prisma.contactEntry.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 40,
  })

  return (
    <div className="space-y-10 pb-16">
      <section className="rounded-4xl border border-white/10 bg-background/90 p-4 md:p-8 shadow-lg backdrop-blur">
        <h1 className="text-3xl font-semibold text-foreground">Client conversations</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Styling questions, bespoke requests, and appointment notes appear here instantly.
        </p>
      </section>

      <section className="rounded-4xl border border-white/10 bg-background/90 p-4 md:p-8 shadow-lg backdrop-blur">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Latest messages</h2>
          <span className="text-xs text-muted-foreground">{entries.length} received</span>
        </div>
        <div className="mt-6 space-y-4">
          {entries.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-muted-foreground/30 p-6 text-sm text-muted-foreground">
              Messages submitted via the contact form will surface here for quick follow-up.
            </p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-3xl border border-white/10 bg-background/70 p-5 shadow-sm transition hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">{entry.email}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dateFormatter.format(entry.createdAt)}
                  </p>
                </div>
                <p className="mt-4 text-sm text-muted-foreground whitespace-pre-line">
                  {entry.message}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
