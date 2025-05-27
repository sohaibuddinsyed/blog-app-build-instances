// This file generates a large dataset of products
const _ = require('lodash');

// Inefficient data generation using outdated lodash methods
const generateProducts = (count = 10000) => {
  console.time('Data Generation');
  
  const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Toys', 'Beauty', 'Sports', 'Automotive'];
  const brands = ['TechGiant', 'FashionHub', 'HomeEssentials', 'BookWorld', 'ToyLand', 'BeautyGlow', 'SportsMaster', 'AutoPro'];
  
  // Inefficient way to generate products using old lodash methods
  const products = _.map(_.range(1, count + 1), (id) => {
    const category = categories[_.random(0, categories.length - 1)];
    const brand = brands[_.random(0, brands.length - 1)];
    
    // Create a lot of nested objects to increase memory usage
    const details = _.reduce(_.range(1, 20), (result, i) => {
      result[`detail${i}`] = `Detail value ${i} for product ${id}`;
      return result;
    }, {});
    
    // Create large arrays of related products
    const relatedProducts = _.map(_.range(1, 50), (relId) => {
      return {
        id: relId === id ? id + 1 : relId,
        name: `Related Product ${relId}`,
        similarity: _.random(0, 100) / 100
      };
    });
    
    // Create large arrays of reviews
    const reviews = _.map(_.range(1, 100), (reviewId) => {
      return {
        id: reviewId,
        userId: _.random(1, 10000),
        rating: _.random(1, 5),
        comment: `This is review ${reviewId} for product ${id}. ${_.repeat('More text to increase size. ', 5)}`,
        date: new Date(Date.now() - _.random(0, 365 * 24 * 60 * 60 * 1000)).toISOString()
      };
    });
    
    return {
      id,
      name: `Product ${id}`,
      description: `This is a detailed description for product ${id}. ${_.repeat('More description text to increase size. ', 10)}`,
      price: _.random(999, 99999) / 100,
      category,
      brand,
      stock: _.random(0, 1000),
      rating: _.random(1, 50) / 10,
      imageUrl: `https://picsum.photos/seed/${id}/400/300`,
      details,
      relatedProducts,
      reviews,
      tags: _.times(_.random(5, 15), (n) => `tag-${n}-${id}`),
      specifications: _.reduce(_.range(1, 15), (result, i) => {
        result[`spec${i}`] = `Specification ${i} value for product ${id}`;
        return result;
      }, {}),
      created: new Date(Date.now() - _.random(0, 365 * 24 * 60 * 60 * 1000)).toISOString(),
      updated: new Date().toISOString()
    };
  });
  
  console.timeEnd('Data Generation');
  return products;
};

// Function to filter products - intentionally inefficient
const filterProducts = (products, filters) => {
  console.time('Product Filtering');
  
  let filteredProducts = products;
  
  if (filters) {
    // Inefficient filtering using old lodash methods
    if (filters.category) {
      filteredProducts = _.filter(filteredProducts, product => product.category === filters.category);
    }
    
    if (filters.brand) {
      filteredProducts = _.filter(filteredProducts, product => product.brand === filters.brand);
    }
    
    if (filters.minPrice) {
      filteredProducts = _.filter(filteredProducts, product => product.price >= filters.minPrice);
    }
    
    if (filters.maxPrice) {
      filteredProducts = _.filter(filteredProducts, product => product.price <= filters.maxPrice);
    }
    
    if (filters.minRating) {
      filteredProducts = _.filter(filteredProducts, product => product.rating >= filters.minRating);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProducts = _.filter(filteredProducts, product => {
        return _.includes(product.name.toLowerCase(), searchLower) || 
               _.includes(product.description.toLowerCase(), searchLower) ||
               _.some(product.tags, tag => _.includes(tag.toLowerCase(), searchLower));
      });
    }
    
    // Inefficient sorting
    if (filters.sortBy) {
      if (filters.sortBy === 'price-asc') {
        filteredProducts = _.sortBy(filteredProducts, 'price');
      } else if (filters.sortBy === 'price-desc') {
        filteredProducts = _.sortBy(filteredProducts, 'price').reverse();
      } else if (filters.sortBy === 'rating-desc') {
        filteredProducts = _.sortBy(filteredProducts, 'rating').reverse();
      } else if (filters.sortBy === 'name') {
        filteredProducts = _.sortBy(filteredProducts, 'name');
      }
    }
  }
  
  console.timeEnd('Product Filtering');
  return filteredProducts;
};

// Function to get product categories with counts - intentionally inefficient
const getProductCategories = (products) => {
  console.time('Category Counting');
  
  const categories = {};
  
  // Inefficient way to count categories
  _.forEach(products, (product) => {
    if (!categories[product.category]) {
      categories[product.category] = 0;
    }
    categories[product.category] += 1;
  });
  
  // Convert to array of objects
  const result = _.map(categories, (count, name) => ({ name, count }));
  
  console.timeEnd('Category Counting');
  return result;
};

// Function to get product brands with counts - intentionally inefficient
const getProductBrands = (products) => {
  console.time('Brand Counting');
  
  const brands = {};
  
  // Inefficient way to count brands
  _.forEach(products, (product) => {
    if (!brands[product.brand]) {
      brands[product.brand] = 0;
    }
    brands[product.brand] += 1;
  });
  
  // Convert to array of objects
  const result = _.map(brands, (count, name) => ({ name, count }));
  
  console.timeEnd('Brand Counting');
  return result;
};

// Generate product recommendations - intentionally inefficient
const getProductRecommendations = (product, allProducts, count = 10) => {
  console.time('Recommendations Generation');
  
  // Ensure allProducts is an array
  if (!Array.isArray(allProducts)) {
    console.error('allProducts is not an array:', allProducts);
    return [];
  }
  
  // Inefficient way to generate recommendations
  const sameCategory = _.filter(allProducts, p => p && p.category === product.category && p.id !== product.id);
  const sameBrand = _.filter(allProducts, p => p && p.brand === product.brand && p.id !== product.id);
  
  // Combine arrays manually instead of using concat
  let recommendations = [];
  
  // Add items from sameCategory
  for (let i = 0; i < sameCategory.length; i++) {
    recommendations.push(sameCategory[i]);
  }
  
  // Add items from sameBrand if not already in recommendations
  for (let i = 0; i < sameBrand.length; i++) {
    const brandItem = sameBrand[i];
    let isDuplicate = false;
    
    for (let j = 0; j < recommendations.length; j++) {
      if (recommendations[j].id === brandItem.id) {
        isDuplicate = true;
        break;
      }
    }
    
    if (!isDuplicate) {
      recommendations.push(brandItem);
    }
  }
  
  // If we still need more recommendations, add random products
  if (recommendations.length < count) {
    // Shuffle allProducts
    const shuffled = _.shuffle(allProducts);
    
    for (let i = 0; i < shuffled.length && recommendations.length < count; i++) {
      const randomProduct = shuffled[i];
      
      // Skip if it's the original product or already in recommendations
      if (randomProduct.id === product.id) {
        continue;
      }
      
      let isDuplicate = false;
      for (let j = 0; j < recommendations.length; j++) {
        if (recommendations[j].id === randomProduct.id) {
          isDuplicate = true;
          break;
        }
      }
      
      if (!isDuplicate) {
        recommendations.push(randomProduct);
      }
    }
  } else if (recommendations.length > count) {
    // Trim to count
    recommendations = recommendations.slice(0, count);
  }
  
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
