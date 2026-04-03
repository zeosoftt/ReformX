import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

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
            backgroundColor: c.background,
          },
          style,
        ]}
        {...rest}
      />
      {error != null && error !== '' ? (
        <AppText variant="caption" style={{ color: c.danger, marginTop: 4 }}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { marginBottom: 6 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
});
