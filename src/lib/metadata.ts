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
  const baseUrl = getBaseUrl();
  const url = new URL(args.path, baseUrl);

  const siteName = 'Dubai À La Carte';
  const defaultOgImage = new URL('/branding/logo-main.png', baseUrl);

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
      siteName,
      type: 'website',
      images: [
        {
          url: defaultOgImage.toString(),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: args.title,
      description: args.description,
      images: [defaultOgImage.toString()],
    },
    keywords: args.keywords,
  };
}

