/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    isrMemoryCacheSize: 50 * 1024 * 1024, // 50 MB
  },
};

module.exports = nextConfig;