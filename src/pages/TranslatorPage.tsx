import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Camera, CameraOff, Volume2, Copy, Check, RotateCcw, 
  Sparkles, AlertTriangle, ShieldCheck, Settings, 
  HelpCircle, ChevronRight, CornerDownLeft, Eye, EyeOff
} from 'lucide-react';
import { handDetector, HandBoundingBox } from '../services/handDetector';
import { inferenceEngine } from '../services/inferenceEngine';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';
import { PredictionResult } from '../types';

interface TranslatorPageProps {
  onSelectTab?: (tab: string) => void;
}

export const TranslatorPage: React.FC<TranslatorPageProps> = ({ onSelectTab }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const roiCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [stableLetter, setStableLetter] = useState<string | null>(null);
  const [isStable, setIsStable] = useState<boolean>(false);
  const [composedText, setComposedText] = useState<string>('');
  const [autoAppend, setAutoAppend] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showRoiPreview, setShowRoiPreview] = useState<boolean>(true);
  const [mirror, setMirror] = useState<boolean>(true);

  const lastAppendedLetterRef = useRef<string | null>(null);
  const lastAppendedTimeRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    if (!videoRef.current) return;
    try {
      await handDetector.startCamera(videoRef.current);
      setIsCameraActive(true);
      // Ensure model is loaded & warmed up
      await inferenceEngine.loadModel();
    } catch (err: any) {
      setCameraError(err.message || 'Failed to initialize camera.');
      setIsCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    handDetector.stopCamera();
    setIsCameraActive(false);
    setPrediction(null);
    setStableLetter(null);
  };

  // Main recognition loop
  const processFrame = useCallback(async () => {
    if (!videoRef.current || !isCameraActive || videoRef.current.readyState < 2) {
      animationFrameIdRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const video = videoRef.current;
    const vWidth = video.videoWidth || 640;
    const vHeight = video.videoHeight || 480;

    // Get 320x320 central bounding box
    const roi: HandBoundingBox = handDetector.getHandROI(vWidth, vHeight);

    // Extract 28x28 patch
    if (hiddenCanvasRef.current) {
      handDetector.extractHandCanvas(video, roi, hiddenCanvasRef.current);

      // Mirror onto preview canvas if visible
      if (roiCanvasRef.current) {
        roiCanvasRef.current.width = 112;
        roiCanvasRef.current.height = 112;
        const ctx = roiCanvasRef.current.getContext('2d')!;
        ctx.imageSmoothingEnabled = false; // pixel art preview
        ctx.drawImage(hiddenCanvasRef.current, 0, 0, 112, 112);
      }

      try {
        const result = await inferenceEngine.predictFromCanvas(hiddenCanvasRef.current);
        setPrediction(result);

        // Apply temporal smoothing window
        const { smoothedLetter, isStable: stable } = handDetector.smoothPrediction(
          result.letter,
          result.confidence
        );

        setStableLetter(smoothedLetter);
        setIsStable(stable);

        // Auto-append if stable and confidence high
        const now = Date.now();
        if (
          autoAppend &&
          stable &&
          !result.isUncertain &&
          result.confidence > 0.70 &&
          (lastAppendedLetterRef.current !== smoothedLetter || now - lastAppendedTimeRef.current > 1800)
        ) {
          setComposedText((prev) => prev + smoothedLetter);
          lastAppendedLetterRef.current = smoothedLetter;
          lastAppendedTimeRef.current = now;

          // Log to recognition history
          storageService.addHistoryItem({
            timestamp: new Date().toISOString(),
            letter: smoothedLetter,
            confidence: result.confidence,
            source: 'webcam',
            confirmedByUser: true,
          });

          // Auto-speak single letter if enabled
          const settings = storageService.getSettings();
          if (settings.autoSpeak) {
            speechService.speak(smoothedLetter);
          }
        }
      } catch (e) {
        console.warn('[Translator] Frame inference warning:', e);
      }
    }

    // Next frame (throttled to ~15-20 FPS for optimal responsiveness and low CPU)
    setTimeout(() => {
      if (isCameraActive) {
        animationFrameIdRef.current = requestAnimationFrame(processFrame);
      }
    }, 60);
  }, [isCameraActive, autoAppend]);

  useEffect(() => {
    if (isCameraActive) {
      animationFrameIdRef.current = requestAnimationFrame(processFrame);
    }
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isCameraActive, processFrame]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleAppendCurrent = () => {
    if (!prediction) return;
    const letterToAdd = stableLetter || prediction.letter;
    setComposedText((prev) => prev + letterToAdd);
    speechService.speak(letterToAdd);

    storageService.addHistoryItem({
      timestamp: new Date().toISOString(),
      letter: letterToAdd,
      confidence: prediction.confidence,
      source: 'webcam',
      confirmedByUser: true,
    });
  };

  const handleSpeakComposed = () => {
    if (!composedText.trim()) return;
    speechService.speak(composedText);
  };

  const handleCopyText = async () => {
    if (!composedText) return;
    await navigator.clipboard.writeText(composedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSavePhrase = () => {
    if (!composedText.trim()) return;
    storageService.savePhrase(composedText, 'General');
    alert('Phrase saved to your Saved Phrases library!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#DCE5F0]">
        <div>
          <h1 className="text-2xl font-black text-[#123B70] tracking-tight">Live Sign Recognition</h1>
          <p className="text-xs text-gray-500">
            Real-time neural recognition of American Sign Language static alphabet (A–Y).
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMirror(!mirror)}
            className="px-3 py-1.5 rounded-lg border border-[#DCE5F0] text-xs font-semibold text-[#172B45] hover:bg-[#F2F7FD] transition-colors"
          >
            {mirror ? 'Mirror Mode: ON' : 'Mirror Mode: OFF'}
          </button>
          <button
            onClick={() => onSelectTab && onSelectTab('help')}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-[#F2F7FD] hover:text-[#2878E5]"
            title="Lighting and camera guide"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Video Stream + Live HUD & Text Composer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 Cols): Webcam Feed & ROI Guide */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-[#172B45] aspect-4/3 flex items-center justify-center border-2 border-[#DCE5F0] shadow-md group">
            {/* Native Video Element */}
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover ${mirror ? 'scale-x-[-1]' : ''} ${
                !isCameraActive ? 'hidden' : 'block'
              }`}
            />

            {/* Inactive State Display */}
            {!isCameraActive && (
              <div className="text-center p-8 text-white space-y-4 max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-white/10 text-[#35C6D4] flex items-center justify-center mx-auto shadow-inner">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Camera is Off</h3>
                  <p className="text-xs text-white/70 mt-1">
                    Click start below to activate your webcam. Center your hand inside the guide brackets for real-time translation.
                  </p>
                </div>
                <button
                  onClick={startCamera}
                  className="px-6 py-3 rounded-xl bg-[#2878E5] hover:bg-[#35C6D4] text-white hover:text-[#123B70] font-bold text-sm transition-all shadow-md"
                >
                  Start Camera Feed
                </button>
              </div>
            )}

            {/* Error Message */}
            {cameraError && (
              <div className="absolute inset-0 bg-red-950/80 backdrop-blur-xs flex items-center justify-center p-6 text-center text-white z-20">
                <div className="space-y-3 max-w-md">
                  <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
                  <h4 className="font-bold text-base">Camera Error</h4>
                  <p className="text-xs text-red-100">{cameraError}</p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 bg-white text-red-900 rounded-lg text-xs font-bold shadow-md hover:bg-gray-100"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* ROI Guide Box Overlay when camera is active */}
            {isCameraActive && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-56 h-56 sm:w-64 sm:h-64 border-2 border-dashed border-[#35C6D4] rounded-2xl relative shadow-lg shadow-[#35C6D4]/10 bg-[#35C6D4]/5 flex flex-col justify-between p-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#35C6D4] bg-[#123B70]/80 px-2 py-0.5 rounded-md backdrop-blur-xs w-max">
                    <span>HAND ROI BRACKET</span>
                  </div>
                  <div className="text-center text-[11px] text-white/80 font-medium bg-[#123B70]/70 py-1 rounded-md">
                    Position gesture here
                  </div>
                </div>
              </div>
            )}

            {/* Top HUD status when active */}
            {isCameraActive && (
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs pointer-events-none z-10">
                <div className="flex items-center space-x-2 bg-[#123B70]/80 backdrop-blur-md px-3 py-1.5 rounded-full text-white font-medium border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span>LIVE RECOGNITION</span>
                </div>

                {prediction && (
                  <div className="bg-[#123B70]/80 backdrop-blur-md px-3 py-1.5 rounded-full text-white font-mono text-[11px] border border-white/10">
                    Latency: {prediction.inferenceTimeMs}ms
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hidden canvases for TFJS preprocessing */}
          <canvas ref={hiddenCanvasRef} className="hidden" />

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#DCE5F0] shadow-xs">
            <div className="flex items-center space-x-2">
              {isCameraActive ? (
                <button
                  onClick={stopCamera}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center space-x-2 transition-colors"
                >
                  <CameraOff className="w-4 h-4" />
                  <span>Stop Camera</span>
                </button>
              ) : (
                <button
                  onClick={startCamera}
                  className="px-4 py-2.5 rounded-xl bg-[#123B70] hover:bg-[#2878E5] text-white font-bold text-xs flex items-center space-x-2 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>Start Camera</span>
                </button>
              )}

              <button
                onClick={() => setAutoAppend(!autoAppend)}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  autoAppend
                    ? 'bg-[#35C6D4]/15 border-[#35C6D4] text-[#123B70]'
                    : 'bg-gray-50 border-[#DCE5F0] text-gray-500'
                }`}
              >
                Auto-Append: {autoAppend ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* 28x28 Preprocessed Patch Preview */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowRoiPreview(!showRoiPreview)}
                className="text-xs text-gray-500 hover:text-[#123B70] flex items-center space-x-1"
              >
                {showRoiPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showRoiPreview ? 'Hide Model Input' : 'Show 28×28 Patch'}</span>
              </button>

              {showRoiPreview && (
                <div className="flex items-center space-x-2 pl-2 border-l border-gray-200">
                  <canvas
                    ref={roiCanvasRef}
                    className="w-10 h-10 rounded-lg border border-[#DCE5F0] bg-black shadow-inner"
                    title="28x28 normalized grayscale tensor input"
                  />
                  <span className="text-[10px] text-gray-400 font-mono">28×28</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Live Prediction HUD & Sentence Builder */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Detected Letter Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#DCE5F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#123B70] flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-[#2878E5]" />
                <span>Live Neural Prediction</span>
              </span>
              {isStable && stableLetter && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 animate-pulse">
                  STABLE SIGN
                </span>
              )}
            </div>

            {prediction ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#123B70] to-[#2878E5] text-white flex items-center justify-center text-4xl font-black shadow-lg shadow-[#123B70]/20">
                      {stableLetter || prediction.letter}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[#123B70]">
                        Letter &quot;{stableLetter || prediction.letter}&quot;
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs font-bold text-emerald-700">
                          {(prediction.confidence * 100).toFixed(1)}% Confidence
                        </span>
                        <span>•</span>
                        <span className="text-xs text-gray-500 font-mono">
                          H = {prediction.entropy}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAppendCurrent}
                    className="p-3 rounded-xl bg-[#2878E5] hover:bg-[#123B70] text-white shadow-md transition-all active:scale-95"
                    title="Confirm and Add to Sentence"
                  >
                    <CornerDownLeft className="w-5 h-5" />
                  </button>
                </div>

                {/* Confidence Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-150 ${
                        prediction.confidence > 0.75
                          ? 'bg-emerald-500'
                          : prediction.confidence > 0.5
                          ? 'bg-[#2878E5]'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${prediction.confidence * 100}%` }}
                    />
                  </div>
                </div>

                {/* Uncertainty Warning if below threshold */}
                {prediction.isUncertain && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Prediction Uncertain</p>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        Hand may be partially outside bracket or lighting is dim. Hold hand steady inside the box.
                      </p>
                    </div>
                  </div>
                )}

                {/* Top-3 Candidates Breakdown */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                    Top Prediction Candidates
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {prediction.topK.slice(0, 3).map((item, idx) => (
                      <button
                        key={item.letter}
                        onClick={() => {
                          setComposedText((prev) => prev + item.letter);
                          speechService.speak(item.letter);
                        }}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          idx === 0
                            ? 'bg-[#F2F7FD] border-[#2878E5] text-[#123B70]'
                            : 'bg-white border-[#DCE5F0] text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <span className="text-base font-bold block">{item.letter}</span>
                        <span className="text-[10px] text-gray-500 block">
                          {(item.confidence * 100).toFixed(0)}%
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400 space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-gray-300" />
                <p className="text-xs">Start camera to see live sign predictions.</p>
              </div>
            )}
          </div>

          {/* Composed Text Box & Speech Synthesizer */}
          <div className="p-5 rounded-2xl bg-white border border-[#DCE5F0] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#123B70]">
                Translated Text Composer
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setComposedText((prev) => prev + ' ')}
                  className="px-2.5 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                >
                  Space
                </button>
                <button
                  onClick={() => setComposedText((prev) => prev.slice(0, -1))}
                  className="px-2.5 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                >
                  ⌫
                </button>
                <button
                  onClick={() => setComposedText('')}
                  className="px-2.5 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-red-600 rounded-md transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            <textarea
              value={composedText}
              onChange={(e) => setComposedText(e.target.value)}
              placeholder="Signed letters accumulate here to form words and sentences..."
              rows={3}
              className="w-full p-3 rounded-xl border border-[#DCE5F0] focus:ring-2 focus:ring-[#2878E5] focus:outline-hidden text-sm font-medium text-[#172B45] resize-none"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                onClick={handleSpeakComposed}
                disabled={!composedText.trim()}
                className="px-4 py-2 rounded-xl bg-[#123B70] hover:bg-[#2878E5] disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>Speak Out Loud</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSavePhrase}
                  disabled={!composedText.trim()}
                  className="px-3 py-2 rounded-xl border border-[#DCE5F0] hover:bg-[#F2F7FD] disabled:opacity-50 text-xs font-semibold text-[#172B45] transition-colors"
                >
                  Save Phrase
                </button>
                <button
                  onClick={handleCopyText}
                  disabled={!composedText.trim()}
                  className="p-2 rounded-xl border border-[#DCE5F0] hover:bg-[#F2F7FD] disabled:opacity-50 text-gray-600 transition-colors"
                  title="Copy to clipboard"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
