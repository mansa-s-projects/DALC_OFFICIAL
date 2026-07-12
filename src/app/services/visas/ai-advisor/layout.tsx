import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Visa Intelligence Engine | Dubai À La Carte',
  description:
    'AI-powered visa eligibility scoring, document checklists, approval probability, and personalised DALC service recommendations for 195 countries.',
  openGraph: {
    title: 'Visa Intelligence Engine | DALC',
    description: 'Get your personalised visa eligibility report in minutes.',
  },
};

export default function AIAdvisorLayout({ children }: { children: ReactNode }) {
  return children;
}
