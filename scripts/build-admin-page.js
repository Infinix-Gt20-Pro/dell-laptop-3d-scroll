const fs = require('fs');
const path = require('path');
const { STORE_CONFIG, getSharedNav, getSharedFooter } = require('./store-shared-templates');

function buildAdminPage() {
  const html = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin & Database Backend // Classic Computers</title>
  <meta name="description" content="Backend administration and database management portal for Classic Computers. Monitor Google OAuth logins, registered users, and orders.">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#f0f9ff',
              100: '#e0f2fe',
              500: '#0ea5e9',
              600: '#0284c7',
              700: '#0369a1',
              900: '#0c4a6e',
            }
          },
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'Fira Code', 'monospace']
          }
        }
      }
    }
  </script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!-- Core & iOS 27 Lucid Glass CSS -->
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/ios27-glass.css">

  <style>
    /* Admin Pulse Glow */
    .admin-glow-cyan {
      box-shadow: 0 0 40px -10px rgba(6, 182, 212, 0.35);
    }
    .badge-google {
      background: linear-gradient(135deg, rgba(66, 133, 244, 0.12), rgba(52, 168, 83, 0.12));
      border: 1px solid rgba(66, 133, 244, 0.3);
      color: #1a73e8;
    }
    .badge-database {
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(99, 102, 241, 0.12));
      border: 1px solid rgba(14, 165, 233, 0.3);
      color: #0369a1;
    }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen selection:bg-cyan-500 selection:text-white relative overflow-x-hidden pt-36 pb-20">

  ${getSharedNav('admin')}

  <!-- Main Content Container -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    
    <!-- Header Title & Real-time Database Status -->
    <div class="mb-10">
      <div class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold mb-3 shadow-inner">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>BACKEND CONTROL CENTER // REST API & PERSISTENT DATABASE</span>
          </div>
          <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Database & Auth Backend
          </h1>
          <p class="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Live administrative management of Google OAuth logins, registered customer accounts, authentication logs, and orders.
          </p>
        </div>

        <!-- DB Connection Capsule -->
        <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-xl backdrop-blur-md">
          <div class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
          <div>
            <div class="text-[11px] font-mono font-bold text-slate-200">Database Engine: JSON / Node.js</div>
            <div class="text-[10px] text-slate-400 font-mono">Storage: <code>data/database.json</code></div>
          </div>
          <button onclick="window.fetchBackendData()" class="ml-2 p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-cyan-300 transition-all text-xs font-mono font-bold" title="Refresh Live Data">
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- 4 Lucid Glass Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
      
      <!-- Total Users -->
      <div class="ios27-glass-card !bg-slate-800/60 !border-slate-700/80 p-6 rounded-3xl relative overflow-hidden group">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Total Accounts</span>
          <span class="w-9 h-9 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg">👥</span>
        </div>
        <div class="text-4xl font-black text-white font-mono" id="stat-total-users">--</div>
        <p class="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
          <span class="text-emerald-400">●</span> <span>Registered in Database</span>
        </p>
      </div>

      <!-- Google OAuth Users -->
      <div class="ios27-glass-card !bg-slate-800/60 !border-slate-700/80 p-6 rounded-3xl relative overflow-hidden group">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Google OAuth Users</span>
          <span class="w-9 h-9 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg">G</span>
        </div>
        <div class="text-4xl font-black text-white font-mono" id="stat-google-users">--</div>
        <p class="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
          <span class="text-blue-400">●</span> <span>1-Tap & OAuth Verified</span>
        </p>
      </div>

      <!-- Database Email Users -->
      <div class="ios27-glass-card !bg-slate-800/60 !border-slate-700/80 p-6 rounded-3xl relative overflow-hidden group">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Database Logins</span>
          <span class="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">🔑</span>
        </div>
        <div class="text-4xl font-black text-white font-mono" id="stat-db-users">--</div>
        <p class="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
          <span class="text-emerald-400">●</span> <span>Email & Password</span>
        </p>
      </div>

      <!-- Total Auth Sessions -->
      <div class="ios27-glass-card !bg-slate-800/60 !border-slate-700/80 p-6 rounded-3xl relative overflow-hidden group">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Auth Sessions</span>
          <span class="w-9 h-9 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg">⚡</span>
        </div>
        <div class="text-4xl font-black text-white font-mono" id="stat-total-logins">--</div>
        <p class="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
          <span class="text-purple-400">●</span> <span>Live Audit Logs Recorded</span>
        </p>
      </div>

    </div>

    <!-- Section 1: Registered Database Users Table -->
    <div class="mb-14">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>Registered Accounts & User Profiles</span>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-cyan-900/60 border border-cyan-700/60 text-cyan-300 font-mono" id="users-count-badge">0 Users</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1 font-mono">Live synchronization with <code>/api/admin/users</code></p>
        </div>

        <!-- Filter & Action Tools -->
        <div class="flex flex-wrap items-center gap-2.5">
          <input type="text" id="user-search-input" oninput="window.filterUsersTable()" 
                 placeholder="Search by name, email, phone..." 
                 class="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-56 sm:w-64 font-mono">
          
          <button onclick="window.openLucidAuthModal('register')" 
                  class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1.5">
            <span>+ Add New User</span>
          </button>
          
          <button onclick="window.exportUsersJson()" 
                  class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-mono font-semibold transition-all">
            📥 Export JSON
          </button>
        </div>
      </div>

      <!-- Users Table Card -->
      <div class="lucid-table-container !bg-slate-800/80 !border-slate-700/80 overflow-x-auto shadow-2xl">
        <table class="w-full text-left text-xs font-sans">
          <thead class="bg-slate-900/90 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-700/80">
            <tr>
              <th class="px-5 py-3.5">User</th>
              <th class="px-5 py-3.5">Contact Details</th>
              <th class="px-5 py-3.5">Provider</th>
              <th class="px-5 py-3.5">Location</th>
              <th class="px-5 py-3.5">Created At</th>
              <th class="px-5 py-3.5">Logins</th>
              <th class="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody id="users-table-body" class="divide-y divide-slate-700/60 text-slate-300">
            <tr>
              <td colspan="7" class="px-5 py-8 text-center text-slate-400 font-mono">
                <span class="inline-block animate-spin mr-2">⏳</span> Loading database users...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section 2: Real-Time Authentication Audit Stream -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Login Activity Log (2 Cols) -->
      <div class="lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Live Authentication Audit Log</span>
            </h3>
            <p class="text-xs text-slate-400 font-mono">Real-time session security events</p>
          </div>
          <span class="text-xs font-mono text-cyan-400">Endpoint: <code>/api/admin/logs</code></span>
        </div>

        <div class="lucid-table-container !bg-slate-800/80 !border-slate-700/80 p-4 shadow-xl">
          <div class="space-y-3 max-h-[380px] overflow-y-auto pr-1" id="login-logs-container">
            <div class="p-4 text-center text-slate-400 font-mono text-xs">
              Loading activity stream...
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Test Bench / Simulator (1 Col) -->
      <div>
        <div class="mb-4">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <span>Interactive Auth Test Bench</span>
          </h3>
          <p class="text-xs text-slate-400 font-mono">Test authentication instantly</p>
        </div>

        <div class="ios27-glass-card !bg-slate-800/80 !border-slate-700/80 p-5 rounded-3xl space-y-4">
          <p class="text-xs text-slate-300 leading-relaxed">
            Trigger a real-time authentication event to verify how the database updates immediately on your backend.
          </p>

          <button onclick="window.testSimulateGoogleLogin()" 
                  class="w-full py-2.5 px-4 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-sans font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all">
            <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Simulate Google OAuth Login</span>
          </button>

          <button onclick="window.openLucidAuthModal('register')" 
                  class="w-full py-2.5 px-4 rounded-xl bg-cyan-700/40 hover:bg-cyan-700/60 border border-cyan-500/40 text-cyan-200 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all">
            <span>+ Open Database Registration Form</span>
          </button>

          <div class="pt-3 border-t border-slate-700/80 text-[11px] font-mono text-slate-400 space-y-1">
            <div>📁 File: <code>data/database.json</code></div>
            <div>🔐 Passwords: Hashed / Protected</div>
            <div>⚡ Latency: &lt; 2ms (In-Memory / Local)</div>
          </div>
        </div>
      </div>

    </div>

  </main>

  ${getSharedFooter()}

  <!-- Client-side Admin Dashboard Engine -->
  <script>
    let allUsers = [];

    async function fetchBackendData() {
      let apiLoaded = false;
      try {
        const statsRes = await fetch('/api/admin/stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.success) {
            document.getElementById('stat-total-users').textContent = statsData.stats.totalUsers;
            document.getElementById('stat-google-users').textContent = statsData.stats.googleUsers;
            document.getElementById('stat-db-users').textContent = statsData.stats.dbUsers;
            document.getElementById('stat-total-logins').textContent = statsData.stats.totalLogins;
          }
        }

        const usersRes = await fetch('/api/admin/users');
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          if (usersData.success) {
            allUsers = usersData.users;
            renderUsersTable(allUsers);
            apiLoaded = true;
          }
        }

        const logsRes = await fetch('/api/admin/logs');
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          if (logsData.success) {
            renderLoginLogs(logsData.logs);
          }
        }
      } catch (err) {
        console.warn('API route unavailable, using static database.json fallback');
      }

      if (!apiLoaded) {
        try {
          const staticRes = await fetch('data/database.json');
          if (staticRes.ok) {
            const dbData = await staticRes.json();
            allUsers = (dbData.users || []).map(({ password, ...u }) => u);

            try {
              const localReg = JSON.parse(localStorage.getItem('cc_registered_users') || '[]');
              localReg.forEach(lu => {
                if (!allUsers.some(u => u.email === lu.email)) {
                  const { password: _, ...safe } = lu;
                  allUsers.unshift(safe);
                }
              });
            } catch (e) {}

            const totalUsers = allUsers.length;
            const googleUsers = allUsers.filter(u => u.provider === 'google').length;
            const dbUsers = allUsers.filter(u => u.provider === 'database').length;
            const totalLogins = (dbData.loginLogs || []).length;

            document.getElementById('stat-total-users').textContent = totalUsers;
            document.getElementById('stat-google-users').textContent = googleUsers;
            document.getElementById('stat-db-users').textContent = dbUsers;
            document.getElementById('stat-total-logins').textContent = totalLogins;

            renderUsersTable(allUsers);
            renderLoginLogs(dbData.loginLogs || []);
          }
        } catch (staticErr) {
          console.error('Static database load error:', staticErr);
        }
      }
    }

    function renderUsersTable(users) {
      const tbody = document.getElementById('users-table-body');
      const badge = document.getElementById('users-count-badge');
      if (badge) badge.textContent = \`\${users.length} Users\`;

      if (!users || users.length === 0) {
        tbody.innerHTML = \`
          <tr>
            <td colspan="7" class="px-5 py-8 text-center text-slate-400 font-mono">
              No matching accounts found in database.
            </td>
          </tr>
        \`;
        return;
      }

      tbody.innerHTML = users.map(u => {
        const isGoogle = u.provider === 'google';
        const rolePill = u.role === 'admin' 
          ? '<span class="text-[9px] px-1.5 py-0.5 rounded bg-blue-600 text-white font-mono font-bold">ADMIN</span>' 
          : '<span class="text-[9px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">CUSTOMER</span>';
        
        const providerPill = isGoogle 
          ? '<span class="px-2.5 py-1 rounded-full badge-google text-[10px] font-mono font-bold flex items-center gap-1 w-max"><span>G</span> Google</span>'
          : '<span class="px-2.5 py-1 rounded-full badge-database text-[10px] font-mono font-bold flex items-center gap-1 w-max"><span>🔑</span> Database</span>';

        const joinDate = new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        return \`
          <tr class="lucid-table-row hover:bg-slate-800/50 transition-colors">
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl overflow-hidden bg-slate-700 border border-slate-600 shrink-0">
                  <img src="\${u.avatar || 'https://api.dicebear.com/7.x/shapes/svg?seed=' + u.name}" class="w-full h-full object-cover">
                </div>
                <div>
                  <div class="font-bold text-white flex items-center gap-1.5">
                    <span>\${u.name}</span>
                    \${rolePill}
                  </div>
                  <div class="text-[10px] text-slate-400 font-mono">ID: \${u.id}</div>
                </div>
              </div>
            </td>
            <td class="px-5 py-4">
              <div class="text-slate-200 font-mono">\${u.email}</div>
              <div class="text-[11px] text-slate-400 font-mono">\${u.phone || 'N/A'}</div>
            </td>
            <td class="px-5 py-4">\${providerPill}</td>
            <td class="px-5 py-4 text-slate-300">\${u.city || 'India'}</td>
            <td class="px-5 py-4 text-slate-400 font-mono text-[11px]">\${joinDate}</td>
            <td class="px-5 py-4">
              <span class="px-2 py-0.5 rounded-full bg-slate-700 text-cyan-300 font-mono font-bold text-[10px]">
                \${u.loginCount || 1} logins
              </span>
            </td>
            <td class="px-5 py-4 text-right">
              \${u.role !== 'admin' ? \`
                <button onclick="window.deleteUserFromDb('\${u.id}', '\${u.name}')" 
                        class="p-1.5 rounded-lg bg-red-900/30 hover:bg-red-900/60 border border-red-500/30 text-red-400 transition-all font-mono text-[10px]" title="Delete Account">
                  🗑️ Delete
                </button>
              \` : '<span class="text-[10px] text-slate-500 font-mono">Protected</span>'}
            </td>
          </tr>
        \`;
      }).join('');
    }

    function renderLoginLogs(logs) {
      const container = document.getElementById('login-logs-container');
      if (!logs || logs.length === 0) {
        container.innerHTML = '<div class="p-4 text-center text-slate-500 font-mono text-xs">No activity logs recorded yet.</div>';
        return;
      }

      container.innerHTML = logs.slice(0, 15).map(l => {
        const time = new Date(l.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const date = new Date(l.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const isGoogle = l.provider === 'google';

        return \`
          <div class="p-3 rounded-2xl bg-slate-900/70 border border-slate-700/60 flex items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-2.5">
              <span class="w-7 h-7 rounded-lg \${isGoogle ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'} flex items-center justify-center font-bold text-xs shrink-0">
                \${isGoogle ? 'G' : '🔑'}
              </span>
              <div>
                <div class="font-bold text-white">\${l.userName}</div>
                <div class="text-[10px] text-slate-400 font-mono">\${l.email} • \${l.status}</div>
              </div>
            </div>
            <div class="text-right shrink-0">
              <div class="font-mono text-cyan-300 text-[11px]">\${time}</div>
              <div class="text-[9px] text-slate-500 font-mono">\${date} • \${l.ip || '127.0.0.1'}</div>
            </div>
          </div>
        \`;
      }).join('');
    }

    function filterUsersTable() {
      const q = document.getElementById('user-search-input').value.toLowerCase().trim();
      if (!q) {
        renderUsersTable(allUsers);
        return;
      }
      const filtered = allUsers.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q) || 
        (u.phone && u.phone.includes(q)) || 
        (u.city && u.city.toLowerCase().includes(q))
      );
      renderUsersTable(filtered);
    }

    async function deleteUserFromDb(userId, userName) {
      if (!confirm(\`Are you sure you want to delete user "\${userName}" from the database?\`)) return;

      try {
        const res = await fetch('/api/admin/delete-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        const data = await res.json();
        if (data.success) {
          fetchBackendData();
        } else {
          alert(data.message || 'Error deleting user');
        }
      } catch (err) {
        alert('Server communication error');
      }
    }

    function exportUsersJson() {
      const blob = new Blob([JSON.stringify(allUsers, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`classic_computers_users_\${Date.now()}.json\`;
      a.click();
      URL.revokeObjectURL(url);
    }

    async function testSimulateGoogleLogin() {
      const names = ['Ravi Shankar', 'Neha Gupta', 'Amitabh Roy', 'Deepak Chawla', 'Sunita Rao'];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomEmail = randomName.toLowerCase().replace(' ', '.') + '@gmail.com';

      await window.submitGoogleAuth({
        name: randomName,
        email: randomEmail,
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(randomName),
        googleId: 'g_' + Date.now()
      });

      fetchBackendData();
    }

    document.addEventListener('DOMContentLoaded', fetchBackendData);
  </script>
</body>
</html>`;

  fs.writeFileSync(path.resolve('admin.html'), html, 'utf8');
  console.log('Successfully generated admin.html (Admin & Database Backend Portal)');
}

buildAdminPage();
