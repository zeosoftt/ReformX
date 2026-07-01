import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, View } from 'react-native';

import { brand } from '@/constants/brand';
import { radius, spacing } from '@/constants/theme';
import { useAppColors } from '@/hooks/useAppColors';

import { AppText } from './AppText';

type Size = 'sm' | 'md' | 'lg';

type Props = {
  size?: Size;
};

const sizes: Record<Size, { box: number; icon: number; font: number }> = {
  sm: { box: 36, icon: 16, font: 14 },
  md: { box: 48, icon: 20, font: 16 },
  lg: { box: 64, icon: 28, font: 20 },
};

/** Ürün monogramı — pilates + fizyoterapi B2B */
export function BrandMark({ size = 'md' }: Props) {
  const c = useAppColors();
  const s = sizes[size];

  return (
    <View
      style={[
        styles.wrap,
        {
          width: s.box,
          height: s.box,
          borderRadius: radius.lg,
          backgroundColor: c.primary,
          borderColor: c.primarySubtle,
        },
      ]}>
      <FontAwesome name="heartbeat" size={s.icon} color={c.onPrimary} />
    </View>
  );
}

type ProductLabelProps = {
  showTagline?: boolean;
};

export function ProductLabel({ showTagline = true }: ProductLabelProps) {
  const c = useAppColors();
  return (
    <View>
      <AppText variant="label" style={{ color: c.primary }}>
        {brand.productName.toUpperCase()}
      </AppText>
      {showTagline ? (
        <AppText variant="caption" muted style={{ marginTop: 2 }}>
          {brand.tagline}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});
