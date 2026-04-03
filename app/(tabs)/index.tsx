import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { DashboardView } from '@/features/dashboard/DashboardView';
import { buildRiskyClients } from '@/features/dashboard/buildRiskyClients';
import { listClients } from '@/features/clients/services/clientsApi';
import {
  getLastSessionAtByClientId,
  listSessionsForDay,
} from '@/features/sessions/services/sessionsApi';
import type { SessionEntity } from '@/features/sessions/types';
import { useOnboardingStore } from '@/features/onboarding/store';
import { env, isSupabaseConfigured } from '@/lib/env';
import { Card } from '@/components/ui/Card';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/Screen';
import { useStudioProfile } from '@/context/StudioProfileContext';
import { useStudio } from '@/context/StudioContext';
import { useAppColors } from '@/hooks/useAppColors';
import { useUrgencyColors } from '@/hooks/useUrgencyColors';
import type { AttendanceStatus } from '@/types/studio';
import { formatShortDate, formatTime } from '@/utils/dateLocale';
import type { StudioPriority } from '@/types/studioProfile';
import {
  getAppointmentUrgency,
  type UrgencyKey,
  urgencyLabel,
} from '@/utils/appointmentUrgency';

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const LEGEND_ORDER: UrgencyKey[] = ['live', 'imminent', 'soon', 'today', 'ended', 'later'];

function prioritySubtext(p: StudioPriority | null): string {
  switch (p) {
    case 'musteri_kaybi':
      return 'Geri kazanım ve devam için yoklama ile birlikte danışan notlarını kullanın.';
    case 'randevu_kaosu':
      return 'Randevular renk kodlu; takvim düzenine odaklanın.';
    case 'odeme_takibi':
      return 'Paket kalanları ve ödeme hatırlatıcıları için danışan kartlarını açın.';
    case 'musteri_takibi':
      return 'Tüm danışanlar ve iletişim tek listede.';
    default:
      return 'Bugünkü yoğunluk ve yaklaşan randevular.';
  }
}

