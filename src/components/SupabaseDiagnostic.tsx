import React, { useEffect, useState } from 'react';
import { 
  Database, CheckCircle2, AlertTriangle, XCircle, 
  RefreshCw, ChevronDown, ChevronUp, ShieldCheck, Mail, Activity 
} from 'lucide-react';
import { pingSupabaseAuth, SupabaseDiagnosticResult } from '../lib/supabase';

interface SupabaseDiagnosticProps {
  defaultExpanded?: boolean;
  className?: string;
}

export const SupabaseDiagnostic: React.FC<SupabaseDiagnosticProps> = ({
  defaultExpanded = false,
  className = '',
}) => {
  const [result, setResult] = useState<SupabaseDiagnosticResult | null>(null);
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  const runDiagnostic = async () => {
    setIsPinging(true);
    try {
      const res = await pingSupabaseAuth();
      setResult(res);
    } catch {
      setResult({
        initialized: false,
        connected: false,
        projectUrl: 'Unknown',
        projectRef: 'Unknown',
        latencyMs: null,
        error: 'Diagnostic test crashed unexpectedly.',
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  const isHealthy = result?.initialized && result?.connected;

  return (
    <div className={`rounded-2xl border transition-all duration-200 text-xs ${
      isHealthy 
        ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950' 
        : result?.initialized 
          ? 'bg-amber-50/70 border-amber-200/80 text-amber-950' 
          : 'bg-red-50/70 border-red-200/80 text-red-950'
    } ${className}`}>
      {/* Header bar / Summary */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
            isHealthy 
              ? 'bg-emerald-600 text-white' 
              : result?.initialized 
                ? 'bg-amber-500 text-white' 
                : 'bg-red-600 text-white'
          }`}>
            <Database className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-tight text-[#123B70]">Supabase Auth Service</span>
              {isPinging ? (
                <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-[10px]">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                  <span>Pinging...</span>
                </span>
              ) : isHealthy ? (
                <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>Connected ({result.latencyMs ?? 0}ms)</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-red-100 text-red-800 font-semibold text-[10px]">
                  <XCircle className="w-2.5 h-2.5" />
                  <span>Not Connected</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-600 truncate">
              {result?.projectUrl ? result.projectUrl : 'Checking configuration...'}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-1 shrink-0 ml-2">
          <button
            type="button"
            onClick={runDiagnostic}
            disabled={isPinging}
            title="Re-test Supabase connection"
            className="p-1.5 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 disabled:opacity-50 transition-colors shadow-2xs"
            aria-label="Ping Supabase Auth Endpoint"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 transition-colors shadow-2xs flex items-center space-x-1"
            aria-label="Toggle details"
          >
            <span className="text-[11px] font-semibold hidden sm:inline">Details</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Diagnostic Details */}
      {isExpanded && result && (
        <div className="px-3 pb-3 pt-1 border-t border-black/5 space-y-2.5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="bg-white/80 p-2 rounded-xl border border-black/5">
              <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">Client Init</span>
              <div className="flex items-center space-x-1 mt-0.5 font-bold">
                {result.initialized ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-800">Initialized</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-red-600" />
                    <span className="text-red-800">Failed</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white/80 p-2 rounded-xl border border-black/5">
              <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">Auth Ping</span>
              <div className="flex items-center space-x-1 mt-0.5 font-bold">
                {result.connected ? (
                  <>
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-800">HTTP 200 ({result.latencyMs}ms)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    <span className="text-red-800">Unreachable</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white/80 p-2 rounded-xl border border-black/5">
              <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">Email Auth</span>
              <div className="flex items-center space-x-1 mt-0.5 font-bold">
                <Mail className="w-3.5 h-3.5 text-[#2878E5]" />
                <span className="text-gray-800">
                  {result.emailProviderEnabled !== false ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="bg-white/80 p-2 rounded-xl border border-black/5">
              <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">Project Ref</span>
              <div className="flex items-center space-x-1 mt-0.5 font-mono text-[11px] font-bold text-gray-800 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <span className="truncate">{result.projectRef}</span>
              </div>
            </div>
          </div>

          {result.mailerAutoconfirm === false && (
            <div className="p-2.5 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-900 text-[11px] space-y-1">
              <p className="font-bold flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Notice: Email Confirmation is Required by Supabase</span>
              </p>
              <p className="text-[10.5px] leading-relaxed">
                Your Supabase project requires users to click the email confirmation link before password login is permitted. 
                If you want instant login without email verification: In your Supabase Dashboard, go to <b>Authentication</b> → <b>Providers</b> → <b>Email</b>, turn <b>Confirm email</b> to <b>OFF</b>, and click Save.
              </p>
            </div>
          )}

          {result.error && (
            <div className="p-2 rounded-xl bg-red-100/80 border border-red-300 text-red-900 text-[11px]">
              <b>Diagnostic Error:</b> {result.error}
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] text-gray-500 pt-0.5">
            <span>Last checked: {result.timestamp}</span>
            <span>Target: {result.projectRef}.supabase.co</span>
          </div>
        </div>
      )}
    </div>
  );
};
