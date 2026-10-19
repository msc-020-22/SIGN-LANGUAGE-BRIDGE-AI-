import React, { useState, useRef } from 'react';
import { 
  Upload, Image as ImageIcon, Volume2, Copy, Check, 
  AlertTriangle, Sparkles, X, RefreshCw, CornerDownLeft, 
  HelpCircle, ShieldCheck
} from 'lucide-react';
import { inferenceEngine } from '../services/inferenceEngine';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';
import { PredictionResult } from '../types';
import { CLASS_NAMES } from '../data/aslAlphabet';

interface ImageRecognitionPageProps {
  onSelectTab?: (tab: string) => void;
}

export const ImageRecognitionPage: React.FC<ImageRecognitionPageProps> = ({ onSelectTab }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [selectedCorrection, setSelectedCorrection] = useState<string | null>(null);
  const [composedText, setComposedText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleFile = (file: File) => {
    setErrorMessage(null);
    setPrediction(null);
    setSelectedCorrection(null);

    // Validate type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 10MB. Please upload a smaller image.');
      return;
    }

    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + ' KB');

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!imageElementRef.current || !imageSrc) return;
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const result = await inferenceEngine.predictFromImage(imageElementRef.current);
      setPrediction(result);
      setSelectedCorrection(result.letter);

      // Auto-log to history
      storageService.addHistoryItem({
        timestamp: new Date().toISOString(),
        letter: result.letter,
        confidence: result.confidence,
        source: 'image_upload',
        confirmedByUser: false,
      });

      const settings = storageService.getSettings();
      if (settings.autoSpeak) {
        speechService.speak(result.letter);
      }
    } catch (err: any) {
      console.error('[ImageRecognition] Inference error:', err);
      setErrorMessage(err.message || 'Model prediction failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmAndAppend = () => {
    if (!prediction) return;
    const finalLetter = selectedCorrection || prediction.letter;
    setComposedText((prev) => prev + finalLetter);
    speechService.speak(finalLetter);

    // Update history with confirmed letter
    storageService.addHistoryItem({
      timestamp: new Date().toISOString(),
      letter: finalLetter,
      confidence: prediction.confidence,
      source: 'image_upload',
      confirmedByUser: true,
      correctedTo: selectedCorrection !== prediction.letter ? (selectedCorrection || undefined) : undefined,
    });
  };

  const handleCopyText = async () => {
    if (!composedText) return;
    await navigator.clipboard.writeText(composedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClearImage = () => {
    setImageSrc(null);
    setFileName('');
    setPrediction(null);
    setSelectedCorrection(null);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#DCE5F0]">
        <div>
          <h1 className="text-2xl font-black text-[#123B70] tracking-tight">Image Sign Recognition</h1>
          <p className="text-xs text-gray-500">
            Upload single-frame photos of static ASL hand signs for neural classification and text assembly.
          </p>
        </div>
        <button
          onClick={() => onSelectTab && onSelectTab('help')}
          className="text-xs font-semibold text-[#2878E5] hover:underline self-start sm:self-auto"
        >
          View Photo Tips
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 Cols): Upload & Image Preview */}
        <div className="lg:col-span-7 space-y-4">
          {!imageSrc ? (
            /* Upload Dropzone */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-10 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all aspect-4/3 flex flex-col items-center justify-center space-y-4 ${
                isDragging
                  ? 'border-[#2878E5] bg-[#F2F7FD]'
                  : 'border-[#DCE5F0] bg-white hover:border-[#2878E5] hover:bg-[#F2F7FD]/50'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#2878E5]/10 text-[#2878E5] flex items-center justify-center shadow-xs">
                <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-base text-[#123B70]">
                  Click to upload or drag & drop sign photo
                </p>
                <p className="text-xs text-gray-500">
                  Supports JPEG, PNG, WebP up to 10MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
              />
            </div>
          ) : (
            /* Image Preview Card */
            <div className="relative rounded-3xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center border-2 border-[#DCE5F0] shadow-md group">
              <img
                ref={imageElementRef}
                src={imageSrc}
                alt="Uploaded sign for recognition"
                onLoad={() => {
                  if (!prediction && !isAnalyzing) {
                    handleAnalyzeImage();
                  }
                }}
                className="max-h-full max-w-full object-contain"
              />

              {/* Floating Toolbar */}
              <div className="absolute top-3 right-3 flex items-center space-x-2">
                <button
                  onClick={handleClearImage}
                  className="p-2 rounded-xl bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Metadata bar */}
              <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md p-2.5 rounded-xl text-white text-xs flex items-center justify-between">
                <div className="truncate mr-2">
                  <span className="font-semibold block truncate">{fileName}</span>
                  <span className="text-[10px] text-gray-300">{fileSize}</span>
                </div>
                <button
                  onClick={handleAnalyzeImage}
                  disabled={isAnalyzing}
                  className="px-3 py-1.5 rounded-lg bg-[#2878E5] hover:bg-[#123B70] text-white font-bold text-xs shrink-0 flex items-center space-x-1 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzing ? 'Analyzing...' : 'Re-Analyze'}</span>
                </button>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-[#F2F7FD] border border-[#DCE5F0] text-xs text-gray-600 flex items-start space-x-3">
            <ShieldCheck className="w-4 h-4 text-[#2878E5] shrink-0 mt-0.5" />
            <p>
              <b>Client-side Privacy:</b> Image analysis is executed locally inside your browser via TensorFlow.js.
              Your photos are not transmitted or stored on any external server.
            </p>
          </div>
        </div>

        {/* Right Column (5 Cols): Analysis Results & Text Composer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-[#DCE5F0] shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#123B70] flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-[#2878E5]" />
              <span>Neural Classification Result</span>
            </h3>

            {isAnalyzing ? (
              <div className="py-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#2878E5] animate-spin mx-auto" />
                <p className="text-xs font-semibold text-[#123B70]">Normalizing pixels and running model inference...</p>
              </div>
            ) : prediction ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#123B70] text-white flex items-center justify-center text-3xl font-black shadow-md">
                      {selectedCorrection || prediction.letter}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#123B70]">
                        Letter &quot;{selectedCorrection || prediction.letter}&quot;
                      </h4>
                      <p className="text-xs font-bold text-emerald-700">
                        {(prediction.confidence * 100).toFixed(1)}% Model Confidence
                      </p>
                      <p className="text-[11px] text-gray-400 font-mono">
                        Latency: {prediction.inferenceTimeMs}ms • Entropy: {prediction.entropy}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmAndAppend}
                    className="p-3 rounded-xl bg-[#2878E5] hover:bg-[#123B70] text-white shadow-md transition-all active:scale-95"
                    title="Add confirmed letter to text composer"
                  >
                    <CornerDownLeft className="w-5 h-5" />
                  </button>
                </div>

                {/* Uncertainty Warning */}
                {prediction.isUncertain && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Uncertain Confidence Flag</p>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        The gesture resembles multiple possible letters. You can select the correct letter below.
                      </p>
                    </div>
                  </div>
                )}

                {/* Candidate Selection / Correction */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                    Alternative Candidates (Click to Correct):
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {prediction.topK.slice(0, 4).map((cand) => (
                      <button
                        key={cand.letter}
                        onClick={() => {
                          setSelectedCorrection(cand.letter);
                          speechService.speak(cand.letter);
                        }}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          selectedCorrection === cand.letter
                            ? 'bg-[#123B70] text-white border-[#123B70] shadow-sm font-bold'
                            : 'bg-[#F2F7FD] border-[#DCE5F0] text-[#172B45] hover:border-gray-400'
                        }`}
                      >
                        <span className="text-base block">{cand.letter}</span>
                        <span className="text-[10px] block opacity-80">
                          {(cand.confidence * 100).toFixed(0)}%
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400 space-y-1">
                <ImageIcon className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-xs">Upload an image to see neural model output.</p>
              </div>
            )}
          </div>

          {/* Text Composer */}
          <div className="p-5 rounded-2xl bg-white border border-[#DCE5F0] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#123B70]">
                Assembled Text
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setComposedText((prev) => prev + ' ')}
                  className="px-2.5 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
                >
                  Space
                </button>
                <button
                  onClick={() => setComposedText((prev) => prev.slice(0, -1))}
                  className="px-2.5 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
                >
                  ⌫
                </button>
                <button
                  onClick={() => setComposedText('')}
                  className="px-2.5 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-red-600 rounded-md"
                >
                  Clear
                </button>
              </div>
            </div>

            <textarea
              value={composedText}
              onChange={(e) => setComposedText(e.target.value)}
              placeholder="Confirmed signs will form words here..."
              rows={3}
              className="w-full p-3 rounded-xl border border-[#DCE5F0] focus:ring-2 focus:ring-[#2878E5] focus:outline-hidden text-sm font-medium text-[#172B45] resize-none"
            />

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => speechService.speak(composedText)}
                disabled={!composedText.trim()}
                className="px-4 py-2 rounded-xl bg-[#123B70] hover:bg-[#2878E5] disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>Speak</span>
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
  );
};
