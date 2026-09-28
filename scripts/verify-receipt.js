const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  
  console.log('Navigating to http://localhost:3000/#configurator ...');
  await page.goto('http://localhost:3000/#configurator', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Scroll smoothly to configurator
  await page.locator('#configurator').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // 1. Initial screenshot of configurator with standard plan & thermal receipt
  await page.screenshot({ path: 'verify_receipt_standard.png', fullPage: false });
  console.log('1. Captured verify_receipt_standard.png');

  // 2. Click Annual Pro Pre-Pay toggle to trigger tear-off and reprint
  console.log('Clicking Annual Pro Pre-Pay toggle...');
  await page.click('#billing-mode-annual');
  await page.waitForTimeout(1400); // allow tear & reprint feed animation to complete

  await page.screenshot({ path: 'verify_receipt_annual_discount.png', fullPage: false });
  console.log('2. Captured verify_receipt_annual_discount.png');

  // 3. Click the Creative Pro plan preset card
  console.log('Clicking Creative Pro plan preset card...');
  await page.click('.plan-preset-card[data-plan="pro"]');
  await page.waitForTimeout(1400);

  await page.screenshot({ path: 'verify_receipt_plan_pro.png', fullPage: false });
  console.log('3. Captured verify_receipt_plan_pro.png');

  // 4. Test Mobile Viewport (390x844)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#configurator').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_receipt_mobile.png', fullPage: false });
  console.log('4. Captured verify_receipt_mobile.png');

  await browser.close();
  console.log('All receipt verification steps completed successfully!');
})().catch(console.error);
