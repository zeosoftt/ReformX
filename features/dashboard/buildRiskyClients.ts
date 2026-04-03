import type { ClientEntity } from '@/features/clients/types';

import type { RiskyClientRow } from './DashboardView';

export function buildRiskyClients(
  clients: ClientEntity[],
  lastSessionAtByClientId: Map<string, string>,
  inactiveDays: number
): RiskyClientRow[] {
  const cutoff = Date.now() - inactiveDays * 24 * 60 * 60 * 1000;
  const rows: RiskyClientRow[] = [];
  for (const c of clients) {
    const last = lastSessionAtByClientId.get(c.id);
    if (last == null) {
      rows.push({ id: c.id, name: c.name, reason: 'Henüz seans kaydı yok' });
      continue;
    }
    const t = new Date(last).getTime();
    if (t < cutoff) {
      const days = Math.floor((Date.now() - t) / (24 * 60 * 60 * 1000));
      rows.push({ id: c.id, name: c.name, reason: `Son seans ${days} gün önce` });
    }
  }
  return rows.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
}
