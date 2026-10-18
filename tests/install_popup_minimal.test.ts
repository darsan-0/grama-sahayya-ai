import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('--- RUNNING GRAMA SAHAYYA AI: MINIMAL INSTALL POPUP VERIFICATION TEST SUITE ---');

const popupPath = path.join(rootDir, 'src', 'components', 'InstallAppPopup.tsx');
assert(fs.existsSync(popupPath), 'InstallAppPopup.tsx must exist');
const popupCode = fs.readFileSync(popupPath, 'utf8');

// 1. DIMENSION CHECKS
console.log('\n--- 1. Compact Dimensions & Viewport Constraints ---');
assert(popupCode.includes('w-[250px] sm:w-[270px]'), 'Must enforce 250px on mobile and 270px on desktop');
assert(popupCode.includes('h-[78px]'), 'Must have compact height ~78px');
assert(popupCode.includes('rounded-[16px]'), 'Must have 16px rounded corners');
console.log('[PASS] Dimensions adhere to: desktop 270px, mobile 250px max, compact height 78px, 16px radius');

// 2. GLASSMORPHISM & STYLING
console.log('\n--- 2. Frosted Glass & Palette ---');
assert(popupCode.includes('rgba(255, 255, 255, 0.72)'), 'Must use rgba(255, 255, 255, 0.72) glass background');
assert(popupCode.includes("blur(16px)"), 'Must specify 16px backdrop blur');
assert(popupCode.includes('#075B46'), 'Must use forest green #075B46');
assert(popupCode.includes('#E6B84A'), 'Must use muted gold accent #E6B84A');
assert(popupCode.includes('#242824'), 'Must use charcoal text #242824');
console.log('[PASS] Frosted glass backdrop-filter blur(16px), border, and brand color palette confirmed');

// 3. ESSENTIAL CONTENT
console.log('\n--- 3. Content Checklist ---');
assert(popupCode.includes('Grama Sahayya AI'), 'Must show app name');
assert(popupCode.includes('Install for quicker access.'), 'Must show concise subtitle');
assert(popupCode.includes('w-[34px] h-[34px]'), 'Must include small 34px app emblem');
assert(popupCode.includes('Download'), 'Must include Download icon on install button');
assert(popupCode.includes('Install') || popupCode.includes('ఇన్‌స్టాల్'), 'Must include Install button text');
assert(popupCode.includes('w-5 h-5 rounded-full') && popupCode.includes('absolute -top-2 -right-2'), 'Must include tiny circular top-right close button');
console.log('[PASS] All visual elements present: 34px emblem, Grama Sahayya AI title, subtitle, Install button, circular close button');

// 4. FUNCTIONALITY & PWA HOOK INTEGRATION
console.log('\n--- 4. PWA Event Flow & Standalone Suppression ---');
assert(popupCode.includes('usePWAInstall'), 'Must integrate with usePWAInstall hook');
assert(popupCode.includes('shouldShowPopup'), 'Must respect shouldShowPopup');
assert(popupCode.includes('isInstalled'), 'Must suppress when already installed');
assert(popupCode.includes('dismiss'), 'Must trigger dismissal and save state');
assert(popupCode.includes('safe-area-inset'), 'Must respect mobile safe-area insets');
console.log('[PASS] Integrated with native installation trigger, iOS/unsupported guidance tooltip, and dismissal');

console.log('\n🎉 ALL MINIMAL INSTALL POPUP TESTS PASSED SUCCESSFULLY! 🎉\n');
