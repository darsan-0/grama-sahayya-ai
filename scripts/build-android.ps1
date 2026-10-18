# Grama Sahayya AI - Automated Android APK & AAB Build Script
$ErrorActionPreference = "Stop"

$workspaceRoot = Split-Path -Parent $PSScriptRoot
$androidDir = Join-Path $workspaceRoot "android"
$jdkPath = "$env:USERPROFILE\.bubblewrap\jdk\jdk-17.0.11+9"
$sdkPath = "$env:LOCALAPPDATA\Android\Sdk"

Write-Host "[INFO] Starting Grama Sahayya AI Android App Build Pipeline..." -ForegroundColor Cyan

# 1. Environment verification
if (!(Test-Path $jdkPath)) {
    throw "JDK 17 not found at $jdkPath. Please ensure Adoptium Temurin JDK 17 is installed."
}
if (!(Test-Path $sdkPath)) {
    throw "Android SDK not found at $sdkPath."
}

$env:JAVA_HOME = $jdkPath
$env:ANDROID_HOME = $sdkPath
$env:PATH = "$jdkPath\bin;$sdkPath\platform-tools;$env:PATH"

# 2. Check keystore existence
$keystoreDir = Join-Path $androidDir "keystore"
$keystoreFile = Join-Path $keystoreDir "release.keystore"
if (!(Test-Path $keystoreFile)) {
    Write-Host "Creating release keystore..." -ForegroundColor Yellow
    if (!(Test-Path $keystoreDir)) { New-Item -ItemType Directory -Force -Path $keystoreDir | Out-Null }
    & "$jdkPath\bin\keytool.exe" -genkeypair -v -keystore $keystoreFile -alias "gramasahayya" -keyalg RSA -keysize 2048 -validity 10000 -storepass "gramasahayya2026" -keypass "gramasahayya2026" -dname "CN=Grama Sahayya AI, OU=Engineering, O=Grama Sahayya AI, L=Amaravati, ST=Andhra Pradesh, C=IN"
}

# 3. Signing credentials for non-interactive Bubblewrap build
if (-not $env:BUBBLEWRAP_KEYSTORE_PASSWORD) {
    $env:BUBBLEWRAP_KEYSTORE_PASSWORD = "gramasahayya2026"
}
if (-not $env:BUBBLEWRAP_KEY_PASSWORD) {
    $env:BUBBLEWRAP_KEY_PASSWORD = "gramasahayya2026"
}

# 4. Generate or synchronize TWA Project
Write-Host "Configuring TWA project files..." -ForegroundColor Cyan
Set-Location $workspaceRoot
node scripts/generate-twa.cjs

# 5. Build signed APK and signed AAB
Write-Host "Building signed APK & Android App Bundle (AAB)..." -ForegroundColor Cyan
Set-Location $androidDir
bubblewrap build
if ($LASTEXITCODE -ne 0) {
    throw "Bubblewrap build failed with exit code $LASTEXITCODE"
}

# 6. Copy build deliverables to web public directory
$builtApk = Join-Path $androidDir "app-release-signed.apk"
$builtAab = Join-Path $androidDir "app-release-bundle.aab"
$publicDownloads = Join-Path $workspaceRoot "public\downloads"
$distDownloads = Join-Path $workspaceRoot "dist\downloads"

if (!(Test-Path $publicDownloads)) { New-Item -ItemType Directory -Force -Path $publicDownloads | Out-Null }
Copy-Item $builtApk (Join-Path $publicDownloads "grama-sahayya-ai.apk") -Force

if (Test-Path (Join-Path $workspaceRoot "dist")) {
    if (!(Test-Path $distDownloads)) { New-Item -ItemType Directory -Force -Path $distDownloads | Out-Null }
    Copy-Item $builtApk (Join-Path $distDownloads "grama-sahayya-ai.apk") -Force
}

Set-Location $workspaceRoot

$apkSize = (Get-Item $builtApk).Length / 1MB
$aabSize = (Get-Item $builtAab).Length / 1MB

$apkMb = [math]::Round($apkSize, 2)
$aabMb = [math]::Round($aabSize, 2)

Write-Host "`n[SUCCESS] Build Succeeded!" -ForegroundColor Green
Write-Host "[APK] Signed APK: $builtApk ($apkMb MB)" -ForegroundColor Green
Write-Host "[AAB] Signed AAB: $builtAab ($aabMb MB)" -ForegroundColor Green
Write-Host "[WEB] Web Hosted: public/downloads/grama-sahayya-ai.apk" -ForegroundColor Green
