// // // // export const runtime = 'edge';
import Link from "next/link";
import { 
  Package, 
  Tags, 
  Images, 
  FileText, 
  ShoppingCart, 
  MessageSquare 
} from "lucide-react";

import { Users } from "lucide-react";

const ADMIN_SECTIONS = [
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
    description: "Manage your product catalog, prices, and inventory",
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: Tags,
    description: "Organize products into categories and collections",
  },
  {
    href: "/admin/media",
    label: "Media",
    icon: Images,
    description: "Manage images, hero banners, and media content",
  },
  {
    href: "/admin/journal",
    label: "Blog",
    icon: FileText,
    description: "Create and manage blog posts and articles",
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ShoppingCart,
    description: "View and manage customer orders",
  },
  {
    href: "/admin/messages",
    label: "Messages",
    icon: MessageSquare,
    description: "Customer inquiries and contact messages",
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
    description: "Manage user accounts and admin permissions",
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-8 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome to your admin dashboard. Manage your store from here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ADMIN_SECTIONS.map(({ href, label, icon: Icon, description }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-lg border border-white/10 bg-background/90 p-6 shadow-lg transition-all hover:border-amber-700/40 hover:bg-amber-700/5"
          >
            <div className="flex items-center gap-3">
              <Icon className="h-6 w-6 text-amber-700" />
              <h2 className="text-lg font-semibold">{label}</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}


