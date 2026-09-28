const fs = require('fs');
const content = fs.readFileSync('C:/Users/Kashan Ahmad/AppData/Local/npm-cache/_npx/d7c0f92b98ce1c29/node_modules/@insforge/cli/dist/index.js', 'utf8');

const idx = content.indexOf('command("link")');
if (idx !== -1) {
  console.log(content.slice(idx + 6000, idx + 10000));
}
