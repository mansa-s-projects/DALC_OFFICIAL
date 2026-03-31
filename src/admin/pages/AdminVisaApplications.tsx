'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileCheck,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Globe,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminEmptyState, AdminLoadingRows, AdminPageHeader, AdminSearchInput, AdminSelectFilter } from '../components';

// ─── Types ────────────────────────────────────────────────────────────────────

type VisaStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'completed';

interface VisaApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  passport_number: string;
  passport_country: string;
  destination_country: string;
  visa_status: string;
  notes: string | null;
  status: VisaStatus;
  created_at: string;
  updated_at?: string;
}

const STATUS_LABELS: Record<VisaStatus, string> = {
  pending: 'Pending',
  in_review: 'In Review',
  approved: 'Approved',
  rejected: 'Rejected',
  completed: 'Completed',
};

const STATUS_COLORS: Record<VisaStatus, string> = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25',
  in_review: 'text-blue-400 bg-blue-400/10 border-blue-400/25',
  approved: 'text-green-400 bg-green-400/10 border-green-400/25',
  rejected: 'text-red-400 bg-red-400/10 border-red-400/25',
  completed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25',
};

const STATUS_ICONS: Record<VisaStatus, React.ComponentType<{ className?: string }>> = {
  pending: Clock,
  in_review: AlertCircle,
  approved: CheckCircle2,
  rejected: XCircle,
  completed: CheckCircle2,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useVisaApplications() {
  const [data, setData] = useState<VisaApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!supabase) {
        setError('Supabase not configured');
        return;
      }
      const { data: rows, error: err } = await supabase
        .from('visa_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) {
        if (err.code === '42P01') {
          // Table doesn't exist yet — show empty state
          setData([]);
        } else {
          setError(err.message);
        }
        return;
      }

      setData((rows ?? []) as VisaApplication[]);
    } catch (e) {
      setError('Failed to load visa applications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { data, isLoading, error, refetch: load };
}

function useUpdateVisaStatus() {
  const [loading, setLoading] = useState(false);

  const update = async (id: string, status: VisaStatus): Promise<boolean> => {
    if (!supabase) return false;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('visa_applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      return !error;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading };
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: VisaStatus }) {
  const Icon = STATUS_ICONS[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider ${STATUS_COLORS[status]}`}>
      <Icon className="w-3 h-3" />
      {STATUS_LABELS[status]}
    </span>
  );
}

// ─── Application Row ──────────────────────────────────────────────────────────

function ApplicationRow({
  app,
  isExpanded,
  onToggle,
  onStatusChange,
}: {
  app: VisaApplication;
  isExpanded: boolean;
  onToggle: () => void;
  onStatusChange: (id: string, status: VisaStatus) => void;
}) {
  const date = new Date(app.created_at).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <motion.div
      layout
      className="rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden"
    >
      {/* Summary row */}
      <button
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
        onClick={onToggle}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-medium text-white truncate">{app.full_name}</span>
            <StatusBadge status={app.status} />
          </div>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {app.passport_country} → {app.destination_country}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {date}
            </span>
          </div>
        </div>
        <div className="text-xs text-white/30 border border-white/10 rounded px-2 py-1 shrink-0">
          {app.visa_status}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-white/30 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />
        )}
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2 border-t border-white/6 space-y-5">
              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Email</p>
                  <a
                    href={`mailto:${app.email}`}
                    className="flex items-center gap-2 text-sm text-[#C8A46B] hover:text-[#EFD7A4] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {app.email}
                  </a>
                </div>
                {app.phone && (
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Phone / WhatsApp</p>
                    <a
                      href={`https://wa.me/${app.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {app.phone}
                    </a>
                  </div>
                )}
              </div>

              {/* Passport */}
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Passport Number</p>
                <p className="text-sm text-white/80 font-mono">{app.passport_number}</p>
              </div>

              {/* Notes */}
              {app.notes && (
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-sm text-white/60 leading-relaxed">{app.notes}</p>
                </div>
              )}

              {/* Status updater */}
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(STATUS_LABELS) as VisaStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => onStatusChange(app.id, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all ${
                        app.status === s
                          ? STATUS_COLORS[s]
                          : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/70'
                      }`}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminVisaApplications() {
  const { data: applications, isLoading, error, refetch } = useVisaApplications();
  const { update } = useUpdateVisaStatus();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = applications.filter((a) => {
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        a.full_name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.passport_number.toLowerCase().includes(q) ||
        a.passport_country.toLowerCase().includes(q) ||
        a.destination_country.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = async (id: string, status: VisaStatus) => {
    const ok = await update(id, status);
    if (ok) refetch();
  };

  // Stats
  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    inReview: applications.filter(a => a.status === 'in_review').length,
    approved: applications.filter(a => a.status === 'approved').length,
  };

  return (
    <div>
      <AdminPageHeader title="Visa Applications" />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: stats.total, color: 'text-white' },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-400' },
          { label: 'In Review', value: stats.inReview, color: 'text-blue-400' },
          { label: 'Approved', value: stats.approved, color: 'text-green-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-2xl font-display ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <AdminSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name, email, passport..."
        />
        <AdminSelectFilter
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: 'all', label: 'All Status' },
            ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label })),
          ]}
        />
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-300 font-medium">Failed to load applications</p>
            <p className="text-xs text-red-400/70 mt-0.5">{error}</p>
            {error.includes('42P01') && (
              <p className="text-xs text-red-400/50 mt-1">
                The <code className="font-mono">visa_applications</code> table doesn&apos;t exist yet.
                Run the database migration to create it.
              </p>
            )}
          </div>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <AdminLoadingRows rowClassName="h-20" />
      ) : filtered.length === 0 ? (
        <AdminEmptyState
          message={
            applications.length === 0
              ? 'No visa applications yet. Applications submitted via the Visa Finder will appear here.'
              : 'No applications match your filters.'
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((app) => (
            <ApplicationRow
              key={app.id}
              app={app}
              isExpanded={expandedId === app.id}
              onToggle={() => setExpandedId(prev => prev === app.id ? null : app.id)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
