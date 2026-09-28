const fs = require('fs');
const path = require('path');

// Read products data from js/products-data.js
const productsDataContent = fs.readFileSync(path.resolve('js/products-data.js'), 'utf8');

// Safely extract STORE_CONFIG and PRODUCTS via eval wrapper
let extractedData;
try {
  extractedData = eval(`
    (() => {
      ${productsDataContent}
      return { STORE_CONFIG, PRODUCTS };
    })()
  `);
} catch (e) {
  console.error('Error evaluating products-data.js:', e);
  process.exit(1);
}

const { STORE_CONFIG, PRODUCTS } = extractedData;

console.log(`Loaded ${PRODUCTS.length} products for store: ${STORE_CONFIG.storeName}`);

// ==============================================================================
// LUCID GLASS AUTH MODAL GENERATOR (Google 1-Tap + Database Auth)
// ==============================================================================
function getLucidAuthModalHtml() {
  return `
  <!-- Lucid Glass Auth Modal Overlay -->
  <div id="lucid-auth-overlay" class="lucid-glass-overlay">
    <div class="lucid-glass-modal p-6 sm:p-8">
      
      <!-- Close Button -->
      <button onclick="window.closeLucidAuthModal()" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-300/80 text-slate-700 flex items-center justify-center transition-all hover:rotate-90 z-20" aria-label="Close Modal">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Modal Header with Logo -->
      <div class="flex items-center gap-3 mb-5">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
          <img src="assets/images/logo.png" class="w-full h-full object-cover rounded-[14px]">
        </div>
        <div>
          <h3 class="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>Classic Computers</span>
            <span class="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">SECURE</span>
          </h3>
          <p class="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Account Portal & Verification</p>
        </div>
      </div>

      <!-- Tab Switcher -->
      <div class="lucid-tab-track mb-5">
        <button id="tab-btn-google" class="lucid-tab-btn active" onclick="window.switchLucidTab('google')">
          <span class="inline-flex items-center gap-1.5 justify-center">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            Google 1-Tap
          </span>
        </button>
        <button id="tab-btn-database" class="lucid-tab-btn" onclick="window.switchLucidTab('database')">
          Database Sign In
        </button>
        <button id="tab-btn-register" class="lucid-tab-btn" onclick="window.switchLucidTab('register')">
          New Account
        </button>
      </div>

      <!-- Panel 1: Google Fast Sign-In -->
      <div id="tab-panel-google" class="space-y-4">
        <div class="p-3.5 rounded-2xl bg-cyan-50/80 border border-cyan-200/70 text-center">
          <p class="text-xs text-cyan-950 font-medium leading-relaxed">
            One-tap authentication with your Google Account. Saved securely to our live backend database.
          </p>
        </div>

        <button onclick="window.submitGoogleAuth()" class="lucid-btn-google lucid-shimmer-sweep group">
          <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div class="pt-1">
          <div class="text-[10px] font-mono uppercase tracking-wider text-slate-400 text-center mb-2">Instant Demo Profiles:</div>
          <div class="grid grid-cols-2 gap-2">
            <button onclick="window.submitGoogleAuth({ name: 'Kashan Ahmad', email: 'kashan@classiccomputers.in', avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=KashanAdmin' })" 
                    class="p-2 rounded-xl bg-white/90 border border-slate-200 text-left hover:border-cyan-400 transition-all text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-sm">
              <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">KA</span>
              <span class="truncate">Kashan (Admin)</span>
            </button>
            <button onclick="window.submitGoogleAuth({ name: 'Arjun Verma', email: 'arjun.verma.tech@gmail.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ArjunVerma' })" 
                    class="p-2 rounded-xl bg-white/90 border border-slate-200 text-left hover:border-cyan-400 transition-all text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-sm">
              <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">AV</span>
              <span class="truncate">Arjun (Client)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Panel 2: Database Email Login -->
      <form id="tab-panel-database" class="space-y-3 hidden" onsubmit="window.submitDbLogin(event)">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
          <input type="email" id="login-email" required placeholder="you@example.com" class="lucid-glass-input" value="kashan@classiccomputers.in">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Password</label>
          <input type="password" id="login-password" required placeholder="••••••••" class="lucid-glass-input" value="admin">
        </div>

        <button type="submit" id="btn-db-login-submit" class="lucid-btn-primary lucid-shimmer-sweep mt-2">
          <span>Sign In to Database →</span>
        </button>

        <div class="text-center pt-2">
          <span class="text-xs text-slate-500">Need a database account?</span>
          <button type="button" onclick="window.switchLucidTab('register')" class="text-xs text-cyan-600 font-bold hover:underline ml-1">Register now</button>
        </div>
      </form>

      <!-- Panel 3: Account Registration -->
      <form id="tab-panel-register" class="space-y-2.5 hidden" onsubmit="window.submitDbRegister(event)">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-0.5">Full Name</label>
          <input type="text" id="reg-name" required placeholder="e.g. Vikram Malhotra" class="lucid-glass-input">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-0.5">Email Address</label>
          <input type="email" id="reg-email" required placeholder="vikram@example.com" class="lucid-glass-input">
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-0.5">Phone</label>
            <input type="tel" id="reg-phone" placeholder="+91 98765 43210" class="lucid-glass-input">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-0.5">City</label>
            <input type="text" id="reg-city" placeholder="e.g. Lucknow, UP" class="lucid-glass-input">
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-0.5">Choose Password</label>
          <input type="password" id="reg-password" required placeholder="••••••••" class="lucid-glass-input">
        </div>

        <button type="submit" id="btn-db-reg-submit" class="lucid-btn-primary lucid-shimmer-sweep mt-2">
          <span>Create Account & Save to Database →</span>
        </button>
      </form>

      <!-- Footer Info & Direct Admin Link -->
      <div class="mt-5 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
        <span class="flex items-center gap-1.5 font-mono">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Database Online</span>
        </span>
        <a href="admin.html" class="text-cyan-700 font-bold hover:underline font-mono">
          Open Admin Backend →
        </a>
      </div>

    </div>
  </div>
  `;
}

