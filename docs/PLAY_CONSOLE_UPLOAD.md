# Play Console — AAB yükleme (sürükle-bırak)

Google Play **`.aab`** (Android App Bundle) ister; **APK değil** (production için).

---

## 1. Expo hesabı + AAB oluştur (bilgisayarınızda)

PowerShell — proje klasöründe:

```powershell
cd C:\Users\EXCALIBUR\Desktop\pilatesstudio
npm install
npx eas login
npx eas build:configure
```

`build:configure` sorularında:
- Platform: **Android**
- Mevcut projeyi bağla veya yeni Expo projesi oluştur

Sonra production build:

```powershell
npm run build:playstore
```

veya:

```powershell
npx eas build --platform android --profile production
```

Build **10–20 dakika** sürebilir (Expo bulutunda). Bittiğinde terminalde **indirme linki** çıkar.

---

## 2. `.aab` dosyasını indir

1. [expo.dev](https://expo.dev) → giriş → **Projects** → **onboardhealth**
2. **Builds** → en son **production** Android build
3. **Download** → dosya adı örneğin: `build-1234567890.aab`

Bu dosyayı Play Console’a sürükleyeceksiniz.

---

## 3. Play Console’a yükle

1. [Google Play Console](https://play.google.com/console)
2. **OnBoard Health** uygulamanız (veya **Create app** — paket: `com.onboardhealth.app`)
3. Sol menü: **Test and release** → **Production** (veya önce **Internal testing**)
4. **Create new release**
5. **App bundles** alanına **`build-….aab`** dosyasını **sürükleyip bırakın**
6. **Release name:** `1.0.0`
7. **Release notes (tr):** CHANGELOG.md içindeki 1.0.0 maddeleri
8. **Save** → **Review release** → **Start rollout**

---

## İlk kez yüklüyorsanız (AAB’den önce)

Play Console şunları da ister; AAB tek başına yetmez:

| Bölüm | Dosya / kaynak |
|--------|----------------|
| Store listing | `store/listing-tr.md` |
| Privacy policy URL | `.env` → `EXPO_PUBLIC_PRIVACY_POLICY_URL` |
| App icon 512×512 | `store/ASSETS.md` |
| Feature graphic 1024×500 | Kendiniz tasarlayın |
| Screenshots (min 2) | Telefondan ekran görüntüsü |
| Data safety | `store/data-safety-tr.md` |
| Content rating | IARC anketi |

Kontrol listesi: `store/MVP_CHECKLIST.md`

---

## Sık hatalar

| Hata | Çözüm |
|------|--------|
| APK yükledim, kabul etmedi | **AAB** kullanın (`buildType: app-bundle`) |
| Paket adı uyuşmuyor | Play’de `com.onboardhealth.app` ile oluşturun |
| Imza hatası | İlk yükleme: EAS keystore kullanın; aynı Expo hesabıyla build alın |
| `.env` build’e gitmedi | EAS Secrets: `eas env:create` veya build sırasında Expo dashboard env |

---

## Tek komut özeti (giriş yaptıktan sonra)

```powershell
cd C:\Users\EXCALIBUR\Desktop\pilatesstudio
npm run build:playstore
```

Build URL’si terminalde görünür; bitince `.aab` indirip Play Console’a bırakın.
