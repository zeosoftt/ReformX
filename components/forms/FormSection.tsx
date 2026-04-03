import { StyleSheet, View, type ViewProps } from 'react-native';

import { AppText } from '@/components/ui/AppText';

type Props = ViewProps & {
  title: string;
  /** kısa açıklama */
  subtitle?: string;
  children: React.ReactNode;
};

export function FormSection({ title, subtitle, children, style, ...rest }: Props) {
  return (
    <View style={[styles.wrap, style]} {...rest}>
      <AppText variant="subtitle" style={{ marginBottom: subtitle ? 4 : 10 }}>
        {title}
      </AppText>
      {subtitle != null && subtitle !== '' ? (
        <AppText variant="caption" muted style={{ marginBottom: 10 }}>
          {subtitle}
        </AppText>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
});
