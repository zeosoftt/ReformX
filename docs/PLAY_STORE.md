# Google Play Store — uçtan uca yayın rehberi

Bu rehber **OnBoard Health** uygulamasını (`com.onboardhealth.app`) Play Store’a yüklemeniz için adım adım yol haritasıdır.

---

## Ön koşullar

| Gereksinim | Not |
|------------|-----|
| Google Play Console hesabı | Tek seferlik ~25 USD — [play.google.com/console](https://play.google.com/console) |
| Expo hesabı | [expo.dev](https://expo.dev) — ücretsiz |
| EAS CLI | `npm install -g eas-cli` |
| Gizlilik politikası URL | **HTTPS**, herkese açık — `store/PRIVACY_POLICY.md` içeriğini sitenize koyun |
| Destek e-postası | Gerçek, yanıtlanabilir adres |
| Mağaza görselleri | `store/ASSETS.md` |

---

## 1. Ortam değişkenlerini doldurun

```powershell
copy env.example .env
```

`.env` içinde **mutlaka**:

```env
EXPO_PUBLIC_SUPPORT_EMAIL=destek@sirketiniz.com
EXPO_PUBLIC_PRIVACY_POLICY_URL=https://sirketiniz.com/gizlilik
```

Supabase kullanmıyorsanız Supabase satırlarını boş bırakabilirsiniz; uygulama yerel modda çalışır.

---

## 2. EAS projesini bağlayın

```powershell
cd C:\Users\EXCALIBUR\Desktop\pilatesstudio
eas login
eas build:configure
```

`eas build:configure` sırasında Android seçin; `app.config.ts` içine `extra.eas.projectId` yazılır.

---

## 3. Production AAB oluşturun (Play Store dosyası)

```powershell
npm run build:playstore
```

veya:

```powershell
eas build --platform android --profile production
```

- **Çıktı:** `.aab` (Android App Bundle) — APK değil
- **Profil:** `production` → dev client **kapalı**, `targetSdk 35`, imza EAS tarafından
- Build bitince Expo sayfasından `.aab` indirin

Yerel imza (alternatif, önerilmez ilk kez): `eas credentials` ile yönetilir.

---

## 4. Play Console’da uygulama oluşturun

1. **Create app**
2. **App name:** OnBoard Health
3. **Default language:** Türkçe
4. **App / Game:** App
5. **Free / Paid:** Free (veya ücretli modelinize göre)

---

## 5. Mağaza listesi (Store listing)

`store/listing-tr.md` dosyasındaki metinleri kopyalayın.

| Alan | Limit |
|------|--------|
| Kısa açıklama | 80 karakter |
| Tam açıklama | 4000 karakter |
| Uygulama simgesi | 512×512 PNG |
| Öne çıkan grafik | 1024×500 PNG |
| Ekran görüntüsü | En az 2, telefon, 16:9 veya 9:16 |

Ekran görüntüsü almak: production build veya preview APK ile gerçek cihazda Özet / Danışanlar / Seans ekranlarını fotoğraflayın.

---

## 6. Gizlilik politikası (zorunlu)

Play Console → **App content** → **Privacy policy**

- URL: `.env` içindeki `EXPO_PUBLIC_PRIVACY_POLICY_URL` ile **aynı** olmalı
- İçerik şablonu: `store/PRIVACY_POLICY.md` (GitHub Pages’e yükleyebilirsiniz)

Uygulama içi ekran: **Ayarlar → Gizlilik politikası**

---

## 7. Veri güvenliği (Data safety)

`store/data-safety-tr.md` dosyasındaki cevapları Play Console formuna girin.

Özet (v1.0.0):

- Veri cihazda saklanır (danışan, seans, not)
- Analiz / reklam SDK yok
- Supabase opsiyonel — yapılandırılmadıysa buluta veri gitmez
- Konum, kamera, mikrofon **kullanılmaz**

---

## 8. İçerik derecelendirmesi

**Settings → App content → Content rating**

- IARC anketi doldurun
- İş / verimlilik + sağlık notları (danışan verisi) — genelde **Everyone** veya **Teen**; sağlık verisi sorularına “evet, kullanıcı tarafından girilen” deyin, tıbbi cihaz değil

---

## 9. Hedef kitle ve reklam

- **Target audience:** 18+ / işletme kullanıcıları (çocuk uygulaması değil)
- **Contains ads:** Hayır (v1)
- **News app / COVID-19 / Government:** Hayır

---

## 10. AAB yükleme

1. **Release → Production** (veya önce **Internal testing**)
2. **Create new release**
3. `.aab` dosyasını yükleyin
4. **Release name:** 1.0.0 (1)
5. **Release notes (tr):** İlk sürüm — pilates ve fizyoterapi merkezleri için danışan ve seans yönetimi.

---

## 11. İnceleme öncesi kontrol listesi

- [ ] `EXPO_PUBLIC_SUPPORT_EMAIL` gerçek e-posta
- [ ] Gizlilik URL’si tarayıcıda açılıyor (HTTPS)
- [ ] Onboarding bir kez tamamlanınca tekrar açılışta sekmelere gidiyor
- [ ] Supabase yokken uygulama çökmeden çalışıyor
- [ ] Simge ve splash marka renkleriyle uyumlu
- [ ] Paket adı: `com.onboardhealth.app`

---

## 12. Sürüm güncelleme

1. `app.config.ts` → `version: "1.0.1"` (versionCode EAS `autoIncrement` ile artar)
2. `eas build --platform android --profile production`
3. Play Console → yeni release → yeni AAB

---

## Sık sorunlar

| Sorun | Çözüm |
|--------|--------|
| “Privacy policy URL required” | HTTPS public URL ekleyin |
| “Target API level” | `app.config.ts` targetSdk 35 — production build alın |
| “Duplicate package” | Paket adı benzersiz olmalı: `com.onboardhealth.app` |
| İnceleme red — sağlık iddiası | Açıklamada “tıbbi teşhis/tedavi sunmaz, yönetim aracıdır” vurgulayın |

---

## Faydalı komutlar

```powershell
npm run build:playstore          # Production AAB
eas submit --platform android --profile production   # CLI ile yükleme (service account gerekir)
npm run typecheck
```

Service account ile otomatik yükleme: [Expo Submit — Android](https://docs.expo.dev/submit/android/)
