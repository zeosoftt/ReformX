import {
  CLIENT_GOAL_OPTIONS,
  defaultClientBaseline,
  type Appointment,
  type Client,
  type ClientBaseline,
  type ClientGoalId,
  type StudioState,
} from '@/types/studio';
import { storageKeys } from '@/lib/storage/keys';
import { appStorage } from '@/lib/storage/appStorage';
import { rolloverClientPackage } from '@/utils/packagePeriod';

const VALID_GOAL_IDS = new Set<ClientGoalId>(CLIENT_GOAL_OPTIONS.map((o) => o.id));

function migrateGoals(raw: unknown): ClientGoalId[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((g): g is ClientGoalId => VALID_GOAL_IDS.has(g as ClientGoalId));
}

function optionalNumber(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function migrateBaseline(raw: unknown): ClientBaseline {
  const def = defaultClientBaseline();
  if (!raw || typeof raw !== 'object') return def;
  const b = raw as Record<string, unknown>;
  return {
    weightKg: optionalNumber(b.weightKg),
    heightCm: optionalNumber(b.heightCm),
    waistCm: optionalNumber(b.waistCm),
    hipCm: optionalNumber(b.hipCm),
    bodyFatPercent: optionalNumber(b.bodyFatPercent),
  };
}

const STORAGE_KEY = storageKeys.studioState;

const emptyState = (): StudioState => ({
  clients: [],
  appointments: [],
});

function migrateClient(raw: Client): Client {
  const c: Client = {
    ...raw,
    packageKind: raw.packageKind ?? null,
    packagePeriodKey: raw.packagePeriodKey ?? null,
    packageSessionsUsed: raw.packageSessionsUsed ?? 0,
    goals: migrateGoals(raw.goals),
    baseline: migrateBaseline(raw.baseline),
  };
  return rolloverClientPackage(c);
}

function migrateAppointment(raw: Appointment): Appointment {
  return {
    ...raw,
    attendance: raw.attendance ?? 'unset',
    packageCreditApplied: raw.packageCreditApplied ?? false,
  };
}

export async function loadStudioState(): Promise<StudioState> {
  try {
    const raw = await appStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as StudioState;
    if (!parsed.clients || !parsed.appointments) return emptyState();
    return {
      clients: parsed.clients.map(migrateClient),
      appointments: parsed.appointments.map(migrateAppointment),
    };
  } catch {
    return emptyState();
  }
}

export async function saveStudioState(state: StudioState): Promise<void> {
  await appStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
