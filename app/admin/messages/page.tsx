// // // // export const runtime = 'edge';
import { prisma } from "@/lib/prisma"
import { MessageSquare, AlertCircle, Mail, User, Calendar, Inbox } from "lucide-react"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
})

export default async function AdminMessagesPage() {
  if (!prisma) {
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

  const entries = await prisma.contactEntry.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-background to-cyan-600/5 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-500">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Messages</h1>
              <p className="text-muted-foreground mt-1">
                Customer inquiries and contact form submissions
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-xl border border-white/10 bg-background/50 px-4 py-3 min-w-[120px]">
            <p className="text-xs text-muted-foreground">Total Messages</p>
            <p className="text-2xl font-bold text-cyan-500">{entries.length}</p>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="rounded-2xl border border-white/10 bg-background/80 backdrop-blur-sm shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-lg font-semibold text-foreground">All Messages</h2>
            <p className="text-sm text-muted-foreground">{entries.length} conversations</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <Inbox className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No messages yet</h3>
              <p className="text-muted-foreground">Messages from your contact form will appear here</p>
            </div>
          ) : (
            entries.map((entry: any) => (
              <div
                key={entry.id}
                className="group rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:border-[#B3702B]/40 hover:bg-[#B3702B]/5"
              >
                {/* Message Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-500">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{entry.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span>{entry.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{dateFormatter.format(entry.createdAt)}</span>
                  </div>
                </div>

                {/* Message Content */}
                <div className="rounded-lg bg-white/5 p-4 mt-3">
                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {entry.message}
                  </p>
                </div>

                {/* Reply Action */}
                <div className="mt-4 pt-3 border-t border-white/10">
                  <a
                    href={`mailto:${entry.email}?subject=Re: Your inquiry at Khyber Shawls`}
                    className="inline-flex items-center gap-2 text-sm text-[#B3702B] hover:underline underline-offset-4"
                  >
                    <Mail className="w-4 h-4" />
                    Reply via Email
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
