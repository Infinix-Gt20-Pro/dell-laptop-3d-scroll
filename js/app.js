/**
 * Classic Computer - Main Flagship Application Controller (index.html)
 * Coordinates 3D Canvas Scrubber, Hotspots, 4K Display Simulator,
 * Google Flow / Astra AI Matchmaker, Studio Configurator, and Lightbox Gallery
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Initialize Ultra-Fluid Kinetic Smooth Scroll Engine (Lenis)
  if (typeof window.Lenis !== 'undefined' && !window.lenis) {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple exponential curve
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.15,
      infinite: false,
    });
    window.lenis = lenis;

    function lenisRaf(time) {
      lenis.raf(time);
      requestAnimationFrame(lenisRaf);
    }
    requestAnimationFrame(lenisRaf);

    window.dispatchEvent(new CustomEvent('lenis-ready', { detail: { lenis } }));
  }

  // 1. Initialize 3D Video Scrubber for Hero (singleton)
  const scrubber = window.heroScrubber || new HeroVideoScrubber({
    canvasId: 'hero-canvas',
    containerId: 'hero-scroll-container',
    totalFrames: 240
  });

  // Expose globally
  window.heroScrubber = scrubber;

  // 2. Play/Pause Tour handled directly inside HeroVideoScrubber instance

  // 3. Hotspot Interactive Click Handlers
  document.querySelectorAll('.hotspot-pin').forEach(pin => {
    pin.addEventListener('click', (e) => {
      const targetProgress = parseFloat(pin.getAttribute('data-target-progress') || '0');
      scrubber.jumpToProgress(targetProgress);

      // Pulse active state
      document.querySelectorAll('.hotspot-pin').forEach(p => p.classList.remove('active'));
      pin.classList.add('active');

      setTimeout(() => {
        pin.classList.remove('active');
      }, 4000);
    });
  });

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

  // 6. Ambient Spatial Audio Synthesizer (Web Audio API)
  let audioCtx = null;
  let isAudioPlaying = false;
  let synthGain = null;

  const audioToggleBtn = document.getElementById('ambient-audio-toggle');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      if (!isAudioPlaying) {
        try {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const osc1 = audioCtx.createOscillator();
          const osc2 = audioCtx.createOscillator();
          synthGain = audioCtx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(55, audioCtx.currentTime); // Deep subtle ambient drone A1
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(110, audioCtx.currentTime); // Soft harmonic

          synthGain.gain.setValueAtTime(0.015, audioCtx.currentTime);

          osc1.connect(synthGain);
          osc2.connect(synthGain);
          synthGain.connect(audioCtx.destination);

          osc1.start();
          osc2.start();
          isAudioPlaying = true;
          audioToggleBtn.classList.add('border-cyan-400', 'text-cyan-400');
          storeEngine.showToast('Ambient Soundscape Activated');
        } catch (e) {
          console.error(e);
        }
      } else {
        if (audioCtx) {
          audioCtx.close();
          audioCtx = null;
        }
        isAudioPlaying = false;
        audioToggleBtn.classList.remove('border-cyan-400', 'text-cyan-400');
        storeEngine.showToast('Sound Muted');
      }
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

  // 8. Dell 5530 Studio Configurator
  const basePrice = 34999;
  let selectedRamExtra = 0;
  let selectedSsdExtra = 0;
  let selectedWarrantyExtra = 0;
  let ramLabel = "8GB DDR4";
  let ssdLabel = "256GB NVMe SSD";
  let warrantyLabel = "6 Months Certified";

  const ramInputs = document.querySelectorAll('input[name="config-ram"]');
  const ssdInputs = document.querySelectorAll('input[name="config-ssd"]');
  const warrantyInputs = document.querySelectorAll('input[name="config-warranty"]');
  const totalPriceDisplay = document.getElementById('config-total-price');

  const updateConfigurator = () => {
    const total = basePrice + selectedRamExtra + selectedSsdExtra + selectedWarrantyExtra;
    if (totalPriceDisplay) {
      totalPriceDisplay.textContent = `₹${total.toLocaleString('en-IN')}`;
    }

    const summaryRam = document.getElementById('config-summary-ram');
    const summarySsd = document.getElementById('config-summary-ssd');
    const summaryWarranty = document.getElementById('config-summary-warranty');

    if (summaryRam) summaryRam.textContent = ramLabel;
    if (summarySsd) summarySsd.textContent = ssdLabel;
    if (summaryWarranty) summaryWarranty.textContent = warrantyLabel;
  };

  ramInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      selectedRamExtra = parseInt(e.target.value, 10);
      ramLabel = e.target.getAttribute('data-label');
      updateConfigurator();
    });
  });

  ssdInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      selectedSsdExtra = parseInt(e.target.value, 10);
      ssdLabel = e.target.getAttribute('data-label');
      updateConfigurator();
    });
  });

  warrantyInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      selectedWarrantyExtra = parseInt(e.target.value, 10);
      warrantyLabel = e.target.getAttribute('data-label');
      updateConfigurator();
    });
  });

  // Configurator Buy Buttons
  const configAddCartBtn = document.getElementById('config-add-cart-btn');
  if (configAddCartBtn) {
    configAddCartBtn.addEventListener('click', () => {
      const customItem = {
        ...PRODUCTS[0],
        customRam: ramLabel,
        customSsd: ssdLabel,
        customWarranty: warrantyLabel,
        customPrice: basePrice + selectedRamExtra + selectedSsdExtra + selectedWarrantyExtra
      };
      storeEngine.addToCart(customItem);
    });
  }

  const configWhatsAppBtn = document.getElementById('config-whatsapp-buy-btn');
  if (configWhatsAppBtn) {
    configWhatsAppBtn.addEventListener('click', () => {
      const total = basePrice + selectedRamExtra + selectedSsdExtra + selectedWarrantyExtra;
      const message = `Hello Classic Computer Team!\n\nI want to order a customized Dell Precision 5530 4K Workstation:\n- Memory: ${ramLabel}\n- Storage: ${ssdLabel}\n- Warranty: ${warrantyLabel}\n- Calculated Total: ₹${total.toLocaleString('en-IN')}\n\nPlease share delivery confirmation and bank/UPI details!`;
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
      storeEngine.closeCart();
      storeEngine.closeAuthModal();
      storeEngine.closeCheckoutModal();
    }
  });
});
