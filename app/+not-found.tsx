import { Stack, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Screen } from '@/components/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { spacing } from '@/constants/theme';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Sayfa bulunamadı' }} />
      <Screen contentStyle={styles.container}>
        <AppText variant="title" style={styles.title}>
          Bu sayfa yok
        </AppText>
        <AppText variant="muted" style={styles.sub}>
          Adres yanlış olabilir veya sayfa taşınmış olabilir.
        </AppText>
        <AppButton label="Ana ekrana dön" onPress={() => router.replace('/')} />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxxl,
  },
  title: { textAlign: 'center' },
  sub: { marginTop: spacing.sm, marginBottom: spacing.xl, textAlign: 'center', maxWidth: 320 },
});
