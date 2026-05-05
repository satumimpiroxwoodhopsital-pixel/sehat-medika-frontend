import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getUrl(): string {
  if (typeof window !== 'undefined') {
    return (import.meta as any).env.VITE_SUPABASE_URL || '';
  }
  return process.env.VITE_SUPABASE_URL || '';
}

function getKey(): string {
  if (typeof window !== 'undefined') {
    return (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';
  }
  return process.env.VITE_SUPABASE_ANON_KEY || '';
}

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = getUrl();
    const key = getKey();
    if (!url || !key) {
      throw new Error(`Missing Supabase env vars. URL: ${url ? '[set]' : '[MISSING]'}, KEY: ${key ? '[set]' : '[MISSING]'}`);
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}

// Proxy to delegate all access to the lazy supabase client
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});
