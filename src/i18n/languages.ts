export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  readiness: 'fully_tested' | 'priority' | 'progressive';
  ttsVoiceCode?: string;
}

export const SCHEDULED_INDIAN_LANGUAGES: LanguageOption[] = [
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu', readiness: 'fully_tested', ttsVoiceCode: 'te-IN' },
  { code: 'en', name: 'English (India)', nativeName: 'English', script: 'Latin', readiness: 'fully_tested', ttsVoiceCode: 'en-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', readiness: 'priority', ttsVoiceCode: 'hi-IN' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', script: 'Bengali', readiness: 'progressive', ttsVoiceCode: 'as-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali', readiness: 'progressive', ttsVoiceCode: 'bn-IN' },
  { code: 'brx', name: 'Bodo', nativeName: 'बर’', script: 'Devanagari', readiness: 'progressive' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', script: 'Devanagari', readiness: 'progressive' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati', readiness: 'progressive', ttsVoiceCode: 'gu-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada', readiness: 'progressive', ttsVoiceCode: 'kn-IN' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर / کٲشُر', script: 'Perso-Arabic', readiness: 'progressive' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', script: 'Devanagari', readiness: 'progressive' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', script: 'Devanagari', readiness: 'progressive' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam', readiness: 'progressive', ttsVoiceCode: 'ml-IN' },
  { code: 'mni', name: 'Manipuri', nativeName: 'ꯃꯤꯇꯩꯂꯣꯟ', script: 'Meitei Mayek', readiness: 'progressive' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari', readiness: 'progressive', ttsVoiceCode: 'mr-IN' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', script: 'Devanagari', readiness: 'progressive', ttsVoiceCode: 'ne-NP' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', script: 'Odia', readiness: 'progressive', ttsVoiceCode: 'or-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', readiness: 'progressive', ttsVoiceCode: 'pa-IN' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', script: 'Devanagari', readiness: 'progressive' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', script: 'Ol Chiki', readiness: 'progressive' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي / सिन्धी', script: 'Arabic', readiness: 'progressive' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil', readiness: 'progressive', ttsVoiceCode: 'ta-IN' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', script: 'Perso-Arabic', readiness: 'progressive', ttsVoiceCode: 'ur-IN' }
];

export const DICTIONARY: Record<string, Record<string, string>> = {
  en: {
    appTitle: 'Grama Sahayya AI',
    tagline: 'Government Services, Made Simple for Every Citizen',
    heroGreeting: 'Welcome to Grama Sahayya AI',
    heroSubtitle: 'Access welfare schemes, check your eligibility, get step-by-step application guidance, and discover public digital services — grounded in verified official records.',
    searchPlaceholder: 'Search schemes by name, category, or requirement...',
    voiceSearch: 'Voice Search',
    simpleMode: 'Simple Mode',
    standardMode: 'Standard Mode',
    allSchemes: 'All Schemes',
    publicServices: 'Public Services',
    aiAssistant: 'AI Assistant',
    myDashboard: 'My Dashboard',
    savedSchemes: 'Saved Schemes',
    applyGuidance: 'Apply & Track',
    login: 'Sign In / Login',
    logout: 'Sign Out',
    getStarted: 'Get Started',
    verifiedSchemes: 'Verified Schemes',
    centralGov: 'Central Govt',
    stateGov: 'AP State Govt',
    checkEligibility: 'Check Eligibility',
    prepareApplication: 'Prepare Application',
    viewDetails: 'View Details',
    officialPortal: 'Official Portal',
    benefits: 'Benefits',
    documentsRequired: 'Documents Required',
    howToApply: 'How to Apply',
    department: 'Department',
    verifiedStatus: 'Verified Official',
    disclaimer: 'Note: Grama Sahayya AI is an independent citizen facilitation platform. We provide guidance grounded exclusively in verified official records. Direct government approval depends entirely on official authorities.',
    categoriesTitle: 'Welfare Scheme Categories',
    categoriesSubtitle: 'Official government programs for students, farmers, women, seniors, and workers',
    viewAllSchemes: 'View All Schemes',
    flagshipSchemes: 'Flagship Schemes',
    flagshipSubtitle: 'Central and Andhra Pradesh Priority Welfare Programs',
    digitalCertificatesTitle: 'Digital Certificates & Public Identity Services',
    digitalCertificatesSubtitle: 'Official guidance for Aadhaar, PAN card, Caste, Income, and Land records before visiting MeeSeva or Village Secretariat.',
    openServicesGuide: 'Open Services Guide',
    trustNotice: 'Citizen Security Commitment: Grama Sahayya AI is completely free. We never request Aadhaar OTPs, passwords, or bank PINs.',
    quickSearch: 'Quick Search:',
    searchButton: 'Search',
    askAiHero: 'Ask AI Assistant',
    myEligibilityHero: 'Check My Eligibility',
    // Footer translations
    footerTagline: 'Government welfare schemes & public digital services, made simple for every citizen. Grounded exclusively in verified government gazettes and official department notifications.',
    footerZeroMiddleman: 'Zero middleman fees • Zero sensitive biometrics',
    footerQuickLinksTitle: 'Quick Links',
    footerAllSchemes: 'All Welfare Schemes',
    footerPublicServices: 'Public Digital Services',
    footerEligibilityEngine: 'Eligibility Checker Engine',
    footerAskAi: 'Ask AI Assistant',
    footerApplicationTracker: 'Application Tracker',
    footerHelplinesTitle: 'Government Helplines',
    footerSpandana: 'Spandana AP Grievance',
    footerAadhaar: 'Aadhaar UIDAI National',
    footerAarogyasri: 'Dr. NTR Vaidya Seva Trust',
    footerPmKisan: 'PM-KISAN Farmer Helpline',
    footerMoreNumbers: 'More Helplines & Feedback →',
    footerIntegrityTitle: 'Integrity & Privacy Policy',
    footerDisclaimer: 'Grama Sahayya AI is an independent citizen facilitation platform. We never guarantee government sanction; final approval rests entirely with the competent department.',
    footerPrivacyRights: 'Privacy Rights & Data Export',
    footerReportGrievance: 'Report Grievance / Feedback',
    footerCopyrightText: '© 2026 Grama Sahayya AI • Dedicated to rural citizens and multilingual communities of India.',
    footerTestedBadge: 'Telugu & English fully tested • 22 Indian Languages Cataloged • Cloud Firestore Secured',
    // Voice Output Translations
    voiceResultListen: 'Voice Output (Listen to Result)',
    voiceResultStop: 'Stop Audio',
    autoVoiceLabel: 'Auto-Speak Results',
    voiceInputLabel: 'Voice Input (Speak)',
    voiceListening: 'Listening...',
    readSchemeDetails: 'Listen to Scheme Details',
    listenToAnswer: 'Listen to Voice Output',
    audioPlaying: 'Playing Voice Output...'
  },
  te: {
    appTitle: 'గ్రామ సహాయ AI',
    tagline: 'ప్రభుత్వ సేవలు - ప్రతి పౌరుడికి సులభంగా',
    heroGreeting: 'నమస్కారం! గ్రామ సహాయ AI కి స్వాగతం',
    heroSubtitle: 'ప్రభుత్వ సంక్షేమ పథకాలు తెలుసుకోండి, మీ అర్హతలను పరిశీలించండి, దరఖాస్తుకు మార్గదర్శకత్వం పొందండి, మరియు ప్రజా డిజిటల్ సేవలను సులభంగా పొందండి.',
    searchPlaceholder: 'పథకం పేరు, వర్గం లేదా అర్హతలతో వెతకండి...',
    voiceSearch: 'వాయిస్ శోధన',
    simpleMode: 'సులభ శైలి (పెద్ద అక్షరాలు)',
    standardMode: 'సాధారణ శైలి',
    allSchemes: 'సంక్షేమ పథకాలు',
    publicServices: 'ప్రజా సేవలు',
    aiAssistant: 'AI సహాయకుడు',
    myDashboard: 'నా డాష్‌బోర్డ్',
    savedSchemes: 'దాచుకున్న పథకాలు',
    applyGuidance: 'దరఖాస్తు & ట్రాకింగ్',
    login: 'లాగిన్ / నమోదు',
    logout: 'లాగౌట్',
    getStarted: 'ప్రారంభించండి',
    verifiedSchemes: 'ధృవీకరించిన పథకాలు',
    centralGov: 'కేంద్ర ప్రభుత్వం',
    stateGov: 'ఆంధ్రప్రదేశ్ ప్రభుత్వం',
    checkEligibility: 'అర్హత పరిశీలన',
    prepareApplication: 'దరఖాస్తు సిద్ధం చేయండి',
    viewDetails: 'పూర్తి వివరాలు',
    officialPortal: 'అధికారిక పోర్టల్',
    benefits: 'లభించే ప్రయోజనాలు',
    documentsRequired: 'కావలసిన పత్రాలు',
    howToApply: 'దరఖాస్తు చేసుకునే విధానం',
    department: 'సంబంధిత శాఖ',
    verifiedStatus: 'అధికారికంగా ధృవీకరించబడింది',
    disclaimer: 'గమనిక: గ్రామ సహాయ AI పౌరులకు సమాచారం అందించే ఉచిత వేదిక. మేము అధికారిక ప్రభుత్వ వివరాల ఆధారంగా మాత్రమే సహాయం చేస్తాము. తుది మంజూరు సంబంధిత ప్రభుత్వ అధికారుల నిర్ణయంపై ఆధారపడి ఉంటుంది.',
    categoriesTitle: 'సంక్షేమ పథకాల విభాగాలు',
    categoriesSubtitle: 'విద్యార్థులు, రైతులు, మహిళలు, వృద్ధులు మరియు కార్మికుల కోసం అధికారిక పథకాలు',
    viewAllSchemes: 'అన్ని పథకాలు చూడండి',
    flagshipSchemes: 'ప్రముఖ పథకాలు',
    flagshipSubtitle: 'ఆంధ్రప్రదేశ్ & కేంద్ర ప్రభుత్వ ప్రధాన సంక్షేమ పథకాలు',
    digitalCertificatesTitle: 'ఆధార్, పాన్ కార్డు, కుల & ఆదాయ ధృవీకరణ పత్రాలు సులభంగా పొందండి',
    digitalCertificatesSubtitle: 'మీసేవ లేదా గ్రామ సచివాలయానికి వెళ్లే ముందు కావలసిన పత్రాలు, ప్రభుత్వ ఫీజు మరియు దరఖాస్తు విధానం తెలుసుకోండి.',
    openServicesGuide: 'ప్రజా సేవల గైడ్ తెరవండి',
    trustNotice: 'పౌరుల భద్రత & అధికారిక హామీ: గ్రామ సహాయ AI పూర్తిగా ఉచితం. ఆధార్ ఓటీపీలు లేదా బ్యాంక్ పిన్‌లు ఎప్పుడూ అడగము.',
    quickSearch: 'త్వరిత శోధన:',
    searchButton: 'వెతకండి',
    askAiHero: 'AI సహాయకుడిని అడగండి',
    myEligibilityHero: 'నా అర్హతలను పరిశీలించండి',
    // Footer translations
    footerTagline: 'ప్రభుత్వ సంక్షేమ పథకాలు & డిజిటల్ ప్రజా సేవలు, ప్రతి పౌరుడికి సులభంగా. అధికారిక ప్రభుత్వ గెజిట్లు మరియు నోటిఫికేషన్ల ఆధారితం.',
    footerZeroMiddleman: 'దళారుల రుసుము లేదు • బయోమెట్రిక్స్ సేకరణ లేదు',
    footerQuickLinksTitle: 'సత్వర లింకులు',
    footerAllSchemes: 'అన్ని సంక్షేమ పథకాలు',
    footerPublicServices: 'ప్రజా డిజిటల్ సేవలు',
    footerEligibilityEngine: 'అర్హత పరిశీలన ఇంజిన్',
    footerAskAi: 'AI సహాయకుడిని అడగండి',
    footerApplicationTracker: 'దరఖాస్తుల ట్రాకింగ్',
    footerHelplinesTitle: 'ప్రభుత్వ సహాయవాణి',
    footerSpandana: 'స్పందన ప్రజా సమస్యల విభాగం',
    footerAadhaar: 'ఆధార్ జాతీయ హెల్ప్‌లైన్',
    footerAarogyasri: 'డా. ఎన్టీఆర్ వైద్య సేవ ట్రస్ట్',
    footerPmKisan: 'పీఎం కిసాన్ హెల్ప్‌లైన్',
    footerMoreNumbers: 'మరిన్ని నంబర్లు & ఫీడ్‌బ్యాక్ →',
    footerIntegrityTitle: 'నిజాయితీ & గోప్యతా విధానం',
    footerDisclaimer: 'గ్రామ సహాయ AI పౌరులకు మార్గదర్శనం చేసే స్వతంత్ర వేదిక. తుది మంజూరు సంబంధిత ప్రభుత్వ శాఖ నిర్ణయంపై మాత్రమే ఆధారపడి ఉంటుంది.',
    footerPrivacyRights: 'గోప్యతా హక్కులు & డేటా ఎగుమతి',
    footerReportGrievance: 'ఫిర్యాదు నమోదు / ఫీడ్‌బ్యాక్',
    footerCopyrightText: '© 2026 గ్రామ సహాయ AI • భారతీయ గ్రామీణ పౌరులు మరియు బహుభాషా సమాజాల సేవల కోసం.',
    footerTestedBadge: 'తెలుగు & ఇంగ్లీష్ పూర్తి పరీక్షితం • 22 భారతీయ భాషల కేటలాగ్ • క్లౌడ్ ఫైర్‌స్టోర్ సురక్షితం',
    // Voice Output Translations
    voiceResultListen: 'వాయిస్ ద్వారా వినండి (Voice Output)',
    voiceResultStop: 'ఆపండి',
    autoVoiceLabel: 'ఫలితాలను స్వయంచాలకంగా చదవండి',
    voiceInputLabel: 'వాయిస్ ద్వారా మాట్లాడండి',
    voiceListening: 'వింటున్నాము...',
    readSchemeDetails: 'పథకం వివరాలు వినండి',
    listenToAnswer: 'వాయిస్ ద్వారా వినండి',
    audioPlaying: 'వాయిస్ చదువుతోంది...'
  },
  hi: {
    appTitle: 'ग्राम सहाय AI',
    tagline: 'सरकारी सेवाएं, हर नागरिक के लिए आसान',
    heroGreeting: 'ग्राम सहाय AI में आपका स्वागत है',
    heroSubtitle: 'कल्याणकारी योजनाओं की खोज करें, अपनी पात्रता जांचें, आवेदन के लिए कदम-दर-कदम मार्गदर्शन पाएं, और सार्वजनिक डिजिटल सेवाओं का उपयोग करें।',
    searchPlaceholder: 'योजना के नाम, श्रेणी या आवश्यकता से खोजें...',
    voiceSearch: 'ध्वनि खोज',
    simpleMode: 'सरल मोड (बड़ा पाठ)',
    standardMode: 'सामान्य मोड',
    allSchemes: 'कल्याणकारी योजनाएं',
    publicServices: 'सार्वजनिक सेवाएं',
    aiAssistant: 'AI सहायक',
    myDashboard: 'मेरा डैशबोर्ड',
    savedSchemes: 'सहेजी गई योजनाएं',
    applyGuidance: 'आवेदन व ट्रैकिंग',
    login: 'लॉग इन / साइन इन',
    logout: 'लॉग आउट',
    getStarted: 'शुरू करें',
    verifiedSchemes: 'सत्यापित योजनाएं',
    centralGov: 'केंद्र सरकार',
    stateGov: 'आंध्र प्रदेश सरकार',
    checkEligibility: 'पात्रता जांचें',
    prepareApplication: 'आवेदन तैयार करें',
    viewDetails: 'विस्तार से देखें',
    officialPortal: 'आधिकारिक पोर्टल',
    benefits: 'योजना लाभ',
    documentsRequired: 'आवश्यक दस्तावेज',
    howToApply: 'आवेदन प्रक्रिया',
    department: 'संबंधित विभाग',
    verifiedStatus: 'आधिकारिक रूप से सत्यापित',
    disclaimer: 'सूचना: ग्राम सहाय AI एक नागरिक सुविधा मंच है। हम आधिकारिक सरकारी अभिलेखों के आधार पर मार्गदर्शन प्रदान करते हैं।',
    categoriesTitle: 'कल्याणकारी योजना श्रेणियां',
    categoriesSubtitle: 'छात्रों, किसानों, महिलाओं, वरिष्ठ नागरिकों और श्रमिकों के लिए आधिकारिक योजनाएं',
    viewAllSchemes: 'सभी योजनाएं देखें',
    flagshipSchemes: 'प्रमुख योजनाएं',
    flagshipSubtitle: 'केंद्र और आंध्र प्रदेश सरकार की प्रमुख कल्याणकारी योजनाएं',
    digitalCertificatesTitle: 'आधार, पैन और प्रमाण पत्र सेवाएं',
    digitalCertificatesSubtitle: 'मीसेवा या ग्राम सचिवालय जाने से पहले आवश्यक दस्तावेज और शुल्क जानें।',
    openServicesGuide: 'सेवा निर्देशिका खोलें',
    trustNotice: 'नागरिक सुरक्षा: हम कभी आधार ओटीपी या बैंक पासवर्ड नहीं मांगते।',
    quickSearch: 'त्वरित खोज:',
    searchButton: 'खोजें',
    askAiHero: 'AI सहायक से पूछें',
    myEligibilityHero: 'अपनी पात्रता जांचें',
    // Footer translations
    footerTagline: 'सरकारी कल्याणकारी योजनाएं और डिजिटल सार्वजनिक सेवाएं, हर नागरिक के लिए आसान। आधिकारिक सरकारी अधिसूचनाओं पर आधारित।',
    footerZeroMiddleman: 'कोई बिचौलिया शुल्क नहीं • कोई संवेदनशील बायोमेट्रिक्स नहीं',
    footerQuickLinksTitle: 'त्वरित लिंक्स',
    footerAllSchemes: 'सभी कल्याणकारी योजनाएं',
    footerPublicServices: 'सार्वजनिक डिजिटल सेवाएं',
    footerEligibilityEngine: 'पात्रता जांच इंजन',
    footerAskAi: 'AI सहायक से पूछें',
    footerApplicationTracker: 'आवेदन ट्रैकिंग',
    footerHelplinesTitle: 'सरकारी हेल्पलाइन',
    footerSpandana: 'स्पंदना शिकायत निवारण',
    footerAadhaar: 'आधार राष्ट्रीय हेल्पलाइन',
    footerAarogyasri: 'डॉ. एनटीआर वैद्य सेवा ट्रस्ट',
    footerPmKisan: 'पीएम किसान हेल्पलाइन',
    footerMoreNumbers: 'अधिक हेल्पलाइन व फीडबैक →',
    footerIntegrityTitle: 'विश्वसनीयता एवं गोपनीयता',
    footerDisclaimer: 'ग्राम सहाय AI एक स्वतंत्र नागरिक सुविधा मंच है। अंतिम स्वीकृति सक्षम विभाग पर निर्भर करती है।',
    footerPrivacyRights: 'गोपनीयता अधिकार एवं डेटा निर्यात',
    footerReportGrievance: 'शिकायत दर्ज करें / फीडबैक',
    footerCopyrightText: '© 2026 ग्राम सहाय AI • भारत के ग्रामीण नागरिकों और बहुभाषी समुदायों को समर्पित।',
    footerTestedBadge: 'तेलुगु और अंग्रेजी पूरी तरह परीक्षित • 22 भारतीय भाषाएं • फायरस्टोर सुरक्षित',
    // Voice Output Translations
    voiceResultListen: 'आवाज़ में सुनें (Voice Output)',
    voiceResultStop: 'आवाज़ रोकें',
    autoVoiceLabel: 'परिणाम स्वतः बोलें',
    voiceInputLabel: 'बोलकर खोजें',
    voiceListening: 'सुन रहे हैं...',
    readSchemeDetails: 'योजना विवरण सुनें',
    listenToAnswer: 'आवाज़ में सुनें',
    audioPlaying: 'बोल रहा है...'
  }
};

// Localized helper utilities
export function getSchemeTitle(scheme: { officialName: string; teName: string; hiName?: string }, lang: string): string {
  if (lang === 'te') return scheme.teName;
  if (lang === 'hi' && scheme.hiName) return scheme.hiName;
  return scheme.officialName;
}

export function getSchemeSubtitle(scheme: { officialName: string; teName: string; department?: string }, lang: string): string {
  if (lang === 'te') return scheme.officialName;
  // In English or other languages, DO NOT inject Telugu! Show the official administering department
  return scheme.department || '';
}

export function getSchemeBenefit(scheme: { benefitDetails: string; teBenefitDetails: string }, lang: string): string {
  if (lang === 'te') return scheme.teBenefitDetails;
  return scheme.benefitDetails;
}

export function getSchemeSummary(scheme: { summary: string; teSummary: string }, lang: string): string {
  if (lang === 'te') return scheme.teSummary;
  return scheme.summary;
}

export function getSchemeDescription(scheme: { description: string; teDescription: string }, lang: string): string {
  if (lang === 'te') return scheme.teDescription;
  return scheme.description;
}

export function getSchemeRules(scheme: { eligibilityCriteria: { additionalRules: string[]; teAdditionalRules: string[] } }, lang: string): string[] {
  if (lang === 'te') return scheme.eligibilityCriteria.teAdditionalRules;
  return scheme.eligibilityCriteria.additionalRules;
}

export function getSchemeDocs(scheme: { requiredDocuments: string[]; teRequiredDocuments: string[] }, lang: string): string[] {
  if (lang === 'te') return scheme.teRequiredDocuments;
  return scheme.requiredDocuments;
}

export function getSchemeSteps(scheme: { applicationSteps: string[]; teApplicationSteps: string[] }, lang: string): string[] {
  if (lang === 'te') return scheme.teApplicationSteps;
  return scheme.applicationSteps;
}

export function getServiceTitle(service: { name: string; teName: string }, lang: string): string {
  if (lang === 'te') return service.teName;
  return service.name;
}

export function getServiceSubtitle(service: { name: string; teName: string; category?: string }, lang: string): string {
  if (lang === 'te') return service.name;
  return (service.category || '').replace('_', ' ').toUpperCase();
}

export function getServicePurpose(service: { purpose: string; tePurpose: string }, lang: string): string {
  if (lang === 'te') return service.tePurpose;
  return service.purpose;
}

export function getServiceDocs(service: { requiredDocuments: string[]; teRequiredDocuments: string[] }, lang: string): string[] {
  if (lang === 'te') return service.teRequiredDocuments;
  return service.requiredDocuments;
}

export function getServiceSteps(service: { steps: string[]; teSteps: string[] }, lang: string): string[] {
  if (lang === 'te') return service.teSteps;
  return service.steps;
}

export function getServiceTracking(service: { trackingInstructions: string; teTrackingInstructions: string }, lang: string): string {
  if (lang === 'te') return service.teTrackingInstructions;
  return service.trackingInstructions;
}

export function getServiceDepartment(service: { department: string; teDepartment?: string }, lang: string): string {
  if (lang === 'te' && service.teDepartment) return service.teDepartment;
  return service.department;
}
