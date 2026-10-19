import React from 'react';

interface FooterProps {
  onSelectTab?: (tab: string) => void;
  onOpenDownloadModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenDownloadModal }) => {
  return (
    <footer className="bg-white border-t border-[#DCE5F0] py-6 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-md bg-[#123B70] text-white flex items-center justify-center font-bold text-[10px]">
            S
          </div>
          <span className="font-semibold text-[#172B45]">Sign Language Bridge AI (SLB AI)</span>
          <span>•</span>
          <span>NYLP × AI Hackathon 2026</span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => onSelectTab && onSelectTab('responsible-ai')}
            className="hover:text-[#2878E5] transition-colors"
          >
            Model Card
          </button>
          <span>•</span>
          <button
            onClick={() => onSelectTab && onSelectTab('help')}
            className="hover:text-[#2878E5] transition-colors"
          >
            Help & Guidelines
          </button>
          <span>•</span>
          <button
            onClick={() => onSelectTab && onSelectTab('settings')}
            className="hover:text-[#2878E5] transition-colors"
          >
            Privacy & Settings
          </button>
          <span>•</span>
          <button
            onClick={() => onOpenDownloadModal && onOpenDownloadModal()}
            className="font-bold text-[#2878E5] hover:text-[#123B70] transition-colors"
          >
            Download Project ZIP
          </button>
        </div>
      </div>
    </footer>
  );
};
