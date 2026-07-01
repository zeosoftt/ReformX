# MVP 1.0.0 — İlk Play Store yüklemesi

**OnBoard Health** · `com.onboardhealth.app` · sürüm **1.0.0**

Bu belge, ilk mağaza yüklemesi için **bugün yapmanız gerekenleri** sırayla listeler.

---

## MVP kapsamı (v1.0.0)

| Dahil | Hariç (v1.1+) |
|-------|----------------|
| Onboarding & stüdyo profili | Bulut / Supabase paneli |
| Danışan kaydı (sihirbaz) | Çok cihaz senkronu |
| Seans / randevu + yoklama | Online ödeme |
| Özet panel & istatistikler | Push bildirim |
| Yerel veri (cihazda) | Hesap / giriş zorunluluğu |
| Gizlilik politikası (uygulama içi) | |

Kod: `constants/mvp.ts` → `cloudSyncUi: false`

---

## Adım 1 — `.env` (build öncesi)

```powershell
copy env.example .env
```

Doldurun:

```env
EXPO_PUBLIC_SUPPORT_EMAIL=destek@sirketiniz.com
EXPO_PUBLIC_PRIVACY_POLICY_URL=https://sirketiniz.com/gizlilik
```

Supabase satırları **boş kalabilir** (MVP yerel mod).

`store/PRIVACY_POLICY.md` → sitenize yükleyin (HTTPS).

---

## Adım 2 — Son kontrol (5 dk)

```powershell
npm install
npm run typecheck
```

Telefonda veya emülatörde:

- [ ] İlk açılış → onboarding → sekmeler
- [ ] Danışan ekle → listede görünür
- [ ] Seans ekle → özet / seanslar sekmesinde
- [ ] Yoklama (Geldi / Gelmedi) çalışır
- [ ] Ayarlar → Gizlilik politikası açılır
- [ ] Uygulama **internetsiz** açılır (uçak modu test)

---

## Adım 3 — Production AAB

```powershell
npm install -g eas-cli
eas login
eas build:configure
npm run build:playstore
```

- Profil: **production**
- Çıktı: **.aab** (Android App Bundle)
- Expo dashboard’dan indirin

İlk kez: EAS Android keystore otomatik oluşturulur — **credentials yedekleyin** (`eas credentials`).

---

## Adım 4 — Play Console

1. [Google Play Console](https://play.google.com/console) → **Create app**
2. **Store listing** → metinler: `store/listing-tr.md`
3. **Privacy policy** → `.env` URL’niz
4. **Data safety** → `store/data-safety-tr.md`
5. **Content rating** → IARC anketi (iş uygulaması, sağlık verisi kullanıcı girişi)
6. **Release → Internal testing** (önce) veya **Production**
7. **Upload** → indirdiğiniz `.aab`
8. **Release notes:** `CHANGELOG.md` içindeki 1.0.0 maddeleri

Görseller: `store/ASSETS.md` (512 ikon, 1024×500 feature graphic, ≥2 ekran görüntüsü).

---

## Adım 5 — İnceleme ipuçları

Play incelemecisi için:

- Uygulama **tıbbi cihaz değildir**; stüdyo yönetim aracıdır
- Giriş / kayıt **gerekmez**
- Test: onboarding’i tamamlayıp örnek danışan ekleyin

Red gelirse: Policy → Destek e-postası → Data safety üçlüsünü kontrol edin.

---

## Sonraki sürüm (1.1.0)

1. `constants/mvp.ts` → `cloudSyncUi: true`
2. Supabase + auth
3. `app.config.ts` → `version: "1.1.0"`
4. `eas build --platform android --profile production`

---

## Hızlı komut özeti

```powershell
npm run typecheck
npm run build:playstore
```

Detaylı rehber: [PLAY_STORE.md](./PLAY_STORE.md)
