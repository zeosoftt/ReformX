import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { radius, spacing } from '@/constants/theme';
import { AppText } from '@/components/ui/AppText';
import { useAppColors } from '@/hooks/useAppColors';

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function TextField({ label, error, style, ...rest }: Props) {
  const c = useAppColors();
  return (
    <View style={styles.wrap}>
      <AppText variant="caption" muted style={styles.label}>
        {label}
      </AppText>
      <TextInput
        placeholderTextColor={c.textMuted}
        style={[
          styles.input,
          {
            color: c.text,
            borderColor: error ? c.danger : c.border,
            backgroundColor: c.surface,
          },
          style,
        ]}
        {...rest}
      />
      {error != null && error !== '' ? (
        <AppText variant="caption" style={{ color: c.danger, marginTop: spacing.xs }}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: { marginBottom: 6 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
});
