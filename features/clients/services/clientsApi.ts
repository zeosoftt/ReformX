import { getSupabase } from '@/lib/supabase';

import type { ClientEntity, ClientHealthEntity, ClientMeasurementEntity } from '../types';

export function clientFromRow(row: Record<string, unknown>): ClientEntity {
  return {
    id: String(row.id),
    studioId: String(row.studio_id),
    name: String(row.name),
    phone: row.phone != null ? String(row.phone) : null,
    email: row.email != null ? String(row.email) : null,
    goals: (row.goals as string[]) ?? [],
    trainerNotes: row.trainer_notes != null ? String(row.trainer_notes) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function createClient(
  studioId: string,
  payload: {
    name: string;
    phone?: string | null;
    email?: string | null;
    goals?: string[];
    trainerNotes?: string | null;
  }
): Promise<ClientEntity> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('clients')
    .insert({
      studio_id: studioId,
      name: payload.name,
      phone: payload.phone ?? null,
      email: payload.email ?? null,
      goals: payload.goals ?? [],
      trainer_notes: payload.trainerNotes ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return clientFromRow(data as Record<string, unknown>);
}

export async function listClients(studioId: string): Promise<ClientEntity[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('clients')
    .select()
    .eq('studio_id', studioId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map((r) => clientFromRow(r as Record<string, unknown>));
}

export async function getClientHealth(clientId: string): Promise<ClientHealthEntity | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('client_health').select().eq('client_id', clientId).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const r = data as Record<string, unknown>;
  return {
    clientId: String(r.client_id),
    injuries: r.injuries != null ? String(r.injuries) : null,
    conditions: r.conditions != null ? String(r.conditions) : null,
    medicalNotes: r.medical_notes != null ? String(r.medical_notes) : null,
  };
}

export async function upsertClientHealth(health: ClientHealthEntity): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from('client_health').upsert({
    client_id: health.clientId,
    injuries: health.injuries,
    conditions: health.conditions,
    medical_notes: health.medicalNotes,
  });
  if (error) throw error;
}

export async function addMeasurement(
  input: Omit<ClientMeasurementEntity, 'id' | 'measuredAt'> & { measuredAt?: string }
): Promise<ClientMeasurementEntity> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('client_measurements')
    .insert({
      client_id: input.clientId,
      measured_at: input.measuredAt ?? new Date().toISOString(),
      weight_kg: input.weightKg,
      height_cm: input.heightCm,
      waist_cm: input.waistCm,
      hip_cm: input.hipCm,
      body_fat_percent: input.bodyFatPercent,
      notes: input.notes,
    })
    .select()
    .single();

  if (error) throw error;
  const r = data as Record<string, unknown>;
  return {
    id: String(r.id),
    clientId: String(r.client_id),
    measuredAt: String(r.measured_at),
    weightKg: r.weight_kg != null ? Number(r.weight_kg) : null,
    heightCm: r.height_cm != null ? Number(r.height_cm) : null,
    waistCm: r.waist_cm != null ? Number(r.waist_cm) : null,
    hipCm: r.hip_cm != null ? Number(r.hip_cm) : null,
    bodyFatPercent: r.body_fat_percent != null ? Number(r.body_fat_percent) : null,
    notes: r.notes != null ? String(r.notes) : null,
  };
}
