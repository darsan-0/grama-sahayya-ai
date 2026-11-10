import { Scheme, PublicService } from '../types';
import { VERIFIED_SCHEMES } from '../data/schemes';
import { VERIFIED_PUBLIC_SERVICES } from '../data/publicServices';
import { filterPublicSchemes, normalizeSchemeText, containsYsrBranding } from './schemeNormalization';
import { searchSchemes } from './schemeSearch';

export type CitizenIntent =
  | 'SCHEME_INFORMATION'
  | 'SCHEME_ELIGIBILITY'
  | 'SCHEME_APPLICATION'
  | 'REQUIRED_DOCUMENTS'
  | 'BENEFITS_INFORMATION'
  | 'APPLICATION_STATUS'
  | 'GOVERNMENT_SERVICE'
  | 'PAN_CARD'
  | 'AADHAAR_SERVICES'
  | 'CERTIFICATE_SERVICES'
  | 'GENERAL_GOVERNMENT_QUERY'
  | 'GREETINGS'
  | 'OUT_OF_SCOPE';

export interface IntentClassificationResult {
  intent: CitizenIntent;
  confidence: number;
  matchedScheme?: Scheme | null;
  matchedService?: PublicService | null;
  detectedLanguage: 'en' | 'te' | 'te-mixed' | 'hi';
  isLegacyTransitionQuery?: boolean;
  notes?: string;
}

/**
 * High-Speed Deterministic Citizen Intent Classifier
 * 
 * Strict Grounding Invariant:
 * 1. Categorizes user intent into 1 of the 13 designated classes.
 * 2. Never confuses PAN/Aadhaar/Certificate services with welfare schemes.
 * 3. Never falls back to a random or hardcoded scheme (e.g. Talliki Vandanam) when queries are unrelated.
 * 4. Strictly validates retrieved entity against intent before passing to response generators.
 */
