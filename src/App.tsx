import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { SimpleModeProvider, useSimpleMode } from './context/SimpleModeContext';
import { Navbar } from './components/Navbar';
import { VoiceBar } from './components/VoiceBar';
import { LandingPage } from './components/LandingPage';
import { SchemeCatalog } from './components/SchemeCatalog';
import { PublicServicesDirectory } from './components/PublicServicesDirectory';
import { AssistantChat } from './components/AssistantChat';
import { ApplicationPreparationWorkflow } from './components/ApplicationPreparationWorkflow';
import { ApplicationTracker } from './components/ApplicationTracker';
import { CitizenDashboard } from './components/CitizenDashboard';
import { FeedbackSupportView } from './components/FeedbackSupportView';
import { ProfileSettingsView } from './components/ProfileSettingsView';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { SchemeDetailModal } from './components/SchemeDetailModal';
import { EligibilityCheckerModal } from './components/EligibilityCheckerModal';
import { Scheme, AssistanceSession } from './types';
import { VERIFIED_SCHEMES } from './data/schemes';
import { getSchemeTitle, getSchemeBenefit } from './i18n/languages';
import {
  ShieldCheck,
  Heart,
  Globe,
  PhoneCall,
  Lock,
  ExternalLink,
  BookOpen
} from 'lucide-react';

