import { createClient } from '@supabase/supabase-js';

// Detect environment: browser vs Node.js serverless
const isBrowser = typeof window !== 'undefined';

const supabaseUrl = isBrowser
  ? (import.meta as any).env.VITE_SUPABASE_URL
  : process.env.VITE_SUPABASE_URL!;

const supabaseKey = isBrowser
  ? (import.meta as any).env.VITE_SUPABASE_ANON_KEY
  : process.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
