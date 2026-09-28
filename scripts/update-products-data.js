const fs = require('fs');
const path = require('path');

function updateDataFile(relativeFile) {
  const filePath = path.resolve(relativeFile);
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace Dell 5530 thumbnail
  content = content.replace(
    /thumbnail:\s*["'][^"']*5530[^"']*["']/g,
    'thumbnail: "assets/images/dell-5530/dell_5530_cafe.jpg"'
  );

  // Replace Dell 5530 images list
  const oldImagesRegex = /images:\s*\[\s*["'][^"']*5530[^"']*["'][\s\S]*?\]/m;
  const newImagesBlock = `images: [
      "assets/images/dell-5530/dell_5530_cafe.jpg",
      "assets/images/dell-5530/dell_5530_keyboard.jpg",
      "assets/images/dell-5530/dell_5530_ports.jpg",
      "assets/images/dell-5530/dell_5530_dark.jpg",
      "assets/images/dell-5530/dell_5530_white.jpg",
      "assets/images/dell-5530/dell_5530_coffee.jpg"
    ]`;

  if (oldImagesRegex.test(content)) {
    content = content.replace(oldImagesRegex, newImagesBlock);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated:', filePath);
}

updateDataFile('js/products-data.js');
updateDataFile('products-data.js');
