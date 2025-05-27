import { useRouter } from 'next/router';
import Head from 'next/head';

// Import data generator
const dataGenerator = require('../../utils/dataGenerator');

// Generate all possible brand paths at build time
export async function getStaticPaths() {
  console.log('Generating static paths for all brands...');
  
  // Define all possible brands
  const brands = ['TechGiant', 'FashionHub', 'HomeEssentials', 'BookWorld', 'ToyLand', 'BeautyGlow', 'SportsMaster', 'AutoPro'];
  
  // Create paths for all brands
  const paths = brands.map(brand => ({
    params: { brand }
  }));
  
  console.log(`Generated ${paths.length} static paths for brands`);
  
  return {
    paths,
    fallback: 'blocking'
  };
}

// Generate static props for each brand page
export async function getStaticProps({ params }) {
  console.log(`Generating static props for brand ${params.brand}...`);
  
  // Generate a dataset with controlled size
  const allProducts = dataGenerator.generateProducts(10000);
  
  // Filter products by brand
  const brandProducts = dataGenerator.filterProducts(allProducts, { brand: params.brand });
  
  // Get all categories for this brand
  const categoriesInBrand = {};
  brandProducts.forEach(product => {
    if (!categoriesInBrand[product.category]) {
      categoriesInBrand[product.category] = 0;
    }
    categoriesInBrand[product.category]++;
  });
  
  const categoriesList = Object.entries(categoriesInBrand).map(([name, count]) => ({ name, count }));
  
  // Get price ranges for this brand
  const priceRanges = [
    { min: 0, max: 100, count: 0 },
    { min: 100, max: 500, count: 0 },
    { min: 500, max: Number.MAX_SAFE_INTEGER, count: 0 }
  ];
  
  brandProducts.forEach(product => {
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
  
  brandProducts.forEach(product => {
    if (product.rating < 3) ratingDistribution['1-3']++;
    else ratingDistribution['3-5']++;
  });
  
  // Return data for the page
  return {
    props: {
      brand: params.brand,
      productCount: brandProducts.length,
      categories: categoriesList,
      priceRanges: priceRanges.map(range => ({
        label: range.min === 0 ? `Under $${range.max}` : 
               range.max === Number.MAX_SAFE_INTEGER ? `$${range.min}+` : 
               `$${range.min} - $${range.max}`,
        count: range.count
      })),
      ratingDistribution,
      featuredProducts: brandProducts.slice(0, 20).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        rating: p.rating,
        description: p.description.substring(0, 100)
      }))
    }
  };
}

export default function BrandPage({ brand, productCount, categories, priceRanges, ratingDistribution, featuredProducts }) {
  const router = useRouter();
  
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <Head>
        <title>{brand} - E-Commerce Performance Demo</title>
        <meta name="description" content={`Browse our selection of ${productCount} ${brand} products`} />
      </Head>
      
      <main>
        <h1>{brand}</h1>
        <p>{productCount} products found</p>
        
        <div>
          <h2>Featured Products</h2>
          <ul>
            {featuredProducts.map(product => (
              <li key={product.id}>
                <a href={`/products/${product.id}`}>
                  {product.name} - ${product.price.toFixed(2)} ({product.category}) - Rating: {product.rating}/5
                </a>
                <p>{product.description}</p>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Filter by Category</h2>
          <ul>
            {categories.map(category => (
              <li key={category.name}>
                <a href={`/products?brand=${brand}&category=${category.name}`}>
                  {category.name} ({category.count} products)
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
                <a href={`/products?brand=${brand}&${range.label.includes('Under') ? 'maxPrice=' + range.label.replace('Under $', '') : range.label.includes('+') ? 'minPrice=' + range.label.replace('$', '').replace('+', '') : 'minPrice=' + range.label.split(' - ')[0].replace('$', '') + '&maxPrice=' + range.label.split(' - ')[1].replace('$', '')}`}>
                  {range.label} ({range.count} products)
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Filter by Rating</h2>
          <ul>
            <li><a href={`/products?brand=${brand}&minRating=1&maxRating=3`}>1-3 Stars: {ratingDistribution['1-3']} products</a></li>
            <li><a href={`/products?brand=${brand}&minRating=3&maxRating=5`}>3-5 Stars: {ratingDistribution['3-5']} products</a></li>
          </ul>
        </div>
      </main>
    </div>
  );
}
