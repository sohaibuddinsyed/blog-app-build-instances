// This file is an optimized version of the data generator
// Using modern lodash-es instead of the outdated lodash v3

// Import only the needed functions from lodash-es
import {
  map,
  range,
  random,
  filter,
  includes,
  sortBy,
  take,
  uniq,
  concat,
  shuffle,
  some
} from 'lodash-es';

// Efficient data generation using modern methods
const generateProducts = (count = 10000) => {
  console.time('Data Generation');
  
  const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Toys', 'Beauty', 'Sports', 'Automotive'];
  const brands = ['TechGiant', 'FashionHub', 'HomeEssentials', 'BookWorld', 'ToyLand', 'BeautyGlow', 'SportsMaster', 'AutoPro'];
  
  // More efficient product generation
  const products = Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    const category = categories[random(0, categories.length - 1)];
    const brand = brands[random(0, brands.length - 1)];
    
    // Create details object more efficiently
    const details = {};
    for (let i = 1; i <= 20; i++) {
      details[`detail${i}`] = `Detail value ${i} for product ${id}`;
    }
    
    // Create related products more efficiently
    const relatedProducts = Array.from({ length: 50 }, (_, relIndex) => {
      const relId = relIndex + 1;
      return {
        id: relId === id ? id + 1 : relId,
        name: `Related Product ${relId}`,
        similarity: random(0, 100) / 100
      };
    });
    
    // Create reviews more efficiently
    const reviews = Array.from({ length: 100 }, (_, reviewId) => {
      return {
        id: reviewId + 1,
        userId: random(1, 10000),
        rating: random(1, 5),
        comment: `This is review ${reviewId + 1} for product ${id}. More text to increase size. More text to increase size. More text to increase size. More text to increase size. More text to increase size.`,
        date: new Date(Date.now() - random(0, 365 * 24 * 60 * 60 * 1000)).toISOString()
      };
    });
    
    // Create specifications more efficiently
    const specifications = {};
    for (let i = 1; i <= 15; i++) {
      specifications[`spec${i}`] = `Specification ${i} value for product ${id}`;
    }
    
    return {
      id,
      name: `Product ${id}`,
      description: `This is a detailed description for product ${id}. More description text to increase size. More description text to increase size. More description text to increase size. More description text to increase size. More description text to increase size. More description text to increase size. More description text to increase size. More description text to increase size. More description text to increase size. More description text to increase size.`,
      price: random(999, 99999) / 100,
      category,
      brand,
      stock: random(0, 1000),
      rating: random(1, 50) / 10,
      imageUrl: `https://picsum.photos/seed/${id}/400/300`,
      details,
      relatedProducts,
      reviews,
      tags: Array.from({ length: random(5, 15) }, (_, n) => `tag-${n}-${id}`),
      specifications,
      created: new Date(Date.now() - random(0, 365 * 24 * 60 * 60 * 1000)).toISOString(),
      updated: new Date().toISOString()
    };
  });
  
  console.timeEnd('Data Generation');
  return products;
};

// Efficient product filtering
const filterProducts = (products, filters) => {
  console.time('Product Filtering');
  
  if (!filters) {
    console.timeEnd('Product Filtering');
    return products;
  }
  
  let filteredProducts = products;
  
  // More efficient filtering using modern methods
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
             product.description.toLowerCase().includes(searchLower) ||
             product.tags.some(tag => tag.toLowerCase().includes(searchLower));
    });
  }
  
  // More efficient sorting
  if (filters.sortBy) {
    if (filters.sortBy === 'price-asc') {
      filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-desc') {
      filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'rating-desc') {
      filteredProducts = filteredProducts.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'name') {
      filteredProducts = filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
  }
  
  console.timeEnd('Product Filtering');
  return filteredProducts;
};

// Efficient category counting
const getProductCategories = (products) => {
  console.time('Category Counting');
  
  // Use a Map for more efficient counting
  const categoryMap = new Map();
  
  products.forEach(product => {
    const category = product.category;
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });
  
  // Convert Map to array of objects
  const result = Array.from(categoryMap, ([name, count]) => ({ name, count }));
  
  console.timeEnd('Category Counting');
  return result;
};

// Efficient brand counting
const getProductBrands = (products) => {
  console.time('Brand Counting');
  
  // Use a Map for more efficient counting
  const brandMap = new Map();
  
  products.forEach(product => {
    const brand = product.brand;
    brandMap.set(brand, (brandMap.get(brand) || 0) + 1);
  });
  
  // Convert Map to array of objects
  const result = Array.from(brandMap, ([name, count]) => ({ name, count }));
  
  console.timeEnd('Brand Counting');
  return result;
};

// Efficient product recommendations
const getProductRecommendations = (product, allProducts, count = 10) => {
  console.time('Recommendations Generation');
  
  // More efficient filtering
  const sameCategory = allProducts.filter(p => p.category === product.category && p.id !== product.id);
  const sameBrand = allProducts.filter(p => p.brand === product.brand && p.id !== product.id);
  
  // Combine and remove duplicates more efficiently
  const recommendations = Array.from(new Set([...sameCategory, ...sameBrand].map(p => p.id)))
    .map(id => allProducts.find(p => p.id === id))
    .filter(p => p !== undefined);
  
  // If we still need more recommendations, add random products
  if (recommendations.length < count) {
    const existingIds = new Set(recommendations.map(p => p.id));
    existingIds.add(product.id);
    
    const randomProducts = allProducts
      .filter(p => !existingIds.has(p.id))
      .sort(() => 0.5 - Math.random())
      .slice(0, count - recommendations.length);
    
    recommendations.push(...randomProducts);
  }
  
  const result = recommendations.slice(0, count);
  
  console.timeEnd('Recommendations Generation');
  return result;
};

export {
  generateProducts,
  filterProducts,
  getProductCategories,
  getProductBrands,
  getProductRecommendations
};
