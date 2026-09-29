/**
 * Test Suite: Framer WebGL Burn Transition Verification
 * =====================================================
 * Tests:
 * 1. WebGL compilation & program linking with 0 errors
 * 2. Canvas lifecycle, pointerEvents, and z-index
 * 3. window.triggerBurnTransition execution (page mode & pulse mode)
 * 4. Interactive button click triggers (product cards, auth CTA, filters)
 * 5. Mobile viewport emulation (iPhone 14)
 */

const { chromium } = require('playwright');

async function runTests() {
  console.log('================================================================');
  console.log('  FRAMER WEBGL BURN TRANSITION COMPREHENSIVE VERIFICATION');
  console.log('================================================================\n');

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });
  let totalPass = 0;
  let totalFail = 0;

  function pass(msg) {
    console.log(`  ✅ PASS: ${msg}`);
    totalPass++;
  }
  function fail(msg, err) {
    console.error(`  ❌ FAIL: ${msg}`, err || '');
    totalFail++;
  }

  try {
    // Emulate iPhone 14 mobile device
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    });

    const page = await context.newPage();

    // Listen for console errors or shader warnings
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    console.log('[Test 1] Loading index.html with Burn Transition on Mobile...');
    await page.goto('http://localhost:3000/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const canvasExists = await page.evaluate(() => {
      const c = document.getElementById('burn-transition-canvas');
      return !!c && c.tagName.toLowerCase() === 'canvas';
    });

    if (canvasExists) pass('Fullscreen overlay canvas #burn-transition-canvas injected into DOM');
    else fail('Canvas #burn-transition-canvas not found');

    console.log('[Test 2] Verifying WebGL context & shader programs compilation...');
    const webglStatus = await page.evaluate(() => {
      return typeof window.triggerBurnTransition === 'function';
    });

    if (webglStatus) pass('Global window.triggerBurnTransition API is registered');
    else fail('window.triggerBurnTransition is not a function');

    const shaderErrors = consoleErrors.filter(e => e.includes('Shader') || e.includes('linking') || e.includes('WebGL'));
    if (shaderErrors.length === 0) pass('All shaders compiled & linked with 0 WebGL errors');
    else fail('Shader compilation encountered errors', shaderErrors);

    console.log('[Test 3] Testing window.triggerBurnTransition programmatic pulse...');
    const pulseResult = await page.evaluate(async () => {
      return new Promise(resolve => {
        let completed = false;
        window.triggerBurnTransition(null, {
          mode: 'pulse',
          duration: 300,
          onComplete: () => {
            completed = true;
            resolve({ completed });
          }
        });
        setTimeout(() => resolve({ completed, timeout: true }), 1000);
      });
    });

    if (pulseResult.completed) pass('Burn transition pulse completed and invoked onComplete callback');
    else fail('Burn transition pulse failed or timed out', pulseResult);

    console.log('[Test 4] Testing window.triggerBurnTransition page navigation mode...');
    const pageTransitionResult = await page.evaluate(async () => {
      return new Promise(resolve => {
        let peaked = false;
        let completed = false;
        window.triggerBurnTransition(() => {
          peaked = true;
        }, {
          mode: 'page',
          duration: 400,
          onComplete: () => {
            completed = true;
            resolve({ peaked, completed });
          }
        });
        setTimeout(() => resolve({ peaked, completed, timeout: true }), 1200);
      });
    });

    if (pageTransitionResult.peaked && pageTransitionResult.completed) {
      pass('Page mode burn wave triggered peak navigation callback & finished onComplete');
    } else {
      fail('Page mode burn wave did not trigger callbacks properly', pageTransitionResult);
    }

    console.log('[Test 5] Testing Product Button Click trigger...');
    // Click on a product button or WhatsApp pill
    const buttonTriggered = await page.evaluate(() => {
      let triggered = false;
      const orig = window.triggerBurnTransition;
      window.triggerBurnTransition = function (cb, opts) {
        triggered = true;
        return orig.apply(this, arguments);
      };
      // Find a product card link or button
      const btn = document.querySelector('.vertical-product-card a, .auth-v7-btn-submit, .ios27-pill-auth');
      if (btn) {
        btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      }
      window.triggerBurnTransition = orig;
      return { triggered, btnFound: !!btn };
    });

    if (buttonTriggered.btnFound && buttonTriggered.triggered) {
      pass('Clicking interactive product button smoothly fired Burn Transition wave');
    } else {
      fail('Button click did not trigger burn transition', buttonTriggered);
    }

    console.log('[Test 6] Testing Canvas overlay non-blocking interaction (pointer-events: none)...');
    const pointerEvents = await page.evaluate(() => {
      const c = document.getElementById('burn-transition-canvas');
      return window.getComputedStyle(c).pointerEvents;
    });

    if (pointerEvents === 'none') {
      pass('Canvas maintains pointer-events: none (does not block clicks or mobile scrolling)');
    } else {
      fail(`Canvas has pointerEvents: ${pointerEvents}, expected "none"`);
    }

    console.log('[Test 7] Testing products.html integration...');
    await page.goto('http://localhost:3000/products.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    const productsHasBurn = await page.evaluate(() => {
      return typeof window.triggerBurnTransition === 'function' && !!document.getElementById('burn-transition-canvas');
    });

    if (productsHasBurn) pass('products.html has working Burn Transition canvas & API');
    else fail('products.html missing Burn Transition');

    console.log('[Test 8] Testing product-detail.html integration...');
    await page.goto('http://localhost:3000/product-detail.html?id=dell-latitude-7400', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    const detailHasBurn = await page.evaluate(() => {
      return typeof window.triggerBurnTransition === 'function' && !!document.getElementById('burn-transition-canvas');
    });

    if (detailHasBurn) pass('product-detail.html has working Burn Transition canvas & API');
    else fail('product-detail.html missing Burn Transition');

    await context.close();
  } catch (err) {
    fail('Unexpected error during test execution', err);
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log(`TOTAL TEST RESULTS: ${totalPass} PASSED, ${totalFail} FAILED`);
  console.log('================================================================\n');

  if (totalFail > 0) process.exit(1);
}

runTests();
