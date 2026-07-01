import { Pressable, StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { AppText } from '@/components/ui/AppText';
import { useAppColors } from '@/hooks/useAppColors';

import type { SessionEntity } from '@/features/sessions/types';

export type RiskyClientRow = { id: string; name: string; reason: string };

type Props = {
  todaySessions: SessionEntity[];
  riskyClients: RiskyClientRow[];
  onOpenSessions?: () => void;
  onOpenClient?: (clientId: string) => void;
};

export function DashboardView({
  todaySessions,
  riskyClients,
  onOpenSessions,
  onOpenClient,
}: Props) {
  const c = useAppColors();

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <AppText variant="subtitle">Bugünün seansları</AppText>
          {onOpenSessions != null ? (
            <Pressable onPress={onOpenSessions} hitSlop={8}>
              <AppText style={{ color: c.primary, fontWeight: '700' }}>Tümü</AppText>
            </Pressable>
          ) : null}
        </View>
        {todaySessions.length === 0 ? (
          <AppText variant="muted" style={{ marginTop: spacing.sm }}>
            Bugün için kayıtlı seans yok.
          </AppText>
        ) : (
          todaySessions.slice(0, 5).map((s) => (
            <View key={s.id} style={[styles.sessionRow, { borderTopColor: c.border }]}>
              <AppText variant="body" style={{ fontWeight: '600' }}>
                {new Date(s.scheduledAt).toLocaleTimeString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </AppText>
              <AppText variant="muted">{s.sessionType ?? 'Seans'}</AppText>
            </View>
          ))
        )}
      </Card>

      <Card style={styles.card}>
        <AppText variant="subtitle">Riskli / durgun danışanlar</AppText>
        <AppText variant="caption" muted style={{ marginTop: spacing.xs, marginBottom: spacing.sm }}>
          Son 21 günde seansı olmayan veya hiç kaydı olmayan danışanlar.
        </AppText>
        {riskyClients.length === 0 ? (
          <AppText variant="muted">Şu an liste boş.</AppText>
        ) : (
          riskyClients.map((r) => (
            <Pressable
              key={r.id}
              onPress={() => onOpenClient?.(r.id)}
              style={[styles.riskRow, { borderTopColor: c.border }]}
              disabled={onOpenClient == null}>
              <AppText variant="body" style={{ fontWeight: '600' }}>
                {r.name}
              </AppText>
              <AppText variant="caption" muted>
                {r.reason}
              </AppText>
            </Pressable>
          ))
        )}
      </Card>

      <Card style={styles.card}>
        <AppText variant="subtitle">Hızlı işlemler</AppText>
        <AppText variant="muted" style={{ marginTop: spacing.xs }}>
          Yeni danışan, yeni seans, paket satışı — sekmelerden erişin.
        </AppText>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  card: { padding: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  riskRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
