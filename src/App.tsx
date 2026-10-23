import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { DownloadModal } from './components/DownloadModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { TranslatorPage } from './pages/TranslatorPage';
import { ImageRecognitionPage } from './pages/ImageRecognitionPage';
import { TextCommunicationPage } from './pages/TextCommunicationPage';
import { ConversationPage } from './pages/ConversationPage';
import { LearnPage } from './pages/LearnPage';
import { PracticePage } from './pages/PracticePage';
import { SavedPhrasesPage } from './pages/SavedPhrasesPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';
import { AccountPage } from './pages/AccountPage';
import { HelpPage } from './pages/HelpPage';
import { ResponsibleAIPage } from './pages/ResponsibleAIPage';

// Auth Pages
import { SignInPage } from './pages/auth/SignInPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>(() => {
    const authParams = new URLSearchParams(window.location.hash.slice(1));
    if (authParams.get('type') === 'recovery') return 'reset-password';
    return 'landing';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const authParams = new URLSearchParams(window.location.hash.slice(1));
    if (authParams.get('type') === 'recovery') {
      setCurrentTab('reset-password');
    }
  }, []);

  if (isLoading) return null;

  // Public authentication routes
  const isAuthRoute = ['landing', 'signin', 'signup', 'forgot-password', 'reset-password'].includes(currentTab);

  // Strict email authentication guard: visitors must sign in with email to access workspace
  if (!user && !isAuthRoute) {
    return (
      <SignInPage
        onSuccess={() => setCurrentTab('dashboard')}
        onNavigateToSignUp={() => setCurrentTab('signup')}
        onNavigateToForgotPassword={() => setCurrentTab('forgot-password')}
        onBackToLanding={() => setCurrentTab('landing')}
      />
    );
  }

  // If on landing or auth flows
  if (currentTab === 'landing') {
    return (
      <LandingPage
        onStartCommunicating={() => setCurrentTab(user ? 'translator' : 'signin')}
        onSignIn={() => setCurrentTab('signin')}
        onSignUp={() => setCurrentTab('signup')}
        onLearnMore={() => setCurrentTab(user ? 'learn' : 'signin')}
      />
    );
  }

  if (currentTab === 'signin') {
    return (
      <SignInPage
        onSuccess={() => setCurrentTab('dashboard')}
        onNavigateToSignUp={() => setCurrentTab('signup')}
        onNavigateToForgotPassword={() => setCurrentTab('forgot-password')}
        onBackToLanding={() => setCurrentTab('landing')}
      />
    );
  }

  if (currentTab === 'signup') {
    return (
      <SignUpPage
        onSuccess={() => setCurrentTab('dashboard')}
        onNavigateToSignIn={() => setCurrentTab('signin')}
        onBackToLanding={() => setCurrentTab('landing')}
      />
    );
  }

  if (currentTab === 'forgot-password') {
    return <ForgotPasswordPage onBackToSignIn={() => setCurrentTab('signin')} />;
  }

  if (currentTab === 'reset-password') {
    return <ResetPasswordPage onSuccess={() => setCurrentTab('dashboard')} />;
  }

  // Authenticated workspace shell
  return (
    <div className="min-h-screen bg-[#F2F7FD] flex flex-col">
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {currentTab === 'dashboard' && (
            <DashboardPage 
              onSelectTab={(t) => setCurrentTab(t)} 
              onOpenDownloadModal={() => setIsDownloadModalOpen(true)} 
            />
          )}
          {currentTab === 'translator' && <TranslatorPage onSelectTab={(t) => setCurrentTab(t)} />}
          {currentTab === 'image-recognition' && <ImageRecognitionPage onSelectTab={(t) => setCurrentTab(t)} />}
          {currentTab === 'text-communication' && <TextCommunicationPage />}
          {currentTab === 'conversation' && <ConversationPage />}
          {currentTab === 'learn' && <LearnPage />}
          {currentTab === 'practice' && <PracticePage />}
          {currentTab === 'saved-phrases' && <SavedPhrasesPage />}
          {currentTab === 'history' && <HistoryPage />}
          {currentTab === 'progress' && <ProgressPage />}
          {currentTab === 'settings' && <SettingsPage />}
          {currentTab === 'account' && <AccountPage />}
          {currentTab === 'help' && <HelpPage />}
          {currentTab === 'responsible-ai' && <ResponsibleAIPage />}
        </main>
      </div>

      <Footer 
        onSelectTab={(t) => setCurrentTab(t)} 
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)} 
      />

      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
