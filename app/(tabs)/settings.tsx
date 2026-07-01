import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';

import { brand } from '@/constants/brand';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/ui/Card';
import { AppText } from '@/components/ui/AppText';
import { BrandMark, ProductLabel } from '@/components/ui/BrandMark';
import { PageHeader } from '@/components/ui/PageHeader';
import { spacing } from '@/constants/theme';
import { env, hasPublicPrivacyPolicyUrl } from '@/lib/env';
import { useAppColors } from '@/hooks/useAppColors';
import { clearOnboardingCompleted } from '@/services/onboardingStorage';

function SettingsLink({ label, onPress }: { label: string; onPress: () => void }) {
  const c = useAppColors();
  return (
    <Pressable onPress={onPress} style={styles.linkRow}>
      <AppText variant="body" style={{ color: c.primary, fontWeight: '600' }}>
        {label}
      </AppText>
      <AppText style={{ color: c.primary }}>→</AppText>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const c = useAppColors();
  const router = useRouter();
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const versionCode =
    Constants.expoConfig?.android?.versionCode ?? Constants.nativeBuildVersion ?? '—';

  const openSupport = () => {
    void Linking.openURL(`mailto:${env.supportEmail}?subject=OnBoard%20Health%20destek`);
  };

  const openPublicPrivacy = () => {
    if (hasPublicPrivacyPolicyUrl()) {
      void Linking.openURL(env.privacyPolicyUrl);
    }
  };

  const confirmResetOnboarding = () => {
    Alert.alert(
      'Kurulumu sıfırla',
      'Onboarding ekranına dönersiniz. Danışan ve randevu verileri silinmez.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sıfırla',
          style: 'destructive',
          onPress: async () => {
            await clearOnboardingCompleted();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  return (
    <Screen scroll>
      <View style={styles.brandRow}>
        <BrandMark size="sm" />
        <View style={{ flex: 1 }}>
          <ProductLabel showTagline={false} />
          <AppText variant="caption" muted style={{ marginTop: 2 }}>
            {brand.tagline}
          </AppText>
        </View>
      </View>

      <PageHeader
        title="Ayarlar"
        subtitle="Pilates stüdyosu ve fizyoterapi merkezi işletmecileri için yerel veri yönetimi."
      />

      <Card accent="primary" style={styles.card}>
        <AppText variant="subtitle">Stüdyo profili</AppText>
        <AppText variant="muted" style={styles.body}>
          Kurulumda girdiğiniz merkez adı, kapasite ve hizmet türleri özet ekranında kullanılır.
        </AppText>
        <SettingsLink label="Kurulumu yeniden başlat" onPress={confirmResetOnboarding} />
      </Card>

      <Card accent="clinical" style={styles.card}>
        <AppText variant="subtitle">Yasal & destek</AppText>
        <AppText variant="muted" style={styles.body}>
          Google Play ve KVKK uyumu için gizlilik politikasını inceleyin. Sorularınız için destek
          e-postası: {env.supportEmail}
        </AppText>
        <SettingsLink label="Gizlilik politikası (uygulama içi)" onPress={() => router.push('/privacy-policy')} />
        {hasPublicPrivacyPolicyUrl() ? (
          <SettingsLink label="Gizlilik politikası (web)" onPress={openPublicPrivacy} />
        ) : null}
        <SettingsLink label="Destek e-postası gönder" onPress={openSupport} />
      </Card>

      <Card style={styles.card}>
        <AppText variant="subtitle">Veri saklama</AppText>
        <AppText variant="muted" style={styles.body}>
          Danışan ve seans kayıtları yalnızca bu cihazda tutulur. Uygulamayı kaldırdığınızda yerel
          veriler silinir. Bulut yedekleme sonraki sürümlerde eklenecektir.
        </AppText>
      </Card>

      <Card style={styles.card}>
        <AppText variant="subtitle">Sürüm</AppText>
        <AppText variant="body" style={{ marginTop: spacing.sm }}>
          {brand.productFullName}
        </AppText>
        <AppText variant="muted" style={{ marginTop: spacing.xs }}>
          Sürüm {version} · Android build {String(versionCode)}
        </AppText>
        <AppText variant="caption" muted style={{ marginTop: spacing.sm }}>
          Paket: com.onboardhealth.app
        </AppText>
      </Card>

      <View style={{ height: spacing.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  card: { marginBottom: spacing.md },
  body: { marginTop: spacing.sm, lineHeight: 22 },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
  },
});
