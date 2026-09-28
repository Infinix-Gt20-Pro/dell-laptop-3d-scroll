const fs = require('fs');
const path = require('path');
const { STORE_CONFIG, PRODUCTS, getSharedNav, getSharedFooter } = require('./store-shared-templates');

function renderProductGridCard(p) {
  return `
    <div class="product-catalog-card bg-white rounded-3xl p-6 border border-slate-200 shadow-ios-card hover:border-cyan-500/50 hover:shadow-ios-elevated transition-all duration-300 flex flex-col justify-between group"
         data-category="${p.category}"
         data-device-type="${p.deviceType}"
         data-brand="${p.brand.toLowerCase()}"
         data-price="${p.price}"
         data-search="${(p.name + ' ' + p.brand + ' ' + p.specs.processor + ' ' + p.specs.ram + ' ' + p.specs.storage + ' ' + p.bestFor).toLowerCase()}">
      
      <div>
        <!-- Badges Bar -->
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span class="px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-[11px] font-mono font-bold border border-cyan-200">
            ${p.grade}
          </span>
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono font-bold">
            Save ${p.discountPercentage}%
          </span>
        </div>

        <!-- Product Image Viewport -->
        <div class="relative w-full h-56 rounded-2xl bg-slate-50 overflow-hidden flex items-center justify-center p-3 mb-4 border border-slate-100 group-hover:bg-slate-100/60 transition-colors">
          <img src="${p.thumbnail}" alt="${p.name}" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300">
          <div class="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono backdrop-blur-sm">
            ${p.brand} • ${p.deviceType.toUpperCase()}
          </div>
          <div class="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-mono font-bold border border-amber-200">
            ★ ${p.rating} (${p.reviewsCount})
          </div>
        </div>

        <!-- Title & Subtitle -->
        <h3 class="text-base font-bold text-slate-900 group-hover:text-cyan-600 transition-colors line-clamp-2">
          ${p.name}
        </h3>
        <p class="text-xs text-slate-500 font-mono mt-1">
          ${p.specs.processor}
        </p>

        <!-- Best For Pill -->
        <div class="my-3 p-2 rounded-xl bg-slate-100/80 border border-slate-200/60 text-[11px] text-slate-700 leading-tight">
          <strong class="text-cyan-700 font-mono block text-[10px] uppercase tracking-wider mb-0.5">Ideal Workflow:</strong>
          ${p.bestFor.substring(0, 90)}...
        </div>

        <!-- Key Specs Grid -->
        <div class="grid grid-cols-2 gap-2 my-3 text-[11px] font-mono">
          <div class="p-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200/50">
            <span class="text-slate-400 block text-[9px]">RAM MEMORY</span>
            <span class="font-bold text-slate-900">${p.specs.ram}</span>
          </div>
          <div class="p-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200/50">
            <span class="text-slate-400 block text-[9px]">NVMe STORAGE</span>
            <span class="font-bold text-slate-900">${p.specs.storage.split(' ')[0]} SSD</span>
          </div>
          <div class="p-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200/50 col-span-2">
            <span class="text-slate-400 block text-[9px]">DISPLAY / RESOLUTION</span>
            <span class="font-bold text-slate-900 truncate block">${p.specs.display.split(',')[0]}</span>
          </div>
        </div>
      </div>

      <!-- Pricing & Actions -->
      <div class="pt-4 border-t border-slate-100">
        <div class="flex items-baseline justify-between mb-3">
          <div>
            <span class="text-2xl font-black text-slate-950 font-mono">₹${p.price.toLocaleString('en-IN')}</span>
            <span class="text-xs text-slate-400 line-through font-mono ml-2">₹${p.originalPrice.toLocaleString('en-IN')}</span>
          </div>
          <span class="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
            In Stock (${p.inStock} Left)
          </span>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <a href="product-detail.html?id=${p.id}" class="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-mono font-bold text-center transition-colors">
            Full Specs & 3D →
          </a>
          <a href="https://wa.me/${STORE_CONFIG.whatsappNumber}?text=Hi%20Classic%20Computers%2C%20I%20want%20to%20order%20${encodeURIComponent(p.name)}%20(Rs%20${p.price.toLocaleString('en-IN')})" 
             target="_blank" 
             class="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold text-center transition-all flex items-center justify-center gap-1.5 shadow-sm">
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

    </div>
  `;
}

const productsHtml = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth antialiased">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>Products | Certified Refurbished Laptops & Desktops | Classic Computers</title>
  <meta name="description" content="Explore Classic Computers certified refurbished corporate inventory. Dell Precision, ThinkPad, HP EliteBook, and Desktop PCs at 70% off showroom retail with 6-12 months warranty.">
  <link rel="canonical" href="https://classiccomputers.in/products.html">

  <!-- OpenGraph / Social Metadata -->
  <meta property="og:title" content="Products Catalog | Classic Computers">
  <meta property="og:description" content="Certified enterprise laptops & commercial desktops tested with 6-12 months warranty.">
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
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          },
          boxShadow: {
            'ios-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.8)',
            'ios-card': '0 20px 40px -15px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04)',
            'ios-elevated': '0 30px 60px -12px rgba(0, 0, 0, 0.12), 0 18px 36px -18px rgba(0, 0, 0, 0.08)',
          }
        }
      }
    }
  </script>

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

