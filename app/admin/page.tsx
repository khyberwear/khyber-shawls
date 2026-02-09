// // // // export const runtime = 'edge';
import Link from "next/link";
import {
  Package,
  Tags,
  Images,
  FileText,
  ShoppingCart,
  MessageSquare,
  Users,
  Settings,
  TrendingUp,
  ArrowUpRight,
  LayoutDashboard
} from "lucide-react";

const ADMIN_SECTIONS = [
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
    description: "Manage your product catalog, prices, and inventory",
    color: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-500",
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: Tags,
    description: "Organize products into categories and collections",
    color: "from-purple-500/20 to-purple-600/5",
    iconColor: "text-purple-500",
  },
  {
    href: "/admin/media",
    label: "Media",
    icon: Images,
    description: "Manage images, hero banners, and media content",
    color: "from-pink-500/20 to-pink-600/5",
    iconColor: "text-pink-500",
  },
  {
    href: "/admin/journal",
    label: "Blog",
    icon: FileText,
    description: "Create and manage blog posts and articles",
    color: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-500",
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ShoppingCart,
    description: "View and manage customer orders",
    color: "from-orange-500/20 to-orange-600/5",
    iconColor: "text-orange-500",
  },
  {
    href: "/admin/messages",
    label: "Messages",
    icon: MessageSquare,
    description: "Customer inquiries and contact messages",
    color: "from-cyan-500/20 to-cyan-600/5",
    iconColor: "text-cyan-500",
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
    description: "Manage user accounts and admin permissions",
    color: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-500",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
    description: "Configure store settings and preferences",
    color: "from-slate-500/20 to-slate-600/5",
    iconColor: "text-slate-400",
  },
];

export default function AdminPage() {
  return (
    <div className="min-h-[80vh] space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#B3702B]/10 via-background to-[#8B5A2B]/5 p-8 md:p-10">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#B3702B]/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#8B5A2B]/15 to-transparent rounded-full blur-2xl translate-y-1/4 -translate-x-1/4" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B3702B] to-[#8B5A2B] shadow-lg shadow-[#B3702B]/25">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#B3702B]/10 border border-[#B3702B]/20 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#B3702B]">
                Admin Panel
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Welcome to your Dashboard
            </h1>
            <p className="text-muted-foreground max-w-lg">
              Manage your store, products, orders, and customers all from one place.
              Select a section below to get started.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4">
            <div className="rounded-2xl border border-white/10 bg-background/50 backdrop-blur-sm p-4 min-w-[120px]">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                <span>Quick Access</span>
              </div>
              <p className="text-2xl font-semibold">{ADMIN_SECTIONS.length}</p>
              <p className="text-xs text-muted-foreground">Sections</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Sections Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ADMIN_SECTIONS.map(({ href, label, icon: Icon, description, color, iconColor }) => (
          <Link
            key={href}
            href={href}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-background/80 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 
                     hover:border-[#B3702B]/40 hover:shadow-xl hover:shadow-[#B3702B]/5 hover:-translate-y-1"
          >
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            {/* Content */}
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 ${iconColor} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-[#B3702B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </div>

              <h2 className="text-lg font-semibold mb-2 group-hover:text-[#B3702B] transition-colors duration-300">
                {label}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            {/* Bottom border accent on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#B3702B] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        ))}
      </div>

      {/* Footer hint */}
      <div className="text-center pt-4">
        <p className="text-sm text-muted-foreground/60">
          Need help? Check out the{' '}
          <a href="#" className="text-[#B3702B] hover:underline underline-offset-4">documentation</a>
          {' '}or contact support.
        </p>
      </div>
    </div>
  );
}
