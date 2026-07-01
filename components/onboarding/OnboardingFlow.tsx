import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStudioProfile } from '@/context/StudioProfileContext';
import { useAppColors } from '@/hooks/useAppColors';
import { saveStudioProfile } from '@/services/studioProfileStorage';
import { setOnboardingCompleted } from '@/services/onboardingStorage';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { BrandMark, ProductLabel } from '@/components/ui/BrandMark';
import {
  defaultStudioProfile,
  PRIORITY_OPTIONS,
  type StudioOnboardingProfile,
  type StudioPriority,
} from '@/types/studioProfile';

/** Hoş geldin + 4 form adımı */
const TOTAL_STEPS = 5;

function parsePositiveInt(s: string, fallback: number) {
  const n = parseInt(s.replace(/\D/g, ''), 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function ServiceChip({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  const c = useAppColors();
  return (
    <Pressable
      onPress={onToggle}
      style={[
        styles.chip,
        {
          borderColor: active ? c.primary : c.borderNeutral,
          backgroundColor: active ? c.primarySubtle : c.surface,
        },
      ]}>
      <AppText style={{ fontWeight: '600', fontSize: 14, color: active ? c.primary : c.text }}>
        {label}
      </AppText>
    </Pressable>
  );
}

function MinuteChip({
  value,
  current,
  onSelect,
}: {
  value: 30 | 50 | 60;
  current: number;
  onSelect: (v: 30 | 50 | 60) => void;
}) {
  const c = useAppColors();
  const active = current === value;
  return (
    <Pressable
      onPress={() => onSelect(value)}
      style={[
        styles.chip,
        {
          borderColor: active ? c.primary : c.borderNeutral,
          backgroundColor: active ? c.primarySubtle : c.surface,
        },
      ]}>
      <AppText style={{ fontWeight: '700', color: active ? c.primary : c.text }}>{value} dk</AppText>
    </Pressable>
  );
}

export function OnboardingFlow() {
  const c = useAppColors();
  const router = useRouter();
  const { refreshProfile } = useStudioProfile();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<StudioOnboardingProfile>(() => defaultStudioProfile());

  const progress = step < 5 ? (step + 1) / TOTAL_STEPS : 1;

  const skipAll = useCallback(async () => {
    const def = defaultStudioProfile();
    await saveStudioProfile(def);
    await setOnboardingCompleted();
    await refreshProfile();
    router.replace('/(tabs)');
  }, [refreshProfile, router]);

  const finalize = useCallback(async () => {
    await saveStudioProfile(draft);
    await setOnboardingCompleted();
    await refreshProfile();
    setStep(5);
    setTimeout(() => router.replace('/(tabs)'), 1600);
  }, [draft, refreshProfile, router]);

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const inputStyle = [
    styles.input,
    { color: c.text, borderColor: c.border, backgroundColor: c.surface },
  ];

  if (step === 5) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: c.background }]} edges={['top', 'bottom']}>
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={c.primary} />
          <AppText variant="subtitle" style={{ marginTop: 20, textAlign: 'center' }}>
            Sana özel panel hazırlanıyor…
          </AppText>
          <AppText variant="muted" style={{ marginTop: 8, textAlign: 'center', paddingHorizontal: 32 }}>
            Tercihlerin özet ekranına yansıyacak.
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: c.background }]} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        {step > 0 && step <= 4 ? (
          <Pressable onPress={back} hitSlop={12} accessibilityLabel="Geri">
            <FontAwesome name="chevron-left" size={20} color={c.primary} />
          </Pressable>
        ) : (
          <View style={{ width: 28 }} />
        )}
        <View style={[styles.progressTrack, { backgroundColor: c.border }]}>
          <View
            style={[styles.progressFill, { width: `${Math.min(100, progress * 100)}%`, backgroundColor: c.primary }]}
          />
        </View>
        <Pressable onPress={skipAll} hitSlop={12} accessibilityLabel="Atla">
          <AppText style={{ color: c.primary, fontWeight: '700' }}>Atla</AppText>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {step === 0 && (
            <View style={styles.welcomeBlock}>
              <BrandMark size="lg" />
              <ProductLabel showTagline />
              <AppText variant="display" style={[styles.centerTitle, { marginTop: 20 }]}>
                Stüdyonuzu tanıyalım
              </AppText>
              <AppText variant="muted" style={styles.centerBody}>
                Pilates stüdyosu veya fizyoterapi merkezi fark etmez — kapasite, hizmetler ve
                önceliklerinize göre yönetim paneliniz şekillenir.
              </AppText>
              <AppText variant="caption" muted style={{ marginTop: 16, textAlign: 'center' }}>
                Kurulumu istediğiniz zaman sağ üstten atlayabilirsiniz.
              </AppText>
              <Pressable onPress={() => router.push('/privacy-policy')} style={{ marginTop: 12 }}>
                <AppText variant="caption" style={{ color: c.primary, textAlign: 'center', fontWeight: '600' }}>
                  Gizlilik politikasını oku
                </AppText>
              </Pressable>
            </View>
          )}

          {step === 1 && (
            <>
              <AppText variant="title" style={styles.stepTitle}>
                Stüdyo yapısı
              </AppText>
              <AppText variant="muted" style={styles.stepSub}>
                Ders planı ve doluluk için temel sayılar. Örn. 10 istasyon → aynı anda 10 kişi kapasitesi.
              </AppText>
              <AppText variant="caption" muted style={styles.label}>
                Stüdyo adı
              </AppText>
              <TextInput
                value={draft.studioName}
                onChangeText={(t) => setDraft((d) => ({ ...d, studioName: t }))}
                placeholder="Örn. Aura Pilates"
                placeholderTextColor={c.textMuted}
                style={inputStyle}
              />
              <AppText variant="caption" muted style={styles.label}>
                Kaç şube?
              </AppText>
              <TextInput
                value={String(draft.branchCount)}
                onChangeText={(t) => setDraft((d) => ({ ...d, branchCount: parsePositiveInt(t, 1) || 1 }))}
                keyboardType="number-pad"
                style={inputStyle}
              />
              <AppText variant="caption" muted style={styles.label}>
                Kaç istasyon?
              </AppText>
              <TextInput
                value={String(draft.stationCount)}
                onChangeText={(t) => setDraft((d) => ({ ...d, stationCount: Math.max(1, parsePositiveInt(t, 1)) }))}
                keyboardType="number-pad"
                style={inputStyle}
              />
              <AppText variant="caption" muted style={styles.label}>
                Kaç eğitmen?
              </AppText>
              <TextInput
                value={String(draft.instructorCount)}
                onChangeText={(t) =>
                  setDraft((d) => ({ ...d, instructorCount: Math.max(1, parsePositiveInt(t, 1)) }))
                }
                keyboardType="number-pad"
                style={inputStyle}
              />
            </>
          )}

          {step === 2 && (
            <>
              <AppText variant="title" style={styles.stepTitle}>
                Hizmet türleri
              </AppText>
              <AppText variant="muted" style={styles.stepSub}>
                İşlettiğiniz hizmetleri seçin; uygulama paket ve takip davranışını buna göre vurgular.
              </AppText>
              <View style={styles.chipWrap}>
                <ServiceChip
                  label="Pilates (Mat / Reformer)"
                  active={draft.services.pilates}
                  onToggle={() =>
                    setDraft((d) => ({ ...d, services: { ...d.services, pilates: !d.services.pilates } }))
                  }
                />
                <ServiceChip
                  label="Fizyoterapi"
                  active={draft.services.physiotherapy}
                  onToggle={() =>
                    setDraft((d) => ({
                      ...d,
                      services: { ...d.services, physiotherapy: !d.services.physiotherapy },
                    }))
                  }
                />
                <ServiceChip
                  label="Personal Training"
                  active={draft.services.personalTraining}
                  onToggle={() =>
                    setDraft((d) => ({
                      ...d,
                      services: { ...d.services, personalTraining: !d.services.personalTraining },
                    }))
                  }
                />
                <ServiceChip
                  label="Grup dersleri"
                  active={draft.services.groupClasses}
                  onToggle={() =>
                    setDraft((d) => ({
                      ...d,
                      services: { ...d.services, groupClasses: !d.services.groupClasses },
                    }))
                  }
                />
                <ServiceChip
                  label="Online ders"
                  active={draft.services.online}
                  onToggle={() =>
                    setDraft((d) => ({ ...d, services: { ...d.services, online: !d.services.online } }))
                  }
                />
              </View>
            </>
          )}

          {step === 3 && (
            <>
              <AppText variant="title" style={styles.stepTitle}>
                Çalışma modeli & paket
              </AppText>
              <AppText variant="muted" style={styles.stepSub}>
                Takvim ve slot mantığı için. Paket ayarları kalan ders hesaplarıyla uyumludur.
              </AppText>

              <View style={styles.rowBetween}>
                <AppText variant="body" style={{ flex: 1 }}>
                  Dersler randevu ile mi?
                </AppText>
                <Switch
                  value={draft.appointmentOnly}
                  onValueChange={(v) => setDraft((d) => ({ ...d, appointmentOnly: v }))}
                  trackColor={{ false: c.border, true: c.primary + '88' }}
                  thumbColor={c.surface}
                />
              </View>
              <View style={[styles.rowBetween, { marginTop: 12 }]}>
                <AppText variant="body" style={{ flex: 1 }}>
                  Grup dersleri var mı?
                </AppText>
                <Switch
                  value={draft.hasGroupClasses}
                  onValueChange={(v) => setDraft((d) => ({ ...d, hasGroupClasses: v }))}
                  trackColor={{ false: c.border, true: c.primary + '88' }}
                  thumbColor={c.surface}
                />
              </View>

              <AppText variant="caption" muted style={[styles.label, { marginTop: 16 }]}>
                Varsayılan seans süresi
              </AppText>
              <View style={styles.rowChips}>
                {([30, 50, 60] as const).map((m) => (
                  <MinuteChip
                    key={m}
                    value={m}
                    current={draft.defaultSessionMinutes}
                    onSelect={(v) => setDraft((d) => ({ ...d, defaultSessionMinutes: v }))}
                  />
                ))}
              </View>

              <AppText variant="caption" muted style={styles.label}>
                Çalışma saatleri (not)
              </AppText>
              <TextInput
                value={draft.workingHoursNote}
                onChangeText={(t) => setDraft((d) => ({ ...d, workingHoursNote: t }))}
                placeholder="Örn. 09:00 – 21:00"
                placeholderTextColor={c.textMuted}
                style={inputStyle}
              />

              <View style={[styles.rowBetween, { marginTop: 16 }]}>
                <AppText variant="body" style={{ flex: 1 }}>
                  Paket sistemi kullanıyor musunuz?
                </AppText>
                <Switch
                  value={draft.hasPackageSystem}
                  onValueChange={(v) => setDraft((d) => ({ ...d, hasPackageSystem: v }))}
                  trackColor={{ false: c.border, true: c.primary + '88' }}
                  thumbColor={c.surface}
                />
              </View>

              {draft.hasPackageSystem && (
                <>
                  <AppText variant="caption" muted style={styles.label}>
                    Paket türleri
                  </AppText>
                  <View style={styles.chipWrap}>
                    <ServiceChip
                      label="Ders sayısı (örn. 10 ders)"
                      active={draft.packageTypes.sessionCount}
                      onToggle={() =>
                        setDraft((d) => ({
                          ...d,
                          packageTypes: {
                            ...d.packageTypes,
                            sessionCount: !d.packageTypes.sessionCount,
                          },
                        }))
                      }
                    />
                    <ServiceChip
                      label="Aylık sınırsız"
                      active={draft.packageTypes.monthlyUnlimited}
                      onToggle={() =>
                        setDraft((d) => ({
                          ...d,
                          packageTypes: {
                            ...d.packageTypes,
                            monthlyUnlimited: !d.packageTypes.monthlyUnlimited,
                          },
                        }))
                      }
                    />
                  </View>
                </>
              )}

              <View style={[styles.rowBetween, { marginTop: 16 }]}>
                <AppText variant="body" style={{ flex: 1 }}>
                  Online ödeme alıyor musunuz?
                </AppText>
                <Switch
                  value={draft.acceptsOnlinePayment}
                  onValueChange={(v) => setDraft((d) => ({ ...d, acceptsOnlinePayment: v }))}
                  trackColor={{ false: c.border, true: c.primary + '88' }}
                  thumbColor={c.surface}
                />
              </View>
            </>
          )}

          {step === 4 && (
            <>
              <AppText variant="title" style={styles.stepTitle}>
                Hedef & öncelik
              </AppText>
              <AppText variant="muted" style={styles.stepSub}>
                En büyük zorluğunuzu seçin; özet ekranında buna uygun ipuçları gösterilir.
              </AppText>
              {PRIORITY_OPTIONS.map((opt) => {
                const sel = draft.priority === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() =>
                      setDraft((d) => ({
                        ...d,
                        priority: d.priority === opt.id ? null : (opt.id as StudioPriority),
                      }))
                    }
                    style={[
                      styles.priorityCard,
                      {
                        borderColor: sel ? c.primary : c.border,
                        backgroundColor: sel ? c.primary + '14' : c.surface,
                      },
                    ]}>
                    <AppText variant="subtitle">{opt.label}</AppText>
                    <AppText variant="caption" muted style={{ marginTop: 4 }}>
                      {opt.hint}
                    </AppText>
                  </Pressable>
                );
              })}
              <Pressable
                onPress={() => setDraft((d) => ({ ...d, priority: null }))}
                style={{ marginTop: 8 }}>
                <AppText variant="caption" style={{ color: c.textMuted }}>
                  Tercih yok / sonra seçerim
                </AppText>
              </Pressable>

              <AppText variant="subtitle" style={{ marginTop: 24, marginBottom: 8 }}>
                Bonus — tahmini analiz
              </AppText>
              <AppText variant="caption" muted style={styles.label}>
                Aylık ortalama aktif müşteri (opsiyonel)
              </AppText>
              <TextInput
                value={draft.monthlyAvgClients != null ? String(draft.monthlyAvgClients) : ''}
                onChangeText={(t) =>
                  setDraft((d) => ({
                    ...d,
                    monthlyAvgClients: t === '' ? null : parsePositiveInt(t, 0),
                  }))
                }
                keyboardType="number-pad"
                placeholder="Örn. 45"
                placeholderTextColor={c.textMuted}
                style={inputStyle}
              />
              <AppText variant="caption" muted style={styles.label}>
                Tahmini doluluk % (opsiyonel)
              </AppText>
              <TextInput
                value={
                  draft.estimatedOccupancyPercent != null ? String(draft.estimatedOccupancyPercent) : ''
                }
                onChangeText={(t) =>
                  setDraft((d) => ({
                    ...d,
                    estimatedOccupancyPercent: t === '' ? null : Math.min(100, parsePositiveInt(t, 0)),
                  }))
                }
                keyboardType="number-pad"
                placeholder="Örn. 72"
                placeholderTextColor={c.textMuted}
                style={inputStyle}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        {step === 0 && (
          <AppButton label="Başla" onPress={() => setStep(1)} />
        )}
        {step >= 1 && step <= 3 && (
          <AppButton label="İleri" onPress={next} />
        )}
        {step === 4 && <AppButton label="Paneli hazırla" onPress={finalize} />}
      </View>
    </SafeAreaView>
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
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
  welcomeBlock: { alignItems: 'center', paddingTop: 8 },
  centerTitle: { textAlign: 'center', marginBottom: 12 },
  centerBody: { textAlign: 'center', lineHeight: 22 },
  stepTitle: { marginBottom: 8, marginTop: 4 },
  stepSub: { marginBottom: 16, lineHeight: 22 },
  label: { marginBottom: 6, marginTop: 10 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  rowChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  priorityCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  footer: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 8 },
  loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
});
