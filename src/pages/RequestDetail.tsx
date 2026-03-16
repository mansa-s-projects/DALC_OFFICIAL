import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ClipboardList, Clock3, Mail, MapPin, MessageSquareText, Phone, Users } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import ErrorState from '../components/error/ErrorState';
import RequestStatusBadge from '../components/requests/RequestStatusBadge';
import { REQUEST_STATUS_LABELS, type Request } from '../types';
import { useRequestDetail } from '../hooks/useRequests';
import { useAppStore } from '../store/useAppStore';
import { hydrateTimeline } from '../platform/requests/timeline';

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;

  return (
    <div className="border-b border-white/5 py-4 last:border-b-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gray-500 mb-2">{label}</p>
      <p className="text-sm text-white leading-relaxed">{value}</p>
    </div>
  );
}

export default function RequestDetail() {
  const { id } = useParams();
  const location = useLocation();
  const session = useAppStore((s) => s.session);
  const initialRequest = (location.state as { request?: Request } | null)?.request ?? null;
  const userId = session?.user?.id;
  const detailQuery = useRequestDetail(id, userId, initialRequest);
  const request = detailQuery.data?.request ?? initialRequest;
  const statusLog = detailQuery.data?.statusLog ?? [];

  const timeline = request
    ? hydrateTimeline(
        (statusLog.length > 0
          ? statusLog
          : [{
              id: `fallback-${request.id}`,
              request_id: request.id,
              old_status: null,
              new_status: request.status,
              changed_by: null,
              notes: request.notes ?? null,
              created_at: request.created_at || new Date().toISOString(),
            }]).map((entry) => ({
          id: entry.id,
          request_id: entry.request_id,
          old_status: entry.old_status ?? null,
          new_status: entry.new_status,
          changed_by: entry.changed_by ?? null,
          notes: entry.notes ?? null,
          created_at: entry.created_at,
        })),
        request.status
      )
    : [];

  const summaryTitle = request?.title || request?.venue_name || request?.category || 'Request';
  const guestCount = Math.max(request?.party_size || 0, 1);
  const submittedDate = request?.created_at ? new Date(request.created_at).toLocaleString() : null;
  const preferredDate = request?.date_time
    ? new Date(request.date_time).toLocaleString()
    : request?.preferred_date || null;
  const contactValue = request?.contact_info || null;
  const contactLabel = contactValue?.includes('@') ? 'Email' : 'Contact';

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto">
        <div className="mb-10 flex items-center gap-3 text-sm">
          <Link to="/my-requests" className="text-gray-500 hover:text-luxury-gold transition-colors inline-flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to My Requests
          </Link>
        </div>

        {detailQuery.isLoading && (
          <div className="space-y-6">
            <div className="h-40 bg-white/5 rounded-sm animate-pulse" />
            <div className="h-64 bg-white/5 rounded-sm animate-pulse" />
          </div>
        )}

        {detailQuery.error && (
          <ErrorState
            message={detailQuery.error instanceof Error ? detailQuery.error.message : 'Failed to load request details.'}
            retry={() => detailQuery.refetch()}
          />
        )}

        {!detailQuery.isLoading && !detailQuery.error && !request && (
          <ErrorState message="This request could not be found or is no longer available." />
        )}

        {!detailQuery.isLoading && !detailQuery.error && request && (
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-sm border border-white/5 p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                <div>
                  <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.32em] mb-3">Request Detail</p>
                  <h1 className="text-3xl md:text-4xl font-display text-white mb-3">{summaryTitle}</h1>
                  <p className="text-gray-400 text-sm uppercase tracking-[0.22em]">
                    {request.concierge_request_type ?? request.request_type}
                  </p>
                </div>
                <RequestStatusBadge status={request.status} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="border border-white/5 rounded-sm p-4 bg-white/[0.02]">
                  <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-[0.24em] mb-2">
                    <Calendar className="w-4 h-4 text-luxury-gold" />
                    Preferred Time
                  </div>
                  <p className="text-white text-sm">{preferredDate || 'TBD'}</p>
                </div>

                <div className="border border-white/5 rounded-sm p-4 bg-white/[0.02]">
                  <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-[0.24em] mb-2">
                    <Users className="w-4 h-4 text-luxury-gold" />
                    Guests
                  </div>
                  <p className="text-white text-sm">{guestCount} guests</p>
                </div>
              </div>

              <div className="border border-white/5 rounded-sm p-6 bg-white/[0.02] mb-8">
                <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-[0.24em] mb-4">
                  <ClipboardList className="w-4 h-4 text-luxury-gold" />
                  Request Summary
                </div>
                <DetailRow label="Venue" value={request.venue_name} />
                <DetailRow label="Description" value={request.description} />
                <DetailRow label="Notes" value={request.notes} />
                <DetailRow label="Special Instructions" value={request.special_instructions} />
                <DetailRow label="Budget Range" value={request.budget_range} />
                <DetailRow label="Urgency" value={request.urgency ? request.urgency.toUpperCase() : null} />
                <DetailRow label="Internal Concierge Notes" value={request.concierge_notes} />
              </div>

              <div className="border border-white/5 rounded-sm p-6 bg-white/[0.02]">
                <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-[0.24em] mb-4">
                  <Clock3 className="w-4 h-4 text-luxury-gold" />
                  Status Timeline
                </div>

                <div className="space-y-5">
                  {timeline.map((entry, index, arr) => (
                    <div key={`${entry.status}-${index}`} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full mt-1 ${entry.isActive ? 'bg-luxury-gold' : entry.isPast ? 'bg-white/80' : 'bg-white/20'}`} />
                        {index < arr.length - 1 && <div className="w-px flex-1 bg-white/10 mt-2" />}
                      </div>
                      <div className="pb-5">
                        <p className="text-white text-sm font-semibold">{entry.label || (REQUEST_STATUS_LABELS[entry.status as keyof typeof REQUEST_STATUS_LABELS] ?? entry.status)}</p>
                        {entry.timestamp ? <p className="text-gray-500 text-xs mt-1">{new Date(entry.timestamp).toLocaleString()}</p> : null}
                        {entry.notes && <p className="text-gray-400 text-sm mt-2 leading-relaxed">{entry.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="space-y-6"
            >
              <div className="glass-panel rounded-sm border border-white/5 p-6">
                <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.32em] mb-4">Contact</p>
                <div className="space-y-4 text-sm text-gray-300">
                  {request.contact_name && (
                    <div className="flex items-start gap-3">
                      <MessageSquareText className="w-4 h-4 text-luxury-gold mt-0.5" />
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-[0.22em] mb-1">Name</p>
                        <p className="text-white">{request.contact_name}</p>
                      </div>
                    </div>
                  )}

                  {contactValue && (
                    <div className="flex items-start gap-3">
                      {contactValue.includes('@') ? <Mail className="w-4 h-4 text-luxury-gold mt-0.5" /> : <Phone className="w-4 h-4 text-luxury-gold mt-0.5" />}
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-[0.22em] mb-1">{contactLabel}</p>
                        <p className="text-white break-all">{contactValue}</p>
                      </div>
                    </div>
                  )}

                  {request.venue_name && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-luxury-gold mt-0.5" />
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-[0.22em] mb-1">Venue</p>
                        <p className="text-white">{request.venue_name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="glass-panel rounded-sm border border-white/5 p-6">
                <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.32em] mb-4">Meta</p>
                <div className="space-y-4 text-sm">
                  <DetailRow label="Submitted" value={submittedDate} />
                  <DetailRow label="Request ID" value={request.id} />
                  <DetailRow label="Category" value={request.category} />
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}