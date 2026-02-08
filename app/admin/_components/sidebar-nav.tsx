// app/admin/_components/sidebar-nav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Tags,
  Images,
  Home,
  FileText,
  ShoppingCart,
  MessageSquare,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils'; // if you don't have cn, replace cn(...) with string joins

type Item = {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const NAV_ITEMS: Item[] = [
  { href: '/admin/products', label: 'Products', Icon: Package },
  { href: '/admin/categories', label: 'Categories', Icon: Tags },
  { href: '/admin/media', label: 'Media', Icon: Images },
  { href: '/admin/journal', label: 'Blogs', Icon: FileText },
  { href: '/admin/orders', label: 'Orders', Icon: ShoppingCart },
  { href: '/admin/messages', label: 'Messages', Icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', Icon: Settings },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="w-full max-w-[240px] shrink-0 border-r bg-white/90">
      <div className="p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
          Admin
        </p>
      </div>

      <nav className="px-2 pb-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname?.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition',
                active
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// Minimal cn helper if you don't have one
// export function cn(...cls: Array<string | false | null | undefined>) {
//   return cls.filter(Boolean).join(' ');
// }
