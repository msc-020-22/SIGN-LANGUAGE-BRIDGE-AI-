import { RecognitionHistoryItem, SavedPhrase, UserSettings, UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const HISTORY_KEY = 'slb_ai_recognition_history';
const SAVED_PHRASES_KEY = 'slb_ai_saved_phrases';
const SETTINGS_KEY = 'slb_ai_user_settings';
const PROFILE_KEY = 'slb_ai_user_profile';

export const DEFAULT_SETTINGS: UserSettings = {
  confidenceThreshold: 0.65,
  smoothingWindowSize: 5,
  uncertaintyThreshold: 0.50,
  autoSpeak: true,
  speechRate: 1.0,
  speechPitch: 1.0,
  cameraResolution: '640x480',
  mirrorCamera: true,
  highContrastMode: false,
  offlineModeOnly: false,
  saveHistory: true,
  hapticFeedback: true,
};

export const INITIAL_SAVED_PHRASES: SavedPhrase[] = [
  { id: 'p-1', phrase: 'HELLO, NICE TO MEET YOU', category: 'Greetings', usageCount: 14, createdAt: '2026-10-18T10:00:00Z', isFavorite: true },
  { id: 'p-2', phrase: 'THANK YOU VERY MUCH', category: 'General', usageCount: 22, createdAt: '2026-10-18T10:05:00Z', isFavorite: true },
  { id: 'p-3', phrase: 'CAN YOU PLEASE REPEAT THAT?', category: 'Questions', usageCount: 8, createdAt: '2026-10-18T10:10:00Z', isFavorite: false },
  { id: 'p-4', phrase: 'I AM DEAF AND COMMUNICATE VIA SIGN', category: 'General', usageCount: 19, createdAt: '2026-10-18T10:15:00Z', isFavorite: true },
  { id: 'p-5', phrase: 'PLEASE SPEAK CLEARLY OR TYPE HERE', category: 'General', usageCount: 11, createdAt: '2026-10-18T10:20:00Z', isFavorite: false },
  { id: 'p-6', phrase: 'I NEED ASSISTANCE', category: 'Emergency', usageCount: 5, createdAt: '2026-10-18T10:25:00Z', isFavorite: true },
  { id: 'p-7', phrase: 'WHERE IS THE RESTROOM?', category: 'Questions', usageCount: 7, createdAt: '2026-10-18T10:30:00Z', isFavorite: false },
  { id: 'p-8', phrase: 'HAVE A WONDERFUL DAY', category: 'Greetings', usageCount: 12, createdAt: '2026-10-18T10:35:00Z', isFavorite: false },
];

export const storageService = {
  // --- HISTORY ---
  getHistory(): RecognitionHistoryItem[] {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Failed to read history from localStorage', e);
      return [];
    }
  },

  async addHistoryItem(item: Omit<RecognitionHistoryItem, 'id'>): Promise<RecognitionHistoryItem> {
    const newItem: RecognitionHistoryItem = {
      ...item,
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };

    const current = this.getHistory();
    const updated = [newItem, ...current].slice(0, 500); // keep max 500
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage quota exceeded for history', e);
    }

    if (isSupabaseConfigured) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('recognition_history').insert({
            user_id: user.id,
            letter: newItem.letter,
            confidence: newItem.confidence,
            source: newItem.source,
            confirmed_by_user: newItem.confirmedByUser,
            corrected_to: newItem.correctedTo,
            notes: newItem.notes,
          });
        }
      } catch (err) {
        console.warn('Supabase history sync warning:', err);
      }
    }

    return newItem;
  },

  clearHistory(): void {
    localStorage.removeItem(HISTORY_KEY);
  },

  deleteHistoryItem(id: string): void {
    const filtered = this.getHistory().filter((i) => i.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  },

  exportHistoryJSON(): string {
    return JSON.stringify(this.getHistory(), null, 2);
  },

  exportHistoryCSV(): string {
    const items = this.getHistory();
    if (!items.length) return 'ID,Timestamp,Letter,Confidence,Source,Confirmed,CorrectedTo\n';
    const rows = items.map((i) =>
      `"${i.id}","${i.timestamp}","${i.letter}",${i.confidence},"${i.source}",${i.confirmedByUser},"${i.correctedTo || ''}"`
    );
    return ['ID,Timestamp,Letter,Confidence,Source,Confirmed,CorrectedTo', ...rows].join('\n');
  },

  // --- SAVED PHRASES ---
  getSavedPhrases(): SavedPhrase[] {
    try {
      const data = localStorage.getItem(SAVED_PHRASES_KEY);
      if (!data) {
        localStorage.setItem(SAVED_PHRASES_KEY, JSON.stringify(INITIAL_SAVED_PHRASES));
        return INITIAL_SAVED_PHRASES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SAVED_PHRASES;
    }
  },

  savePhrase(phrase: string, category: SavedPhrase['category'] = 'General'): SavedPhrase {
    const list = this.getSavedPhrases();
    const newPhrase: SavedPhrase = {
      id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      phrase: phrase.trim(),
      category,
      usageCount: 1,
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };
    const updated = [newPhrase, ...list];
    localStorage.setItem(SAVED_PHRASES_KEY, JSON.stringify(updated));
    return newPhrase;
  },

  deletePhrase(id: string): void {
    const filtered = this.getSavedPhrases().filter((p) => p.id !== id);
    localStorage.setItem(SAVED_PHRASES_KEY, JSON.stringify(filtered));
  },

  toggleFavoritePhrase(id: string): void {
    const updated = this.getSavedPhrases().map((p) =>
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    );
    localStorage.setItem(SAVED_PHRASES_KEY, JSON.stringify(updated));
  },

  incrementPhraseUsage(id: string): void {
    const updated = this.getSavedPhrases().map((p) =>
      p.id === id ? { ...p, usageCount: p.usageCount + 1 } : p
    );
    localStorage.setItem(SAVED_PHRASES_KEY, JSON.stringify(updated));
  },

  // --- SETTINGS ---
  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: Partial<UserSettings>): UserSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  },

  resetSettings(): UserSettings {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  },

  // --- PROFILE & PROGRESS ---
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      if (data) return JSON.parse(data);
    } catch {}

    const defaultProfile: UserProfile = {
      id: 'local-user-default',
      email: 'user@slb-ai.org',
      displayName: 'Sign Language Communicator',
      preferredSignLanguage: 'ASL',
      role: 'learner',
      signsMastered: 18,
      totalRecognitions: 142,
      quizStreak: 4,
      createdAt: '2026-10-01T08:00:00Z',
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  },

  updateProfile(profile: Partial<UserProfile>): UserProfile {
    const current = this.getProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    return updated;
  },
};
