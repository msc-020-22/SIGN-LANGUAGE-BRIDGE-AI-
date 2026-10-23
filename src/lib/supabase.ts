import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://ogatsdlvkdvgtlrvpmbr.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nYXRzZGx2a2R2Z3RscnZwbWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0MjM1NjcsImV4cCI6MjEwNzk5OTU2N30.Z2aVlQYZcgcTrk2zW14_0skaxM8HrhTVYbbklpymoeU';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
const configuredAppUrl = import.meta.env.VITE_APP_URL?.trim();

export const getAuthRedirectUrl = (): string =>
  configuredAppUrl || window.location.origin;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('your-project-id')
);

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
