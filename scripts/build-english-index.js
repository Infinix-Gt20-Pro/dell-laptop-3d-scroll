const fs = require('fs');
const path = require('path');

const targetHtml = path.resolve('index.html');

const htmlContent = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth antialiased">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>Classic Computers | Certified Refurbished Laptops & Desktops | Etah & Pan-India</title>
  <meta name="description" content="Classic Computers - India's trusted store for certified refurbished corporate enterprise laptops and commercial desktop PCs. 30-point lab inspected, 6-12 months warranty, fast Pan-India delivery.">
  <link rel="canonical" href="https://classiccomputers.in/">

  <!-- OpenGraph / Social Metadata -->
  <meta property="og:title" content="Classic Computers | Certified Refurbished Laptops & Desktops">
  <meta property="og:description" content="Top-tier corporate Dell, HP, Lenovo laptops & desktops at 70% off showroom prices. 30-point lab tested with 6-12 months warranty.">
  <meta property="og:type" content="website">
  <meta property="og:image" content="assets/images/logo.png">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="assets/images/logo.png">
  <link rel="apple-touch-icon" href="assets/images/logo.png">

  <!-- Google Fonts: Inter & JetBrains Mono for High-Precision Tech Elegance -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@1,6..72,400;1,6..72,600&display=swap" rel="stylesheet">

  <!-- Tailwind CSS CDN -->
  <link rel="stylesheet" href="css/tailwind.min.css">

  <!-- Main Stylesheet -->
  <link rel="stylesheet" href="css/style.css">
  
  <style>
    /* iOS Liquid Glass Specific Enhancements */
    .ios-liquid-glass {
      background: rgba(255, 255, 255, 0.72);
      backdrop-filter: blur(28px) saturate(190%);
      -webkit-backdrop-filter: blur(28px) saturate(190%);
      border: 1px solid rgba(255, 255, 255, 0.85);
      box-shadow: 0 12px 36px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.95);
    }
    .ios-liquid-glass-dark {
      background: rgba(15, 23, 42, 0.82);
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

  <!-- Desktop Custom Fluid Cursor -->
  <div id="custom-cursor-dot"></div>
  <div id="custom-cursor-ring"></div>

  <!-- Ambient Spotlight Sheen -->
  <div id="cursor-spotlight"></div>

  <!-- ===================================================
       1. TOP TRUST STRIP (Pan-India Courier • Warranty • WhatsApp)
       =================================================== -->
  <aside aria-label="Store Guarantees Banner" class="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-white/10 font-mono tracking-wide">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs">
      <div class="flex items-center gap-2">
        <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="text-white font-bold tracking-wider">CLASSIC COMPUTERS:</span>
        <span class="text-slate-300">Grade A+ Certified Refurbished Laptops & Desktops • 6–12 Months Warranty</span>
      </div>
      <div class="flex items-center gap-4 text-slate-400">
        <span class="hidden md:inline-flex items-center gap-1.5">
          <span>🚚 Free Insured Pan-India Express Courier</span>
        </span>
        <span class="hidden lg:inline-flex items-center gap-1.5">
          <span>🔄 7-Day Replacement Guarantee</span>
        </span>
        <a href="https://wa.me/919412182786?text=Hello%20Classic%20Computers%2C%20I%20want%20to%20inquire%20about%20refurbished%20laptops" target="_blank" class="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1">
          <span>Direct Helpline: +91 94121 82786</span>
        </a>
      </div>
    </div>
  </aside>

  <!-- ===================================================
       2. PRIMARY LIQUID GLASS NAVIGATION BAR
       =================================================== -->
  <header class="sticky top-0 z-40 w-full transition-all duration-300 ios-liquid-glass border-b border-slate-200/80">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
      
      <!-- Brand Logo & Monogram -->
      <a href="index.html" class="flex items-center gap-2.5 sm:gap-3 group focus:outline-none">
        <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white p-1 border border-slate-200/90 shadow-sm flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
          <img src="assets/images/logo.png" alt="Classic Computers Monogram Logo" class="w-full h-full object-contain brand-logo-img">
        </div>
        <div class="flex flex-col">
          <span class="text-sm sm:text-lg font-black tracking-tight text-slate-900 leading-none group-hover:text-cyan-600 transition-colors">
            Classic Computers
          </span>
          <span class="text-[9px] sm:text-[10px] font-mono font-bold text-cyan-700 uppercase tracking-widest mt-0.5 sm:mt-1">
            Certified Refurbished Hub
          </span>
        </div>
      </a>

      <!-- Desktop Nav Links -->
      <nav class="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-mono font-semibold text-slate-600" aria-label="Main Navigation">
        <a href="#about-store" class="px-3 py-2 rounded-full hover:text-slate-900 hover:bg-slate-100/80 transition-all">About Our Stock</a>
        <a href="#device-finder" class="px-3 py-2 rounded-full hover:text-slate-900 hover:bg-slate-100/80 transition-all">Device Finder</a>
        <a href="#products" class="px-3 py-2 rounded-full text-cyan-700 bg-cyan-50/80 border border-cyan-200/60 font-bold transition-all">Products</a>
        <a href="#store-location" class="px-3 py-2 rounded-full hover:text-slate-900 hover:bg-slate-100/80 transition-all">Store Location</a>
        <a href="#configurator" class="px-3 py-2 rounded-full hover:text-slate-900 hover:bg-slate-100/80 transition-all">Custom Configurator</a>
      </nav>

      <!-- Right Action Docks -->
      <div class="flex items-center gap-1.5 sm:gap-3">
        
        <!-- Instagram Link Button (Desktop & Tablet) -->
        <a href="https://www.instagram.com/classic.computer.empire/" target="_blank" rel="noopener noreferrer" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-pink-200 bg-pink-50/70 hover:bg-pink-100/80 text-pink-700 text-xs font-mono font-bold transition-all shadow-2xs">
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <span>@classic.computer.empire</span>
        </a>

        <!-- WhatsApp Direct Chat CTA -->
        <a href="https://wa.me/919412182786?text=Hi%20Classic%20Computers%2C%20I%20need%20a%20laptop%20or%20desktop%20for%20my%20work.%20Please%20guide%20me." target="_blank" class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-emerald-300 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-mono font-bold transition-all shadow-xs">
          <span>💬 WhatsApp Order</span>
        </a>

        <!-- Mobile WhatsApp Quick Icon -->
        <a href="https://wa.me/919412182786?text=Hi%20Classic%20Computers" target="_blank" class="sm:hidden p-2 rounded-full bg-emerald-500 text-white shadow-xs">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
          </svg>
        </a>

        <!-- Shopping Bag Trigger -->
        <button type="button" data-action="open-cart" aria-label="Open Shopping Bag" class="relative px-3 sm:px-3.5 py-2 rounded-full apple-action-btn text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
          <span>Bag</span>
          <span class="cart-badge-count px-1.5 py-0.2 rounded-full bg-cyan-500 text-white text-[10px]">0</span>
        </button>

        <!-- Mobile Menu Trigger -->
        <button id="mobile-menu-toggle-btn" aria-label="Toggle Navigation Menu" class="md:hidden p-2 rounded-xl border border-slate-200 bg-white/90 text-slate-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>

    </div>
  </header>

  <!-- Mobile Drawer -->
  <div id="mobile-nav-drawer" class="hidden fixed inset-0 z-50 bg-white/98 backdrop-blur-2xl p-6 overflow-y-auto">
    <div class="flex items-center justify-between pb-6 border-b border-slate-200">
      <div class="flex items-center gap-3">
        <img src="assets/images/logo.png" alt="Classic Computers" class="w-10 h-10 object-contain brand-logo-img">
        <div>
          <div class="font-black text-slate-900 text-base">Classic Computers</div>
          <div class="text-[10px] font-mono text-cyan-700">Certified Refurbished Hub</div>
        </div>
      </div>
      <button id="mobile-menu-close-btn" class="p-2 rounded-full bg-slate-100 text-slate-600">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <div class="flex flex-col gap-4 py-8 text-sm font-mono font-bold text-slate-800">
      <a href="#about-store" class="mobile-nav-link p-3 rounded-xl hover:bg-slate-100">About Our Inventory</a>
      <a href="#device-finder" class="mobile-nav-link p-3 rounded-xl hover:bg-slate-100">Smart Device Finder</a>
      <a href="#products" class="mobile-nav-link p-3 rounded-xl bg-cyan-50 text-cyan-800 font-black">Products Catalog</a>
      <a href="#store-location" class="mobile-nav-link p-3 rounded-xl hover:bg-slate-100">Store Location & Tour</a>
      <a href="#configurator" class="mobile-nav-link p-3 rounded-xl hover:bg-slate-100">Custom Workstation Configurator</a>
      <a href="https://www.instagram.com/classic.computer.empire/" target="_blank" class="p-3 rounded-xl bg-pink-50 text-pink-700 flex items-center justify-between">
        <span>Instagram: @classic.computer.empire</span>
        <span>↗</span>
      </a>
      <a href="https://wa.me/919412182786?text=Hi%20Classic%20Computers" target="_blank" class="p-3.5 rounded-xl bg-emerald-600 text-white text-center font-black">
        Chat on WhatsApp: +91 94121 82786
      </a>
    </div>
  </div>

  <!-- ===================================================
       3. HERO SECTION: "WHAT WE SELL" (Pure English Marketing Copy)
       =================================================== -->
  <section id="about-store" class="pt-10 sm:pt-16 pb-12 sm:pb-16 max-w-6xl mx-auto px-4 relative z-10 text-center">
    
    <!-- Top Pill Badge -->
    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ios-liquid-glass text-slate-800 text-xs font-mono font-bold mb-6 shadow-sm">
      <span class="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
      <span class="tracking-wider uppercase">CERTIFIED REFURBISHED TECHNOLOGY // CLASSIC COMPUTERS</span>
    </div>

    <!-- Main Apple Keynote Headline -->
    <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08] max-w-4xl mx-auto">
      Certified Refurbished Laptops & Desktops.
      <span class="block font-serif italic font-normal text-cyan-700 mt-2">
        Enterprise Power. Up to 70% Less.
      </span>
    </h1>

    <!-- Transparent, High-Converting What We Sell Copy -->
    <div class="mt-6 sm:mt-8 max-w-3xl mx-auto text-slate-600 text-sm sm:text-base leading-relaxed">
      <p class="font-medium text-slate-800">
        <strong class="text-cyan-800 font-bold">What do we sell?</strong> At Classic Computers, we supply certified corporate enterprise laptops and commercial desktop computers from world leaders including Dell, HP, Lenovo, and Apple. These systems are original corporate-lease units deployed by Fortune 500 offices and multi-national IT enterprises.
      </p>
      <p class="mt-3 text-slate-600 text-xs sm:text-sm">
        Original showroom retail prices for these professional workstations range from ₹1,00,000 to ₹2,50,000+. At Classic Computers, you get identical military-grade aluminum durability, 4K displays, and high-performance processing starting from just <strong>₹18,999 to ₹34,999</strong> — completely lab-audited with <strong>6 to 12 Months Warranty</strong>!
      </p>
    </div>

    <!-- 4 Direct Trust Pillars (iOS Liquid Glass Cards) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 text-left">
      
      <div class="ios-liquid-glass p-5 rounded-2xl shadow-ios-glass transition-all hover:scale-102">
        <div class="w-10 h-10 rounded-xl bg-cyan-100/80 text-cyan-700 flex items-center justify-center font-bold text-lg mb-3">
          🔍
        </div>
        <h2 class="text-sm font-black text-slate-900 font-mono">30-Point Lab Audit</h2>
        <p class="text-xs text-slate-600 mt-1.5 leading-relaxed">
          Screen pixel check, 85%+ verified battery health, thermal dissipation, motherboard circuits, and ports are 100% stress tested.
        </p>
      </div>

      <div class="ios-liquid-glass p-5 rounded-2xl shadow-ios-glass transition-all hover:scale-102">
        <div class="w-10 h-10 rounded-xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center font-bold text-lg mb-3">
          🛡️
        </div>
        <h2 class="text-sm font-black text-slate-900 font-mono">6–12 Months Warranty</h2>
        <p class="text-xs text-slate-600 mt-1.5 leading-relaxed">
          Comprehensive hardware parts and servicing guarantee with immediate technician support via WhatsApp and local pickup.
        </p>
      </div>

      <div class="ios-liquid-glass p-5 rounded-2xl shadow-ios-glass transition-all hover:scale-102">
        <div class="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center font-bold text-lg mb-3">
          ⚡
        </div>
        <h2 class="text-sm font-black text-slate-900 font-mono">Pure NVMe SSD & RAM</h2>
        <p class="text-xs text-slate-600 mt-1.5 leading-relaxed">
          No slow legacy mechanical hard drives. Every laptop and PC is fitted with high-speed SSDs and licensed Windows 11 Pro.
        </p>
      </div>

      <div class="ios-liquid-glass p-5 rounded-2xl shadow-ios-glass transition-all hover:scale-102">
        <div class="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center font-bold text-lg mb-3">
          🔄
        </div>
        <h2 class="text-sm font-black text-slate-900 font-mono">7-Day Hassle-Free Swap</h2>
        <p class="text-xs text-slate-600 mt-1.5 leading-relaxed">
          Test the device with your daily software. If it doesn't fit your workflow, easily replace or upgrade without questions.
        </p>
      </div>

    </div>

    <!-- Direct Quick CTA Buttons -->
    <div class="flex flex-wrap items-center justify-center gap-3.5 mt-8">
      <a href="#device-finder" class="ios-pill-btn apple-action-btn px-6 py-3.5 rounded-full text-xs font-mono font-bold flex items-center gap-2 shadow-md">
        <span>Find Your Best Device Match ↓</span>
      </a>
      <a href="#products" class="ios-pill-btn apple-secondary-glass-btn px-6 py-3.5 rounded-full text-xs font-mono font-bold text-slate-700 hover:text-slate-900 flex items-center gap-2">
        <span>Browse Products Catalog</span>
      </a>
      <a href="https://wa.me/919412182786?text=Hi%20Classic%20Computers%2C%20please%20send%20me%20your%20latest%20laptop%20price%20list" target="_blank" class="ios-pill-btn px-5 py-3.5 rounded-full border border-emerald-400 bg-white hover:bg-emerald-50 text-emerald-700 text-xs font-mono font-bold flex items-center gap-2 shadow-2xs">
        <span>💬 Contact Store: +91 94121 82786</span>
      </a>
    </div>

  </section>

  <!-- ===================================================
       4. SECTION 2: INTERACTIVE SMART DEVICE FINDER
          "Which Computer Is Right For You?"
       =================================================== -->
  <section id="device-finder" class="py-16 bg-gradient-to-b from-slate-100/80 via-white to-slate-50 border-y border-slate-200/80 relative">
    <div class="max-w-6xl mx-auto px-4">
      
      <div class="text-center max-w-3xl mx-auto mb-10">
        <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono font-bold mb-3 shadow-2xs">
          🎯 SMART RECOMMENDATION ENGINE
        </span>
        <h2 class="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Which Laptop or Desktop Is Right For You?
        </h2>
        <p class="text-sm text-slate-600 mt-2">
          Select your primary workload below — our interactive engine instantly recommends the ideal lab-tested system:
        </p>
      </div>

      <!-- Use-Case Filter Tabs -->
      <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8" id="finder-tags-bar" role="tablist">
        <button type="button" class="finder-tag-btn active px-4 py-2 rounded-full text-xs font-mono font-bold transition-all border border-cyan-600 bg-cyan-600 text-white shadow-sm flex items-center gap-2" data-tag="coding">
          <span>💻 Coding & Engineering</span>
        </button>
        <button type="button" class="finder-tag-btn px-4 py-2 rounded-full text-xs font-mono font-bold transition-all border border-slate-200 bg-white text-slate-700 hover:border-cyan-400 hover:text-cyan-700 flex items-center gap-2" data-tag="editing">
          <span>🎨 4K Video & Graphic Design</span>
        </button>
        <button type="button" class="finder-tag-btn px-4 py-2 rounded-full text-xs font-mono font-bold transition-all border border-slate-200 bg-white text-slate-700 hover:border-cyan-400 hover:text-cyan-700 flex items-center gap-2" data-tag="office">
          <span>💼 Office, Tally & Accounts</span>
        </button>
        <button type="button" class="finder-tag-btn px-4 py-2 rounded-full text-xs font-mono font-bold transition-all border border-slate-200 bg-white text-slate-700 hover:border-cyan-400 hover:text-cyan-700 flex items-center gap-2" data-tag="trading">
          <span>📈 Stock Trading (Multi-Screen)</span>
        </button>
        <button type="button" class="finder-tag-btn px-4 py-2 rounded-full text-xs font-mono font-bold transition-all border border-slate-200 bg-white text-slate-700 hover:border-cyan-400 hover:text-cyan-700 flex items-center gap-2" data-tag="gaming">
          <span>🎮 Gaming & 3D Rendering</span>
        </button>
      </div>

      <!-- Recommendation Card (iOS Liquid Glass with Dynamic Content) -->
      <div id="finder-recommendation-card" class="max-w-4xl mx-auto rounded-3xl ios-liquid-glass p-6 sm:p-8 border border-white/90 shadow-2xl transition-all duration-300">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <!-- Image Box -->
          <div class="md:col-span-5 relative rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-xs flex items-center justify-center p-3">
            <span id="finder-match-badge" class="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-mono font-bold shadow-xs">
              🔥 TOP PICK FOR PROGRAMMING & COLLEGE
            </span>
            <img id="finder-product-img" 
                 src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80" 
                 alt="Recommended Laptop" 
                 class="w-full h-56 sm:h-64 object-contain transition-transform duration-500 hover:scale-105">
            <span id="finder-device-type" class="absolute bottom-2 right-3 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
              ENTERPRISE LAPTOP
            </span>
          </div>

          <!-- Recommendation Details -->
          <div class="md:col-span-7 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-mono font-bold" id="finder-product-badge">
                  Grade A+ • 6-Mo Warranty
                </span>
                <span class="text-xs text-amber-600 font-mono font-bold">★★★★★ (4.8/5)</span>
              </div>

              <h3 id="finder-product-name" class="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                Lenovo ThinkPad T480 Dual-Battery
              </h3>

              <!-- Why this is best for the task -->
              <div class="mt-3 p-3.5 rounded-xl bg-cyan-50/60 border border-cyan-200/60">
                <span class="text-[11px] font-mono font-bold text-cyan-900 block uppercase tracking-wider">
                  WHY THIS MACHINE IS IDEAL FOR THIS WORKFLOW:
                </span>
                <p id="finder-product-why" class="text-xs text-slate-700 mt-1 leading-relaxed">
                  Dual batteries provide 8 to 10 hours of non-stop backup for long coding marathons. The spill-resistant backlit ThinkPad keyboard offers deep 1.8mm key travel that programmers swear by. 16GB RAM + 512GB SSD easily handles VS Code, Docker containers, Python/Java compilation, and Ubuntu/Linux dual-boot.
                </p>
              </div>

              <!-- Quick Specs Chips -->
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 text-[11px] font-mono">
                <div class="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span class="text-slate-400 block text-[10px]">CPU</span>
                  <span id="finder-spec-cpu" class="font-bold text-slate-800">Intel Core i7 8th Gen</span>
                </div>
                <div class="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span class="text-slate-400 block text-[10px]">RAM & SSD</span>
                  <span id="finder-spec-ram" class="font-bold text-slate-800">16GB RAM • 512GB SSD</span>
                </div>
                <div class="p-2 rounded-lg bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                  <span class="text-slate-400 block text-[10px]">SCREEN</span>
                  <span id="finder-spec-display" class="font-bold text-slate-800">14" FHD IPS Matte</span>
                </div>
              </div>
            </div>

            <!-- Price & Action Dock -->
            <div class="mt-5 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div class="flex items-baseline gap-2">
                  <span id="finder-product-price" class="text-2xl font-black text-slate-900 font-mono">₹23,499</span>
                  <span id="finder-product-mrp" class="text-xs text-slate-400 line-through font-mono">₹1,10,000</span>
                </div>
                <span class="text-[11px] text-emerald-700 font-mono font-bold">Save 78% compared to new retail</span>
              </div>

              <div class="flex items-center gap-2">
                <button id="finder-add-cart-btn" class="apple-action-btn px-4 py-2.5 text-xs font-mono font-bold flex items-center gap-1.5 shadow-md">
                  <span>Add to Bag</span>
                </button>
                <a id="finder-whatsapp-link" href="https://wa.me/919412182786?text=Hi%20Classic%20Computers%2C%20I%20want%20to%20order%20Lenovo%20ThinkPad%20T480%20(Price%3A%20Rs%2023%2C499)" target="_blank" class="apple-secondary-glass-btn px-3.5 py-2.5 text-xs font-mono font-bold text-emerald-800 border-emerald-300 hover:bg-emerald-50 flex items-center gap-1">
                  <span>💬 WhatsApp Order</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  </section>

  <!-- ===================================================
       5. SECTION 3: PRODUCTS (EXPLICITLY NAMED "PRODUCTS")
       =================================================== -->
  <section id="products" class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
    
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200/80">
      <div>
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono font-bold mb-3 shadow-2xs">
          <span>📦 CERTIFIED INVENTORY (GRADE A+)</span>
        </div>
        <h2 class="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Products
        </h2>
        <p class="text-sm text-slate-600 mt-2">
          Explore our certified catalog of commercial laptops and desktop computers. Every unit includes clear workflow suitability and hardware specifications.
        </p>
      </div>

      <!-- Quick Filter Pills -->
      <div class="flex flex-wrap items-center gap-2" id="catalog-filter-bar">
        <button class="catalog-tab-btn active px-4 py-2 rounded-full text-xs font-mono font-bold border border-cyan-600 bg-cyan-600 text-white shadow-2xs" data-filter="all">All (8)</button>
        <button class="catalog-tab-btn px-4 py-2 rounded-full text-xs font-mono font-bold border border-slate-200 bg-white text-slate-700 hover:border-cyan-400" data-filter="laptop">Laptops (6)</button>
        <button class="catalog-tab-btn px-4 py-2 rounded-full text-xs font-mono font-bold border border-slate-200 bg-white text-slate-700 hover:border-cyan-400" data-filter="desktop">Desktops (2)</button>
        <button class="catalog-tab-btn px-4 py-2 rounded-full text-xs font-mono font-bold border border-slate-200 bg-white text-slate-700 hover:border-cyan-400" data-filter="budget">Under ₹25k</button>
      </div>
    </div>

    <!-- Product Grid of 8 Machines (Populated via js/app.js renderCatalog()) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="products-catalog-grid">
      <!-- Dynamic Render Output -->
    </div>

  </section>

  <!-- ===================================================
       6. SECTION 4: PHYSICAL STORE LOCATION & VERIFICATION
          (Shop Photos from Reel • GSTIN • Physical Address • Trust)
       =================================================== -->
  <section id="store-location" class="py-20 bg-slate-900 text-white relative overflow-hidden border-y border-slate-800">
    <!-- Ethereal Background Aurora -->
    <div class="absolute inset-0 bg-gradient-to-tr from-cyan-950 via-slate-900 to-indigo-950 opacity-70 pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      <div class="text-center max-w-3xl mx-auto mb-12">
        <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-900/60 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold mb-3 shadow-sm">
          <span>📍 100% VERIFIED PHYSICAL LOCATION & SHOWROOM</span>
        </span>
        <h2 class="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Visit Our Physical Store in Etah, UP
        </h2>
        <p class="text-sm text-slate-300 mt-3 leading-relaxed">
          We are not an anonymous online reseller. Classic Computers operates an established brick-and-mortar technology store with hundreds of laptops and desktop units on display for walk-in testing and immediate purchase.
        </p>
      </div>

      <!-- Real Store Photos Grid (Extracted directly from store video reel) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        <!-- Store Exterior Signboard with Phone & GST -->
        <div class="ios-liquid-glass-dark rounded-2xl p-4 border border-white/10 flex flex-col justify-between group hover:border-cyan-500/50 transition-all">
          <div class="relative w-full h-64 rounded-xl overflow-hidden mb-3 bg-black">
            <img src="assets/images/shop/shop_storefront_1.png" alt="Classic Computers Store Signboard in Etah" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-mono font-bold shadow-xs">
              ✓ Registered Storefront
            </span>
          </div>
          <div>
            <h3 class="text-base font-bold text-white flex items-center justify-between">
              <span>Main Store Signboard</span>
              <span class="text-xs font-mono text-cyan-400">GT Road, Etah</span>
            </h3>
            <p class="text-xs text-slate-400 mt-1.5">
              Verified business signboard clearly listing contacts: <strong class="text-slate-200">+91 94121 82786</strong>, +91 84758 82785, and Official GSTIN.
            </p>
          </div>
        </div>

        <!-- Store Interior Glass Shelves -->
        <div class="ios-liquid-glass-dark rounded-2xl p-4 border border-white/10 flex flex-col justify-between group hover:border-cyan-500/50 transition-all">
          <div class="relative w-full h-64 rounded-xl overflow-hidden mb-3 bg-black">
            <img src="assets/images/shop/shop_storefront_3.png" alt="Classic Computers Laptop Inventory Shelves" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-cyan-600 text-white text-[10px] font-mono font-bold shadow-xs">
              Live Stock on Display
            </span>
          </div>
          <div>
            <h3 class="text-base font-bold text-white flex items-center justify-between">
              <span>Display Racks & Units</span>
              <span class="text-xs font-mono text-emerald-400">In-Stock</span>
            </h3>
            <p class="text-xs text-slate-400 mt-1.5">
              Multi-tier glass displays showcasing ready-to-test Dell, HP, Lenovo ThinkPads, monitors, and compact micro PC systems.
            </p>
          </div>
        </div>

        <!-- Video Reel Card & Studio Experience -->
        <div class="ios-liquid-glass-dark rounded-2xl p-4 border border-white/10 flex flex-col justify-between group hover:border-cyan-500/50 transition-all">
          <div class="relative w-full h-64 rounded-xl overflow-hidden mb-3 bg-black">
            <img src="assets/images/shop/shop_storefront_2.png" alt="Classic Computers Premium Laptop Collection" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <a href="https://www.instagram.com/classic.computer.empire/reel/DcY0IRLh2sZ/" target="_blank" rel="noopener noreferrer" class="absolute inset-0 bg-black/40 hover:bg-black/20 flex flex-col items-center justify-center gap-2 transition-all">
              <span class="w-12 h-12 rounded-full bg-pink-600 text-white flex items-center justify-center text-lg shadow-lg hover:scale-110 transition-transform">
                ▶
              </span>
              <span class="text-xs font-mono font-bold text-white bg-black/60 px-3 py-1 rounded-full">
                Watch Store Reel on Instagram ↗
              </span>
            </a>
          </div>
          <div>
            <h3 class="text-base font-bold text-white flex items-center justify-between">
              <span>Official Video Tour</span>
              <span class="text-xs font-mono text-pink-400">@classic.computer.empire</span>
            </h3>
            <p class="text-xs text-slate-400 mt-1.5">
              Watch our store walkthrough video reel directly on Instagram to inspect live inventory and showroom facilities.
            </p>
          </div>
        </div>

      </div>

      <!-- Verified Business Trust Details Card -->
      <div class="ios-liquid-glass-dark p-6 sm:p-8 rounded-3xl border border-white/15 max-w-4xl mx-auto shadow-2xl">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          
          <div>
            <div class="text-[11px] font-mono text-cyan-400 uppercase font-bold">STORE ADDRESS</div>
            <div class="text-sm font-bold text-white mt-1">Classic Computers</div>
            <div class="text-xs text-slate-300 mt-0.5">Near Railway Road / GT Road, Etah, UP - 207001</div>
          </div>

          <div>
            <div class="text-[11px] font-mono text-cyan-400 uppercase font-bold">CONTACT NUMBERS</div>
            <div class="text-sm font-bold text-white mt-1">+91 94121 82786</div>
            <div class="text-xs text-slate-300 mt-0.5">+91 84758 82785 (Store Landline/Direct)</div>
          </div>

          <div>
            <div class="text-[11px] font-mono text-cyan-400 uppercase font-bold">GOVT REGISTRATION</div>
            <div class="text-sm font-bold text-white mt-1">GSTIN Verified</div>
            <div class="text-xs text-slate-300 font-mono mt-0.5">09AKZPA9666PZZT</div>
          </div>

          <div>
            <div class="text-[11px] font-mono text-cyan-400 uppercase font-bold">STORE TIMINGS</div>
            <div class="text-sm font-bold text-white mt-1">Mon – Sat: 10AM – 8:30PM</div>
            <div class="text-xs text-slate-300 mt-0.5">Walk-ins welcome with on-spot test bench</div>
          </div>

        </div>

        <div class="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span class="text-xs font-mono text-emerald-300 font-semibold">Store is open today. Live video calls on WhatsApp available before dispatch.</span>
          </div>
          <div class="flex items-center gap-3">
            <a href="https://www.instagram.com/classic.computer.empire/reel/DcY0IRLh2sZ/" target="_blank" class="px-4 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm hover:opacity-90">
              <span>Watch Reel Video Tour (↗)</span>
            </a>
            <a href="https://wa.me/919412182786?text=Hi%20Classic%20Computers%2C%20please%20send%20your%20exact%20shop%20location%20and%20directions" target="_blank" class="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
              <span>Get Directions on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  </section>

  <!-- ===================================================
       7. SECTION 5: FLAGSHIP 3D HARDWARE SHOWCASE
          Dell Precision 5530 4K Mobile Workstation
       =================================================== -->
  <section class="py-20 bg-slate-950 text-white relative overflow-hidden" id="flagship-showcase">
    <div class="max-w-6xl mx-auto px-4 relative z-10 text-center">
      <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold mb-3">
        ⭐ FLAGSHIP WORKSTATION // 4K PREMIERCOLOR
      </span>
      <h2 class="text-3xl sm:text-5xl font-black text-white tracking-tight">
        Dell Precision 5530 4K Workstation
      </h2>
      <p class="text-sm text-slate-400 mt-2 max-w-2xl mx-auto">
        Original CNC aluminum lid, aerospace carbon-fiber palm rest, 100% AdobeRGB 4K touch screen, and dedicated NVIDIA Quadro GPU.
      </p>

      <!-- Interactive 3D Showcase Card -->
      <div id="hero-showcase-card" class="mt-10 max-w-4xl mx-auto bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl transition-all duration-300">
        
        <!-- Hardware Angle Switcher Pills -->
        <div class="flex flex-wrap items-center justify-center gap-2 mb-6">
          <button type="button" class="hero-view-btn active px-4 py-1.5 rounded-full text-xs font-mono font-bold border border-cyan-500 bg-cyan-500/20 text-cyan-300" data-img="assets/images/real-5530/dell_5530_front_display.jpg" data-desc="Front View: 15.6-inch 4K UHD InfinityEdge Touch Screen (100% AdobeRGB, 400 Nits)">
            Front Display
          </button>
          <button type="button" class="hero-view-btn px-4 py-1.5 rounded-full text-xs font-mono font-bold border border-slate-700 bg-slate-800 text-slate-300 hover:border-cyan-500" data-img="assets/images/real-5530/dell_5530_aluminium_lid.jpg" data-desc="CNC Aluminum Top Lid: Pristine Grade A+ Condition with Zero Dent Guarantee">
            Aluminum Lid
          </button>
          <button type="button" class="hero-view-btn px-4 py-1.5 rounded-full text-xs font-mono font-bold border border-slate-700 bg-slate-800 text-slate-300 hover:border-cyan-500" data-img="assets/images/real-5530/dell_5530_4k_screen_detail.jpg" data-desc="4K Display Close-up: Microscopic Sub-Pixel Uniformity & Vivid Color Grading">
            Screen Detail
          </button>
          <button type="button" class="hero-view-btn px-4 py-1.5 rounded-full text-xs font-mono font-bold border border-slate-700 bg-slate-800 text-slate-300 hover:border-cyan-500" data-img="assets/images/real-5530/dell_5530_angled_profile.jpg" data-desc="Slim Wedge Profile: Thunderbolt 3, HDMI 2.0, USB 3.1 & SD Card Reader">
            Ports & Profile
          </button>
        </div>

        <!-- High-Res Dynamic Viewport -->
        <div class="relative w-full h-80 sm:h-96 rounded-2xl bg-black/40 overflow-hidden flex items-center justify-center border border-white/5">
          <img id="hero-showcase-img" 
               src="assets/images/real-5530/dell_5530_front_display.jpg" 
               alt="Dell Precision 5530 Workstation" 
               class="max-h-full max-w-full object-contain transition-all duration-300">
        </div>

        <p id="hero-view-caption" class="text-xs font-mono text-cyan-400 text-center mt-3">
          Front View: 15.6-inch 4K UHD InfinityEdge Touch Screen (100% AdobeRGB, 400 Nits)
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
          <div class="flex items-center gap-3">
            <a href="https://wa.me/919412182786?text=Hi%20Classic%20Computers%2C%20I%20am%20interested%20in%20Dell%20Precision%205530%204K%20Workstation%20(Rs%2034%2C999)" target="_blank" class="px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-lg">
              <span>💬 Buy on WhatsApp (+91 94121 82786)</span>
            </a>
            <button onclick="window.storeEngine.addToCart(PRODUCTS[0])" class="apple-action-btn px-5 py-3 rounded-full text-xs font-mono font-bold shadow-lg">
              <span>Add to Bag</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  </section>

  <!-- ===================================================
       8. SECTION 6: INTERACTIVE THERMAL RECEIPT PRINTER
          (Inspired by @susanoo.ui with Live POS Feedback)
       =================================================== -->
  <section id="configurator" class="py-20 bg-slate-100/70 border-b border-slate-200 relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center max-w-3xl mx-auto mb-14">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold mb-3">
          <span>🧾 SUSANOO-INSPIRED HARDWARE CONFIGURATOR</span>
        </span>
        <h2 class="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Custom Rig Studio & Thermal Receipt
        </h2>
        <p class="text-sm text-slate-600 mt-2">
          Configure RAM, NVMe storage, and warranty tier in real-time. Watch the POS thermal receipt recalculate and reprint instantly.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <!-- Left: Interactive Configuration Controls -->
        <div class="lg:col-span-7 flex flex-col gap-6">
          
          <!-- Plan Presets Bar -->
          <div class="ios-liquid-glass p-5 rounded-2xl shadow-sm">
            <span class="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider block mb-3">
              1. Select Workflow Configuration Profile:
            </span>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button type="button" class="plan-preset-card active p-3 rounded-xl border border-cyan-500 bg-cyan-50/50 text-left transition-all" data-plan="base">
                <div class="text-xs font-mono font-bold text-cyan-800">STANDARD RIG</div>
                <div class="text-sm font-black text-slate-900 mt-1">8GB • 256GB SSD</div>
                <div class="text-[11px] text-slate-500 mt-0.5">Office & Coding Base</div>
              </button>
              <button type="button" class="plan-preset-card p-3 rounded-xl border border-slate-200 bg-white text-left transition-all hover:border-cyan-400" data-plan="pro">
                <div class="text-xs font-mono font-bold text-slate-600">CREATIVE PRO</div>
                <div class="text-sm font-black text-slate-900 mt-1">16GB • 512GB SSD</div>
                <div class="text-[11px] text-slate-500 mt-0.5">4K Video & Multitask</div>
              </button>
              <button type="button" class="plan-preset-card p-3 rounded-xl border border-slate-200 bg-white text-left transition-all hover:border-cyan-400" data-plan="max">
                <div class="text-xs font-mono font-bold text-slate-600">EXTREME CAD</div>
                <div class="text-sm font-black text-slate-900 mt-1">32GB • 1TB SSD</div>
                <div class="text-[11px] text-slate-500 mt-0.5">3D Render & Simulation</div>
              </button>
            </div>
          </div>

          <!-- Component Selectors -->
          <div class="ios-liquid-glass p-6 rounded-2xl shadow-sm flex flex-col gap-5">
            <span class="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider">
              2. Fine-Tune Hardware Components:
            </span>

            <!-- RAM Options -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-2">Memory (DDR4 2666MHz):</label>
              <div class="grid grid-cols-3 gap-2">
                <button type="button" class="config-pill active p-2.5 rounded-xl border border-cyan-600 bg-cyan-600 text-white text-xs font-mono font-bold" data-type="ram" data-val="0" data-label="8GB DDR4 Base">8GB (Included)</button>
                <button type="button" class="config-pill p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-mono font-bold hover:border-cyan-400" data-type="ram" data-val="2500" data-label="16GB DDR4 Pro">+16GB (+₹2,500)</button>
                <button type="button" class="config-pill p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-mono font-bold hover:border-cyan-400" data-type="ram" data-val="6000" data-label="32GB DDR4 Beast">+32GB (+₹6,000)</button>
              </div>
            </div>

            <!-- SSD Options -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-2">Storage (Gen3 Fast NVMe SSD):</label>
              <div class="grid grid-cols-3 gap-2">
                <button type="button" class="config-pill active p-2.5 rounded-xl border border-cyan-600 bg-cyan-600 text-white text-xs font-mono font-bold" data-type="ssd" data-val="0" data-label="256GB NVMe SSD">256GB (Included)</button>
                <button type="button" class="config-pill p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-mono font-bold hover:border-cyan-400" data-type="ssd" data-val="2200" data-label="512GB Ultra NVMe">+512GB (+₹2,200)</button>
                <button type="button" class="config-pill p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-mono font-bold hover:border-cyan-400" data-type="ssd" data-val="5500" data-label="1TB Enterprise NVMe">+1TB (+₹5,500)</button>
              </div>
            </div>

            <!-- Warranty Options -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-2">Comprehensive Warranty Protection:</label>
              <div class="grid grid-cols-2 gap-2">
                <button type="button" class="config-pill active p-2.5 rounded-xl border border-cyan-600 bg-cyan-600 text-white text-xs font-mono font-bold" data-type="warranty" data-val="0" data-label="6-Month Lab Warranty">6 Months Lab Warranty (Free)</button>
                <button type="button" class="config-pill p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-mono font-bold hover:border-cyan-400" data-type="warranty" data-val="2999" data-label="12-Month Pro Care">+1 Year Complete Care (+₹2,999)</button>
              </div>
            </div>

            <!-- Pre-Pay 15% Discount Toggle -->
            <div class="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-slate-800">Pre-Pay Full Amount (UPI / Bank Transfer)</div>
                <div class="text-[11px] text-slate-500">Unlocks immediate 15% instant order discount</div>
              </div>
              <div class="flex items-center gap-1 bg-slate-200/80 p-1 rounded-full">
                <button type="button" id="billing-mode-standard" class="billing-mode-btn active px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-white text-slate-900 shadow-2xs" data-mode="standard">Standard</button>
                <button type="button" id="billing-mode-annual" class="billing-mode-btn px-3 py-1 rounded-full text-[11px] font-mono font-bold text-slate-600 hover:text-slate-900" data-mode="annual">Save 15%</button>
              </div>
            </div>

          </div>

          <!-- Direct Order Buttons -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button id="config-add-cart-btn" class="apple-action-btn py-3.5 text-xs font-mono font-bold flex items-center justify-center gap-2 rounded-xl shadow-md">
              <span>Add Custom Rig to Bag</span>
            </button>
            <button id="config-whatsapp-buy-btn" class="apple-secondary-glass-btn py-3.5 text-xs font-mono font-bold text-emerald-800 border-emerald-400 hover:bg-emerald-50 flex items-center justify-center gap-2 rounded-xl">
              <span>Order via WhatsApp (+91 94121 82786)</span>
            </button>
          </div>

        </div>

        <!-- Right: Animated Thermal POS Receipt Stage -->
        <div class="lg:col-span-5 flex flex-col items-center">
          
          <!-- Thermal Printer Slot Mockup -->
          <div class="w-full max-w-[390px] bg-slate-900 p-3 rounded-t-2xl shadow-xl flex items-center justify-between border border-slate-800">
            <div class="flex items-center gap-2">
              <span class="printer-led-online" id="printer-status-led" title="Printer Ready"></span>
              <span class="text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase">CLASSIC COMPUTERS POS #5530</span>
            </div>
            <button id="receipt-tear-trigger-btn" type="button" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono flex items-center gap-1 transition-colors">
              <span>✂ Tear & Reprint</span>
            </button>
          </div>

          <!-- Thermal Receipt Body -->
          <div class="thermal-receipt-stage w-full max-w-[390px]" id="thermal-receipt-stage">
            <div class="thermal-receipt-paper feeding" id="thermal-receipt-paper" role="region" aria-live="polite">
              
              <!-- Store POS Header -->
              <div class="text-center pb-2 border-b border-dashed border-slate-300 mb-3">
                <img src="assets/images/logo.png" alt="Classic Computers Logo" class="w-9 h-9 object-contain mx-auto mb-1 rounded-full border border-slate-300 brand-logo-img">
                <div class="receipt-header-title">CLASSIC COMPUTERS</div>
                <div class="text-[10px] font-mono text-slate-500">Near Railway Road / GT Road, Etah, UP</div>
                <div class="text-[10px] font-mono text-slate-600 font-bold">Helpline: +91 94121 82786 • GSTIN: 09AKZPA9666PZZT</div>
                <div class="receipt-terminal-id text-[9px] text-slate-400 mt-1">POS-01 • <span id="receipt-live-time">SEP 29, 2026</span></div>
              </div>

              <!-- Item Details -->
              <div class="receipt-line font-bold text-xs text-slate-900 mb-2">
                <span>Dell Precision 5530 4K UHD</span>
                <span class="item-price">₹34,999</span>
              </div>

              <div class="flex flex-col gap-1 text-[11px] font-mono text-slate-600 pb-3 border-b border-dashed border-slate-300">
                <div class="flex justify-between">
                  <span class="item-name" id="receipt-ram-name">+ 8GB DDR4 Base</span>
                  <span class="item-price" id="receipt-ram-price">+₹0</span>
                </div>
                <div class="flex justify-between">
                  <span class="item-name" id="receipt-ssd-name">+ 256GB NVMe SSD</span>
                  <span class="item-price" id="receipt-ssd-price">+₹0</span>
                </div>
                <div class="flex justify-between">
                  <span class="item-name" id="receipt-warranty-name">+ 6-Month Lab Warranty</span>
                  <span class="item-price" id="receipt-warranty-price">+₹0</span>
                </div>
                <div class="receipt-line receipt-item-row highlight-discount hidden flex justify-between text-emerald-700 font-bold" id="receipt-discount-line">
                  <span>- Instant 15% Pre-Pay Promo</span>
                  <span class="item-price" id="receipt-discount-amount">-₹5,250</span>
                </div>
              </div>

              <!-- Totals -->
              <div class="pt-3 flex flex-col gap-1 font-mono text-xs">
                <div class="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span class="item-price" id="receipt-subtotal-price">₹34,999</span>
                </div>
                <div class="flex justify-between text-slate-500">
                  <span>All-India Insured Courier:</span>
                  <span class="text-emerald-700 font-bold">FREE (₹0)</span>
                </div>
                <div class="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-slate-900 mt-1">
                  <span>TOTAL DUE:</span>
                  <span class="receipt-total-amount" id="receipt-total-price">₹34,999</span>
                </div>
              </div>

              <!-- Rubber Stamp -->
              <div class="receipt-rubber-stamp mt-3 text-center" id="receipt-stamp-badge">
                CERTIFIED GRADE A+ • LAB VERIFIED
              </div>

              <!-- Barcode Mockup -->
              <div class="mt-4 pt-3 border-t border-dashed border-slate-300 text-center">
                <div class="font-mono text-[9px] text-slate-400 tracking-widest">||| | ||||| || |||||| | ||||| |||| ||</div>
                <div class="text-[9px] font-mono text-slate-400">CC-ORDER-5530-VERIFIED</div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  </section>

  <!-- ===================================================
       9. SECTION 7: 6-STAGE LAB CERTIFICATION PROTOCOL
       =================================================== -->
  <section class="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono font-bold mb-3 shadow-2xs">
      🛡️ ZERO-RISK QUALITY PROTOCOL
    </span>
    <h2 class="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
      Our 6-Stage Lab Audit Protocol
    </h2>
    <p class="text-sm text-slate-600 mt-2 max-w-2xl mx-auto">
      Every laptop and desktop computer undergoes exhaustive stress-testing before it receives our Grade A+ Certified holographic seal.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 text-left">
      
      <div class="ios-liquid-glass p-6 rounded-2xl shadow-sm">
        <div class="text-cyan-600 font-mono font-bold text-xs mb-1">STAGE 01 // BODY & PORTS</div>
        <h3 class="text-base font-bold text-slate-900">Chassis & Hinge Rigidity</h3>
        <p class="text-xs text-slate-600 mt-2 leading-relaxed">
          Screen hinge torque check, aluminum chassis alignment, Thunderbolt/USB-C ports tested for 40Gbps and 100W PD charging.
        </p>
      </div>

      <div class="ios-liquid-glass p-6 rounded-2xl shadow-sm">
        <div class="text-cyan-600 font-mono font-bold text-xs mb-1">STAGE 02 // SCREEN HEALTH</div>
        <h3 class="text-base font-bold text-slate-900">Sub-Pixel & Uniformity Check</h3>
        <p class="text-xs text-slate-600 mt-2 leading-relaxed">
          Zero dead-pixel policy. 100% white and black field tests ensure backlight uniformity, accurate color calibration, and zero pressure marks.
        </p>
      </div>

      <div class="ios-liquid-glass p-6 rounded-2xl shadow-sm">
        <div class="text-cyan-600 font-mono font-bold text-xs mb-1">STAGE 03 // BATTERY HEALTH</div>
        <h3 class="text-base font-bold text-slate-900">85%+ Capacity Guaranteed</h3>
        <p class="text-xs text-slate-600 mt-2 leading-relaxed">
          OEM cycle count validation. Any battery exhibiting below 85% original retention is swapped with a fresh high-capacity OEM pack.
        </p>
      </div>

      <div class="ios-liquid-glass p-6 rounded-2xl shadow-sm">
        <div class="text-cyan-600 font-mono font-bold text-xs mb-1">STAGE 04 // THERMAL BENCHMARK</div>
        <h3 class="text-base font-bold text-slate-900">FurMark & Cinebench Load</h3>
        <p class="text-xs text-slate-600 mt-2 leading-relaxed">
          30 minutes of sustained 100% CPU/GPU stress test. Heatsinks are cleaned, fresh Arctic MX-4 thermal paste applied to prevent throttling.
        </p>
      </div>

      <div class="ios-liquid-glass p-6 rounded-2xl shadow-sm">
        <div class="text-cyan-600 font-mono font-bold text-xs mb-1">STAGE 05 // KEYBOARD & AUDIO</div>
        <h3 class="text-base font-bold text-slate-900">Tactile & Audio Inspection</h3>
        <p class="text-xs text-slate-600 mt-2 leading-relaxed">
          Every individual key tested for click actuation. Dual microphones and stereo speakers analyzed for clear, distortion-free output.
        </p>
      </div>

      <div class="ios-liquid-glass p-6 rounded-2xl shadow-sm">
        <div class="text-cyan-600 font-mono font-bold text-xs mb-1">STAGE 06 // SOFTWARE & SEAL</div>
        <h3 class="text-base font-bold text-slate-900">Genuine OS & Sealed Pack</h3>
        <p class="text-xs text-slate-600 mt-2 leading-relaxed">
          Clean installation of Genuine Windows 11 Pro with all digital drivers. Sanitized and packaged in multi-layer bubble security armor.
        </p>
      </div>

    </div>
  </section>

  <!-- ===================================================
       10. SECTION 8: VERIFIED CUSTOMER TESTIMONIALS
       =================================================== -->
  <section class="py-16 bg-white border-t border-slate-200">
    <div class="max-w-6xl mx-auto px-4">
      <div class="text-center max-w-2xl mx-auto mb-10">
        <span class="text-xs font-mono font-bold text-cyan-700 uppercase tracking-widest">VERIFIED BUYERS</span>
        <h2 class="text-2xl sm:text-4xl font-black text-slate-900 mt-1">What Our Customers Say</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div class="ios-liquid-glass p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div class="flex items-center justify-between mb-3">
            <span class="text-amber-500 text-sm">★★★★★</span>
            <span class="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">Verified Purchase</span>
          </div>
          <p class="text-xs text-slate-700 leading-relaxed italic">
            "Genuinely blown away by the condition! Screen has zero scratches and the 4K panel is stunning for Premiere Pro editing. The i7 H-series and 4GB NVIDIA handle 4K timelines without a hiccup. Classic Computers delivered it in 2 days with bubble-sealed packing."
          </p>
          <div class="mt-4 pt-3 border-t border-slate-200 text-xs">
            <div class="font-bold text-slate-900">Vikram Malhotra</div>
            <div class="text-slate-500 text-[11px]">Mumbai • Dell Precision 5530 4K</div>
          </div>
        </div>

        <div class="ios-liquid-glass p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div class="flex items-center justify-between mb-3">
            <span class="text-amber-500 text-sm">★★★★★</span>
            <span class="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">Verified Purchase</span>
          </div>
          <p class="text-xs text-slate-700 leading-relaxed italic">
            "I checked battery health on HWMonitor right after delivery—it's at 94%! Truly Grade A+ as advertised. The carbon fiber palm rest looks brand new. Best deal at ₹34,999 compared to spending 1.5 lakhs on a new laptop."
          </p>
          <div class="mt-4 pt-3 border-t border-slate-200 text-xs">
            <div class="font-bold text-slate-900">Aman Preet Singh</div>
            <div class="text-slate-500 text-[11px]">Chandigarh • Dell Precision 5530 4K</div>
          </div>
        </div>

        <div class="ios-liquid-glass p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div class="flex items-center justify-between mb-3">
            <span class="text-amber-500 text-sm">★★★★★</span>
            <span class="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">Verified Purchase</span>
          </div>
          <p class="text-xs text-slate-700 leading-relaxed italic">
            "Classic Computers team answered all my questions on WhatsApp (+91 94121 82786) and sent a live video of the unit before shipping. Received the exact device shown in video. Dual batteries give me 8+ hours for coding!"
          </p>
          <div class="mt-4 pt-3 border-t border-slate-200 text-xs">
            <div class="font-bold text-slate-900">Rohit Shinde</div>
            <div class="text-slate-500 text-[11px]">Pune • Lenovo ThinkPad T480</div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- ===================================================
       11. FOOTER: OFFICIAL BRAND TOUCHPOINTS & SOCIALS
       =================================================== -->
  <footer class="bg-slate-950 text-slate-400 py-16 border-t border-slate-800 text-xs font-mono">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
      
      <!-- Column 1: Monogram Brand Logo & Bio -->
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-white p-1 flex items-center justify-center border border-white/20">
            <img src="assets/images/logo.png" alt="Classic Computers Logo" class="w-full h-full object-contain brand-logo-img">
          </div>
          <span class="text-lg font-black text-white">Classic Computers</span>
        </div>
        <p class="text-slate-400 text-xs leading-relaxed font-sans">
          India's trusted hub for certified refurbished enterprise workstations, corporate business laptops, and high-performance desktop computers.
        </p>
        <div class="text-emerald-400 text-[11px] font-bold">
          ✓ Verified GST Registered Store: 09AKZPA9666PZZT
        </div>
      </div>

      <!-- Column 2: Quick Links -->
      <div>
        <h4 class="text-white font-bold uppercase tracking-wider mb-3">Navigation</h4>
        <ul class="flex flex-col gap-2">
          <li><a href="#about-store" class="hover:text-cyan-400 transition-colors">About Our Inventory</a></li>
          <li><a href="#device-finder" class="hover:text-cyan-400 transition-colors">Smart Device Finder</a></li>
          <li><a href="#products" class="hover:text-cyan-400 text-cyan-300 font-bold transition-colors">Products Catalog</a></li>
          <li><a href="#store-location" class="hover:text-cyan-400 transition-colors">Store Location in Etah</a></li>
          <li><a href="#configurator" class="hover:text-cyan-400 transition-colors">Studio Configurator</a></li>
        </ul>
      </div>

      <!-- Column 3: Store & WhatsApp Contact -->
      <div>
        <h4 class="text-white font-bold uppercase tracking-wider mb-3">Store Contact</h4>
        <ul class="flex flex-col gap-2">
          <li class="text-white font-bold">Supplier & WhatsApp: +91 94121 82786</li>
          <li>Store Direct: +91 84758 82785</li>
          <li>Address: Near Railway Road / GT Road, Etah, UP - 207001</li>
          <li>Email: classiccomputers.etah@gmail.com</li>
          <li>Hours: Mon–Sat: 10:00 AM – 8:30 PM</li>
        </ul>
      </div>

      <!-- Column 4: Social Channels & Direct Order -->
      <div>
        <h4 class="text-white font-bold uppercase tracking-wider mb-3">Social & Orders</h4>
        <div class="flex flex-col gap-2.5">
          <a href="https://www.instagram.com/classic.computer.empire/" target="_blank" rel="noopener noreferrer" class="p-2.5 rounded-xl bg-pink-950/40 border border-pink-500/30 text-pink-300 hover:bg-pink-900/50 flex items-center justify-between transition-all">
            <span>Instagram: @classic.computer.empire</span>
            <span>↗</span>
          </a>
          <a href="https://www.instagram.com/classic.computer.empire/reel/DcY0IRLh2sZ/" target="_blank" rel="noopener noreferrer" class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-between transition-all">
            <span>Watch Store Reel Video</span>
            <span>▶</span>
          </a>
          <a href="https://wa.me/919412182786?text=Hello%20Classic%20Computers" target="_blank" class="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 flex items-center justify-between font-bold transition-all">
            <span>WhatsApp Order: +91 94121 82786</span>
            <span>💬</span>
          </a>
        </div>
      </div>

    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
      <div>© 2026 Classic Computers. All rights reserved. GST Registered.</div>
      <div class="flex items-center gap-4">
        <span>30-Point Audit Certified</span>
        <span>•</span>
        <span>6–12 Months Warranty</span>
        <span>•</span>
        <span>Pan-India Courier</span>
      </div>
    </div>
  </footer>

  <!-- ===================================================
       12. STICKY MOBILE CONVERSION BAR
       =================================================== -->
  <div class="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 py-2 px-4 sm:hidden flex items-center justify-between shadow-2xl">
    <div>
      <div class="text-[9px] font-mono text-cyan-700 font-bold uppercase tracking-wider">CERTIFIED REFURBISHED</div>
      <div class="text-xs font-black text-slate-900 font-mono">From ₹18,999 • Warranty Included</div>
    </div>
    <div class="flex items-center gap-2">
      <a href="https://wa.me/919412182786?text=Hi%20Classic%20Computers%2C%20I%20am%20looking%20for%20a%20laptop" target="_blank" class="px-3.5 py-2 rounded-full bg-emerald-600 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
        <span>💬 WhatsApp</span>
      </a>
      <button data-action="open-cart" class="px-3.5 py-2 rounded-full apple-action-btn text-xs font-mono font-bold flex items-center gap-1 shadow-sm">
        <span>Bag (<span class="cart-badge-count">0</span>)</span>
      </button>
    </div>
  </div>

  <!-- Core Scripts -->
  <script src="js/liquid-glass.js"></script>
  <script src="js/products-data.js?v=200fps"></script>
  <script src="js/cart-auth.js?v=200fps"></script>
  <script src="js/app.js?v=200fps"></script>

  <!-- Ambient Cursor Spotlight Script -->
  <script>
    const spotlight = document.getElementById('cursor-spotlight');
    if (spotlight) {
      let mouseX = 0, mouseY = 0, ticking = false;
      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!ticking) {
          requestAnimationFrame(() => {
            spotlight.style.transform = \`translate3d(\${mouseX}px, \${mouseY}px, 0) translate(-50%, -50%)\`;
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }
  </script>

</body>
</html>
`;

fs.writeFileSync(targetHtml, htmlContent, 'utf8');
console.log('Regenerated optimized English index.html');