// ==============================================================================
// 1. APPLE iOS 27 SPATIAL LIQUID GLASS NAVIGATION HEADER
// ==============================================================================
function getSharedNav(activePage = 'home') {
  return `
  <!-- Ambient Floating Background Light Orbs (Shines through iOS 27 Glass) -->
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div class="ios27-ambient-orb" style="top: -120px; left: 18%; width: 480px; height: 480px; background: radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, rgba(56, 189, 248, 0) 70%);"></div>
    <div class="ios27-ambient-orb" style="top: 80px; right: 12%; width: 520px; height: 520px; background: radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, rgba(168, 85, 247, 0) 70%); animation-delay: -5s;"></div>
    <div class="ios27-ambient-orb" style="top: 360px; left: 38%; width: 440px; height: 440px; background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0) 70%); animation-delay: -9s;"></div>
  </div>

  <!-- iOS 27 Floating Dynamic Island & Glass Dock Navigation -->
  <div class="ios27-nav-wrapper">
    <div class="max-w-7xl mx-auto flex flex-col items-center gap-2">
      
      <!-- Top Dynamic Status Micro-Pill (Floating Status Bar) -->
      <div class="ios27-status-pill inline-flex items-center justify-between gap-3 sm:gap-4 px-4 py-1 text-[11px] font-mono text-slate-300">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="font-bold text-cyan-300 tracking-wider text-[10px] uppercase">PAN-INDIA COURIER</span>
          <span class="text-white/30 hidden sm:inline">•</span>
          <span class="text-slate-300 hidden sm:inline">Certified Refurbished Laptops & Desktops</span>
        </div>
        <div class="flex items-center gap-3 text-[10px]">
          <span class="text-emerald-300 hidden md:inline">🏬 Etah Showroom (GSTIN: ${STORE_CONFIG.gstNumber})</span>
          <span class="text-white/30 hidden md:inline">•</span>
          <a href="tel:${STORE_CONFIG.supportPhone.replace(/\s+/g, '')}" class="text-cyan-300 hover:text-cyan-200 font-bold flex items-center gap-1 transition-colors">
            <span>📞 Order Helpline: ${STORE_CONFIG.supportPhone}</span>
          </a>
        </div>
      </div>

      <!-- Main iOS 27 Floating Glass Island Dock -->
      <header class="ios27-glass-dock w-full flex items-center justify-between gap-4">
        
        <!-- Brand Monogram & Squircle Logo -->
        <a href="index.html" class="flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0">
          <div class="relative w-8 h-8 sm:w-11 sm:h-11 rounded-[12px] sm:rounded-[16px] p-0.5 bg-gradient-to-tr from-white via-cyan-100 to-white shadow-md border border-white/90 transition-transform duration-300 group-hover:scale-105 overflow-hidden flex items-center justify-center shrink-0">
            <img src="assets/images/logo.png" alt="Classic Computers Logo" class="w-full h-full object-cover brand-logo-img">
            <div class="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
          </div>
          <div class="flex flex-col min-w-0">
            <div class="flex items-center gap-1 sm:gap-1.5">
              <span class="text-sm sm:text-lg font-black text-slate-950 tracking-tight font-sans">CLASSIC</span>
              <span class="text-sm sm:text-lg font-black bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">COMPUTERS</span>
            </div>
            <span class="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold truncate hidden sm:inline-block">
              Certified Refurbished Hub • Etah (UP)
            </span>
          </div>
        </a>

        <!-- Center: Segmented Glass Navigation Track -->
        <nav class="hidden lg:flex items-center gap-1 ios27-segmented-nav">
          <a href="index.html" class="ios27-nav-tab ${activePage === 'home' ? 'active' : ''}">
            Home
          </a>
          <a href="products.html" class="ios27-nav-tab ${activePage === 'products' ? 'active' : ''}">
            Products
          </a>
          <a href="index.html#ticker-section" class="ios27-nav-tab">
            Featured Stock
          </a>
          <a href="index.html#store-location" class="ios27-nav-tab">
            Store & Trust Proof
          </a>
          <a href="admin.html" class="ios27-nav-tab ${activePage === 'admin' ? 'active' : ''} text-cyan-700 flex items-center gap-1.5 font-bold">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <span>Admin Backend</span>
          </a>
        </nav>

        <!-- Right: Apple Liquid Glass Action Capsules -->
        <div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          <!-- Dynamic User Auth Pill (Google / DB Session) -->
          <div id="navbar-auth-container" class="shrink-0">
            <button onclick="window.openLucidAuthModal('google')" 
                    class="ios27-pill-auth inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-slate-800 text-xs font-mono font-bold hover:text-cyan-700">
              <svg class="w-3.5 h-3.5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="hidden sm:inline">Sign In</span>
              <span class="sm:hidden text-[10px]">Login</span>
            </button>
          </div>

          <!-- Instagram Sunset Glass Capsule -->
          <a href="${STORE_CONFIG.instagramUrl}" target="_blank" rel="noopener noreferrer" 
             class="ios27-pill-instagram hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold text-slate-700 hover:text-pink-600">
            <svg class="w-3.5 h-3.5 fill-current text-pink-600" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>Instagram</span>
          </a>

          <!-- WhatsApp Emerald Liquid Glass Capsule -->
          <a href="https://wa.me/${STORE_CONFIG.whatsappNumber}?text=Hi%20Classic%20Computers%2C%20I%20am%20interested%20in%20buying%20a%20certified%20laptop%2Fdesktop." 
             target="_blank" rel="noopener noreferrer"
             class="ios27-pill-whatsapp inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 text-white text-xs font-mono font-bold shadow-md shrink-0">
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span class="hidden sm:inline">Order on WhatsApp</span>
            <span class="sm:hidden text-[11px]">Chat</span>
          </a>

          <!-- Mobile Glass Drawer Toggle Button -->
          <button id="mobile-menu-toggle" type="button" class="lg:hidden p-1.5 sm:p-2 rounded-2xl text-slate-800 bg-white/70 hover:bg-white border border-white/80 shadow-sm focus:outline-none transition-all" aria-label="Toggle Navigation">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>

      </header>

      <script>
        (function() {
          const wrapper = document.querySelector('.ios27-nav-wrapper');
          if (wrapper) {
            window.addEventListener('scroll', function() {
              if (window.scrollY > 30) {
                wrapper.classList.add('scrolled');
              } else {
                wrapper.classList.remove('scrolled');
              }
            }, { passive: true });
          }
        })();
      </script>

      <!-- Mobile Slide Glass Drawer -->
      <div id="mobile-drawer" class="hidden lg:hidden w-full px-5 py-4 ios27-glass-card border border-white/90 shadow-2xl mt-2 transition-all">
        <div class="flex flex-col gap-2 pt-1">
          <button onclick="window.openLucidAuthModal('google')" class="w-full text-left px-4 py-2.5 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-bold flex items-center justify-between">
            <span>🔐 Google / Database Sign In</span>
            <span class="text-[10px] bg-cyan-200/60 px-2 py-0.5 rounded-full font-mono">Fast Access</span>
          </button>
          <a href="admin.html" class="px-4 py-2 rounded-2xl bg-slate-900 text-cyan-300 text-xs font-bold font-mono flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Admin & Database Backend</span>
          </a>
          <a href="index.html" class="px-4 py-2 rounded-2xl ${activePage === 'home' ? 'bg-cyan-500/15 text-cyan-800 font-bold border border-cyan-400/30' : 'text-slate-700'} text-xs font-semibold">
            Home
          </a>
          <a href="products.html" class="px-4 py-2 rounded-2xl ${activePage === 'products' ? 'bg-cyan-500/15 text-cyan-800 font-bold border border-cyan-400/30' : 'text-slate-700'} text-xs font-semibold">
            Products (Full Catalog)
          </a>
          <a href="index.html#ticker-section" class="px-4 py-2 rounded-2xl text-slate-700 text-xs font-semibold hover:bg-white/60">
            Featured Stock
          </a>
          <a href="index.html#store-location" class="px-4 py-2 rounded-2xl text-slate-700 text-xs font-semibold hover:bg-white/60">
            Store & Trust Proof
          </a>
          <a href="index.html#why-refurbished" class="px-4 py-2 rounded-2xl text-slate-700 text-xs font-semibold hover:bg-white/60">
            Why Refurbished
          </a>
          <div class="pt-3 mt-1 border-t border-slate-200/60 flex flex-col gap-2">
            <a href="${STORE_CONFIG.instagramUrl}" target="_blank" class="flex items-center justify-center gap-2 py-2 px-4 rounded-xl ios27-pill-instagram text-slate-800 text-xs font-mono font-bold">
              <span>Instagram: ${STORE_CONFIG.instagramHandle}</span>
            </a>
            <a href="tel:${STORE_CONFIG.supportPhone.replace(/\s+/g, '')}" class="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-900 text-white text-xs font-mono font-bold">
              <span>Call Helpline: ${STORE_CONFIG.supportPhone}</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  </div>

  ${getLucidAuthModalHtml()}
  <script src="js/auth-system.js"></script>
  `;
}

