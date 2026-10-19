import React, { useState, useEffect } from 'react';
import { 
  Camera, Image as ImageIcon, MessageSquare, Users, BookOpen, 
  Award, TrendingUp, Sparkles, Clock, CheckCircle2, 
  ArrowRight, Bookmark, ShieldCheck, AlertCircle, Volume2, Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { ASL_ALPHABET_DATA } from '../data/aslAlphabet';
import { RecognitionHistoryItem, SavedPhrase } from '../types';
import { speechService } from '../services/speechService';

interface DashboardPageProps {
  onSelectTab: (tab: string) => void;
  onOpenDownloadModal?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onSelectTab, onOpenDownloadModal }) => {
  const { profile } = useAuth();
  const [history, setHistory] = useState<RecognitionHistoryItem[]>([]);
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>([]);
  const [dailySign, setDailySign] = useState(ASL_ALPHABET_DATA[0]);

  useEffect(() => {
    setHistory(storageService.getHistory().slice(0, 5));
    setSavedPhrases(storageService.getSavedPhrases().slice(0, 4));

    // Daily sign based on day of month
    const day = new Date().getDate();
    setDailySign(ASL_ALPHABET_DATA[day % ASL_ALPHABET_DATA.length]);
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#123B70] via-[#1b4b8a] to-[#2878E5] text-white shadow-lg shadow-[#123B70]/15 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#35C6D4]/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-[#35C6D4]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Assisting Human Communication</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {profile.displayName || 'Friend'}!
          </h1>

          <p className="text-white/80 text-sm leading-relaxed">
            Your real-time sign language assistant is active. Launch live camera recognition,
            test gesture images, or communicate seamlessly with two-way dialogue.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onSelectTab('translator')}
              className="px-5 py-2.5 rounded-xl bg-[#35C6D4] text-[#123B70] font-bold text-sm shadow-md hover:bg-white transition-all flex items-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>Launch Live Recognition</span>
            </button>
            <button
              onClick={() => onSelectTab('conversation')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-xs transition-colors flex items-center space-x-2"
            >
              <Users className="w-4 h-4" />
              <span>Dual Conversation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#DCE5F0] shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">Signs Mastered</span>
            <Award className="w-4 h-4 text-[#2878E5]" />
          </div>
          <div className="text-2xl font-black text-[#123B70]">
            {profile.signsMastered} <span className="text-xs font-medium text-gray-400">/ 24</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#2878E5] to-[#35C6D4] h-full rounded-full"
              style={{ width: `${(profile.signsMastered / 24) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#DCE5F0] shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">Total Recognitions</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-[#123B70]">
            {profile.totalRecognitions}
          </div>
          <p className="text-[11px] text-emerald-600 mt-2 font-medium flex items-center space-x-1">
            <span>+12 today</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#DCE5F0] shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">Practice Streak</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-[#123B70]">
            {profile.quizStreak} <span className="text-xs font-medium text-gray-400">Days</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Active learning consistency</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#DCE5F0] shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">Neural Model Status</span>
            <ShieldCheck className="w-4 h-4 text-[#35C6D4]" />
          </div>
          <div className="text-2xl font-black text-emerald-600 flex items-center space-x-1.5">
            <span>Ready</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">TF.js Client-Side Engine</p>
        </div>
      </div>

      {/* Main Grid: Quick Actions + Daily Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Action Hub */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-[#123B70] flex items-center space-x-2">
            <span>Communication & Learning Tools</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => onSelectTab('translator')}
              className="p-5 rounded-2xl bg-white border border-[#DCE5F0] hover:border-[#2878E5] shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2878E5]/10 text-[#2878E5] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#123B70] text-base group-hover:text-[#2878E5] transition-colors">
                Live Sign Camera
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Aim your webcam at your hand gesture. Model translates frames into confirmed text with speech.
              </p>
            </div>

            <div
              onClick={() => onSelectTab('image-recognition')}
              className="p-5 rounded-2xl bg-white border border-[#DCE5F0] hover:border-[#2878E5] shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#35C6D4]/15 text-[#123B70] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#123B70] text-base group-hover:text-[#2878E5] transition-colors">
                Image Sign Classifier
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Upload or drag a photo of a hand sign. View top predictions, uncertainty, and add to text composer.
              </p>
            </div>

            <div
              onClick={() => onSelectTab('conversation')}
              className="p-5 rounded-2xl bg-white border border-[#DCE5F0] hover:border-[#2878E5] shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#123B70] text-base group-hover:text-[#2878E5] transition-colors">
                Dual Conversation Mode
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Split interface for Deaf and hearing partners. Natural back-and-forth communication flow.
              </p>
            </div>

            <div
              onClick={() => onSelectTab('practice')}
              className="p-5 rounded-2xl bg-white border border-[#DCE5F0] hover:border-[#2878E5] shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#123B70] text-base group-hover:text-[#2878E5] transition-colors">
                Interactive Practice & Quiz
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Test your sign memory with randomized quizzes and real-time webcam gesture challenges.
              </p>
            </div>
          </div>

          {/* Quick Saved Phrases */}
          <div className="p-5 rounded-2xl bg-white border border-[#DCE5F0] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#123B70] flex items-center space-x-2">
                <Bookmark className="w-4 h-4 text-[#2878E5]" />
                <span>Quick Communicator Phrases</span>
              </h3>
              <button
                onClick={() => onSelectTab('saved-phrases')}
                className="text-xs font-semibold text-[#2878E5] hover:underline"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {savedPhrases.map((phrase) => (
                <div
                  key={phrase.id}
                  className="p-2.5 rounded-xl bg-[#F2F7FD] border border-[#DCE5F0] flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-[#172B45] truncate mr-2">{phrase.phrase}</span>
                  <button
                    onClick={() => speechService.speak(phrase.phrase)}
                    className="p-1 rounded-md text-gray-500 hover:text-[#2878E5] hover:bg-white"
                    title="Speak phrase"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submission Package ZIP Download Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#123B70] to-[#2878E5] text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#35C6D4] text-[#123B70] uppercase">
                  Complete Hackathon Package
                </span>
                <span className="text-xs text-white/80">38.6 MB ZIP</span>
              </div>
              <h3 className="font-extrabold text-base">Download Complete Project ZIP</h3>
              <p className="text-xs text-white/80 max-w-md">
                Includes all source code, real trained model weights, Sign Language MNIST datasets, tests, and documentation.
              </p>
            </div>
            <button
              onClick={() => onOpenDownloadModal && onOpenDownloadModal()}
              className="px-5 py-3 rounded-xl bg-white hover:bg-[#F2F7FD] text-[#123B70] font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 shrink-0 group"
            >
              <Download className="w-4 h-4 text-[#2878E5] group-hover:scale-110 transition-transform" />
              <span>Download ZIP Packages</span>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Daily Sign Spotlight & Recent Activity */}
        <div className="space-y-6">
          {/* Daily Sign Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-white via-white to-[#F2F7FD] border border-[#DCE5F0] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2878E5]/10 text-[#2878E5]">
                Sign of the Day
              </span>
              <span className="text-xs font-bold text-gray-400">Letter {dailySign.letter}</span>
            </div>

            <div className="flex items-center space-x-4 my-3">
              <div className="w-16 h-16 rounded-2xl bg-[#123B70] text-white flex items-center justify-center text-3xl font-black shadow-md">
                {dailySign.letter}
              </div>
              <div>
                <h4 className="font-bold text-[#123B70] text-base">{dailySign.handShapeDescription}</h4>
                <span className="inline-block text-[11px] font-semibold text-gray-500">
                  Category: {dailySign.category}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-[#DCE5F0] leading-relaxed">
              💡 <b>Mnemonic Tip:</b> {dailySign.mnemonicTip}
            </p>

            <button
              onClick={() => onSelectTab('learn')}
              className="w-full mt-3 py-2 rounded-xl text-xs font-bold text-[#123B70] bg-[#F2F7FD] hover:bg-[#DCE5F0] transition-colors text-center"
            >
              Learn in Sign Dictionary →
            </button>
          </div>

          {/* Recent History Snippet */}
          <div className="p-5 rounded-2xl bg-white border border-[#DCE5F0] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#123B70] flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>Recent Recognitions</span>
              </h3>
              <button
                onClick={() => onSelectTab('history')}
                className="text-xs font-semibold text-[#2878E5] hover:underline"
              >
                Full Log
              </button>
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">No recent signs yet. Try the live camera!</p>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#F2F7FD] text-xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-6 h-6 rounded-md bg-[#123B70] text-white font-bold flex items-center justify-center text-xs">
                        {item.letter}
                      </span>
                      <span className="capitalize text-gray-600">{item.source}</span>
                    </div>
                    <span className="font-bold text-emerald-700">
                      {(item.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
