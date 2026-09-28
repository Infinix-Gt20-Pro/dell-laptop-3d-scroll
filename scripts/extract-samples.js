const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const previewDir = path.join(__dirname, '../temp_video_preview');
if (!fs.existsSync(previewDir)) fs.mkdirSync(previewDir, { recursive: true });

const videoPath = 'C:/Users/Kashan Ahmad/Desktop/product review.mp4';

// Extract 5 sample frames: 1s, 4s, 8s, 12s, 15s
const timestamps = ['00:00:01', '00:00:04', '00:00:08', '00:00:12', '00:00:15'];
timestamps.forEach((t, i) => {
  const outPath = path.join(previewDir, `sample_${i + 1}.jpg`);
  spawnSync(ffmpeg.path, ['-ss', t, '-i', videoPath, '-vframes', '1', '-q:v', '2', outPath]);
  console.log(`Extracted sample ${i + 1} at ${t} -> ${outPath}`);
});
