import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://aevfkxdrrvnjxormtcfg.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFldmZreGRycnZuanhvcm10Y2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNDAxOTYsImV4cCI6MjEwNzkxNjE5Nn0.ziCITubOE-T93HmifMBYLKjbmVRzinnk-7oJmHuWBow';

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

export interface SupabaseDiagnosticResult {
  initialized: boolean;
  connected: boolean;
  projectUrl: string;
  projectRef: string;
  latencyMs: number | null;
  emailProviderEnabled?: boolean;
  signupDisabled?: boolean;
  mailerAutoconfirm?: boolean;
  error?: string;
  timestamp: string;
}

export const pingSupabaseAuth = async (): Promise<SupabaseDiagnosticResult> => {
  const start = performance.now();
  const timestamp = new Date().toLocaleTimeString();

  if (!isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) {
    return {
      initialized: false,
      connected: false,
      projectUrl: supabaseUrl || 'Not configured',
      projectRef: 'Unknown',
      latencyMs: null,
      error: 'Supabase URL or Anon Key is missing or invalid.',
      timestamp,
    };
  }

  let projectRef = 'aevfkxdrrvnjxormtcfg';
  try {
    const urlObj = new URL(supabaseUrl);
    projectRef = urlObj.hostname.split('.')[0] || projectRef;
  } catch {}

  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      method: 'GET',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    });

    const elapsed = Math.round(performance.now() - start);

    if (res.ok) {
      const data = await res.json();
      return {
        initialized: true,
        connected: true,
        projectUrl: supabaseUrl,
        projectRef: data['sb-project-ref'] || projectRef,
        latencyMs: elapsed,
        emailProviderEnabled: Boolean(data?.external?.email),
        signupDisabled: Boolean(data?.disable_signup),
        mailerAutoconfirm: Boolean(data?.mailer_autoconfirm),
        timestamp,
      };
    } else {
      const { error: sessionError } = await supabase.auth.getSession();
      const elapsed2 = Math.round(performance.now() - start);
      if (!sessionError) {
        return {
          initialized: true,
          connected: true,
          projectUrl: supabaseUrl,
          projectRef,
          latencyMs: elapsed2,
          timestamp,
        };
      }
      return {
        initialized: true,
        connected: false,
        projectUrl: supabaseUrl,
        projectRef,
        latencyMs: elapsed,
        error: `HTTP ${res.status}: ${res.statusText}`,
        timestamp,
      };
    }
  } catch (err) {
    try {
      const sessionStart = performance.now();
      const { error: sessionError } = await supabase.auth.getSession();
      const elapsed = Math.round(performance.now() - sessionStart);
      if (!sessionError) {
        return {
          initialized: true,
          connected: true,
          projectUrl: supabaseUrl,
          projectRef,
          latencyMs: elapsed,
          timestamp,
        };
      }
      return {
        initialized: true,
        connected: false,
        projectUrl: supabaseUrl,
        projectRef,
        latencyMs: null,
        error: sessionError.message,
        timestamp,
      };
    } catch {
      const msg = err instanceof Error ? err.message : 'Network failure contacting Supabase endpoint';
      return {
        initialized: true,
        connected: false,
        projectUrl: supabaseUrl,
        projectRef,
        latencyMs: null,
        error: msg,
        timestamp,
      };
    }
  }
};
