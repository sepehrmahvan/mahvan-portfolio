import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export → `npm run build` writes to `out/`
  output: 'export',
  images: {
    unoptimized: true,
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
