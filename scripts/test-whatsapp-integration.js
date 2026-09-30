const fs = require('fs');
const assert = require('assert');
const { PRODUCTS, STORE_CONFIG } = require('../js/products-data');

console.log('Testing WhatsApp Integration for Classic Computers...\n');

// Test 1: Function exists and generates valid wa.me URL
assert.strictEqual(typeof STORE_CONFIG.buildWhatsAppUrl, 'function', 'buildWhatsAppUrl should be a function');

const testProduct = PRODUCTS[0];
const defaultUrl = STORE_CONFIG.buildWhatsAppUrl(testProduct);
console.log('Test 1 - Default URL generated:');
console.log(defaultUrl.substring(0, 100) + '...\n');
assert(defaultUrl.startsWith('https://wa.me/919412182786?text='), 'Must point to correct WhatsApp number');

// Test 2: Custom RAM/SSD & Price Configuration
const customUrl = STORE_CONFIG.buildWhatsAppUrl(testProduct, {
  ram: '32GB DDR4 High-Speed',
  ssd: '1TB Ultra NVMe SSD',
  price: 38499
});

const decodedText = decodeURIComponent(customUrl.split('text=')[1]);
console.log('Test 2 - Decoded WhatsApp Message Payload:');
console.log('--------------------------------------------------');
console.log(decodedText);
console.log('--------------------------------------------------\n');

assert(decodedText.includes(testProduct.name), 'Must include product name');
assert(decodedText.includes('32GB DDR4 High-Speed'), 'Must include selected custom RAM');
assert(decodedText.includes('1TB Ultra NVMe SSD'), 'Must include selected custom SSD');
assert(decodedText.includes('₹38,499'), 'Must include exact formatted price');
assert(decodedText.includes('6 Months Warranty'), 'Must include warranty guarantee');
assert(decodedText.includes('My Delivery Address / City:'), 'Must prompt for delivery address');

// Test 3: Check HTML files for rich WhatsApp links
const productDetailHtml = fs.readFileSync('product-detail.html', 'utf8');
assert(productDetailHtml.includes('STORE_CONFIG.buildWhatsAppUrl'), 'product-detail.html must use STORE_CONFIG.buildWhatsAppUrl');
assert(productDetailHtml.includes('detail-ram-select'), 'product-detail.html must have dynamic ram selection');
assert(productDetailHtml.includes('detail-ssd-select'), 'product-detail.html must have dynamic ssd selection');

const productsPageJs = fs.readFileSync('js/products-page.js', 'utf8');
assert(productsPageJs.includes('STORE_CONFIG.buildWhatsAppUrl'), 'products-page.js must use STORE_CONFIG.buildWhatsAppUrl');

console.log('✅ ALL WHATSAPP INTEGRATION TESTS PASSED 100%!');
