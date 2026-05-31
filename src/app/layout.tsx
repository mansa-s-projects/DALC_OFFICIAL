import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import { NextProviders } from './providers/NextProviders';
import './globals.css';

const metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
);

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: 'Dubai À La Carte',
    template: '%s | Dubai À La Carte',
  },
  description:
    'Luxury concierge for Dubai: nightlife, curated experiences, travel, stays, and high-intent request handling.',
  applicationName: 'Dubai À La Carte',
  openGraph: {
    type: 'website',
    siteName: 'Dubai À La Carte',
    locale: 'en_US',
    images: [
      {
        url: '/branding/logo-main.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/branding/logo-main.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: '/icon.svg' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="overflow-x-hidden" suppressHydrationWarning>
        <NextProviders>
          <Navbar />
          {children}
        </NextProviders>
      </body>
    </html>
  );
}

