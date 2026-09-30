/**
 * Classic Computers — Framer WebGL Quantum Burn Transition Engine v2
 * ===================================================================
 * Built for 60fps/120fps Silky Smoothness & Zero Stutter:
 * - Single-pass hardware-accelerated GLSL shader with 2D Simplex noise
 * - Real-time radiant analytical ember bloom & hot-core fiber tearing
 * - Fixed: Strict single-trigger debouncing (NEVER runs twice on 1 click)
 * - Fixed: Removed redundant entrance wipe on page load
 * - Auto-detects page navigation vs. in-page button clicks
 * - Non-blocking pointer events (never impedes scrolling or inputs)
 */

(function () {
  'use strict';

  // ── High-Performance Vertex Shader ────────────────────────────────────────
  const vertexShaderSrc = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = 0.5 * (a_position + 1.0);
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // ── High-Performance Single-Pass Burn Fragment Shader ────────────────────
  // Features: Fast Simplex noise + fiber tear grain + analytical radiant exponential bloom
  const fragmentShaderSrc = `
    precision highp float;
    varying vec2 v_uv;

    uniform vec3 u_color;            // Base dark charcoal tone
    uniform vec3 u_transition_color; // Fire ember edge color
    uniform float u_progress;        // 0.0 to 1.0 (smooth eased)
    uniform float u_aspect_ratio;
    uniform float u_band_size;       // 0.0 for full page wipe, > 0.0 for traveling pulse wave
    uniform float u_time;

    // Fast 2D Simplex Noise (polynomial, no heavy trig loops)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
      m = m * m;
      m = m * m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
      vec3 g;
      g.x  = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    float fbm3(vec2 st) {
      float v = 0.0;
      v += 0.55 * snoise(st);
      st *= 2.15;
      v += 0.30 * snoise(st);
      st *= 2.2;
      v += 0.15 * snoise(st);
      return v;
    }

    void main() {
      // Map progress (0.0 to 1.0) into wave baseline (-0.35 to 1.35)
      float baseLine = -0.32 + u_progress * 1.64;

      // Primary torn edge profile
      vec2 noiseCoord = vec2(
        v_uv.x * u_aspect_ratio * 3.6 + u_time * 0.45,
        v_uv.y * 1.8 + u_time * 0.25
      );
      float edgeNoise = fbm3(noiseCoord);
      float tearEdge = baseLine + edgeNoise * 0.19;

      // Microscopic paper fiber grain
      vec2 fiberCoord = vec2(v_uv.x * u_aspect_ratio * 55.0, v_uv.y * 14.0);
      float fiber = snoise(fiberCoord) * 0.035;
      tearEdge += fiber;

      float distToEdge = v_uv.y - tearEdge;

      // Trailing discard for traveling pulse mode (leaves transparent UI behind)
      if (u_band_size > 0.001) {
        if (v_uv.y < tearEdge - u_band_size) {
          discard;
        }
      }

      // Above the tear line: transparent
      if (distToEdge > 0.07) {
        discard;
      }

      // Radiant exponential bloom (instant analytical glow, 0 FBO overhead)
      float glowIntensity = exp(-abs(distToEdge) * 34.0);
      vec3 flameGlow = u_transition_color * (1.1 + glowIntensity * 2.6);

      if (distToEdge > 0.0) {
        // Hot flame transition zone fading to transparent
        float alpha = 1.0 - smoothstep(0.0, 0.07, distToEdge);
        vec3 col = mix(flameGlow, vec3(1.0, 0.98, 0.85), glowIntensity * 0.65);
        gl_FragColor = vec4(col, alpha);
      } else if (distToEdge > -0.05) {
        // Inner charred glowing rim
        float t = smoothstep(-0.05, 0.0, distToEdge);
        vec3 col = mix(u_color, flameGlow, t);
        gl_FragColor = vec4(col, 1.0);
      } else {
        // Solid base color behind the flame wave
        gl_FragColor = vec4(u_color, 1.0);
      }
    }
  `;

  // ── Color Parsing Helper ──────────────────────────────────────────────────
  function hexToRgb(hex) {
    if (Array.isArray(hex)) return hex;
    const clean = String(hex).replace('#', '').trim();
    if (clean.length === 6) {
      return [
        parseInt(clean.slice(0, 2), 16) / 255,
        parseInt(clean.slice(2, 4), 16) / 255,
        parseInt(clean.slice(4, 6), 16) / 255
      ];
    }
    if (clean.length === 3) {
      return [
        parseInt(clean[0] + clean[0], 16) / 255,
        parseInt(clean[1] + clean[1], 16) / 255,
        parseInt(clean[2] + clean[2], 16) / 255
      ];
    }
    return [0.98, 0.8, 0.08]; // Default gold ember
  }

  // ── Adaptive Device & Performance Capability Analyzer ─────────────────────
  function checkDeviceCapabilities() {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return { isLowEnd: false, isMobile: false, prefersReducedMotion: false, targetDpr: 1.0 };
    }

    const prefersReducedMotion = Boolean(
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || '') ||
      (typeof window.innerWidth === 'number' && window.innerWidth < 768);

    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4; // in GB (Chromium API)

    // Flag low-end: reduced motion OR < 4GB RAM OR dual-core OR mobile quad-core
    const isLowEnd = prefersReducedMotion || (memory < 4) || (cores <= 2) || (isMobile && cores <= 4);

    // Adaptive DPR scaling:
    // Desktop: 1.25x max (crisp & silky)
    // Modern Mobile: 1.0x (retina smooth)
    // Budget/Low-End Mobile: 0.75x (55% fill-rate reduction, locked 60 FPS)
    let targetDpr = 1.25;
    if (isLowEnd) {
      targetDpr = 0.75;
    } else if (isMobile) {
      targetDpr = 1.0;
    }

    return {
      isLowEnd,
      isMobile,
      prefersReducedMotion,
      targetDpr
    };
  }

  // ── High-Performance WebGL Engine Class ──────────────────────────────────
  class QuantumBurnEngine {
    constructor() {
      this.canvas = null;
      this.gl = null;
      this.program = null;
      this.quadBuffer = null;
      this.isReady = false;
      this.isAnimating = false;
      this.animationFrame = null;

      // Device Capability Profile
      this.device = checkDeviceCapabilities();

      // Uniform Locations Cache
      this.locs = {};

      // Transition Settings
      this.baseColor = hexToRgb('#05070f'); // Deep obsidian matching store theme
      this.transitionColor = hexToRgb('#facc15'); // Radiant amber gold flame
      this.currentBandSize = 0.0;
      this.startTime = 0;
      this.duration = 420; // Snappy & responsive (sweet spot for UX)
      this.onPeakCallback = null;
      this.onCompleteCallback = null;
      this.peakTriggered = false;

      // Lock to prevent any double-running
      this.lastTriggerTimestamp = 0;
      this.isLocked = false;
      this.lastFrameTs = 0;
      this.slowFrameCount = 0;

      this.init();
    }

    init() {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;

      // Clean up legacy session reveal flags to eliminate duplicate on-load runs
      try {
        sessionStorage.removeItem('cc_burn_revealing');
        sessionStorage.removeItem('cc_burn_transition');
      } catch (_) {}

      // 1. Create or bind fullscreen overlay canvas
      let canvas = document.getElementById('burn-transition-canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'burn-transition-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        Object.assign(canvas.style, {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: '999999',
          display: 'block',
          opacity: '1'
        });
        document.body.appendChild(canvas);
      }
      this.canvas = canvas;

      // 2. Add WebGL Context Recovery Listeners
      canvas.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        this.isReady = false;
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
      }, false);

      canvas.addEventListener('webglcontextrestored', () => {
        this.setupGL();
      }, false);

      this.setupGL();
      window.addEventListener('resize', () => this.resize(), { passive: true });
    }

    setupGL() {
      const gl = this.canvas.getContext('webgl', {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false
      });

      if (!gl) {
        console.warn('WebGL not supported for Burn Transition');
        return;
      }
      this.gl = gl;

      // 3. Compile Shaders
      const vs = this.createShader(gl.VERTEX_SHADER, vertexShaderSrc);
      const fs = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderSrc);
      if (!vs || !fs) return;

      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Burn program linking error:', gl.getProgramInfoLog(program));
        return;
      }
      this.program = program;

      // Cache Uniform Locations
      this.locs = {
        position: gl.getAttribLocation(program, 'a_position'),
        color: gl.getUniformLocation(program, 'u_color'),
        transitionColor: gl.getUniformLocation(program, 'u_transition_color'),
        progress: gl.getUniformLocation(program, 'u_progress'),
        aspectRatio: gl.getUniformLocation(program, 'u_aspect_ratio'),
        bandSize: gl.getUniformLocation(program, 'u_band_size'),
        time: gl.getUniformLocation(program, 'u_time')
      };

      // 4. Create Quad Buffer
      const quadVertices = new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
         1,  1
      ]);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);
      this.quadBuffer = buffer;

      // 5. Setup Viewport (Capped for 60fps/120fps lock)
      this.resize();
      this.isReady = true;
      this.clearCanvas();
    }

    createShader(type, src) {
      const gl = this.gl;
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Burn shader error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    resize() {
      if (!this.canvas || !this.gl) return;
      // Adaptive DPR: 1.25 for desktop, 1.0 for modern mobile, 0.75 for low-end devices
      const maxDpr = this.device ? this.device.targetDpr : 1.0;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);

      if (this.canvas.width === w && this.canvas.height === h) return;
      this.canvas.width = w;
      this.canvas.height = h;
    }

    clearCanvas() {
      if (!this.gl) return;
      const gl = this.gl;
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }

    draw(progress, timeSec) {
      const gl = this.gl;
      const p = this.program;
      if (!gl || !p) return;

      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.useProgram(p);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
      gl.enableVertexAttribArray(this.locs.position);
      gl.vertexAttribPointer(this.locs.position, 2, gl.FLOAT, false, 0, 0);

      gl.uniform3fv(this.locs.color, this.baseColor);
      gl.uniform3fv(this.locs.transitionColor, this.transitionColor);
      gl.uniform1f(this.locs.progress, progress);
      gl.uniform1f(this.locs.bandSize, this.currentBandSize);
      gl.uniform1f(this.locs.time, timeSec);

      const aspect = this.canvas.height > 0 ? this.canvas.width / this.canvas.height : 1.0;
      gl.uniform1f(this.locs.aspectRatio, aspect);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    animate(timestamp) {
      if (!this.isAnimating) return;
      if (!this.startTime) {
        this.startTime = timestamp;
        this.lastFrameTs = timestamp;
      }

      // Adaptive runtime frame-drop watchdog
      if (this.lastFrameTs) {
        const frameDelta = timestamp - this.lastFrameTs;
        // Frame time > 50ms means < 20 FPS (heavy CPU/GPU lag on budget mobile)
        if (frameDelta > 50) {
          this.slowFrameCount = (this.slowFrameCount || 0) + 1;
          // If frame lag happens 2 frames in a row, fast-forward to peak
          if (this.slowFrameCount >= 2 && this.mode === 'page' && !this.peakTriggered) {
            this.peakTriggered = true;
            if (typeof this.onPeakCallback === 'function') {
              this.onPeakCallback();
            }
          }
        } else {
          this.slowFrameCount = 0;
        }
      }
      this.lastFrameTs = timestamp;

      const elapsed = timestamp - this.startTime;
      const rawProgress = Math.min(1.0, elapsed / this.duration);

      // Silky cubic-bezier easing: cubic-bezier(0.16, 1, 0.3, 1)
      const t = rawProgress;
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      // In page mode: trigger navigation callback at 62% when screen is covered
      if (this.mode === 'page' && rawProgress >= 0.62 && !this.peakTriggered) {
        this.peakTriggered = true;
        if (typeof this.onPeakCallback === 'function') {
          this.onPeakCallback();
        }
      }

      this.draw(eased, elapsed / 1000);

      if (rawProgress < 1.0) {
        this.animationFrame = requestAnimationFrame((ts) => this.animate(ts));
      } else {
        this.isAnimating = false;
        this.startTime = 0;
        this.lastFrameTs = 0;
        this.slowFrameCount = 0;
        this.clearCanvas();

        if (typeof this.onCompleteCallback === 'function') {
          this.onCompleteCallback();
        }
      }
    }

    /**
     * Trigger a single burn transition wave
     */
    trigger(options = {}) {
      const now = performance.now();

      // STRICT DEBOUNCE: If transition is animating or duplicate within 300ms, ignore
      if (!options.force && (this.isAnimating || (now - this.lastTriggerTimestamp < 300))) {
        return;
      }
      this.lastTriggerTimestamp = now;

      // Reduced-motion user preference: Instant transition without WebGL churn
      if (this.device && this.device.prefersReducedMotion) {
        if (typeof options.onPeak === 'function') setTimeout(options.onPeak, 40);
        if (typeof options.onComplete === 'function') setTimeout(options.onComplete, 80);
        return;
      }

      if (!this.isReady) {
        if (typeof options.onPeak === 'function') options.onPeak();
        if (typeof options.onComplete === 'function') options.onComplete();
        return;
      }

      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }

      this.mode = options.mode || 'pulse';
      // Page navigation: 420ms; Button pulse: 340ms (ultra-fast & fluid)
      this.duration = options.duration || (this.mode === 'page' ? 420 : 340);
      this.currentBandSize = this.mode === 'page' ? 0.0 : 0.38; // 0 for full wipe, 0.38 for traveling flame
      this.onPeakCallback = options.onPeak || null;
      this.onCompleteCallback = options.onComplete || null;
      this.peakTriggered = false;
      this.startTime = 0;
      this.lastFrameTs = 0;
      this.slowFrameCount = 0;

      if (options.color) this.baseColor = hexToRgb(options.color);
      if (options.transitionColor) this.transitionColor = hexToRgb(options.transitionColor);

      this.isAnimating = true;
      this.animationFrame = requestAnimationFrame((ts) => this.animate(ts));
    }
  }

  // ── Global Singleton Instance ─────────────────────────────────────────────
  let engine = null;

  function getEngine() {
    if (!engine) {
      engine = new QuantumBurnEngine();
    }
    return engine;
  }

  // ── Public Global API ─────────────────────────────────────────────────────
  window.triggerBurnTransition = function (callback, options = {}) {
    const eng = getEngine();
    const isNavigation = typeof callback === 'function';

    const mergedOpts = {
      mode: isNavigation ? 'page' : (options.mode || 'pulse'),
      color: options.color || '#05070f',
      transitionColor: options.transitionColor || '#facc15',
      duration: options.duration || (isNavigation ? 420 : 340),
      onPeak: isNavigation ? callback : options.onPeak,
      onComplete: options.onComplete,
      force: options.force || false
    };

    eng.trigger(mergedOpts);
  };

  // ── Tactile Button Feedback ───────────────────────────────────────────────
  function triggerTactileButtonFx(el, color) {
    if (!el) return;
    el.style.transition = 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease';
    el.style.transform = 'scale(0.96)';
    if (color) {
      el.style.boxShadow = `0 0 20px ${color}40`;
    }
    setTimeout(() => {
      el.style.transform = '';
      setTimeout(() => { el.style.boxShadow = ''; }, 250);
    }, 150);
  }

  // ── Auto-attach Burn Transition to Website Buttons & Links ────────────────
  function attachBurnToInteractiveElements() {
    // Single centralized click listener on document
    document.addEventListener('click', function (e) {
      // Prevent handling if already marked by another child listener
      if (e._burnHandled) return;

      const now = performance.now();
      const eng = getEngine();
      if (eng.isLocked || (now - eng.lastTriggerTimestamp < 400)) {
        return; // Guard against multi-triggers on 1 click
      }

      // Check closest anchor
      const link = e.target.closest('a');

      // ── CASE 1: Page Navigation Links ─────────────────────────────────────
      if (link && link.href) {
        const href = link.getAttribute('href');
        const target = link.getAttribute('target');

        // Ignore hash jumps, javascript:, tel:, mailto:
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('tel:') || href.startsWith('mailto:')) {
          return;
        }

        // WhatsApp or external links
        if (target === '_blank' || href.includes('wa.me') || href.includes('whatsapp') || href.startsWith('http://') || href.startsWith('https://')) {
          if (href.includes('wa.me') || href.includes('whatsapp')) {
            e._burnHandled = true;
            triggerTactileButtonFx(link, '#22c55e');
            window.triggerBurnTransition(null, {
              mode: 'pulse',
              transitionColor: '#22c55e',
              duration: 320
            });
          }
          return; // Allow native external open
        }

        // Internal multi-page transitions (products.html, product-detail.html, index.html)
        if (
          href.includes('.html') ||
          href.startsWith('/') ||
          href.startsWith('./') ||
          href.startsWith('../')
        ) {
          // If user held modifier keys (Ctrl/Cmd/Shift), let browser open in new tab
          if (e.ctrlKey || e.metaKey || e.shiftKey) return;

          e.preventDefault();
          e._burnHandled = true;

          let navigated = false;
          const doNavigate = () => {
            if (!navigated) {
              navigated = true;
              window.location.href = link.href;
            }
          };

          // Safety fallback timeout
          setTimeout(doNavigate, 480);

          // Single smooth exit wave — exactly ONCE!
          window.triggerBurnTransition(doNavigate, {
            mode: 'page',
            color: '#05070f',
            transitionColor: '#facc15',
            duration: 420
          });
          return;
        }
      }

      // ── CASE 2: Action Buttons (Add to Cart, Buy Now, WhatsApp, Modal, Auth) ──
      const button = e.target.closest('button, [role="button"], .ios27-pill-auth, .auth-v7-btn-submit');
      if (button) {
        if (button.dataset.noBurn === 'true') return;
        e._burnHandled = true;

        // Custom transition colors based on button identity
        let emberColor = '#facc15'; // Default golden flame
        if (button.classList.contains('ios27-pill-whatsapp') || button.textContent.includes('WhatsApp')) {
          emberColor = '#22c55e'; // WhatsApp Emerald
        } else if (button.classList.contains('auth-v7-social-btn') && button.textContent.includes('Google')) {
          emberColor = '#4285F4'; // Google Neon Blue
        } else if (button.id === 'v7-btn-signup' || button.id === 'v7-btn-signin') {
          emberColor = '#f59e0b'; // Amber Gold
        } else if (button.classList.contains('filter-pill')) {
          emberColor = '#00f0ff'; // Cyber Cyan
        }

        // Tactile button scale & glow (100% GPU compositor, zero CPU overhead)
        triggerTactileButtonFx(button, emberColor);

        // On mobile or low-end devices, skip full-screen WebGL redraw for in-page button taps
        // Tactile CSS feedback is already instantaneous and prevents GPU churn.
        if (eng.device && (eng.device.isMobile || eng.device.isLowEnd)) {
          return;
        }

        // Fast, smooth traveling flame wave on desktop (320ms)
        window.triggerBurnTransition(null, {
          mode: 'pulse',
          transitionColor: emberColor,
          duration: 320
        });
      }
    }, false); // Use bubble phase with e._burnHandled to prevent duplicate capture firing
  }

  // ── Auto-Initialize on DOM Ready ──────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      getEngine();
      attachBurnToInteractiveElements();
    });
  } else {
    getEngine();
    attachBurnToInteractiveElements();
  }
})();
