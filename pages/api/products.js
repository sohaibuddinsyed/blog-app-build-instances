// This API route will be processed at build time and consume massive memory
import { generateProducts, filterProducts } from '../../utils/dataGenerator';
import { processProductImages } from '../../utils/imageProcessing';

// Generate a massive dataset at build time
const allProducts = generateProducts(100000); // Increased to 100,000 products

// Pre-compute filtered products for common queries
const filteredProducts = {
  electronics: filterProducts(allProducts, { category: 'Electronics' }),
  clothing: filterProducts(allProducts, { category: 'Clothing' }),
  home: filterProducts(allProducts, { category: 'Home & Kitchen' }),
  books: filterProducts(allProducts, { category: 'Books' }),
  toys: filterProducts(allProducts, { category: 'Toys' }),
  beauty: filterProducts(allProducts, { category: 'Beauty' }),
  sports: filterProducts(allProducts, { category: 'Sports' }),
  automotive: filterProducts(allProducts, { category: 'Automotive' }),
  techGiant: filterProducts(allProducts, { brand: 'TechGiant' }),
  fashionHub: filterProducts(allProducts, { brand: 'FashionHub' }),
  homeEssentials: filterProducts(allProducts, { brand: 'HomeEssentials' }),
  bookWorld: filterProducts(allProducts, { brand: 'BookWorld' }),
  toyLand: filterProducts(allProducts, { brand: 'ToyLand' }),
  beautyGlow: filterProducts(allProducts, { brand: 'BeautyGlow' }),
  sportsMaster: filterProducts(allProducts, { brand: 'SportsMaster' }),
  autoPro: filterProducts(allProducts, { brand: 'AutoPro' }),
  under50: filterProducts(allProducts, { maxPrice: 50 }),
  under100: filterProducts(allProducts, { maxPrice: 100 }),
  under200: filterProducts(allProducts, { maxPrice: 200 }),
  under500: filterProducts(allProducts, { maxPrice: 500 }),
  over500: filterProducts(allProducts, { minPrice: 500 }),
  over1000: filterProducts(allProducts, { minPrice: 1000 }),
  topRated: filterProducts(allProducts, { minRating: 4.5 }),
  search_product: filterProducts(allProducts, { search: 'product' }),
  search_special: filterProducts(allProducts, { search: 'special' }),
  search_new: filterProducts(allProducts, { search: 'new' }),
  search_premium: filterProducts(allProducts, { search: 'premium' }),
  search_limited: filterProducts(allProducts, { search: 'limited' }),
  search_exclusive: filterProducts(allProducts, { search: 'exclusive' }),
  search_best: filterProducts(allProducts, { search: 'best' }),
  search_top: filterProducts(allProducts, { search: 'top' }),
  search_quality: filterProducts(allProducts, { search: 'quality' }),
  search_value: filterProducts(allProducts, { search: 'value' }),
};

// Pre-process many product images at build time
let processedImages = [];
(async () => {
  processedImages = await processProductImages(allProducts, 2000); // Increased from 1000 to 2000
})();

// Generate complex combinations of filters
const complexFilters = {};
const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Toys', 'Beauty', 'Sports', 'Automotive'];
const brands = ['TechGiant', 'FashionHub', 'HomeEssentials', 'BookWorld', 'ToyLand', 'BeautyGlow', 'SportsMaster', 'AutoPro'];
const priceRanges = [
  { min: 0, max: 50 },
  { min: 50, max: 100 },
  { min: 100, max: 200 },
  { min: 200, max: 500 },
  { min: 500, max: 1000 },
  { min: 1000, max: Number.MAX_SAFE_INTEGER }
];

// Generate combinations of category + brand
for (const category of categories) {
  for (const brand of brands) {
    const key = `${category}_${brand}`;
    complexFilters[key] = filterProducts(allProducts, { category, brand });
  }
}

