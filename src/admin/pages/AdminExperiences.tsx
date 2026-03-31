import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ChevronDown, Compass, Waves, Heart, CheckCircle, TrendingUp, Plus } from 'lucide-react';
import { useAllRequests, useUpdateRequestStatus } from '../../hooks/useRequests';
import { RequestStatus, REQUEST_STATUS_LABELS } from '../../types';
import { getAllowedNextStatuses } from '../../platform/requests/lifecycle';
import RequestStatusBadge from '../../components/requests/RequestStatusBadge';
import {
  AdminEmptyState,
  AdminLoadingRows,
  AdminPageHeader,
  AdminSearchInput,
  AdminSelectFilter,
  AdminStatCard,
} from '../components';
import { useAdminDisclosure } from '../hooks';

const EXPERIENCE_CATEGORIES = ['experiences', 'wellness', 'sports', 'events'] as const;

const CATEGORY_LABELS: Record<string, string> = {
  experiences: 'Experiences',
  wellness: 'Wellness',
  sports: 'Sports',
  events: 'Events',
};

const STATUS_OPTIONS: RequestStatus[] = [
  'pending', 'acknowledged', 'submitted', 'assigned',
  'supplier_contacted', 'in_progress', 'quoted', 'confirmed',
  'declined', 'completed', 'cancelled',
];

export default function AdminExperiences() {
  const { data: allRequests = [], isLoading } = useAllRequests();
  const updateStatus = useUpdateRequestStatus();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const { openId: expandedId, toggle } = useAdminDisclosure<string>();

  const expRequests = allRequests.filter((r) =>
    EXPERIENCE_CATEGORIES.includes(r.category as any)
  );

  const filtered = expRequests.filter((r) => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (filterCategory !== 'all' && r.category !== filterCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        (r.title ?? '').toLowerCase().includes(q) ||
        (r.venue_name ?? '').toLowerCase().includes(q) ||
        (r.contact_name ?? '').toLowerCase().includes(q) ||
        (r.description ?? '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const inProgressCount = expRequests.filter((r) => r.status === 'in_progress' || r.status === 'assigned').length;
  const confirmedCount = expRequests.filter((r) => r.status === 'confirmed').length;
  const wellnessCount = expRequests.filter((r) => r.category === 'wellness').length;

  const handleStatusChange = (requestId: string, newStatus: RequestStatus) => {
    const current = expRequests.find((r) => r.id === requestId);
    if (!current) return;
    updateStatus.mutate({ id: requestId, status: newStatus, fromStatus: current.status });
  };

  return (
    <div>
      <AdminPageHeader 
        title="Experiences Queue"
        actions={
          <Link
            href="/admin/experiences/new"
            className="flex items-center gap-2 px-5 py-3 bg-luxury-gold text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Experience
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
        <AdminStatCard label="Total" value={expRequests.length} icon={Compass} colorClass="text-[#C8A46B]" delay={0} />
        <AdminStatCard label="In Progress" value={inProgressCount} icon={TrendingUp} colorClass="text-amber-400" delay={0.05} />
        <AdminStatCard label="Confirmed" value={confirmedCount} icon={CheckCircle} colorClass="text-emerald-400" delay={0.1} />
        <AdminStatCard label="Wellness" value={wellnessCount} icon={Heart} colorClass="text-rose-400" delay={0.15} />
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <AdminSearchInput value={search} onChange={setSearch} placeholder="Search experience requests..." />
        <AdminSelectFilter
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: 'all', label: 'All Status' },
            ...STATUS_OPTIONS.map((s) => ({ value: s, label: REQUEST_STATUS_LABELS[s] })),
          ]}
        />
        <AdminSelectFilter
          value={filterCategory}
          onChange={setFilterCategory}
          options={[
            { value: 'all', label: 'All Types' },
            ...EXPERIENCE_CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] })),
          ]}
        />
      </div>

      {isLoading ? (
        <AdminLoadingRows rowClassName="h-20" />
      ) : filtered.length === 0 ? (
        <AdminEmptyState message="No experience requests found." />
      ) : (
        <div className="space-y-2">
          {filtered.map((request) => {
            const isExpanded = expandedId === request.id;
            const categoryLabel = CATEGORY_LABELS[request.category] ?? request.category;

            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-white/5 rounded-sm bg-white/[0.02] overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.03] transition-colors"
                  onClick={() => toggle(request.id)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-bold truncate">
                        {request.title || request.venue_name || categoryLabel}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {request.contact_name || 'No contact'} &middot; {categoryLabel} &middot;{' '}
                        {Math.max(request.party_size || 0, 1)} guests &middot;{' '}
                        {request.preferred_date
                          ? new Date(request.preferred_date).toLocaleDateString()
                          : request.date_time
                          ? new Date(request.date_time).toLocaleDateString()
                          : 'No date'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <RequestStatusBadge status={request.status} />
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-white/5 p-6 bg-white/[0.01]">
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm lg:grid-cols-3">
                      <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Contact</span>
                        <span className="text-white">{request.contact_name || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Contact Info</span>
                        <span className="text-white">{request.contact_info || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Experience</span>
                        <span className="text-white">{request.venue_name || categoryLabel}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Date</span>
                        <span className="text-white">
                          {request.preferred_date
                            ? new Date(request.preferred_date).toLocaleDateString()
                            : request.date_time
                            ? new Date(request.date_time).toLocaleDateString()
                            : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Guests</span>
                        <span className="text-white">{request.party_size || 1}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Budget</span>
                        <span className="text-white">{request.budget_range || '—'}</span>
                      </div>
                      {(request.description || request.notes) && (
                        <div className="col-span-2 lg:col-span-3">
                          <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Details</span>
                          <span className="text-white">{request.description || request.notes}</span>
                        </div>
                      )}
                      {request.special_instructions && (
                        <div className="col-span-2 lg:col-span-3">
                          <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Special Instructions</span>
                          <span className="text-[#EFD7A4]">{request.special_instructions}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="text-gray-500 text-xs uppercase tracking-wider block mb-3">Update Status</span>
                      <div className="flex flex-wrap gap-2">
                        {getAllowedNextStatuses(request.status).map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(request.id, s)}
                            disabled={updateStatus.isPending}
                            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-white/10 text-gray-400 hover:text-white hover:border-luxury-gold/30 rounded-sm transition-colors disabled:opacity-50"
                          >
                            {REQUEST_STATUS_LABELS[s]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
