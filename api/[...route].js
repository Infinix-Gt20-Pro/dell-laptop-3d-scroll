const fs = require('fs');
const path = require('path');

// Persistent or In-Memory DB for Vercel Serverless Functions
const LOCAL_DB_PATH = path.join(process.cwd(), 'data', 'database.json');
const TMP_DB_PATH = '/tmp/database.json';

let memDb = null;

function getDb() {
  if (memDb) return memDb;

  // Try reading from /tmp/database.json first
  if (fs.existsSync(TMP_DB_PATH)) {
    try {
      memDb = JSON.parse(fs.readFileSync(TMP_DB_PATH, 'utf8'));
      return memDb;
    } catch (e) {}
  }

  // Fallback to project bundled database.json
  if (fs.existsSync(LOCAL_DB_PATH)) {
    try {
      memDb = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
      return memDb;
    } catch (e) {}
  }

  // Fallback default structure
  memDb = {
    users: [
      {
        id: "usr_admin_001",
        name: "Kashan Ahmad (Store Owner)",
        email: "kashan@classiccomputers.in",
        role: "admin",
        provider: "database",
        avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=KashanAdmin",
        phone: "+91 94121 82786",
        city: "Etah, Uttar Pradesh",
        createdAt: "2026-09-20T10:30:00.000Z",
        lastLogin: new Date().toISOString(),
        loginCount: 19
      }
    ],
    loginLogs: [],
    orders: []
  };
  return memDb;
}

function saveDb(data) {
  memDb = data;
  try {
    fs.writeFileSync(TMP_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    try {
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {}
  }
}

function parseJsonBody(req) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') {
      return resolve(req.body);
    }
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (e) {
        resolve({});
      }
    });
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  const url = req.url.split('?')[0];
  const db = getDb();

  try {
    // 1. Google Auth
    if (url.includes('/api/auth/google') && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const email = (body.email || '').toLowerCase().trim();
      if (!email) {
        res.statusCode = 400;
        return res.json({ success: false, message: 'Valid Google email required' });
      }

      let user = db.users.find(u => u.email === email);
      if (!user) {
        user = {
          id: `usr_g_${Date.now()}`,
          name: body.name || email.split('@')[0],
          email,
          role: 'customer',
          provider: 'google',
          avatar: body.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
          phone: '+91 94121 82786',
          city: 'Online Google User',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          loginCount: 1
        };
        db.users.unshift(user);
      } else {
        user.lastLogin = new Date().toISOString();
        user.loginCount = (user.loginCount || 1) + 1;
      }

      db.loginLogs.unshift({
        id: `log_${Date.now()}`,
        userId: user.id,
        userName: user.name,
        email: user.email,
        provider: 'google',
        timestamp: new Date().toISOString(),
        ip: req.headers['x-forwarded-for'] || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Web Client',
        status: 'Google Verified Sign-in'
      });

      saveDb(db);
      return res.status(200).json({ success: true, user, message: `Signed in as ${user.name}` });
    }

    // 2. Database Login
    if (url.includes('/api/auth/login') && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const email = (body.email || '').toLowerCase().trim();
      const user = db.users.find(u => u.email === email);
      if (!user) {
        return res.status(400).json({ success: false, message: 'No account found with this email' });
      }

      user.lastLogin = new Date().toISOString();
      user.loginCount = (user.loginCount || 1) + 1;

      db.loginLogs.unshift({
        id: `log_${Date.now()}`,
        userId: user.id,
        userName: user.name,
        email: user.email,
        provider: 'database',
        timestamp: new Date().toISOString(),
        ip: req.headers['x-forwarded-for'] || '127.0.0.1',
        status: 'Database Login Success'
      });

      saveDb(db);
      const { password, ...safeUser } = user;
      return res.status(200).json({ success: true, user: safeUser, message: `Welcome back, ${user.name}!` });
    }

    // 3. Register
    if (url.includes('/api/auth/register') && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const email = (body.email || '').toLowerCase().trim();
      if (db.users.some(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      const newUser = {
        id: `usr_${Date.now()}`,
        name: (body.name || 'User').trim(),
        email,
        role: 'customer',
        provider: 'database',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(body.name || 'User')}`,
        phone: body.phone || '+91 94121 82786',
        city: body.city || 'India',
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
        ip: req.headers['x-forwarded-for'] || '127.0.0.1',
        status: 'Registered & Signed In'
      });

      saveDb(db);
      return res.status(201).json({ success: true, user: newUser, message: `Account created for ${newUser.name}` });
    }

    // 4. Admin Users
    if (url.includes('/api/admin/users')) {
      const safeUsers = db.users.map(({ password, ...u }) => u);
      return res.status(200).json({ success: true, users: safeUsers });
    }

    // 5. Admin Logs
    if (url.includes('/api/admin/logs')) {
      return res.status(200).json({ success: true, logs: db.loginLogs || [] });
    }

    // 6. Admin Orders
    if (url.includes('/api/admin/orders')) {
      return res.status(200).json({ success: true, orders: db.orders || [] });
    }

    // 7. Admin Stats
    if (url.includes('/api/admin/stats')) {
      const totalUsers = db.users.length;
      const googleUsers = db.users.filter(u => u.provider === 'google').length;
      const dbUsers = db.users.filter(u => u.provider === 'database').length;
      const totalLogins = (db.loginLogs || []).length;
      const totalOrders = (db.orders || []).length;

      return res.status(200).json({
        success: true,
        stats: { totalUsers, googleUsers, dbUsers, totalLogins, totalOrders }
      });
    }

    // 8. Delete User
    if (url.includes('/api/admin/delete-user') && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const idx = db.users.findIndex(u => u.id === body.userId);
      if (idx !== -1) {
        db.users.splice(idx, 1);
        saveDb(db);
        return res.status(200).json({ success: true, message: 'User deleted' });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(404).json({ success: false, message: 'API Route Not Found' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
