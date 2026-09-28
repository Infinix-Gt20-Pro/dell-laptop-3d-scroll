const { chromium } = require('playwright');

async function testIos27Header() {
  console.log('Testing iOS 27 Glass Header...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  
  // Desktop
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Take screenshot of top header
  await page.screenshot({ path: 'verify_ios27_1_desktop_header.png' });
  console.log('Captured verify_ios27_1_desktop_header.png');

  // Slightly scroll down to test floating glass effect over page content
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'verify_ios27_2_scrolled_floating_dock.png' });
  console.log('Captured verify_ios27_2_scrolled_floating_dock.png');

  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_ios27_3_mobile_header.png' });
  console.log('Captured verify_ios27_3_mobile_header.png');

  await browser.close();
}

testIos27Header().catch(e => {
  console.error(e);
  process.exit(1);
});
