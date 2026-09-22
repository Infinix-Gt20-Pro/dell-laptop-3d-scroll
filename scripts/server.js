const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

process.on('uncaughtException', (err) => {
  if (err.code === 'EPIPE' || err.code === 'ECONNRESET' || err.code === 'ERR_STREAM_DESTROYED') {
    return;
  }
  console.error('Server handled uncaughtException:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('Server handled unhandledRejection:', reason);
});

const handler = (req, res) => {
  // CORS and Range headers for media elements
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges, Content-Length');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(reqPath);
  } catch (e) {
    res.statusCode = 400;
    return res.end('Bad Request');
  }

  const filePath = path.normalize(path.join(BASE_DIR, decodedPath));

  if (!filePath.startsWith(BASE_DIR)) {
    res.statusCode = 403;
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stat) => {
    if (err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('404 Not Found');
    }

    if (stat.isDirectory()) {
      res.statusCode = 403;
      return res.end('Directory listing forbidden');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Support Byte-Range requests for seamless video scrubbing
    const range = req.headers.range;
    if (ext === '.mp4' && range) {
      const parts = range.replace(/bytes=/, '').split('-');
      let start = parseInt(parts[0], 10);
      let end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;

      if (isNaN(start)) {
        start = stat.size - parseInt(parts[1], 10);
        end = stat.size - 1;
      }
      if (isNaN(end) || end >= stat.size) {
        end = stat.size - 1;
      }

      if (start >= stat.size || start > end) {
        res.writeHead(416, {
          'Content-Range': `bytes */${stat.size}`,
          'Accept-Ranges': 'bytes'
        });
        return res.end();
      }

      const chunkSize = (end - start) + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
        'Cache-Control': 'public, max-age=3600'
      });

      const fileStream = fs.createReadStream(filePath, { start, end });
      req.on('close', () => fileStream.destroy());
      fileStream.on('error', () => {});
      res.on('error', () => fileStream.destroy());
      fileStream.pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Length': stat.size,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
      'Cache-Control': ext === '.mp4' || ext === '.jpg' || ext === '.png' ? 'public, max-age=86400' : 'no-cache'
    });

    const fileStream = fs.createReadStream(filePath);
    req.on('close', () => fileStream.destroy());
    fileStream.on('error', () => {});
    res.on('error', () => fileStream.destroy());
    fileStream.pipe(res);
  });
};

const server = http.createServer(handler);

if (require.main === module) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n==================================================`);
    console.log(`  Dell XPS 15 — 3D Scroll Product Experience`);
    console.log(`  Local Server running at: http://localhost:${PORT}`);
    console.log(`  Network Access: http://127.0.0.1:${PORT}`);
    console.log(`==================================================\n`);
  });
}

module.exports = handler;
