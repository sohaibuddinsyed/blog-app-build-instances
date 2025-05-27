import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/Products.module.css';

export default function Products({ initialProducts, categories, brands }) {
  const router = useRouter();
  const { category, brand, minPrice, maxPrice, minRating, search, sortBy } = router.query;
  
  const [products, setProducts] = useState(initialProducts);
  const [filters, setFilters] = useState({
    category: category || '',
    brand: brand || '',
    minPrice: minPrice || '',
    maxPrice: maxPrice || '',
    minRating: minRating || '',
    search: search || '',
    sortBy: sortBy || 'name'
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Apply filters when query params change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setIsLoading(true);
      
      // Update filters from query params
      const newFilters = {
        category: category || filters.category,
        brand: brand || filters.brand,
        minPrice: minPrice || filters.minPrice,
        maxPrice: maxPrice || filters.maxPrice,
        minRating: minRating || filters.minRating,
        search: search || filters.search,
        sortBy: sortBy || filters.sortBy
      };
      
      setFilters(newFilters);
      
      try {
        // Build query string
        const queryParams = new URLSearchParams();
        if (newFilters.category) queryParams.append('category', newFilters.category);
        if (newFilters.brand) queryParams.append('brand', newFilters.brand);
        if (newFilters.minPrice) queryParams.append('minPrice', newFilters.minPrice);
        if (newFilters.maxPrice) queryParams.append('maxPrice', newFilters.maxPrice);
        if (newFilters.minRating) queryParams.append('minRating', newFilters.minRating);
        if (newFilters.search) queryParams.append('search', newFilters.search);
        if (newFilters.sortBy) queryParams.append('sortBy', newFilters.sortBy);
        
        // Fetch filtered products
        const response = await fetch(`/api/products?${queryParams.toString()}`);
        const data = await response.json();
        
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching filtered products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (router.isReady) {
      fetchFilteredProducts();
    }
  }, [router.isReady, category, brand, minPrice, maxPrice, minRating, search, sortBy]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Apply filters
  const applyFilters = () => {
    // Update URL with filter params
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.brand) queryParams.append('brand', filters.brand);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.minRating) queryParams.append('minRating', filters.minRating);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    
    router.push(`/products?${queryParams.toString()}`);
  };
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Products | E-Commerce Performance Demo</title>
        <meta name="description" content="Browse our products" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Products</h1>
        
        <div className={styles.layout}>
          <div className={styles.sidebar}>
            <div className={styles.filters}>
              <h2>Filters</h2>
              
              <div className={styles.filterGroup}>
                <label htmlFor="search">Search:</label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search products..."
                />
              </div>
              
              <div className={styles.filterGroup}>
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name} ({cat.count})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className={styles.filterGroup}>
                <label htmlFor="brand">Brand:</label>
                <select
                  id="brand"
                  name="brand"
                  value={filters.brand}
                  onChange={handleFilterChange}
                >
                  <option value="">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand.name} value={brand.name}>
                      {brand.name} ({brand.count})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className={styles.filterGroup}>
                <label htmlFor="minPrice">Min Price:</label>
                <input
                  type="number"
                  id="minPrice"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min Price"
                  min="0"
                />
              </div>
              
              <div className={styles.filterGroup}>
                <label htmlFor="maxPrice">Max Price:</label>
                <input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max Price"
                  min="0"
                />
              </div>
              
              <div className={styles.filterGroup}>
                <label htmlFor="minRating">Min Rating:</label>
                <select
                  id="minRating"
                  name="minRating"
                  value={filters.minRating}
                  onChange={handleFilterChange}
                >
                  <option value="">Any Rating</option>
                  <option value="1">1+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>
              
              <div className={styles.filterGroup}>
                <label htmlFor="sortBy">Sort By:</label>
                <select
                  id="sortBy"
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="rating-desc">Rating (High to Low)</option>
                </select>
              </div>
              
              <button 
                className={styles.applyButton}
                onClick={applyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
          
          <div className={styles.productList}>
            {isLoading ? (
              <div className={styles.loading}>Loading products...</div>
            ) : products.length > 0 ? (
              <div className={styles.grid}>
                {products.map(product => (
                  <Link href={`/products/${product.id}`} key={product.id} className={styles.productCard}>
                    <div className={styles.productImage}>
                      <img src={product.imageUrl} alt={product.name} />
                    </div>
                    <h3>{product.name}</h3>
                    <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                    <p className={styles.productCategory}>{product.category}</p>
                    <p className={styles.productBrand}>{product.brand}</p>
                    <p className={styles.productRating}>Rating: {product.rating}/5</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.noProducts}>
                No products found matching your filters.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps({ query }) {
  // Import data generator
  const { 
    generateProducts, 
    filterProducts, 
    getProductCategories,
    getProductBrands 
  } = require('../../utils/dataGenerator');
  
  // Generate a large dataset
  const allProducts = generateProducts(10000);
  
  // Get categories and brands
  const categories = getProductCategories(allProducts);
  const brands = getProductBrands(allProducts);
  
  // Apply initial filters from query
  const filters = {
    category: query.category || '',
    brand: query.brand || '',
    minPrice: query.minPrice ? parseFloat(query.minPrice) : '',
    maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : '',
    minRating: query.minRating ? parseFloat(query.minRating) : '',
    search: query.search || '',
    sortBy: query.sortBy || 'name'
  };
  
  // Filter products
  const filteredProducts = filterProducts(allProducts, filters);
  
  // Limit to first 50 products for initial load
  const initialProducts = filteredProducts.slice(0, 50);
  
  return {
    props: {
      initialProducts,
      categories,
      brands,
    },
  };
}
