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
    const width = 800;
    const height = 600;
    
    // Create a simple SVG as a valid image buffer instead of an empty buffer
    const svgImage = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle">Product ${productId}</text>
      </svg>
    `;
    
    const imageBuffer = Buffer.from(svgImage);
    
    // Process the image with sharp (memory intensive)
    const processedImage = await sharp(imageBuffer)
      .resize(width, height)
      .jpeg({ quality: 90 })
      .toBuffer();
    
    // Generate multiple sizes (thumbnail, medium, large)
    const thumbnail = await sharp(processedImage)
      .resize(100, 75)
      .jpeg({ quality: 80 })
      .toBuffer();
      
    const medium = await sharp(processedImage)
      .resize(400, 300)
      .jpeg({ quality: 85 })
      .toBuffer();
      
    // Apply filters (more memory usage)
    const grayscale = await sharp(processedImage)
      .grayscale()
      .jpeg({ quality: 85 })
      .toBuffer();
      
    const blurred = await sharp(processedImage)
      .blur(5)
      .jpeg({ quality: 85 })
      .toBuffer();
    
    // Return metadata about the processed images
    return {
      original: {
        width,
        height,
        size: processedImage.length
      },
      thumbnail: {
        width: 100,
        height: 75,
        size: thumbnail.length
      },
      medium: {
        width: 400,
        height: 300,
        size: medium.length
      },
      grayscale: {
        width,
        height,
        size: grayscale.length
      },
      blurred: {
        width,
        height,
        size: blurred.length
      }
    };
  } catch (error) {
    console.error('Error processing image:', error);
    return null;
  }
};

// Process multiple product images - intentionally inefficient
const processProductImages = async (products, limit = 100) => {
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

// Generate image gallery for a product - memory intensive
const generateProductGallery = async (productId, count = 5) => {
  console.time(`Gallery Generation for Product ${productId}`);
  
  const galleryImages = [];
  
  // Generate multiple images with different effects
  for (let i = 0; i < count; i++) {
    // Create a simple SVG as a valid image buffer
    const width = 1200;
    const height = 800;
    const svgImage = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle">Product ${productId} - Image ${i+1}</text>
      </svg>
    `;
    
    const imageBuffer = Buffer.from(svgImage);
    
    // Apply different effects based on index
    let processedImage;
    
    try {
      switch (i % 5) {
        case 0:
          processedImage = await sharp(imageBuffer)
            .resize(width, height)
            .jpeg({ quality: 90 })
            .toBuffer();
          break;
        case 1:
          processedImage = await sharp(imageBuffer)
            .resize(width, height)
            .grayscale()
            .jpeg({ quality: 85 })
            .toBuffer();
          break;
        case 2:
          processedImage = await sharp(imageBuffer)
            .resize(width, height)
            .blur(3)
            .jpeg({ quality: 85 })
            .toBuffer();
          break;
        case 3:
          processedImage = await sharp(imageBuffer)
            .resize(width, height)
            .sharpen()
            .jpeg({ quality: 85 })
            .toBuffer();
          break;
        case 4:
          processedImage = await sharp(imageBuffer)
            .resize(width, height)
            .modulate({ brightness: 1.2 })
            .jpeg({ quality: 85 })
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
