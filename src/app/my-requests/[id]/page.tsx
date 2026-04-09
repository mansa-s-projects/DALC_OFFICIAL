"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

type Quote = {
  id: string;
  amount_aed: number;
  status: string;
  notes: string | null;
  expires_at: string | null;
  created_at: string;
};

type Payment = {
  id: string;
  amount_aed: number;
  status: string;
  payment_type: string;
  created_at: string;
};

type RequestDetail = {
  id: string;
  category: string;
  status: string;
  priority: "HIGH" | "NORMAL" | "LOW";
  title: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  quotes: Quote[];
  payments: Payment[];
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  submitted: "Submitted",
  in_progress: "In Progress",
  quoted: "Quoted",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  submitted: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  in_progress: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  quoted: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  confirmed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/30",
};

const PRIORITY_COLORS: Record<string, string> = {
  HIGH: "text-red-400",
  NORMAL: "text-amber-400",
  LOW: "text-zinc-400",
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending: "text-zinc-400",
  processing: "text-blue-400",
  succeeded: "text-emerald-400",
  failed: "text-red-400",
  refunded: "text-purple-400",
};

export default function RequestDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = typeof params.id === "string" ? params.id : null;

  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const paymentStatus = searchParams.get("payment");

  useEffect(() => {
    if (!id) return;

    fetch(`/api/requests/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<RequestDetail>;
      })
      .then(setRequest)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleCheckout(quoteId: string) {
    if (!id) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: id, quote_id: quoteId }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Could not initiate checkout");
      }
    } catch {
      alert("Checkout failed. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080706] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-[#080706] flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 font-mono text-sm">{error ?? "Request not found"}</p>
        <Link href="/profile" className="text-[#C9A84C] text-sm underline underline-offset-4">
          Back to profile
        </Link>
      </div>
    );
  }

  const activeQuote = request.quotes.find(
    (q) => q.status === "sent" || q.status === "accepted",
  );
  const latestPayment = request.payments[0] ?? null;

  return (
    <div className="min-h-screen bg-[#080706] text-[#F5EDD8]">
      <div className="max-w-2xl mx-auto px-6 py-16">

        <div className="mb-8">
          <Link
            href="/profile"
            className="text-xs text-[#C9A84C]/70 hover:text-[#C9A84C] tracking-widest uppercase mb-6 inline-block transition-colors"
          >
            ← My Requests
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs tracking-widest uppercase text-[#C9A84C]/60 mb-1 font-mono">
                {request.category}
              </p>
              <h1 className="text-2xl font-display font-light text-[#F5EDD8]">
                {request.title ?? "Concierge Request"}
              </h1>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full border font-mono ${STATUS_COLORS[request.status] ?? "text-zinc-400 bg-zinc-400/10 border-zinc-400/30"}`}
            >
              {STATUS_LABELS[request.status] ?? request.status}
            </span>
          </div>
        </div>

        {paymentStatus === "success" && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
            Payment confirmed. Our team will be in touch shortly.
          </div>
        )}
        {paymentStatus === "cancelled" && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            Payment was not completed. You can try again below.
          </div>
        )}

        <div className="rounded-2xl border border-[#2A2518] bg-[#111009] p-6 mb-6 space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-[#C9A84C]/60 font-mono">
            Request Details
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#F5EDD8]/40 text-xs mb-1">Priority</p>
              <p className={`font-mono font-medium ${PRIORITY_COLORS[request.priority]}`}>
                {request.priority}
              </p>
            </div>
            <div>
              <p className="text-[#F5EDD8]/40 text-xs mb-1">Created</p>
              <p className="font-mono">
                {new Date(request.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {request.description && (
            <div>
              <p className="text-[#F5EDD8]/40 text-xs mb-1">Description</p>
              <p className="text-sm text-[#F5EDD8]/80 leading-relaxed">{request.description}</p>
            </div>
          )}

          <div>
            <p className="text-[#F5EDD8]/40 text-xs mb-1">Reference</p>
            <p className="font-mono text-xs text-[#F5EDD8]/50">{request.id}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#2A2518] bg-[#111009] p-6 mb-6">
          <h2 className="text-xs tracking-widest uppercase text-[#C9A84C]/60 font-mono mb-4">
            Quote
          </h2>

          {activeQuote ? (
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[#F5EDD8]/40 text-xs mb-1">Amount</p>
                  <p className="text-3xl font-display font-light">
                    AED{" "}
                    <span className="text-[#C9A84C]">
                      {activeQuote.amount_aed.toLocaleString("en-AE", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full border font-mono ${activeQuote.status === "accepted" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" : "text-purple-400 bg-purple-400/10 border-purple-400/30"}`}
                >
                  {activeQuote.status}
                </span>
              </div>

              {activeQuote.notes && (
                <p className="text-sm text-[#F5EDD8]/60 border-t border-[#2A2518] pt-3">
                  {activeQuote.notes}
                </p>
              )}

              {activeQuote.expires_at && (
                <p className="text-xs text-[#F5EDD8]/40 font-mono">
                  Expires{" "}
                  {new Date(activeQuote.expires_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              )}

              {activeQuote.status === "sent" && latestPayment?.status !== "succeeded" && (
                <button
                  onClick={() => handleCheckout(activeQuote.id)}
                  disabled={checkoutLoading}
                  className="w-full mt-2 py-3 px-6 rounded-xl bg-[#C9A84C] text-[#080706] text-sm font-medium tracking-wide hover:bg-[#d4b660] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {checkoutLoading ? "Redirecting…" : "Pay Now"}
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-[#F5EDD8]/40">
              Our team is preparing your quote. You will be notified when it is ready.
            </p>
          )}
        </div>

        {latestPayment && (
          <div className="rounded-2xl border border-[#2A2518] bg-[#111009] p-6">
            <h2 className="text-xs tracking-widest uppercase text-[#C9A84C]/60 font-mono mb-4">
              Payment
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#F5EDD8]/40 text-xs mb-1">{latestPayment.payment_type}</p>
                <p className="text-xl font-display font-light">
                  AED{" "}
                  {latestPayment.amount_aed.toLocaleString("en-AE", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <span
                className={`text-sm font-mono font-medium ${PAYMENT_STATUS_COLORS[latestPayment.status]}`}
              >
                {latestPayment.status}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
