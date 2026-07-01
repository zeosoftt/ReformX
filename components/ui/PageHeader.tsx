import { StyleSheet, View, type ViewStyle } from 'react-native';

import { spacing } from '@/constants/theme';

import { AppText } from './AppText';

type Props = {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
};

export function PageHeader({ title, subtitle, style }: Props) {
  return (
    <View style={[styles.wrap, style]}>
      <AppText variant="title">{title}</AppText>
      {subtitle != null && subtitle !== '' ? (
        <AppText variant="muted" style={styles.sub}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  sub: { marginTop: spacing.xs },
});
