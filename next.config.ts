import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export → `npm run build` writes to `out/`
  // Note: Cache Components / PPR are incompatible with `output: 'export'`.
  output: 'export',
  images: {
    unoptimized: true,
  },
  experimental: {
    agentFeedback: true,
  },
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
