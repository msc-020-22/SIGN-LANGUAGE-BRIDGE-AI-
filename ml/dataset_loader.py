"""
Dataset loader for Sign Language MNIST.
=======================================
Reads sign_mnist_train.csv and sign_mnist_test.csv.
Parses 28x28 grayscale pixel arrays and maps raw labels to 0..23 class indices.
Normalizes pixel values from [0, 255] to [0.0, 1.0].
"""

import os
import csv
import numpy as np
from typing import Tuple, Dict, Any
from ml.class_mapping import label_to_class, NUM_CLASSES, CLASS_NAMES

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
TRAIN_CSV = os.path.join(DATA_DIR, 'sign_mnist_train.csv')
TEST_CSV = os.path.join(DATA_DIR, 'sign_mnist_test.csv')


def load_csv(filepath: str, max_samples: int = None) -> Tuple[np.ndarray, np.ndarray]:
    """
    Loads images and labels from a Sign Language MNIST CSV file.
    
    Returns:
        images: np.ndarray of shape (N, 28, 28, 1), float32, normalized to [0.0, 1.0]
        labels: np.ndarray of shape (N,), int32, mapped to [0..23] class indices
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Dataset file not found at {filepath}")

    images_list = []
    labels_list = []

    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        # Expected header: ['label', 'pixel1', 'pixel2', ..., 'pixel784']
        
        for row_idx, row in enumerate(reader):
            if max_samples and row_idx >= max_samples:
                break
            if not row:
                continue
            
            raw_label = int(row[0])
            class_idx = label_to_class(raw_label)
            
            pixels = np.array(row[1:], dtype=np.float32)
            if len(pixels) != 784:
                raise ValueError(f"Row {row_idx} has {len(pixels)} pixel values, expected 784.")
            
            pixels = pixels.reshape((28, 28, 1)) / 255.0  # normalize
            images_list.append(pixels)
            labels_list.append(class_idx)

    images = np.array(images_list, dtype=np.float32)
    labels = np.array(labels_list, dtype=np.int32)
    return images, labels


def get_dataset_statistics() -> Dict[str, Any]:
    """Returns verified dataset statistics for train and test splits."""
    stats = {}
    for name, path in [('train', TRAIN_CSV), ('test', TEST_CSV)]:
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                reader = csv.reader(f)
                next(reader)
                class_counts = {c: 0 for c in CLASS_NAMES}
                total = 0
                for row in reader:
                    if row:
                        lbl = int(row[0])
                        cls_idx = label_to_class(lbl)
                        class_counts[CLASS_NAMES[cls_idx]] += 1
                        total += 1
                stats[name] = {
                    'total_samples': total,
                    'class_counts': class_counts,
                    'file_size_bytes': os.path.getsize(path)
                }
    return stats


if __name__ == '__main__':
    print("Testing dataset loader...")
    stats = get_dataset_statistics()
    print("Dataset stats:", stats)
