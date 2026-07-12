import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Passport Photo Studio | Dubai À La Carte',
  description:
    'Upload any photo — AI removes the background, crops to face, and generates a biometric-compliant passport photo in seconds. Free. Instant. ICAO 9303 standard.',
  openGraph: {
    title: 'AI Passport Photo Studio | DALC',
    description: 'Generate government-compliant passport photos instantly with AI.',
  },
};

export default function PhotoStudioLayout({ children }: { children: ReactNode }) {
  return children;
}
