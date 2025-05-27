import { useRouter } from 'next/router';
import Head from 'next/head';

// Import data generator
const dataGenerator = require('../../utils/dataGenerator');

// Generate paths for common search terms
export async function getStaticPaths() {
  console.log('Generating static paths for search terms...');
  
  // Define common search terms
  const searchTerms = [
    'product', 'special', 'new', 'premium', 'limited'
  ];
  
  // Create paths for search terms
  const paths = searchTerms.map(term => ({
    params: { term }
  }));
  
  console.log(`Generated ${paths.length} static paths for search terms`);
  
  return {
    paths,
    fallback: 'blocking'
  };
}

// Generate static props for each search term page
export async function getStaticProps({ params }) {
  console.log(`Generating static props for search term ${params.term}...`);
  
  // Generate a dataset with controlled size
  const allProducts = dataGenerator.generateProducts(10000);
  
  // Filter products by search term
  const searchResults = dataGenerator.filterProducts(allProducts, { search: params.term });
  
  // Get categories in search results
  const categoriesInResults = {};
  searchResults.forEach(product => {
    if (!categoriesInResults[product.category]) {
      categoriesInResults[product.category] = 0;
    }
    categoriesInResults[product.category]++;
  });
  
  const categoriesList = Object.entries(categoriesInResults).map(([name, count]) => ({ name, count }));
  
  // Get brands in search results
  const brandsInResults = {};
  searchResults.forEach(product => {
    if (!brandsInResults[product.brand]) {
      brandsInResults[product.brand] = 0;
    }
    brandsInResults[product.brand]++;
  });
  
  const brandsList = Object.entries(brandsInResults).map(([name, count]) => ({ name, count }));
  
  // Return data for the page
  return {
    props: {
      searchTerm: params.term,
      resultCount: searchResults.length,
      categories: categoriesList,
      brands: brandsList,
      featuredResults: searchResults.slice(0, 20).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        brand: p.brand,
        rating: p.rating,
        description: p.description.substring(0, 100)
      }))
    }
  };
}

export default function SearchPage({ searchTerm, resultCount, categories, brands, featuredResults }) {
  const router = useRouter();
  
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <Head>
        <title>Search: {searchTerm} - E-Commerce Performance Demo</title>
        <meta name="description" content={`Search results for "${searchTerm}" - ${resultCount} products found`} />
      </Head>
      
      <main>
        <h1>Search Results for "{searchTerm}"</h1>
        <p>{resultCount} products found</p>
        
        <div>
          <h2>Featured Results</h2>
          <ul>
            {featuredResults.map(product => (
              <li key={product.id}>
                <a href={`/products/${product.id}`}>
                  {product.name} - ${product.price.toFixed(2)} ({product.category}, {product.brand}) - Rating: {product.rating}/5
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
                <a href={`/products?category=${category.name}&search=${searchTerm}`}>
                  {category.name} ({category.count} products)
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Filter by Brand</h2>
          <ul>
            {brands.map(brand => (
              <li key={brand.name}>
                <a href={`/products?brand=${brand.name}&search=${searchTerm}`}>
                  {brand.name} ({brand.count} products)
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
