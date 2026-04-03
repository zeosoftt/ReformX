import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { env, isSupabaseConfigured } from '@/lib/env';

/**
 * Şema tipleri `supabase gen types` ile üretildiğinde `SupabaseClient<Database>` kullanın.
 * Şimdilik gevşek client — insert/update çağrıları için yeterli.
 */
let _client: SupabaseClient | null = null;

/**
 * Singleton Supabase client. Call only when `isSupabaseConfigured()` is true.
 */
export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }
  if (!_client) {
    _client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return _client;
}
