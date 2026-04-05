'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowLeft,
  Briefcase,
  Car,
  Compass,
  FileCheck,
  Hotel,
  Inbox,
  LayoutDashboard,
  MapPin,
  Star,
  Truck,
} from 'lucide-react';
import AdminGuard from '@/components/auth/AdminGuard';

const NAV_ITEMS = [
  { href: '/admin/overview', icon: LayoutDashboard, label: 'Overview' },
  { href: '/admin/requests', icon: Inbox, label: 'All Requests' },
  { href: '/admin/concierge', icon: Star, label: 'Concierge' },
  { href: '/admin/transport', icon: Car, label: 'Transport' },
  { href: '/admin/experiences', icon: Compass, label: 'Experiences' },
  { href: '/admin/business', icon: Briefcase, label: 'Business' },
  { href: '/admin/stays', icon: Hotel, label: 'Travel Stays' },
  { href: '/admin/venues', icon: MapPin, label: 'Venues' },
  { href: '/admin/suppliers', icon: Truck, label: 'Suppliers' },
  { href: '/admin/visas', icon: FileCheck, label: 'Visa Applications' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AdminGuard>
      <div className="relative flex min-h-screen bg-[#050607] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(200,164,107,0.09),transparent_28%),radial-gradient(circle_at_85%_12%,rgba(142,168,194,0.09),transparent_24%)]" />

        <aside className="relative z-10 flex w-72 shrink-0 flex-col border-r border-[#C8A46B]/12 bg-[linear-gradient(180deg,rgba(10,10,10,0.98),rgba(17,18,20,0.92))] backdrop-blur-xl">
          <div className="border-b border-[#C8A46B]/12 p-6">
            <Link
              href="/"
              className="mb-5 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gray-400 transition-colors hover:text-[#EFD7A4]"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to Site
            </Link>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#C8A46B]/75">Control Room</p>
            <h1 className="mt-2 text-2xl font-display text-[#F2DFB8]">Admin</h1>
            <p className="mt-1 text-xs text-gray-500">Dubai A La Carte</p>
          </div>

          <nav className="flex-1 space-y-2 p-4">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'border-[#C8A46B]/35 bg-[#C8A46B]/10 text-[#EFD7A4] shadow-[0_10px_30px_rgba(200,164,107,0.08)]'
                      : 'border-transparent text-gray-400 hover:border-white/8 hover:bg-white/[0.03] hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="relative z-10 flex-1 overflow-auto">
          <div className="max-w-7xl p-8 lg:p-10">{children}</div>
        </main>
      </div>
    </AdminGuard>
  );
}
