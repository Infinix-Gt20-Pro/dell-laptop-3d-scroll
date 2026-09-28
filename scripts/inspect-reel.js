const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ 
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  console.log('Navigating to Instagram reel...');
  try {
    await page.goto('https://www.instagram.com/classic.computer.empire/reel/DcY0IRLh2sZ/', { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    console.log('Goto timed out or caught:', e.message);
  }

  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'instagram_reel_preview.png' });
  console.log('Saved instagram_reel_preview.png');

  // Look for video elements or image posters
  const videoSrc = await page.evaluate(() => {
    const v = document.querySelector('video');
    return v ? v.src : null;
  });
  console.log('Video element src:', videoSrc);

  await browser.close();
})().catch(console.error);
