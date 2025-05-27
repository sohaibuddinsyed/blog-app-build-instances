const sharp = require('sharp');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

// Image processing with controlled memory usage
const processProductImage = async (imageUrl, productId) => {
  try {
    // Create a placeholder image with moderate size
    const width = 2000;
    const height = 1500;
    
    const svgImage = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle">Product ${productId}</text>
      </svg>
    `;
    
    const imageBuffer = Buffer.from(svgImage);
    
    // Process the image with moderate quality settings
    const processedImage = await sharp(imageBuffer)
      .resize(width, height)
      .jpeg({ quality: 85 })
      .toBuffer();
    
    // Generate a few sizes with moderate quality
    const thumbnail = await sharp(processedImage)
      .resize(400, 300)
      .jpeg({ quality: 80 })
      .toBuffer();
      
    const medium = await sharp(processedImage)
      .resize(800, 600)
      .jpeg({ quality: 85 })
      .toBuffer();
    
    // Apply a limited number of filters
    const grayscale = await sharp(processedImage)
      .grayscale()
      .jpeg({ quality: 85 })
      .toBuffer();
      
    const blurred = await sharp(processedImage)
      .blur(3)
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
        width: 400,
        height: 300,
        size: thumbnail.length
      },
      medium: {
        width: 800,
        height: 600,
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

// Process multiple product images with controlled memory usage
const processProductImages = async (products, limit = 100) => {
  console.time('Image Processing');
  
  // Process images in smaller batches
  const batchSize = 10;
  const results = [];
  
  for (let i = 0; i < Math.min(products.length, limit); i += batchSize) {
    const batch = products.slice(i, Math.min(i + batchSize, limit));
    const batchResults = await Promise.all(
      batch.map(product => processProductImage(product.imageUrl, product.id))
    );
    
    results.push(...batchResults.map((result, index) => ({
      productId: batch[index].id,
      imageMetadata: result
    })));
    
    // Log progress
    if ((i + batchSize) % 50 === 0) {
      console.log(`Processed ${i + batchSize} images`);
    }
  }
  
  console.timeEnd('Image Processing');
  return results;
};

// Generate image gallery with controlled memory usage
const generateProductGallery = async (productId, count = 10) => {
  console.time(`Gallery Generation for Product ${productId}`);
  
  const galleryImages = [];
  const width = 1200;
  const height = 900;
  
  // Generate a moderate number of images with limited effects
  for (let i = 0; i < count; i++) {
    const svgImage = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle">Product ${productId} - Image ${i+1}</text>
      </svg>
    `;
    
    const imageBuffer = Buffer.from(svgImage);
    
    try {
      // Apply a limited set of effects
      let processedImage;
      switch (i % 4) {
        case 0:
          processedImage = await sharp(imageBuffer)
            .resize(width, height)
            .jpeg({ quality: 85 })
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
      
      // Free up memory
      processedImage = null;
      
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
