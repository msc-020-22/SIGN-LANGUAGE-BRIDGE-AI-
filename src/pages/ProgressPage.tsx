import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Award, CheckCircle2, Clock, Sparkles, 
  BarChart3, Target, Calendar, ShieldCheck, Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { ASL_ALPHABET_DATA } from '../data/aslAlphabet';
import { RecognitionHistoryItem } from '../types';

export const ProgressPage: React.FC = () => {
  const { profile } = useAuth();
  const [history, setHistory] = useState<RecognitionHistoryItem[]>([]);

  useEffect(() => {
    setHistory(storageService.getHistory());
  }, []);

  // Compute stats
  const totalLogs = history.length;
  const confirmedLogs = history.filter((h) => h.confirmedByUser).length;
  const avgConfidence = totalLogs > 0
    ? (history.reduce((acc, h) => acc + h.confidence, 0) / totalLogs) * 100
    : 84.5;

  const webcamCount = history.filter((h) => h.source === 'webcam').length;
  const uploadCount = history.filter((h) => h.source === 'image_upload').length;

  // Mastered signs set (for visual progress)
  const masteredLetters = new Set(['A', 'B', 'C', 'D', 'E', 'F', 'I', 'L', 'O', 'S', 'U', 'V', 'W', 'Y']);

  const badges = [
    { title: 'First Sign Translated', desc: 'Translated your first ASL letter via camera', unlocked: true, icon: '🌟' },
    { title: 'Alphabet Explorer', desc: 'Practiced 15+ distinct alphabet letters', unlocked: profile.signsMastered >= 15, icon: '🗺️' },
    { title: 'Century Milestone', desc: 'Completed 100 real-time sign recognitions', unlocked: profile.totalRecognitions >= 100, icon: '💯' },
    { title: 'Quiz Streak Champion', desc: 'Achieved a 4-day practice streak', unlocked: profile.quizStreak >= 4, icon: '🔥' },
    { title: 'Fist Master', desc: 'Mastered all fist-category signs (A, E, M, N, S, T)', unlocked: true, icon: '✊' },
    { title: 'Community Advocate', desc: 'Created personalized saved communicator phrases', unlocked: true, icon: '🤝' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#DCE5F0]">
        <div>
          <h1 className="text-2xl font-black text-[#123B70] tracking-tight">My Progress & Analytics</h1>
          <p className="text-xs text-gray-500">
            Track your sign language fluency, translation accuracy trends, and mastery across all 24 alphabet signs.
          </p>
        </div>
      </div>

      {/* 4 High-Level Progress Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#DCE5F0] shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">Alphabet Mastery</span>
            <Target className="w-4 h-4 text-[#2878E5]" />
          </div>
          <div className="text-2xl font-black text-[#123B70]">
            {masteredLetters.size} <span className="text-xs font-medium text-gray-400">/ 24</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#2878E5] to-[#35C6D4] h-full rounded-full"
              style={{ width: `${(masteredLetters.size / 24) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#DCE5F0] shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">Average Confidence</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {avgConfidence.toFixed(1)}%
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Consistent high certainty</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#DCE5F0] shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">Practice Streak</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-[#123B70]">
            {profile.quizStreak} <span className="text-xs font-medium text-gray-400">Days</span>
          </div>
          <p className="text-[11px] text-emerald-600 mt-2 font-medium">Active streak ongoing</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#DCE5F0] shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">Total Interventions</span>
            <Sparkles className="w-4 h-4 text-[#35C6D4]" />
          </div>
          <div className="text-2xl font-black text-[#123B70]">
            {profile.totalRecognitions}
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Logged translations</p>
        </div>
      </div>

      {/* 24 Letters Mastery Grid */}
      <div className="p-6 rounded-3xl bg-white border border-[#DCE5F0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#123B70]">ASL Static Alphabet Mastery Matrix</h3>
            <p className="text-xs text-gray-500">Green indicates verified mastered signs; blue indicates in progress.</p>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-gray-600">Mastered ({masteredLetters.size})</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2878E5]"></span>
              <span className="text-gray-600">In Progress ({24 - masteredLetters.size})</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
          {ASL_ALPHABET_DATA.map((sign) => {
            const isMastered = masteredLetters.has(sign.letter);
            return (
              <div
                key={sign.letter}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isMastered
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-[#F2F7FD] border-[#DCE5F0] text-gray-700'
                }`}
              >
                <span className="text-xl font-black block">{sign.letter}</span>
                <span className="text-[9px] font-bold block uppercase mt-0.5 opacity-80">
                  {isMastered ? '✓ Master' : 'Practice'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="p-6 rounded-3xl bg-white border border-[#DCE5F0] shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#123B70] flex items-center space-x-2">
          <Award className="w-4 h-4 text-[#2878E5]" />
          <span>Milestones & Community Badges</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex items-start space-x-3 transition-all ${
                badge.unlocked
                  ? 'bg-white border-[#DCE5F0] shadow-2xs'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="text-2xl shrink-0 p-2 rounded-xl bg-[#F2F7FD]">
                {badge.icon}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-[#123B70]">{badge.title}</span>
                  {badge.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
