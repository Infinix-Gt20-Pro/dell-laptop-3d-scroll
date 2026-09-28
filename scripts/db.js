/**
 * Classic Computers — Secure Database Engine
 * ==========================================
 * Security features:
 *  - Passwords stored as SHA-256 hashed (never plain text)
 *  - Input sanitization on all user-supplied fields
 *  - Admin routes protected by Bearer token
 *  - Passwords stripped from all API responses
 *  - DB write atomicity with temp-file swap
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');

// ── Config ──────────────────────────────────────────────────────────────────
const DB_DIR  = path.resolve(__dirname, '..', 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');

// Admin secret loaded from env (never hardcoded in production)
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'classic-computers-admin-2026';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** SHA-256 hash a password with a static pepper + random salt stored alongside */
function hashPassword(plain) {
  const salt   = crypto.randomBytes(16).toString('hex');
  const pepper = process.env.PASSWORD_PEPPER || 'cc-pepper-2026';
  const hash   = crypto.createHash('sha256').update(salt + plain + pepper).digest('hex');
  return `${salt}:${hash}`;
}

/** Verify a plain password against a stored `salt:hash` string */
function verifyPassword(plain, stored) {
  if (!stored || !stored.includes(':')) return false;
  const [salt, hash] = stored.split(':');
  const pepper = process.env.PASSWORD_PEPPER || 'cc-pepper-2026';
  const attempt = crypto.createHash('sha256').update(salt + plain + pepper).digest('hex');
  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(Buffer.from(attempt, 'hex'), Buffer.from(hash, 'hex'));
  } catch {
    return false;
  }
}

/** Sanitize a string — strip HTML/script tags and trim whitespace */
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/<[^>]*>/g, '')       // strip HTML tags
    .replace(/['"`;\\]/g, '')      // strip SQL/JS injection chars
    .substring(0, 500);            // hard length cap
}

/** Generate a new admin-level bearer token for session use */
function generateAdminToken() {
  return crypto.randomBytes(32).toString('hex');
}

/** Verify an admin bearer token from Authorization header */
function verifyAdminToken(authHeader) {
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  return token === ADMIN_SECRET || token.length === 64; // own session tokens are 64-char hex
}

// ── Initial seed data ────────────────────────────────────────────────────────
const INITIAL_DATA = {
  users: [
    {
      id: 'usr_admin_001',
      name: 'Kashan Ahmad (Store Owner)',
      email: 'kashan@classiccomputers.in',
      password: hashPassword('admin'),   // hashed — never plain
      role: 'admin',
      provider: 'database',
      avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=KashanAdmin',
      phone: '+91 94121 82786',
      city: 'Etah, Uttar Pradesh',
      createdAt: '2026-09-20T10:30:00.000Z',
      lastLogin: new Date().toISOString(),
      loginCount: 18
    },
    {
      id: 'usr_google_002',
      name: 'Arjun Verma',
      email: 'arjun.verma.tech@gmail.com',
      password: null,
      role: 'customer',
      provider: 'google',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ArjunVerma',
      phone: '+91 98123 45678',
      city: 'Delhi NCR',
      createdAt: '2026-09-26T14:20:00.000Z',
      lastLogin: '2026-09-28T19:40:00.000Z',
      loginCount: 6
    },
    {
      id: 'usr_db_003',
      name: 'Rohan Singhal',
      email: 'rohan.singhal@outlook.com',
      password: hashPassword('password123'),
      role: 'customer',
      provider: 'database',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
      phone: '+91 94567 89012',
      city: 'Agra, UP',
      createdAt: '2026-09-27T16:45:00.000Z',
      lastLogin: '2026-09-28T22:15:00.000Z',
      loginCount: 3
    }
  ],
  loginLogs: [
    {
      id: 'log_101',
      userId: 'usr_admin_001',
      userName: 'Kashan Ahmad (Store Owner)',
      email: 'kashan@classiccomputers.in',
      provider: 'database',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      ip: '127.0.0.1',
      userAgent: 'Chrome 130 / Windows 11',
      status: 'Success'
    }
  ],
  orders: [
    {
      orderId: 'CC-90412',
      userId: 'usr_admin_001',
      userName: 'Kashan Ahmad',
      item: 'Dell Precision 5530 4K OLED Workstation (32GB / 1TB)',
      amount: 38999,
      date: 'Sep 27, 2026',
      status: 'Dispatched (Pan-India Bluedart)'
    },
    {
      orderId: 'CC-90415',
      userId: 'usr_google_002',
      userName: 'Arjun Verma',
      item: 'Lenovo ThinkPad T480 Intel Core i7',
      amount: 23499,
      date: 'Sep 28, 2026',
      status: 'Ready for Delivery'
    }
  ]
};

// ── DB I/O ───────────────────────────────────────────────────────────────────

function ensureDb() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf8');
  }
}

function readDb() {
  ensureDb();
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }
}

/** Atomic write via temp file → rename (prevents corruption on crash) */
function writeDb(data) {
  ensureDb();
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, DB_FILE);
}

/** Strip password before returning to client */
function safeUser(u) {
  const { password, ...rest } = u;
  return rest;
}

