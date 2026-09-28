const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const { spawnSync } = require('child_process');
const path = require('path');

const videoPath = 'C:/Users/Kashan Ahmad/Desktop/product review.mp4';
const outDir = path.join(__dirname, '../assets/images');

const keyframes = [
  { time: '00:00:00.500', name: 'keyframe_stage1.jpg' },
  { time: '00:00:04.500', name: 'keyframe_stage2.jpg' },
  { time: '00:00:08.500', name: 'keyframe_stage3.jpg' },
  { time: '00:00:12.000', name: 'keyframe_stage4.jpg' },
  { time: '00:00:15.500', name: 'keyframe_stage5.jpg' }
];

keyframes.forEach(kf => {
  const dest = path.join(outDir, kf.name);
  spawnSync(ffmpeg.path, ['-y', '-ss', kf.time, '-i', videoPath, '-vframes', '1', '-q:v', '2', dest]);
  console.log(`Saved ${kf.name} at ${kf.time}`);
});
console.log('All keyframes extracted!');
