import type { ClientId, StudioId } from '@/features/shared/ids';

export type { ClientId, StudioId };

export interface ClientEntity {
  id: ClientId;
  studioId: StudioId;
  name: string;
  phone: string | null;
  email: string | null;
  goals: string[];
  trainerNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClientHealthEntity {
  clientId: ClientId;
  injuries: string | null;
  conditions: string | null;
  medicalNotes: string | null;
}

export interface ClientMeasurementEntity {
  id: string;
  clientId: ClientId;
  measuredAt: string;
  weightKg: number | null;
  heightCm: number | null;
  waistCm: number | null;
  hipCm: number | null;
  bodyFatPercent: number | null;
  notes: string | null;
}
