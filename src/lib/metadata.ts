import type { Metadata } from 'next';

function getBaseUrl() {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
}

export function buildPageMetadata(args: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = new URL(args.path, getBaseUrl());

  return {
    title: args.title,
    description: args.description,
    alternates: {
      canonical: url.toString(),
    },
    openGraph: {
      title: args.title,
      description: args.description,
      url: url.toString(),
      siteName: 'Dubai À La Carte',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: args.title,
      description: args.description,
    },
    keywords: args.keywords,
  };
}
