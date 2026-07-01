import { StyleSheet, View, type ViewStyle } from 'react-native';

import { brand, type BrandSectorKey } from '@/constants/brand';
import { radius, spacing } from '@/constants/theme';
import type { StudioOnboardingProfile } from '@/types/studioProfile';
import { useAppColors } from '@/hooks/useAppColors';

import { AppText } from './AppText';
import { BrandMark, ProductLabel } from './BrandMark';

type Props = {
  studioName?: string;
  subtitle?: string;
  services?: StudioOnboardingProfile['services'];
  style?: ViewStyle;
};

function activeSectors(services?: StudioOnboardingProfile['services']): BrandSectorKey[] {
  if (services == null) return ['pilates', 'physiotherapy'];
  return (Object.keys(brand.sectors) as BrandSectorKey[]).filter((k) => services[k]);
}

export function StudioHeroHeader({ studioName, subtitle, services, style }: Props) {
  const c = useAppColors();
  const sectors = activeSectors(services);
  const displayName = studioName?.trim() || 'Stüdyonuz';

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: c.heroGradientStart,
          borderColor: c.border,
        },
        style,
      ]}>
      <View style={styles.topRow}>
        <BrandMark size="sm" />
        <ProductLabel />
      </View>

      <AppText variant="display" style={styles.studioName}>
        {displayName}
      </AppText>

      {subtitle != null && subtitle !== '' ? (
        <AppText variant="muted" style={styles.sub}>
          {subtitle}
        </AppText>
      ) : null}

      <View style={styles.pills}>
        {sectors.map((key) => (
          <View
            key={key}
            style={[
              styles.pill,
              {
                backgroundColor: key === 'physiotherapy' ? c.clinicalSubtle : c.primarySubtle,
                borderColor: key === 'physiotherapy' ? c.clinical : c.primary,
              },
            ]}>
            <AppText
              variant="caption"
              style={{
                color: key === 'physiotherapy' ? c.clinical : c.primary,
                fontWeight: '600',
              }}>
              {brand.sectors[key]}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: -spacing.xl,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRadius: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  studioName: { marginBottom: spacing.xs },
  sub: { lineHeight: 22, maxWidth: 520 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
