// export const runtime = 'edge';
import Image from "next/image"
import { OrderStatusForm } from "@/components/admin/order-status-form"
import { OrderDetailsDialog } from "@/components/admin/order-details-dialog"
import { formatCurrency } from "@/lib/currency"
import { prisma } from "@/lib/prisma"



const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

export default async function AdminOrdersPage() {
  if (!prisma) {
    return (
      <div className="overflow-hidden rounded-4xl border border-primary/20 bg-gradient-to-br from-background via-background/90 to-primary/10 p-12 shadow-xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Database not configured
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
          Add a valid <code>DATABASE_URL</code> to <code>.env.local</code> and restart the
          server to manage orders.
        </p>
      </div>
    )
  }

  const orders = await prisma.order.findMany({
    include: {
      items: { 
        include: { 
          product: {
            select: {
              id: true,
              name: true,
              image: true,
              slug: true,
            }
          }
        } 
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  }) as Array<
    typeof prisma.order extends { findMany: (...args: any[]) => Promise<(infer T)[]> } ?
      T & { items: Array<{ id: string; quantity: number; price: number; product: { id: string; name: string; image: string | null; slug: string } | null }> }
      : never
  >

  return (
    <div className="space-y-10 pb-16">
      <section className="rounded-4xl border border-white/10 bg-background/90 p-4 md:p-8 shadow-lg backdrop-blur">
        <h1 className="text-3xl font-semibold text-foreground">Orders</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track fulfilment, adjust statuses, and give clients immediate updates.
        </p>
      </section>

      <section className="rounded-4xl border border-white/10 bg-background/90 p-4 md:p-8 shadow-lg backdrop-blur">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Latest bespoke orders</h2>
          <span className="text-xs text-muted-foreground">Newest first</span>
        </div>
        <div className="mt-6 space-y-4">
          {orders.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-muted-foreground/30 p-6 text-sm text-muted-foreground">
              No orders yet. Once clients begin checking out, updates will appear here in real time—no approvals required.
            </p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl border border-white/10 bg-background/70 p-5 shadow-sm transition hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">
                      #{order.id.slice(0, 8)} · {order.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p>{formatCurrency(order.total)}</p>
                    <p className="text-xs text-muted-foreground">
                      {dateFormatter.format(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      {item.product?.image && (
                        <Image
                          src={item.product.image}
                          alt={item.product?.name || "Product image"}
                          width={40}
                          height={40}
                          className="rounded-md object-cover border"
                        />
                      )}
                      <span>
                        {item.quantity} × {item.product?.name ?? "Removed product"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <OrderDetailsDialog
                    orderId={order.id}
                    customerName={order.customerName}
                    customerEmail={order.customerEmail}
                    customerPhone={order.customerPhone}
                    shippingAddress={order.shippingAddress}
                    notes={order.notes}
                    createdAt={order.createdAt}
                    total={order.total}
                    items={order.items}
                  />
                  <div className="flex-1">
                    <OrderStatusForm orderId={order.id} currentStatus={order.status} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
