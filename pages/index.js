import { useEffect, useState } from 'react';
import Head from 'next/head';

// Import data generator
const dataGenerator = require('../utils/dataGenerator');
const imageProcessing = require('../utils/imageProcessing');

// Generate a massive amount of static pages at build time
export async function getStaticProps() {
  console.log('Starting massive data generation for build...');
  
  // Generate a large dataset - this will consume significant memory
  const products = dataGenerator.generateProducts(30000); // Increased to 30,000 products
  
  console.log(`Generated ${products.length} products`);
  
  // Process images for many products
  const processedImages = await imageProcessing.processProductImages(products, 200); // Increased to 200
  
  console.log(`Processed ${processedImages.length} product images`);
  
  // Generate galleries for many products
  const galleries = [];
  for (let i = 0; i < 50; i++) { // Increased to 50 galleries
    const gallery = await imageProcessing.generateProductGallery(i, 15); // Increased to 15 images per gallery
    galleries.push(gallery);
    
    if (i % 10 === 0) {
      console.log(`Generated ${i} product galleries`);
    }
  }
  
  console.log(`Generated ${galleries.length} product galleries`);
  
  // Filter products in memory-intensive ways
  console.log('Starting memory-intensive filtering operations...');
  
  // Create multiple filtered versions of the entire product catalog
  const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Toys', 'Beauty', 'Sports', 'Automotive'];
  const brands = ['TechGiant', 'FashionHub', 'HomeEssentials', 'BookWorld', 'ToyLand', 'BeautyGlow', 'SportsMaster', 'AutoPro'];
  
  // Filter by each category
  const filteredByCategories = {};
  for (const category of categories) {
    filteredByCategories[category] = dataGenerator.filterProducts(products, { category });
    console.log(`Filtered ${filteredByCategories[category].length} products for category ${category}`);
  }
  
  // Filter by each brand
  const filteredByBrands = {};
  for (const brand of brands) {
    filteredByBrands[brand] = dataGenerator.filterProducts(products, { brand });
    console.log(`Filtered ${filteredByBrands[brand].length} products for brand ${brand}`);
  }
  
  // Filter by price ranges
  const priceRanges = [
    { min: 0, max: 50 },
    { min: 50, max: 100 },
    { min: 100, max: 200 },
    { min: 200, max: 500 },
    { min: 500, max: 1000 },
    { min: 1000, max: Number.MAX_SAFE_INTEGER }
  ];
  
  const filteredByPrices = {};
  for (const range of priceRanges) {
    const key = `${range.min}-${range.max}`;
    filteredByPrices[key] = dataGenerator.filterProducts(products, { minPrice: range.min, maxPrice: range.max });
    console.log(`Filtered ${filteredByPrices[key].length} products for price range ${key}`);
  }
  
  // Filter by search terms
  const searchTerms = ['product', 'special', 'new', 'premium', 'limited', 'exclusive', 'best', 'top'];
  const filteredBySearches = {};
  for (const term of searchTerms) {
    filteredBySearches[term] = dataGenerator.filterProducts(products, { search: term });
    console.log(`Filtered ${filteredBySearches[term].length} products for search term "${term}"`);
  }
  
  // Get categories and brands with counts
  console.log('Generating category and brand statistics...');
  const categoryStats = dataGenerator.getProductCategories(products);
  const brandStats = dataGenerator.getProductBrands(products);
  
  // Generate recommendations for many products
  console.log('Generating product recommendations...');
  const recommendations = {};
  for (let i = 0; i < 300; i++) { // Increased to 300 products
    if (products[i]) {
      recommendations[i] = dataGenerator.getProductRecommendations(products[i], products, 20); // Increased to 20 recommendations
    }
    
    if (i % 50 === 0) {
      console.log(`Generated recommendations for ${i} products`);
    }
  }
  
  // Create complex combinations of filters
  console.log('Creating complex filter combinations...');
  const complexFilters = [];
  
  for (const category of categories) {
    for (const brand of brands) {
      for (const range of priceRanges) {
        const filtered = dataGenerator.filterProducts(products, {
          category,
          brand,
          minPrice: range.min,
          maxPrice: range.max
        });
        
        complexFilters.push({
          category,
          brand,
          priceRange: `${range.min}-${range.max}`,
          count: filtered.length
        });
      }
    }
  }
  
  console.log(`Created ${complexFilters.length} complex filter combinations`);
  
  // Return only a subset of the data to avoid serialization issues
  return {
    props: {
      productCount: products.length,
      categoryStats,
      brandStats,
      featuredProducts: products.slice(0, 50).map(p => ({ // Increased from 10 to 50
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        brand: p.brand,
        rating: p.rating,
        description: p.description.substring(0, 100)
      })),
      popularCategories: categories.map(category => ({
        name: category,
        count: filteredByCategories[category]?.length || 0
      })),
      popularBrands: brands.map(brand => ({
        name: brand,
        count: filteredByBrands[brand]?.length || 0
      })),
      priceDistribution: priceRanges.map(range => ({
        range: `${range.min}-${range.max}`,
        count: filteredByPrices[`${range.min}-${range.max}`]?.length || 0
      }))
    }
  };
}

export default function Home({ productCount, categoryStats, brandStats, featuredProducts, popularCategories, popularBrands, priceDistribution }) {
  return (
    <div>
      <Head>
        <title>E-Commerce Performance Demo</title>
        <meta name="description" content="NextJS E-Commerce Performance Demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>E-Commerce Performance Demo</h1>
        
        <div>
          <h2>Store Statistics</h2>
          <p>Total Products: {productCount}</p>
          <p>Categories: {categoryStats.length}</p>
          <p>Brands: {brandStats.length}</p>
        </div>
        
        <div>
          <h2>Featured Products</h2>
          <ul>
            {featuredProducts.map(product => (
              <li key={product.id}>
                {product.name} - ${product.price} ({product.category}, {product.brand}) - Rating: {product.rating}/5
                <p>{product.description}</p>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Popular Categories</h2>
          <ul>
            {popularCategories.map(category => (
              <li key={category.name}>
                {category.name} ({category.count} products)
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Popular Brands</h2>
          <ul>
            {popularBrands.map(brand => (
              <li key={brand.name}>
                {brand.name} ({brand.count} products)
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Price Distribution</h2>
          <ul>
            {priceDistribution.map(item => (
              <li key={item.range}>
                ${item.range}: {item.count} products
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
