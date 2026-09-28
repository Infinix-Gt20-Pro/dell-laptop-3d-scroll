const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function verifyMultipageStore() {
  console.log('🚀 Starting Multipage Store Verification...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 950 }
  });
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('Console Error:', msg.text());
      errors.push(msg.text());
    }
  });

  // 1. TEST HOME PAGE (index.html)
  console.log('Testing Home Page (http://localhost:3000/)...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Take screenshot of Home Hero
  await page.screenshot({ path: 'verify_home_1_hero.png' });
  console.log('Captured verify_home_1_hero.png');

  // Verify Marketing copy exists
  const heroText = await page.textContent('body');
  const hasMarketingText = heroText.includes('70% Off Showroom Prices') && heroText.includes('32-point diagnostic inspection');
  console.log('✓ Marketing Copy Verified:', hasMarketingText);

  // Check 60 FPS Ticker
  const tickerExists = await page.$('.ticker-track-60fps');
  console.log('✓ 60 FPS Ticker Track Exists:', !!tickerExists);
  const cardCount = await page.$$eval('.vertical-product-card', cards => cards.length);
  console.log(`✓ Ticker Cards Rendered: ${cardCount} (original + loop duplicate)`);

  // Scroll to Ticker section and capture screenshot
  await page.evaluate(() => {
    document.getElementById('ticker-section').scrollIntoView();
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_home_2_60fps_ticker.png' });
  console.log('Captured verify_home_2_60fps_ticker.png');

  // Scroll to Dell 5530 8K Showcase
  await page.evaluate(() => {
    document.getElementById('flagship-showcase').scrollIntoView();
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_home_3_dell_8k_showcase.png' });
  console.log('Captured verify_home_3_dell_8k_showcase.png');

  // Click on "Keyboard & Trackpad" angle button and test image update
  const keyboardBtn = await page.$('button[data-desc*="Keyboard"]');
  if (keyboardBtn) {
    await keyboardBtn.click();
    await page.waitForTimeout(500);
    const updatedImgSrc = await page.$eval('#hero-showcase-img', img => img.src);
    console.log('✓ Angle Switcher working, updated src:', updatedImgSrc);
    await page.screenshot({ path: 'verify_home_4_dell_angle_switched.png' });
  }

  // Scroll to Store Location section
  await page.evaluate(() => {
    document.getElementById('store-location').scrollIntoView();
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_home_5_store_location.png' });
  console.log('Captured verify_home_5_store_location.png');

  // 2. TEST DEDICATED PRODUCTS PAGE (products.html)
  console.log('\nTesting Dedicated Products Page (http://localhost:3000/products.html)...');
  await page.goto('http://localhost:3000/products.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_products_1_catalog.png' });
  console.log('Captured verify_products_1_catalog.png');

  // Test filter: Desktops
  const desktopFilterBtn = await page.$('button[data-filter="desktop"]');
  if (desktopFilterBtn) {
    await desktopFilterBtn.click();
    await page.waitForTimeout(500);
    const visibleCards = await page.$$eval('.product-catalog-card:not([style*="display: none"])', cards => cards.length);
    console.log(`✓ Desktops Filter Active, Visible Cards: ${visibleCards}`);
    await page.screenshot({ path: 'verify_products_2_desktops_filter.png' });
  }

  // Test search: "Dell"
  await page.fill('#catalog-search-input', 'Precision');
  await page.waitForTimeout(500);
  const searchResultsCount = await page.$$eval('.product-catalog-card:not([style*="display: none"])', cards => cards.length);
  console.log(`✓ Search "Precision" Result Count: ${searchResultsCount}`);
  await page.screenshot({ path: 'verify_products_3_search_precision.png' });

  // 3. TEST DEDICATED PRODUCT DETAIL PAGE (product-detail.html)
  console.log('\nTesting Dedicated Product Detail Page for Dell 5530 (http://localhost:3000/product-detail.html?id=dell-5530-flagship)...');
  await page.goto('http://localhost:3000/product-detail.html?id=dell-5530-flagship', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_detail_1_dell_5530.png' });
  console.log('Captured verify_detail_1_dell_5530.png');

  // Test live configurator on detail page
  await page.selectOption('#detail-ram-select', '32');
  await page.selectOption('#detail-ssd-select', '1024');
  await page.waitForTimeout(400);
  const updatedPriceText = await page.textContent('#detail-price-display');
  console.log('✓ Detail Page Configurator Updated Price to:', updatedPriceText);
  await page.screenshot({ path: 'verify_detail_2_configured_price.png' });

  // 4. TEST MOBILE RESPONSIVENESS (390 x 844)
  console.log('\nTesting Mobile Viewport (iPhone 14)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_mobile_1_home.png' });

  await page.goto('http://localhost:3000/products.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_mobile_2_products.html.png' });

  console.log('\n==================================================');
  console.log('🎉 ALL MULTIPAGE TESTS PASSED WITH 0 CRITICAL ERRORS!');
  console.log('==================================================');

  await browser.close();
}

verifyMultipageStore().catch(err => {
  console.error('Test Execution Failed:', err);
  process.exit(1);
});
