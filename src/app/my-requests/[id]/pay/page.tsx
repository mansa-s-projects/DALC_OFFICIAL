'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'

interface Quote {
  id: string
  amount_aed: number
  status: string
  notes?: string
  expires_at?: string
}

interface RequestDetail {
  id: string
  category: string
  venue_name?: string
  status: string
  notes?: string
  quotes: Quote[]
}

const paymentsLive = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === 'true'

export default function PayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [request, setRequest] = useState<RequestDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/requests/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setRequest(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <div className="text-[#C8A96E]">Loading...</div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <div className="text-red-500">Request not found</div>
      </div>
    )
  }

  const activeQuote = request.quotes?.find(q => ['sent', 'draft', 'accepted'].includes(q.status)) ?? request.quotes?.[0]

  if (!activeQuote) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No active quote for this request.</p>
          <Link href={`/my-requests/${id}`} className="text-[#C8A96E] hover:underline">← Back to request</Link>
        </div>
      </div>
    )
  }

  const handlePay = async () => {
    setPaying(true)
    setError(null)
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: id, quote_id: activeQuote.id }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Payment setup failed. Please try again.')
        setPaying(false)
        return
      }
      window.location.href = data.url
    } catch {
      setError('Something went wrong. Please try again.')
      setPaying(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <div className="max-w-lg mx-auto px-6 py-12">
        <Link href={`/my-requests/${id}`} className="text-[#C8A96E] text-sm hover:underline mb-8 inline-block">
          ← Back to request
        </Link>

        <h1 className="text-3xl font-bold text-[#C8A96E] mb-2">Complete Payment</h1>
        <p className="text-gray-400 text-sm mb-10">
          {request.venue_name ?? request.category} • {request.id}
        </p>

        {/* Quote Summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-4">Quote Summary</h3>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Amount</p>
              <p className="text-4xl font-bold text-white mt-1">
                AED {activeQuote.amount_aed.toLocaleString()}
              </p>
            </div>
            {activeQuote.expires_at && (
              <p className="text-gray-500 text-xs">
                Valid until {format(new Date(activeQuote.expires_at), 'MMM dd')}
              </p>
            )}
          </div>
          {activeQuote.notes && (
            <p className="text-gray-400 text-sm mt-4 pt-4 border-t border-gray-800">{activeQuote.notes}</p>
          )}
        </div>

        {paymentsLive ? (
          <>
            {/* Secure payment via Stripe */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
              <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-3">Payment</h3>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <svg className="w-5 h-5 text-[#C8A96E] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                You will be redirected to Stripe's secure checkout to complete payment. Card details are handled entirely by Stripe — DALC never stores them.
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-6 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full bg-[#C8A96E] text-[#070707] font-bold py-4 rounded-xl hover:bg-[#D4B886] transition text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {paying ? 'Redirecting to Stripe...' : `Pay AED ${activeQuote.amount_aed.toLocaleString()}`}
            </button>

            <p className="text-gray-600 text-xs text-center mt-4">
              Secured by Stripe · 256-bit SSL encryption
            </p>
          </>
        ) : (
          /* Payments not yet live — show bank transfer CTA */
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="text-white font-semibold">Online payments coming soon</p>
                <p className="text-gray-400 text-sm mt-0.5">Contact your concierge to arrange payment</p>
              </div>
            </div>
            <a
              href={`https://wa.me/971000000000?text=Hi%20DALC%2C%20I%20want%20to%20pay%20AED%20${activeQuote.amount_aed}%20for%20request%20${id}`}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition text-lg text-center block"
            >
              💬 Pay via WhatsApp
            </a>
          </div>
        )}

        {/* WhatsApp fallback */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm mb-3">Prefer to pay via bank transfer?</p>
          <a
            href={`https://wa.me/971000000000?text=Hi%20DALC%2C%20I%20want%20to%20pay%20for%20request%20${id}`}
            className="text-[#C8A96E] text-sm hover:underline"
          >
            Contact concierge on WhatsApp →
          </a>
        </div>
      </div>
    </div>
  )
}
