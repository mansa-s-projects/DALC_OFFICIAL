import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Move To Dubai | Relocation Concierge & Setup',
  description: 'Plan your move to Dubai with structured relocation support for visas, housing, schooling, banking, and lifestyle onboarding.',
  path: '/move-to-dubai',
  keywords: ['move to Dubai', 'Dubai relocation', 'Dubai visa support', 'Dubai onboarding concierge'],
});

export default function MoveToDubaiLayout({ children }: { children: ReactNode }) {
  return children;
}
