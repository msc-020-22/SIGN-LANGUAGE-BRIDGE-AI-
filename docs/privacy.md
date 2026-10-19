# Privacy, Data Sovereignty & Ethics: SLB AI

## 1. Zero Cloud Video Streaming
Sign Language Bridge AI operates on an **Edge-First Privacy** model:
- Camera video frames are acquired directly by the user's browser via HTML5 `<video>` and Canvas elements.
- Model inference is performed locally inside the browser client through TensorFlow.js.
- **No video streams, webcam feeds, or user gesture photos are ever streamed, saved, or uploaded to any external server.**

## 2. Recognition History Control
- Recognition logs are saved by default in the user's private browser session or authenticated Supabase account.
- Users can disable recognition logging at any time in **Settings $\rightarrow$ Privacy & Data Retention**.
- Users can clear their entire history log with one click or export their data to JSON or CSV.

## 3. Row Level Security & Access Control
- All remote database tables in Supabase use strict PostgreSQL Row Level Security (RLS) policies tied to `auth.uid() = user_id`.
- The frontend never uses or exposes a Supabase `service_role` admin key.

## 4. Linguistic & Community Ethics
- **No False Re-labeling:** We explicitly do not relabel American Sign Language as Malawian Sign Language.
- **Community Partnership:** Future native MSL models will only be trained in partnership with the Malawian Deaf community with documented Free, Prior, and Informed Consent (FPIC).
