const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const { spawnSync } = require('child_process');

console.log('FFmpeg path:', ffmpeg.path);
const videoPath = 'C:/Users/Kashan Ahmad/Desktop/product review.mp4';
const result = spawnSync(ffmpeg.path, ['-i', videoPath], { encoding: 'utf-8' });
console.log('STDERR output:\n', result.stderr);
