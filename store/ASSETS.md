# Play Store görsel gereksinimleri

## Zorunlu / önerilen boyutlar

| Varlık | Boyut | Dosya | Not |
|--------|-------|-------|-----|
| Uygulama simgesi (Play) | **512×512** PNG | Yükleyeceğiniz ayrı dosya | `assets/images/icon.png` kaynağından export |
| Adaptive icon (APK içi) | 1024×1024 fg | `assets/images/adaptive-icon.png` | Zaten projede |
| Öne çıkan grafik | **1024×500** PNG/JPG | `store/graphics/feature-graphic.png` | Oluşturmanız gerekir |
| Telefon ekran görüntüsü | min **2 adet** | PNG veya JPG | 1080×1920 veya cihaz çözünürlüğü |
| 7" tablet (opsiyonel) | 2+ | | |
| 10" tablet (opsiyonel) | 2+ | | |

## Öne çıkan grafik tasarım ipuçları

- Arka plan: `#F8F5F0` (marka parşömen)
- Metin: **OnBoard Health** + *Pilates & fizyoterapi merkezleri için*
- Sage yeşili `#1E6658` vurgu
- Figma / Canva ile 1024×500 export

## Ekran görüntüsü sırası (önerilen)

1. Özet panel (StudioHeroHeader görünür)
2. Danışanlar listesi
3. Seans / randevu listesi
4. Onboarding (opsiyonel)

Production veya preview APK ile gerçek cihazda alın; emülatör de olur.

## Mevcut proje varlıkları

```
assets/images/icon.png           → Play 512 export kaynağı
assets/images/adaptive-icon.png  → Android launcher
assets/images/splash-icon.png    → Splash
assets/images/favicon.png        → Web only
```

Simge kalitesi düşükse 1024×1024 vektör veya yüksek çözünürlüklü logo ile değiştirin.
