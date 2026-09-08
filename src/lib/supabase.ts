import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function supabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || "";
}

function publicKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  );
}

function secretKey() {
  return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

export function hasSupabase() {
  return Boolean(supabaseUrl() && (secretKey() || publicKey()));
}

export function hasSupabaseAdmin() {
  return Boolean(supabaseUrl() && secretKey());
}

export function supabaseAdmin(): SupabaseClient {
  const url = supabaseUrl();
  const key = secretKey() || publicKey();
  if (!url || !key) {
    throw new Error("Supabase is not configured");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
