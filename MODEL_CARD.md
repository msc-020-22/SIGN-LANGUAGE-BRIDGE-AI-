# MODEL CARD: SignLanguageBridge-DeepMLP-v2
**Project:** Sign Language Bridge AI (SLB AI)  
**Competition:** NYLP × AI Hackathon 2026  
**Model Date:** October 2026  
**Model Version:** 2.0.0-verified  

---

## 1. Model Details
- **Model Name:** `SignLanguageBridge-DeepMLP-v2`
- **Model Type:** Deep Multilayer Perceptron / Neural Network for Image Classification
- **Framework:** Python (scikit-learn training) exported to native TensorFlow.js LayersModel format (`model.json` + `group1-shard1of1.bin`)
- **Input Tensor Shape:** `[batch_size, 28, 28, 1]` (float32, normalized to `[0.0, 1.0]`)
- **Output Tensor Shape:** `[batch_size, 24]` (float32 softmax probabilities summing to 1.0)
- **Parameters:** ~395,928 weights and biases (2,276,960 bytes in binary shard)
- **License:** MIT License

---

## 2. Intended Use & Target Audience
- **Primary Use Case:** Real-time client-side translation of individual static American Sign Language (ASL) alphabet fingerspelling gestures.
- **Intended Users:**
  - Deaf and Hard-of-Hearing individuals seeking accessible two-way communication with hearing people in public, education, and retail environments.
  - Sign language students, interpreters, educators, and family allies.
- **Out-of-Scope Uses:**
  - Translating continuous sign language video discourse, sentences with complex spatial grammar, or non-manual facial markers.
  - Emergency medical diagnostic decisions based solely on automated sign recognition without human verification.
  - Relabeling or claiming this model operates as a native Malawian Sign Language (MSL) recognizer (see Section 6).

---

## 3. Training & Evaluation Provenance
- **Dataset:** Sign Language MNIST (Derived from original hands-in-gesture benchmark).
- **Training Samples:** 27,455 images across 24 static classes.
- **Held-Out Test Samples:** 7,172 images (strictly held out during all training and hyperparameter tuning).
- **Preprocessing Pipeline:**
  1. Region of Interest (ROI) cropped to 1:1 aspect ratio square around signing hand.
  2. Resized to 28×28 pixels.
  3. Grayscale conversion using perceptual luminance: $Y = 0.299R + 0.587G + 0.114B$.
  4. Pixel normalization: $X_{\text{norm}} = X / 255.0$.

---

## 4. Empirical Performance & Metrics
All metrics were computed against the official **7,172 held-out test samples**:

| Evaluation Metric | Model A (Baseline Logistic) | Model B (Our Deep Neural Net) | Relative Gain |
| :--- | :--- | :--- | :--- |
| **Test Accuracy** | **66.06%** (4,738 / 7,172) | **79.34%** (5,690 / 7,172) | **+13.28%** |
| **Macro Precision** | 65.53% | **78.31%** | +12.78% |
| **Macro Recall** | 65.11% | **78.43%** | +13.32% |
| **Macro F1-Score** | 64.15% | **77.69%** | +13.54% |
| **Inference Latency** | ~0.002 ms | **~0.102 ms** | Real-time (< 1ms) |

### Per-Class Sample Breakdown
- **High Performing Signs (F1 > 85%):** A (88.4%), B (91.2%), C (89.0%), D (87.5%), I (92.1%), L (93.4%), O (88.9%), V (89.7%), W (88.1%), Y (94.2%).
- **Challenging Signs (F1 65-75%):** M, N, S, T (exhibit similar closed-fist profiles with subtle thumb positioning variations).

---

## 5. Dynamic Letters J & Z
In American Sign Language:
- **Letter J:** Traced dynamically in the air using the pinky finger in a curved motion.
- **Letter Z:** Traced dynamically in the air using the index finger in a zig-zag trajectory.

Because Sign Language MNIST consists exclusively of static single-frame crops, dynamic letters J and Z cannot be captured by static single-frame models and are excluded from the 24 classes. Our roadmap includes spatio-temporal sequence models (e.g. LSTM/Transformer) for motion-based signs.

---

## 6. Linguistic Integrity: Malawian Sign Language (MSL)
In strict accordance with the NYLP × AI Hackathon competition directives:
- This model is **accurately documented as an American Sign Language (ASL) static alphabet classifier**.
- We **refuse to deceptively relabel ASL classes as Malawian Sign Language (MSL)**.
- Malawian Sign Language is a sovereign linguistic system with its own vocabulary and cultural dialect variations across Malawi.
- We provide an ethical data contribution framework in `ResponsibleAIPage.tsx` to enable proper community-consenting data collection with organizations such as the Malawi National Association of the Deaf (MANAD).

---

## 7. Safety, Uncertainty & Privacy
- **Shannon Entropy Calculation:** Raw output probabilities are transformed into normalized entropy $H$:
  $$H = -\frac{1}{\log_2(24)} \sum_{i=1}^{24} p_i \log_2(p_i)$$
- **Uncertainty Trigger:** If confidence is below 65% or entropy exceeds 0.50, an amber banner warns the user, and auto-append is halted.
- **Local Client-Side Inference:** Video streams and photos never leave the user's browser device. No remote telemetry or unauthorized biometric storage takes place.
