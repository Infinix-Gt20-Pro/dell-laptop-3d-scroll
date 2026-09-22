# Dell XPS 15 — 3D Scroll Cinematic Experience

An Apple-style, scroll-driven interactive product showcase for the Dell XPS 15. Powered by high-performance video frame scrubbing, momentum-dampened scrolling with Lenis, and synchronized GSAP ScrollTrigger narrative stages.

---

## 🌟 Key Features

- **Frame-by-Frame Video Scrubbing**: Responsive 10.0s 1080p hardware-accelerated video canvas synchronized with scroll position.
- **Dampened Momentum Scrub**: Lenis smooth wheel scrolling on desktop with pure 120Hz native touch scrolling on mobile.
- **5 Synchronized Narrative Stages**:
  1. `01 // CRAFTSMANSHIP` — Precision in silence, CNC unibody aluminum chassis.
  2. `02 // INFINITYEDGE OLED` — Borderless 3.5K OLED luminescent depth.
  3. `03 // SILICON ARCHITECTURE` — Translucent compute, Intel® Core™ hybrid architecture.
  4. `04 // AEROSPACE PROFILE` — Micron-level refinement, double-anodized sidewalls & dual Thunderbolt™ 4 ports.
  5. `05 // NEURAL PULSE` — RTX™ 4070 Studio graphics and carbon-fiber deck illumination.
- **Interactive Hardware Gallery**: Multi-angle 4K inspection with filter tabs and full-screen lightbox.
- **Performance Bento Grid**: Workstation-grade thermal and hardware metrics.
- **3-Tier Model Configurator**: Interactive edition picker with checkout summary modal.
- **Ambient Spatial Sound**: Built-in Web Audio API synthesizer for an immersive sensory backdrop.
- **Full Accessibility**: Automatic `@media (prefers-reduced-motion: reduce)` support.

---

## 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Infinix-Gt20-Pro/dell-laptop-3d-scroll.git
   cd dell-laptop-3d-scroll
   ```

2. **Start the local server**:
   ```bash
   node server.js
   ```
   *or double-click `start.bat` on Windows.*

3. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Tech Stack

- **Vanilla HTML5 / CSS3 / JavaScript (ES6+)**
- **GSAP 3 & ScrollTrigger**
- **@studio-freight/lenis** (Momentum Smooth Scrolling)
- **Web Audio API** (Ambient Spatial Soundscape)
- **Node.js HTTP Server** (HTTP 206 Partial Content byte-range streaming for seamless video seeking)

---

## 📄 License

MIT License. Designed & Engineered by Kashan Ahmad.
