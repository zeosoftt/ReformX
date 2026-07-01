# Native altyapı

Bu proje **Expo Go ile sınırlı kalmaz**; hedef **gerçek native binary** (development client + mağaza build) ve platform native modülleridir.

## Mimari özeti

| Katman | Teknoloji | Platform |
|--------|-----------|----------|
| UI runtime | React Native 0.81 + **New Architecture** | iOS / Android |
| Navigasyon | Expo Router → **react-native-screens** (native stack) | iOS / Android |
| Gesture / animasyon | **react-native-gesture-handler**, **reanimated** | iOS / Android |
| Büyük veri | **AsyncStorage** (native bridge) | iOS / Android / Web |
| Hassas veri | **expo-secure-store** (Keychain / EncryptedSharedPreferences) | iOS / Android (+ web fallback) |
| Native proje | **CNG** — `expo prebuild` → `android/` `ios/` | Yerel veya EAS |
| Geliştirme | **expo-dev-client** (Expo Go değil) | Cihaz / emülatör |
| Dağıtım | **EAS Build** (`eas.json`) | Bulut |

Web ikincil hedeftir; `npm run web` ile test edilebilir ama birincil ürün **mobil native**’dir.

---

## Expo Go vs Development Client

| | Expo Go | Development Client (bu proje) |
|---|---------|-------------------------------|
| Binary | Expo’nun genel uygulaması | Sizin `com.onboardhealth.app` paketiniz |
| Native modüller | Sınırlı | `expo-secure-store`, datetimepicker, vb. dahil |
| `npm start` | `start:go` | **`npm start`** (`--dev-client`) |

İlk kez native çalıştırmadan önce **en az bir kez** development build almanız gerekir (aşağıda).

---

## İlk native kurulum (Android, Windows)

### 1. Android Studio + SDK

- [Android Studio](https://developer.android.com/studio) kurun.
- SDK yolu genelde: `C:\Users\KULLANICI\AppData\Local\Android\Sdk`
- Ortam değişkeni: **`ANDROID_HOME`** = SDK klasörü
- **`Path`**: `%ANDROID_HOME%\platform-tools`, `%ANDROID_HOME%\emulator`

### 2. Native klasörleri üret

```powershell
cd C:\Users\EXCALIBUR\Desktop\pilatesstudio
npm install
npm run prebuild
```

`android/` (ve Mac’te `ios/`) oluşur. Bu klasörler `.gitignore` içindedir; CI/EAS veya `prebuild` ile yeniden üretilir.

### 3. Yerel debug build + çalıştır

Emülatör açık veya USB ile telefon bağlı:

```powershell
npm run android
```

Release APK denemesi:

```powershell
npx expo run:android --variant release
```

---

## EAS ile native build (SDK kurmadan)

```powershell
npm install -g eas-cli
eas login
eas build:configure
npm run build:dev:android
```

APK indir → telefona kur → sonra:

```powershell
npm start
```

Metro, **development client** uygulamanıza bağlanır.

Profiller (`eas.json`):

- **development** — dev client, debug
- **preview** — internal test APK
- **production** — Play Store AAB / App Store

---

## Yapılandırma dosyaları

| Dosya | Açıklama |
|-------|----------|
| `app.config.ts` | Bundle id, native plugin’ler, New Arch |
| `eas.json` | Build profilleri |
| `lib/platform.ts` | `isNative`, `isIOS`, `isAndroid`, `isWeb` |
| `lib/storage/secureStorage.ts` | Keychain / şifreli depolama |
| `lib/storage/appStorage.ts` | AsyncStorage sarmalayıcı |
| `services/studioIdStorage.ts` | Stüdyo UUID kalıcılığı |
| `components/AppBootstrap.tsx` | Açılışta native depodan hydrate |

Paket kimlikleri (değiştirmeden önce mağaza hesabınıza göre güncelleyin):

- Android: `com.onboardhealth.app`
- iOS: `com.onboardhealth.app`

---

## Native modül ekleme

Yeni Expo native paketi:

```powershell
npx expo install paket-adi
npm run prebuild
```

`prebuild` config plugin’leri native projeye yazar. Sonra `npm run android` / `npm run ios`.

---

## Sık hatalar

| Hata | Çözüm |
|------|--------|
| Development client yok | `npm run build:dev:android` veya `npm run prebuild` + `npm run android` |
| `adb` / SDK bulunamadı | Android Studio + `ANDROID_HOME` |
| Expo Go açılıyor | `npm start` dev-client bekler; kendi APK’nızı kurun |
| Plugin değişti | `npm run prebuild:clean` sonra tekrar build |

---

## iOS (Mac veya EAS)

Mac’te:

```bash
npm run prebuild
npm run ios
```

Windows’ta iOS simülatör yok → **`npm run build:dev:ios`** (EAS) kullanın.
