/**
 * Central env access — Expo public vars must be prefixed EXPO_PUBLIC_
 */
export const env = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  /** Optional dev default when `useOnboardingStore` has no `currentStudioId` yet */
  defaultStudioId: process.env.EXPO_PUBLIC_DEFAULT_STUDIO_ID ?? '',
} as const;

export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}
