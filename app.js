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

  // Video Scrubbing State
  let videoDuration = 10.0;
  let isVideoReady = false;
  let isSeeking = false;
  let queuedTargetTime = null;
  let lastCommittedTime = -1;
  let decoderPrimed = false;
  let isEngineInitialized = false;

  // Motion Interpolation State
  let targetProgress = 0;
  let smoothProgress = 0;
  let currentStage = -1;

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Configure video element for ultra-low-latency scrubbing
  if (video) {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = 'auto';

    video.addEventListener('seeked', () => {
      isSeeking = false;
      if (queuedTargetTime !== null) {
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

  // Low-latency hardware seek dispatcher with ordered non-blocking queue
  function dispatchVideoSeek(targetSeconds) {
    if (!video || !isVideoReady || videoDuration <= 0) return;

    if (isSeeking) {
      queuedTargetTime = targetSeconds;
      return;
    }

    // Deadband threshold: avoid redundant micro-seeks under ~1 video frame (~0.016s)
    if (Math.abs(lastCommittedTime - targetSeconds) < 0.016) {
      return;
    }

    isSeeking = true;
    lastCommittedTime = targetSeconds;

    if (typeof video.fastSeek === 'function') {
      try {
        video.fastSeek(targetSeconds);
      } catch (err) {
        video.currentTime = targetSeconds;
      }
    } else {
      video.currentTime = targetSeconds;
    }
  }

  // Single scheduler tick function (called from GSAP / Lenis RAF loop)
  function videoScrubTick() {
    if (!video || !isVideoReady || videoDuration <= 0) return;

    // Smooth exponential lerp interpolation towards target scroll progress
    const lerpRate = prefersReducedMotion ? 1.0 : 0.22;
    smoothProgress += (targetProgress - smoothProgress) * lerpRate;

    // Convert progress to exact clamped seconds
    const targetSeconds = Math.max(0.001, Math.min(videoDuration - 0.02, smoothProgress * videoDuration));
    dispatchVideoSeek(targetSeconds);

    // Subtle optical parallax and camera zoom layers (ThreeUI depth aesthetic)
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
    targetProgress = clamped;

    // 1. Update HUD Progress Bar
    if (progressBarFill) {
      progressBarFill.style.transform = `scaleX(${clamped})`;
    }

    // 2. Update Narrative Stage Overlays with Continuous Choreography
    updateStageCards(clamped);
  }

  // Synchronized narrative stage cards (01 to 05) with fluid timing
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

    stageCards.forEach((card) => {
      const cardStage = parseInt(card.getAttribute('data-stage'), 10);
      if (cardStage === activeStage) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
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
          duration: prefersReducedMotion ? 0.01 : 1.15,
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
          gsap.ticker.lagSmoothing(0);
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
          scrub: true, // Let Lenis handle the smoothing, no double interpolation
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

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(preloadGalleryImages);
  } else {
    setTimeout(preloadGalleryImages, 1000);
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
  // 3. Model Configurator & Checkout Flow
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

  // Dynamic active navigation indicator tracking
  const navTrackedSections = [
    { id: 'hero-scroll-container', linkSelector: 'a[href="#hero-scroll-container"]' },
    { id: 'performance', linkSelector: 'a[href="#performance"]' },
    { id: 'gallery', linkSelector: 'a[href="#gallery"]' },
    { id: 'configurator', linkSelector: 'a[href="#configurator"]' },
    { id: 'ports', linkSelector: 'a[href="#ports"]' }
  ];

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    let currentActiveId = 'hero-scroll-container';

    for (let i = navTrackedSections.length - 1; i >= 0; i--) {
      const sec = document.getElementById(navTrackedSections[i].id);
      if (sec) {
        const top = sec.offsetTop - 140;
        if (scrollY >= top) {
          currentActiveId = navTrackedSections[i].id;
          break;
        }
      }
    }

    navTrackedSections.forEach((item) => {
      const links = document.querySelectorAll(item.linkSelector);
      links.forEach((link) => {
        if (item.id === currentActiveId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    });
  }

  // Initial call
  updateActiveNavLink();
});
