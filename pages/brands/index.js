import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Brands({ brands }) {
  return (
    <div>
      <Head>
        <title>Brands | E-Commerce Performance Demo</title>
        <meta name="description" content="Browse our brands" />
      </Head>

      <main>
        <h1>Brands</h1>
        
        <ul>
          {brands.map(brand => (
            <li key={brand.name}>
              <Link href={`/products?brand=${brand.name}`}>
                {brand.name} ({brand.count} products)
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
  const { generateProducts, getProductBrands } = require('../../utils/dataGenerator');
  
  // Generate a smaller dataset to reduce memory usage
  const products = generateProducts(1000); // Reduced from original size
  
  // Get brands with counts
  const brands = getProductBrands(products);
  
  return {
    props: {
      brands,
    },
  };
}
