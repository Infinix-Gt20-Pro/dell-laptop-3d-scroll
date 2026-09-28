const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ffmpegPath = path.resolve('c:/Users/Kashan Ahmad/Desktop/laptop/node_modules/ffmpeg-static/ffmpeg.exe');
const unboxingDir = path.resolve(__dirname, '../assets/unboxing');
const videoDir = path.resolve(__dirname, '../assets/video');
const framesDesktopDir = path.resolve(__dirname, '../assets/frames/desktop');
const framesMobileDir = path.resolve(__dirname, '../assets/frames/mobile');

console.log('=== Step 1: Cleaning frames and old videos ===');
[framesDesktopDir, framesMobileDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.readdirSync(dir).forEach(f => {
    if (f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.png')) {
      fs.unlinkSync(path.join(dir, f));
    }
  });
});

console.log('=== Step 2: Keyframes Verification ===');
const images = [
  path.join(unboxingDir, '01_sealed_box.jpg'),
  path.join(unboxingDir, '02_box_opening.jpg'),
  path.join(unboxingDir, '03_laptop_levitate.jpg'),
  path.join(unboxingDir, '04_orbit_display.jpg'),
  path.join(unboxingDir, '05_exploded_xray.jpg'),
  path.join(unboxingDir, '06_certified_hero.jpg')
];

images.forEach((img, idx) => {
  if (!fs.existsSync(img)) console.error(`Missing: ${img}`);
  else console.log(`Keyframe ${idx + 1}: ${path.basename(img)}`);
});

const output10sDesktop = path.join(videoDir, 'dell_unboxing_10s.mp4');
const output10sMobile = path.join(videoDir, 'dell_unboxing_10s_mobile.mp4');

console.log('=== Step 3: Compiling 10.00-Second Master Video with Perfect Pacing ===');

// Pacing calculation for exact 10.00s:
// Image 0 (Sealed Vault): 0.00 - 1.80s
// Image 1 (Box Opening): 1.80 - 3.40s (fade at 1.80s, dur 0.4s)
// Image 2 (Levitation): 3.40 - 5.00s (fade at 3.40s, dur 0.4s)
// Image 3 (4K Orbit): 5.00 - 6.80s (fade at 5.00s, dur 0.4s)
// Image 4 (Silicon X-Ray): 6.80 - 8.20s (fade at 6.80s, dur 0.4s)
// Image 5 (Certified Hero): 8.20 - 10.00s (fade at 8.20s, dur 0.4s)

const filterGraph = `
[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x05070b,zoompan=z='min(zoom+0.0012,1.06)':d=55:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25,format=yuv420p[v0];
[1:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x05070b,zoompan=z='min(zoom+0.0010,1.05)':d=50:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25,format=yuv420p[v1];
[2:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x05070b,zoompan=z='if(lte(zoom,1.0),1.05,max(1.0,zoom-0.0012))':d=50:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25,format=yuv420p[v2];
[3:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x05070b,zoompan=z='min(zoom+0.0012,1.06)':d=55:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25,format=yuv420p[v3];
[4:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x05070b,zoompan=z='min(zoom+0.0012,1.06)':d=45:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25,format=yuv420p[v4];
[5:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x05070b,zoompan=z='min(zoom+0.0008,1.04)':d=60:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25,format=yuv420p[v5];
[v0][v1]xfade=transition=fade:duration=0.4:offset=1.8[xf1];
[xf1][v2]xfade=transition=fade:duration=0.4:offset=3.4[xf2];
[xf2][v3]xfade=transition=fade:duration=0.4:offset=5.0[xf3];
[xf3][v4]xfade=transition=fade:duration=0.4:offset=6.8[xf4];
[xf4][v5]xfade=transition=fade:duration=0.4:offset=8.2[v_out]
`.trim().replace(/\r?\n/g, '');

const ffmpegCmd = `"${ffmpegPath}" -y ` +
  images.map(img => `-loop 1 -t 3.0 -i "${img}"`).join(' ') +
  ` -filter_complex "${filterGraph}" -map "[v_out]" -t 10.0 -c:v libx264 -pix_fmt yuv420p -profile:v high -level 4.1 -preset fast -crf 18 -movflags +faststart "${output10sDesktop}"`;

console.log('Rendering 10s master video...');
execSync(ffmpegCmd, { stdio: 'inherit' });

console.log('=== Step 4: Fast extraction of 250 frames (25fps) ===');
// -compression_level 2 and -preset photo runs 3x faster with pristine quality
const extractDesktopCmd = `"${ffmpegPath}" -y -i "${output10sDesktop}" -vf "fps=25" -c:v libwebp -quality 82 -compression_level 2 "${path.join(framesDesktopDir, 'frame_%03d.webp')}"`;
execSync(extractDesktopCmd, { stdio: 'inherit' });

console.log('=== Step 5: Mobile video and frames ===');
const mobileCmd = `"${ffmpegPath}" -y -i "${output10sDesktop}" -vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2:color=0x05070b" -c:v libx264 -pix_fmt yuv420p -crf 22 -preset fast "${output10sMobile}"`;
execSync(mobileCmd, { stdio: 'inherit' });

const extractMobileCmd = `"${ffmpegPath}" -y -i "${output10sMobile}" -vf "fps=25" -c:v libwebp -quality 78 -compression_level 2 "${path.join(framesMobileDir, 'frame_%03d.webp')}"`;
execSync(extractMobileCmd, { stdio: 'inherit' });

console.log('Done! 250 desktop frames & 250 mobile frames ready.');
