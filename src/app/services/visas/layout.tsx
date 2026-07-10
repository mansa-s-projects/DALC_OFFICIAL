import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Visa Services | Dubai À La Carte — AI-Powered Visa Intelligence',
  description:
    'The world\'s smartest visa platform for Dubai residents. AI eligibility scoring, passport photo studio, 195 countries, concierge support.',
  openGraph: {
    title: 'Visa Services | Dubai À La Carte',
    description: 'AI-powered visa intelligence, photo studio, and concierge support — better than iVisa.',
  },
};

export default function VisaLayout({ children }: { children: ReactNode }) {
  return children;
}
