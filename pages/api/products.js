// This API route will be processed at build time with optimized memory usage
import { generateProducts, filterProducts } from '../../utils/dataGenerator';
import { processProductImages } from '../../utils/imageProcessing';

// Generate a smaller dataset at build time to reduce memory usage
const allProducts = generateProducts(5000); // Reduced from 50,000 to 5,000

// Pre-compute filtered products for common queries, but with fewer categories
const filteredProducts = {
  electronics: filterProducts(allProducts, { category: 'Electronics' }),
  clothing: filterProducts(allProducts, { category: 'Clothing' }),
  home: filterProducts(allProducts, { category: 'Home & Kitchen' }),
  books: filterProducts(allProducts, { category: 'Books' }),
  techGiant: filterProducts(allProducts, { brand: 'TechGiant' }),
  fashionHub: filterProducts(allProducts, { brand: 'FashionHub' }),
  homeEssentials: filterProducts(allProducts, { brand: 'HomeEssentials' }),
  bookWorld: filterProducts(allProducts, { brand: 'BookWorld' }),
  under100: filterProducts(allProducts, { maxPrice: 100 }),
  under500: filterProducts(allProducts, { maxPrice: 500 }),
  over500: filterProducts(allProducts, { minPrice: 500 }),
  topRated: filterProducts(allProducts, { minRating: 4.5 }),
  search_product: filterProducts(allProducts, { search: 'product' }),
};

// Pre-process fewer product images at build time
let processedImages = [];
(async () => {
  processedImages = await processProductImages(allProducts, 100); // Reduced from 1000 to 100
})();

export default function handler(req, res) {
  const { category, brand, minPrice, maxPrice, minRating, search, sortBy, limit = 20, page = 1 } = req.query;
  
  let result = allProducts;
  
  // Use pre-computed filtered results if available
  if (category === 'Electronics') result = filteredProducts.electronics;
  else if (category === 'Clothing') result = filteredProducts.clothing;
  else if (category === 'Home & Kitchen') result = filteredProducts.home;
  else if (category === 'Books') result = filteredProducts.books;
  else if (brand === 'TechGiant') result = filteredProducts.techGiant;
  else if (brand === 'FashionHub') result = filteredProducts.fashionHub;
  else if (brand === 'HomeEssentials') result = filteredProducts.homeEssentials;
  else if (brand === 'BookWorld') result = filteredProducts.bookWorld;
  else if (maxPrice && maxPrice <= 100) result = filteredProducts.under100;
  else if (maxPrice && maxPrice <= 500) result = filteredProducts.under500;
  else if (minPrice && minPrice >= 500) result = filteredProducts.over500;
  else if (minRating && minRating >= 4.5) result = filteredProducts.topRated;
  else if (search === 'product') result = filteredProducts.search_product;
  else {
    // Apply custom filters
    result = filterProducts(allProducts, { category, brand, minPrice, maxPrice, minRating, search, sortBy });
  }
  
  // Paginate results
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedResult = result.slice(startIndex, endIndex);
  
  res.status(200).json({
    total: result.length,
    page,
    limit,
    totalPages: Math.ceil(result.length / limit),
    products: paginatedResult
  });
}
