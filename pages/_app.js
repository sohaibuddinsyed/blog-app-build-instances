import '../styles/globals.css';
import { useEffect } from 'react';

// Import memory leaker to force high memory usage during build
let memoryLeaker;
if (typeof window !== 'undefined') {
  memoryLeaker = require('../utils/memoryLeaker');
}

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Run memory-intensive operations on client-side
    if (memoryLeaker) {
      memoryLeaker.leakMemory(10);
      memoryLeaker.allocateLargeMemory(200);
      memoryLeaker.stringManipulation(500, 5000);
    }
  }, []);

  return <Component {...pageProps} />
}

export default MyApp
