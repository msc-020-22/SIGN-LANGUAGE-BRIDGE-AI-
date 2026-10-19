# Technical Architecture: Sign Language Bridge AI (SLB AI)

## 1. High-Level System Design
Sign Language Bridge AI (SLB AI) is architected as an edge-first, client-side progressive web application designed for high-speed, zero-latency inference without requiring expensive GPU server infrastructure.

```
+-----------------------------------------------------------------------------------+
|                                  BROWSER CLIENT                                   |
|                                                                                   |
|  +---------------------+      +---------------------+      +--------------------+ |
|  |   HTML5 Video /     |      |  28x28 ROI Hand     |      |  TensorFlow.js     | |
|  |   Webcam Capture    | ---> |  Extraction Canvas  | ---> |  LayersModel       | |
|  +---------------------+      +---------------------+      +--------------------+ |
|                                                                      |            |
|                                                                      v            |
|  +---------------------+      +---------------------+      +--------------------+ |
|  |   Text Composer &   | <--- |  Temporal Smoothing | <--- |  Entropy & Top-K   | |
|  |   Speech Synthesis  |      |  Majority Filter    |      |  Probabilities     | |
|  +---------------------+      +---------------------+      +--------------------+ |
+-----------------------------------------------------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                         DATA PERSISTENCE & SOVEREIGNTY                            |
|                                                                                   |
|  +---------------------------------------------+   +----------------------------+ |
|  | LocalStorage Offline Mode (Instant Testing) |   | Supabase PostgreSQL DB     | |
|  | - Recognition History Log                   |   | - Row Level Security (RLS) | |
|  | - Custom Saved Phrases                      |   | - Profiles, Phrases, Hist. | |
|  | - Vision Thresholds & User Preferences      |   | - User Settings Schema     | |
|  +---------------------------------------------+   +----------------------------+ |
+-----------------------------------------------------------------------------------+
```

## 2. Model Architecture
The deep neural network consists of an input flattening layer followed by three dense hidden layers with ReLU activations and a final 24-unit softmax output head:
1. `Flatten`: Input shape `[null, 28, 28, 1]` $\rightarrow$ `[null, 784]`
2. `Dense`: 512 units, ReLU activation, 401,920 parameters
3. `Dense`: 256 units, ReLU activation, 131,328 parameters
4. `Dense`: 128 units, ReLU activation, 32,896 parameters
5. `Dense`: 24 units, Softmax activation, 3,096 parameters

Total trainable parameters: **569,240** weights and biases serialized into `group1-shard1of1.bin` (2.28 MB).

## 3. Signal Processing & Preprocessing
- **Perceptual Luminance Extraction:**
  $$Y = 0.299 \cdot R + 0.587 \cdot G + 0.114 \cdot B$$
- **Linear Bounding Normalization:**
  $$X_{\text{norm}} = \frac{Y}{255.0} \in [0.0, 1.0]$$
- **Temporal Stability Criterion:**
  A predicted sign is deemed stable if at least 60% of the last $N$ frames (default $N=5$) agree on the identical letter.

## 4. Latency Characteristics
- Preprocessing latency: ~0.8 ms
- Inference latency (TensorFlow.js CPU backend in browser): ~0.1 ms
- Total frame-to-prediction loop: < 2.0 ms
- Enables smooth 20+ FPS real-time translation with minimal battery drain.
