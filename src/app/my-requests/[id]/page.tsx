'use client'

import { use, useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import Link from 'next/link'

interface Request {
  id: string
  category: string
  request_type?: string
  venue_name?: string
  status: string
  priority?: string
  priority_score?: number
  party_size?: number
  date_time?: string
  contact_name?: string
  contact_info?: string
  notes?: string
  internal_notes?: string
  assigned_to?: string
  created_at: string
  updated_at?: string
  quotes?: Array<{
    id: string
    amount_aed: number
    status: string
    notes?: string
    expires_at?: string
  }>
  payments?: Array<{
    id: string
    amount_aed: number
    status: string
    payment_type: string
    created_at: string
  }>
  request_status_log?: Array<{
    new_status: string
    created_at: string
    notes?: string
  }>
}

const STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-gray-700 text-gray-200',
  assigned: 'bg-blue-900 text-blue-200',
  quoted: 'bg-amber-900 text-amber-200',
  confirmed: 'bg-green-900 text-green-200',
  completed: 'bg-emerald-900 text-emerald-200',
  declined: 'bg-red-900 text-red-200',
}

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Pending Review',
  assigned: 'Assigned to Concierge',
  quoted: 'Quote Ready',
  confirmed: 'Confirmed',
  completed: 'Completed',
  declined: 'Declined',
}

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[status] ?? STATUS_COLORS.submitted}`}>
    {STATUS_LABELS[status] ?? status}
  </span>
)

const StatusTimeline = ({ logs }: { logs: NonNullable<Request['request_status_log']> }) => {
  if (!logs.length) return null
  return (
    <div className="mt-8 border-l-2 border-[#C8A96E] pl-6 space-y-4">
      <h3 className="text-lg font-semibold text-[#C8A96E] mb-4">Activity Timeline</h3>
      {logs.map((log, idx) => (
        <div key={idx} className="relative pb-4">
          <div className="absolute -left-8 w-4 h-4 bg-[#C8A96E] rounded-full mt-1" />
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
            <p className="text-sm font-medium text-white">{STATUS_LABELS[log.new_status] ?? log.new_status}</p>
            <p className="text-xs text-gray-400 mt-1">
              {format(new Date(log.created_at), 'MMM dd, yyyy h:mm a')}
            </p>
            {log.notes && <p className="text-xs text-gray-500 mt-1">{log.notes}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function RequestDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const paymentStatus = searchParams.get('payment')
  const [request, setRequest] = useState<Request | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const fetchRequest = useCallback(async () => {
    const res = await fetch(`/api/requests/${id}`)
    if (!res.ok) {
      setNotFound(true)
      setLoading(false)
      return
    }
    const data: Request = await res.json()
    if (data.request_status_log) {
      data.request_status_log.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    }
    setRequest(data)
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchRequest()

    const channel = supabase
      .channel(`req_detail_${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'requests', filter: `id=eq.${id}` }, () => fetchRequest())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'quotes', filter: `request_id=eq.${id}` }, () => fetchRequest())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'request_status_log', filter: `request_id=eq.${id}` }, () => fetchRequest())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [id, fetchRequest])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <div className="text-[#C8A96E]">Loading...</div>
      </div>
    )
  }

  if (notFound || !request) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <div className="text-red-500">Request not found</div>
      </div>
    )
  }

  const displayTitle = request.venue_name ?? request.category
  const activeQuote = request.quotes?.find(q => ['sent', 'draft'].includes(q.status)) ?? request.quotes?.[0]

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/my-requests" className="text-[#C8A96E] text-sm hover:underline mb-8 inline-block">
          ← Back to Requests
        </Link>

        {/* Payment result banners */}
        {paymentStatus === 'success' && (
          <div className="bg-green-900/30 border border-green-700 rounded-xl p-4 mb-8 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-green-300 font-semibold">Payment confirmed</p>
              <p className="text-green-400/70 text-sm">Your concierge will be in touch shortly.</p>
            </div>
          </div>
        )}
        {paymentStatus === 'cancelled' && (
          <div className="bg-amber-900/30 border border-amber-700 rounded-xl p-4 mb-8 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-amber-300 font-semibold">Payment was not completed</p>
              <p className="text-amber-400/70 text-sm">You can try again or contact your concierge.</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-[#C8A96E] mb-2">{displayTitle}</h1>
              <p className="text-gray-400 text-sm">{request.category.toUpperCase()} • {request.id}</p>
            </div>
            <StatusBadge status={request.status} />
          </div>
          {request.notes && <p className="text-gray-300 mt-4">{request.notes}</p>}
        </div>

        {/* Request Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {request.date_time && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Date & Time</p>
              <p className="text-white font-medium mt-1">
                {format(new Date(request.date_time), 'MMM dd, yyyy h:mm a')}
              </p>
            </div>
          )}
          {request.party_size && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Party Size</p>
              <p className="text-white font-medium mt-1">{request.party_size} people</p>
            </div>
          )}
          {request.priority && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Priority</p>
              <p className="text-white font-medium mt-1">{request.priority}</p>
            </div>
          )}
          {request.contact_name && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Contact</p>
              <p className="text-white font-medium mt-1">{request.contact_name}</p>
            </div>
          )}
        </div>

        {/* Active Quote Card */}
        {activeQuote && (
          <div className="bg-gradient-to-br from-[#C8A96E]/10 to-transparent border border-[#C8A96E]/30 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-[#C8A96E] mb-4">Quote</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Amount</p>
                <p className="text-2xl font-bold text-white mt-2">
                  AED {activeQuote.amount_aed.toLocaleString()}
                </p>
              </div>
              {activeQuote.expires_at && (
                <div>
                  <p className="text-gray-400 text-sm">Valid Until</p>
                  <p className="text-white font-medium mt-2">
                    {format(new Date(activeQuote.expires_at), 'MMM dd, yyyy')}
                  </p>
                </div>
              )}
              <div className="flex items-end">
                <Link
                  href={`/my-requests/${request.id}/pay`}
                  className="w-full bg-[#C8A96E] text-[#070707] font-semibold py-3 rounded-lg hover:bg-[#D4B886] transition text-center block"
                >
                  Pay Now
                </Link>
              </div>
            </div>
            {activeQuote.notes && (
              <p className="text-gray-300 text-sm mt-4">{activeQuote.notes}</p>
            )}
          </div>
        )}

        {/* Concierge Contact */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
          <div className="flex gap-4">
            <a
              href={`https://wa.me/${request.contact_info ?? ''}?text=Hi%20DALC%2C%20about%20my%20request%20${request.id}`}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition text-center"
            >
              💬 WhatsApp
            </a>
            <button className="flex-1 border border-[#C8A96E] text-[#C8A96E] hover:bg-[#C8A96E]/10 font-semibold py-3 rounded-lg transition">
              📞 Call Concierge
            </button>
          </div>
        </div>

        {/* Activity Timeline */}
        <StatusTimeline logs={request.request_status_log ?? []} />
      </div>
    </div>
  )
}
