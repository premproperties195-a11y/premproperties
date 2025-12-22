/** @type {import('next').NextConfig} */
// Force restart timestamp: 2025-12-17
const nextConfig = {
  // output: "export", // Removed: Incompatible with dynamic API routes and cookies
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
