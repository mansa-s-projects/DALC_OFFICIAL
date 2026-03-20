'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/navigation/Navbar';
import Footer from '../../components/navigation/Footer';
import RequestCard from '../../components/requests/RequestCard';
import { useRequests } from '../../hooks/useRequests';
import { useAppStore } from '../../store/useAppStore';
import ErrorState from '../../components/error/ErrorState';

export default function MyRequestsPage() {
  const router = useRouter();
  const session = useAppStore((s) => s.session);
  const userId = session?.user?.id;
  const { requests, requestsQuery } = useRequests(userId);

  // Client-side auth check - redirect to login if not authenticated
  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, router]);

  // Show loading while checking auth or still loading
  if (!session || requestsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-luxury-black">
        <Navbar />
        <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-white/5 rounded-sm animate-pulse"
              />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-luxury-gold text-xs font-bold uppercase tracking-[0.3em] mb-4">
            Your Activity
          </h2>
          <h1 className="text-4xl md:text-5xl font-display text-white mb-12">
            My Requests
          </h1>
        </motion.div>

        {requestsQuery.isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-white/5 rounded-sm animate-pulse"
              />
            ))}
          </div>
        )}

        {requestsQuery.error && (
          <ErrorState
            message={requestsQuery.error instanceof Error ? requestsQuery.error.message : 'Failed to load your requests.'}
            retry={() => requestsQuery.refetch()}
          />
        )}

        {!requestsQuery.isLoading && !requestsQuery.error && requests.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Inbox className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h3 className="text-xl font-display text-white mb-3">
              No requests yet
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Explore our curated venues and make your first reservation request.
            </p>
            <Link
              href="/explore"
              className="inline-block px-8 py-4 bg-luxury-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-colors"
            >
              Explore Venues
            </Link>
          </motion.div>
        )}

        {!requestsQuery.error && requests.length > 0 && (
          <div className="space-y-4">
            {requests.map((request, i) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/requests/${request.id}`} className="block">
                  <RequestCard request={request} />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
