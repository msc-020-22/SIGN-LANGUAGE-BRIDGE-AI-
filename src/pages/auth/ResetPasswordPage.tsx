import React, { useState } from 'react';
import { Lock, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface ResetPasswordPageProps {
  onSuccess: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!isSupabaseConfigured) {
      setError('Password reset is unavailable until Supabase is configured.');
      return;
    }

    try {
      const { error: updateErr } = await supabase.auth.updateUser({ password: newPassword });
      if (updateErr) {
        setError(updateErr.message);
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update your password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F7FD] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-[#DCE5F0] space-y-5 text-center">
          <h2 className="text-xl font-black text-[#123B70]">Set New Password</h2>

          {isSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 text-xs space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-bold">Password Successfully Updated!</p>
              <p className="text-gray-500">Redirecting to workspace...</p>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#DCE5F0] text-xs font-medium focus:ring-2 focus:ring-[#2878E5] focus:outline-hidden"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-600">{error}</p>}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#123B70] hover:bg-[#2878E5] text-white text-xs font-bold shadow-xs transition-colors"
              >
                Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
