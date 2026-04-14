import path from 'path';

const routerCompatPath = path.resolve(process.cwd(), 'src/lib/router.tsx');
const routerCompatAlias = './src/lib/router.tsx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/nightlife', destination: '/explore/dubai', permanent: true },
      { source: '/nightlife/restaurants', destination: '/explore/dubai/restaurants', permanent: true },
      { source: '/nightlife/beach-clubs', destination: '/explore/dubai/beach-clubs', permanent: true },
      { source: '/nightlife/clubs', destination: '/explore/dubai/nightlife', permanent: true },
      { source: '/nightlife/dining', destination: '/explore/dubai/dining-entertainment', permanent: true },
      { source: '/nightlife/private-events', destination: '/explore/dubai', permanent: true },
      { source: '/nightlife/:path*', destination: '/explore/dubai/:path*', permanent: true },
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
}

export default nextConfig
