import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home({ categories, featuredProducts }) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className={styles.container}>
      <Head>
        <title>E-Commerce Performance Demo</title>
        <meta name="description" content="NextJS E-Commerce Performance Demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          E-Commerce Performance Demo
        </h1>

        <p className={styles.description}>
          A demo app to showcase NextJS performance optimization
        </p>

        {isLoading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <>
            <div className={styles.categoryGrid}>
              <h2>Shop by Category</h2>
              <div className={styles.grid}>
                {categories.map((category) => (
                  <Link href={`/products?category=${category.name}`} key={category.name} className={styles.card}>
                    <h3>{category.name}</h3>
                    <p>{category.count} products</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className={styles.featuredProducts}>
              <h2>Featured Products</h2>
              <div className={styles.grid}>
                {featuredProducts.map((product) => (
                  <Link href={`/products/${product.id}`} key={product.id} className={styles.productCard}>
                    <div className={styles.productImage}>
                      <img src={product.imageUrl} alt={product.name} />
                    </div>
                    <h3>{product.name}</h3>
                    <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                    <p className={styles.productRating}>Rating: {product.rating}/5</p>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <p>E-Commerce Performance Demo</p>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  // Import data generator
  const { generateProducts, getProductCategories } = require('../utils/dataGenerator');
  
  // Generate a large dataset
  const allProducts = generateProducts(10000);
  
  // Get categories with counts
  const categories = getProductCategories(allProducts);
  
  // Get featured products (first 8)
  const featuredProducts = allProducts.slice(0, 8);
  
  return {
    props: {
      categories,
      featuredProducts,
    },
  };
}
