# Sign Language Bridge AI (SLB AI)
**NYLP × AI Hackathon 2026 Submission**  
*Theme: "Build AI That Helps People."*  
*Motto: "Every sign deserves to be understood."*

---

## 🌟 Executive Summary & Mission
Sign Language Bridge AI (SLB AI) is a production-grade assistive communication system engineered to bridge communication barriers between the Deaf/Hard-of-Hearing community and hearing dialogue partners.

Unlike conceptual prototypes or hardcoded mockups, SLB AI features:
1. **Real Machine Learning Model:** Trained on the complete benchmark dataset of 34,627 samples across 24 static American Sign Language alphabet classes (A–Y, excluding dynamic motion letters J and Z).
2. **Verified Empirical Metrics:** Achieves **79.34% test accuracy** on the 7,172 held-out test set, outperforming the multinomial baseline (66.06%), with a measured client inference latency of ~0.1 ms/sample.
3. **Safety & Uncertainty Scoring:** Implements normalized Shannon entropy calculations on raw logits to flag ambiguous hand formations and poor lighting conditions, avoiding false positives.
4. **Complete Assistive Suite:**
   - **Live Webcam Recognition** with 28×28 Region of Interest (ROI) bracket extraction and sliding-window temporal smoothing.
   - **Image Sign Recognition** with candidate probability breakdown, user confirmation, and instant text composition.
   - **Dual Conversation Mode** enabling real-time dialogue where the Deaf partner signs/types and the hearing partner speaks via speech-to-text.
   - **Accessible Two-Way Communicator** with high-contrast type and Web Speech synthesis.
   - **Interactive Learning & Practice** including verified sign descriptions, mnemonic tips, flashcards, and multiple-choice quizzes with celebratory feedback.
   - **Complete Data Sovereignty & Supabase Integration** with client-side inference, zero video recording to external servers, and full SQL migrations with Row Level Security.
5. **Authentic Linguistic Integrity regarding Malawian Sign Language (MSL):** In accordance with the competition directive, we **explicitly do not relabel ASL as MSL**. We document our ethical engagement framework, dataset ingestion pipeline, and partnership pathway for native MSL community data contribution.

---

## 📊 Model & Dataset Provenance
| Attribute | Detail |
| :--- | :--- |
| **Model Name** | `SignLanguageBridge-DeepMLP-v2` |
| **Target Task** | Static ASL Fingerspelling Classification (24 Alphabet Classes) |
| **Classes Supported** | A, B, C, D, E, F, G, H, I, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y |
| **Excluded Dynamic Letters** | J and Z (require motion trajectories in ASL; documented in Model Card) |
| **Training Samples** | 27,455 samples (`ml/data/sign_mnist_train.csv`) |
| **Held-Out Test Samples** | 7,172 samples (`ml/data/sign_mnist_test.csv`) |
| **Baseline Test Accuracy** | 66.06% (Multinomial Logistic Regression benchmark) |
| **Verified Model Test Accuracy** | **79.34%** (4-layer Deep Neural Architecture) |
| **Macro F1-Score** | 77.69% |
| **Inference Latency** | ~0.102 ms per sample |
| **Runtime Engine** | TensorFlow.js LayersModel (Client-side in browser) |

---

## 🏗️ System Architecture
```
                        [ Webcam Video Stream / Photo Upload ]
                                         │
                                         ▼
                 [ Hand ROI Extraction & Perceptual Grayscale ]
                        (0.299R + 0.587G + 0.114B → [28, 28, 1])
                                         │
                                         ▼
                     [ TensorFlow.js LayersModel Inference ]
                             Input: [1, 28, 28, 1]
                                         │
                     ┌───────────────────┴───────────────────┐
                     ▼                                       ▼
          [ Softmax Probabilities ]              [ Shannon Entropy Metric ]
            (24 Output Classes)                 (H = -Σ p_i log2 p_i / log2 24)
                     │                                       │
                     ▼                                       ▼
      [ Temporal Smoothing Filter ]          [ Uncertainty Alert Trigger ]
        (Majority Voting Window)               (Confidence < 65% or H > 0.50)
                     │
                     ▼
          [ Verified Sign Output ]
                     │
     ┌───────────────┼───────────────┐
     ▼               ▼               ▼
[ Text Composer ]  [ Speech TTS ]  [ Supabase / Local History ]
```

---

## 🚀 Quickstart & Development

### 1. Prerequisites
- Node.js >= 18.0.0
- Python 3.10+ (for dataset loading and benchmark evaluation)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/jonathanzimunya/sign-language-ai-assistant.git
cd sign-language-ai-assistant

# Install frontend and ML packages
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Note: If Supabase keys are not set, the platform operates seamlessly in local neural mode with localStorage persistence!)*

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running Automated Tests & Verification
```bash
# Run Python model pipeline verification test suite
python3 -m unittest tests/test_model_pipeline.py

# Run comparative benchmark report
PYTHONPATH=. python3 -m ml.evaluate_models

# Run TypeScript compilation and build
npm run lint
npm run build
```

---

## 📁 Repository Structure
```
├── ml/                         # Machine learning training & evaluation pipeline
│   ├── class_mapping.py        # 24-class bijection & label-to-letter translation
│   ├── dataset_loader.py       # CSV parser, validation & [0, 1] normalization
│   ├── train_baseline.py       # Reproducible baseline classifier (66.06% acc)
│   ├── train_improved.py       # Deep neural classifier (79.34% acc)
│   ├── evaluate_models.py      # Comparative benchmark evaluator
│   ├── export_tfjs.py          # Exporter to TensorFlow.js model format
│   └── data/                   # Real Sign Language MNIST CSVs (train & test)
├── public/
│   └── models/                 # Client-side TensorFlow.js model artifacts
│       ├── model.json          # Layer topology with [28, 28, 1] input
│       ├── group1-shard1of1.bin# Trained weight shard (2.28 MB)
│       ├── class_mapping.json  # Class index metadata
│       └── evaluation_results.json # Verified benchmark metrics
├── src/
│   ├── components/             # Reusable UI & evaluation components
│   ├── context/                # AuthContext with Supabase & local session fallback
│   ├── data/aslAlphabet.ts     # 24 ASL letters dictionary, tips & mnemonics
│   ├── lib/supabase.ts         # Supabase client with offline mode detection
│   ├── services/
│   │   ├── inferenceEngine.ts  # TF.js loader, entropy uncertainty & top-k logic
│   │   ├── handDetector.ts     # Video stream lifecycle, ROI crop & temporal smoothing
│   │   ├── speechService.ts    # Web Speech Synthesis & Recognition
│   │   └── storageService.ts   # History, saved phrases & settings storage
│   └── pages/                  # 14 complete application interfaces
├── supabase/
│   ├── migrations/             # Production SQL migration with RLS & constraints
│   └── seed.sql                # Initial seed records
├── tests/
│   └── test_model_pipeline.py  # 6-step end-to-end automated pipeline test suite
└── docs/                       # Comprehensive technical and ethical documentation
```

---

## 🤝 Community & Acknowledgments
Built with dedication for the **NYLP × AI Hackathon 2026**.
Dedicated to creating technology that truly serves, respects, and elevates human connection.
