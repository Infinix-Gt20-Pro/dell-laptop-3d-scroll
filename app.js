/**
 * Classic Computer - Main Flagship Application Controller (index.html)
 * Coordinates 3D Canvas Scrubber, Hotspots, 4K Display Simulator,
 * Google Flow / Astra AI Matchmaker, Studio Configurator, and Lightbox Gallery
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Initialize Ultra-Fluid Kinetic Smooth Scroll Engine (Lenis)
  if (typeof window.Lenis !== 'undefined' && !window.lenis) {
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple exponential curve
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.25,
      infinite: false,
    });
    window.lenis = lenis;

    function lenisRaf(time) {
      lenis.raf(time);
      requestAnimationFrame(lenisRaf);
    }
    requestAnimationFrame(lenisRaf);

    window.dispatchEvent(new CustomEvent('lenis-ready', { detail: { lenis } }));

    // Global Butter-Smooth Anchor Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#' || href === '#!') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          // Close mobile menu drawer if open
          const mobileDrawer = document.getElementById('mobile-nav-drawer');
          if (mobileDrawer && !mobileDrawer.classList.contains('hidden')) {
            mobileDrawer.classList.add('hidden');
            document.body.style.overflow = '';
          }
          lenis.scrollTo(target, { offset: -70, duration: 1.2 });
        }
      });
    });
  }

  // 1. Dell Precision 5530 Interactive Showcase Engine
  const heroImg = document.getElementById('hero-showcase-img');
  const heroCaption = document.getElementById('hero-view-caption');
  const viewButtons = document.querySelectorAll('.hero-view-btn');
  const heroCard = document.getElementById('hero-showcase-card');

  if (heroImg && viewButtons.length > 0) {
    viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const newSrc = btn.getAttribute('data-img');
        const newDesc = btn.getAttribute('data-desc');

        // Toggle active pill classes
        viewButtons.forEach(b => {
          b.classList.remove('active', 'border-cyan-500', 'bg-cyan-50', 'text-cyan-800', 'shadow-xs');
          b.classList.add('border-slate-200/80', 'bg-white', 'text-slate-700');
        });
        btn.classList.add('active', 'border-cyan-500', 'bg-cyan-50', 'text-cyan-800', 'shadow-xs');
        btn.classList.remove('border-slate-200/80', 'bg-white', 'text-slate-700');

        // Smooth image crossfade
        heroImg.style.opacity = '0.35';
        heroImg.style.transform = 'scale(0.98)';
        setTimeout(() => {
          heroImg.src = newSrc;
          if (heroCaption && newDesc) heroCaption.textContent = newDesc;
          heroImg.style.opacity = '1';
          heroImg.style.transform = 'scale(1)';
        }, 160);

        if (window.soundFX && window.soundFX.playClick) {
          window.soundFX.playClick();
        }
      });
    });

    // Subtle 3D Card Hover Tilt for Showcase Card (Desktop)
    if (heroCard && window.matchMedia('(min-width: 1024px)').matches) {
      heroCard.addEventListener('mousemove', (e) => {
        const rect = heroCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3.5;
        const rotateY = ((x - centerX) / centerX) * 3.5;
        heroCard.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
      });

      heroCard.addEventListener('mouseleave', () => {
        heroCard.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    }
  }

  // 2. Guarded 3D Video Scrubber (if canvas element exists)
  if (document.getElementById('hero-canvas') && typeof HeroVideoScrubber !== 'undefined') {
    const scrubber = window.heroScrubber || new HeroVideoScrubber({
      canvasId: 'hero-canvas',
      containerId: 'hero-scroll-container',
      totalFrames: 240
    });
    window.heroScrubber = scrubber;

    document.querySelectorAll('.hotspot-pin').forEach(pin => {
      pin.addEventListener('click', (e) => {
        const targetProgress = parseFloat(pin.getAttribute('data-target-progress') || '0');
        scrubber.jumpToProgress(targetProgress);
        document.querySelectorAll('.hotspot-pin').forEach(p => p.classList.remove('active'));
        pin.classList.add('active');
        setTimeout(() => {
          pin.classList.remove('active');
        }, 4000);
      });
    });
  }

  // 4. Interactive 4K Display Simulator (Split-Screen Drag Handle)
  const compareBox = document.getElementById('display-compare-box');
  const compareOverlay = document.getElementById('display-compare-overlay');
  
  if (compareBox && compareOverlay) {
    let isComparing = false;

    const setOverlayWidth = (clientX) => {
      const rect = compareBox.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      offsetX = Math.max(0, Math.min(rect.width, offsetX));
      const percentage = (offsetX / rect.width) * 100;
      compareOverlay.style.width = `${percentage}%`;
    };

    compareBox.addEventListener('mousedown', (e) => {
      isComparing = true;
      setOverlayWidth(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (isComparing) {
        setOverlayWidth(e.clientX);
      }
    });

    window.addEventListener('mouseup', () => {
      isComparing = false;
    });

    // Touch support for phones & tablets
    compareBox.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isComparing = true;
        setOverlayWidth(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (isComparing && e.touches.length === 1) {
        setOverlayWidth(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isComparing = false;
    });
  }

  // 5. Performance Benchmark In-View Animation
  const benchmarkSection = document.getElementById('benchmarks');
  if (benchmarkSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.benchmark-bar-fill').forEach(bar => {
            bar.style.transition = 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
          });
        }
      });
    }, { threshold: 0.2 });
    observer.observe(benchmarkSection);
  }

  // 6. High-Tech Web Audio Sound Engine & Equalizer
  class SoundFXEngine {
    constructor() {
      this.ctx = null;
      this.ambientOsc1 = null;
      this.ambientOsc2 = null;
      this.ambientGain = null;
      this.isAmbientActive = false;
      this.isMuted = false; // FX enabled by default once audio context started
    }

    ensureContext() {
      if (!this.ctx) {
        try {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) this.ctx = new AudioContextClass();
        } catch (e) {
          console.warn('AudioContext unsupported', e);
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    }

    toggleAmbient(btn) {
      const ctx = this.ensureContext();
      if (!ctx) return;

      if (!this.isAmbientActive) {
        try {
          this.ambientOsc1 = ctx.createOscillator();
          this.ambientOsc2 = ctx.createOscillator();
          this.ambientGain = ctx.createGain();

          this.ambientOsc1.type = 'sine';
          this.ambientOsc1.frequency.setValueAtTime(55, ctx.currentTime);
          this.ambientOsc2.type = 'triangle';
          this.ambientOsc2.frequency.setValueAtTime(110, ctx.currentTime);

          this.ambientGain.gain.setValueAtTime(0.012, ctx.currentTime);

          this.ambientOsc1.connect(this.ambientGain);
          this.ambientOsc2.connect(this.ambientGain);
          this.ambientGain.connect(ctx.destination);

          this.ambientOsc1.start();
          this.ambientOsc2.start();
          this.isAmbientActive = true;

          if (btn) {
            btn.classList.add('border-cyan-400', 'text-cyan-500', 'bg-cyan-50');
            btn.innerHTML = `
              <div class="audio-equalizer playing">
                <span></span><span></span><span></span><span></span>
              </div>
              <span class="sr-only">Ambient Sound</span>
            `;
          }
          if (window.storeEngine) storeEngine.showToast('Ambient Soundscape Activated');
        } catch (e) {
          console.error(e);
        }
      } else {
        if (this.ambientOsc1) {
          try {
            this.ambientOsc1.stop();
            this.ambientOsc2.stop();
          } catch(e){}
        }
        this.isAmbientActive = false;
        if (btn) {
          btn.classList.remove('border-cyan-400', 'text-cyan-500', 'bg-cyan-50');
          btn.innerHTML = `
            <svg class="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
            </svg>
          `;
        }
        if (window.storeEngine) storeEngine.showToast('Sound Muted');
      }
    }

    playClick() {
      if (this.isMuted) return;
      const ctx = this.ensureContext();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.035);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.035);
      } catch(e){}
    }

    playStageTransition(stageId) {
      if (this.isMuted) return;
      const ctx = this.ensureContext();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const baseFreq = 160 + (stageId * 50);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.45, ctx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } catch(e){}
    }

    playSuccess() {
      if (this.isMuted) return;
      const ctx = this.ensureContext();
      if (!ctx) return;
      try {
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          const startTime = ctx.currentTime + (idx * 0.06);
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.025, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.22);
        });
      } catch(e){}
    }

    playPrinterFeed() {
      if (this.isMuted) return;
      const ctx = this.ensureContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const clickCount = 6;
        for (let i = 0; i < clickCount; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const time = now + (i * 0.07);
          osc.type = i % 2 === 0 ? 'square' : 'triangle';
          osc.frequency.setValueAtTime(1100 + (Math.random() * 300), time);
          osc.frequency.exponentialRampToValueAtTime(340, time + 0.035);
          gain.gain.setValueAtTime(0.015, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.035);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(time);
          osc.stop(time + 0.035);
        }
      } catch(e){}
    }

    playPaperTear() {
      if (this.isMuted) return;
      const ctx = this.ensureContext();
      if (!ctx) return;
      try {
        const bufferSize = Math.floor(ctx.sampleRate * 0.16);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(3200, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.15);
        filter.Q.setValueAtTime(2.2, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
      } catch(e){}
    }
  }

  window.soundFX = new SoundFXEngine();
  const audioToggleBtn = document.getElementById('ambient-audio-toggle');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      window.soundFX.toggleAmbient(audioToggleBtn);
    });
  }

  // 7. Google Flow / Astra AI Laptop Advisor Engine
  const aiToggleBtn = document.getElementById('ai-assistant-toggle');
  const aiDrawer = document.getElementById('ai-assistant-drawer');
  const aiCloseBtn = document.getElementById('ai-drawer-close');
  const aiInput = document.getElementById('ai-user-input');
  const aiSendBtn = document.getElementById('ai-send-btn');
  const aiMessages = document.getElementById('ai-messages-container');

  if (aiToggleBtn && aiDrawer) {
    aiToggleBtn.addEventListener('click', () => {
      aiDrawer.classList.toggle('open');
      if (aiDrawer.classList.contains('open') && aiInput) {
        aiInput.focus();
      }
    });
  }

  if (aiCloseBtn && aiDrawer) {
    aiCloseBtn.addEventListener('click', () => {
      aiDrawer.classList.remove('open');
    });
  }

  const aiKnowledgeBase = {
    macbook: {
      match: ['macbook', 'mac', 'apple'],
      response: `<strong>Dell Precision 5530 vs MacBook Pro 15:</strong><br><br>
        1. <strong>Graphics & CAD:</strong> Dell 5530 features ISV-certified dedicated NVIDIA Quadro graphics with native CUDA support for AutoCAD, SolidWorks, and 3ds Max (unavailable on macOS).<br>
        2. <strong>Display:</strong> 15.6" 4K UHD (3840×2160) UltraSharp with 100% AdobeRGB and razor bezels.<br>
        3. <strong>Upgradability:</strong> Dual DDR4 slots (up to 64GB RAM) and dual NVMe SSD slots (MacBook is completely soldered).<br>
        4. <strong>Price Advantage:</strong> ₹34,999 vs ₹65,000+ for equivalent refurbished MacBook Pro.<br><br>
        <a href="products.html?brand=dell" class="text-cyan-300 underline font-bold">✦ View Dell 5530 Details in Store →</a>`
    },
    cad: {
      match: ['cad', 'autocad', 'solidworks', '3d', 'blender', 'rendering'],
      response: `<strong>Best Laptops for 3D Modeling & CAD under ₹40,000:</strong><br><br>
        • <strong>#1 Pick: Dell Precision 5530 4K (₹34,999)</strong> — Intel Core i7-8850H (6 Cores/12 Threads, 45W) + 4GB Dedicated NVIDIA Quadro + 4K UltraSharp display.<br>
        • <strong>#2 Pick: HP ZBook 15 G5 (₹36,999)</strong> — Extreme dual-fan workstation cooling + 4GB NVIDIA Quadro P2000.<br><br>
        Both support dual external 4K monitors and certified OpenGL drivers.<br>
        <a href="products.html?category=workstation" class="text-cyan-300 underline font-bold">✦ Filter Workstation Laptops →</a>`
    },
    grade: {
      match: ['grade', 'condition', 'certified', 'quality', 'refurbished'],
      response: `<strong>What does "Certified Grade A+ (Like New)" mean at Classic Computer?</strong><br><br>
        1. <strong>30-Point Lab Audit:</strong> Motherboard stress-testing, RAM memory integrity, NVMe SMART health, and sub-pixel panel diagnostics.<br>
        2. <strong>Battery Health:</strong> 90%+ original OEM battery capacity guaranteed with genuine high-wattage power adapter.<br>
        3. <strong>Cosmetics:</strong> Spotless unibody chassis with zero functional flaws or cracks.<br>
        4. <strong>Protection:</strong> 6 Months Comprehensive Hardware Warranty + 7 Days Replacement Policy.`
    },
    default: {
      response: `Based on current inventory at Classic Computer, our top recommendation for high-intensity engineering, video editing, and coding is the <strong>Dell Precision 5530 4K Workstation (₹34,999)</strong> with Core i7 8th Gen H-Series, 4GB Dedicated NVIDIA, and 4K screen. For maximum portability and all-day battery life, look at the <strong>Lenovo ThinkPad T480 (₹23,499)</strong> with hot-swappable dual battery bridge!<br><br>
        <a href="products.html" class="text-cyan-300 underline font-bold">✦ Explore All 8 Machines in the Catalog →</a>`
    }
  };

  window.askAiQuestion = function(questionText) {
    if (!aiMessages) return;

    // Append User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-white text-right ml-6';
    userMsg.innerHTML = `<span class="text-cyan-400 font-bold block text-[10px] uppercase">You</span>${questionText}`;
    aiMessages.appendChild(userMsg);

    // AI Thinking Indicator
    const thinkingMsg = document.createElement('div');
    thinkingMsg.className = 'p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 flex items-center gap-2';
    thinkingMsg.innerHTML = `<span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> <span>Flow AI analyzing hardware telemetry...</span>`;
    aiMessages.appendChild(thinkingMsg);
    aiMessages.scrollTop = aiMessages.scrollHeight;

    setTimeout(() => {
      thinkingMsg.remove();
      
      const q = questionText.toLowerCase();
      let replyHtml = aiKnowledgeBase.default.response;

      if (aiKnowledgeBase.macbook.match.some(m => q.includes(m))) {
        replyHtml = aiKnowledgeBase.macbook.response;
      } else if (aiKnowledgeBase.cad.match.some(m => q.includes(m))) {
        replyHtml = aiKnowledgeBase.cad.response;
      } else if (aiKnowledgeBase.grade.match.some(m => q.includes(m))) {
        replyHtml = aiKnowledgeBase.grade.response;
      }

      const botMsg = document.createElement('div');
      botMsg.className = 'p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 text-slate-200';
      botMsg.innerHTML = `<span class="text-cyan-400 font-bold block mb-1">✦ Classic AI Assistant:</span>${replyHtml}`;
      aiMessages.appendChild(botMsg);
      aiMessages.scrollTop = aiMessages.scrollHeight;
    }, 600);
  };

  if (aiSendBtn && aiInput) {
    const handleSend = () => {
      const text = aiInput.value.trim();
      if (!text) return;
      aiInput.value = '';
      askAiQuestion(text);
    };

    aiSendBtn.addEventListener('click', handleSend);
    aiInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  // 8. Dell 5530 Studio Configurator & Thermal Receipt Printer Engine
  // Inspired by @susanoo.ui interactive receipt printer
  const basePrice = 34999;
  let selectedRamExtra = 0;
  let selectedSsdExtra = 0;
  let selectedWarrantyExtra = 0;
  let ramLabel = "8GB DDR4 Base";
  let ssdLabel = "256GB NVMe SSD";
  let warrantyLabel = "6-Month Lab Warranty";
  let isAnnualBilling = false;
  let isTearing = false;

  // Plan presets configuration
  const PLAN_PRESETS = {
    starter: {
      ramValue: "0",
      ramLabel: "8GB DDR4 Base",
      ssdValue: "0",
      ssdLabel: "256GB NVMe SSD",
      warrantyValue: "0",
      warrantyLabel: "6-Month Lab Warranty"
    },
    pro: {
      ramValue: "2500",
      ramLabel: "16GB DDR4 Pro",
      ssdValue: "2000",
      ssdLabel: "512GB NVMe SSD",
      warrantyValue: "1999",
      warrantyLabel: "1-Year Complete Care"
    },
    extreme: {
      ramValue: "6000",
      ramLabel: "32GB DDR4 Extreme",
      ssdValue: "4500",
      ssdLabel: "1TB NVMe Extreme SSD",
      warrantyValue: "1999",
      warrantyLabel: "1-Year Complete Care"
    }
  };

  const ramInputs = document.querySelectorAll('input[name="config-ram"]');
  const ssdInputs = document.querySelectorAll('input[name="config-ssd"]');
  const warrantyInputs = document.querySelectorAll('input[name="config-warranty"]');
  const planPresetCards = document.querySelectorAll('.plan-preset-card');
  const billingModeStandardBtn = document.getElementById('billing-mode-standard');
  const billingModeAnnualBtn = document.getElementById('billing-mode-annual');
  const receiptPaperEl = document.getElementById('thermal-receipt-paper');
  const printerLedEl = document.getElementById('printer-status-led');
  const receiptTearBtn = document.getElementById('receipt-tear-trigger-btn');
  const receiptPrintActionBtn = document.getElementById('receipt-print-action-btn');

  // Format Indian Rupees
  const formatINR = (num) => `₹${Math.round(num).toLocaleString('en-IN')}`;

  // Update live receipt content
  const updateReceiptDOM = () => {
    const subtotal = basePrice + selectedRamExtra + selectedSsdExtra + selectedWarrantyExtra;
    const discountAmount = isAnnualBilling ? Math.round(subtotal * 0.15) : 0;
    const finalTotal = Math.max(0, subtotal - discountAmount);

    // Update live timestamp
    const liveTimeEl = document.getElementById('receipt-live-time');
    if (liveTimeEl) {
      const now = new Date();
      liveTimeEl.textContent = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    // Line items
    const ramNameEl = document.getElementById('receipt-ram-name');
    const ramPriceEl = document.getElementById('receipt-ram-price');
    if (ramNameEl) ramNameEl.textContent = `+ ${ramLabel}`;
    if (ramPriceEl) ramPriceEl.textContent = selectedRamExtra > 0 ? `+${formatINR(selectedRamExtra)}` : 'INCL';

    const ssdNameEl = document.getElementById('receipt-ssd-name');
    const ssdPriceEl = document.getElementById('receipt-ssd-price');
    if (ssdNameEl) ssdNameEl.textContent = `+ ${ssdLabel}`;
    if (ssdPriceEl) ssdPriceEl.textContent = selectedSsdExtra > 0 ? `+${formatINR(selectedSsdExtra)}` : 'INCL';

    const warrantyNameEl = document.getElementById('receipt-warranty-name');
    const warrantyPriceEl = document.getElementById('receipt-warranty-price');
    if (warrantyNameEl) warrantyNameEl.textContent = `+ ${warrantyLabel}`;
    if (warrantyPriceEl) warrantyPriceEl.textContent = selectedWarrantyExtra > 0 ? `+${formatINR(selectedWarrantyExtra)}` : 'INCL';

    // Discount row
    const discountRow = document.getElementById('receipt-discount-line');
    const discountAmountEl = document.getElementById('receipt-discount-amount');
    const stampBadge = document.getElementById('receipt-stamp-badge');

    if (discountRow) {
      if (isAnnualBilling) {
        discountRow.style.display = 'flex';
        if (discountAmountEl) discountAmountEl.textContent = `-${formatINR(discountAmount)}`;
        if (stampBadge) {
          stampBadge.textContent = '15% DISCOUNT APPLIED';
          stampBadge.className = 'receipt-rubber-stamp discount-stamp';
        }
      } else {
        discountRow.style.display = 'none';
        if (stampBadge) {
          stampBadge.textContent = 'LAB VERIFIED';
          stampBadge.className = 'receipt-rubber-stamp';
        }
      }
    }

    // Subtotal & Total
    const subtotalEl = document.getElementById('receipt-subtotal-price');
    const totalEl = document.getElementById('receipt-total-price');
    if (subtotalEl) subtotalEl.textContent = formatINR(subtotal);
    if (totalEl) totalEl.textContent = formatINR(finalTotal);

    // Update plan card pricing tags if annual discount applies
    document.querySelectorAll('.plan-price-display').forEach(disp => {
      const base = parseInt(disp.getAttribute('data-base'), 10);
      if (base) {
        const discounted = isAnnualBilling ? Math.round(base * 0.85) : base;
        disp.textContent = formatINR(discounted);
      }
    });

    return { subtotal, discountAmount, finalTotal };
  };

  // Perform Physical Tear-Off and Reprint Animation
  const tearAndReprintReceipt = () => {
    if (isTearing || !receiptPaperEl) {
      updateReceiptDOM();
      return;
    }
    isTearing = true;

    // 1. Play paper tearing audio & add tear animation class
    if (window.soundFX && window.soundFX.playPaperTear) {
      window.soundFX.playPaperTear();
    }
    receiptPaperEl.classList.remove('feeding');
    receiptPaperEl.classList.add('tearing');
    if (printerLedEl) printerLedEl.classList.add('printing');

    // 2. Wait for tear trajectory to finish, then feed fresh paper
    setTimeout(() => {
      receiptPaperEl.classList.remove('tearing');
      updateReceiptDOM();

      // Trigger paper feed-out animation
      receiptPaperEl.classList.add('feeding');
      if (window.soundFX && window.soundFX.playPrinterFeed) {
        window.soundFX.playPrinterFeed();
      }

      // Finish printing
      setTimeout(() => {
        receiptPaperEl.classList.remove('feeding');
        receiptPaperEl.classList.add('printed');
        if (printerLedEl) printerLedEl.classList.remove('printing');
        isTearing = false;
      }, 720);
    }, 480);
  };

  // Curated Plan Cards Selection
  const selectPlan = (planKey, shouldAnimate = true) => {
    const preset = PLAN_PRESETS[planKey];
    if (!preset) return;

    // Update active class on plan cards
    planPresetCards.forEach(card => {
      const isCurrent = card.getAttribute('data-plan') === planKey;
      card.classList.toggle('active', isCurrent);
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = isCurrent;
    });

    // Check matching component radio buttons
    const targetRam = Array.from(ramInputs).find(i => i.value === preset.ramValue);
    if (targetRam) {
      targetRam.checked = true;
      selectedRamExtra = parseInt(preset.ramValue, 10);
      ramLabel = preset.ramLabel;
    }

    const targetSsd = Array.from(ssdInputs).find(i => i.value === preset.ssdValue);
    if (targetSsd) {
      targetSsd.checked = true;
      selectedSsdExtra = parseInt(preset.ssdValue, 10);
      ssdLabel = preset.ssdLabel;
    }

    const targetWarranty = Array.from(warrantyInputs).find(i => i.value === preset.warrantyValue);
    if (targetWarranty) {
      targetWarranty.checked = true;
      selectedWarrantyExtra = parseInt(preset.warrantyValue, 10);
      warrantyLabel = preset.warrantyLabel;
    }

    if (shouldAnimate) {
      tearAndReprintReceipt();
    } else {
      updateReceiptDOM();
    }
  };

  // Plan Card Click Listeners
  planPresetCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const planKey = card.getAttribute('data-plan');
      selectPlan(planKey, true);
    });

    // Keyboard Arrow Navigation for Accessible Radiogroups
    card.addEventListener('keydown', (e) => {
      const plans = ['starter', 'pro', 'extreme'];
      const currentIndex = plans.indexOf(card.getAttribute('data-plan'));
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % plans.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + plans.length) % plans.length;
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectPlan(plans[currentIndex], true);
        return;
      }

      if (nextIndex !== currentIndex) {
        const nextPlan = plans[nextIndex];
        const nextCard = document.querySelector(`.plan-preset-card[data-plan="${nextPlan}"]`);
        if (nextCard) {
          nextCard.focus();
          selectPlan(nextPlan, true);
        }
      }
    });
  });

  // Annual Pre-Pay / Discount Toggle Listeners
  if (billingModeStandardBtn && billingModeAnnualBtn) {
    billingModeStandardBtn.addEventListener('click', () => {
      if (!isAnnualBilling) return;
      isAnnualBilling = false;
      billingModeStandardBtn.classList.add('active');
      billingModeAnnualBtn.classList.remove('active');
      billingModeStandardBtn.setAttribute('aria-checked', 'true');
      billingModeAnnualBtn.setAttribute('aria-checked', 'false');
      tearAndReprintReceipt();
    });

    billingModeAnnualBtn.addEventListener('click', () => {
      if (isAnnualBilling) return;
      isAnnualBilling = true;
      billingModeAnnualBtn.classList.add('active');
      billingModeStandardBtn.classList.remove('active');
      billingModeAnnualBtn.setAttribute('aria-checked', 'true');
      billingModeStandardBtn.setAttribute('aria-checked', 'false');
      tearAndReprintReceipt();
    });
  }

  // Component Customizers Listeners (RAM, SSD, Warranty)
  const syncPlanPresetHighlight = () => {
    const plans = ['starter', 'pro', 'extreme'];
    let matchedPlan = null;
    for (const key of plans) {
      const p = PLAN_PRESETS[key];
      if (p.ramValue === String(selectedRamExtra) && p.ssdValue === String(selectedSsdExtra) && p.warrantyValue === String(selectedWarrantyExtra)) {
        matchedPlan = key;
        break;
      }
    }
    planPresetCards.forEach(card => {
      const isMatched = card.getAttribute('data-plan') === matchedPlan;
      card.classList.toggle('active', isMatched);
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = isMatched;
    });
  };

  ramInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      selectedRamExtra = parseInt(e.target.value, 10);
      ramLabel = e.target.getAttribute('data-label');
      syncPlanPresetHighlight();
      tearAndReprintReceipt();
    });
  });

  ssdInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      selectedSsdExtra = parseInt(e.target.value, 10);
      ssdLabel = e.target.getAttribute('data-label');
      syncPlanPresetHighlight();
      tearAndReprintReceipt();
    });
  });

  warrantyInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      selectedWarrantyExtra = parseInt(e.target.value, 10);
      warrantyLabel = e.target.getAttribute('data-label');
      syncPlanPresetHighlight();
      tearAndReprintReceipt();
    });
  });

  // Manual Tear & Reprint Button
  if (receiptTearBtn) {
    receiptTearBtn.addEventListener('click', () => {
      tearAndReprintReceipt();
    });
  }

  // Print Lab Receipt Action
  if (receiptPrintActionBtn) {
    receiptPrintActionBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Initial render of receipt on page load
  updateReceiptDOM();

  // Configurator Buy Buttons
  const configAddCartBtn = document.getElementById('config-add-cart-btn');
  if (configAddCartBtn) {
    configAddCartBtn.addEventListener('click', () => {
      const totals = updateReceiptDOM();
      const customItem = {
        ...PRODUCTS[0],
        customRam: ramLabel,
        customSsd: ssdLabel,
        customWarranty: warrantyLabel,
        customPrice: totals.finalTotal,
        discountApplied: totals.discountAmount > 0 ? totals.discountAmount : null
      };
      storeEngine.addToCart(customItem);
    });
  }

  const configWhatsAppBtn = document.getElementById('config-whatsapp-buy-btn');
  if (configWhatsAppBtn) {
    configWhatsAppBtn.addEventListener('click', () => {
      const totals = updateReceiptDOM();
      const discountText = isAnnualBilling ? `\n- Pre-Pay Discount: -${formatINR(totals.discountAmount)} (15% Annual)` : '';
      const message = `Hello Classic Computer Team!\n\nI want to order a customized Dell Precision 5530 4K Workstation from your website:\n- Memory: ${ramLabel}\n- Storage: ${ssdLabel}\n- Warranty: ${warrantyLabel}${discountText}\n- Calculated Total: ${formatINR(totals.finalTotal)}\n\nPlease share delivery confirmation and bank/UPI details!`;
      const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    });
  }

  // 9. Photo Lightbox Modal Handlers
  window.openPhotoLightbox = function(imgSrc, caption) {
    const modal = document.getElementById('photo-lightbox-modal');
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');

    if (modal && img && cap) {
      img.src = imgSrc;
      cap.textContent = caption || "Dell Precision 5530 4K Lab Diagnostic";
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  };

  window.closePhotoLightbox = function() {
    const modal = document.getElementById('photo-lightbox-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  // 10. Marketing Video Modal Handlers
  window.openMarketingVideoModal = function() {
    const modal = document.getElementById('video-modal');
    const video = document.getElementById('modal-video-player');
    if (modal && video) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      video.play().catch(e => console.log('Autoplay blocked'));
    }
  };

  window.closeMarketingVideoModal = function() {
    const modal = document.getElementById('video-modal');
    const video = document.getElementById('modal-video-player');
    if (modal && video) {
      video.pause();
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  // 11. Ambient Aurora Light Particles Engine
  const auroraCanvas = document.getElementById('ambient-aurora-canvas');
  if (auroraCanvas) {
    const actx = auroraCanvas.getContext('2d');
    let aW = 0, aH = 0;
    let isAuroraVisible = true;
    let auroraRafId = null;
    
    const resizeAurora = () => {
      aW = auroraCanvas.width = auroraCanvas.parentElement ? auroraCanvas.parentElement.clientWidth : window.innerWidth;
      aH = auroraCanvas.height = auroraCanvas.parentElement ? auroraCanvas.parentElement.clientHeight : window.innerHeight;
    };
    resizeAurora();
    window.addEventListener('resize', resizeAurora, { passive: true });

    const particles = Array.from({ length: 24 }, () => ({
      x: Math.random() * (aW || 1200),
      y: Math.random() * (aH || 800),
      radius: Math.random() * 2.0 + 0.8,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35 - 0.1,
      alpha: Math.random() * 0.4 + 0.12,
      hue: Math.random() > 0.5 ? 190 : 230
    }));

    let glowTime = 0;
    const renderAurora = () => {
      if (!isAuroraVisible) return;
      if (!actx || aW === 0 || aH === 0) return;
      actx.clearRect(0, 0, aW, aH);
      glowTime += 0.012;

      // Soft breathing aurora nebulae
      const grad1 = actx.createRadialGradient(
        aW * 0.35 + Math.sin(glowTime * 0.8) * 120,
        aH * 0.45 + Math.cos(glowTime * 0.6) * 80,
        50,
        aW * 0.35,
        aH * 0.45,
        aW * 0.45
      );
      grad1.addColorStop(0, 'rgba(6, 182, 212, 0.07)');
      grad1.addColorStop(0.6, 'rgba(59, 130, 246, 0.03)');
      grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      actx.fillStyle = grad1;
      actx.fillRect(0, 0, aW, aH);

      // Drifting ethereal micro-particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = aW;
        if (p.x > aW) p.x = 0;
        if (p.y < 0) p.y = aH;
        if (p.y > aH) p.y = 0;

        actx.beginPath();
        actx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        actx.fillStyle = `hsla(${p.hue}, 85%, 65%, ${p.alpha})`;
        actx.fill();
      });

      auroraRafId = requestAnimationFrame(renderAurora);
    };

    if ('IntersectionObserver' in window && auroraCanvas.parentElement) {
      const auroraObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isAuroraVisible = entry.isIntersecting;
          if (isAuroraVisible) {
            cancelAnimationFrame(auroraRafId);
            auroraRafId = requestAnimationFrame(renderAurora);
          } else {
            cancelAnimationFrame(auroraRafId);
          }
        });
      }, { threshold: 0.05 });
      auroraObs.observe(auroraCanvas.parentElement);
    } else {
      auroraRafId = requestAnimationFrame(renderAurora);
    }
  }

  // 9. Mobile Navigation Drawer Controller
  const mobileMenuBtn = document.getElementById('mobile-menu-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileCloseBtn = document.getElementById('mobile-menu-close-btn');

  if (mobileMenuBtn && mobileDrawer) {
    const openMobileMenu = () => {
      mobileDrawer.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    };

    const closeMobileMenu = () => {
      mobileDrawer.classList.add('hidden');
      document.body.style.overflow = '';
    };

    mobileMenuBtn.addEventListener('click', openMobileMenu);
    if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);

    mobileDrawer.querySelectorAll('.mobile-nav-link, a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
  }

  // 10. Apple Liquid Glass UI Engine Init (Snell's Law Optical Refraction + Progressive Blurs)
  if (window.LiquidGlass && typeof window.LiquidGlass.init === 'function') {
    window.LiquidGlass.init({
      selector: '.liquid-glass, .liquid-glass-capsule, .glass-capsule-body, .apple-action-btn, .apple-secondary-glass-btn, [data-liquid-glass]',
      gradientBlur: false, // We inject gradient blur directly into container voids
      blurSize: 32
    });
  }

  // 11. Refined Desktop Custom Cursor & Magnetic Interactions
  const cursorDot = document.getElementById('custom-cursor-dot');
  const cursorRing = document.getElementById('custom-cursor-ring');

  if (cursorDot && cursorRing && window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) {
    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      if (!isMoving) {
        isMoving = true;
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });

    // Smooth Lerp loop for ring
    function cursorLoop() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(cursorLoop);
    }
    requestAnimationFrame(cursorLoop);

    // Hover detection for interactive targets
    const interactiveSelectors = 'a, button, input, select, textarea, .specular-card, .refurb-stage-card, .motionsites-tab, [data-action]';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        document.body.classList.add('cursor-active');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        document.body.classList.remove('cursor-active');
      }
    });

    // Subtle Magnetic Buttons
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const pullX = (e.clientX - rect.left - rect.width / 2) * 0.28;
        const pullY = (e.clientY - rect.top - rect.height / 2) * 0.28;
        btn.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  }

  // ===================================================
  // 12. FULL WEBSITE 3D MOTION ENGINE & TILT PHYSICS
  // ===================================================

  // A. 3D Perspective Card Tilt & Holographic Glare
  const tiltCards = document.querySelectorAll('.specular-card, .tilt-card, .refurb-stage-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (subtle & elegant, max 6 degrees)
      const rotateX = ((y - centerY) / centerY) * -5.5;
      const rotateY = ((x - centerX) / centerX) * 5.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
      card.style.setProperty('--mouse-x', `${((x / rect.width) * 100).toFixed(1)}%`);
      card.style.setProperty('--mouse-y', `${((y / rect.height) * 100).toFixed(1)}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // B. Interactive 4K Magnifier Loupe Engine
  const loupeContainer = document.getElementById('display-compare-box');
  const loupe = document.getElementById('display-magnifier-loupe');
  if (loupeContainer && loupe) {
    const mainImg = loupeContainer.querySelector('img');
    if (mainImg) {
      loupe.style.backgroundImage = `url("${mainImg.src}")`;
    }

    loupeContainer.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768) loupe.classList.add('active');
    });

    loupeContainer.addEventListener('mouseleave', () => {
      loupe.classList.remove('active');
    });

    loupeContainer.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 768) return;
      const rect = loupeContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      loupe.style.left = `${x}px`;
      loupe.style.top = `${y}px`;

      // Map background position for 2.5X magnification
      const bgX = (x / rect.width) * 100;
      const bgY = (y / rect.height) * 100;
      loupe.style.backgroundPosition = `${bgX}% ${bgY}%`;
    });
  }

  // C. Kinetic Animated Number Counter Engine (Apple Keynote Style)
  const counterElements = document.querySelectorAll('.counter-number');
  if (counterElements.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target') || '0');
          const format = el.getAttribute('data-format') || 'standard';
          const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
          const duration = 1800; // ms
          const startTime = performance.now();

          const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // EaseOutExpo curve
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = target * easeProgress;

            if (format === 'currency') {
              el.textContent = `₹${Math.round(currentVal).toLocaleString('en-IN')}`;
            } else if (format === 'locale') {
              el.textContent = Math.round(currentVal).toLocaleString('en-IN');
            } else if (decimals > 0) {
              el.textContent = currentVal.toFixed(decimals);
            } else {
              el.textContent = Math.round(currentVal);
            }

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            }
          };

          requestAnimationFrame(updateCounter);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.25 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  // D. Tactile Sound Effects on Interactive Controls
  document.querySelectorAll('button:not(#ambient-audio-toggle), a.magnetic-btn, .stage-pill-btn, .radar-node').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.soundFX && window.soundFX.playClick) {
        window.soundFX.playClick();
      }
    });
  });

  // Keyboard escape listeners for modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closePhotoLightbox();
      window.closeMarketingVideoModal();
      if (mobileDrawer) {
        mobileDrawer.classList.remove('drawer-open');
        mobileDrawer.classList.add('drawer-closed');
        document.body.style.overflow = '';
      }
      if (aiDrawer) aiDrawer.classList.remove('open');
      if (window.storeEngine) {
        window.storeEngine.closeCart();
        window.storeEngine.closeAuthModal();
        window.storeEngine.closeCheckoutModal();
      }
    }
  });

  // ===================================================
  // 13. SMART DEVICE FINDER (Kiske Liye Konsa Theek Hai)
  // ===================================================
  const finderButtons = document.querySelectorAll('.finder-tag-btn');
  const finderCard = document.getElementById('finder-recommendation-card');
  const finderMatchBadge = document.getElementById('finder-match-badge');
  const finderImg = document.getElementById('finder-product-img');
  const finderDeviceType = document.getElementById('finder-device-type');
  const finderBadge = document.getElementById('finder-product-badge');
  const finderName = document.getElementById('finder-product-name');
  const finderWhy = document.getElementById('finder-product-why');
  const finderCpu = document.getElementById('finder-spec-cpu');
  const finderRam = document.getElementById('finder-spec-ram');
  const finderDisplay = document.getElementById('finder-spec-display');
  const finderPrice = document.getElementById('finder-product-price');
  const finderMrp = document.getElementById('finder-product-mrp');
  const finderCartBtn = document.getElementById('finder-add-cart-btn');
  const finderWaLink = document.getElementById('finder-whatsapp-link');

  const FINDER_RECOMMENDATIONS = {
    coding: {
      productId: "thinkpad-t480-classic",
      badge: "🔥 TOP PICK FOR PROGRAMMING & COLLEGE",
      deviceType: "ENTERPRISE LAPTOP",
      name: "Lenovo ThinkPad T480 Dual-Battery",
      why: "Dual batteries give 8 to 10 hours of non-stop backup for college or coding marathons. The spill-resistant backlit ThinkPad keyboard offers deep 1.8mm key travel that programmers swear by. 16GB RAM + 512GB SSD easily handles VS Code, Docker containers, Python/Java compilation, and Ubuntu/Linux dual-boot.",
      specs: {
        cpu: "Intel Core i7 8th Gen Quad-Core (4.0 GHz)",
        ram: "16GB DDR4 • 512GB NVMe M.2 SSD",
        display: "14.0-inch Full HD IPS Anti-Glare Matte"
      },
      price: 23499,
      mrp: 110000,
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
      productBadge: "Grade A+ • 6-Mo Warranty"
    },
    editing: {
      productId: "dell-5530-flagship",
      badge: "🎨 TOP PICK FOR 4K EDITING & CAD",
      deviceType: "MOBILE WORKSTATION LAPTOP",
      name: "Dell Precision 5530 4K UHD UltraSharp",
      why: "Equipped with a true 100% AdobeRGB 4K UHD PremierColor touch panel with 400 nits brightness. The 6-core Intel i7-8850H H-series processor combined with dedicated 4GB NVIDIA Quadro ISV graphics delivers lightning-fast timeline scrub in Adobe Premiere Pro, After Effects, DaVinci Resolve, and smooth 3D orbits in AutoCAD & Blender.",
      specs: {
        cpu: "Intel Core i7-8850H Hexa-Core (4.30 GHz Turbo)",
        ram: "8GB/16GB DDR4 • 256GB/1TB NVMe SSD",
        display: "15.6-inch 4K UHD (3840x2160) UltraSharp Touch"
      },
      price: 34999,
      mrp: 185000,
      image: "assets/images/real-5530/dell_5530_front_display.jpg",
      productBadge: "Grade A+ • 6-Mo Warranty"
    },
    office: {
      productId: "hp-elitebook-840-g6",
      badge: "💼 TOP PICK FOR OFFICE & ACCOUNTS",
      deviceType: "PREMIUM BUSINESS ULTRABOOK",
      name: "HP EliteBook 840 G6 Aluminum Ultrabook",
      why: "Ultra-sleek 1.48kg CNC anodized aluminum unibody in natural silver. Built with Bang & Olufsen high-clarity microphones and tuned speakers for crystal-clear Zoom and Google Meet calls. High-efficiency Core i5 processor runs heavy Excel sheets with VLOOKUP, Tally Prime ERP, GST portals, and multiple browser tabs with zero lag.",
      specs: {
        cpu: "Intel Core i5-8365U vPro (4.10 GHz)",
        ram: "16GB DDR4 • 256GB Fast NVMe SSD",
        display: "14.0-inch FHD (1920x1080) Anti-Glare IPS"
      },
      price: 21999,
      mrp: 98000,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
      productBadge: "Grade A+ • 6-Mo Warranty"
    },
    trading: {
      productId: "dell-optiplex-7070-micro",
      badge: "📈 TOP PICK FOR STOCK TRADING & MULTI-SCREEN",
      deviceType: "MINI DESKTOP PC (MULTI-DISPLAY)",
      name: "Dell OptiPlex 7070 Micro Mini Desktop",
      why: "Palm-sized commercial mini desktop that mounts discreetly behind any monitor or fits in palm. Native dual DisplayPorts allow 2 to 3 independent high-res trading displays for Zerodha Kite, TradingView, and Bloomberg charts simultaneously. Intel 8-core desktop processor and 16GB RAM keep trading systems responsive during market peak volatility.",
      specs: {
        cpu: "Intel Core i7-9700T 8-Core Desktop CPU",
        ram: "16GB DDR4 • 512GB Fast M.2 SSD",
        display: "Dual/Triple 4K External Monitor Ready"
      },
      price: 22999,
      mrp: 85000,
      image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&auto=format&fit=crop&q=80",
      productBadge: "Grade A+ • 6-Mo Warranty"
    },
    gaming: {
      productId: "lenovo-legion-5-gaming",
      badge: "⚡ TOP PICK FOR GAMING & 3D RENDERING",
      deviceType: "HIGH-PERFORMANCE GAMING RIG",
      name: "Lenovo Legion 5 AMD Ryzen 7 RTX",
      why: "Features an AMD Ryzen 7 5800H 8-core processor and dedicated 4GB NVIDIA RTX 3050 graphics card with real-time Ray Tracing. Paired with a lightning-fast 144Hz high refresh rate screen and Coldfront 3.0 dual-fan cooling system for sustained high FPS gaming in GTA V, Valorant, Call of Duty, and fast GPU rendering in Unreal Engine 5.",
      specs: {
        cpu: "AMD Ryzen 7 5800H Octa-Core (4.4 GHz)",
        ram: "16GB DDR4 • 512GB Gen3 NVMe SSD",
        display: "15.6-inch FHD 144Hz IPS Dolby Vision"
      },
      price: 49999,
      mrp: 105000,
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
      productBadge: "Open-Box • 6-Mo Warranty"
    }
  };

  if (finderButtons.length > 0 && finderCard) {
    finderButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.getAttribute('data-tag');
        const data = FINDER_RECOMMENDATIONS[tag];
        if (!data) return;

        // Button state
        finderButtons.forEach(b => {
          b.classList.remove('active', 'border-cyan-600', 'bg-cyan-600', 'text-white');
          b.classList.add('border-slate-200', 'bg-white', 'text-slate-700');
        });
        btn.classList.add('active', 'border-cyan-600', 'bg-cyan-600', 'text-white');
        btn.classList.remove('border-slate-200', 'bg-white', 'text-slate-700');

        // Card Crossfade Animation
        finderCard.style.opacity = '0.35';
        finderCard.style.transform = 'translateY(6px)';

        setTimeout(() => {
          if (finderMatchBadge) finderMatchBadge.textContent = data.badge;
          if (finderImg) {
            finderImg.src = data.image;
            finderImg.alt = data.name;
          }
          if (finderDeviceType) finderDeviceType.textContent = data.deviceType;
          if (finderBadge) finderBadge.textContent = data.productBadge;
          if (finderName) finderName.textContent = data.name;
          if (finderWhy) finderWhy.textContent = data.why;
          if (finderCpu) finderCpu.textContent = data.specs.cpu;
          if (finderRam) finderRam.textContent = data.specs.ram;
          if (finderDisplay) finderDisplay.textContent = data.specs.display;
          if (finderPrice) finderPrice.textContent = `₹${data.price.toLocaleString('en-IN')}`;
          if (finderMrp) finderMrp.textContent = `₹${data.mrp.toLocaleString('en-IN')}`;

          if (finderCartBtn && typeof PRODUCTS !== 'undefined') {
            const matchedProd = PRODUCTS.find(p => p.id === data.productId) || PRODUCTS[0];
            finderCartBtn.onclick = () => {
              if (window.storeEngine) window.storeEngine.addToCart(matchedProd);
            };
          }

          if (finderWaLink) {
            const msg = encodeURIComponent(`Hello Classic Computers, I would like to inquire about ${data.name} (Price: Rs ${data.price.toLocaleString('en-IN')}). Is this unit available for order?`);
            finderWaLink.href = `https://wa.me/919412182786?text=${msg}`;
          }

          finderCard.style.opacity = '1';
          finderCard.style.transform = 'translateY(0)';
        }, 150);

        if (window.soundFX && window.soundFX.playClick) {
          window.soundFX.playClick();
        }
      });
    });
  }

  // ===================================================
  // 14. DYNAMIC PRODUCTS CATALOG LIST ENGINE
  // ===================================================
  const catalogGrid = document.getElementById('products-catalog-grid');
  const catalogTabs = document.querySelectorAll('.catalog-tab-btn');

  function renderCatalog(filter = 'all') {
    if (!catalogGrid || typeof PRODUCTS === 'undefined') return;

    let filtered = PRODUCTS;
    if (filter === 'laptop') {
      filtered = PRODUCTS.filter(p => p.deviceType === 'laptop');
    } else if (filter === 'desktop') {
      filtered = PRODUCTS.filter(p => p.deviceType === 'desktop');
    } else if (filter === 'budget') {
      filtered = PRODUCTS.filter(p => p.price <= 25000);
    }

    catalogGrid.innerHTML = filtered.map(p => {
      const isDesktop = p.deviceType === 'desktop';
      const deviceTagColor = isDesktop ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-cyan-50 border-cyan-200 text-cyan-800';
      const deviceIcon = isDesktop ? '🖥️ DESKTOP PC' : '💻 LAPTOP';
      const waMsg = encodeURIComponent(`Hello Classic Computers, I would like to order ${p.shortName || p.name} for Rs ${p.price.toLocaleString('en-IN')}. Please share unit photos and bank/UPI details.`);

      return `
        <article class="ios-liquid-glass rounded-2xl border border-slate-200/90 hover:border-cyan-400 p-5 flex flex-col justify-between shadow-ios-glass hover:shadow-ios-elevated transition-all duration-300 group">
          <div>
            <!-- Header badges -->
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${deviceTagColor}">
                ${deviceIcon}
              </span>
              <span class="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-bold">
                ✓ ${p.grade ? p.grade.split('(')[0].trim() : 'Grade A+'}
              </span>
            </div>

            <!-- Product Image -->
            <div class="relative w-full h-48 rounded-xl bg-white overflow-hidden mb-4 border border-slate-200/60 flex items-center justify-center p-2">
              <img src="${p.thumbnail}" alt="${p.name}" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy">
              ${p.isFeatured ? '<span class="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-mono font-bold shadow-xs">★ Bestseller</span>' : ''}
              <span class="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono">
                ${p.rating} ★ (${p.reviewsCount})
              </span>
            </div>

            <!-- Title -->
            <h3 class="font-black text-slate-900 text-base leading-snug group-hover:text-cyan-700 transition-colors">
              ${p.name}
            </h3>

            <!-- Clear Workflow Suitability Guidance Box -->
            <div class="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <div class="font-bold text-slate-900 flex items-center gap-1.5 mb-1 text-[11px] font-mono">
                <span class="text-cyan-600">🎯</span> IDEAL WORKFLOW:
              </div>
              <p class="text-slate-600 leading-relaxed text-[11px]">
                ${p.bestFor || 'Office productivity, coding, engineering, and multitasking.'}
              </p>
            </div>

            <!-- Specs Grid -->
            <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200/60 text-[11px]">
              <div>
                <span class="text-slate-500 block">Processor:</span>
                <span class="font-bold text-slate-800 truncate block">${p.specs?.processor?.split('(')[0] || 'Intel Core i7'}</span>
              </div>
              <div>
                <span class="text-slate-500 block">RAM & SSD:</span>
                <span class="font-bold text-slate-800 block">${p.specs?.ram || '16GB'} • ${p.specs?.storage?.split('+')[0] || '512GB'}</span>
              </div>
              <div class="col-span-2">
                <span class="text-slate-500 block">Display / Output:</span>
                <span class="font-bold text-slate-800 truncate block">${p.specs?.display || 'FHD Display'}</span>
              </div>
            </div>
          </div>

          <!-- Price & Actions Footer -->
          <div class="mt-5 pt-4 border-t border-slate-200/80">
            <div class="flex items-baseline justify-between mb-3">
              <div>
                <span class="text-2xl font-black text-slate-900 font-mono">₹${p.price.toLocaleString('en-IN')}</span>
                <span class="text-xs text-slate-400 line-through font-mono ml-2">₹${p.originalPrice.toLocaleString('en-IN')}</span>
              </div>
              <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                Save ${p.discountPercentage}%
              </span>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <a href="https://wa.me/919412182786?text=${waMsg}" target="_blank" class="apple-secondary-glass-btn py-2 text-center text-xs font-mono font-bold text-emerald-800 border-emerald-300 hover:bg-emerald-50 flex items-center justify-center gap-1 rounded-xl">
                <span>💬 WhatsApp</span>
              </a>
              <button onclick="window.storeEngine.addToCart(PRODUCTS.find(x => x.id === '${p.id}'))" class="apple-action-btn py-2 text-center text-xs font-mono font-bold flex items-center justify-center gap-1 rounded-xl shadow-xs">
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Setup tab filter clicks
  if (catalogTabs.length > 0) {
    catalogTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-filter');
        catalogTabs.forEach(t => {
          t.classList.remove('active', 'border-cyan-600', 'bg-cyan-600', 'text-white');
          t.classList.add('border-slate-200', 'bg-white', 'text-slate-700');
        });
        tab.classList.add('active', 'border-cyan-600', 'bg-cyan-600', 'text-white');
        tab.classList.remove('border-slate-200', 'bg-white', 'text-slate-700');

        renderCatalog(filter);

        if (window.soundFX && window.soundFX.playClick) {
          window.soundFX.playClick();
        }
      });
    });
  }

  // Initial render of product catalog
  renderCatalog('all');
});

