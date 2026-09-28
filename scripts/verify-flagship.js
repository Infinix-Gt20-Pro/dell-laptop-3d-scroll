const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const VIEWPORTS = [
    { name: 'desktop-1920', width: 1920, height: 1080 },
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'desktop-1024', width: 1024, height: 768 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'mobile-375', width: 375, height: 812 },
    { name: 'mobile-320', width: 320, height: 568 }
];

const PAGES = [
    { url: 'http://localhost:3000/', name: 'home' },
    { url: 'http://localhost:3000/products.html', name: 'products' }
];

async function runAudit() {
    console.log('--- STARTING FLAGSHIP AUDIT ---');
    const browser = await chromium.launch({ channel: 'chrome' });
    let hasFailures = false;

    for (const pageInfo of PAGES) {
        console.log(`\n=== Testing Page: ${pageInfo.name} (${pageInfo.url}) ===`);

        for (const vp of VIEWPORTS) {
            const context = await browser.newContext({
                viewport: { width: vp.width, height: vp.height },
                userAgent: vp.width < 1024 
                    ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
                    : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            });

            const page = await context.newPage();
            const consoleErrors = [];
            const consoleWarnings = [];

            page.on('console', msg => {
                if (msg.type() === 'error') consoleErrors.push(msg.text());
                else if (msg.type() === 'warning') consoleWarnings.push(msg.text());
            });
            page.on('pageerror', err => consoleErrors.push(err.message));

            try {
                const response = await page.goto(pageInfo.url, { waitUntil: 'networkidle', timeout: 15000 });
                if (!response || response.status() !== 200) {
                    console.error(`[FAIL] ${pageInfo.name} @ ${vp.name} returned status ${response?.status()}`);
                    hasFailures = true;
                    await context.close();
                    continue;
                }

                // Verify horizontal overflow
                const overflow = await page.evaluate(() => {
                    const docWidth = document.documentElement.clientWidth;
                    const scrollWidth = document.documentElement.scrollWidth;
                    const bodyScrollWidth = document.body ? document.body.scrollWidth : 0;
                    const maxScroll = Math.max(scrollWidth, bodyScrollWidth);
                    return {
                        clientWidth: docWidth,
                        maxScroll: maxScroll,
                        hasOverflow: maxScroll > docWidth + 1 // 1px threshold for subpixel rounding
                    };
                });

                if (overflow.hasOverflow) {
                    console.error(`[FAIL] Horizontal overflow detected on ${pageInfo.name} @ ${vp.name}: clientWidth=${overflow.clientWidth}, maxScroll=${overflow.maxScroll}`);
                    hasFailures = true;
                } else {
                    console.log(`[PASS] ${pageInfo.name} @ ${vp.name}: No horizontal overflow (${overflow.clientWidth}px).`);
                }

                // Check console errors
                if (consoleErrors.length > 0) {
                    console.error(`[FAIL] Console errors on ${pageInfo.name} @ ${vp.name}:`, consoleErrors);
                    hasFailures = true;
                } else {
                    console.log(`[PASS] ${pageInfo.name} @ ${vp.name}: 0 console errors.`);
                }

                // Specific page checks
                if (pageInfo.name === 'home') {
                    const refurbExists = await page.evaluate(() => !!document.getElementById('refurb-process'));
                    const stagesCount = await page.evaluate(() => document.querySelectorAll('.refurb-stage-card').length);
                    if (!refurbExists || stagesCount < 5) {
                        console.error(`[FAIL] Refurbishment story missing or incomplete: exists=${refurbExists}, stages=${stagesCount}`);
                        hasFailures = true;
                    } else if (vp.name === 'desktop-1920') {
                        console.log(`[PASS] Refurbishment story verified with ${stagesCount} certified stages.`);
                    }


                }

                if (pageInfo.name === 'products') {
                    try {
                        await page.waitForSelector('.catalog-product-card, .product-card', { timeout: 4000 });
                    } catch (e) {}
                    const productCards = await page.evaluate(() => document.querySelectorAll('.catalog-product-card, .product-card').length);
                    if (productCards === 0) {
                        console.error(`[FAIL] No product cards rendered on products page!`);
                        hasFailures = true;
                    } else if (vp.name === 'desktop-1920') {
                        console.log(`[PASS] Products catalog rendered ${productCards} machines successfully.`);
                    }
                }

            } catch (err) {
                console.error(`[ERROR] Exception testing ${pageInfo.name} @ ${vp.name}:`, err.message);
                hasFailures = true;
            } finally {
                await context.close();
            }
        }
    }

    await browser.close();

    if (hasFailures) {
        console.error('\n❌ AUDIT FAILED WITH ISSUES');
        process.exit(1);
    } else {
        console.log('\n✅ ALL FLAGSHIP DIGITAL EXPERIENCE TESTS PASSED PERFECTLY!');
        process.exit(0);
    }
}

runAudit();
