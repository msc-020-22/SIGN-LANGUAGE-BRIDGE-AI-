import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuthRedirectUrl, supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types';
import { storageService } from '../services/storageService';

interface AuthContextType {
  user: any | null;
  profile: UserProfile;
  isLoading: boolean;
  isSupabaseConnected: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; isUnconfirmed?: boolean }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{
    success: boolean;
    error?: string;
    requiresEmailConfirmation?: boolean;
  }>;
  signInAsGuest: (customEmail?: string) => void;
  resendConfirmation: (email: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile>(storageService.getProfile());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    const applySession = (session: Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        setProfile((prev) => ({
          ...prev,
          id: session.user.id,
          email: session.user.email || prev.email,
          displayName: session.user.user_metadata?.display_name || prev.displayName,
        }));
      } else {
        // Check if there was a saved local session in storageService
        const savedProfile = storageService.getProfile();
        if (savedProfile && savedProfile.id && savedProfile.email && savedProfile.id !== 'local_user_1') {
          setUser({ id: savedProfile.id, email: savedProfile.email, user_metadata: { display_name: savedProfile.displayName } });
        } else {
          setUser(null);
        }
      }
    };

    if (!isSupabaseConfigured) {
      const savedProfile = storageService.getProfile();
      if (savedProfile?.id && savedProfile.email && savedProfile.id !== 'local_user_1') {
        setUser({ id: savedProfile.id, email: savedProfile.email, user_metadata: { display_name: savedProfile.displayName } });
      } else {
        setUser(null);
      }
      setIsLoading(false);
      return () => {
        mounted = false;
      };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session);
    });

    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) throw error;
        applySession(session);
      })
      .catch((error: unknown) => {
        console.warn('Supabase auth initialization warning:', error);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string; isUnconfirmed?: boolean }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        const isUnconfirmed = error.message.toLowerCase().includes('email not confirmed');
        return { 
          success: false, 
          error: isUnconfirmed 
            ? 'Your email address has not been confirmed yet. Please check your inbox or click "Resend Confirmation Email" below.' 
            : error.message,
          isUnconfirmed
        };
      }
      if (!data.user) {
        return { success: false, error: 'Sign-in did not return a user. Please try again.' };
      }
      setUser(data.user);
      const updated = storageService.updateProfile({
        email: data.user.email || email,
        id: data.user.id,
        displayName: data.user.user_metadata?.display_name || email.split('@')[0],
      });
      setProfile(updated);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }> => {
    setIsLoading(true);
    try {
      const cleanEmail = email.trim();
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: { display_name: displayName || cleanEmail.split('@')[0] },
          emailRedirectTo: getAuthRedirectUrl(),
        },
      });
      if (error) {
        return { success: false, error: error.message };
      }
      if (!data.user) {
        return { success: false, error: 'Account creation did not return a user. Please try again.' };
      }

      if (data.session) {
        setUser(data.session.user);
        const updated = storageService.updateProfile({
          id: data.user.id,
          email: data.user.email || cleanEmail,
          displayName: displayName || cleanEmail.split('@')[0],
        });
        setProfile(updated);
        return { success: true, requiresEmailConfirmation: false };
      }

      return { success: true, requiresEmailConfirmation: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const resendConfirmation = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: getAuthRedirectUrl(),
        },
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to resend confirmation email.' };
    }
  };

  const signInAsGuest = (customEmail?: string) => {
    const targetEmail = customEmail?.trim() || 'jonathanzimunya773@gmail.com';
    const guestUser = {
      id: `guest_${Date.now()}`,
      email: targetEmail,
      user_metadata: {
        display_name: targetEmail.split('@')[0],
      },
    };
    setUser(guestUser);
    const updated = storageService.updateProfile({
      id: guestUser.id,
      email: targetEmail,
      displayName: guestUser.user_metadata.display_name,
    });
    setProfile(updated);
  };

  const signOut = async (): Promise<void> => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    storageService.updateProfile({ id: 'local_user_1', email: 'guest@bridge.ai', displayName: 'Communicator' });
    setUser(null);
  };

  const updateProfile = (partial: Partial<UserProfile>) => {
    const updated = storageService.updateProfile(partial);
    setProfile(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isSupabaseConnected: isSupabaseConfigured,
        signIn,
        signUp,
        signInAsGuest,
        resendConfirmation,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
