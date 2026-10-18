import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { VERIFIED_PUBLIC_SERVICES } from '../src/data/publicServices.ts';
import { ARCHIVED_HISTORICAL_PUBLIC_SERVICES } from '../src/data/archivedHistoricalPublicServices.ts';
import { isSafePublicUrl } from '../src/utils/urlVerifier.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('--- RUNNING GRAMA SAHAYYA AI: PUBLIC SERVICES AUDIT & PWA TEST SUITE ---');

// 1. PUBLIC SERVICES CATALOGUE AUDIT TESTS
console.log('\n--- 1. Public Services Catalogue Audit Tests ---');

assert(Array.isArray(VERIFIED_PUBLIC_SERVICES), 'VERIFIED_PUBLIC_SERVICES should be an array');
assert(VERIFIED_PUBLIC_SERVICES.length >= 10, `Expected at least 10 verified services, got ${VERIFIED_PUBLIC_SERVICES.length}`);
console.log(`[PASS] Catalogue contains ${VERIFIED_PUBLIC_SERVICES.length} verified public services`);

// Test required fields on every service
for (const svc of VERIFIED_PUBLIC_SERVICES) {
  assert(svc.id && typeof svc.id === 'string', `Service ${svc.id} must have valid id`);
  assert(svc.name && svc.name.trim().length > 0, `Service ${svc.id} must have official name`);
  assert(svc.teName && svc.teName.trim().length > 0, `Service ${svc.id} must have Telugu name`);
  assert(svc.department && svc.department.trim().length > 0, `Service ${svc.id} must have responsible department`);
  assert(svc.govLevel === 'state' || svc.govLevel === 'central', `Service ${svc.id} govLevel must be 'state' or 'central'`);
  assert(['VERIFIED', 'UPDATED', 'TEMPORARILY_UNAVAILABLE', 'APPLICATION_CLOSED', 'DISCONTINUED', 'UNVERIFIED'].includes(svc.status), `Service ${svc.id} has invalid status ${svc.status}`);
  assert(svc.officialInfoUrl && (svc.officialInfoUrl.startsWith('https://') || svc.officialInfoUrl.startsWith('http://')), `Service ${svc.id} must have valid info URL`);
  assert(svc.officialApplicationUrl && (svc.officialApplicationUrl.startsWith('https://') || svc.officialApplicationUrl.startsWith('http://')), `Service ${svc.id} must have valid application URL`);
  assert(svc.lastVerifiedDate && /^\d{4}-\d{2}-\d{2}/.test(svc.lastVerifiedDate), `Service ${svc.id} must have valid ISO verification date`);
  assert(svc.verificationSource && svc.verificationSource.trim().length > 0, `Service ${svc.id} must specify verification source`);
  assert(svc.requiredDocuments && svc.requiredDocuments.length > 0, `Service ${svc.id} must list required documents`);
  assert(svc.steps && svc.steps.length > 0, `Service ${svc.id} must list application steps`);
}
console.log('[PASS] All verified public services contain complete required metadata (id, name, teName, dept, status, URLs, verification date, source)');

// 2. CATEGORY COVERAGE TESTS
console.log('\n--- 2. Public Service Categories Coverage Tests ---');
const categories = new Set(VERIFIED_PUBLIC_SERVICES.map(s => s.category));
const requiredCategories = ['identity', 'certificates', 'welfare_cards', 'land_records', 'agriculture', 'transport', 'healthcare', 'education', 'utilities', 'grievances', 'business'];

for (const cat of requiredCategories) {
  assert(categories.has(cat as any), `Catalogue should cover category: ${cat}`);
}
console.log(`[PASS] Covered all essential citizen service categories: ${Array.from(categories).join(', ')}`);

// 3. SEPARATION OF ARCHIVED PUBLIC SERVICES
console.log('\n--- 3. Archive Separation Tests ---');
assert(Array.isArray(ARCHIVED_HISTORICAL_PUBLIC_SERVICES), 'ARCHIVED_HISTORICAL_PUBLIC_SERVICES must be an array');
assert(ARCHIVED_HISTORICAL_PUBLIC_SERVICES.length > 0, 'Archive should contain historical public services');
for (const arch of ARCHIVED_HISTORICAL_PUBLIC_SERVICES) {
  assert(arch.isArchivedHistorical === true, `Archived service ${arch.id} must be flagged isArchivedHistorical`);
  assert(arch.archiveReason && arch.archiveReason.length > 0, `Archived service ${arch.id} must have archiveReason`);
  // Ensure not present in VERIFIED_PUBLIC_SERVICES
  const leak = VERIFIED_PUBLIC_SERVICES.find(s => s.id === arch.id);
  assert(!leak, `Archived service ${arch.id} must NOT leak into active VERIFIED_PUBLIC_SERVICES`);
}
console.log(`[PASS] Archived public services are properly segregated with explicit archiveReason`);

