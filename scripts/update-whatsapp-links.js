const fs = require('fs');
const path = require('path');
const { PRODUCTS, STORE_CONFIG } = require('../js/products-data');

function updateHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let replacedCount = 0;

  PRODUCTS.forEach(p => {
    const richUrl = STORE_CONFIG.buildWhatsAppUrl(p);
    
    // Pattern 1: wa.me links with basic short text for this product
    // e.g. https://wa.me/919412182786?text=Hi...Dell%20Precision...
    const escapedShort = encodeURIComponent(p.shortName).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const escapedName = encodeURIComponent(p.name).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    
    const re1 = new RegExp(`https:\\/\\/wa\\.me\\/919412182786\\?text=[^"']*?(?:${escapedShort}|${escapedName}|${p.id})[^"']*`, 'g');
    content = content.replace(re1, () => {
      replacedCount++;
      return richUrl;
    });

    // Also check for unencoded short name in URL
    const cleanShort = p.shortName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const re2 = new RegExp(`https:\\/\\/wa\\.me\\/919412182786\\?text=[^"']*?${cleanShort}[^"']*`, 'g');
    content = content.replace(re2, () => {
      replacedCount++;
      return richUrl;
    });
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}: ${replacedCount} static links upgraded to rich WhatsApp payload`);
}

updateHtmlFile('index.html');
updateHtmlFile('products.html');
