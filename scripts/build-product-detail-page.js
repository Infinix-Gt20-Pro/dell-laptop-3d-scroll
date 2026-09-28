const fs = require('fs');
const path = require('path');
const { STORE_CONFIG, PRODUCTS, getSharedNav, getSharedFooter } = require('./store-shared-templates');

const detailHtml = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth antialiased">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>Product Details | Classic Computers</title>
  <meta name="description" content="View full technical specifications, 8K photo gallery, and 32-point inspection report for certified refurbished laptops at Classic Computers.">
  <link rel="canonical" href="https://classiccomputers.in/product-detail.html">

  <!-- OpenGraph / Social Metadata -->
  <meta property="og:title" content="Certified Laptop Specifications | Classic Computers">
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
      <a href="products.html" class="hover:text-cyan-600 transition-colors">Products</a>
      <span>/</span>
      <span id="breadcrumb-product-title" class="text-slate-900 font-bold truncate max-w-xs sm:max-w-md">Dell Precision 5530 4K Workstation</span>
    </div>
  </div>

  <!-- Main Product Detail Viewport -->
  <section class="py-12 bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <!-- Left: Image Gallery & Thumbnails (5 cols) -->
        <div class="lg:col-span-6 space-y-4">
          
          <!-- Main Display Stage -->
          <div class="relative w-full h-80 sm:h-[420px] rounded-3xl bg-slate-900 overflow-hidden flex items-center justify-center p-4 border border-slate-200 shadow-ios-card group">
            <img id="detail-main-img" src="assets/images/dell-5530/dell_5530_cafe.jpg" alt="Product Image" class="max-h-full max-w-full object-contain transition-all duration-300 group-hover:scale-105">
            
            <div class="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 text-cyan-300 font-mono text-[11px] backdrop-blur-md border border-cyan-500/30">
              8K Master Photography
            </div>

            <div class="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-emerald-500/90 text-white font-mono text-[11px] font-bold backdrop-blur-md shadow-md">
              ✓ 32-Point Inspected & Verified
            </div>
          </div>

          <!-- Thumbnails Strip -->
          <div class="flex items-center gap-3 overflow-x-auto pb-2" id="detail-thumbnails-container">
            <!-- Dynamically populated by JS -->
          </div>

          <!-- 32-Point QC Checklist Quick Badges -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2 text-xs font-mono text-slate-700">
            <div class="flex items-center gap-1.5">
              <span class="text-emerald-600 font-bold">✓</span>
              <span>Screen: 0 Dead Pixels</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-emerald-600 font-bold">✓</span>
              <span>Battery: 90%+ Health</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-emerald-600 font-bold">✓</span>
              <span>Thermals: Repasted</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-emerald-600 font-bold">✓</span>
              <span>Genuine OEM Charger</span>
            </div>
          </div>

        </div>

        <!-- Right: Specs, Pricing & WhatsApp Order Form (7 cols) -->
        <div class="lg:col-span-6 space-y-6">
          
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span id="detail-grade-badge" class="px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-mono font-bold border border-cyan-200">
                Grade A+ (Pristine Condition)
              </span>
              <span id="detail-stock-badge" class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold">
                ● 5 Units In Stock (Etah Showroom)
              </span>
            </div>

            <h1 id="detail-product-title" class="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
              Dell Precision 5530 4K UHD Mobile Workstation
            </h1>

            <p id="detail-best-for" class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Engineered for 4K video editing (Premiere Pro, DaVinci Resolve), architectural AutoCAD, 3D Blender modeling, and intensive corporate multitasking.
            </p>
          </div>

          <!-- Pricing Block -->
          <div class="p-5 rounded-2xl bg-slate-100/80 border border-slate-200 flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <span class="text-xs font-mono text-slate-500 block">Offer Price (All Taxes & Pan-India Courier Included):</span>
              <div class="flex items-baseline gap-3 mt-1">
                <span id="detail-price-display" class="text-3xl sm:text-4xl font-black text-slate-950 font-mono">₹34,999</span>
                <span id="detail-original-price" class="text-sm text-slate-400 line-through font-mono">₹1,85,000</span>
                <span id="detail-discount-badge" class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                  Save 81%
                </span>
              </div>
            </div>
            <div class="text-right text-[11px] font-mono text-slate-500">
              <div>Invoice: GST Registered</div>
              <div class="text-emerald-700 font-bold">GSTIN: ${STORE_CONFIG.gstNumber}</div>
            </div>
          </div>

          <!-- Live Configuration Options -->
          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 class="text-xs font-mono font-bold text-slate-900 uppercase tracking-widest">
              Customize RAM & Storage Upgrades
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-mono text-slate-600 mb-1">RAM Selection:</label>
                <select id="detail-ram-select" class="w-full bg-slate-50 text-slate-900 text-xs font-mono p-2.5 rounded-xl border border-slate-300 focus:border-cyan-500 outline-none">
                  <option value="16" selected>16GB DDR4 High-Speed (Included)</option>
                  <option value="32">32GB DDR4 High-Speed (+₹3,500)</option>
                  <option value="64">64GB DDR4 Dual-Channel (+₹7,500)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-mono text-slate-600 mb-1">NVMe SSD Selection:</label>
                <select id="detail-ssd-select" class="w-full bg-slate-50 text-slate-900 text-xs font-mono p-2.5 rounded-xl border border-slate-300 focus:border-cyan-500 outline-none">
                  <option value="512" selected>512GB Fast NVMe SSD (Included)</option>
                  <option value="1024">1TB (1024GB) Ultra NVMe SSD (+₹3,000)</option>
                  <option value="2048">2TB (2048GB) Enterprise NVMe SSD (+₹6,500)</option>
                </select>
              </div>
            </div>

            <!-- Instant Actions -->
            <div class="pt-2 flex flex-col sm:flex-row gap-3">
              <a id="detail-whatsapp-btn" href="#" target="_blank" class="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs text-center transition-all shadow-lg flex items-center justify-center gap-2">
                <span>💬 Order on WhatsApp (+91 94121 82786)</span>
              </a>
              <a href="tel:${STORE_CONFIG.supportPhone.replace(/\s+/g, '')}" class="py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs text-center transition-all flex items-center justify-center gap-2">
                <span>📞 Call Store</span>
              </a>
            </div>
          </div>

          <!-- Store Trust Guarantee Banner -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-cyan-600">🏬</span>
              <span><strong>Physical Store Pickup:</strong> Classic Computers, Near Railway Rd / GT Rd, Etah (UP).</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-purple-600">🚚</span>
              <span><strong>Pan-India Courier:</strong> Dispatched in heavy double-wall padded protective boxes.</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-emerald-600">🛡️</span>
              <span><strong>Warranty:</strong> 6 Months full store replacement warranty + 7 days return policy.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  </section>

  <!-- Detailed Technical Specifications Table -->
  <section class="py-16 bg-slate-50 border-b border-slate-200">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center mb-10">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-mono font-bold mb-2">
          📋 COMPLETE TECHNICAL SPECIFICATIONS
        </span>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Hardware Architecture & Build Details
        </h2>
      </div>

      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden" id="detail-specs-table-container">
        <!-- Dynamically rendered table -->
      </div>

    </div>
  </section>

  ${getSharedFooter()}

  <!-- Product Detail Script -->
  <script src="js/products-data.js"></script>
  <script>
    // Extract query parameter ?id=...
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('id') || 'dell-5530-flagship';

    // Find product in PRODUCTS array
    const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];

    // Populate Page Elements
    document.title = product.name + ' | Classic Computers';
    document.getElementById('breadcrumb-product-title').textContent = product.shortName;
    document.getElementById('detail-product-title').textContent = product.name;
    document.getElementById('detail-best-for').textContent = product.bestFor;
    document.getElementById('detail-grade-badge').textContent = product.grade;
    document.getElementById('detail-stock-badge').textContent = '● ' + product.inStock + ' Units In Stock (Etah Showroom)';
    document.getElementById('detail-original-price').textContent = '₹' + product.originalPrice.toLocaleString('en-IN');
    document.getElementById('detail-discount-badge').textContent = 'Save ' + product.discountPercentage + '%';

    // Image Stage & Thumbnails
    const mainImg = document.getElementById('detail-main-img');
    const thumbsContainer = document.getElementById('detail-thumbnails-container');

    mainImg.src = product.images[0] || product.thumbnail;

    thumbsContainer.innerHTML = '';
    product.images.forEach((imgUrl, idx) => {
      const thumbBtn = document.createElement('button');
      thumbBtn.type = 'button';
      thumbBtn.className = 'w-16 h-16 rounded-xl bg-slate-100 p-1 border ' + (idx === 0 ? 'border-cyan-500 ring-2 ring-cyan-200' : 'border-slate-200') + ' flex-shrink-0 overflow-hidden transition-all';
      thumbBtn.innerHTML = '<img src="' + imgUrl + '" class="w-full h-full object-contain">';
      thumbBtn.addEventListener('click', () => {
        document.querySelectorAll('#detail-thumbnails-container button').forEach(b => {
          b.className = 'w-16 h-16 rounded-xl bg-slate-100 p-1 border border-slate-200 flex-shrink-0 overflow-hidden transition-all';
        });
        thumbBtn.className = 'w-16 h-16 rounded-xl bg-slate-100 p-1 border border-cyan-500 ring-2 ring-cyan-200 flex-shrink-0 overflow-hidden transition-all';
        mainImg.style.opacity = '0.3';
        setTimeout(() => {
          mainImg.src = imgUrl;
          mainImg.style.opacity = '1';
        }, 120);
      });
      thumbsContainer.appendChild(thumbBtn);
    });

    // Specs Table Population
    const tableContainer = document.getElementById('detail-specs-table-container');
    const specs = product.specs;
    const specRows = [
      ['Processor (CPU)', specs.processor],
      ['System Memory (RAM)', specs.ram],
      ['Storage Drive (SSD)', specs.storage],
      ['Graphics / GPU', specs.gpu],
      ['Display Screen', specs.display],
      ['Chassis & Build', specs.chassis],
      ['I/O Ports', specs.ports],
      ['Battery Condition', specs.battery],
      ['Operating System', specs.os],
      ['Form Factor Weight', specs.weight]
    ];

    let tableHtml = '<table class="w-full text-left text-xs font-mono">';
    tableHtml += '<tbody class="divide-y divide-slate-100">';
    specRows.forEach(([key, val], idx) => {
      tableHtml += '<tr class="' + (idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70') + '">';
      tableHtml += '<td class="py-3 px-5 font-bold text-slate-900 w-1/3 border-r border-slate-100">' + key + '</td>';
      tableHtml += '<td class="py-3 px-5 text-slate-700">' + (val || 'Standard Enterprise Specification') + '</td>';
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table>';
    tableContainer.innerHTML = tableHtml;

    // Configurator Logic
    const ramSel = document.getElementById('detail-ram-select');
    const ssdSel = document.getElementById('detail-ssd-select');
    const priceDisplay = document.getElementById('detail-price-display');
    const waBtn = document.getElementById('detail-whatsapp-btn');

    function updatePrice() {
      let currentPrice = product.price;
      const ramVal = ramSel.value;
      const ssdVal = ssdSel.value;

      if (ramVal === '32') currentPrice += 3500;
      if (ramVal === '64') currentPrice += 7500;

      if (ssdVal === '1024') currentPrice += 3000;
      if (ssdVal === '2048') currentPrice += 6500;

      priceDisplay.textContent = '₹' + currentPrice.toLocaleString('en-IN');

      const waText = 'Hi Classic Computers, I would like to order the ' + product.name + ' with ' + ramVal + 'GB RAM and ' + (ssdVal >= 1024 ? (ssdVal/1024) + 'TB' : ssdVal + 'GB') + ' SSD for Rs ' + currentPrice.toLocaleString('en-IN') + '. Please confirm stock and delivery to my address: ...';
      waBtn.href = 'https://wa.me/${STORE_CONFIG.whatsappNumber}?text=' + encodeURIComponent(waText);
    }

    if (ramSel) ramSel.addEventListener('change', updatePrice);
    if (ssdSel) ssdSel.addEventListener('change', updatePrice);
    updatePrice();
  </script>
</body>
</html>`;

fs.writeFileSync(path.resolve('product-detail.html'), detailHtml, 'utf8');
console.log('Successfully generated product-detail.html (Dedicated Product Detail Page)');
