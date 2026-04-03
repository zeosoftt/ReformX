import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { useAppColors } from '@/hooks/useAppColors';
import type { Appointment, Client, SessionKind } from '@/types/studio';

import { formatDateTime } from '@/utils/dateLocale';

import { AppButton } from './ui/AppButton';
import { AppText } from './ui/AppText';

const SESSIONS: SessionKind[] = [
  'Mat',
  'Reformer',
  'Özel',
  'Duo',
  'Kafa masajı',
  'Fizyoterapi',
  'Diğer',
];

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Appointment, 'id'>) => void;
  clients: Client[];
  /** Var olan randevuyu düzenlerken doldurulur */
  initial?: Appointment | null;
  /** Yeni randevuda seçili danışan */
  defaultClientId?: string | null;
  title: string;
};

export function AppointmentFormModal({
  visible,
  onClose,
  onSubmit,
  clients,
  initial,
  defaultClientId,
  title,
}: Props) {
  const c = useAppColors();
  const [clientId, setClientId] = useState<string | null>(null);
  const [when, setWhen] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [duration, setDuration] = useState('55');
  const [sessionType, setSessionType] = useState<SessionKind>('Reformer');
  const [notes, setNotes] = useState('');
  const [clientListOpen, setClientListOpen] = useState(false);

  useEffect(() => {
    if (visible) {
      if (initial) {
        setClientId(initial.clientId);
        setWhen(new Date(initial.startAt));
        setDuration(String(initial.durationMinutes));
        setSessionType(initial.sessionType);
        setNotes(initial.notes);
      } else {
        const pref = defaultClientId ?? clients[0]?.id ?? null;
        setClientId(pref);
        setWhen(new Date());
        setDuration('55');
        setSessionType('Reformer');
        setNotes('');
      }
      setShowPicker(false);
    }
  }, [visible, initial, defaultClientId, clients]);

  const selectedClient = clients.find((x) => x.id === clientId);

  const save = () => {
    if (!clientId) return;
    const mins = Math.max(15, parseInt(duration, 10) || 55);
    onSubmit({
      clientId,
      startAt: when.toISOString(),
      durationMinutes: mins,
      sessionType,
      notes: notes.trim(),
      attendance: initial?.attendance ?? 'unset',
      packageCreditApplied: initial?.packageCreditApplied ?? false,
    });
    onClose();
  };

  const onDateChange = (_: unknown, date?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (date) setWhen(date);
  };

  const inputStyle = [styles.input, { color: c.text, borderColor: c.border, backgroundColor: c.background }];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: c.surface }]}>
          <View style={styles.handle} />
          <AppText variant="title" style={styles.sheetTitle}>
            {title}
          </AppText>

          <AppText variant="caption" muted style={styles.label}>
            Danışan *
          </AppText>
          <Pressable
            onPress={() => setClientListOpen(true)}
            style={[styles.input, styles.selectBtn, { borderColor: c.border, backgroundColor: c.background }]}>
            <AppText>{selectedClient?.name ?? 'Seçin'}</AppText>
          </Pressable>

          <AppText variant="caption" muted style={styles.label}>
            Tarih ve saat
          </AppText>
          <Pressable
            onPress={() => setShowPicker(true)}
            style={[styles.input, styles.selectBtn, { borderColor: c.border, backgroundColor: c.background }]}>
            <AppText>{formatDateTime(when.toISOString())}</AppText>
          </Pressable>

          {showPicker && (
            <DateTimePicker
              value={when}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={onDateChange}
            />
          )}
          {Platform.OS === 'ios' && showPicker && (
            <AppButton label="Kapat" variant="ghost" onPress={() => setShowPicker(false)} />
          )}

          <AppText variant="caption" muted style={styles.label}>
            Süre (dakika)
          </AppText>
          <TextInput
            value={duration}
            onChangeText={setDuration}
            keyboardType="number-pad"
            style={inputStyle}
          />

          <AppText variant="caption" muted style={styles.label}>
            Seans türü
          </AppText>
          <View style={styles.chips}>
            {SESSIONS.map((s) => (
              <Pressable
                key={s}
                onPress={() => setSessionType(s)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: sessionType === s ? c.primary : c.background,
                    borderColor: c.border,
                  },
                ]}>
                <AppText
                  style={{
                    color: sessionType === s ? '#fff' : c.text,
                    fontWeight: '600',
                    fontSize: 14,
                  }}>
                  {s}
                </AppText>
              </Pressable>
            ))}
          </View>

          <AppText variant="caption" muted style={styles.label}>
            Notlar
          </AppText>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder="Stüdyo notu..."
            placeholderTextColor={c.textMuted}
            style={[inputStyle, styles.multiline]}
          />

          <View style={styles.actions}>
            <AppButton label="İptal" variant="ghost" onPress={onClose} />
            <View style={{ width: 12 }} />
            <AppButton label="Kaydet" onPress={save} disabled={!clientId} />
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={clientListOpen} transparent animationType="fade">
        <Pressable style={styles.listBackdrop} onPress={() => setClientListOpen(false)} />
        <View style={[styles.listSheet, { backgroundColor: c.surface }]}>
          <AppText variant="subtitle" style={{ marginBottom: 12 }}>
            Danışan seç
          </AppText>
          <FlatList
            data={clients}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.listRow}
                onPress={() => {
                  setClientId(item.id);
                  setClientListOpen(false);
                }}>
                <AppText>{item.name}</AppText>
              </Pressable>
            )}
            ListEmptyComponent={<AppText muted>Önce danışan ekleyin.</AppText>}
          />
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    maxHeight: '94%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(128,128,128,0.35)',
    marginBottom: 16,
  },
  sheetTitle: { marginBottom: 12 },
  label: { marginBottom: 6, marginTop: 8 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  selectBtn: { justifyContent: 'center' },
  multiline: { minHeight: 72, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  actions: { flexDirection: 'row', marginTop: 20 },
  listBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  listSheet: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: '22%',
    maxHeight: '55%',
    borderRadius: 16,
    padding: 16,
  },
  listRow: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.25)',
  },
});
