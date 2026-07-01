# OnBoard Health

Pilates & fizyoterapi merkezleri için mobil yönetim uygulaması.

> **Play Console AAB:** [docs/PLAY_CONSOLE_UPLOAD.md](docs/PLAY_CONSOLE_UPLOAD.md) — sürükle-bırak için `.aab`  
> **İlk yükleme:** [docs/MVP_RELEASE.md](docs/MVP_RELEASE.md) · `npm run build:playstore`

---

## Gereksinimler

| Araç | Not |
|------|-----|
| **Node.js** | LTS (18 veya 20 önerilir) — [nodejs.org](https://nodejs.org) |
| **npm** | Node ile birlikte gelir |
| **Development client** | İlk kez `npm run prebuild` + `npm run android` veya EAS dev build — bkz. [docs/NATIVE.md](docs/NATIVE.md) |
| **Android Studio** | Yerel Android build / emülatör için |
| **EAS hesabı** | Bulutta native build (SDK kurmadan APK) — [expo.dev](https://expo.dev) |

---

## İlk kurulum

Proje klasöründe (PowerShell):

```powershell
cd C:\Users\EXCALIBUR\Desktop\pilatesstudio
npm install
```

---

## Ortam değişkenleri (`.env`)

1. `env.example` dosyasını kopyalayıp proje kökünde **`.env`** adıyla kaydedin.
2. Supabase Dashboard → **Project Settings → API**:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon public** key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3. (İsteğe bağlı) `public.studios` tablosundaki bir satırın `id` değeri → `EXPO_PUBLIC_DEFAULT_STUDIO_ID`

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_DEFAULT_STUDIO_ID=uuid-buraya
```

**Önemli:**

- Expo yalnızca **`EXPO_PUBLIC_`** ile başlayan değişkenleri uygulamaya aktarır (`NEXT_PUBLIC_` kullanmayın).
- `.env` Git’e eklenmez (`.gitignore` içinde). Anahtarları asla commit etmeyin.
- `.env` değiştirdikten sonra Metro’yu önbelleksiz yeniden başlatın: `npx expo start -c`

---

## Supabase veritabanı

1. [supabase.com](https://supabase.com) üzerinde proje oluşturun.
2. **SQL Editor** → **New query** → `supabase/migrations/001_initial_schema.sql` dosyasının tamamını yapıştırın → **Run**.
3. **Table Editor → studios** → bir satır ekleyin (ör. ad: `Test Stüdyosu`).
4. O satırın **id** (UUID) değerini `.env` içindeki `EXPO_PUBLIC_DEFAULT_STUDIO_ID` alanına yazın.

Uygulamada **Özet** sekmesinde **Bulut (Supabase)** bölümü, URL + anon key + stüdyo ID doğruysa veri çeker.

---

## Geliştirme — projeyi başlatma

**Native (önerilen):** Önce bir kez development build — `docs/NATIVE.md`. Sonra:

```powershell
npm start
```

Metro, telefondaki **development client** uygulamanıza bağlanır (Expo Go değil).

Geçici olarak Expo Go ile denemek için:

```powershell
npm run start:go
```

TypeScript kontrolü:

```powershell
npx tsc --noEmit
```

---

## Build — native dağıtım

Tam akış: **[docs/NATIVE.md](docs/NATIVE.md)**

```powershell
npm run prebuild          # android/ ios/ üret
npm run android           # yerel debug (SDK gerekir)
npm run build:dev:android # EAS development APK
npm run build:preview:android
npm run build:production
```

Web (ikincil):

```powershell
npm run web
npx expo export -p web
```

---

## Git

```powershell
git status
git add .
git commit -m "mesaj"
```

`.env` commit edilmez. İlk commit öncesi (bir kez):

```powershell
git config user.name "Adın"
git config user.email "email@example.com"
```

---

## Proje yapısı (kısa)

```
app/              Expo Router ekranları (sekmeler, onboarding)
components/       UI ve formlar
context/          Yerel StudioContext (danışan / randevu)
features/         Clean Architecture: clients, sessions, packages, dashboard
lib/              env, Supabase client
supabase/         SQL migration
services/         AsyncStorage yardımcıları
```

---

## Sorun giderme

1. **Bulut bölümü görünmüyor** → `.env` içinde `EXPO_PUBLIC_SUPABASE_URL` ve `EXPO_PUBLIC_SUPABASE_ANON_KEY` dolu mu? Metro’yu `-c` ile yeniden başlatın.
2. **Stüdyo bağlantısı eksik** → `EXPO_PUBLIC_DEFAULT_STUDIO_ID` veya onboarding sonrası Zustand `currentStudioId`.
3. **Supabase istek hatası / RLS** → Migration’daki politikalar `authenticated` gerektirebilir; Auth eklenene kadar SQL Editor’de test verisi veya geçici politika gerekebilir.
4. **Bağımlılık / Metro hatası** → `rm -r node_modules; npm install` veya Windows’ta klasörü silip `npm install`, ardından `npx expo start -c`.

---

## Faydalı linkler

- [Expo dokümantasyonu](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Supabase](https://supabase.com/docs)
