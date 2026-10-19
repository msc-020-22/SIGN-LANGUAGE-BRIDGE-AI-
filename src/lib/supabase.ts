import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const configuredAppUrl = import.meta.env.VITE_APP_URL?.trim();

export const getAuthRedirectUrl = (): string =>
  configuredAppUrl || window.location.origin;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('your-project-id')
);

// If not configured, we create a fallback mock client that logs safely or returns empty data
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createClient('https://mock-slb-ai.supabase.co', 'mock-anon-key-placeholder', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
