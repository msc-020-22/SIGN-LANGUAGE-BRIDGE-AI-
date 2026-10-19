import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-converter';
import * as tfLayers from '@tensorflow/tfjs-layers';
import * as fs from 'fs';
import * as path from 'path';

// Class mapping for 24 static ASL letters
const CLASS_NAMES = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
  'T', 'U', 'V', 'W', 'X', 'Y'
];

const DATASET_LABELS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8,
  10, 11, 12, 13, 14, 15, 16, 17, 18,
  19, 20, 21, 22, 23, 24
];

const LABEL_TO_CLASS: Record<number, number> = {};
DATASET_LABELS.forEach((lbl, idx) => {
  LABEL_TO_CLASS[lbl] = idx;
});

function loadCsvData(filePath: string, maxSamples?: number): { xs: tf.Tensor4D; ys: tf.Tensor2D; sampleCount: number } {
  console.log(`Loading dataset from ${filePath}...`);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const numLines = maxSamples ? Math.min(lines.length - 1, maxSamples) : lines.length - 1;

  const imagesArray = new Float32Array(numLines * 28 * 28);
  const labelsArray = new Float32Array(numLines * 24);

  let validCount = 0;

  for (let i = 1; i <= numLines; i++) {
    const line = lines[i];
    if (!line) continue;
    const parts = line.split(',');
    const rawLabel = parseInt(parts[0], 10);
    const classIdx = LABEL_TO_CLASS[rawLabel];

    if (classIdx === undefined) {
      continue;
    }

    // One-hot label
    labelsArray[validCount * 24 + classIdx] = 1.0;

    // Pixels normalized to [0, 1]
    const imgOffset = validCount * 784;
    for (let p = 0; p < 784; p++) {
      imagesArray[imgOffset + p] = parseFloat(parts[p + 1]) / 255.0;
    }

    validCount++;
  }

  console.log(`Loaded ${validCount} valid samples with 24-class mapping.`);
  
  const xs = tf.tensor4d(imagesArray.subarray(0, validCount * 784), [validCount, 28, 28, 1]);
  const ys = tf.tensor2d(labelsArray.subarray(0, validCount * 24), [validCount, 24]);

  return { xs, ys, sampleCount: validCount };
}

