import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { radius } from '@/constants/theme';
import { useAppColors } from '@/hooks/useAppColors';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
};

export function AppButton({ label, onPress, variant = 'primary', disabled, loading }: Props) {
  const c = useAppColors();
  const isGhost = variant === 'ghost';
  const isDanger = variant === 'danger';

  const bg = isGhost ? 'transparent' : isDanger ? c.danger : c.primary;
  const fg = isGhost ? c.primary : c.onPrimary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: bg,
          opacity: pressed ? 0.88 : disabled ? 0.45 : 1,
          borderWidth: isGhost ? 1.5 : 0,
          borderColor: isGhost ? c.primary : 'transparent',
        },
      ]}>
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={[styles.label, { color: fg }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  label: { fontSize: 16, fontWeight: '600' },
});
