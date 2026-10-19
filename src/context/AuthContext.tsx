import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types';
import { storageService } from '../services/storageService';

interface AuthContextType {
  user: any | null;
  profile: UserProfile;
  isLoading: boolean;
  isSupabaseConnected: boolean;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password?: string, displayName?: string) => Promise<{ success: boolean; error?: string }>;
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

    async function initAuth() {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (mounted) {
            setUser(session?.user || null);
            if (session?.user) {
              setProfile((prev) => ({
                ...prev,
                id: session.user.id,
                email: session.user.email || prev.email,
              }));
            }
          }

          const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) {
              setUser(session?.user || null);
              if (session?.user) {
                setProfile((prev) => ({
                  ...prev,
                  id: session.user.id,
                  email: session.user.email || prev.email,
                }));
              }
            }
          });

          return () => {
            subscription.unsubscribe();
          };
        } catch (e) {
          console.warn('Supabase auth initialization error, using local fallback:', e);
        }
      } else {
        // Fallback local user
        const localProf = storageService.getProfile();
        setUser({
          id: localProf.id,
          email: localProf.email,
          user_metadata: { display_name: localProf.displayName },
        });
      }

      if (mounted) setIsLoading(false);
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        setUser(data.user);
        const updated = storageService.updateProfile({ email, id: data.user.id });
        setProfile(updated);
        setIsLoading(false);
        return { success: true };
      } else {
        // Local mode sign in
        const updated = storageService.updateProfile({ email, displayName: email.split('@')[0] });
        setUser({ id: updated.id, email, user_metadata: { display_name: updated.displayName } });
        setProfile(updated);
        setIsLoading(false);
        return { success: true };
      }
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Authentication failed' };
    }
  };

  const signUp = async (
    email: string,
    password?: string,
    displayName?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && password) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName || email.split('@')[0] } },
        });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        setUser(data.user);
        if (data.user) {
          const updated = storageService.updateProfile({
            id: data.user.id,
            email,
            displayName: displayName || email.split('@')[0],
          });
          setProfile(updated);
        }
        setIsLoading(false);
        return { success: true };
      } else {
        // Local mode sign up
        const updated = storageService.updateProfile({
          email,
          displayName: displayName || email.split('@')[0],
        });
        setUser({ id: updated.id, email, user_metadata: { display_name: updated.displayName } });
        setProfile(updated);
        setIsLoading(false);
        return { success: true };
      }
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Sign up failed' };
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
