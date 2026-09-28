const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleLogs = [];
  const errors = [];
  const failedRequests = [];

  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    errors.push(`Page Uncaught Error: ${err.message}\n${err.stack}`);
  });

  page.on('requestfailed', req => {
    failedRequests.push(`Failed Request: ${req.url()} - ${req.failure().errorText}`);
  });

  console.log('Testing http://localhost:3000/index.html...');
  try {
    const res = await page.goto('http://localhost:3000/index.html', { waitUntil: 'load', timeout: 15000 });
    console.log('HTTP Status:', res.status());
  } catch (e) {
    console.error('Goto failed:', e.message);
  }

  await page.waitForTimeout(2000);

  console.log('\n--- Console Logs ---');
  consoleLogs.forEach(l => console.log(l));

  console.log('\n--- Errors ---');
  errors.forEach(e => console.error(e));

  console.log('\n--- Failed Requests ---');
  failedRequests.forEach(f => console.error(f));

  // Test other pages
  for (const pageName of ['products.html', 'product-detail.html', 'admin.html']) {
    console.log(`\nTesting http://localhost:3000/${pageName}...`);
    try {
      const r = await page.goto(`http://localhost:3000/${pageName}`, { waitUntil: 'load', timeout: 15000 });
      console.log(`${pageName} HTTP Status:`, r.status());
    } catch (e) {
      console.error(`${pageName} load error:`, e.message);
    }
  }

  await browser.close();
})();
