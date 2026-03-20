import type { AppProps } from 'next/app';
import { NextProviders } from '@/app/providers/NextProviders';
import '@/app/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextProviders>
      <Component {...pageProps} />
    </NextProviders>
  );
}
