import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/ProductDetail.module.css';

export default function ProductDetail({ product, recommendations, gallery }) {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle loading state
  useEffect(() => {
    if (router.isFallback) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [router.isFallback]);
  
  if (router.isFallback || isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading product details...</div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Product not found</div>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>{product.name} | E-Commerce Performance Demo</title>
        <meta name="description" content={product.description.substring(0, 160)} />
      </Head>

      <main className={styles.main}>
        <div className={styles.breadcrumbs}>
          <Link href="/">Home</Link> &gt; 
          <Link href="/products">Products</Link> &gt; 
          <Link href={`/products?category=${product.category}`}>{product.category}</Link> &gt; 
          <span>{product.name}</span>
        </div>
        
        <div className={styles.productLayout}>
          <div className={styles.productGallery}>
            <div className={styles.mainImage}>
              <img 
                src={gallery && gallery.length > 0 ? gallery[activeImage].url : product.imageUrl} 
                alt={product.name} 
              />
            </div>
            
            {gallery && gallery.length > 0 && (
              <div className={styles.thumbnails}>
                {gallery.map((image, index) => (
                  <div 
                    key={image.id}
                    className={`${styles.thumbnail} ${activeImage === index ? styles.active : ''}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={image.url} alt={`${product.name} - Image ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className={styles.productInfo}>
            <h1 className={styles.productName}>{product.name}</h1>
            
            <div className={styles.productMeta}>
              <p className={styles.productBrand}>Brand: {product.brand}</p>
              <p className={styles.productRating}>Rating: {product.rating}/5</p>
              <p className={styles.productStock}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </p>
            </div>
            
            <div className={styles.productPrice}>
              <span>${product.price.toFixed(2)}</span>
            </div>
            
            <div className={styles.productActions}>
              <button className={styles.addToCartButton}>Add to Cart</button>
              <button className={styles.buyNowButton}>Buy Now</button>
            </div>
            
            <div className={styles.productDescription}>
              <h2>Description</h2>
              <p>{product.description}</p>
            </div>
            
            <div className={styles.productSpecifications}>
              <h2>Specifications</h2>
              <ul>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className={styles.productTabs}>
          <div className={styles.tabsHeader}>
            <button className={`${styles.tabButton} ${styles.active}`}>Details</button>
            <button className={styles.tabButton}>Reviews ({product.reviews.length})</button>
            <button className={styles.tabButton}>Related Products</button>
          </div>
          
          <div className={styles.tabContent}>
            <div className={styles.detailsTab}>
              <h2>Product Details</h2>
              <div className={styles.detailsGrid}>
                {Object.entries(product.details).map(([key, value]) => (
                  <div key={key} className={styles.detailItem}>
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {recommendations && recommendations.length > 0 && (
          <div className={styles.recommendations}>
            <h2>Recommended Products</h2>
            <div className={styles.recommendationsGrid}>
              {recommendations.map(rec => (
                <Link href={`/products/${rec.id}`} key={rec.id} className={styles.recommendationCard}>
                  <div className={styles.recommendationImage}>
                    <img src={rec.imageUrl} alt={rec.name} />
                  </div>
                  <h3>{rec.name}</h3>
                  <p className={styles.recommendationPrice}>${rec.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export async function getStaticPaths() {
  // Generate only a few paths for initial build
  return {
    paths: [
      { params: { id: '1' } },
      { params: { id: '2' } },
      { params: { id: '3' } },
    ],
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  try {
    // Import data generator and image processing
    const { generateProducts, getProductRecommendations } = require('../../utils/dataGenerator');
    const { generateProductGallery } = require('../../utils/imageProcessing');
    
    // Generate products
    const allProducts = generateProducts(10000);
    
    // Find the requested product
    const product = allProducts.find(p => p.id.toString() === params.id);
    
    if (!product) {
      return {
        notFound: true,
      };
    }
    
    // Get recommendations
    const recommendations = getProductRecommendations(product, allProducts, 6);
    
    // Generate gallery images
    const gallery = await generateProductGallery(product.id, 5);
    
    return {
      props: {
        product,
        recommendations,
        gallery,
      },
      // Re-generate at most once per hour
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true,
    };
  }
}
