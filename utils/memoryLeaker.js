// This file intentionally creates memory leaks and high memory usage
const _ = require('lodash');

// Global array to store large objects and prevent garbage collection
const memoryHogs = [];

// Create a large object that consumes significant memory
const createLargeObject = (size = 1000000) => {
  const obj = {};
  
  for (let i = 0; i < size; i++) {
    obj[`key_${i}`] = `This is a long string value for key ${i} that takes up memory. ${_.repeat('More text to increase size. ', 20)}`;
  }
  
  return obj;
};

// Function that creates memory leaks by storing references to large objects
const leakMemory = (count = 10) => {
  console.time('Memory Leak Creation');
  
  for (let i = 0; i < count; i++) {
    const largeObject = createLargeObject();
    memoryHogs.push(largeObject);
    
    // Create circular references
    largeObject.self = largeObject;
    largeObject.parent = memoryHogs;
  }
  
  console.timeEnd('Memory Leak Creation');
  return { status: 'Created memory leaks', count };
};

// Function that allocates a large amount of memory at once
const allocateLargeMemory = (sizeInMB = 500) => {
  console.time('Large Memory Allocation');
  
  const bytesPerMB = 1024 * 1024;
  const totalBytes = sizeInMB * bytesPerMB;
  
  // Create large arrays of numbers
  const arrays = [];
  const chunkSize = 10 * bytesPerMB; // 10MB chunks
  
  for (let i = 0; i < totalBytes; i += chunkSize) {
    const size = Math.min(chunkSize, totalBytes - i);
    const array = new Array(size / 8); // 8 bytes per number
    
    for (let j = 0; j < array.length; j++) {
      array[j] = Math.random() * 10000;
    }
    
    arrays.push(array);
  }
  
  console.timeEnd('Large Memory Allocation');
  return { status: 'Allocated large memory', sizeInMB, arrayCount: arrays.length };
};

// Function that performs memory-intensive string operations
const stringManipulation = (iterations = 1000, stringSize = 10000) => {
  console.time('String Manipulation');
  
  let result = '';
  const baseString = _.repeat('This is a test string. ', stringSize / 20);
  
  for (let i = 0; i < iterations; i++) {
    // Inefficient string concatenation
    result = result + baseString + i;
    
    // Create more strings
    const reversed = baseString.split('').reverse().join('');
    const combined = baseString + reversed;
    
    // Store in global array to prevent garbage collection
    memoryHogs.push(combined.substring(0, stringSize));
  }
  
  console.timeEnd('String Manipulation');
  return { status: 'Completed string manipulation', resultLength: result.length };
};

// Initialize memory usage on module load
leakMemory(5);
allocateLargeMemory(100);

module.exports = {
  leakMemory,
  allocateLargeMemory,
  stringManipulation,
  createLargeObject
};
