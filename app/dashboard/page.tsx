// // // // export const runtime = 'edge';
// app/dashboard/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageCircle, Package2, Sparkles } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/currency";



type OrderItemRow = { id: string; quantity: number; product: { title: string | null } | null };
type OrderRow = { id: string; createdAt: Date; status: string; total: any; items: OrderItemRow[] };
type ContactEntryRow = { id: string; createdAt: Date; message: string };

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

export default async function DashboardPage() {
  if (!prisma) {
    redirect("/admin/products");
  }

  const user = await requireUser();
  const ordersRaw = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  // Map product.name to product.title for UI compatibility
  const orders = ordersRaw.map((order: any) => ({
    ...order,
    items: order.items.map((item: any) => ({
      ...item,
      product: item.product ? { ...item.product, title: item.product.name } : null,
    })),
  }));
  const fulfilledOrders = orders.filter((o: any) => o.status === "fulfilled" || o.status === "delivered").length;
  return (
    <div className="space-y-12 pb-16">
      <section className="overflow-hidden rounded-4xl border border-primary/20 bg-gradient-to-br from-background via-background to-primary/10 p-10 shadow-xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
              <Sparkles className="size-3" /> Atelier client lounge
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground lg:text-5xl">
              Welcome back, {user.name ?? user.email}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Track orders, follow up on messages, and preview what's shipping next.
            </p>
          </div>
          <div className="rounded-3xl border border-primary/20 bg-background/70 p-6 text-sm text-muted-foreground shadow-lg backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Snapshot</p>
            <div className="mt-4 grid gap-4 text-sm text-foreground sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-background/80 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Total orders</p>
                <p className="mt-3 text-2xl font-semibold text-primary">{orders.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-background/80 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Delivered treasures</p>
                <p className="mt-3 text-2xl font-semibold text-primary">{fulfilledOrders}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)] xl:gap-12">
        <div className="rounded-4xl border border-white/10 bg-background/90 p-8 shadow-lg backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                <Package2 className="size-5 text-primary" /> Order history
              </h2>
              <p className="text-sm text-muted-foreground">Every order is auto-approved.</p>
            </div>
            <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-primary-foreground">
              Explore new arrivals
            </Link>
          </div>

          <div className="mt-8 space-y-4">
            {orders.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-muted-foreground/30 p-6 text-sm text-muted-foreground">
                No orders yet. Shop the collection—your timeline will appear here.
              </p>
            ) : (
              orders.map((order: OrderRow) => (
                <div key={order.id} className="rounded-3xl border border-white/10 bg-background/70 p-5 shadow-sm transition hover:border-primary/40 hover:bg-primary/5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">
                        {dateFormatter.format(order.createdAt)} Â· {order.status}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{formatCurrency(order.total)}</p>
                  </div>
                  <div className="mt-4 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                    {order.items.map((item: OrderItemRow) => (
                      <p key={item.id}>
                        {item.quantity} Ã— {item.product?.title ?? "Classic shawl"}
                      </p>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-4xl border border-white/10 bg-background/90 p-8 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <MessageCircle className="size-5 text-primary" /> Atelier conversations
            </h2>
            <span className="text-xs text-muted-foreground">0 latest messages</span>
          </div>

          <div className="mt-6 space-y-4">
            <p className="rounded-3xl border border-dashed border-muted-foreground/30 p-6 text-sm text-muted-foreground">
              Reach out via the contact form—your messages will show here for easy follow-up.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}


