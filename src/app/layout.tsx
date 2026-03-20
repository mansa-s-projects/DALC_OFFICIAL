import type { Metadata } from 'next';
import { NextProviders } from './providers/NextProviders';
import './globals.css';

export const metadata: Metadata = {
  title: 'DALC - Dubai À La Carte',
  description: 'Your premier destination for Dubai experiences, transport, and more',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextProviders>
          {children}
        </NextProviders>
      </body>
    </html>
  );
}
