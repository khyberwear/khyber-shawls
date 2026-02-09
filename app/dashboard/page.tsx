// // // // export const runtime = 'edge';
// app/dashboard/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  MessageCircle,
  Package2,
  Sparkles,
  ShoppingBag,
  Truck,
  Clock,
  ArrowRight,
  Star
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/currency";

type OrderItemRow = { id: string; quantity: number; product: { title: string | null } | null };
type OrderRow = { id: string; createdAt: Date; status: string; total: any; items: OrderItemRow[] };

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

// Status badge styling
const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: "bg-yellow-500/10", text: "text-yellow-500", dot: "bg-yellow-500" },
  processing: { bg: "bg-blue-500/10", text: "text-blue-500", dot: "bg-blue-500" },
  shipped: { bg: "bg-purple-500/10", text: "text-purple-500", dot: "bg-purple-500" },
  delivered: { bg: "bg-green-500/10", text: "text-green-500", dot: "bg-green-500" },
  fulfilled: { bg: "bg-green-500/10", text: "text-green-500", dot: "bg-green-500" },
  cancelled: { bg: "bg-red-500/10", text: "text-red-500", dot: "bg-red-500" },
};

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
  const pendingOrders = orders.filter((o: any) => o.status === "pending" || o.status === "processing").length;
  const totalSpent = orders.reduce((acc: number, o: any) => acc + Number(o.total || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#B3702B]/10 via-background to-[#8B5A2B]/5 p-8 md:p-10 shadow-xl">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#B3702B]/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-[#8B5A2B]/15 to-transparent rounded-full blur-2xl translate-y-1/4 -translate-x-1/4" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#B3702B]/30 bg-[#B3702B]/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#B3702B]">
              <Sparkles className="size-3" />
              Client Dashboard
            </span>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              Welcome back, <span className="text-[#B3702B]">{user.name ?? user.email.split('@')[0]}</span>
            </h1>
            <p className="max-w-xl text-muted-foreground">
              Track your orders, view purchase history, and explore our latest collections.
              Your premium shopping experience starts here.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard
              icon={ShoppingBag}
              label="Total Orders"
              value={orders.length.toString()}
              color="text-[#B3702B]"
            />
            <StatCard
              icon={Truck}
              label="Delivered"
              value={fulfilledOrders.toString()}
              color="text-green-500"
            />
            <StatCard
              icon={Clock}
              label="In Progress"
              value={pendingOrders.toString()}
              color="text-blue-500"
              className="col-span-2 sm:col-span-1"
            />
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid gap-6 lg:grid-cols-[1fr,380px]">
        {/* Orders Section */}
        <div className="rounded-3xl border border-white/10 bg-background/80 backdrop-blur-sm p-6 md:p-8 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#B3702B]/10">
                <Package2 className="size-5 text-[#B3702B]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Order History</h2>
                <p className="text-sm text-muted-foreground">Track all your purchases</p>
              </div>
            </div>
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-full border border-[#B3702B]/30 bg-[#B3702B]/5 px-4 py-2 text-sm font-medium text-[#B3702B] transition-all hover:bg-[#B3702B] hover:text-white hover:shadow-lg hover:shadow-[#B3702B]/25"
            >
              Shop Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="No orders yet"
                description="Start shopping to see your orders here. We have amazing products waiting for you!"
                actionLabel="Browse Collection"
                actionHref="/"
              />
            ) : (
              orders.slice(0, 5).map((order: OrderRow) => {
                const style = statusStyles[order.status.toLowerCase()] || statusStyles.pending;
                return (
                  <div
                    key={order.id}
                    className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:border-[#B3702B]/30 hover:bg-[#B3702B]/5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dateFormatter.format(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${style.bg} ${style.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <p className="text-sm font-semibold text-foreground">{formatCurrency(order.total)}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {order.items.slice(0, 3).map((item: OrderItemRow) => (
                        <span
                          key={item.id}
                          className="inline-flex items-center rounded-lg bg-white/5 px-2.5 py-1 text-xs text-muted-foreground"
                        >
                          {item.quantity}× {item.product?.title ?? "Product"}
                        </span>
                      ))}
                      {order.items.length > 3 && (
                        <span className="inline-flex items-center rounded-lg bg-white/5 px-2.5 py-1 text-xs text-muted-foreground">
                          +{order.items.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {orders.length > 5 && (
              <button className="w-full py-3 text-sm text-muted-foreground hover:text-[#B3702B] transition-colors">
                View all {orders.length} orders
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Messages/Support Card */}
          <div className="rounded-3xl border border-white/10 bg-background/80 backdrop-blur-sm p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10">
                <MessageCircle className="size-5 text-cyan-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Need Help?</h2>
                <p className="text-xs text-muted-foreground">We're here for you</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Have questions about your order or need assistance? Our support team is ready to help.
            </p>

            <Link
              href="/contact"
              className="block w-full text-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-white/10 hover:border-[#B3702B]/30"
            >
              Contact Support
            </Link>
          </div>

          {/* Account Summary */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#B3702B]/10 to-transparent p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#B3702B]/20">
                <Star className="size-5 text-[#B3702B]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Your Account</h2>
                <p className="text-xs text-muted-foreground">Member since 2024</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Spent</span>
                <span className="font-semibold text-[#B3702B]">{formatCurrency(totalSpent)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Lifetime Orders</span>
                <span className="font-medium">{orders.length}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  color,
  className = ""
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-background/50 backdrop-blur-sm p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

// Empty State Component
function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: any;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#B3702B]/10 mb-4">
        <Icon className="w-8 h-8 text-[#B3702B]" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      <Link
        href={actionHref}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#B3702B] to-[#8B5A2B] px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#B3702B]/25 transition-all hover:shadow-[#B3702B]/40 hover:scale-105"
      >
        {actionLabel}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
