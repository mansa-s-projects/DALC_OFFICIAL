import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useAllRequests, useUpdateRequestStatus } from '../../hooks/useRequests';
import { RequestStatus, REQUEST_STATUS_LABELS } from '../../types';
import { getAllowedNextStatuses } from '../../platform/requests/lifecycle';
import RequestStatusBadge from '../../components/requests/RequestStatusBadge';
import { AdminEmptyState, AdminLoadingRows, AdminPageHeader, AdminSearchInput, AdminSelectFilter } from '../components';
import { useAdminDisclosure } from '../hooks';

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

export default function AdminRequests() {
  const { data: requests = [], isLoading } = useAllRequests();
  const updateStatus = useUpdateRequestStatus();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const { openId: expandedId, toggle } = useAdminDisclosure<string>();

  const filtered = requests.filter((r) => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        (r.title ?? '').toLowerCase().includes(q) ||
        (r.description ?? '').toLowerCase().includes(q) ||
        (r.venue_name ?? '').toLowerCase().includes(q) ||
        (r.contact_name ?? '').toLowerCase().includes(q) ||
        (r.contact_info ?? '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = (requestId: string, newStatus: RequestStatus) => {
    const current = requests.find((r) => r.id === requestId);
    if (!current) return;
    updateStatus.mutate({ id: requestId, status: newStatus, fromStatus: current.status });
  };

  return (
    <div>
      <AdminPageHeader title="Requests" />

      {/* Filters */}
      <div className="flex gap-4 mb-8">
        <AdminSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search requests..."
        />
        <AdminSelectFilter
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: 'all', label: 'All Status' },
            ...STATUS_OPTIONS.map((status) => ({ value: status, label: REQUEST_STATUS_LABELS[status] })),
          ]}
        />
      </div>

      {/* Request List */}
      {isLoading ? (
        <AdminLoadingRows rowClassName="h-20" />
      ) : filtered.length === 0 ? (
        <AdminEmptyState message="No requests found." />
      ) : (
        <div className="space-y-2">
          {filtered.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-white/5 rounded-sm bg-white/[0.02] overflow-hidden"
            >
              {/* Row */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.03] transition-colors"
                onClick={() => toggle(request.id)}
              >
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-bold truncate">
                      {request.title || request.venue_name || request.category}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {request.contact_name || 'No contact'} &middot; {Math.max(request.party_size || 0, 1)} guests &middot;{' '}
                      {request.date_time ? new Date(request.date_time).toLocaleDateString() : 'TBD'}
                    </p>
                  </div>
                  <RequestStatusBadge status={request.status} />
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expandedId === request.id ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Expanded Detail */}
              {expandedId === request.id && (
                <div className="border-t border-white/5 p-6 bg-white/[0.01]">
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                      <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Contact</span>
                      <span className="text-white">{request.contact_name || '—'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Contact Info</span>
                      <span className="text-white">{request.contact_info || '—'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Type</span>
                      <span className="text-white capitalize">{request.concierge_request_type ?? request.request_type ?? 'booking'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Priority</span>
                      <span className="text-white">{request.priority_score}</span>
                    </div>
                    {(request.description || request.notes) && (
                      <div className="col-span-2">
                        <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Details</span>
                        <span className="text-white">{request.description || request.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Status Actions */}
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
          ))}
        </div>
      )}
    </div>
  );
}
