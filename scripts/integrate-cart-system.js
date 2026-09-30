const fs = require('fs');
const path = require('path');
const { getSharedCartDrawerHtml, PRODUCTS, STORE_CONFIG } = require('./store-shared-templates');

const cartDrawerHtml = getSharedCartDrawerHtml();

// Navbar cart pill HTML
const navbarCartPill = `
          <!-- Shopping Bag Glass Pill -->
          <button type="button" data-action="open-cart" 
                  class="ios27-pill-cart relative inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-slate-800 text-xs font-mono font-bold hover:text-cyan-700 rounded-2xl bg-white/70 hover:bg-white border border-white/80 shadow-sm transition-all" 
                  aria-label="Open Shopping Bag">
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <span class="hidden sm:inline">Bag</span>
            <span class="cart-badge px-1.5 py-0.5 rounded-full bg-cyan-600 text-white text-[9px] sm:text-[10px] font-mono font-bold flex items-center justify-center border-2 border-white shadow-xs ml-0.5" style="display:none;">0</span>
          </button>`;

// Mobile drawer cart button HTML
const mobileDrawerCartBtn = `
          <button type="button" data-action="open-cart" onclick="document.getElementById('mobile-drawer').classList.add('hidden')" class="w-full text-left px-4 py-2.5 rounded-2xl bg-white/80 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-between">
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              <span>Shopping Bag</span>
            </span>
            <span class="cart-badge text-[10px] bg-cyan-600 text-white px-2 py-0.5 rounded-full font-mono font-bold" style="display:none;">0</span>
          </button>`;

function processHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Add Navbar Cart Pill before mobile-menu-toggle if not present
  if (!content.includes('ios27-pill-cart') && content.includes('id="mobile-menu-toggle"')) {
    content = content.replace(
      /(\s*<!-- Mobile Glass Drawer Toggle Button -->\s*<button id="mobile-menu-toggle")/,
      `${navbarCartPill}\n\n$1`
    );
    modified = true;
  }

  // 2. Add Mobile Drawer Cart Button if not present
  if (!content.includes('Shopping Bag</span>') && content.includes('id="mobile-drawer"')) {
    content = content.replace(
      /(<div class="flex flex-col gap-2 pt-1">\s*<button onclick="window\.openLucidAuthModal\('google'\)"[^>]*>[\s\S]*?<\/button>)/,
      `$1\n${mobileDrawerCartBtn}`
    );
    modified = true;
  }

  // 3. Inject Cart Drawer HTML if not present
  if (!content.includes('id="cart-drawer"')) {
    if (content.includes('id="lucid-auth-overlay"')) {
      // Put right before or after auth modal
      content = content.replace(
        /(<div id="lucid-auth-overlay"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/,
        `$1\n\n${cartDrawerHtml}`
      );
      modified = true;
    } else if (content.includes('</body>')) {
      content = content.replace('</body>', `${cartDrawerHtml}\n</body>`);
      modified = true;
    }
  }

  // 4. Inject js/cart-auth.js script tag if not present
  if (!content.includes('src="js/cart-auth.js"')) {
    if (content.includes('src="js/auth-system.js"')) {
      content = content.replace(
        '<script src="js/auth-system.js"></script>',
        '<script src="js/cart-auth.js"></script>\n  <script src="js/auth-system.js"></script>'
      );
      modified = true;
    } else if (content.includes('</body>')) {
      content = content.replace('</body>', '  <script src="js/cart-auth.js"></script>\n</body>');
      modified = true;
    }
  }

  return { content, modified };
}

// Update index.html
console.log('Processing index.html...');
let indexResult = processHtmlFile(path.resolve('index.html'));
let indexContent = indexResult.content;

