# Universal Apple Liquid Glass UI Engine

> **Direct Port & Enhancement of [mkj0kjay/vue-web-liquid-glass](https://github.com/mkj0kjay/vue-web-liquid-glass)**  
> Built with pure web standards: Snell’s Law optical displacement calculations, dynamic SVG filters, and progressive 8-layer gradient backdrop blurs. No WebGL or Canvas runtime overhead required.

---

## 🚀 10-Second Quick Start (Default in Any HTML Website)

Add the two files to your project `<head>`:

```html
<!-- 1. Include Universal Liquid Glass Stylesheet -->
<link rel="stylesheet" href="css/liquid-glass.css">

<!-- 2. Include Universal Engine -->
<script src="js/liquid-glass.js"></script>
```

That’s it! Any element with `.liquid-glass`, `[data-liquid-glass]`, or the Web Component tags automatically acquires authentic optical refraction and progressive blur.

---

## 🧩 Drop-In Web Components (Works in ANY Framework)

### 1. Liquid Glass Container / Card
```html
<liquid-glass-container blur-size="45">
  <h2>Titanium Chassis</h2>
  <p>Physical refraction with 8-layer edge feathering.</p>
</liquid-glass-container>
```

### 2. Tactile Liquid Switch (Toggle)
```html
<liquid-glass-switch checked id="my-switch"></liquid-glass-switch>

<script>
  document.getElementById('my-switch').addEventListener('change', (e) => {
    console.log('Switch is now:', e.detail.checked);
  });
</script>
```

### 3. Apple Liquid Pill Buttons
```html
<button class="liquid-glass-btn liquid-glass-btn-primary">
  Explore 4K Display
</button>

<button class="liquid-glass-btn">
  Secondary Glass
</button>
```

---

## ⚡ Framework Integration (Vue 3, React, Svelte, Next.js)

### Vue 3 / Nuxt
```vue
<script setup>
import { onMounted } from 'vue';
import { LiquidGlass } from './js/liquid-glass.js';
import './css/liquid-glass.css';

onMounted(() => {
  LiquidGlass.init();
});
</script>

<template>
  <div class="liquid-glass p-6">
    <h1>Vue 3 Liquid Glass</h1>
  </div>
</template>
```

### React / Next.js (App Router or Pages Router)
```tsx
'use client';
import { useEffect } from 'react';
import './liquid-glass.css';

export default function GlassCard() {
  useEffect(() => {
    import('./liquid-glass.js').then(({ LiquidGlass }) => {
      LiquidGlass.init();
    });
  }, []);

  return (
    <div className="liquid-glass p-8 rounded-3xl">
      <h2 className="text-xl font-bold">React Liquid Glass</h2>
    </div>
  );
}
```

---

## 🛠️ Programmatic API Reference

```javascript
// 1. Initialize all liquid glass elements on the page
LiquidGlass.init({
  selector: '.liquid-glass, [data-liquid-glass]',
  gradientBlur: true,
  blurSize: 40
});

// 2. Apply optical refraction filter directly to a specific DOM element
const myCard = document.getElementById('card');
LiquidGlass.apply(myCard, {
  shape: 'squircle',       // 'circle' | 'squircle' | 'pill' | 'rectangle'
  bezelWidth: 20,          // Bezel thickness in pixels
  glassThickness: 100,     // Optical thickness for Snell's Law
  specularSaturation: 4    // Color saturation multiplier through glass
});

// 3. Inject progressive 8-layer gradient blur borders
LiquidGlass.injectGradientBlur(myCard, ['top', 'bottom', 'left', 'right'], 50);
```

---

## 🔬 How the Optical Physics Works

1. **Snell's Law Precalculation:**
   $$n_1 \sin(\theta_1) = n_2 \sin(\theta_2)$$
   Computes physical light ray deviation through curved glass bezels based on index of refraction ($\eta = 1 / 1.5$) and surface equations (Convex squircle, convex circle, lip).
2. **Displacement Map Generation:**
   Renders $dX$ and $dY$ coordinate vectors into Red and Green channels of a canvas `ImageData` texture, saved into high-speed Data URLs.
3. **SVG `<feDisplacementMap>`:**
   Binds the texture dynamically into `backdrop-filter: url(#filter-id)`, bending light behind the glass in real-time.
4. **8-Layer Progressive Gradient Blur:**
   Feathered backdrop-filter masks ($0.5\text{px} \to 1\text{px} \to 2\text{px} \to 4\text{px} \to 8\text{px} \to 16\text{px} \to 32\text{px} \to 64\text{px}$) eliminate harsh boundary cutoffs.
