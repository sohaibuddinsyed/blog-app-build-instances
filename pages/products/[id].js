import { useRouter } from 'next/router';
import Head from 'next/head';

// Import data generator
const dataGenerator = require('../../utils/dataGenerator');
const imageProcessing = require('../../utils/imageProcessing');

// Generate paths for a controlled number of products
export async function getStaticPaths() {
  console.log('Generating static paths for products...');
  
  // Generate paths for 100 products
  const paths = Array.from({ length: 100 }, (_, i) => ({
    params: { id: String(i + 1) }
  }));
  
  console.log(`Generated ${paths.length} static paths for products`);
  
  return {
    paths,
    fallback: 'blocking' // Use blocking fallback for better UX
  };
}

// Generate static props for each product page
export async function getStaticProps({ params }) {
  console.log(`Generating static props for product ${params.id}...`);
  
  const productId = parseInt(params.id, 10);
  
  // Generate a dataset with controlled size
  const allProducts = dataGenerator.generateProducts(5000);
  
  // Find the product by ID
  const product = allProducts.find(p => p.id === productId);
  
  // If product not found, return 404
  if (!product) {
    return {
      notFound: true
    };
  }
  
  // Process product image
  const processedImage = await imageProcessing.processProductImage(product.imageUrl, product.id);
  
  // Generate product gallery
  const gallery = await imageProcessing.generateProductGallery(product.id, 8);
  
  // Get related products
  const relatedProducts = dataGenerator.getProductRecommendations(product, allProducts, 10);
  
  // Filter products by same category
  const sameCategory = dataGenerator.filterProducts(allProducts, { category: product.category }).slice(0, 10);
  
  // Filter products by same brand
  const sameBrand = dataGenerator.filterProducts(allProducts, { brand: product.brand }).slice(0, 10);
  
  // Return data for the page
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
        gallery: gallery.map(g => ({
          id: g.id,
          url: g.url,
          width: g.width,
          height: g.height
        })),
        reviews: product.reviews.slice(0, 5).map(review => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          date: review.date
        })),
        specifications: Object.fromEntries(
          Object.entries(product.specifications).slice(0, 10)
        ),
        tags: product.tags.slice(0, 10)
      },
      relatedProducts: relatedProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        brand: p.brand,
        imageUrl: p.imageUrl,
        rating: p.rating
      })),
      categoryProducts: sameCategory.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        brand: p.brand,
        rating: p.rating
      })),
      brandProducts: sameBrand.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        rating: p.rating
      })),
      categoryProductCount: sameCategory.length,
      brandProductCount: sameBrand.length
    }
  };
}

export default function ProductPage({ 
  product, 
  relatedProducts, 
  categoryProducts, 
  brandProducts, 
  categoryProductCount, 
  brandProductCount
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
      </main>
    </div>
  );
}
