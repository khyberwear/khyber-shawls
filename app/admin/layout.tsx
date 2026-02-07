// app/admin/layout.tsx
import type { ReactNode } from 'react';
import { requireAdmin } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin(); // redirects if not ADMIN
  return <>{children}</>;
}
