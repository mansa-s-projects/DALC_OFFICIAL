import path from 'path';

const routerCompatPath = path.resolve(process.cwd(), 'src/lib/router.tsx');
const routerCompatAlias = './src/lib/router.tsx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
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
