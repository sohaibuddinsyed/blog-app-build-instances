const sharp = require('sharp');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

// Memory-intensive image processing functions
const processProductImage = async (imageUrl, productId) => {
  try {
    // This function simulates processing an image from a URL
    // In a real app, you would fetch the image from the URL
    
    // For demo purposes, we'll create a placeholder image
    const width = 4000;
    const height = 3000;
    
    // Create a simple SVG as a valid image buffer instead of an empty buffer
    const svgImage = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle">Product ${productId}</text>
      </svg>
    `;
    
    const imageBuffer = Buffer.from(svgImage);
    
    // Process the image with sharp (memory efficient version)
    const processedImage = await sharp(imageBuffer)
      .resize(1000, 750) // Reduced size from 4000x3000
      .jpeg({ quality: 80 }) // Reduced quality from 100
      .toBuffer();
    
    // Generate fewer sizes
    const thumbnail = await sharp(processedImage)
      .resize(400, 300) // Reduced from 800x600
      .jpeg({ quality: 70 }) // Reduced quality from 90
      .toBuffer();
      
    // Apply only one filter to save memory
    const grayscale = await sharp(processedImage)
      .grayscale()
      .jpeg({ quality: 80 }) // Reduced quality from 95
      .toBuffer();
    
    // Return metadata about the processed images
    return {
      original: {
        width: 1000,
        height: 750,
        size: processedImage.length
      },
      thumbnail: {
        width: 400,
        height: 300,
        size: thumbnail.length
      },
      grayscale: {
        width: 1000,
        height: 750,
        size: grayscale.length
      }
    };
  } catch (error) {
    console.error('Error processing image:', error);
    return null;
  }
};

// Process multiple product images - intentionally inefficient
const processProductImages = async (products, limit = 1000) => {
  console.time('Image Processing');
  
  // Take a subset of products to process
  const productsToProcess = _.take(products, limit);
  
  // Process images sequentially (inefficient)
  const results = [];
  for (const product of productsToProcess) {
    const result = await processProductImage(product.imageUrl, product.id);
    results.push({
      productId: product.id,
      imageMetadata: result
    });
  }
  
  console.timeEnd('Image Processing');
  return results;
};

// Generate image gallery for a product - memory efficient version
const generateProductGallery = async (productId, count = 5) => {
  console.time(`Gallery Generation for Product ${productId}`);
  
  const galleryImages = [];
  
  // Generate fewer images with fewer effects
  for (let i = 0; i < count; i++) {
    // Create a simple SVG as a valid image buffer
    const width = 800; // Reduced from 4000
    const height = 600; // Reduced from 3000
    const svgImage = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle">Product ${productId} - Image ${i+1}</text>
      </svg>
    `;
    
    const imageBuffer = Buffer.from(svgImage);
    
    // Apply only basic processing to save memory
    let processedImage;
    
    try {
      // Only use 3 effects instead of 10
      switch (i % 3) {
        case 0:
          processedImage = await sharp(imageBuffer)
            .resize(width, height)
            .jpeg({ quality: 80 }) // Reduced from 100
            .toBuffer();
          break;
        case 1:
          processedImage = await sharp(imageBuffer)
            .resize(width, height)
            .grayscale()
            .jpeg({ quality: 80 }) // Reduced from 95
            .toBuffer();
          break;
        case 2:
          processedImage = await sharp(imageBuffer)
            .resize(width, height)
            .blur(3)
            .jpeg({ quality: 80 }) // Reduced from 95
            .toBuffer();
          break;
      }
      
      galleryImages.push({
        id: `${productId}-gallery-${i}`,
        size: processedImage.length,
        width,
        height,
        url: `https://picsum.photos/seed/${productId}-${i}/${width}/${height}`
      });
    } catch (error) {
      console.error(`Error processing gallery image ${i}:`, error);
    }
  }
  
  console.timeEnd(`Gallery Generation for Product ${productId}`);
  return galleryImages;
};

module.exports = {
  processProductImage,
  processProductImages,
  generateProductGallery
};
