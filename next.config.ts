import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Auto-optimize images: serve WebP/AVIF, cache for 60 days
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 60, // 60 days in seconds
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Tree-shake heavy icon/animation libraries — massive bundle size win
  experimental: {
    optimizePackageImports: ["react-icons", "framer-motion"],
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },

  serverExternalPackages: ["@prisma/client"],

  compiler: {
    // Strip all console.log calls in production builds
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },
};

export default nextConfig;
