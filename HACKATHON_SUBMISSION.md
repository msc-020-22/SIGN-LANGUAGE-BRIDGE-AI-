# NYLP × AI HACKATHON 2026 SUBMISSION
**Project:** Sign Language Bridge AI (SLB AI)  
**Author:** Jonathan Zimunya (`jonathanzimunya773@gmail.com`)  
**Competition Theme:** "BUILD AI THAT HELPS PEOPLE."  
**Motto:** *"Every sign deserves to be understood."*  

---

## 🎯 Project Overview & Impact
Over 70 million Deaf and Hard-of-Hearing individuals worldwide face daily communication friction when interacting with hearing people in public spaces, medical clinics, schools, and workplaces.

**Sign Language Bridge AI (SLB AI)** transforms any standard web browser into an instant, private, real-time sign language interpreter and communication station.

### Core Value Deliverables
1. **Real Machine Learning Engine:** Powered by a deep neural network trained on 27,455 samples and evaluated on 7,172 held-out test samples, yielding **79.34% verified accuracy** (outperforming the 66.06% baseline) with sub-millisecond client-side latency.
2. **Honesty & Anti-Hallucination:** Implements Shannon entropy uncertainty quantification. When confidence is borderline or lighting is suboptimal, an explicit amber uncertainty badge warns the user rather than guessing blindly.
3. **Dual Dialogue Mode:** A purpose-built interface enabling natural two-way conversation between Deaf signers and hearing speakers via integrated Web Speech API transcription.
4. **Linguistic Responsibility Regarding Malawian Sign Language:** We strictly uphold competition integrity by refusing to relabel ASL as MSL. Instead, we establish a community-consenting data contribution pipeline and roadmap for native MSL data collection.
5. **Zero Cloud Telemetry & Total Privacy:** Camera frames are cropped and processed entirely in client-side memory using TensorFlow.js. No private video feeds are ever recorded or transmitted to external servers.

---

## 🛠️ Technical Implementation Highlights
- **Computer Vision & Inference Pipeline:**
  - Real-time video frame acquisition and 1:1 square Region of Interest (ROI) bracket extraction.
  - Perceptual luminance grayscale conversion ($0.299R + 0.587G + 0.114B$).
  - Bilinear downscaling to $28 \times 28$ pixels and float32 normalization to $[0.0, 1.0]$.
  - Native browser evaluation using TensorFlow.js LayersModel (`model.json` + `group1-shard1of1.bin`).
  - Temporal smoothing via sliding-window majority voting across frames to eliminate flickering.
- **Frontend Architecture:**
  - React 19 SPA with TypeScript and Vite.
  - Accessible styling using Tailwind CSS with custom palette (Navy `#123B70`, Royal Blue `#2878E5`, Cyan `#35C6D4`, Pale Blue `#F2F7FD`).
  - 14 complete functional views: Live Camera, Image Classifier, Two-Way Text, Dual Dialogue, Sign Dictionary, Practice & Quizzes, Saved Phrases, History Log, Progress Metrics, Settings, Account, Help Guide, Responsible AI, and Authentication.
- **Backend & Database:**
  - Supabase client configured with graceful offline/local mode fallback.
  - Production PostgreSQL migration schema in `supabase/migrations/` featuring Row Level Security (RLS) on all tables, foreign key constraints, indexes, and automated profile triggers.

---

## 🔬 Empirical Verification Summary
- **Benchmark Dataset:** Sign Language MNIST (34,627 total samples across 24 classes).
- **Test Samples Evaluated:** 7,172 held-out images.
- **Model A (Baseline Logistic Regression):** 66.06% test accuracy, 64.15% macro F1.
- **Model B (Our Deep Neural Architecture):** **79.34% test accuracy**, **77.69% macro F1**.
- **Automated Test Results:** All 6 test suites in `tests/test_model_pipeline.py` pass cleanly.

---

## 🏆 Checklist of Verified Features
- [x] Real trained TensorFlow.js neural network (no fake predictions, no random labels).
- [x] Live webcam recognition with ROI guide and temporal smoothing.
- [x] Image file drag-and-drop / upload recognition with candidate probability breakdown.
- [x] Real-time Shannon entropy uncertainty scoring.
- [x] Text-to-speech voice synthesis and speech-to-text hearing partner transcription.
- [x] Dual conversation chat mode with transcript export.
- [x] Browsable 24-sign ASL alphabet dictionary with mnemonic tips and pitfalls.
- [x] Multiple-choice quizzes and interactive flashcards with confetti celebration.
- [x] Saved phrases library with categorized chips and usage tracking.
- [x] Audit history log with search, filtering, and CSV/JSON export.
- [x] Progress tracking with 24-sign mastery matrix and badges.
- [x] User configuration controls (confidence threshold, smoothing window, camera resolution).
- [x] Transparent Model Card, Dataset Card, and MSL community roadmap.
- [x] Supabase database schema with RLS and seed data.
- [x] Downloadable submission ZIP archive (`SLB-AI-submission.zip`).
