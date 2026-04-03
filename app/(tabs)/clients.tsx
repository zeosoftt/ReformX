import { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';

import { AppointmentFormModal } from '@/components/AppointmentFormModal';
import { ClientRegistrationWizard } from '@/components/clients/ClientRegistrationWizard';
import { Fab } from '@/components/Fab';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { useStudio } from '@/context/StudioContext';
import { useAppColors } from '@/hooks/useAppColors';
import { baselineSummary, clientGoalLabel, type Client } from '@/types/studio';
import { getPackageRemaining, rolloverClientPackage } from '@/utils/packagePeriod';

export default function ClientsScreen() {
  const c = useAppColors();
  const { ready, state, addClient, updateClient, removeClient, addAppointment } = useStudio();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [quickApptClient, setQuickApptClient] = useState<Client | null>(null);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (client: Client) => {
    setEditing(client);
    setFormOpen(true);
  };

  const onSubmit = (data: Omit<Client, 'id' | 'createdAt'>) => {
    if (editing) updateClient(editing.id, data);
    else addClient(data);
  };

  const confirmDelete = (client: Client) => {
    Alert.alert('Danışanı sil', `${client.name} silinsin mi?`, [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => removeClient(client.id) },
    ]);
  };

  if (!ready) {
    return (
      <Screen>
        <View style={styles.center}>
          <AppText>Yükleniyor…</AppText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="title">Danışanlar</AppText>
        <AppText variant="muted" style={{ marginTop: 4 }}>
          Paket, hedefler ve iletişim bilgileri.
        </AppText>
      </View>
      <FlatList
        style={styles.listFlex}
        data={state.clients}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Card>
            <AppText muted>Henüz danışan yok. Sağ alttaki + ile ekleyin.</AppText>
          </Card>
        }
        renderItem={({ item }) => {
          const rolled = rolloverClientPackage(item);
          const remaining = getPackageRemaining(rolled);
          const total = rolled.packageKind;
          const used = total != null ? rolled.packageSessionsUsed : 0;
          const pct = total && total > 0 ? Math.min(100, (used / total) * 100) : 0;
          const baselineText = baselineSummary(item.baseline);

          return (
            <Card style={styles.rowCard}>
              <Pressable onPress={() => openEdit(item)} onLongPress={() => confirmDelete(item)}>
                <View style={styles.rowHead}>
                  <AppText variant="subtitle">{item.name}</AppText>
                  <Pressable
                    onPress={() => setQuickApptClient(item)}
                    hitSlop={8}
                    style={styles.quickAppt}>
                    <AppText variant="caption" style={{ color: c.primary, fontWeight: '600' }}>
                      Randevu
                    </AppText>
                  </Pressable>
                </View>
                {total != null && remaining != null && (
                  <View style={styles.pkgBlock}>
                    <View style={styles.pkgLine}>
                      <AppText variant="caption" style={{ color: c.textSecondary, fontWeight: '600' }}>
                        Bu ay · {total} seanslık paket
                      </AppText>
                      <AppText variant="caption" style={{ color: c.primary, fontWeight: '700' }}>
                        Kalan {remaining}
                      </AppText>
                    </View>
                    <View style={[styles.progressTrack, { backgroundColor: c.border }]}>
                      <View
                        style={[styles.progressFill, { width: `${pct}%`, backgroundColor: c.primary }]}
                      />
                    </View>
                  </View>
                )}
                {baselineText != null && (
                  <AppText variant="caption" muted style={{ marginTop: 8, lineHeight: 18 }}>
                    Başlangıç: {baselineText}
                  </AppText>
                )}
                {item.goals.length > 0 && (
                  <View style={styles.goalsRow}>
                    {item.goals.map((gid) => (
                      <View
                        key={gid}
                        style={[styles.goalPill, { borderColor: c.border, backgroundColor: c.primary + '14' }]}>
                        <AppText style={{ fontSize: 11, fontWeight: '600', color: c.primary }}>
                          {clientGoalLabel(gid)}
                        </AppText>
                      </View>
                    ))}
                  </View>
                )}
                {!!item.phone && (
                  <AppText variant="muted" style={{ marginTop: 4 }}>
                    {item.phone}
                  </AppText>
                )}
                {!!item.email && (
                  <AppText variant="caption" muted style={{ marginTop: 2 }}>
                    {item.email}
                  </AppText>
                )}
              </Pressable>
            </Card>
          );
        }}
      />
      <Fab onPress={openNew} />

      <ClientRegistrationWizard
        visible={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={onSubmit}
        initial={editing}
        title={editing ? 'Danışanı düzenle' : 'Danışan kaydı'}
      />

      <AppointmentFormModal
        visible={!!quickApptClient}
        onClose={() => setQuickApptClient(null)}
        clients={state.clients}
        initial={null}
        defaultClientId={quickApptClient?.id ?? null}
        title="Randevu ekle"
        onSubmit={(data) => addAppointment(data)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  listFlex: { flex: 1 },
  list: { paddingHorizontal: 20, paddingBottom: 96, gap: 10 },
  rowCard: { marginBottom: 0 },
  rowHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickAppt: { paddingVertical: 4, paddingHorizontal: 8 },
  goalsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  goalPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pkgBlock: { marginTop: 10 },
  pkgLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
