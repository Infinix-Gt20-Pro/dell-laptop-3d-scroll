const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../js/products-data.js');
let lines = fs.readFileSync(filePath, 'utf8').split('\n');

lines = lines.map(line => {
  // If line has an inch quote like 15.6" or 14" or 2.5" inside an already double-quoted string
  // e.g. "15.6" 144Hz..." -> "15.6-inch 144Hz..."
  // e.g. storage: "512GB NVMe SSD + 2.5" SATA..." -> storage: "512GB NVMe SSD + 2.5-inch SATA..."
  // e.g. "14.0" Full HD..." -> "14.0-inch Full HD..."
  let modified = line;
  modified = modified.replace(/([0-9.]+)"\s*/g, '$1-inch ');
  // Clean up any double suffix like -inch -inch
  modified = modified.replace(/-inch\s*-inch/g, '-inch');
  return modified;
});

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('Processed all lines in js/products-data.js');
