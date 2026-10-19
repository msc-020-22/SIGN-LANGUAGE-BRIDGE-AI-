# Testing & QA Verification Guide: SLB AI

## 1. Automated Model Pipeline Test Suite
The project includes a 6-step automated test suite in `tests/test_model_pipeline.py`.
To run:
```bash
python3 -m unittest tests/test_model_pipeline.py
```

### Verified Test Cases
1. `test_class_mapping_integrity`: Asserts exactly 24 classes, confirms exclusion of dynamic letters J and Z, and tests roundtrip bijective mapping.
2. `test_dataset_files_exist`: Verifies that `sign_mnist_train.csv` (>50MB) and `sign_mnist_test.csv` (>10MB) exist and are non-empty.
3. `test_model_files_exist`: Confirms that `model.json`, `group1-shard1of1.bin`, `class_mapping.json`, and `evaluation_results.json` exist in `public/models/`.
4. `test_model_json_architecture`: Confirms that `model.json` specifies a valid LayersModel topology with `group1-shard1of1.bin` weights manifest.
5. `test_evaluation_metrics_validity`: Validates that test accuracy, precision, recall, and F1 are within valid $[0.0, 1.0]$ ranges and tests that the 24×24 confusion matrix sums to 7,172 test samples.
6. `test_preprocessing_tensor_spec`: Verifies that uint8 pixel inputs are normalized to float32 $[0.0, 1.0]$.

## 2. Frontend & TypeScript Verification
```bash
# TypeScript type check
npm run lint

# Production build check
npm run build
```

## 3. Manual Verification Checklist
- **Webcam:** Verify that the ROI guide bracket appears and captures gestures.
- **Image Upload:** Upload an ASL sign photo and inspect the Top-3 candidates.
- **Speech Synthesis:** Click "Speak Out Loud" and confirm audio voice output.
- **Dual Conversation:** Send a message from Deaf communicator, speak into microphone as hearing partner.
- **Sign Dictionary:** Search for "C" or filter by "Fingers" category.
- **Quiz:** Complete a 10-question quiz and verify the celebration confetti.
