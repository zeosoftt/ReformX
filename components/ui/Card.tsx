import { StyleSheet, View, type ViewProps } from 'react-native';

import { radius, shadows, spacing } from '@/constants/theme';
import { useAppColors } from '@/hooks/useAppColors';

type Props = ViewProps & {
  elevated?: boolean;
  /** Sol kenar vurgusu — sektör / klinik kartları */
  accent?: 'primary' | 'accent' | 'clinical' | 'none';
};

export function Card({ style, children, elevated, accent = 'none', ...rest }: Props) {
  const c = useAppColors();
  const accentColor =
    accent === 'clinical' ? c.clinical : accent === 'accent' ? c.accent : c.primary;

  return (
    <View
      style={[
        styles.card,
        shadows.card,
        {
          backgroundColor: elevated ? c.surfaceElevated : c.surface,
          borderColor: c.borderNeutral,
          shadowColor: c.text,
        },
        accent !== 'none' && {
          borderLeftWidth: 3,
          borderLeftColor: accentColor,
        },
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg,
  },
});
