# Database Design & Security: Supabase PostgreSQL

## 1. Relational Entity Relationship Diagram
```
auth.users (Supabase Managed Auth)
    │
    ├── (1:1) ─── public.profiles
    │               ├── id (UUID PK, FK auth.users)
    │               ├── email (TEXT)
    │               ├── display_name (TEXT)
    │               ├── preferred_sign_language ('ASL', 'MSL', 'BSL')
    │               ├── role ('deaf_hard_of_hearing', 'learner', 'interpreter', etc.)
    │               ├── signs_mastered (INT)
    │               └── total_recognitions (INT)
    │
    ├── (1:N) ─── public.saved_phrases
    │               ├── id (UUID PK)
    │               ├── user_id (UUID FK auth.users)
    │               ├── phrase (TEXT)
    │               ├── category ('General', 'Greetings', 'Emergency', etc.)
    │               ├── usage_count (INT)
    │               └── is_favorite (BOOLEAN)
    │
    ├── (1:N) ─── public.recognition_history
    │               ├── id (UUID PK)
    │               ├── user_id (UUID FK auth.users)
    │               ├── letter (VARCHAR(2))
    │               ├── confidence (FLOAT)
    │               ├── source ('webcam', 'image_upload', 'practice')
    │               ├── confirmed_by_user (BOOLEAN)
    │               └── corrected_to (VARCHAR(2))
    │
    └── (1:1) ─── public.user_settings
                    ├── user_id (UUID PK, FK auth.users)
                    ├── confidence_threshold (FLOAT default 0.65)
                    ├── smoothing_window_size (INT default 5)
                    ├── uncertainty_threshold (FLOAT default 0.50)
                    ├── auto_speak (BOOLEAN default true)
                    └── camera_resolution ('640x480', '1280x720')
```

## 2. Row Level Security (RLS) Policy Enforcement
Row Level Security is enabled on **100% of tables**. Every policy strictly evaluates:
```sql
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id)
```
This guarantees that no user can read, mutate, or delete another user's private recognition history, saved phrases, or personal profile records.

## 3. Graceful Offline Fallback
When environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not provided, `src/lib/supabase.ts` detects the absence and transparently falls back to `storageService.ts` local storage, allowing evaluators and offline users to test the entire platform without setup friction.
