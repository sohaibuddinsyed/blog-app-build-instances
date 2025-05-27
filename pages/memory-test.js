import { useEffect, useState } from 'react';
import Head from 'next/head';

// This page is designed to test memory limits during build
export async function getStaticProps() {
  console.log('Starting memory test...');
  
  // Create a large array that will consume memory but in a controlled way
  // This should push memory usage to around 8-9GB
  const memoryConsumers = [];
  
  // Create 10 large objects, each consuming about 800MB-900MB
  for (let i = 0; i < 30; i++) {
    console.log(`Creating memory consumer ${i + 1}/10...`);
    
    // Create a large string (each character is 2 bytes in JS)
    // 100MB string = ~50 million characters
    const largeString = 'X'.repeat(80 * 1024 * 1024); // ~100MB
    
    // Create a large array of objects
    const largeArray = Array.from({ length: 1000000 }, (_, j) => ({
      id: `item-${i}-${j}`,
      value: `value-${j}`,
      timestamp: Date.now(),
      nestedObject: {
        prop1: `prop1-${j}`,
        prop2: `prop2-${j}`,
        prop3: `prop3-${j}`,
      }
    }));
    
    memoryConsumers.push({
      id: `consumer-${i}`,
      string: largeString,
      array: largeArray
    });
    
    // Force garbage collection between iterations if possible
    if (global.gc) {
      global.gc();
    }
  }
  
  console.log('Memory test complete');
  
  // Return minimal data to avoid serialization issues
  return {
    props: {
      memoryTest: {
        consumersCount: memoryConsumers.length,
        totalArrayItems: memoryConsumers.reduce((acc, consumer) => acc + consumer.array.length, 0),
        timestamp: Date.now()
      }
    }
  };
}

export default function MemoryTestPage({ memoryTest }) {
  return (
    <div>
      <Head>
        <title>Memory Test - E-Commerce Performance Demo</title>
        <meta name="description" content="Testing memory limits during build" />
      </Head>
      
      <main>
        <h1>Memory Test</h1>
        
        <div>
          <h2>Memory Test Results</h2>
          <p>Memory Consumers: {memoryTest.consumersCount}</p>
          <p>Total Array Items: {memoryTest.totalArrayItems}</p>
          <p>Timestamp: {new Date(memoryTest.timestamp).toLocaleString()}</p>
        </div>
      </main>
    </div>
  );
}
