import React from 'react';
import {
  LayoutDashboard,
  Camera,
  Image as ImageIcon,
  MessageSquare,
  Users,
  BookOpen,
  Award,
  Bookmark,
  History,
  TrendingUp,
  Settings,
  User,
  HelpCircle,
  ShieldCheck,
  X,
  Sparkles,
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenDownloadModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  onOpenDownloadModal,
}) => {
  const { profile } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'translator', label: 'Live Camera Recognition', icon: Camera, badge: 'Realtime' },
    { id: 'image-recognition', label: 'Image Sign Recognition', icon: ImageIcon },
    { id: 'text-communication', label: 'Text Communication', icon: MessageSquare },
    { id: 'conversation', label: 'Dual Conversation Mode', icon: Users, badge: 'Duo' },
    { id: 'learn', label: 'Sign Dictionary (24 Signs)', icon: BookOpen },
    { id: 'practice', label: 'Practice & Quizzes', icon: Award },
    { id: 'saved-phrases', label: 'Saved Phrases', icon: Bookmark },
    { id: 'history', label: 'Recognition History', icon: History },
    { id: 'progress', label: 'My Progress & Metrics', icon: TrendingUp },
    { id: 'settings', label: 'Settings & Model Config', icon: Settings },
    { id: 'account', label: 'My Account', icon: User },
    { id: 'help', label: 'Help & Lighting Guide', icon: HelpCircle },
    { id: 'responsible-ai', label: 'Model Card & MSL Scope', icon: ShieldCheck },
  ];

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-[#DCE5F0] w-64 select-none">
      {/* Workspace Header */}
      <div className="p-4 border-b border-[#DCE5F0] flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#123B70] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            SLB
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#123B70] uppercase tracking-wider">Communication Space</h2>
            <p className="text-[11px] text-gray-500 truncate max-w-[140px]">{profile.displayName || 'Communicator'}</p>
          </div>
        </div>
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-[#F2F7FD]"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#123B70] text-white shadow-sm shadow-[#123B70]/20 font-semibold'
                  : 'text-[#172B45] hover:bg-[#F2F7FD] hover:text-[#2878E5]'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#35C6D4]' : 'text-gray-500'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#2878E5]/10 text-[#2878E5]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info Card */}
      <div className="p-3 m-3 rounded-xl bg-gradient-to-br from-[#F2F7FD] to-[#e4eefb] border border-[#DCE5F0] space-y-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#2878E5]" />
          <span className="text-xs font-bold text-[#123B70]">AI Recognition Engine</span>
        </div>
        <p className="text-[11px] text-gray-600 leading-relaxed">
          Trained on 24 ASL static alphabet classes with real-time uncertainty scoring.
        </p>
        <button
          onClick={() => onOpenDownloadModal && onOpenDownloadModal()}
          className="w-full py-2 rounded-lg bg-[#123B70] hover:bg-[#2878E5] text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Project ZIP</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-50 w-64 max-w-[80vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
