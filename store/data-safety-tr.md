# Google Play — Veri güvenliği formu cevapları (v1.0.0)

Play Console → **App content** → **Data safety** bölümünde aşağıdaki mantıkla doldurun. Kendi durumunuza göre uyarlayın.

---

## Veri toplanıyor mu?

**Evet** — kullanıcı (stüdyo işletmecisi) tarafından girilen iş / sağlık ile ilgili operasyonel veriler.

---

## Veri türleri

| Tür | Toplanır | Paylaşılır | Zorunlu | Amaç |
|-----|----------|------------|---------|------|
| Ad | Evet | Hayır | Evet (danışan kaydı) | Uygulama işlevi |
| E-posta | Evet | Hayır | Hayır | Uygulama işlevi |
| Telefon | Evet | Hayır | Hayır | Uygulama işlevi |
| Sağlık (kullanıcı girilen notlar) | Evet | Hayır | Hayır | Uygulama işlevi |
| Uygulama etkileşimleri | Hayır | — | — | — |
| Konum | Hayır | — | — | — |
| Finansal (kart) | Hayır | — | — | — |

**Not:** Supabase **yapılandırılmadıysa** veriler yalnızca cihazda kalır; “veri sunucuya gönderilir” sorusunda “isteğe bağlı / yapılandırmaya bağlı” deyin veya bulut kullanmıyorsanız “hayır, yalnızca cihazda” vurgulayın.

---

## Veri işleme

- **Şifreleme aktarımda:** Supabase kullanılıyorsa HTTPS (evet). Yalnızca yerel: N/A veya “cihazda”.
- **Silme:** Kullanıcı uygulamayı kaldırarak yerel veriyi silebilir.
- **Hesap oluşturma:** v1’de zorunlu hesap yok (opsiyonel Supabase auth ileride).

---

## Güvenlik uygulamaları

- Veriler varsayılan olarak cihazda
- Hassas küçük anahtarlar için Android EncryptedSharedPreferences / Keychain (SecureStore)
- `allowBackup: false` (Android yedekleme kapalı)

---

## Reklam

Uygulama reklam içermez → **No ads**

---

## Hedef kitle

İşletme kullanıcıları; çocuklara yönelik değil.
