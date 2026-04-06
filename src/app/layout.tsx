import type { Metadata } from 'next';
import { Cormorant_Garamond, Outfit, DM_Mono } from 'next/font/google';
import { NextProviders } from './providers/NextProviders';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

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
      className={`${cormorant.variable} ${outfit.variable} ${dmMono.variable}`}
    >
      <body suppressHydrationWarning>
        <NextProviders>
          {children}
        </NextProviders>
      </body>
    </html>
  );
}
