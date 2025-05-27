// This file generates a dataset of products with memory optimization
const _ = require('lodash');

// Memory-efficient data generation
const generateProducts = (count = 5000) => {
  console.time('Data Generation');
  
  const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Toys', 'Beauty', 'Sports', 'Automotive'];
  const brands = ['TechGiant', 'FashionHub', 'HomeEssentials', 'BookWorld', 'ToyLand', 'BeautyGlow', 'SportsMaster', 'AutoPro'];
  
  // More efficient way to generate products
  const products = [];
  for (let id = 1; id <= count; id++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    
    // Create fewer nested objects to reduce memory usage
    const details = {};
    for (let i = 1; i <= 10; i++) { // Reduced from 100 to 10
      details[`detail${i}`] = `Detail value ${i} for product ${id}`;
    }
    
    // Create smaller arrays of related products
    const relatedProducts = [];
    for (let i = 1; i <= 20; i++) { // Reduced from 500 to 20
      const relId = Math.floor(Math.random() * count) + 1;
      relatedProducts.push({
        id: relId === id ? id + 1 : relId,
        name: `Related Product ${relId}`,
        similarity: Math.floor(Math.random() * 100) / 100
      });
    }
    
    // Create smaller arrays of reviews
    const reviews = [];
    for (let i = 1; i <= 10; i++) { // Reduced from 1000 to 10
      reviews.push({
        id: i,
        userId: Math.floor(Math.random() * 1000) + 1, // Reduced from 10000 to 1000
        rating: Math.floor(Math.random() * 5) + 1,
        comment: `This is review ${i} for product ${id}.`, // Removed repeated text
        date: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString()
      });
    }
    
    products.push({
      id,
      name: `Product ${id}`,
      description: `This is a description for product ${id}.`, // Removed repeated text
      price: Math.floor(Math.random() * 9900 + 100) / 100,
      category,
      brand,
      stock: Math.floor(Math.random() * 1000),
      rating: Math.floor(Math.random() * 50) / 10,
      imageUrl: `https://picsum.photos/seed/${id}/400/300`,
      details,
      relatedProducts,
      reviews,
      tags: Array.from({ length: Math.floor(Math.random() * 10) + 5 }, (_, n) => `tag-${n}-${id}`), // Reduced from 20-50 to 5-15
      specifications: (() => {
        const specs = {};
        for (let i = 1; i <= 5; i++) { // Reduced from 50 to 5
          specs[`spec${i}`] = `Specification ${i} value for product ${id}`;
        }
        return specs;
      })(),
      created: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString(),
      updated: new Date().toISOString()
    });
  }
  
  console.timeEnd('Data Generation');
  return products;
};

// Function to filter products - memory efficient version
const filterProducts = (products, filters) => {
  console.time('Product Filtering');
  
  let filteredProducts = products;
  
  if (filters) {
    // More efficient filtering using native JavaScript
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product => product.category === filters.category);
    }
    
    if (filters.brand) {
      filteredProducts = filteredProducts.filter(product => product.brand === filters.brand);
    }
    
    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(product => product.price >= filters.minPrice);
    }
    
    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(product => product.price <= filters.maxPrice);
    }
    
    if (filters.minRating) {
      filteredProducts = filteredProducts.filter(product => product.rating >= filters.minRating);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => {
        return product.name.toLowerCase().includes(searchLower) || 
               product.description.toLowerCase().includes(searchLower);
        // Removed expensive tag search to save memory
      });
    }
    
    // More efficient sorting
    if (filters.sortBy) {
      if (filters.sortBy === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
      } else if (filters.sortBy === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
      } else if (filters.sortBy === 'rating-desc') {
        filteredProducts.sort((a, b) => b.rating - a.rating);
      } else if (filters.sortBy === 'name') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      }
    }
  }
  
  console.timeEnd('Product Filtering');
  return filteredProducts;
};

// Function to get product categories with counts - memory efficient version
const getProductCategories = (products) => {
  console.time('Category Counting');
  
  const categories = {};
  
  // More efficient way to count categories
  for (const product of products) {
    if (!categories[product.category]) {
      categories[product.category] = 0;
    }
    categories[product.category] += 1;
  }
  
  // Convert to array of objects
  const result = Object.entries(categories).map(([name, count]) => ({ name, count }));
  
  console.timeEnd('Category Counting');
  return result;
};

// Function to get product brands with counts - memory efficient version
const getProductBrands = (products) => {
  console.time('Brand Counting');
  
  const brands = {};
  
  // More efficient way to count brands
  for (const product of products) {
    if (!brands[product.brand]) {
      brands[product.brand] = 0;
    }
    brands[product.brand] += 1;
  }
  
  // Convert to array of objects
  const result = Object.entries(brands).map(([name, count]) => ({ name, count }));
  
  console.timeEnd('Brand Counting');
  return result;
};

// Generate product recommendations - memory efficient version
const getProductRecommendations = (product, allProducts, count = 5) => {
  console.time('Recommendations Generation');
  
  // Ensure allProducts is an array
  if (!Array.isArray(allProducts)) {
    console.error('allProducts is not an array:', allProducts);
    return [];
  }
  
  // More efficient way to generate recommendations
  const recommendations = new Set();
  const productId = product.id;
  
  // Add same category products
  for (const p of allProducts) {
    if (recommendations.size >= count) break;
    if (p.id !== productId && p.category === product.category) {
      recommendations.add(p);
    }
  }
  
  // Add same brand products if needed
  if (recommendations.size < count) {
    for (const p of allProducts) {
      if (recommendations.size >= count) break;
      if (p.id !== productId && p.brand === product.brand && !recommendations.has(p)) {
        recommendations.add(p);
      }
    }
  }
  
  // Add random products if needed
  if (recommendations.size < count) {
    // Create a shuffled copy of indices
    const indices = Array.from({ length: allProducts.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    
    for (const idx of indices) {
      if (recommendations.size >= count) break;
      const p = allProducts[idx];
      if (p.id !== productId && !recommendations.has(p)) {
        recommendations.add(p);
      }
    }
  }
  
  console.timeEnd('Recommendations Generation');
  return Array.from(recommendations);
};

module.exports = {
  generateProducts,
  filterProducts,
  getProductCategories,
  getProductBrands,
  getProductRecommendations
};
