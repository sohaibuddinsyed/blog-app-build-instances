import { useRouter } from 'next/router';
import Head from 'next/head';

// Import data generator
const dataGenerator = require('../../utils/dataGenerator');

// Generate all possible category paths at build time
export async function getStaticPaths() {
  console.log('Generating static paths for all categories...');
  
  // Define all possible categories
  const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Toys', 'Beauty', 'Sports', 'Automotive'];
  
  // Create paths for all categories
  const paths = categories.map(category => ({
    params: { category }
  }));
  
  console.log(`Generated ${paths.length} static paths for categories`);
  
  return {
    paths,
    fallback: 'blocking'
  };
}

// Generate static props for each category page
export async function getStaticProps({ params }) {
  console.log(`Generating static props for category ${params.category}...`);
  
  // Generate a dataset with controlled size
  const allProducts = dataGenerator.generateProducts(10000);
  
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
  
  // Get price ranges in this category
  const priceRanges = [
    { min: 0, max: 100, count: 0 },
    { min: 100, max: 500, count: 0 },
    { min: 500, max: Number.MAX_SAFE_INTEGER, count: 0 }
  ];
  
  categoryProducts.forEach(product => {
    for (const range of priceRanges) {
      if (product.price >= range.min && product.price <= range.max) {
        range.count++;
        break;
      }
    }
  });
  
  // Get rating distribution
  const ratingDistribution = {
    '1-3': 0,
    '3-5': 0
  };
  
  categoryProducts.forEach(product => {
    if (product.rating < 3) ratingDistribution['1-3']++;
    else ratingDistribution['3-5']++;
  });
  
  // Return data for the page
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
      featuredProducts: categoryProducts.slice(0, 20).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        brand: p.brand,
        rating: p.rating,
        description: p.description.substring(0, 100)
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
                <a href={`/products/${product.id}`}>
                  {product.name} - ${product.price.toFixed(2)} ({product.brand}) - Rating: {product.rating}/5
                </a>
                <p>{product.description}</p>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Filter by Brand</h2>
          <ul>
            {brands.map(brand => (
              <li key={brand.name}>
                <a href={`/products?category=${category}&brand=${brand.name}`}>
                  {brand.name} ({brand.count} products)
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Filter by Price</h2>
          <ul>
            {priceRanges.map(range => (
              <li key={range.label}>
                <a href={`/products?category=${category}&${range.label.includes('Under') ? 'maxPrice=' + range.label.replace('Under $', '') : range.label.includes('+') ? 'minPrice=' + range.label.replace('$', '').replace('+', '') : 'minPrice=' + range.label.split(' - ')[0].replace('$', '') + '&maxPrice=' + range.label.split(' - ')[1].replace('$', '')}`}>
                  {range.label} ({range.count} products)
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Filter by Rating</h2>
          <ul>
            <li><a href={`/products?category=${category}&minRating=1&maxRating=3`}>1-3 Stars: {ratingDistribution['1-3']} products</a></li>
            <li><a href={`/products?category=${category}&minRating=3&maxRating=5`}>3-5 Stars: {ratingDistribution['3-5']} products</a></li>
          </ul>
        </div>
      </main>
    </div>
  );
}