function getSharedFooter() {
  return `
  <!-- Global Footer -->
  <footer class="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-800 relative z-10" id="footer">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
        
        <!-- Brand Bio -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white p-0.5 overflow-hidden flex items-center justify-center shadow-md">
              <img src="assets/images/logo.png" alt="Classic Computers" class="w-full h-full object-cover brand-logo-img">
            </div>
            <div>
              <span class="text-lg font-black tracking-tight text-white block">CLASSIC COMPUTERS</span>
              <span class="text-[10px] font-mono text-cyan-400 font-semibold uppercase tracking-wider">Certified Refurbished Hub</span>
            </div>
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            India's premier certified refurbished technology store. Sourcing corporate lease return Dell Precision, ThinkPad, and HP EliteBook machines at up to 70% off showroom retail.
          </p>
          <div class="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span>● Official GSTIN:</span>
            <span class="text-white font-bold">${STORE_CONFIG.gstNumber}</span>
          </div>
        </div>

        <!-- Quick Navigation -->
        <div>
          <h4 class="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-4">Store Navigation</h4>
          <ul class="space-y-2 text-xs text-slate-300">
            <li><a href="index.html" class="hover:text-cyan-400 transition-colors">Home Page</a></li>
            <li><a href="products.html" class="hover:text-cyan-400 transition-colors font-bold text-white">Full Products Catalog (8+ Models)</a></li>
            <li><a href="product-detail.html?id=dell-5530-flagship" class="hover:text-cyan-400 transition-colors">Dell Precision 5530 4K Workstation</a></li>
            <li><a href="index.html#ticker-section" class="hover:text-cyan-400 transition-colors">Featured In-Stock Showcase</a></li>
            <li><a href="admin.html" class="hover:text-cyan-400 transition-colors text-cyan-300 font-bold flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Admin & Database Backend</span>
            </a></li>
            <li><a href="index.html#store-location" class="hover:text-cyan-400 transition-colors">Store Location & Proof</a></li>
            <li><a href="index.html#why-refurbished" class="hover:text-cyan-400 transition-colors">Why Buy Refurbished</a></li>
          </ul>
        </div>

        <!-- Store Proof & Physical Location -->
        <div>
          <h4 class="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-4">Physical Showroom</h4>
          <p class="text-xs text-slate-300 leading-relaxed mb-3">
            <strong>Classic Computers</strong><br>
            Near Railway Road / GT Road<br>
            Etah, Uttar Pradesh — 207001, India
          </p>
          <div class="space-y-1.5 text-xs font-mono text-slate-400">
            <div>📞 Direct: <a href="tel:${STORE_CONFIG.supportPhone.replace(/\s+/g, '')}" class="text-cyan-400 hover:underline font-bold">${STORE_CONFIG.supportPhone}</a></div>
            <div>📱 Secondary: <a href="tel:${STORE_CONFIG.secondaryPhone.replace(/\s+/g, '')}" class="text-cyan-400 hover:underline">${STORE_CONFIG.secondaryPhone}</a></div>
            <div>⏰ Mon–Sat: 10:00 AM – 8:30 PM</div>
            <div>⏰ Sunday: 11:00 AM – 5:00 PM</div>
          </div>
        </div>

        <!-- Social & Ordering -->
        <div>
          <h4 class="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-4">Social & WhatsApp</h4>
          <p class="text-xs text-slate-400 mb-3">
            Watch real video unboxings and customer deliveries on our official Instagram channel:
          </p>
          <a href="${STORE_CONFIG.instagramUrl}" target="_blank" class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-pink-900/30 border border-pink-500/30 text-pink-300 text-xs font-mono font-bold hover:bg-pink-900/50 transition-all mb-3 w-full justify-center">
            <span>📷 Instagram: ${STORE_CONFIG.instagramHandle}</span>
          </a>
          <a href="https://wa.me/${STORE_CONFIG.whatsappNumber}?text=Hi%20Classic%20Computers%2C%20I%20want%20to%20place%20an%20order." target="_blank" class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all w-full justify-center shadow-lg">
            <span>💬 Chat on WhatsApp</span>
          </a>
        </div>

      </div>

      <div class="pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 font-mono">
        <div>
          © 2026 Classic Computers. All rights reserved. Registered Enterprise Refurbisher.
        </div>
        <div class="flex items-center gap-4">
          <span class="text-emerald-400">✓ 32-Point Inspected</span>
          <span class="text-cyan-400">✓ 6-12 Months Warranty</span>
          <span class="text-purple-400">✓ Pan-India Insured</span>
        </div>
      </div>
    </div>
  </footer>
  `;
}

