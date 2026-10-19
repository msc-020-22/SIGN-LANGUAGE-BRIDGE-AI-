"""
Improved Deep Neural Network Trainer for Sign Language MNIST
============================================================
Trains a Deep Multilayer Perceptron (MLP) with Batch Normalization/Dropout-equivalent
regularization and Adam optimization on the full 27,455 Sign Language MNIST samples.
Evaluates on the official 7,172 held-out test samples.
Saves model parameters and detailed performance metrics.
"""

import os
import json
import time
import pickle
import numpy as np
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix
from ml.dataset_loader import load_csv, TRAIN_CSV, TEST_CSV
from ml.class_mapping import CLASS_NAMES, NUM_CLASSES

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), 'artifacts')


def train_improved_model():
    print("=== TRAINING IMPROVED DEEP NEURAL NETWORK (MLP 784-512-256-128-24) ===")
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)

    print("Loading datasets...")
    X_train, y_train = load_csv(TRAIN_CSV)
    X_test, y_test = load_csv(TEST_CSV)

    X_train_flat = X_train.reshape((X_train.shape[0], -1))
    X_test_flat = X_test.reshape((X_test.shape[0], -1))

    print(f"Train samples: {X_train_flat.shape[0]}, Test samples: {X_test_flat.shape[0]}")

    start_time = time.time()
    # 3-layer deep architecture with Adam optimizer and early stopping
    mlp = MLPClassifier(
        hidden_layer_sizes=(512, 256, 128),
        activation='relu',
        solver='adam',
        alpha=0.0001,
        batch_size=128,
        learning_rate_init=0.001,
        max_iter=30,
        early_stopping=True,
        validation_fraction=0.1,
        n_iter_no_change=5,
        random_state=42,
        verbose=True
    )

    mlp.fit(X_train_flat, y_train)
    training_duration = time.time() - start_time
    print(f"Improved model training completed in {training_duration:.2f}s")

    # Evaluate on held-out test set
    start_eval = time.time()
    y_pred = mlp.predict(X_test_flat)
    eval_duration = time.time() - start_eval
    avg_latency = (eval_duration / len(X_test_flat)) * 1000

    acc = accuracy_score(y_test, y_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='macro', zero_division=0)
    cm = confusion_matrix(y_test, y_pred, labels=list(range(NUM_CLASSES)))

    # Per-class metrics
    per_class = {}
    p_arr, r_arr, f_arr, s_arr = precision_recall_fscore_support(y_test, y_pred, labels=list(range(NUM_CLASSES)), zero_division=0)
    for idx, name in enumerate(CLASS_NAMES):
        per_class[name] = {
            'precision': float(round(p_arr[idx], 4)),
            'recall': float(round(r_arr[idx], 4)),
            'f1': float(round(f_arr[idx], 4)),
            'support': int(s_arr[idx])
        }

    print("\n--- Improved Model Evaluation Results ---")
    print(f"Test Accuracy: {acc * 100:.2f}%")
    print(f"Macro Precision: {precision * 100:.2f}%")
    print(f"Macro Recall: {recall * 100:.2f}%")
    print(f"Macro F1-Score: {f1 * 100:.2f}%")
    print(f"Avg Latency: {avg_latency:.3f} ms/sample")

    results = {
        'model_name': 'SignLanguageBridge-DeepMLP-v2',
        'architecture': 'Dense(512, ReLU) -> Dense(256, ReLU) -> Dense(128, ReLU) -> Dense(24, Softmax)',
        'dataset': 'Sign Language MNIST',
        'train_samples': len(X_train),
        'test_samples': len(X_test),
        'test_accuracy': float(round(acc, 4)),
        'macro_precision': float(round(precision, 4)),
        'macro_recall': float(round(recall, 4)),
        'macro_f1': float(round(f1, 4)),
        'avg_inference_latency_ms': float(round(avg_latency, 3)),
        'training_duration_sec': float(round(training_duration, 2)),
        'classes': CLASS_NAMES,
        'per_class_metrics': per_class,
        'confusion_matrix': cm.tolist(),
        'training_loss_curve': [float(round(loss, 4)) for loss in mlp.loss_curve_]
    }

    # Save pickle of model
    model_pickle = os.path.join(ARTIFACTS_DIR, 'improved_model.pkl')
    with open(model_pickle, 'wb') as f:
        pickle.dump(mlp, f)

    # Save evaluation json
    eval_json = os.path.join(ARTIFACTS_DIR, 'improved_evaluation.json')
    with open(eval_json, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2)

    print(f"Artifacts saved to {ARTIFACTS_DIR}")
    return mlp, results


if __name__ == '__main__':
    train_improved_model()
