import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, MapPin, Inbox, Truck, Star, ArrowLeft, Car, Compass, Briefcase, Hotel } from 'lucide-react';
import { Link } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/admin/overview',     icon: LayoutDashboard, label: 'Overview',     end: false },
  { to: '/admin/requests',     icon: Inbox,           label: 'All Requests', end: false },
  { to: '/admin/concierge',    icon: Star,            label: 'Concierge',    end: false },
  { to: '/admin/transport',    icon: Car,             label: 'Transport',    end: false },
  { to: '/admin/experiences',  icon: Compass,         label: 'Experiences',  end: false },
  { to: '/admin/business',     icon: Briefcase,       label: 'Business',     end: false },
  { to: '/admin/stays',        icon: Hotel,           label: 'Stays',        end: false },
  { to: '/admin/venues',       icon: MapPin,          label: 'Venues',       end: false },
  { to: '/admin/suppliers',    icon: Truck,           label: 'Suppliers',    end: false },
];

export default function AdminLayout() {
  return (
    <div className="relative flex min-h-screen bg-[#050607] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(200,164,107,0.09),transparent_28%),radial-gradient(circle_at_85%_12%,rgba(142,168,194,0.09),transparent_24%)]" />
      {/* Sidebar */}
      <aside className="relative z-10 flex w-72 shrink-0 flex-col border-r border-[#C8A46B]/12 bg-[linear-gradient(180deg,rgba(10,10,10,0.98),rgba(17,18,20,0.92))] backdrop-blur-xl">
        <div className="border-b border-[#C8A46B]/12 p-6">
          <Link to="/" className="mb-5 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gray-400 transition-colors hover:text-[#EFD7A4]">
            <ArrowLeft className="w-3 h-3" /> Back to Site
          </Link>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#C8A46B]/75">Control Room</p>
          <h1 className="mt-2 text-2xl font-display text-[#F2DFB8]">Admin</h1>
          <p className="mt-1 text-xs text-gray-500">Dubai A La Carte</p>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'border-[#C8A46B]/35 bg-[#C8A46B]/10 text-[#EFD7A4] shadow-[0_10px_30px_rgba(200,164,107,0.08)]'
                    : 'border-transparent text-gray-400 hover:border-white/8 hover:bg-white/[0.03] hover:text-white'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-auto">
        <div className="max-w-7xl p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
