import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuthRedirectUrl, supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types';
import { storageService } from '../services/storageService';

interface AuthContextType {
  user: any | null;
  profile: UserProfile;
  isLoading: boolean;
  isSupabaseConnected: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{
    success: boolean;
    error?: string;
    requiresEmailConfirmation?: boolean;
  }>;
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
      setUser(session?.user || null);
      if (session?.user) {
        setProfile((prev) => ({
          ...prev,
          id: session.user.id,
          email: session.user.email || prev.email,
          displayName: session.user.user_metadata.display_name || prev.displayName,
        }));
      }
    };

    if (!isSupabaseConfigured) {
      setUser(null);
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
        console.warn('Supabase auth initialization error:', error);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Email and password sign-in is unavailable until Supabase is configured.' };
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { success: false, error: error.message };
      }
      if (!data.user) {
        return { success: false, error: 'Sign-in did not return a user. Please try again.' };
      }
      setUser(data.user);
      const updated = storageService.updateProfile({
        email: data.user.email || email,
        id: data.user.id,
        displayName: data.user.user_metadata.display_name || email.split('@')[0],
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
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Email and password sign-up is unavailable until Supabase is configured.' };
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName || email.split('@')[0] },
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
          email: data.user.email || email,
          displayName: displayName || email.split('@')[0],
        });
        setProfile(updated);
      }

      return { success: true, requiresEmailConfirmation: !data.session };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
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
