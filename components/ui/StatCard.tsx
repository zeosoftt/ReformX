import { StyleSheet, View, type ViewStyle } from 'react-native';

import { spacing } from '@/constants/theme';
import { useAppColors } from '@/hooks/useAppColors';

import { AppText } from './AppText';
import { Card } from './Card';

type Props = {
  label: string;
  value: string | number;
  hint?: string;
  accentColor?: string;
  style?: ViewStyle;
};

export function StatCard({ label, value, hint, accentColor, style }: Props) {
  const c = useAppColors();
  const valueColor = accentColor ?? c.text;

  return (
    <Card style={[styles.card, style]}>
      <AppText variant="caption" muted>
        {label}
      </AppText>
      <AppText variant="title" style={[styles.value, { color: valueColor, fontSize: 32 }]}>
        {value}
      </AppText>
      {hint != null && hint !== '' ? (
        <AppText variant="caption" muted style={styles.hint}>
          {hint}
        </AppText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minHeight: 112 },
  value: { marginTop: spacing.sm },
  hint: { marginTop: spacing.xs },
});
