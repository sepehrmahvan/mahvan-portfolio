import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export → `npm run build` writes to `out/`
  // Note: Cache Components / PPR and Proxy (`proxy.ts`) are incompatible with export.
  // Root `/` uses a static redirect below (proxy/middleware disabled under export).
  output: 'export',
  images: {
    unoptimized: true,
  },
  experimental: {
    agentFeedback: true,
  },
  // Replaces root proxy while on static export (dev + hosts that honor Next redirects).
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
    ];
  },
  turbopack: {
    root: process.cwd(),
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
