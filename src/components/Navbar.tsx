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
  VolumeX,
  ChevronDown,
  Check
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

  const currentLangObj = availableLanguages.find(l => l.code === currentLanguage);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E5DF] transition-colors">
      {/* Top quiet citizen assurance ribbon */}
      <div className="bg-[#F8F7F2] border-b border-[#E5E5DF] px-4 py-1 text-[11px] sm:text-xs text-[#686B66]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-[#075B46] shrink-0" />
            <span className="truncate">
              {isTe
                ? 'గ్రామ సహాయ AI — పౌర సంక్షేమ సేవల వేదిక (ఆంధ్రప్రదేశ్ & కేంద్రం)'
                : 'Grama Sahayya AI — Citizen Public Service Facilitation Portal (Andhra Pradesh & All-India)'}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 shrink-0 text-[11px]">
            <span>Helpline: <strong className="text-[#242824] font-semibold">1902</strong> / <strong className="text-[#242824] font-semibold">1947</strong></span>
            <span className="text-[#E5E5DF]">•</span>
            <span>{isTe ? 'రహస్య సమాచారం సేకరణ లేదు' : 'Zero Sensitive Biometrics Collected'}</span>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[68px]">
          {/* GS Brand Logo & Title */}
          <button
            onClick={() => {
              setCurrentTab('landing');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer shrink-0"
            aria-label="Grama Sahayya AI Home"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#075B46] flex items-center justify-center text-white font-semibold text-sm sm:text-base tracking-tight shadow-xs transition-transform group-hover:scale-102">
              GS
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-base sm:text-lg tracking-tight text-[#242824]">
                  Grama Sahayya AI
                </span>
                <span className="hidden md:inline-flex text-[10px] uppercase font-semibold tracking-wider text-[#075B46] bg-[#EBF3F0] px-2 py-0.5 rounded-md">
                  {isTe ? 'గ్రామ సహాయ' : 'Portal'}
                </span>
              </div>
              <p className="hidden lg:block text-[11px] text-[#686B66] -mt-0.5 truncate max-w-xs">
                {t('tagline')}
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((item) => {
              if (item.authRequired && !currentUser) return null;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs tracking-normal transition-all cursor-pointer font-medium ${
                    isActive
                      ? 'bg-[#EBF3F0] text-[#075B46] font-semibold'
                      : 'text-[#686B66] hover:text-[#242824] hover:bg-[#F8F7F2]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop & Tablet Action Controls */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {/* Simple Mode Toggle */}
            <button
              onClick={toggleSimpleMode}
              title={isSimpleMode ? 'Switch to Standard Mode' : 'Switch to Accessible Simple Mode'}
              className={`h-8.5 px-2.5 rounded-lg inline-flex items-center justify-center gap-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                isSimpleMode
                  ? 'bg-[#FAF4E6] text-[#242824] border-[#E6B84A] font-semibold'
                  : 'bg-white text-[#686B66] border-[#E5E5DF] hover:text-[#242824] hover:bg-[#F8F7F2]'
              }`}
            >
              <Accessibility className="w-3.5 h-3.5 shrink-0 text-[#075B46]" />
              <span className="hidden xl:inline">{isSimpleMode ? 'Simple ON' : 'Simple Mode'}</span>
            </button>

            {/* Voice Narration Audio Toggle */}
            <button
              onClick={toggleVoiceNarration}
              title={
                voiceNarrationEnabled
                  ? (isTe ? 'వాయిస్ వివరణ ఆన్ చేయబడింది (ఆపడానికి క్లిక్ చేయండి)' : 'Voice narration is ON (Click to mute)')
                  : (isTe ? 'వాయిస్ వివరణ ఆఫ్ చేయబడింది (వినడానికి క్లిక్ చేయండి)' : 'Voice narration is OFF (Click to enable)')
              }
              className={`h-8.5 px-2.5 rounded-lg inline-flex items-center justify-center gap-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                voiceNarrationEnabled
                  ? 'bg-[#EBF3F0] text-[#075B46] border-[#C8DDD6] font-semibold'
                  : 'bg-white text-[#686B66] border-[#E5E5DF] hover:text-[#242824] hover:bg-[#F8F7F2]'
              }`}
              aria-label="Toggle Voice Narration"
            >
              {voiceNarrationEnabled ? (
                <Volume2 className={`w-3.5 h-3.5 shrink-0 ${isSpeaking ? 'text-[#075B46] animate-pulse' : 'text-[#075B46]'}`} />
              ) : (
                <VolumeX className="w-3.5 h-3.5 shrink-0 text-[#8E918C]" />
              )}
              <span className="hidden xl:inline">
                {voiceNarrationEnabled
                  ? (isTe ? (isSpeaking ? 'వివరణ...' : 'వాయిస్ ఆన్') : (isSpeaking ? 'Speaking...' : 'Voice ON'))
                  : (isTe ? 'వాయిస్ ఆఫ్' : 'Voice')}
              </span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="h-8.5 px-2.5 rounded-lg bg-white hover:bg-[#F8F7F2] border border-[#E5E5DF] text-[#242824] inline-flex items-center justify-center gap-1.5 text-xs font-medium cursor-pointer transition-colors"
                aria-label="Select Language"
              >
                <Languages className="w-3.5 h-3.5 text-[#075B46] shrink-0" />
                <span className="font-semibold">{currentLangObj?.nativeName || 'తెలుగు'}</span>
                <ChevronDown className="w-3 h-3 text-[#8E918C] shrink-0" />
              </button>

              {langMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white text-[#242824] rounded-xl shadow-xl border border-[#E5E5DF] py-2 z-50 max-h-96 overflow-y-auto"
                  onClick={() => setLangMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-[#686B66] uppercase tracking-wider border-b border-[#E5E5DF]">
                    22 Scheduled Languages (రాజ్యాంగ గుర్తింపు భాషలు)
                  </div>
                  <div className="divide-y divide-[#F8F7F2]">
                    {availableLanguages.map((lang) => {
                      const isSelected = currentLanguage === lang.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => setLanguage(lang.code)}
                          className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-[#F8F7F2] cursor-pointer transition-colors ${
                            isSelected ? 'bg-[#EBF3F0] text-[#075B46] font-semibold' : 'text-[#242824]'
                          }`}
                        >
                          <div>
                            <span className="font-medium">{lang.nativeName}</span>
                            <span className="text-[11px] text-[#686B66] ml-2">({lang.name})</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#075B46]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Auth / Profile Button */}
            {currentUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenProfile}
                  className="h-8.5 inline-flex items-center justify-center gap-2 bg-[#F8F7F2] hover:bg-[#ECEBE5] px-2.5 rounded-lg border border-[#E5E5DF] text-xs text-[#242824] cursor-pointer transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-[#075B46] text-white font-semibold flex items-center justify-center text-[10px]">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'C'}
                  </div>
                  <span className="font-medium max-w-[90px] truncate">
                    {currentUser.displayName || 'Citizen'}
                  </span>
                </button>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="h-8.5 w-8.5 inline-flex items-center justify-center text-[#686B66] hover:text-[#242824] hover:bg-[#F8F7F2] rounded-lg border border-[#E5E5DF] cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="h-8.5 bg-[#075B46] hover:bg-[#064B3A] text-white font-medium px-3.5 rounded-lg text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t('login')}</span>
              </button>
            )}
          </div>

          {/* Mobile Right: Hamburger button only (comfortable touch target) */}
          <div className="flex sm:hidden items-center gap-2">
            {!currentUser && (
              <button
                onClick={onOpenAuth}
                className="h-8 bg-[#075B46] text-white text-xs font-medium px-2.5 rounded-lg cursor-pointer inline-flex items-center gap-1"
              >
                <User className="w-3 h-3" />
                <span>{t('login')}</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 inline-flex items-center justify-center rounded-lg text-[#242824] hover:bg-[#F8F7F2] border border-[#E5E5DF] cursor-pointer transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Accessible Mobile Menu Sheet */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E5E5DF] px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {/* Main Navigation Links */}
          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-[#686B66] uppercase tracking-wider px-2 pb-1">
              {isTe ? 'మెనూ లింకులు' : 'Navigation'}
            </div>
            {navLinks.map((item) => {
              if (item.authRequired && !currentUser) return null;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-[#EBF3F0] text-[#075B46] font-semibold'
                      : 'text-[#242824] hover:bg-[#F8F7F2]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#075B46]" />}
                </button>
              );
            })}
          </div>

          {/* Quick Settings & Controls */}
          <div className="pt-2 border-t border-[#E5E5DF] space-y-2">
            <div className="text-[11px] font-semibold text-[#686B66] uppercase tracking-wider px-2">
              {isTe ? 'అనుకూలతలు' : 'Accessibility & Language'}
            </div>

            {/* Language Selector in Mobile Menu */}
            <div className="px-2">
              <label className="block text-xs text-[#686B66] mb-1">
                {isTe ? 'భాష ఎంచుకోండి (Select Language)' : 'Select Language'}
              </label>
              <select
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#E5E5DF] bg-white text-xs text-[#242824] font-medium focus:outline-none focus:border-[#075B46]"
              >
                {availableLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Simple Mode Toggle */}
            <button
              onClick={toggleSimpleMode}
              className="w-full text-left px-3 py-2 rounded-lg text-xs text-[#242824] hover:bg-[#F8F7F2] flex items-center justify-between border border-[#E5E5DF]"
            >
              <div className="flex items-center gap-2">
                <Accessibility className="w-4 h-4 text-[#075B46]" />
                <span>{isTe ? 'సులభ పద్ధతి (Simple Mode)' : 'Simple Mode (Larger Text)'}</span>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                isSimpleMode ? 'bg-[#FAF4E6] text-[#242824] border border-[#E6B84A]' : 'bg-[#F8F7F2] text-[#686B66]'
              }`}>
                {isSimpleMode ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Voice Narration Audio Toggle */}
            <button
              onClick={toggleVoiceNarration}
              className="w-full text-left px-3 py-2 rounded-lg text-xs text-[#242824] hover:bg-[#F8F7F2] flex items-center justify-between border border-[#E5E5DF]"
            >
              <div className="flex items-center gap-2">
                {voiceNarrationEnabled ? (
                  <Volume2 className="w-4 h-4 text-[#075B46]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[#8E918C]" />
                )}
                <span>{isTe ? 'వాయిస్ వివరణ (Voice Narration)' : 'Voice Narration Audio'}</span>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                voiceNarrationEnabled ? 'bg-[#EBF3F0] text-[#075B46] border border-[#C8DDD6]' : 'bg-[#F8F7F2] text-[#686B66]'
              }`}>
                {voiceNarrationEnabled ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>

          {/* Account & Profile section */}
          <div className="pt-2 border-t border-[#E5E5DF]">
            {currentUser ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onOpenProfile();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-xs text-[#242824] hover:bg-[#F8F7F2] flex items-center justify-between border border-[#E5E5DF]"
                >
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#075B46]" />
                    <span>{isTe ? 'ప్రొఫైల్ వివరాలు & గోప్యత' : 'Profile & Privacy Preferences'}</span>
                  </div>
                  <span className="text-[11px] text-[#686B66]">{currentUser.displayName || 'Citizen'}</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-[#686B66] hover:text-[#242824] flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{isTe ? 'లాగ్ అవుట్' : 'Sign Out'}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-[#075B46] hover:bg-[#064B3A] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
              >
                <User className="w-4 h-4" />
                <span>{t('login')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
