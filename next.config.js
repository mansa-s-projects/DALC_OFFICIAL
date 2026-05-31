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
