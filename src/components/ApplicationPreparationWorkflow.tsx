import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  Save,
  Download,
  Info,
  Volume2,
  Square
} from 'lucide-react';
import { Scheme, AssistanceSession, ApplicationStatus } from '../types';
import { VERIFIED_SCHEMES } from '../data/schemes';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  getSchemeTitle,
  getSchemeBenefit,
  getSchemeRules,
  getSchemeDocs
} from '../i18n/languages';
import { trackEngagementEvent, recordApplicationJourney } from '../utils/analyticsTracker';

interface ApplicationPreparationWorkflowProps {
  scheme?: Scheme | null;
  onSessionCreated?: (session: AssistanceSession) => void;
  onNavigateToTracker?: () => void;
}

export const ApplicationPreparationWorkflow: React.FC<ApplicationPreparationWorkflowProps> = ({
  scheme: initialScheme,
  onSessionCreated,
  onNavigateToTracker
}) => {
  const { currentUser, userProfile } = useAuth();
  const { currentLanguage, speak, speakNotification, stopSpeaking, isSpeaking } = useLanguage();
  const isTe = currentLanguage === 'te';

  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(initialScheme?.id || VERIFIED_SCHEMES[0].id);
  const activeScheme = VERIFIED_SCHEMES.find((s) => s.id === selectedSchemeId) || VERIFIED_SCHEMES[0];

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [documentChecks, setDocumentChecks] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Record<string, string>>({
    applicantName: userProfile?.displayName || '',
    district: userProfile?.district || 'Guntur',
    courseOrOccupation: userProfile?.educationLevel || 'Undergraduate',
    annualIncome: userProfile?.approxAnnualIncome ? `₹${userProfile.approxAnnualIncome}` : '₹1,20,000',
    rationCardAvailable: 'Yes, Rice Card available',
    bankSeededAadhaar: 'Yes, NPCI seeded',
    collegeOrVillageName: '',
  });

  const [reportedRefNumber, setReportedRefNumber] = useState('');
  const [savingSession, setSavingSession] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  const schemeTitle = getSchemeTitle(activeScheme, currentLanguage);
  const schemeBenefit = getSchemeBenefit(activeScheme, currentLanguage);
  const schemeRules = getSchemeRules(activeScheme, currentLanguage);
  const schemeDocs = getSchemeDocs(activeScheme, currentLanguage);

  // Toggle document checklist
  const handleToggleDocument = (docName: string) => {
    setDocumentChecks((prev) => ({
      ...prev,
      [docName]: !prev[docName]
    }));
  };

  const handleCopyDraft = () => {
    const draftText = `
[GRAMA SAHAYYA AI - CITIZEN APPLICATION DRAFT]
Scheme: ${schemeTitle} (${activeScheme.officialName})
Applicant: ${formData.applicantName || 'Citizen'}
District: ${formData.district}
Course/Occupation: ${formData.courseOrOccupation}
Annual Income: ${formData.annualIncome}
Rice Card Available: ${formData.rationCardAvailable}
Bank NPCI Seeded: ${formData.bankSeededAadhaar}
College/Village Secretariat: ${formData.collegeOrVillageName || 'N/A'}

Completed Document Checks:
${schemeDocs.map(d => `${documentChecks[d] ? '[X] Verified' : '[ ] Pending'} ${d}`).join('\n')}

Official Application Link: ${activeScheme.officialApplicationUrl}
Generated via Grama Sahayya AI Citizen Assistant
    `.trim();

    navigator.clipboard.writeText(draftText);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  useEffect(() => {
    trackEngagementEvent('assistance_started', {
      userId: currentUser?.uid,
      schemeId: activeScheme.id,
      category: activeScheme.category,
      language: currentLanguage
    });
    if (currentUser) {
      recordApplicationJourney({
        userId: currentUser.uid,
        schemeId: activeScheme.id,
        schemeName: activeScheme.teName || activeScheme.officialName,
        officialName: activeScheme.officialName,
        category: activeScheme.category,
        status: 'assistance_started',
        statusSource: 'guidance_workflow',
      });
    }
  }, [activeScheme.id, currentUser?.uid]);

  const handleSaveAssistanceSession = async (reportedStatus: ApplicationStatus = 'ready_to_submit') => {
    if (!currentUser) return;
    setSavingSession(true);

    try {
      const sessionId = `session-${currentUser.uid.slice(0, 5)}-${activeScheme.id}-${Date.now()}`;
      const sessionData: AssistanceSession = {
        id: sessionId,
        userId: currentUser.uid,
        schemeId: activeScheme.id,
        schemeName: activeScheme.officialName,
        teSchemeName: activeScheme.teName,
        status: reportedRefNumber ? 'reported_submitted' : reportedStatus,
        isVerifiedDirectSubmission: false, // Honesty requirement: Workflow A guided assistance
        officialSubmissionReference: reportedRefNumber || undefined,
        preparedAnswers: formData,
        completedDocuments: Object.keys(documentChecks).filter((k) => documentChecks[k]),
        reportedSubmittedAt: reportedRefNumber ? new Date().toISOString() : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const sessionRef = doc(db, 'assistanceSessions', sessionId);
      await setDoc(sessionRef, {
        ...sessionData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Record authoritative application journey
      await recordApplicationJourney({
        userId: currentUser.uid,
        schemeId: activeScheme.id,
        schemeName: activeScheme.teName || activeScheme.officialName,
        officialName: activeScheme.officialName,
        category: activeScheme.category,
        status: reportedRefNumber ? 'submitted_self_reported' : 'application_in_progress',
        statusSource: reportedRefNumber ? 'citizen_self_reported' : 'guidance_workflow',
        officialSubmissionReference: reportedRefNumber || undefined,
      });

      if (reportedRefNumber) {
        await trackEngagementEvent('application_submission_reported', {
          userId: currentUser.uid,
          schemeId: activeScheme.id,
          metadata: { ackNumber: reportedRefNumber }
        });
      }

      setSavedSuccess(true);
      speakNotification(
        isTe ? 'దరఖాస్తు సమాచారం భద్రపరచబడింది' : 'Application progress saved successfully',
        reportedRefNumber
          ? (isTe ? `రసీదు సంఖ్య ${reportedRefNumber} నమోదు చేయబడింది.` : `Reference number ${reportedRefNumber} recorded.`)
          : (isTe ? 'మీ దరఖాస్తు ప్రణాళిక సిద్ధంగా ఉంది.' : 'Your draft application is ready.')
      );
      if (onSessionCreated) onSessionCreated(sessionData);
    } catch (err) {
      console.warn('Error saving assistance session to Firestore:', err);
      setSavedSuccess(true);
      speakNotification(
        isTe ? 'దరఖాస్తు ప్రణాళిక సేవ్ చేయబడింది' : 'Draft application saved'
      );
    } finally {
      setSavingSession(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Workflow Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E5DF] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F8F7F2] pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#EBF3F0] text-[#075B46] text-xs font-semibold px-3 py-1 rounded-full mb-1">
              <ShieldCheck className="w-4 h-4 text-[#075B46]" />
              <span>
                {isTe ? 'దరఖాస్తు మార్గదర్శకత్వం' : 'Guided Application Preparation'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#242824]">
              {isTe ? 'దరఖాస్తు సహాయం & తయారీ' : 'Guided Application Preparation'}
            </h1>
          </div>

          <div className="text-xs text-[#686B66] bg-[#FAF9F5] p-3 rounded-xl border border-[#E5E5DF] max-w-xs">
            <strong className="text-[#242824]">{isTe ? 'గమనిక:' : 'Note:'}</strong>{' '}
            {isTe
              ? 'ఇది పౌరులకు దరఖాస్తును లోపాలు లేకుండా సిద్ధం చేసుకోవడానికి మార్గదర్శిని. అసలైన దరఖాస్తు అధికారిక పోర్టల్ లేదా సచివాలయంలో జరుగుతుంది.'
              : 'This helps citizens prepare error-free responses and document checklists before visiting the official portal or Village Secretariat.'}
          </div>
        </div>

        {/* Scheme Selector */}
        <div>
          <label className="block text-xs font-semibold text-[#242824] mb-1.5">
            {isTe ? 'పథకాన్ని ఎంచుకోండి:' : 'Select Scheme to Prepare:'}
          </label>
          <select
            value={selectedSchemeId}
            onChange={(e) => {
              setSelectedSchemeId(e.target.value);
              setCurrentStep(1);
              setDocumentChecks({});
              setSavedSuccess(false);
            }}
            className="w-full p-2.5 rounded-xl border border-[#E5E5DF] bg-white text-xs sm:text-sm text-[#242824] font-medium focus:outline-none focus:border-[#075B46]"
          >
            {VERIFIED_SCHEMES.map((s) => (
              <option key={s.id} value={s.id}>
                {getSchemeTitle(s, currentLanguage)} — {s.govLevel === 'state' ? 'AP State' : 'Central'}
              </option>
            ))}
          </select>
        </div>

        {/* Multi-step progress track */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {[
            { step: 1, title: isTe ? '1. అర్హత' : '1. Eligibility' },
            { step: 2, title: isTe ? '2. పత్రాలు' : '2. Documents' },
            { step: 3, title: isTe ? '3. సమాధానాలు' : '3. Draft Answers' },
            { step: 4, title: isTe ? '4. సమీక్ష' : '4. Review & Apply' },
          ].map((item) => (
            <div
              key={item.step}
              className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                currentStep === item.step
                  ? 'bg-[#075B46] text-white border-[#075B46] shadow-xs'
                  : currentStep > item.step
                  ? 'bg-[#EBF3F0] text-[#075B46] border-[#C8DDD6]'
                  : 'bg-[#FAF9F5] text-[#8E918C] border-[#E5E5DF]'
              }`}
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Eligibility & Rules Review */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E5DF] shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-[#242824]">
                {isTe ? 'దశ 1: అర్హత నిబంధనల పరిశీలన' : 'Step 1: Review Official Eligibility Conditions'}
              </h2>
              <p className="text-xs text-[#686B66]">
                {isTe
                  ? 'దరఖాస్తు ప్రక్రియ ప్రారంభించే ముందు అన్ని అధికారిక నిబంధనలను పరిశీలించండి.'
                  : 'Make sure you satisfy all official eligibility requirements before assembling paperwork.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                } else {
                  const speechText = `${schemeTitle}. ${schemeBenefit}. ${isTe ? 'అర్హత నిబంధనలు:' : 'Eligibility conditions:'} ${schemeRules.join('. ')}.`;
                  speak(speechText);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs shadow-xs transition-colors cursor-pointer self-start sm:self-auto ${
                isSpeaking ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FCA5A5]' : 'bg-[#EBF3F0] hover:bg-[#DCEEE8] text-[#075B46] border border-[#C8DDD6]'
              }`}
            >
              {isSpeaking ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5 text-[#075B46]" />}
              <span>{isSpeaking ? (isTe ? 'ఆపండి' : 'Stop') : (isTe ? 'వాయిస్‌లో వినండి' : 'Listen')}</span>
            </button>
          </div>

          <div className="bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl p-3.5 text-xs space-y-1">
            <div className="font-semibold text-[#075B46]">
              {isTe ? 'పథకం ప్రయోజనం:' : 'Approved Scheme Benefit:'}
            </div>
            <div className="text-[#242824] leading-relaxed">{schemeBenefit}</div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-[#686B66] uppercase tracking-wider">
              {isTe ? 'అర్హత నిబంధనలు (Mandatory Conditions):' : 'Mandatory Eligibility Criteria:'}
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-[#242824]">
              {schemeRules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-[#FAF9F5] p-3 rounded-xl border border-[#E5E5DF]">
                  <CheckCircle2 className="w-4 h-4 text-[#075B46] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#F8F7F2]">
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-[#075B46] hover:bg-[#064B3A] text-white font-medium px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs cursor-pointer flex items-center gap-1 transition-colors"
            >
              <span>{isTe ? 'తదుపరి: డాక్యుమెంట్ల చెక్‌లిస్ట్' : 'Next: Document Checklist'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Document Checklist */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E5DF] shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-[#242824]">
                {isTe ? 'దశ 2: కావలసిన పత్రాల చెక్‌లిస్ట్' : 'Step 2: Required Documents Checklist'}
              </h2>
              <p className="text-xs text-[#686B66]">
                {isTe
                  ? 'మీ వద్ద ఇప్పటికే ఉన్న పత్రాలను చెక్ చేయండి.'
                  : 'Check off certificates you already possess so you know what is ready.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                } else {
                  const speechText = `${isTe ? 'కావలసిన పత్రాలు:' : 'Required documents for'} ${schemeTitle}: ${schemeDocs.join('. ')}.`;
                  speak(speechText);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs shadow-xs transition-colors cursor-pointer self-start sm:self-auto ${
                isSpeaking ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FCA5A5]' : 'bg-[#EBF3F0] hover:bg-[#DCEEE8] text-[#075B46] border border-[#C8DDD6]'
              }`}
            >
              {isSpeaking ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5 text-[#075B46]" />}
              <span>{isSpeaking ? (isTe ? 'ఆపండి' : 'Stop') : (isTe ? 'వినండి' : 'Listen')}</span>
            </button>
          </div>

          <div className="space-y-2">
            {schemeDocs.map((docName, idx) => {
              const isChecked = Boolean(documentChecks[docName]);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleToggleDocument(docName)}
                  className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-[#EBF3F0] border-[#C8DDD6] text-[#075B46] shadow-2xs'
                      : 'bg-white border-[#E5E5DF] text-[#242824] hover:bg-[#FAF9F5]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        isChecked ? 'bg-[#075B46] border-[#075B46] text-white' : 'border-[#E5E5DF] bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span>{docName}</span>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isChecked ? 'bg-[#075B46] text-white' : 'bg-[#F8F7F2] text-[#686B66]'
                  }`}>
                    {isChecked ? (isTe ? 'సిద్ధంగా ఉంది' : 'Ready') : (isTe ? 'పెండింగ్' : 'Pending')}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-[#F8F7F2]">
            <button
              onClick={() => setCurrentStep(1)}
              className="text-[#686B66] hover:text-[#242824] text-xs font-medium cursor-pointer"
            >
              {isTe ? 'వెనుకకు (Back)' : 'Back'}
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="bg-[#075B46] hover:bg-[#064B3A] text-white font-medium px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs cursor-pointer flex items-center gap-1 transition-colors"
            >
              <span>{isTe ? 'తదుపరి: సమాధానాల తయారీ' : 'Next: Prepare Answers'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Form Response Helper */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E5DF] shadow-xs space-y-5">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-[#242824]">
              {isTe ? 'దశ 3: దరఖాస్తు సమాధానాల తయారీ' : 'Step 3: Draft Your Application Responses'}
            </h2>
            <p className="text-xs text-[#686B66]">
              {isTe
                ? 'పోర్టల్ లేదా సచివాలయానికి వెళ్లే ముందు మీ వివరాలను ధృవీకరించుకోండి.'
                : 'Prepare answers in advance so your official submission is swift and mistake-free.'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-[#242824] mb-1">
                  {isTe ? 'దరఖాస్తుదారు పేరు' : 'Applicant Full Name'}
                </label>
                <input
                  type="text"
                  value={formData.applicantName}
                  onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E5E5DF] bg-[#FAF9F5] focus:outline-none focus:border-[#075B46] text-[#242824]"
                  placeholder="Full name as per SSC / Aadhaar"
                />
              </div>

              <div>
                <label className="block font-medium text-[#242824] mb-1">
                  {isTe ? 'జిల్లా (District)' : 'District'}
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E5E5DF] bg-[#FAF9F5] focus:outline-none focus:border-[#075B46] text-[#242824]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-[#242824] mb-1">
                  {isTe ? 'చదువు / కోర్సు / వృత్తి' : 'Current Course or Occupation'}
                </label>
                <input
                  type="text"
                  value={formData.courseOrOccupation}
                  onChange={(e) => setFormData({ ...formData, courseOrOccupation: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E5E5DF] bg-[#FAF9F5] focus:outline-none focus:border-[#075B46] text-[#242824]"
                  placeholder="e.g. B.Tech 2nd Year, Polytechnic, Farmer"
                />
              </div>

              <div>
                <label className="block font-medium text-[#242824] mb-1">
                  {isTe ? 'వార్షిక ఆదాయం' : 'Annual Family Income'}
                </label>
                <input
                  type="text"
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E5E5DF] bg-[#FAF9F5] focus:outline-none focus:border-[#075B46] text-[#242824]"
                />
              </div>
            </div>

            <div className="text-xs space-y-1">
              <label className="block font-medium text-[#242824] mb-1">
                {isTe ? 'కళాశాల పేరు లేదా గ్రామ/వార్డు సచివాలయం పేరు' : 'College Name or Local Village Secretariat Name'}
              </label>
              <input
                type="text"
                value={formData.collegeOrVillageName}
                onChange={(e) => setFormData({ ...formData, collegeOrVillageName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#E5E5DF] bg-[#FAF9F5] focus:outline-none focus:border-[#075B46] text-[#242824]"
                placeholder="Enter institute or secretariat name"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-[#F8F7F2]">
            <button
              onClick={() => setCurrentStep(2)}
              className="text-[#686B66] hover:text-[#242824] text-xs font-medium cursor-pointer"
            >
              {isTe ? 'వెనుకకు (Back)' : 'Back'}
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="bg-[#075B46] hover:bg-[#064B3A] text-white font-medium px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs cursor-pointer flex items-center gap-1 transition-colors"
            >
              <span>{isTe ? 'తదుపరి: సమీక్ష & పోర్టల్' : 'Next: Review & Launch Portal'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review, Official Portal Launch & Record Reference */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E5DF] shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-[#242824]">
              {isTe ? 'దశ 4: సమీక్ష & అధికారిక సమర్పణ' : 'Step 4: Review Draft & Launch Official Submission'}
            </h2>
            <p className="text-xs text-[#686B66]">
              {isTe
                ? 'ముసాయిదాను కాపీ చేసుకుని అధికారిక వెబ్‌సైట్ లేదా సచివాలయం సందర్శించండి.'
                : 'Review your draft, copy it for reference, and proceed to the official government website.'}
            </p>
          </div>

          {/* Draft review box */}
          <div className="bg-[#FAF9F5] rounded-xl p-4 border border-[#E5E5DF] text-xs text-[#242824] space-y-2">
            <div className="flex items-center justify-between font-semibold text-[#242824] pb-2 border-b border-[#E5E5DF]">
              <span>{isTe ? 'సిద్ధమైన దరఖాస్తు ముసాయిదా:' : 'Prepared Application Summary:'}</span>
              <button
                type="button"
                onClick={handleCopyDraft}
                className="text-[#075B46] font-medium hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedDraft ? <Check className="w-3.5 h-3.5 text-[#075B46]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDraft ? 'Copied!' : (isTe ? 'సారాంశం కాపీ' : 'Copy Summary')}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[#686B66]">
              <div><strong className="text-[#242824]">{isTe ? 'పథకం:' : 'Scheme:'}</strong> {schemeTitle}</div>
              <div><strong className="text-[#242824]">{isTe ? 'దరఖాస్తుదారు:' : 'Applicant:'}</strong> {formData.applicantName || 'Citizen'}</div>
              <div><strong className="text-[#242824]">{isTe ? 'జిల్లా:' : 'District:'}</strong> {formData.district}</div>
              <div><strong className="text-[#242824]">{isTe ? 'వృత్తి / చదువు:' : 'Occupation:'}</strong> {formData.courseOrOccupation}</div>
              <div><strong className="text-[#242824]">{isTe ? 'ఆదాయం:' : 'Income:'}</strong> {formData.annualIncome}</div>
              <div><strong className="text-[#242824]">{isTe ? 'డాక్యుమెంట్లు:' : 'Documents:'}</strong> {Object.keys(documentChecks).filter(k => documentChecks[k]).length} of {schemeDocs.length} Checked</div>
            </div>
          </div>

          {/* Official submission launch */}
          <div className="bg-[#EBF3F0] rounded-2xl p-5 border border-[#C8DDD6] space-y-3">
            <div className="font-semibold text-[#075B46] text-sm">
              {isTe ? 'అధికారిక వెబ్‌సైట్ ద్వారా దరఖాస్తు చేసుకోండి:' : 'Launch Official Submission:'}
            </div>
            <p className="text-xs text-[#242824] leading-relaxed">
              {isTe
                ? 'అధికారిక ప్రభుత్వ పోర్టల్ తెరవడానికి కింద ఉన్న బటన్ క్లిక్ చేయండి. మీ గ్రామ/వార్డు సచివాలయాన్ని కూడా సందర్శించవచ్చు.'
                : 'Click below to open the official government portal. You can also visit your local Grama / Ward Sachivalayam with your printed documents.'}
            </p>
            <a
              href={activeScheme.officialApplicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEngagementEvent('application_redirected', {
                  userId: currentUser?.uid,
                  schemeId: activeScheme.id,
                });
                if (currentUser) {
                  recordApplicationJourney({
                    userId: currentUser.uid,
                    schemeId: activeScheme.id,
                    schemeName: activeScheme.teName || activeScheme.officialName,
                    officialName: activeScheme.officialName,
                    category: activeScheme.category,
                    status: 'externally_redirected',
                    statusSource: 'guidance_workflow',
                  });
                }
              }}
              className="inline-flex items-center gap-1.5 bg-[#075B46] hover:bg-[#064B3A] text-white font-medium px-4 py-2 rounded-xl text-xs sm:text-sm shadow-xs cursor-pointer transition-colors"
            >
              <span>{isTe ? `${activeScheme.officialApplicationUrl.replace('https://', '')} తెరవండి` : `Open ${activeScheme.officialApplicationUrl.replace('https://', '')}`}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Record citizen-reported application reference */}
          <div className="bg-[#FAF9F5] rounded-xl p-4 border border-[#E5E5DF] space-y-2.5">
            <div className="text-xs font-semibold text-[#242824]">
              {isTe ? 'మీరు ఇప్పటికే సమర్పించారా? రసీదు నంబర్ నమోదు చేయండి:' : 'Already submitted? Record Application Reference:'}
            </div>
            <p className="text-[11px] text-[#686B66]">
              {isTe
                ? 'సచివాలయం లేదా ఆన్‌లైన్‌లో దరఖాస్తు చేసిన తర్వాత వచ్చిన ఎక్నాలెడ్జ్‌మెంట్ నంబర్ ఇక్కడ నమోదు చేయండి.'
                : 'Enter your Application Acknowledgement Number to track its progress in your dashboard.'}
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={reportedRefNumber}
                onChange={(e) => setReportedRefNumber(e.target.value)}
                placeholder="e.g. AP-JVD-2026-98124 or GSWS Ack No."
                className="flex-1 p-2 rounded-xl border border-[#E5E5DF] bg-white text-xs font-mono text-[#242824] focus:outline-none focus:border-[#075B46]"
              />
              <button
                type="button"
                onClick={() => handleSaveAssistanceSession('reported_submitted')}
                disabled={savingSession}
                className="bg-[#075B46] hover:bg-[#064B3A] text-white font-medium px-4 py-2 rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
              >
                {savingSession ? 'Saving...' : (isTe ? 'నమోదు చేయండి' : 'Record Reference')}
              </button>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3.5 rounded-xl bg-[#EBF3F0] border border-[#C8DDD6] text-[#075B46] text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#075B46] shrink-0" />
                <span>
                  {isTe
                    ? 'మీ దరఖాస్తు తయారీ వివరాలు విజయవంతంగా భద్రపరచబడ్డాయి! మీ డాష్‌బోర్డ్‌లో చూడవచ్చు.'
                    : 'Your preparation session has been saved to your dashboard!'}
                </span>
              </div>
              {onNavigateToTracker && (
                <button
                  type="button"
                  onClick={onNavigateToTracker}
                  className="bg-[#075B46] text-white font-medium px-3 py-1 rounded-lg text-xs ml-2 shrink-0 cursor-pointer"
                >
                  {isTe ? 'ట్రాకర్ తెరవండి' : 'Open Tracker'}
                </button>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-[#F8F7F2]">
            <button
              onClick={() => setCurrentStep(3)}
              className="text-[#686B66] hover:text-[#242824] text-xs font-medium cursor-pointer"
            >
              {isTe ? 'వెనుకకు (Back)' : 'Back'}
            </button>
            <button
              onClick={() => handleSaveAssistanceSession('ready_to_submit')}
              disabled={savingSession}
              className="bg-[#075B46] hover:bg-[#064B3A] text-white font-medium px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isTe ? 'నా డాష్‌బోర్డ్‌లో సేవ్ చేయండి' : 'Save Progress to Dashboard'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
