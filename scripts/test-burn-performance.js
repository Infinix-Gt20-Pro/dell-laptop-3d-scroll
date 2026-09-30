const fs = require('fs');
const assert = require('assert');

console.log('Testing WebGL Burn Transition Low-End Mobile Optimizations...\n');

const code = fs.readFileSync('js/burn-transition.js', 'utf8');

// Test 1: Check presence of checkDeviceCapabilities
assert(code.includes('checkDeviceCapabilities'), 'Must include checkDeviceCapabilities');
assert(code.includes('prefers-reduced-motion'), 'Must check prefers-reduced-motion');
assert(code.includes('hardwareConcurrency'), 'Must inspect hardwareConcurrency');
assert(code.includes('deviceMemory'), 'Must inspect deviceMemory');

// Test 2: Check adaptive DPR logic
assert(code.includes('targetDpr'), 'Must define targetDpr');
assert(code.includes('0.75'), 'Must downscale low-end devices to 0.75 DPR');

// Test 3: Check frame-drop watchdog
assert(code.includes('slowFrameCount'), 'Must include slowFrameCount tracking');
assert(code.includes('lastFrameTs'), 'Must track lastFrameTs');

// Test 4: Check mobile button tap throttling
assert(code.includes('eng.device.isMobile || eng.device.isLowEnd'), 'Must throttle mobile button WebGL pulses');

// Test 5: Verify simulation of checkDeviceCapabilities function in node
const evalWrapper = new Function(`
  const window = {
    matchMedia: (query) => ({ matches: query.includes('reduce') ? false : true }),
    innerWidth: 375
  };
  const navigator = {
    userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-A105F) Mobile',
    hardwareConcurrency: 4,
    deviceMemory: 2
  };
  ${code.substring(code.indexOf('function checkDeviceCapabilities'), code.indexOf('class QuantumBurnEngine'))}
  return checkDeviceCapabilities();
`);

const mobileResult = evalWrapper();
console.log('Low-End Mobile Simulation Result:', mobileResult);
assert.strictEqual(mobileResult.isLowEnd, true, '2GB RAM phone must be detected as low-end');
assert.strictEqual(mobileResult.targetDpr, 0.75, 'Low-end phone must be assigned 0.75 DPR');
assert.strictEqual(mobileResult.isMobile, true, 'Must detect mobile form factor');

console.log('\n✅ ALL WEBGL LOW-END MOBILE OPTIMIZATION TESTS PASSED 100%!');