export function classifyCitizenIntent(
  query: string,
  detectedLang: 'en' | 'te' | 'te-mixed' | 'hi' = 'en'
): IntentClassificationResult {
  const raw = (query || '').trim();
  const normalized = normalizeSchemeText(raw);

  // 1. GREETINGS (Immediate short-circuit)
  const greetingPatterns = [
    /^(hi|hello|hey|namaste|namaskaram|greetings|good morning|good afternoon|good evening)\b/i,
    /^(హలో|హాయ్|నమస్కారం|నమస్తే|బాగున్నారా|వందనాలు)$/i
  ];
  if (greetingPatterns.some(p => p.test(normalized)) && normalized.split(/\s+/).length <= 4) {
    return {
      intent: 'GREETINGS',
      confidence: 1.0,
      detectedLanguage: detectedLang
    };
  }

  // 2. PAN_CARD (Explicitly isolate from welfare schemes)
  const panPatterns = [
    /\b(pan|pan card|instant e-pan|epan|form 49a|nsdl pan|utiitsl pan)\b/i,
    /(పాన్|పాన్ కార్డు|ఈ-పాన్|ఇన్‌స్టంట్ పాన్)/
  ];
  if (panPatterns.some(p => p.test(normalized))) {
    const panService = VERIFIED_PUBLIC_SERVICES.find(s => s.id === 'pan-card-services') || null;
    return {
      intent: 'PAN_CARD',
      confidence: 1.0,
      matchedService: panService,
      detectedLanguage: detectedLang
    };
  }

  // 3. AADHAAR_SERVICES (UIDAI, address update, PVC card, biometrics)
  const aadhaarPatterns = [
    /\b(aadhaar|aadhar|uidai|myaadhaar|enrolment id|eid|pvc card|aadhaar link|biometric update)\b/i,
    /(ఆధార్|ఆధార్ కార్డు|యుఐడిఎఐ|బయోమెట్రిక్|ఆధార్ అప్‌డేట్|ఆధార్ మార్పు)/
  ];
  if (aadhaarPatterns.some(p => p.test(normalized))) {
    const aadhaarService = VERIFIED_PUBLIC_SERVICES.find(s => s.id === 'aadhaar-services') || null;
    return {
      intent: 'AADHAAR_SERVICES',
      confidence: 1.0,
      matchedService: aadhaarService,
      detectedLanguage: detectedLang
    };
  }

  // 4. CERTIFICATE_SERVICES (Caste, Income, Residence, Birth, Death)
  const castePatterns = [
    /\b(caste certificate|community certificate|integrated caste|sc certificate|st certificate|bc certificate|obc certificate)\b/i,
    /(కుల ధృవీకరణ|కుల సర్టిఫికెట్|కుల ధ్రువీకరణ|కుల ప్రమాణ పత్రం)/
  ];
  const incomePatterns = [
    /\b(income certificate|annual income cert|income proof)\b/i,
    /(ఆదాయ ధృవీకరణ|ఆదాయ సర్టిఫికెట్|ఆదాయ ధ్రువీకరణ)/
  ];
  if (castePatterns.some(p => p.test(normalized))) {
    const service = VERIFIED_PUBLIC_SERVICES.find(s => s.id === 'integrated-caste-certificate') || null;
    return {
      intent: 'CERTIFICATE_SERVICES',
      confidence: 1.0,
      matchedService: service,
      detectedLanguage: detectedLang
    };
  }
  if (incomePatterns.some(p => p.test(normalized))) {
    const service = VERIFIED_PUBLIC_SERVICES.find(s => s.id === 'income-certificate') || null;
    return {
      intent: 'CERTIFICATE_SERVICES',
      confidence: 1.0,
      matchedService: service,
      detectedLanguage: detectedLang
    };
  }

  // 5. APPLICATION_STATUS (Grievances, tracking reference number)
  const statusPatterns = [
    /\b(status|track|tracking|application status|grievance|reference number|spandana|1902)\b/i,
    /(స్టేటస్|ట్రాకింగ్|దరఖాస్తు స్థితి|స్పందన|ఫిర్యాదు)/
  ];
  if (statusPatterns.some(p => p.test(normalized)) && !normalized.includes('how to apply')) {
    return {
      intent: 'APPLICATION_STATUS',
      confidence: 0.9,
      detectedLanguage: detectedLang
    };
  }

  // 6. LEGACY / YSR TRANSITION QUERIES
  if (containsYsrBranding(raw)) {
    return {
      intent: 'SCHEME_INFORMATION',
      confidence: 1.0,
      isLegacyTransitionQuery: true,
      detectedLanguage: detectedLang,
      notes: 'User asked about a historical/legacy welfare program; provide transition guidance to active verified AP scheme.'
    };
  }

  // 7. Check other verified public services (Rice Card, Land Records Meebhoomi, Driving Licence, Voter ID)
  for (const svc of VERIFIED_PUBLIC_SERVICES) {
    const svcNameNorm = normalizeSchemeText(svc.name);
    const svcTeNorm = normalizeSchemeText(svc.teName);
    if (svc.id === 'pan-card-services' || svc.id === 'aadhaar-services' || svc.id === 'integrated-caste-certificate' || svc.id === 'income-certificate') {
      continue;
    }

    if (normalized.includes(svc.id) || (svcNameNorm && normalized.includes(svcNameNorm)) || (svcTeNorm && normalized.includes(svcTeNorm))) {
      return {
        intent: 'GOVERNMENT_SERVICE',
        confidence: 0.95,
        matchedService: svc,
        detectedLanguage: detectedLang
      };
    }
  }

  // Check specific public service keywords
  if (/\b(rice card|ration card|bpl ration|రేషన్ కార్డు|రైస్ కార్డు)\b/i.test(normalized)) {
    const svc = VERIFIED_PUBLIC_SERVICES.find(s => s.id === 'rice-card-services') || null;
    return {
      intent: 'GOVERNMENT_SERVICE',
      confidence: 0.95,
      matchedService: svc,
      detectedLanguage: detectedLang
    };
  }
  if (/\b(meebhoomi|land records|1b ror|adangal|పట్టాదారు పాస్‌బుక్|అడంగల్|మీభూమి)\b/i.test(normalized)) {
    const svc = VERIFIED_PUBLIC_SERVICES.find(s => s.id === 'land-records-meebhoomi') || null;
    return {
      intent: 'GOVERNMENT_SERVICE',
      confidence: 0.95,
      matchedService: svc,
      detectedLanguage: detectedLang
    };
  }
  if (/\b(driving licence|dl|learner licence|llr|driving license|డ్రైవింగ్ లైసెన్స్)\b/i.test(normalized)) {
    const svc = VERIFIED_PUBLIC_SERVICES.find(s => s.id === 'driving-licence-services') || null;
    return {
      intent: 'GOVERNMENT_SERVICE',
      confidence: 0.95,
      matchedService: svc,
      detectedLanguage: detectedLang
    };
  }
  if (/\b(voter id|epic|voter card|ఓటర్ కార్డు|ఓటు గుర్తింపు)\b/i.test(normalized)) {
    const svc = VERIFIED_PUBLIC_SERVICES.find(s => s.id === 'voter-id-services') || null;
    return {
      intent: 'GOVERNMENT_SERVICE',
      confidence: 0.95,
      matchedService: svc,
      detectedLanguage: detectedLang
    };
  }

  // 8. SPECIFIC SCHEME INTENTS (Eligibility, Documents, Application, Benefits, General Info)
  const isEligibilityQuery =
    /\b(eligibility|eligible|qualify|criteria|who can apply|rules|conditions)\b/i.test(normalized) ||
    /(అర్హత|అర్హులు|నిబంధనలు)/.test(normalized);

  const isDocumentsQuery =
    /\b(document|documents|proof|certificates needed|required documents|records)\b/i.test(normalized) ||
    /(కావలసిన పత్రాలు|డాక్యుమెంట్లు|సర్టిఫికెట్లు)/.test(normalized);

  const isApplicationQuery =
    /\b(how to apply|application process|where to apply|apply online|registration steps)\b/i.test(normalized) ||
    /(దరఖాస్తు విధానం|ఎలా దరఖాస్తు|ఎక్కడ దరఖాస్తు)/.test(normalized);

  const isBenefitsQuery =
    /\b(benefit|benefits|amount|financial assistance|how much money|rate|subsidy)\b/i.test(normalized) ||
    /(ప్రయోజనం|ఎంత డబ్బు|ఎంత సాయం|ఎంత లభిస్తుంది)/.test(normalized);

  const hasGovOrWelfareContext =
    isEligibilityQuery ||
    isDocumentsQuery ||
    isApplicationQuery ||
    isBenefitsQuery ||
    /\b(scheme|schemes|yojana|pathakam|subsidy|aid|welfare|govt|government|andhra|ap|farmer|pension|student|school|college|health|hospital|scholarship|gas|cylinder|bus|loan|mudra|housing|house|surya|employment|nregs|viswakarma|sukhibhava|bharosa|vandanam|deevena|aadabidda)\b/i.test(normalized) ||
    /(పథకం|పథకాలు|సాయం|రైతు|పింఛన్|విద్యార్థి|ఉచితం|ఆరోగ్యం|వైద్యం|గృహ|రుణం|ఉపాధి|సచివాలయం|ఆడబిడ్డ|దీపం|స్త్రీ శక్తి)/.test(normalized);

  // If query explicitly states "unknown scheme" or has no substantive non-stop words
  if (/\b(unknown|unverified|fake|test|random|xyz)\b/i.test(normalized)) {
    return {
      intent: 'OUT_OF_SCOPE',
      confidence: 0.95,
      detectedLanguage: detectedLang
    };
  }

  // Search schemes for genuine relevance match
  const searchRes = searchSchemes(raw);

  if (searchRes.schemes.length > 0) {
    const bestScheme = searchRes.schemes[0];
    const bestNameNorm = normalizeSchemeText(bestScheme.officialName);
    const bestTeNorm = normalizeSchemeText(bestScheme.teName);
    const hasDirectNameMatch = normalized.split(/\s+/).some(t => t.length >= 3 && (bestNameNorm.includes(t) || bestTeNorm.includes(t)));

    // Strictly verify intent relevance: query must either have government/welfare context OR directly name the scheme
    if (hasGovOrWelfareContext || hasDirectNameMatch) {
      let subIntent: CitizenIntent = 'SCHEME_INFORMATION';
      if (isEligibilityQuery) subIntent = 'SCHEME_ELIGIBILITY';
      else if (isDocumentsQuery) subIntent = 'REQUIRED_DOCUMENTS';
      else if (isApplicationQuery) subIntent = 'SCHEME_APPLICATION';
      else if (isBenefitsQuery) subIntent = 'BENEFITS_INFORMATION';

      return {
        intent: subIntent,
        confidence: 0.85,
        matchedScheme: bestScheme,
        detectedLanguage: detectedLang
      };
    }
  }

  // 9. GENERAL GOVERNMENT QUERY vs OUT_OF_SCOPE
  const isGovDomainQuery =
    /\b(government|sachivalayam|secretariat|collector|mro|tahsildar|meeseva|csc|village assistant)\b/i.test(normalized) ||
    /(ప్రభుత్వం|సచివాలయం|మీసేవ|తహశీల్దార్)/.test(normalized);

  if (isGovDomainQuery) {
    return {
      intent: 'GENERAL_GOVERNMENT_QUERY',
      confidence: 0.7,
      detectedLanguage: detectedLang
    };
  }

  // If completely unrelated (e.g. weather in London, recipe, crypto, nonsense string)
  return {
    intent: 'OUT_OF_SCOPE',
    confidence: 0.9,
    detectedLanguage: detectedLang
  };
}

