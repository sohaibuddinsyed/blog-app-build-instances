/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placeholder.com', 'picsum.photos'],
    // Using larger image sizes to increase memory usage
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Memory-intensive webpack configuration
  webpack: (config) => {
    // Configure webpack to use more memory
    config.optimization = {
      ...config.optimization,
      minimize: true,
      concatenateModules: true,
      flagIncludedChunks: true,
      mergeDuplicateChunks: true,
      removeAvailableModules: true,
      removeEmptyChunks: true,
      splitChunks: {
        chunks: 'all',
        minSize: 10000, // Smaller chunk size to create more chunks
        maxSize: 100000, // Smaller max size to create more chunks
        minChunks: 1,
        maxAsyncRequests: 60, // Increased from 30
        maxInitialRequests: 60, // Increased from 30
        automaticNameDelimiter: '~',
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    };
    
    // Increase parallel processing to use more memory
    config.parallelism = 8; // Increased from 4
    
    // Enable caching
    config.cache = true;
    
    return config;
  },
  // Enable experimental features that might use more memory
  experimental: {
    optimizeCss: false, // Disable CSS optimization to avoid critters issues
    optimizeServerReact: true,
    optimizePackageImports: ['lodash'],
    // Add more experimental features that might use memory
    serverComponentsExternalPackages: [],
  },
  // Enable source maps in production to use more memory
  productionBrowserSourceMaps: true,
  // Increase static page generation concurrency to use more memory
  staticPageGenerationTimeout: 180, // Increased from 120
  // Compiler options
  compiler: {
    // Keep console logs in production
    removeConsole: false,
  },
  // Increase the number of pages generated concurrently to use more memory
  staticPageGenerationConcurrency: 8, // Increased from 3
  // Optimize output
  output: 'standalone',
  // Use SWC minifier
  swcMinify: true,
}

module.exports = nextConfig
