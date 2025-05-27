/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placeholder.com', 'picsum.photos'],
  },
  // Initial configuration with minimal memory allocation to trigger issues
  webpack: (config) => {
    // Don't set any memory optimizations initially
    return config;
  },
}

module.exports = nextConfig
