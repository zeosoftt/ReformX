import { StyleSheet, View } from 'react-native';

import { brand } from '@/constants/brand';
import { env } from '@/lib/env';
import { spacing } from '@/constants/theme';
import { AppText } from '@/components/ui/AppText';

const LAST_UPDATED = '2 Nisan 2026';

export function PrivacyPolicyContent() {
  const email = env.supportEmail;

  return (
    <View style={styles.wrap}>
      <AppText variant="caption" muted>
        Son güncelleme: {LAST_UPDATED}
      </AppText>

      <AppText variant="subtitle" style={styles.h}>
        1. Giriş
      </AppText>
      <AppText variant="muted" style={styles.p}>
        {brand.productFullName} (&quot;OnBoard Health&quot;), pilates stüdyoları ve fizyoterapi merkezlerinin
        danışan, seans ve paket bilgilerini yönetmesine yardımcı olan bir mobil uygulamadır. Bu
        politika, uygulamayı kullanırken hangi verilerin işlendiğini açıklar.
      </AppText>

      <AppText variant="subtitle" style={styles.h}>
        2. Veri sorumlusu
      </AppText>
      <AppText variant="muted" style={styles.p}>
        Sorularınız için: {email}
      </AppText>

      <AppText variant="subtitle" style={styles.h}>
        3. Toplanan veriler
      </AppText>
      <AppText variant="muted" style={styles.p}>
        Uygulama, stüdyo işletmecisi tarafından girilen verileri işler:{'\n'}• Danışan adı, telefon,
        e-posta{'\n'}• Seans / randevu tarihleri ve notları{'\n'}• Paket ve ödeme tercihleri (yerel
        kayıt){'\n'}• İsteğe bağlı sağlık / ölçüm notları (fizyoterapi bağlamında){'\n'}• Stüdyo
        profil bilgileri (ad, kapasite, hizmet türleri)
      </AppText>

      <AppText variant="subtitle" style={styles.h}>
        4. Verilerin saklanması
      </AppText>
      <AppText variant="muted" style={styles.p}>
        Varsayılan olarak veriler yalnızca cihazınızda saklanır (AsyncStorage ve güvenli depolama).
        İsteğe bağlı Supabase bulut bağlantısı yapılandırılırsa, stüdyo verileri Supabase
        altyapısına aktarılabilir; bu durumda Supabase&apos;in gizlilik koşulları da geçerlidir.
      </AppText>

      <AppText variant="subtitle" style={styles.h}>
        5. Üçüncü taraflar
      </AppText>
      <AppText variant="muted" style={styles.p}>
        Uygulama reklam veya analiz SDK&apos;sı içermez. Supabase kullanılıyorsa veri barındırma
        Supabase Inc. üzerinden yapılır. Google Play hizmetleri mağaza dağıtımı için Google tarafından
        sağlanır.
      </AppText>

      <AppText variant="subtitle" style={styles.h}>
        6. Haklarınız (KVKK / GDPR)
      </AppText>
      <AppText variant="muted" style={styles.p}>
        Verilerinize erişim, düzeltme ve silme taleplerinizi {email} adresine iletebilirsiniz. Yerel
        verileri uygulama ayarlarından veya uygulamayı kaldırarak silebilirsiniz.
      </AppText>

      <AppText variant="subtitle" style={styles.h}>
        7. Çocuklar
      </AppText>
      <AppText variant="muted" style={styles.p}>
        Uygulama işletme kullanımı içindir; 13 yaş altı bireylere yönelik değildir.
      </AppText>

      <AppText variant="subtitle" style={styles.h}>
        8. Değişiklikler
      </AppText>
      <AppText variant="muted" style={styles.p}>
        Bu politika güncellenebilir. Önemli değişiklikler uygulama veya destek kanalları üzerinden
        duyurulur.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  h: { marginTop: spacing.lg },
  p: { marginTop: spacing.xs, lineHeight: 22 },
});
