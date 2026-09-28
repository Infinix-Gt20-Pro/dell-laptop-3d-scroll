const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const videoPath = 'C:/Users/Kashan Ahmad/Desktop/product review.mp4';
const desktopDir = path.join(__dirname, '../assets/frames/desktop');
const mobileDir = path.join(__dirname, '../assets/frames/mobile');

if (!fs.existsSync(desktopDir)) fs.mkdirSync(desktopDir, { recursive: true });
if (!fs.existsSync(mobileDir)) fs.mkdirSync(mobileDir, { recursive: true });

// Clean old frames
console.log('Cleaning old frames...');
fs.readdirSync(desktopDir).forEach(f => {
  if (f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.png')) {
    fs.unlinkSync(path.join(desktopDir, f));
  }
});
fs.readdirSync(mobileDir).forEach(f => {
  if (f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.png')) {
    fs.unlinkSync(path.join(mobileDir, f));
  }
});

console.log('Extracting 15 fps WebP frames from 16s video (240 frames total)...');

// Desktop: 1280x720 WebP
const desktopArgs = [
  '-i', videoPath,
  '-vf', 'fps=15,scale=1280:720',
  '-vcodec', 'libwebp',
  '-lossless', '0',
  '-compression_level', '4',
  '-q:v', '85',
  path.join(desktopDir, 'frame_%03d.webp')
];

console.log('Running FFmpeg for desktop frames...');
const resDesk = spawnSync(ffmpeg.path, desktopArgs, { encoding: 'utf-8' });
if (resDesk.error) console.error(resDesk.error);

// Mobile: 720x405 or 854x480 WebP for ultra-fast mobile loading
const mobileArgs = [
  '-i', videoPath,
  '-vf', 'fps=15,scale=854:480',
  '-vcodec', 'libwebp',
  '-lossless', '0',
  '-compression_level', '4',
  '-q:v', '80',
  path.join(mobileDir, 'frame_%03d.webp')
];

console.log('Running FFmpeg for mobile frames...');
const resMob = spawnSync(ffmpeg.path, mobileArgs, { encoding: 'utf-8' });
if (resMob.error) console.error(resMob.error);

const deskCount = fs.readdirSync(desktopDir).filter(f => f.endsWith('.webp')).length;
const mobCount = fs.readdirSync(mobileDir).filter(f => f.endsWith('.webp')).length;

console.log(`Extraction complete! Desktop: ${deskCount} frames, Mobile: ${mobCount} frames.`);
