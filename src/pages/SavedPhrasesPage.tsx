import React, { useState, useEffect } from 'react';
import { 
  Bookmark, Plus, Search, Star, Volume2, Trash2, 
  Tag, Filter, Check, Heart, Sparkles
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { speechService } from '../services/speechService';
import { SavedPhrase } from '../types';

export const SavedPhrasesPage: React.FC = () => {
  const [phrases, setPhrases] = useState<SavedPhrase[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [newPhraseText, setNewPhraseText] = useState('');
  const [newPhraseCategory, setNewPhraseCategory] = useState<SavedPhrase['category']>('General');

  useEffect(() => {
    setPhrases(storageService.getSavedPhrases());
  }, []);

  const categories = ['All', 'Favorites', 'General', 'Greetings', 'Emergency', 'Questions', 'Work', 'Custom'];

  const filtered = phrases.filter((p) => {
    const matchesSearch = p.phrase.toLowerCase().includes(search.toLowerCase());
    if (selectedCategory === 'Favorites') return matchesSearch && p.isFavorite;
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAddPhrase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhraseText.trim()) return;

    storageService.savePhrase(newPhraseText.trim(), newPhraseCategory);
    setPhrases(storageService.getSavedPhrases());
    setNewPhraseText('');
    setIsAdding(false);
  };

  const handleToggleFavorite = (id: string) => {
    storageService.toggleFavoritePhrase(id);
    setPhrases(storageService.getSavedPhrases());
  };

  const handleDelete = (id: string) => {
    storageService.deletePhrase(id);
    setPhrases(storageService.getSavedPhrases());
  };

  const handleSpeak = (id: string, text: string) => {
    speechService.speak(text);
    storageService.incrementPhraseUsage(id);
    setPhrases(storageService.getSavedPhrases());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#DCE5F0]">
        <div>
          <h1 className="text-2xl font-black text-[#123B70] tracking-tight">Saved Phrases Library</h1>
          <p className="text-xs text-gray-500">
            Quick-access communication phrases for immediate speech or visual presentation.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 rounded-xl bg-[#123B70] hover:bg-[#2878E5] text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Phrase</span>
        </button>
      </div>

      {/* Add Phrase Modal Form */}
      {isAdding && (
        <div className="p-6 rounded-3xl bg-white border-2 border-[#2878E5] shadow-lg animate-in fade-in space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#123B70]">Add New Quick Phrase</h3>
            <button
              onClick={() => setIsAdding(false)}
              className="text-xs text-gray-400 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddPhrase} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Phrase Text:</label>
              <input
                type="text"
                value={newPhraseText}
                onChange={(e) => setNewPhraseText(e.target.value)}
                placeholder="e.g. Please write that down for me"
                className="w-full p-2.5 rounded-xl border border-[#DCE5F0] text-sm focus:ring-2 focus:ring-[#2878E5] focus:outline-hidden"
                autoFocus
              />
            </div>

            <div className="flex items-center space-x-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Category:</label>
                <select
                  value={newPhraseCategory}
                  onChange={(e) => setNewPhraseCategory(e.target.value as any)}
                  className="p-2 rounded-xl border border-[#DCE5F0] text-xs font-medium text-gray-700 focus:outline-hidden"
                >
                  <option value="General">General</option>
                  <option value="Greetings">Greetings</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Questions">Questions</option>
                  <option value="Work">Work</option>
                  <option value="Family">Family</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div className="pt-5">
                <button
                  type="submit"
                  disabled={!newPhraseText.trim()}
                  className="px-5 py-2 rounded-xl bg-[#2878E5] hover:bg-[#123B70] disabled:opacity-50 text-white font-bold text-xs shadow-xs"
                >
                  Save Phrase
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#DCE5F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saved phrases..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#DCE5F0] text-xs font-medium focus:ring-2 focus:ring-[#2878E5] focus:outline-hidden"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1 ${
                selectedCategory === cat
                  ? 'bg-[#123B70] text-white shadow-xs'
                  : 'bg-[#F2F7FD] border border-[#DCE5F0] text-gray-600 hover:text-[#123B70]'
              }`}
            >
              {cat === 'Favorites' && <Star className="w-3 h-3 text-amber-400 fill-current mr-0.5" />}
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Phrases List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((phrase) => (
          <div
            key={phrase.id}
            className="p-4 rounded-2xl bg-white border border-[#DCE5F0] hover:border-[#2878E5] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    phrase.category === 'Emergency'
                      ? 'bg-red-100 text-red-800'
                      : phrase.category === 'Greetings'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {phrase.category}
                </span>

                <button
                  onClick={() => handleToggleFavorite(phrase.id)}
                  className="p-1 rounded-md text-gray-300 hover:text-amber-400"
                  title="Toggle favorite"
                >
                  <Star
                    className={`w-4 h-4 ${
                      phrase.isFavorite ? 'text-amber-400 fill-current' : ''
                    }`}
                  />
                </button>
              </div>

              <p className="text-sm font-semibold text-[#172B45] leading-relaxed">
                {phrase.phrase}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
              <span className="text-[10px] text-gray-400 font-mono">Used {phrase.usageCount}×</span>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleSpeak(phrase.id, phrase.phrase)}
                  className="p-1.5 rounded-lg bg-[#F2F7FD] hover:bg-[#123B70] text-[#123B70] hover:text-white transition-colors"
                  title="Speak phrase"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(phrase.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete phrase"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
