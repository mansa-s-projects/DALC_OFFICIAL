import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Clock, AlertCircle, Zap, Star } from 'lucide-react';
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
import {
  CONCIERGE_TYPE_LABELS,
  type ConciergeRequestType,
  type ConciergeUrgency,
} from '../../features/concierge/types';

const STATUS_OPTIONS: RequestStatus[] = [
  'pending',
  'acknowledged',
  'submitted',
  'assigned',
  'supplier_contacted',
  'in_progress',
  'quoted',
  'confirmed',
  'declined',
  'completed',
  'cancelled',
];

const TYPE_OPTIONS = Object.entries(CONCIERGE_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const URGENCY_LABELS: Record<ConciergeUrgency, string> = {
  asap: 'ASAP',
  urgent: 'Urgent',
  standard: 'Standard',
};

function UrgencyBadge({ urgency }: { urgency?: string }) {
  if (!urgency) return null;

  const styles: Record<string, string> = {
    asap: 'bg-red-500/15 text-red-400 border-red-500/25',
    urgent: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    standard: 'bg-white/5 text-gray-400 border-white/10',
  };

  const labels: Record<string, string> = {
    asap: 'ASAP',
    urgent: 'Urgent',
    standard: 'Standard',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles[urgency] ?? styles.standard}`}
    >
      {urgency === 'asap' && <Zap className="w-2.5 h-2.5" />}
      {urgency === 'urgent' && <AlertCircle className="w-2.5 h-2.5" />}
      {urgency === 'standard' && <Clock className="w-2.5 h-2.5" />}
      {labels[urgency] ?? urgency}
    </span>
  );
}

export default function AdminConcierge() {
  const { data: allRequests = [], isLoading } = useAllRequests();
  const updateStatus = useUpdateRequestStatus();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [search, setSearch] = useState('');
  const { openId: expandedId, toggle } = useAdminDisclosure<string>();

  // Scoped to concierge category only
  const conciergeRequests = allRequests.filter((r) => r.category === 'concierge');

  const filtered = conciergeRequests.filter((r) => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (filterType !== 'all' && (r as any).concierge_request_type !== filterType) return false;
    if (filterUrgency !== 'all' && (r as any).urgency !== filterUrgency) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        (r.title ?? '').toLowerCase().includes(q) ||
        (r.description ?? '').toLowerCase().includes(q) ||
        (r.contact_name ?? '').toLowerCase().includes(q) ||
        (r.contact_info ?? '').toLowerCase().includes(q) ||
        ((r as any).special_instructions ?? '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Stat counts
  const asapCount = conciergeRequests.filter((r) => (r as any).urgency === 'asap').length;
  const inProgressCount = conciergeRequests.filter((r) => r.status === 'in_progress' || r.status === 'assigned').length;
  const completedCount = conciergeRequests.filter((r) => r.status === 'completed').length;

  const handleStatusChange = (requestId: string, newStatus: RequestStatus) => {
    const current = conciergeRequests.find((r) => r.id === requestId);
    if (!current) return;
    updateStatus.mutate({ id: requestId, status: newStatus, fromStatus: current.status });
  };

  return (
    <div>
      <AdminPageHeader title="Concierge Queue" />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
        <AdminStatCard
          label="Total Requests"
          value={conciergeRequests.length}
          icon={Star}
          colorClass="text-[#C8A46B]"
          delay={0}
        />
        <AdminStatCard
          label="ASAP"
          value={asapCount}
          icon={Zap}
          colorClass="text-red-400"
          delay={0.05}
        />
        <AdminStatCard
          label="In Progress"
          value={inProgressCount}
          icon={AlertCircle}
          colorClass="text-amber-400"
          delay={0.1}
        />
        <AdminStatCard
          label="Completed"
          value={completedCount}
          icon={Clock}
          colorClass="text-emerald-400"
          delay={0.15}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <AdminSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search concierge requests..."
        />
        <AdminSelectFilter
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: 'all', label: 'All Status' },
            ...STATUS_OPTIONS.map((s) => ({ value: s, label: REQUEST_STATUS_LABELS[s] })),
          ]}
        />
        <AdminSelectFilter
          value={filterType}
          onChange={setFilterType}
          options={[
            { value: 'all', label: 'All Types' },
            ...TYPE_OPTIONS,
          ]}
        />
        <AdminSelectFilter
          value={filterUrgency}
          onChange={setFilterUrgency}
          options={[
            { value: 'all', label: 'All Urgency' },
            ...Object.entries(URGENCY_LABELS).map(([value, label]) => ({ value, label })),
          ]}
        />
      </div>

      {/* Request List */}
      {isLoading ? (
        <AdminLoadingRows rowClassName="h-20" />
      ) : filtered.length === 0 ? (
        <AdminEmptyState message="No concierge requests found." />
      ) : (
        <div className="space-y-2">
          {filtered.map((request) => {
            const r = request as any;
            const typeLabel = r.concierge_request_type
              ? (CONCIERGE_TYPE_LABELS[r.concierge_request_type as ConciergeRequestType] ?? r.concierge_request_type)
              : 'Concierge';
            const isExpanded = expandedId === request.id;

            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-white/5 rounded-sm bg-white/[0.02] overflow-hidden"
              >
                {/* Row Header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.03] transition-colors"
                  onClick={() => toggle(request.id)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-bold truncate">
                          {request.title || typeLabel}
                        </p>
                        <UrgencyBadge urgency={r.urgency} />
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {request.contact_name || 'No contact'} &middot; {typeLabel} &middot;{' '}
                        {r.preferred_date
                          ? new Date(r.preferred_date).toLocaleDateString()
                          : 'No date'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <RequestStatusBadge status={request.status} />
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Detail */}
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
                        <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Request Type</span>
                        <span className="text-white">{typeLabel}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Urgency</span>
                        <UrgencyBadge urgency={r.urgency} />
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Preferred Date</span>
                        <span className="text-white">
                          {r.preferred_date ? new Date(r.preferred_date).toLocaleDateString() : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Preferred Time</span>
                        <span className="text-white">{r.preferred_time || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Budget Range</span>
                        <span className="text-white">{r.budget_range || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Priority Score</span>
                        <span className="text-white">{request.priority_score ?? 0}</span>
                      </div>
                      {(request.description || r.notes) && (
                        <div className="col-span-2 lg:col-span-3">
                          <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Description</span>
                          <span className="text-white">{request.description || r.notes}</span>
                        </div>
                      )}
                      {r.special_instructions && (
                        <div className="col-span-2 lg:col-span-3">
                          <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Special Instructions</span>
                          <span className="text-[#EFD7A4]">{r.special_instructions}</span>
                        </div>
                      )}
                    </div>

                    {/* Status Transitions */}
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
