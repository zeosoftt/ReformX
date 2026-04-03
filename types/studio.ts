/** Domain modelleri — randevu ve danışan verisi tek kaynakta tutulur. */

export type SessionKind =
  | 'Mat'
  | 'Reformer'
  | 'Özel'
  | 'Duo'
  | 'Kafa masajı'
  | 'Fizyoterapi'
  | 'Diğer';

/** Yoklama: henüz işaretlenmediyse unset */
export type AttendanceStatus = 'unset' | 'present' | 'absent';

/** Aylık paket: 8 veya 12 seans */
export type PackageKind = 8 | 12;

/** Danışan hedefleri (çoklu seçim) */
export type ClientGoalId =
  | 'weight_loss'
  | 'toning'
  | 'muscle_gain'
  | 'posture'
  | 'rehabilitation';

export const CLIENT_GOAL_OPTIONS: { id: ClientGoalId; label: string }[] = [
  { id: 'weight_loss', label: 'Kilo verme' },
  { id: 'toning', label: 'Sıkılaşma' },
  { id: 'muscle_gain', label: 'Kas kazanımı' },
  { id: 'posture', label: 'Postür düzeltme' },
  { id: 'rehabilitation', label: 'Rehabilitasyon' },
];

export function clientGoalLabel(id: ClientGoalId): string {
  return CLIENT_GOAL_OPTIONS.find((o) => o.id === id)?.label ?? id;
}

/** Başlangıç (baseline) ölçümleri — opsiyonel alanlar null olabilir */
export interface ClientBaseline {
  /** kg */
  weightKg: number | null;
  /** cm */
  heightCm: number | null;
  /** cm */
  waistCm: number | null;
  /** cm */
  hipCm: number | null;
  /** % — opsiyonel */
  bodyFatPercent: number | null;
}

export function defaultClientBaseline(): ClientBaseline {
  return {
    weightKg: null,
    heightCm: null,
    waistCm: null,
    hipCm: null,
    bodyFatPercent: null,
  };
}

/** Liste/özet için kısa metin; veri yoksa null */
export function baselineSummary(b: ClientBaseline): string | null {
  const parts: string[] = [];
  if (b.weightKg != null) parts.push(`${b.weightKg} kg`);
  if (b.heightCm != null) parts.push(`${b.heightCm} cm boy`);
  if (b.waistCm != null || b.hipCm != null) {
    const bits: string[] = [];
    if (b.waistCm != null) bits.push(`bel ${b.waistCm}`);
    if (b.hipCm != null) bits.push(`kalça ${b.hipCm}`);
    parts.push(bits.join(' · ') + ' cm');
  }
  if (b.bodyFatPercent != null) parts.push(`yağ %${b.bodyFatPercent}`);
  return parts.length ? parts.join(' · ') : null;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  createdAt: string;
  /** null = paket atanmamış */
  packageKind: PackageKind | null;
  /** YYYY-MM — hangi aya ait kullanım sayısı */
  packagePeriodKey: string | null;
  /** İlgili ayda kullanılan seans */
  packageSessionsUsed: number;
  /** Seçilen hedefler */
  goals: ClientGoalId[];
  /** Başlangıç ölçümü */
  baseline: ClientBaseline;
}

export interface Appointment {
  id: string;
  clientId: string;
  startAt: string;
  durationMinutes: number;
  sessionType: SessionKind;
  notes: string;
  attendance: AttendanceStatus;
  /** Geldi ile paketten düşüldüyse true (çift sayımı önler) */
  packageCreditApplied: boolean;
}

export interface StudioState {
  clients: Client[];
  appointments: Appointment[];
}
