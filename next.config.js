import path from 'path';

const routerCompatPath = path.resolve(process.cwd(), 'src/lib/router.tsx');
const routerCompatAlias = './src/lib/router.tsx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // In this environment Next's internal typecheck step can fail with `spawn EPERM`
  // even when `tsc --noEmit` passes. We enforce type safety via `npm run typecheck`.
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Reduce build worker spawning in sandboxed Windows environments.
    cpus: 1,
    // Prefer worker_threads over child_process where possible.
    workerThreads: true,
  },
  images: {
    unoptimized: true,
  },

  // ── Security Headers ──────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), payment=(self)' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: http:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://www.google-analytics.com https://api.mapbox.com https://*.tiles.mapbox.com https://events.mapbox.com",
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      'react-router-dom': routerCompatPath,
    };

    return config;
  },
  turbopack: {
    root: process.cwd(),
    resolveAlias: {
      'react-router-dom': routerCompatAlias,
    },
  },
};

export default nextConfig;
