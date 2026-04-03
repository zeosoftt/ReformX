/** Tarih/saat gösterimi — cihaz yereli (varsayılan tr). */

const locale = 'tr-TR';

export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(d);
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(d);
}

export function formatDateTime(iso: string): string {
  return `${formatShortDate(iso)} · ${formatTime(iso)}`;
}

export function startOfTodayIso(): string {
  const n = new Date();
  n.setHours(0, 0, 0, 0);
  return n.toISOString();
}
