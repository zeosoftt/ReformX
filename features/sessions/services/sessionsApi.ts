import { getSupabase } from '@/lib/supabase';

import type { SessionEntity, SessionStatus } from '../types';

function fromRow(row: Record<string, unknown>): SessionEntity {
  return {
    id: String(row.id),
    studioId: String(row.studio_id),
    clientId: String(row.client_id),
    trainerId: row.trainer_id != null ? String(row.trainer_id) : null,
    scheduledAt: String(row.scheduled_at),
    durationMin: Number(row.duration_min),
    sessionType: row.session_type != null ? String(row.session_type) : null,
    status: row.status as SessionEntity['status'],
    attendanceNotes: row.attendance_notes != null ? String(row.attendance_notes) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function listSessionsForDay(studioId: string, dayStartIso: string, dayEndIso: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('sessions')
    .select()
    .eq('studio_id', studioId)
    .gte('scheduled_at', dayStartIso)
    .lt('scheduled_at', dayEndIso)
    .order('scheduled_at', { ascending: true });

  if (error) throw error;
  return (data ?? []).map((r) => fromRow(r as Record<string, unknown>));
}

/** Latest non-cancelled session time per client (one pass over ordered rows). */
export async function getLastSessionAtByClientId(studioId: string): Promise<Map<string, string>> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('sessions')
    .select('client_id, scheduled_at')
    .eq('studio_id', studioId)
    .neq('status', 'cancelled')
    .order('scheduled_at', { ascending: false });

  if (error) throw error;
  const map = new Map<string, string>();
  for (const row of data ?? []) {
    const r = row as Record<string, unknown>;
    const cid = String(r.client_id);
    if (!map.has(cid)) map.set(cid, String(r.scheduled_at));
  }
  return map;
}

export async function updateSessionStatus(
  id: string,
  status: SessionStatus,
  attendanceNotes?: string | null
): Promise<SessionEntity> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('sessions')
    .update({ status, attendance_notes: attendanceNotes ?? null })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return fromRow(data as Record<string, unknown>);
}