<body class="bg-slate-50 text-slate-900 selection:bg-cyan-500 selection:text-white font-sans antialiased relative min-h-screen overflow-x-hidden">

  ${getSharedNav('products')}

  <!-- Page Breadcrumbs -->
  <div class="bg-slate-100/60 border-b border-slate-200/60 pt-32 sm:pt-36 pb-3">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs font-mono text-slate-500">
      <a href="index.html" class="hover:text-cyan-600 transition-colors">Home</a>
      <span>/</span>
      <span class="text-slate-900 font-bold">Products (Certified Catalog)</span>
    </div>
  </div>

  <!-- Products Catalog Hero & Controls Header -->
  <section class="py-12 bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-mono font-bold mb-2">
            📦 OFFICIAL PRODUCTS CATALOG // 8+ CERTIFIED MODELS
          </span>
          <h1 class="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Certified Refurbished Products
          </h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-normal">
            Every device is 32-point tested in our Etah facility, restored with genuine components, fresh thermal paste, and backed by a 6–12 months replacement warranty.
          </p>
        </div>

        <!-- Quick Help Helpline Badge -->
        <div class="flex items-center gap-3 p-3 px-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-mono">
          <span class="text-lg">💬</span>
          <div>
            <div class="text-[10px] text-emerald-800 uppercase font-bold">Need Help Choosing?</div>
            <a href="https://wa.me/${STORE_CONFIG.whatsappNumber}?text=Hi%20Classic%20Computers%2C%20please%20recommend%20a%20laptop%20based%20on%20my%20budget." target="_blank" class="text-emerald-700 font-bold hover:underline">
              Ask Our Hardware Tech on WhatsApp →
            </a>
          </div>
        </div>
      </div>

      <!-- Live Search & Interactive Filter Controls -->
      <div class="ios-liquid-glass p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
        
        <!-- Search Input Bar -->
        <div class="relative">
          <input type="text" id="catalog-search-input" 
                 placeholder="Search by brand (Dell, ThinkPad, HP), processor (i7), RAM, SSD, or workflow (coding, 4k)..." 
                 class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm font-mono border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all shadow-sm">
          <svg class="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>

        <!-- Filter Pills & Sorting Strip -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
          
          <!-- Category Filter Pills -->
          <div class="flex flex-wrap items-center gap-2" id="category-pills">
            <button type="button" class="filter-btn active px-4 py-2 rounded-full text-xs font-mono font-bold bg-slate-900 text-white transition-all" data-filter="all">
              All Products (${PRODUCTS.length})
            </button>
            <button type="button" class="filter-btn px-4 py-2 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all" data-filter="laptop">
              Laptops (${PRODUCTS.filter(p => p.deviceType === 'laptop').length})
            </button>
            <button type="button" class="filter-btn px-4 py-2 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all" data-filter="desktop">
              Desktops (${PRODUCTS.filter(p => p.deviceType === 'desktop').length})
            </button>
            <button type="button" class="filter-btn px-4 py-2 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all" data-filter="under25k">
              Under ₹25,000 (${PRODUCTS.filter(p => p.price < 25000).length})
            </button>
            <button type="button" class="filter-btn px-4 py-2 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all" data-filter="workstation">
              Workstations (4K / CAD)
            </button>
          </div>

          <!-- Sort Dropdown -->
          <div class="flex items-center gap-2 text-xs font-mono text-slate-600">
            <span>Sort By:</span>
            <select id="catalog-sort-select" class="bg-white text-slate-800 text-xs font-mono py-1.5 px-3 rounded-xl border border-slate-300 focus:border-cyan-500 outline-none shadow-sm">
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

        </div>

      </div>

    </div>
  </section>

  <!-- Products Catalog Grid Section -->
  <section class="py-16 bg-slate-50 min-h-[500px]" id="catalog-grid-section">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Counter Status -->
      <div class="flex items-center justify-between mb-6 text-xs font-mono text-slate-500">
        <span id="product-count-label">Showing all ${PRODUCTS.length} certified units</span>
        <span class="text-emerald-600 font-bold">● All models ready for immediate dispatch</span>
      </div>

      <!-- Product Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="products-grid">
        ${PRODUCTS.map(renderProductGridCard).join('\n')}
      </div>

      <!-- No Results Placeholder (Hidden by Default) -->
      <div id="no-results-box" class="hidden text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div class="text-4xl mb-3">🔍</div>
        <h3 class="text-lg font-bold text-slate-900">No matching machines found</h3>
        <p class="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          We couldn't find any certified unit matching your exact search. You can ask our hardware technician on WhatsApp for custom orders.
        </p>
        <a href="https://wa.me/${STORE_CONFIG.whatsappNumber}?text=Hi%20Classic%20Computers%2C%20I%20am%20looking%20for%20a%20specific%20laptop%20model." target="_blank" class="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold shadow-md">
          <span>Inquire Custom Stock on WhatsApp</span>
        </a>
      </div>

    </div>
  </section>

  <!-- Flagship Highlight Spotlight in Products Page -->
  <section class="py-16 bg-slate-950 text-white border-t border-slate-800">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
        <div class="max-w-xl">
          <span class="px-3 py-1 rounded-full bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold inline-block mb-3">
            ⭐ FEATURED WORKSTATION
          </span>
          <h2 class="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Dell Precision 5530 4K UHD Workstation
          </h2>
          <p class="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Intel Core i7-8850H 6-Core, 4GB NVIDIA Quadro GPU, and 100% AdobeRGB 4K touch screen with 8K studio photography. Pristine Grade A+ condition for high-end video editors and CAD professionals.
          </p>
          <div class="mt-4 flex items-baseline gap-3">
            <span class="text-3xl font-black text-white font-mono">₹34,999</span>
            <span class="text-sm text-slate-500 line-through font-mono">₹1,85,000</span>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">Save 81%</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <a href="product-detail.html?id=dell-5530-flagship" class="py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-mono font-bold text-xs text-center transition-all shadow-md">
            View 8K Gallery & Specs →
          </a>
          <a href="https://wa.me/${STORE_CONFIG.whatsappNumber}?text=Hi%20Classic%20Computers%2C%20I%20want%20to%20order%20Dell%20Precision%205530%20(Rs%2034%2C999)" target="_blank" class="py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs text-center transition-all shadow-lg flex items-center justify-center gap-2">
            <span>💬 Buy on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  </section>

  ${getSharedFooter()}

  <!-- Client-side Search and Filter Script -->
  <script>
    const searchInput = document.getElementById('catalog-search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('catalog-sort-select');
    const productCards = Array.from(document.querySelectorAll('.product-catalog-card'));
    const gridContainer = document.getElementById('products-grid');
    const noResultsBox = document.getElementById('no-results-box');
    const countLabel = document.getElementById('product-count-label');

    let activeFilter = 'all';
    let searchQuery = '';

    function filterAndSort() {
      let visibleCards = productCards.filter(card => {
        const matchesSearch = !searchQuery || card.getAttribute('data-search').includes(searchQuery);
        let matchesCategory = true;

        if (activeFilter === 'laptop') matchesCategory = card.getAttribute('data-device-type') === 'laptop';
        else if (activeFilter === 'desktop') matchesCategory = card.getAttribute('data-device-type') === 'desktop';
        else if (activeFilter === 'under25k') matchesCategory = parseFloat(card.getAttribute('data-price')) < 25000;
        else if (activeFilter === 'workstation') matchesCategory = card.getAttribute('data-category') === 'workstation' || card.getAttribute('data-search').includes('4k');

        return matchesSearch && matchesCategory;
      });

      // Sorting
      const sortVal = sortSelect.value;
      if (sortVal === 'price-low') {
        visibleCards.sort((a, b) => parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price')));
      } else if (sortVal === 'price-high') {
        visibleCards.sort((a, b) => parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price')));
      }

      // DOM Update
      productCards.forEach(c => c.style.display = 'none');
      visibleCards.forEach(c => {
        c.style.display = 'flex';
        gridContainer.appendChild(c);
      });

      if (visibleCards.length === 0) {
        noResultsBox.classList.remove('hidden');
      } else {
        noResultsBox.classList.add('hidden');
      }

      if (countLabel) {
        countLabel.textContent = 'Showing ' + visibleCards.length + ' certified unit' + (visibleCards.length === 1 ? '' : 's');
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        if (searchQuery) {
          activeFilter = 'all';
          filterBtns.forEach(b => {
            if (b.getAttribute('data-filter') === 'all') {
              b.classList.add('active', 'bg-slate-900', 'text-white');
              b.classList.remove('bg-slate-100', 'text-slate-700');
            } else {
              b.classList.remove('active', 'bg-slate-900', 'text-white');
              b.classList.add('bg-slate-100', 'text-slate-700');
            }
          });
        }
        filterAndSort();
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active', 'bg-slate-900', 'text-white');
          b.classList.add('bg-slate-100', 'text-slate-700');
        });
        btn.classList.add('active', 'bg-slate-900', 'text-white');
        btn.classList.remove('bg-slate-100', 'text-slate-700');

        activeFilter = btn.getAttribute('data-filter');
        filterAndSort();
      });
    });

    if (sortSelect) {
      sortSelect.addEventListener('change', filterAndSort);
    }
  </script>
</body>
</html>`;

fs.writeFileSync(path.resolve('products.html'), productsHtml, 'utf8');
console.log('Successfully generated products.html (Dedicated Products Page)');
