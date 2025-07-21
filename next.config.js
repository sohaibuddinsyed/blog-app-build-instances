/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placeholder.com', 'picsum.photos'],
    // Moderate image sizes
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    // Limit concurrent image optimizations
    minimumCacheTTL: 60,
  },
  // Webpack configuration with controlled memory usage
  webpack: (config) => {
    // Enable memory optimizations
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
        minSize: 20000,
        maxSize: 250000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
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
    
    // Limit parallel processing
    config.parallelism = 4;
    
    // Enable caching
    config.cache = true;
    
    return config;
  },
  // Disable experimental features that might cause memory issues
  experimental: {
    optimizeCss: false,
    optimizeServerReact: true,
    optimizePackageImports: ['lodash'],
  },
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Limit static page generation concurrency
  staticPageGenerationTimeout: 120,
  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Limit concurrent page generation
  staticPageGenerationConcurrency: 4,
  // Optimize output
  output: 'static',
  // Use SWC minifier
  swcMinify: true,
  // Memory management
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig
