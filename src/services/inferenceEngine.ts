import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-converter';
import { loadLayersModel, type LayersModel } from '@tensorflow/tfjs-layers';
import { PredictionResult } from '../types';
import { CLASS_NAMES } from '../data/aslAlphabet';
import { storageService } from './storageService';

class InferenceEngine {
  private model: LayersModel | null = null;
  private isModelLoading = false;
  private loadPromise: Promise<LayersModel> | null = null;
  private isWarmedUp = false;

  async loadModel(): Promise<LayersModel> {
    if (this.model) {
      return this.model;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.isModelLoading = true;
    this.loadPromise = (async () => {
      try {
        console.log('[InferenceEngine] Loading model from /models/model.json...');
        const loadedModel = await loadLayersModel('/models/model.json');
        this.model = loadedModel;
        this.isModelLoading = false;
        console.log('[InferenceEngine] Model loaded successfully.');
        await this.warmup();
        return loadedModel;
      } catch (err) {
        this.isModelLoading = false;
        this.loadPromise = null;
        console.error('[InferenceEngine] Failed to load model:', err);
        throw new Error(
          'Failed to load Sign Language recognition model. Ensure /models/model.json is accessible.'
        );
      }
    })();

    return this.loadPromise;
  }

  isLoaded(): boolean {
    return this.model !== null;
  }

  async warmup(): Promise<void> {
    if (!this.model || this.isWarmedUp) return;
    try {
      tf.tidy(() => {
        const dummy = tf.zeros([1, 28, 28, 1]);
        this.model!.predict(dummy);
      });
      this.isWarmedUp = true;
      console.log('[InferenceEngine] Model warm-up completed.');
    } catch (e) {
      console.warn('[InferenceEngine] Warm-up warning:', e);
    }
  }

  /**
   * Preprocesses an HTMLCanvasElement containing a 28x28 or cropped hand image
   * into a [1, 28, 28, 1] normalized float32 tensor.
   */
  preprocessCanvasToTensor(canvas: HTMLCanvasElement): tf.Tensor4D {
    return tf.tidy(() => {
      // Create 28x28 normalized canvas
      const targetCanvas = document.createElement('canvas');
      targetCanvas.width = 28;
      targetCanvas.height = 28;
      const ctx = targetCanvas.getContext('2d')!;

      // Draw and scale to 28x28
      ctx.drawImage(canvas, 0, 0, 28, 28);
      const imgData = ctx.getImageData(0, 0, 28, 28);
      const data = imgData.data;

      // Extract grayscale float32 array normalized to [0, 1]
      const grayBuffer = new Float32Array(28 * 28);
      for (let i = 0; i < 28 * 28; i++) {
        const r = data[i * 4];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];
        // Standard perceptual luminance formula
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        grayBuffer[i] = gray / 255.0;
      }

      return tf.tensor4d(grayBuffer, [1, 28, 28, 1]);
    });
  }

  /**
   * Runs inference on a 28x28 preprocessed tensor.
   */
  async predictTensor(tensor: tf.Tensor4D): Promise<PredictionResult> {
    const model = await this.loadModel();
    const startTime = performance.now();

    const outputTensor = model.predict(tensor) as tf.Tensor2D;
    const probabilities = await outputTensor.data();
    const inferenceTimeMs = Math.round(performance.now() - startTime);

    // Free output tensor
    outputTensor.dispose();

    // Calculate Top-K and Shannon Entropy
    let maxConfidence = -1;
    let maxIndex = 0;
    let entropy = 0;
    const topKList: Array<{ letter: string; confidence: number; classIndex: number }> = [];

    const numClasses = CLASS_NAMES.length;
    for (let i = 0; i < numClasses; i++) {
      const prob = probabilities[i];
      if (prob > maxConfidence) {
        maxConfidence = prob;
        maxIndex = i;
      }
      if (prob > 1e-7) {
        entropy -= prob * Math.log2(prob);
      }
      topKList.push({
        letter: CLASS_NAMES[i],
        confidence: prob,
        classIndex: i,
      });
    }

    // Sort Top-K descending
    topKList.sort((a, b) => b.confidence - a.confidence);

    // Normalized entropy: 0 (pure certain) to 1 (pure random uniform)
    const maxEntropy = Math.log2(numClasses); // log2(24) ~ 4.585
    const normalizedEntropy = entropy / maxEntropy;

    const settings = storageService.getSettings();
    const isConfidenceLow = maxConfidence < settings.confidenceThreshold;
    const isEntropyHigh = normalizedEntropy > settings.uncertaintyThreshold;
    const isUncertain = isConfidenceLow || isEntropyHigh;

    return {
      letter: CLASS_NAMES[maxIndex],
      confidence: maxConfidence,
      entropy: parseFloat(normalizedEntropy.toFixed(3)),
      isUncertain,
      topK: topKList.slice(0, 5),
      inferenceTimeMs,
      timestamp: new Date().toISOString(),
    };
  }

  async predictFromCanvas(canvas: HTMLCanvasElement): Promise<PredictionResult> {
    const tensor = this.preprocessCanvasToTensor(canvas);
    try {
      return await this.predictTensor(tensor);
    } finally {
      tensor.dispose();
    }
  }

  async predictFromImage(imgElement: HTMLImageElement): Promise<PredictionResult> {
    const canvas = document.createElement('canvas');
    canvas.width = 28;
    canvas.height = 28;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(imgElement, 0, 0, 28, 28);
    return this.predictFromCanvas(canvas);
  }
}

export const inferenceEngine = new InferenceEngine();
