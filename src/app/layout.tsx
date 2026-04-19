import type { Metadata } from 'next';
import { NextProviders } from './providers/NextProviders';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'DALC - Dubai À La Carte',
  description: 'Your premier destination for Dubai experiences, nightlife, travel, and concierge services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <NextProviders>
          <Navbar />
          {children}
        </NextProviders>
      </body>
    </html>
  );
}



