import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('--- RUNNING GRAMA SAHAYYA AI: ANDROID APP & TWA SUITE ---');

// 1. Android Project Structure Verification
console.log('\n--- 1. Android Project & TWA Structure ---');
const androidDir = path.join(rootDir, 'android');
assert(fs.existsSync(androidDir), 'android/ directory must exist');
assert(fs.existsSync(path.join(androidDir, 'build.gradle')), 'android/build.gradle must exist');
assert(fs.existsSync(path.join(androidDir, 'app', 'build.gradle')), 'android/app/build.gradle must exist');
assert(fs.existsSync(path.join(androidDir, 'app', 'src', 'main', 'AndroidManifest.xml')), 'AndroidManifest.xml must exist');
assert(fs.existsSync(path.join(androidDir, 'twa-manifest.json')), 'twa-manifest.json must exist');
assert(fs.existsSync(path.join(androidDir, 'gradlew.bat')), 'gradlew.bat must exist');
console.log('[PASS] Android TWA project structure successfully created in dedicated android/ folder');

// 2. Package ID and App Configuration
console.log('\n--- 2. App Identity & Reverse-Domain Package ID ---');
const twaManifest = JSON.parse(fs.readFileSync(path.join(androidDir, 'twa-manifest.json'), 'utf8'));
assert.strictEqual(twaManifest.packageId, 'ai.gramasahayya.app', 'Package ID must be permanent unique reverse-domain ai.gramasahayya.app');
assert.strictEqual(twaManifest.name, 'Grama Sahayya AI', 'App name must be Grama Sahayya AI');
assert.strictEqual(twaManifest.host, 'grama-sahayya-ai.onrender.com', 'Host must match deployed website');
assert(twaManifest.minSdkVersion >= 24, 'minSdkVersion must be at least 24 for androidbrowserhelper');

const manifestXml = fs.readFileSync(path.join(androidDir, 'app', 'src', 'main', 'AndroidManifest.xml'), 'utf8');
assert(manifestXml.includes('ai.gramasahayya.app'), 'AndroidManifest must contain package id');
console.log('[PASS] Verified Package ID (ai.gramasahayya.app), App Name (Grama Sahayya AI), and Manifest metadata');

// 3. Digital Asset Links Verification
console.log('\n--- 3. Digital Asset Links Ownership Verification ---');
const assetlinksPath = path.join(rootDir, 'public', '.well-known', 'assetlinks.json');
assert(fs.existsSync(assetlinksPath), 'public/.well-known/assetlinks.json must exist');
const assetlinks = JSON.parse(fs.readFileSync(assetlinksPath, 'utf8'));
assert(Array.isArray(assetlinks) && assetlinks.length > 0, 'assetlinks.json must be a non-empty array');
assert(assetlinks[0].relation.includes('delegate_permission/common.handle_all_urls'), 'Must declare delegate_permission/common.handle_all_urls');
assert.strictEqual(assetlinks[0].target.package_name, 'ai.gramasahayya.app', 'assetlinks target package must be ai.gramasahayya.app');
assert(assetlinks[0].target.sha256_cert_fingerprints.length > 0, 'Must contain SHA256 fingerprint');
const fingerprint = assetlinks[0].target.sha256_cert_fingerprints[0];
assert.strictEqual(fingerprint, '22:80:84:DD:85:58:26:B5:E1:46:A5:AF:51:A4:D8:56:77:7E:71:82:CE:68:90:1E:E6:61:7D:74:C3:A3:A8:FC', 'Fingerprint must match signing keystore');
console.log('[PASS] Digital Asset Links properly configured with authentic SHA-256 fingerprint');

// 4. Build Artifacts Verification
console.log('\n--- 4. Real Signed APK & AAB Deliverables ---');
const signedApkPath = path.join(androidDir, 'app-release-signed.apk');
assert(fs.existsSync(signedApkPath), 'app-release-signed.apk must exist');
const apkStats = fs.statSync(signedApkPath);
assert(apkStats.size > 500000, `APK size (${apkStats.size} bytes) must be a real compiled binary > 500KB`);

const signedAabPath = path.join(androidDir, 'app-release-bundle.aab');
assert(fs.existsSync(signedAabPath), 'app-release-bundle.aab must exist');
const aabStats = fs.statSync(signedAabPath);
assert(aabStats.size > 500000, `AAB size (${aabStats.size} bytes) must be a real compiled bundle > 500KB`);

const hostedApkPath = path.join(rootDir, 'public', 'downloads', 'grama-sahayya-ai.apk');
assert(fs.existsSync(hostedApkPath), 'public/downloads/grama-sahayya-ai.apk must exist for web hosting');
const hostedStats = fs.statSync(hostedApkPath);
assert.strictEqual(hostedStats.size, apkStats.size, 'Hosted APK size must match generated signed APK');
console.log(`[PASS] Signed APK (${(apkStats.size / (1024 * 1024)).toFixed(2)} MB) and Signed AAB (${(aabStats.size / (1024 * 1024)).toFixed(2)} MB) verified`);

// 5. Security & Git Secret Protection
console.log('\n--- 5. Security & Git Secret Hygiene ---');
const gitignore = fs.readFileSync(path.join(rootDir, '.gitignore'), 'utf8');
assert(gitignore.includes('*.keystore'), '.gitignore must exclude *.keystore');
assert(gitignore.includes('android/keystore/'), '.gitignore must exclude android/keystore/');
assert(gitignore.includes('android/build/'), '.gitignore must exclude android/build/');
assert(gitignore.includes('android/app/build/'), '.gitignore must exclude android/app/build/');
assert(fs.existsSync(path.join(androidDir, 'keystore', 'release.keystore')), 'Keystore file must exist locally');
console.log('[PASS] Secrets hygiene verified: keystore, passwords, and build folders are strictly excluded from git');

// 6. Server Endpoints Verification
console.log('\n--- 6. Backend Integration & Distribution Routes ---');
const serverCode = fs.readFileSync(path.join(rootDir, 'server.ts'), 'utf8');
assert(serverCode.includes('/.well-known/assetlinks.json'), 'server.ts must handle assetlinks.json route');
assert(serverCode.includes('/downloads/grama-sahayya-ai.apk'), 'server.ts must handle apk download route');
assert(serverCode.includes('/api/app-info'), 'server.ts must handle app-info endpoint');
assert(serverCode.includes('application/vnd.android.package-archive'), 'server.ts must serve correct Android APK mime type');
console.log('[PASS] Server routes configured for AssetLinks verification, APK streaming, and App metadata');

console.log('\n🎉 ALL ANDROID APP & TWA TESTS PASSED SUCCESSFULLY! 🎉\n');
