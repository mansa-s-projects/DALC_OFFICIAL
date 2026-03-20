'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { signIn } from '@/lib/auth';

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams?.get('from') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      router.replace(from);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-display text-white">
              Dubai <span className="italic text-gray-400">À La Carte</span>
            </h1>
          </Link>
          <p className="text-gray-500 text-sm mt-3 uppercase tracking-widest">Sign In</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-sm pl-12 pr-4 py-4 text-white focus:border-luxury-gold outline-none transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-sm pl-12 pr-4 py-4 text-white focus:border-luxury-gold outline-none transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-luxury-gold text-black font-bold uppercase tracking-widest hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? 'Signing In...' : 'Sign In'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-500 text-sm mt-8">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-luxury-gold hover:text-white transition-colors">
            Create Account
          </Link>
        </p>

        {/* Back Home */}
        <p className="text-center mt-4">
          <Link href="/" className="text-gray-600 text-xs uppercase tracking-widest hover:text-gray-400 transition-colors">
            Back to Home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
