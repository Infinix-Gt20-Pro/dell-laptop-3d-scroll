const { chromium, devices } = require('playwright');

async function runTests() {
  console.log('================================================================');
  console.log('  COMPREHENSIVE MOBILE AUTH VERIFICATION (InsForge BaaS)');
  console.log('================================================================');
  
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  const iPhone = devices['iPhone 14'];
  const context = await browser.newContext({
    ...iPhone,
    baseURL: 'http://localhost:3000'
  });

  const page = await context.newPage();
  
  const pageLogs = [];
  const pageErrors = [];
  page.on('console', msg => pageLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => pageErrors.push(err.message));

  let passCount = 0;
  let failCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passCount++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failCount++;
    }
  }

  try {
    // ----------------------------------------------------
    // TEST 1: Open index.html and trigger Auth Modal on iPhone Viewport
    // ----------------------------------------------------
    console.log('\n[Test 1] Loading index.html in iPhone 14 viewport (390x844)...');
    await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Open modal via window.openLucidAuthModal('signin')
    await page.evaluate(() => window.openLucidAuthModal('signin'));
    await page.waitForTimeout(500);

    const isModalVisible = await page.evaluate(() => {
      const modal = document.getElementById('lucid-auth-overlay');
      return modal && modal.classList.contains('active');
    });
    assert(isModalVisible, 'Auth V7 modal opened successfully on mobile viewport (lucid-auth-overlay has active class)');

    // ----------------------------------------------------
    // TEST 2: Inspect Mobile Form Layout & Input Font Size (iOS Auto-Zoom Prevention)
    // ----------------------------------------------------
    console.log('\n[Test 2] Checking iOS Safari font-size (must be >= 16px to prevent auto-zoom)...');
    const inputFontSize = await page.evaluate(() => {
      const input = document.getElementById('v7-login-email');
      return window.getComputedStyle(input).fontSize;
    });
    const fontSizeNum = parseFloat(inputFontSize);
    assert(fontSizeNum >= 16, `Input font-size is ${inputFontSize} (>= 16px prevents iOS zoom)`);

    // ----------------------------------------------------
    // TEST 3: Remember Me Checkbox (sr-only, not hidden)
    // ----------------------------------------------------
    console.log('\n[Test 3] Verifying #v7-login-remember checkbox accessibility & state...');
    const rememberCheckbox = await page.evaluate(() => {
      const el = document.getElementById('v7-login-remember');
      const cs = window.getComputedStyle(el);
      return {
        exists: !!el,
        checked: el.checked,
        display: cs.display,
        classList: Array.from(el.classList)
      };
    });
    assert(rememberCheckbox.exists, 'Remember me checkbox exists');
    assert(rememberCheckbox.display !== 'none', 'Remember me checkbox is NOT display:none (avoids browser validation block)');
    assert(rememberCheckbox.classList.includes('sr-only'), 'Remember me checkbox has sr-only class');

    // ----------------------------------------------------
    // TEST 4: Switch to Register Mode
    // ----------------------------------------------------
    console.log('\n[Test 4] Switching from Sign In to Sign Up (Register) pane...');
    await page.evaluate(() => window.switchAuthV7Mode('register'));
    await page.waitForTimeout(600);

    const isRegisterVisible = await page.evaluate(() => {
      const pane = document.getElementById('auth-v7-pane-register');
      return pane && !pane.classList.contains('pane-hidden');
    });
    assert(isRegisterVisible, 'Sign Up pane is active and visible');

    // ----------------------------------------------------
    // TEST 5: Verify Terms & Privacy Checkbox (#v7-reg-agree)
    // ----------------------------------------------------
    console.log('\n[Test 5] Verifying #v7-reg-agree is sr-only and satisfies HTML5 validation...');
    const agreeCheckbox = await page.evaluate(() => {
      const el = document.getElementById('v7-reg-agree');
      const cs = window.getComputedStyle(el);
      return {
        exists: !!el,
        checked: el.checked,
        display: cs.display,
        classList: Array.from(el.classList)
      };
    });
    assert(agreeCheckbox.exists, '#v7-reg-agree is present');
    assert(agreeCheckbox.display !== 'none', '#v7-reg-agree is NOT display:none (crucial for mobile Safari/Chrome)');
    assert(agreeCheckbox.classList.includes('sr-only'), '#v7-reg-agree uses sr-only for accessible validation');

    // ----------------------------------------------------
    // TEST 6: Fill Sign Up Form and Test Password Mismatch Validation
    // ----------------------------------------------------
    console.log('\n[Test 6] Testing Sign Up form interaction & password mismatch validation...');
    await page.evaluate(() => {
      document.getElementById('v7-reg-name').value = 'Mobile Tester';
      document.getElementById('v7-reg-email').value = 'tester@example.com';
      document.getElementById('v7-reg-password').value = 'Password123!';
      document.getElementById('v7-reg-confirm-password').value = 'MismatchPassword!';
      document.getElementById('v7-reg-agree').checked = true;
    });

    // Submit form and check for toast
    await page.evaluate(() => {
      const form = document.querySelector('#auth-v7-pane-register form');
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });
    await page.waitForTimeout(600);

    let toastInfo = await page.evaluate(() => {
      const toast = document.getElementById('lucid-toast');
      if (!toast) return null;
      const rect = toast.getBoundingClientRect();
      const style = window.getComputedStyle(toast);
      return {
        text: toast.innerText,
        zIndex: style.zIndex,
        top: rect.top,
        left: rect.left,
        visible: !toast.classList.contains('hidden') && rect.width > 0
      };
    });
    assert(toastInfo && toastInfo.visible, 'Toast rendered on mobile');
    assert(toastInfo && toastInfo.text.includes('Passwords do not match'), `Toast caught password mismatch: "${toastInfo?.text}"`);
    assert(toastInfo && parseInt(toastInfo.zIndex) >= 10000, `Toast z-index (${toastInfo?.zIndex}) is higher than auth modal (9999)`);

    // ----------------------------------------------------
    // TEST 7: Test Terms & Privacy Policy Checkbox Validation
    // ----------------------------------------------------
    console.log('\n[Test 7] Testing Sign Up submission with Terms unchecked...');
    await page.evaluate(() => {
      document.getElementById('v7-reg-confirm-password').value = 'Password123!';
      document.getElementById('v7-reg-agree').checked = false;
      const form = document.querySelector('#auth-v7-pane-register form');
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });
    await page.waitForTimeout(600);

    toastInfo = await page.evaluate(() => {
      const toast = document.getElementById('lucid-toast');
      return toast ? toast.innerText : '';
    });
    assert(toastInfo.includes('Please accept the Terms & Privacy Policy'), `Toast caught unchecked terms: "${toastInfo}"`);

    // ----------------------------------------------------
    // TEST 8: Password Visibility Toggle on Mobile
    // ----------------------------------------------------
    console.log('\n[Test 8] Testing password eye toggle button...');
    const initialType = await page.evaluate(() => document.getElementById('v7-reg-password').type);
    await page.evaluate(() => {
      const eyeBtn = document.querySelector('#auth-v7-pane-register .auth-v7-eye-btn');
      eyeBtn.click();
    });
    const toggledType = await page.evaluate(() => document.getElementById('v7-reg-password').type);
    assert(initialType === 'password' && toggledType === 'text', `Password visibility toggled correctly (${initialType} -> ${toggledType})`);

    // ----------------------------------------------------
    // TEST 9: Google Auth Flow on Mobile & PKCE Storage Persistence
    // ----------------------------------------------------
    console.log('\n[Test 9] Testing Google Auth trigger & PKCE storage persistence...');
    // Clear storage first
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    const googleAuthResult = await page.evaluate(async () => {
      const origFetch = window.fetch;
      let returnedAuthUrl = null;
      window.fetch = async function(...args) {
        const res = await origFetch(...args);
        if (args[0] && typeof args[0] === 'string' && args[0].includes('/api/auth/oauth/google')) {
          const clone = res.clone();
          const json = await clone.json();
          returnedAuthUrl = json.authUrl;
          return new Response(JSON.stringify({ authUrl: '' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        return res;
      };

      await window.submitGoogleAuth();

      // restore fetch
      window.fetch = origFetch;

      return {
        returnedAuthUrl,
        localVerifier: localStorage.getItem('cc_oauth_verifier'),
        localReturnUrl: localStorage.getItem('cc_oauth_return_url'),
        sessionVerifier: sessionStorage.getItem('cc_oauth_verifier'),
        sessionReturnUrl: sessionStorage.getItem('cc_oauth_return_url')
      };
    });

    assert(!!googleAuthResult.localVerifier, 'PKCE code verifier stored in localStorage (mobile redirect resilient)');
    assert(!!googleAuthResult.sessionVerifier, 'PKCE code verifier stored in sessionStorage');
    assert(googleAuthResult.localVerifier === googleAuthResult.sessionVerifier, 'localStorage and sessionStorage verifiers match');
    assert(!!googleAuthResult.localReturnUrl, 'Return URL correctly preserved in storage');
    assert(!!googleAuthResult.returnedAuthUrl && googleAuthResult.returnedAuthUrl.includes('accounts.google.com'), `InsForge returned valid Google OAuth URL: ${googleAuthResult.returnedAuthUrl?.substring(0, 55)}...`);

    // ----------------------------------------------------
    // TEST 10: Apple Auth Graceful Fallback
    // ----------------------------------------------------
    console.log('\n[Test 10] Testing Apple Auth fallback mechanism on mobile...');
    await page.evaluate(() => {
      window._origGoogleAuth = window.submitGoogleAuth;
      window.submitGoogleAuth = async () => {};
      window.submitAppleAuth();
    });
    await page.waitForTimeout(600);

    const appleToast = await page.evaluate(() => {
      window.submitGoogleAuth = window._origGoogleAuth;
      const toast = document.getElementById('lucid-toast');
      return toast ? toast.innerText : '';
    });
    assert(appleToast.includes('Apple ID is not configured') || appleToast.includes('Google'), `Apple Sign-In displays graceful feedback: "${appleToast}"`);

    // ----------------------------------------------------
    // TEST 11: Email Sign-In Submission against InsForge API
    // ----------------------------------------------------
    console.log('\n[Test 11] Testing Email Sign-In submission on mobile...');
    await page.evaluate(() => {
      window.switchAuthV7Mode('signin');
      document.getElementById('v7-login-email').value = 'nonexistent.user@example.com';
      document.getElementById('v7-login-password').value = 'RandomSecret123!';
    });
    await page.waitForTimeout(300);

    await page.evaluate(async () => {
      await window.submitV7Login(new Event('submit'));
    });
    await page.waitForTimeout(600);

    const loginToast = await page.evaluate(() => {
      const toast = document.getElementById('lucid-toast');
      return toast ? toast.innerText : '';
    });
    assert(loginToast.toLowerCase().includes('incorrect') || loginToast.toLowerCase().includes('invalid'), `Email sign-in responded cleanly from backend: "${loginToast}"`);

    // ----------------------------------------------------
    // TEST 12: Multi-Page Check: products.html & product-detail.html
    // ----------------------------------------------------
    console.log('\n[Test 12] Checking products.html & product-detail.html auth integration...');
    
    // products.html
    await page.goto('/products.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    const productsAuthOk = await page.evaluate(() => {
      const modal = document.getElementById('lucid-auth-overlay');
      const regAgree = document.getElementById('v7-reg-agree');
      const remember = document.getElementById('v7-login-remember');
      return !!modal && regAgree && !regAgree.classList.contains('hidden') && remember && !remember.classList.contains('hidden');
    });
    assert(productsAuthOk, 'products.html has Auth V7 with non-hidden sr-only checkboxes');

    // product-detail.html
    await page.goto('/product-detail.html?id=1', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    const detailAuthOk = await page.evaluate(() => {
      const modal = document.getElementById('lucid-auth-overlay');
      const regAgree = document.getElementById('v7-reg-agree');
      const remember = document.getElementById('v7-login-remember');
      return !!modal && regAgree && !regAgree.classList.contains('hidden') && remember && !remember.classList.contains('hidden');
    });
    assert(detailAuthOk, 'product-detail.html has Auth V7 with non-hidden sr-only checkboxes');

    // ----------------------------------------------------
    // SUMMARY
    // ----------------------------------------------------
    console.log('\n================================================================');
    console.log(`TOTAL TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
    if (pageErrors.length > 0) {
      console.log('Page Errors encountered:', pageErrors);
    }
    console.log('================================================================\n');

  } catch (err) {
    console.error('Fatal test execution error:', err);
    failCount++;
  } finally {
    await browser.close();
    process.exit(failCount === 0 ? 0 : 1);
  }
}

runTests();