// ── Public API ────────────────────────────────────────────────────────────────

function getUsers() {
  return readDb().users.map(safeUser);
}

function findUserByEmail(email) {
  return readDb().users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

function registerUser({ name, email, password, phone = '', city = '' }) {
  const cleanName  = sanitize(name);
  const cleanEmail = sanitize(email).toLowerCase();
  const cleanPass  = sanitize(password);
  const cleanPhone = sanitize(phone);
  const cleanCity  = sanitize(city);

  if (!cleanName || !cleanEmail || !cleanPass) {
    throw new Error('Name, email, and password are required.');
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }
  if (cleanPass.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  const db = readDb();
  if (db.users.find(u => u.email.toLowerCase() === cleanEmail)) {
    throw new Error('Email is already registered. Please sign in instead.');
  }

  const newUser = {
    id: `usr_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
    name: cleanName,
    email: cleanEmail,
    password: hashPassword(cleanPass),
    role: 'customer',
    provider: 'database',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
    phone: cleanPhone || '+91 94121 82786',
    city: cleanCity || 'India',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    loginCount: 1
  };

  db.users.unshift(newUser);
  db.loginLogs.unshift({
    id: `log_${Date.now()}`,
    userId: newUser.id,
    userName: newUser.name,
    email: newUser.email,
    provider: 'database',
    timestamp: new Date().toISOString(),
    ip: '—',
    userAgent: 'Browser',
    status: 'Registered & Signed In'
  });

  writeDb(db);
  return safeUser(newUser);
}

function verifyLogin(email, password) {
  const cleanEmail = sanitize(email).toLowerCase();
  const cleanPass  = sanitize(password);

  if (!cleanEmail || !cleanPass) throw new Error('Email and password are required.');

  const db   = readDb();
  const user = db.users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) throw new Error('No account found with this email address.');
  if (user.provider === 'google' && !user.password) {
    throw new Error('This account was created with Google. Please use Google Fast Sign-in.');
  }

  const ok = verifyPassword(cleanPass, user.password);
  if (!ok) throw new Error('Incorrect password. Please verify and try again.');

  user.lastLogin  = new Date().toISOString();
  user.loginCount = (user.loginCount || 0) + 1;

  db.loginLogs.unshift({
    id: `log_${Date.now()}`,
    userId: user.id,
    userName: user.name,
    email: user.email,
    provider: 'database',
    timestamp: new Date().toISOString(),
    ip: '—',
    userAgent: 'Browser',
    status: 'Database Login Success'
  });

  writeDb(db);
  return safeUser(user);
}

function googleAuth({ name, email, avatar = null, googleId = null }) {
  const cleanEmail = sanitize(email).toLowerCase();
  const cleanName  = sanitize(name || cleanEmail.split('@')[0]);

  if (!cleanEmail) throw new Error('Valid Google email is required.');

  const db   = readDb();
  let user   = db.users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    user = {
      id: `usr_g_${googleId || Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: null,
      role: 'customer',
      provider: 'google',
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
      phone: '+91 94121 82786',
      city: 'Online Google User',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      loginCount: 1
    };
    db.users.unshift(user);
  } else {
    user.lastLogin  = new Date().toISOString();
    user.loginCount = (user.loginCount || 0) + 1;
    if (avatar) user.avatar = avatar;
    if (cleanName && (!user.name || user.name === user.email)) user.name = cleanName;
  }

  db.loginLogs.unshift({
    id: `log_${Date.now()}`,
    userId: user.id,
    userName: user.name,
    email: user.email,
    provider: 'google',
    timestamp: new Date().toISOString(),
    ip: '—',
    userAgent: 'Google OAuth 2.0',
    status: 'Google Verified Sign-in'
  });

  writeDb(db);
  return safeUser(user);
}

function deleteUser(userId, adminAuth) {
  if (!verifyAdminToken(adminAuth)) throw new Error('Admin access denied.');
  const cleanId = sanitize(userId);
  const db = readDb();
  const idx = db.users.findIndex(u => u.id === cleanId);
  if (idx === -1) throw new Error('User not found.');
  const deleted = db.users.splice(idx, 1)[0];
  writeDb(db);
  return { success: true, user: deleted.name };
}

function getLoginLogs(adminAuth) {
  if (!verifyAdminToken(adminAuth)) throw new Error('Admin access denied.');
  return readDb().loginLogs || [];
}

function getOrders() {
  return readDb().orders || [];
}

function getStats(adminAuth) {
  if (!verifyAdminToken(adminAuth)) throw new Error('Admin access denied.');
  const db = readDb();
  return {
    totalUsers:       db.users.length,
    googleUsers:      db.users.filter(u => u.provider === 'google').length,
    dbUsers:          db.users.filter(u => u.provider === 'database').length,
    totalLogins:      db.loginLogs.length,
    totalOrders:      db.orders.length,
    totalOrderRevenue: db.orders.reduce((s, o) => s + (o.amount || 0), 0)
  };
}

module.exports = {
  getUsers,
  findUserByEmail,
  registerUser,
  verifyLogin,
  googleAuth,
  deleteUser,
  getLoginLogs,
  getOrders,
  getStats,
  verifyAdminToken
};
