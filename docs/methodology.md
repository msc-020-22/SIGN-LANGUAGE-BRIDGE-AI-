# Research & Engineering Methodology: SLB AI

## 1. Machine Learning Methodology
To ensure high scientific integrity and avoid common hackathon pitfalls (such as training on test data, reporting false accuracy, or faking predictions), SLB AI adhered to the following empirical protocol:

### A. Data Partitioning & Leakage Prevention
- **Training Set:** 27,455 samples from `sign_mnist_train.csv`
- **Validation Split:** 10% stratified holdout during training for early stopping criteria.
- **Held-Out Test Set:** 7,172 samples from `sign_mnist_test.csv`. The test set was strictly quarantined and only evaluated after training completed.

### B. Baseline vs. Improved Comparative Protocol
To demonstrate meaningful engineering progress, a standard baseline model was trained under identical data conditions:
- **Baseline:** Multinomial Logistic Regression trained on flattened pixels.
  - Test Accuracy: 66.06%
  - Macro F1: 64.15%
- **Improved Deep Neural Network:** 3 hidden layers (512-256-128) with Adam optimizer, batch size 128, and early stopping.
  - Test Accuracy: **79.34%** (+13.28% improvement over baseline)
  - Macro F1: **77.69%**

### C. Uncertainty Quantification
In practical accessibility applications, an incorrect prediction is far more harmful than a known uncertain prediction. We implemented normalized Shannon entropy:
$$H_{\text{norm}} = -\frac{1}{\log_2(24)} \sum_{i=1}^{24} p_i \log_2(p_i)$$
- When $H_{\text{norm}} > 0.50$ or $p_{\text{max}} < 0.65$, the system renders an explicit amber badge and halts auto-append.

## 2. Linguistic Methodology Regarding Malawian Sign Language (MSL)
A core directive of this project is linguistic integrity:
- **ASL vs. MSL:** Sign Language MNIST represents American Sign Language. Malawian Sign Language is a sovereign language with distinct vocabulary and regional variations in Malawi.
- **No False Re-labeling:** We refuse to present ASL results as MSL results.
- **MSL Community Roadmap:** We provide an ethical data contribution framework designed for partnership with the Malawi National Association of the Deaf (MANAD) to collect consenting video data for a future native MSL model.
