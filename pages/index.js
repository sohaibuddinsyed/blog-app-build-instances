import { useEffect, useState } from 'react';
import Head from 'next/head';

// Import data generator
const dataGenerator = require('../utils/dataGenerator');
const imageProcessing = require('../utils/imageProcessing');

// Generate static pages at build time with controlled memory usage
export async function getStaticProps() {
  console.log('Starting data generation for build...');
  
  // Generate a dataset that will use significant memory but not crash with 14GB
  const products = dataGenerator.generateProducts(15000); // 15,000 products
  
  console.log(`Generated ${products.length} products`);
  
  // Process images for a subset of products
  const processedImages = await imageProcessing.processProductImages(products, 100);
  
  console.log(`Processed ${processedImages.length} product images`);
  
  // Generate galleries for a subset of products
  const galleries = [];
  for (let i = 0; i < 20; i++) {
    const gallery = await imageProcessing.generateProductGallery(i, 10);
    galleries.push(gallery);
    
    if (i % 5 === 0) {
      console.log(`Generated ${i} product galleries`);
    }
  }
  
  console.log(`Generated ${galleries.length} product galleries`);
  
  // Filter products by category and brand
  console.log('Starting filtering operations...');
  
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
    { min: 0, max: 100 },
    { min: 100, max: 500 },
    { min: 500, max: Number.MAX_SAFE_INTEGER }
  ];
  
  const filteredByPrices = {};
  for (const range of priceRanges) {
    const key = `${range.min}-${range.max}`;
    filteredByPrices[key] = dataGenerator.filterProducts(products, { minPrice: range.min, maxPrice: range.max });
    console.log(`Filtered ${filteredByPrices[key].length} products for price range ${key}`);
  }
  
  // Get categories and brands with counts
  console.log('Generating category and brand statistics...');
  const categoryStats = dataGenerator.getProductCategories(products);
  const brandStats = dataGenerator.getProductBrands(products);
  
  // Generate recommendations for a subset of products
  console.log('Generating product recommendations...');
  const recommendations = {};
  for (let i = 0; i < 50; i++) {
    if (products[i]) {
      recommendations[i] = dataGenerator.getProductRecommendations(products[i], products, 10);
    }
    
    if (i % 10 === 0) {
      console.log(`Generated recommendations for ${i} products`);
    }
  }
  
  // Return data for the page
  return {
    props: {
      productCount: products.length,
      categoryStats,
      brandStats,
      featuredProducts: products.slice(0, 20).map(p => ({
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
        count: filteredByCategories[category]?.length || 0,
        products: filteredByCategories[category]?.slice(0, 5).map(p => ({
          id: p.id,
          name: p.name,
          price: p.price
        })) || []
      })),
      popularBrands: brands.map(brand => ({
        name: brand,
        count: filteredByBrands[brand]?.length || 0,
        products: filteredByBrands[brand]?.slice(0, 5).map(p => ({
          id: p.id,
          name: p.name,
          price: p.price
        })) || []
      })),
      priceDistribution: priceRanges.map(range => ({
        range: `${range.min}-${range.max}`,
        count: filteredByPrices[`${range.min}-${range.max}`]?.length || 0,
        products: filteredByPrices[`${range.min}-${range.max}`]?.slice(0, 5).map(p => ({
          id: p.id,
          name: p.name,
          price: p.price
        })) || []
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
                <h3>{category.name} ({category.count} products)</h3>
                <ul>
                  {category.products.map(product => (
                    <li key={product.id}>
                      {product.name} - ${product.price}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Popular Brands</h2>
          <ul>
            {popularBrands.map(brand => (
              <li key={brand.name}>
                <h3>{brand.name} ({brand.count} products)</h3>
                <ul>
                  {brand.products.map(product => (
                    <li key={product.id}>
                      {product.name} - ${product.price}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Price Distribution</h2>
          <ul>
            {priceDistribution.map(item => (
              <li key={item.range}>
                <h3>${item.range}: {item.count} products</h3>
                <ul>
                  {item.products.map(product => (
                    <li key={product.id}>
                      {product.name} - ${product.price}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
