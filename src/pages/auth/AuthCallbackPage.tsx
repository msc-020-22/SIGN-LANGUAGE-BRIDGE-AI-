import React, { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface AuthCallbackPageProps {
  onComplete: () => void;
}

export const AuthCallbackPage: React.FC<AuthCallbackPageProps> = ({ onComplete }) => {
  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(() => {
        onComplete();
      });
    } else {
      onComplete();
    }
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-[#F2F7FD] flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-3">
        <Sparkles className="w-8 h-8 text-[#2878E5] animate-spin mx-auto" />
        <h2 className="text-lg font-bold text-[#123B70]">Finalizing secure authentication...</h2>
        <p className="text-xs text-gray-500">Redirecting to your Sign Language Bridge workspace.</p>
      </div>
    </div>
  );
};
