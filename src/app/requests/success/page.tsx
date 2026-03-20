'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';

export default function RequestSuccessPage() {
  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      <div className="pt-32 pb-20 px-4 max-w-3xl mx-auto text-center">
        <div className="glass-panel p-10 md:p-14 rounded-xl border border-white/10">
          <div className="w-20 h-20 bg-luxury-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-10 h-10 bg-luxury-gold rounded-full animate-pulse" />
          </div>
          <h1 className="text-4xl font-display text-white mb-4">Request Received</h1>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Our concierge team has received your reservation request. You will receive confirmation shortly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/explore"
              className="px-8 py-3 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
            >
              Back to Explore
            </Link>
            <Link
              href="/"
              className="px-8 py-3 bg-luxury-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
