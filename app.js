/**
 * Dell XPS 15 — 3D Scroll Cinematic Experience
 * High-Performance Hardware-Accelerated Video Scrubbing & Motion Engine
 * Standards: ThreeUI / Three.js-Level Motion Quality, Fluidity & Responsiveness
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const video = document.getElementById('scroll-video');
  const videoCanvasWrap = document.querySelector('.video-canvas-wrap');
  const cinematicVignette = document.querySelector('.cinematic-vignette');
  const hudLayer = document.querySelector('.hud-layer');
  const heroContainer = document.getElementById('hero-scroll-container');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const progressStageText = document.getElementById('progress-stage-text');
  const stageCards = document.querySelectorAll('.stage-card');

  // Device & Motion State
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window && window.innerWidth <= 1024);

  // Video Scrubbing State
  let videoDuration = 10.0;
  let isVideoReady = false;
  let isSeeking = false;
  let queuedTargetTime = null;
  let lastCommittedTime = -1;
  let lastSeekTimestamp = 0;
  let decoderPrimed = false;
  let isEngineInitialized = false;
  let isHeroVisible = true;
  let isScrubDirty = true;

  // Motion Interpolation State
  let targetProgress = 0;
  let smoothProgress = 0;
  let currentStage = -1;

  // Pre-cached stage card elements to eliminate redundant DOM queries/parsing
  const cachedStageCards = Array.from(stageCards).map((card) => ({
    element: card,
    stage: parseInt(card.getAttribute('data-stage'), 10)
  }));

  // Viewport Awareness: Completely suspend video seek & ticker work when off-screen
  if ('IntersectionObserver' in window && heroContainer) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isHeroVisible = entry.isIntersecting;
        if (!isHeroVisible) {
          if (video && !video.paused) {
            try { video.pause(); } catch (e) {}
          }
        } else {
          isScrubDirty = true;
        }
      });
    }, { rootMargin: '100px 0px 100px 0px' });
    heroObserver.observe(heroContainer);
  }

  // Ensure video element is configured for ultra-fast scrubbing
  if (video) {
    if (!video.currentSrc && !video.src && video.children.length === 0) {
      video.src = isMobile ? 'assets/video/dell-scroll-mobile.mp4' : 'assets/video/dell-scroll.mp4';
    }
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = 'auto';

    video.addEventListener('seeked', () => {
      isSeeking = false;
      if (queuedTargetTime !== null && isHeroVisible) {
        const nextTime = queuedTargetTime;
        queuedTargetTime = null;
        dispatchVideoSeek(nextTime);
      }
    });

    video.addEventListener('error', (err) => {
      console.warn('Video element state event:', err);
    });
  }

  // Prime hardware video decoder pipeline on first user interaction or idle
  function primeDecoder() {
    if (decoderPrimed || !video) return;
    decoderPrimed = true;
    try {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(() => {
          video.pause();
        }).catch(() => {});
      }
    } catch (e) {}
  }

  window.addEventListener('scroll', primeDecoder, { once: true, passive: true });
  window.addEventListener('wheel', primeDecoder, { once: true, passive: true });
  window.addEventListener('touchstart', primeDecoder, { once: true, passive: true });
  window.addEventListener('click', primeDecoder, { once: true, passive: true });

  // Instant All-Intra Frame Seek Dispatcher (Keyframe on every frame = 1-2ms seek time)
  function dispatchVideoSeek(targetSeconds) {
    if (!video || !isVideoReady || videoDuration <= 0 || !isHeroVisible) return;

    if (isSeeking) {
      queuedTargetTime = targetSeconds;
      return;
    }

    if (Math.abs(lastCommittedTime - targetSeconds) < 0.008) {
      return;
    }

    isSeeking = true;
    lastCommittedTime = targetSeconds;
    video.currentTime = targetSeconds;
  }

  // Ultra-responsive, buttery-smooth RAF loop (Zero sludge, zero rubber-banding)
  function videoScrubTick() {
    if (!video || !isVideoReady || videoDuration <= 0 || !isHeroVisible) return;

    const delta = targetProgress - smoothProgress;
    const absDelta = Math.abs(delta);

    if (absDelta > 0.0002) {
      // Responsive 0.65 interpolation: instantaneous response with momentum fluidity
      const lerpRate = prefersReducedMotion ? 1.0 : (isMobile ? 0.80 : 0.65);
      smoothProgress += delta * lerpRate;
      isScrubDirty = true;
    } else if (isScrubDirty) {
      smoothProgress = targetProgress;
      isScrubDirty = false;
    } else {
      // Ensure any pending queued seek is flushed when settled
      if (queuedTargetTime !== null && !isSeeking) {
        const nextTime = queuedTargetTime;
        queuedTargetTime = null;
        dispatchVideoSeek(nextTime);
      }
      return;
    }

    const targetSeconds = Math.max(0.001, Math.min(videoDuration - 0.02, smoothProgress * videoDuration));
    dispatchVideoSeek(targetSeconds);

    // Subtle optical parallax only on desktop screens
    if (!prefersReducedMotion && window.innerWidth > 768) {
      if (videoCanvasWrap) {
        const subtleZoom = 1 + smoothProgress * 0.035;
        const subtleY = smoothProgress * -16;
        videoCanvasWrap.style.transform = `translate3d(0, ${subtleY.toFixed(2)}px, 0) scale(${subtleZoom.toFixed(4)})`;
      }
      if (cinematicVignette) {
        const vignetteY = smoothProgress * 14;
        cinematicVignette.style.transform = `translate3d(0, ${vignetteY.toFixed(2)}px, 0)`;
      }
    }

    // Graceful HUD dissolve when transitioning out of hero pinned section
    if (hudLayer) {
      if (smoothProgress > 0.93) {
        const fadeOut = Math.max(0, (1 - smoothProgress) / 0.07);
        hudLayer.style.opacity = fadeOut.toFixed(3);
      } else {
        hudLayer.style.opacity = '1';
      }
    }
  }

  // Master update pipeline: Synchronizes video, HUD, and narrative stage cards
  function applyProgress(progress) {
    const clamped = Math.max(0, Math.min(1, progress));
    if (Math.abs(targetProgress - clamped) > 0.0001) {
      targetProgress = clamped;
      isScrubDirty = true;
    }

    // 1. Update HUD Progress Bar
    if (progressBarFill) {
      progressBarFill.style.transform = `scaleX(${clamped})`;
    }

    // 2. Update Narrative Stage Overlays with Continuous Choreography
    updateStageCards(clamped);
  }

  // Synchronized narrative stage cards (01 to 05) with cached dataset
  function updateStageCards(progress) {
    let activeStage = 1;
    if (progress < 0.20) {
      activeStage = 1;
    } else if (progress < 0.40) {
      activeStage = 2;
    } else if (progress < 0.60) {
      activeStage = 3;
    } else if (progress < 0.80) {
      activeStage = 4;
    } else {
      activeStage = 5;
    }

    if (currentStage === activeStage) return;
    currentStage = activeStage;

    if (progressStageText) {
      progressStageText.textContent = `STAGE 0${activeStage} / 05`;
    }

    cachedStageCards.forEach((item) => {
      if (item.stage === activeStage) {
        item.element.classList.add('active');
      } else {
        item.element.classList.remove('active');
      }
    });
  }

  // Pre-activate Stage 1 narrative card immediately on load
  updateStageCards(0);

  // =========================================================================
  // 1. GSAP ScrollTrigger & Momentum Smooth Scroll Engine
  // =========================================================================
  function initScrollEngine() {
    if (isEngineInitialized) return;
    isEngineInitialized = true;

    if (video && video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
      videoDuration = video.duration;
    }

    // Paint initial frame
    if (video) {
      try {
        video.currentTime = 0.001;
      } catch (e) {}
    }

    const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
    let lenis = null;

    // Initialize Lenis Momentum Smooth Scroll Engine (Wheel-Only, Pure Native Touch)
    if (typeof Lenis !== 'undefined') {
      try {
        lenis = new Lenis({
          duration: prefersReducedMotion ? 0.01 : (isMobile ? 0.85 : 1.15),
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          smoothWheel: !prefersReducedMotion,
          wheelMultiplier: 0.95,
          touchMultiplier: 1.0,
          smoothTouch: false, // Strict native touch on mobile/touchscreens for 120Hz responsiveness
          syncTouch: false,
        });
        window._lenisInstance = lenis;

        lenis.on('scroll', () => {
          if (hasGSAP) ScrollTrigger.update();
          updateActiveNavLink();
        });

        if (hasGSAP) {
          gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
            videoScrubTick();
          });
          gsap.ticker.lagSmoothing(500, 33); // Graceful recovery instead of freezing
        } else {
          function raf(time) {
            lenis.raf(time);
            videoScrubTick();
            requestAnimationFrame(raf);
          }
          requestAnimationFrame(raf);
        }
      } catch (err) {
        console.warn('Lenis init failed, fallback engaged:', err);
      }
    }

    if (hasGSAP && heroContainer) {
      gsap.registerPlugin(ScrollTrigger);

      // Smooth scrub proxy with calibrated momentum dampening
      const proxy = { progress: 0 };

      gsap.to(proxy, {
        progress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: heroContainer,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0, // Direct 1:1 sync with momentum scroll — zero secondary lag!
          onUpdate: () => {
            applyProgress(proxy.progress);
          }
        }
      });

      // Recalculate on window resize
      ScrollTrigger.addEventListener('refresh', () => {
        if (heroContainer) {
          const rect = heroContainer.getBoundingClientRect();
          const total = heroContainer.offsetHeight - window.innerHeight;
          if (total > 0) {
            applyProgress(Math.max(0, Math.min(1, -rect.top / total)));
          }
        }
      });

      // Hardware-accelerated Section Entrance Reveals
      if (!prefersReducedMotion) {
        const revealGroups = [
          { selector: '.bento-card', trigger: '.section-performance' },
          { selector: '.gallery-showcase', trigger: '.section-gallery' },
          { selector: '.tier-card', trigger: '.section-configurator' },
          { selector: '.port-item', trigger: '.section-ports' }
        ];

        revealGroups.forEach((group) => {
          const els = document.querySelectorAll(group.selector);
          const trig = document.querySelector(group.trigger);
          if (els.length && trig) {
            gsap.fromTo(els,
              { opacity: 0, y: 24 },
              {
                opacity: 1,
                y: 0,
                duration: 0.65,
                stagger: 0.08,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: trig,
                  start: 'top 80%',
                  toggleActions: 'play none none none',
                  once: true
                }
              }
            );
          }
        });
      }
    } else if (heroContainer) {
      // Fallback RAF Lerp Engine
      let currentProgress = 0;
      let targetProgressVal = 0;

      function calcProgress() {
        const rect = heroContainer.getBoundingClientRect();
        const total = heroContainer.offsetHeight - window.innerHeight;
        if (total <= 0) return 0;
        return Math.max(0, Math.min(1, -rect.top / total));
      }

      window.addEventListener('scroll', () => {
        targetProgressVal = calcProgress();
        updateActiveNavLink();
      }, { passive: true });

      function fallbackRafLoop() {
        const diff = targetProgressVal - currentProgress;
        if (Math.abs(diff) > 0.001) {
          currentProgress += diff * 0.18;
          applyProgress(currentProgress);
        }
        videoScrubTick();
        requestAnimationFrame(fallbackRafLoop);
      }
      requestAnimationFrame(fallbackRafLoop);
    }

    // Set initial frame state
    applyProgress(0);
  }

  // Metadata lifecycle handler
  function onVideoReady() {
    isVideoReady = true;
    initScrollEngine();
  }

  if (video) {
    if (video.readyState >= 1) {
      onVideoReady();
    } else {
      video.addEventListener('loadedmetadata', onVideoReady, { once: true });
    }
  }

  // Safety fallback in case event doesn't trigger immediately
  setTimeout(() => {
    if (!isVideoReady) onVideoReady();
  }, 350);

  // =========================================================================
  // 2. Multi-Angle Interactive Product Gallery (Zero-Flicker Crossfade)
  // =========================================================================
  const galleryActiveImg = document.getElementById('gallery-active-img');
  const galleryTitle = document.getElementById('gallery-title');
  const galleryDesc = document.getElementById('gallery-desc');
  const galleryBadge = document.getElementById('gallery-category-badge');
  const galleryThumbs = document.querySelectorAll('.gallery-thumb');
  const galleryTabBtns = document.querySelectorAll('.gallery-tab-btn');

  // Preload all 6 high-resolution perspective images during idle
  const allGalleryImages = [
    'assets/images/dell-angled-open.jpg',
    'assets/images/dell-lid-perspective.jpg',
    'assets/images/dell-display-closeup.jpg',
    'assets/images/dell-lid-topdown.jpg',
    'assets/images/dell-front-open.jpg',
    'assets/images/dell-deck-vertical.jpg'
  ];

  function preloadGalleryImages() {
    allGalleryImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }

  const gallerySec = document.getElementById('gallery');
  if ('IntersectionObserver' in window && gallerySec) {
    const galleryObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        preloadGalleryImages();
        galleryObserver.disconnect();
      }
    }, { rootMargin: '400px 0px 400px 0px' });
    galleryObserver.observe(gallerySec);
  } else if ('requestIdleCallback' in window) {
    setTimeout(() => {
      window.requestIdleCallback(preloadGalleryImages);
    }, 2500);
  } else {
    setTimeout(preloadGalleryImages, 3500);
  }

  let isGalleryTransitioning = false;

  galleryThumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      if (thumb.classList.contains('active')) return;

      galleryThumbs.forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');

      const imgSrc = thumb.getAttribute('data-img');
      const cat = thumb.getAttribute('data-cat') || '';
      const title = thumb.getAttribute('data-title') || '';
      const desc = thumb.getAttribute('data-desc') || '';

      if (galleryActiveImg) {
        // Smooth optical refocusing transition with subtle scale
        galleryActiveImg.style.transition = 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
        galleryActiveImg.style.opacity = '0.35';
        galleryActiveImg.style.transform = 'scale(1.035)';

        const newImg = new Image();
        newImg.src = imgSrc;
        const commitImageSwap = () => {
          galleryActiveImg.src = imgSrc;
          galleryActiveImg.style.opacity = '1';
          galleryActiveImg.style.transform = 'scale(1.0)';
        };

        if (newImg.complete) {
          setTimeout(commitImageSwap, 80);
        } else {
          newImg.onload = commitImageSwap;
        }
      }

      if (galleryTitle) galleryTitle.textContent = title;
      if (galleryDesc) galleryDesc.textContent = desc;
      if (galleryBadge) galleryBadge.textContent = cat.toUpperCase();
    });
  });

  // Filter Tabs
  galleryTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      galleryTabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      galleryThumbs.forEach((thumb) => {
        const cat = (thumb.getAttribute('data-cat') || '').toLowerCase();
        if (filter === 'all' || cat.includes(filter)) {
          thumb.style.display = 'block';
        } else {
          thumb.style.display = 'none';
        }
      });
    });
  });

  // Lightbox Modal
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const galleryLightboxTrigger = document.getElementById('gallery-lightbox-trigger');

  if (galleryLightboxTrigger && lightboxModal && lightboxImg) {
    galleryLightboxTrigger.addEventListener('click', () => {
      if (galleryActiveImg) {
        lightboxImg.src = galleryActiveImg.src;
      }
      if (lightboxCaption && galleryTitle) {
        lightboxCaption.textContent = galleryTitle.textContent;
      }
      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-is-open');
    });

    function closeLightbox() {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-is-open');
    }

    if (lightboxCloseBtn) {
      lightboxCloseBtn.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // =========================================================================
  // 3. Classic Computer Empire Partner & Laptop Inventory System
  // =========================================================================
  const PARTNER_CONFIG = {
    businessName: 'Classic Computer Empire',
    instagramUrl: 'https://www.instagram.com/classic.computer.empire/',
    whatsappNumber: '', // Configurable placeholder; strictly no invented numbers
    whatsappDefaultMsg: 'Hello Classic Computer Empire, I would like to inquire about the laptop inventory listed on your website.'
  };

  const LAPTOP_INVENTORY = [
    {
      id: 'xps-creator',
      name: 'Dell XPS 15 9530',
      edition: 'Creator Edition · Factory Sealed',
      manufacturer: 'Dell Technologies',
      status: 'new',
      grade: 'Brand New (Factory Sealed)',
      gradePill: 'Brand New',
      price: '$1,899',
      conditionOverall: 'Brand New In Box (Factory Sealed)',
      cosmeticCondition: 'Pristine factory new, zero blemishes',
      batteryCondition: '100% Factory capacity (86Whr internal)',
      displayCondition: '15.6" FHD+ 500 nits, factory calibrated',
      keyboardInput: 'New backlit chiclet keyboard & precision glass touchpad',
      storageHealth: '100% SMART Health (512GB PCIe Gen4 M.2 SSD)',
      performanceTest: 'Factory QC Certified Intel i7-13700H & RTX 4050',
      accessories: 'Original Dell 130W USB-C charger & cable in sealed box',
      warranty: '3-Year Premium ProSupport / Official Manufacturer Warranty'
    },
    {
      id: 'xps-studio',
      name: 'Dell XPS 15 9530',
      edition: 'Studio Pro · Factory Sealed',
      manufacturer: 'Dell Technologies',
      status: 'new',
      grade: 'Brand New (Factory Sealed)',
      gradePill: 'Brand New',
      price: '$2,399',
      conditionOverall: 'Brand New In Box (Factory Sealed)',
      cosmeticCondition: 'Pristine factory new, zero blemishes',
      batteryCondition: '100% Factory capacity (86Whr internal)',
      displayCondition: '15.6" 3.5K OLED Touch, factory calibrated',
      keyboardInput: 'New backlit chiclet keyboard & precision glass touchpad',
      storageHealth: '100% SMART Health (1TB PCIe Gen4 M.2 SSD)',
      performanceTest: 'Factory QC Certified Intel i9-13900H & RTX 4060',
      accessories: 'Original Dell 130W USB-C charger & cable in sealed box',
      warranty: '3-Year Premium ProSupport / Official Manufacturer Warranty'
    },
    {
      id: 'xps-extreme',
      name: 'Dell XPS 15 9530',
      edition: 'Extreme Performance · Factory Sealed',
      manufacturer: 'Dell Technologies',
      status: 'new',
      grade: 'Brand New (Factory Sealed)',
      gradePill: 'Brand New',
      price: '$2,999',
      conditionOverall: 'Brand New In Box (Factory Sealed)',
      cosmeticCondition: 'Pristine factory new, zero blemishes',
      batteryCondition: '100% Factory capacity (86Whr internal)',
      displayCondition: '15.6" 3.5K OLED Anti-Reflective, factory calibrated',
      keyboardInput: 'New backlit chiclet keyboard & precision glass touchpad',
      storageHealth: '100% SMART Health (2TB PCIe Gen4 M.2 SSD)',
      performanceTest: 'Factory QC Certified Intel i9-13900H & RTX 4070',
      accessories: 'Original Dell 130W USB-C charger & cable in sealed box',
      warranty: '3-Year Premium ProSupport / Official Manufacturer Warranty'
    },
    {
      id: 'latitude-5400',
      name: 'Dell Latitude 5400',
      edition: 'Enterprise Workstation · Inspected',
      manufacturer: 'Dell Technologies',
      status: 'refurbished',
      grade: 'Grade A (Corporate Workstation)',
      gradePill: 'Grade A',
      price: '₹24,999',
      conditionOverall: 'Inspected Pre-Owned (Grade A)',
      cosmeticCondition: 'Minimal signs of wear, clean aluminum/composite chassis, no structural cracks or dents',
      batteryCondition: 'Health Tested & Verified >85% original capacity, healthy charge retention',
      displayCondition: 'Clean 14.0" FHD panel, zero dead pixels, uniform backlighting, smooth hinge action',
      keyboardInput: '100% key actuation tested, tactile response verified, precision tracking fully functional',
      storageHealth: '100% S.M.A.R.T. Health Score (512GB Fast NVMe SSD), zero bad sectors, sanitized',
      performanceTest: 'Passed 30-min sustained CPU stress & thermal benchmark loop without throttling',
      accessories: 'Original OEM Dell Power Adapter & Power Cable included',
      warranty: '3–6 Months Warranty Card Support (Hardware & Diagnostics Guarantee)'
    },
    {
      id: 'precision-5540',
      name: 'Dell Precision 5540',
      edition: 'Mobile Workstation CAD Edition · ISV Certified',
      manufacturer: 'Dell Technologies',
      status: 'refurbished',
      grade: 'Grade A+ (Mint Workstation)',
      gradePill: 'Grade A+',
      price: '₹48,999',
      conditionOverall: 'Inspected Pre-Owned (Grade A+)',
      cosmeticCondition: 'Minor hairline lid scuffs consistent with light professional use, clean palm rest, zero structural dents',
      batteryCondition: 'Health Tested & Verified >85% original capacity, healthy discharge curve',
      displayCondition: '15.6" UltraSharp FHD 100% sRGB, zero dead pixels, anti-glare finish clean',
      keyboardInput: 'Backlit keyboard responsive, all shortcuts functional, smooth glass touchpad',
      storageHealth: '100% S.M.A.R.T. Health Score (512GB NVMe SSD), zero bad sectors, sanitized',
      performanceTest: 'Passed sustained multi-core benchmark with NVIDIA Quadro T1000 GPU stress test',
      accessories: 'Original OEM Dell High-Wattage Power Adapter included',
      warranty: '3–6 Months Warranty Card Support (Hardware & Diagnostics Guarantee)'
    },
    {
      id: 'thinkpad-t480',
      name: 'Lenovo ThinkPad T480',
      edition: 'Business Classic · Dual Battery',
      manufacturer: 'Lenovo',
      status: 'refurbished',
      grade: 'Grade A (Business Classic)',
      gradePill: 'Grade A',
      price: '₹22,999',
      conditionOverall: 'Inspected Pre-Owned (Grade A)',
      cosmeticCondition: 'Clean matte composite body, minimal wear on keycaps, zero chassis cracks',
      batteryCondition: 'Dual internal & external hot-swap batteries tested >85% combined capacity',
      displayCondition: '14.0" FHD IPS panel, vibrant colors, zero dead pixels, firm stainless steel hinges',
      keyboardInput: 'Legendary spill-resistant ThinkPad keyboard 100% functional, TrackPoint & touchpad responsive',
      storageHealth: '100% S.M.A.R.T. Health Score (256GB NVMe SSD), zero bad sectors, sanitized',
      performanceTest: 'Passed 30-min multi-core CPU burn-in with dual thermal heatpipe verification',
      accessories: 'Original OEM Lenovo USB-C Fast Charger included',
      warranty: '3–6 Months Warranty Card Support (Hardware & Diagnostics Guarantee)'
    }
  ];

  // Inventory Category & Budget Dual Filtering
  const inventoryTabButtons = document.querySelectorAll('.inventory-tab-btn');
  const budgetChipButtons = document.querySelectorAll('.budget-chip-btn');
  const inventoryCards = document.querySelectorAll('.inventory-card');

  let currentCategoryFilter = 'all';
  let currentBudgetFilter = 'all';

  function filterInventory() {
    inventoryCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category');
      const cardBudget = (card.getAttribute('data-budget') || '').split(/\s+/);

      const matchesCategory = currentCategoryFilter === 'all' || cardCategory === currentCategoryFilter;
      const matchesBudget = currentBudgetFilter === 'all' || cardBudget.includes(currentBudgetFilter);

      if (matchesCategory && matchesBudget) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  inventoryTabButtons.forEach((tab) => {
    tab.addEventListener('click', () => {
      currentCategoryFilter = tab.getAttribute('data-filter');

      inventoryTabButtons.forEach((btn) => {
        const isSelected = btn === tab;
        btn.classList.toggle('active', isSelected);
        btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      });

      filterInventory();
    });
  });

  budgetChipButtons.forEach((chip) => {
    chip.addEventListener('click', () => {
      currentBudgetFilter = chip.getAttribute('data-budget');

      budgetChipButtons.forEach((btn) => {
        btn.classList.toggle('active', btn === chip);
      });

      filterInventory();
    });
  });

  // Product Inspection Detail Modal Elements
  const productDetailModal = document.getElementById('product-detail-modal');
  const detailCloseBtn = document.getElementById('detail-close-btn');
  const detailModalBadge = document.getElementById('detail-modal-badge');
  const detailModalGrade = document.getElementById('detail-modal-grade');
  const detailModalMfr = document.getElementById('detail-modal-mfr');
  const detailModalTitle = document.getElementById('detail-modal-title');
  const detailModalEdition = document.getElementById('detail-modal-edition');
  const detailModalPrice = document.getElementById('detail-modal-price');

  const detailCondOverall = document.getElementById('detail-cond-overall');
  const detailCondCosmetic = document.getElementById('detail-cond-cosmetic');
  const detailCondBattery = document.getElementById('detail-cond-battery');
  const detailCondDisplay = document.getElementById('detail-cond-display');
  const detailCondInput = document.getElementById('detail-cond-input');
  const detailCondStorage = document.getElementById('detail-cond-storage');
  const detailCondPerf = document.getElementById('detail-cond-perf');
  const detailCondAccessories = document.getElementById('detail-cond-accessories');
  const detailCondWarranty = document.getElementById('detail-cond-warranty');
  const detailWaBtn = document.getElementById('detail-wa-btn');

  function openProductDetail(productId) {
    const item = LAPTOP_INVENTORY.find((x) => x.id === productId);
    if (!item || !productDetailModal) return;

    if (detailModalTitle) detailModalTitle.textContent = item.name;
    if (detailModalEdition) detailModalEdition.textContent = item.edition;
    if (detailModalPrice) detailModalPrice.textContent = item.price;
    if (detailModalMfr) detailModalMfr.textContent = item.manufacturer;

    if (detailModalBadge) {
      if (item.status === 'refurbished') {
        detailModalBadge.className = 'product-badge badge-refurbished';
        detailModalBadge.innerHTML = '<span class="badge-dot"></span> REFURBISHED';
      } else {
        detailModalBadge.className = 'product-badge badge-new';
        detailModalBadge.innerHTML = '<span class="badge-dot"></span> NEW';
      }
    }

    if (detailModalGrade) {
      detailModalGrade.textContent = item.gradePill || 'Grade A';
      if (item.gradePill === 'Grade A+') {
        detailModalGrade.className = 'grade-pill-tag grade-pill-aplus';
      } else if (item.gradePill === 'Grade A') {
        detailModalGrade.className = 'grade-pill-tag grade-pill-a';
      } else if (item.gradePill === 'Grade B') {
        detailModalGrade.className = 'grade-pill-tag grade-pill-b';
      } else {
        detailModalGrade.className = 'grade-pill-tag grade-pill-new';
      }
    }

    if (detailCondOverall) detailCondOverall.textContent = item.conditionOverall;
    if (detailCondCosmetic) detailCondCosmetic.textContent = item.cosmeticCondition;
    if (detailCondBattery) detailCondBattery.textContent = item.batteryCondition;
    if (detailCondDisplay) detailCondDisplay.textContent = item.displayCondition;
    if (detailCondInput) detailCondInput.textContent = item.keyboardInput;
    if (detailCondStorage) detailCondStorage.textContent = item.storageHealth;
    if (detailCondPerf) detailCondPerf.textContent = item.performanceTest;
    if (detailCondAccessories) detailCondAccessories.textContent = item.accessories;
    if (detailCondWarranty) detailCondWarranty.textContent = item.warranty;

    // Compose WhatsApp inquiry link with exact product and grade
    if (detailWaBtn) {
      const waMsg = `Hello ${PARTNER_CONFIG.businessName}, I would like to inquire about the ${item.name} (${item.edition}) - ${item.grade || ''} listed for ${item.price} on your website.`;
      const waUrl = PARTNER_CONFIG.whatsappNumber
        ? `https://wa.me/${PARTNER_CONFIG.whatsappNumber}?text=${encodeURIComponent(waMsg)}`
        : `https://wa.me/?text=${encodeURIComponent(waMsg)}`;
      detailWaBtn.href = waUrl;
    }

    productDetailModal.classList.add('active');
    productDetailModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-is-open');
  }

  function closeProductDetail() {
    if (productDetailModal) {
      productDetailModal.classList.remove('active');
      productDetailModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-is-open');
    }
  }

  if (detailCloseBtn) detailCloseBtn.addEventListener('click', closeProductDetail);
  if (productDetailModal) {
    productDetailModal.addEventListener('click', (e) => {
      if (e.target === productDetailModal) closeProductDetail();
    });
  }

  // Trigger buttons: View Specs / Condition Report
  document.querySelectorAll('.view-specs-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const productId = btn.getAttribute('data-id');
      openProductDetail(productId);
    });
  });

  // Trigger buttons: Direct Ask on WhatsApp
  document.querySelectorAll('.ask-wa-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const productId = btn.getAttribute('data-id');
      const item = LAPTOP_INVENTORY.find((x) => x.id === productId);
      const itemName = item ? item.name : 'laptop';
      const itemPrice = item ? item.price : '';
      const itemGrade = item && item.grade ? ` [${item.grade}]` : '';
      const waMsg = `Hello ${PARTNER_CONFIG.businessName}, I would like to inquire about the ${itemName}${itemGrade} (${itemPrice}) listed on your website.`;
      const waUrl = PARTNER_CONFIG.whatsappNumber
        ? `https://wa.me/${PARTNER_CONFIG.whatsappNumber}?text=${encodeURIComponent(waMsg)}`
        : `https://wa.me/?text=${encodeURIComponent(waMsg)}`;

      window.open(waUrl, '_blank', 'noopener,noreferrer');
      showToast(`Connecting to WhatsApp inquiry for ${itemName}...`);
    });
  });

  // =========================================================================
  // 4. Model Configurator & Checkout Flow
  // =========================================================================
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutCloseBtn = document.getElementById('checkout-close-btn');
  const cancelOrderBtn = document.getElementById('cancel-order-btn');
  const confirmOrderBtn = document.getElementById('confirm-order-btn');
  const modalModelTitle = document.getElementById('modal-model-title');
  const modalModelPrice = document.getElementById('modal-model-price');
  const configButtons = document.querySelectorAll('.select-config-btn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  configButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const model = btn.getAttribute('data-model');
      const price = btn.getAttribute('data-price');

      if (modalModelTitle) modalModelTitle.textContent = `Dell XPS 15 ${model}`;
      if (modalModelPrice) modalModelPrice.textContent = `$${price}`;

      if (checkoutModal) {
        checkoutModal.classList.add('active');
        checkoutModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-is-open');
      }
    });
  });

  function closeCheckout() {
    if (checkoutModal) {
      checkoutModal.classList.remove('active');
      checkoutModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-is-open');
    }
  }

  if (checkoutCloseBtn) checkoutCloseBtn.addEventListener('click', closeCheckout);
  if (cancelOrderBtn) cancelOrderBtn.addEventListener('click', closeCheckout);
  if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
      if (e.target === checkoutModal) closeCheckout();
    });
  }

  if (confirmOrderBtn) {
    confirmOrderBtn.addEventListener('click', () => {
      closeCheckout();
      showToast('Order confirmed! Priority dispatch reserved. Check email for invoice.');
    });
  }

  function showToast(msg) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // =========================================================================
  // 4. Back to Top Button
  // =========================================================================
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      if (window._lenisInstance) {
        window._lenisInstance.scrollTo(0, { 
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // =========================================================================
  // 5. Ambient Synthesizer (Web Audio API)
  // =========================================================================
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioLabel = document.getElementById('audio-label');
  let audioCtx = null;
  let isPlayingAudio = false;
  let masterGain = null;
  let droneOsc = null;

  function toggleAmbientSound() {
    if (!isPlayingAudio) {
      try {
        if (!audioCtx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          audioCtx = new AudioContext();

          masterGain = audioCtx.createGain();
          masterGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
          masterGain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 2);
          masterGain.connect(audioCtx.destination);

          // Deep harmonic sub-drone (110Hz A2)
          droneOsc = audioCtx.createOscillator();
          droneOsc.type = 'sine';
          droneOsc.frequency.setValueAtTime(110, audioCtx.currentTime);

          // Soft low-pass filter for misty warmth
          const filter = audioCtx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(320, audioCtx.currentTime);

          droneOsc.connect(filter);
          filter.connect(masterGain);
          droneOsc.start();
        } else {
          audioCtx.resume();
          masterGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
          masterGain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 1);
        }
        isPlayingAudio = true;
        if (audioToggleBtn) {
          audioToggleBtn.classList.add('active');
          audioToggleBtn.setAttribute('aria-pressed', 'true');
        }
        if (audioLabel) audioLabel.textContent = 'Mute';
        showToast('Ambient spatial soundscape active.');
      } catch (err) {
        console.error('Audio initialization failed:', err);
      }
    } else {
      if (audioCtx && masterGain) {
        masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
        setTimeout(() => audioCtx.suspend(), 500);
      }
      isPlayingAudio = false;
      if (audioToggleBtn) {
        audioToggleBtn.classList.remove('active');
        audioToggleBtn.setAttribute('aria-pressed', 'false');
      }
      if (audioLabel) audioLabel.textContent = 'Sound On';
    }
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', toggleAmbientSound);
  }

  // =========================================================================
  // 6. Smooth In-Page Anchor Navigation & Active State Tracking
  // =========================================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');

  function openMobileNav() {
    if (!mobileNavDrawer) return;
    mobileNavDrawer.classList.add('open');
    mobileNavDrawer.setAttribute('aria-hidden', 'false');
    if (mobileMenuBtn) {
      mobileMenuBtn.classList.add('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!mobileNavDrawer) return;
    mobileNavDrawer.classList.remove('open');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    if (mobileMenuBtn) {
      mobileMenuBtn.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      if (mobileNavDrawer && mobileNavDrawer.classList.contains('open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
  if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMobileNav);

  // Close drawer on link click and smoothly scroll to section
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        closeMobileNav();
        const offsetValue = window.innerWidth <= 768 ? -70 : -90;
        if (window._lenisInstance) {
          window._lenisInstance.scrollTo(targetEl, { 
            offset: offsetValue, 
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        } else {
          const top = targetEl.getBoundingClientRect().top + window.pageYOffset + offsetValue;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  // Dynamic active navigation indicator tracking (Zero Layout Thrashing with pre-cached offsets)
  const navTrackedData = [
    { id: 'hero-scroll-container', linkSelector: 'a[href="#hero-scroll-container"]' },
    { id: 'performance', linkSelector: 'a[href="#performance"]' },
    { id: 'inspection', linkSelector: 'a[href="#inspection"]' },
    { id: 'inventory', linkSelector: 'a[href="#inventory"]' },
    { id: 'gallery', linkSelector: 'a[href="#gallery"]' },
    { id: 'ports', linkSelector: 'a[href="#ports"]' }
  ].map((item) => ({
    ...item,
    element: document.getElementById(item.id),
    links: Array.from(document.querySelectorAll(item.linkSelector)),
    cachedTop: 0
  }));

  function recalculateNavOffsets() {
    navTrackedData.forEach((item) => {
      if (item.element) {
        item.cachedTop = item.element.offsetTop - 140;
      }
    });
  }

  // Calculate once on init and update on debounced resize only
  recalculateNavOffsets();
  let navResizeDebounce = null;
  window.addEventListener('resize', () => {
    clearTimeout(navResizeDebounce);
    navResizeDebounce = setTimeout(recalculateNavOffsets, 150);
  }, { passive: true });

  let currentActiveNavId = 'hero-scroll-container';
  let isNavUpdateScheduled = false;

  function updateActiveNavLink() {
    if (isNavUpdateScheduled) return;
    isNavUpdateScheduled = true;

    requestAnimationFrame(() => {
      isNavUpdateScheduled = false;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      let newActiveId = 'hero-scroll-container';

      for (let i = navTrackedData.length - 1; i >= 0; i--) {
        if (scrollY >= navTrackedData[i].cachedTop) {
          newActiveId = navTrackedData[i].id;
          break;
        }
      }

      if (newActiveId === currentActiveNavId) return; // Zero DOM mutations when unchanged
      currentActiveNavId = newActiveId;

      navTrackedData.forEach((item) => {
        const isActive = item.id === currentActiveNavId;
        item.links.forEach((link) => {
          link.classList.toggle('active', isActive);
        });
      });
    });
  }

  // Single passive scroll listener
  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // Initial call
  updateActiveNavLink();
});
