import React, { useState, useEffect } from 'react';
import { 
  Settings, Sliders, Volume2, Camera, Shield, 
  Trash2, RotateCcw, Check, Sparkles, AlertCircle
} from 'lucide-react';
import { storageService, DEFAULT_SETTINGS } from '../services/storageService';
import { UserSettings } from '../types';
import { speechService } from '../services/speechService';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setSettings(storageService.getSettings());
  }, []);

  const handleChange = (key: keyof UserSettings, value: any) => {
    const updated = storageService.saveSettings({ [key]: value });
    setSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1500);
  };

  const handleReset = () => {
    if (confirm('Reset all vision and communication settings to defaults?')) {
      const reset = storageService.resetSettings();
      setSettings(reset);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 1500);
    }
  };

  const handleTestSpeech = () => {
    speechService.speak('Testing speech rate and pitch synthesis.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#DCE5F0]">
        <div>
          <h1 className="text-2xl font-black text-[#123B70] tracking-tight">Settings & Vision Configuration</h1>
          <p className="text-xs text-gray-500">
            Tune neural model confidence thresholds, speech synthesis parameters, and camera settings.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>Saved</span>
            </span>
          )}
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-gray-600 hover:bg-[#F2F7FD] flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Inference & Confidence Sliders */}
        <div className="p-6 rounded-3xl bg-white border border-[#DCE5F0] shadow-xs space-y-5">
          <div className="flex items-center space-x-2 border-b border-[#DCE5F0] pb-3">
            <Sliders className="w-5 h-5 text-[#2878E5]" />
            <div>
              <h2 className="text-sm font-bold text-[#123B70]">Computer Vision & Inference</h2>
              <p className="text-[11px] text-gray-400">Model thresholds and temporal filtering</p>
            </div>
          </div>

          {/* Confidence Threshold */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-gray-700">Minimum Confidence Threshold</label>
              <span className="font-bold text-[#123B70]">
                {(settings.confidenceThreshold * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.40"
              max="0.90"
              step="0.05"
              value={settings.confidenceThreshold}
              onChange={(e) => handleChange('confidenceThreshold', parseFloat(e.target.value))}
              className="w-full accent-[#2878E5] cursor-pointer"
            />
            <p className="text-[11px] text-gray-400">
              Predictions below this confidence level are flagged as uncertain.
            </p>
          </div>

          {/* Smoothing Window Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-gray-700">Temporal Smoothing Window</label>
              <span className="font-bold text-[#123B70]">
                {settings.smoothingWindowSize} Frames
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={settings.smoothingWindowSize}
              onChange={(e) => handleChange('smoothingWindowSize', parseInt(e.target.value, 10))}
              className="w-full accent-[#2878E5] cursor-pointer"
            />
            <p className="text-[11px] text-gray-400">
              Majority vote over consecutive video frames to prevent letter flickering.
            </p>
          </div>

          {/* Uncertainty Threshold */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-gray-700">Shannon Entropy Uncertainty Limit</label>
              <span className="font-bold text-[#123B70]">
                {settings.uncertaintyThreshold.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.30"
              max="0.80"
              step="0.05"
              value={settings.uncertaintyThreshold}
              onChange={(e) => handleChange('uncertaintyThreshold', parseFloat(e.target.value))}
              className="w-full accent-[#2878E5] cursor-pointer"
            />
            <p className="text-[11px] text-gray-400">
              Higher values permit more ambiguity before triggering uncertain warnings.
            </p>
          </div>
        </div>

        {/* Speech Synthesis Controls */}
        <div className="p-6 rounded-3xl bg-white border border-[#DCE5F0] shadow-xs space-y-5">
          <div className="flex items-center space-x-2 border-b border-[#DCE5F0] pb-3">
            <Volume2 className="w-5 h-5 text-[#35C6D4]" />
            <div>
              <h2 className="text-sm font-bold text-[#123B70]">Speech & Audio Output</h2>
              <p className="text-[11px] text-gray-400">Text-to-speech voice parameters</p>
            </div>
          </div>

          {/* Auto Speak Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F2F7FD] border border-[#DCE5F0]">
            <div>
              <span className="text-xs font-bold text-[#172B45] block">Auto-Speak Confirmed Signs</span>
              <span className="text-[11px] text-gray-500">Automatically vocalize letters as they are recognized</span>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSpeak}
              onChange={(e) => handleChange('autoSpeak', e.target.checked)}
              className="w-4 h-4 accent-[#2878E5] rounded-sm cursor-pointer"
            />
          </div>

          {/* Speech Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-gray-700">Speech Rate (Speed)</label>
              <span className="font-bold text-[#123B70]">{settings.speechRate.toFixed(1)}×</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.4"
              step="0.1"
              value={settings.speechRate}
              onChange={(e) => handleChange('speechRate', parseFloat(e.target.value))}
              className="w-full accent-[#2878E5] cursor-pointer"
            />
          </div>

          {/* Speech Pitch */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-gray-700">Speech Pitch</label>
              <span className="font-bold text-[#123B70]">{settings.speechPitch.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.3"
              step="0.1"
              value={settings.speechPitch}
              onChange={(e) => handleChange('speechPitch', parseFloat(e.target.value))}
              className="w-full accent-[#2878E5] cursor-pointer"
            />
          </div>

          <button
            onClick={handleTestSpeech}
            className="w-full py-2 rounded-xl border border-[#DCE5F0] text-xs font-bold text-[#123B70] hover:bg-[#F2F7FD] transition-colors"
          >
            Test Speech Synthesis Voice
          </button>
        </div>

        {/* Camera & Hardware Config */}
        <div className="p-6 rounded-3xl bg-white border border-[#DCE5F0] shadow-xs space-y-5">
          <div className="flex items-center space-x-2 border-b border-[#DCE5F0] pb-3">
            <Camera className="w-5 h-5 text-[#123B70]" />
            <div>
              <h2 className="text-sm font-bold text-[#123B70]">Camera & Hardware</h2>
              <p className="text-[11px] text-gray-400">Webcam display and mirroring</p>
            </div>
          </div>

          {/* Camera Resolution */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 block">Capture Resolution</label>
            <select
              value={settings.cameraResolution}
              onChange={(e) => handleChange('cameraResolution', e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-[#DCE5F0] text-xs font-medium text-gray-700 focus:outline-hidden"
            >
              <option value="640x480">Standard Definition (640 × 480) — Low Latency</option>
              <option value="1280x720">High Definition (1280 × 720) — Enhanced Clarity</option>
            </select>
          </div>

          {/* Mirror Camera */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F2F7FD] border border-[#DCE5F0]">
            <div>
              <span className="text-xs font-bold text-[#172B45] block">Mirror Video Stream</span>
              <span className="text-[11px] text-gray-500">Horizontal flip for natural selfie feedback</span>
            </div>
            <input
              type="checkbox"
              checked={settings.mirrorCamera}
              onChange={(e) => handleChange('mirrorCamera', e.target.checked)}
              className="w-4 h-4 accent-[#2878E5] rounded-sm cursor-pointer"
            />
          </div>
        </div>

        {/* Privacy & Retention */}
        <div className="p-6 rounded-3xl bg-white border border-[#DCE5F0] shadow-xs space-y-5">
          <div className="flex items-center space-x-2 border-b border-[#DCE5F0] pb-3">
            <Shield className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-sm font-bold text-[#123B70]">Privacy & Data Retention</h2>
              <p className="text-[11px] text-gray-400">Client-side controls & safety</p>
            </div>
          </div>

          {/* Save History Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F2F7FD] border border-[#DCE5F0]">
            <div>
              <span className="text-xs font-bold text-[#172B45] block">Save Recognition History</span>
              <span className="text-[11px] text-gray-500">Log translated letters for review</span>
            </div>
            <input
              type="checkbox"
              checked={settings.saveHistory}
              onChange={(e) => handleChange('saveHistory', e.target.checked)}
              className="w-4 h-4 accent-[#2878E5] rounded-sm cursor-pointer"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                if (confirm('Clear all locally saved history, phrases, and progress?')) {
                  storageService.clearHistory();
                  alert('All local history cleared.');
                }
              }}
              className="w-full py-2.5 rounded-xl border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
              Clear All Local Data & History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
