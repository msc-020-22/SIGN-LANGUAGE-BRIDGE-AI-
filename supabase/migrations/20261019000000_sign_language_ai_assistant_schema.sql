-- ====================================================================
-- SIGN LANGUAGE BRIDGE AI (SLB AI) - SUPABASE DATABASE SCHEMA MIGRATION
-- Project: NYLP × AI Hackathon 2026
-- ====================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT DEFAULT 'Communicator',
  avatar_url TEXT,
  preferred_sign_language TEXT DEFAULT 'ASL' CHECK (preferred_sign_language IN ('ASL', 'MSL', 'BSL')),
  role TEXT DEFAULT 'learner' CHECK (role IN ('deaf_hard_of_hearing', 'learner', 'interpreter', 'educator', 'ally')),
  signs_mastered INTEGER DEFAULT 0 CHECK (signs_mastered >= 0 AND signs_mastered <= 24),
  total_recognitions INTEGER DEFAULT 0 CHECK (total_recognitions >= 0),
  quiz_streak INTEGER DEFAULT 0 CHECK (quiz_streak >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. SAVED PHRASES TABLE
CREATE TABLE IF NOT EXISTS public.saved_phrases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  phrase TEXT NOT NULL,
  category TEXT DEFAULT 'General' CHECK (category IN ('General', 'Greetings', 'Emergency', 'Questions', 'Work', 'Family', 'Custom')),
  usage_count INTEGER DEFAULT 1 CHECK (usage_count >= 0),
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.saved_phrases ENABLE ROW LEVEL SECURITY;

-- Saved Phrases Policies
CREATE POLICY "Users can view own saved phrases"
  ON public.saved_phrases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved phrases"
  ON public.saved_phrases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved phrases"
  ON public.saved_phrases FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved phrases"
  ON public.saved_phrases FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_saved_phrases_user_id ON public.saved_phrases(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_phrases_category ON public.saved_phrases(category);

-- 3. RECOGNITION HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.recognition_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  letter VARCHAR(2) NOT NULL,
  confidence FLOAT NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
  source TEXT DEFAULT 'webcam' CHECK (source IN ('webcam', 'image_upload', 'practice')),
  confirmed_by_user BOOLEAN DEFAULT TRUE,
  corrected_to VARCHAR(2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.recognition_history ENABLE ROW LEVEL SECURITY;

-- Recognition History Policies
CREATE POLICY "Users can view own recognition history"
  ON public.recognition_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recognition history"
  ON public.recognition_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recognition history"
  ON public.recognition_history FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_recognition_history_user_id ON public.recognition_history(user_id);
CREATE INDEX IF NOT EXISTS idx_recognition_history_created_at ON public.recognition_history(created_at DESC);

-- 4. USER SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  confidence_threshold FLOAT DEFAULT 0.65 CHECK (confidence_threshold >= 0.1 AND confidence_threshold <= 1.0),
  smoothing_window_size INTEGER DEFAULT 5 CHECK (smoothing_window_size >= 1 AND smoothing_window_size <= 20),
  uncertainty_threshold FLOAT DEFAULT 0.50 CHECK (uncertainty_threshold >= 0.1 AND uncertainty_threshold <= 1.0),
  auto_speak BOOLEAN DEFAULT TRUE,
  speech_rate FLOAT DEFAULT 1.0,
  speech_pitch FLOAT DEFAULT 1.0,
  camera_resolution TEXT DEFAULT '640x480' CHECK (camera_resolution IN ('640x480', '1280x720')),
  mirror_camera BOOLEAN DEFAULT TRUE,
  high_contrast_mode BOOLEAN DEFAULT FALSE,
  save_history BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Settings Policies
CREATE POLICY "Users can view own settings"
  ON public.user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON public.user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON public.user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- 5. AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );

  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
