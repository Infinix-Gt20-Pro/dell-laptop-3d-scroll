const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000/index.html...');
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });

  // Scroll directly to ticker section
  await page.evaluate(() => {
    const el = document.getElementById('ticker-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'verify_clean_inventory_section.png' });
  console.log('Captured verify_clean_inventory_section.png');

  // Also capture top navigation
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'verify_clean_navbar.png' });
  console.log('Captured verify_clean_navbar.png');

  await browser.close();
  console.log('Verification finished successfully.');
})();
