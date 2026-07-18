import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || supabaseUrl === "https://your-project-id.supabase.co") {
  console.warn(
    "[CosmosX] Supabase URL not configured. " +
    "Add VITE_SUPABASE_URL to .env.local and restart the dev server."
  );
}

if (!supabaseAnonKey || supabaseAnonKey === "your-anon-key-here") {
  console.warn(
    "[CosmosX] Supabase Anon Key not configured. " +
    "Add VITE_SUPABASE_ANON_KEY to .env.local and restart the dev server."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "cosmos-x-auth",
  },
  global: {
    headers: {
      "x-app-name": "cosmosx-learning-platform",
    },
  },
});

/** Returns true if Supabase is properly configured */
export function isSupabaseConfigured(): boolean {
  return (
    !!supabaseUrl &&
    supabaseUrl !== "https://your-project-id.supabase.co" &&
    !!supabaseAnonKey &&
    supabaseAnonKey !== "your-anon-key-here"
  );
}

export default supabase;
