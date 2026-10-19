import React, { useState } from 'react';
import { 
  BookOpen, Search, Filter, Volume2, Sparkles, 
  HelpCircle, ChevronRight, X, AlertCircle, Info, Check
} from 'lucide-react';
import { ASL_ALPHABET_DATA, MALAWIAN_SIGN_LANGUAGE_STATUS, DYNAMIC_LETTERS_NOTE } from '../data/aslAlphabet';
import { SignAlphabetInfo } from '../types';
import { speechService } from '../services/speechService';

export const LearnPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedSign, setSelectedSign] = useState<SignAlphabetInfo | null>(null);

  const categories = ['All', 'Fist', 'Open', 'Fingers', 'Pinch'];
  const difficulties = ['All', 'Easy', 'Medium', 'Challenging'];

  const filteredSigns = ASL_ALPHABET_DATA.filter((sign) => {
    const matchesSearch =
      sign.letter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sign.handShapeDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || sign.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || sign.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#DCE5F0]">
        <div>
          <h1 className="text-2xl font-black text-[#123B70] tracking-tight">ASL Sign Dictionary</h1>
          <p className="text-xs text-gray-500">
            Official 24 static American Sign Language alphabet letters supported by our neural model.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#35C6D4]/15 text-[#123B70]">
            24 Verified Static Letters
          </span>
        </div>
      </div>

      {/* MSL Transparency Notice */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F2F7FD] to-white border border-[#DCE5F0] shadow-xs flex items-start space-x-3 text-xs text-[#172B45]">
        <Info className="w-5 h-5 text-[#2878E5] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-[#123B70]">
            Language Scope & Malawian Sign Language (MSL) Roadmap:
          </p>
          <p className="text-gray-600 leading-relaxed">
            {MALAWIAN_SIGN_LANGUAGE_STATUS.notes}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#DCE5F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search letter, handshape, or description..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#DCE5F0] text-xs font-medium focus:ring-2 focus:ring-[#2878E5] focus:outline-hidden"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1 bg-[#F2F7FD] p-1 rounded-xl border border-[#DCE5F0]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#123B70] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#123B70]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1 bg-[#F2F7FD] p-1 rounded-xl border border-[#DCE5F0]">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedDifficulty === diff
                    ? 'bg-[#2878E5] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#2878E5]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alphabet Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredSigns.map((sign) => (
          <div
            key={sign.letter}
            onClick={() => setSelectedSign(sign)}
            className="p-4 rounded-2xl bg-white border border-[#DCE5F0] hover:border-[#2878E5] shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#F2F7FD] text-gray-500">
                  {sign.category}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    sign.difficulty === 'Easy'
                      ? 'bg-emerald-100 text-emerald-800'
                      : sign.difficulty === 'Medium'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {sign.difficulty}
                </span>
              </div>

              {/* Hand Icon & Letter Display */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#123B70] to-[#2878E5] text-white flex items-center justify-center text-4xl font-black mx-auto my-2 group-hover:scale-105 transition-transform shadow-md shadow-[#2878E5]/15">
                {sign.letter}
              </div>

              <p className="text-xs font-bold text-[#123B70] text-center line-clamp-1 mt-2">
                {sign.handShapeDescription}
              </p>
            </div>

            <button className="mt-3 text-[11px] font-semibold text-[#2878E5] group-hover:text-[#123B70] text-center flex items-center justify-center space-x-1">
              <span>View Guide</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      {/* Dynamic Letters Note Box */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Note on Letters J and Z (Motion Gestures):</span>
          <p className="text-amber-900 leading-relaxed">
            {DYNAMIC_LETTERS_NOTE.explanation}
          </p>
        </div>
      </div>

      {/* Modal: Sign Detail View */}
      {selectedSign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#DCE5F0] shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedSign(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-[#F2F7FD]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#123B70] to-[#2878E5] text-white flex items-center justify-center text-5xl font-black shadow-lg">
                {selectedSign.letter}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2878E5]/10 text-[#2878E5]">
                  {selectedSign.category} Handshape • {selectedSign.difficulty}
                </span>
                <h3 className="text-xl font-bold text-[#123B70] mt-1">
                  ASL Letter &quot;{selectedSign.letter}&quot;
                </h3>
                <p className="text-xs text-gray-500">
                  Model Class #{selectedSign.classIndex} (Dataset Label {selectedSign.datasetLabel})
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="p-3.5 rounded-2xl bg-[#F2F7FD] border border-[#DCE5F0] text-xs space-y-2">
              <p className="font-semibold text-[#172B45] leading-relaxed">
                {selectedSign.description}
              </p>
              <p className="text-gray-600">
                💡 <b>Mnemonic:</b> {selectedSign.mnemonicTip}
              </p>
            </div>

            {/* Common Mistakes */}
            <div className="p-3 rounded-2xl bg-red-50/70 border border-red-100 text-xs text-red-950 space-y-1">
              <span className="font-bold text-red-900 block">⚠️ Common Pitfalls:</span>
              <p className="text-red-800/90 leading-relaxed">{selectedSign.commonMistakes}</p>
            </div>

            {/* Footer action */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => speechService.speak(`Letter ${selectedSign.letter}. ${selectedSign.description}`)}
                className="px-4 py-2 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-[#123B70] hover:bg-[#F2F7FD] flex items-center space-x-1.5"
              >
                <Volume2 className="w-4 h-4 text-[#2878E5]" />
                <span>Listen Description</span>
              </button>

              <button
                onClick={() => setSelectedSign(null)}
                className="px-5 py-2 rounded-xl bg-[#123B70] text-white text-xs font-bold hover:bg-[#2878E5]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
