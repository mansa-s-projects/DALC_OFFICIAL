import type { ReactNode } from 'react';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Dubai Car Rental | Economy & Standard Fleet',
  description: 'Book practical Dubai car rental options for daily mobility with transparent categories, pricing filters, and request-led support.',
  path: '/car-rental',
  keywords: ['Dubai car rental', 'economy car rental Dubai', 'daily car hire Dubai', 'Dubai mobility'],
});

export default function CarRentalLayout({ children }: { children: ReactNode }) {
  return children;
}
