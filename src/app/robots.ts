import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubai-alacarte.com'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/admin/',
        '/api/',
        '/profile',
        '/my-requests',
        '/notifications',
        '/auth/',
        '/onboarding',
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
