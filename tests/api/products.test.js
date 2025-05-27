import { createMocks } from 'node-mocks-http';
import productsHandler from '../../pages/api/products';

// Mock the data generator module
jest.mock('../../utils/dataGenerator', () => {
  // Create a small test dataset
  const testProducts = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Test Product ${i + 1}`,
    price: (i + 1) * 10,
    category: i % 2 === 0 ? 'Electronics' : 'Clothing',
    brand: i % 3 === 0 ? 'BrandA' : i % 3 === 1 ? 'BrandB' : 'BrandC',
    rating: (i % 5) + 1,
    stock: i * 5,
    description: `Description for product ${i + 1}`,
    imageUrl: `https://picsum.photos/seed/${i + 1}/400/300`,
    tags: [`tag-${i % 5}`, `tag-${i % 10}`]
  }));
  
  return {
    generateProducts: jest.fn(() => testProducts),
    filterProducts: jest.fn((products, filters) => {
      let filtered = [...products];
      
      if (filters) {
        if (filters.category) {
          filtered = filtered.filter(p => p.category === filters.category);
        }
        
        if (filters.brand) {
          filtered = filtered.filter(p => p.brand === filters.brand);
        }
        
        if (filters.minPrice) {
          filtered = filtered.filter(p => p.price >= filters.minPrice);
        }
        
        if (filters.maxPrice) {
          filtered = filtered.filter(p => p.price <= filters.maxPrice);
        }
        
        if (filters.minRating) {
          filtered = filtered.filter(p => p.rating >= filters.minRating);
        }
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchLower) || 
            p.description.toLowerCase().includes(searchLower) ||
            p.tags.some(tag => tag.toLowerCase().includes(searchLower))
          );
        }
        
        if (filters.sortBy) {
          if (filters.sortBy === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
          } else if (filters.sortBy === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
          } else if (filters.sortBy === 'rating-desc') {
            filtered.sort((a, b) => b.rating - a.rating);
          } else if (filters.sortBy === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
          }
        }
      }
      
      return filtered;
    })
  };
});

describe('/api/products', () => {
  it('returns all products with default pagination', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await productsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('products');
    expect(data).toHaveProperty('pagination');
    expect(data.products).toHaveLength(50); // Default limit
    expect(data.pagination.total).toBe(100);
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.limit).toBe(50);
    expect(data.pagination.totalPages).toBe(2);
  });

  it('filters products by category', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        category: 'Electronics'
      }
    });

    await productsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const data = JSON.parse(res._getData());
    expect(data.products.every(p => p.category === 'Electronics')).toBe(true);
  });

  it('filters products by brand', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        brand: 'BrandA'
      }
    });

    await productsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const data = JSON.parse(res._getData());
    expect(data.products.every(p => p.brand === 'BrandA')).toBe(true);
  });

  it('filters products by price range', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        minPrice: '50',
        maxPrice: '200'
      }
    });

    await productsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const data = JSON.parse(res._getData());
    expect(data.products.every(p => p.price >= 50 && p.price <= 200)).toBe(true);
  });

  it('filters products by minimum rating', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        minRating: '4'
      }
    });

    await productsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const data = JSON.parse(res._getData());
    expect(data.products.every(p => p.rating >= 4)).toBe(true);
  });

  it('filters products by search term', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        search: 'Test'
      }
    });

    await productsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const data = JSON.parse(res._getData());
    expect(data.products.length).toBeGreaterThan(0);
  });

  it('sorts products by price ascending', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        sortBy: 'price-asc'
      }
    });

    await productsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const data = JSON.parse(res._getData());
    const products = data.products;
    
    for (let i = 1; i < products.length; i++) {
      expect(products[i].price).toBeGreaterThanOrEqual(products[i-1].price);
    }
  });

  it('sorts products by price descending', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        sortBy: 'price-desc'
      }
    });

    await productsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const data = JSON.parse(res._getData());
    const products = data.products;
    
    for (let i = 1; i < products.length; i++) {
      expect(products[i].price).toBeLessThanOrEqual(products[i-1].price);
    }
  });

  it('handles pagination correctly', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        page: '2',
        limit: '20'
      }
    });

    await productsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const data = JSON.parse(res._getData());
    expect(data.products).toHaveLength(20);
    expect(data.pagination.page).toBe(2);
    expect(data.pagination.limit).toBe(20);
    expect(data.pagination.totalPages).toBe(5);
  });

  it('combines multiple filters', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        category: 'Electronics',
        minPrice: '50',
        maxPrice: '200',
        minRating: '3',
        sortBy: 'price-desc'
      }
    });

    await productsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const data = JSON.parse(res._getData());
    const products = data.products;
    
    expect(products.every(p => 
      p.category === 'Electronics' &&
      p.price >= 50 &&
      p.price <= 200 &&
      p.rating >= 3
    )).toBe(true);
    
    // Check sorting
    for (let i = 1; i < products.length; i++) {
      expect(products[i].price).toBeLessThanOrEqual(products[i-1].price);
    }
  });
});
