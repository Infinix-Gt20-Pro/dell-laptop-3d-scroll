/**
 * Verification Test: Multi-Item Shopping Bag Persistence & Consolidated Checkout
 * Tests:
 * 1. Multi-product addition
 * 2. Variant key deduplication (same config -> increment quantity)
 * 3. Variant key separation (different config of same product -> distinct line item)
 * 4. LocalStorage serialization and rehydration across page loads
 * 5. Quantity modification and item removal
 * 6. Financial math: subtotal, coupon discount, and payable total
 * 7. Consolidated multi-item WhatsApp checkout payload structure
 */

const assert = require('assert');

// Mock browser environment for Node.js
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

global.localStorage = new MockLocalStorage();
global.window = {
  localStorage: global.localStorage,
  STORE_CONFIG: {
    storeName: "Classic Computers",
    whatsappNumber: "919412182786"
  },
  open: (url) => {
    global.__lastOpenedUrl = url;
  }
};
global.document = {
  readyState: 'complete',
  querySelectorAll: () => [],
  getElementById: () => null,
  body: {
    appendChild: () => {},
    style: {}
  }
};

const { ClassicStoreEngine } = require('../js/cart-auth.js');

console.log('🧪 Starting Multi-Item Cart Persistence & Checkout Verification Tests...\n');

let testsPassed = 0;

// Test 1: Empty initial state
const engine = new ClassicStoreEngine();
assert.strictEqual(engine.cart.length, 0, 'Cart should start empty');
console.log('✅ Test 1 Passed: Clean cart initialization verified.');
testsPassed++;

// Test 2: Add two distinct products
const prod1 = {
  id: 'dell-5530-flagship',
  name: 'Dell Precision 5530 4K UHD Mobile Workstation',
  shortName: 'Dell Precision 5530',
  price: 34999,
  thumbnail: 'assets/images/dell-5530/front.png',
  grade: 'Grade A+'
};

const prod2 = {
  id: 'thinkpad-t490-pro',
  name: 'Lenovo ThinkPad T490 Core i7 Workhorse',
  shortName: 'ThinkPad T490',
  price: 24999,
  thumbnail: 'assets/images/t490/front.png',
  grade: 'Grade A+'
};

engine.addToCart(prod1, { ram: '16GB DDR4', storage: '512GB NVMe SSD', warranty: '6 Months' });
engine.addToCart(prod2, { ram: '8GB DDR4', storage: '256GB SSD', warranty: '6 Months' });

assert.strictEqual(engine.cart.length, 2, 'Cart should have 2 distinct items');
assert.strictEqual(engine.cart[0].quantity, 1, 'Prod1 initial quantity should be 1');
assert.strictEqual(engine.cart[1].quantity, 1, 'Prod2 initial quantity should be 1');
console.log('✅ Test 2 Passed: Multi-item addition produces distinct line items.');
testsPassed++;

// Test 3: Adding identical variant increments quantity without duplication
engine.addToCart(prod1, { ram: '16GB DDR4', storage: '512GB NVMe SSD', warranty: '6 Months' });
assert.strictEqual(engine.cart.length, 2, 'Cart line items count should remain 2');
assert.strictEqual(engine.cart[0].quantity, 2, 'Prod1 quantity should increment to 2');
console.log('✅ Test 3 Passed: Identical variant properly increments quantity.');
testsPassed++;

// Test 4: Adding same model with DIFFERENT specs creates a separate line item
engine.addToCart(prod1, { ram: '32GB DDR4', storage: '1TB NVMe SSD', warranty: '12 Months', extraPrice: 6500 });
assert.strictEqual(engine.cart.length, 3, 'Cart should now have 3 distinct line items');
assert.strictEqual(engine.cart[2].price, 34999 + 6500, 'Upgraded model should reflect extra upgrade price');
assert.strictEqual(engine.cart[2].customSpecs.ram, '32GB DDR4', 'Custom RAM spec must match selection');
console.log('✅ Test 4 Passed: Spec variants of same model preserved as separate line items.');
testsPassed++;

// Test 5: LocalStorage Persistence across page navigation / rehydration
const savedStorageData = JSON.parse(global.localStorage.getItem('cc_cart'));
assert.ok(savedStorageData, 'localStorage should have cc_cart entry');
assert.strictEqual(savedStorageData.length, 3, 'Persisted cart must have 3 items');

// Create brand new engine instance to test rehydration from storage
const rehydratedEngine = new ClassicStoreEngine();
assert.strictEqual(rehydratedEngine.cart.length, 3, 'Rehydrated engine must recover all 3 items');
assert.strictEqual(rehydratedEngine.cart[0].quantity, 2, 'First item must retain quantity 2');
console.log('✅ Test 5 Passed: LocalStorage persistence & cross-session rehydration verified.');
testsPassed++;

// Test 6: Financial calculations & Coupon discounts
// Line 1: 34,999 * 2 = 69,998
// Line 2: 24,999 * 1 = 24,999
// Line 3: 41,499 * 1 = 41,499
// Total subtotal: 69,998 + 24,999 + 41,499 = 1,36,496
const expectedSubtotal = 69998 + 24999 + 41499;
assert.strictEqual(rehydratedEngine.getCartSubtotal(), expectedSubtotal, `Subtotal must be ${expectedSubtotal}`);

rehydratedEngine.applyCoupon('CLASSIC1000');
assert.strictEqual(rehydratedEngine.getCartTotal(), expectedSubtotal - 1000, 'Total should reflect ₹1000 welcome discount');
console.log('✅ Test 6 Passed: Multi-item subtotal, unit multiplication, and coupon discounts verified.');
testsPassed++;

// Test 7: Item decrement and removal
const firstCartId = rehydratedEngine.cart[0].cartId;
rehydratedEngine.updateQuantity(firstCartId, -1);
assert.strictEqual(rehydratedEngine.cart[0].quantity, 1, 'Quantity should decrement to 1');

rehydratedEngine.updateQuantity(firstCartId, -1);
assert.strictEqual(rehydratedEngine.cart.length, 2, 'Item should be removed when quantity reaches 0');
console.log('✅ Test 7 Passed: Quantity decrement & auto-removal verified.');
testsPassed++;

// Test 8: Consolidated Multi-Item WhatsApp Payload Generation
const waUrl = rehydratedEngine.checkoutViaWhatsApp();
assert.ok(waUrl.startsWith('https://wa.me/919412182786?text='), 'WhatsApp URL must point to store helpline');

const decodedText = decodeURIComponent(waUrl);
assert.ok(decodedText.includes('ORDER MANIFEST:'), 'Message must contain order manifest header');
assert.ok(decodedText.includes('ThinkPad T490'), 'Message must list ThinkPad');
assert.ok(decodedText.includes('Dell Precision 5530'), 'Message must list Dell Precision');
assert.ok(decodedText.includes('32GB DDR4'), 'Message must include custom spec details');
assert.ok(decodedText.includes('CLASSIC1000'), 'Message must include active coupon code');
assert.ok(decodedText.includes('Total Payable Amount:'), 'Message must include final payable total');
console.log('✅ Test 8 Passed: Consolidated WhatsApp checkout payload correctly formatted.');
testsPassed++;

console.log(`\n🎉 ALL ${testsPassed}/8 MULTI-ITEM CART TESTS PASSED PERFECTLY!\n`);
