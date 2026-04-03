import { getSupabase } from '@/lib/supabase';

import type { StudioOnboarding, StudioOnboardingInput } from '../types';

function toRow(input: StudioOnboardingInput) {
  return {
    name: input.name,
    station_count: input.stationCount,
    trainer_count: input.trainerCount,
    services: input.services,
    working_hours: input.workingHours,
    timezone: input.timezone,
  };
}

function fromRow(row: Record<string, unknown>): StudioOnboarding {
  return {
    id: String(row.id),
    name: String(row.name),
    stationCount: Number(row.station_count),
    trainerCount: Number(row.trainer_count),
    services: (row.services as string[]) ?? [],
    workingHours: (row.working_hours as Record<string, unknown>) ?? {},
    timezone: String(row.timezone ?? 'Europe/Istanbul'),
    createdAt: String(row.created_at),
  };
}

export async function createStudio(input: StudioOnboardingInput): Promise<StudioOnboarding> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('studios')
    .insert(toRow(input))
    .select()
    .single();

  if (error) throw error;
  return fromRow(data as Record<string, unknown>);
}

export async function updateStudio(
  id: string,
  input: Partial<StudioOnboardingInput>
): Promise<StudioOnboarding> {
  const supabase = getSupabase();
  const patch: Record<string, unknown> = {};
  if (input.name != null) patch.name = input.name;
  if (input.stationCount != null) patch.station_count = input.stationCount;
  if (input.trainerCount != null) patch.trainer_count = input.trainerCount;
  if (input.services != null) patch.services = input.services;
  if (input.workingHours != null) patch.working_hours = input.workingHours;
  if (input.timezone != null) patch.timezone = input.timezone;

  const { data, error } = await supabase.from('studios').update(patch).eq('id', id).select().single();

  if (error) throw error;
  return fromRow(data as Record<string, unknown>);
}

export async function getStudio(id: string): Promise<StudioOnboarding | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('studios').select().eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return fromRow(data as Record<string, unknown>);
}
