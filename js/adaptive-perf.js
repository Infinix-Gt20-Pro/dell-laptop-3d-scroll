/**
 * Classic Computers — Adaptive Hardware & Refresh Rate Performance Engine (v1.0)
 * ==============================================================================
 * Automatically detects device screen refresh rate (144Hz, 120Hz, 90Hz, 60Hz)
 * and CPU/GPU hardware concurrency to tune rendering pipelines:
 * - 144Hz / 120Hz: Silky smooth unlocked frame rate for high-end flagships
 * - 60Hz: Balanced high-efficiency mode for standard phones & laptops
 * - Lite / Budget (<= 4 cores or frame lag): 30-45 FPS cap, DPR scale-down,
 *   GPU blur fallback (replaces heavy backdrop-filter with solid translucent glass)
 */

(function () {
  'use strict';

  const PerfEngine = {
    refreshRate: 60,
    targetFps: 60,
    tier: 'balanced', // 'ultra' (120-144Hz), 'balanced' (60Hz), 'lite' (budget/battery-saver)
    dpr: 1.0,
    isMobile: false,
    isTouch: false,
    frameIntervalMs: 16.66,
    subscribers: [],

    init() {
      this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      this.isMobile = window.innerWidth <= 768 || (this.isTouch && window.innerWidth <= 1024);

      // 1. Initial quick estimate based on hardware
      const cores = navigator.hardwareConcurrency || 4;
      const mem = navigator.deviceMemory || 4;

      if (this.isMobile && (cores <= 4 || mem <= 3)) {
        this.tier = 'lite';
        this.targetFps = 45;
        this.dpr = 1.0;
      } else {
        this.tier = 'balanced';
        this.targetFps = 60;
        this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      }

      this.frameIntervalMs = 1000 / this.targetFps;
      this.applyTierStyles();

      // 2. Measure actual display refresh rate over 20 consecutive RAF frames
      this.detectRefreshRate();

      // 3. Expose to window
      window.ClassicPerf = this;
    },

    detectRefreshRate() {
      let frameCount = 0;
      let startTime = null;
      let lastTime = null;
      const frameDeltas = [];

      const probe = (ts) => {
        if (!startTime) {
          startTime = ts;
          lastTime = ts;
          requestAnimationFrame(probe);
          return;
        }

        const delta = ts - lastTime;
        lastTime = ts;
        frameDeltas.push(delta);
        frameCount++;

        if (frameCount < 25) {
          requestAnimationFrame(probe);
        } else {
          // Analyze frame deltas (drop first 3 frames as warm-up)
          const validDeltas = frameDeltas.slice(3);
          const avgDelta = validDeltas.reduce((a, b) => a + b, 0) / validDeltas.length;
          const calculatedHz = Math.round(1000 / avgDelta);

          // Categorize into standard refresh rates
          if (calculatedHz >= 135) {
            this.refreshRate = 144;
          } else if (calculatedHz >= 105) {
            this.refreshRate = 120;
          } else if (calculatedHz >= 80) {
            this.refreshRate = 90;
          } else if (calculatedHz >= 48) {
            this.refreshRate = 60;
          } else {
            this.refreshRate = 30;
          }

          this.tunePipeline();
        }
      };

      requestAnimationFrame(probe);
    },

    tunePipeline() {
      const cores = navigator.hardwareConcurrency || 4;

      // Decide final performance tier
      if (this.refreshRate >= 120 && cores >= 6) {
        this.tier = 'ultra';
        this.targetFps = this.refreshRate; // 120 or 144
        this.dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      } else if (this.refreshRate >= 60 && cores >= 4) {
        this.tier = 'balanced';
        this.targetFps = 60;
        this.dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      } else {
        this.tier = 'lite';
        this.targetFps = Math.min(this.refreshRate, 45);
        this.dpr = 1.0;
      }

      this.frameIntervalMs = 1000 / this.targetFps;
      this.applyTierStyles();

      // Dispatch event to inform Canvas and 3D pipelines
      window.dispatchEvent(new CustomEvent('classic-perf-ready', {
        detail: {
          refreshRate: this.refreshRate,
          targetFps: this.targetFps,
          tier: this.tier,
          dpr: this.dpr
        }
      }));

      // Notify internal subscribers
      this.subscribers.forEach(cb => cb(this));
    },

    applyTierStyles() {
      const root = document.documentElement;
      root.setAttribute('data-perf-tier', this.tier);
      root.setAttribute('data-refresh-rate', this.refreshRate);

      if (this.tier === 'lite') {
        // Apply GPU-friendly styling class for budget phones
        document.body && document.body.classList.add('perf-mode-lite');
      } else {
        document.body && document.body.classList.remove('perf-mode-lite');
      }
    },

    onReady(cb) {
      if (typeof cb === 'function') {
        this.subscribers.push(cb);
        if (this.refreshRate) cb(this);
      }
    }
  };

  PerfEngine.init();
})();
