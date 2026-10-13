import React, { useState } from 'react';
import {
  Sparkles,
  Languages,
  Accessibility,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Bookmark,
  FileText,
  MessageSquare,
  HelpCircle,
  BarChart3,
  SlidersHorizontal,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useSimpleMode } from '../context/SimpleModeContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAuth,
  onOpenProfile
}) => {
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const {
    currentLanguage,
    setLanguage,
    availableLanguages,
    t,
    voiceNarrationEnabled,
    toggleVoiceNarration,
    isSpeaking
  } = useLanguage();
  const { isSimpleMode, toggleSimpleMode } = useSimpleMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const isTe = currentLanguage === 'te';

  const navLinks = [
    { id: 'landing', label: isTe ? 'హోమ్' : 'Home', icon: null },
    { id: 'schemes', label: t('allSchemes'), icon: Sparkles },
    { id: 'services', label: t('publicServices'), icon: FileText },
    { id: 'chat', label: t('aiAssistant'), icon: MessageSquare },
    { id: 'preparation', label: t('applyGuidance'), icon: ShieldCheck },
    { id: 'dashboard', label: t('myDashboard'), icon: Bookmark, authRequired: true },
  ];

  if (isAdmin) {
    navLinks.push({ id: 'admin', label: isTe ? 'అడ్మిన్ డెస్క్' : 'Admin Desk', icon: BarChart3, authRequired: true });
  }

  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-md border-b border-emerald-800">
      {/* Top micro bar for citizen trust */}
      <div className="bg-emerald-950 px-3 sm:px-4 py-1 text-[11px] sm:text-xs text-emerald-200 flex justify-between items-center border-b border-emerald-800/60 overflow-hidden">
        <div className="flex items-center gap-2 truncate min-w-0">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
          <span className="truncate">
            {isTe
              ? 'గ్రామ సహాయ AI — పౌర సంక్షేమ సేవల వేదిక (ఆంధ్రప్రదేశ్ & కేంద్రం)'
              : 'Grama Sahayya AI — Citizen Public Service Facilitation Portal (Andhra Pradesh & All-India)'}
          </span>
        </div>
        <div className="hidden sm:flex items-center space-x-4 text-emerald-300 shrink-0">
          <span>Helpline: <strong>1902</strong> / <strong>1947</strong></span>
          <span className="text-emerald-500">|</span>
          <span>{isTe ? 'రహస్య సమాచారం సేకరణ లేదు' : 'Zero Sensitive Biometrics Collected'}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <button
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none group cursor-pointer shrink-0 min-w-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 flex items-center justify-center shadow-lg border border-amber-300/40 text-white font-bold text-base sm:text-xl group-hover:scale-105 transition-transform shrink-0">
              GS
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-sm sm:text-xl tracking-tight text-white whitespace-nowrap">Grama Sahayya AI</span>
                <span className="hidden sm:inline-flex bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0">
                  {isTe ? 'గ్రామ సహాయ' : 'Citizen Portal'}
                </span>
              </div>
              <p className="hidden md:block text-xs text-emerald-200 truncate max-w-[200px] sm:max-w-xs">
                {t('tagline')}
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => {
              if (item.authRequired && !currentUser) return null;
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-800 text-amber-400 font-semibold shadow-inner'
                      : 'text-emerald-100 hover:bg-emerald-800/70 hover:text-white'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controls: Language, Simple Mode, Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Simple Mode Toggle */}
            <button
              onClick={toggleSimpleMode}
              title={isSimpleMode ? 'Switch to Standard Mode' : 'Switch to Accessible Simple Mode'}
              className={`h-9 px-2 sm:px-2.5 rounded-lg inline-flex items-center justify-center gap-1.5 text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
                isSimpleMode
                  ? 'bg-amber-500 text-emerald-950 border-amber-300 shadow-md ring-2 ring-amber-300'
                  : 'bg-emerald-800/80 text-emerald-200 border-emerald-700 hover:bg-emerald-800'
              }`}
            >
              <Accessibility className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline whitespace-nowrap">{isSimpleMode ? 'Simple Mode ON' : 'Simple Mode'}</span>
            </button>

            {/* Voice Narration Audio Toggle */}
            <button
              onClick={toggleVoiceNarration}
              title={
                voiceNarrationEnabled
                  ? (isTe ? 'వాయిస్ వివరణ ఆన్ చేయబడింది (ఆపడానికి క్లిక్ చేయండి)' : 'Voice narration is ON (Click to mute)')
                  : (isTe ? 'వాయిస్ వివరణ ఆఫ్ చేయబడింది (వినడానికి క్లిక్ చేయండి)' : 'Voice narration is OFF (Click to enable)')
              }
              className={`h-9 px-2 sm:px-2.5 rounded-lg inline-flex items-center justify-center gap-1.5 text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
                voiceNarrationEnabled
                  ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-sm ring-1 ring-amber-300'
                  : 'bg-emerald-900/70 text-emerald-300 border-emerald-800 hover:bg-emerald-800'
              }`}
              aria-label="Toggle Voice Narration"
            >
              {voiceNarrationEnabled ? (
                <Volume2 className={`w-4 h-4 shrink-0 ${isSpeaking ? 'animate-pulse text-rose-900' : 'text-emerald-950'}`} />
              ) : (
                <VolumeX className="w-4 h-4 shrink-0 text-emerald-400" />
              )}
              <span className="hidden sm:inline whitespace-nowrap">
                {voiceNarrationEnabled
                  ? (isTe ? (isSpeaking ? 'వివరణ...' : 'వాయిస్ ఆన్') : (isSpeaking ? 'Speaking...' : 'Voice ON'))
                  : (isTe ? 'వాయిస్ ఆఫ్' : 'Voice OFF')}
              </span>
            </button>

            {/* Language Dropdown (22 Scheduled Indian Languages) */}
            <div className="relative shrink-0">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="h-9 px-2 sm:px-2.5 rounded-lg bg-emerald-800/90 hover:bg-emerald-800 border border-emerald-700 text-emerald-100 inline-flex items-center justify-center gap-1.5 text-xs font-medium cursor-pointer shrink-0"
                aria-label="Select Language"
              >
                <Languages className="w-4 h-4 shrink-0 text-amber-400" />
                <span className="font-semibold whitespace-nowrap">
                  {availableLanguages.find(l => l.code === currentLanguage)?.nativeName || 'తెలుగు'}
                </span>
              </button>

              {langMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white text-stone-900 rounded-xl shadow-2xl border border-stone-200 py-2 z-50 max-h-96 overflow-y-auto"
                  onClick={() => setLangMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider border-b border-stone-100">
                    22 Scheduled Indian Languages (రాజ్యాంగ గుర్తింపు భాషలు)
                  </div>
                  <div className="divide-y divide-stone-100">
                    {availableLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-emerald-50 cursor-pointer ${
                          currentLanguage === lang.code ? 'bg-emerald-100/70 font-bold text-emerald-900' : 'text-stone-700'
                        }`}
                      >
                        <div>
                          <span className="font-medium">{lang.nativeName}</span>
                          <span className="text-xs text-stone-500 ml-2">({lang.name})</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                          lang.readiness === 'fully_tested'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lang.readiness === 'priority'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {lang.readiness === 'fully_tested' ? 'Fully Tested' : lang.readiness === 'priority' ? 'Priority' : 'Progressive'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Auth / Profile Button */}
            {currentUser ? (
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <button
                  onClick={onOpenProfile}
                  className="h-9 inline-flex items-center justify-center gap-1.5 bg-emerald-800 hover:bg-emerald-700/80 px-2 sm:px-3 rounded-lg border border-emerald-700 text-xs text-white cursor-pointer shrink-0"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-emerald-950 font-bold flex items-center justify-center text-[10px] shrink-0">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'C'}
                  </div>
                  <span className="hidden sm:inline font-medium truncate max-w-[100px]">
                    {currentUser.displayName || 'Citizen'}
                  </span>
                </button>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="h-9 w-9 inline-flex items-center justify-center text-emerald-300 hover:text-rose-400 rounded-lg hover:bg-emerald-800 cursor-pointer shrink-0"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="h-9 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-2.5 sm:px-3.5 rounded-lg text-xs sm:text-sm shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-1 shrink-0 whitespace-nowrap"
              >
                <User className="w-4 h-4 shrink-0" />
                <span>{t('login')}</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 cursor-pointer shrink-0"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 shrink-0" /> : <Menu className="w-5 h-5 shrink-0" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-emerald-950 border-t border-emerald-800 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((item) => {
            if (item.authRequired && !currentUser) return null;
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center space-x-2.5 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-amber-400 font-bold'
                    : 'text-emerald-100 hover:bg-emerald-900'
                }`}
              >
                {Icon && <Icon className="w-5 h-5 text-amber-400" />}
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Mobile Voice Narration Toggle */}
          <button
            onClick={() => {
              toggleVoiceNarration();
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-emerald-200 hover:bg-emerald-900 flex items-center justify-between"
          >
            <div className="flex items-center space-x-2.5">
              {voiceNarrationEnabled ? (
                <Volume2 className="w-5 h-5 text-amber-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-emerald-400" />
              )}
              <span>{isTe ? 'వాయిస్ వివరణ (Voice Narration)' : 'Voice Narration Audio'}</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              voiceNarrationEnabled ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-900 text-emerald-300'
            }`}>
              {voiceNarrationEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          {currentUser && (
            <button
              onClick={() => {
                onOpenProfile();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-emerald-200 hover:bg-emerald-900 flex items-center space-x-2.5"
            >
              <SlidersHorizontal className="w-5 h-5 text-amber-400" />
              <span>User Profile & Citizen Preferences</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
