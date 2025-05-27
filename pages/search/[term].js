import { useRouter } from 'next/router';
import Head from 'next/head';

// Import data generator
const dataGenerator = require('../../utils/dataGenerator');

// Generate all possible search term paths at build time
export async function getStaticPaths() {
  console.log('Generating static paths for search terms...');
  
  // Define common search terms
  const searchTerms = [
    'product', 'special', 'new', 'premium', 'limited', 'exclusive', 
    'best', 'top', 'quality', 'value', 'discount', 'sale', 'offer',
    'deal', 'popular', 'trending', 'featured', 'recommended', 'hot'
  ];
  
  // Create paths for all search terms
  const paths = searchTerms.map(term => ({
    params: { term }
  }));
  
  console.log(`Generated ${paths.length} static paths for search terms`);
  
  return {
    paths,
    fallback: false // Force static generation of all pages
  };
}

// Generate static props for each search term page
export async function getStaticProps({ params }) {
  console.log(`Generating static props for search term ${params.term}...`);
  
  // Generate a large dataset to increase memory usage
  const allProducts = dataGenerator.generateProducts(30000); // Generate 30,000 products
  
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
  
  // Get price ranges in search results
  const priceRanges = [
    { min: 0, max: 50, count: 0 },
    { min: 50, max: 100, count: 0 },
    { min: 100, max: 200, count: 0 },
    { min: 200, max: 500, count: 0 },
    { min: 500, max: 1000, count: 0 },
    { min: 1000, max: Number.MAX_SAFE_INTEGER, count: 0 }
  ];
  
  searchResults.forEach(product => {
    for (const range of priceRanges) {
      if (product.price >= range.min && product.price <= range.max) {
        range.count++;
        break;
      }
    }
  });
  
  // Get rating distribution in search results
  const ratingDistribution = {
    '1-2': 0,
    '2-3': 0,
    '3-4': 0,
    '4-5': 0
  };
  
  searchResults.forEach(product => {
    if (product.rating < 2) ratingDistribution['1-2']++;
    else if (product.rating < 3) ratingDistribution['2-3']++;
    else if (product.rating < 4) ratingDistribution['3-4']++;
    else ratingDistribution['4-5']++;
  });
  
  // Filter by each category to get counts (memory intensive)
  const productsByCategory = {};
  for (const category of Object.keys(categoriesInResults)) {
    productsByCategory[category] = dataGenerator.filterProducts(searchResults, { category });
  }
  
  // Filter by each brand to get counts (memory intensive)
  const productsByBrand = {};
  for (const brand of Object.keys(brandsInResults)) {
    productsByBrand[brand] = dataGenerator.filterProducts(searchResults, { brand });
  }
  
  // Filter by each price range to get counts (memory intensive)
  const productsByPriceRange = {};
  for (const range of priceRanges) {
    const key = `${range.min}-${range.max}`;
    productsByPriceRange[key] = dataGenerator.filterProducts(searchResults, { 
      minPrice: range.min, 
      maxPrice: range.max 
    });
  }
  
  // Generate related search terms (memory intensive)
  const relatedTerms = [
    'product', 'special', 'new', 'premium', 'limited', 'exclusive', 
    'best', 'top', 'quality', 'value', 'discount', 'sale', 'offer',
    'deal', 'popular', 'trending', 'featured', 'recommended', 'hot'
  ].filter(term => term !== params.term);
  
  const relatedSearchResults = {};
  for (const term of relatedTerms.slice(0, 5)) {
    relatedSearchResults[term] = dataGenerator.filterProducts(allProducts, { search: term }).slice(0, 5);
  }
  
  // Return data for the page
  return {
    props: {
      searchTerm: params.term,
      resultCount: searchResults.length,
      categories: categoriesList,
      brands: brandsList,
      priceRanges: priceRanges.map(range => ({
        label: range.min === 0 ? `Under $${range.max}` : 
               range.max === Number.MAX_SAFE_INTEGER ? `$${range.min}+` : 
               `$${range.min} - $${range.max}`,
        count: range.count
      })),
      ratingDistribution,
      featuredResults: searchResults.slice(0, 50).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        brand: p.brand,
        rating: p.rating,
        description: p.description.substring(0, 200),
        stock: p.stock,
        tags: p.tags.slice(0, 10)
      })),
      categoryBreakdown: Object.entries(productsByCategory).map(([category, products]) => ({
        category,
        count: products.length,
        topProducts: products.slice(0, 3).map(p => ({
          id: p.id,
          name: p.name,
          price: p.price
        }))
      })),
      brandBreakdown: Object.entries(productsByBrand).map(([brand, products]) => ({
        brand,
        count: products.length,
        topProducts: products.slice(0, 3).map(p => ({
          id: p.id,
          name: p.name,
          price: p.price
        }))
      })),
      priceBreakdown: Object.entries(productsByPriceRange).map(([range, products]) => ({
        range,
        count: products.length,
        topProducts: products.slice(0, 3).map(p => ({
          id: p.id,
          name: p.name,
          price: p.price
        }))
      })),
      relatedSearches: Object.entries(relatedSearchResults).map(([term, products]) => ({
        term,
        count: products.length,
        topProducts: products.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price
        }))
      }))
    }
  };
}

