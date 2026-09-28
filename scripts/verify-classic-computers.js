const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // 1. Capture Hero: "Hum Kya Sale Karte Hain" (#about-store)
  console.log('Capturing Hero Section (#about-store)...');
  await page.locator('#about-store').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_1_what_we_sell_hero.png', fullPage: false });

  // 2. Capture Smart Device Finder - Coding / ThinkPad (Default)
  console.log('Capturing Device Finder - Default (Coding)...');
  await page.locator('#device-finder').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_2_device_finder_coding.png', fullPage: false });

  // 3. Test Device Finder: Switch to "4K Editing"
  console.log('Clicking 4K Video Editing tag...');
  await page.click('.finder-tag-btn[data-tag="editing"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'verify_3_device_finder_editing.png', fullPage: false });

  // 4. Test Device Finder: Switch to "Stock Trading" (Desktop)
  console.log('Clicking Stock Trading tag...');
  await page.click('.finder-tag-btn[data-tag="trading"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'verify_4_device_finder_trading.png', fullPage: false });

  // 5. Capture Products Catalog Grid
  console.log('Capturing Products Catalog Grid (All)...');
  await page.locator('#product-catalog').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_5_products_catalog_all.png', fullPage: false });

  // 6. Test Catalog Filter: Click "Desktops (2)"
  console.log('Filtering by Desktops...');
  await page.click('.catalog-tab-btn[data-filter="desktop"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'verify_6_catalog_desktops_only.png', fullPage: false });

  // 7. Capture Flagship 3D Showcase
  console.log('Capturing Flagship 3D Showcase...');
  await page.locator('#hero-showcase-img').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_7_flagship_showcase.png', fullPage: false });

  // 8. Capture Thermal Receipt Configurator
  console.log('Capturing Thermal Receipt Configurator...');
  await page.locator('#configurator').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_8_thermal_receipt.png', fullPage: false });

  // 9. Mobile Viewport Verification
  console.log('Testing Mobile Viewport (390x844)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'verify_9_mobile_hero.png', fullPage: false });

  await page.locator('#device-finder').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'verify_10_mobile_finder.png', fullPage: false });

  await page.locator('#product-catalog').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'verify_11_mobile_catalog.png', fullPage: false });

  await browser.close();

  console.log('Verification finished successfully!');
  console.log('Console errors captured:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((e, idx) => console.log(`Error ${idx + 1}:`, e));
  }
})().catch(console.error);
