const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ 
    viewport: { width: 1440, height: 950 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const shopDir = path.resolve('assets/images/shop');
  if (!fs.existsSync(shopDir)) fs.mkdirSync(shopDir, { recursive: true });

  console.log('Navigating to Instagram reel...');
  await page.goto('https://www.instagram.com/classic.computer.empire/reel/DcY0IRLh2sZ/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Close the popup dialog if present
  try {
    const closeBtn = page.locator('svg[aria-label="Close"], button:has(svg[aria-label="Close"])').first();
    if (await closeBtn.isVisible()) {
      console.log('Closing dialog modal...');
      await closeBtn.click();
      await page.waitForTimeout(1000);
    }
  } catch (e) {
    console.log('Close dialog exception:', e.message);
  }

  // Also try pressing Escape key
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  // Read post caption text
  const captionText = await page.evaluate(() => {
    const el = document.querySelector('h1') || document.querySelector('span[dir="auto"]');
    return document.body.innerText;
  });
  console.log('Page text sample:', captionText.substring(0, 500));

  // Capture clean reel screenshot
  await page.screenshot({ path: path.join(shopDir, 'shop_reel_main.png') });
  console.log('Saved assets/images/shop/shop_reel_main.png');

  // Let's capture the video element or frame
  const video = page.locator('video').first();
  if (await video.isVisible()) {
    console.log('Video element is visible!');
    // Unmute or play if needed
    await video.screenshot({ path: path.join(shopDir, 'shop_storefront_1.png') });
    console.log('Saved shop_storefront_1.png');

    // Wait 2 seconds and capture another frame
    await page.waitForTimeout(2500);
    await video.screenshot({ path: path.join(shopDir, 'shop_storefront_2.png') });
    console.log('Saved shop_storefront_2.png');

    await page.waitForTimeout(2500);
    await video.screenshot({ path: path.join(shopDir, 'shop_storefront_3.png') });
    console.log('Saved shop_storefront_3.png');
  }

  await browser.close();
  console.log('Done shop frame extraction!');
})().catch(console.error);
