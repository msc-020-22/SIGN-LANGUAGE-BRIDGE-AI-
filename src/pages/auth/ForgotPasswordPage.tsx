import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { getAuthRedirectUrl, supabase, isSupabaseConfigured } from '../../lib/supabase';

interface ForgotPasswordPageProps {
  onBackToSignIn: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBackToSignIn }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (!isSupabaseConfigured) {
      setError('Password recovery is unavailable until Supabase is configured.');
      return;
    }

    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getAuthRedirectUrl(),
      });
      if (resetErr) {
        setError(resetErr.message);
        return;
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send the password recovery email.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F7FD] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-[#DCE5F0] space-y-5">
          <button
            onClick={onBackToSignIn}
            className="text-xs font-semibold text-gray-500 hover:text-[#123B70] flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </button>

          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-[#123B70]">Reset Password</h2>
            <p className="text-xs text-gray-500">
              Enter your email to receive recovery instructions.
            </p>
          </div>

          {submitted ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-bold text-emerald-950">Password Recovery Sent</p>
              <p className="text-emerald-800">
                Check <b>{email}</b> for a password reset link.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#DCE5F0] text-xs font-medium focus:ring-2 focus:ring-[#2878E5] focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-600">{error}</p>}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#123B70] hover:bg-[#2878E5] text-white text-xs font-bold shadow-xs transition-colors"
              >
                Send Reset Link
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
