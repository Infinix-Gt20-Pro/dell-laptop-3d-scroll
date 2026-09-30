const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Compiling production Tailwind CSS...');
try {
  execSync('npx tailwindcss -i ./css/tailwind-input.css -o ./css/tailwind.min.css --minify', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  const size = fs.statSync(path.resolve(__dirname, '../css/tailwind.min.css')).size;
  console.log(`✅ Successfully compiled css/tailwind.min.css (${(size / 1024).toFixed(1)} KB)`);
} catch (e) {
  console.error('Tailwind build failed:', e.message);
  process.exit(1);
}
