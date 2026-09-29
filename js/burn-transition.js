/**
 * Classic Computers — Framer WebGL Burn Transition Engine
 * =======================================================
 * Replicates the authentic Framer BurnTransition shader (BurnTransition-prod-cH3n.js)
 * Features:
 * - 2D FBM procedural noise burn edge with torn-paper fiber grain
 * - Multi-pass WebGL Bloom extraction + 13-tap Gaussian blur + additive glow composite
 * - Smooth 60fps hardware-accelerated rendering
 * - Two modes:
 *     1. 'page': Fullscreen burn wave transition between pages / viewports
 *     2. 'pulse': Energetic traveling flame ember wave on button click (Add to Cart, WhatsApp, filters, modal triggers)
 * - Auto-binds to product buttons, CTA buttons, auth buttons, and navigation links
 * - Mobile-optimized with DPR capping and half-res bloom FBOs
 */

(function () {
  'use strict';

  // ── Shaders extracted from Framer BurnTransition-prod-cH3n.js ─────────────
  const vertexShaderSrc = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = 0.5 * (a_position + 1.0);
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentShaderSrc = `
    precision mediump float;
    varying vec2 v_uv;
    uniform vec3 u_color;
    uniform vec3 u_transition_color;
    uniform float u_noise_scale;
    uniform float u_noise_intensity;
    uniform float u_scroll_offset;
    uniform float u_edge_softness;
    uniform float u_grain_scale;
    uniform float u_movement_horizontal;
    uniform float u_movement_vertical;
    uniform float u_parallax_offset;
    uniform float u_aspect_ratio;
    uniform float u_band_size; // > 0 creates a traveling fiery wave with transparent trailing edge

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float fbm(vec2 st) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 4; i++) {
        value += amplitude * noise(st);
        st *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    float detailedNoise(vec2 st) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 6; i++) {
        value += amplitude * noise(st);
        st *= 2.2;
        amplitude *= 0.45;
      }
      return value;
    }

    void main() {
      float baseLine = 0.5 + u_parallax_offset;
      float horizontalOffset = u_scroll_offset * u_movement_horizontal;
      float verticalOffset = u_scroll_offset * u_movement_vertical;

      vec2 noiseCoord = vec2(
        v_uv.x * u_aspect_ratio * u_noise_scale + horizontalOffset,
        v_uv.y * 3.0 + verticalOffset * 0.6
      );
      float edgeNoise = fbm(noiseCoord);
      float mainEdge = baseLine + (edgeNoise - 0.5) * u_noise_intensity;

      vec2 thicknessNoiseCoord = vec2(
        v_uv.x * u_aspect_ratio * u_noise_scale * 2.3 + horizontalOffset * 0.7,
        v_uv.y * 2.0 + verticalOffset * 0.4 + 100.0
      );
      float thicknessNoise = fbm(thicknessNoiseCoord);
      float minThickness = u_edge_softness * 0.1;
      float maxThickness = u_edge_softness;
      float localThickness = mix(minThickness, maxThickness, thicknessNoise);

      float lowerBound = mainEdge - localThickness * 0.4;
      float upperBound = mainEdge + localThickness * 0.6;

      // Trailing edge discard for traveling flame wave (pulse mode)
      if (u_band_size > 0.001) {
        float trailingEdge = lowerBound - u_band_size;
        if (v_uv.y < trailingEdge) {
          discard;
        }
      }

      vec2 grainCoord = vec2(
        v_uv.x * u_aspect_ratio * u_grain_scale * 3.0 + horizontalOffset * 0.5,
        v_uv.y * u_grain_scale * 3.0 + verticalOffset * 0.3
      );
      float grain = detailedNoise(grainCoord);

      vec2 fiberCoord = vec2(
        v_uv.x * u_aspect_ratio * u_grain_scale * 8.0 + horizontalOffset * 0.3,
        v_uv.y * u_grain_scale * 2.0 + verticalOffset * 0.2
      );
      float fiberNoise = noise(fiberCoord);
      float combinedGrain = grain * 0.6 + fiberNoise * 0.4;

      if (v_uv.y < lowerBound) {
        gl_FragColor = vec4(u_color, 1.0);
      } else if (v_uv.y < mainEdge) {
        float t = (v_uv.y - lowerBound) / max(mainEdge - lowerBound, 0.001);
        float grainThreshold = 1.0 - pow(t, 1.5) - thicknessNoise * 0.2;
        if (combinedGrain > grainThreshold) {
          gl_FragColor = vec4(u_transition_color, 1.0);
        } else {
          gl_FragColor = vec4(u_color, 1.0);
        }
      } else if (v_uv.y < upperBound) {
        float t = (v_uv.y - mainEdge) / max(upperBound - mainEdge, 0.001);
        float grainThreshold = pow(t, 1.2) + thicknessNoise * 0.15;
        if (combinedGrain > grainThreshold) {
          gl_FragColor = vec4(u_transition_color, 1.0);
        } else {
          discard;
        }
      } else {
        discard;
      }
    }
  `;

  // Bloom extraction shader: filters only burning transition pixels
  const extractFragmentShaderSrc = `
    precision mediump float;
    varying vec2 v_uv;
    uniform sampler2D u_texture;
    uniform vec3 u_transition_color;
    uniform vec3 u_base_color;

    void main() {
      vec4 pixel = texture2D(u_texture, v_uv);
      float distToTransition = length(pixel.rgb - u_transition_color);
      float distToBase = length(pixel.rgb - u_base_color);
      float isTransition = 1.0 - smoothstep(0.0, 0.5, distToTransition);
      float notBase = smoothstep(0.0, 0.3, distToBase);
      float mask = isTransition * notBase * pixel.a;
      mask = pow(mask, 0.8);
      gl_FragColor = vec4(1.0, 1.0, 1.0, mask);
    }
  `;

  // 13-tap Gaussian blur shader for radiant bloom
  const blurFragmentShaderSrc = `
    precision mediump float;
    varying vec2 v_uv;
    uniform sampler2D u_texture;
    uniform vec2 u_direction;
    uniform vec2 u_resolution;
    uniform float u_radius;

    void main() {
      float blur_size = u_radius * 12.0;
      float alpha = 0.0;
      float totalWeight = 0.0;
      for (int i = -6; i <= 6; i++) {
        float offset = float(i);
        float weight = exp(-0.5 * (offset * offset) / 4.0);
        vec2 sampleOffset = u_direction * (offset * blur_size) / u_resolution;
        float sampleAlpha = texture2D(u_texture, v_uv + sampleOffset).a;
        alpha += sampleAlpha * weight;
        totalWeight += weight;
      }
      alpha = totalWeight > 0.0 ? alpha / totalWeight : 0.0;
      gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
    }
  `;

  // Composite shader: blends burning scene with additive glowing bloom
  const compositeFragmentShaderSrc = `
    precision mediump float;
    varying vec2 v_uv;
    uniform sampler2D u_scene;
    uniform sampler2D u_bloom;
    uniform float u_bloom_intensity;
    uniform vec3 u_transition_color;

    void main() {
      vec4 scene = texture2D(u_scene, v_uv);
      vec4 bloom = texture2D(u_bloom, v_uv);
      float bloomStrength = bloom.a * u_bloom_intensity;
      vec3 bloomColor = u_transition_color * bloomStrength * 2.0;

      if (scene.a < 0.001) {
        float glowAlpha = bloomStrength * 1.5;
        gl_FragColor = vec4(u_transition_color, glowAlpha);
      } else {
        vec3 result = min(scene.rgb + bloomColor, vec3(1.0));
        gl_FragColor = vec4(result, scene.a);
      }
    }
  `;

  // ── Color Parsing Helper ──────────────────────────────────────────────────
  function hexToRgb(hex) {
    if (Array.isArray(hex)) return hex;
    const clean = hex.replace('#', '').trim();
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
    return [1.0, 0.8, 0.1];
  }

  // ── WebGL Engine Class ───────────────────────────────────────────────────
  class FramerBurnEngine {
    constructor() {
      this.canvas = null;
      this.gl = null;
      this.mainProgram = null;
      this.extractProgram = null;
      this.blurProgram = null;
      this.compositeProgram = null;
      this.quadBuffer = null;
      this.isReady = false;
      this.isAnimating = false;
      this.animationFrame = null;

      // Framebuffers for bloom pass
      this.fboScene = null;
      this.fboExtract = null;
      this.fboBlur1 = null;
      this.fboBlur2 = null;

      // Animation parameters
      this.baseColor = hexToRgb('#060913'); // Deep dark matching store aesthetic
      this.transitionColor = hexToRgb('#facc15'); // Radiant amber gold flame ember
      this.noiseScale = 7.5;
      this.noiseIntensity = 0.35;
      this.edgeSoftness = 0.06;
      this.grainScale = 140.0;
      this.movementHorizontal = -1.0;
      this.movementVertical = 0.8;
      this.bloomIntensity = 1.35;
      this.bloomRadius = 0.12;

      this.currentParallax = -1.2;
      this.currentBandSize = 0.0;
      this.scrollOffset = 0.0;
      this.startTime = 0;
      this.duration = 650;
      this.direction = 1; // 1 = upwards burn, -1 = downwards
      this.onPeakCallback = null;
      this.onCompleteCallback = null;
      this.peakTriggered = false;

      this.init();
    }

    init() {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;

      // 1. Create fullscreen overlay canvas
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

      // 2. Initialize WebGL Context
      const gl = canvas.getContext('webgl', {
        alpha: true,
        antialias: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false
      });

      if (!gl) {
        console.warn('WebGL not supported for Burn Transition');
        return;
      }
      this.gl = gl;

      // 3. Compile Shaders
      this.mainProgram = this.createProgram(vertexShaderSrc, fragmentShaderSrc);
      this.extractProgram = this.createProgram(vertexShaderSrc, extractFragmentShaderSrc);
      this.blurProgram = this.createProgram(vertexShaderSrc, blurFragmentShaderSrc);
      this.compositeProgram = this.createProgram(vertexShaderSrc, compositeFragmentShaderSrc);

      if (!this.mainProgram) {
        console.warn('Burn transition main shader failed to compile');
        return;
      }

      // 4. Create Fullscreen Quad Buffer
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

      // 5. Initialize Framebuffers
      this.resize();
      window.addEventListener('resize', () => this.resize(), { passive: true });

      this.isReady = true;
      this.clearCanvas();

      // Check if page opened with incoming burn reveal
      if (sessionStorage.getItem('cc_burn_revealing') === '1') {
        sessionStorage.removeItem('cc_burn_revealing');
        this.runPageReveal();
      }
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

    createProgram(vSrc, fSrc) {
      const gl = this.gl;
      const vs = this.createShader(gl.VERTEX_SHADER, vSrc);
      const fs = this.createShader(gl.FRAGMENT_SHADER, fSrc);
      if (!vs || !fs) return null;

      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Burn program linking error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
      return program;
    }

    createFbo(width, height) {
      const gl = this.gl;
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      const framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      return { fbo: framebuffer, texture, width, height };
    }

    resize() {
      if (!this.canvas || !this.gl) return;
      const gl = this.gl;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);

      if (this.canvas.width === w && this.canvas.height === h) return;
      this.canvas.width = w;
      this.canvas.height = h;

      const bloomW = Math.max(64, Math.floor(w / 2));
      const bloomH = Math.max(64, Math.floor(h / 2));

      // Recreate FBO textures
      this.fboScene = this.createFbo(w, h);
      this.fboExtract = this.createFbo(bloomW, bloomH);
      this.fboBlur1 = this.createFbo(bloomW, bloomH);
      this.fboBlur2 = this.createFbo(bloomW, bloomH);
    }

    clearCanvas() {
      if (!this.gl) return;
      const gl = this.gl;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }

    renderScene(targetFbo) {
      const gl = this.gl;
      const p = this.mainProgram;
      gl.bindFramebuffer(gl.FRAMEBUFFER, targetFbo ? targetFbo.fbo : null);
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);

      gl.useProgram(p);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);

      const aPos = gl.getAttribLocation(p, 'a_position');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      gl.uniform3fv(gl.getUniformLocation(p, 'u_color'), this.baseColor);
      gl.uniform3fv(gl.getUniformLocation(p, 'u_transition_color'), this.transitionColor);
      gl.uniform1f(gl.getUniformLocation(p, 'u_noise_scale'), this.noiseScale);
      gl.uniform1f(gl.getUniformLocation(p, 'u_noise_intensity'), this.noiseIntensity);
      gl.uniform1f(gl.getUniformLocation(p, 'u_scroll_offset'), this.scrollOffset);
      gl.uniform1f(gl.getUniformLocation(p, 'u_edge_softness'), this.edgeSoftness);
      gl.uniform1f(gl.getUniformLocation(p, 'u_grain_scale'), this.grainScale);
      gl.uniform1f(gl.getUniformLocation(p, 'u_movement_horizontal'), this.movementHorizontal);
      gl.uniform1f(gl.getUniformLocation(p, 'u_movement_vertical'), this.movementVertical);
      gl.uniform1f(gl.getUniformLocation(p, 'u_parallax_offset'), this.currentParallax);
      gl.uniform1f(gl.getUniformLocation(p, 'u_band_size'), this.currentBandSize);

      const aspect = this.canvas.height > 0 ? this.canvas.width / this.canvas.height : 1.0;
      gl.uniform1f(gl.getUniformLocation(p, 'u_aspect_ratio'), aspect);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    renderExtract(srcTex, dstFbo) {
      const gl = this.gl;
      const p = this.extractProgram;
      gl.bindFramebuffer(gl.FRAMEBUFFER, dstFbo.fbo);
      gl.viewport(0, 0, dstFbo.width, dstFbo.height);
      gl.useProgram(p);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
      const aPos = gl.getAttribLocation(p, 'a_position');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, srcTex);
      gl.uniform1i(gl.getUniformLocation(p, 'u_texture'), 0);
      gl.uniform3fv(gl.getUniformLocation(p, 'u_transition_color'), this.transitionColor);
      gl.uniform3fv(gl.getUniformLocation(p, 'u_base_color'), this.baseColor);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.disable(gl.BLEND);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    renderBlur(srcTex, dstFbo, dir) {
      const gl = this.gl;
      const p = this.blurProgram;
      gl.bindFramebuffer(gl.FRAMEBUFFER, dstFbo.fbo);
      gl.viewport(0, 0, dstFbo.width, dstFbo.height);
      gl.useProgram(p);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
      const aPos = gl.getAttribLocation(p, 'a_position');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, srcTex);
      gl.uniform1i(gl.getUniformLocation(p, 'u_texture'), 0);
      gl.uniform2f(gl.getUniformLocation(p, 'u_direction'), dir[0], dir[1]);
      gl.uniform2f(gl.getUniformLocation(p, 'u_resolution'), dstFbo.width, dstFbo.height);
      gl.uniform1f(gl.getUniformLocation(p, 'u_radius'), this.bloomRadius);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.disable(gl.BLEND);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    renderComposite(sceneTex, bloomTex) {
      const gl = this.gl;
      const p = this.compositeProgram;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.useProgram(p);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
      const aPos = gl.getAttribLocation(p, 'a_position');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, sceneTex);
      gl.uniform1i(gl.getUniformLocation(p, 'u_scene'), 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, bloomTex);
      gl.uniform1i(gl.getUniformLocation(p, 'u_bloom'), 1);

      gl.uniform1f(gl.getUniformLocation(p, 'u_bloom_intensity'), this.bloomIntensity);
      gl.uniform3fv(gl.getUniformLocation(p, 'u_transition_color'), this.transitionColor);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.disable(gl.BLEND);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    draw() {
      if (!this.gl || !this.mainProgram) return;

      const hasBloom = this.bloomIntensity > 0 &&
        this.fboScene && this.fboExtract && this.fboBlur1 && this.fboBlur2 &&
        this.extractProgram && this.blurProgram && this.compositeProgram;

      if (hasBloom) {
        // Multi-pass Bloom pipeline
        this.renderScene(this.fboScene);
        this.renderExtract(this.fboScene.texture, this.fboExtract);
        this.renderBlur(this.fboExtract.texture, this.fboBlur1, [1.0, 0.0]);
        this.renderBlur(this.fboBlur1.texture, this.fboBlur2, [0.0, 1.0]);
        this.renderComposite(this.fboScene.texture, this.fboBlur2.texture);
      } else {
        // Direct single-pass fallback
        this.renderScene(null);
      }
    }

    /**
     * Start animation loop
     */
    animate(timestamp) {
      if (!this.isAnimating) return;
      if (!this.startTime) this.startTime = timestamp;

      const elapsed = timestamp - this.startTime;
      const progress = Math.min(1.0, elapsed / this.duration);

      // Smooth cubic bezier easing
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // Update shader uniforms
      this.scrollOffset = (elapsed / 1000) * 1.8;

      if (this.mode === 'page') {
        // Sweeps burn wave from bottom (-1.2) to full coverage (+1.2)
        this.currentParallax = -1.2 + eased * 2.4;
        this.currentBandSize = 0.0; // Solid coverage behind edge

        // Trigger peak/navigation callback at 60% when screen is covered
        if (progress >= 0.58 && !this.peakTriggered) {
          this.peakTriggered = true;
          if (typeof this.onPeakCallback === 'function') {
            this.onPeakCallback();
          }
        }
      } else if (this.mode === 'reveal') {
        // Burns away from full coverage (+1.2) into off-screen top (+2.6)
        this.currentParallax = 0.4 + eased * 1.8;
        this.currentBandSize = 0.0;
      } else {
        // Pulse mode (traveling flame wave for button clicks)
        // Sweeps completely through viewport: -1.2 to +1.8
        this.currentParallax = -1.0 + eased * 2.8;
        this.currentBandSize = 0.45; // Traveling band width
      }

      this.draw();

      if (progress < 1.0) {
        this.animationFrame = requestAnimationFrame((t) => this.animate(t));
      } else {
        this.isAnimating = false;
        this.startTime = 0;
        this.clearCanvas();
        if (typeof this.onCompleteCallback === 'function') {
          this.onCompleteCallback();
        }
      }
    }

    /**
     * Trigger a burn transition wave
     */
    trigger(options = {}) {
      if (!this.isReady) {
        if (typeof options.onPeak === 'function') options.onPeak();
        if (typeof options.onComplete === 'function') options.onComplete();
        return;
      }

      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }

      this.mode = options.mode || 'pulse';
      this.duration = options.duration || (this.mode === 'page' ? 620 : 540);
      this.onPeakCallback = options.onPeak || null;
      this.onCompleteCallback = options.onComplete || null;
      this.peakTriggered = false;
      this.startTime = 0;

      if (options.color) this.baseColor = hexToRgb(options.color);
      if (options.transitionColor) this.transitionColor = hexToRgb(options.transitionColor);

      this.isAnimating = true;
      this.animationFrame = requestAnimationFrame((t) => this.animate(t));
    }

    /**
     * Page entrance burn reveal
     */
    runPageReveal() {
      this.trigger({
        mode: 'reveal',
        duration: 520,
        color: '#060913',
        transitionColor: '#facc15'
      });
    }
  }

  // ── Global Singleton Instance ─────────────────────────────────────────────
  let engine = null;

  function getEngine() {
    if (!engine) {
      engine = new FramerBurnEngine();
    }
    return engine;
  }

  // ── Public Global API ─────────────────────────────────────────────────────
  window.triggerBurnTransition = function (callback, options = {}) {
    const eng = getEngine();
    const isNavigation = typeof callback === 'function';

    const mergedOpts = {
      mode: isNavigation ? 'page' : (options.mode || 'pulse'),
      color: options.color || '#060913',
      transitionColor: options.transitionColor || '#facc15',
      duration: options.duration || (isNavigation ? 620 : 540),
      onPeak: isNavigation ? callback : options.onPeak,
      onComplete: options.onComplete
    };

    eng.trigger(mergedOpts);
  };

  // ── Auto-attach Burn Transition to Website Buttons & Links ────────────────
  function attachBurnToInteractiveElements() {
    // 1. Navigation links between pages (e.g. Products, Experience, Details)
    document.addEventListener('click', function (e) {
      // Find closest anchor or button
      const link = e.target.closest('a');
      const button = e.target.closest('button, [role="button"], .ios27-pill-auth, .auth-v7-btn-submit');

      // Case A: Page navigation links (same-origin, not external, not hash-only)
      if (link && link.href) {
        const href = link.getAttribute('href');
        const target = link.getAttribute('target');

        // Ignore hash links, javascript:, tel:, mailto:, or external _blank tabs (e.g. WhatsApp)
        if (
          !href ||
          href.startsWith('#') ||
          href.startsWith('javascript:') ||
          href.startsWith('tel:') ||
          href.startsWith('mailto:') ||
          target === '_blank' ||
          e.ctrlKey || e.metaKey || e.shiftKey
        ) {
          // If it's a WhatsApp or external button, trigger an energetic burn pulse
          if (href && (href.includes('wa.me') || href.includes('whatsapp'))) {
            window.triggerBurnTransition(null, {
              mode: 'pulse',
              transitionColor: '#25D366' // WhatsApp emerald burn!
            });
          }
          return;
        }

        // Internal navigation (products.html, product-detail.html, index.html)
        if (
          href.includes('.html') ||
          href.startsWith('/') ||
          href.startsWith('./') ||
          href.startsWith('../')
        ) {
          e.preventDefault();
          // Store flag to reveal smoothly on next page
          try { sessionStorage.setItem('cc_burn_revealing', '1'); } catch (_) {}

          let navigated = false;
          const doNavigate = () => {
            if (!navigated) {
              navigated = true;
              window.location.href = link.href;
            }
          };

          // Safety timeout in case WebGL is blocked or backgrounded
          setTimeout(doNavigate, 680);

          window.triggerBurnTransition(doNavigate, {
            mode: 'page',
            color: '#060913',
            transitionColor: '#facc15'
          });
          return;
        }
      }

      // Case B: Action buttons (Add to Cart, WhatsApp, Filters, Auth Submit, Modal tabs)
      if (button) {
        // Skip if button already marked with no-burn
        if (button.dataset.noBurn === 'true') return;

        // Custom transition colors based on button type
        let color = '#facc15'; // Default golden ember
        if (button.classList.contains('ios27-pill-whatsapp') || button.textContent.includes('WhatsApp')) {
          color = '#22c55e'; // Green ember
        } else if (button.classList.contains('auth-v7-social-btn') && button.textContent.includes('Google')) {
          color = '#4285F4'; // Google blue ember
        } else if (button.id === 'v7-btn-signup' || button.id === 'v7-btn-signin') {
          color = '#f59e0b'; // Amber ember
        } else if (button.classList.contains('filter-pill')) {
          color = '#00f0ff'; // Cyan neon ember
        }

        // Trigger smooth tactile burn wave pulse
        window.triggerBurnTransition(null, {
          mode: 'pulse',
          transitionColor: color,
          duration: 520
        });
      }
    }, true);
  }

  // ── Initialize on DOM Ready ───────────────────────────────────────────────
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
