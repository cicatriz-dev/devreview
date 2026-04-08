import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let client: SupabaseClient | null = null;

/**
 * Cliente Supabase lazy: evita derrubar o bundle inteiro quando o `.env` não existe.
 */
export function getSupabase(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórios. " +
        "Copie apps/web/.env.example para apps/web/.env e preencha com o Supabase local."
    );
  }
  client ??= createClient(supabaseUrl, supabaseAnonKey);
  return client;
}
