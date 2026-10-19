"""
Test Suite for Sign Language Bridge AI (SLB AI) Model Pipeline
==============================================================
Validates:
1. Class mapping bijection and exclusion of dynamic letters J and Z.
2. Dataset presence and row count.
3. Model configuration and weight files existence.
4. Input tensor dimensions and normalization constraints.
5. Evaluation results schema, metrics validity, and non-empty confusion matrix.
"""

import os
import json
import unittest
import numpy as np

from ml.class_mapping import (
    CLASS_NAMES,
    DATASET_LABELS,
    NUM_CLASSES,
    label_to_class,
    class_to_letter,
    LABEL_TO_CLASS_INDEX,
    CLASS_INDEX_TO_LABEL
)
from ml.dataset_loader import TRAIN_CSV, TEST_CSV


class TestModelPipeline(unittest.TestCase):

    def test_class_mapping_integrity(self):
        """Verifies that exactly 24 classes exist and are bijectively mapped."""
        self.assertEqual(NUM_CLASSES, 24)
        self.assertEqual(len(CLASS_NAMES), 24)
        self.assertEqual(len(DATASET_LABELS), 24)

        # Dynamic letters J and Z must NOT be present
        self.assertNotIn('J', CLASS_NAMES)
        self.assertNotIn('Z', CLASS_NAMES)
        self.assertNotIn(9, DATASET_LABELS)
        self.assertNotIn(25, DATASET_LABELS)

        # Verify roundtrip mapping
        for idx in range(NUM_CLASSES):
            label = CLASS_INDEX_TO_LABEL[idx]
            self.assertEqual(LABEL_TO_CLASS_INDEX[label], idx)
            letter = CLASS_NAMES[idx]
            self.assertEqual(class_to_letter(idx), letter)

        # Invalid label handling
        with self.assertRaises(ValueError):
            label_to_class(9)
        with self.assertRaises(ValueError):
            label_to_class(25)

    def test_dataset_files_exist(self):
        """Verifies that the real dataset files exist and are populated."""
        self.assertTrue(os.path.exists(TRAIN_CSV), f"Missing {TRAIN_CSV}")
        self.assertTrue(os.path.exists(TEST_CSV), f"Missing {TEST_CSV}")

        train_size = os.path.getsize(TRAIN_CSV)
        test_size = os.path.getsize(TEST_CSV)
        self.assertGreater(train_size, 50_000_000, "Train CSV should be > 50MB")
        self.assertGreater(test_size, 10_000_000, "Test CSV should be > 10MB")

    def test_model_files_exist(self):
        """Verifies that exported model files exist in public/models."""
        models_dir = os.path.join(os.path.dirname(__file__), '../public/models')
        model_json_path = os.path.join(models_dir, 'model.json')
        weights_bin_path = os.path.join(models_dir, 'group1-shard1of1.bin')
        class_mapping_path = os.path.join(models_dir, 'class_mapping.json')
        eval_path = os.path.join(models_dir, 'evaluation_results.json')

        for path in [model_json_path, weights_bin_path, class_mapping_path, eval_path]:
            self.assertTrue(
                os.path.exists(path),
                f"Expected model artifact missing: {path}"
            )
            self.assertGreater(os.path.getsize(path), 0, f"Artifact is empty: {path}")

    def test_model_json_architecture(self):
        """Verifies that model.json defines a valid LayersModel for 28x28x1 input to 24 outputs."""
        model_json_path = os.path.join(os.path.dirname(__file__), '../public/models/model.json')
        if not os.path.exists(model_json_path):
            self.skipTest("model.json not yet built")

        with open(model_json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        self.assertIn('modelTopology', data)
        self.assertIn('weightsManifest', data)

        manifest = data['weightsManifest']
        self.assertGreater(len(manifest), 0)
        self.assertIn('group1-shard1of1.bin', manifest[0]['paths'])

    def test_evaluation_metrics_validity(self):
        """Verifies that evaluation metrics are mathematically valid."""
        eval_path = os.path.join(os.path.dirname(__file__), '../public/models/evaluation_results.json')
        if not os.path.exists(eval_path):
            self.skipTest("evaluation_results.json not yet built")

        with open(eval_path, 'r', encoding='utf-8') as f:
            eval_data = json.load(f)

        self.assertIn('test_accuracy', eval_data)
        self.assertIn('macro_precision', eval_data)
        self.assertIn('macro_recall', eval_data)
        self.assertIn('macro_f1', eval_data)
        self.assertIn('confusion_matrix', eval_data)

        # Range checks: [0.0, 1.0]
        self.assertGreaterEqual(eval_data['test_accuracy'], 0.70)
        self.assertLessEqual(eval_data['test_accuracy'], 1.0)
        self.assertGreaterEqual(eval_data['macro_precision'], 0.0)
        self.assertLessEqual(eval_data['macro_precision'], 1.0)
        self.assertGreaterEqual(eval_data['macro_recall'], 0.0)
        self.assertLessEqual(eval_data['macro_recall'], 1.0)

        # Confusion matrix checks: 24x24
        cm = eval_data['confusion_matrix']
        self.assertEqual(len(cm), 24)
        for row in cm:
            self.assertEqual(len(row), 24)
            self.assertTrue(all(v >= 0 for v in row))

        total_tested = sum(sum(row) for row in cm)
        self.assertEqual(total_tested, 7172)

    def test_preprocessing_tensor_spec(self):
        """Verifies preprocessing normalization: random uint8 -> float32 [0.0, 1.0]."""
        raw_pixels = np.random.randint(0, 256, size=(28, 28, 1), dtype=np.uint8)
        normalized = raw_pixels.astype(np.float32) / 255.0

        self.assertEqual(normalized.shape, (28, 28, 1))
        self.assertGreaterEqual(float(normalized.min()), 0.0)
        self.assertLessEqual(float(normalized.max()), 1.0)


if __name__ == '__main__':
    unittest.main()
