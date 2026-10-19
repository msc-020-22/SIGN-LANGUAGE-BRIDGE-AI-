import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SignInPageProps {
  onSuccess: () => void;
  onNavigateToSignUp: () => void;
  onNavigateToForgotPassword: () => void;
  onBackToLanding: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onSuccess,
  onNavigateToSignUp,
  onNavigateToForgotPassword,
  onBackToLanding,
}) => {
  const { signIn, isSupabaseConnected } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide an email address.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await signIn(email, password);
    setIsSubmitting(false);

    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || 'Failed to sign in.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F7FD] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <button
          onClick={onBackToLanding}
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#123B70] via-[#2878E5] to-[#35C6D4] text-white flex items-center justify-center mx-auto shadow-md"
        >
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74a4.5 4.5 0 0 0-9 0c0 1.56.79 2.93 2 3.74zM18 10h-1.26A6.47 6.47 0 0 1 18 13.5V17a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4v-3.5c0-1.28.37-2.48 1.01-3.5H6a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6h4a6 6 0 0 0 6-6v-5a2 2 0 0 0-2-2z" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-[#123B70] tracking-tight">Sign In to SLB AI</h2>
        <p className="text-xs text-gray-500">
          Access your communication workspace, history, and learning progress.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-[#DCE5F0] space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isSupabaseConnected && (
            <div className="p-3 rounded-xl bg-[#F2F7FD] border border-[#DCE5F0] text-[11px] text-gray-600">
              <b>Email/password sign-in is not configured.</b> Add your Supabase project URL and anon key to enable accounts.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Email Address</label>
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

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-700">Password</label>
                <button
                  type="button"
                  onClick={onNavigateToForgotPassword}
                  className="text-[11px] text-[#2878E5] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#DCE5F0] text-xs font-medium focus:ring-2 focus:ring-[#2878E5] focus:outline-hidden"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#123B70] hover:bg-[#2878E5] disabled:opacity-50 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500">
            Don&apos;t have an account?{' '}
            <button
              onClick={onNavigateToSignUp}
              className="font-bold text-[#2878E5] hover:underline"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
