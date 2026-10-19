"""
TensorFlow.js Model Exporter
============================
Converts trained weights into native TensorFlow.js LayersModel format:
1. public/models/model.json
2. public/models/group1-shard1of1.bin
3. public/models/class_mapping.json
4. public/models/evaluation_results.json

The generated model includes an initial Flatten layer with input shape [28, 28, 1]
so browser webcam and image recognition pipelines can pass [1, 28, 28, 1] tensors directly.
"""

import os
import json
import struct
import pickle
import numpy as np
from ml.class_mapping import CLASS_NAMES, DATASET_LABELS

PUBLIC_MODELS_DIR = os.path.join(os.path.dirname(__file__), '../public/models')
ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), 'artifacts')


def export_model_to_tfjs():
    os.makedirs(PUBLIC_MODELS_DIR, exist_ok=True)
    model_pickle = os.path.join(ARTIFACTS_DIR, 'improved_model.pkl')
    eval_json = os.path.join(ARTIFACTS_DIR, 'improved_evaluation.json')

    if not os.path.exists(model_pickle):
        raise FileNotFoundError(f"Pickle model missing at {model_pickle}. Run train_improved.py first.")

    with open(model_pickle, 'rb') as f:
        mlp = pickle.load(f)

    # MLP coefs_: [W0 (784, 512), W1 (512, 256), W2 (256, 128), W3 (128, 24)]
    # MLP intercepts_: [b0 (512,), b1 (256,), b2 (128,), b3 (24,)]
    weights_binary = bytearray()
    weights_manifest_entries = []

    layer_configs = [
        {"name": "dense_1", "in": 784, "out": 512, "act": "relu"},
        {"name": "dense_2", "in": 512, "out": 256, "act": "relu"},
        {"name": "dense_3", "in": 256, "out": 128, "act": "relu"},
        {"name": "dense_4", "in": 128, "out": 24, "act": "softmax"},
    ]

    for idx, cfg in enumerate(layer_configs):
        w = mlp.coefs_[idx].astype(np.float32)  # shape (in, out)
        b = mlp.intercepts_[idx].astype(np.float32)  # shape (out,)

        weights_manifest_entries.append({
            "name": f"{cfg['name']}/kernel",
            "shape": list(w.shape),
            "dtype": "float32"
        })
        weights_binary.extend(w.tobytes())

        weights_manifest_entries.append({
            "name": f"{cfg['name']}/bias",
            "shape": list(b.shape),
            "dtype": "float32"
        })
        weights_binary.extend(b.tobytes())

    # Write binary weights shard
    bin_path = os.path.join(PUBLIC_MODELS_DIR, 'group1-shard1of1.bin')
    with open(bin_path, 'wb') as f:
        f.write(weights_binary)
    print(f"Exported weights binary: {bin_path} ({len(weights_binary)} bytes)")

    # Construct TensorFlow.js LayersModel specification
    model_json = {
        "format": "layers-model",
        "generatedBy": "keras/tfjs-slb-ai",
        "convertedBy": "SLB-AI-Exporter-v2",
        "modelTopology": {
            "class_name": "Sequential",
            "config": {
                "name": "sequential_slb_ai",
                "layers": [
                    {
                        "class_name": "Flatten",
                        "config": {
                            "name": "flatten_input",
                            "trainable": True,
                            "batch_input_shape": [None, 28, 28, 1],
                            "dtype": "float32",
                            "data_format": "channels_last"
                        }
                    },
                    {
                        "class_name": "Dense",
                        "config": {
                            "name": "dense_1",
                            "trainable": True,
                            "dtype": "float32",
                            "units": 512,
                            "activation": "relu",
                            "use_bias": True
                        }
                    },
                    {
                        "class_name": "Dense",
                        "config": {
                            "name": "dense_2",
                            "trainable": True,
                            "dtype": "float32",
                            "units": 256,
                            "activation": "relu",
                            "use_bias": True
                        }
                    },
                    {
                        "class_name": "Dense",
                        "config": {
                            "name": "dense_3",
                            "trainable": True,
                            "dtype": "float32",
                            "units": 128,
                            "activation": "relu",
                            "use_bias": True
                        }
                    },
                    {
                        "class_name": "Dense",
                        "config": {
                            "name": "dense_4",
                            "trainable": True,
                            "dtype": "float32",
                            "units": 24,
                            "activation": "softmax",
                            "use_bias": True
                        }
                    }
                ]
            },
            "keras_version": "2.11.0",
            "backend": "tensorflow"
        },
        "weightsManifest": [
            {
                "paths": ["group1-shard1of1.bin"],
                "weights": weights_manifest_entries
            }
        ]
    }

    model_json_path = os.path.join(PUBLIC_MODELS_DIR, 'model.json')
    with open(model_json_path, 'w', encoding='utf-8') as f:
        json.dump(model_json, f, indent=2)
    print(f"Exported model topology: {model_json_path}")

    # Export class_mapping.json
    class_mapping = {
        "class_names": CLASS_NAMES,
        "num_classes": 24,
        "label_to_class": {lbl: idx for idx, lbl in enumerate(DATASET_LABELS)},
        "class_to_dataset_label": {idx: lbl for idx, lbl in enumerate(DATASET_LABELS)},
        "class_to_letter": {idx: name for idx, name in enumerate(CLASS_NAMES)},
        "letter_to_class": {name: idx for idx, name in enumerate(CLASS_NAMES)},
        "input_shape": [28, 28, 1],
        "preprocessing": {
            "color_space": "grayscale",
            "normalize_range": [0.0, 1.0],
            "target_dimensions": [28, 28]
        },
        "version": "2.0.0-verified",
        "exported_at": "2026-10-19T07:10:00Z"
    }
    class_mapping_path = os.path.join(PUBLIC_MODELS_DIR, 'class_mapping.json')
    with open(class_mapping_path, 'w', encoding='utf-8') as f:
        json.dump(class_mapping, f, indent=2)

    # Export evaluation_results.json
    if os.path.exists(eval_json):
        with open(eval_json, 'r', encoding='utf-8') as f:
            eval_data = json.load(f)
        eval_out = os.path.join(PUBLIC_MODELS_DIR, 'evaluation_results.json')
        with open(eval_out, 'w', encoding='utf-8') as f:
            json.dump(eval_data, f, indent=2)
        print(f"Copied evaluation results to {eval_out}")

    print("All TensorFlow.js model artifacts exported successfully.")


if __name__ == '__main__':
    export_model_to_tfjs()
