/**
 * Classic Computer - Google Flow & Astra Grade 10-Second Cinematic Video Scroll Engine
 * Dell Precision 5530 4K Workstation Unboxing & Digital Marketing Experience
 * 
 * Timeline Architecture (10.00 Seconds Total Duration / 250 High-Res Frames):
 * - 0.00s - 2.10s : 01 // UNBOXING CEREMONY (Factory Sealed Stealth Vault & Tamper-Proof Audit Seal)
 * - 2.10s - 3.80s : 02 // VELVET LEVITATION (Precision 5530 ascends from micro-suede cradle)
 * - 3.80s - 5.70s : 03 // 4K INFINITYEDGE & 3D CHASSIS (100% AdobeRGB, Carbon Fiber, CNC Aluminum)
 * - 5.70s - 7.60s : 04 // DIGITAL MARKETING SILICON X-RAY (45W Intel Core i7 H-Series, 4GB NVIDIA Quadro GPU)
 * - 7.60s - 10.00s: 05 // ASSEMBLED & CERTIFIED HERO (30-Point Audited, Grade A+, Win 11 Pro, ₹34,999)
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
    
    // Exact 10.00s duration at 25 fps = 250 frames
    this.totalDuration = 10.00;
    this.totalFrames = options.totalFrames || 250;
    
    this.isMobile = window.innerWidth <= 768 || ('ontouchstart' in window && window.innerWidth <= 1024);
    this.basePath = this.isMobile ? 'assets/frames/mobile/' : 'assets/frames/desktop/';
    
    // Frame store for 250 sequential frames
    this.frames = new Array(this.totalFrames);
    this.loadedFramesCount = 0;
    
    // Master high-definition keyframes for instant rendering during fast scrubs
    this.keyframeAssets = {
      stage1: null,
      stage2: null,
      stage3: null,
      stage4: null,
      stage5: null,
      stage6: null
    };

    this.currentProgress = 0;
    this.targetProgress = 0;
    this.isPlaying = false;
    this.playInterval = null;
    this.userInteracting = false;
    
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

    // 5 Stages synchronized to the 10.00-second timeline
    this.stages = [
      { 
        id: 0,
        start: 0.00, 
        end: 0.18, 
        startTime: "0.00s",
        endTime: "1.80s",
        name: "01 // UNBOXING CEREMONY", 
        badge: "SEALED WORKSTATION VAULT",
        desc: "Factory sealed matte-black vault with tamper-proof holographic audit certification."
      },
      { 
        id: 1,
        start: 0.18, 
        end: 0.34, 
        startTime: "1.80s",
        endTime: "3.40s",
        name: "02 // VELVET LEVITATION", 
        badge: "CNC UNIBODY REVEAL",
        desc: "The Dell Precision 5530 ascends gracefully from its laser-molded micro-suede cradle."
      },
      { 
        id: 2,
        start: 0.34, 
        end: 0.68, 
        startTime: "3.40s",
        endTime: "6.80s",
        name: "03 // 4K INFINITYEDGE & 3D CHASSIS", 
        badge: "3840×2160 UHD IGZO DISPLAY",
        desc: "Borderless 4K PremierColor display, tactile backlit keyboard, and aerospace aluminum lid."
      },
      { 
        id: 3,
        start: 0.68, 
        end: 0.82, 
        startTime: "6.80s",
        endTime: "8.20s",
        name: "04 // DIGITAL MARKETING X-RAY", 
        badge: "45W SILICON & THERMAL BLUEPRINT",
        desc: "High-voltage 45W Intel Core i7 H-Series CPU, 4GB dedicated NVIDIA Quadro GPU, and dual copper heatpipes."
      },
      { 
        id: 4,
        start: 0.82, 
        end: 1.00, 
        startTime: "8.20s",
        endTime: "10.00s",
        name: "05 // ASSEMBLED & CERTIFIED HERO", 
        badge: "GRADE A+ ENTERPRISE WORKSTATION",
        desc: "30-Point laboratory audited with 90%+ battery health, genuine Windows 11 Pro, and 6-month warranty."
      }
    ];

    this.init();
  }

  init() {
    if (!this.canvas || !this.ctx || !this.container) return;

    this.handleResize = this.resize.bind(this);
    window.addEventListener('resize', this.handleResize, { passive: true });
    this.resize();

    // 1. Preload unboxing keyframes immediately
    this.preloadKeyframes();

    // 2. Preload 250 frames with prioritized progressive loading
    this.preloadFrames();

    // 3. Scroll listener
    window.addEventListener('scroll', () => {
      if (!this.userInteracting && !this.isPlaying) {
        this.onScroll();
      }
    }, { passive: true });

    // 4. Interactive Drag on canvas
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

    // 8. 60fps RAF loop with smooth cinematic lerping
    this.rafLoop = this.tick.bind(this);
    requestAnimationFrame(this.rafLoop);

    this.onScroll();
  }

  preloadKeyframes() {
    const keyframes = [
      { key: 'stage1', src: 'assets/unboxing/01_sealed_box.jpg' },
      { key: 'stage2', src: 'assets/unboxing/02_box_opening.jpg' },
      { key: 'stage3', src: 'assets/unboxing/03_laptop_levitate.jpg' },
      { key: 'stage4', src: 'assets/unboxing/04_orbit_display.jpg' },
      { key: 'stage5', src: 'assets/unboxing/05_exploded_xray.jpg' },
      { key: 'stage6', src: 'assets/unboxing/06_certified_hero.jpg' }
    ];

    keyframes.forEach(item => {
      const img = new Image();
      img.src = item.src;
      img.onload = () => {
        this.keyframeAssets[item.key] = img;
        if (item.key === 'stage1' && this.currentProgress < 0.05) {
          this.render();
        }
      };
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
    firstImg.onload = () => {
      this.frames[0] = firstImg;
      this.loadedFramesCount++;
      this.render();
      this.loadRemainingFrames();
    };
    firstImg.onerror = () => {
      if (this.isMobile) {
        this.basePath = 'assets/frames/desktop/';
        firstImg.src = this.getFrameUrl(0);
      }
    };
  }

  loadRemainingFrames() {
    // Staggered loading: first load every 5th frame for instant scrub response across all 10s
    const priorityIndices = [];
    for (let i = 5; i < this.totalFrames; i += 5) priorityIndices.push(i);
    for (let i = 1; i < this.totalFrames; i++) {
      if (i % 5 !== 0) priorityIndices.push(i);
    }

    let pointer = 0;
    const batchSize = 12;

    const loadNextBatch = () => {
      if (pointer >= priorityIndices.length) return;
      const batch = priorityIndices.slice(pointer, pointer + batchSize);
      pointer += batchSize;

      let batchLoaded = 0;
      batch.forEach((idx) => {
        if (this.frames[idx]) return;
        const img = new Image();
        img.src = this.getFrameUrl(idx);
        img.onload = () => {
          this.frames[idx] = img;
          this.loadedFramesCount++;
          batchLoaded++;
          if (batchLoaded === batch.length) {
            setTimeout(loadNextBatch, 8);
          }
        };
        img.onerror = () => {
          batchLoaded++;
          if (batchLoaded === batch.length) {
            setTimeout(loadNextBatch, 8);
          }
        };
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
      if (this.isPlaying) this.togglePlay();
      this.dragStartX = clientX;
      this.dragStartProgress = this.targetProgress;
      targetEl.classList.add('canvas-dragging');
    };

    const onPointerMove = (clientX) => {
      if (!this.isDragging) return;
      const deltaX = clientX - this.dragStartX;
      const sensitivity = 0.0016; // Smooth responsive dragging across 10s timeline
      let newP = this.dragStartProgress - (deltaX * sensitivity);
      newP = Math.max(0, Math.min(1, newP));
      this.targetProgress = newP;
    };

    const onPointerUp = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      targetEl.classList.remove('canvas-dragging');
      setTimeout(() => {
        this.userInteracting = false;
      }, 400);
    };

    targetEl.addEventListener('mousedown', (e) => {
      if (e.target.closest('button') || e.target.closest('.hotspot-pin') || e.target.closest('.hero-stage-card') || e.target.closest('input')) return;
      onPointerDown(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) onPointerMove(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) onPointerUp();
    });

    targetEl.addEventListener('touchstart', (e) => {
      if (e.target.closest('button') || e.target.closest('.hotspot-pin') || e.target.closest('.hero-stage-card') || e.target.closest('input')) return;
      if (e.touches.length === 1) {
        onPointerDown(e.touches[0].clientX);
      }
    }, { passive: true });

    targetEl.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        onPointerMove(e.touches[0].clientX);
      }
    }, { passive: true });

    targetEl.addEventListener('touchend', () => {
      if (this.isDragging) onPointerUp();
    });
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    const displayWidth = rect.width || window.innerWidth;
    const displayHeight = rect.height || window.innerHeight;

    this.canvas.width = Math.round(displayWidth * dpr);
    this.canvas.height = Math.round(displayHeight * dpr);

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

  tick() {
    // 0.16 lerp factor gives silky-smooth camera inertia
    const diff = this.targetProgress - this.currentProgress;
    if (Math.abs(diff) > 0.0001) {
      this.currentProgress += diff * 0.16;
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

    // Map progress directly to the 250 frames (0 to 249)
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

    // High-resolution keyframe fallback based on 10s timeline stage
    if (!img) {
      if (p < 0.21) img = this.keyframeAssets.stage1;
      else if (p < 0.38) img = this.keyframeAssets.stage2;
      else if (p < 0.57) img = this.keyframeAssets.stage3;
      else if (p < 0.76) img = this.keyframeAssets.stage4;
      else if (p < 0.90) img = this.keyframeAssets.stage5;
      else img = this.keyframeAssets.stage6;
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
      this.timeIndicator.textContent = `${currentTimeSec}s / 10.00s`;
    }

    const currentStage = this.stages.find(s => progress >= s.start && progress <= s.end) || this.stages[0];

    if (this.stageIndicator) {
      this.stageIndicator.textContent = `${currentStage.name} [${currentStage.startTime} - ${currentStage.endTime}]`;
    }

    // Highlight active stage pill
    document.querySelectorAll('.stage-pill-btn').forEach((btn, idx) => {
      if (this.stages[idx] === currentStage) {
        btn.classList.add('border-cyan-400', 'text-cyan-300', 'bg-cyan-500/15', 'shadow-sm');
      } else {
        btn.classList.remove('border-cyan-400', 'text-cyan-300', 'bg-cyan-500/15', 'shadow-sm');
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

    // Hotspot pins reactive mapping across 10-second timeline
    const hotspots = document.querySelectorAll('.hotspot-pin');
    hotspots.forEach(hotspot => {
      const targetStageProgress = parseFloat(hotspot.getAttribute('data-target-progress') || '0');
      const stageDistance = Math.abs(progress - targetStageProgress);

      if (progress >= 0.35 && progress <= 0.58) {
        // Stage 3: Display & Chassis Hotspots
        if (stageDistance < 0.12) {
          hotspot.style.opacity = '1';
          hotspot.style.pointerEvents = 'auto';
        } else {
          hotspot.style.opacity = '0.35';
        }
      } else if (progress >= 0.58 && progress <= 0.78 && hotspot.classList.contains('xray-hotspot')) {
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

    if (progress < 0.18) {
      // Stage 1 (0.00s - 1.80s): Unboxing Ceremony
      chipTL.querySelector('.tele-title').textContent = "PACKAGING CEREMONY";
      chipTL.querySelector('.tele-val').textContent = "Mil-Spec Vault Enclosure";
      chipTL.querySelector('.tele-sub').textContent = `Timeline: ${currentTimeSec}s • Tamper Seal`;

      chipTR.querySelector('.tele-title').textContent = "LAB INTEGRITY";
      chipTR.querySelector('.tele-val').textContent = "30-Point Audit Passed";
      chipTR.querySelector('.tele-sub').textContent = "Pristine Zero-Blemish Grade A+";

      chipBL.querySelector('.tele-title').textContent = "SECURITY BADGE";
      chipBL.querySelector('.tele-val').textContent = "Holographic Tamper Seal";
      chipBL.querySelector('.tele-sub').textContent = "Verified Classic Computers Hub";

      chipBR.querySelector('.tele-title').textContent = "PACKAGING STATUS";
      chipBR.querySelector('.tele-val').textContent = "Cleanroom Packaged";
      chipBR.querySelector('.tele-sub').textContent = "Shockproof Transit Shell";
    } else if (progress < 0.34) {
      // Stage 2 (1.80s - 3.40s): Velvet Levitation
      chipTL.querySelector('.tele-title').textContent = "CHASSIS ASCENSION";
      chipTL.querySelector('.tele-val').textContent = "Monolithic CNC Aluminum";
      chipTL.querySelector('.tele-sub').textContent = `Timeline: ${currentTimeSec}s • 1.78kg Unibody`;

      chipTR.querySelector('.tele-title').textContent = "MICRO-SUEDE CRADLE";
      chipTR.querySelector('.tele-val').textContent = "Anti-Static Protection";
      chipTR.querySelector('.tele-sub').textContent = "Precision Molded Recess";

      chipBL.querySelector('.tele-title').textContent = "EDGE FINISH";
      chipBL.querySelector('.tele-val').textContent = "Diamond-Cut Chamfers";
      chipBL.querySelector('.tele-sub').textContent = "Anodized Aerospace Alloy";

      chipBR.querySelector('.tele-title').textContent = "BATTERY HEALTH";
      chipBR.querySelector('.tele-val').textContent = "92% Tested Capacity";
      chipBR.querySelector('.tele-sub').textContent = "97Wh High-Capacity Cell";
    } else if (progress < 0.68) {
      // Stage 3 (3.40s - 6.80s): 4K Display & 3D Chassis
      chipTL.querySelector('.tele-title').textContent = "DISPLAY PANEL";
      chipTL.querySelector('.tele-val').textContent = "15.6\" 4K UHD PremierColor";
      chipTL.querySelector('.tele-sub').textContent = `Timeline: ${currentTimeSec}s • 3840×2160`;

      chipTR.querySelector('.tele-title').textContent = "COLOR ACCURACY";
      chipTR.querySelector('.tele-val').textContent = "100% Adobe RGB Gamut";
      chipTR.querySelector('.tele-sub').textContent = "400 Nits • IGZO IPS Glass";

      chipBL.querySelector('.tele-title').textContent = "DECK MATERIAL";
      chipBL.querySelector('.tele-val').textContent = "Woven Carbon Fiber";
      chipBL.querySelector('.tele-sub').textContent = "Soft-Touch Thermal Isolation";

      chipBR.querySelector('.tele-title').textContent = "INPUT INTERFACE";
      chipBR.querySelector('.tele-val').textContent = "Backlit Precision Keyboard";
      chipBR.querySelector('.tele-sub').textContent = "Glass Touchpad with Windows Precision";
    } else if (progress < 0.82) {
      // Stage 4 (6.80s - 8.20s): Digital Marketing Silicon X-Ray
      chipTL.querySelector('.tele-title').textContent = "HIGH-VOLTAGE SILICON";
      chipTL.querySelector('.tele-val').textContent = "Intel Core i7-8850H (45W)";
      chipTL.querySelector('.tele-sub').textContent = `Timeline: ${currentTimeSec}s • 6C/12T 4.30GHz`;

      chipTR.querySelector('.tele-title').textContent = "DEDICATED GRAPHICS";
      chipTR.querySelector('.tele-val').textContent = "4GB NVIDIA Quadro GPU";
      chipTR.querySelector('.tele-sub').textContent = "CUDA Accelerated 4K CAD / Premiere";

      chipBL.querySelector('.tele-title').textContent = "THERMAL ARCHITECTURE";
      chipBL.querySelector('.tele-val').textContent = "Dual Copper Vapor Pipes";
      chipBL.querySelector('.tele-sub').textContent = "Dual Turbines • Throttle-Free";

      chipBR.querySelector('.tele-title').textContent = "MEMORY & STORAGE";
      chipBR.querySelector('.tele-val').textContent = "8GB RAM + 256GB NVMe SSD";
      chipBR.querySelector('.tele-sub').textContent = "3,400 MB/s Read Bandwidth";
    } else {
      // Stage 5 (8.20s - 10.00s): Assembled & Certified Hero
      chipTL.querySelector('.tele-title').textContent = "ENTERPRISE DEPLOYMENT";
      chipTL.querySelector('.tele-val').textContent = "Grade A+ Certified Pass";
      chipTL.querySelector('.tele-sub').textContent = `Timeline: ${currentTimeSec}s • Ready to Ship`;

      chipTR.querySelector('.tele-title').textContent = "OPERATING SYSTEM";
      chipTR.querySelector('.tele-val').textContent = "Windows 11 Pro 64-Bit";
      chipTR.querySelector('.tele-sub').textContent = "Digital License Activated";

      chipBL.querySelector('.tele-title').textContent = "WARRANTY PROTECTION";
      chipBL.querySelector('.tele-val').textContent = "6 Months Pan-India";
      chipBL.querySelector('.tele-sub').textContent = "Direct Technician Replacement";

      chipBR.querySelector('.tele-title').textContent = "PRICE ADVANTAGE";
      chipBR.querySelector('.tele-val').textContent = "₹34,999 (MRP ₹1,65,000)";
      chipBR.querySelector('.tele-sub').textContent = "Save ₹1,30,001 (78% Discount)";
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      clearInterval(this.playInterval);
      this.isPlaying = false;
      if (this.playBtn) {
        this.playBtn.innerHTML = `
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          <span>Auto Tour</span>
        `;
      }
      return false;
    } else {
      this.isPlaying = true;
      this.userInteracting = true;
      if (this.playBtn) {
        this.playBtn.innerHTML = `
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          <span>Pause 10s Tour</span>
        `;
      }
      
      // Auto-play advances through 10.00 seconds in exactly 10 seconds (100 steps of 100ms = 10s)
      this.playInterval = setInterval(() => {
        let next = this.targetProgress + 0.004; // 10s smooth loop
        if (next > 1.0) next = 0;
        this.targetProgress = next;
      }, 40);
      return true;
    }
  }

  jumpToStage(stageIndex) {
    if (stageIndex >= 0 && stageIndex < this.stages.length) {
      const target = this.stages[stageIndex].start + 0.02;
      this.targetProgress = target;
      if (this.container && !this.isPlaying) {
        const top = this.container.offsetTop + (target * (this.container.offsetHeight - window.innerHeight));
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }

  jumpToProgress(progress) {
    this.targetProgress = Math.max(0, Math.min(1, progress));
  }
}

// Global instance helper
window.HeroVideoScrubber = HeroVideoScrubber;
