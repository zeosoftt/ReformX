import { Pressable, StyleSheet, Text } from 'react-native';

import { radius, spacing } from '@/constants/theme';
import { useAppColors } from '@/hooks/useAppColors';

type Variant = 'neutral' | 'primary' | 'success' | 'danger';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  variant?: Variant;
};

export function Chip({ label, selected = false, onPress, variant = 'neutral' }: Props) {
  const c = useAppColors();

  const palette = (() => {
    switch (variant) {
      case 'success':
        return { bg: c.successSubtle, border: c.success, text: c.success, fill: c.success };
      case 'danger':
        return { bg: c.dangerSubtle, border: c.danger, text: c.danger, fill: c.danger };
      case 'primary':
        return { bg: c.primarySubtle, border: c.primary, text: c.primary, fill: c.primary };
      default:
        return { bg: c.surface, border: c.border, text: c.text, fill: c.primary };
    }
  })();

  const filled = selected;
  const bg = filled ? palette.fill : palette.bg;
  const fg = filled ? (variant === 'danger' ? c.onDanger : c.onPrimary) : palette.text;
  const borderColor = filled ? palette.fill : palette.border;

  return (
    <Pressable
      onPress={onPress}
      disabled={onPress == null}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: bg,
          borderColor,
          opacity: pressed ? 0.88 : 1,
        },
      ]}
      accessibilityRole={onPress != null ? 'button' : undefined}
      accessibilityState={{ selected }}>
      <Text style={[styles.label, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: { fontSize: 13, fontWeight: '600' },
});