export default function DashboardScreen() {
  const router = useRouter();
  const c = useAppColors();
  const urgencyColors = useUrgencyColors();
  const { ready: profileReady, profile } = useStudioProfile();
  const { ready, state, updateAppointment } = useStudio();
  const zustandStudioId = useOnboardingStore((s) => s.currentStudioId);
  const cloudStudioId = zustandStudioId ?? (env.defaultStudioId.trim() || null);

  const [cloudLoading, setCloudLoading] = useState(false);
  const [cloudError, setCloudError] = useState<string | null>(null);
  const [cloudTodaySessions, setCloudTodaySessions] = useState<SessionEntity[]>([]);
  const [cloudRisky, setCloudRisky] = useState<
    { id: string; name: string; reason: string }[]
  >([]);

  const loadCloudDashboard = useCallback(async () => {
    if (!isSupabaseConfigured() || !cloudStudioId) return;
    setCloudLoading(true);
    setCloudError(null);
    try {
      const now = new Date();
      const dayStart = startOfDay(now);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      const [todaySessions, clients, lastBy] = await Promise.all([
        listSessionsForDay(cloudStudioId, dayStart.toISOString(), dayEnd.toISOString()),
        listClients(cloudStudioId),
        getLastSessionAtByClientId(cloudStudioId),
      ]);
      setCloudTodaySessions(todaySessions);
      setCloudRisky(buildRiskyClients(clients, lastBy, 21));
    } catch (e) {
      setCloudError(e instanceof Error ? e.message : 'Bulut verisi alınamadı');
    } finally {
      setCloudLoading(false);
    }
  }, [cloudStudioId]);

  useFocusEffect(
    useCallback(() => {
      void loadCloudDashboard();
    }, [loadCloudDashboard])
  );

  const { todayCount, weekCount, nextAppointments } = useMemo(() => {
    const now = new Date();
    const today = startOfDay(now);
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const upcoming = state.appointments
      .filter((a) => new Date(a.startAt) >= today)
      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

    const todayList = upcoming.filter((a) => isSameDay(new Date(a.startAt), now));
    const weekList = upcoming.filter((a) => {
      const t = new Date(a.startAt);
      return t >= today && t < weekEnd;
    });

    return {
      todayCount: todayList.length,
      weekCount: weekList.length,
      nextAppointments: upcoming.slice(0, 5),
    };
  }, [state.appointments]);

  const setAttendance = (appointmentId: string, attendance: AttendanceStatus) => {
    updateAppointment(appointmentId, { attendance });
  };

  if (!ready || !profileReady) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={c.primary} size="large" />
          <AppText muted style={{ marginTop: 12 }}>
            Veriler yükleniyor…
          </AppText>
        </View>
      </Screen>
    );
  }

  const title = profile.studioName.trim()
    ? `${profile.studioName.trim()} · Özet`
    : 'Özet';

  return (
    <Screen scroll contentStyle={styles.content}>
      <AppText variant="title" style={styles.headline}>
        {title}
      </AppText>
      <AppText variant="muted" style={styles.sub}>
        {prioritySubtext(profile.priority)}
      </AppText>

      {profile.priority != null && (
        <Card style={styles.priorityCard}>
          <AppText variant="subtitle">
            {profile.priority === 'musteri_kaybi' && 'Geri kazanım'}
            {profile.priority === 'randevu_kaosu' && 'Randevu düzeni'}
            {profile.priority === 'odeme_takibi' && 'Ödeme & paket'}
            {profile.priority === 'musteri_takibi' && 'Müşteri takibi'}
          </AppText>
          <AppText variant="muted" style={{ marginTop: 8, lineHeight: 20 }}>
            {profile.priority === 'musteri_kaybi' &&
              'Gelmedi işaretleri ve notlar müşteri kaybını azaltmaya yardımcı olur.'}
            {profile.priority === 'randevu_kaosu' &&
              'Yaklaşan seanslar aciliyet renkleriyle sıralanır; aşağıda yoklama ile takip edin.'}
            {profile.priority === 'odeme_takibi' &&
              'Paket kalanları danışan kartlarında; online ödeme tercihinizi profilde işaretlediniz.'}
            {profile.priority === 'musteri_takibi' &&
              'Danışanlar sekmesinde tüm iletişim ve paket bilgisi tek yerde.'}
          </AppText>
          {profile.priority === 'randevu_kaosu' && (
            <Pressable
              onPress={() => router.push('/appointments')}
              style={[styles.cta, { backgroundColor: c.primary + '22' }]}>
              <AppText style={{ color: c.primary, fontWeight: '700' }}>Randevulara git →</AppText>
            </Pressable>
          )}
          {profile.priority === 'odeme_takibi' && (
            <Pressable
              onPress={() => router.push('/clients')}
              style={[styles.cta, { backgroundColor: c.primary + '22' }]}>
              <AppText style={{ color: c.primary, fontWeight: '700' }}>Danışanlar →</AppText>
            </Pressable>
          )}
        </Card>
      )}

      {(profile.stationCount > 0 || profile.instructorCount > 0) && (
        <Card style={styles.capacityCard}>
          <AppText variant="caption" muted>
            Kapasite özeti (onboarding)
          </AppText>
          <AppText variant="body" style={{ marginTop: 8, lineHeight: 22 }}>
            ~{profile.stationCount} eşzamanlı seans (istasyon), {profile.instructorCount} eğitmen
            {profile.branchCount > 1 ? `, ${profile.branchCount} şube` : ''}. Slot planlarken eğitmen
            çakışmasını göz önünde bulundurun.
          </AppText>
        </Card>
      )}

      {(profile.monthlyAvgClients != null || profile.estimatedOccupancyPercent != null) && (
        <Card style={styles.capacityCard}>
          <AppText variant="subtitle">Tahmini analiz</AppText>
          {profile.monthlyAvgClients != null && (
            <AppText variant="muted" style={{ marginTop: 6 }}>
              Aylık ort. müşteri: ~{profile.monthlyAvgClients}
            </AppText>
          )}
          {profile.estimatedOccupancyPercent != null && (
            <AppText variant="muted" style={{ marginTop: 4 }}>
              Bildirdiğiniz doluluk: ~%{profile.estimatedOccupancyPercent}
            </AppText>
          )}
          <AppText variant="caption" muted style={{ marginTop: 8 }}>
            Boş kapasite ve gelir tahmini için bu değerleri güncel tutun.
          </AppText>
        </Card>
      )}

      <View style={styles.row}>
        <Card style={[styles.stat, { flex: 1 }]}>
          <AppText variant="caption" muted>
            Bugün
          </AppText>
          <AppText variant="title" style={{ marginTop: 6, color: c.primary }}>
            {todayCount}
          </AppText>
          <AppText variant="caption" muted style={{ marginTop: 4 }}>
            randevu
          </AppText>
        </Card>
        <View style={{ width: 12 }} />
        <Card style={[styles.stat, { flex: 1 }]}>
          <AppText variant="caption" muted>
            7 gün
          </AppText>
          <AppText variant="title" style={{ marginTop: 6, color: c.accent }}>
            {weekCount}
          </AppText>
          <AppText variant="caption" muted style={{ marginTop: 4 }}>
            randevu
          </AppText>
        </Card>
      </View>

      <Card style={styles.statWide}>
        <AppText variant="caption" muted>
          Kayıtlı danışan
        </AppText>
        <AppText variant="title" style={{ marginTop: 6 }}>
          {state.clients.length}
        </AppText>
      </Card>

      {isSupabaseConfigured() && (
        <>
          <AppText variant="subtitle" style={styles.sectionTitle}>
            Bulut (Supabase)
          </AppText>
          {!cloudStudioId ? (
            <Card>
              <AppText variant="body" style={{ fontWeight: '600' }}>
                Stüdyo bağlantısı eksik
              </AppText>
              <AppText variant="muted" style={{ marginTop: 8, lineHeight: 20 }}>
                Özet için bir stüdyo UUID gerekir: onboarding tamamlandığında Zustand&apos;a
                yazılacak veya `.env` içinde `EXPO_PUBLIC_DEFAULT_STUDIO_ID` tanımlayın.
              </AppText>
            </Card>
          ) : cloudLoading ? (
            <Card style={styles.cloudCard}>
              <ActivityIndicator color={c.primary} />
              <AppText variant="muted" style={{ marginTop: 10 }}>
                Supabase verisi yükleniyor…
              </AppText>
            </Card>
          ) : cloudError != null ? (
            <Card>
              <AppText style={{ color: c.danger }}>{cloudError}</AppText>
              <Pressable onPress={() => void loadCloudDashboard()} style={styles.cloudRetry}>
                <AppText style={{ color: c.primary, fontWeight: '700' }}>Yenile</AppText>
              </Pressable>
            </Card>
          ) : (
            <DashboardView
              todaySessions={cloudTodaySessions}
              riskyClients={cloudRisky}
              onOpenSessions={() => router.push('/appointments')}
              onOpenClient={() => router.push('/clients')}
            />
          )}
        </>
      )}

      <AppText variant="subtitle" style={styles.sectionTitle}>
        Yaklaşan
      </AppText>
      <AppText variant="caption" muted style={styles.legendHint}>
        Renkler seansa ne kadar süre kaldığına göre özetlenir. Yan taraftan yoklama işaretleyin.
      </AppText>

      <View style={styles.legend}>
        {LEGEND_ORDER.map((key) => (
          <View key={key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: urgencyColors[key].border }]} />
            <AppText variant="caption" style={{ color: c.textSecondary, fontSize: 11 }}>
              {urgencyLabel(key)}
            </AppText>
          </View>
        ))}
      </View>

      {nextAppointments.length === 0 ? (
        <Card>
          <AppText muted>Yaklaşan randevu yok. Randevular sekmesinden ekleyebilirsiniz.</AppText>
        </Card>
      ) : (
        nextAppointments.map((a) => {
          const client = state.clients.find((x) => x.id === a.clientId);
          const urgency = getAppointmentUrgency(a.startAt, a.durationMinutes);
          const u = urgencyColors[urgency];
          const att = a.attendance;

          return (
            <View
              key={a.id}
              style={[
                styles.apptCard,
                {
                  borderLeftColor: u.border,
                  backgroundColor: u.bg,
                  borderColor: c.border,
                },
              ]}>
              <View style={styles.apptTop}>
                <View style={styles.nameBlock}>
                  <AppText variant="subtitle">{client?.name ?? 'Danışan'}</AppText>
                  <View style={[styles.badge, { backgroundColor: u.badge + '22' }]}>
                    <AppText variant="caption" style={{ color: u.badge, fontWeight: '700', fontSize: 11 }}>
                      {urgencyLabel(urgency)}
                    </AppText>
                  </View>
                </View>
                <AppText variant="caption" style={{ color: c.primary, fontWeight: '600' }}>
                  {a.sessionType}
                </AppText>
              </View>
              <AppText variant="muted" style={{ marginTop: 8 }}>
                {formatShortDate(a.startAt)} · {formatTime(a.startAt)} · {a.durationMinutes} dk
              </AppText>

              <View style={[styles.attendanceBlock, { borderTopColor: c.border }]}>
                <AppText variant="caption" muted style={styles.attLabel}>
                  Yoklama
                </AppText>
                <View style={styles.attRow}>
                  <Pressable
                    onPress={() =>
                      setAttendance(a.id, att === 'present' ? 'unset' : 'present')
                    }
                    style={[
                      styles.attChip,
                      { borderColor: c.border },
                      att === 'present' && { backgroundColor: '#22C55E', borderColor: '#22C55E' },
                    ]}>
                    <AppText
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: att === 'present' ? '#fff' : c.text,
                      }}>
                      Geldi
                    </AppText>
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      setAttendance(a.id, att === 'absent' ? 'unset' : 'absent')
                    }
                    style={[
                      styles.attChip,
                      { borderColor: c.border },
                      att === 'absent' && { backgroundColor: c.danger, borderColor: c.danger },
                    ]}>
                    <AppText
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: att === 'absent' ? '#fff' : c.text,
                      }}>
                      Gelmedi
                    </AppText>
                  </Pressable>
                  <Pressable
                    onPress={() => setAttendance(a.id, 'unset')}
                    style={[
                      styles.attChip,
                      { borderColor: c.border },
                      att === 'unset' && { backgroundColor: c.surface, borderColor: c.primary },
                    ]}>
                    <AppText
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: att === 'unset' ? c.primary : c.textMuted,
                      }}>
                      Bekliyor
                    </AppText>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { paddingTop: 12 },
  headline: { marginBottom: 4 },
  sub: { marginBottom: 20 },
  row: { flexDirection: 'row' },
  stat: { minHeight: 112 },
  statWide: { marginTop: 12 },
  sectionTitle: { marginTop: 28, marginBottom: 6 },
  legendHint: { marginBottom: 10, lineHeight: 18 },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  apptCard: {
    marginBottom: 12,
    borderRadius: 20,
    borderLeftWidth: 5,
    paddingVertical: 14,
    paddingHorizontal: 16,
    paddingRight: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  apptTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  nameBlock: { flex: 1, gap: 6 },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  attendanceBlock: { marginTop: 14, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
  attLabel: { marginBottom: 8 },
  attRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  attChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  priorityCard: { marginBottom: 12 },
  capacityCard: { marginBottom: 12 },
  cta: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  cloudCard: { alignItems: 'center', paddingVertical: 20 },
  cloudRetry: { marginTop: 12, alignSelf: 'flex-start' },
});