export function createImprovedCNN(): tfLayers.Sequential {
  const model = tfLayers.sequential();

  // Block 1
  model.add(tfLayers.layers.conv2d({
    inputShape: [28, 28, 1],
    filters: 32,
    kernelSize: 3,
    padding: 'same',
    activation: 'relu',
    kernelInitializer: 'heNormal',
  }));
  model.add(tfLayers.layers.batchNormalization());
  model.add(tfLayers.layers.maxPooling2d({ poolSize: [2, 2] }));
  model.add(tfLayers.layers.dropout({ rate: 0.2 }));

  // Block 2
  model.add(tfLayers.layers.conv2d({
    filters: 64,
    kernelSize: 3,
    padding: 'same',
    activation: 'relu',
    kernelInitializer: 'heNormal',
  }));
  model.add(tfLayers.layers.batchNormalization());
  model.add(tfLayers.layers.maxPooling2d({ poolSize: [2, 2] }));
  model.add(tfLayers.layers.dropout({ rate: 0.25 }));

  // Block 3
  model.add(tfLayers.layers.conv2d({
    filters: 128,
    kernelSize: 3,
    padding: 'same',
    activation: 'relu',
    kernelInitializer: 'heNormal',
  }));
  model.add(tfLayers.layers.batchNormalization());
  model.add(tfLayers.layers.maxPooling2d({ poolSize: [2, 2] }));
  model.add(tfLayers.layers.dropout({ rate: 0.3 }));

  // Classifier head
  model.add(tfLayers.layers.flatten());
  model.add(tfLayers.layers.dense({ units: 256, activation: 'relu', kernelInitializer: 'heNormal' }));
  model.add(tfLayers.layers.batchNormalization());
  model.add(tfLayers.layers.dropout({ rate: 0.4 }));
  model.add(tfLayers.layers.dense({ units: 24, activation: 'softmax' }));

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

async function main() {
  console.log('=== SLB AI SIGN LANGUAGE MNIST MODEL TRAINING & EVALUATION ===');
  
  const trainPath = path.resolve(process.cwd(), 'ml/data/sign_mnist_train.csv');
  const testPath = path.resolve(process.cwd(), 'ml/data/sign_mnist_test.csv');
  const outputDir = path.resolve(process.cwd(), 'public/models');

  if (!fs.existsSync(trainPath) || !fs.existsSync(testPath)) {
    console.error('Dataset files missing in ml/data/. Run download script first.');
    process.exit(1);
  }

  // Load datasets: we train on full 27,455 training samples
  const trainData = loadCsvData(trainPath);
  const testData = loadCsvData(testPath);

  console.log('Constructing improved CNN architecture...');
  const model = createImprovedCNN();
  model.summary();

  const epochs = 10;
  const batchSize = 128;

  console.log(`Starting real training for ${epochs} epochs (batch size: ${batchSize})...`);
  const history = await model.fit(trainData.xs, trainData.ys, {
    epochs,
    batchSize,
    validationSplit: 0.15,
    shuffle: true,
    callbacks: {
      onEpochEnd: (epoch, logs: any) => {
        const acc = logs?.acc !== undefined ? (logs.acc * 100).toFixed(2) : 'N/A';
        const valAcc = logs?.val_acc !== undefined ? (logs.val_acc * 100).toFixed(2) : 'N/A';
        const loss = logs?.loss !== undefined ? logs.loss.toFixed(4) : 'N/A';
        const valLoss = logs?.val_loss !== undefined ? logs.val_loss.toFixed(4) : 'N/A';
        console.log(
          `Epoch ${epoch + 1}/${epochs} - loss: ${loss} - acc: ${acc}% - val_loss: ${valLoss} - val_acc: ${valAcc}%`
        );
      },
    },
  });

  console.log('\n--- Evaluating Model on Held-Out Test Set (7,172 samples) ---');
  const startEval = Date.now();
  const predictions = model.predict(testData.xs) as tf.Tensor2D;
  const predData = await predictions.array();
  const evalDurationMs = Date.now() - startEval;
  const avgLatencyMs = evalDurationMs / testData.sampleCount;

  // True labels
  const trueLabelsTensor = tf.argMax(testData.ys, 1);
  const trueLabels = await trueLabelsTensor.array() as number[];

  // Confusion matrix and metrics computation
  const numClasses = 24;
  const confusionMatrix: number[][] = Array.from({ length: numClasses }, () => Array(numClasses).fill(0));
  let correctCount = 0;

  const predClasses: number[] = [];
  for (let i = 0; i < testData.sampleCount; i++) {
    const probs = predData[i];
    let maxIdx = 0;
    let maxVal = probs[0];
    for (let c = 1; c < numClasses; c++) {
      if (probs[c] > maxVal) {
        maxVal = probs[c];
        maxIdx = c;
      }
    }
    predClasses.push(maxIdx);
    const trueIdx = trueLabels[i];
    confusionMatrix[trueIdx][maxIdx]++;
    if (maxIdx === trueIdx) correctCount++;
  }

  const testAccuracy = correctCount / testData.sampleCount;
  console.log(`Verified Test Accuracy: ${(testAccuracy * 100).toFixed(2)}% (${correctCount}/${testData.sampleCount})`);
  console.log(`Average inference latency: ${avgLatencyMs.toFixed(3)} ms/sample`);

  // Calculate per-class Precision, Recall, F1
  const perClassMetrics: Record<string, { precision: number; recall: number; f1: number; support: number }> = {};
  let macroPrecision = 0;
  let macroRecall = 0;
  let macroF1 = 0;

  for (let c = 0; c < numClasses; c++) {
    const letter = CLASS_NAMES[c];
    const tp = confusionMatrix[c][c];
    let fp = 0;
    let fn = 0;
    let support = 0;

    for (let i = 0; i < numClasses; i++) {
      support += confusionMatrix[c][i];
      if (i !== c) {
        fn += confusionMatrix[c][i];
        fp += confusionMatrix[i][c];
      }
    }

    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

    perClassMetrics[letter] = {
      precision: parseFloat(precision.toFixed(4)),
      recall: parseFloat(recall.toFixed(4)),
      f1: parseFloat(f1.toFixed(4)),
      support,
    };

    macroPrecision += precision;
    macroRecall += recall;
    macroF1 += f1;
  }

  macroPrecision /= numClasses;
  macroRecall /= numClasses;
  macroF1 /= numClasses;

  console.log(`Macro Precision: ${(macroPrecision * 100).toFixed(2)}%`);
  console.log(`Macro Recall: ${(macroRecall * 100).toFixed(2)}%`);
  console.log(`Macro F1-Score: ${(macroF1 * 100).toFixed(2)}%`);

  // Export model to TFJS format
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Saving TensorFlow.js model to ${outputDir}...`);
  await model.save(`file://${outputDir}`);

  // Save class mapping
  const classMapping = {
    class_names: CLASS_NAMES,
    num_classes: numClasses,
    label_to_class: LABEL_TO_CLASS,
    class_to_dataset_label: Object.fromEntries(DATASET_LABELS.map((lbl, idx) => [idx, lbl])),
    class_to_letter: Object.fromEntries(CLASS_NAMES.map((name, idx) => [idx, name])),
    letter_to_class: Object.fromEntries(CLASS_NAMES.map((name, idx) => [name, idx])),
    input_shape: [28, 28, 1],
    preprocessing: {
      color_space: 'grayscale',
      normalize_range: [0.0, 1.0],
      target_dimensions: [28, 28],
    },
    version: '2.0.0-verified',
    trained_at: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(outputDir, 'class_mapping.json'), JSON.stringify(classMapping, null, 2));

  // Save detailed evaluation results
  const evaluationResults = {
    model_name: 'SignLanguageBridge-CNN-v2',
    dataset: 'Sign Language MNIST (Kaggle/GitHub standard benchmark)',
    training_samples: trainData.sampleCount,
    test_samples: testData.sampleCount,
    test_accuracy: parseFloat(testAccuracy.toFixed(4)),
    macro_precision: parseFloat(macroPrecision.toFixed(4)),
    macro_recall: parseFloat(macroRecall.toFixed(4)),
    macro_f1: parseFloat(macroF1.toFixed(4)),
    avg_inference_latency_ms: parseFloat(avgLatencyMs.toFixed(3)),
    evaluation_timestamp: new Date().toISOString(),
    training_epochs: epochs,
    batch_size: batchSize,
    per_class_metrics: perClassMetrics,
    confusion_matrix: confusionMatrix,
    classes: CLASS_NAMES,
    training_history: {
      epochs: history.epoch.map((e) => e + 1),
      loss: history.history.loss.map((v: any) => parseFloat(v.toFixed(4))),
      accuracy: history.history.acc.map((v: any) => parseFloat(v.toFixed(4))),
      val_loss: history.history.val_loss?.map((v: any) => parseFloat(v.toFixed(4))) || [],
      val_accuracy: history.history.val_acc?.map((v: any) => parseFloat(v.toFixed(4))) || [],
    },
  };
  fs.writeFileSync(path.join(outputDir, 'evaluation_results.json'), JSON.stringify(evaluationResults, null, 2));

  console.log('✅ Model, class mapping, and evaluation results saved successfully to public/models!');

  // Cleanup tensors
  trainData.xs.dispose();
  trainData.ys.dispose();
  testData.xs.dispose();
  testData.ys.dispose();
  predictions.dispose();
  trueLabelsTensor.dispose();
}

main().catch((err) => {
  console.error('Error during model training/evaluation:', err);
  process.exit(1);
});
