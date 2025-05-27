import { useRouter } from 'next/router';
import Head from 'next/head';

// Import data generator
const dataGenerator = require('../../utils/dataGenerator');

// Generate all possible category paths at build time
export async function getStaticPaths() {
  console.log('Generating static paths for all categories...');
  
  // Define all possible categories - using all 8 categories to increase memory usage
  const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Toys', 'Beauty', 'Sports', 'Automotive'];
  
  // Create paths for all categories
  const paths = categories.map(category => ({
    params: { category }
  }));
  
  console.log(`Generated ${paths.length} static paths for categories`);
  
  return {
    paths,
    fallback: false // Changed back to false to force static generation of all pages
  };
}

// Generate static props for each category page
export async function getStaticProps({ params }) {
  console.log(`Generating static props for category ${params.category}...`);
  
  // Generate a larger dataset to increase memory usage but still work with 14GB
  const allProducts = dataGenerator.generateProducts(20000); // Increased from 1,000 to 20,000
  
  // Filter products by category
  const categoryProducts = dataGenerator.filterProducts(allProducts, { category: params.category });
  
  // Get all brands in this category
  const brandsInCategory = {};
  categoryProducts.forEach(product => {
    if (!brandsInCategory[product.brand]) {
      brandsInCategory[product.brand] = 0;
    }
    brandsInCategory[product.brand]++;
  });
  
  const brandsList = Object.entries(brandsInCategory).map(([name, count]) => ({ name, count }));
  
  // Get price ranges in this category (using more ranges to increase memory usage)
  const priceRanges = [
    { min: 0, max: 50, count: 0 },
    { min: 50, max: 100, count: 0 },
    { min: 100, max: 200, count: 0 },
    { min: 200, max: 500, count: 0 },
    { min: 500, max: 1000, count: 0 },
    { min: 1000, max: Number.MAX_SAFE_INTEGER, count: 0 }
  ];
  
  categoryProducts.forEach(product => {
    for (const range of priceRanges) {
      if (product.price >= range.min && product.price <= range.max) {
        range.count++;
        break;
      }
    }
  });
  
  // Get rating distribution (using more ranges to increase memory usage)
  const ratingDistribution = {
    '1-2': 0,
    '2-3': 0,
    '3-4': 0,
    '4-5': 0
  };
  
  categoryProducts.forEach(product => {
    if (product.rating < 2) ratingDistribution['1-2']++;
    else if (product.rating < 3) ratingDistribution['2-3']++;
    else if (product.rating < 4) ratingDistribution['3-4']++;
    else ratingDistribution['4-5']++;
  });
  
  // Filter by each brand to get counts (memory intensive operation)
  const productsByBrand = {};
  for (const brand of Object.keys(brandsInCategory)) {
    productsByBrand[brand] = dataGenerator.filterProducts(categoryProducts, { brand });
  }
  
  // Filter by each price range to get counts (memory intensive operation)
  const productsByPriceRange = {};
  for (const range of priceRanges) {
    const key = `${range.min}-${range.max}`;
    productsByPriceRange[key] = dataGenerator.filterProducts(categoryProducts, { 
      minPrice: range.min, 
      maxPrice: range.max 
    });
  }
  
  // Return more data to increase memory usage
  return {
    props: {
      category: params.category,
      productCount: categoryProducts.length,
      brands: brandsList,
      priceRanges: priceRanges.map(range => ({
        label: range.min === 0 ? `Under $${range.max}` : 
               range.max === Number.MAX_SAFE_INTEGER ? `$${range.min}+` : 
               `$${range.min} - $${range.max}`,
        count: range.count
      })),
      ratingDistribution,
      featuredProducts: categoryProducts.slice(0, 50).map(p => ({ // Increased from 5 to 50
        id: p.id,
        name: p.name,
        price: p.price,
        brand: p.brand,
        rating: p.rating,
        description: p.description.substring(0, 200), // Adding description to increase data size
        stock: p.stock,
        tags: p.tags.slice(0, 10) // Adding tags to increase data size
      }))
    }
  };
}

export default function CategoryPage({ category, productCount, brands, priceRanges, ratingDistribution, featuredProducts }) {
  const router = useRouter();
  
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <Head>
        <title>{category} - E-Commerce Performance Demo</title>
        <meta name="description" content={`Browse our selection of ${productCount} ${category} products`} />
      </Head>
      
      <main>
        <h1>{category}</h1>
        <p>{productCount} products found</p>
        
        <div>
          <h2>Featured Products</h2>
          <ul>
            {featuredProducts.map(product => (
              <li key={product.id}>
                {product.name} - ${product.price} ({product.brand}) - Rating: {product.rating}/5
                <p>{product.description}</p>
                <p>Stock: {product.stock}</p>
                <p>Tags: {product.tags.join(', ')}</p>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Filter by Brand</h2>
          <ul>
            {brands.map(brand => (
              <li key={brand.name}>
                {brand.name} ({brand.count} products)
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Filter by Price</h2>
          <ul>
            {priceRanges.map(range => (
              <li key={range.label}>
                {range.label} ({range.count} products)
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Filter by Rating</h2>
          <ul>
            <li>1-2 Stars: {ratingDistribution['1-2']} products</li>
            <li>2-3 Stars: {ratingDistribution['2-3']} products</li>
            <li>3-4 Stars: {ratingDistribution['3-4']} products</li>
            <li>4-5 Stars: {ratingDistribution['4-5']} products</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
