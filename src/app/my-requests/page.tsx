'use client'

import { use, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { format } from 'date-fns'

interface RequestSummary {
  id: string
  category: string
  request_type?: string
  venue_name?: string
  status: string
  priority?: string
  party_size?: number
  notes?: string
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-gray-700 text-gray-300',
  assigned: 'bg-blue-900 text-blue-200',
  quoted: 'bg-amber-900 text-amber-200',
  confirmed: 'bg-green-900 text-green-200',
  completed: 'bg-emerald-900 text-emerald-200',
  declined: 'bg-red-900 text-red-200',
}

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Pending Review',
  assigned: 'Assigned',
  quoted: 'Quote Ready',
  confirmed: 'Confirmed',
  completed: 'Completed',
  declined: 'Declined',
}

const CATEGORY_ICONS: Record<string, string> = {
  experiences: '✨',
  stays: '🏨',
  transport: '🚗',
  nightlife: '🌙',
  business: '💼',
  concierge: '🎩',
  travel: '✈️',
}

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<RequestSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [unauthenticated, setUnauthenticated] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setUnauthenticated(true)
        setLoading(false)
        return
      }

      const res = await fetch('/api/requests', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })

      if (res.ok) {
        setRequests(await res.json())
      }
      setLoading(false)
    }

    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <div className="text-[#C8A96E]">Loading...</div>
      </div>
    )
  }

  if (unauthenticated) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-6">Sign in to view your requests</p>
          <Link href="/auth/sign-in" className="bg-[#C8A96E] text-[#070707] font-semibold px-6 py-3 rounded-lg hover:bg-[#D4B886] transition">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#C8A96E]">My Requests</h1>
            <p className="text-gray-400 text-sm mt-1">{requests.length} request{requests.length !== 1 ? 's' : ''}</p>
          </div>
          <Link
            href="/concierge"
            className="bg-[#C8A96E] text-[#070707] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#D4B886] transition text-sm"
          >
            + New Request
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-2">No requests yet</p>
            <p className="text-gray-600 text-sm mb-8">Submit a concierge request and track it here in real time.</p>
            <Link href="/concierge" className="text-[#C8A96E] hover:underline text-sm">
              Make your first request →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <Link
                key={req.id}
                href={`/my-requests/${req.id}`}
                className="block bg-gray-900 border border-gray-800 hover:border-[#C8A96E]/40 rounded-xl p-5 transition group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="text-2xl mt-0.5 shrink-0">{CATEGORY_ICONS[req.category] ?? '📋'}</span>
                    <div className="min-w-0">
                      <p className="text-white font-semibold truncate group-hover:text-[#C8A96E] transition">
                        {req.venue_name ?? req.category.charAt(0).toUpperCase() + req.category.slice(1)}
                      </p>
                      {req.notes && (
                        <p className="text-gray-400 text-sm mt-0.5 truncate">{req.notes}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        {req.party_size && <span>{req.party_size} guests</span>}
                        <span>{format(new Date(req.created_at), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[req.status] ?? STATUS_COLORS.submitted}`}>
                    {STATUS_LABELS[req.status] ?? req.status}
                  </span>
                </div>
                {req.status === 'quoted' && (
                  <div className="mt-3 pt-3 border-t border-gray-800">
                    <p className="text-amber-400 text-xs font-medium">💬 Your quote is ready — tap to review and pay</p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
