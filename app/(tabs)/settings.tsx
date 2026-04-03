import Constants from 'expo-constants';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Card } from '@/components/ui/Card';
import { AppText } from '@/components/ui/AppText';

export default function SettingsScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <Screen scroll>
      <AppText variant="title" style={styles.headline}>
        Ayarlar
      </AppText>
      <AppText variant="muted" style={styles.sub}>
        Uygulama yerel olarak verilerinizi cihazda saklar. İleride bulut yedekleme eklenebilir.
      </AppText>

      <Card style={styles.card}>
        <AppText variant="subtitle">Stüdyo profili</AppText>
        <AppText variant="muted" style={{ marginTop: 10, lineHeight: 22 }}>
          İlk kurulumda seçtiğiniz kapasite, hizmetler ve öncelikler özet ekranında kullanılır. Profili
          yeniden düzenlemek için (ileride) bu ekrandan veya uygulama verisini sıfırlayarak onboarding’i
          tekrarlayabilirsiniz.
        </AppText>
      </Card>

      <Card style={styles.card}>
        <AppText variant="subtitle">Gizlilik</AppText>
        <AppText variant="muted" style={{ marginTop: 10, lineHeight: 22 }}>
          Danışan ve randevu bilgileri yalnızca bu telefonda tutulur. Paylaşım veya analiz için veri
          gönderilmez.
        </AppText>
      </Card>

      <Card style={styles.card}>
        <AppText variant="subtitle">Sürüm</AppText>
        <AppText variant="body" style={{ marginTop: 8 }}>
          Pilates Stüdyo · {version}
        </AppText>
      </Card>

      <Card style={styles.card}>
        <AppText variant="subtitle">İpuçları</AppText>
        <AppText variant="muted" style={{ marginTop: 10, lineHeight: 22 }}>
          • Danışan satırına uzun basarak silebilirsiniz.{'\n'}• Randevu satırına uzun basarak
          silebilirsiniz.{'\n'}• Sistem teması (açık/koyu) cihaz ayarlarından izlenir.
        </AppText>
      </Card>

      <View style={{ height: 40 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headline: { paddingHorizontal: 20, marginBottom: 4 },
  sub: { paddingHorizontal: 20, marginBottom: 20 },
  card: { marginHorizontal: 20, marginBottom: 12 },
});
