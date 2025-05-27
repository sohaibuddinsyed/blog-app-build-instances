// API route for products
export default function handler(req, res) {
  // Import data generator
  const { generateProducts, filterProducts } = require('../../utils/dataGenerator');
  
  // Generate a large dataset
  const allProducts = generateProducts(10000);
  
  // Parse query parameters
  const {
    category,
    brand,
    minPrice,
    maxPrice,
    minRating,
    search,
    sortBy,
    page = '1',
    limit = '50'
  } = req.query;
  
  // Build filters object
  const filters = {
    category,
    brand,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    minRating: minRating ? parseFloat(minRating) : undefined,
    search,
    sortBy
  };
  
  // Filter products
  const filteredProducts = filterProducts(allProducts, filters);
  
  // Pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;
  
  // Get paginated results
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  // Return response
  res.status(200).json({
    products: paginatedProducts,
    pagination: {
      total: filteredProducts.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(filteredProducts.length / limitNum)
    }
  });
}
