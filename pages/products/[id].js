import { useRouter } from 'next/router';
import Head from 'next/head';

// Import data generator
const dataGenerator = require('../../utils/dataGenerator');
const imageProcessing = require('../../utils/imageProcessing');

// Generate paths for a massive number of products to increase memory usage
export async function getStaticPaths() {
  console.log('Generating static paths for products...');
  
  // Generate paths for 500 products to increase memory usage
  const paths = Array.from({ length: 500 }, (_, i) => ({
    params: { id: String(i + 1) }
  }));
  
  console.log(`Generated ${paths.length} static paths for products`);
  
  return {
    paths,
    fallback: false // Force static generation of all pages
  };
}

// Generate static props for each product page
export async function getStaticProps({ params }) {
  console.log(`Generating static props for product ${params.id}...`);
  
  const productId = parseInt(params.id, 10);
  
  // Generate a larger dataset to increase memory usage
  const allProducts = dataGenerator.generateProducts(20000); // Increased to 20,000 products
  
  // Find the product by ID
  const product = allProducts.find(p => p.id === productId);
  
  // If product not found, return 404
  if (!product) {
    return {
      notFound: true
    };
  }
  
  // Process product images (memory intensive)
  const processedImage = await imageProcessing.processProductImage(product.imageUrl, product.id);
  
  // Generate product gallery (memory intensive)
  const gallery = await imageProcessing.generateProductGallery(product.id, 30); // Increased from 20 to 30
  
  // Get a larger number of related products
  const relatedProducts = dataGenerator.getProductRecommendations(product, allProducts, 50); // Increased from 30 to 50
  
  // Filter products by same category (memory intensive)
  const sameCategory = dataGenerator.filterProducts(allProducts, { category: product.category });
  
  // Filter products by same brand (memory intensive)
  const sameBrand = dataGenerator.filterProducts(allProducts, { brand: product.brand });
  
  // Filter products by similar price range (memory intensive)
  const similarPrice = dataGenerator.filterProducts(allProducts, { 
    minPrice: product.price * 0.8, 
    maxPrice: product.price * 1.2 
  });
  
  // Filter products by similar rating (memory intensive)
  const similarRating = dataGenerator.filterProducts(allProducts, {
    minRating: Math.max(1, product.rating - 0.5),
    maxRating: Math.min(5, product.rating + 0.5)
  });
  
  // Generate cross-sell products (memory intensive)
  const crossSellProducts = [];
  for (let i = 0; i < 20; i++) {
    const randomIndex = Math.floor(Math.random() * allProducts.length);
    if (allProducts[randomIndex] && allProducts[randomIndex].id !== product.id) {
      crossSellProducts.push(allProducts[randomIndex]);
    }
  }
  
  // Generate upsell products (memory intensive)
  const upsellProducts = dataGenerator.filterProducts(allProducts, {
    minPrice: product.price * 1.2,
    maxPrice: product.price * 2,
    minRating: product.rating
  }).slice(0, 10);
  
  // Return more data to increase memory usage
  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        brand: product.brand,
        rating: product.rating,
        stock: product.stock,
        imageUrl: product.imageUrl,
        imageMetadata: processedImage,
        gallery: gallery.map(g => ({ // Include all gallery data
          id: g.id,
          url: g.url,
          width: g.width,
          height: g.height
        })),
        // Include all reviews to increase data size
        reviews: product.reviews.map(review => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          date: review.date
        })),
        // Include all specifications to increase data size
        specifications: product.specifications,
        // Include all tags to increase data size
        tags: product.tags,
        // Include all related products data
        relatedProducts: product.relatedProducts.map(rp => ({
          id: rp.id,
          name: rp.name,
          similarity: rp.similarity
        }))
      },
      relatedProducts: relatedProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        brand: p.brand,
        imageUrl: p.imageUrl,
        rating: p.rating,
        stock: p.stock,
        description: p.description.substring(0, 200)
      })),
      categoryProducts: sameCategory.slice(0, 20).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        brand: p.brand,
        rating: p.rating
      })),
      brandProducts: sameBrand.slice(0, 20).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        rating: p.rating
      })),
      similarPriceProducts: similarPrice.slice(0, 20).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        brand: p.brand
      })),
      similarRatingProducts: similarRating.slice(0, 20).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        rating: p.rating
      })),
      crossSellProducts: crossSellProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category
      })),
      upsellProducts: upsellProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        rating: p.rating
      })),
      categoryProductCount: sameCategory.length,
      brandProductCount: sameBrand.length,
      similarPriceCount: similarPrice.length,
      similarRatingCount: similarRating.length
    }
  };
}

