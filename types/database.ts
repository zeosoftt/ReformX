/**
 * Loose schema until `supabase gen types` — allows `.insert()` / `.update()` without `never`.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type GenericTable = {
  Row: Record<string, unknown>;
  Insert: Record<string, unknown>;
  Update: Record<string, unknown>;
};

export type Database = {
  public: {
    Tables: {
      studios: GenericTable;
      trainers: GenericTable;
      clients: GenericTable;
      client_health: GenericTable;
      client_measurements: GenericTable;
      package_templates: GenericTable;
      client_packages: GenericTable;
      sessions: GenericTable;
      payments: GenericTable;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      session_status: 'scheduled' | 'completed' | 'no_show' | 'cancelled';
      payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    };
  };
};
