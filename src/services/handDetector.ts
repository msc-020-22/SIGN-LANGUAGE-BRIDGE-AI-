import { storageService } from './storageService';

export interface HandBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class HandDetector {
  private mediaStream: MediaStream | null = null;
  private predictionHistory: string[] = [];
  private confidenceHistory: number[] = [];

  /**
   * Initializes webcam with user-selected resolution and mirroring settings.
   */
  async startCamera(videoElement: HTMLVideoElement): Promise<MediaStream> {
    this.stopCamera();

    const settings = storageService.getSettings();
    const [width, height] = settings.cameraResolution === '1280x720' ? [1280, 720] : [640, 480];

    const constraints: MediaStreamConstraints = {
      video: {
        width: { ideal: width },
        height: { ideal: height },
        facingMode: 'user',
      },
      audio: false,
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.mediaStream = stream;
      videoElement.srcObject = stream;
      await videoElement.play();
      return stream;
    } catch (err: any) {
      console.error('[HandDetector] Camera initialization error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        throw new Error('Camera access was denied. Please allow camera permissions to use live recognition.');
      }
      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        throw new Error('No webcam hardware detected on this device.');
      }
      throw new Error(`Failed to start camera: ${err.message || 'Unknown error'}`);
    }
  }

  stopCamera(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    this.predictionHistory = [];
    this.confidenceHistory = [];
  }

  /**
   * Calculates the square Region of Interest (ROI) box in the video frame.
   * By default, it centers the 320x320 hand detection guide box in the upper/central area.
   */
  getHandROI(videoWidth: number, videoHeight: number): HandBoundingBox {
    const boxSize = Math.min(videoWidth, videoHeight) * 0.65;
    const x = (videoWidth - boxSize) / 2;
    const y = (videoHeight - boxSize) / 2;
    return {
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(boxSize),
      height: Math.round(boxSize),
    };
  }

  /**
   * Extracts the cropped hand ROI from the video element and draws it to a 28x28 canvas.
   */
  extractHandCanvas(
    videoElement: HTMLVideoElement,
    roi: HandBoundingBox,
    outputCanvas: HTMLCanvasElement
  ): void {
    outputCanvas.width = 28;
    outputCanvas.height = 28;
    const ctx = outputCanvas.getContext('2d')!;

    // Draw the cropped ROI scaled down to 28x28
    ctx.drawImage(
      videoElement,
      roi.x,
      roi.y,
      roi.width,
      roi.height,
      0,
      0,
      28,
      28
    );
  }

  /**
   * Applies temporal smoothing (sliding window majority vote)
   * to eliminate single-frame flickering or erratic predictions.
   */
  smoothPrediction(rawLetter: string, confidence: number): { smoothedLetter: string; isStable: boolean } {
    const settings = storageService.getSettings();
    const windowSize = settings.smoothingWindowSize || 5;

    this.predictionHistory.push(rawLetter);
    this.confidenceHistory.push(confidence);

    if (this.predictionHistory.length > windowSize) {
      this.predictionHistory.shift();
      this.confidenceHistory.shift();
    }

    // Count frequency of each letter in the window
    const counts: Record<string, number> = {};
    for (const letter of this.predictionHistory) {
      counts[letter] = (counts[letter] || 0) + 1;
    }

    let topLetter = rawLetter;
    let maxCount = 0;
    for (const [letter, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        topLetter = letter;
      }
    }

    // Stable if at least 60% of frames in window agree
    const agreementRatio = maxCount / this.predictionHistory.length;
    const isStable = agreementRatio >= 0.6 && this.predictionHistory.length >= Math.min(3, windowSize);

    return {
      smoothedLetter: topLetter,
      isStable,
    };
  }

  resetSmoothing(): void {
    this.predictionHistory = [];
    this.confidenceHistory = [];
  }
}

export const handDetector = new HandDetector();
