const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputImage = path.join(__dirname, '../public/logo.png');
const outputDir = path.join(__dirname, '../public/icons');

async function generateIcons() {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const imageBuffer = fs.readFileSync(inputImage);

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);

    await sharp(imageBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`Generated: icon-${size}x${size}.png`);
  }

  // Generate favicon.ico (use 32x32 as base)
  await sharp(imageBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(outputDir, 'favicon-32x32.png'));

  console.log('Generated: favicon-32x32.png');

  // Generate Apple splash screens
  const splashSizes = [
    { width: 2048, height: 2732, name: 'apple-splash-2048-2732.png' },
    { width: 1668, height: 2388, name: 'apple-splash-1668-2388.png' },
    { width: 1536, height: 2048, name: 'apple-splash-1536-2048.png' },
    { width: 1125, height: 2436, name: 'apple-splash-1125-2436.png' },
    { width: 1242, height: 2688, name: 'apple-splash-1242-2688.png' },
    { width: 750, height: 1334, name: 'apple-splash-750-1334.png' },
    { width: 640, height: 1136, name: 'apple-splash-640-1136.png' }
  ];

  console.log('\\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
