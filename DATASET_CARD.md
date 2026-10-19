# DATASET CARD: Sign Language MNIST
**Benchmark:** Sign Language MNIST  
**Project:** Sign Language Bridge AI (SLB AI)  
**Competition:** NYLP × AI Hackathon 2026  

---

## 1. Dataset Summary
Sign Language MNIST is an established computer vision benchmark designed for static hand gesture recognition. It maps 24 static American Sign Language (ASL) alphabet letters onto a standardized 28×28 grayscale pixel format, directly analogous to the classic MNIST digits and Fashion-MNIST datasets.

**Source:** [Sign Language MNIST on Kaggle](https://www.kaggle.com/datasets/datamunge/sign-language-mnist) (dataset owner: datamunge) · **License:** CC0: Public Domain.

---

## 2. Dataset Structure
Each sample in the dataset is represented as a single row in CSV format:
- **Column 1 (`label`):** Raw numeric class label ranging from 0 to 24 (excluding label 9 for dynamic letter J).
- **Columns 2–785 (`pixel1` to `pixel784`):** Grayscale pixel intensities from 0 to 255 representing a 28×28 pixel image arranged in row-major order.

### Sample Counts by Split
- **Training Set (`ml/data/sign_mnist_train.csv`):** 27,455 samples (83.28 MB)
- **Official Held-Out Test Set (`ml/data/sign_mnist_test.csv`):** 7,172 samples (21.78 MB)
- **Total Samples:** 34,627 samples

---

## 3. Class Distribution & Mapping Table
Because ASL letters **J** (label 9) and **Z** (label 25) require spatial movement over time, they are omitted from static 2D image benchmarks. The remaining 24 static letters are mapped as follows:

| Model Class Index (0–23) | Dataset Label in CSV | ASL Letter | Train Samples | Test Samples |
| :---: | :---: | :---: | :---: | :---: |
| 0 | 0 | A | 1,126 | 331 |
| 1 | 1 | B | 1,010 | 432 |
| 2 | 2 | C | 1,144 | 310 |
| 3 | 3 | D | 1,196 | 245 |
| 4 | 4 | E | 957 | 498 |
| 5 | 5 | F | 1,204 | 247 |
| 6 | 6 | G | 1,090 | 348 |
| 7 | 7 | H | 1,013 | 436 |
| 8 | 8 | I | 1,162 | 288 |
| 9 | 10 | K | 1,114 | 331 |
| 10 | 11 | L | 1,241 | 209 |
| 11 | 12 | M | 1,055 | 394 |
| 12 | 13 | N | 1,151 | 291 |
| 13 | 14 | O | 1,196 | 246 |
| 14 | 15 | P | 1,088 | 347 |
| 15 | 16 | Q | 1,279 | 164 |
| 16 | 17 | R | 1,294 | 144 |
| 17 | 18 | S | 1,199 | 246 |
| 18 | 19 | T | 1,186 | 248 |
| 19 | 20 | U | 1,161 | 266 |
| 20 | 21 | V | 1,082 | 346 |
| 21 | 22 | W | 1,225 | 206 |
| 22 | 23 | X | 1,164 | 267 |
| 23 | 24 | Y | 1,118 | 332 |

---

## 4. Data Preprocessing & Leakage Prevention
1. **Normalization:** Pixel values are scaled linearly from $[0, 255]$ to $[0.0, 1.0]$ float32 values.
2. **Strict Split Separation:** The 7,172 test samples were never used during training or parameter selection.
3. **No Synthetic Fabrication:** All training and evaluation occurred exclusively on genuine benchmark dataset rows.

---

## 5. Limitations & Ethical Considerations
- **Skin Tone Diversity:** Historical datasets often underrepresent diverse skin pigmentations; our live client preprocessing mitigates this via adaptive contrast and bounding box luminance centering.
- **Lighting Sensitivity:** Low ambient lighting decreases signal-to-noise ratio in 28×28 crops. SLB AI flags low confidence states with clear on-screen visual alerts.
- **Linguistic Integrity:** This dataset is derived from American Sign Language. It does not represent British Sign Language (BSL), French Sign Language (LSF), or Malawian Sign Language (MSL).
