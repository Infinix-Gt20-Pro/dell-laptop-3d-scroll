/**
 * Classic Computer - Dedicated Products Catalog Controller (products.html)
 * High-performance faceted filtering, search, sorting, quick view & configurator (Apple Light Theme)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Store state
  let activeCategory = 'all';
  let activeBrand = 'all';
  let activeCpu = 'all';
  let maxPrice = 75000;
  let onlyDedicatedGpu = false;
  let searchQuery = '';
  let sortBy = 'featured';

  // DOM Elements
  const catalogGrid = document.getElementById('products-grid');
  const resultCountEl = document.getElementById('catalog-result-count');
  const searchInput = document.getElementById('search-catalog-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const priceSlider = document.getElementById('price-filter-slider');
  const priceDisplay = document.getElementById('price-filter-display');
  const categoryPills = document.querySelectorAll('.category-filter-btn');
  const brandPills = document.querySelectorAll('.brand-filter-btn');
  const cpuSelect = document.getElementById('cpu-filter-select');
  const gpuCheckbox = document.getElementById('gpu-filter-checkbox');
  const sortSelect = document.getElementById('sort-select');
  const resetBtn = document.getElementById('reset-filters-btn');

  // Quick View Modal Elements
  const quickViewModal = document.getElementById('product-quick-view-modal');
  let currentModalProduct = null;
  let selectedModalRam = null;
  let selectedModalSsd = null;

  // Render Filtered Catalog
  function renderCatalog() {
    if (!catalogGrid) return;

    let filtered = PRODUCTS.filter(product => {
      // Category filter
      if (activeCategory !== 'all' && product.category !== activeCategory) return false;
      // Brand filter
      if (activeBrand !== 'all' && product.brand.toLowerCase() !== activeBrand.toLowerCase()) return false;
      // CPU filter
      if (activeCpu !== 'all') {
        const cpuText = (product.specs.processor || '').toLowerCase();
        if (activeCpu === 'i7-h' && (!cpuText.includes('h') || !cpuText.includes('i7'))) return false;
        if (activeCpu === 'i7-u' && (!cpuText.includes('u') || !cpuText.includes('i7'))) return false;
        if (activeCpu === 'i5' && !cpuText.includes('i5')) return false;
        if (activeCpu === 'apple' && !product.brand.toLowerCase().includes('apple')) return false;
      }
      // Price slider
      if (product.price > maxPrice) return false;
      // Dedicated GPU
      if (onlyDedicatedGpu) {
        const gpuText = (product.specs.gpu || '').toLowerCase();
        const isDedicated = gpuText.includes('dedicated') || gpuText.includes('nvidia') || gpuText.includes('radeon') || gpuText.includes('quadro') || gpuText.includes('rtx') || gpuText.includes('gtx');
        if (!isDedicated) return false;
      }
      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q) || product.shortName.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesSpecs = Object.values(product.specs).some(val => String(val).toLowerCase().includes(q));
        if (!matchesName && !matchesBrand && !matchesSpecs) return false;
      }
      return true;
    });

    // Sorting
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'discount') {
      filtered.sort((a, b) => b.discountPercentage - a.discountPercentage);
    }

    // Update result count
    if (resultCountEl) {
      resultCountEl.textContent = `Showing ${filtered.length} of ${PRODUCTS.length} Certified Machines`;
    }

    // Empty state
    if (filtered.length === 0) {
      catalogGrid.innerHTML = `
        <div class="col-span-full py-20 text-center specular-card rounded-3xl p-8 bg-white border border-slate-200">
          <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-cyan-600">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900">No Matching Machines Found</h3>
          <p class="text-sm text-slate-500 mt-2 max-w-md mx-auto">Try widening your budget filter, clearing the dedicated GPU restriction, or searching for broader terms like "Dell" or "ThinkPad".</p>
          <button onclick="window.resetAllFilters()" class="mt-6 apple-action-btn px-6 py-2.5 text-xs font-bold">Reset All Filters</button>
        </div>
      `;
      return;
    }

    catalogGrid.innerHTML = filtered.map(product => {
      const isWish = storeEngine.isWishlisted(product.id);
      const savings = product.originalPrice - product.price;
      const isDellFlagship = product.id === 'dell-5530-flagship';

      return `
        <div class="specular-card group flex flex-col justify-between overflow-hidden p-5 transition-all duration-300 bg-white border border-slate-200">
          
          <!-- Card Top: Badges & Wishlist -->
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${isDellFlagship ? 'bg-cyan-100 text-cyan-800 border border-cyan-300' : 'bg-slate-100 text-slate-700 border border-slate-200'}">
                  ${product.badge}
                </span>
                <span class="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold">
                  ${product.grade}
                </span>
              </div>
              <button 
                onclick="storeEngine.toggleWishlist(PRODUCTS.find(p=>p.id==='${product.id}'))" 
                data-wishlist-id="${product.id}"
                title="Save to Wishlist"
                class="w-8 h-8 rounded-full apple-secondary-glass-btn flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
              >
                <svg class="w-4 h-4" fill="${isWish ? '#f43f5e' : 'none'}" stroke="${isWish ? '#f43f5e' : 'currentColor'}" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              </button>
            </div>

            <!-- Thumbnail Image -->
            <div class="relative h-48 w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-200 cursor-pointer group-hover:border-cyan-500/40 transition-all mb-4" onclick="window.openQuickView('${product.id}')">
              <img 
                src="${product.thumbnail}" 
                alt="${product.name}" 
                loading="lazy"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
              
              <!-- Quick specs overlay -->
              <div class="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-cyan-300">
                <span class="flex items-center gap-1 text-white font-bold">
                  ⭐ ${product.rating} <span class="text-slate-300 font-normal">(${product.reviewsCount})</span>
                </span>
                <span class="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-white border border-white/20 font-bold">
                  ${product.brand}
                </span>
              </div>
            </div>

            <!-- Title & Model -->
            <h3 class="text-base font-extrabold text-slate-900 leading-snug group-hover:text-cyan-600 transition-colors cursor-pointer" onclick="window.openQuickView('${product.id}')">
              ${product.name}
            </h3>

            <!-- Specs Grid Pills -->
            <div class="grid grid-cols-2 gap-1.5 my-3 text-[11px] font-mono">
              <div class="bg-slate-50 rounded-lg p-2 border border-slate-200 text-slate-700 truncate" title="${product.specs.processor}">
                <span class="text-slate-400 block text-[9px] uppercase font-bold">CPU</span>
                ${product.specs.processor.split('(')[0].replace('Intel Core ', '')}
              </div>
              <div class="bg-slate-50 rounded-lg p-2 border border-slate-200 text-slate-700 truncate" title="${product.specs.gpu}">
                <span class="text-slate-400 block text-[9px] uppercase font-bold">GPU</span>
                ${product.specs.gpu.split('+')[0].trim()}
              </div>
              <div class="bg-slate-50 rounded-lg p-2 border border-slate-200 text-slate-700 truncate">
                <span class="text-slate-400 block text-[9px] uppercase font-bold">RAM & SSD</span>
                ${product.specs.ram.split('(')[0].trim()} / ${product.specs.storage.split('(')[0].trim()}
              </div>
              <div class="bg-slate-50 rounded-lg p-2 border border-slate-200 text-slate-700 truncate" title="${product.specs.display}">
                <span class="text-slate-400 block text-[9px] uppercase font-bold">Display</span>
                ${product.specs.display.split(',')[0]}
              </div>
            </div>

            <!-- Certified Guarantee Tag -->
            <div class="flex items-center gap-2 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 mb-4 font-semibold">
              <svg class="w-3.5 h-3.5 shrink-0 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <span>6 Months Warranty • 7-Day Replace • Free Delivery</span>
            </div>
          </div>

          <!-- Card Bottom: Pricing & Actions -->
          <div class="pt-3 border-t border-slate-100">
            <div class="flex items-baseline justify-between mb-3">
              <div>
                <div class="text-2xl font-black text-slate-900 font-mono tracking-tight">
                  ₹${product.price.toLocaleString('en-IN')}
                </div>
                <div class="flex items-center gap-2 text-xs font-mono">
                  <span class="text-slate-400 line-through">₹${product.originalPrice.toLocaleString('en-IN')}</span>
                  <span class="text-emerald-600 font-bold">Save ₹${savings.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <span class="text-[10px] font-mono text-cyan-800 bg-cyan-100 font-bold px-2 py-1 rounded">
                ${product.discountPercentage}% OFF
              </span>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-2 gap-2">
              <button 
                onclick="storeEngine.addToCart(PRODUCTS.find(p=>p.id==='${product.id}'))" 
                class="apple-action-btn py-2.5 px-3 text-xs flex items-center justify-center gap-1.5 shadow-md font-bold"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                <span>Add to Bag</span>
              </button>
              
              <button 
                onclick="window.buyOnWhatsApp('${product.id}')" 
                class="apple-secondary-glass-btn py-2.5 px-3 text-xs flex items-center justify-center gap-1.5 text-emerald-700 hover:text-emerald-800 border-emerald-300 font-bold"
              >
                <span>WhatsApp</span>
              </button>
            </div>

            <!-- Configure / Quick View link -->
            <button 
              onclick="window.openQuickView('${product.id}')" 
              class="w-full mt-2 py-1.5 text-center text-[11px] font-mono text-slate-500 hover:text-cyan-700 transition-colors font-medium"
            >
              ✦ Customize RAM & SSD / View Lab Specs →
            </button>
          </div>

        </div>
      `;
    }).join('');
  }

  // Filter Event Listeners
  if (categoryPills) {
    categoryPills.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryPills.forEach(b => b.classList.remove('active', 'border-cyan-500', 'text-cyan-700', 'bg-cyan-50', 'font-bold'));
        btn.classList.add('active', 'border-cyan-500', 'text-cyan-700', 'bg-cyan-50', 'font-bold');
        activeCategory = btn.getAttribute('data-category');
        renderCatalog();
      });
    });
  }

  if (brandPills) {
    brandPills.forEach(btn => {
      btn.addEventListener('click', () => {
        brandPills.forEach(b => b.classList.remove('active', 'border-cyan-500', 'text-cyan-700', 'bg-cyan-50', 'font-bold'));
        btn.classList.add('active', 'border-cyan-500', 'text-cyan-700', 'bg-cyan-50', 'font-bold');
        activeBrand = btn.getAttribute('data-brand');
        renderCatalog();
      });
    });
  }

  if (cpuSelect) {
    cpuSelect.addEventListener('change', (e) => {
      activeCpu = e.target.value;
      renderCatalog();
    });
  }

  if (priceSlider) {
    priceSlider.addEventListener('input', (e) => {
      maxPrice = parseInt(e.target.value, 10);
      if (priceDisplay) {
        priceDisplay.textContent = `₹${maxPrice.toLocaleString('en-IN')}`;
      }
      renderCatalog();
    });
  }

  if (gpuCheckbox) {
    gpuCheckbox.addEventListener('change', (e) => {
      onlyDedicatedGpu = e.target.checked;
      renderCatalog();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      if (searchClearBtn) {
        searchClearBtn.style.display = searchQuery ? 'block' : 'none';
      }
      renderCatalog();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      searchClearBtn.style.display = 'none';
      renderCatalog();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortBy = e.target.value;
      renderCatalog();
    });
  }

  window.resetAllFilters = function() {
    activeCategory = 'all';
    activeBrand = 'all';
    activeCpu = 'all';
    maxPrice = 75000;
    onlyDedicatedGpu = false;
    searchQuery = '';
    sortBy = 'featured';

    if (searchInput) searchInput.value = '';
    if (searchClearBtn) searchClearBtn.style.display = 'none';
    if (priceSlider) priceSlider.value = 75000;
    if (priceDisplay) priceDisplay.textContent = '₹75,000';
    if (cpuSelect) cpuSelect.value = 'all';
    if (gpuCheckbox) gpuCheckbox.checked = false;
    if (sortSelect) sortSelect.value = 'featured';

    categoryPills.forEach(b => {
      b.classList.remove('active', 'border-cyan-500', 'text-cyan-700', 'bg-cyan-50', 'font-bold');
      if (b.getAttribute('data-category') === 'all') b.classList.add('active', 'border-cyan-500', 'text-cyan-700', 'bg-cyan-50', 'font-bold');
    });

    brandPills.forEach(b => {
      b.classList.remove('active', 'border-cyan-500', 'text-cyan-700', 'bg-cyan-50', 'font-bold');
      if (b.getAttribute('data-brand') === 'all') b.classList.add('active', 'border-cyan-500', 'text-cyan-700', 'bg-cyan-50', 'font-bold');
    });

    renderCatalog();
  };

  if (resetBtn) {
    resetBtn.addEventListener('click', window.resetAllFilters);
  }

  // Quick View & Configurator Modal
  window.openQuickView = function(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product || !quickViewModal) return;

    currentModalProduct = product;
    selectedModalRam = { size: "8GB", extraPrice: 0 };
    selectedModalSsd = { size: "256GB", extraPrice: 0 };

    document.getElementById('qv-title').textContent = product.name;
    document.getElementById('qv-badge').textContent = product.badge;
    document.getElementById('qv-rating').textContent = `${product.rating} (${product.reviewsCount} reviews)`;
    document.getElementById('qv-image').src = product.thumbnail;
    document.getElementById('qv-grade').textContent = product.grade;
    
    // Specs list
    const specsContainer = document.getElementById('qv-specs-list');
    if (specsContainer) {
      specsContainer.innerHTML = Object.entries(product.specs).map(([key, val]) => `
        <div class="flex items-start justify-between py-2 border-b border-slate-100 text-xs font-mono">
          <span class="text-slate-500 capitalize w-1/3">${key}:</span>
          <span class="text-slate-900 w-2/3 text-right font-medium">${val}</span>
        </div>
      `).join('');
    }

    updateQuickViewPrice();
    quickViewModal.classList.remove('hidden');
    quickViewModal.classList.add('flex');
  };

  window.closeQuickView = function() {
    if (quickViewModal) {
      quickViewModal.classList.add('hidden');
      quickViewModal.classList.remove('flex');
    }
  };

  function updateQuickViewPrice() {
    if (!currentModalProduct) return;
    const ramExtra = selectedModalRam ? selectedModalRam.extraPrice : 0;
    const ssdExtra = selectedModalSsd ? selectedModalSsd.extraPrice : 0;
    const finalPrice = currentModalProduct.price + ramExtra + ssdExtra;

    const priceEl = document.getElementById('qv-price');
    if (priceEl) priceEl.textContent = `₹${finalPrice.toLocaleString('en-IN')}`;
  }

  // Configurator options in modal
  window.selectQvRam = function(size, extra) {
    selectedModalRam = { size, extraPrice: extra };
    document.querySelectorAll('.qv-ram-btn').forEach(b => {
      b.classList.remove('border-cyan-500', 'text-cyan-700', 'bg-cyan-50', 'font-bold');
      if (b.getAttribute('data-ram') === size) {
        b.classList.add('border-cyan-500', 'text-cyan-700', 'bg-cyan-50', 'font-bold');
      }
    });
    updateQuickViewPrice();
  };

  window.selectQvSsd = function(size, extra) {
    selectedModalSsd = { size, extraPrice: extra };
    document.querySelectorAll('.qv-ssd-btn').forEach(b => {
      b.classList.remove('border-cyan-500', 'text-cyan-700', 'bg-cyan-50', 'font-bold');
      if (b.getAttribute('data-ssd') === size) {
        b.classList.add('border-cyan-500', 'text-cyan-700', 'bg-cyan-50', 'font-bold');
      }
    });
    updateQuickViewPrice();
  };

  window.addQvToCart = function() {
    if (!currentModalProduct) return;
    const ramExtra = selectedModalRam ? selectedModalRam.extraPrice : 0;
    const ssdExtra = selectedModalSsd ? selectedModalSsd.extraPrice : 0;
    
    const customizedProduct = {
      ...currentModalProduct,
      customRam: selectedModalRam ? selectedModalRam.size : null,
      customSsd: selectedModalSsd ? selectedModalSsd.size : null,
      customPrice: currentModalProduct.price + ramExtra + ssdExtra
    };

    storeEngine.addToCart(customizedProduct);
    closeQuickView();
  };

  window.buyOnWhatsApp = function(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const message = `Hello Classic Computer Team!\n\nI want to purchase the certified refurbished laptop:\n*${product.name}*\nPrice: ₹${product.price.toLocaleString('en-IN')}\nSpecs: ${product.specs.processor} | ${product.specs.ram} | ${product.specs.storage} | ${product.specs.gpu}\n\nPlease share delivery details and payment options!`;
    
    const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Check URL query parameters (e.g., ?category=workstation or ?search=dell)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('category')) {
    const cat = urlParams.get('category');
    activeCategory = cat;
    categoryPills.forEach(b => {
      if (b.getAttribute('data-category') === cat) {
        b.click();
      }
    });
  }
  if (urlParams.has('brand')) {
    activeBrand = urlParams.get('brand');
  }
  if (urlParams.has('search')) {
    searchQuery = urlParams.get('search');
    if (searchInput) searchInput.value = searchQuery;
  }

  // Mobile Navigation Drawer Controller for products.html
  const pMobileBtn = document.getElementById('products-mobile-menu-btn');
  const pMobileDrawer = document.getElementById('products-mobile-nav-drawer');
  const pMobileClose = document.getElementById('products-mobile-menu-close');

  if (pMobileBtn && pMobileDrawer) {
    pMobileBtn.addEventListener('click', () => {
      pMobileDrawer.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
    if (pMobileClose) {
      pMobileClose.addEventListener('click', () => {
        pMobileDrawer.classList.add('hidden');
        document.body.style.overflow = '';
      });
    }
  }

  // Initial render
  renderCatalog();

  // Apple Liquid Glass UI Engine Init
  if (window.LiquidGlass && typeof window.LiquidGlass.init === 'function') {
    window.LiquidGlass.init({
      selector: '.ultra-glass, .specular-card, .apple-action-btn, .apple-secondary-glass-btn, .liquid-glass',
      gradientBlur: true,
      blurSize: 28
    });
  }
});
