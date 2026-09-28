const fs = require('fs');
const path = require('path');

const srcDir = path.resolve('c:/Users/Kashan Ahmad/Desktop/classic-computers');
const destDir = path.resolve('c:/Users/Kashan Ahmad/Desktop/laptop');

console.log('=== Step 1: Cleaning old video and frames in laptop repo ===');
const oldVideoDir = path.join(destDir, 'assets/video');
if (fs.existsSync(oldVideoDir)) {
  fs.readdirSync(oldVideoDir).forEach(f => {
    console.log('Removing old file in laptop/assets/video:', f);
    fs.unlinkSync(path.join(oldVideoDir, f));
  });
}

const oldFramesDesktop = path.join(destDir, 'assets/frames/desktop');
if (fs.existsSync(oldFramesDesktop)) {
  fs.readdirSync(oldFramesDesktop).forEach(f => {
    fs.unlinkSync(path.join(oldFramesDesktop, f));
  });
}

const oldFramesMobile = path.join(destDir, 'assets/frames/mobile');
if (fs.existsSync(oldFramesMobile)) {
  fs.readdirSync(oldFramesMobile).forEach(f => {
    fs.unlinkSync(path.join(oldFramesMobile, f));
  });
}

console.log('=== Step 2: Copying directory structure recursively ===');
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(childItemName => {
      // Don't copy .git, node_modules, or temp test frames
      if (childItemName === '.git' || childItemName === 'node_modules' || childItemName === '.playwright-mcp') return;
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy top files and folders
['index.html', 'products.html', 'css', 'js', 'assets', 'scripts'].forEach(item => {
  const s = path.join(srcDir, item);
  const d = path.join(destDir, item);
  if (fs.existsSync(s)) {
    console.log(`Syncing ${item}...`);
    copyRecursiveSync(s, d);
  }
});

// Copy vercel.json to classic-computers as well
const vercelJson = path.join(destDir, 'vercel.json');
if (fs.existsSync(vercelJson)) {
  fs.copyFileSync(vercelJson, path.join(srcDir, 'vercel.json'));
}

console.log('=== Sync completed successfully! ===');
