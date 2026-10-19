"""
Baseline Model Trainer for Sign Language MNIST
==============================================
Trains a baseline Linear/MLP model on Sign Language MNIST.
Used as the benchmark against which the Deep Convolutional Neural Network is evaluated.
"""

import os
import json
import time
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix
from ml.dataset_loader import load_csv, TRAIN_CSV, TEST_CSV
from ml.class_mapping import CLASS_NAMES, NUM_CLASSES

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'artifacts')


def train_baseline_model():
    print("=== TRAINING BASELINE MODEL (Logistic Regression / Linear Softmax) ===")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("Loading datasets...")
    X_train, y_train = load_csv(TRAIN_CSV)
    X_test, y_test = load_csv(TEST_CSV)

    # Flatten (N, 28, 28, 1) -> (N, 784)
    X_train_flat = X_train.reshape((X_train.shape[0], -1))
    X_test_flat = X_test.reshape((X_test.shape[0], -1))

    print(f"Training shape: {X_train_flat.shape}, Test shape: {X_test_flat.shape}")

    start_time = time.time()
    clf = LogisticRegression(
        max_iter=100,
        solver='lbfgs',
        random_state=42,
        verbose=1
    )
    clf.fit(X_train_flat, y_train)
    training_duration = time.time() - start_time
    print(f"Baseline training completed in {training_duration:.2f}s")

    # Evaluate
    start_eval = time.time()
    y_pred = clf.predict(X_test_flat)
    eval_duration = time.time() - start_eval
    avg_latency = (eval_duration / len(X_test_flat)) * 1000

    acc = accuracy_score(y_test, y_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='macro', zero_division=0)
    cm = confusion_matrix(y_test, y_pred, labels=list(range(NUM_CLASSES)))

    print(f"\n--- Baseline Evaluation Results ---")
    print(f"Accuracy: {acc * 100:.2f}%")
    print(f"Macro Precision: {precision * 100:.2f}%")
    print(f"Macro Recall: {recall * 100:.2f}%")
    print(f"Macro F1-Score: {f1 * 100:.2f}%")
    print(f"Average Latency: {avg_latency:.3f} ms/sample")

    results = {
        'model_name': 'Baseline-MultinomialLogisticRegression',
        'dataset': 'Sign Language MNIST',
        'train_samples': len(X_train),
        'test_samples': len(X_test),
        'accuracy': float(round(acc, 4)),
        'macro_precision': float(round(precision, 4)),
        'macro_recall': float(round(recall, 4)),
        'macro_f1': float(round(f1, 4)),
        'avg_latency_ms': float(round(avg_latency, 3)),
        'training_duration_sec': float(round(training_duration, 2)),
        'classes': CLASS_NAMES,
        'confusion_matrix': cm.tolist()
    }

    out_file = os.path.join(OUTPUT_DIR, 'baseline_evaluation.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2)
    print(f"Baseline evaluation saved to {out_file}")

    return results


if __name__ == '__main__':
    train_baseline_model()