export default function ProductPage({ 
  product, 
  relatedProducts, 
  categoryProducts, 
  brandProducts, 
  similarPriceProducts, 
  similarRatingProducts,
  crossSellProducts,
  upsellProducts,
  categoryProductCount, 
  brandProductCount, 
  similarPriceCount,
  similarRatingCount
}) {
  const router = useRouter();
  
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <Head>
        <title>{product.name} - E-Commerce Performance Demo</title>
        <meta name="description" content={product.description.substring(0, 160)} />
      </Head>
      
      <main>
        <h1>{product.name}</h1>
        
        <div>
          <img src={product.imageUrl} alt={product.name} width="400" height="300" />
        </div>
        
        <div>
          <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
          <p><strong>Category:</strong> {product.category} ({categoryProductCount} similar products)</p>
          <p><strong>Brand:</strong> {product.brand} ({brandProductCount} products from this brand)</p>
          <p><strong>Rating:</strong> {product.rating}/5</p>
          <p><strong>Stock:</strong> {product.stock} available</p>
          <p><strong>Similar price range:</strong> {similarPriceCount} products</p>
          <p><strong>Similar rating:</strong> {similarRatingCount} products</p>
        </div>
        
        <div>
          <h2>Description</h2>
          <p>{product.description}</p>
        </div>
        
        <div>
          <h2>Tags</h2>
          <p>{product.tags.join(', ')}</p>
        </div>
        
        <div>
          <h2>Specifications</h2>
          <ul>
            {Object.entries(product.specifications).map(([key, value]) => (
              <li key={key}><strong>{key}:</strong> {value}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Product Gallery</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {product.gallery.map(image => (
              <div key={image.id} style={{ margin: '5px' }}>
                <img src={image.url} alt={`Gallery image ${image.id}`} width="100" height="75" />
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2>Reviews</h2>
          {product.reviews.length > 0 ? (
            <ul>
              {product.reviews.map(review => (
                <li key={review.id}>
                  <p><strong>Rating:</strong> {review.rating}/5</p>
                  <p>{review.comment}</p>
                  <p><small>Date: {new Date(review.date).toLocaleDateString()}</small></p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
        
        <div>
          <h2>Related Products</h2>
          <ul>
            {relatedProducts.map(relatedProduct => (
              <li key={relatedProduct.id}>
                <a href={`/products/${relatedProduct.id}`}>
                  {relatedProduct.name} - ${relatedProduct.price.toFixed(2)} ({relatedProduct.category}, {relatedProduct.brand})
                </a>
                <p>{relatedProduct.description}</p>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>More from {product.category}</h2>
          <ul>
            {categoryProducts.map(p => (
              <li key={p.id}>
                <a href={`/products/${p.id}`}>
                  {p.name} - ${p.price.toFixed(2)} ({p.brand})
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>More from {product.brand}</h2>
          <ul>
            {brandProducts.map(p => (
              <li key={p.id}>
                <a href={`/products/${p.id}`}>
                  {p.name} - ${p.price.toFixed(2)} ({p.category})
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Similar Price Range</h2>
          <ul>
            {similarPriceProducts.map(p => (
              <li key={p.id}>
                <a href={`/products/${p.id}`}>
                  {p.name} - ${p.price.toFixed(2)} ({p.category}, {p.brand})
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Similar Rating</h2>
          <ul>
            {similarRatingProducts.map(p => (
              <li key={p.id}>
                <a href={`/products/${p.id}`}>
                  {p.name} - ${p.price.toFixed(2)} - Rating: {p.rating}/5
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Customers Also Bought</h2>
          <ul>
            {crossSellProducts.map(p => (
              <li key={p.id}>
                <a href={`/products/${p.id}`}>
                  {p.name} - ${p.price.toFixed(2)} ({p.category})
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Premium Alternatives</h2>
          <ul>
            {upsellProducts.map(p => (
              <li key={p.id}>
                <a href={`/products/${p.id}`}>
                  {p.name} - ${p.price.toFixed(2)} - Rating: {p.rating}/5
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
