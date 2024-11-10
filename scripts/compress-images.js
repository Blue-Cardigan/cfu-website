import sharp from 'sharp';
import { readdir } from 'fs/promises';
import path from 'path';

const CAROUSEL_DIR = './public/carousel';
const QUALITY = 80; // Adjust quality (0-100)
const MAX_WIDTH = 1200; // Maximum width to resize to

async function compressImages() {
  try {
    const files = await readdir(CAROUSEL_DIR);
    const webpFiles = files.filter(file => file.toLowerCase().endsWith('.webp'));

    console.log(`Found ${webpFiles.length} WebP files to compress...`);

    for (const file of webpFiles) {
      const inputPath = path.join(CAROUSEL_DIR, file);
      const outputPath = path.join(CAROUSEL_DIR, `compressed_${file}`);

      await sharp(inputPath)
        .resize(MAX_WIDTH, null, { // null maintains aspect ratio
          withoutEnlargement: true
        })
        .webp({ 
          quality: QUALITY,
          effort: 6, // 0 (fastest) to 6 (slowest)
        })
        .toFile(outputPath);

      console.log(`✓ Compressed: ${file}`);
    }

    console.log('Compression complete! Check the compressed_ files.');
  } catch (error) {
    console.error('Error compressing images:', error);
  }
}

compressImages(); 