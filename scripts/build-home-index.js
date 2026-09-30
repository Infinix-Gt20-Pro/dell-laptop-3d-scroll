const fs = require('fs');
const path = require('path');
const { STORE_CONFIG, PRODUCTS, getSharedNav, getSharedFooter, generateTickerCardsHtml } = require('./store-shared-templates');

const homeHtml = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth antialiased">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>Classic Computers | Certified Refurbished Enterprise Laptops & Desktops | Etah & Pan-India</title>
  <meta name="description" content="Classic Computers - India's premier certified refurbished corporate laptop and commercial desktop hub in Etah, UP. 32-point tested, 6-12 months warranty, Pan-India courier.">
  <link rel="canonical" href="https://classiccomputers.in/">

  <!-- OpenGraph / Social Metadata -->
  <meta property="og:title" content="Classic Computers | Certified Refurbished Laptops & Desktops">
  <meta property="og:description" content="Corporate Dell Precision, ThinkPad & HP EliteBook at 70% off showroom retail. 32-point tested with 6-12 months warranty.">
  <meta property="og:type" content="website">
  <meta property="og:image" content="assets/images/logo.png">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="assets/images/logo.png">
  <link rel="apple-touch-icon" href="assets/images/logo.png">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- Tailwind CSS CDN -->
  <link rel="stylesheet" href="css/tailwind.min.css">

  <!-- Main Stylesheet -->
  <link rel="stylesheet" href="css/style.css">
  
  <style>
    .ios-liquid-glass {
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(28px) saturate(190%);
      -webkit-backdrop-filter: blur(28px) saturate(190%);
      border: 1px solid rgba(255, 255, 255, 0.85);
      box-shadow: 0 12px 36px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.95);
    }
    .ios-liquid-glass-dark {
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(32px) saturate(190%);
      -webkit-backdrop-filter: blur(32px) saturate(190%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 20px 50px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15);
    }
    .ios-pill-btn {
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .ios-pill-btn:hover {
      transform: translateY(-1.5px);
      box-shadow: 0 10px 25px -5px rgba(6, 182, 212, 0.35);
    }
    .brand-logo-img {
      mix-blend-mode: multiply;
    }
  </style>
</head>

<body class="bg-slate-50 text-slate-900 selection:bg-cyan-500 selection:text-white font-sans antialiased relative min-h-screen overflow-x-hidden">

  ${getSharedNav('home')}

  <!-- ===================================================
       1. HERO SECTION & MARKETING PARAGRAPH
       =================================================== -->
  <section class="relative pt-36 pb-20 sm:pt-40 md:pt-44 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-100/80 via-white to-slate-50 border-b border-slate-200/60">
    
    <!-- Background Technical Grid & Ambient Glows -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      <!-- Center Aligned Value Proposition -->
      <div class="max-w-4xl mx-auto text-center">
        
        <!-- Trust Tag Pill -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-200/80 shadow-sm text-cyan-800 text-xs font-mono font-bold mb-6">
          <span class="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
          <span>CERTIFIED CORPORATE REFURBISHED HUB // ETAH & PAN-INDIA</span>
        </div>

        <!-- Main Punchy Marketing Headline -->
        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15] mb-6">
          Original Corporate Laptops & Desktops at <span class="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">70% Off</span> Showroom Prices.
        </h1>

        <!-- Clear, High-Converting Marketing Explanation (What We Sell & Why Buy From Us) -->
        <div class="ios-liquid-glass p-6 sm:p-8 rounded-3xl max-w-3xl mx-auto text-left shadow-ios-card mb-8">
          <h2 class="text-xs font-mono font-bold uppercase tracking-widest text-cyan-700 mb-2">
            The Classic Computers Standard // Why Smart Buyers Choose Refurbished:
          </h2>
          <p class="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
            Don't waste ₹35,000 on fragile, brand-new consumer laptops equipped with sluggish dual-core Celeron processors and flimsy plastic bodies. At <strong>Classic Computers</strong>, we supply enterprise-grade <strong>Dell Precision workstations</strong>, <strong>Lenovo ThinkPads</strong>, <strong>HP EliteBooks</strong>, and <strong>commercial desktop towers</strong> sourced directly from corporate lease returns.
          </p>
          <p class="text-sm sm:text-base text-slate-700 leading-relaxed font-normal mt-3">
            Every single machine undergoes our strict <strong>32-point diagnostic inspection</strong>, receives brand new thermal paste, guarantees <strong>90%+ battery health</strong>, and is protected by our <strong>6–12 months comprehensive store replacement warranty</strong>. Backed by our verified physical showroom in <strong>Etah, Uttar Pradesh</strong> with insured, fast delivery straight to your doorstep across India.
          </p>
        </div>

        <!-- 4 Core Assurance Badges -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8 text-left">
          <div class="p-3.5 rounded-2xl bg-white/90 border border-slate-200 shadow-sm flex items-center gap-2.5">
            <span class="text-xl">🛡️</span>
            <div>
              <div class="text-xs font-bold text-slate-900">6–12M Warranty</div>
              <div class="text-[10px] text-slate-500 font-mono">Full Replacement</div>
            </div>
          </div>
          <div class="p-3.5 rounded-2xl bg-white/90 border border-slate-200 shadow-sm flex items-center gap-2.5">
            <span class="text-xl">⚡</span>
            <div>
              <div class="text-xs font-bold text-slate-900">32-Point Tested</div>
              <div class="text-[10px] text-slate-500 font-mono">100% Hardware QC</div>
            </div>
          </div>
          <div class="p-3.5 rounded-2xl bg-white/90 border border-slate-200 shadow-sm flex items-center gap-2.5">
            <span class="text-xl">🏬</span>
            <div>
              <div class="text-xs font-bold text-slate-900">Physical Store</div>
              <div class="text-[10px] text-slate-500 font-mono">Etah Showroom</div>
            </div>
          </div>
          <div class="p-3.5 rounded-2xl bg-white/90 border border-slate-200 shadow-sm flex items-center gap-2.5">
            <span class="text-xl">🚚</span>
            <div>
              <div class="text-xs font-bold text-slate-900">Pan-India Courier</div>
              <div class="text-[10px] text-slate-500 font-mono">Insured Dispatch</div>
            </div>
          </div>
        </div>

        <!-- Hero Action Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-4">
          <a href="products.html" class="ios-pill-btn px-7 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-sm shadow-xl flex items-center gap-2">
            <span>Explore All Products (8+ Models) →</span>
          </a>
          <a href="#store-location" class="ios-pill-btn px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-mono font-bold text-sm shadow-sm flex items-center gap-2">
            <span>🏬 Visit Physical Store</span>
          </a>
          <a href="https://wa.me/${STORE_CONFIG.whatsappNumber}?text=Hi%20Classic%20Computers%2C%20I%20am%20looking%20for%20a%20laptop%20or%20desktop." target="_blank" class="ios-pill-btn px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-sm shadow-lg flex items-center gap-2">
            <span>💬 Chat on WhatsApp</span>
          </a>
        </div>

      </div>

    </div>
  </section>

  <!-- ===================================================
       2. NEW SECTION: 60 FPS INFINITE MOVING PRODUCT LIST
          Ultra-Smooth Left-Moving Marquee Track (Zero Lag)
       =================================================== -->
  <section class="py-16 bg-slate-100/90 border-b border-slate-200 relative overflow-hidden" id="ticker-section">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 font-mono text-xs font-bold mb-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>VERIFIED IN-STOCK HARDWARE // READY FOR DISPATCH</span>
          </div>
          <h2 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Live Showcase // Moving Showroom
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-normal">
            Live collection of certified laptops and compact desktop workstations. <strong>Hover over any card to pause</strong>, inspect detailed technical specs, or order directly on WhatsApp.
          </p>
        </div>
        <a href="products.html" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-cyan-700 text-white text-xs font-mono font-bold transition-all shadow-md">
          <span>View Complete Catalog Page →</span>
        </a>
      </div>
    </div>

    <!-- The 60 FPS Infinite Moving Ticker Track -->
    <div class="ticker-wrapper-60fps">
      <div class="ticker-track-60fps">
        ${generateTickerCardsHtml()}
      </div>
    </div>

    <!-- Direct CTA Banner below Ticker -->
    <div class="max-w-4xl mx-auto text-center mt-8 px-4">
      <div class="inline-flex flex-wrap items-center justify-center gap-3 p-3 px-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-xs text-slate-700 font-mono">
        <span class="text-emerald-600 font-bold">✓ 8+ Certified Models In Stock</span>
        <span class="text-slate-300">•</span>
        <span>Looking for custom RAM or SSD upgrades?</span>
        <a href="https://wa.me/${STORE_CONFIG.whatsappNumber}?text=Hi%20Classic%20Computers%2C%20I%20need%20custom%20RAM%20or%20SSD%20upgrade%20quote." target="_blank" class="text-cyan-600 hover:text-cyan-700 font-bold underline">
          Request Custom Build (+91 94121 82786)
        </a>
      </div>
    </div>
  </section>

  <!-- ===================================================
       3. FLAGSHIP SHOWCASE: DELL PRECISION 5530 4K
          Upgraded with Full 8K High-Resolution Photos
       =================================================== -->
  <section class="py-20 bg-slate-950 text-white relative overflow-hidden" id="flagship-showcase">
    <!-- Ambient Lighting Glows -->
    <div class="absolute top-1/3 left-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-6xl mx-auto px-4 relative z-10 text-center">
      <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold mb-3">
        ⭐ FLAGSHIP WORKSTATION // 8K STUDIO GALLERY & 4K DISPLAY
      </span>
      <h2 class="text-3xl sm:text-5xl font-black text-white tracking-tight">
        Dell Precision 5530 4K Mobile Workstation
      </h2>
      <p class="text-sm text-slate-400 mt-2 max-w-2xl mx-auto">
        Original CNC aluminum body, carbon-fiber palm rest, 100% AdobeRGB 4K UHD touch screen, and dedicated NVIDIA Quadro GPU. Inspected with zero dents or dead pixels.
      </p>

      <!-- Interactive 8K Showcase Card -->
      <div id="hero-showcase-card" class="mt-10 max-w-4xl mx-auto bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl transition-all duration-300">
        
        <!-- 6 Angle Switcher Buttons (Full 8K Photo Set) -->
        <div class="flex flex-wrap items-center justify-center gap-2 mb-6">
          <button type="button" class="hero-view-btn active px-4 py-1.5 rounded-full text-xs font-mono font-bold border border-cyan-500 bg-cyan-500/20 text-cyan-300 transition-all" 
                  data-img="assets/images/dell-5530/dell_5530_cafe.jpg" 
                  data-desc="15.6-inch 4K UHD InfinityEdge Display In Action: 100% AdobeRGB color gamut & 400 nits brightness">
            4K Display On Table
          </button>
          <button type="button" class="hero-view-btn px-4 py-1.5 rounded-full text-xs font-mono font-bold border border-slate-700 bg-slate-800 text-slate-300 hover:border-cyan-500 transition-all" 
                  data-img="assets/images/dell-5530/dell_5530_keyboard.jpg" 
                  data-desc="Precision Backlit Keyboard & Glass Trackpad: Aerospace carbon-fiber composite palmrest with flawless tactile response">
            Keyboard & Trackpad
          </button>
          <button type="button" class="hero-view-btn px-4 py-1.5 rounded-full text-xs font-mono font-bold border border-slate-700 bg-slate-800 text-slate-300 hover:border-cyan-500 transition-all" 
                  data-img="assets/images/dell-5530/dell_5530_ports.jpg" 
                  data-desc="Ultra-Slim Wedge Profile: Thunderbolt 3, HDMI 2.0, dual USB 3.1 with PowerShare, and SD Card Reader">
            Ports & Thinness
          </button>
          <button type="button" class="hero-view-btn px-4 py-1.5 rounded-full text-xs font-mono font-bold border border-slate-700 bg-slate-800 text-slate-300 hover:border-cyan-500 transition-all" 
                  data-img="assets/images/dell-5530/dell_5530_dark.jpg" 
                  data-desc="Studio Dark Reflection: Precision CNC milled solid aluminum lid with polished chrome Dell emblem">
            Studio Dark View
          </button>
          <button type="button" class="hero-view-btn px-4 py-1.5 rounded-full text-xs font-mono font-bold border border-slate-700 bg-slate-800 text-slate-300 hover:border-cyan-500 transition-all" 
                  data-img="assets/images/dell-5530/dell_5530_white.jpg" 
                  data-desc="Brushed Platinum Aluminum Lid: Pristine Grade A+ certified condition with zero dent guarantee">
            Studio White View
          </button>
          <button type="button" class="hero-view-btn px-4 py-1.5 rounded-full text-xs font-mono font-bold border border-slate-700 bg-slate-800 text-slate-300 hover:border-cyan-500 transition-all" 
                  data-img="assets/images/dell-5530/dell_5530_coffee.jpg" 
                  data-desc="Executive Workplace View: Slim 1.78kg lightweight portable workstation power">
            Workplace View
          </button>
        </div>

        <!-- High-Res Dynamic Viewport -->
        <div class="relative w-full h-80 sm:h-96 rounded-2xl bg-black/60 overflow-hidden flex items-center justify-center border border-white/10 group">
          <img id="hero-showcase-img" 
               src="assets/images/dell-5530/dell_5530_cafe.jpg" 
               alt="Dell Precision 5530 4K Workstation" 
               class="max-h-full max-w-full object-contain transition-all duration-300 group-hover:scale-105">
          <span class="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/70 text-cyan-400 font-mono text-[10px] border border-cyan-500/30">
            8K Resolution Master
          </span>
        </div>

        <p id="hero-view-caption" class="text-xs font-mono text-cyan-400 text-center mt-3">
          15.6-inch 4K UHD InfinityEdge Display In Action: 100% AdobeRGB color gamut & 400 nits brightness
        </p>

        <!-- Specs Strip & Buy CTA -->
        <div class="mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div class="text-left">
            <span class="text-xs text-slate-400 block font-mono">Special Lab Price:</span>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-black text-white font-mono">₹34,999</span>
              <span class="text-sm text-slate-500 line-through font-mono">₹1,85,000</span>
              <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">Save 81%</span>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <a href="product-detail.html?id=dell-5530-flagship" class="px-5 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold flex items-center gap-2 border border-slate-600 transition-all">
              <span>View Full Tech Specs & 3D →</span>
            </a>
            <a href="https://wa.me/${STORE_CONFIG.whatsappNumber}?text=Hi%20Classic%20Computers%2C%20I%20am%20interested%20in%20Dell%20Precision%205530%204K%20Workstation%20(Rs%2034%2C999)" target="_blank" class="px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-lg transition-all">
              <span>💬 Buy on WhatsApp (+91 94121 82786)</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  </section>

  <!-- ===================================================
       4. INTERACTIVE THERMAL POS RECEIPT GENERATOR
          Viral Tear & Reprint Instant Order Calculator
       =================================================== -->
  <section class="py-16 bg-slate-900 text-white relative border-b border-slate-800" id="receipt-calculator-section">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-cyan-400 font-mono text-xs font-bold mb-3 border border-slate-700">
        🧾 INTERACTIVE THERMAL POS RECEIPT // LIVE CONFIGURATOR
      </span>
      <h2 class="text-2xl sm:text-4xl font-black text-white tracking-tight">
        Instant Order & Thermal Paper Receipt
      </h2>
      <p class="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl mx-auto">
        Customize your Dell Precision 5530 configuration below. The thermal receipt prints your verified order slip with real-time tax calculation and WhatsApp instant dispatch code.
      </p>

      <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-left items-start">
        
        <!-- Left: Configuration Selector Form -->
        <div class="p-6 rounded-2xl bg-slate-800/80 border border-slate-700">
          <h3 class="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider mb-4">
            Select Workstation Specs
          </h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-mono text-slate-400 mb-1">RAM Memory:</label>
              <select id="receipt-ram-select" class="w-full bg-slate-900 text-white text-xs font-mono p-2.5 rounded-xl border border-slate-700 focus:border-cyan-500 outline-none">
                <option value="16" selected>16GB DDR4 High-Speed RAM (Standard - Included)</option>
                <option value="32">32GB DDR4 High-Speed RAM (+₹3,500)</option>
                <option value="64">64GB DDR4 Max Dual-Channel (+₹7,500)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-mono text-slate-400 mb-1">NVMe Storage SSD:</label>
              <select id="receipt-ssd-select" class="w-full bg-slate-900 text-white text-xs font-mono p-2.5 rounded-xl border border-slate-700 focus:border-cyan-500 outline-none">
                <option value="512" selected>512GB Fast NVMe M.2 SSD (Standard - Included)</option>
                <option value="1024">1TB (1024GB) Ultra NVMe SSD (+₹3,000)</option>
                <option value="2048">2TB (2048GB) Enterprise NVMe SSD (+₹6,500)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-mono text-slate-400 mb-1">Warranty Plan:</label>
              <select id="receipt-warranty-select" class="w-full bg-slate-900 text-white text-xs font-mono p-2.5 rounded-xl border border-slate-700 focus:border-cyan-500 outline-none">
                <option value="6" selected>6 Months Comprehensive Store Replacement (Free)</option>
                <option value="12">12 Months Extended Protection Plan (+₹2,499)</option>
              </select>
            </div>

            <div class="pt-3">
              <button id="reprint-receipt-btn" type="button" class="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2">
                <span>🖨️ Update & Reprint Receipt Slip</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Animated Thermal POS Receipt Slip -->
        <div class="relative flex justify-center">
          <div id="receipt-paper" class="w-72 bg-amber-50 text-slate-900 p-5 rounded-sm shadow-2xl font-mono text-xs border border-amber-200 transition-all duration-300">
            <div class="text-center pb-3 border-b border-dashed border-slate-400">
              <div class="w-8 h-8 mx-auto mb-1 rounded bg-white p-0.5 overflow-hidden border border-slate-300">
                <img src="assets/images/logo.png" alt="Logo" class="w-full h-full object-cover brand-logo-img">
              </div>
              <div class="font-black text-sm tracking-wider">CLASSIC COMPUTERS</div>
              <div class="text-[9px] text-slate-600">NEAR RAILWAY RD / GT RD, ETAH (UP)</div>
              <div class="text-[9px] text-slate-600">GSTIN: ${STORE_CONFIG.gstNumber}</div>
              <div class="text-[9px] text-slate-600">TEL: ${STORE_CONFIG.supportPhone}</div>
            </div>

            <div class="py-2 border-b border-dashed border-slate-400 text-[10px] flex justify-between">
              <span>DATE: 29-SEP-2026</span>
              <span id="receipt-order-no">CC-ORD-5530-OK</span>
            </div>

            <div class="py-3 border-b border-dashed border-slate-400 space-y-1.5 text-[11px]">
              <div class="font-bold">Dell Precision 5530 4K UHD</div>
              <div class="text-[10px] text-slate-600">Core i7-8850H / Quadro P1000</div>
              <div class="flex justify-between text-[10px]">
                <span id="receipt-ram-label">• 16GB DDR4 RAM</span>
                <span>INCL</span>
              </div>
              <div class="flex justify-between text-[10px]">
                <span id="receipt-ssd-label">• 512GB NVMe SSD</span>
                <span>INCL</span>
              </div>
              <div class="flex justify-between text-[10px]">
                <span id="receipt-warranty-label">• 6M Store Warranty</span>
                <span>FREE</span>
              </div>
            </div>

            <div class="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
              <div class="flex justify-between text-slate-600">
                <span>Original Showroom MRP:</span>
                <span class="line-through">₹1,85,000</span>
              </div>
              <div class="flex justify-between text-emerald-700 font-bold">
                <span>Refurbished Savings:</span>
                <span>- ₹1,50,001 (81%)</span>
              </div>
              <div class="flex justify-between font-black text-sm pt-1 border-t border-slate-300">
                <span>NET PAYABLE:</span>
                <span id="receipt-total-price" class="text-emerald-700">₹34,999</span>
              </div>
            </div>

            <div class="pt-3 text-center text-[9px] text-slate-500">
              <div>*** 100% TESTED & VERIFIED ***</div>
              <div>7 DAYS REPLACEMENT GUARANTEE</div>
              <div class="mt-2 pt-2 border-t border-slate-300">
                <a id="receipt-wa-link" href="https://wa.me/${STORE_CONFIG.whatsappNumber}?text=Hi%20Classic%20Computers%2C%20I%20want%20to%20order%20Dell%20Precision%205530%20(16GB%20%2F%20512GB)%20for%20Rs%2034%2C999." target="_blank" class="block w-full py-2 rounded bg-emerald-700 text-white font-bold text-center text-[10px]">
                  Order via WhatsApp Slip
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </section>

  <!-- ===================================================
       5. PHYSICAL STORE & TRUST PROOF SECTION
          Authentic Proof from Official Instagram Reel Tour
       =================================================== -->
  <section class="py-20 bg-white border-b border-slate-200" id="store-location">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Title & Proof Summary -->
      <div class="max-w-3xl mx-auto text-center mb-12">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold mb-3">
          ✓ REAL BRICK & MORTAR STORE // ZERO FAKE CLAIMS
        </span>
        <h2 class="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Visit Our Physical Showroom in Etah
        </h2>
        <p class="text-sm sm:text-base text-slate-600 mt-2 font-normal">
          We are not an anonymous online drop-shipper. <strong>Classic Computers</strong> is a registered, physical IT workstation showroom with ready stocks of Dell, ThinkPad, HP, and Apple laptops. Come visit us or order with Pan-India insured delivery.
        </p>
      </div>

      <!-- Real Store Photo Gallery (Extracted from User's Reel) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        <!-- Card 1: Official Outdoor Signboard with Phone & GST -->
        <div class="ios-liquid-glass rounded-2xl overflow-hidden border border-slate-200 shadow-ios-card group">
          <div class="relative h-64 bg-slate-900 overflow-hidden">
            <img src="assets/images/shop/shop_storefront_1.png" alt="Classic Computers Storefront Signboard" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            <div class="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 text-white text-[10px] font-mono">
              🏬 Official Storefront Signboard
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-sm text-slate-900">Verified Outdoor Signboard</h3>
            <p class="text-xs text-slate-600 mt-1 leading-relaxed">
              Clearly verifying our store name, helpline numbers (<strong>+91 94121 82786</strong>, <strong>+91 84758 82785</strong>), and government GSTIN: <strong>${STORE_CONFIG.gstNumber}</strong>.
            </p>
          </div>
        </div>

        <!-- Card 2: In-Store Inventory Racks -->
        <div class="ios-liquid-glass rounded-2xl overflow-hidden border border-slate-200 shadow-ios-card group">
          <div class="relative h-64 bg-slate-900 overflow-hidden">
            <img src="assets/images/shop/shop_storefront_3.png" alt="In-Store Inventory Racks" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            <div class="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 text-white text-[10px] font-mono">
              💻 In-Stock Display Racks
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-sm text-slate-900">Multi-Tier Laptop Showcase</h3>
            <p class="text-xs text-slate-600 mt-1 leading-relaxed">
              Hundreds of ready laptops on open display. Customers can power on, test keyboards, inspect battery health, and test screens before purchasing.
            </p>
          </div>
        </div>

        <!-- Card 3: Curated Display & Instagram Reel Tour -->
        <div class="ios-liquid-glass rounded-2xl overflow-hidden border border-slate-200 shadow-ios-card group">
          <div class="relative h-64 bg-slate-900 overflow-hidden">
            <img src="assets/images/shop/shop_storefront_2.png" alt="Instagram Video Tour Snapshot" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            <a href="${STORE_CONFIG.reelUrl}" target="_blank" class="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-all">
              <div class="w-14 h-14 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </a>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-sm text-slate-900">Instagram Store Tour Video</h3>
            <p class="text-xs text-slate-600 mt-1 leading-relaxed">
              Watch our official video tour on Instagram (<a href="${STORE_CONFIG.instagramUrl}" target="_blank" class="text-pink-600 font-bold hover:underline">${STORE_CONFIG.instagramHandle}</a>) showing daily customer pickups and unboxings.
            </p>
          </div>
        </div>

      </div>

      <!-- Store Address & Hours Info Card -->
      <div class="max-w-4xl mx-auto rounded-3xl bg-slate-900 text-white p-6 sm:p-10 shadow-2xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span class="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold block mb-2">Showroom Location</span>
            <h3 class="text-2xl font-black text-white tracking-tight">Classic Computers</h3>
            <p class="text-xs text-slate-300 mt-2 leading-relaxed">
              Near Railway Road / GT Road<br>
              Etah, Uttar Pradesh — 207001, India<br>
              <span class="text-cyan-400 font-mono text-[11px]">Official GSTIN: ${STORE_CONFIG.gstNumber}</span>
            </p>

            <div class="mt-4 pt-4 border-t border-slate-800 space-y-1.5 text-xs font-mono text-slate-300">
              <div>⏰ <strong>Mon–Sat:</strong> 10:00 AM – 8:30 PM</div>
              <div>⏰ <strong>Sunday:</strong> 11:00 AM – 5:00 PM</div>
              <div>📞 <strong>Helpline:</strong> <a href="tel:${STORE_CONFIG.supportPhone.replace(/\s+/g, '')}" class="text-cyan-400 font-bold hover:underline">${STORE_CONFIG.supportPhone}</a></div>
              <div>📱 <strong>Secondary:</strong> ${STORE_CONFIG.secondaryPhone}</div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <a href="https://wa.me/${STORE_CONFIG.whatsappNumber}?text=Hi%20Classic%20Computers%2C%20I%20am%20planning%20to%20visit%20your%20Etah%20showroom." target="_blank" class="py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold text-center transition-all shadow-lg flex items-center justify-center gap-2">
              <span>💬 Contact Store Manager on WhatsApp</span>
            </a>
            <a href="tel:${STORE_CONFIG.supportPhone.replace(/\s+/g, '')}" class="py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold text-center border border-slate-700 transition-all flex items-center justify-center gap-2">
              <span>📞 Call Helpline (${STORE_CONFIG.supportPhone})</span>
            </a>
            <a href="${STORE_CONFIG.reelUrl}" target="_blank" class="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-mono font-bold text-center transition-all shadow-md flex items-center justify-center gap-2">
              <span>🎬 Watch Official Instagram Tour Reel</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- ===================================================
       6. WHY REFURBISHED MARKETING SECTION
          Corporate Enterprise vs Cheap Retail Comparison
       =================================================== -->
  <section class="py-20 bg-slate-50 border-b border-slate-200" id="why-refurbished">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="max-w-3xl mx-auto text-center mb-12">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-mono font-bold mb-3">
          📊 SMART BUYER'S GUIDE
        </span>
        <h2 class="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Why Certified Refurbished Beats New
        </h2>
        <p class="text-sm text-slate-600 mt-2 font-normal">
          Compare what ₹30,000 to ₹35,000 buys you in a regular electronic showroom vs what you get from Classic Computers.
        </p>
      </div>

      <!-- Side-by-Side Comparison Table -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Column 1: Cheap New Retail Laptop -->
        <div class="p-6 sm:p-8 rounded-3xl bg-white border border-rose-200 shadow-sm relative">
          <span class="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-mono font-bold inline-block mb-3">
            ❌ Brand New Cheap Retail Laptop (₹30k - ₹35k)
          </span>
          <h3 class="text-xl font-bold text-slate-900 mb-4">Consumer Grade Compromises</h3>
          <ul class="space-y-3 text-xs sm:text-sm text-slate-600">
            <li class="flex items-start gap-2">
              <span class="text-rose-500 font-bold">✕</span>
              <span><strong>Processor:</strong> Weak Intel Celeron or Pentium Dual-Core; freezes with 5 browser tabs open.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-rose-500 font-bold">✕</span>
              <span><strong>Build Quality:</strong> 100% cheap ABS plastic body; screen hinges crack after 12-18 months.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-rose-500 font-bold">✕</span>
              <span><strong>Display:</strong> Washed-out 720p or low-grade 45% NTSC screen causing eye fatigue.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-rose-500 font-bold">✕</span>
              <span><strong>Graphics:</strong> Basic integrated graphics; completely incapable of 4K video editing or CAD.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-rose-500 font-bold">✕</span>
              <span><strong>Resale Value:</strong> Depreciates by 75% within the first year.</span>
            </li>
          </ul>
        </div>

        <!-- Column 2: Classic Computers Certified Corporate -->
        <div class="p-6 sm:p-8 rounded-3xl bg-white border-2 border-emerald-500 shadow-ios-card relative">
          <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold inline-block mb-3">
            ✓ Classic Computers Certified (₹22k - ₹35k)
          </span>
          <h3 class="text-xl font-bold text-slate-900 mb-4">Military-Grade Corporate Engineering</h3>
          <ul class="space-y-3 text-xs sm:text-sm text-slate-700">
            <li class="flex items-start gap-2">
              <span class="text-emerald-600 font-bold">✓</span>
              <span><strong>Processor:</strong> High-Performance Intel Core i7 6-Core / 8-Core with Turbo Boost up to 4.6 GHz.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-emerald-600 font-bold">✓</span>
              <span><strong>Build Quality:</strong> Aircraft-Grade CNC Machined Aluminum & Carbon-Fiber composite chassis.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-emerald-600 font-bold">✓</span>
              <span><strong>Display:</strong> 4K UHD UltraSharp or Full HD IPS panels with 100% AdobeRGB / sRGB color accuracy.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-emerald-600 font-bold">✓</span>
              <span><strong>Graphics:</strong> Dedicated NVIDIA Quadro graphics handles DaVinci, Premiere Pro, and AutoCAD.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-emerald-600 font-bold">✓</span>
              <span><strong>Store Guarantee:</strong> 32-point inspection, 90%+ battery health, and 6–12 months replacement warranty.</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  </section>

  <!-- ===================================================
       7. VERIFIED CUSTOMER REVIEWS
       =================================================== -->
  <section class="py-20 bg-white border-b border-slate-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto text-center mb-12">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-mono font-bold mb-3">
          ⭐ 4.9 / 5.0 VERIFIED RATING
        </span>
        <h2 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          What Our Real Buyers Say
        </h2>
        <p class="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
          Real feedback from engineers, video editors, chartered accountants, and students across India.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200">
          <div class="text-amber-400 text-sm mb-2">★★★★★</div>
          <p class="text-xs text-slate-700 leading-relaxed italic mb-4">
            "Ordered the Dell Precision 5530 4K for my video editing studio in Mumbai. The 4K screen is stunning with 100% AdobeRGB accuracy. Battery health came at 92%. Saved over 1.4 Lakhs!"
          </p>
          <div class="text-xs font-bold text-slate-900">Aditya Verma</div>
          <div class="text-[10px] text-slate-500 font-mono">Mumbai • Video Editor</div>
        </div>

        <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200">
          <div class="text-amber-400 text-sm mb-2">★★★★★</div>
          <p class="text-xs text-slate-700 leading-relaxed italic mb-4">
            "Visited the Etah showroom directly after watching their Instagram tour reel. Bought 3 ThinkPad T480 units for our accounting team. Solid keyboards, fast SSDs, and genuine Windows 11 Pro."
          </p>
          <div class="text-xs font-bold text-slate-900">Rajesh Sharma, CA</div>
          <div class="text-[10px] text-slate-500 font-mono">Agra • Chartered Accountant</div>
        </div>

        <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200">
          <div class="text-amber-400 text-sm mb-2">★★★★★</div>
          <p class="text-xs text-slate-700 leading-relaxed italic mb-4">
            "Got the HP EliteDesk 800 Tower for my stock trading setup with 3 monitors. Super quiet, heavy-gauge steel casing, and boots in 6 seconds. Fast courier delivery with safe wooden packing."
          </p>
          <div class="text-xs font-bold text-slate-900">Kavita Malhotra</div>
          <div class="text-[10px] text-slate-500 font-mono">Delhi NCR • Stock Market Trader</div>
        </div>
      </div>
    </div>
  </section>

  ${getSharedFooter()}

  <!-- Interactive JavaScript for Showcase & Receipt -->
  <script src="js/products-data.js"></script>
  <script>
    // Flagship 8K Angle Switcher Logic
    const showcaseImg = document.getElementById('hero-showcase-img');
    const showcaseCaption = document.getElementById('hero-view-caption');
    const angleBtns = document.querySelectorAll('.hero-view-btn');

    angleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        angleBtns.forEach(b => {
          b.classList.remove('active', 'border-cyan-500', 'bg-cyan-500/20', 'text-cyan-300');
          b.classList.add('border-slate-700', 'bg-slate-800', 'text-slate-300');
        });
        btn.classList.add('active', 'border-cyan-500', 'bg-cyan-500/20', 'text-cyan-300');
        btn.classList.remove('border-slate-700', 'bg-slate-800', 'text-slate-300');

        const newImg = btn.getAttribute('data-img');
        const newDesc = btn.getAttribute('data-desc');

        if (showcaseImg && newImg) {
          showcaseImg.style.opacity = '0.4';
          setTimeout(() => {
            showcaseImg.src = newImg;
            showcaseImg.style.opacity = '1';
          }, 150);
        }
        if (showcaseCaption && newDesc) {
          showcaseCaption.textContent = newDesc;
        }
      });
    });

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        mobileDrawer.classList.toggle('hidden');
      });
    }

    // Thermal Receipt Calculator Logic
    const ramSelect = document.getElementById('receipt-ram-select');
    const ssdSelect = document.getElementById('receipt-ssd-select');
    const warrantySelect = document.getElementById('receipt-warranty-select');
    const reprintBtn = document.getElementById('reprint-receipt-btn');
    const receiptPaper = document.getElementById('receipt-paper');

    function calculateReceipt() {
      let basePrice = 34999;
      let ramCost = 0;
      let ssdCost = 0;
      let warrantyCost = 0;

      const ramVal = ramSelect ? ramSelect.value : '16';
      const ssdVal = ssdSelect ? ssdSelect.value : '512';
      const warVal = warrantySelect ? warrantySelect.value : '6';

      if (ramVal === '32') ramCost = 3500;
      if (ramVal === '64') ramCost = 7500;

      if (ssdVal === '1024') ssdCost = 3000;
      if (ssdVal === '2048') ssdCost = 6500;

      if (warVal === '12') warrantyCost = 2499;

      const total = basePrice + ramCost + ssdCost + warrantyCost;

      // Update labels on slip
      const ramLabel = document.getElementById('receipt-ram-label');
      const ssdLabel = document.getElementById('receipt-ssd-label');
      const warLabel = document.getElementById('receipt-warranty-label');
      const totalElem = document.getElementById('receipt-total-price');
      const waLink = document.getElementById('receipt-wa-link');

      if (ramLabel) ramLabel.textContent = '• ' + ramVal + 'GB DDR4 RAM';
      if (ssdLabel) ssdLabel.textContent = '• ' + (ssdVal >= 1024 ? (ssdVal/1024) + 'TB' : ssdVal + 'GB') + ' NVMe SSD';
      if (warLabel) warLabel.textContent = '• ' + warVal + 'M ' + (warVal === '12' ? 'Extended Protection' : 'Store Replacement');
      if (totalElem) totalElem.textContent = '₹' + total.toLocaleString('en-IN');

      if (waLink) {
        const text = 'Hi Classic Computers, I want to order Dell Precision 5530 with ' + ramVal + 'GB RAM, ' + (ssdVal >= 1024 ? (ssdVal/1024) + 'TB' : ssdVal + 'GB') + ' SSD, and ' + warVal + 'M warranty for Rs ' + total.toLocaleString('en-IN') + '. Please confirm delivery details.';
        waLink.href = 'https://wa.me/${STORE_CONFIG.whatsappNumber}?text=' + encodeURIComponent(text);
      }

      if (receiptPaper) {
        receiptPaper.style.transform = 'translateY(-10px)';
        receiptPaper.style.opacity = '0.7';
        setTimeout(() => {
          receiptPaper.style.transform = 'translateY(0)';
          receiptPaper.style.opacity = '1';
        }, 150);
      }
    }

    if (ramSelect) ramSelect.addEventListener('change', calculateReceipt);
    if (ssdSelect) ssdSelect.addEventListener('change', calculateReceipt);
    if (warrantySelect) warrantySelect.addEventListener('change', calculateReceipt);
    if (reprintBtn) reprintBtn.addEventListener('click', calculateReceipt);
  </script>
</body>
</html>`;

fs.writeFileSync(path.resolve('index.html'), homeHtml, 'utf8');
console.log('Successfully generated index.html (Home Page)');
