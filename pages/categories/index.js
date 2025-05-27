import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Categories({ categories }) {
  return (
    <div>
      <Head>
        <title>Categories | E-Commerce Performance Demo</title>
        <meta name="description" content="Browse our categories" />
      </Head>

      <main>
        <h1>Categories</h1>
        
        <ul>
          {categories.map(category => (
            <li key={category.name}>
              <Link href={`/products?category=${category.name}`}>
                {category.name} ({category.count} products)
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  // Import data generator
  const { generateProducts, getProductCategories } = require('../../utils/dataGenerator');
  
  // Generate a smaller dataset to reduce memory usage
  const products = generateProducts(1000); // Reduced from original size
  
  // Get categories with counts
  const categories = getProductCategories(products);
  
  return {
    props: {
      categories,
    },
  };
}
