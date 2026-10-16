import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  XCircle,
  ShieldCheck,
  ChevronRight,
  RotateCcw,
  Sparkles,
  FileText,
  Volume2,
  Square,
  VolumeX
} from 'lucide-react';
import { Scheme, UserProfile, EligibilityResult } from '../types';
import { VERIFIED_SCHEMES } from '../data/schemes';
import { evaluateSchemeEligibility } from '../utils/eligibilityEngine';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getSchemeTitle } from '../i18n/languages';
import { trackEngagementEvent, recordApplicationJourney } from '../utils/analyticsTracker';

interface EligibilityCheckerModalProps {
  scheme?: Scheme | null;
  isOpen: boolean;
  onClose: () => void;
  onPrepareApplication: (scheme: Scheme) => void;
}

export const EligibilityCheckerModal: React.FC<EligibilityCheckerModalProps> = ({
  scheme: initialScheme,
  isOpen,
  onClose,
  onPrepareApplication
}) => {
  const { currentUser, userProfile } = useAuth();
  const {
    currentLanguage,
    t,
    speak,
    speakNotification,
    stopSpeaking,
    isSpeaking,
    voiceNarrationEnabled,
    toggleVoiceNarration
  } = useLanguage();
  const isTe = currentLanguage === 'te';

  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(initialScheme?.id || VERIFIED_SCHEMES[0].id);

  // Editable simulation profile fields
  const [checkProfile, setCheckProfile] = useState<Partial<UserProfile>>({
    state: userProfile?.state || 'Andhra Pradesh',
    age: userProfile?.age || 20,
    gender: userProfile?.gender || 'female',
    approxAnnualIncome: userProfile?.approxAnnualIncome || 120000,
    educationLevel: userProfile?.educationLevel || 'Undergraduate',
    socialCategory: userProfile?.socialCategory || 'BC',
    isFarmer: userProfile?.isFarmer || false,
    hasDisability: userProfile?.hasDisability || false,
  });

  const currentScheme = VERIFIED_SCHEMES.find((s) => s.id === selectedSchemeId) || VERIFIED_SCHEMES[0];
  const result: EligibilityResult = evaluateSchemeEligibility(currentScheme, checkProfile);

  useEffect(() => {
    if (isOpen && currentScheme) {
      trackEngagementEvent('eligibility_check_completed', {
        userId: currentUser?.uid,
        schemeId: currentScheme.id,
        category: currentScheme.category,
        metadata: { status: result.status }
      });
      if (currentUser) {
        recordApplicationJourney({
          userId: currentUser.uid,
          schemeId: currentScheme.id,
          schemeName: currentScheme.teName || currentScheme.officialName,
          officialName: currentScheme.officialName,
          category: currentScheme.category,
          status: 'eligibility_checked',
          statusSource: 'guidance_workflow',
          notes: `Evaluated status: ${result.status}`,
        });
      }

      // Audio notification for important assessment result
      if (voiceNarrationEnabled) {
        const schemeTitle = currentScheme.teName || currentScheme.officialName;
        const statusText = result.status === 'likely_eligible'
          ? (isTe ? 'అర్హత ఉండవచ్చు' : 'Likely Eligible')
          : result.status === 'potentially_eligible'
          ? (isTe ? 'మరిన్ని వివరాలు అవసరం' : 'Potentially Eligible')
          : (isTe ? 'అర్హత లేకపోవచ్చు' : 'Likely Ineligible');
        speakNotification(
          isTe ? `${schemeTitle} అర్హత ఫలితం: ${statusText}` : `Eligibility for ${schemeTitle}: ${statusText}`
        );
      }
    }

    return () => {
      stopSpeaking();
    };
  }, [isOpen, currentScheme.id, result.status, currentUser?.uid]);

  if (!isOpen) return null;

  const getStatusBadge = (status: EligibilityResult['status']) => {
    switch (status) {
      case 'likely_eligible':
        return {
          label: isTe ? 'అర్హత ఉండవచ్చు' : 'Likely Eligible',
          sub: isTe ? 'ప్రాథమిక అర్హత నిబంధనలు సరిపోయాయి' : 'Preliminary criteria satisfied',
          bg: 'bg-[#EBF3F0] text-forest border-[#C5DED5]',
          icon: CheckCircle2,
          iconColor: 'text-forest'
        };
      case 'potentially_eligible':
        return {
          label: isTe ? 'మరిన్ని వివరాలు అవసరం' : 'Potentially Eligible — Missing Info',
          sub: isTe ? 'అదనపు పత్రాలు లేదా ధృవీకరణ అవసరం' : 'Additional documentation or verification needed',
          bg: 'bg-[#FAF7EC] text-[#8C6D1F] border-[#EBE3CD]',
          icon: HelpCircle,
          iconColor: 'text-[#8C6D1F]'
        };
      case 'likely_ineligible':
        return {
          label: isTe ? 'అర్హత లేకపోవచ్చు' : 'Likely Ineligible',
          sub: isTe ? 'ఒకటి లేదా అంతకంటే ఎక్కువ నిబంధనలు సరిపోలలేదు' : 'One or more mandatory rules not satisfied',
          bg: 'bg-[#FFF5F5] text-rose-800 border-rose-200',
          icon: XCircle,
          iconColor: 'text-rose-700'
        };
      default:
        return {
          label: isTe ? 'ధృవీకరించలేకపోయాము' : 'Unable to Verify',
          sub: isTe ? 'తగినంత సమాచారం లేదు' : 'Insufficient data',
          bg: 'bg-[#F8F7F2] text-charcoal border-[#E5E5DF]',
          icon: AlertCircle,
          iconColor: 'text-secondary-text'
        };
    }
  };

  const badge = getStatusBadge(result.status);
  const StatusIcon = badge.icon;

  const handleSpeakAssessmentResult = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const schemeName = getSchemeTitle(currentScheme, currentLanguage);
    let speechText = '';

    if (isTe) {
      speechText = `అర్హత పరిశీలన ఫలితం: ${schemeName}. స్థితి: ${badge.label}. ${badge.sub}. కారణాలు: ${result.reasons.join('. ')}.`;
      if (result.suggestedActions.length > 0) {
        speechText += ` తదుపరి చర్యలు: ${result.suggestedActions.join('. ')}`;
      }
    } else {
      speechText = `Eligibility assessment result for ${schemeName}. Status: ${badge.label}. ${badge.sub}. Evaluation reasons: ${result.reasons.join('. ')}.`;
      if (result.suggestedActions.length > 0) {
        speechText += ` Suggested next steps: ${result.suggestedActions.join('. ')}`;
      }
    }

    speak(speechText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E5E5DF] relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto space-y-6">
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

        {/* Title */}
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-charcoal flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#8C6D1F]" />
            <span>
              {isTe ? 'తక్షణ అర్హత పరిశీలన' : 'Instant Eligibility Assessment Engine'}
            </span>
          </h2>
          <p className="text-xs text-secondary-text mt-1">
            {isTe
              ? 'ప్రభుత్వ అధికారిక నిబంధనల ఆధారంగా ఖచ్చితమైన విశ్లేషణ మరియు వాయిస్ అవుట్‌పుట్'
              : 'Deterministic rule evaluation grounded in official government eligibility criteria with voice output.'}
          </p>
        </div>

        {/* Scheme Selector */}
        <div>
          <label className="block text-xs font-medium text-charcoal mb-1">
            {isTe ? 'పరిశీలించవలసిన పథకాన్ని ఎంచుకోండి:' : 'Select Scheme to Evaluate:'}
          </label>
          <select
            value={selectedSchemeId}
            onChange={(e) => {
              setSelectedSchemeId(e.target.value);
            }}
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5DF] bg-[#F8F7F2]/40 text-charcoal text-sm font-medium focus:bg-white focus:border-forest focus:outline-none transition-colors"
          >
            {VERIFIED_SCHEMES.map((s) => (
              <option key={s.id} value={s.id}>
                {getSchemeTitle(s, currentLanguage)} — {s.govLevel === 'state' ? (isTe ? 'ఆంధ్రప్రదేశ్' : 'AP State') : (isTe ? 'కేంద్రం' : 'Central')}
              </option>
            ))}
          </select>
        </div>

        {/* Quick parameters editor */}
        <div className="bg-[#F8F7F2] rounded-xl p-4 border border-[#E5E5DF] space-y-3">
          <div className="text-xs font-semibold text-charcoal flex items-center justify-between">
            <span>{isTe ? 'మీ అర్హత వివరాలు:' : 'Citizen Eligibility Parameters:'}</span>
            <span className="text-[11px] text-secondary-text font-normal">
              {isTe ? 'వివరాలు మార్చి అర్హత పరిశీలించండి' : 'Adjust values to test outcomes'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <label className="block text-[11px] text-secondary-text font-medium mb-1">
                {isTe ? 'వయస్సు' : 'Age (Years)'}
              </label>
              <input
                type="number"
                value={checkProfile.age}
                onChange={(e) => setCheckProfile({ ...checkProfile, age: parseInt(e.target.value, 10) || 18 })}
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-[#E5E5DF] text-charcoal focus:border-forest focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-secondary-text font-medium mb-1">
                {isTe ? 'లింగం' : 'Gender'}
              </label>
              <select
                value={checkProfile.gender}
                onChange={(e) => setCheckProfile({ ...checkProfile, gender: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-[#E5E5DF] text-charcoal focus:border-forest focus:outline-none"
              >
                <option value="female">{isTe ? 'మహిళ' : 'Female'}</option>
                <option value="male">{isTe ? 'పురుషుడు' : 'Male'}</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-secondary-text font-medium mb-1">
                {isTe ? 'వార్షిక ఆదాయం' : 'Annual Income'}
              </label>
              <select
                value={checkProfile.approxAnnualIncome}
                onChange={(e) => setCheckProfile({ ...checkProfile, approxAnnualIncome: parseInt(e.target.value, 10) })}
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-[#E5E5DF] text-charcoal focus:border-forest focus:outline-none"
              >
                <option value={100000}>₹1.0 Lakh</option>
                <option value={180000}>₹1.8 Lakhs</option>
                <option value={240000}>₹2.4 Lakhs</option>
                <option value={400000}>₹4.0 Lakhs</option>
                <option value={600000}>₹6.0 Lakhs</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-secondary-text font-medium mb-1">
                {isTe ? 'సామాజిక వర్గం' : 'Community'}
              </label>
              <select
                value={checkProfile.socialCategory}
                onChange={(e) => setCheckProfile({ ...checkProfile, socialCategory: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-[#E5E5DF] text-charcoal focus:border-forest focus:outline-none"
              >
                <option value="BC">BC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="Kapu">Kapu</option>
                <option value="Minority">Minority</option>
                <option value="EWS">EWS</option>
                <option value="OC">OC</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-1 text-xs">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={checkProfile.isFarmer}
                onChange={(e) => setCheckProfile({ ...checkProfile, isFarmer: e.target.checked })}
                className="w-4 h-4 rounded text-forest focus:ring-forest"
              />
              <span className="text-charcoal">{isTe ? 'రైతు / సాగుదారు (భూయజమాని లేదా కౌలు రైతు)' : 'Farmer or Cultivator (Landholder / Tenant)'}</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={checkProfile.hasDisability}
                onChange={(e) => setCheckProfile({ ...checkProfile, hasDisability: e.target.checked })}
                className="w-4 h-4 rounded text-forest focus:ring-forest"
              />
              <span className="text-charcoal">{isTe ? 'దివ్యాంగులు (సదరం 40%+ ధృవీకరణ)' : 'Differently Abled (SADAREM 40%+)'}</span>
            </label>
          </div>
        </div>

        {/* Evaluation Result Outcome Card with FIRST-CLASS Voice Output */}
        <div className={`p-5 rounded-xl border ${badge.bg} space-y-4 shadow-2xs`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <StatusIcon className={`w-6 h-6 ${badge.iconColor} shrink-0`} />
              <div>
                <h3 className="font-semibold text-lg text-charcoal">{badge.label}</h3>
                <p className="text-xs text-secondary-text">{badge.sub}</p>
              </div>
            </div>

            {/* Voice Narration & Audio Controls */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={toggleVoiceNarration}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full font-medium text-xs border transition-colors cursor-pointer ${
                  voiceNarrationEnabled
                    ? 'bg-white text-[#8C6D1F] border-[#EBE3CD]'
                    : 'bg-white text-secondary-text border-[#E5E5DF] hover:bg-[#F8F7F2]'
                }`}
                title={voiceNarrationEnabled ? 'Voice narration active (Click to turn off)' : 'Voice narration disabled (Click to turn on)'}
              >
                {voiceNarrationEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#8C6D1F]" /> : <VolumeX className="w-3.5 h-3.5 text-secondary-text" />}
                <span>{isTe ? 'స్పీచ్' : 'Narration'}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${voiceNarrationEnabled ? 'bg-[#E6B84A] text-charcoal' : 'bg-[#F2F1ED] text-secondary-text'}`}>
                  {voiceNarrationEnabled ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleSpeakAssessmentResult}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-medium text-xs shadow-2xs transition-colors cursor-pointer ${
                  isSpeaking
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                    : 'bg-forest hover:bg-forest/90 text-white'
                }`}
                title={isSpeaking ? (isTe ? 'వాయిస్ ఆపండి' : 'Stop Audio') : (isTe ? 'ఫలితాన్ని వాయిస్‌లో వినండి' : 'Listen to result via voice output')}
              >
                {isSpeaking ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>{isTe ? 'వాయిస్ ఆపండి (Stop)' : 'Stop Audio'}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isTe ? 'వాయిస్ ఫలితం (Listen)' : 'Voice Output (Listen)'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Rationale Bullet points */}
          <div className="space-y-1.5 pt-1 text-xs text-charcoal bg-white p-3.5 rounded-xl border border-[#E5E5DF]">
            <div className="font-medium text-charcoal flex items-center justify-between">
              <span>{isTe ? 'పరిశీలన నివేదిక:' : 'Evaluation Assessment Reasons:'}</span>
              <span className="text-[11px] font-mono text-secondary-text">Status: {result.status}</span>
            </div>
            {result.reasons.map((r, i) => (
              <div key={i} className="flex items-start space-x-2 pt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-forest mt-1.5 shrink-0"></span>
                <span className="leading-relaxed">{r}</span>
              </div>
            ))}
          </div>

          {/* Missing info if any */}
          {result.missingInfo.length > 0 && (
            <div className="bg-[#FAF7EC] p-3 rounded-xl border border-[#EBE3CD] text-xs text-charcoal space-y-1">
              <div className="font-semibold text-[#8C6D1F]">
                {isTe ? 'ధృవీకరించవలసిన అంశాలు:' : 'Information Needing Verification:'}
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-secondary-text">
                {result.missingInfo.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggested next steps */}
          <div className="space-y-1 pt-1 text-xs text-secondary-text">
            <div className="font-semibold text-charcoal">
              {isTe ? 'తదుపరి చర్యలు:' : 'Suggested Next Steps:'}
            </div>
            {result.suggestedActions.map((a, i) => (
              <div key={i} className="flex items-start space-x-2">
                <span className="text-forest font-bold">✓</span>
                <span>{a}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-[11px] text-secondary-text bg-[#F8F7F2] p-3 rounded-lg border border-[#E5E5DF] leading-relaxed">
          <strong className="text-charcoal font-semibold">{isTe ? 'ముఖ్య గమనిక:' : 'Official Notice:'}</strong>{' '}
          {isTe
            ? 'ఇది పౌరుల సమాచారం కోసం నిర్వహించే ప్రాథమిక పరిశీలన మాత్రమే. ప్రభుత్వ అధికారిక నిర్ణయం మాత్రమే అంతిమం.'
            : 'This is a preliminary advisory evaluation. Official sanction depends exclusively on verification by the competent government authority.'}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="text-secondary-text hover:text-charcoal font-medium text-xs px-4 py-2 cursor-pointer transition-colors"
          >
            {isTe ? 'మూసివేయండి' : 'Close'}
          </button>

          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              onClose();
              onPrepareApplication(currentScheme);
            }}
            className="bg-forest hover:bg-forest/90 text-white font-medium px-5 py-2.5 rounded-full text-xs sm:text-sm shadow-2xs cursor-pointer flex items-center space-x-1.5 transition-colors"
          >
            <span>{isTe ? 'దరఖాస్తు సిద్ధం చేయండి' : 'Prepare Application'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
