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
import { mvp } from '@/constants/mvp';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { StatCard } from '@/components/ui/StatCard';
import { StudioHeroHeader } from '@/components/ui/StudioHeroHeader';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/Screen';
import { radius, spacing } from '@/constants/theme';
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
  const showCloudPanel = mvp.cloudSyncUi && isSupabaseConfigured() && Boolean(cloudStudioId);

  const [cloudLoading, setCloudLoading] = useState(false);
  const [cloudError, setCloudError] = useState<string | null>(null);
  const [cloudTodaySessions, setCloudTodaySessions] = useState<SessionEntity[]>([]);
  const [cloudRisky, setCloudRisky] = useState<
    { id: string; name: string; reason: string }[]
  >([]);

  const loadCloudDashboard = useCallback(async () => {
    if (!mvp.cloudSyncUi || !isSupabaseConfigured() || !cloudStudioId) return;
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
      if (mvp.cloudSyncUi) void loadCloudDashboard();
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

  return (
    <Screen scroll contentStyle={styles.content}>
      <StudioHeroHeader
        studioName={profile.studioName}
        subtitle={prioritySubtext(profile.priority)}
        services={profile.services}
      />

      {state.clients.length === 0 && (
        <Card accent="accent" style={{ marginBottom: spacing.md }}>
          <AppText variant="subtitle">Hoş geldiniz</AppText>
          <AppText variant="muted" style={{ marginTop: spacing.sm, lineHeight: 22 }}>
            Danışan ve seans verileri cihazınızda güvenle saklanır. Başlamak için Danışanlar
            sekmesinden ilk kaydınızı oluşturun.
          </AppText>
          <Pressable
            onPress={() => router.push('/clients')}
            style={[styles.cta, { backgroundColor: c.primarySubtle, marginTop: spacing.md }]}>
            <AppText style={{ color: c.primary, fontWeight: '700' }}>Danışan ekle →</AppText>
          </Pressable>
        </Card>
      )}

      {profile.priority != null && (
        <Card accent="primary" style={styles.priorityCard}>
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
              'Paket kalanları danışan kartlarında görünür; tahsilat takibini buradan yönetin.'}
            {profile.priority === 'musteri_takibi' &&
              'Danışanlar sekmesinde tüm iletişim ve paket bilgisi tek yerde.'}
          </AppText>
          {profile.priority === 'randevu_kaosu' && (
            <Pressable
              onPress={() => router.push('/appointments')}
              style={[styles.cta, { backgroundColor: c.primarySubtle }]}>
              <AppText style={{ color: c.primary, fontWeight: '700' }}>Randevulara git →</AppText>
            </Pressable>
          )}
          {profile.priority === 'odeme_takibi' && (
            <Pressable
              onPress={() => router.push('/clients')}
              style={[styles.cta, { backgroundColor: c.primarySubtle }]}>
              <AppText style={{ color: c.primary, fontWeight: '700' }}>Danışanlar →</AppText>
            </Pressable>
          )}
        </Card>
      )}

      {(profile.stationCount > 0 || profile.instructorCount > 0) && (
        <Card accent="clinical" style={styles.capacityCard}>
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
        <StatCard label="Bugün" value={todayCount} hint="randevu" accentColor={c.primary} />
        <View style={{ width: spacing.md }} />
        <StatCard label="7 gün" value={weekCount} hint="randevu" accentColor={c.accent} />
      </View>

      <StatCard
        label="Kayıtlı danışan"
        value={state.clients.length}
        style={{ marginTop: spacing.md }}
      />

      {showCloudPanel && (
        <>
          <AppText variant="subtitle" style={styles.sectionTitle}>
            Bulut senkronu
          </AppText>
          {cloudLoading ? (
            <Card style={styles.cloudCard}>
              <ActivityIndicator color={c.primary} />
              <AppText variant="muted" style={{ marginTop: 10 }}>
                Senkron verisi yükleniyor…
              </AppText>
            </Card>
          ) : cloudError != null ? (
            <Card>
              <AppText variant="muted">Bulut bağlantısı şu an kullanılamıyor. Yerel verileriniz etkilenmez.</AppText>
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
                  <Chip
                    label="Geldi"
                    variant="success"
                    selected={att === 'present'}
                    onPress={() => setAttendance(a.id, att === 'present' ? 'unset' : 'present')}
                  />
                  <Chip
                    label="Gelmedi"
                    variant="danger"
                    selected={att === 'absent'}
                    onPress={() => setAttendance(a.id, att === 'absent' ? 'unset' : 'absent')}
                  />
                  <Chip
                    label="Bekliyor"
                    variant="primary"
                    selected={att === 'unset'}
                    onPress={() => setAttendance(a.id, 'unset')}
                  />
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
  content: { paddingTop: 0 },
  row: { flexDirection: 'row' },
  sectionTitle: { marginTop: spacing.xxl, marginBottom: spacing.sm },
  legendHint: { marginBottom: spacing.sm, lineHeight: 18 },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  apptCard: {
    marginBottom: spacing.md,
    borderRadius: radius.xl,
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
  attLabel: { marginBottom: spacing.sm },
  attRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  priorityCard: { marginBottom: spacing.md },
  capacityCard: { marginBottom: spacing.md },
  cta: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    alignSelf: 'flex-start',
  },
  cloudCard: { alignItems: 'center', paddingVertical: 20 },
});
