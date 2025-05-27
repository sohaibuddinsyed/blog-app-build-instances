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
    
    // Process the image with sharp (memory intensive)
    const processedImage = await sharp(imageBuffer)
      .resize(width, height)
      .jpeg({ quality: 100 })
      .toBuffer();
    
    // Generate multiple sizes (thumbnail, medium, large)
    const thumbnail = await sharp(processedImage)
      .resize(800, 600)
      .jpeg({ quality: 90 })
      .toBuffer();
      
    const medium = await sharp(processedImage)
      .resize(2000, 1500)
      .jpeg({ quality: 95 })
      .toBuffer();
      
    // Apply filters (more memory usage)
    const grayscale = await sharp(processedImage)
      .grayscale()
      .jpeg({ quality: 95 })
      .toBuffer();
      
    const blurred = await sharp(processedImage)
      .blur(5)
      .jpeg({ quality: 95 })
      .toBuffer();
    
    // Apply more filters to consume more memory
    const sharpen = await sharp(processedImage)
      .sharpen(5)
      .jpeg({ quality: 95 })
      .toBuffer();
      
    const contrast = await sharp(processedImage)
      .modulate({ brightness: 1.2, saturation: 1.5, hue: 90 })
      .jpeg({ quality: 95 })
      .toBuffer();
      
    const tint = await sharp(processedImage)
      .tint({ r: 255, g: 0, b: 0 })
      .jpeg({ quality: 95 })
      .toBuffer();
      
    const composite = await sharp(processedImage)
      .composite([{ input: Buffer.from(svgImage), gravity: 'center' }])
      .jpeg({ quality: 95 })
      .toBuffer();
    
    // Return metadata about the processed images
    return {
      original: {
        width,
        height,
        size: processedImage.length
      },
      thumbnail: {
        width: 800,
        height: 600,
        size: thumbnail.length
      },
      medium: {
        width: 2000,
        height: 1500,
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
      },
      sharpen: {
        width,
        height,
        size: sharpen.length
      },
      contrast: {
        width,
        height,
        size: contrast.length
      },
      tint: {
        width,
        height,
        size: tint.length
      },
      composite: {
        width,
        height,
        size: composite.length
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

// Generate image gallery for a product - memory intensive
const generateProductGallery = async (productId, count = 100) => {
  console.time(`Gallery Generation for Product ${productId}`);
  
  const galleryImages = [];
  
  // Generate multiple images with different effects
  for (let i = 0; i < count; i++) {
    // Create a simple SVG as a valid image buffer
    const width = 4000;
    const height = 3000;
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
      switch (i % 10) {
        case 0:
          processedImage = await sharp(imageBuffer)
            .resize(width, height)
            .jpeg({ quality: 100 })
            .toBuffer();
          break;
        case 1:
          processedImage = await sharp(imageBuffer)
            .resize(width, height)
            .grayscale()
            .jpeg({ quality: 95 })
            .toBuffer();
          break;
        case 2:
          processedImage = await sharp(imageBuffer)
            .resize(width, height)
            .blur(3)
            .jpeg({ quality: 95 })
            .toBuffer();
          break;
        case 3:
          processedImage = await sharp(imageBuffer)
            .resize(width, height)
            .sharpen()
            .jpeg({ quality: 95 })
            .toBuffer();
          break;
        case 4:
          processedImage = await sharp(imageBuffer)
            .resize(width, height)
            .modulate({ brightness: 1.2 })
            .jpeg({ quality: 95 })
            .toBuffer();
          break;
        case 5:
          processedImage = await sharp(imageBuffer)
            .resize(width, height)
            .tint({ r: 255, g: 0, b: 0 })
            .jpeg({ quality: 95 })
            .toBuffer();
          break;
        case 6:
          processedImage = await sharp(imageBuffer)
            .resize(width, height)
            .modulate({ saturation: 2 })
            .jpeg({ quality: 95 })
            .toBuffer();
          break;
        case 7:
          processedImage = await sharp(imageBuffer)
            .resize(width, height)
            .negate()
            .jpeg({ quality: 95 })
            .toBuffer();
          break;
        case 8:
          processedImage = await sharp(imageBuffer)
            .resize(width, height)
            .modulate({ hue: 180 })
            .jpeg({ quality: 95 })
            .toBuffer();
          break;
        case 9:
          processedImage = await sharp(imageBuffer)
            .resize(width, height)
            .composite([{ input: Buffer.from(svgImage), gravity: 'center' }])
            .jpeg({ quality: 95 })
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
