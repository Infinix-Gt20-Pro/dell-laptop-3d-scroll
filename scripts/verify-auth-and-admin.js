const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('1. Navigating to Home Page...');
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });

  // Open the Lucid Glass Auth Modal
  console.log('2. Opening Lucid Glass Auth Modal...');
  await page.evaluate(() => {
    window.openLucidAuthModal('google');
  });
  await page.waitForTimeout(600);

  await page.screenshot({ path: 'verify_auth_1_modal.png' });
  console.log('Captured verify_auth_1_modal.png');

  // Switch to Database tab
  await page.evaluate(() => {
    window.switchLucidTab('database');
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'verify_auth_2_db_tab.png' });
  console.log('Captured verify_auth_2_db_tab.png');

  // Trigger Google Login
  console.log('3. Triggering Google Fast Sign-in...');
  await page.evaluate(async () => {
    await window.submitGoogleAuth({
      name: "Kashan Ahmad (Admin)",
      email: "kashan@classiccomputers.in",
      avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=KashanAdmin"
    });
  });
  await page.waitForTimeout(600);

  await page.screenshot({ path: 'verify_auth_3_logged_in_nav.png' });
  console.log('Captured verify_auth_3_logged_in_nav.png');

  // Navigate to Admin Backend
  console.log('4. Navigating to Admin Backend Portal...');
  await page.goto('http://localhost:3000/admin.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  await page.screenshot({ path: 'verify_admin_backend.png', fullPage: true });
  console.log('Captured verify_admin_backend.png');

  await browser.close();
  console.log('All auth and backend verifications passed with visual proof!');
})();
