const { TwaGenerator, TwaManifest, ConsoleLog } = require('C:/Users/Darsan/AppData/Roaming/npm/node_modules/@bubblewrap/cli/node_modules/@bubblewrap/core');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

async function main() {
  const targetDir = path.resolve(__dirname, '../android');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const manifestData = {
    packageId: 'ai.gramasahayya.app',
    host: 'grama-sahayya-ai.onrender.com',
    name: 'Grama Sahayya AI',
    launcherName: 'Grama Sahayya',
    display: 'standalone',
    themeColor: '#075B46',
    themeColorDark: '#053C2E',
    navigationColor: '#075B46',
    navigationColorDark: '#053C2E',
    navigationDividerColor: '#00000000',
    navigationDividerColorDark: '#00000000',
    backgroundColor: '#F8F7F2',
    enableNotifications: true,
    startUrl: '/',
    iconUrl: 'https://grama-sahayya-ai.onrender.com/pwa-512x512.png',
    maskableIconUrl: 'https://grama-sahayya-ai.onrender.com/pwa-maskable-512x512.png',
    appVersion: '1.0.0',
    appVersionCode: 1,
    signingKey: {
      path: path.join('.', 'keystore', 'release.keystore'),
      alias: 'gramasahayya'
    },
    splashScreenFadeOutDuration: 300,
    generatorApp: 'bubblewrap-cli',
    webManifestUrl: 'https://grama-sahayya-ai.onrender.com/manifest.webmanifest',
    fallbackType: 'customtabs',
    features: {},
    alphaDependencies: { enabled: false },
    enableSiteSettingsShortcut: true,
    isChromeOSOnly: false,
    isMetaQuest: false,
    fullScopeUrl: 'https://grama-sahayya-ai.onrender.com/',
    minSdkVersion: 24,
    orientation: 'portrait-primary',
    shortcuts: []
  };

  const twaManifest = new TwaManifest(manifestData);
  const err = twaManifest.validate();
  if (err) {
    throw new Error('Manifest validation failed: ' + err);
  }

  const twaGenerator = new TwaGenerator();
  const log = new ConsoleLog('TwaGenerator');
  console.log('Generating Android TWA project into:', targetDir);
  await twaGenerator.createTwaProject(targetDir, twaManifest, log, (current, total) => {
    process.stdout.write(`\rProgress: ${current}/${total}`);
  });
  console.log('\nProject files generated successfully!');

  // Fix unresolved groovy.xml.MarkupBuilder in app/build.gradle
  const appBuildGradlePath = path.join(targetDir, 'app', 'build.gradle');
  if (fs.existsSync(appBuildGradlePath)) {
    let gradleContent = await fs.promises.readFile(appBuildGradlePath, 'utf8');
    gradleContent = gradleContent.replace(/^import groovy\.xml\.MarkupBuilder\r?\n/m, '');
    const oldMarkupPattern = /def xmlWriter = new StringWriter\(\)[\s\S]*?shortcutsFile\.text = xmlWriter\.toString\(\) \+ '\\n'/;
    const cleanXmlLogic = `if (twaManifest.shortcuts.isEmpty()) {
        shortcutsFile.text = "<shortcuts xmlns:android='http://schemas.android.com/apk/res/android' />\\n"
    } else {
        def sb = new StringBuilder()
        sb.append("<shortcuts xmlns:android='http://schemas.android.com/apk/res/android'>\\n")
        twaManifest.shortcuts.eachWithIndex { s, i ->
            sb.append("    <shortcut\\n")
            sb.append("        android:shortcutId='shortcut\${i}'\\n")
            sb.append("        android:enabled='true'\\n")
            sb.append("        android:icon='@drawable/\${s.icon}'\\n")
            sb.append("        android:shortcutShortLabel='@string/shortcut_short_name_\${i}'\\n")
            sb.append("        android:shortcutLongLabel='@string/shortcut_name_\${i}'>\\n")
            sb.append("        <intent\\n")
            sb.append("            android:action='android.intent.action.MAIN'\\n")
            sb.append("            android:targetPackage='\${twaManifest.applicationId}'\\n")
            sb.append("            android:targetClass='\${twaManifest.applicationId}.LauncherActivity'\\n")
            sb.append("            android:data='\${s.url}'>\\n")
            sb.append("            <categories android:name='android.intent.category.LAUNCHER' />\\n")
            sb.append("        </intent>\\n")
            sb.append("    </shortcut>\\n")
        }
        sb.append("</shortcuts>\\n")
        shortcutsFile.text = sb.toString()
    }`;
    if (oldMarkupPattern.test(gradleContent)) {
      gradleContent = gradleContent.replace(oldMarkupPattern, cleanXmlLogic);
      await fs.promises.writeFile(appBuildGradlePath, gradleContent, 'utf8');
      console.log('Patched app/build.gradle to resolve Groovy MarkupBuilder error.');
    }
  }

  // Save twa-manifest.json
  await twaManifest.saveToFile(path.join(targetDir, 'twa-manifest.json'));
  
  // Save manifest-checksum.txt
  const manifestRaw = await fs.promises.readFile(path.join(targetDir, 'twa-manifest.json'));
  const checksum = crypto.createHash('sha1').update(manifestRaw).digest('hex');
  await fs.promises.writeFile(path.join(targetDir, 'manifest-checksum.txt'), checksum);
  console.log('twa-manifest.json & checksum saved.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
