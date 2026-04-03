import type { Client } from '@/types/studio';

/** Takvim ayı anahtarı (yerel saat) */
export function periodKeyFromDate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  return `${y}-${String(m).padStart(2, '0')}`;
}

/** Yeni ay başladıysa kullanılan seans sayısını sıfırlar */
export function rolloverClientPackage(client: Client, now: Date = new Date()): Client {
  if (!client.packageKind) {
    return {
      ...client,
      packagePeriodKey: null,
      packageSessionsUsed: 0,
    };
  }
  const key = periodKeyFromDate(now);
  if (client.packagePeriodKey !== key) {
    return {
      ...client,
      packagePeriodKey: key,
      packageSessionsUsed: 0,
    };
  }
  return client;
}

/** Bu ay kalan seans; paket yoksa null */
export function getPackageRemaining(client: Client): number | null {
  const c = rolloverClientPackage(client);
  if (!c.packageKind) return null;
  return Math.max(0, c.packageKind - c.packageSessionsUsed);
}
