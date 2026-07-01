/**
 * MVP 1.0.0 — Google Play ilk yükleme kapsamı.
 * v1.1+ için cloudSyncUi açılabilir.
 */
export const mvp = {
  version: '1.0.0',
  buildLabel: 'MVP',
  /** Supabase / bulut paneli — ilk mağaza sürümünde kapalı (yerel mod yeterli) */
  cloudSyncUi: false,
} as const;

export function isMvpRelease(): boolean {
  return mvp.version.startsWith('1.0');
}
