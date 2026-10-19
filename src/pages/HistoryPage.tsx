import React, { useState, useEffect } from 'react';
import { 
  History, Download, Trash2, Search, Filter, 
  CheckCircle2, AlertTriangle, Camera, Image as ImageIcon, Volume2
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { speechService } from '../services/speechService';
import { RecognitionHistoryItem } from '../types';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<RecognitionHistoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('All');

  useEffect(() => {
    setHistory(storageService.getHistory());
  }, []);

  const handleClear = () => {
    if (confirm('Are you sure you want to clear your entire recognition history?')) {
      storageService.clearHistory();
      setHistory([]);
    }
  };

  const handleExportCSV = () => {
    const csvContent = storageService.exportHistoryCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `slb_ai_history_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const jsonContent = storageService.exportHistoryJSON();
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `slb_ai_history_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = history.filter((item) => {
    const matchesSearch = item.letter.toLowerCase().includes(search.toLowerCase());
    const matchesSource = selectedSource === 'All' || item.source === selectedSource;
    return matchesSearch && matchesSource;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#DCE5F0]">
        <div>
          <h1 className="text-2xl font-black text-[#123B70] tracking-tight">Recognition History Log</h1>
          <p className="text-xs text-gray-500">
            Audit trail of translated sign language predictions, confidence metrics, and user corrections.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            disabled={history.length === 0}
            className="px-3 py-1.5 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-gray-700 hover:bg-[#F2F7FD] disabled:opacity-40 transition-colors flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            disabled={history.length === 0}
            className="px-3 py-1.5 rounded-xl border border-[#DCE5F0] text-xs font-semibold text-gray-700 hover:bg-[#F2F7FD] disabled:opacity-40 transition-colors flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handleClear}
            disabled={history.length === 0}
            className="px-3 py-1.5 rounded-xl border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-40 transition-colors flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Log</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#DCE5F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search letter (e.g. A, B, C)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#DCE5F0] text-xs font-medium focus:ring-2 focus:ring-[#2878E5] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-1 bg-[#F2F7FD] p-1 rounded-xl border border-[#DCE5F0] text-xs">
          {['All', 'webcam', 'image_upload', 'practice'].map((src) => (
            <button
              key={src}
              onClick={() => setSelectedSource(src)}
              className={`px-3 py-1 rounded-lg font-semibold capitalize transition-colors ${
                selectedSource === src
                  ? 'bg-[#123B70] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#123B70]'
              }`}
            >
              {src.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-[#DCE5F0] shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <History className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-xs font-medium">No recognition records match your filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2F7FD] text-gray-700 border-b border-[#DCE5F0]">
                <tr>
                  <th className="p-3 font-bold">Sign Letter</th>
                  <th className="p-3 font-bold">Confidence</th>
                  <th className="p-3 font-bold">Source</th>
                  <th className="p-3 font-bold">Timestamp</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <span className="w-8 h-8 rounded-lg bg-[#123B70] text-white font-black text-sm flex items-center justify-center shadow-2xs">
                          {item.letter}
                        </span>
                        <span className="font-bold text-[#172B45]">
                          Letter {item.letter}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full ${
                              item.confidence > 0.75
                                ? 'bg-emerald-500'
                                : item.confidence > 0.5
                                ? 'bg-[#2878E5]'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${item.confidence * 100}%` }}
                          />
                        </div>
                        <span className="font-bold text-gray-700">
                          {(item.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F2F7FD] border border-[#DCE5F0] text-gray-700 capitalize">
                        {item.source === 'webcam' ? (
                          <Camera className="w-3 h-3 text-[#2878E5]" />
                        ) : (
                          <ImageIcon className="w-3 h-3 text-[#35C6D4]" />
                        )}
                        <span>{item.source.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="p-3 text-gray-500 font-mono text-[11px]">
                      {new Date(item.timestamp).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="p-3">
                      {item.confirmedByUser ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirmed</span>
                        </span>
                      ) : (
                        <span className="text-gray-400">Unconfirmed</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => speechService.speak(item.letter)}
                          className="p-1 rounded-md text-gray-500 hover:text-[#123B70] hover:bg-gray-100"
                          title="Speak letter"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            storageService.deleteHistoryItem(item.id);
                            setHistory(storageService.getHistory());
                          }}
                          className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
