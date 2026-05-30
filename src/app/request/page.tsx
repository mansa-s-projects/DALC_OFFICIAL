import RequestPage from '@/features/concierge/pages/RequestPage';
import { buildPageMetadata } from '@/lib/metadata';
import { Suspense } from 'react';

export const metadata = buildPageMetadata({
  title: 'Request Concierge Support | Dubai À La Carte',
  description: 'Submit one DALC concierge brief for nightlife, stays, travel, business setup, reservations, and bespoke Dubai requests.',
  path: '/request',
  keywords: ['Dubai concierge request', 'Dubai personal concierge', 'luxury request Dubai', 'DALC request'],
});

export default function RequestRoute() {
  return (
    <Suspense fallback={<p className="px-4 py-32 text-center text-white/70">Loading...</p>}>
      <RequestPage />
    </Suspense>
  );
}
