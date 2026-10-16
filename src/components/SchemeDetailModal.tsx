import React, { useEffect } from 'react';
import {
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Building,
  PhoneCall,
  Calendar,
  IndianRupee,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Volume2,
  VolumeX,
  Square
} from 'lucide-react';
import { Scheme } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  getSchemeTitle,
  getSchemeSubtitle,
  getSchemeBenefit,
  getSchemeDescription,
  getSchemeRules,
  getSchemeDocs,
  getSchemeSteps
} from '../i18n/languages';
import { useAuth } from '../context/AuthContext';
import { trackEngagementEvent } from '../utils/analyticsTracker';

interface SchemeDetailModalProps {
  scheme: Scheme | null;
  isOpen?: boolean;
  onClose: () => void;
  onCheckEligibility: (scheme: Scheme) => void;
  onPrepareApplication: (scheme: Scheme) => void;
  isSaved?: boolean;
  onToggleSave?: (scheme: Scheme) => void;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({
  scheme,
  isOpen = true,
  onClose,
  onCheckEligibility,
  onPrepareApplication,
  isSaved = false,
  onToggleSave
}) => {
  const {
    currentLanguage,
    t,
    speak,
    stopSpeaking,
    isSpeaking,
    voiceNarrationEnabled,
    toggleVoiceNarration
  } = useLanguage();
  const { currentUser } = useAuth();

  const isTe = currentLanguage === 'te';

  const title = scheme ? getSchemeTitle(scheme, currentLanguage) : '';
  const subtitle = scheme ? getSchemeSubtitle(scheme, currentLanguage) : '';
  const benefit = scheme ? getSchemeBenefit(scheme, currentLanguage) : '';
  const description = scheme ? getSchemeDescription(scheme, currentLanguage) : '';
  const rules = scheme ? getSchemeRules(scheme, currentLanguage) : [];
  const docs = scheme ? getSchemeDocs(scheme, currentLanguage) : [];
  const steps = scheme ? getSchemeSteps(scheme, currentLanguage) : [];

  // Track engagement and provide auto speech narration if voice narration is enabled
  useEffect(() => {
    if (isOpen && scheme) {
      trackEngagementEvent('scheme_viewed', {
        userId: currentUser?.uid,
        schemeId: scheme.id,
        category: scheme.category,
        language: currentLanguage
      });

      if (voiceNarrationEnabled) {
        const speechText = `${title}. ${isTe ? 'ప్రయోజనం:' : 'Key Benefit:'} ${benefit}. ${isTe ? 'ముఖ్యమైన అర్హత నిబంధనలు:' : 'Key eligibility:'} ${rules.slice(0, 2).join('. ')}.`;
        speak(speechText);
      }
    }

    return () => {
      stopSpeaking();
    };
  }, [isOpen, scheme?.id, currentUser?.uid, voiceNarrationEnabled, currentLanguage]);

  if (!isOpen || !scheme) return null;

  const handleSpeakSchemeDetails = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const speechText = `${title}. ${isTe ? 'ప్రయోజనం:' : 'Key Benefit:'} ${benefit}. ${isTe ? 'అర్హత నిబంధనలు:' : 'Eligibility conditions:'} ${rules.slice(0, 3).join('. ')}.`;
      speak(speechText);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-[#E5E5DF] relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto space-y-6">
        <button
          onClick={() => {
            stopSpeaking();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-secondary-text hover:text-charcoal rounded-full hover:bg-[#F8F7F2] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badges & Voice Output */}
        <div className="flex flex-wrap items-center justify-between gap-2 pr-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
              scheme.govLevel === 'state'
                ? 'bg-[#EBF3F0] text-forest border border-forest/20'
                : 'bg-[#F0F4F8] text-[#1E3A5F] border border-[#D0D9E2]'
            }`}>
              {scheme.govLevel === 'state'
                ? (isTe ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వం' : 'Govt of Andhra Pradesh')
                : (isTe ? 'కేంద్ర ప్రభుత్వం' : 'Government of India')}
            </span>
            <span className="bg-[#FAF7EC] text-[#8C6D1F] border border-[#EBE3CD] text-xs font-medium px-2.5 py-1 rounded-full">
              {isTe ? `వర్గం: ${scheme.category}` : `Category: ${scheme.category}`}
            </span>
            <span className="bg-white text-forest border border-forest/20 text-xs font-medium px-2.5 py-1 rounded-full flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-forest" />
              <span>Verified</span>
            </span>
          </div>

          {/* Voice Narration & Audio Controls */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={toggleVoiceNarration}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full font-medium text-xs border transition-colors cursor-pointer ${
                voiceNarrationEnabled
                  ? 'bg-[#FAF7EC] text-[#8C6D1F] border-[#EBE3CD]'
                  : 'bg-white text-secondary-text border-[#E5E5DF] hover:bg-[#F8F7F2]'
              }`}
              title={voiceNarrationEnabled ? 'Voice narration enabled for scheme details' : 'Enable voice narration for scheme details'}
            >
              {voiceNarrationEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#8C6D1F]" /> : <VolumeX className="w-3.5 h-3.5 text-secondary-text" />}
              <span>{isTe ? 'స్పీచ్' : 'Narration'}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${voiceNarrationEnabled ? 'bg-[#E6B84A] text-charcoal' : 'bg-[#F2F1ED] text-secondary-text'}`}>
                {voiceNarrationEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleSpeakSchemeDetails}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-medium text-xs shadow-2xs transition-colors cursor-pointer ${
                isSpeaking
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-forest hover:bg-forest/90 text-white'
              }`}
              title="Read scheme details aloud"
            >
              {isSpeaking ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isSpeaking ? (isTe ? 'వాయిస్ ఆపండి' : 'Stop Audio') : (isTe ? 'వివరణ వినండి' : 'Listen Now')}</span>
            </button>
          </div>
        </div>

        {/* Titles */}
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-charcoal">
            {title}
          </h2>
          {isTe && (
            <div className="text-sm font-medium text-secondary-text">
              {scheme.officialName}
            </div>
          )}
          <p className="text-xs text-secondary-text flex items-center space-x-1 pt-1">
            <Building className="w-3.5 h-3.5 text-forest" />
            <span>{isTe ? `శాఖ: ${scheme.department}` : `Department: ${scheme.department}`}</span>
          </p>
        </div>

        {/* Benefit Callout */}
        <div className="bg-[#FAF7EC] border border-[#EBE3CD] rounded-xl p-5 space-y-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#8C6D1F] flex items-center space-x-1">
            <IndianRupee className="w-4 h-4 text-[#8C6D1F]" />
            <span>{isTe ? 'లభించే ఆర్థిక & సంక్షేమ ప్రయోజనాలు' : 'Welfare & Financial Benefits'}</span>
          </div>
          <div className="text-base font-semibold text-charcoal">
            {benefit}
          </div>
          <div className="text-xs text-secondary-text">
            Official Amount: {scheme.benefitAmount || 'Full Approved Benefit'}
          </div>
        </div>

        {/* Overview Description */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-charcoal flex items-center space-x-1.5">
            <BookOpen className="w-4 h-4 text-forest" />
            <span>{isTe ? 'పథకం పూర్తి వివరాలు (Scheme Overview)' : 'Scheme Overview & Purpose'}</span>
          </h3>
          <p className="text-sm text-charcoal leading-relaxed bg-[#F8F7F2] p-4 rounded-xl border border-[#E5E5DF]">
            {description}
          </p>
        </div>

        {/* Eligibility Criteria */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-charcoal flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-forest" />
            <span>{isTe ? 'అర్హత నిబంధనలు (Eligibility Rules)' : 'Official Eligibility Criteria'}</span>
          </h3>
          <div className="bg-white border border-[#E5E5DF] rounded-xl p-4 space-y-2.5 text-xs sm:text-sm text-charcoal">
            {rules.map((rule, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-forest mt-2 shrink-0"></span>
                <span className="leading-relaxed">{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Required Documents Checklist */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-charcoal flex items-center space-x-1.5">
            <FileText className="w-4 h-4 text-forest" />
            <span>{isTe ? 'కావలసిన పత్రాల చెక్‌లిస్ట్ (Required Documents)' : 'Required Documents Checklist'}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal">
            {docs.map((doc, idx) => (
              <div
                key={idx}
                className="bg-[#F8F7F2] border border-[#E5E5DF] p-3 rounded-lg flex items-center space-x-2"
              >
                <FileText className="w-4 h-4 text-[#8C6D1F] shrink-0" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How to apply */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-charcoal flex items-center space-x-1.5">
            <ChevronRight className="w-4 h-4 text-forest" />
            <span>{isTe ? 'దరఖాస్తు విధానం (Application Steps)' : 'Step-by-Step How to Apply'}</span>
          </h3>
          <div className="space-y-2 text-xs sm:text-sm text-charcoal">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start space-x-3 bg-white p-3.5 rounded-xl border border-[#E5E5DF]">
                <span className="w-6 h-6 rounded-full bg-forest text-white font-medium text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Official Links & Helplines */}
        <div className="bg-[#F8F7F2] rounded-xl p-4 space-y-3 text-xs border border-[#E5E5DF]">
          <div className="font-semibold text-charcoal flex items-center justify-between">
            <span>{isTe ? 'అధికారిక వెబ్‌సైట్ & సహాయవాణి:' : 'Official Government Portals & Helplines:'}</span>
            {scheme.verifiedHelpline && (
              <span className="text-forest font-semibold flex items-center space-x-1">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{scheme.verifiedHelpline}</span>
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={scheme.officialApplicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-forest hover:bg-forest/90 text-white font-medium px-4 py-2 rounded-full flex items-center space-x-1.5 shadow-2xs transition-colors"
            >
              <span>{isTe ? 'అధికారిక దరఖాస్తు పోర్టల్ (Official Portal)' : 'Open Official Portal'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            {scheme.sourceUrls.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-[#F2F1ED] text-charcoal px-3.5 py-2 rounded-full border border-[#E5E5DF] flex items-center space-x-1 truncate max-w-xs transition-colors"
              >
                <span className="truncate">{url.replace('https://', '')}</span>
                <ExternalLink className="w-3 h-3 text-secondary-text shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E5E5DF]">
          {onToggleSave && (
            <button
              onClick={() => onToggleSave(scheme)}
              className={`px-4 py-2 rounded-full border text-xs font-medium flex items-center space-x-1.5 cursor-pointer transition-colors ${
                isSaved ? 'bg-[#FAF7EC] border-[#EBE3CD] text-[#8C6D1F]' : 'bg-white border-[#E5E5DF] text-charcoal hover:bg-[#F8F7F2]'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 text-[#8C6D1F]" /> : <Bookmark className="w-4 h-4" />}
              <span>{isSaved ? (isTe ? 'సేవ్ చేయబడింది' : 'Saved in Bookmarks') : (isTe ? 'సేవ్ చేయండి' : 'Save Scheme')}</span>
            </button>
          )}

          <div className="flex items-center space-x-2 ml-auto">
            <button
              onClick={() => {
                onClose();
                onCheckEligibility(scheme);
              }}
              className="bg-white hover:bg-[#F8F7F2] text-charcoal border border-[#E5E5DF] font-medium text-xs px-4 py-2.5 rounded-full cursor-pointer transition-colors"
            >
              {t('checkEligibility')}
            </button>
            <button
              onClick={() => {
                onClose();
                onPrepareApplication(scheme);
              }}
              className="bg-forest hover:bg-forest/90 text-white font-medium text-xs px-5 py-2.5 rounded-full shadow-2xs cursor-pointer flex items-center space-x-1 transition-colors"
            >
              <span>{t('prepareApplication')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
