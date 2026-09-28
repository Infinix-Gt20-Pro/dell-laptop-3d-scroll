const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./db');

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

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 2e6) { // 2MB limit
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

async function handleApi(req, res) {
  const url = req.url.split('?')[0];

  try {
    if (url === '/api/auth/register' && req.method === 'POST') {
      const body = await parseBody(req);
      if (!body.name || !body.email || !body.password) {
        return sendJson(res, 400, { success: false, message: 'Name, email, and password are required.' });
      }
      const user = db.registerUser(body);
      return sendJson(res, 201, { success: true, user, message: `Welcome ${user.name}! Account registered successfully.` });
    }

    if (url === '/api/auth/login' && req.method === 'POST') {
      const body = await parseBody(req);
      if (!body.email || !body.password) {
        return sendJson(res, 400, { success: false, message: 'Email and password are required.' });
      }
      const user = db.verifyLogin(body.email, body.password);
      return sendJson(res, 200, { success: true, user, message: `Signed in as ${user.name}` });
    }

    if (url === '/api/auth/google' && req.method === 'POST') {
      const body = await parseBody(req);
      if (!body.email) {
        return sendJson(res, 400, { success: false, message: 'Valid Google email is required.' });
      }
      const user = db.googleAuth(body);
      return sendJson(res, 200, { success: true, user, message: `Google Sign-in verified for ${user.name}` });
    }

    if (url === '/api/admin/users' && req.method === 'GET') {
      const users = db.getUsers();
      return sendJson(res, 200, { success: true, users });
    }

    if (url === '/api/admin/logs' && req.method === 'GET') {
      const logs = db.getLoginLogs();
      return sendJson(res, 200, { success: true, logs });
    }

    if (url === '/api/admin/orders' && req.method === 'GET') {
      const orders = db.getOrders();
      return sendJson(res, 200, { success: true, orders });
    }

    if (url === '/api/admin/stats' && req.method === 'GET') {
      const stats = db.getStats();
      return sendJson(res, 200, { success: true, stats });
    }

    if (url === '/api/admin/delete-user' && req.method === 'POST') {
      const body = await parseBody(req);
      if (!body.userId) {
        return sendJson(res, 400, { success: false, message: 'User ID is required.' });
      }
      const result = db.deleteUser(body.userId);
      return sendJson(res, 200, { success: true, ...result });
    }

    return sendJson(res, 404, { success: false, message: 'API route not found' });
  } catch (err) {
    console.error('API Error:', err);
    return sendJson(res, 400, { success: false, message: err.message || 'Server error' });
  }
}

const handler = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges, Content-Length');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  // Handle REST APIs for Auth & Database backend
  if (req.url.startsWith('/api/')) {
    return handleApi(req, res);
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

  fs.stat(filePath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        return res.end('File Not Found');
      }
      res.statusCode = 500;
      return res.end('Internal Server Error');
    }

    if (stats.isDirectory()) {
      const indexPath = path.join(filePath, 'index.html');
      fs.stat(indexPath, (indexErr, indexStats) => {
        if (indexErr || !indexStats.isFile()) {
          res.statusCode = 403;
          return res.end('Directory listing forbidden');
        }
        serveFile(indexPath, indexStats, req, res);
      });
      return;
    }

    serveFile(filePath, stats, req, res);
  });
};

function serveFile(filePath, stats, req, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const total = stats.size;

  if (ext === '.html' || ext === '.json' || ext === '.js' || ext === '.css') {
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  } else if (ext === '.webp' || ext === '.mp4' || ext === '.jpg' || ext === '.png' || ext === '.woff2') {
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
  }

  const range = req.headers.range;

  if (range && ext === '.mp4') {
    const parts = range.replace(/bytes=/, '').split('-');
    const partialStart = parts[0];
    const partialEnd = parts[1];

    let start = parseInt(partialStart, 10);
    let end = partialEnd ? parseInt(partialEnd, 10) : total - 1;

    if (isNaN(start) || start >= total) {
      res.statusCode = 416;
      res.setHeader('Content-Range', `bytes */${total}`);
      return res.end();
    }

    if (isNaN(end) || end >= total) {
      end = total - 1;
    }

    const chunksize = (end - start) + 1;
    res.statusCode = 206;
    res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Length', chunksize);
    res.setHeader('Content-Type', contentType);

    const stream = fs.createReadStream(filePath, { start, end });
    stream.on('error', () => { res.end(); });
    stream.pipe(res);
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Length', total);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Accept-Ranges', 'bytes');

    const stream = fs.createReadStream(filePath);
    stream.on('error', () => { res.end(); });
    stream.pipe(res);
  }
}

const server = http.createServer(handler);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Classic Computer E-Commerce Hub Running!`);
  console.log(`💻 Refurbished Laptops & Computers Store`);
  console.log(`🔐 Google & Database Auth Engine Active!`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`📊 Admin Portal: http://localhost:${PORT}/admin.html`);
  console.log(`==================================================\n`);
});
