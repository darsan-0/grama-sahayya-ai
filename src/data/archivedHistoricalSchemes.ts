import { Scheme } from '../types';

/**
 * ARCHIVED HISTORICAL SCHEMES
 * 
 * Secure archive of historical and previous administration schemes excluded from public listings
 * per catalogue policy. Preserved for administrative audit, research, and data integrity.
 * These records are strictly excluded from public queries, public search, and citizen chatbots.
 */
export const ARCHIVED_HISTORICAL_SCHEMES: (Scheme & {
  isArchivedHistorical: boolean;
  archivedAt: string;
  archiveReason: string;
  publicSuccessorSchemeId?: string;
})[] = [
  {
    id: 'dr-ysr-aarogyasri-ayushman-bharat',
    officialName: 'Dr. YSR Aarogyasri & Ayushman Bharat PM-JAY (Historical Record)',
    teName: 'డా. వైఎస్సార్ ఆరోగ్యశ్రీ పథకం (ఆర్కైవ్ చేయబడిన రికార్డు)',
    hiName: 'डॉ. वाईएसआर आरोग्यश्री योजना (पुरालेख रिकॉर्ड)',
    department: 'Dr. YSR Aarogyasri Health Care Trust, Department of Health, Medical & Family Welfare, Govt. of Andhra Pradesh',
    responsibleMinistry: 'Health, Medical & Family Welfare Department, Andhra Pradesh',
    govLevel: 'state',
    state: 'Andhra Pradesh',
    category: 'health',
    summary: 'Historical health assurance scheme providing tertiary medical care across network hospitals in Andhra Pradesh.',
    teSummary: 'నెట్‌వర్క్ ఆసుపత్రులలో ఉచిత నగదు రహిత వైద్య చికిత్స అందించిన పూర్వ ఆరోగ్య పథకం.',
    description: 'Historical entry for Dr. YSR Aarogyasri Health Care Trust. Archived from public catalogue and transitioned to Dr. NTR Vaidya Seva (Universal Health Insurance & Ayushman Bharat PM-JAY) under current state administration.',
    teDescription: 'డా. వైఎస్సార్ ఆరోగ్యశ్రీ పథకం చారిత్రక రికార్డు. ప్రజా కేటలాగ్ నుండి ఆర్కైవ్ చేయబడింది; ప్రస్తుతం డాక్టర్ ఎన్టీఆర్ వైద్య సేవ ద్వారా పౌరులకు ఉచిత వైద్యం అందించబడుతోంది.',
    benefitDetails: 'Historical coverage up to ₹25,00,000 per family per annum for empanelled procedures.',
    teBenefitDetails: 'కుటుంబానికి ఏడాదికి గరిష్టంగా రూ. 25 లక్షల వరకు నగదు రహిత చికిత్స.',
    benefitAmount: 'Up to ₹25,00,000 per family / year',
    eligibilityCriteria: {
      minAge: 0,
      maxAge: 100,
      gender: 'all',
      maxAnnualIncome: 500000,
      requiresAPResidence: true,
      additionalRules: [
        'Historical rule: Valid White Rice Card or Aarogyasri Health Card.',
        'Household income below ₹5.00 Lakhs per annum.'
      ],
      teAdditionalRules: [
        'చారిత్రక నిబంధన: చెల్లుబాటు అయ్యే తెల్ల రేషన్ కార్డు.',
        'వార్షిక ఆదాయం రూ. 5.00 లక్షల లోపు.'
      ]
    },
    exclusions: ['Central/State Government regular employees covered under EHS'],
    requiredDocuments: [
      'Aadhaar Card',
      'White Rice Card',
      'Hospital Outpatient Slip'
    ],
    teRequiredDocuments: [
      'ఆధార్ కార్డు',
      'బియ్యం కార్డు',
      'ఆసుపత్రి ఓపీ స్లిప్'
    ],
    applicationSteps: [
      'Archived historical reference only.'
    ],
    teApplicationSteps: [
      'ఆర్కైవ్ చేయబడిన చారిత్రక సూచన మాత్రమే.'
    ],
    officialApplicationUrl: 'https://drntrvaidyaseva.ap.gov.in',
    officialInfoUrl: 'https://drntrvaidyaseva.ap.gov.in',
    sourceUrls: [
      'https://drntrvaidyaseva.ap.gov.in',
      'https://gramawardsachivalayam.ap.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'REPLACED_OR_MERGED',
    applicationWindowStatus: 'closed',
    historicalAliases: ['Dr. YSR Aarogyasri', 'Aarogyasri Health Scheme', 'వైఎస్సార్ ఆరోగ్యశ్రీ'],
    verificationSourceType: 'ap_gov_portal',
    published: false,
    isArchivedHistorical: true,
    archivedAt: '2026-10-15T00:00:00Z',
    archiveReason: 'Excluded from public-facing catalogue per YSR-branding exclusion policy; replaced by Dr. NTR Vaidya Seva in public listings.',
    publicSuccessorSchemeId: 'dr-ntr-vaidya-seva-ap',
    verifiedHelpline: '104 / 1902'
  },
  {
    id: 'ysr-cheyutha',
    officialName: 'YSR Cheyutha (Financial Aid for Women Aged 45-60) [Archived]',
    teName: 'వైఎస్సార్ చేయూత పథకం (ఆర్కైవ్ చేయబడిన రికార్డు)',
    hiName: 'वाईएसआर चेयुथा योजना (पुरालेख रिकॉर्ड)',
    department: 'Social Welfare & BC Welfare Departments, Govt. of Andhra Pradesh',
    responsibleMinistry: 'Social Welfare Department, Andhra Pradesh',
    govLevel: 'state',
    state: 'Andhra Pradesh',
    category: 'women_shg',
    summary: 'Historical financial assistance of ₹18,750 per year (total ₹75,000 over 4 years) for women aged 45-60 belonging to SC, ST, BC, and Minority communities.',
    teSummary: '45 నుండి 60 ఏళ్ల ఎస్సీ, ఎస్టీ, బీసీ, మైనారిటీ మహిళలకు ఏటా రూ. 18,750 ఆర్థిక సహాయం అందించిన పూర్వ పథకం.',
    description: 'YSR Cheyutha provided financial assistance of ₹75,000 in four equal tranches to women aged 45-60. Preserved in administrative archive and excluded from public listings.',
    teDescription: 'వైఎస్సార్ చేయూత పథకం చారిత్రక రికార్డు. ప్రజా కేటలాగ్ నుండి ఆర్కైవ్ చేయబడింది.',
    benefitDetails: '₹18,750 per annum direct cash transfer into the woman\'s bank account.',
    teBenefitDetails: 'ఏటా రూ. 18,750 నేరుగా మహిళల బ్యాంక్ ఖాతాలో జమ.',
    benefitAmount: '₹18,750 / year (₹75,000 in 4 years)',
    eligibilityCriteria: {
      minAge: 45,
      maxAge: 60,
      gender: 'female',
      maxAnnualIncome: 120000,
      socialCategories: ['SC', 'ST', 'BC', 'Minority'],
      requiresAPResidence: true,
      additionalRules: [
        'Must be a woman aged 45 to 60 as per verified Aadhaar / Voter records.',
        'Integrated caste certificate for SC/ST/BC/Minority.'
      ],
      teAdditionalRules: [
        'వయస్సు 45 నుండి 60 ఏళ్ల మధ్య ఉన్న మహిళలు.',
        'ఎస్సీ, ఎస్టీ, బీసీ లేదా మైనారిటీ వర్గానికి చెందినవారు.'
      ]
    },
    exclusions: ['Government employees/pensioner families', 'Income tax paying families'],
    requiredDocuments: [
      'Aadhaar Card of Applicant',
      'Integrated Caste Certificate',
      'White Rice Card',
      'Bank Account Passbook'
    ],
    teRequiredDocuments: [
      'మహిళ ఆధార్ కార్డు',
      'కుల ధృవీకరణ పత్రం',
      'రైస్ కార్డు'
    ],
    applicationSteps: [
      'Historical record only. Public applications closed on this platform.'
    ],
    teApplicationSteps: [
      'చారిత్రక రికార్డు మాత్రమే. ఈ ప్లాట్‌ఫారమ్‌లో పౌర దరఖాస్తులు నిలిపివేయబడ్డాయి.'
    ],
    officialApplicationUrl: 'https://gramawardsachivalayam.ap.gov.in',
    officialInfoUrl: 'https://gramawardsachivalayam.ap.gov.in',
    sourceUrls: [
      'https://gramawardsachivalayam.ap.gov.in',
      'https://socialwelfare.ap.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'DISCONTINUED',
    applicationWindowStatus: 'closed',
    historicalAliases: ['YSR Cheyutha', 'Cheyutha', 'వైఎస్సార్ చేయూత'],
    verificationSourceType: 'ap_gov_portal',
    published: false,
    isArchivedHistorical: true,
    archivedAt: '2026-10-15T00:00:00Z',
    archiveReason: 'Excluded from public-facing catalogue per YSR-branding exclusion policy.',
    publicSuccessorSchemeId: 'aadabidda-nidhi-ap',
    verifiedHelpline: '1902'
  },
  {
    id: 'ysr-aasara',
    officialName: 'YSR Aasara (SHG DWCRA Bank Loan Reimbursement) [Archived]',
    teName: 'వైఎస్సార్ ఆసరా డ్వాక్రా రుణ పథకం (ఆర్కైవ్ చేయబడిన రికార్డు)',
    hiName: 'वाईएसआर आसरा योजना (पुरालेख रिकॉर्ड)',
    department: 'Society for Elimination of Rural Poverty (SERP) & MEPMA, Govt. of Andhra Pradesh',
    responsibleMinistry: 'Department of Rural Development & SERP, Andhra Pradesh',
    govLevel: 'state',
    state: 'Andhra Pradesh',
    category: 'women_shg',
    summary: 'Direct financial reimbursement of outstanding bank loans of Women Self Help Groups (SHGs / DWCRA) in four annual installments.',
    teSummary: 'డ్వాక్రా సంఘాల బ్యాంకు రుణ బకాయిలను నాలుగు విడతల్లో జమ చేసిన పూర్వ పథకం.',
    description: 'YSR Aasara reimbursed outstanding bank loan balances of DWCRA SHG groups. Preserved in administrative archive and excluded from public listings.',
    teDescription: 'వైఎస్సార్ ఆసరా పథకం చారిత్రక రికార్డు. ప్రజా కేటలాగ్ నుండి ఆర్కైవ్ చేయబడింది.',
    benefitDetails: 'Direct reimbursement of eligible SHG loan amount divided across four annual installments.',
    teBenefitDetails: 'డ్వాక్రా రుణ బకాయి మొత్తం నాలుగు విడతల్లో జమ.',
    benefitAmount: 'SHG Loan Reimbursement Tranches',
    eligibilityCriteria: {
      minAge: 18,
      gender: 'female',
      requiresAPResidence: true,
      additionalRules: [
        'Active member of recognized DWCRA / SHG as of 11th April 2019.',
        'Loan verified on SERP / MEPMA portal.'
      ],
      teAdditionalRules: [
        'డ్వాక్రా సంఘంలో సభ్యురాలై ఉండాలి.',
        'బ్యాంకు రుణ బకాయి SERP పోర్టల్‌లో నమోదై ఉండాలి.'
      ]
    },
    exclusions: ['Defaulted private micro-finance loans'],
    requiredDocuments: [
      'Aadhaar Card',
      'SHG Passbook / Group ID',
      'Individual Savings Bank Passbook'
    ],
    teRequiredDocuments: [
      'ఆధార్ కార్డు',
      'డ్వాక్రా గ్రూప్ ఐడీ',
      'బ్యాంక్ పాస్‌బుక్'
    ],
    applicationSteps: [
      'Historical record only. Public applications closed.'
    ],
    teApplicationSteps: [
      'చారిత్రక రికార్డు మాత్రమే. దరఖాస్తులు ముగిశాయి.'
    ],
    officialApplicationUrl: 'https://gramawardsachivalayam.ap.gov.in',
    officialInfoUrl: 'https://gramawardsachivalayam.ap.gov.in',
    sourceUrls: [
      'https://gramawardsachivalayam.ap.gov.in',
      'https://mepma.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'DISCONTINUED',
    applicationWindowStatus: 'closed',
    historicalAliases: ['YSR Aasara', 'Aasara DWCRA', 'వైఎస్సార్ ఆసరా'],
    verificationSourceType: 'ap_gov_portal',
    published: false,
    isArchivedHistorical: true,
    archivedAt: '2026-10-15T00:00:00Z',
    archiveReason: 'Excluded from public-facing catalogue per YSR-branding exclusion policy.',
    publicSuccessorSchemeId: 'aadabidda-nidhi-ap',
    verifiedHelpline: '1902'
  },
  {
    id: 'ysr-rythu-bharosa-pm-kisan',
    officialName: 'YSR Rythu Bharosa - PM KISAN (Historical Predecessor)',
    teName: 'వైఎస్సార్ రైతు భరోసా - పీఎం కిసాన్ (పూర్వ రికార్డు)',
    hiName: 'वाईएसआर रायथू भरोसा (पूर्व रिकॉर्ड)',
    department: 'Department of Agriculture, Govt. of Andhra Pradesh',
    responsibleMinistry: 'Agriculture Department, Andhra Pradesh',
    govLevel: 'state',
    state: 'Andhra Pradesh',
    category: 'agriculture',
    summary: 'Previous farm investment support program of ₹13,500/year, enhanced and superseded by Annadata Sukhibhava (₹20,000/year).',
    teSummary: 'రైతులకు ఏటా రూ. 13,500 అందించిన పూర్వ పథకం. ప్రస్తుతం అన్నదాత సుఖీభవ (రూ. 20,000) గా అమలు చేయబడుతోంది.',
    description: 'Historical agricultural assistance program. Preserved for audit; superseded by Annadata Sukhibhava & PM-KISAN in the public catalogue.',
    teDescription: 'చారిత్రక వ్యవసాయ సహాయ పథకం. అన్నదాత సుఖీభవ ద్వారా పునఃరూపకల్పన చేయబడింది.',
    benefitDetails: 'Historical ₹13,500/year investment support.',
    teBenefitDetails: 'గతంలో అందించిన రూ. 13,500 పెట్టుబడి సాయం.',
    benefitAmount: '₹13,500 per year (Historical)',
    eligibilityCriteria: {
      minAge: 18,
      farmerStatus: true,
      requiresAPResidence: true,
      additionalRules: ['Cultivating agricultural landholder or tenant.'],
      teAdditionalRules: ['సాగు భూమి కలిగిన రైతు లేదా కౌలు రైతు.']
    },
    exclusions: ['Institutional landholders', 'Income tax payers'],
    requiredDocuments: ['Aadhaar Card', 'Pattadar Passbook'],
    teRequiredDocuments: ['ఆధార్ కార్డు', 'పట్టాదారు పాస్‌బుక్'],
    applicationSteps: ['Archived historical record.'],
    teApplicationSteps: ['ఆర్కైవ్ చేయబడిన రికార్డు.'],
    officialApplicationUrl: 'https://annadathasukhibhava.ap.gov.in',
    officialInfoUrl: 'https://annadathasukhibhava.ap.gov.in',
    sourceUrls: ['https://annadathasukhibhava.ap.gov.in'],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'REPLACED_OR_MERGED',
    applicationWindowStatus: 'closed',
    historicalAliases: ['YSR Rythu Bharosa', 'వైఎస్సార్ రైతు భరోసా'],
    verificationSourceType: 'ap_gov_portal',
    published: false,
    isArchivedHistorical: true,
    archivedAt: '2026-10-15T00:00:00Z',
    archiveReason: 'Excluded from public catalogue per YSR-branding policy; superseded by Annadata Sukhibhava & PM-KISAN.',
    publicSuccessorSchemeId: 'annadata-sukhibhava-ap',
    verifiedHelpline: '1902'
  },
  {
    id: 'ysr-pension-kanuka',
    officialName: 'YSR Pension Kanuka (Historical Predecessor)',
    teName: 'వైఎస్సార్ పింఛన్ కానుక (పూర్వ రికార్డు)',
    hiName: 'वाईएसआर पेंशन कनुका (पूर्व रिकॉर्ड)',
    department: 'Society for Elimination of Rural Poverty (SERP), Govt. of Andhra Pradesh',
    responsibleMinistry: 'Department of Rural Development, Andhra Pradesh',
    govLevel: 'state',
    state: 'Andhra Pradesh',
    category: 'pensions',
    summary: 'Previous social security pension program providing ₹3,000/month, superseded and enhanced to ₹4,000/month by NTR Bharosa Pension.',
    teSummary: 'గతంలో రూ. 3,000 అందించిన పింఛను పథకం. ప్రస్తుతం ఎన్టీఆర్ భరోసా ద్వారా నెలకు రూ. 4,000 గా పెంచబడింది.',
    description: 'Historical pension program. Preserved for audit; superseded by NTR Bharosa Social Security Pension in the public catalogue.',
    teDescription: 'చారిత్రక సామాజిక పింఛను పథకం. ఎన్టీఆర్ భరోసా పింఛను పథకం ద్వారా రూ. 4,000 కు పెంచబడింది.',
    benefitDetails: 'Historical ₹3,000/month pension.',
    teBenefitDetails: 'గతంలో నెలకు రూ. 3,000 పింఛన్.',
    benefitAmount: '₹3,000 / month (Historical)',
    eligibilityCriteria: {
      minAge: 60,
      maxAnnualIncome: 120000,
      requiresAPResidence: true,
      additionalRules: ['Historical pension rule.'],
      teAdditionalRules: ['చారిత్రక పింఛను నిబంధన.']
    },
    exclusions: ['Government pension recipients'],
    requiredDocuments: ['Aadhaar Card', 'Age Proof'],
    teRequiredDocuments: ['ఆధార్ కార్డు', 'వయస్సు ధృవీకరణ పత్రం'],
    applicationSteps: ['Archived historical record.'],
    teApplicationSteps: ['ఆర్కైవ్ చేయబడిన రికార్డు.'],
    officialApplicationUrl: 'https://sspensions.ap.gov.in',
    officialInfoUrl: 'https://sspensions.ap.gov.in',
    sourceUrls: ['https://sspensions.ap.gov.in'],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'REPLACED_OR_MERGED',
    applicationWindowStatus: 'closed',
    historicalAliases: ['YSR Pension Kanuka', 'వైఎస్సార్ పింఛన్ కానుక'],
    verificationSourceType: 'ap_gov_portal',
    published: false,
    isArchivedHistorical: true,
    archivedAt: '2026-10-15T00:00:00Z',
    archiveReason: 'Excluded from public catalogue per YSR-branding policy; superseded by NTR Bharosa Pension Scheme.',
    publicSuccessorSchemeId: 'ntr-bharosa-pension-ap',
    verifiedHelpline: '1902'
  }
];
