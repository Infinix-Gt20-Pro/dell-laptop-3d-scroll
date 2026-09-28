const { spawnSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');

const desktopDir = path.join(__dirname, '..', 'assets', 'frames', 'desktop');
const mobileDir = path.join(__dirname, '..', 'assets', 'frames', 'mobile');

fs.mkdirSync(desktopDir, { recursive: true });
fs.mkdirSync(mobileDir, { recursive: true });

console.log('Extracting Desktop frames (1920x1080 WebP, 150 frames)...');
const resDesktop = spawnSync(ffmpeg, [
  '-i', 'assets/video/dell-scroll.mp4',
  '-vf', 'fps=150/10.01,scale=1920:1080',
  '-c:v', 'libwebp',
  '-quality', '82',
  '-vframes', '150',
  '-y',
  path.join(desktopDir, 'frame_%03d.webp')
], { encoding: 'utf8', stdio: ['inherit', 'inherit', 'inherit'] });

console.log('Extracting Mobile frames (1280x720 WebP, 150 frames)...');
const resMobile = spawnSync(ffmpeg, [
  '-i', 'assets/video/dell-scroll-mobile.mp4',
  '-vf', 'fps=150/10.01,scale=1280:720',
  '-c:v', 'libwebp',
  '-quality', '78',
  '-vframes', '150',
  '-y',
  path.join(mobileDir, 'frame_%03d.webp')
], { encoding: 'utf8', stdio: ['inherit', 'inherit', 'inherit'] });

// Calculate total sizes
function getDirStats(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp'));
  let totalBytes = 0;
  files.forEach(f => {
    totalBytes += fs.statSync(path.join(dir, f)).size;
  });
  return { count: files.length, mb: (totalBytes / (1024 * 1024)).toFixed(2) };
}

const dStats = getDirStats(desktopDir);
const mStats = getDirStats(mobileDir);

console.log(`Desktop: ${dStats.count} frames, ${dStats.mb} MB`);
console.log(`Mobile:  ${mStats.count} frames, ${mStats.mb} MB`);
