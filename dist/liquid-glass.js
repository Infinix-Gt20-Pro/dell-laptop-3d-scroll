/**
 * Universal Apple Liquid Glass UI Engine
 * Pure Web Standards (SVG Filters + Snell's Law Displacement + Progressive Gradient Blur)
 * Derived from https://github.com/mkj0kjay/vue-web-liquid-glass
 * 
 * Usable natively in ANY web application, framework (Vue, React, Svelte, Angular, Vanilla JS).
 */

(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    const exports = factory();
    global.LiquidGlass = exports;
    if (typeof global.window !== 'undefined') {
      global.window.LiquidGlass = exports;
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis : window, function () {
  'use strict';

  /* =========================================================================
   * 1. PHYSICAL REFRACTION & OPTICAL MATHEMATICS (Snell's Law)
   * ========================================================================= */

  const SurfaceEquations = {
    convexCircle: (x) => Math.sqrt(Math.max(0, 1 - (1 - x) ** 2)),
    convexSquircle: (x) => Math.pow(Math.max(0, 1 - Math.pow(Math.max(0, 1 - x), 4)), 0.25),
    concave: (x) => 1 - Math.sqrt(Math.max(0, 1 - (1 - x) ** 2)),
    lip: (x) => {
      const conv = SurfaceEquations.convexSquircle(Math.min(1, x * 2));
      const conc = SurfaceEquations.concave(x) + 0.1;
      const smooth = 6 * (x ** 5) - 15 * (x ** 4) + 10 * (x ** 3);
      return conv * (1 - smooth) + conc * smooth;
    }
  };

  /**
   * Precalculate optical ray deviation profile using Snell's Law
   */
  function calculateDisplacementMap(
    glassThickness = 120,
    bezelWidth = 40,
    surfaceFn = SurfaceEquations.convexSquircle,
    refractiveIndex = 1.5,
    samples = 128
  ) {
    const eta = 1 / refractiveIndex;

    function refract(normalX, normalY) {
      const dot = normalY;
      const k = 1 - eta * eta * (1 - dot * dot);
      if (k < 0) return null; // Total internal reflection
      const kSqrt = Math.sqrt(k);
      return [
        -(eta * dot + kSqrt) * normalX,
        eta - (eta * dot + kSqrt) * normalY
      ];
    }

    return Array.from({ length: samples }, (_, i) => {
      const x = i / samples;
      const y = surfaceFn(x);
      const dx = x < 1 ? 0.0001 : -0.0001;
      const y2 = surfaceFn(x + dx);
      const derivative = (y2 - y) / dx;
      const magnitude = Math.sqrt(derivative * derivative + 1);
      const normal = [-derivative / magnitude, -1 / magnitude];
      const refracted = refract(normal[0], normal[1]);

      if (!refracted) return 0;
      const remainingHeight = y * bezelWidth + glassThickness;
      return refracted[0] * (remainingHeight / (refracted[1] || 0.0001));
    });
  }

  /**
   * Render Snell's law displacement texture onto an ImageData buffer
   */
  function calculateDisplacementImageData(
    canvasWidth,
    canvasHeight,
    objectWidth,
    objectHeight,
    bezelWidth,
    maxDisplacement,
    precomputedMap,
    shape = 'squircle',
    cornerRadius = 0.85,
    dpr = 1
  ) {
    const bufferWidth = Math.max(1, Math.floor(canvasWidth * dpr));
    const bufferHeight = Math.max(1, Math.floor(canvasHeight * dpr));
    const imageData = new ImageData(bufferWidth, bufferHeight);
    
    // Fill with neutral refraction color (128, 128, 0, 255)
    new Uint32Array(imageData.data.buffer).fill(0xff008080);

    const objW = objectWidth * dpr;
    const objH = objectHeight * dpr;
    const bezel = bezelWidth * dpr;
    const objX = (bufferWidth - objW) / 2;
    const objY = (bufferHeight - objH) / 2;

    const maxRad = Math.min(objW, objH) / 2;
    const radius = shape === 'pill' ? maxRad : Math.max(4, cornerRadius * maxRad);

    for (let y1 = 0; y1 < objH; y1++) {
      for (let x1 = 0; x1 < objW; x1++) {
        const idx = ((objY + y1) * bufferWidth + objX + x1) * 4;

        const isLeft = x1 < radius;
        const isRight = x1 >= objW - radius;
        const isTop = y1 < radius;
        const isBottom = y1 >= objH - radius;

        let distanceToEdge = 0;
        let normalX = 0, normalY = 0;
        let inBezel = false;

        if ((isLeft || isRight) && (isTop || isBottom)) {
          const cx = isLeft ? x1 - radius : x1 - (objW - radius);
          const cy = isTop ? y1 - radius : y1 - (objH - radius);
          const distFromCorner = Math.sqrt(cx * cx + cy * cy);
          distanceToEdge = radius - distFromCorner;

          if (distanceToEdge >= -1 && distanceToEdge <= bezel) {
            inBezel = true;
            const mag = distFromCorner || 1;
            normalX = cx / mag;
            normalY = cy / mag;
          }
        } else if (isLeft || isRight) {
          distanceToEdge = isLeft ? x1 : (objW - 1 - x1);
          if (distanceToEdge <= bezel) {
            inBezel = true;
            normalX = isLeft ? -1 : 1;
            normalY = 0;
          }
        } else if (isTop || isBottom) {
          distanceToEdge = isTop ? y1 : (objH - 1 - y1);
          if (distanceToEdge <= bezel) {
            inBezel = true;
            normalX = 0;
            normalY = isTop ? -1 : 1;
          }
        }

        if (inBezel && distanceToEdge >= 0) {
          const opacity = distanceToEdge >= 0 ? 1 : Math.max(0, 1 + distanceToEdge);
          const mapIdx = Math.min(
            precomputedMap.length - 1,
            Math.max(0, Math.floor((distanceToEdge / (bezel || 1)) * precomputedMap.length))
          );
          const dist = precomputedMap[mapIdx] || 0;

          const dX = (-normalX * dist) / (maxDisplacement || 1);
          const dY = (-normalY * dist) / (maxDisplacement || 1);

          imageData.data[idx] = 128 + dX * 127 * opacity;     // R -> X displacement
          imageData.data[idx + 1] = 128 + dY * 127 * opacity; // G -> Y displacement
          imageData.data[idx + 2] = 0;                         // B
          imageData.data[idx + 3] = 255;                       // Alpha
        }
      }
    }

    return imageData;
  }

  /**
   * Convert ImageData into DataURL PNG
   */
  function imageDataToDataUrl(imageData) {
    if (typeof document === 'undefined') return '';
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
  }

  /* =========================================================================
   * 2. DYNAMIC SVG FILTER REGISTRY & INJECTION
   * ========================================================================= */

  let svgDefsContainer = null;
  const filterCache = new Map();

  function getSvgContainer() {
    if (typeof document === 'undefined') return null;
    if (!svgDefsContainer) {
      svgDefsContainer = document.getElementById('liquid-glass-svg-defs');
      if (!svgDefsContainer) {
        svgDefsContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgDefsContainer.id = 'liquid-glass-svg-defs';
        svgDefsContainer.setAttribute('color-interpolation-filters', 'sRGB');
        svgDefsContainer.style.position = 'absolute';
        svgDefsContainer.style.width = '0';
        svgDefsContainer.style.height = '0';
        svgDefsContainer.style.overflow = 'hidden';
        svgDefsContainer.style.pointerEvents = 'none';
        svgDefsContainer.style.display = 'none';

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        svgDefsContainer.appendChild(defs);
        document.body ? document.body.appendChild(svgDefsContainer) : document.addEventListener('DOMContentLoaded', () => document.body.appendChild(svgDefsContainer));
      }
    }
    return svgDefsContainer.querySelector('defs') || svgDefsContainer;
  }

  /**
   * Create or fetch a cached SVG Optical Refraction Filter
   */
  function createLiquidGlassFilter(options = {}) {
    const width = options.width || 300;
    const height = options.height || 100;
    const bezelWidth = options.bezelWidth || 20;
    const glassThickness = options.glassThickness || 80;
    const refractiveIndex = options.refractiveIndex || 1.5;
    const shape = options.shape || 'squircle';
    const cornerRadius = options.cornerRadius || 0.85;
    const blur = options.blur !== undefined ? options.blur : 0.25;
    const saturation = options.specularSaturation || 4;

    const cacheKey = `${width}x${height}-${bezelWidth}-${glassThickness}-${shape}-${cornerRadius}`;
    if (filterCache.has(cacheKey)) {
      return filterCache.get(cacheKey);
    }

    const filterId = `lg-optic-filter-${Math.random().toString(36).substring(2, 9)}`;

    // Calculate displacement
    const precomputed = calculateDisplacementMap(
      glassThickness,
      bezelWidth,
      SurfaceEquations.convexSquircle,
      refractiveIndex
    );
    const maxDisp = Math.max(...precomputed.map(x => Math.abs(x))) || 1;
    const imgData = calculateDisplacementImageData(
      width, height, width, height, bezelWidth, maxDisp, precomputed, shape, cornerRadius, 1
    );
    const displacementUrl = imageDataToDataUrl(imgData);

    const defs = getSvgContainer();
    if (defs) {
      const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.setAttribute('id', filterId);
      filter.setAttribute('x', '0');
      filter.setAttribute('y', '0');
      filter.setAttribute('width', '100%');
      filter.setAttribute('height', '100%');

      filter.innerHTML = `
        <feGaussianBlur in="SourceGraphic" stdDeviation="${blur}" result="blurred_source" />
        <feImage href="${displacementUrl}" x="0" y="0" width="${width}" height="${height}" result="disp_map" />
        <feDisplacementMap in="blurred_source" in2="disp_map" scale="${maxDisp * 0.85}" xChannelSelector="R" yChannelSelector="G" result="displaced" />
        <feColorMatrix in="displaced" type="saturate" values="${saturation}" result="saturated" />
        <feBlend in="saturated" in2="displaced" mode="normal" />
      `;
      defs.appendChild(filter);
    }

    filterCache.set(cacheKey, filterId);
    return filterId;
  }

  /* =========================================================================
   * 3. PROGRESSIVE 8-LAYER GRADIENT BLUR
   * ========================================================================= */

  function injectGradientBlur(container, directions = ['top', 'bottom', 'left', 'right'], size = 45) {
    if (!container) return;
    directions.forEach(dir => {
      const existing = container.querySelector(`.lg-gradient-blur-${dir}`);
      if (existing) return;

      const blurDiv = document.createElement('div');
      blurDiv.className = `lg-gradient-blur lg-gradient-blur-${dir}`;
      blurDiv.style.setProperty('--lg-blur-size', `${size}px`);
      blurDiv.innerHTML = '<div></div><div></div><div></div><div></div><div></div><div></div>';
      container.appendChild(blurDiv);
    });
  }

  /* =========================================================================
   * 4. UNIVERSAL LIQUID GLASS APPLIER & AUTO-ENHANCE
   * ========================================================================= */

  /**
   * Apply Apple Liquid Glass styling and optical refraction filter to any DOM element
   */
  function applyLiquidGlass(element, options = {}) {
    if (!element) return;

    element.classList.add('liquid-glass');

    if (options.gradientBlur !== false) {
      injectGradientBlur(element, options.directions || ['top', 'bottom'], options.blurSize || 45);
    }

    // Measure element for SVG displacement map
    const rect = element.getBoundingClientRect();
    const w = Math.round(rect.width || element.offsetWidth || 320);
    const h = Math.round(rect.height || element.offsetHeight || 120);

    try {
      const filterId = createLiquidGlassFilter({
        width: w,
        height: h,
        shape: options.shape || 'squircle',
        bezelWidth: options.bezelWidth || Math.min(24, Math.floor(h / 3)),
        glassThickness: options.glassThickness || 80,
        specularSaturation: options.saturation || 4
      });

      // Check if Chrome / modern browser handles backdrop-filter SVG url
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      if (isChrome && filterId) {
        element.style.setProperty('--lg-optic-filter', `url(#${filterId}) blur(24px) saturate(200%) contrast(105%)`);
        element.classList.add('liquid-glass-optic');
      }
    } catch (err) {
      console.warn('[LiquidGlass] Optical shader fallback to CSS backdrop filter:', err);
    }
  }

  /**
   * Auto-enhance all liquid glass elements in DOM
   */
  function init(options = {}) {
    if (typeof document === 'undefined') return;

    const selector = options.selector || '.liquid-glass, [data-liquid-glass], .ios27-glass';
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => applyLiquidGlass(el, options));

    // Register Web Components if supported
    registerCustomElements();
  }

  /* =========================================================================
   * 5. WEB COMPONENTS (Custom Elements for ANY Application)
   * ========================================================================= */

  function registerCustomElements() {
    if (typeof customElements === 'undefined') return;

    // <liquid-glass-container>
    if (!customElements.get('liquid-glass-container')) {
      class LiquidGlassContainer extends HTMLElement {
        connectedCallback() {
          this.classList.add('liquid-glass');
          const size = parseInt(this.getAttribute('blur-size') || '45', 10);
          injectGradientBlur(this, ['top', 'bottom', 'left', 'right'], size);
          setTimeout(() => applyLiquidGlass(this), 50);
        }
      }
      customElements.define('liquid-glass-container', LiquidGlassContainer);
    }

    // <liquid-glass-switch>
    if (!customElements.get('liquid-glass-switch')) {
      class LiquidGlassSwitch extends HTMLElement {
        constructor() {
          super();
          this._checked = false;
        }

        static get observedAttributes() {
          return ['checked'];
        }

        get checked() {
          return this._checked;
        }

        set checked(val) {
          this._checked = Boolean(val);
          this.updateState();
        }

        connectedCallback() {
          this._checked = this.hasAttribute('checked');
          this.render();
          this.addEventListener('click', () => {
            this.checked = !this.checked;
            this.dispatchEvent(new CustomEvent('change', { detail: { checked: this.checked } }));
          });
        }

        render() {
          this.innerHTML = `
            <div class="liquid-glass-switch-track ${this._checked ? 'active' : ''}" style="width: 58px; height: 32px; padding: 2px;">
              <div class="liquid-glass-switch-thumb" style="width: 28px; height: 28px; transform: ${this._checked ? 'translateX(26px)' : 'translateX(0)'};"></div>
            </div>
          `;
        }

        updateState() {
          const track = this.querySelector('.liquid-glass-switch-track');
          const thumb = this.querySelector('.liquid-glass-switch-thumb');
          if (track && thumb) {
            if (this._checked) {
              track.classList.add('active');
              thumb.style.transform = 'translateX(26px)';
            } else {
              track.classList.remove('active');
              thumb.style.transform = 'translateX(0)';
            }
          }
        }
      }
      customElements.define('liquid-glass-switch', LiquidGlassSwitch);
    }
  }

  // Auto-run when DOM is ready
  if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => init());
    } else {
      setTimeout(() => init(), 0);
    }
  }

  return {
    init,
    apply: applyLiquidGlass,
    createFilter: createLiquidGlassFilter,
    injectGradientBlur,
    calculateDisplacementMap,
    calculateDisplacementImageData,
    SurfaceEquations
  };
});
