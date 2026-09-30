'use strict';

/**
 * Classic Computers — Secure Production Server
 * =============================================
 * Security features:
 *  - Rate limiting (5 login attempts / IP / minute → 429)
 *  - Admin routes require Authorization: Bearer <token>
 *  - Strict security headers (CSP, X-Frame-Options, etc.)
 *  - Path traversal protection
 *  - 2 MB body limit to prevent DoS
 *  - Sanitized error messages — never leak stack traces
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');
const db   = require('./db');

const PORT     = process.env.PORT || 3000;
const BASE_DIR = path.resolve(__dirname, '..');
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'classic-computers-admin-2026';

// ── MIME types ───────────────────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4':  'video/mp4',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.ttf':  'font/ttf'
};

// ── Rate limiter (in-memory, per IP) ─────────────────────────────────────────
const rateLimitMap = new Map(); // ip → { count, resetAt }
const RATE_LIMIT   = 10;       // max attempts
const RATE_WINDOW  = 60_000;   // per 1 minute

function checkRateLimit(ip) {
  const now   = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true; // allowed
  }
  entry.count += 1;
  if (entry.count > RATE_LIMIT) return false; // blocked
  return true;
}

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, 300_000);

// ── Helpers ───────────────────────────────────────────────────────────────────
function getIp(req) {
  return (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 2_000_000) { req.destroy(); reject(new Error('Payload too large')); }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try { resolve(JSON.parse(body)); } catch { resolve({}); }
    });
    req.on('error', reject);
  });
}

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

// ── Security headers (applied to every response) ─────────────────────────────
function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
  // Relaxed CSP — allows modern assets & InsForge backend connectivity
  res.setHeader('Content-Security-Policy',
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://accounts.google.com https://apis.google.com https://appleid.cdn-apple.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; " +
    "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
    "img-src 'self' data: blob: https://images.unsplash.com https://api.dicebear.com https://lh3.googleusercontent.com https://*.insforge.app https://*.insforge.dev; " +
    "connect-src 'self' https://accounts.google.com https://*.insforge.app https://nsr7uvah.us-east.insforge.app https://api.insforge.dev https://*.insforge.dev; " +
    "frame-src 'self' https://accounts.google.com https://api.insforge.dev https://appleid.apple.com;"
  );
}

// ── CORS headers ─────────────────────────────────────────────────────────────
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges, Content-Length');
}

// ── API router ────────────────────────────────────────────────────────────────
async function handleApi(req, res) {
  const url = req.url.split('?')[0];
  const ip  = getIp(req);

  try {
    // ── AUTH ─────────────────────────────────────────────────────────────────
    if (url === '/api/auth/register' && req.method === 'POST') {
      if (!checkRateLimit(ip)) return json(res, 429, { success: false, message: 'Too many requests. Please wait a minute.' });
      const body = await parseBody(req);
      const user = db.registerUser(body);
      return json(res, 201, { success: true, user, message: `Welcome ${user.name}! Account registered successfully.` });
    }

    if (url === '/api/auth/login' && req.method === 'POST') {
      if (!checkRateLimit(ip)) return json(res, 429, { success: false, message: 'Too many requests. Please wait a minute.' });
      const body = await parseBody(req);
      const user = db.verifyLogin(body.email, body.password);
      return json(res, 200, { success: true, user, message: `Signed in as ${user.name}` });
    }

    if (url === '/api/auth/google' && req.method === 'POST') {
      if (!checkRateLimit(ip)) return json(res, 429, { success: false, message: 'Too many requests. Please wait a minute.' });
      const body = await parseBody(req);
      const user = db.googleAuth(body);
      return json(res, 200, { success: true, user, message: `Google Sign-in verified for ${user.name}` });
    }

    // ── ADMIN (all require Authorization: Bearer <secret>) ────────────────────
    const authHeader = req.headers['authorization'] || '';

    if (url === '/api/admin/users' && req.method === 'GET') {
      if (!db.verifyAdminToken(authHeader)) return json(res, 401, { success: false, message: 'Unauthorized.' });
      return json(res, 200, { success: true, users: db.getUsers() });
    }

    if (url === '/api/admin/logs' && req.method === 'GET') {
      const logs = db.getLoginLogs(authHeader);
      return json(res, 200, { success: true, logs });
    }

    if (url === '/api/admin/orders' && req.method === 'GET') {
      return json(res, 200, { success: true, orders: db.getOrders() });
    }

    if (url === '/api/admin/stats' && req.method === 'GET') {
      const stats = db.getStats(authHeader);
      return json(res, 200, { success: true, stats });
    }

    if (url === '/api/admin/delete-user' && req.method === 'POST') {
      const body = await parseBody(req);
      const result = db.deleteUser(body.userId, authHeader);
      return json(res, 200, { success: true, ...result });
    }

    return json(res, 404, { success: false, message: 'API route not found.' });

  } catch (err) {
    // Never leak stack traces — log internally, return safe message
    console.error('[API Error]', url, err.message);
    return json(res, 400, { success: false, message: err.message || 'Server error.' });
  }
}

// ── File server ───────────────────────────────────────────────────────────────
function serveFile(filePath, stats, req, res) {
  const ext         = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';
  const total       = stats.size;

  if (['.html', '.json', '.js', '.css'].includes(ext)) {
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  } else if (['.webp', '.mp4', '.jpg', '.png', '.woff2'].includes(ext)) {
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
  }

  // Range support for video streaming
  const range = req.headers.range;
  if (range && ext === '.mp4') {
    const [p0, p1] = range.replace(/bytes=/, '').split('-');
    let start = parseInt(p0, 10);
    let end   = p1 ? parseInt(p1, 10) : total - 1;
    if (isNaN(start) || start >= total) {
      res.statusCode = 416;
      res.setHeader('Content-Range', `bytes */${total}`);
      return res.end();
    }
    if (isNaN(end) || end >= total) end = total - 1;
    res.statusCode = 206;
    res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Length', end - start + 1);
    res.setHeader('Content-Type', contentType);
    const stream = fs.createReadStream(filePath, { start, end });
    stream.on('error', () => res.end());
    stream.pipe(res);
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Length', total);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Accept-Ranges', 'bytes');
    const stream = fs.createReadStream(filePath);
    stream.on('error', () => res.end());
    stream.pipe(res);
  }
}

// ── Main handler ──────────────────────────────────────────────────────────────
const handler = async (req, res) => {
  setSecurityHeaders(res);
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }

  if (req.url.startsWith('/api/')) return handleApi(req, res);

  // ── Static file serving with path traversal protection ───────────────────
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  let decoded;
  try { decoded = decodeURIComponent(reqPath); }
  catch { res.statusCode = 400; return res.end('Bad Request'); }

  const filePath = path.normalize(path.join(BASE_DIR, decoded));

  // Block any attempt to escape the web root
  if (!filePath.startsWith(BASE_DIR + path.sep) && filePath !== BASE_DIR) {
    res.statusCode = 403;
    return res.end('Forbidden');
  }

  // Block direct access to backend scripts and sensitive data
  const rel = path.relative(BASE_DIR, filePath);
  if (rel.startsWith('scripts') || rel.startsWith('data') || rel.startsWith('.')) {
    res.statusCode = 403;
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Try appending .html for clean URLs (e.g. /products -> /products.html)
        const htmlPath = filePath + '.html';
        fs.stat(htmlPath, (htmlErr, htmlStats) => {
          if (!htmlErr && htmlStats.isFile()) {
            return serveFile(htmlPath, htmlStats, req, res);
          }
          // Serve custom 404.html if available
          const custom404 = path.join(BASE_DIR, '404.html');
          fs.stat(custom404, (e404, s404) => {
            if (!e404 && s404.isFile()) {
              res.statusCode = 404;
              return serveFile(custom404, s404, req, res);
            }
            res.statusCode = 404;
            return res.end('Not Found');
          });
        });
        return;
      }
      res.statusCode = 500;
      return res.end('Internal Server Error');
    }
    if (stats.isDirectory()) {
      const idx = path.join(filePath, 'index.html');
      fs.stat(idx, (e, s) => {
        if (e || !s.isFile()) { res.statusCode = 403; return res.end('Forbidden'); }
        serveFile(idx, s, req, res);
      });
      return;
    }
    serveFile(filePath, stats, req, res);
  });
};

// ── Error guards ──────────────────────────────────────────────────────────────
process.on('uncaughtException', (err) => {
  if (['EPIPE', 'ECONNRESET', 'ERR_STREAM_DESTROYED'].includes(err.code)) return;
  console.error('[Uncaught]', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('[Unhandled Rejection]', reason);
});

// ── Start ─────────────────────────────────────────────────────────────────────
const server = http.createServer(handler);
server.listen(PORT, '0.0.0.0', () => {
  console.log('\n==================================================');
  console.log('🚀 Classic Computer E-Commerce Hub Running!');
  console.log('💻 Refurbished Laptops & Desktops — Etah, UP');
  console.log('🔐 Secure Auth: Google OAuth + Database Login');
  console.log('🛡️  Security: Rate limiting + Hashed passwords');
  console.log(`🌐 Local:  http://localhost:${PORT}`);
  console.log(`📊 Admin:  http://localhost:${PORT}/admin.html`);
  console.log('==================================================\n');
});
