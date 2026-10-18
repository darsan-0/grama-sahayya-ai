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
import { InstallAppPopup } from './components/InstallAppPopup';
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
  BookOpen,
  Download
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
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            // Filter out any legacy or excluded schemes
            const valid = parsed.filter(id => VERIFIED_SCHEMES.some(s => s.id === id));
            return valid.length > 0 ? valid : ['talliki-vandanam-ap', 'annadata-sukhibhava-ap', 'dr-ntr-vaidya-seva-ap'];
          }
        } catch {
          // fallback below
        }
      }
      return ['talliki-vandanam-ap', 'annadata-sukhibhava-ap', 'dr-ntr-vaidya-seva-ap'];
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
    <div className="min-h-screen flex flex-col bg-[#F8F7F2] text-[#242824] selection:bg-[#075B46] selection:text-white">
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
            <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-[#E5E5DF] text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] text-[#991B1B] mx-auto flex items-center justify-center font-bold border border-[#FCA5A5]">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold text-[#242824]">
                Unauthorized Administrative Access
              </h2>
              <p className="text-xs text-[#686B66] leading-relaxed">
                This area is restricted to authorized Grama Sahayya administrative staff (Super Admin, Scheme Reviewer, Support Staff, Analytics Viewer). Please sign in with an authorized account.
              </p>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-[#075B46] hover:bg-[#064B3A] text-white font-medium px-5 py-2.5 rounded-xl text-xs shadow-xs cursor-pointer transition-colors"
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

      {/* Floating Install App Prompt (Bottom-Right) */}
      <InstallAppPopup />

      {/* Polished, Minimalist Footer */}
      <footer className="bg-[#053C2E] text-[#D4E2DC] border-t border-[#0E4D3D] mt-20 pt-14 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Column 1: Brand & Mission */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#075B46] text-white font-semibold flex items-center justify-center text-xs border border-[#16604D]">
                  GS
                </div>
                <span className="font-semibold text-base text-white">Grama Sahayya AI</span>
              </div>
              <p className="text-xs text-[#A3BDB3] leading-relaxed">
                {t('footerTagline')}
              </p>
              <div className="text-xs text-[#E6B84A] font-medium flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-4 h-4 text-[#E6B84A] shrink-0" />
                <span>{t('footerZeroMiddleman')}</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-2.5 text-xs">
              <div className="font-semibold text-white tracking-wide uppercase text-[11px] mb-3">
                {t('footerQuickLinksTitle')}
              </div>
              <div>
                <button onClick={() => setCurrentTab('schemes')} className="text-[#A3BDB3] hover:text-white transition-colors cursor-pointer">
                  {t('footerAllSchemes')}
                </button>
              </div>
              <div>
                <button onClick={() => setCurrentTab('services')} className="text-[#A3BDB3] hover:text-white transition-colors cursor-pointer">
                  {t('footerPublicServices')}
                </button>
              </div>
              <div>
                <button onClick={() => handleOpenEligibility()} className="text-[#A3BDB3] hover:text-white transition-colors cursor-pointer">
                  {t('footerEligibilityEngine')}
                </button>
              </div>
              <div>
                <button onClick={() => setCurrentTab('chat')} className="text-[#A3BDB3] hover:text-white transition-colors cursor-pointer">
                  {t('footerAskAi')}
                </button>
              </div>
              <div>
                <button onClick={() => setCurrentTab('tracker')} className="text-[#A3BDB3] hover:text-white transition-colors cursor-pointer">
                  {t('footerApplicationTracker')}
                </button>
              </div>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('gs-open-install-prompt'));
                  }}
                  className="text-[#E6B84A] hover:text-[#f4cb66] transition-colors cursor-pointer flex items-center gap-1.5 font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{currentLanguage === 'te' ? 'యాప్‌ను ఇన్‌స్టాల్ చేయండి' : 'Install as App'}</span>
                </button>
              </div>
            </div>

            {/* Column 3: Helplines */}
            <div className="space-y-2.5 text-xs">
              <div className="font-semibold text-white tracking-wide uppercase text-[11px] mb-3">
                {t('footerHelplinesTitle')}
              </div>
              <div className="flex items-center gap-2 text-[#D4E2DC]">
                <PhoneCall className="w-3.5 h-3.5 text-[#E6B84A] shrink-0" />
                <span>{t('footerSpandana')}: <strong className="text-white">1902</strong></span>
              </div>
              <div className="flex items-center gap-2 text-[#D4E2DC]">
                <PhoneCall className="w-3.5 h-3.5 text-[#E6B84A] shrink-0" />
                <span>{t('footerAadhaar')}: <strong className="text-white">1947</strong></span>
              </div>
              <div className="flex items-center gap-2 text-[#D4E2DC]">
                <PhoneCall className="w-3.5 h-3.5 text-[#E6B84A] shrink-0" />
                <span>{t('footerAarogyasri')}: <strong className="text-white">104</strong></span>
              </div>
              <div className="flex items-center gap-2 text-[#D4E2DC]">
                <PhoneCall className="w-3.5 h-3.5 text-[#E6B84A] shrink-0" />
                <span>{t('footerPmKisan')}: <strong className="text-white">155261</strong></span>
              </div>
              <div className="pt-1">
                <button
                  onClick={() => setCurrentTab('feedback')}
                  className="text-[#E6B84A] hover:underline font-medium cursor-pointer"
                >
                  {t('footerMoreNumbers')}
                </button>
              </div>
            </div>

            {/* Column 4: Integrity & Disclaimers */}
            <div className="space-y-2.5 text-xs">
              <div className="font-semibold text-white tracking-wide uppercase text-[11px] mb-3">
                {t('footerIntegrityTitle')}
              </div>
              <p className="text-[11px] text-[#A3BDB3] leading-relaxed">
                {t('footerDisclaimer')}
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
                <button
                  onClick={() => setCurrentTab('profile')}
                  className="text-[#D4E2DC] hover:text-white underline cursor-pointer"
                >
                  {t('footerPrivacyRights')}
                </button>
                <span className="text-[#0E4D3D]">•</span>
                <button
                  onClick={() => setCurrentTab('feedback')}
                  className="text-[#D4E2DC] hover:text-white underline cursor-pointer"
                >
                  {t('footerReportGrievance')}
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-[#0E4D3D] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A3BDB3] gap-3">
            <div>
              {t('footerCopyrightText')}
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('gs-open-install-prompt'));
                }}
                className="text-[#D4E2DC] hover:text-[#E6B84A] flex items-center gap-1 cursor-pointer transition-colors"
                title="Install Grama Sahayya AI as App"
              >
                <Download className="w-3 h-3 text-[#E6B84A]" />
                <span>{currentLanguage === 'te' ? 'యాప్ ఇన్‌స్టాల్' : 'Install App'}</span>
              </button>
              <span className="text-[#0E4D3D]">•</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E6B84A]" />
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
