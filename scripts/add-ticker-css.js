const fs = require('fs');

const tickerCss = `
/* ===================================================
   60 FPS HARDWARE-ACCELERATED INFINITE TICKER
   =================================================== */
@keyframes tickerMoveLeft {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
}

.ticker-wrapper-60fps {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 1.5rem 0;
  mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
}

.ticker-track-60fps {
  display: flex;
  gap: 1.5rem;
  width: max-content;
  will-change: transform;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
  animation: tickerMoveLeft 36s linear infinite;
}

.ticker-wrapper-60fps:hover .ticker-track-60fps {
  animation-play-state: paused;
}

.vertical-product-card {
  width: 295px;
  min-width: 295px;
  max-width: 295px;
  display: flex;
  flex-direction: column;
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  transform: translateZ(0);
}

.vertical-product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 35px -10px rgba(6, 182, 212, 0.25), 0 0 0 1px rgba(6, 182, 212, 0.4);
}

.vertical-product-card:hover .card-img-zoom {
  transform: scale(1.06);
}
`;

function appendCss(file) {
  if (!fs.existsSync(file)) return;
  let css = fs.readFileSync(file, 'utf8');
  if (!css.includes('tickerMoveLeft')) {
    css += '\n' + tickerCss;
    fs.writeFileSync(file, css, 'utf8');
    console.log('Added ticker styles to', file);
  } else {
    console.log('Already present in', file);
  }
}

appendCss('css/style.css');
appendCss('style.css');
