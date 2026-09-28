const fs = require('fs');
const path = require('path');

const DB_DIR = path.resolve(__dirname, '..', 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');

const INITIAL_DATA = {
  users: [
    {
      id: "usr_admin_001",
      name: "Kashan Ahmad (Store Owner)",
      email: "kashan@classiccomputers.in",
      password: "admin",
      role: "admin",
      provider: "database",
      avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=KashanAdmin",
      phone: "+91 94121 82786",
      city: "Etah, Uttar Pradesh",
      createdAt: "2026-09-20T10:30:00.000Z",
      lastLogin: new Date().toISOString(),
      loginCount: 18
    },
    {
      id: "usr_google_002",
      name: "Arjun Verma",
      email: "arjun.verma.tech@gmail.com",
      password: null,
      role: "customer",
      provider: "google",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ArjunVerma",
      phone: "+91 98123 45678",
      city: "Delhi NCR",
      createdAt: "2026-09-26T14:20:00.000Z",
      lastLogin: "2026-09-28T19:40:00.000Z",
      loginCount: 6
    },
    {
      id: "usr_db_003",
      name: "Rohan Singhal",
      email: "rohan.singhal@outlook.com",
      password: "password123",
      role: "customer",
      provider: "database",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
      phone: "+91 94567 89012",
      city: "Agra, UP",
      createdAt: "2026-09-27T16:45:00.000Z",
      lastLogin: "2026-09-28T22:15:00.000Z",
      loginCount: 3
    }
  ],
  loginLogs: [
    {
      id: "log_101",
      userId: "usr_admin_001",
      userName: "Kashan Ahmad (Store Owner)",
      email: "kashan@classiccomputers.in",
      provider: "database",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      ip: "127.0.0.1",
      userAgent: "Chrome 130 / Windows 11",
      status: "Success"
    },
    {
      id: "log_102",
      userId: "usr_google_002",
      userName: "Arjun Verma",
      email: "arjun.verma.tech@gmail.com",
      provider: "google",
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      ip: "103.21.244.12",
      userAgent: "Safari / macOS Sonoma",
      status: "Google OAuth 2.0 Success"
    }
  ],
  orders: [
    {
      orderId: "CC-90412",
      userId: "usr_admin_001",
      userName: "Kashan Ahmad",
      item: "Dell Precision 5530 4K OLED Workstation (32GB / 1TB)",
      amount: 38999,
      date: "Sep 27, 2026",
      status: "Dispatched (Pan-India Bluedart)"
    },
    {
      orderId: "CC-90415",
      userId: "usr_google_002",
      userName: "Arjun Verma",
      item: "Lenovo ThinkPad T480 Intel Core i7",
      amount: 23499,
      date: "Sep 28, 2026",
      status: "Ready for Delivery"
    }
  ]
};

function ensureDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf8');
  }
}

function readDb() {
  ensureDb();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB, using initial data:', err);
    return INITIAL_DATA;
  }
}

function writeDb(data) {
  ensureDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// User operations
function getUsers() {
  const db = readDb();
  return db.users.map(({ password, ...safeUser }) => safeUser);
}

function findUserByEmail(email) {
  const db = readDb();
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

function registerUser({ name, email, password, phone = '', city = '' }) {
  const db = readDb();
  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error('Email is already registered. Please sign in instead.');
  }

  const newUser = {
    id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password,
    role: "customer",
    provider: "database",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
    phone: phone.trim() || "+91 94121 82786",
    city: city.trim() || "India",
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    loginCount: 1
  };

  db.users.unshift(newUser);

  // Add log
  db.loginLogs.unshift({
    id: `log_${Date.now()}`,
    userId: newUser.id,
    userName: newUser.name,
    email: newUser.email,
    provider: "database",
    timestamp: new Date().toISOString(),
    ip: "127.0.0.1",
    userAgent: "Desktop Browser",
    status: "Registered & Signed In"
  });

  writeDb(db);

  const { password: _, ...safeUser } = newUser;
  return safeUser;
}

function verifyLogin(email, password) {
  const db = readDb();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error('No account found with this email address.');
  }

  if (user.provider === 'google' && !user.password) {
    throw new Error('This account was created with Google. Please use Google Fast Sign-in.');
  }

  if (user.password !== password) {
    throw new Error('Incorrect password. Please verify and try again.');
  }

  user.lastLogin = new Date().toISOString();
  user.loginCount = (user.loginCount || 1) + 1;

  db.loginLogs.unshift({
    id: `log_${Date.now()}`,
    userId: user.id,
    userName: user.name,
    email: user.email,
    provider: "database",
    timestamp: new Date().toISOString(),
    ip: "127.0.0.1",
    userAgent: "Desktop Browser",
    status: "Database Login Success"
  });

  writeDb(db);

  const { password: _, ...safeUser } = user;
  return safeUser;
}

function googleAuth({ name, email, avatar = null, googleId = null }) {
  const db = readDb();
  let user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    // Auto-register Google user
    user = {
      id: `usr_g_${googleId || Date.now()}`,
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      password: null,
      role: "customer",
      provider: "google",
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      phone: "+91 94121 82786",
      city: "Online Google User",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      loginCount: 1
    };
    db.users.unshift(user);
  } else {
    user.lastLogin = new Date().toISOString();
    user.loginCount = (user.loginCount || 1) + 1;
    if (avatar) user.avatar = avatar;
    if (name && (!user.name || user.name === user.email)) user.name = name;
  }

  db.loginLogs.unshift({
    id: `log_${Date.now()}`,
    userId: user.id,
    userName: user.name,
    email: user.email,
    provider: "google",
    timestamp: new Date().toISOString(),
    ip: "127.0.0.1",
    userAgent: "Google OAuth 2.0 Web Client",
    status: "Google Verified Sign-in"
  });

  writeDb(db);

  const { password: _, ...safeUser } = user;
  return safeUser;
}

function deleteUser(userId) {
  const db = readDb();
  const index = db.users.findIndex(u => u.id === userId);
  if (index === -1) throw new Error('User not found.');
  const deleted = db.users.splice(index, 1)[0];
  writeDb(db);
  return { success: true, user: deleted.name };
}

function getLoginLogs() {
  const db = readDb();
  return db.loginLogs || [];
}

function getOrders() {
  const db = readDb();
  return db.orders || [];
}

function getStats() {
  const db = readDb();
  const totalUsers = db.users.length;
  const googleUsers = db.users.filter(u => u.provider === 'google').length;
  const dbUsers = db.users.filter(u => u.provider === 'database').length;
  const totalLogins = db.loginLogs.length;
  const totalOrders = db.orders.length;
  const totalOrderRevenue = db.orders.reduce((sum, o) => sum + (o.amount || 0), 0);

  return {
    totalUsers,
    googleUsers,
    dbUsers,
    totalLogins,
    totalOrders,
    totalOrderRevenue
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
  getStats
};
