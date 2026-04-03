import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppColors } from '@/hooks/useAppColors';
import {
  CLIENT_GOAL_OPTIONS,
  type Client,
  type ClientGoalId,
  type PackageKind,
} from '@/types/studio';
import { periodKeyFromDate, rolloverClientPackage } from '@/utils/packagePeriod';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';

const TOTAL_STEPS = 4;

const STEP_HINTS = [
  'Ad ve iletişim bilgileri',
  'Aylık paket seçimi',
  'Başlangıç ölçümü (isteğe bağlı)',
  'Hedefler ve notlar',
];

const PACKAGE_OPTIONS: { kind: PackageKind; label: string }[] = [
  { kind: 8, label: '8 seans / ay' },
  { kind: 12, label: '12 seans / ay' },
];

export type ClientRegistrationWizardProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Client, 'id' | 'createdAt'>) => void;
  initial?: Client | null;
  title: string;
};

function parseOptionalMeasurement(s: string): number | null {
  const t = s.trim().replace(',', '.');
  if (!t) return null;
  const n = parseFloat(t);
  return Number.isFinite(n) ? n : null;
}

export function ClientRegistrationWizard({
  visible,
  onClose,
  onSubmit,
  initial,
  title,
}: ClientRegistrationWizardProps) {
  const c = useAppColors();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [packageKind, setPackageKind] = useState<PackageKind | null>(null);
  const [goals, setGoals] = useState<ClientGoalId[]>([]);
  const [weightStr, setWeightStr] = useState('');
  const [heightStr, setHeightStr] = useState('');
  const [waistStr, setWaistStr] = useState('');
  const [hipStr, setHipStr] = useState('');
  const [fatStr, setFatStr] = useState('');

  useEffect(() => {
    if (visible) {
      setStep(0);
      setName(initial?.name ?? '');
      setPhone(initial?.phone ?? '');
      setEmail(initial?.email ?? '');
      setNotes(initial?.notes ?? '');
      setPackageKind(initial?.packageKind ?? null);
      setGoals(initial?.goals ?? []);
      const bl = initial?.baseline;
      setWeightStr(bl?.weightKg != null ? String(bl.weightKg) : '');
      setHeightStr(bl?.heightCm != null ? String(bl.heightCm) : '');
      setWaistStr(bl?.waistCm != null ? String(bl.waistCm) : '');
      setHipStr(bl?.hipCm != null ? String(bl.hipCm) : '');
      setFatStr(bl?.bodyFatPercent != null ? String(bl.bodyFatPercent) : '');
    }
  }, [visible, initial]);

  const toggleGoal = (id: ClientGoalId) => {
    setGoals((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]));
  };

  const handleSave = () => {
    if (!name.trim()) return;

    let pkg: Pick<Client, 'packageKind' | 'packagePeriodKey' | 'packageSessionsUsed'>;
    if (!packageKind) {
      pkg = { packageKind: null, packagePeriodKey: null, packageSessionsUsed: 0 };
    } else if (
      initial &&
      initial.packageKind === packageKind &&
      initial.packagePeriodKey
    ) {
      const rolled = rolloverClientPackage(initial);
      pkg = {
        packageKind,
        packagePeriodKey: rolled.packagePeriodKey,
        packageSessionsUsed: rolled.packageSessionsUsed,
      };
    } else {
      pkg = {
        packageKind,
        packagePeriodKey: periodKeyFromDate(),
        packageSessionsUsed: 0,
      };
    }

    onSubmit({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      notes: notes.trim(),
      goals,
      baseline: {
        weightKg: parseOptionalMeasurement(weightStr),
        heightCm: parseOptionalMeasurement(heightStr),
        waistCm: parseOptionalMeasurement(waistStr),
        hipCm: parseOptionalMeasurement(hipStr),
        bodyFatPercent: parseOptionalMeasurement(fatStr),
      },
      ...pkg,
    });
    onClose();
  };

  const canGoNext = () => {
    if (step === 0) return name.trim().length > 0;
    return true;
  };

  const goNext = () => {
    if (!canGoNext()) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const inputStyle = [styles.input, { color: c.text, borderColor: c.border, backgroundColor: c.background }];
  const progress = (step + 1) / TOTAL_STEPS;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <SafeAreaView style={[styles.root, { backgroundColor: c.background }]} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={8}>
          <View style={styles.topBar}>
            {step > 0 ? (
              <Pressable onPress={goBack} hitSlop={12} accessibilityLabel="Geri">
                <FontAwesome name="chevron-left" size={22} color={c.primary} />
              </Pressable>
            ) : (
              <View style={{ width: 28 }} />
            )}
            <View style={[styles.progressTrack, { backgroundColor: c.border }]}>
              <View
                style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: c.primary }]}
              />
            </View>
            <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Kapat">
              <AppText style={{ color: c.primary, fontWeight: '700' }}>Kapat</AppText>
            </Pressable>
          </View>

          <View style={styles.stepHeader}>
            <AppText variant="caption" style={{ color: c.textSecondary, fontWeight: '600' }}>
              Adım {step + 1} / {TOTAL_STEPS}
            </AppText>
            <AppText variant="title" style={{ marginTop: 4 }}>
              {title}
            </AppText>
            <AppText variant="muted" style={{ marginTop: 4 }}>
              {STEP_HINTS[step]}
            </AppText>
          </View>

          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {step === 0 && (
              <>
                <AppText variant="caption" muted style={styles.label}>
                  Ad soyad *
                </AppText>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Örn. Ayşe Yılmaz"
                  placeholderTextColor={c.textMuted}
                  style={inputStyle}
                />
                <AppText variant="caption" muted style={styles.label}>
                  Telefon
                </AppText>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="+90 ..."
                  placeholderTextColor={c.textMuted}
                  style={inputStyle}
                />
                <AppText variant="caption" muted style={styles.label}>
                  E-posta
                </AppText>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="ornek@mail.com"
                  placeholderTextColor={c.textMuted}
                  style={inputStyle}
                />
              </>
            )}

            {step === 1 && (
              <>
                <AppText variant="muted" style={{ marginBottom: 12, lineHeight: 22 }}>
                  Paket satışınızı ve kalan hakları takip etmek için seçin; yoksa atlayabilirsiniz.
                </AppText>
                <AppText variant="caption" muted style={styles.label}>
                  Aylık paket
                </AppText>
                <View style={styles.pkgRow}>
                  <Pressable
                    onPress={() => setPackageKind(null)}
                    style={[
                      styles.pkgChip,
                      { borderColor: c.border, backgroundColor: c.surface },
                      packageKind === null && { borderColor: c.primary, borderWidth: 2 },
                    ]}>
                    <AppText style={{ fontWeight: '600', fontSize: 14, color: c.text }}>Yok</AppText>
                  </Pressable>
                  {PACKAGE_OPTIONS.map((o) => (
                    <Pressable
                      key={o.kind}
                      onPress={() => setPackageKind(o.kind)}
                      style={[
                        styles.pkgChip,
                        { borderColor: c.border, backgroundColor: c.surface },
                        packageKind === o.kind && { borderColor: c.primary, borderWidth: 2 },
                      ]}>
                      <AppText style={{ fontWeight: '600', fontSize: 14, color: c.text }}>{o.label}</AppText>
                    </Pressable>
                  ))}
                </View>
              </>
            )}

            {step === 2 && (
              <>
                <AppText variant="muted" style={{ marginBottom: 12, lineHeight: 22 }}>
                  Başlangıç ölçümü; hepsini boş bırakıp ilerleyebilirsiniz.
                </AppText>
                <View style={styles.row2}>
                  <View style={styles.half}>
                    <AppText variant="caption" muted style={styles.label}>
                      Kilo (kg)
                    </AppText>
                    <TextInput
                      value={weightStr}
                      onChangeText={setWeightStr}
                      keyboardType="decimal-pad"
                      placeholder="—"
                      placeholderTextColor={c.textMuted}
                      style={inputStyle}
                    />
                  </View>
                  <View style={styles.half}>
                    <AppText variant="caption" muted style={styles.label}>
                      Boy (cm)
                    </AppText>
                    <TextInput
                      value={heightStr}
                      onChangeText={setHeightStr}
                      keyboardType="decimal-pad"
                      placeholder="—"
                      placeholderTextColor={c.textMuted}
                      style={inputStyle}
                    />
                  </View>
                </View>
                <View style={styles.row2}>
                  <View style={styles.half}>
                    <AppText variant="caption" muted style={styles.label}>
                      Bel (cm)
                    </AppText>
                    <TextInput
                      value={waistStr}
                      onChangeText={setWaistStr}
                      keyboardType="decimal-pad"
                      placeholder="—"
                      placeholderTextColor={c.textMuted}
                      style={inputStyle}
                    />
                  </View>
                  <View style={styles.half}>
                    <AppText variant="caption" muted style={styles.label}>
                      Kalça (cm)
                    </AppText>
                    <TextInput
                      value={hipStr}
                      onChangeText={setHipStr}
                      keyboardType="decimal-pad"
                      placeholder="—"
                      placeholderTextColor={c.textMuted}
                      style={inputStyle}
                    />
                  </View>
                </View>
                <AppText variant="caption" muted style={styles.label}>
                  Yağ oranı % (opsiyonel)
                </AppText>
                <TextInput
                  value={fatStr}
                  onChangeText={setFatStr}
                  keyboardType="decimal-pad"
                  placeholder="Örn. 22"
                  placeholderTextColor={c.textMuted}
                  style={inputStyle}
                />
              </>
            )}

            {step === 3 && (
              <>
                <AppText variant="caption" muted style={styles.label}>
                  Hedefler
                </AppText>
                <AppText variant="caption" muted style={{ marginBottom: 8, fontSize: 12 }}>
                  Birden fazla seçebilirsiniz.
                </AppText>
                <View style={styles.goalsWrap}>
                  {CLIENT_GOAL_OPTIONS.map((o) => {
                    const on = goals.includes(o.id);
                    return (
                      <Pressable
                        key={o.id}
                        onPress={() => toggleGoal(o.id)}
                        style={[
                          styles.goalChip,
                          {
                            borderColor: on ? c.primary : c.border,
                            backgroundColor: on ? c.primary + '18' : c.surface,
                          },
                        ]}>
                        <AppText style={{ fontWeight: '600', fontSize: 13, color: on ? c.primary : c.text }}>
                          {o.label}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
                <AppText variant="caption" muted style={styles.label}>
                  Notlar
                </AppText>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                  placeholder="Sağlık geçmişi, ek notlar..."
                  placeholderTextColor={c.textMuted}
                  style={[inputStyle, styles.multiline]}
                />
              </>
            )}
          </ScrollView>

          <View style={styles.footer}>
            {step < TOTAL_STEPS - 1 ? (
              <AppButton label="İleri" onPress={goNext} disabled={!canGoNext()} />
            ) : (
              <AppButton label="Kaydet" onPress={handleSave} disabled={!name.trim()} />
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 8,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },
  stepHeader: { paddingHorizontal: 20, paddingBottom: 12 },
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },
  label: { marginBottom: 6, marginTop: 8 },
  row2: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  pkgRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pkgChip: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  goalsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  goalChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  footer: { paddingHorizontal: 20, paddingBottom: 16, paddingTop: 8 },
});
