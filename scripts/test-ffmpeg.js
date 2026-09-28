const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ffmpegPath = path.resolve('c:/Users/Kashan Ahmad/Desktop/laptop/node_modules/ffmpeg-static/ffmpeg.exe');
console.log('Testing ffmpeg binary:', ffmpegPath);

try {
  const version = execSync(`"${ffmpegPath}" -version`, { encoding: 'utf8' });
  console.log('FFmpeg version header:', version.split('\n')[0]);
} catch (e) {
  console.error('Error running ffmpeg:', e);
}
