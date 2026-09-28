const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
const lines = s.split('\n');
lines.forEach((l, i) => {
  if (l.includes('<section') || l.includes('id=')) {
    console.log(`${i + 1}: ${l.trim().substring(0, 100)}`);
  }
});
