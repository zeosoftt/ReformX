/**
 * Central env access — Expo public vars must be prefixed EXPO_PUBLIC_
 */
export const env = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  defaultStudioId: process.env.EXPO_PUBLIC_DEFAULT_STUDIO_ID ?? '',
  /** Play Console & mağaza listesi — gerçek e-posta girin */
  supportEmail: process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? 'destek@onboardhealth.app',
  /** Herkese açık gizlilik politikası URL (Play Store zorunlu) */
  privacyPolicyUrl: process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL ?? '',
} as const;

export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function hasPublicPrivacyPolicyUrl(): boolean {
  return Boolean(env.privacyPolicyUrl.trim());
}
