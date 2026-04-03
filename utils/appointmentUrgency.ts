/**
 * Yaklaşan seans kartları için aciliyet seviyesi — renk kodlaması.
 */

export type UrgencyKey = 'live' | 'ended' | 'imminent' | 'soon' | 'today' | 'later';

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * @param startAt ISO
 * @param durationMinutes seans süresi (devam ediyor mu hesabı için)
 */
export function getAppointmentUrgency(
  startAt: string,
  durationMinutes: number,
  now: Date = new Date()
): UrgencyKey {
  const start = new Date(startAt).getTime();
  const end = start + Math.max(1, durationMinutes) * 60 * 1000;
  const nowMs = now.getTime();
  const diffMin = (start - nowMs) / 60000;

  if (nowMs >= start && nowMs <= end) return 'live';
  if (nowMs > end) return 'ended';
  if (diffMin <= 45) return 'imminent';
  if (diffMin <= 180) return 'soon';
  if (sameDay(new Date(startAt), now)) return 'today';
  return 'later';
}

export function urgencyLabel(key: UrgencyKey): string {
  switch (key) {
    case 'live':
      return 'Seans sürüyor';
    case 'ended':
      return 'Tamamlandı';
    case 'imminent':
      return 'Çok yakın';
    case 'soon':
      return 'Yakında';
    case 'today':
      return 'Bugün';
    case 'later':
      return 'İleride';
    default:
      return '';
  }
}
