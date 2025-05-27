# NextJS E-Commerce Performance Demo

This project demonstrates performance optimization techniques for NextJS applications, specifically focusing on build performance improvements when moving from Standard to Large instances.

## Project Overview

This is a demo e-commerce application that includes:

- Product catalog with 10,000+ products
- Product filtering and search functionality
- Product detail pages with image galleries
- Jest tests for components, API routes, and utilities

## Performance Issues Demonstrated

The application intentionally includes several performance bottlenecks:

1. **Memory-intensive operations**:
   - Large dataset generation
   - Image processing with Sharp
   - Complex filtering operations

2. **Inefficient dependencies**:
   - Using outdated Lodash v3.10.1 with inefficient methods
   - Synchronous operations that block the event loop

3. **Unoptimized build configuration**:
   - Default memory allocation
   - No code splitting or optimization

## Optimization Steps

The project includes files to demonstrate the optimization process:

1. **Increase heap size**:
   - `NODE_OPTIONS='--max_old_space_size=4096'` in package.json scripts

2. **Optimize webpack configuration**:
   - See `next.config.optimized.js` for improved settings

3. **Replace inefficient dependencies**:
   - Replace Lodash v3 with modern Lodash-ES (see `utils/dataGenerator.optimized.js`)
   - Use more efficient data structures and algorithms

4. **Profile and identify bottlenecks**:
   - Use Node.js built-in profiler with `NODE_OPTIONS='--prof'`

## Running the Demo

### Standard Configuration (Slow)

```bash
npm run build
npm run test
```

### Optimized Configuration (Fast)

```bash
npm run build:optimized
npm run test:optimized
```

## Performance Comparison

| Metric | Standard Instance | Large Instance | Large + Optimizations |
|--------|------------------|----------------|----------------------|
| Build Time | ~5 minutes | ~4.5 minutes | ~1 minute |
| Test Time | ~3 minutes | ~2.5 minutes | ~30 seconds |
| Memory Usage | Out of memory errors | High but stable | Efficient |

## Key Takeaways

1. Simply upgrading to a larger instance doesn't always solve performance issues
2. Identifying and fixing code-level bottlenecks is crucial
3. Modern dependencies and efficient algorithms make a significant difference
4. Proper memory allocation is essential for large applications
5. Profiling helps pinpoint specific performance issues