// Generate the 60fps moving ticker HTML cards with iOS 27 Glass Card styling
function generateTickerCardsHtml() {
  const renderCard = (p) => `
    <div class="ios27-glass-card vertical-product-card p-4 flex flex-col justify-between group">
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="px-2.5 py-0.5 rounded-full bg-cyan-50/80 text-cyan-800 text-[10px] font-mono font-bold border border-cyan-200/60 backdrop-blur-md">
            ${p.grade.split('(')[0].trim()}
          </span>
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-50/80 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-200/60 backdrop-blur-md">
            Save ${p.discountPercentage}%
          </span>
        </div>
        
        <div class="relative w-full h-44 rounded-2xl bg-white/70 overflow-hidden flex items-center justify-center p-2 mb-3 border border-white/80 shadow-inner group-hover:bg-white transition-colors">
          <img src="${p.thumbnail}" alt="${p.shortName}" class="max-h-full max-w-full object-contain card-img-zoom transition-transform duration-300">
          <div class="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-mono backdrop-blur-md">
            ${p.brand}
          </div>
        </div>

        <h3 class="text-sm font-bold text-slate-900 group-hover:text-cyan-600 transition-colors line-clamp-1">
          ${p.shortName}
        </h3>
        <p class="text-[11px] text-slate-500 font-mono line-clamp-1 mt-0.5">
          ${p.specs.processor.split('(')[0]}
        </p>

        <div class="grid grid-cols-2 gap-1.5 my-3 text-[10px] font-mono">
          <div class="px-2 py-1 rounded-xl bg-white/60 text-slate-700 border border-white/80 backdrop-blur-sm truncate">
            ⚡ ${p.specs.ram}
          </div>
          <div class="px-2 py-1 rounded-xl bg-white/60 text-slate-700 border border-white/80 backdrop-blur-sm truncate">
            💾 ${p.specs.storage.split(' ')[0]} SSD
          </div>
          <div class="px-2 py-1 rounded-xl bg-white/60 text-slate-700 border border-white/80 backdrop-blur-sm truncate col-span-2">
            🖥️ ${p.specs.display.split(',')[0].substring(0, 30)}
          </div>
        </div>
      </div>

      <div class="pt-3 border-t border-slate-200/50">
        <div class="flex items-baseline justify-between mb-2">
          <div>
            <span class="text-base font-black text-slate-950 font-mono">₹${p.price.toLocaleString('en-IN')}</span>
            <span class="text-[10px] text-slate-400 line-through font-mono ml-1">₹${p.originalPrice.toLocaleString('en-IN')}</span>
          </div>
          <span class="text-[10px] font-mono text-emerald-600 font-bold">In Stock</span>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <a href="product-detail.html?id=${p.id}" class="py-2 px-2 rounded-xl bg-white/80 hover:bg-white text-slate-800 text-[11px] font-mono font-bold text-center border border-white/90 shadow-sm transition-all">
            View Details
          </a>
          <a href="https://wa.me/${STORE_CONFIG.whatsappNumber}?text=Hi%20Classic%20Computers%2C%20I%20want%20to%20order%20${encodeURIComponent(p.shortName)}%20(Rs%20${p.price})" 
             target="_blank" 
             class="py-2 px-2 rounded-xl ios27-pill-whatsapp text-white text-[11px] font-mono font-bold text-center transition-all flex items-center justify-center gap-1 shadow-sm">
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  `;

  const set1 = PRODUCTS.map(renderCard).join('\n');
  const set2 = PRODUCTS.map(renderCard).join('\n');
  return set1 + '\n' + set2;
}

module.exports = {
  STORE_CONFIG,
  PRODUCTS,
  getSharedNav,
  getSharedFooter,
  generateTickerCardsHtml
};
