import { Inbox, MapPin, Truck, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useAdminStats } from '../../hooks/useAdmin';
import { isMockMode } from '../../lib/supabase';
import { AdminPageHeader, AdminStatCard } from '../components';

export default function AdminOverview() {
  const { data: stats, isLoading } = useAdminStats();

  if (isMockMode) {
    return (
      <div>
        <AdminPageHeader title="Dashboard" />
        <div className="p-8 border border-yellow-500/20 bg-yellow-500/5 rounded-sm">
          <p className="text-yellow-400 font-bold mb-2">Mock Mode Active</p>
          <p className="text-gray-400 text-sm">
            Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables to connect to your Supabase project and see live data.
          </p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Requests', value: stats?.totalRequests ?? 0, icon: Inbox, color: 'text-blue-400' },
    { label: 'Pending', value: stats?.pendingRequests ?? 0, icon: Clock, color: 'text-yellow-400' },
    { label: 'Confirmed', value: stats?.confirmedRequests ?? 0, icon: CheckCircle, color: 'text-green-400' },
    { label: 'Completed', value: stats?.completedRequests ?? 0, icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Venues', value: stats?.totalVenues ?? 0, icon: MapPin, color: 'text-luxury-gold' },
    { label: 'Suppliers', value: stats?.totalSuppliers ?? 0, icon: Truck, color: 'text-purple-400' },
    {
      label: 'Synced Services',
      value: stats?.syncedServices ?? 'N/A',
      icon: Inbox,
      color: stats?.syncedServices == null ? 'text-gray-400' : 'text-cyan-400',
    },
    {
      label: 'Synced Bookings',
      value: stats?.syncedBookings ?? 'N/A',
      icon: CheckCircle,
      color: stats?.syncedBookings == null ? 'text-gray-400' : 'text-emerald-400',
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        actions={
          <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-green-500">Live</span>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {statCards.map((stat, i) => (
          <AdminStatCard
            key={stat.label}
            label={stat.label}
            value={isLoading ? '—' : stat.value}
            icon={stat.icon}
            colorClass={stat.color}
            delay={i * 0.05}
          />
        ))}
      </div>
    </div>
  );
}
