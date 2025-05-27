// This file generates a dataset of products with controlled memory usage
const _ = require('lodash');

// Generate products with controlled memory usage
const generateProducts = (count = 10000) => {
  console.time('Data Generation');
  
  const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Toys', 'Beauty', 'Sports', 'Automotive'];
  const brands = ['TechGiant', 'FashionHub', 'HomeEssentials', 'BookWorld', 'ToyLand', 'BeautyGlow', 'SportsMaster', 'AutoPro'];
  
  // Generate products with controlled memory usage
  const products = [];
  for (let id = 1; id <= count; id++) {
    const category = categories[id % categories.length];
    const brand = brands[id % brands.length];
    
    // Create a moderate number of nested objects
    const details = {};
    for (let i = 1; i <= 20; i++) {
      details[`detail${i}`] = `Detail value ${i} for product ${id}`;
    }
    
    // Create a moderate number of related products
    const relatedProducts = [];
    for (let i = 1; i <= 50; i++) {
      const relId = (id + i) % count + 1;
      relatedProducts.push({
        id: relId,
        name: `Related Product ${relId}`,
        similarity: (100 - (i % 100)) / 100
      });
    }
    
    // Create a moderate number of reviews
    const reviews = [];
    for (let i = 1; i <= 20; i++) {
      reviews.push({
        id: i,
        userId: (id * 100) + i,
        rating: (i % 5) + 1,
        comment: `This is review ${i} for product ${id}. ${_.repeat('More text to increase size. ', 10)}`,
        date: new Date(Date.now() - (i * 86400000)).toISOString()
      });
    }
    
    products.push({
      id,
      name: `Product ${id}`,
      description: `This is a detailed description for product ${id}. ${_.repeat('More description text to increase size. ', 20)}`,
      price: ((id % 1000) + 10) / 1,
      category,
      brand,
      stock: (id % 100) * 10,
      rating: ((id % 50) + 1) / 10,
      imageUrl: `https://picsum.photos/seed/${id}/400/300`,
      details,
      relatedProducts,
      reviews,
      tags: Array.from({ length: 15 }, (_, n) => `tag-${n}-${id}`),
      specifications: (() => {
        const specs = {};
        for (let i = 1; i <= 15; i++) {
          specs[`spec${i}`] = `Specification ${i} value for product ${id}`;
        }
        return specs;
      })(),
      created: new Date(Date.now() - ((id % 365) * 86400000)).toISOString(),
      updated: new Date().toISOString()
    });
  }
  
  console.timeEnd('Data Generation');
  return products;
};

// Function to filter products - moderately efficient
const filterProducts = (products, filters) => {
  console.time('Product Filtering');
  
  let filteredProducts = products;
  
  if (filters) {
    // Filter using native JavaScript methods
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
    
    if (filters.maxRating) {
      filteredProducts = filteredProducts.filter(product => product.rating <= filters.maxRating);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => {
        return product.name.toLowerCase().includes(searchLower) || 
               product.description.toLowerCase().includes(searchLower) ||
               product.tags.some(tag => tag.toLowerCase().includes(searchLower));
      });
    }
    
    // Sorting
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

// Function to get product categories with counts
const getProductCategories = (products) => {
  console.time('Category Counting');
  
  const categories = {};
  
  // Count categories
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

// Function to get product brands with counts
const getProductBrands = (products) => {
  console.time('Brand Counting');
  
  const brands = {};
  
  // Count brands
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

// Generate product recommendations
const getProductRecommendations = (product, allProducts, count = 10) => {
  console.time('Recommendations Generation');
  
  // Ensure allProducts is an array
  if (!Array.isArray(allProducts)) {
    console.error('allProducts is not an array:', allProducts);
    return [];
  }
  
  // Generate recommendations
  const sameCategory = allProducts.filter(p => p && p.category === product.category && p.id !== product.id);
  const sameBrand = allProducts.filter(p => p && p.brand === product.brand && p.id !== product.id);
  
  // Use Set to avoid duplicates
  const recommendationSet = new Set();
  
  // Add category products
  for (const p of sameCategory) {
    if (recommendationSet.size >= count) break;
    recommendationSet.add(p);
  }
  
  // Add brand products
  for (const p of sameBrand) {
    if (recommendationSet.size >= count) break;
    if (!Array.from(recommendationSet).some(rp => rp.id === p.id)) {
      recommendationSet.add(p);
    }
  }
  
  // Add random products if needed
  if (recommendationSet.size < count) {
    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    for (const p of shuffled) {
      if (recommendationSet.size >= count) break;
      if (p.id !== product.id && !Array.from(recommendationSet).some(rp => rp.id === p.id)) {
        recommendationSet.add(p);
      }
    }
  }
  
  const recommendations = Array.from(recommendationSet).slice(0, count);
  
  console.timeEnd('Recommendations Generation');
  return recommendations;
};

module.exports = {
  generateProducts,
  filterProducts,
  getProductCategories,
  getProductBrands,
  getProductRecommendations
};
