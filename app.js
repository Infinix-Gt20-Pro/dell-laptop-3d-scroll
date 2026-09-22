/**
 * Dell XPS 15 — 3D Scroll Cinematic Experience
 * High-Performance Hardware-Accelerated Video Scrubbing Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const video = document.getElementById('scroll-video');
  const heroContainer = document.getElementById('hero-scroll-container');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const progressStageText = document.getElementById('progress-stage-text');
  const stageCards = document.querySelectorAll('.stage-card');

  // Video Scrubbing State
  let videoDuration = 10.0;
  let isVideoReady = false;
  let isSeeking = false;
  let pendingTargetTime = null;
  let lastSeekTime = 0;
  let decoderPrimed = false;
  let isEngineInitialized = false;

  // Configure video element for low-latency scrubbing
  if (video) {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.addEventListener('seeked', () => {
      isSeeking = false;
    });
  }

  // Prime hardware video decoder pipeline on first user interaction
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

  let globalTargetProgress = 0;
  let lastVideoTimeUpdate = -1;

  // Single scheduler tick function (called from GSAP or Lenis RAF)
  function videoScrubTick() {
    if (video && isVideoReady && videoDuration > 0 && !isSeeking) {
      const targetSeconds = globalTargetProgress * videoDuration;
      const clampedTarget = Math.max(0.001, Math.min(videoDuration - 0.02, targetSeconds));
      
      // Prevent microscopic seek spam to preserve main thread performance
      if (Math.abs(lastVideoTimeUpdate - clampedTarget) > 0.03) {
        try {
          isSeeking = true;
          video.currentTime = clampedTarget;
          lastVideoTimeUpdate = clampedTarget;
        } catch (err) {
          isSeeking = false;
        }
      }
    }
  }

  // Master update pipeline: Synchronizes video, HUD, and narrative stage cards
  function applyProgress(progress) {
    const clamped = Math.max(0, Math.min(1, progress));
    globalTargetProgress = clamped;

    // 2. Update HUD Progress Bar
    if (progressBarFill) {
      progressBarFill.style.transform = `scaleX(${clamped})`;
    }

    // 3. Update Narrative Stage Overlays
    updateStageCards(clamped);
  }

  let currentStage = -1;
  // Synchronized narrative stage cards (01 to 05)
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
  // 1. GSAP ScrollTrigger & Adaptive Scrubbing Engine
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
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis = null;

    // Initialize Lenis Momentum Smooth Scroll Engine (Wheel-Only, Pure Native Touch)
    if (typeof Lenis !== 'undefined') {
      try {
        lenis = new Lenis({
          duration: prefersReducedMotion ? 0.01 : 0.95,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          smoothWheel: !prefersReducedMotion,
          wheelMultiplier: 0.95,
          touchMultiplier: 1.0,
          smoothTouch: false, // Strict native touch on mobile/touchscreens
          syncTouch: false,
        });
        window._lenisInstance = lenis;

        lenis.on('scroll', () => {
          if (hasGSAP) ScrollTrigger.update();
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
      let targetProgress = 0;

      function calcProgress() {
        const rect = heroContainer.getBoundingClientRect();
        const total = heroContainer.offsetHeight - window.innerHeight;
        if (total <= 0) return 0;
        return Math.max(0, Math.min(1, -rect.top / total));
      }

      window.addEventListener('scroll', () => {
        targetProgress = calcProgress();
      }, { passive: true });

      function fallbackRafLoop() {
        const diff = targetProgress - currentProgress;
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
  // 2. Multi-Angle Interactive Product Gallery
  // =========================================================================
  const galleryActiveImg = document.getElementById('gallery-active-img');
  const galleryTitle = document.getElementById('gallery-title');
  const galleryDesc = document.getElementById('gallery-desc');
  const galleryBadge = document.getElementById('gallery-category-badge');
  const galleryThumbs = document.querySelectorAll('.gallery-thumb');
  const galleryTabBtns = document.querySelectorAll('.gallery-tab-btn');

  galleryThumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      galleryThumbs.forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');

      const imgSrc = thumb.getAttribute('data-img');
      const cat = thumb.getAttribute('data-cat') || '';
      const title = thumb.getAttribute('data-title') || '';
      const desc = thumb.getAttribute('data-desc') || '';

      if (galleryActiveImg) {
        galleryActiveImg.style.opacity = '0';
        setTimeout(() => {
          galleryActiveImg.src = imgSrc;
          galleryActiveImg.style.opacity = '1';
        }, 150);
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
    });

    if (lightboxCloseBtn) {
      lightboxCloseBtn.addEventListener('click', () => {
        lightboxModal.classList.remove('active');
      });
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
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

      if (checkoutModal) checkoutModal.classList.add('active');
    });
  });

  function closeCheckout() {
    if (checkoutModal) checkoutModal.classList.remove('active');
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
        window._lenisInstance.scrollTo(0, { duration: 1.0 });
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
      if (audioLabel) audioLabel.textContent = 'Sound On';
    }
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', toggleAmbientSound);
  }

  // =========================================================================
  // 6. Smooth In-Page Anchor Navigation & Mobile Drawer
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
          window._lenisInstance.scrollTo(targetEl, { offset: offsetValue, duration: 0.9 });
        } else {
          const top = targetEl.getBoundingClientRect().top + window.pageYOffset + offsetValue;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });
});

