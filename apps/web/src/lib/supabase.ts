import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórios. " +
      "Copie .env.example para .env e preencha com os valores do Supabase local."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const TEAM_ID = "11111111-1111-1111-1111-111111111111";
