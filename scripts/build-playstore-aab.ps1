# OnBoard Health — Play Store AAB build script
# Kullanım: .\scripts\build-playstore-aab.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "OnBoard Health — Production AAB (Google Play)" -ForegroundColor Cyan
Write-Host ""

# EAS login kontrolü
$whoami = npx eas whoami 2>&1
if ($LASTEXITCODE -ne 0 -or $whoami -match "Not logged in") {
  Write-Host "Expo hesabina giris gerekli. Asagidaki komutu calistirin:" -ForegroundColor Yellow
  Write-Host "  npx eas login" -ForegroundColor White
  Write-Host ""
  Write-Host "Giris yaptiktan sonra bu scripti tekrar calistirin." -ForegroundColor Yellow
  exit 1
}

Write-Host "Giris: $whoami" -ForegroundColor Green

if (-not (Test-Path "eas.json")) {
  Write-Host "eas.json bulunamadi." -ForegroundColor Red
  exit 1
}

# Proje bagli mi?
$appConfig = Get-Content "app.config.ts" -Raw
if ($appConfig -notmatch "projectId") {
  Write-Host "Expo projesi baglaniyor (eas build:configure)..." -ForegroundColor Cyan
  npx eas build:configure --platform android
}

Write-Host ""
Write-Host "Production AAB build baslatiliyor (Expo bulutu, ~15 dk)..." -ForegroundColor Cyan
Write-Host "Paket: com.onboardhealth.app | Profil: production | Cikti: .aab" -ForegroundColor Gray
Write-Host ""

npx eas build --platform android --profile production

if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "Build tamamlandi!" -ForegroundColor Green
  Write-Host "1. https://expo.dev adresinden .aab dosyasini indirin" -ForegroundColor White
  Write-Host "2. Play Console -> Release -> App bundles alanina surukleyin" -ForegroundColor White
  Write-Host "Detay: docs/PLAY_CONSOLE_UPLOAD.md" -ForegroundColor Gray
} else {
  Write-Host "Build basarisiz. Terminal ciktisini kontrol edin." -ForegroundColor Red
  exit 1
}
