// // // // export const runtime = 'edge';
import Image from "next/image"
import { OrderStatusForm } from "@/components/admin/order-status-form"
import { OrderDetailsDialog } from "@/components/admin/order-details-dialog"
import { formatCurrency } from "@/lib/currency"
import { prisma } from "@/lib/prisma"
import {
  ShoppingCart,
  AlertCircle,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle
} from "lucide-react"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

// Status configurations
const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  pending: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  processing: { icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
  shipped: { icon: Truck, color: "text-purple-500", bg: "bg-purple-500/10" },
  delivered: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
  cancelled: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
}

export default async function AdminOrdersPage() {
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
    take: 50,
  }) as any[]

  // Calculate stats
  const totalRevenue = orders.reduce((acc, o) => acc + Number(o.total || 0), 0)
  const pendingCount = orders.filter(o => o.status === 'pending').length
  const deliveredCount = orders.filter(o => o.status === 'delivered').length

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-orange-500/10 via-background to-orange-600/5 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/20 text-orange-500">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Orders</h1>
              <p className="text-muted-foreground mt-1">
                Track and manage customer orders
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-background/50 px-4 py-3">
              <p className="text-xs text-muted-foreground">Total Orders</p>
              <p className="text-xl font-bold text-foreground">{orders.length}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-background/50 px-4 py-3">
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-xl font-bold text-yellow-500">{pendingCount}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-background/50 px-4 py-3">
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="text-xl font-bold text-green-500">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="rounded-2xl border border-white/10 bg-background/80 backdrop-blur-sm shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
            <p className="text-sm text-muted-foreground">Latest {orders.length} orders</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No orders yet</h3>
              <p className="text-muted-foreground">Orders will appear here when customers checkout</p>
            </div>
          ) : (
            orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending
              const StatusIcon = status.icon

              return (
                <div
                  key={order.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:border-[#B3702B]/40"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-foreground">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${status.bg} ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mt-1">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#B3702B]">{formatCurrency(order.total)}</p>
                      <p className="text-xs text-muted-foreground">{dateFormatter.format(order.createdAt)}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {order.items.slice(0, 3).map((item: any) => (
                      <div key={item.id} className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5">
                        {item.product?.image && (
                          <Image
                            src={item.product.image}
                            alt={item.product?.name || "Product"}
                            width={24}
                            height={24}
                            className="rounded object-cover"
                          />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {item.quantity}× {item.product?.name ?? "Removed"}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-xs text-muted-foreground px-3 py-1.5">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
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
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