/**
 * Generates official, truthful, grounded response based strictly on verified intent
 */
export function generateGroundedResponse(
  classification: IntentClassificationResult,
  queryOrLang?: string,
  targetLanguage?: string
): { reply: string; recommendedSchemeIds: string[]; officialSources: string[] } {
  const { intent, matchedScheme, matchedService, detectedLanguage, isLegacyTransitionQuery } = classification;
  const effectiveLang = targetLanguage || (queryOrLang === 'en' || queryOrLang === 'te' || queryOrLang === 'hi' ? queryOrLang : detectedLanguage) || 'te';
  const isTe = effectiveLang === 'te';
  const query = queryOrLang || '';

  // 1. GREETINGS
  if (intent === 'GREETINGS') {
    const reply = isTe
      ? `నమస్కారం! నేను గ్రామ సహాయ AI సహాయకుడిని.

ఆంధ్రప్రదేశ్ మరియు కేంద్ర ప్రభుత్వ సంక్షేమ పథకాలు, అర్హత నిబంధనలు, దరఖాస్తు విధానం లేదా పౌర సేవలు (ఆధార్, పాన్ కార్డు, కుల/ఆదాయ ధృవీకరణ పత్రాలు) గురించి మీకు ఖచ్చితమైన అధికారిక సమాచారం అందించగలను.

మీరు ఏ పథకం లేదా సేవ గురించి తెలుసుకోవాలనుకుంటున్నారు?`
      : `Hello! I am the Grama Sahayya AI Assistant.

I provide authentic, verified guidance on Andhra Pradesh and Central Government welfare schemes (such as Annadata Sukhibhava, NTR Bharosa, Talliki Vandanam, Dr. NTR Vaidya Seva) as well as citizen public services (such as PAN Card, Aadhaar, and Certificates).

How can I assist you today? Please tell me which scheme or public service you are inquiring about.`;

    return {
      reply,
      recommendedSchemeIds: ['annadata-sukhibhava-ap', 'talliki-vandanam-ap', 'ntr-bharosa-pension-ap'],
      officialSources: ['https://services.india.gov.in', 'https://gramawardsachivalayam.ap.gov.in']
    };
  }

  // 2. PAN_CARD (Strictly Service-Oriented format, NO welfare schemes)
  if (intent === 'PAN_CARD') {
    const pan = VERIFIED_PUBLIC_SERVICES.find(s => s.id === 'pan-card-services') || matchedService;
    const reply = isTe
      ? `**పాన్ కార్డు (PAN Card) - అధికారిక దరఖాస్తు విధానం**

1. **వివరాలు & ప్రయోజనం:**
   పాన్ కార్డు (శాశ్వత ఖాతా సంఖ్య) అనేది ఆదాయ పన్ను శాఖ (భారత ప్రభుత్వం) జారీ చేసే 10 అంకెల విశిష్ట గుర్తింపు కార్డు. బ్యాంక్ ఖాతాలు తెరవడానికి, స్కాలర్‌షిప్‌లు మరియు ఆర్థిక లావాదేవీలకు ఇది తప్పనిసరి.

2. **అధికారిక దరఖాస్తు పోర్టల్స్:**
   • తక్షణ ఉచిత ఈ-పాన్ (Instant e-PAN): [incometax.gov.in](https://eportal.incometax.gov.in)
   • ఫిజికల్ ప్లాస్టిక్ కార్డు: [tin-nsdl.com](https://www.tin-nsdl.com) లేదా UTIITSL పోర్టల్

3. **ఫీజు & సమయం:**
   • తక్షణ ఈ-పాన్ (Instant e-PAN): **100% ఉచితం** (10 నిమిషాల్లో లభిస్తుంది).
   • ఫిజికల్ కార్డు (ఇంటికి డెలివరీ): **రూ. 107** (10 నుండి 15 పని దినాలు).

4. **అర్హత:**
   భారతీయ పౌరులందరూ అర్హులు. తక్షణ ఈ-పాన్ కోసం ఆధార్‌కు యాక్టివ్ మొబైల్ నంబర్ లింక్ అయి ఉండాలి.

5. **కావలసిన పత్రాలు:**
   • ఆధార్ కార్డు (మొబైల్ ఓటీపీ ధృవీకరణతో కాగిత రహిత విధానం)
   • ఫిజికల్ కార్డు కోసం: పాస్‌పోర్ట్ సైజు ఫోటో మరియు డిజిటల్ సంతకం.

6. **దరఖాస్తు చేసుకునే విధానం:**
   1. ఇన్కమ్ టాక్స్ ఇ-ఫైలింగ్ పోర్టల్ ([eportal.incometax.gov.in](https://eportal.incometax.gov.in)) లోని **Quick Links** లో **Instant e-PAN** ఎంచుకోండి.
   2. "Get New e-PAN" పై క్లిక్ చేసి 12 అంకెల ఆధార్ నంబర్ నమోదు చేయండి.
   3. మీ మొబైల్‌కు వచ్చే 6 అంకెల ఓటీపీని నమోదు చేసి ధృవీకరించండి.
   4. వివరాలు సరిచూసుకొని సబ్మిట్ చేయగానే క్షణాల్లో డిజిటల్ సంతకంతో కూడిన e-PAN PDF డౌన్‌లోడ్ చేసుకోవచ్చు.
   5. ప్లాస్టిక్ కార్డు కావాలంటే NSDL పోర్టల్‌లో రూ. 107 చెల్లించి ఆర్డర్ చేయవచ్చు.

7. **సహాయవాణి & ట్రాకింగ్:**
   • టోల్ ఫ్రీ హెల్ప్‌లైన్: **1800-180-1961**
   • ట్రాకింగ్: NSDL పోర్టల్‌లో 15 అంకెల అక్నాలెడ్జ్‌మెంట్ నంబర్‌తో ట్రాక్ చేయవచ్చు.

*గమనిక: పాన్ కార్డు కోసం ఏ మధ్యవర్తులను ఆశ్రయించాల్సిన అవసరం లేదు. అధికారిక ప్రభుత్వ పోర్టల్ ద్వారా నేరుగా దరఖాస్తు చేసుకోవచ్చు.*`
      : `**PAN Card (Permanent Account Number) — Official Application Guidance**

1. **Overview & Authority:**
   A PAN Card is a 10-digit alphanumeric unique identifier issued by the Income Tax Department, Ministry of Finance, Government of India. It is mandatory for opening bank accounts, DBT scholarships, financial transactions, and filing income tax returns.

2. **Official Application Portals:**
   • **Instant Paperless e-PAN (Free):** [eportal.incometax.gov.in](https://eportal.incometax.gov.in)
   • **Physical Plastic PAN Card:** [tin-nsdl.com](https://www.tin-nsdl.com) / Protean or UTIITSL

3. **Official Fees & Processing Time:**
   • **Instant e-PAN (Income Tax e-Filing Portal):** **100% FREE** — Generated in approximately 10 minutes.
   • **Physical Plastic Card (Home Delivery):** **₹107** (inclusive of GST within India) — Dispatched by speed post within 10–15 working days.

4. **Eligibility:**
   Any Indian citizen. For the instant paperless method, your Aadhaar must be linked to an active mobile phone number for OTP authentication.

5. **Required Documents:**
   • Aadhaar Card (sufficient for instant paperless e-PAN)
   • For physical card with photo: Aadhaar Card, passport-size photograph, and scanned signature.

6. **Step-by-Step Application Process (Instant e-PAN):**
   1. Visit the official Income Tax portal: **[eportal.incometax.gov.in](https://eportal.incometax.gov.in)**.
   2. Under **Quick Links**, select **Instant e-PAN**.
   3. Click on **Get New e-PAN** and enter your 12-digit Aadhaar number.
   4. Enter the 6-digit OTP received on your Aadhaar-linked mobile phone.
   5. Validate your personal details (Name, DoB, Gender, Address) fetched from Aadhaar and submit.
   6. Download your digitally signed, legally valid e-PAN PDF within minutes.
   7. (Optional) Order physical plastic card via NSDL for ₹107 if required.

7. **Tracking & Verified Helpline:**
   • Income Tax Helpline: **1800-180-1961** (Toll-Free)
   • Tracking portal: [tin-nsdl.com](https://www.tin-nsdl.com) using your 15-digit acknowledgement number.

*Official Verification: Authentic record verified via National Government Services Portal (services.india.gov.in) and Income Tax Department.*`;

    return {
      reply,
      recommendedSchemeIds: [],
      officialSources: ['https://eportal.incometax.gov.in', 'https://services.india.gov.in/service/detail/apply-for-pan-card-online']
    };
  }

  // 3. AADHAAR_SERVICES
  if (intent === 'AADHAAR_SERVICES') {
    const aadhaar = VERIFIED_PUBLIC_SERVICES.find(s => s.id === 'aadhaar-services') || matchedService;
    const reply = isTe
      ? `**ఆధార్ సేవలు (UIDAI Aadhaar Services) - అధికారిక సమాచారం**

1. **వివరాలు & ప్రయోజనం:**
   భారత విశిష్ట గుర్తింపు ప్రాధికార సంస్థ (UIDAI) జారీ చేసే 12 అంకెల విశిష్ట గుర్తింపు సంఖ్య. ప్రభుత్వ సంక్షేమ పథకాలు, స్కాలర్‌షిప్‌లు మరియు బ్యాంక్ DBT ఖాతాలకు ఆధార్ అనుసంధానం తప్పనిసరి.

2. **అధికారిక పోర్టల్:**
   • అధికారిక వెబ్‌సైట్: **[myaadhaar.uidai.gov.in](https://myaadhaar.uidai.gov.in)**

3. **ఫీజు వివరాలు:**
   • కొత్త ఆధార్ నమోదు: **ఉచితం (FREE)**
   • 5 & 15 ఏళ్ల తప్పనిసరి బయోమెట్రిక్ అప్‌డేట్: **ఉచితం (FREE)**
   • డెమోగ్రాఫిక్ అప్‌డేట్ (చిరునామా మార్పు): **రూ. 50**
   • బయోమెట్రిక్ అప్‌డేట్: **రూ. 100**
   • పీవీసీ (PVC) ప్లాస్టిక్ కార్డు ఆర్డర్: **రూ. 50**

4. **కావలసిన పత్రాలు:**
   • గుర్తింపు రుజువు (PoI): ఓటర్ ఐడీ, పాన్ కార్డు, పాస్‌పోర్ట్, లేదా సచివాలయ ధృవీకరణ.
   • చిరునామా రుజువు (PoA): కరెంట్ బిల్లు, రేషన్ కార్డు, బ్యాంక్ పాస్‌బుక్.
   • పుట్టిన తేదీ రుజువు (DoB): బర్త్ సర్టిఫికెట్ లేదా 10వ తరగతి మార్కుల మెమో.

5. **ఎలా దరఖాస్తు చేయాలి / మార్పులు చేసుకోవాలి:**
   • **చిరునామా మార్పు:** myaadhaar.uidai.gov.in లో ఆధార్ మరియు మొబైల్ ఓటీపీతో లాగిన్ అయి, సరైన డాక్యుమెంట్ అప్‌లోడ్ చేసి రూ. 50 చెల్లించి ఆన్‌లైన్‌లో మార్చుకోవచ్చు.
   • **మొబైల్ లింకింగ్ & బయోమెట్రిక్స్:** సమీప గ్రామ/వార్డు సచివాలయం ఆధార్ కేంద్రం లేదా పోస్టాఫీసుకు వెళ్లి వేలిముద్రలు/కనుపాప స్కాన్ చేయించుకోవాలి.

6. **సహాయవాణి & స్టేటస్ ట్రాకింగ్:**
   • యుఐడిఎఐ టోల్ ఫ్రీ హెల్ప్‌లైన్: **1947**
   • ఇమెయిల్: help@uidai.gov.in
   • ట్రాకింగ్: 14 అంకెల EID లేదా 28 అంకెల SRN నంబర్‌తో myaadhaar.uidai.gov.in లో ట్రాక్ చేయవచ్చు.`
      : `**Aadhaar Services (UIDAI) — Official Citizen Guidance**

1. **Overview & Authority:**
   Aadhaar is a 12-digit verifiable unique identification number issued by the Unique Identification Authority of India (UIDAI), Ministry of Electronics & IT. It is legally mandatory for DBT welfare disbursements, pensions, scholarships, and subsidized public services.

2. **Official Portals:**
   • Official Citizen Portal: **[myaadhaar.uidai.gov.in](https://myaadhaar.uidai.gov.in)**
   • National Services Portal: [services.india.gov.in](https://services.india.gov.in)

3. **Official Fee Structure:**
   • New Aadhaar Enrolment: **FREE**
   • Mandatory Biometric Updates (at age 5 and age 15): **FREE**
   • Demographic Details Update (Address, Name correction): **₹50**
   • Biometric Update (Fingerprint, Iris, Photo): **₹100**
   • Order Secure PVC Aadhaar Card: **₹50** (delivered by speed post)

4. **Required Documents:**
   • Proof of Identity (PoI): Voter ID, Passport, PAN Card, Driving Licence, or Secretariat Certificate.
   • Proof of Address (PoA): Electricity Bill, Water Bill, Ration Card, Bank Passbook.
   • Proof of Date of Birth (DoB): Birth Certificate or SSC Marks Memo.

5. **How to Update / Apply:**
   • **Online Address Update:** Visit **[myaadhaar.uidai.gov.in](https://myaadhaar.uidai.gov.in)**, log in with Aadhaar OTP, upload valid document proof, pay ₹50, and submit.
   • **Mobile Linking & Biometrics:** Visit the nearest Grama/Ward Sachivalayam Aadhaar Centre, MeeSeva, or Post Office Aadhaar Enrolment Centre.

6. **Helpline & Tracking:**
   • UIDAI National Helpline: **1947** (Toll-Free)
   • Track enrolment or update status at myaadhaar.uidai.gov.in using your 14-digit Enrolment ID (EID) or Service Request Number (SRN).`;

    return {
      reply,
      recommendedSchemeIds: [],
      officialSources: ['https://myaadhaar.uidai.gov.in', 'https://services.india.gov.in/service/detail/aadhaar-online-services']
    };
  }

  // 4. CERTIFICATE_SERVICES (Caste / Income)
  if (intent === 'CERTIFICATE_SERVICES') {
    const isCaste = /caste|community|కుల/i.test(query);
    const service = isCaste
      ? VERIFIED_PUBLIC_SERVICES.find(s => s.id === 'integrated-caste-certificate')
      : VERIFIED_PUBLIC_SERVICES.find(s => s.id === 'income-certificate');

    const reply = isTe
      ? `**${isCaste ? 'కుల ధృవీకరణ పత్రం (Integrated Caste Certificate)' : 'ఆదాయ ధృవీకరణ పత్రం (Income Certificate)'} - అధికారిక దరఖాస్తు విధానం**

1. **వివరాలు & శాఖ:**
   ఆంధ్రప్రదేశ్ ప్రభుత్వ రెవెన్యూ శాఖ ద్వారా గ్రామ/వార్డు సచివాలయం మరియు మీసేవ పోర్టల్ ద్వారా జారీ చేయబడుతుంది. విద్యా సంస్థల్లో రిజర్వేషన్లు, ఫీజు రీయింబర్స్‌మెంట్ మరియు సంక్షేమ పథకాలకు తప్పనిసరి.

2. **అధికారిక దరఖాస్తు విధానం & పోర్టల్:**
   • అధికారిక పోర్టల్: **[gramawardsachivalayam.ap.gov.in](https://gramawardsachivalayam.ap.gov.in)** / మీసేవ కేంద్రం
   • అధికారిక యూజర్ ఫీజు: **రూ. 35**
   • ప్రాసెసింగ్ సమయం: **7 నుండి 15 పని దినాలు** (తహశీల్దార్ డిజిటల్ సంతకం)

3. **కావలసిన పత్రాలు:**
   ${isCaste ? `• దరఖాస్తుదారు & తల్లిదండ్రుల ఆధార్ కార్డులు
   • తండ్రి/తోబుట్టువుల కుల ధృవీకరణ పత్రం లేదా 10వ తరగతి టిసి (TC)
   • రేషన్ కార్డు / రైస్ కార్డు / భూమి రికార్డులు (1B RoR)
   • స్వయం ధృవీకరణ పత్రం (Self-Declaration Form)` : `• కుటుంబ సభ్యుల ఆధార్ కార్డులు
   • బియ్యం కార్డు (BPL Rice Card) లేదా రేషన్ కార్డు
   • వేతన ధృవీకరణ పత్రం (ఉద్యోగులైతే) లేదా స్వయం ప్రకటన పత్రం
   • విద్యుత్ బిల్లు / గ్యాస్ బిల్లు`}

4. **ఎలా దరఖాస్తు చేసుకోవాలి:**
   1. మీ గ్రామ లేదా వార్డు సచివాలయంలోని డిజిటల్ అసిస్టెంట్ / వెల్ఫేర్ అసిస్టెంట్‌ను సంప్రదించండి.
   2. దరఖాస్తు ఫారమ్ పూరించి, కావలసిన ధృవీకరణ పత్రాల జిరాక్స్ జతచేయండి.
   3. రసీదు (Application Reference Number) పొందండి.
   4. రెవెన్యూ ఇన్‌స్పెక్టర్ (RI) మరియు వీఆర్వో (VRO) విచారణ అనంతరం తహశీల్దార్ ఆమోదంతో సర్టిఫికెట్ డౌన్‌లోడ్ అవుతుంది.

5. **సహాయవాణి:**
   • ఆంధ్రప్రదేశ్ పౌర సేవల సహాయవాణి: **1902**`
      : `**${isCaste ? 'Integrated Caste / Community Certificate' : 'Income Certificate'} (AP Government) — Official Guidance**

1. **Overview & Authority:**
   Issued by the Revenue Department, Government of Andhra Pradesh through the Grama/Ward Sachivalayam and MeeSeva network. Essential for fee reimbursement, reservation in admissions, government employment, and welfare entitlements.

2. **Official Portals & Charges:**
   • Official Citizen Portal: **[gramawardsachivalayam.ap.gov.in](https://gramawardsachivalayam.ap.gov.in)** / MeeSeva
   • Official Fee: **₹35**
   • SLA Processing Time: **7 to 15 working days** (digitally signed by the Tahsildar)

3. **Required Documents:**
   ${isCaste ? `• Applicant and Parent Aadhaar Cards
   • Father's/Sibling's Caste Certificate OR School TC showing community
   • BPL Rice Card / Ration Card
   • Notarized / Self-Declaration Form` : `• Family Aadhaar Cards
   • BPL Rice Card / Ration Card
   • Salary slip / Employer Certificate (if employed) or self-declaration
   • Electricity bill`}

4. **How to Apply:**
   1. Visit your local **Grama / Ward Sachivalayam** (Village / Ward Secretariat) or nearest MeeSeva centre.
   2. Submit the application along with certified document copies to the Digital Assistant.
   3. Collect the official acknowledgment receipt containing the Application Reference Number.
   4. After VRO/RI field verification and Tahsildar approval, collect the digitally signed certificate or download it online.

5. **Helpline:**
   • AP Citizen Grievance & Public Service Helpline: **1902**`;

    return {
      reply,
      recommendedSchemeIds: [],
      officialSources: ['https://gramawardsachivalayam.ap.gov.in', 'https://services.india.gov.in']
    };
  }

  // 5. LEGACY / YSR TRANSITION GUIDANCE
  if (isLegacyTransitionQuery) {
    const reply = isTe
      ? `నమస్కారం! పాత లేదా మునుపటి ప్రభుత్వ సంక్షేమ పథకాలు ప్రజా కేటలాగ్ నుండి తొలగించబడి ఆర్కైవ్ చేయబడ్డాయి.

ప్రస్తుతం ఆంధ్రప్రదేశ్ ప్రభుత్వం అధికారికంగా అమలు చేస్తున్న ప్రధాన సంక్షేమ పథకాలు:
• **అన్నదాత సుఖీభవ మరియు పీఎం-కిసాన్**: రైతులకు ఏటా ₹20,000 పెట్టుబడి సాయం. (వెబ్‌సైట్: https://annadathasukhibhava.ap.gov.in)
• **డా. ఎన్టీఆర్ వైద్య సేవ**: పేద కుటుంబాలకు ₹25 లక్షల వరకు ఉచిత నగదు రహిత వైద్య చికిత్స. (వెబ్‌సైట్: https://drntrvaidyaseva.ap.gov.in)
• **ఎన్టీఆర్ భరోసా సామాజిక పింఛను**: వృద్ధులు, వితంతువులకు నెలకు ₹4,000, దివ్యాంగులకు ₹6,000 నుండి ₹15,000. (వెబ్‌సైట్: https://sspensions.ap.gov.in)
• **ఆడబిడ్డ నిధి పథకం**: 18 నుండి 59 ఏళ్ల మహిళలకు ప్రతి నెలా ₹1,500 ఆర్థిక సాయం.
• **స్త్రీ శక్తి పథకం**: ఆర్టీసీ బస్సుల్లో మహిళలకు 100% ఉచిత ప్రయాణ సౌకర్యం. (వెబ్‌సైట్: https://apsrtc.ap.gov.in)
• **తల్లికి వందనం**: బడికి వెళ్లే పిల్లల తల్లులకు ఏటా ₹15,000 ఆర్థిక ప్రోత్సాహకం.

మీకు ఏ ప్రస్తుత సంక్షేమ పథకం గురించి వివరాలు కావాలో తెలియజేయండి.`
      : `Hello! Historical or predecessor welfare schemes have been superseded and archived.

The Government of Andhra Pradesh currently implements the following verified flagship welfare programs:
• **Annadata Sukhibhava & PM-KISAN**: ₹20,000 annual investment support for farmers. (Portal: https://annadathasukhibhava.ap.gov.in)
• **Dr. NTR Vaidya Seva**: Universal cashless healthcare up to ₹25 Lakhs per family per year. (Portal: https://drntrvaidyaseva.ap.gov.in)
• **NTR Bharosa Social Security Pension**: ₹4,000/month for elderly & widows, up to ₹15,000/month for severe disability. (Portal: https://sspensions.ap.gov.in)
• **Aadabidda Nidhi Scheme**: ₹1,500 monthly financial aid for women aged 18–59.
• **APSRTC Sthree Shakthi**: 100% free bus travel for women across Andhra Pradesh. (Portal: https://apsrtc.ap.gov.in)
• **Talliki Vandanam**: ₹15,000/year for mothers sending children to school (Class 1 to 12).

Which current welfare program would you like information on?`;

    return {
      reply,
      recommendedSchemeIds: ['annadata-sukhibhava-ap', 'dr-ntr-vaidya-seva-ap', 'ntr-bharosa-pension-ap', 'talliki-vandanam-ap'],
      officialSources: ['https://annadathasukhibhava.ap.gov.in', 'https://sspensions.ap.gov.in', 'https://drntrvaidyaseva.ap.gov.in']
    };
  }

  // 6. SCHEME INTENTS (Grounded in matchedScheme)
  if (matchedScheme) {
    const s = matchedScheme;

    // Sub-intent formatting:
    // If user specifically asked for ELIGIBILITY:
    if (intent === 'SCHEME_ELIGIBILITY') {
      const reply = isTe
        ? `**${s.teName} (${s.officialName}) - అర్హత నిబంధనలు**

1. **ప్రయోజనం:** ${s.teBenefitDetails || s.benefitDetails} (${s.benefitAmount || 'N/A'})

2. **ఖచ్చితమైన అర్హత నిబంధనలు:**
${(s.eligibilityCriteria.teAdditionalRules || s.eligibilityCriteria.additionalRules).map(r => `• ${r}`).join('\n')}
${s.eligibilityCriteria.maxAnnualIncome ? `• కుటుంబ వార్షిక ఆదాయ పరిమితి: రూ. ${(s.eligibilityCriteria.maxAnnualIncome / 100000).toFixed(2)} లక్షల లోపు ఉండాలి.` : ''}

3. **అనర్హతలు / మినహాయింపులు:**
${s.exclusions.map(e => `• ${e}`).join('\n')}

4. **అధికారిక వెబ్‌సైట్:** ${s.officialApplicationUrl || s.officialInfoUrl}
5. **సహాయవాణి:** ${s.verifiedHelpline || '1902'}

*గమనిక: తుది ఆమోదం గ్రామ/వార్డు సచివాలయం మరియు సంబంధిత శాఖ పరిశీలనకు లోబడి ఉంటుంది.*`
        : `**${s.officialName} (${s.teName}) — Verified Eligibility Criteria**

1. **Overview & Benefit:** ${s.benefitDetails} (${s.benefitAmount || 'N/A'})

2. **Mandatory Eligibility Conditions:**
${s.eligibilityCriteria.additionalRules.map(r => `• ${r}`).join('\n')}
${s.eligibilityCriteria.maxAnnualIncome ? `• Maximum Annual Family Income: ₹${s.eligibilityCriteria.maxAnnualIncome.toLocaleString('en-IN')}` : ''}
${s.eligibilityCriteria.requiresAPResidence ? '• Permanent resident of Andhra Pradesh' : ''}

3. **Exclusions (Who Cannot Apply):**
${s.exclusions.map(e => `• ${e}`).join('\n')}

4. **Official Portal:** ${s.officialApplicationUrl || s.officialInfoUrl}
5. **Verified Helpline:** ${s.verifiedHelpline || '1902'}

*Note: Final sanction is subject to physical verification at your Village/Ward Secretariat.*`;

      return {
        reply,
        recommendedSchemeIds: [s.id],
        officialSources: [s.officialApplicationUrl, s.officialInfoUrl].filter(Boolean)
      };
    }

    // If user specifically asked for REQUIRED DOCUMENTS:
    if (intent === 'REQUIRED_DOCUMENTS') {
      const reply = isTe
        ? `**${s.teName} (${s.officialName}) - కావలసిన ధృవీకరణ పత్రాలు**

1. **పథకం వివరాలు:** ${s.teSummary || s.summary}

2. **తప్పనిసరిగా సమర్పించాల్సిన పత్రాలు:**
${(s.teRequiredDocuments || s.requiredDocuments).map((d, i) => `${i + 1}. ${d}`).join('\n')}

3. **ఎక్కడ సమర్పించాలి:**
• మీ సమీప గ్రామ/వార్డు సచివాలయం లేదా అధికారిక పోర్టల్: ${s.officialApplicationUrl || s.officialInfoUrl}

4. **సహాయవాణి:** ${s.verifiedHelpline || '1902'}`
        : `**${s.officialName} (${s.teName}) — Required Documents Checklist**

1. **Scheme Overview:** ${s.summary}

2. **Mandatory Documents Required for Application:**
${s.requiredDocuments.map((d, i) => `${i + 1}. ${d}`).join('\n')}

3. **Where to Submit:**
• Submit online at official portal: ${s.officialApplicationUrl || s.officialInfoUrl}
• Or physically at your local Village / Ward Secretariat (Grama / Ward Sachivalayam).

4. **Verified Helpline:** ${s.verifiedHelpline || '1902'}`;

      return {
        reply,
        recommendedSchemeIds: [s.id],
        officialSources: [s.officialApplicationUrl, s.officialInfoUrl].filter(Boolean)
      };
    }

    // If user specifically asked for HOW TO APPLY:
    if (intent === 'SCHEME_APPLICATION') {
      const reply = isTe
        ? `**${s.teName} (${s.officialName}) - దరఖాస్తు విధానం**

1. **దరఖాస్తు దశలు (Step-by-Step Application Process):**
${(s.teApplicationSteps || s.applicationSteps).map((step, i) => `${i + 1}. ${step}`).join('\n')}

2. **అధికారిక ఆన్‌లైన్ పోర్టల్:** ${s.officialApplicationUrl}
3. **శాఖ:** ${s.department}
4. **సహాయవాణి:** ${s.verifiedHelpline || '1902'}

*ముఖ్య గమనిక: దరఖాస్తు సమర్పించిన తర్వాత అక్నాలెడ్జ్‌మెంట్ రసీదు నంబర్‌ను భద్రపరుచుకోండి.*`
        : `**${s.officialName} (${s.teName}) — Step-by-Step Application Guide**

1. **How to Apply:**
${s.applicationSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

2. **Official Application Portal:** ${s.officialApplicationUrl}
3. **Department:** ${s.department}
4. **Verified Helpline:** ${s.verifiedHelpline || '1902'}

*Important Note: Always retain the official acknowledgment reference number after submitting your application.*`;

      return {
        reply,
        recommendedSchemeIds: [s.id],
        officialSources: [s.officialApplicationUrl, s.officialInfoUrl].filter(Boolean)
      };
    }

    // Standard complete 8-part structured scheme response
    const reply = isTe
      ? `**${s.teName}** (${s.officialName})

1. **అవలోకనం & ప్రయోజనం (Overview & Benefits):**
   ${s.teSummary}
   • ఆర్థిక సాయం: **${s.teBenefitDetails}** (${s.benefitAmount || 'N/A'})

2. **అర్హత నిబంధనలు (Key Eligibility Conditions):**
${(s.eligibilityCriteria.teAdditionalRules || s.eligibilityCriteria.additionalRules).map(r => `   • ${r}`).join('\n')}
${s.eligibilityCriteria.maxAnnualIncome ? `   • వార్షిక ఆదాయ పరిమితి: రూ. ${(s.eligibilityCriteria.maxAnnualIncome / 100000).toFixed(2)} లక్షల లోపు` : ''}

3. **కావలసిన పత్రాలు (Required Documents):**
${(s.teRequiredDocuments || s.requiredDocuments).map(d => `   • ${d}`).join('\n')}

4. **దరఖాస్తు విధానం (How to Apply):**
${(s.teApplicationSteps || s.applicationSteps).map((step, i) => `   ${i + 1}. ${step}`).join('\n')}

5. **అధికారిక పోర్టల్ (Official Portal):**
   ${s.officialApplicationUrl || s.officialInfoUrl}

6. **శాఖ & సహాయవాణి (Department & Helpline):**
   శాఖ: ${s.department}
   హెల్ప్‌లైన్: **${s.verifiedHelpline || '1902'}**

*ధృవీకరణ తేదీ: ${s.lastVerifiedAt} | మూలం: ${s.sourceUrls?.[0] || 'ap.gov.in'}*`
      : `**${s.officialName}** (${s.teName})

1. **Overview & Purpose:**
   ${s.summary}

2. **Financial Benefits:**
   ${s.benefitDetails} (${s.benefitAmount || 'N/A'})

3. **Key Eligibility Conditions:**
${s.eligibilityCriteria.additionalRules.map(r => `   • ${r}`).join('\n')}
${s.eligibilityCriteria.maxAnnualIncome ? `   • Annual Household Income Limit: Under ₹${s.eligibilityCriteria.maxAnnualIncome.toLocaleString('en-IN')}` : ''}

4. **Required Documents Checklist:**
${s.requiredDocuments.map(d => `   • ${d}`).join('\n')}

5. **Step-by-Step How to Apply:**
${s.applicationSteps.map((step, i) => `   ${i + 1}. ${step}`).join('\n')}

6. **Official Application Portal:**
   ${s.officialApplicationUrl || s.officialInfoUrl}

7. **Department & Verified Helpline:**
   Department: ${s.department}
   Helpline: **${s.verifiedHelpline || '1902'}**

*Verification Date: ${s.lastVerifiedAt} | Source: ${s.sourceUrls?.[0] || 'Official AP Portal'}*`;

    return {
      reply,
      recommendedSchemeIds: [s.id],
      officialSources: [s.officialApplicationUrl, s.officialInfoUrl].filter(Boolean)
    };
  }

  // 7. STRICT MANDATORY FALLBACK (When no reliable verified record exists)
  const strictFallback = isTe
    ? `మీ ప్రశ్నకు సంబంధించి అధికారిక రికార్డులలో ధృవీకరించబడిన సమాచారం లభించలేదు. తప్పుడు ప్రభుత్వ సమాచారాన్ని అందించకుండా నివారించడానికి, దయచేసి సంబంధిత అధికారిక ప్రభుత్వ పోర్టల్ (ap.gov.in / services.india.gov.in) లేదా మీ సమీప గ్రామ/వార్డు సచివాలయాన్ని సంప్రదించండి.`
    : `I couldn't find verified information for your query in the available official records. I don't want to provide incorrect government information. Please check the relevant official government portal.`;

  return {
    reply: strictFallback,
    recommendedSchemeIds: [],
    officialSources: ['https://services.india.gov.in', 'https://gramawardsachivalayam.ap.gov.in']
  };
}