export default function SearchPage({ 
  searchTerm, 
  resultCount, 
  categories, 
  brands, 
  priceRanges, 
  ratingDistribution, 
  featuredResults,
  categoryBreakdown,
  brandBreakdown,
  priceBreakdown,
  relatedSearches
}) {
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
                <p>Stock: {product.stock}</p>
                <p>Tags: {product.tags?.join(', ')}</p>
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
        
        <div>
          <h2>Filter by Price</h2>
          <ul>
            {priceRanges.map(range => (
              <li key={range.label}>
                <a href={`/products?search=${searchTerm}&${range.label.includes('Under') ? 'maxPrice=' + range.label.replace('Under $', '') : range.label.includes('+') ? 'minPrice=' + range.label.replace('$', '').replace('+', '') : 'minPrice=' + range.label.split(' - ')[0].replace('$', '') + '&maxPrice=' + range.label.split(' - ')[1].replace('$', '')}`}>
                  {range.label} ({range.count} products)
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Filter by Rating</h2>
          <ul>
            <li><a href={`/products?search=${searchTerm}&minRating=1&maxRating=2`}>1-2 Stars: {ratingDistribution['1-2']} products</a></li>
            <li><a href={`/products?search=${searchTerm}&minRating=2&maxRating=3`}>2-3 Stars: {ratingDistribution['2-3']} products</a></li>
            <li><a href={`/products?search=${searchTerm}&minRating=3&maxRating=4`}>3-4 Stars: {ratingDistribution['3-4']} products</a></li>
            <li><a href={`/products?search=${searchTerm}&minRating=4&maxRating=5`}>4-5 Stars: {ratingDistribution['4-5']} products</a></li>
          </ul>
        </div>
        
        <div>
          <h2>Category Breakdown</h2>
          <ul>
            {categoryBreakdown.map(item => (
              <li key={item.category}>
                <h3>{item.category} ({item.count} products)</h3>
                <ul>
                  {item.topProducts.map(product => (
                    <li key={product.id}>
                      <a href={`/products/${product.id}`}>
                        {product.name} - ${product.price.toFixed(2)}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Brand Breakdown</h2>
          <ul>
            {brandBreakdown.map(item => (
              <li key={item.brand}>
                <h3>{item.brand} ({item.count} products)</h3>
                <ul>
                  {item.topProducts.map(product => (
                    <li key={product.id}>
                      <a href={`/products/${product.id}`}>
                        {product.name} - ${product.price.toFixed(2)}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Price Breakdown</h2>
          <ul>
            {priceBreakdown.map(item => (
              <li key={item.range}>
                <h3>${item.range} ({item.count} products)</h3>
                <ul>
                  {item.topProducts.map(product => (
                    <li key={product.id}>
                      <a href={`/products/${product.id}`}>
                        {product.name} - ${product.price.toFixed(2)}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Related Searches</h2>
          <ul>
            {relatedSearches.map(item => (
              <li key={item.term}>
                <h3><a href={`/search/${item.term}`}>"{item.term}"</a> ({item.count} products)</h3>
                <ul>
                  {item.topProducts.map(product => (
                    <li key={product.id}>
                      <a href={`/products/${product.id}`}>
                        {product.name} - ${product.price.toFixed(2)}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
