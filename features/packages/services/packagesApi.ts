import { getSupabase } from '@/lib/supabase';

import type { ClientPackageEntity, PackageTemplateEntity } from '../types';

function templateFromRow(row: Record<string, unknown>): PackageTemplateEntity {
  return {
    id: String(row.id),
    studioId: String(row.studio_id),
    name: String(row.name),
    sessionCount: Number(row.session_count),
    validityDays: row.validity_days != null ? Number(row.validity_days) : null,
    priceCents: row.price_cents != null ? Number(row.price_cents) : null,
    currency: String(row.currency ?? 'TRY'),
    active: Boolean(row.active),
  };
}

function clientPackageFromRow(row: Record<string, unknown>): ClientPackageEntity {
  return {
    id: String(row.id),
    clientId: String(row.client_id),
    templateId: row.template_id != null ? String(row.template_id) : null,
    sessionsTotal: Number(row.sessions_total),
    sessionsRemaining: Number(row.sessions_remaining),
    startsAt: String(row.starts_at),
    expiresAt: row.expires_at != null ? String(row.expires_at) : null,
  };
}

export async function listTemplates(studioId: string): Promise<PackageTemplateEntity[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('package_templates')
    .select()
    .eq('studio_id', studioId)
    .eq('active', true);

  if (error) throw error;
  return (data ?? []).map((r) => templateFromRow(r as Record<string, unknown>));
}

export async function listClientPackages(clientId: string): Promise<ClientPackageEntity[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('client_packages').select().eq('client_id', clientId);

  if (error) throw error;
  return (data ?? []).map((r) => clientPackageFromRow(r as Record<string, unknown>));
}

/** Decrement remaining; enforce expiry in app layer or DB trigger */
export async function consumeSession(clientPackageId: string): Promise<ClientPackageEntity> {
  const supabase = getSupabase();
  const { data: row, error: fetchError } = await supabase
    .from('client_packages')
    .select()
    .eq('id', clientPackageId)
    .single();
  if (fetchError) throw fetchError;
  const cur = row as Record<string, unknown>;
  const remaining = Number(cur.sessions_remaining) - 1;
  if (remaining < 0) throw new Error('No sessions remaining');

  const { data, error } = await supabase
    .from('client_packages')
    .update({ sessions_remaining: remaining })
    .eq('id', clientPackageId)
    .select()
    .single();

  if (error) throw error;
  return clientPackageFromRow(data as Record<string, unknown>);
}
