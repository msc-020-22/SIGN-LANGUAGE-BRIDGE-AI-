import React from 'react';
import { Camera, ArrowRight, ShieldCheck, MessageSquare, BookOpen, Sparkles, HeartHandshake } from 'lucide-react';
import heroImg from '../assets/images/hero.jpg';

interface LandingPageProps {
  onStartCommunicating: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
  onLearnMore: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartCommunicating,
  onSignIn,
  onSignUp,
  onLearnMore,
}) => {
  return (
    <div className="min-h-screen bg-[#F2F7FD] flex flex-col justify-between">
      {/* Top Banner Navigation */}
      <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#123B70] via-[#2878E5] to-[#35C6D4] flex items-center justify-center text-white shadow-md shadow-[#2878E5]/20">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74a4.5 4.5 0 0 0-9 0c0 1.56.79 2.93 2 3.74zM18 10h-1.26A6.47 6.47 0 0 1 18 13.5V17a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4v-3.5c0-1.28.37-2.48 1.01-3.5H6a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6h4a6 6 0 0 0 6-6v-5a2 2 0 0 0-2-2z" />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-xl text-[#123B70] tracking-tight">Sign Language Bridge AI</span>
            <span className="block text-[11px] text-[#2878E5] font-semibold tracking-wider uppercase">
              Assistive Communication
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onSignIn}
            className="px-4 py-2 text-sm font-semibold text-[#123B70] hover:text-[#2878E5] transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onSignUp}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#2878E5] hover:bg-[#123B70] rounded-xl shadow-xs transition-all"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        {/* Left Column: Mission & Call-to-action */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-[#DCE5F0] text-xs font-semibold text-[#123B70] shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#35C6D4]" />
            <span>AI for Accessibility & Inclusion</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#123B70] tracking-tight leading-[1.1]">
            Every sign deserves to be understood.
          </h1>

          <p className="text-base sm:text-lg text-[#172B45]/80 leading-relaxed max-w-xl">
            A real-time assistive communication tool that bridges Deaf and hearing communities.
            Translate sign language via webcam or image upload, engage in natural two-way dual dialogue,
            and master verified signs with interactive feedback.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
            <button
              onClick={onStartCommunicating}
              className="px-6 py-3.5 rounded-xl bg-[#123B70] hover:bg-[#2878E5] text-white font-bold text-base shadow-lg shadow-[#123B70]/20 flex items-center justify-center space-x-2.5 transition-all group"
            >
              <span>Start Communicating</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onLearnMore}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-[#F2F7FD] border border-[#DCE5F0] text-[#123B70] font-bold text-base shadow-2xs transition-colors flex items-center justify-center space-x-2"
            >
              <BookOpen className="w-5 h-5 text-[#2878E5]" />
              <span>Explore Dictionary</span>
            </button>
          </div>

          {/* Core Feature Pillars */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#DCE5F0]">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#2878E5]/10 flex items-center justify-center text-[#2878E5] mb-2">
                <Camera className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-[#123B70]">Live Webcam</h2>
              <p className="text-[11px] text-gray-500">Real-time neural recognition</p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#35C6D4]/15 flex items-center justify-center text-[#123B70] mb-2">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-[#123B70]">Dual Dialogue</h2>
              <p className="text-[11px] text-gray-500">Two-way sign & speech</p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-[#123B70]">Responsible AI</h2>
              <p className="text-[11px] text-gray-500">Private, client-side vision</p>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Asset */}
        <div className="lg:col-span-6">
          <div className="relative rounded-3xl overflow-hidden border-2 border-white shadow-2xl bg-white p-2">
            <div className="relative rounded-2xl overflow-hidden aspect-16/10">
              <img
                src={heroImg}
                alt="Young person smiling warmly while signing American Sign Language with computer vision guidance"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#123B70]/60 via-transparent to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#35C6D4] text-[#123B70]">
                    24 Static Alphabet Signs
                  </span>
                  <p className="text-sm font-semibold drop-shadow-sm">
                    Accurate gesture classification with confidence and uncertainty scores
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Compact Landing Footer */}
      <footer className="border-t border-[#DCE5F0] py-6 px-4 sm:px-6 lg:px-8 bg-white/70 backdrop-blur-xs text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© 2026 Sign Language Bridge AI. Dedicated to human communication equity.</p>
          <div className="flex items-center space-x-4">
            <button onClick={onSignIn} className="hover:text-[#2878E5] transition-colors">Sign In</button>
            <span>•</span>
            <button onClick={onSignUp} className="hover:text-[#2878E5] transition-colors">Get Started</button>
            <span>•</span>
            <button onClick={onLearnMore} className="hover:text-[#2878E5] transition-colors">Alphabet Guide</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