// Generate combinations of category + price range
for (const category of categories) {
  for (const range of priceRanges) {
    const key = `${category}_${range.min}_${range.max}`;
    complexFilters[key] = filterProducts(allProducts, { 
      category, 
      minPrice: range.min, 
      maxPrice: range.max 
    });
  }
}

// Generate combinations of brand + price range
for (const brand of brands) {
  for (const range of priceRanges) {
    const key = `${brand}_${range.min}_${range.max}`;
    complexFilters[key] = filterProducts(allProducts, { 
      brand, 
      minPrice: range.min, 
      maxPrice: range.max 
    });
  }
}

export default function handler(req, res) {
  const { category, brand, minPrice, maxPrice, minRating, search, sortBy, limit = 20, page = 1 } = req.query;
  
  let result = allProducts;
  
  // Use pre-computed filtered results if available
  if (category === 'Electronics') result = filteredProducts.electronics;
  else if (category === 'Clothing') result = filteredProducts.clothing;
  else if (category === 'Home & Kitchen') result = filteredProducts.home;
  else if (category === 'Books') result = filteredProducts.books;
  else if (category === 'Toys') result = filteredProducts.toys;
  else if (category === 'Beauty') result = filteredProducts.beauty;
  else if (category === 'Sports') result = filteredProducts.sports;
  else if (category === 'Automotive') result = filteredProducts.automotive;
  else if (brand === 'TechGiant') result = filteredProducts.techGiant;
  else if (brand === 'FashionHub') result = filteredProducts.fashionHub;
  else if (brand === 'HomeEssentials') result = filteredProducts.homeEssentials;
  else if (brand === 'BookWorld') result = filteredProducts.bookWorld;
  else if (brand === 'ToyLand') result = filteredProducts.toyLand;
  else if (brand === 'BeautyGlow') result = filteredProducts.beautyGlow;
  else if (brand === 'SportsMaster') result = filteredProducts.sportsMaster;
  else if (brand === 'AutoPro') result = filteredProducts.autoPro;
  else if (maxPrice && maxPrice <= 50) result = filteredProducts.under50;
  else if (maxPrice && maxPrice <= 100) result = filteredProducts.under100;
  else if (maxPrice && maxPrice <= 200) result = filteredProducts.under200;
  else if (maxPrice && maxPrice <= 500) result = filteredProducts.under500;
  else if (minPrice && minPrice >= 500) result = filteredProducts.over500;
  else if (minPrice && minPrice >= 1000) result = filteredProducts.over1000;
  else if (minRating && minRating >= 4.5) result = filteredProducts.topRated;
  else if (search === 'product') result = filteredProducts.search_product;
  else if (search === 'special') result = filteredProducts.search_special;
  else if (search === 'new') result = filteredProducts.search_new;
  else if (search === 'premium') result = filteredProducts.search_premium;
  else if (search === 'limited') result = filteredProducts.search_limited;
  else if (search === 'exclusive') result = filteredProducts.search_exclusive;
  else if (search === 'best') result = filteredProducts.search_best;
  else if (search === 'top') result = filteredProducts.search_top;
  else if (search === 'quality') result = filteredProducts.search_quality;
  else if (search === 'value') result = filteredProducts.search_value;
  // Check complex filter combinations
  else if (category && brand) {
    const key = `${category}_${brand}`;
    if (complexFilters[key]) result = complexFilters[key];
    else result = filterProducts(allProducts, { category, brand });
  }
  else if (category && minPrice && maxPrice) {
    const key = `${category}_${minPrice}_${maxPrice}`;
    if (complexFilters[key]) result = complexFilters[key];
    else result = filterProducts(allProducts, { category, minPrice, maxPrice });
  }
  else if (brand && minPrice && maxPrice) {
    const key = `${brand}_${minPrice}_${maxPrice}`;
    if (complexFilters[key]) result = complexFilters[key];
    else result = filterProducts(allProducts, { brand, minPrice, maxPrice });
  }
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
