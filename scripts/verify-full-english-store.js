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

  // 1. Capture Header & What We Sell Hero
  console.log('1. Capturing Header & What We Sell Hero...');
  await page.screenshot({ path: 'verify_full_1_hero_english.png', fullPage: false });

  // 2. Capture Device Finder
  console.log('2. Capturing Device Finder (Coding)...');
  await page.locator('#device-finder').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_full_2_device_finder.png', fullPage: false });

  // 3. Test Device Finder Switch to 4K Video & Graphic Design
  console.log('3. Clicking 4K Video tag...');
  await page.click('.finder-tag-btn[data-tag="editing"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'verify_full_3_finder_editing.png', fullPage: false });

  // 4. Capture Products Section
  console.log('4. Capturing Products Section (All)...');
  await page.locator('#products').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_full_4_products_all.png', fullPage: false });

  // 5. Test Products Filter: Desktops
  console.log('5. Clicking Desktops filter in Products...');
  await page.click('.catalog-tab-btn[data-filter="desktop"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'verify_full_5_products_desktops.png', fullPage: false });

  // 6. Capture Physical Store Location & Trust Section
  console.log('6. Capturing Physical Store Location & Trust...');
  await page.locator('#store-location').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_full_6_store_location.png', fullPage: false });

  // 7. Capture Flagship 3D Showcase
  console.log('7. Capturing Flagship 3D Showcase...');
  await page.locator('#flagship-showcase').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_full_7_flagship_showcase.png', fullPage: false });

  // 8. Capture Thermal POS Receipt Printer
  console.log('8. Capturing Thermal POS Receipt Configurator...');
  await page.locator('#configurator').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_full_8_thermal_receipt.png', fullPage: false });

  // 9. Capture Footer with Logo, Instagram & Phone
  console.log('9. Capturing Footer...');
  await page.locator('footer').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_full_9_footer.png', fullPage: false });

  // 10. Mobile Viewport Verification (390x844)
  console.log('10. Testing Mobile Viewport...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'verify_full_10_mobile_hero.png', fullPage: false });

  await page.locator('#store-location').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'verify_full_11_mobile_store.png', fullPage: false });

  await browser.close();

  console.log('=== VERIFICATION SUMMARY ===');
  console.log('Total Console Errors:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((e, i) => console.log(`Error ${i + 1}:`, e));
  } else {
    console.log('PASSED: Clean execution with 0 console errors!');
  }
})().catch(console.error);
