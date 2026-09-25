/**
 * Classic Computer - High-Performance 120 FPS Fluid Physics Video Scroll Engine
 * Dell Latitude / Precision 5530 4K Workstation Cinematic Scroll Experience
 * 
 * Synchronized to 16.00-Second Apple-Style Video ("product review.mp4" - 240 Frames)
 * - 0.00s - 3.20s : 01 // THE MONOLITH (CNC Aluminum Unibody & Precision Hinge)
 * - 3.20s - 7.20s : 02 // INFINITYEDGE AWAKENING (15.6" 4K UHD PremierColor Display)
 * - 7.20s - 10.40s: 03 // TACTILE CRAFTSMANSHIP (Aerospace Woven Carbon Fiber Deck & Backlit Keys)
 * - 10.40s - 13.60s: 04 // RAW SILICON TEARDOWN (Intel Core i7 45W H-Series + 4GB NVIDIA GPU)
 * - 13.60s - 16.00s: 05 // ASSEMBLED MASTERPIECE (Precision Future of Power & Certified ₹34,999)
 */

class HeroVideoScrubber {
  constructor(options = {}) {
    this.canvas = document.getElementById(options.canvasId || 'hero-canvas');
    this.container = document.getElementById(options.containerId || 'hero-scroll-container');
    this.pinnedViewport = document.getElementById('hero-pinned-viewport');
    this.progressBar = document.getElementById('scrub-progress-bar');
    this.rangeSlider = document.getElementById('hero-scrub-range');
    this.stageIndicator = document.getElementById('scrub-stage-text');
    this.timeIndicator = document.getElementById('scrub-time-indicator');
    this.playBtn = document.getElementById('hero-play-toggle-btn');
    
    // Exact 16.00s duration at 15 fps = 240 high-performance WebP frames
    this.totalDuration = 16.00;
    this.totalFrames = options.totalFrames || 240;
    
    this.isMobile = window.innerWidth <= 768 || ('ontouchstart' in window && window.innerWidth <= 1024);
    this.basePath = this.isMobile ? 'assets/frames/mobile/' : 'assets/frames/desktop/';
    
    // Frame store for 240 sequential frames
    this.frames = new Array(this.totalFrames);
    this.loadedFramesCount = 0;
    
    // Master HD keyframe assets for instant fallback
    this.keyframeAssets = {
      stage1: null,
      stage2: null,
      stage3: null,
      stage4: null,
      stage5: null
    };

    this.currentProgress = 0;
    this.targetProgress = 0;
    this.isPlaying = false;
    this.playInterval = null;
    this.userInteracting = false;
    
    // 120 FPS High-Precision Physics State
    this.lastTime = performance.now();
    this.touchVelocity = 0;
    this.lastTouchX = 0;
    this.lastTouchTime = 0;
    
    // Drag state
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartProgress = 0;
    
    this.ctx = null;
    if (this.canvas) {
      try {
        this.ctx = this.canvas.getContext('2d', { alpha: false, desynchronized: true });
      } catch (e) {
        this.ctx = this.canvas.getContext('2d');
      }
    }

    // 5 Stages synchronized to the 16.00-second timeline
    this.stages = [
      { 
        id: 0,
        start: 0.00, 
        end: 0.20, 
        startTime: "0.00s",
        endTime: "3.20s",
        name: "01 // THE MONOLITH", 
        badge: "CNC ALUMINUM UNIBODY",
        desc: "Sculpted from a single block of aerospace-grade aluminum with diamond-cut chamfered edges."
      },
      { 
        id: 1,
        start: 0.20, 
        end: 0.45, 
        startTime: "3.20s",
        endTime: "7.20s",
        name: "02 // INFINITYEDGE AWAKENING", 
        badge: "15.6\" 4K UHD PREMIERCOLOR",
        desc: "Borderless 4K display packing 8.29 million pixels with 100% Adobe RGB emerald color gamut."
      },
      { 
        id: 2,
        start: 0.45, 
        end: 0.65, 
        startTime: "7.20s",
        endTime: "10.40s",
        name: "03 // TACTILE CRAFTSMANSHIP", 
        badge: "CARBON FIBER COMPOSITE",
        desc: "Tactile woven composite palm rest, soft white backlit chiclet keys, and oversized glass trackpad."
      },
      { 
        id: 3,
        start: 0.65, 
        end: 0.85, 
        startTime: "10.40s",
        endTime: "13.60s",
        name: "04 // RAW SILICON TEARDOWN", 
        badge: "INTEL i7 H-SERIES + 4GB NVIDIA",
        desc: "45W high-voltage Intel Core i7 processor, dedicated NVIDIA graphics, and dual cooling vapor turbines."
      },
      { 
        id: 4,
        start: 0.85, 
        end: 1.00, 
        startTime: "13.60s",
        endTime: "16.00s",
        name: "05 // ASSEMBLED MASTERPIECE", 
        badge: "PRECISION // FUTURE OF POWER",
        desc: "Certified Refurbished enterprise workstation. 30-Point audited, Win 11 Pro, ready at ₹34,999."
      }
    ];

    this.init();
  }