// 4. SSRF & URL SAFETY TESTS
console.log('\n--- 4. SSRF Security & URL Safety Tests ---');

// Safe URLs
assert(isSafePublicUrl('https://services.india.gov.in/service/detail/aadhaar-online-services').safe === true);
assert(isSafePublicUrl('https://myaadhaar.uidai.gov.in').safe === true);
assert(isSafePublicUrl('https://gramawardsachivalayam.ap.gov.in').safe === true);
assert(isSafePublicUrl('https://epos.ap.gov.in').safe === true);
console.log('[PASS] Authentic government URLs pass security validation');

// Dangerous / SSRF URLs that must be blocked
const maliciousUrls = [
  'http://localhost:3000/api/secret',
  'http://127.0.0.1:8080/admin',
  'http://127.0.0.2',
  'http://0.0.0.0:80',
  'http://169.254.169.254/latest/meta-data/',
  'http://metadata.google.internal/computeMetadata/v1/',
  'http://10.0.0.1/private',
  'http://192.168.1.1/router',
  'http://172.16.0.5/internal',
  'file:///etc/passwd',
  'javascript:alert(1)',
  'ftp://ftp.example.com'
];

for (const badUrl of maliciousUrls) {
  const check = isSafePublicUrl(badUrl);
  assert(check.safe === false, `URL ${badUrl} should be blocked by SSRF filter`);
}
console.log('[PASS] SSRF protection blocks localhost, 127.0.0.1, 169.254.169.254, internal RFC1918 subnets, file:// and non-http schemes');

// 5. PWA MANIFEST & ASSETS COMPLIANCE TESTS
console.log('\n--- 5. PWA Manifest & Standards Compliance Tests ---');

const manifestPath = path.join(rootDir, 'public', 'manifest.webmanifest');
assert(fs.existsSync(manifestPath), 'public/manifest.webmanifest must exist');
const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

assert.strictEqual(manifestContent.id, '/', 'Manifest id must be "/"');
assert.strictEqual(manifestContent.name, 'Grama Sahayya AI', 'Manifest name must be "Grama Sahayya AI"');
assert(manifestContent.short_name, 'Manifest short_name must exist');
assert(manifestContent.short_name.length <= 12, `short_name "${manifestContent.short_name}" must be <= 12 characters (length: ${manifestContent.short_name.length})`);
assert.strictEqual(manifestContent.start_url, '/', 'start_url must be "/"');
assert.strictEqual(manifestContent.scope, '/', 'scope must be "/"');
assert.strictEqual(manifestContent.display, 'standalone', 'display mode must be "standalone"');
assert.strictEqual(manifestContent.theme_color, '#075B46', 'theme_color must be deep forest green #075B46');
assert.strictEqual(manifestContent.background_color, '#F8F7F2', 'background_color must be warm ivory #F8F7F2');

// Icon checks
assert(Array.isArray(manifestContent.icons), 'Manifest must include icons array');
const iconSizes = manifestContent.icons.map((i: any) => i.sizes);
assert(iconSizes.includes('192x192'), 'Manifest must include 192x192 icon');
assert(iconSizes.includes('512x512'), 'Manifest must include 512x512 icon');

const maskableIcon = manifestContent.icons.find((i: any) => i.purpose === 'maskable');
assert(maskableIcon, 'Manifest must specify a maskable icon');
console.log('[PASS] Web App Manifest conforms to all PWA standards (short_name <= 12 chars, standalone, 192/512 icons, maskable icon, theme colors)');

// Verify physical icon assets exist in public/
for (const icon of manifestContent.icons) {
  const assetPath = path.join(rootDir, 'public', icon.src.replace(/^\//, ''));
  assert(fs.existsSync(assetPath), `Icon file ${icon.src} must exist at ${assetPath}`);
}
console.log('[PASS] All physical icon assets (192x192, 512x512, maskable) exist in public directory');

// 6. HTML ENTRY POINT TAGS TEST
console.log('\n--- 6. HTML Entry Point Tags Test ---');
const htmlPath = path.join(rootDir, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

assert(htmlContent.includes('meta name="theme-color" content="#075B46"'), 'index.html must include theme-color meta tag');
assert(htmlContent.includes('rel="manifest" href="/manifest.webmanifest"'), 'index.html must link to manifest.webmanifest');
assert(htmlContent.includes('rel="apple-touch-icon"'), 'index.html must include apple-touch-icon link');
assert(htmlContent.includes('meta name="mobile-web-app-capable" content="yes"'), 'index.html must include mobile-web-app-capable meta');
console.log('[PASS] index.html includes all required PWA meta tags, apple-touch-icon, and manifest linkage');

console.log('\n🎉 ALL PUBLIC SERVICES AUDIT & PWA TESTS PASSED SUCCESSFULLY! 🎉\n');
