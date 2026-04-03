import { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';

import { AppointmentFormModal } from '@/components/AppointmentFormModal';
import { Fab } from '@/components/Fab';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { useStudio } from '@/context/StudioContext';
import type { Appointment } from '@/types/studio';
import { useAppColors } from '@/hooks/useAppColors';
import { formatDateTime } from '@/utils/dateLocale';

export default function AppointmentsScreen() {
  const c = useAppColors();
  const { ready, state, addAppointment, updateAppointment, removeAppointment } = useStudio();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);

  const sorted = useMemo(
    () =>
      [...state.appointments].sort(
        (a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
      ),
    [state.appointments]
  );

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (a: Appointment) => {
    setEditing(a);
    setFormOpen(true);
  };

  const onSubmit = (data: Omit<Appointment, 'id'>) => {
    if (editing) updateAppointment(editing.id, data);
    else addAppointment(data);
  };

  const confirmDelete = (a: Appointment) => {
    const name = state.clients.find((x) => x.id === a.clientId)?.name ?? 'Randevu';
    Alert.alert('Randevuyu sil', `${name} — ${formatDateTime(a.startAt)}`, [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => removeAppointment(a.id) },
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
        <AppText variant="title">Randevular</AppText>
        <AppText variant="muted" style={{ marginTop: 4 }}>
          Tüm seanslar; düzenlemek için dokunun.
        </AppText>
      </View>
      <FlatList
        style={styles.listFlex}
        data={sorted}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Card>
            <AppText muted>Henüz randevu yok. + ile ekleyin veya danışan kartından hızlı randevu açın.</AppText>
          </Card>
        }
        renderItem={({ item }) => {
          const client = state.clients.find((x) => x.id === item.clientId);
          return (
            <Card style={styles.rowCard}>
              <Pressable onPress={() => openEdit(item)} onLongPress={() => confirmDelete(item)}>
                <View style={styles.rowHead}>
                  <AppText variant="subtitle">{client?.name ?? 'Danışan'}</AppText>
                  <AppText variant="caption" style={{ color: c.primary, fontWeight: '700' }}>
                    {item.sessionType}
                  </AppText>
                </View>
                <AppText variant="body" style={{ marginTop: 8 }}>
                  {formatDateTime(item.startAt)}
                </AppText>
                <AppText variant="muted" style={{ marginTop: 4 }}>
                  {item.durationMinutes} dakika
                  {item.notes ? ` · ${item.notes}` : ''}
                </AppText>
              </Pressable>
            </Card>
          );
        }}
      />
      <Fab onPress={openNew} />

      <AppointmentFormModal
        visible={formOpen}
        onClose={() => setFormOpen(false)}
        clients={state.clients}
        initial={editing}
        title={editing ? 'Randevuyu düzenle' : 'Yeni randevu'}
        onSubmit={onSubmit}
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
});
