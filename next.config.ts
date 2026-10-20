import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export → `npm run build` writes to `out/`
  // Note: Cache Components / PPR are incompatible with `output: 'export'`.
  // Proxy/middleware is also disabled under export — root `/` needs a static redirect.
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
