import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Volume2, Copy, Check, Trash2, 
  Mic, MicOff, Bookmark, Sparkles, Send, Type, Plus
} from 'lucide-react';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';
import { ASL_ALPHABET_DATA } from '../data/aslAlphabet';
import { SavedPhrase } from '../types';

export const TextCommunicationPage: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'huge'>('large');

  useEffect(() => {
    setSavedPhrases(storageService.getSavedPhrases());
  }, []);

  const handleSpeak = () => {
    if (!text.trim()) return;
    speechService.speak(text);
  };

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const toggleMic = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      const started = speechService.startListening(
        (transcript, isFinal) => {
          setText(transcript);
          if (isFinal) {
            setIsListening(false);
          }
        },
        (error) => {
          alert('Speech input error: ' + error);
          setIsListening(false);
        }
      );
      if (started) setIsListening(true);
    }
  };

  const handleSaveCurrentAsPhrase = () => {
    if (!text.trim()) return;
    const newPhrase = storageService.savePhrase(text, 'Custom');
    setSavedPhrases(storageService.getSavedPhrases());
    alert('Phrase saved to quick library!');
  };

  const categories = ['All', 'General', 'Greetings', 'Emergency', 'Questions'];
  const filteredPhrases = savedPhrases.filter(
    (p) => activeCategory === 'All' || p.category === activeCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#DCE5F0]">
        <div>
          <h1 className="text-2xl font-black text-[#123B70] tracking-tight">Two-Way Text Communication</h1>
          <p className="text-xs text-gray-500">
            High-contrast, large-type communicator for direct interactions in public, healthcare, or retail settings.
          </p>
        </div>

        {/* Text Size Control */}
        <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-[#DCE5F0] text-xs">
          <span className="text-gray-400 font-medium px-2">Size:</span>
          {(['normal', 'large', 'huge'] as const).map((sz) => (
            <button
              key={sz}
              onClick={() => setTextSize(sz)}
              className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-colors ${
                textSize === sz
                  ? 'bg-[#123B70] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#123B70]'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Main Communicator Display */}
      <div className="p-6 rounded-3xl bg-white border border-[#DCE5F0] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-2 text-xs">
          <span className="font-bold text-[#123B70] uppercase tracking-wider flex items-center space-x-1.5">
            <MessageSquare className="w-4 h-4 text-[#2878E5]" />
            <span>Interactive Communicator Display</span>
          </span>
          <span className="text-gray-400">{text.length} characters</span>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or select a phrase to show on screen..."
          rows={textSize === 'huge' ? 4 : textSize === 'large' ? 5 : 6}
          className={`w-full p-4 rounded-2xl border border-[#DCE5F0] focus:ring-2 focus:ring-[#2878E5] focus:outline-hidden font-bold text-[#172B45] resize-none leading-relaxed ${
            textSize === 'huge'
              ? 'text-3xl sm:text-4xl'
              : textSize === 'large'
              ? 'text-xl sm:text-2xl'
              : 'text-base'
          }`}
        />

        {/* Primary Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSpeak}
              disabled={!text.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#123B70] hover:bg-[#2878E5] disabled:opacity-40 text-white font-bold text-xs flex items-center space-x-2 shadow-xs transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              <span>Speak Out Loud</span>
            </button>

            <button
              onClick={toggleMic}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 border transition-all ${
                isListening
                  ? 'bg-red-500 text-white border-red-500 animate-pulse'
                  : 'bg-[#F2F7FD] border-[#DCE5F0] text-[#123B70] hover:bg-[#DCE5F0]'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isListening ? 'Listening...' : 'Partner Speak'}</span>
            </button>

            <button
              onClick={handleCopy}
              disabled={!text.trim()}
              className="p-2.5 rounded-xl border border-[#DCE5F0] text-gray-600 hover:bg-[#F2F7FD] disabled:opacity-40 transition-colors"
              title="Copy to clipboard"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSaveCurrentAsPhrase}
              disabled={!text.trim()}
              className="px-3.5 py-2 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#172B45] hover:bg-[#F2F7FD] disabled:opacity-40 transition-colors flex items-center space-x-1"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#2878E5]" />
              <span>Save to Quick Phrases</span>
            </button>

            <button
              onClick={() => setText('')}
              className="p-2.5 rounded-xl border border-[#DCE5F0] text-red-500 hover:bg-red-50 transition-colors"
              title="Clear display"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Phrase Bank */}
      <div className="p-6 rounded-3xl bg-white border border-[#DCE5F0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-[#123B70] flex items-center space-x-2">
            <Bookmark className="w-4 h-4 text-[#2878E5]" />
            <span>Frequent Communicator Phrases</span>
          </h2>

          <div className="flex items-center space-x-1 bg-[#F2F7FD] p-1 rounded-xl border border-[#DCE5F0] text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#123B70] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#123B70]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPhrases.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setText(item.phrase);
                speechService.speak(item.phrase);
                storageService.incrementPhraseUsage(item.id);
              }}
              className="p-3.5 rounded-2xl bg-[#F2F7FD] hover:bg-[#2878E5] hover:text-white border border-[#DCE5F0] text-left transition-all group flex flex-col justify-between"
            >
              <span className="text-xs font-semibold text-[#172B45] group-hover:text-white leading-relaxed">
                {item.phrase}
              </span>
              <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400 group-hover:text-white/80">
                <span>{item.category}</span>
                <span>Used {item.usageCount}×</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