function MainAppContent() {
  const { currentUser, userProfile, isAdmin } = useAuth();
  const { currentLanguage, t } = useLanguage();
  const { isSimpleMode } = useSimpleMode();

  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);
  const [eligibilityModalOpen, setEligibilityModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Saved bookmarks
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gs_saved_schemes');
      return stored ? JSON.parse(stored) : ['jagananna-vidya-deevena', 'ysr-rythu-bharosa-pm-kisan'];
    }
    return [];
  });

  const handleToggleSaveScheme = (scheme: Scheme) => {
    setSavedSchemeIds((prev) => {
      const exists = prev.includes(scheme.id);
      const next = exists ? prev.filter((id) => id !== scheme.id) : [...prev, scheme.id];
      if (typeof window !== 'undefined') {
        localStorage.setItem('gs_saved_schemes', JSON.stringify(next));
      }
      return next;
    });
  };

  const handleSelectScheme = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setDetailModalOpen(true);
  };

  const handleOpenEligibility = (scheme?: Scheme) => {
    if (scheme) {
      setSelectedScheme(scheme);
    }
    setEligibilityModalOpen(true);
  };

  const handlePrepareApplication = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setCurrentTab('preparation');
  };

  const handleSearchFromLanding = (query: string) => {
    setSearchFilter(query);
    setCurrentTab('schemes');
  };

  // Prompt onboarding for newly authenticated users who haven't completed profile
  useEffect(() => {
    if (currentUser && userProfile && !userProfile.district) {
      setOnboardingModalOpen(true);
    }
  }, [currentUser, userProfile]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf7] text-stone-900 selection:bg-amber-400 selection:text-emerald-950">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setCurrentTab('profile')}
      />

      {/* Voice-First Accessibility Bar */}
      <VoiceBar
        onTranscriptReceived={(transcript) => {
          setSearchFilter(transcript);
          setCurrentTab('chat');
        }}
        lastSpokenText={
          selectedScheme
            ? `${getSchemeTitle(selectedScheme, currentLanguage)}. ${getSchemeBenefit(selectedScheme, currentLanguage)}`
            : undefined
        }
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onSelectScheme={handleSelectScheme}
            onNavigateTab={setCurrentTab}
            onOpenEligibility={handleOpenEligibility}
            onSearchQuery={handleSearchFromLanding}
          />
        )}

        {currentTab === 'schemes' && (
          <SchemeCatalog
            onSelectScheme={handleSelectScheme}
            onOpenEligibility={handleOpenEligibility}
            initialQuery={searchFilter}
            savedSchemeIds={savedSchemeIds}
            onToggleSaveScheme={handleToggleSaveScheme}
          />
        )}

        {currentTab === 'services' && (
          <PublicServicesDirectory />
        )}

        {currentTab === 'chat' && (
          <AssistantChat
            onSelectScheme={handleSelectScheme}
            onPrepareApplication={handlePrepareApplication}
          />
        )}

        {currentTab === 'preparation' && (
          <ApplicationPreparationWorkflow
            scheme={selectedScheme}
            onNavigateToTracker={() => setCurrentTab('tracker')}
          />
        )}

        {currentTab === 'tracker' && (
          <ApplicationTracker
            onStartNewApplication={() => setCurrentTab('preparation')}
          />
        )}

        {currentTab === 'dashboard' && (
          <CitizenDashboard
            onSelectScheme={handleSelectScheme}
            onOpenProfile={() => setCurrentTab('profile')}
            onNavigateTab={setCurrentTab}
            savedSchemeIds={savedSchemeIds}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileSettingsView onClose={() => setCurrentTab('dashboard')} />
        )}

        {currentTab === 'feedback' && (
          <FeedbackSupportView />
        )}

        {currentTab === 'admin' && (
          isAdmin ? (
            <AdminDashboard />
          ) : (
            <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-stone-200 text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-700 mx-auto flex items-center justify-center font-bold border border-rose-200">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold text-stone-900">
                Unauthorized Administrative Access
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                This area is restricted to authorized Grama Sahayya administrative staff (Super Admin, Scheme Reviewer, Support Staff, Analytics Viewer). Please sign in with an authorized account.
              </p>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
              >
                Sign In with Authorized Admin Account
              </button>
            </div>
          )
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setOnboardingModalOpen(true);
        }}
      />

      <OnboardingModal
        isOpen={onboardingModalOpen}
        onClose={() => setOnboardingModalOpen(false)}
      />

      <SchemeDetailModal
        scheme={selectedScheme}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onCheckEligibility={handleOpenEligibility}
        onPrepareApplication={handlePrepareApplication}
        isSaved={selectedScheme ? savedSchemeIds.includes(selectedScheme.id) : false}
        onToggleSave={handleToggleSaveScheme}
      />

      <EligibilityCheckerModal
        scheme={selectedScheme}
        isOpen={eligibilityModalOpen}
        onClose={() => setEligibilityModalOpen(false)}
        onPrepareApplication={handlePrepareApplication}
      />

      {/* Citizen Trust & Transparent Multilingual Dynamic Footer */}
      <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900 mt-16 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand & Mission */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-emerald-950 font-bold flex items-center justify-center text-sm shadow-md">
                  GS
                </div>
                <span className="font-bold text-lg text-white">Grama Sahayya AI</span>
              </div>
              <p className="text-xs text-emerald-300 leading-relaxed">
                {t('footerTagline')}
              </p>
              <div className="text-[11px] text-amber-300 font-semibold flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('footerZeroMiddleman')}</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-white uppercase tracking-wider mb-2">
                {t('footerQuickLinksTitle')}
              </div>
              <div>
                <button onClick={() => setCurrentTab('schemes')} className="hover:text-amber-300 cursor-pointer">
                  {t('footerAllSchemes')}
                </button>
              </div>
              <div>
                <button onClick={() => setCurrentTab('services')} className="hover:text-amber-300 cursor-pointer">
                  {t('footerPublicServices')}
                </button>
              </div>
              <div>
                <button onClick={() => handleOpenEligibility()} className="hover:text-amber-300 cursor-pointer">
                  {t('footerEligibilityEngine')}
                </button>
              </div>
              <div>
                <button onClick={() => setCurrentTab('chat')} className="hover:text-amber-300 cursor-pointer">
                  {t('footerAskAi')}
                </button>
              </div>
              <div>
                <button onClick={() => setCurrentTab('tracker')} className="hover:text-amber-300 cursor-pointer">
                  {t('footerApplicationTracker')}
                </button>
              </div>
            </div>

            {/* Column 3: Helplines */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-white uppercase tracking-wider mb-2">
                {t('footerHelplinesTitle')}
              </div>
              <div className="flex items-center space-x-2 text-emerald-200">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{t('footerSpandana')}: <strong>1902</strong></span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-200">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{t('footerAadhaar')}: <strong>1947</strong></span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-200">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{t('footerAarogyasri')}: <strong>104</strong></span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-200">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{t('footerPmKisan')}: <strong>155261</strong></span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentTab('feedback')}
                  className="text-amber-300 hover:underline font-semibold cursor-pointer"
                >
                  {t('footerMoreNumbers')}
                </button>
              </div>
            </div>

            {/* Column 4: Integrity & Disclaimers */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-white uppercase tracking-wider mb-2">
                {t('footerIntegrityTitle')}
              </div>
              <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                {t('footerDisclaimer')}
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
                <button
                  onClick={() => setCurrentTab('profile')}
                  className="text-emerald-300 hover:text-white underline cursor-pointer"
                >
                  {t('footerPrivacyRights')}
                </button>
                <span>•</span>
                <button
                  onClick={() => setCurrentTab('feedback')}
                  className="text-emerald-300 hover:text-white underline cursor-pointer"
                >
                  {t('footerReportGrievance')}
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-emerald-900/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-400/80 gap-3">
            <div>
              {t('footerCopyrightText')}
            </div>
            <div className="flex items-center space-x-3 text-[11px]">
              <span>{t('footerTestedBadge')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SimpleModeProvider>
          <MainAppContent />
        </SimpleModeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
