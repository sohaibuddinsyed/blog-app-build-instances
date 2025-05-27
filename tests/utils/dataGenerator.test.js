const {
  generateProducts,
  filterProducts,
  getProductCategories,
  getProductBrands,
  getProductRecommendations
} = require('../../utils/dataGenerator');

describe('Data Generator', () => {
  // Generate a smaller dataset for testing
  const testProducts = generateProducts(100);
  
  describe('generateProducts', () => {
    it('generates the correct number of products', () => {
      const products = generateProducts(50);
      expect(products).toHaveLength(50);
    });
    
    it('generates products with all required fields', () => {
      const product = testProducts[0];
      
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('brand');
      expect(product).toHaveProperty('stock');
      expect(product).toHaveProperty('rating');
      expect(product).toHaveProperty('imageUrl');
      expect(product).toHaveProperty('details');
      expect(product).toHaveProperty('relatedProducts');
      expect(product).toHaveProperty('reviews');
      expect(product).toHaveProperty('tags');
      expect(product).toHaveProperty('specifications');
    });
    
    it('generates unique product IDs', () => {
      const ids = testProducts.map(p => p.id);
      const uniqueIds = [...new Set(ids)];
      
      expect(uniqueIds).toHaveLength(testProducts.length);
    });
  });
  
  describe('filterProducts', () => {
    it('filters products by category', () => {
      const category = testProducts[0].category;
      const filtered = filterProducts(testProducts, { category });
      
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every(p => p.category === category)).toBe(true);
    });
    
    it('filters products by brand', () => {
      const brand = testProducts[0].brand;
      const filtered = filterProducts(testProducts, { brand });
      
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every(p => p.brand === brand)).toBe(true);
    });
    
    it('filters products by price range', () => {
      const minPrice = 20;
      const maxPrice = 50;
      const filtered = filterProducts(testProducts, { minPrice, maxPrice });
      
      expect(filtered.every(p => p.price >= minPrice && p.price <= maxPrice)).toBe(true);
    });
    
    it('filters products by minimum rating', () => {
      const minRating = 4;
      const filtered = filterProducts(testProducts, { minRating });
      
      expect(filtered.every(p => p.rating >= minRating)).toBe(true);
    });
    
    it('filters products by search term', () => {
      const search = 'Product';
      const filtered = filterProducts(testProducts, { search });
      
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      )).toBe(true);
    });
    
    it('sorts products by price ascending', () => {
      const filtered = filterProducts(testProducts, { sortBy: 'price-asc' });
      
      for (let i = 1; i < filtered.length; i++) {
        expect(filtered[i].price).toBeGreaterThanOrEqual(filtered[i-1].price);
      }
    });
    
    it('sorts products by price descending', () => {
      const filtered = filterProducts(testProducts, { sortBy: 'price-desc' });
      
      for (let i = 1; i < filtered.length; i++) {
        expect(filtered[i].price).toBeLessThanOrEqual(filtered[i-1].price);
      }
    });
    
    it('sorts products by rating descending', () => {
      const filtered = filterProducts(testProducts, { sortBy: 'rating-desc' });
      
      for (let i = 1; i < filtered.length; i++) {
        expect(filtered[i].rating).toBeLessThanOrEqual(filtered[i-1].rating);
      }
    });
    
    it('sorts products by name', () => {
      const filtered = filterProducts(testProducts, { sortBy: 'name' });
      
      for (let i = 1; i < filtered.length; i++) {
        expect(filtered[i].name.localeCompare(filtered[i-1].name)).toBeGreaterThanOrEqual(0);
      }
    });
    
    it('combines multiple filters', () => {
      const category = testProducts[0].category;
      const minPrice = 20;
      const maxPrice = 100;
      const minRating = 3;
      
      const filtered = filterProducts(testProducts, {
        category,
        minPrice,
        maxPrice,
        minRating
      });
      
      expect(filtered.every(p => 
        p.category === category &&
        p.price >= minPrice &&
        p.price <= maxPrice &&
        p.rating >= minRating
      )).toBe(true);
    });
  });
  
  describe('getProductCategories', () => {
    it('returns all unique categories with counts', () => {
      const categories = getProductCategories(testProducts);
      
      // Get unique categories from test products
      const uniqueCategories = [...new Set(testProducts.map(p => p.category))];
      
      expect(categories).toHaveLength(uniqueCategories.length);
      
      // Check that each category has the correct count
      categories.forEach(cat => {
        const count = testProducts.filter(p => p.category === cat.name).length;
        expect(cat.count).toBe(count);
      });
    });
  });
  
  describe('getProductBrands', () => {
    it('returns all unique brands with counts', () => {
      const brands = getProductBrands(testProducts);
      
      // Get unique brands from test products
      const uniqueBrands = [...new Set(testProducts.map(p => p.brand))];
      
      expect(brands).toHaveLength(uniqueBrands.length);
      
      // Check that each brand has the correct count
      brands.forEach(brand => {
        const count = testProducts.filter(p => p.brand === brand.name).length;
        expect(brand.count).toBe(count);
      });
    });
  });
  
  describe('getProductRecommendations', () => {
    it('returns the requested number of recommendations', () => {
      const product = testProducts[0];
      const count = 5;
      
      const recommendations = getProductRecommendations(product, testProducts, count);
      
      expect(recommendations).toHaveLength(count);
    });
    
    it('does not include the source product in recommendations', () => {
      const product = testProducts[0];
      
      const recommendations = getProductRecommendations(product, testProducts, 10);
      
      expect(recommendations.some(p => p.id === product.id)).toBe(false);
    });
    
    it('prioritizes products from the same category', () => {
      const product = testProducts[0];
      const sameCategoryCount = testProducts.filter(p => 
        p.category === product.category && p.id !== product.id
      ).length;
      
      // If there are products in the same category, they should be included
      if (sameCategoryCount > 0) {
        const recommendations = getProductRecommendations(product, testProducts, 10);
        
        const sameCategoryRecommendations = recommendations.filter(p => p.category === product.category);
        expect(sameCategoryRecommendations.length).toBeGreaterThan(0);
      }
    });
  });
});
