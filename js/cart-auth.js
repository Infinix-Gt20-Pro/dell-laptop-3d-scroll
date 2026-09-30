/**
 * Classic Computer - E-Commerce Engine
 * Cart, Authentication, Configurator, WhatsApp Order & Checkout System
 */

class ClassicStoreEngine {
  constructor() {
    this.cart = this.loadFromStorage('cc_cart', []);
    this.wishlist = this.loadFromStorage('cc_wishlist', []);
    this.user = this.loadFromStorage('cc_user', {
      isLoggedIn: true,
      name: "Kashan Ahmad",
      phone: "+91 98765 43210",
      email: "kashan@example.com",
      address: "B-42, Tech Enclave, New Delhi, 110001",
      orders: [
        {
          orderId: "CC-89214",
          date: "Sep 20, 2026",
          status: "Delivered",
          items: ["Dell Precision / Latitude 5530 4K Workstation"],
          total: 34999,
          warrantyValidTill: "Mar 20, 2027"
        }
      ]
    });

    this.activeCoupon = null;
    this.coupons = {
      "CLASSIC1000": { discount: 1000, desc: "₹1,000 Flat Welcome Discount" },
      "DIWALI500": { discount: 500, desc: "₹500 Festive Savings" }
    };

    this.init();
  }

  loadFromStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  init() {
    const runInit = () => {
      this.renderCartUI();
      this.updateBadges();
      this.setupListeners();
    };

    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runInit);
      } else {
        runInit();
      }
    }

    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'cc_cart') {
          this.cart = this.loadFromStorage('cc_cart', []);
          this.updateBadges();
          this.renderCartUI();
        }
      });
    }
  }

  getVariantKey(productId, specs) {
    const ram = specs && specs.ram ? specs.ram : 'default';
    const storage = specs && specs.storage ? specs.storage : 'default';
    const warranty = specs && specs.warranty ? specs.warranty : 'default';
    return `${productId}__${ram}__${storage}__${warranty}`.replace(/\s+/g, '-').toLowerCase();
  }

  setupListeners() {
    // Cart drawer toggles
    document.querySelectorAll('[data-action="open-cart"]').forEach(btn => {
      btn.addEventListener('click', () => this.openCart());
    });
    document.querySelectorAll('[data-action="close-cart"]').forEach(btn => {
      btn.addEventListener('click', () => this.closeCart());
    });

    // Auth modal toggles
    document.querySelectorAll('[data-action="open-auth"]').forEach(btn => {
      btn.addEventListener('click', () => this.openAuthModal());
    });
    document.querySelectorAll('[data-action="close-auth"]').forEach(btn => {
      btn.addEventListener('click', () => this.closeAuthModal());
    });

    // Checkout modal toggles
    document.querySelectorAll('[data-action="open-checkout"]').forEach(btn => {
      btn.addEventListener('click', () => this.openCheckout());
    });
    document.querySelectorAll('[data-action="close-checkout"]').forEach(btn => {
      btn.addEventListener('click', () => this.closeCheckout());
    });

    // Apply Coupon form
    const couponForm = document.getElementById('coupon-form');
    if (couponForm) {
      couponForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('coupon-input');
        if (input) this.applyCoupon(input.value.trim().toUpperCase());
      });
    }

    // Checkout form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.processOrder();
      });
    }

    // WhatsApp Direct Checkout button
    const waCartBtn = document.getElementById('cart-whatsapp-btn');
    if (waCartBtn) {
      waCartBtn.addEventListener('click', () => this.checkoutViaWhatsApp());
    }
  }

  // --- CART OPERATIONS ---
  addToCart(product, customSpecs = null) {
    if (!product) return;

    let finalPrice = Number(product.customPrice || product.price || 0);
    const resolvedSpecs = customSpecs || {
      ram: product.customRam || (product.specs && product.specs.ram ? product.specs.ram.split(' ')[0] : '8GB'),
      storage: product.customSsd || (product.specs && product.specs.storage ? product.specs.storage.split(' ')[0] : '256GB SSD'),
      warranty: product.customWarranty || '6 Months Free Store Warranty'
    };

    if (customSpecs && customSpecs.extraPrice) {
      finalPrice += Number(customSpecs.extraPrice);
    }

    const variantKey = this.getVariantKey(product.id, resolvedSpecs);

    // Check if identical product configuration already exists in cart
    const existingIndex = this.cart.findIndex(i => 
      (i.variantKey && i.variantKey === variantKey) || i.cartId === variantKey
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += 1;
      this.saveToStorage('cc_cart', this.cart);
      this.updateBadges();
      this.renderCartUI();
      if (typeof window !== 'undefined' && window.soundFX && window.soundFX.playSuccess) window.soundFX.playSuccess();
      this.showToast(`Updated "${this.cart[existingIndex].shortName}" quantity (x${this.cart[existingIndex].quantity})`);
      this.openCart();
      return;
    }

    // Otherwise add as new distinct line item
    const cartItem = {
      cartId: variantKey,
      variantKey: variantKey,
      id: product.id,
      name: product.name,
      shortName: product.shortName || product.name,
      price: finalPrice,
      originalPrice: product.originalPrice || finalPrice,
      thumbnail: product.thumbnail || 'assets/images/logo.png',
      grade: product.grade || 'Grade A+',
      quantity: 1,
      customSpecs: resolvedSpecs
    };

    this.cart.push(cartItem);
    this.saveToStorage('cc_cart', this.cart);
    this.updateBadges();
    this.renderCartUI();
    if (typeof window !== 'undefined' && window.soundFX && window.soundFX.playSuccess) window.soundFX.playSuccess();
    this.showToast(`Added "${cartItem.shortName}" to Shopping Bag!`);
    this.openCart();
  }

  removeFromCart(cartId) {
    this.cart = this.cart.filter(item => item.cartId !== cartId);
    this.saveToStorage('cc_cart', this.cart);
    this.updateBadges();
    this.renderCartUI();
  }

  updateQuantity(cartId, delta) {
    const item = this.cart.find(i => i.cartId === cartId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeFromCart(cartId);
      return;
    }

    this.saveToStorage('cc_cart', this.cart);
    this.updateBadges();
    this.renderCartUI();
  }

  getCartSubtotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getCartTotal() {
    const subtotal = this.getCartSubtotal();
    const discount = this.activeCoupon ? this.activeCoupon.discount : 0;
    return Math.max(0, subtotal - discount);
  }

  applyCoupon(code) {
    const found = this.coupons[code];
    const msgEl = document.getElementById('coupon-message');
    if (found) {
      this.activeCoupon = { code, ...found };
      if (msgEl) {
        msgEl.textContent = `Applied ${code}: ${found.desc}!`;
        msgEl.className = "text-xs text-emerald-400 mt-1 block font-medium";
      }
      this.renderCartUI();
      this.showToast(`Promo Code Applied: -₹${found.discount}`);
    } else {
      if (msgEl) {
        msgEl.textContent = "Invalid coupon code. Try 'CLASSIC1000'";
        msgEl.className = "text-xs text-rose-400 mt-1 block font-medium";
      }
    }
  }

  // --- WISHLIST ---
  toggleWishlist(product) {
    const exists = this.wishlist.find(p => p.id === product.id);
    if (exists) {
      this.wishlist = this.wishlist.filter(p => p.id !== product.id);
      this.showToast(`Removed from Wishlist`);
    } else {
      this.wishlist.push(product);
      this.showToast(`Saved to Wishlist!`);
    }
    this.saveToStorage('cc_wishlist', this.wishlist);
    this.updateBadges();
    this.renderWishlistButtons();
  }

  isWishlisted(productId) {
    return this.wishlist.some(p => p.id === productId);
  }

  // --- UI RENDERING ---
  updateBadges() {
    const count = this.cart.reduce((acc, item) => acc + item.quantity, 0);
    document.querySelectorAll('.cart-badge').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });

    const wishCount = this.wishlist.length;
    document.querySelectorAll('.wishlist-badge').forEach(badge => {
      badge.textContent = wishCount;
      badge.style.display = wishCount > 0 ? 'flex' : 'none';
    });
  }

  renderCartUI() {
    const cartList = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('cart-empty-state');
    const footer = document.getElementById('cart-footer');

    if (!cartList) return;

    if (this.cart.length === 0) {
      cartList.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      if (footer) footer.classList.add('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (footer) footer.classList.remove('hidden');

    cartList.innerHTML = this.cart.map(item => `
      <div class="flex items-center gap-4 py-3.5 px-3 bg-white rounded-2xl border border-slate-200/90 shadow-sm group">
        <img src="${item.thumbnail}" alt="${item.shortName}" class="w-16 h-16 object-cover rounded-xl border border-slate-200 bg-slate-50" />
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between">
            <h4 class="text-sm font-bold text-slate-900 truncate">${item.shortName}</h4>
            <button onclick="storeEngine.removeFromCart('${item.cartId}')" class="text-slate-400 hover:text-rose-500 p-1 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <p class="text-xs text-cyan-700 font-mono mt-0.5">${item.customSpecs.ram} | ${item.customSpecs.storage}</p>
          <div class="flex items-center justify-between mt-2">
            <span class="text-sm font-bold text-slate-900 font-mono">₹${item.price.toLocaleString('en-IN')}</span>
            <div class="flex items-center gap-2 border border-slate-200 rounded-lg bg-slate-50 px-2 py-0.5">
              <button onclick="storeEngine.updateQuantity('${item.cartId}', -1)" class="text-slate-600 hover:text-slate-900 font-bold text-sm leading-none px-1">−</button>
              <span class="text-xs font-mono font-bold text-slate-800">${item.quantity}</span>
              <button onclick="storeEngine.updateQuantity('${item.cartId}', 1)" class="text-slate-600 hover:text-slate-900 font-bold text-sm leading-none px-1">+</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    const subtotal = this.getCartSubtotal();
    const discount = this.activeCoupon ? this.activeCoupon.discount : 0;
    const total = this.getCartTotal();

    const subtotalEl = document.getElementById('cart-subtotal') || document.getElementById('cart-subtotal-text');
    const discountRow = document.getElementById('cart-discount-row');
    const discountEl = document.getElementById('cart-discount') || document.getElementById('cart-discount-text');
    const totalEl = document.getElementById('cart-total') || document.getElementById('cart-total-text');

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    if (totalEl) totalEl.textContent = `₹${total.toLocaleString('en-IN')}`;

    if (discountRow) {
      if (discount > 0) {
        discountRow.style.display = 'flex';
        discountRow.classList.remove('hidden');
        if (discountEl) discountEl.textContent = `-₹${discount.toLocaleString('en-IN')}`;
      } else {
        discountRow.style.display = 'none';
        discountRow.classList.add('hidden');
      }
    }
  }

  renderWishlistButtons() {
    document.querySelectorAll('[data-wishlist-id]').forEach(btn => {
      const id = btn.getAttribute('data-wishlist-id');
      const isSaved = this.isWishlisted(id);
      const icon = btn.querySelector('svg');
      if (icon) {
        if (isSaved) {
          icon.setAttribute('fill', '#f43f5e');
          icon.setAttribute('stroke', '#f43f5e');
        } else {
          icon.setAttribute('fill', 'none');
          icon.setAttribute('stroke', 'currentColor');
        }
      }
    });
  }

  // --- MODAL CONTROLS ---
  openCart() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
      drawer.classList.remove('hidden');
      drawer.classList.add('flex');
      document.body.style.overflow = 'hidden';
      this.renderCartUI();
    }
  }

  closeCart() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
      drawer.classList.add('hidden');
      drawer.classList.remove('flex');
      document.body.style.overflow = '';
    }
  }

  openAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      this.renderUserDashboard();
    }
  }

  closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  openCheckout() {
    if (this.cart.length === 0) {
      this.showToast('Your cart is empty!');
      return;
    }
    this.closeCart();
    const modal = document.getElementById('checkout-modal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';

      // Pre-fill user data (supports live InsForge logged-in user or stored user)
      const liveAuthUser = (window.classicAuth && typeof window.classicAuth.getCurrentUser === 'function')
        ? window.classicAuth.getCurrentUser()
        : this.loadFromStorage('cc_insforge_user', null);

      const activeName = (liveAuthUser && (liveAuthUser.name || liveAuthUser.email)) || this.user.name;
      const activeEmail = (liveAuthUser && liveAuthUser.email) || this.user.email;
      const activePhone = (liveAuthUser && liveAuthUser.phone) || this.user.phone;

      const nameInput = document.getElementById('checkout-name');
      const emailInput = document.getElementById('checkout-email');
      const phoneInput = document.getElementById('checkout-phone');
      const addressInput = document.getElementById('checkout-address');
      const orderTotalEl = document.getElementById('checkout-order-total');

      if (nameInput) nameInput.value = activeName || '';
      if (emailInput) emailInput.value = activeEmail || '';
      if (phoneInput) phoneInput.value = activePhone || '';
      if (addressInput && !addressInput.value) addressInput.value = this.user.address || '';
      if (orderTotalEl) orderTotalEl.textContent = `₹${this.getCartTotal().toLocaleString('en-IN')}`;
    }
  }

  closeCheckout() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  // --- DIRECT WHATSAPP ORDER ---
  checkoutViaWhatsApp(customItem = null) {
    let orderText = "";
    if (customItem) {
      orderText = `Hello *Classic Computers*! 💻%0A%0AI want to order this Certified Refurbished Device:%0A*Model:* ${encodeURIComponent(customItem.name)}%0A*Price:* ₹${customItem.price.toLocaleString('en-IN')}%0A*Configuration:* ${encodeURIComponent(customItem.customSpecs.ram)} RAM | ${encodeURIComponent(customItem.customSpecs.storage)} SSD%0A%0A*Customer:* ${encodeURIComponent(this.user.name)}%0A*Phone:* ${encodeURIComponent(this.user.phone)}%0A*Delivery City:* ${encodeURIComponent(this.user.address)}`;
    } else if (this.cart && this.cart.length > 0) {
      const itemsList = this.cart.map((item, idx) => {
        const lineTotal = item.price * item.quantity;
        return `${idx + 1}. *${encodeURIComponent(item.shortName || item.name)}* (Qty: ${item.quantity})%0A   ⚙️ Specs: ${encodeURIComponent(item.customSpecs.ram)} RAM | ${encodeURIComponent(item.customSpecs.storage)} SSD%0A   💵 Rate: ₹${item.price.toLocaleString('en-IN')} x ${item.quantity} = ₹${lineTotal.toLocaleString('en-IN')}`;
      }).join('%0A%0A');

      const totalQty = this.cart.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = this.getCartSubtotal();
      const discount = this.activeCoupon ? this.activeCoupon.discount : 0;
      const finalTotal = this.getCartTotal();

      let financialBreakdown = `*Items Subtotal (${totalQty} units):* ₹${subtotal.toLocaleString('en-IN')}`;
      if (discount > 0) {
        financialBreakdown += `%0A*Coupon (${this.activeCoupon.code}):* -₹${discount.toLocaleString('en-IN')}`;
      }
      financialBreakdown += `%0A*Total Payable Amount:* ₹${finalTotal.toLocaleString('en-IN')}`;

      orderText = `Hello *Classic Computers*! 💻%0A%0AI would like to place an order for the following items from your website:%0A%0A*📦 ORDER MANIFEST:*%0A${itemsList}%0A%0A------------------------%0A${financialBreakdown}%0A------------------------%0A*👤 Customer Name:* ${encodeURIComponent(this.user.name)}%0A*📞 Phone Number:* ${encodeURIComponent(this.user.phone)}%0A*📍 Shipping Address:* ${encodeURIComponent(this.user.address)}%0A%0APlease verify stock availability and share dispatch tracking details!`;
    } else {
      this.showToast('Please add items to cart first!');
      return;
    }

    const waNum = (typeof window !== 'undefined' && window.STORE_CONFIG && window.STORE_CONFIG.whatsappNumber) 
      ? window.STORE_CONFIG.whatsappNumber 
      : '919412182786';
    const waUrl = `https://wa.me/${waNum}?text=${orderText}`;
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank');
    }
    return waUrl;
  }

  // --- ONLINE ORDER PROCESSING ---
  async processOrder() {
    // Check if user is signed in via InsForge Auth
    const currentUser = window.classicAuth ? window.classicAuth.getCurrentUser() : null;
    const token = window.classicAuth ? window.classicAuth.getToken() : null;

    if (!currentUser || !token) {
      if (window.classicAuth && window.classicAuth.showLucidToast) {
        window.classicAuth.showLucidToast('Please sign in to place your order!', 'info');
      }
      this.closeCheckout();
      if (window.openLucidAuthModal) window.openLucidAuthModal('database');
      return;
    }

    const orderId = `CC-${Math.floor(10000 + Math.random() * 90000)}`;
    const total = this.getCartTotal();
    const itemsSummary = this.cart.map(i => `${i.shortName} (${i.quantity})`);
    const firstItem = this.cart[0];

    const newOrder = {
      orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: "Confirmed",
      items: itemsSummary,
      total,
      warrantyValidTill: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    // Save locally
    this.user.orders.unshift(newOrder);
    this.saveToStorage('cc_user', this.user);

    // Save to InsForge Postgres backend with user_id (RLS enforced!)
    try {
      if (window.insforgeDb) {
        await window.insforgeDb.insert('orders', [{
          order_code: orderId,
          user_id: currentUser.id,
          customer_name: currentUser.name || currentUser.email,
          customer_phone: this.user.phone || '+91 94121 82786',
          product_name: itemsSummary.join(', '),
          quantity: this.cart.reduce((sum, it) => sum + it.quantity, 0),
          unit_price_inr: firstItem ? firstItem.price : total,
          total_inr: total,
          payment_method: 'Online / COD',
          status: 'Confirmed',
          city: this.user.address || 'India'
        }]);
        if (window.classicAuth && window.classicAuth.showLucidToast) {
          window.classicAuth.showLucidToast(`✅ Order ${orderId} saved to InsForge database!`);
        }
      }
    } catch (dbErr) {
      console.warn('InsForge order sync:', dbErr.message);
    }

    // Empty cart
    this.cart = [];
    this.saveToStorage('cc_cart', this.cart);
    this.updateBadges();
    this.renderCartUI();
    this.closeCheckout();

    // Show Invoice / Success Modal
    this.showOrderConfirmation(newOrder);
  }

  showOrderConfirmation(order) {
    const modal = document.getElementById('order-success-modal');
    if (!modal) return;

    document.getElementById('success-order-id').textContent = order.orderId;
    document.getElementById('success-order-total').textContent = `₹${order.total.toLocaleString('en-IN')}`;
    document.getElementById('success-warranty-date').textContent = order.warrantyValidTill;
    document.getElementById('success-items-list').innerHTML = order.items.map(it => `<li>${it}</li>`).join('');

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  closeOrderConfirmation() {
    const modal = document.getElementById('order-success-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  renderUserDashboard() {
    const container = document.getElementById('auth-dashboard-content');
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold font-mono">
            ${this.user.name.split(' ').map(n=>n[0]).join('')}
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900">${this.user.name}</h3>
            <p class="text-xs text-slate-500">${this.user.phone} • ${this.user.email}</p>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-2 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified Classic Member
            </span>
          </div>
        </div>

        <div>
          <h4 class="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-3">Order History & Warranty Certificates</h4>
          <div class="space-y-3">
            ${this.user.orders.map(ord => `
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-bold text-cyan-700 font-mono">${ord.orderId}</span>
                    <span class="text-xs px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono">${ord.date}</span>
                    <span class="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">${ord.status}</span>
                  </div>
                  <p class="text-xs text-slate-800 mt-1 font-medium">${ord.items.join(', ')}</p>
                  <p class="text-[11px] text-slate-500 mt-0.5">🛡️ 6-Month Warranty active till: <span class="text-slate-800 font-medium">${ord.warrantyValidTill}</span></p>
                </div>
                <div class="text-right">
                  <span class="text-base font-bold text-slate-900 font-mono">₹${ord.total.toLocaleString('en-IN')}</span>
                  <div class="mt-1">
                    <button onclick="window.print()" class="text-xs text-cyan-700 hover:text-cyan-800 font-bold hover:underline">Download Invoice</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  showToast(message) {
    if (typeof document === 'undefined' || typeof document.createElement !== 'function') return;
    const toast = document.createElement('div');
    toast.className = "fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl border border-cyan-500/40 shadow-2xl flex items-center gap-3 animate-fade-in";
    toast.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
      <span class="text-sm font-medium">${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }
}

// Global store engine instance & module exports
if (typeof window !== 'undefined') {
  window.ClassicStoreEngine = ClassicStoreEngine;
  window.storeEngine = new ClassicStoreEngine();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ClassicStoreEngine };
}
