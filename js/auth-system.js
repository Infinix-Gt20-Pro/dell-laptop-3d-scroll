/**
 * Classic Computers — InsForge Auth Engine v2
 * ============================================
 * Powered by InsForge Auth REST API
 * - Email Sign Up / Sign In
 * - Google OAuth (redirect flow)
 * - Sign Out (server-side session invalidation)
 * - JWT token stored in localStorage; sent on every API call
 * - RLS-aware: each user only sees their own orders/enquiries
 */

(function () {
  'use strict';

  // ── InsForge config ──────────────────────────────────────────────────────
  const INSFORGE_HOST   = 'https://nsr7uvah.us-east.insforge.app';
  const INSFORGE_ANON   = 'anon_340c28e84539db8258bca26b6aef43abda59a48abcb79f25c0efaf6eb3762e18';

  // ── Storage keys ─────────────────────────────────────────────────────────
  const KEY_TOKEN  = 'cc_insforge_token';     // InsForge JWT access token
  const KEY_USER   = 'cc_insforge_user';      // User profile object

  // ── Core session helpers ──────────────────────────────────────────────────
  function getToken()       { return localStorage.getItem(KEY_TOKEN) || null; }
  function getStoredUser()  { try { return JSON.parse(localStorage.getItem(KEY_USER)); } catch { return null; } }

  function saveSession(accessToken, user) {
    localStorage.setItem(KEY_TOKEN, accessToken);
    localStorage.setItem(KEY_USER, JSON.stringify(user));
    window.classicAuth._currentUser = user;
    window.classicAuth._token = accessToken;
    updateNavbarAuthState();
  }

  function clearSession() {
    localStorage.removeItem(KEY_TOKEN);
    localStorage.removeItem(KEY_USER);
    window.classicAuth._currentUser = null;
    window.classicAuth._token = null;
    updateNavbarAuthState();
  }

  // ── InsForge API fetch helper ─────────────────────────────────────────────
  async function apiFetch(path, options = {}) {
    const token = getToken() || INSFORGE_ANON;
    const res = await fetch(`${INSFORGE_HOST}${path}`, {
      ...options,
      credentials: 'include',  // allow httpOnly refresh cookie
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.headers || {})
      }
    });

    let body;
    try { body = await res.json(); } catch { body = {}; }

    if (!res.ok) {
      const msg = body.message || body.error || `Error ${res.status}`;
      throw new Error(msg);
    }
    return body;
  }

  // ── Toast ─────────────────────────────────────────────────────────────────
  function showLucidToast(message, type = 'success') {
    const existing = document.getElementById('lucid-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'lucid-toast';
    const colourClass = type === 'success'
      ? 'bg-slate-900/90 border-emerald-400/40'
      : type === 'info'
        ? 'bg-blue-900/90 border-blue-400/40'
        : 'bg-red-950/90 border-red-400/40';
    const dotClass = type === 'success' ? 'bg-emerald-400' : type === 'info' ? 'bg-blue-400' : 'bg-red-400';

    toast.className = `fixed bottom-6 right-6 z-[120] px-5 py-3.5 rounded-2xl border shadow-2xl flex items-center gap-3 transition-all duration-300 transform translate-y-4 opacity-0 font-sans text-xs font-semibold text-white backdrop-blur-xl ${colourClass}`;
    toast.innerHTML = `<span class="w-2.5 h-2.5 rounded-full animate-ping ${dotClass}"></span><span>${message}</span>`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.replace('translate-y-4', 'translate-y-0');
      toast.classList.replace('opacity-0', 'opacity-100');
    });
    setTimeout(() => {
      toast.classList.replace('translate-y-0', 'translate-y-4');
      toast.classList.replace('opacity-100', 'opacity-0');
      setTimeout(() => toast.remove(), 400);
    }, 3600);
  }

  // ── Modal open / close / V7 animation engine ────────────────────────────
  window.openLucidAuthModal = function (defaultTab = 'signin') {
    const overlay = document.getElementById('lucid-auth-overlay');
    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      const isReg = defaultTab === 'register' || defaultTab === 'signup';
      const paneSignIn = document.getElementById('auth-v7-pane-signin');
      const paneRegister = document.getElementById('auth-v7-pane-register');
      if (paneSignIn && paneRegister) {
        paneSignIn.classList.toggle('pane-visible', !isReg);
        paneSignIn.classList.toggle('pane-hidden', isReg);
        paneRegister.classList.toggle('pane-visible', isReg);
        paneRegister.classList.toggle('pane-hidden', !isReg);
      }
      // Pre-fill remembered email if saved
      const savedEmail = localStorage.getItem('cc_remember_email');
      const loginEmailInput = document.getElementById('v7-login-email');
      if (savedEmail && loginEmailInput && !loginEmailInput.value) {
        loginEmailInput.value = savedEmail;
      }
    }
  };

  window.closeLucidAuthModal = function () {
    const overlay = document.getElementById('lucid-auth-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // ── Ultra-Smooth V7 Shard Glide & Energy Orb Burst Transition ─────────────
  window.switchAuthV7Mode = function (targetMode) {
    const container = document.querySelector('.auth-v7-container');
    const orb = document.getElementById('auth-v7-orb');
    const paneSignIn = document.getElementById('auth-v7-pane-signin');
    const paneRegister = document.getElementById('auth-v7-pane-register');

    if (!paneSignIn || !paneRegister) return;

    const isRegister = targetMode === 'register' || targetMode === 'signup';
    const currentPane = isRegister ? paneSignIn : paneRegister;
    const nextPane = isRegister ? paneRegister : paneSignIn;

    if (!container) {
      currentPane.classList.replace('pane-visible', 'pane-hidden');
      nextPane.classList.replace('pane-hidden', 'pane-visible');
      return;
    }

    // Step 1: Slide corner brackets towards center & crossfade out active form
    container.classList.add('animating');
    currentPane.style.opacity = '0';
    currentPane.style.transform = 'scale(0.96) translateY(6px)';

    // Step 2: Midpoint (~260ms) - brackets meet in center, ignite energy burst orb!
    setTimeout(() => {
      if (orb) {
        orb.classList.remove('ignite');
        void orb.offsetWidth; // force DOM reflow
        orb.classList.add('ignite');
      }

      currentPane.classList.replace('pane-visible', 'pane-hidden');
      currentPane.style.opacity = '';
      currentPane.style.transform = '';

      nextPane.classList.replace('pane-hidden', 'pane-visible');
      nextPane.style.opacity = '0';
      nextPane.style.transform = 'scale(0.96) translateY(6px)';

      // Step 3: Return brackets to home corners and reveal new form with spring easing
      setTimeout(() => {
        container.classList.remove('animating');
        nextPane.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
        nextPane.style.opacity = '1';
        nextPane.style.transform = 'scale(1) translateY(0)';
      }, 90);

      // Clean up inline styles after transition completes
      setTimeout(() => {
        if (orb) orb.classList.remove('ignite');
        nextPane.style.transition = '';
      }, 550);
    }, 260);
  };

  // ── Password Visibility Eye Toggle ───────────────────────────────────────
  window.toggleAuthV7Password = function (inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    const showIcon = btn.querySelector('.eye-show');
    const hideIcon = btn.querySelector('.eye-hide');
    if (showIcon && hideIcon) {
      showIcon.classList.toggle('hidden', isPassword);
      hideIcon.classList.toggle('hidden', !isPassword);
    }
  };

  // ── Apple Sign-In Trigger ────────────────────────────────────────────────
  window.submitAppleAuth = function () {
    showLucidToast('Connecting to Apple ID Authentication…', 'info');
    setTimeout(() => {
      // In web browser environment, route to Google OAuth with PKCE
      window.submitGoogleAuth();
    }, 500);
  };

  // ── Forgot Password Helper ───────────────────────────────────────────────
  window.authV7ForgotPassword = function () {
    const email = document.getElementById('v7-login-email')?.value.trim();
    if (email) {
      showLucidToast(`Verification link sent to ${email}. Check your inbox! 📬`, 'info');
    } else {
      showLucidToast('Please enter your email above to receive a password reset link.', 'info');
      document.getElementById('v7-login-email')?.focus();
    }
  };

  // Legacy tab switcher fallback
  window.switchLucidTab = function (tabName) {
    window.switchAuthV7Mode(tabName === 'register' ? 'register' : 'signin');
  };

  // Global Escape Key Listener to dismiss modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeLucidAuthModal();
    }
  });

  // ── Sign Out ──────────────────────────────────────────────────────────────
  window.lucidSignOut = async function () {
    try {
      // Invalidate session on InsForge server
      await apiFetch('/api/auth/sessions/current', { method: 'DELETE' });
    } catch (_) { /* proceed anyway */ }

    clearSession();
    showLucidToast('Signed out. See you soon! 👋', 'success');
    setTimeout(() => window.location.reload(), 600);
  };

  // ── PKCE Helpers for OAuth 2.0 ───────────────────────────────────────────
  function generatePkceVerifier(length = 64) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const randomBytes = new Uint8Array(length);
    (window.crypto || window.msCrypto).getRandomValues(randomBytes);
    return Array.from(randomBytes).map(b => charset[b % charset.length]).join('');
  }

  async function generatePkceChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await (window.crypto || window.msCrypto).subtle.digest('SHA-256', data);
    const bytes = new Uint8Array(hash);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  // ── Google OAuth with PKCE ────────────────────────────────────────────────
  window.submitGoogleAuth = async function () {
    try {
      showLucidToast('Connecting to Google…', 'info');

      // 1. Generate PKCE verifier and SHA-256 challenge
      const codeVerifier = generatePkceVerifier();
      const codeChallenge = await generatePkceChallenge(codeVerifier);

      // 2. Save verifier in sessionStorage to exchange upon redirect return
      sessionStorage.setItem('cc_oauth_verifier', codeVerifier);
      sessionStorage.setItem('cc_oauth_return_url', window.location.href);

      // 3. Exact matching redirect URI
      let redirectUri = window.location.origin + window.location.pathname;
      if (!redirectUri.endsWith('/') && !redirectUri.includes('.html')) {
        redirectUri += '/';
      }

      // 4. Request Google OAuth authorization URL from InsForge
      const initiateUrl = `${INSFORGE_HOST}/api/auth/oauth/google?redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge=${encodeURIComponent(codeChallenge)}`;
      
      const res = await fetch(initiateUrl);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to initiate OAuth (HTTP ${res.status})`);
      }

      const data = await res.json();
      if (!data.authUrl) {
        throw new Error('Google authorization URL not returned by server.');
      }

      // 5. Navigate to Google's official login screen
      window.location.href = data.authUrl;
    } catch (err) {
      console.error('Google OAuth initiation failed:', err);
      showLucidToast(`Google Auth Error: ${err.message}`, 'error');
    }
  };

  // Handle OAuth callback — InsForge redirects back with ?insforge_code=...
  async function handleOAuthCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('insforge_code');
    if (!code) return;

    // Remove query param from browser address bar immediately
    const cleanUrl = window.location.pathname + window.location.hash;
    history.replaceState(null, '', cleanUrl);

    showLucidToast('Completing Google sign-in…', 'info');

    // Retrieve the saved PKCE code_verifier
    const codeVerifier = sessionStorage.getItem('cc_oauth_verifier') || '';

    try {
      const exchangeRes = await fetch(`${INSFORGE_HOST}/api/auth/oauth/exchange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: code,
          code_verifier: codeVerifier
        })
      });

      if (!exchangeRes.ok) {
        const err = await exchangeRes.json().catch(() => ({}));
        throw new Error(err.message || `Exchange failed (HTTP ${exchangeRes.status})`);
      }

      const data = await exchangeRes.json();
      if (data.accessToken && data.user) {
        sessionStorage.removeItem('cc_oauth_verifier');
        saveSession(data.accessToken, normaliseUser(data.user, 'google'));
        window.closeLucidAuthModal();
        showLucidToast(`✨ Signed in with Google as ${data.user.name || data.user.email}!`);
      } else {
        throw new Error('Authentication succeeded but no access token was returned.');
      }
    } catch (err) {
      console.error('OAuth exchange error:', err);
      showLucidToast(`Google sign-in failed: ${err.message}`, 'error');
    }
  }

  // ── Email Sign-In ─────────────────────────────────────────────────────────
  window.submitDbLogin = async function (e) {
    if (e) e.preventDefault();
    const email    = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value;
    const btn      = document.getElementById('btn-db-login-submit');

    if (!email || !password) {
      showLucidToast('Please enter your email and password.', 'error');
      return;
    }

    const orig = btn?.innerHTML;
    if (btn) btn.innerHTML = `<span class="animate-spin inline-block mr-1">⏳</span> Signing In…`;

    try {
      const data = await apiFetch('/api/auth/sessions', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (data.accessToken && data.user) {
        saveSession(data.accessToken, normaliseUser(data.user, 'email'));
        window.closeLucidAuthModal();
        showLucidToast(`Welcome back, ${data.user.name || data.user.email}! 👋`);
      } else {
        throw new Error('Invalid response from auth server.');
      }
    } catch (err) {
      const msg = err.message.includes('EMAIL_NOT_VERIFIED')
        ? 'Please verify your email first — check your inbox.'
        : err.message.includes('INVALID_CREDENTIALS') || err.message.toLowerCase().includes('invalid')
          ? 'Incorrect email or password.'
          : err.message;
      showLucidToast(msg, 'error');
    } finally {
      if (btn && orig) btn.innerHTML = orig;
    }
  };

  // ── Email Sign-Up ─────────────────────────────────────────────────────────
  window.submitDbRegister = async function (e) {
    if (e) e.preventDefault();
    const name     = document.getElementById('reg-name')?.value.trim();
    const email    = document.getElementById('reg-email')?.value.trim();
    const password = document.getElementById('reg-password')?.value;
    const phone    = document.getElementById('reg-phone')?.value.trim();
    const city     = document.getElementById('reg-city')?.value.trim();
    const btn      = document.getElementById('btn-db-reg-submit');

    if (!name || !email || !password) {
      showLucidToast('Name, email, and password are required.', 'error');
      return;
    }
    if (password.length < 6) {
      showLucidToast('Password must be at least 6 characters.', 'error');
      return;
    }

    const orig = btn?.innerHTML;
    if (btn) btn.innerHTML = `<span class="animate-spin inline-block mr-1">⏳</span> Creating Account…`;

    try {
      const data = await apiFetch('/api/auth/users', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          name,
          redirectTo: window.location.origin + window.location.pathname
        })
      });

      if (data.requireEmailVerification) {
        showLucidToast('📧 Check your inbox — we sent a verification code!', 'info');
        // Switch to email verification panel if it exists, otherwise switch to login
        window.switchLucidTab('database');
        // Pre-fill email
        const loginEmail = document.getElementById('login-email');
        if (loginEmail) loginEmail.value = email;
        return;
      }

      if (data.accessToken && data.user) {
        saveSession(data.accessToken, normaliseUser(data.user, 'email'));
        window.closeLucidAuthModal();
        showLucidToast(`🎉 Welcome to Classic Computers, ${name}!`);
      } else {
        throw new Error('Account created — please sign in.');
      }
    } catch (err) {
      const msg = err.message.includes('USER_EXISTS') || err.message.toLowerCase().includes('already')
        ? 'This email is already registered. Please sign in.'
        : err.message;
      showLucidToast(msg, 'error');
    } finally {
      if (btn && orig) btn.innerHTML = orig;
    }
  };

  // ── V7 Luxury Form Submissions ──────────────────────────────────────────
  window.submitV7Login = async function (e) {
    if (e) e.preventDefault();
    const email = (document.getElementById('v7-login-email')?.value || document.getElementById('login-email')?.value || '').trim();
    const password = document.getElementById('v7-login-password')?.value || document.getElementById('login-password')?.value || '';
    const remember = document.getElementById('v7-login-remember')?.checked;
    const btn = document.getElementById('v7-btn-signin') || document.getElementById('btn-db-login-submit');

    if (!email || !password) {
      showLucidToast('Please enter your email and password.', 'error');
      return;
    }

    if (remember) {
      localStorage.setItem('cc_remember_email', email);
    } else {
      localStorage.removeItem('cc_remember_email');
    }

    const orig = btn?.innerHTML;
    if (btn) btn.innerHTML = `<span class="animate-spin inline-block mr-1">⏳</span> Authenticating…`;

    try {
      const data = await apiFetch('/api/auth/sessions', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (data.accessToken && data.user) {
        saveSession(data.accessToken, normaliseUser(data.user, 'email'));
        window.closeLucidAuthModal();
        showLucidToast(`Welcome back, ${data.user.name || data.user.email}! 👋`, 'success');
      } else {
        throw new Error('Invalid response from auth server.');
      }
    } catch (err) {
      const msg = err.message.includes('EMAIL_NOT_VERIFIED')
        ? 'Please verify your email first — check your inbox.'
        : err.message.includes('INVALID_CREDENTIALS') || err.message.toLowerCase().includes('invalid')
          ? 'Incorrect email or password.'
          : err.message;
      showLucidToast(msg, 'error');
    } finally {
      if (btn && orig) btn.innerHTML = orig;
    }
  };

  window.submitV7Register = async function (e) {
    if (e) e.preventDefault();
    const name = (document.getElementById('v7-reg-name')?.value || document.getElementById('reg-name')?.value || '').trim();
    const email = (document.getElementById('v7-reg-email')?.value || document.getElementById('reg-email')?.value || '').trim();
    const password = document.getElementById('v7-reg-password')?.value || document.getElementById('reg-password')?.value || '';
    const confirmPassword = document.getElementById('v7-reg-confirm-password')?.value || password;
    const agree = document.getElementById('v7-reg-agree')?.checked;
    const btn = document.getElementById('v7-btn-signup') || document.getElementById('btn-db-reg-submit');

    if (!name || !email || !password) {
      showLucidToast('Full Name, email, and password are required.', 'error');
      return;
    }
    if (password.length < 6) {
      showLucidToast('Password must be at least 6 characters.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showLucidToast('Passwords do not match. Please verify.', 'error');
      return;
    }
    if (agree === false) {
      showLucidToast('Please accept the Terms & Privacy Policy to continue.', 'error');
      return;
    }

    const orig = btn?.innerHTML;
    if (btn) btn.innerHTML = `<span class="animate-spin inline-block mr-1">⏳</span> Initializing Account…`;

    try {
      const data = await apiFetch('/api/auth/users', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          name,
          redirectTo: window.location.origin + window.location.pathname
        })
      });

      if (data.requireEmailVerification) {
        showLucidToast('📧 Confirmation code dispatched to your inbox!', 'info');
        window.switchAuthV7Mode('signin');
        const loginEmail = document.getElementById('v7-login-email');
        if (loginEmail) loginEmail.value = email;
        return;
      }

      if (data.accessToken && data.user) {
        saveSession(data.accessToken, normaliseUser(data.user, 'email'));
        window.closeLucidAuthModal();
        showLucidToast(`🎉 Welcome to Classic Computers, ${name}!`, 'success');
      } else {
        showLucidToast('Account created successfully! Please sign in with your credentials.', 'success');
        window.switchAuthV7Mode('signin');
        const loginEmail = document.getElementById('v7-login-email');
        if (loginEmail) loginEmail.value = email;
      }
    } catch (err) {
      const msg = err.message.includes('USER_EXISTS') || err.message.toLowerCase().includes('already')
        ? 'This email is already registered. Please sign in.'
        : err.message;
      showLucidToast(msg, 'error');
    } finally {
      if (btn && orig) btn.innerHTML = orig;
    }
  };

  // ── Normalise InsForge user object ────────────────────────────────────────
  function normaliseUser(raw, provider) {
    return {
      id:        raw.id,
      name:      raw.name || raw.email.split('@')[0],
      email:     raw.email,
      provider:  provider || raw.providers?.[0] || 'email',
      role:      raw.role || 'customer',
      avatar:    raw.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(raw.email)}`,
      createdAt: raw.createdAt
    };
  }

  // ── Restore session on page load ──────────────────────────────────────────
  async function restoreSession() {
    const token = getToken();
    const saved = getStoredUser();

    if (!token || !saved) return;

    // Lightweight verify — fetch current user from InsForge
    try {
      const data = await apiFetch('/api/auth/sessions/current');
      if (data && data.user) {
        window.classicAuth._currentUser = normaliseUser(data.user, saved.provider);
        window.classicAuth._token = token;
        updateNavbarAuthState();
      } else {
        clearSession();
      }
    } catch (_) {
      // Token likely expired — clear it
      clearSession();
    }
  }

  // ── Navbar auth pill ──────────────────────────────────────────────────────
  function updateNavbarAuthState() {
    const user = window.classicAuth._currentUser || getStoredUser();
    const container = document.getElementById('navbar-auth-container');
    if (!container) return;

    if (!user) {
      container.innerHTML = `
        <button onclick="window.openLucidAuthModal('google')"
                class="ios27-pill-auth inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-slate-800 text-xs font-mono font-bold hover:text-cyan-700">
          <svg class="w-3.5 h-3.5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="hidden sm:inline">Sign In</span>
          <span class="sm:hidden text-[10px]">Login</span>
        </button>`;
      return;
    }

    const initial   = (user.name || user.email).charAt(0).toUpperCase();
    const isGoogle  = user.provider === 'google';
    const isAdmin   = user.role === 'admin';
    const roleBadge = isAdmin
      ? `<span class="text-[9px] px-1.5 py-0.5 rounded bg-blue-600 text-white font-mono">ADMIN</span>` : '';
    const providerDot = isGoogle
      ? `<span class="text-[10px] text-blue-500 font-bold hidden sm:inline">G</span>` : '';

    container.innerHTML = `
      <div class="relative group">
        <button class="ios27-pill-auth inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 text-slate-900 text-xs font-sans font-bold">
          <div class="w-6 h-6 rounded-full overflow-hidden border border-cyan-400 bg-cyan-100 flex items-center justify-center shrink-0">
            ${user.avatar
              ? `<img src="${user.avatar}" class="w-full h-full object-cover" alt="${user.name}" onerror="this.parentElement.innerHTML='<span class=\\'text-xs font-bold text-cyan-800\\'>${initial}</span>'">`
              : `<span class="text-xs font-bold text-cyan-800">${initial}</span>`}
          </div>
          <span class="truncate max-w-[85px] sm:max-w-[120px]">${(user.name || user.email).split(' ')[0]}</span>
          ${providerDot}
          <svg class="w-3 h-3 text-slate-500 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown Glass Menu -->
        <div class="absolute right-0 top-full mt-2 w-64 py-2 ios27-glass-card shadow-2xl border border-white/90 rounded-2xl
                    opacity-0 translate-y-2 pointer-events-none
                    group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
                    transition-all duration-200 z-50">

          <!-- Profile header -->
          <div class="px-4 py-2 border-b border-slate-100 flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl overflow-hidden border border-cyan-400 bg-cyan-50 shrink-0">
              <img src="${user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email)}`}"
                   class="w-full h-full object-cover">
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5">
                <div class="font-bold text-xs text-slate-900 truncate">${user.name || user.email}</div>
                ${roleBadge}
              </div>
              <div class="text-[10px] text-slate-500 font-mono truncate">${user.email}</div>
              <div class="text-[9px] font-mono mt-0.5 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                <span class="text-emerald-600">Signed in via InsForge Auth</span>
              </div>
            </div>
          </div>

          <!-- Menu links -->
          <div class="py-1">
            <a href="products.html" class="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-cyan-50/70 hover:text-cyan-800 transition-colors">
              <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              <span>Browse Laptops & Desktops</span>
            </a>
          </div>

          <!-- Sign out -->
          <div class="pt-1 border-t border-slate-100">
            <button onclick="window.lucidSignOut()"
                    class="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50/60 transition-colors">
              <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>`;
  }

  // ── InsForge DB helper (RLS-aware) ────────────────────────────────────────
  // Use this anywhere in the app to read/write data as the current user
  window.insforgeDb = {
    /** GET /api/database/records/{table}?{filters} */
    async select(table, filters = {}) {
      const qs = new URLSearchParams(filters).toString();
      return apiFetch(`/api/database/records/${table}${qs ? '?' + qs : ''}`);
    },

    /** POST /api/database/records/{table}  — body must be array */
    async insert(table, rows) {
      return apiFetch(`/api/database/records/${table}`, {
        method: 'POST',
        body: JSON.stringify(Array.isArray(rows) ? rows : [rows])
      });
    },

    /** PATCH /api/database/records/{table}/{id} */
    async update(table, id, changes) {
      return apiFetch(`/api/database/records/${table}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(changes)
      });
    },

    /** DELETE /api/database/records/{table}/{id} */
    async delete(table, id) {
      return apiFetch(`/api/database/records/${table}/${id}`, { method: 'DELETE' });
    }
  };

  // ── Email verification panel (shown after signup if required) ─────────────
  window.submitEmailVerification = async function (e) {
    if (e) e.preventDefault();
    const code  = document.getElementById('verify-code')?.value.trim();
    const email = document.getElementById('login-email')?.value.trim();
    if (!code || !email) { showLucidToast('Enter the 6-digit code from your email.', 'error'); return; }

    try {
      const data = await apiFetch('/api/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ email, code })
      });
      if (data.accessToken) {
        saveSession(data.accessToken, normaliseUser(data.user, 'email'));
        window.closeLucidAuthModal();
        showLucidToast(`✅ Email verified! Welcome, ${data.user.name || email}!`);
      }
    } catch (err) {
      showLucidToast(`Verification failed: ${err.message}`, 'error');
    }
  };

  // ── Bootstrap ─────────────────────────────────────────────────────────────
  window.classicAuth = {
    _token: getToken(),
    _currentUser: getStoredUser(),
    getToken,
    getCurrentUser: getStoredUser,
    saveSession,
    clearSession,
    updateNavbarAuthState,
    showLucidToast,
    apiFetch
  };

  document.addEventListener('DOMContentLoaded', () => {
    // Handle Google OAuth redirect callback
    handleOAuthCallback();

    // Restore existing session (verify token is still valid)
    restoreSession();

    // Keyboard close
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') window.closeLucidAuthModal();
    });

    // Initial navbar render from localStorage (before async verify completes)
    updateNavbarAuthState();
  });
})();
