"""
Class Mapping for Sign Language MNIST (ASL 24 Static Letters)
=============================================================
In American Sign Language, letters J (index 9) and Z (index 25) involve motion
and are excluded from static 28x28 single-frame image benchmarks.

This module provides bidirectional, strictly validated mappings between:
1. Model Softmax Output Index (0 to 23)
2. Raw Dataset Label in CSV (0 to 24, with label 9 omitted)
3. Alphabetical Letter ('A' through 'Y', with 'J' omitted)
"""

# Alphabet letters in exact model class index order (0 to 23)
CLASS_NAMES = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y'
]

# Raw dataset labels present in Sign Language MNIST
DATASET_LABELS = [
    0, 1, 2, 3, 4, 5, 6, 7, 8,
    10, 11, 12, 13, 14, 15, 16, 17, 18,
    19, 20, 21, 22, 23, 24
]

NUM_CLASSES = len(CLASS_NAMES)  # 24

# Mapping from raw CSV label -> model class index (0..23)
LABEL_TO_CLASS_INDEX = {label: idx for idx, label in enumerate(DATASET_LABELS)}

# Mapping from model class index (0..23) -> raw CSV label
CLASS_INDEX_TO_LABEL = {idx: label for idx, label in enumerate(DATASET_LABELS)}

# Mapping from model class index (0..23) -> letter string
CLASS_INDEX_TO_LETTER = {idx: letter for idx, letter in enumerate(CLASS_NAMES)}

# Mapping from letter string -> model class index (0..23)
LETTER_TO_CLASS_INDEX = {letter: idx for idx, letter in enumerate(CLASS_NAMES)}


def label_to_class(label: int) -> int:
    """Converts a raw dataset label (0-24 excluding 9) to a 0-23 model class index."""
    if label not in LABEL_TO_CLASS_INDEX:
        raise ValueError(f"Label {label} is not a valid static Sign Language MNIST label (J=9 and Z=25 are dynamic).")
    return LABEL_TO_CLASS_INDEX[label]


def class_to_letter(class_idx: int) -> str:
    """Converts a 0-23 model class index to its corresponding ASL alphabet letter."""
    if not (0 <= class_idx < NUM_CLASSES):
        raise ValueError(f"Class index {class_idx} out of range [0, {NUM_CLASSES - 1}].")
    return CLASS_INDEX_TO_LETTER[class_idx]
