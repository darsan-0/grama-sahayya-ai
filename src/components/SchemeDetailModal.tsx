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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto space-y-6">
        <button
          onClick={() => {
            stopSpeaking();
            onClose();
          }}
          className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badges & Voice Output */}
        <div className="flex flex-wrap items-center justify-between gap-2 pr-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              scheme.govLevel === 'state'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                : 'bg-blue-100 text-blue-900 border border-blue-200'
            }`}>
              {scheme.govLevel === 'state'
                ? (isTe ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వం' : 'Govt of Andhra Pradesh')
                : (isTe ? 'కేంద్ర ప్రభుత్వం' : 'Government of India')}
            </span>
            <span className="bg-amber-100 text-amber-900 text-xs font-semibold px-2.5 py-1 rounded-full">
              {isTe ? `వర్గం: ${scheme.category}` : `Category: ${scheme.category}`}
            </span>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified</span>
            </span>
          </div>

          {/* Voice Narration & Audio Controls */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={toggleVoiceNarration}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl font-bold text-xs border transition-colors cursor-pointer ${
                voiceNarrationEnabled
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600 border-stone-200'
              }`}
              title={voiceNarrationEnabled ? 'Voice narration enabled for scheme details' : 'Enable voice narration for scheme details'}
            >
              {voiceNarrationEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-700" /> : <VolumeX className="w-3.5 h-3.5 text-stone-400" />}
              <span>{isTe ? 'స్పీచ్' : 'Narration'}</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-extrabold ${voiceNarrationEnabled ? 'bg-amber-300 text-emerald-950' : 'bg-stone-200 text-stone-600'}`}>
                {voiceNarrationEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleSpeakSchemeDetails}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer ${
                isSpeaking
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
              }`}
              title="Read scheme details aloud"
            >
              {isSpeaking ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-700" />}
              <span>{isSpeaking ? (isTe ? 'వాయిస్ ఆపండి' : 'Stop Audio') : (isTe ? 'వివరణ వినండి' : 'Listen Now')}</span>
            </button>
          </div>
        </div>

        {/* Titles */}
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {title}
          </h2>
          {isTe && (
            <div className="text-sm font-semibold text-stone-600">
              {scheme.officialName}
            </div>
          )}
          <p className="text-xs text-stone-500 flex items-center space-x-1 pt-1">
            <Building className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isTe ? `శాఖ: ${scheme.department}` : `Department: ${scheme.department}`}</span>
          </p>
        </div>

        {/* Benefit Callout */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 space-y-1.5">
          <div className="text-xs font-black uppercase text-amber-900 flex items-center space-x-1">
            <IndianRupee className="w-4 h-4 text-amber-600" />
            <span>{isTe ? 'లభించే ఆర్థిక & సంక్షేమ ప్రయోజనాలు' : 'Welfare & Financial Benefits'}</span>
          </div>
          <div className="text-base font-bold text-amber-950">
            {benefit}
          </div>
          <div className="text-xs text-amber-800">
            Official Amount: {scheme.benefitAmount || 'Full Approved Benefit'}
          </div>
        </div>

        {/* Overview Description */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
            <BookOpen className="w-4 h-4 text-emerald-800" />
            <span>{isTe ? 'పథకం పూర్తి వివరాలు (Scheme Overview)' : 'Scheme Overview & Purpose'}</span>
          </h3>
          <p className="text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200">
            {description}
          </p>
        </div>

        {/* Eligibility Criteria */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-800" />
            <span>{isTe ? 'అర్హత నిబంధనలు (Eligibility Rules)' : 'Official Eligibility Criteria'}</span>
          </h3>
          <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-2 text-xs sm:text-sm text-stone-800">
            {rules.map((rule, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Required Documents Checklist */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
            <FileText className="w-4 h-4 text-emerald-800" />
            <span>{isTe ? 'కావలసిన పత్రాల చెక్‌లిస్ట్ (Required Documents)' : 'Required Documents Checklist'}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-800">
            {docs.map((doc, idx) => (
              <div
                key={idx}
                className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl flex items-center space-x-2"
              >
                <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How to apply */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
            <ChevronRight className="w-4 h-4 text-emerald-800" />
            <span>{isTe ? 'దరఖాస్తు విధానం (Application Steps)' : 'Step-by-Step How to Apply'}</span>
          </h3>
          <div className="space-y-2 text-xs sm:text-sm text-stone-800">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start space-x-3 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
                <span className="w-6 h-6 rounded-full bg-emerald-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Official Links & Helplines */}
        <div className="bg-stone-100 rounded-2xl p-4 space-y-3 text-xs">
          <div className="font-bold text-stone-800 flex items-center justify-between">
            <span>{isTe ? 'అధికారిక వెబ్‌సైట్ & సహాయవాణి:' : 'Official Government Portals & Helplines:'}</span>
            {scheme.verifiedHelpline && (
              <span className="text-emerald-900 font-bold flex items-center space-x-1">
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
              className="bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 shadow-2xs"
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
                className="bg-white hover:bg-stone-200 text-stone-700 px-3 py-2 rounded-xl border border-stone-200 flex items-center space-x-1 truncate max-w-xs"
              >
                <span className="truncate">{url.replace('https://', '')}</span>
                <ExternalLink className="w-3 h-3 text-stone-400 shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-200">
          {onToggleSave && (
            <button
              onClick={() => onToggleSave(scheme)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 cursor-pointer ${
                isSaved ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 text-amber-600" /> : <Bookmark className="w-4 h-4" />}
              <span>{isSaved ? (isTe ? 'సేవ్ చేయబడింది' : 'Saved in Bookmarks') : (isTe ? 'సేవ్ చేయండి' : 'Save Scheme')}</span>
            </button>
          )}

          <div className="flex items-center space-x-2 ml-auto">
            <button
              onClick={() => {
                onClose();
                onCheckEligibility(scheme);
              }}
              className="bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
            >
              {t('checkEligibility')}
            </button>
            <button
              onClick={() => {
                onClose();
                onPrepareApplication(scheme);
              }}
              className="bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md cursor-pointer flex items-center space-x-1"
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
