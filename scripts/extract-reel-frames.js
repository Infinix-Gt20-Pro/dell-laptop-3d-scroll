const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ 
    viewport: { width: 1440, height: 950 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const shopDir = path.resolve('assets/images/shop');

  console.log('Navigating to reel...');
  await page.goto('https://www.instagram.com/classic.computer.empire/reel/DcY0IRLh2sZ/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Close dialog
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  // Get video element handle
  const videoHandle = await page.$('video');
  if (videoHandle) {
    // Hide any overlays or controls if possible, or seek through the video
    for (let sec = 1; sec <= 12; sec += 2) {
      await page.evaluate((s) => {
        const v = document.querySelector('video');
        if (v) {
          v.currentTime = s;
          v.pause();
        }
      }, sec);
      await page.waitForTimeout(800);
      const outPath = path.join(shopDir, `shop_frame_${sec}s.png`);
      await videoHandle.screenshot({ path: outPath });
      console.log(`Saved ${outPath}`);
    }
  }

  await browser.close();
  console.log('All frames extracted successfully!');
})().catch(console.error);