  init() {
    if (!this.canvas || !this.ctx || !this.container) return;

    this.handleResize = this.resize.bind(this);
    window.addEventListener('resize', this.handleResize, { passive: true });
    this.resize();

    // 1. Preload HD keyframes immediately
    this.preloadKeyframes();

    // 2. Preload 240 sequential frames with progressive loading & GPU texture decoding
    this.preloadFrames();

    // 3. Scroll listener with passive high-priority updates
    window.addEventListener('scroll', () => {
      if (!this.userInteracting && !this.isPlaying) {
        this.onScroll();
      }
    }, { passive: true });

    // 4. Interactive Drag & Touch gesture controls with 120 FPS inertial physics
    this.setupDragControls();

    // 5. Interactive Scrub Slider
    if (this.rangeSlider) {
      this.rangeSlider.addEventListener('input', (e) => {
        this.userInteracting = true;
        this.targetProgress = parseFloat(e.target.value) / 1000;
      });
      this.rangeSlider.addEventListener('change', () => {
        setTimeout(() => { this.userInteracting = false; }, 300);
      });
    }

    // 6. Play / Auto Tour Button
    if (this.playBtn) {
      this.playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.togglePlay();
      });
    }

    // 7. Hotspot clicks
    document.querySelectorAll('.hotspot-pin').forEach(pin => {
      pin.addEventListener('click', (e) => {
        const targetP = parseFloat(pin.getAttribute('data-target-progress') || '0');
        this.jumpToProgress(targetP);
      });
    });

    // 8. 120 FPS High-Precision RAF loop with delta-time exponential damping
    this.rafLoop = this.tick.bind(this);
    requestAnimationFrame(this.rafLoop);

    this.onScroll();
  }

  preloadKeyframes() {
    const keyframes = [
      { key: 'stage1', src: 'assets/images/keyframe_stage1.jpg' },
      { key: 'stage2', src: 'assets/images/keyframe_stage2.jpg' },
      { key: 'stage3', src: 'assets/images/keyframe_stage3.jpg' },
      { key: 'stage4', src: 'assets/images/keyframe_stage4.jpg' },
      { key: 'stage5', src: 'assets/images/keyframe_stage5.jpg' }
    ];

    keyframes.forEach(item => {
      const img = new Image();
      img.src = item.src;
      if (img.decode) {
        img.decode().then(() => {
          this.keyframeAssets[item.key] = img;
          if (item.key === 'stage1' && this.currentProgress < 0.05) this.render();
        }).catch(() => {
          this.keyframeAssets[item.key] = img;
          if (item.key === 'stage1' && this.currentProgress < 0.05) this.render();
        });
      } else {
        img.onload = () => {
          this.keyframeAssets[item.key] = img;
          if (item.key === 'stage1' && this.currentProgress < 0.05) this.render();
        };
      }
    });
  }

  getFrameUrl(index) {
    const padded = String(index + 1).padStart(3, '0');
    return `${this.basePath}frame_${padded}.webp`;
  }

  preloadFrames() {
    // 1. Load frame 0 immediately
    const firstImg = new Image();
    firstImg.src = this.getFrameUrl(0);
    const onFirstReady = () => {
      this.frames[0] = firstImg;
      this.loadedFramesCount++;
      this.render();
      this.loadRemainingFrames();
    };

    if (firstImg.decode) {
      firstImg.decode().then(onFirstReady).catch(onFirstReady);
    } else {
      firstImg.onload = onFirstReady;
    }

    firstImg.onerror = () => {
      if (this.isMobile) {
        this.basePath = 'assets/frames/desktop/';
        firstImg.src = this.getFrameUrl(0);
      }
    };
  }

  loadRemainingFrames() {
    // Staggered loading: first load every 4th frame for instant scrub response across all 16s
    const priorityIndices = [];
    for (let i = 4; i < this.totalFrames; i += 4) priorityIndices.push(i);
    for (let i = 1; i < this.totalFrames; i++) {
      if (i % 4 !== 0) priorityIndices.push(i);
    }

    let pointer = 0;
    const batchSize = 16;

    const loadNextBatch = () => {
      if (pointer >= priorityIndices.length) return;
      const batch = priorityIndices.slice(pointer, pointer + batchSize);
      pointer += batchSize;

      let batchLoaded = 0;
      const checkDone = () => {
        batchLoaded++;
        if (batchLoaded === batch.length) {
          setTimeout(loadNextBatch, 4);
        }
      };

      batch.forEach((idx) => {
        if (this.frames[idx]) {
          checkDone();
          return;
        }
        const img = new Image();
        img.src = this.getFrameUrl(idx);
        if (img.decode) {
          img.decode().then(() => {
            this.frames[idx] = img;
            this.loadedFramesCount++;
            checkDone();
          }).catch(() => {
            this.frames[idx] = img;
            this.loadedFramesCount++;
            checkDone();
          });
        } else {
          img.onload = () => {
            this.frames[idx] = img;
            this.loadedFramesCount++;
            checkDone();
          };
          img.onerror = () => {
            checkDone();
          };
        }
      });
    };

    loadNextBatch();
  }

  setupDragControls() {
    const targetEl = this.pinnedViewport || this.canvas;
    if (!targetEl) return;

    targetEl.classList.add('canvas-interactive');

    const onPointerDown = (clientX) => {
      this.isDragging = true;
      this.userInteracting = true;
      this.touchVelocity = 0;
      this.lastTouchX = clientX;
      this.lastTouchTime = performance.now();
      if (this.isPlaying) this.togglePlay();
      this.dragStartX = clientX;
      this.dragStartProgress = this.targetProgress;
      targetEl.classList.add('canvas-dragging');
    };

    const onPointerMove = (clientX) => {
      if (!this.isDragging) return;
      const now = performance.now();
      const dt = Math.max((now - this.lastTouchTime) / 1000, 0.008);
      const deltaX = clientX - this.lastTouchX;
      
      this.touchVelocity = deltaX / (window.innerWidth * dt);
      this.lastTouchX = clientX;
      this.lastTouchTime = now;

      const totalDelta = clientX - this.dragStartX;
      const progressChange = (totalDelta / window.innerWidth) * 0.85;
      
      this.targetProgress = Math.max(0, Math.min(1, this.dragStartProgress + progressChange));
    };

    const onPointerUp = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      targetEl.classList.remove('canvas-dragging');
      setTimeout(() => {
        this.userInteracting = false;
      }, 500);
    };

    // Mouse events
    targetEl.addEventListener('mousedown', (e) => onPointerDown(e.clientX));
    window.addEventListener('mousemove', (e) => onPointerMove(e.clientX), { passive: true });
    window.addEventListener('mouseup', onPointerUp);

    // Touch events for mobile
    targetEl.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) onPointerDown(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && this.isDragging) onPointerMove(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', onPointerUp);
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, this.isMobile ? 1.5 : 2);
    
    this.canvas.width = Math.floor(rect.width * dpr);
    this.canvas.height = Math.floor(rect.height * dpr);
    this.render();
  }

  onScroll() {
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    const containerHeight = this.container.offsetHeight;
    const windowHeight = window.innerHeight;

    const scrollDistance = -rect.top;
    const maxScroll = containerHeight - windowHeight;

    if (maxScroll <= 0) return;

    let progress = scrollDistance / maxScroll;
    progress = Math.max(0, Math.min(1, progress));
    this.targetProgress = progress;
  }

  tick(timestamp) {
    const now = timestamp || performance.now();
    const dt = Math.min((now - (this.lastTime || now)) / 1000, 0.05);
    this.lastTime = now;

    // Apply touch momentum glide on touch release
    if (!this.isDragging && Math.abs(this.touchVelocity) > 0.0001) {
      this.targetProgress -= this.touchVelocity * dt * 35;
      this.targetProgress = Math.max(0, Math.min(1, this.targetProgress));
      this.touchVelocity *= Math.pow(0.86, dt * 60); // Buttery smooth friction
    }

    // High-Precision 120 FPS Frame-Rate Independent Exponential Damping
    const diff = this.targetProgress - this.currentProgress;
    if (Math.abs(diff) > 0.00005) {
      const smoothingFactor = 1 - Math.exp(-26 * dt);
      this.currentProgress += diff * smoothingFactor;
    } else {
      this.currentProgress = this.targetProgress;
    }

    this.render();
    this.updateHUD(this.currentProgress);

    requestAnimationFrame(this.rafLoop);
  }

  render() {
    if (!this.ctx || !this.canvas) return;

    const cw = this.canvas.width;
    const ch = this.canvas.height;
    if (cw === 0 || ch === 0) return;

    const p = Math.max(0, Math.min(1, this.currentProgress));

    // Clear background with obsidian matte black
    this.ctx.fillStyle = '#05070b';
    this.ctx.fillRect(0, 0, cw, ch);

    // Adaptive smoothing quality for 120 FPS
    const isMoving = Math.abs(this.targetProgress - this.currentProgress) > 0.002;
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = isMoving ? 'medium' : 'high';

    // Map progress directly to the 240 frames (0 to 239)
    const frameIndex = Math.min(
      this.totalFrames - 1,
      Math.max(0, Math.floor(p * (this.totalFrames - 1)))
    );

    let img = this.frames[frameIndex];

    if (!img) {
      // Find nearest loaded frame within search window
      for (let offset = 1; offset < 30; offset++) {
        if (frameIndex - offset >= 0 && this.frames[frameIndex - offset]) {
          img = this.frames[frameIndex - offset];
          break;
        }
        if (frameIndex + offset < this.totalFrames && this.frames[frameIndex + offset]) {
          img = this.frames[frameIndex + offset];
          break;
        }
      }
    }

    // High-resolution keyframe fallback based on 16s timeline stage
    if (!img) {
      if (p < 0.20) img = this.keyframeAssets.stage1;
      else if (p < 0.45) img = this.keyframeAssets.stage2;
      else if (p < 0.65) img = this.keyframeAssets.stage3;
      else if (p < 0.85) img = this.keyframeAssets.stage4;
      else img = this.keyframeAssets.stage5;
    }

    if (img) {
      this.drawImageScaled(img);
    }
  }

  drawImageScaled(img) {
    if (!img || !this.ctx) return;
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    if (!iw || !ih) return;

    const hRatio = cw / iw;
    const vRatio = ch / ih;
    const baseRatio = Math.max(hRatio, vRatio);

    const renderW = iw * baseRatio;
    const renderH = ih * baseRatio;
    const shiftX = (cw - renderW) / 2;
    const shiftY = (ch - renderH) / 2;

    this.ctx.drawImage(img, 0, 0, iw, ih, shiftX, shiftY, renderW, renderH);
  }

  updateHUD(progress) {
    const currentTimeSec = (progress * this.totalDuration).toFixed(2);

    if (this.progressBar) {
      this.progressBar.style.width = `${(progress * 100).toFixed(1)}%`;
    }

    if (this.rangeSlider && !this.userInteracting) {
      this.rangeSlider.value = Math.round(progress * 1000);
    }

    if (this.timeIndicator) {
      this.timeIndicator.textContent = `${currentTimeSec}s / 16.00s`;
    }

    const currentStage = this.stages.find(s => progress >= s.start && progress <= s.end) || this.stages[0];

    if (this.stageIndicator) {
      this.stageIndicator.textContent = `${currentStage.name} [${currentStage.startTime} - ${currentStage.endTime}]`;
    }

    // Highlight active stage pill
    document.querySelectorAll('.stage-pill-btn').forEach((btn, idx) => {
      if (this.stages[idx] === currentStage) {
        btn.classList.add('border-cyan-500', 'text-cyan-600', 'bg-cyan-50', 'shadow-sm', 'font-bold');
      } else {
        btn.classList.remove('border-cyan-500', 'text-cyan-600', 'bg-cyan-50', 'shadow-sm', 'font-bold');
      }
    });

    // Update narrative cards
    const stageCards = document.querySelectorAll('.hero-stage-card');
    stageCards.forEach((card, idx) => {
      const stage = this.stages[idx];
      if (stage && progress >= stage.start - 0.02 && progress <= stage.end + 0.02) {
        card.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
        card.classList.remove('opacity-0', 'translate-y-8', 'pointer-events-none');
      } else {
        card.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
        card.classList.add('opacity-0', 'translate-y-8', 'pointer-events-none');
      }
    });

    // Hotspot pins reactive mapping across 16-second timeline
    const hotspots = document.querySelectorAll('.hotspot-pin');
    hotspots.forEach(hotspot => {
      const targetStageProgress = parseFloat(hotspot.getAttribute('data-target-progress') || '0');
      const stageDistance = Math.abs(progress - targetStageProgress);

      if (progress >= 0.25 && progress <= 0.60) {
        // Stage 2 & 3: Display & Chassis Hotspots
        if (stageDistance < 0.14) {
          hotspot.style.opacity = '1';
          hotspot.style.pointerEvents = 'auto';
        } else {
          hotspot.style.opacity = '0.35';
        }
      } else if (progress >= 0.65 && progress <= 0.85 && hotspot.classList.contains('xray-hotspot')) {
        // Stage 4: Silicon & GPU X-Ray Hotspots
        hotspot.style.opacity = '1';
        hotspot.style.pointerEvents = 'auto';
      } else {
        hotspot.style.opacity = '0';
        hotspot.style.pointerEvents = 'none';
      }
    });

    // Update Corner Telemetry Chips
    this.updateTelemetryHUD(currentStage, progress, currentTimeSec);
  }

  updateTelemetryHUD(stage, progress, currentTimeSec) {
    const chipTL = document.getElementById('telemetry-chip-tl');
    const chipTR = document.getElementById('telemetry-chip-tr');
    const chipBL = document.getElementById('telemetry-chip-bl');
    const chipBR = document.getElementById('telemetry-chip-br');

    if (!chipTL || !chipTR || !chipBL || !chipBR) return;

    if (progress < 0.20) {
      // Stage 1 (0.00s - 3.20s): The Monolith
      chipTL.querySelector('.tele-title').textContent = "UNIBODY ARCHITECTURE";
      chipTL.querySelector('.tele-val').textContent = "CNC Anodized Aluminum";
      chipTL.querySelector('.tele-sub').textContent = `Timeline: ${currentTimeSec}s • 1.78kg Chassis`;

      chipTR.querySelector('.tele-title').textContent = "LAB INTEGRITY";
      chipTR.querySelector('.tele-val').textContent = "30-Point Audit Certified";
      chipTR.querySelector('.tele-sub').textContent = "Pristine Zero-Blemish Grade A+";

      chipBL.querySelector('.tele-title').textContent = "PRECISION HINGE";
      chipBL.querySelector('.tele-val').textContent = "Fluid One-Finger Rise";
      chipBL.querySelector('.tele-sub').textContent = "Diamond-Cut Beveled Chamfers";

      chipBR.querySelector('.tele-title').textContent = "BATTERY HEALTH";
      chipBR.querySelector('.tele-val').textContent = "92% Tested Capacity";
      chipBR.querySelector('.tele-sub').textContent = "97Wh High-Capacity Cell";
    } else if (progress < 0.45) {
      // Stage 2 (3.20s - 7.20s): InfinityEdge Awakening
      chipTL.querySelector('.tele-title').textContent = "DISPLAY PANEL";
      chipTL.querySelector('.tele-val').textContent = "15.6\" 4K UHD PremierColor";
      chipTL.querySelector('.tele-sub').textContent = `Timeline: ${currentTimeSec}s • 3840×2160`;

      chipTR.querySelector('.tele-title').textContent = "COLOR ACCURACY";
      chipTR.querySelector('.tele-val').textContent = "100% Adobe RGB Gamut";
      chipTR.querySelector('.tele-sub').textContent = "400 Nits • IGZO Anti-Glare IPS";

      chipBL.querySelector('.tele-title').textContent = "BEZEL PROFILE";
      chipBL.querySelector('.tele-val').textContent = "4mm Razor InfinityEdge";
      chipBL.querySelector('.tele-sub').textContent = "Edge-to-Edge Immersion";

      chipBR.querySelector('.tele-title').textContent = "PIXEL DENSITY";
      chipBR.querySelector('.tele-val').textContent = "282 PPI Retina Clarity";
      chipBR.querySelector('.tele-sub').textContent = "8.29 Million Pixels";
    } else if (progress < 0.65) {
      // Stage 3 (7.20s - 10.40s): Tactile Craftsmanship
      chipTL.querySelector('.tele-title').textContent = "DECK MATERIAL";
      chipTL.querySelector('.tele-val').textContent = "Aerospace Woven Carbon";
      chipTL.querySelector('.tele-sub').textContent = `Timeline: ${currentTimeSec}s • Soft-Touch Matte`;

      chipTR.querySelector('.tele-title').textContent = "KEYBOARD TRAVEL";
      chipTR.querySelector('.tele-val').textContent = "Backlit Chiclet Keys";
      chipTR.querySelector('.tele-sub').textContent = "Precision 1.3mm Travel";

      chipBL.querySelector('.tele-title').textContent = "TRACKPAD INTERFACE";
      chipBL.querySelector('.tele-val').textContent = "Oversized Precision Glass";
      chipBL.querySelector('.tele-sub').textContent = "Multi-Gesture Windows Precision";

      chipBR.querySelector('.tele-title').textContent = "THERMAL ISOLATION";
      chipBR.querySelector('.tele-val').textContent = "Cool-to-Touch Palmrest";
      chipBR.querySelector('.tele-sub').textContent = "Aeronautic Heat Resistance";
    } else if (progress < 0.85) {
      // Stage 4 (10.40s - 13.60s): Raw Silicon Teardown
      chipTL.querySelector('.tele-title').textContent = "HIGH-VOLTAGE SILICON";
      chipTL.querySelector('.tele-val').textContent = "Intel Core i7 8th Gen H-Series";
      chipTL.querySelector('.tele-sub').textContent = `Timeline: ${currentTimeSec}s • 45W 6C/12T`;

      chipTR.querySelector('.tele-title').textContent = "DEDICATED GRAPHICS";
      chipTR.querySelector('.tele-val').textContent = "4GB Dedicated NVIDIA GPU";
      chipTR.querySelector('.tele-sub').textContent = "CUDA Accelerated 4K CAD / Premiere";

      chipBL.querySelector('.tele-title').textContent = "THERMAL ARCHITECTURE";
      chipBL.querySelector('.tele-val').textContent = "Dual Copper Vapor Pipes";
      chipBL.querySelector('.tele-sub').textContent = "Dual Turbines • Throttle-Free";

      chipBR.querySelector('.tele-title').textContent = "MEMORY & STORAGE";
      chipBR.querySelector('.tele-val').textContent = "8GB RAM + 256GB NVMe SSD";
      chipBR.querySelector('.tele-sub').textContent = "Upgradable Dual Channel Slots";
    } else {
      // Stage 5 (13.60s - 16.00s): Assembled Masterpiece
      chipTL.querySelector('.tele-title').textContent = "CERTIFIED DEPLOYMENT";
      chipTL.querySelector('.tele-val').textContent = "Grade A+ Enterprise Ready";
      chipTL.querySelector('.tele-sub').textContent = `Timeline: ${currentTimeSec}s • Ready to Ship`;

      chipTR.querySelector('.tele-title').textContent = "OPERATING SYSTEM";
      chipTR.querySelector('.tele-val').textContent = "Windows 11 Pro 64-Bit";
      chipTR.querySelector('.tele-sub').textContent = "Digital OEM License Active";

      chipBL.querySelector('.tele-title').textContent = "WARRANTY PROTECTION";
      chipBL.querySelector('.tele-val').textContent = "6 Months Pan-India";
      chipBL.querySelector('.tele-sub').textContent = "Direct Technician Replacement";

      chipBR.querySelector('.tele-title').textContent = "PRICE ADVANTAGE";
      chipBR.querySelector('.tele-val').textContent = "₹34,999 (MRP ₹1,85,000)";
      chipBR.querySelector('.tele-sub').textContent = "Save ₹1,50,001 (81% Discount)";
    }
  }

  jumpToProgress(target) {
    this.targetProgress = Math.max(0, Math.min(1, target));
    if (!this.container) return;
    const containerHeight = this.container.offsetHeight;
    const windowHeight = window.innerHeight;
    const maxScroll = containerHeight - windowHeight;
    const targetScrollY = this.container.offsetTop + (this.targetProgress * maxScroll);
    
    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    if (this.playBtn) {
      this.playBtn.innerHTML = this.isPlaying ? `
        <svg class="w-4 h-4 text-cyan-600" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        <span class="text-[10px] font-bold font-mono text-cyan-700">PAUSE</span>
      ` : `
        <svg class="w-4 h-4 text-cyan-600" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        <span class="text-[10px] font-bold font-mono text-cyan-700">AUTO TOUR</span>
      `;
    }

    if (this.isPlaying) {
      if (this.currentProgress >= 0.99) this.currentProgress = 0;
      const stepDuration = this.totalDuration * 1000;
      const startTime = performance.now();
      const startP = this.currentProgress;

      const animatePlay = (now) => {
        if (!this.isPlaying) return;
        const elapsed = now - startTime;
        const p = startP + (elapsed / stepDuration);
        if (p >= 1) {
          this.targetProgress = 1;
          this.togglePlay();
          return;
        }
        this.targetProgress = p;
        requestAnimationFrame(animatePlay);
      };
      requestAnimationFrame(animatePlay);
    }
  }
}

// Global initialization
window.HeroVideoScrubber = HeroVideoScrubber;
document.addEventListener('DOMContentLoaded', () => {
  window.heroScrubber = new HeroVideoScrubber({
    totalFrames: 240
  });
});
