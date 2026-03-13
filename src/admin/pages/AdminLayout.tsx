import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, MapPin, Inbox, Truck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/admin/requests', icon: Inbox, label: 'Requests', end: false },
  { to: '/admin/venues', icon: MapPin, label: 'Venues', end: false },
  { to: '/admin/suppliers', icon: Truck, label: 'Suppliers', end: false },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-luxury-black flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0D0D0D] flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-xs uppercase tracking-widest transition-colors mb-4">
            <ArrowLeft className="w-3 h-3" /> Back to Site
          </Link>
          <h1 className="text-xl font-display text-white">Admin</h1>
          <p className="text-gray-600 text-xs mt-1">Dubai À La Carte</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
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
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
