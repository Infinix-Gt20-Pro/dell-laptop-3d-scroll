const fs = require('fs');
const path = require('path');
const { STORE_CONFIG, PRODUCTS, getSharedNav, getSharedFooter } = require('./store-shared-templates');

// Select 3 featured laptops for 404 quick recommendations
const featuredRecommendations = PRODUCTS.slice(0, 3);

function renderRecommendationCard(p) {
  return `
    <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-ios-card hover:border-cyan-500/50 hover:shadow-ios-elevated transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div class="flex items-center justify-between gap-2 mb-3">
          <span class="px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 text-[10px] font-mono font-bold border border-cyan-200">
            ${p.grade.split('(')[0].trim()}
          </span>
          <span class="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
            In Stock
          </span>
        </div>

        <div class="relative w-full h-44 rounded-2xl bg-slate-50 overflow-hidden flex items-center justify-center p-3 mb-3 border border-slate-100 group-hover:bg-slate-100/60 transition-colors">
          <img src="${p.thumbnail}" alt="${p.shortName}" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300">
          <div class="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-mono backdrop-blur-sm">
            ${p.brand}
          </div>
        </div>

        <h4 class="text-sm font-bold text-slate-900 group-hover:text-cyan-600 transition-colors line-clamp-1">
          ${p.name}
        </h4>
        <p class="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
          ${p.specs.processor}
        </p>

        <div class="grid grid-cols-2 gap-1.5 my-3 text-[10px] font-mono">
          <div class="p-1.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200/50">
            <span class="text-slate-400 block text-[8px]">RAM</span>
            <span class="font-bold text-slate-900">${p.specs.ram}</span>
          </div>
          <div class="p-1.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200/50">
            <span class="text-slate-400 block text-[8px]">STORAGE</span>
            <span class="font-bold text-slate-900">${p.specs.storage.split(' ')[0]} SSD</span>
          </div>
        </div>
      </div>

      <div class="pt-3 border-t border-slate-100">
        <div class="flex items-baseline justify-between mb-3">
          <div>
            <span class="text-lg font-black text-slate-950 font-mono">₹${p.price.toLocaleString('en-IN')}</span>
            <span class="text-[10px] text-slate-400 line-through font-mono ml-1">₹${p.originalPrice.toLocaleString('en-IN')}</span>
          </div>
          <span class="text-[10px] font-mono text-cyan-800 bg-cyan-100 font-bold px-1.5 py-0.5 rounded">
            Save ${p.discountPercentage}%
          </span>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <a href="product-detail.html?id=${p.id}" class="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-mono font-bold text-center transition-colors">
            Specs & 3D →
          </a>
          <button type="button" 
                  onclick="if(window.storeEngine) window.storeEngine.addToCart(PRODUCTS.find(x=>x.id==='${p.id}'))" 
                  class="py-2 px-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold text-center transition-all flex items-center justify-center gap-1 shadow-sm">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            <span>Add to Bag</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

const page404Html = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth antialiased">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>404 — Page Not Found | Classic Computers Etah</title>
  <meta name="description" content="The refurbished laptop model, hardware configuration, or page route requested could not be located. Explore our active verified inventory or contact our Etah showroom.">
  <meta name="robots" content="noindex, follow">

  <!-- OpenGraph / Social Metadata -->
  <meta property="og:title" content="404 — Machine Route Disconnected | Classic Computers">
  <meta property="og:description" content="Certified enterprise hardware with 6-12 months replacement warranty and Pan-India delivery.">
  <meta property="og:type" content="website">
  <meta property="og:image" content="assets/images/logo.png">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="assets/images/logo.png">
  <link rel="apple-touch-icon" href="assets/images/logo.png">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- Tailwind CSS -->
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
    .brand-logo-img {
      mix-blend-mode: multiply;
    }
  </style>
</head>

<body class="bg-slate-50 text-slate-900 selection:bg-cyan-500 selection:text-white font-sans antialiased relative min-h-screen overflow-x-hidden flex flex-col justify-between">

  ${getSharedNav('404')}

  <!-- 404 Hero Section -->
  <main class="flex-1 pt-36 sm:pt-44 pb-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto text-center space-y-8">
      
      <!-- Ambient 404 Signal Badge -->
      <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 shadow-sm text-rose-700 text-xs font-mono font-bold animate-pulse">
        <span class="w-2 h-2 rounded-full bg-rose-500"></span>
        <span>ERROR 404 • ROUTE_NOT_FOUND</span>
      </div>

      <!-- Main Headline -->
      <div class="space-y-3">
        <h1 class="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight">
          This Machine Has Been <span class="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">Relocated</span>
        </h1>
        <p class="text-sm sm:text-base text-slate-600 font-mono max-w-2xl mx-auto leading-relaxed">
          The refurbished laptop model, hardware specification, or catalog URL you requested is unavailable or has moved to our active showroom inventory.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
        <a href="index.html" class="py-3 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs transition-all shadow-lg flex items-center gap-2">
          <span>← Return to Home</span>
        </a>
        <a href="products.html" class="py-3 px-6 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs transition-all shadow-lg flex items-center gap-2">
          <span>Browse All Laptops (8+ Models) →</span>
        </a>
        <a href="https://wa.me/${STORE_CONFIG.whatsappNumber}?text=Hi%20Classic%20Computers%2C%20I%20hit%20a%20broken%20link%20on%20your%20website%20and%20want%20to%20inquire%20about%20refurbished%20laptops." 
           target="_blank" 
           class="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs transition-all shadow-lg flex items-center gap-2">
          <span>💬 WhatsApp Support</span>
        </a>
      </div>

      <!-- Recommended Hardware Cards Section -->
      <div class="pt-12 text-left">
        <div class="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
          <div>
            <h2 class="text-lg font-bold text-slate-900">Recommended Certified Stock</h2>
            <p class="text-xs font-mono text-slate-500">Corporate Lease Return Units • 32-Point Inspected</p>
          </div>
          <a href="products.html" class="text-xs font-mono font-bold text-cyan-600 hover:text-cyan-700">
            View All →
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          ${featuredRecommendations.map(renderRecommendationCard).join('\n')}
        </div>
      </div>

    </div>
  </main>

  ${getSharedFooter()}

</body>
</html>`;

fs.writeFileSync(path.resolve('404.html'), page404Html, 'utf8');
console.log('Successfully generated 404.html for Vercel!');