// Add Add to Bag button to index.html receipt builder if not present
if (!indexContent.includes('id="receipt-add-bag-btn"') && indexContent.includes('id="receipt-wa-link"')) {
  indexContent = indexContent.replace(
    /(<a id="receipt-wa-link"[^>]*>[\s\S]*?<\/a>)/,
    `<div class="flex flex-col sm:flex-row gap-2.5">\n              <button type="button" id="receipt-add-bag-btn" class="flex-1 py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs text-center transition-all flex items-center justify-center gap-2 shadow-sm">\n                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>\n                <span>Add to Bag</span>\n              </button>\n              $1\n            </div>`
  );
  
  // Wire listener
  const receiptScript = `
    const receiptAddBagBtn = document.getElementById('receipt-add-bag-btn');
    if (receiptAddBagBtn) {
      receiptAddBagBtn.addEventListener('click', () => {
        if (!window.storeEngine) return;
        const ramVal = ramSelect ? ramSelect.value : '16';
        const ssdVal = ssdSelect ? parseInt(ssdSelect.value) : 512;
        const warVal = warrantySelect ? warrantySelect.value : '6';
        const total = 34999 + (ramVal === '32' ? 3500 : (ramVal === '64' ? 7500 : 0)) + 
          (ssdVal === 1024 ? 3000 : (ssdVal === 2048 ? 6500 : 0)) + (warVal === '12' ? 1999 : 0);
        
        const customSpecs = {
          ram: ramVal + 'GB DDR4 RAM',
          storage: (ssdVal >= 1024 ? (ssdVal/1024) + 'TB' : ssdVal + 'GB') + ' NVMe SSD',
          warranty: warVal + ' Months ' + (warVal === '12' ? 'Extended Protection' : 'Store Replacement')
        };
        
        const p0 = (typeof PRODUCTS !== 'undefined' && PRODUCTS[0]) ? PRODUCTS[0] : {
          id: 'dell-5530-flagship',
          name: 'Dell Precision / Latitude 5530 4K Workstation',
          shortName: 'Dell Precision 5530',
          thumbnail: 'assets/images/dell-5530/front.png',
          grade: 'Grade A+ Corporate Refurbished'
        };
        
        window.storeEngine.addToCart({
          ...p0,
          price: total
        }, customSpecs);
      });
    }
  `;
  indexContent = indexContent.replace('</script>\n</body>', `${receiptScript}\n  </script>\n</body>`);
  indexResult.modified = true;
}

fs.writeFileSync(path.resolve('index.html'), indexContent, 'utf8');
console.log('Updated index.html successfully!');

// Update products.html
console.log('Processing products.html...');
let productsResult = processHtmlFile(path.resolve('products.html'));
let productsContent = productsResult.content;

// Add Add to Bag button on catalog cards in products.html
PRODUCTS.forEach(p => {
  const cardLinkTarget = `href="product-detail.html?id=${p.id}"`;
  const bagButtonMarker = `onclick="if(window.storeEngine) window.storeEngine.addToCart(PRODUCTS.find(x=>x.id==='${p.id}'))"`;
  
  if (productsContent.includes(cardLinkTarget) && !productsContent.includes(bagButtonMarker)) {
    // Locate the grid enclosing the actions for this card
    const regex = new RegExp(`(<div class="grid grid-cols-2 gap-2">\\s*<a href="product-detail\\.html\\?id=${p.id}"[\\s\\S]*?<\\/div>)`);
    productsContent = productsContent.replace(
      regex,
      `<div class="grid grid-cols-2 gap-2 mb-2">$1</div>
        <button type="button" 
                onclick="if(window.storeEngine) window.storeEngine.addToCart(PRODUCTS.find(x=>x.id==='${p.id}'))" 
                class="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold text-center transition-all flex items-center justify-center gap-1.5 shadow-sm">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          <span>Add to Shopping Bag</span>
        </button>`
    );
  }
});

fs.writeFileSync(path.resolve('products.html'), productsContent, 'utf8');
console.log('Updated products.html successfully!');

// Update product-detail.html
console.log('Processing product-detail.html...');
let detailResult = processHtmlFile(path.resolve('product-detail.html'));
let detailContent = detailResult.content;

// Add Add to Bag button in Live Configuration box if not present
if (!detailContent.includes('id="detail-add-bag-btn"') && detailContent.includes('id="detail-whatsapp-btn"')) {
  detailContent = detailContent.replace(
    /(<div class="pt-2 flex flex-col sm:flex-row gap-3">\s*<a id="detail-whatsapp-btn")/,
    `<div class="pt-2 flex flex-col sm:flex-row gap-3">
              <button id="detail-add-bag-btn" type="button" class="flex-1 py-3.5 px-6 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs text-center transition-all shadow-lg flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                <span>Add to Shopping Bag</span>
              </button>
              <a id="detail-whatsapp-btn"`
  );

  // Wire click handler for detail-add-bag-btn
  const detailScript = `
    const detailAddBagBtn = document.getElementById('detail-add-bag-btn');
    if (detailAddBagBtn) {
      detailAddBagBtn.addEventListener('click', () => {
        if (!product || !window.storeEngine) return;
        const selectedRamText = ramSel ? ramSel.options[ramSel.selectedIndex].text.split('(')[0].trim() : '16GB DDR4';
        const selectedSsdText = ssdSel ? ssdSel.options[ssdSel.selectedIndex].text.split('(')[0].trim() : '512GB NVMe SSD';
        
        const customSpecs = {
          ram: selectedRamText,
          storage: selectedSsdText,
          warranty: '6 Months Free Store Warranty'
        };
        
        const customProduct = {
          ...product,
          price: currentPrice
        };
        
        window.storeEngine.addToCart(customProduct, customSpecs);
      });
    }
  `;
  detailContent = detailContent.replace('</script>\n</body>', `${detailScript}\n  </script>\n</body>`);
}

fs.writeFileSync(path.resolve('product-detail.html'), detailContent, 'utf8');
console.log('Updated product-detail.html successfully!');
