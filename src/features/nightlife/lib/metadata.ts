import type { Metadata } from 'next';

function getBaseUrl() {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
}

export function buildNightlifeMetadata(args: {
  title: string;
  description: string;
  path: string;
  keywords: string[];
  ogImage?: string;
}): Metadata {
  const url = new URL(args.path, getBaseUrl());
  const images = args.ogImage
    ? [{ url: args.ogImage, width: 1200, height: 630, alt: args.title }]
    : [];

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
      ...(images.length > 0 && { images }),
    },
    twitter: {
      card: 'summary_large_image',
      title: args.title,
      description: args.description,
      ...(args.ogImage && { images: [args.ogImage] }),
    },
    keywords: args.keywords,
  };
}
