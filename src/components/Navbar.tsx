import React, { useState } from 'react';
import { 
  Menu, X, Volume2, User, LogOut, Shield, 
  HelpCircle, Sparkles, Database, Sliders, ChevronDown, Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenMobileMenu: () => void;
  onOpenDownloadModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentTab, 
  onSelectTab, 
  onOpenMobileMenu,
  onOpenDownloadModal,
}) => {
  const { user, profile, isSupabaseConnected, signOut } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#DCE5F0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 rounded-lg text-[#123B70] hover:bg-[#F2F7FD] md:hidden focus:outline-hidden focus:ring-2 focus:ring-[#2878E5]"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <button
            onClick={() => onSelectTab('landing')}
            className="flex items-center space-x-3 text-left focus:outline-hidden group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#123B70] via-[#2878E5] to-[#35C6D4] flex items-center justify-center text-white shadow-md shadow-[#2878E5]/20 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74a4.5 4.5 0 0 0-9 0c0 1.56.79 2.93 2 3.74zM18 10h-1.26A6.47 6.47 0 0 1 18 13.5V17a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4v-3.5c0-1.28.37-2.48 1.01-3.5H6a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6h4a6 6 0 0 0 6-6v-5a2 2 0 0 0-2-2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg tracking-tight text-[#123B70]">SLB AI</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[#35C6D4]/15 text-[#123B70]">
                  Neural Vision
                </span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block">Sign Language Bridge</p>
            </div>
          </button>
        </div>

        {/* Center: Top Quick Nav (Desktop) */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => onSelectTab('translator')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'translator'
                ? 'bg-[#123B70] text-white shadow-xs'
                : 'text-[#172B45] hover:bg-[#F2F7FD]'
            }`}
          >
            Live Camera
          </button>
          <button
            onClick={() => onSelectTab('image-recognition')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'image-recognition'
                ? 'bg-[#123B70] text-white shadow-xs'
                : 'text-[#172B45] hover:bg-[#F2F7FD]'
            }`}
          >
            Image Upload
          </button>
          <button
            onClick={() => onSelectTab('conversation')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'conversation'
                ? 'bg-[#123B70] text-white shadow-xs'
                : 'text-[#172B45] hover:bg-[#F2F7FD]'
            }`}
          >
            Dual Conversation
          </button>
          <button
            onClick={() => onSelectTab('learn')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'learn'
                ? 'bg-[#123B70] text-white shadow-xs'
                : 'text-[#172B45] hover:bg-[#F2F7FD]'
            }`}
          >
            Sign Dictionary
          </button>
          <button
            onClick={() => onSelectTab('practice')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTab === 'practice'
                ? 'bg-[#123B70] text-white shadow-xs'
                : 'text-[#172B45] hover:bg-[#F2F7FD]'
            }`}
          >
            Practice & Quiz
          </button>
        </nav>

        {/* Right: Mode & User Profile */}
        <div className="flex items-center space-x-3">
          {/* Download Full Submission Package Button */}
          <button
            onClick={() => onOpenDownloadModal && onOpenDownloadModal()}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#2878E5]/10 hover:bg-[#2878E5] text-[#2878E5] hover:text-white border border-[#2878E5]/30 text-xs font-bold transition-all shadow-xs"
            title="Download full project submission ZIP with trained models, datasets, code, and documentation"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ZIP</span>
          </button>

          {/* Connection status indicator */}
          <div 
            title={isSupabaseConnected ? "Connected to Supabase cloud database" : "Email/password authentication is not configured"}
            className="hidden lg:flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border border-[#DCE5F0] bg-[#F2F7FD] text-gray-600"
          >
            <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-500' : 'bg-[#35C6D4]'}`}></span>
            <span>{isSupabaseConnected ? 'Supabase Sync' : 'Auth Not Configured'}</span>
          </div>

          {/* Sign In CTA if guest */}
          {!user && (
            <button
              onClick={() => onSelectTab('signin')}
              className="px-3 py-1.5 rounded-xl bg-[#123B70] hover:bg-[#2878E5] text-white text-xs font-bold transition-all shadow-xs"
            >
              Sign In
            </button>
          )}

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2 p-1.5 rounded-xl border border-[#DCE5F0] hover:bg-[#F2F7FD] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#2878E5]"
              aria-label="User account menu"
            >
              <div className="w-8 h-8 rounded-lg bg-[#2878E5] text-white font-bold flex items-center justify-center text-sm">
                {profile.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-semibold text-[#172B45] hidden sm:block max-w-[120px] truncate">
                {user ? (profile.displayName || 'Communicator') : 'Guest User'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
            </button>

            {profileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-[#DCE5F0] shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-[#DCE5F0]">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-semibold text-[#123B70] truncate">{profile.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#2878E5]/10 text-[#2878E5]">
                      {profile.preferredSignLanguage} Mode
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onSelectTab('dashboard');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#172B45] hover:bg-[#F2F7FD] flex items-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#2878E5]" />
                    <span>Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('account');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#172B45] hover:bg-[#F2F7FD] flex items-center space-x-2"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    <span>My Account</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('settings');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#172B45] hover:bg-[#F2F7FD] flex items-center space-x-2"
                  >
                    <Sliders className="w-4 h-4 text-gray-500" />
                    <span>Settings & Vision</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('responsible-ai');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#172B45] hover:bg-[#F2F7FD] flex items-center space-x-2"
                  >
                    <Shield className="w-4 h-4 text-[#35C6D4]" />
                    <span>Model Card & Ethics</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('help');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#172B45] hover:bg-[#F2F7FD] flex items-center space-x-2"
                  >
                    <HelpCircle className="w-4 h-4 text-gray-500" />
                    <span>Help & Lighting Tips</span>
                  </button>

                  <div className="border-t border-[#DCE5F0] mt-1 pt-1">
                    {user ? (
                      <button
                        onClick={async () => {
                          setProfileDropdownOpen(false);
                          await signOut();
                          onSelectTab('landing');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onSelectTab('signin');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#2878E5] font-bold hover:bg-[#F2F7FD] flex items-center space-x-2"
                      >
                        <User className="w-4 h-4" />
                        <span>Sign In / Create Account</span>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
