import React, { useState } from 'react';
import { 
  User, Mail, Shield, Award, Calendar, 
  Download, LogOut, Check, Sparkles, Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';

export const AccountPage: React.FC = () => {
  const { profile, updateProfile, signOut, isSupabaseConnected } = useAuth();
  const [displayName, setDisplayName] = useState(profile.displayName || '');
  const [role, setRole] = useState(profile.role || 'learner');
  const [preferredSignLanguage, setPreferredSignLanguage] = useState(profile.preferredSignLanguage || 'ASL');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName,
      role: role as any,
      preferredSignLanguage: preferredSignLanguage as any,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportData = () => {
    const fullData = {
      profile,
      history: storageService.getHistory(),
      savedPhrases: storageService.getSavedPhrases(),
      settings: storageService.getSettings(),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `slb_ai_user_data_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#DCE5F0]">
        <div>
          <h1 className="text-2xl font-black text-[#123B70] tracking-tight">My Account & Preferences</h1>
          <p className="text-xs text-gray-500">
            Manage your personal communicator profile, sign language focus, and personal data exports.
          </p>
        </div>
      </div>

      {/* Main Profile Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DCE5F0] shadow-xs space-y-6">
        {/* Profile Card Header */}
        <div className="flex items-center space-x-4 border-b border-[#DCE5F0] pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#123B70] via-[#2878E5] to-[#35C6D4] text-white text-2xl font-black flex items-center justify-center shadow-md">
            {profile.displayName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#123B70]">{profile.displayName || 'Communicator'}</h3>
            <p className="text-xs text-gray-500">{profile.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2878E5]/10 text-[#2878E5] capitalize">
                {profile.role.replace('_', ' ')}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#35C6D4]/15 text-[#123B70]">
                {profile.preferredSignLanguage} Focused
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#DCE5F0] text-xs font-medium text-[#172B45] focus:ring-2 focus:ring-[#2878E5] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Community Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#DCE5F0] text-xs font-medium text-[#172B45] focus:outline-hidden"
              >
                <option value="deaf_hard_of_hearing">Deaf / Hard of Hearing</option>
                <option value="learner">Sign Language Learner</option>
                <option value="interpreter">Sign Language Interpreter</option>
                <option value="educator">Educator / Teacher</option>
                <option value="ally">Hearing Family Member / Ally</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Primary Sign Language Focus</label>
              <select
                value={preferredSignLanguage}
                onChange={(e) => setPreferredSignLanguage(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#DCE5F0] text-xs font-medium text-[#172B45] focus:outline-hidden"
              >
                <option value="ASL">American Sign Language (ASL - Active Model)</option>
                <option value="MSL">Malawian Sign Language (MSL - Community Roadmap)</option>
                <option value="BSL">British Sign Language (BSL - Planned Expansion)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#123B70] hover:bg-[#2878E5] text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : null}
              <span>{savedSuccess ? 'Profile Updated!' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Data Export & Account Safety */}
      <div className="p-6 rounded-3xl bg-white border border-[#DCE5F0] shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#123B70]">Data Sovereignty & Portability</h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          You have full ownership of your recognition records, custom saved phrases, and quiz scores.
          Download a complete backup in open JSON format anytime.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="px-4 py-2 rounded-xl border border-[#DCE5F0] hover:bg-[#F2F7FD] text-xs font-semibold text-[#172B45] flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-[#2878E5]" />
            <span>Download Complete Data Archive (JSON)</span>
          </button>

          <button
            onClick={signOut}
            className="px-4 py-2 rounded-xl border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center space-x-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
