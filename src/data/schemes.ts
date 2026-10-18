import { Scheme } from '../types';

export const VERIFIED_SCHEMES: Scheme[] = [
  {
    id: 'talliki-vandanam-ap',
    officialName: 'Talliki Vandanam Scheme (School Education Financial Assistance)',
    teName: 'తల్లికి వందనం పథకం (పాఠశాల విద్యా ఆర్థిక ప్రోత్సాహకం)',
    hiName: 'तल्लिकी वंदनम योजना (मातृ एवं स्कूली शिक्षा सहायता)',
    department: 'School Education Department, Govt. of Andhra Pradesh',
    responsibleMinistry: 'School Education Department, Andhra Pradesh',
    govLevel: 'state',
    state: 'Andhra Pradesh',
    category: 'education',
    summary: 'Annual financial support of ₹15,000 to eligible mothers for sending children to recognized schools or junior colleges from Class 1 to Class 12.',
    teSummary: '1వ తరగతి నుండి 12వ (ఇంటర్మీడియట్) తరగతి వరకు పాఠశాల లేదా కళాశాలకు పిల్లలను పంపే ప్రతి అర్హతగల తల్లికి ఏటా రూ. 15,000 ఆర్థిక సహాయం.',
    description: 'Talliki Vandanam is Andhra Pradesh\'s flagship educational welfare scheme designed to eliminate child labor, reduce school dropout rates, and empower mothers by providing direct financial assistance of ₹15,000 per school-going child. Successor program building upon the school-level Amma Vodi foundation with updated administrative guidelines.',
    teDescription: 'పేదరికం వల్ల ఏ పిల్లాడూ బడికి దూరం కాకూడదనే లక్ష్యంతో ఆంధ్రప్రదేశ్ ప్రభుత్వం అమలు చేస్తున్న ప్రతిష్టాత్మక పథకం. 1 నుంచి ఇంటర్ వరకు చదివే పిల్లల తల్లుల ఖాతాల్లో ఏటా రూ. 15,000 జమ చేయబడుతుంది.',
    benefitDetails: '₹15,000 annual direct cash transfer credited directly to the verified Aadhaar-seeded bank account of the mother or legal guardian.',
    teBenefitDetails: 'ఏటా రూ. 15,000 నేరుగా తల్లి లేదా చట్టబద్ధమైన సంరక్షకురాలి ఆధార్ అనుసంధాన బ్యాంక్ ఖాతాలో జమ.',
    benefitAmount: '₹15,000 per annum',
    eligibilityCriteria: {
      minAge: 5,
      maxAge: 18,
      gender: 'all',
      maxAnnualIncome: 250000,
      educationLevels: ['Primary School', 'High School', 'Intermediate (11th & 12th)'],
      socialCategories: ['SC', 'ST', 'BC', 'EWS', 'Kapu', 'Minority', 'Differently Abled', 'General BPL'],
      requiresAPResidence: true,
      additionalRules: [
        'Child must be studying in a recognized government, aided, or private school/junior college in Andhra Pradesh.',
        'Student must maintain minimum 75% school/college attendance.',
        'Household must hold an active BPL Rice Card or Meeseva Income Certificate below ₹2.50 Lakhs.',
        'Mother must have an active bank account linked with Aadhaar and NPCI mapping.'
      ],
      teAdditionalRules: [
        'ఆంధ్రప్రదేశ్‌లోని గుర్తింపు పొందిన ప్రభుత్వ, ఎయిడెడ్ లేదా ప్రైవేట్ పాఠశాల/జూనియర్ కళాశాలలో చదువుతూ ఉండాలి.',
        'విద్యార్థికి కనీసం 75% పాఠశాల హాజరు ఉండాలి.',
        'కుటుంబానికి చెల్లుబాటు అయ్యే రైస్ కార్డు లేదా రూ. 2.50 లక్షల లోపు ఆదాయ ధృవీకరణ పత్రం ఉండాలి.',
        'తల్లి బ్యాంక్ ఖాతాకు ఆధార్ మరియు NPCI సీడింగ్ పూర్తయి ఉండాలి.'
      ]
    },
    exclusions: [
      'Children enrolled in unrecognized educational institutions',
      'Central or State Government regular employees (except sanitation workers)',
      'Income Tax payers in the family'
    ],
    requiredDocuments: [
      'Aadhaar Card of Student and Mother',
      'Active BPL Rice Card / Ration Card',
      'School/College Bonafide Certificate with U-DISE Code',
      'Mother\'s Bank Account Passbook (Aadhaar & NPCI Seeded)',
      'Child\'s Birth Certificate or School Admission Record'
    ],
    teRequiredDocuments: [
      'విద్యార్థి మరియు తల్లి ఆధార్ కార్డులు',
      'ప్రస్తుత బియ్యం కార్డు (Rice Card / Ration Card)',
      'పాఠశాల బోనఫైడ్ సర్టిఫికెట్ (U-DISE కోడ్‌తో)',
      'తల్లి బ్యాంక్ పాస్‌బుక్ (NPCI సీడింగ్ చేయబడినది)',
      'విద్యార్థి పుట్టిన తేదీ ధృవీకరణ పత్రం'
    ],
    applicationSteps: [
      'School headmaster/principal uploads student and mother data via Child Info / Student Attendance portal.',
      'Data verification conducted through Village/Ward Secretariat (Grama/Ward Sachivalayam) Welfare Assistant.',
      'Field verification of eligibility, Rice card, and bank seeding.',
      'Draft eligibility list displayed at Village Secretariat for social audit and objections.',
      'Approved funds disbursed directly into the mother\'s verified bank account.'
    ],
    teApplicationSteps: [
      'పాఠశాల ప్రధానోపాధ్యాయులు చైల్డ్ ఇన్ఫో పోర్టల్ ద్వారా విద్యార్థి వివరాలను నమోదు చేస్తారు.',
      'గ్రామ/వార్డు సచివాలయ సంక్షేమ సహాయకుడి ద్వారా వివరాల పరిశీలన.',
      'రేషన్ కార్డు, హాజరు మరియు బ్యాంక్ ఖాతా అర్హత ధృవీకరణ.',
      'సచివాలయంలో సామాజిక తనిఖీ (Social Audit) కోసం అర్హుల జాబితా ప్రదర్శన.',
      'తల్లి ఆధార్ అనుసంధాన బ్యాంక్ ఖాతాలో నిధుల జమ.'
    ],
    officialApplicationUrl: 'https://gramawardsachivalayam.ap.gov.in',
    officialInfoUrl: 'https://jnanabhumi.ap.gov.in',
    sourceUrls: [
      'https://jnanabhumi.ap.gov.in',
      'https://gramawardsachivalayam.ap.gov.in',
      'https://apfinance.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'UPDATED',
    applicationWindowStatus: 'scheduled',
    historicalAliases: ['Jagananna Amma Vodi', 'Amma Vodi', 'తల్లికి వందనం', 'అమ్మ ఒడి'],
    predecessorOrMergedWith: 'jagananna-amma-vodi',
    verificationSourceType: 'ap_gov_portal',
    published: true,
    deadline: 'Annual Academic Cycle (June - July)',
    renewalPeriod: 'Annual',
    verifiedHelpline: '1902 (AP GSWS Helpline) / 14417 (School Education)'
  },
  {
    id: 'ntr-bharosa-pension-ap',
    officialName: 'NTR Bharosa Social Security Pension Scheme',
    teName: 'ఎన్టీఆర్ భరోసా సామాజిక భద్రతా పింఛను పథకం',
    hiName: 'एनटीआर भरोसा सामाजिक सुरक्षा पेंशन योजना',
    department: 'Panchayat Raj & Rural Development Department (SERP), Govt. of Andhra Pradesh',
    responsibleMinistry: 'Department of Rural Development, Andhra Pradesh',
    govLevel: 'state',
    state: 'Andhra Pradesh',
    category: 'pensions',
    summary: 'Enhanced monthly social security pension of ₹4,000 for elderly, widows, single women, weavers, and up to ₹15,000 for persons with severe disabilities.',
    teSummary: 'వృద్ధులు, వితంతువులు, ఒంటరి మహిళలు, నేత కార్మికులకు నెలకు రూ. 4,000 మరియు దివ్యాంగులకు నెలకు రూ. 6,000 నుండి రూ. 15,000 వరకు ఆర్థిక పింఛను.',
    description: 'NTR Bharosa Social Security Pension provides dignified monthly financial security to marginalized sections. Old Age, Widow, Weavers, Toddy Tappers, Fishermen, Single Women, and Traditional Cobblers receive ₹4,000/month (enhanced from former rate). Differently Abled Persons receive ₹6,000/month. Completely bedridden or severe health conditions receive ₹10,000 to ₹15,000/month.',
    teDescription: 'నిరుపేదలు, వృద్ధులు మరియు బలహీన వర్గాల ఆత్మగౌరవాన్ని కాపాడేందుకు ఆంధ్రప్రదేశ్ ప్రభుత్వం ప్రతి నెలా 1వ తేదీన ఇంటివద్దనే అందించే విశిష్ట పింఛను పథకం. వృద్ధులు, వితంతువుల పింఛను రూ. 4,000కు, దివ్యాంగుల పింఛను రూ. 6,000కు పెంపు.',
    benefitDetails: 'Monthly direct cash pension: OAP, Widows, Weavers: ₹4,000/mo; Differently Abled (40-79%): ₹6,000/mo; Severe disability/bedridden (80%+): ₹15,000/mo; Chronic Kidney Patients: ₹10,000/mo.',
    teBenefitDetails: 'ప్రతినెలా 1వ తేదీన ఇంటివద్దనే పింఛను నగదు పంపిణీ: వృద్ధులు, వితంతువులు రూ. 4,000; దివ్యాంగులు రూ. 6,000; తీవ్రమైన దివ్యాంగులు రూ. 15,000; కిడ్నీ బాధితులు రూ. 10,000.',
    benefitAmount: '₹4,000 - ₹15,000 per month',
    eligibilityCriteria: {
      minAge: 50,
      maxAge: 100,
      gender: 'all',
      maxAnnualIncome: 120000,
      socialCategories: ['SC', 'ST', 'BC', 'Minority', 'OC', 'EWS', 'All BPL'],
      requiresAPResidence: true,
      additionalRules: [
        'Old Age Pension (OAP): Age must be 60 years or above (50 years for Weavers/Toddy Tappers).',
        'Widow Pension: Must possess husband\'s death certificate, age 18 or above.',
        'Disabled Pension: Valid SADAREM medical certificate with minimum 40% disability.',
        'Single Women: Unmarried woman aged 35+ in rural / 30+ in urban, or separated for over 1 year.',
        'Family landholding below 3 acres wetland or 10 acres dry land.'
      ],
      teAdditionalRules: [
        'వృద్ధాప్య పింఛను: కనీస వయస్సు 60 సంవత్సరాలు (చేనేత, గీత కార్మికులకు 50 ఏళ్లు).',
        'వితంతు పింఛను: భర్త మరణ ధృవీకరణ పత్రం ఉండాలి.',
        'దివ్యాంగుల పింఛను: కనీసం 40% సదరం (SADAREM) సర్టిఫికెట్ తప్పనిసరి.',
        'కుటుంబానికి 3 ఎకరాల మాగాణి లేదా 10 ఎకరాల మెట్ట భూమి మించరాదు.'
      ]
    },
    exclusions: [
      'Government employees, retired government pensioners, or their spouses',
      'Income tax paying families',
      'Families owning four-wheeler vehicles (excluding tractors, taxis, auto-rickshaws)'
    ],
    requiredDocuments: [
      'Aadhaar Card of Applicant',
      'Active BPL Rice Card / Ration Card',
      'Age Proof (Voter ID / Birth Certificate / School Certificate)',
      'SADAREM Certificate (mandatory for Differently Abled categories)',
      'Death Certificate of Spouse (mandatory for Widow pension)',
      'Bank Account Passbook / Post Office Savings Account'
    ],
    teRequiredDocuments: [
      'దరఖాస్తుదారుడి ఆధార్ కార్డు',
      'బియ్యం కార్డు (White Rice Card)',
      'వయస్సు ధృవీకరణ పత్రం (ఓటర్ ఐడీ / జనన ధృవీకరణ)',
      'సదరం సర్టిఫికెట్ (దివ్యాంగులకు తప్పనిసరి)',
      'భర్త మరణ ధృవీకరణ పత్రం (వితంతు పింఛనుకు)',
      'బ్యాంక్ ఖాతా లేదా పోస్టాఫీస్ పాస్‌బుక్'
    ],
    applicationSteps: [
      'Visit nearest Grama/Ward Sachivalayam and submit application to Welfare & Education Assistant.',
      'Biometric authentication and verification of demographic/income data.',
      'Field inquiry and cross-verification with civil supplies database.',
      'Approval by Municipal Commissioner (Urban) or MPDO (Rural).',
      'Pension sanctioned and delivered on the 1st of every month at beneficiary doorstep.'
    ],
    teApplicationSteps: [
      'గ్రామ లేదా వార్డు సచివాలయంలో సంక్షేమ సహాయకుడిని సంప్రదించి దరఖాస్తు సమర్పించాలి.',
      'బయోమెట్రిక్ ధృవీకరణ మరియు పత్రాల పరిశీలన.',
      'గ్రామ/వార్డు స్థాయిలో క్షేత్రస్థాయి విచారణ.',
      'ఎంపీడీవో (గ్రామీణ) లేదా మున్సిపల్ కమిషనర్ (పట్టణ) ద్వారా మంజూరు.',
      'ప్రతినెలా 1వ తేదీన ఇంటివద్దకే పింఛను నగదు పంపిణీ.'
    ],
    officialApplicationUrl: 'https://gramawardsachivalayam.ap.gov.in',
    officialInfoUrl: 'https://sspensions.ap.gov.in',
    sourceUrls: [
      'https://sspensions.ap.gov.in',
      'https://gramawardsachivalayam.ap.gov.in',
      'https://apfinance.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'ACTIVE',
    applicationWindowStatus: 'open',
    historicalAliases: ['NTR Bharosa', 'AP Social Security Pensions', 'ఎన్టీఆర్ భరోసా', 'సామాజిక పింఛన్లు'],
    verificationSourceType: 'ap_gov_portal',
    published: true,
    renewalPeriod: 'Continuous (Monthly Doorstep Disbursal)',
    verifiedHelpline: '1902 (AP GSWS Grievance Helpline)'
  },
  {
    id: 'annadata-sukhibhava-ap',
    officialName: 'Annadata Sukhibhava & PM-KISAN Scheme',
    teName: 'అన్నదాత సుఖీభవ మరియు పీఎం-కిసాన్ పథకం',
    hiName: 'अन्नदाता सुखीभव एवं पीएम-किसान योजना',
    department: 'Department of Agriculture & Cooperation, Govt. of Andhra Pradesh & Ministry of Agriculture (GoI)',
    responsibleMinistry: 'Agriculture Department, Andhra Pradesh & Ministry of Agriculture & Farmers Welfare, GoI',
    govLevel: 'state',
    state: 'Andhra Pradesh',
    category: 'agriculture',
    summary: 'Comprehensive annual financial assistance of ₹20,000 for farmer families in Andhra Pradesh (combining State assistance and Central PM-KISAN).',
    teSummary: 'ఆంధ్రప్రదేశ్‌లోని ప్రతి రైతు కుటుంబానికి పెట్టుబడి సాయంగా ఏటా ₹20,000 ఆర్థిక సహాయం (రాష్ట్ర సాయం + కేంద్ర పీఎం కిసాన్ కలిపి).',
    description: 'Annadata Sukhibhava & PM-KISAN provides robust investment support of ₹20,000 per annum to landholder farmers, tenant farmers (CCRC cardholders), and ROFR forest landholders in Andhra Pradesh to purchase quality seeds, fertilizers, and modern farm machinery without falling into informal debt.',
    teDescription: 'రైతులకు పెట్టుబడి భారాన్ని తగ్గించి నాణ్యమైన విత్తనాలు, ఎరువులు కొనుగోలు చేయడానికి ఆంధ్రప్రదేశ్ ప్రభుత్వం మరియు కేంద్ర ప్రభుత్వం సంయుక్తంగా ఏటా రూ. 20,000 సాయం అందిస్తున్నాయి. కౌలు రైతులకు కూడా వర్తిస్తుంది.',
    benefitDetails: '₹20,000 per year per farm family disbursed in installments directly to the farmer\'s Aadhaar-linked bank account (combines State contribution with Central PM-KISAN).',
    teBenefitDetails: 'ఏటా రూ. 20,000 పెట్టుబడి సహాయం నేరుగా రైతు ఆధార్ అనుసంధాన బ్యాంక్ ఖాతాలో విడతలవారీగా జమ.',
    benefitAmount: '₹20,000 per year',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 90,
      gender: 'all',
      farmerStatus: true,
      landHoldingMaxAcres: 25,
      requiresAPResidence: true,
      additionalRules: [
        'Farmer must own cultivable agricultural land registered in Webland / e-Panta database.',
        'Tenant farmers must possess valid Crop Cultivator Rights Card (CCRC) for the current agricultural season.',
        'Tribal cultivators holding RoFR (Recognition of Forest Rights) pattas are fully eligible.',
        'Mandatory e-KYC and land-aadhaar seeding required.'
      ],
      teAdditionalRules: [
        'రైతు పేరున సాగు భూమి రెవెన్యూ వెబ్‌ల్యాండ్ రికార్డులలో నమోదై ఉండాలి.',
        'కౌలు రైతులు ప్రస్తుత సాగు కాలానికి చెల్లుబాటు అయ్యే CCRC కార్డు కలిగి ఉండాలి.',
        'అటవీ హక్కుల పట్టా (RoFR) కలిగిన గిరిజన రైతులు కూడా అర్హులు.',
        'ఈ-కేవైసీ మరియు ఆధార్ సీడింగ్ తప్పనిసరి.'
      ]
    },
    exclusions: [
      'Institutional landholders',
      'Constitutional post holders, former and present Ministers, MPs, MLAs',
      'Serving or retired officers and employees of Central/State Government',
      'Income Tax payers of the previous assessment year'
    ],
    requiredDocuments: [
      'Aadhaar Card of Farmer',
      'Pattadar Passbook / 1-B Record / Webland Extract',
      'CCRC Agreement (for Tenant Farmers)',
      'Active Bank Account Passbook (Aadhaar & NPCI Seeded)',
      'e-Panta Crop Booking Receipt'
    ],
    teRequiredDocuments: [
      'రైతు ఆధార్ కార్డు',
      'పట్టాదారు పాస్‌బుక్ / 1-B రికార్డు',
      'కౌలు రైతు ఒప్పంద పత్రం (CCRC కార్డ్)',
      'బ్యాంక్ ఖాతా పాస్‌బుక్ (NPCI లింక్ అయినది)',
      'ఈ-పంట నమోదు రశీదు'
    ],
    applicationSteps: [
      'Verify land title in Webland portal or obtain CCRC via Village Revenue Officer (VRO).',
      'Register e-Crop (e-Panta) with the Village Agriculture Assistant (VAA) at Rythu Seva Kendram (RSK).',
      'Complete biometric e-KYC verification.',
      'Check provisional beneficiary list published at the local Village Secretariat.',
      'Amount credited directly to Aadhaar-linked account.'
    ],
    teApplicationSteps: [
      'రైతు భరోసా కేంద్రం (RSK) వద్ద గ్రామ వ్యవసాయ సహాయకుడిని సంప్రదించాలి.',
      'ఈ-పంట (e-Crop) ద్వారా సాగు వివరాల నమోదు.',
      'బయోమెట్రిక్ ఈ-కేవైసీ పూర్తి చేయడం.',
      'సచివాలయంలో ప్రదర్శించిన అర్హుల జాబితాలో పేరు పరిశీలన.',
      'బ్యాంక్ ఖాతాలో నిధుల జమ.'
    ],
    officialApplicationUrl: 'https://pmkisan.gov.in',
    officialInfoUrl: 'https://agri.ap.gov.in',
    sourceUrls: [
      'https://agri.ap.gov.in',
      'https://pmkisan.gov.in',
      'https://gramawardsachivalayam.ap.gov.in',
      'https://apfinance.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'ACTIVE',
    applicationWindowStatus: 'open',
    historicalAliases: ['Annadata Sukhibhava', 'AP Farmer Investment Support', 'అన్నదాత సుఖీభవ', 'రైతు పెట్టుబడి సాయం'],
    verificationSourceType: 'ap_gov_portal',
    published: true,
    deadline: 'Crop Season cycles (Kharif & Rabi)',
    renewalPeriod: 'Annual',
    verifiedHelpline: '155251 / 1902 (Kisan Call Center & AP Helpline)'
  },
  {
    id: 'ap-deepam-free-lpg-scheme',
    officialName: 'Deepam 2.0 - Free LPG Cylinders Scheme (Maha Sakthi)',
    teName: 'దీపం 2.0 ఉచిత గ్యాస్ సిలిండర్ల పథకం (మహాశక్తి)',
    hiName: 'दीपम 2.0 मुफ्त एलपीजी सिलेंडर योजना',
    department: 'Consumer Affairs, Food & Civil Supplies Department, Govt. of Andhra Pradesh',
    responsibleMinistry: 'Civil Supplies Department, Andhra Pradesh',
    govLevel: 'state',
    state: 'Andhra Pradesh',
    category: 'women_shg',
    summary: 'Provision of 3 free domestic cooking gas LPG cylinder refills per year for low-income families across Andhra Pradesh.',
    teSummary: 'ఆంధ్రప్రదేశ్‌లోని పేద కుటుంబాలకు ఏటా 3 ఉచిత డొమెస్టిక్ ఎల్‌పీజీ గ్యాస్ సిలిండర్ల రీఫిల్స్ అందించే పథకం.',
    description: 'Deepam 2.0 (launched under the Maha Sakthi empowerment framework in October 2024) provides three free 14.2 kg domestic LPG cylinder refills per year to every eligible household holding an active White Rice Card and a valid domestic gas connection across IOCL, BPCL, and HPCL oil marketing companies. The subsidy amount is refunded within 48 hours into the beneficiary\'s Aadhaar-linked bank account.',
    teDescription: 'మహిళల ఆరోగ్యం మరియు ఆర్థిక స్వావలంబన లక్ష్యంగా ఆంధ్రప్రదేశ్ ప్రభుత్వం ప్రవేశపెట్టిన పథకం. తెల్ల రేషన్ కార్డు కలిగిన కుటుంబాలకు ఏటా 3 వంట గ్యాస్ సిలిండర్లు ఉచితంగా లభిస్తాయి. బుక్ చేసుకుని బిల్లు చెల్లించిన 48 గంటల్లో ప్రభుత్వం సబ్సిడీ సొమ్మును బ్యాంకు ఖాతాలో జమ చేస్తుంది.',
    benefitDetails: 'Full reimbursement for 3 domestic LPG refills per financial year (approx ₹850-₹900 per cylinder credited within 48 hours via DBT).',
    teBenefitDetails: 'ఏటా 3 ఉచిత గ్యాస్ సిలిండర్ల విలువ మొత్తం నేరుగా బ్యాంకు ఖాతాలో 48 గంటల్లో జమ.',
    benefitAmount: '3 Free Cylinders / Year (Approx ₹2,600+ annual benefit)',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 90,
      gender: 'female',
      requiresAPResidence: true,
      additionalRules: [
        'Family must hold an active White Rice Card issued by Andhra Pradesh Civil Supplies Department.',
        'Must possess an active domestic LPG connection in the name of a female family member.',
        'The LPG consumer number must be linked with the beneficiary Aadhaar number.',
        'Bank account must be active with NPCI Aadhaar payment bridge seeding.'
      ],
      teAdditionalRules: [
        'ఆంధ్రప్రదేశ్ ప్రభుత్వం జారీ చేసిన తెల్ల రేషన్ కార్డు (Rice Card) ఉండాలి.',
        'కుటుంబంలోని మహిళ పేరిట డొమెస్టిక్ ఎల్‌పీజీ గ్యాస్ కనెక్షన్ ఉండాలి.',
        'గ్యాస్ కనెక్షన్‌కు ఆధార్ సీడింగ్ మరియు ఈ-కేవైసీ పూర్తయి ఉండాలి.',
        'బ్యాంక్ ఖాతా NPCI ద్వారా ఆధార్‌తో అనుసంధానమై ఉండాలి.'
      ]
    },
    exclusions: [
      'Commercial LPG connections',
      'Households without active White Rice Cards',
      'Families with existing government pension/regular employees with four-wheelers'
    ],
    requiredDocuments: [
      'Active Andhra Pradesh White Rice Card',
      'Aadhaar Card of the female head of the family',
      'LPG Connection Consumer Passbook (IOCL / BPCL / HPCL)',
      'Aadhaar-seeded Bank Account details',
      'Registered mobile number linked with gas distributor'
    ],
    teRequiredDocuments: [
      'ప్రస్తుత ఆంధ్రప్రదేశ్ తెల్ల రేషన్ కార్డు (రైస్ కార్డ్)',
      'మహిళ ఆధార్ కార్డు',
      'గ్యాస్ కనెక్షన్ పాస్‌బుక్ లేదా రసీదు',
      'ఆధార్ లింక్ అయిన బ్యాంక్ పాస్‌బుక్',
      'గ్యాస్ ఏజెన్సీలో నమోదైన మొబైల్ నంబర్'
    ],
    applicationSteps: [
      'Verify that LPG consumer number and Aadhaar are seeded at the local gas agency (Indane, Bharat Gas, HP Gas).',
      'Book a refill cylinder through standard IVRS, WhatsApp, or mobile app.',
      'Pay standard refill cost at the time of delivery.',
      'Civil Supplies Department automatically validates delivery via OMC API.',
      'Full subsidy amount credited directly to the citizen\'s bank account within 48 hours.'
    ],
    teApplicationSteps: [
      'గ్యాస్ ఏజెన్సీలో ఆధార్ మరియు రేషన్ కార్డు ఈ-కేవైసీ చేయించుకోవాలి.',
      'సాధారణ విధానంలో (IVRS, WhatsApp లేదా యాప్ ద్వారా) సిలిండర్ బుక్ చేసుకోవాలి.',
      'డెలివరీ సమయంలో రసీదు మొత్తం చెల్లించాలి.',
      'సిలిండర్ డెలివరీ అయిన 48 గంటల్లో ప్రభుత్వం సబ్సిడీ సొమ్మును నేరుగా బ్యాంక్ ఖాతాలో జమ చేస్తుంది.'
    ],
    officialApplicationUrl: 'https://gramawardsachivalayam.ap.gov.in',
    officialInfoUrl: 'https://apcivilsupplies.gov.in',
    sourceUrls: [
      'https://apcivilsupplies.gov.in',
      'https://gramawardsachivalayam.ap.gov.in',
      'https://apfinance.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'ACTIVE',
    applicationWindowStatus: 'open',
    historicalAliases: ['Deepam Scheme AP', 'Maha Sakthi Free Cylinders', 'దీపం పథకం', 'ఉచిత గ్యాస్ సిలిండర్'],
    verificationSourceType: 'ap_gov_portal',
    published: true,
    deadline: 'Continuous 4-month booking windows per cylinder',
    renewalPeriod: 'Annual (3 Cylinders per financial year)',
    verifiedHelpline: '1967 (Toll-Free Civil Supplies) / 1902'
  },
  {
    id: 'dr-ntr-vaidya-seva-ap',
    officialName: 'Dr. NTR Vaidya Seva (Universal Health Insurance & Ayushman Bharat PM-JAY)',
    teName: 'డా. ఎన్టీఆర్ వైద్య సేవ పథకం (సార్వత్రిక ఉచిత ఆరోగ్య బీమా & ఆయుష్మాన్ భారత్)',
    hiName: 'डॉ. एनटीआर वैद्य सेवा योजना (सार्वभौमिक स्वास्थ्य बीमा)',
    department: 'Dr. NTR Vaidya Seva Trust, Department of Health, Medical & Family Welfare, Govt. of Andhra Pradesh & National Health Authority (NHA)',
    responsibleMinistry: 'Health, Medical & Family Welfare Department, AP & Ministry of Health & Family Welfare, GoI',
    govLevel: 'state',
    state: 'Andhra Pradesh',
    category: 'health',
    summary: 'Universal cashless healthcare coverage up to ₹25 Lakhs per family per year covering 3,257 surgical, medical, and tertiary procedures across network hospitals.',
    teSummary: 'ప్రతి పేద కుటుంబానికి ఏడాదికి గరిష్టంగా రూ. 25 లక్షల వరకు ఉచిత నగదు రహిత కార్పొరేట్ వైద్య చికిత్స (3,257 రకాల వ్యాధులు మరియు శస్త్రచికిత్సలు).',
    description: 'Dr. NTR Vaidya Seva Trust in convergence with Ayushman Bharat PM-JAY provides end-to-end cashless treatment up to ₹25 Lakhs per family per year for secondary and tertiary healthcare in empanelled government and private network hospitals across Andhra Pradesh, Hyderabad, Chennai, and Bengaluru. Includes pre-hospitalization, diagnostics, surgeries, post-operative care, and daily financial recovery allowance (Aarogya Aasara) up to ₹5,000/month during convalescence.',
    teDescription: 'పేద ప్రజలకు అత్యున్నత కార్పొరేట్ వైద్యాన్ని ఉచితంగా అందించే ఆంధ్రప్రదేశ్ సమగ్ర ఆరోగ్య భద్రతా పథకం. తెల్ల రేషన్ కార్డు కలిగిన ప్రతి కుటుంబానికి నెట్‌వర్క్ ఆసుపత్రులలో ఉచిత శస్త్రచికిత్సలు, మందులు మరియు విశ్రాంతి సమయంలో నెలకు రూ. 5,000 వరకు ఆర్థిక సహాయం లభిస్తుంది.',
    benefitDetails: 'Cashless hospital treatment up to ₹25,00,000 per family per annum covering 3,257 listed procedures + ₹225/day post-operative allowance during recovery.',
    teBenefitDetails: 'ఏడాదికి కుటుంబానికి గరిష్టంగా రూ. 25 లక్షల వరకు ఉచిత నగదు రహిత చికిత్స + ఆపరేషన్ తర్వాత విశ్రాంతి కాలంలో రోజుకు రూ. 225 సహాయం.',
    benefitAmount: 'Up to ₹25,00,000 per family / year',
    eligibilityCriteria: {
      minAge: 0,
      maxAge: 100,
      gender: 'all',
      maxAnnualIncome: 500000,
      requiresAPResidence: true,
      additionalRules: [
        'All citizens holding valid White Rice Cards or Government Health Cards.',
        'Annual household income up to ₹5 Lakhs as per certified revenue records.',
        'Family landholding up to 12 acres wetland or 35 acres dry land.',
        'Municipal property tax assessment below ₹3,000 per year.'
      ],
      teAdditionalRules: [
        'చెల్లుబాటు అయ్యే తెల్ల రేషన్ కార్డు లేదా ఆరోగ్య కార్డు కలిగిన కుటుంబాలు.',
        'కుటుంబ వార్షిక ఆదాయం రూ. 5.00 లక్షల లోపు ఉండాలి.',
        '12 ఎకరాల మాగాణి లేదా 35 ఎకరాల మెట్ట భూమి లోపు ఉండాలి.'
      ]
    },
    exclusions: [
      'State or Central government regular employees covered under EHS',
      'Families owning private four-wheelers (excluding commercial transport)'
    ],
    requiredDocuments: [
      'Aadhaar Card of the patient and family head',
      'BPL Rice Card / Health Card',
      'Hospital Admission Referral or Outpatient slip from PHC/CHC',
      'Diagnostic reports and doctor prescription'
    ],
    teRequiredDocuments: [
      'రోగి మరియు కుటుంబ సభ్యుల ఆధార్ కార్డులు',
      'ఆరోగ్య కార్డు లేదా బియ్యం కార్డు',
      'ప్రభుత్వ ఆసుపత్రి రెఫరల్ లేదా నెట్‌వర్క్ ఆసుపత్రి ఓపీ స్లిప్',
      'వైద్య నివేదికలు మరియు రోగ నిర్ధారణ పరీక్షలు'
    ],
    applicationSteps: [
      'Visit any empanelled government or private network hospital.',
      'Approach the Aarogya Mithra desk at the hospital entrance with your Rice Card/Aadhaar.',
      'Aarogya Mithra validates eligibility and registers pre-authorization online.',
      'Trust doctors approve electronic pre-authorization within 24 hours.',
      'Complete cashless surgery, treatment, medicines, and free discharge transport.'
    ],
    teApplicationSteps: [
      'ఏదైనా నెట్‌వర్క్ ఆసుపత్రిలోని ఆరోగ్య మిత్ర హెల్ప్ డెస్క్‌ను సంప్రదించాలి.',
      'ఆధార్ కార్డు లేదా రైస్ కార్డు సమర్పించి నమోదు చేసుకోవాలి.',
      'ఆరోగ్య మిత్ర ద్వారా ఆన్‌లైన్ ప్రీ-ఆథరైజేషన్ నమోదు.',
      'పూర్తి ఉచిత నగదు రహిత చికిత్స మరియు శస్త్రచికిత్స.',
      'డిశ్చార్జ్ సమయంలో ఉచిత మందులు మరియు ఆహార రవాణా ఖర్చులు.'
    ],
    officialApplicationUrl: 'https://drntrvaidyaseva.ap.gov.in',
    officialInfoUrl: 'https://drntrvaidyaseva.ap.gov.in',
    sourceUrls: [
      'https://drntrvaidyaseva.ap.gov.in',
      'https://pmjay.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'ACTIVE',
    applicationWindowStatus: 'open',
    historicalAliases: ['Dr. NTR Vaidya Seva', 'NTR Vaidya Seva', 'AP Universal Health Assurance', 'ఎన్టీఆర్ వైద్య సేవ', 'ఉచిత ఆరోగ్య బీమా'],
    verificationSourceType: 'ap_gov_portal',
    published: true,
    renewalPeriod: 'Continuous (Instant Cashless Access)',
    verifiedHelpline: '104 (Health Information) / 1902'
  },
  {
    id: 'jagananna-vidya-deevena',
    officialName: 'Post-Matric Fee Reimbursement (Jagananna Vidya Deevena / RTF)',
    teName: 'పోస్ట్-మెట్రిక్ ఫీజు రీయింబర్స్‌మెంట్ పథకం (జగనన్న విద్యా దీవెన)',
    hiName: 'उत्तर-मैट्रिक शुल्क प्रतिपूर्ति योजना (विद्या दीवेना)',
    department: 'Social Welfare & Higher Education Department, Govt. of Andhra Pradesh',
    responsibleMinistry: 'Social Welfare Department, Andhra Pradesh',
    govLevel: 'state',
    state: 'Andhra Pradesh',
    category: 'education',
    summary: 'Full college tuition fee reimbursement for students pursuing Polytechnic, ITI, Degree, Engineering, Medicine, and Post-Graduate courses.',
    teSummary: 'పాలిటెక్నిక్, ఐటీఐ, డిగ్రీ, ఇంజనీరింగ్, మెడిసిన్ మరియు పీజీ చదువుతున్న పేద విద్యార్థులకు పూర్తి కాలేజ్ ఫీజు రీయింబర్స్‌మెంట్.',
    description: 'Provides 100% tuition fee reimbursement for post-matric students across all recognized colleges in Andhra Pradesh. Disbursed quarterly into mothers\' Aadhaar-seeded accounts to ensure that economic hardship does not hinder higher education.',
    teDescription: 'ఉన్నత విద్య అభ్యసించే నిరుపేద విద్యార్థుల పూర్తి ట్యూషన్ ఫీజును ప్రభుత్వం భరిస్తుంది. నిధులు నేరుగా విద్యార్థుల తల్లుల ఖాతాల్లో జమ చేయబడతాయి.',
    benefitDetails: '100% Tuition fee reimbursement paid in quarterly installments directly to the mother\'s verified bank account.',
    teBenefitDetails: '100% ట్యూషన్ ఫీజు రీయింబర్స్‌మెంట్ నేరుగా తల్లి బ్యాంక్ ఖాతాలో నాలుగు త్రైమాసిక విడతల్లో జమ.',
    benefitAmount: 'Full College Tuition Fee (100%)',
    eligibilityCriteria: {
      minAge: 16,
      maxAge: 30,
      gender: 'all',
      maxAnnualIncome: 250000,
      educationLevels: ['Polytechnic', 'ITI', 'Undergraduate', 'Postgraduate', 'Engineering', 'Pharmacy', 'MBA/MCA'],
      socialCategories: ['SC', 'ST', 'BC', 'EWS', 'Kapu', 'Minority', 'Differently Abled'],
      requiresAPResidence: true,
      additionalRules: [
        'Family total landholding must be below 10 acres wetland or 25 acres dry land.',
        'No family member should be a regular government employee or pensioner (sanitary workers exempt).',
        'No family member should own a four-wheeler (taxis, tractors, autos exempt).',
        'Municipal property built-up area must be less than 1500 sq.ft.',
        'Minimum 75% student college attendance required.'
      ],
      teAdditionalRules: [
        'కుటుంబ వార్షిక ఆదాయం రూ. 2.50 లక్షల లోపు ఉండాలి.',
        'కుటుంబానికి 10 ఎకరాల లోపు మాగాణి లేదా 25 ఎకరాల లోపు మెట్ట భూమి ఉండాలి.',
        'కుటుంబంలో ఎవరూ ప్రభుత్వ ఉద్యోగి లేదా పెన్షనర్ అయి ఉండకూడదు.',
        'కళాశాలలో కనీసం 75% బయోమెట్రిక్ హాజరు తప్పనిసరి.'
      ]
    },
    exclusions: ['Deemed or Private University management quota seats', 'Distance education students', 'Income tax payers in family'],
    requiredDocuments: [
      'Aadhaar Card of Student and Mother',
      'Rice Card / Ration Card / Meeseva Income Certificate',
      'Integrated Caste Certificate',
      'College Admission Allotment Order',
      'Mother\'s Active Bank Passbook with NPCI Aadhaar Seeded',
      '10th & Intermediate Marks Memos'
    ],
    teRequiredDocuments: [
      'విద్యార్థి మరియు తల్లి ఆధార్ కార్డులు',
      'రైస్ కార్డు / ఆదాయ ధృవీకరణ పత్రం',
      'కుల ధృవీకరణ పత్రం (Caste Certificate)',
      'కళాశాల అడ్మిషన్ అలాట్‌మెంట్ ఆర్డర్',
      'తల్లి బ్యాంక్ పాస్‌బుక్ (NPCI లింక్ అయినది)'
    ],
    applicationSteps: [
      'Enroll through college verification during semester registration.',
      'College principal validates student data on Jnanabhumi portal.',
      'Grama / Ward Sachivalayam Welfare Assistant verifies field details.',
      'Social audit list published at Village Secretariat for objections.',
      'Funds disbursed directly to mother\'s Aadhaar-linked account.'
    ],
    teApplicationSteps: [
      'కళాశాలలో అడ్మిషన్ సమయంలో జ్ఞానభూమి పోర్టల్ ద్వారా నమోదు.',
      'కళాశాల ప్రిన్సిపాల్ ఆధ్వర్యంలో విద్యార్థి వివరాల ధృవీకరణ.',
      'గ్రామ/వార్డు సచివాలయం సంక్షేమ సహాయకుడి ద్వారా క్షేత్ర పరిశీలన.',
      'తల్లి ఆధార్ అనుసంధాన బ్యాంక్ ఖాతాలో నిధుల జమ.'
    ],
    officialApplicationUrl: 'https://jnanabhumi.ap.gov.in',
    officialInfoUrl: 'https://jnanabhumi.ap.gov.in',
    sourceUrls: [
      'https://jnanabhumi.ap.gov.in',
      'https://socialwelfare.ap.gov.in',
      'https://gramawardsachivalayam.ap.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'UPDATED',
    applicationWindowStatus: 'scheduled',
    historicalAliases: ['Jagananna Vidya Deevena', 'RTF', 'AP Post Matric Fee Reimbursement', 'విద్యా దీవెన'],
    verificationSourceType: 'ap_gov_portal',
    published: true,
    deadline: 'Quarterly Academic Cycle (Nov - Dec / Mar - Apr)',
    renewalPeriod: 'Annual / Semester basis',
    verifiedHelpline: '1902 (AP GSWS Helpline)'
  },
  {
    id: 'jagananna-vasathi-deevena',
    officialName: 'Post-Matric Boarding Assistance (Vasathi Deevena / MTF)',
    teName: 'హాస్టల్ & భోజన వసతి ఖర్చుల పథకం (వసతి దీవెన)',
    hiName: 'छात्रावास एवं भोजन सहायता योजना (वसति दीवेना)',
    department: 'Social Welfare Department, Govt. of Andhra Pradesh',
    responsibleMinistry: 'Social Welfare Department, Andhra Pradesh',
    govLevel: 'state',
    state: 'Andhra Pradesh',
    category: 'education',
    summary: 'Financial aid for food and hostel expenses for post-matric polytechnic, ITI, and degree students in Andhra Pradesh.',
    teSummary: 'డిగ్రీ, ఇంజనీరింగ్, పాలిటెక్నిక్ విద్యార్థుల భోజన మరియు వసతి ఖర్చుల కోసం ఏటా రూ. 10,000 నుండి రూ. 20,000 వరకు ఆర్థిక సహాయం.',
    description: 'Provides boarding and lodging assistance to students to meet their living expenses while pursuing higher education away from home. Paid directly to mothers in two installments per year.',
    teDescription: 'ఉన్నత విద్య అభ్యసించే పేద విద్యార్థుల వసతి, భోజన ఖర్చుల భారాన్ని తగ్గించేందుకు ఈ పథకం ద్వారా ఏటా రెండు విడతల్లో తల్లుల బ్యాంక్ ఖాతాల్లో సహాయం జమ చేస్తారు.',
    benefitDetails: 'ITI students: ₹10,000/yr; Polytechnic: ₹15,000/yr; Degree & Engineering/Medicine: ₹20,000/yr.',
    teBenefitDetails: 'ఐటీఐ విద్యార్థులకు రూ. 10,000; పాలిటెక్నిక్ విద్యార్థులకు రూ. 15,000; డిగ్రీ/ఇంజనీరింగ్/పీజీ విద్యార్థులకు రూ. 20,000 ఏటా.',
    benefitAmount: '₹10,000 - ₹20,000 per year',
    eligibilityCriteria: {
      minAge: 16,
      maxAge: 30,
      gender: 'all',
      maxAnnualIncome: 250000,
      educationLevels: ['Polytechnic', 'ITI', 'Undergraduate', 'Postgraduate', 'Engineering', 'Medicine'],
      requiresAPResidence: true,
      additionalRules: [
        'Must be verified under Jnanabhumi portal.',
        'Requires 75% biometric attendance in college.',
        'Same family landholding and property criteria as Vidya Deevena.'
      ],
      teAdditionalRules: [
        'జ్ఞానభూమి పోర్టల్‌లో నమోదైన విద్యార్థులు మాత్రమే అర్హులు.',
        'కనీసం 75% బయోమెట్రిక్ హాజరు ఉండాలి.'
      ]
    },
    exclusions: ['Management quota seats', 'Distance learning', 'Government employee families'],
    requiredDocuments: [
      'Aadhaar Card of Student & Mother',
      'Rice Card / Income Certificate',
      'College Bonafide with Hostel Certificate',
      'Mother\'s Bank Passbook'
    ],
    teRequiredDocuments: [
      'విద్యార్థి మరియు తల్లి ఆధార్ కార్డులు',
      'బియ్యం కార్డు లేదా ఆదాయ ధృవీకరణ పత్రం',
      'హాస్టల్ లేదా కాలేజ్ బోనఫైడ్ సర్టిఫికెట్',
      'తల్లి బ్యాంక్ పాస్‌బుక్'
    ],
    applicationSteps: [
      'Submit application concurrently with Fee Reimbursement on Jnanabhumi portal.',
      'Verified by college principal and Grama Sachivalayam Welfare Assistant.',
      'Sanctioned in two semi-annual installments directly to mother\'s bank account.'
    ],
    teApplicationSteps: [
      'జ్ఞానభూమి పోర్టల్ ద్వారా ఫీజు రీయింబర్స్‌మెంట్‌తో పాటు దరఖాస్తు సమర్పించాలి.',
      'కళాశాల మరియు సచివాలయం ద్వారా పరిశీలన.',
      'రెండు విడతల్లో నేరుగా తల్లి బ్యాంక్ ఖాతాలో నగదు జమ.'
    ],
    officialApplicationUrl: 'https://jnanabhumi.ap.gov.in',
    officialInfoUrl: 'https://jnanabhumi.ap.gov.in',
    sourceUrls: [
      'https://jnanabhumi.ap.gov.in',
      'https://socialwelfare.ap.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'UPDATED',
    applicationWindowStatus: 'scheduled',
    historicalAliases: ['Jagananna Vasathi Deevena', 'MTF', 'వసతి దీవెన'],
    verificationSourceType: 'ap_gov_portal',
    published: true,
    deadline: 'Semi-annual academic schedule',
    renewalPeriod: 'Annual',
    verifiedHelpline: '1902'
  },
  {
    id: 'pm-kisan-central',
    officialName: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    teName: 'పీఎం కిసాన్ సమ్మాన్ నిధి పథకం (కేంద్ర పథకం)',
    hiName: 'प्रधानमंत्री किसान सम्मान निधि (पीएम-किसान)',
    department: 'Department of Agriculture and Farmers Welfare, Ministry of Agriculture, Govt. of India',
    responsibleMinistry: 'Ministry of Agriculture and Farmers Welfare, Govt. of India',
    govLevel: 'central',
    state: 'All India',
    category: 'agriculture',
    summary: 'Direct income support of ₹6,000 per year in 3 equal four-monthly installments for all landholding farmer families across India.',
    teSummary: 'భారతదేశంలోని రైతులందరికీ వ్యవసాయ ఖర్చుల నిమిత్తం ఏటా రూ. 6,000 నగదు బదిలీ (నాలుగు నెలలకోసారి రూ. 2,000 చొప్పున మూడు విడతల్లో).',
    description: 'PM-KISAN is a central sector scheme with 100% funding from the Government of India. It provides income support to all landholding farmer families to supplement financial needs for procuring various agricultural inputs and domestic needs.',
    teDescription: 'రైతులకు పెట్టుబడి సహాయం అందించేందుకు భారత ప్రభుత్వం 100% నిధులతో అమలు చేస్తున్న జాతీయ పథకం. ప్రతి నాలుగు నెలలకు రూ. 2,000 చొప్పున మూడు విడతల్లో మొత్తం రూ. 6,000 నేరుగా రైతుల ఖాతాల్లో జమ అవుతుంది.',
    benefitDetails: '₹6,000 per annum paid in 3 installments of ₹2,000 each (April-July, August-November, December-March).',
    teBenefitDetails: 'ఏడాదికి రూ. 6,000 సాయం మూడు విడతల్లో (విడతకు రూ. 2,000 చొప్పున) నేరుగా బ్యాంక్ ఖాతాలో జమ.',
    benefitAmount: '₹6,000 per annum',
    eligibilityCriteria: {
      minAge: 18,
      gender: 'all',
      farmerStatus: true,
      additionalRules: [
        'Must own cultivable landholding in their name.',
        'Mandatory Aadhaar-based e-KYC on pmkisan.gov.in portal.',
        'Land details must be verified by State Revenue Department.'
      ],
      teAdditionalRules: [
        'రైతు పేరున సాగు భూమి పట్టా ఉండాలి.',
        'పీఎం కిసాన్ పోర్టల్‌లో ఆధార్ ఈ-కేవైసీ తప్పనిసరిగా పూర్తి చేయాలి.'
      ]
    },
    exclusions: [
      'Institutional landholders',
      'Constitutional post holders, former/present ministers, MPs, MLAs, mayors',
      'Retired or serving government employees, income tax payers'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Proof of land ownership (Pattadar passbook / RoR / 1-B)',
      'Active bank account with NPCI Aadhaar seeding',
      'Mobile number linked to Aadhaar'
    ],
    teRequiredDocuments: [
      'రైతు ఆధార్ కార్డు',
      'భూమి యాజమాన్య పత్రాలు (పట్టాదారు పాస్‌బుక్)',
      'బ్యాంక్ ఖాతా పాస్‌బుక్',
      'ఆధార్ లింక్ అయిన మొబైల్ నంబర్'
    ],
    applicationSteps: [
      'Apply online on Farmer Corner at pmkisan.gov.in or visit CSC / Grama Sachivalayam.',
      'Submit Aadhaar number, land record details, and bank account.',
      'State revenue authorities verify land records.',
      'Complete biometric / OTP-based e-KYC.',
      'Installments deposited via DBT PFMS system.'
    ],
    teApplicationSteps: [
      'pmkisan.gov.in పోర్టల్‌లోని Farmers Corner ద్వారా లేదా సచివాలయంలో దరఖాస్తు చేసుకోవాలి.',
      'భూమి రికార్డులు మరియు ఆధార్ వివరాల నమోదు.',
      'ఈ-కేవైసీ పూర్తి చేయడం.',
      'నేరుగా బ్యాంక్ ఖాతాలో నిధుల జమ.'
    ],
    officialApplicationUrl: 'https://pmkisan.gov.in',
    officialInfoUrl: 'https://pmkisan.gov.in',
    sourceUrls: [
      'https://pmkisan.gov.in',
      'https://india.gov.in',
      'https://myscheme.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'ACTIVE',
    applicationWindowStatus: 'open',
    verificationSourceType: 'central_ministry',
    published: true,
    renewalPeriod: 'Continuous DBT (Every 4 months)',
    verifiedHelpline: '155261 / 011-24300606 (PM-Kisan Helpdesk)'
  },
  {
    id: 'pm-surya-ghar-muft-bijli',
    officialName: 'PM Surya Ghar: Muft Bijli Yojana (Rooftop Solar Subsidy)',
    teName: 'పీఎం సూర్య ఘర్: ఉచిత విద్యుత్ పథకం (రూఫ్‌టాప్ సోలార్)',
    hiName: 'पीएम सूर्य घर: मुफ्त बिजली योजना',
    department: 'Ministry of New and Renewable Energy, Govt. of India',
    responsibleMinistry: 'Ministry of New and Renewable Energy, Govt. of India',
    govLevel: 'central',
    state: 'All India',
    category: 'housing',
    summary: 'Central financial subsidy up to ₹78,000 for installing residential rooftop solar panels to provide up to 300 units of free clean electricity per month.',
    teSummary: 'ఇళ్ల పైకప్పులపై సోలార్ ప్యానెల్స్ ఏర్పాటు కోసం గరిష్టంగా రూ. 78,000 వరకు కేంద్ర రాయితీ మరియు నెలకు 300 యూనిట్ల వరకు ఉచిత విద్యుత్.',
    description: 'PM Surya Ghar Muft Bijli Yojana is a national clean energy initiative to illuminate 1 crore households with free rooftop solar electricity. Subsidies: ₹30,000 for 1kW systems, ₹60,000 for 2kW systems, and ₹78,000 for 3kW or higher capacity systems.',
    teDescription: 'దేశవ్యాప్తంగా 1 కోటి గృహాలకు ఉచిత సౌర విద్యుత్ అందించే లక్ష్యంతో భారత ప్రభుత్వం అమలు చేస్తున్న భారీ పథకం. ఇళ్లపై సోలార్ ప్లాంట్ ఏర్పాటుకు రూ. 78,000 వరకు కేంద్రం సబ్సిడీ ఇస్తుంది. నెలకు 300 యూనిట్ల వరకు ఉచిత కరెంట్ లభిస్తుంది.',
    benefitDetails: 'Subsidies: ₹30,000 (1 kW), ₹60,000 (2 kW), ₹78,000 (3 kW+). Surplus electricity sold back to DISCOM via Net Metering.',
    teBenefitDetails: '1 కిలోవాట్ కు రూ. 30,000; 2 కిలోవాట్లకు రూ. 60,000; 3 కిలోవాట్లకు రూ. 78,000 రాయితీ. మిగులు విద్యుత్తును డిస్కంలకు విక్రయించి ఆదాయం పొందవచ్చు.',
    benefitAmount: 'Up to ₹78,000 Direct Subsidy',
    eligibilityCriteria: {
      minAge: 18,
      gender: 'all',
      additionalRules: [
        'Must own a residential pucca house with suitable rooftop area.',
        'Must possess an active domestic electricity connection under APCPDCL, APEPDCL, or APSPDCL.',
        'Should not have availed any previous central financial assistance for rooftop solar.'
      ],
      teAdditionalRules: [
        'సొంత ఇల్లు మరియు సోలార్ ప్యానెల్స్ అమర్చడానికి అనువైన పైకప్పు ఉండాలి.',
        'గృహ అవసరాల విద్యుత్ కనెక్షన్ (APCPDCL / APEPDCL / APSPDCL) కలిగి ఉండాలి.'
      ]
    },
    exclusions: ['Commercial establishments', 'Industrial connections'],
    requiredDocuments: [
      'Latest Domestic Electricity Bill with Service Number',
      'Aadhaar Card of the electricity connection holder',
      'Roof Ownership proof / Property tax receipt',
      'Cancelled Cheque / Bank Passbook for subsidy DBT transfer'
    ],
    teRequiredDocuments: [
      'ఇటీవలి విద్యుత్ బిల్లు (సర్వీస్ నంబర్‌తో)',
      'కనెక్షన్ దారుడి ఆధార్ కార్డు',
      'ఇంటి యాజమాన్య పత్రం / ఆస్తి పన్ను రసీదు',
      'సబ్సిడీ జమ కోసం బ్యాంక్ పాస్‌బుక్ లేదా చెక్కు'
    ],
    applicationSteps: [
      'Register on National Portal at pmsuryaghar.gov.in with Consumer Number.',
      'Submit feasibility approval request for net-metering.',
      'Select empanelled registered vendor and complete rooftop installation.',
      'DISCOM inspects installation and fixes net meter.',
      'Commissioning certificate generated and subsidy credited to bank account within 30 days.'
    ],
    teApplicationSteps: [
      'pmsuryaghar.gov.in పోర్టల్‌లో వినియోగదారుడి సర్వీస్ నంబర్‌తో నమోదు.',
      'డిస్కం ద్వారా నెట్-మీటరింగ్ అనుమతి పొందడం.',
      'రిజిస్టర్డ్ వెండర్ ద్వారా సోలార్ ప్లాంట్ ఏర్పాటు.',
      'డిస్కం తనిఖీ చేసి నెట్ మీటర్ ఏర్పాటు చేస్తుంది.',
      '30 రోజుల్లోపు బ్యాంకు ఖాతాలో నేరుగా కేంద్ర సబ్సిడీ జమ.'
    ],
    officialApplicationUrl: 'https://pmsuryaghar.gov.in',
    officialInfoUrl: 'https://pmsuryaghar.gov.in',
    sourceUrls: [
      'https://pmsuryaghar.gov.in',
      'https://myscheme.gov.in',
      'https://india.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'ACTIVE',
    applicationWindowStatus: 'open',
    verificationSourceType: 'central_ministry',
    published: true,
    deadline: 'Open Scheme (Mission 2027)',
    renewalPeriod: '25-year panel warranty',
    verifiedHelpline: '15555 (Toll-Free PM Surya Ghar Helpline)'
  },
  {
    id: 'pm-svanidhi',
    officialName: 'PM Street Vendor\'s AtmaNirbhar Nidhi (PM SVANidhi)',
    teName: 'పీఎం స్వనిధి వీధి వ్యాపారుల రుణ పథకం',
    hiName: 'पीएम स्वनिधि स्ट्रीट वेंडर आत्मनिर्भर निधि',
    department: 'Ministry of Housing and Urban Affairs, Govt. of India & MEPMA, AP',
    responsibleMinistry: 'Ministry of Housing and Urban Affairs, Govt. of India',
    govLevel: 'central',
    state: 'All India',
    category: 'msme_entrepreneurship',
    summary: 'Collateral-free working capital micro-loans of ₹10,000, ₹20,000, and ₹50,000 with 7% interest subsidy for urban street vendors.',
    teSummary: 'వీధి వ్యాపారులు, చిరువ్యాపారులకు ఎలాంటి పూచీకత్తు లేకుండా ₹10,000 నుండి ₹50,000 వరకు సులభ వడ్డీతో వర్కింగ్ క్యాపిటల్ రుణాలు.',
    description: 'PM SVANidhi provides affordable collateral-free working capital loans to urban street vendors in 3 tranches (₹10,000, ₹20,000, and ₹50,000). On timely repayment, beneficiaries receive a 7% interest subsidy credited directly to bank accounts and up to ₹1,200 annual cashback on digital transactions.',
    teDescription: 'పట్టణాలు మరియు నగరాల్లోని వీధి వ్యాపారులకు ఆర్థిక స్వావలంబన కల్పించే పథకం. మొదటి విడతలో రూ. 10,000, సకాలంలో చెల్లిస్తే రెండో విడతలో రూ. 20,000, మూడో విడతలో రూ. 50,000 వరకు రుణం లభిస్తుంది. 7% వడ్డీ రాయితీ మరియు డిజిటల్ లావాదేవీలపై క్యాష్‌బ్యాక్ లభిస్తుంది.',
    benefitDetails: 'Collateral-free loans: 1st Tranche ₹10,000 (1 yr); 2nd Tranche ₹20,000; 3rd Tranche ₹50,000 + 7% interest subsidy + ₹1,200/yr digital cashback.',
    teBenefitDetails: 'పూచీకత్తు లేని రుణాలు: మొదటి విడత రూ. 10,000; రెండో విడత రూ. 20,000; మూడో విడత రూ. 50,000. సకాలంలో చెల్లిస్తే 7% వడ్డీ సబ్సిడీ.',
    benefitAmount: '₹10,000 to ₹50,000 Micro-Credit',
    eligibilityCriteria: {
      minAge: 18,
      occupations: ['Street Vendor', 'Hawker', 'Fruit/Vegetable Seller', 'Cart Vendor', 'Food Stall Operator'],
      additionalRules: [
        'Must be engaged in vending in urban areas on or before March 2020 or hold a Certificate of Vending (CoV) / Identity Card issued by ULB/MEPMA.',
        'Vendors without CoV can get a Letter of Recommendation (LoR) from Town Vending Committee (TVC).'
      ],
      teAdditionalRules: [
        'పట్టణ ప్రాంతాల్లో వీధి వ్యాపారం చేస్తున్న వారు అర్హులు.',
        'మున్సిపాలిటీ లేదా MEPMA జారీ చేసిన వెండింగ్ సర్టిఫికెట్ లేదా ఐడీ కార్డు ఉండాలి.'
      ]
    },
    exclusions: ['Vendors with default records in formal commercial loans'],
    requiredDocuments: [
      'Aadhaar Card linked to active Mobile number',
      'Voter ID / Certificate of Vending (CoV) / Identity Card from ULB',
      'Bank Account Passbook / Bank Statement'
    ],
    teRequiredDocuments: [
      'ఆధార్ కార్డు',
      'మున్సిపాలిటీ లేదా MEPMA జారీ చేసిన గుర్తింపు పత్రం',
      'బ్యాంక్ పాస్‌బుక్'
    ],
    applicationSteps: [
      'Apply online on pmsvanidhi.mohua.gov.in or through MEPMA / Grama-Ward Sachivalayam.',
      'Select lending institution (Commercial Bank, Grameena Bank, SHG Bank).',
      'Lender processes application without collateral.',
      'Amount disbursed digitally into bank account.'
    ],
    teApplicationSteps: [
      'pmsvanidhi.mohua.gov.in వెబ్‌సైట్ ద్వారా లేదా MEPMA సహాయంతో దరఖాస్తు.',
      'బ్యాంకు ఎంపిక మరియు రుణం మంజూరు.',
      'నేరుగా బ్యాంక్ ఖాతాలో రుణం జమ.'
    ],
    officialApplicationUrl: 'https://pmsvanidhi.mohua.gov.in',
    officialInfoUrl: 'https://pmsvanidhi.mohua.gov.in',
    sourceUrls: [
      'https://pmsvanidhi.mohua.gov.in',
      'https://mepma.gov.in',
      'https://myscheme.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'ACTIVE',
    applicationWindowStatus: 'open',
    verificationSourceType: 'central_ministry',
    published: true,
    renewalPeriod: 'Tranche progression based on repayment',
    verifiedHelpline: '1800-11-1979 (PM SVANidhi Toll-Free)'
  },
  {
    id: 'pm-awas-yojana-gramin',
    officialName: 'Pradhan Mantri Awaas Yojana - Gramin (PMAY-G)',
    teName: 'ప్రధాన మంత్రి ఆవాస్ యోజన - గ్రామీణ (పక్కా గృహ నిర్మాణ పథకం)',
    hiName: 'प्रधानमंत्री आवास योजना - ग्रामीण',
    department: 'Ministry of Rural Development, Govt. of India & AP State Housing Corporation',
    responsibleMinistry: 'Ministry of Rural Development, Govt. of India',
    govLevel: 'central',
    state: 'All India',
    category: 'housing',
    summary: 'Direct financial assistance of ₹1.20 Lakhs to ₹1.30 Lakhs for building durable pucca houses for homeless and kutcha-house rural households.',
    teSummary: 'గ్రామీణ ప్రాంతాల్లో ఇళ్లు లేని పేదలకు పక్కా ఇళ్ల నిర్మాణానికి రూ. 1.20 లక్షల నుండి రూ. 1.30 లక్షల వరకు నేరుగా నగదు సహాయం.',
    description: 'PMAY-G provides direct financial grants to rural households living in kutcha or dilapidated homes. Financial grant: ₹1,20,000 in plain areas and ₹1,30,000 in hilly/tribal areas in 3-4 construction installments. Converged with 90 days of MGNREGS wages (~₹27,000) and ₹12,000 for toilet construction under Swachh Bharat Mission Gramin.',
    teDescription: 'గ్రామీణ ప్రాంతాల్లోని పేదలకు పక్కా గృహం నిర్మించుకోవడానికి ప్రభుత్వం అందించే సహాయం. ఇళ్ల నిర్మాణానికి ఇచ్చే సహాయంతో పాటు ఉపాధి హామీ పథకం కింద 90 రోజుల వేతన సాయం మరియు మరుగుదొడ్డి నిర్మాణానికి రూ. 12,000 అదనంగా లభిస్తాయి.',
    benefitDetails: 'Direct cash grant: ₹1,20,000 + ₹27,000 (MGNREGS 90 wage days) + ₹12,000 (SBM Toilet). Total package approx ₹1,59,000.',
    teBenefitDetails: 'గృహ నిర్మాణానికి రూ. 1,20,000 + ఉపాధి హామీ వేతనం రూ. 27,000 + స్వచ్ఛ భారత్ కింద రూ. 12,000.',
    benefitAmount: '₹1,20,000 - ₹1,30,000 Grant',
    eligibilityCriteria: {
      minAge: 18,
      locationType: 'rural',
      additionalRules: [
        'Household must be without shelter or living in zero/one/two-room kutcha houses as per SECC / Awaas+ survey.',
        'Family must not own a pucca house anywhere in India.'
      ],
      teAdditionalRules: [
        'గ్రామీణ ప్రాంత నివాసి అయి ఉండాలి.',
        'సొంతంగా పక్కా ఇల్లు ఉండకూడదు.'
      ]
    },
    exclusions: ['Households owning motorized vehicles', 'Households with government employees', 'Income tax paying families'],
    requiredDocuments: [
      'Aadhaar Card of all adult family members',
      'Job Card number under MGNREGS',
      'Bank Account Passbook (Aadhaar linked)',
      'Site patta / ownership certificate / land record'
    ],
    teRequiredDocuments: [
      'కుటుంబ సభ్యుల ఆధార్ కార్డులు',
      'ఉపాధి హామీ జాబ్ కార్డు (MGNREGS Job Card)',
      'బ్యాంక్ ఖాతా పాస్‌బుక్',
      'ఇంటి స్థలం పట్టా లేదా యాజమాన్య పత్రం'
    ],
    applicationSteps: [
      'Beneficiary identified via Gram Sabha through Awaas+ ranking list.',
      'Geo-tagged photo of existing kutcha house taken via AwaasApp.',
      'Sanction order issued by district housing department.',
      'Installments released directly after geo-tagging foundation, lintel, and roof levels.'
    ],
    teApplicationSteps: [
      'గ్రామ సభ మరియు ఆవాస్+ జాబితా ఆధారంగా లబ్ధిదారుల ఎంపిక.',
      'ఆవాస్ యాప్ ద్వారా పాత ఇంటి ఫోటోల నమోదు.',
      'నిర్మాణ పురోగతి (పునాది, గోడలు, శ్లాబ్) ఆధారంగా విడతలవారీగా నగదు జమ.'
    ],
    officialApplicationUrl: 'https://pmayg.nic.in',
    officialInfoUrl: 'https://pmayg.nic.in',
    sourceUrls: [
      'https://pmayg.nic.in',
      'https://gramawardsachivalayam.ap.gov.in',
      'https://myscheme.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'ACTIVE',
    applicationWindowStatus: 'open',
    verificationSourceType: 'central_ministry',
    published: true,
    deadline: 'Annual Targets (Awaas+ 2024-2029)',
    renewalPeriod: 'One-time permanent asset creation',
    verifiedHelpline: '1800-11-6446 (PMAY-G Toll Free)'
  },
  {
    id: 'pm-vishwakarma',
    officialName: 'PM Vishwakarma Scheme (Support for Traditional Artisans & Craftsmen)',
    teName: 'పీఎం విశ్వకర్మ సాంప్రదాయ చేతివృత్తుల సంక్షేమ పథకం',
    hiName: 'पीएम विश्वकर्मा योजना',
    department: 'Ministry of Micro, Small and Medium Enterprises, Govt. of India',
    responsibleMinistry: 'Ministry of MSME & Ministry of Skill Development, Govt. of India',
    govLevel: 'central',
    state: 'All India',
    category: 'msme_entrepreneurship',
    summary: 'End-to-end holistic support for 18 traditional artisan trades with recognition certificates, ₹15,000 toolkits incentive, and 5% concessional enterprise loans up to ₹3 Lakhs.',
    teSummary: '18 రకాల సాంప్రదాయ చేతివృత్తుల వారికి విశ్వకర్మ గుర్తింపు కార్డు, ₹15,000 ఉచిత టూల్‌కిట్ మరియు 5% రాయితీ వడ్డీతో రూ. 3 లక్షల వరకు రుణాలు.',
    description: 'PM Vishwakarma covers 18 traditional trades (Carpenters, Blacksmiths, Goldsmiths, Potters, Sculptors, Cobblers, Masons, Weavers, Tailors, Barbers, Washermen, etc.). Offers verification via Gram Panchayat, 5-7 days basic skill training with ₹500/day stipend, modern toolkit incentive of ₹15,000, and collateral-free enterprise credit of ₹1,00,000 (Tranche 1) and ₹2,00,000 (Tranche 2) at a concessional interest rate of 5%.',
    teDescription: 'వడ్రంగులు, కమ్మరులు, కుమ్మరులు, స్వర్ణకారులు, మేదరులు, శిల్పులు, దర్జీలు, క్షురకులు తదితర 18 వృత్తుల వారికి ప్రభుత్వం అందించే సమగ్ర మద్దతు. శిక్షణ సమయంలో రోజుకు రూ. 500 భత్యం, ఆధునిక పనిముట్ల కొనుగోలుకు రూ. 15,000 మరియు 5% రాయితీ వడ్డీతో రూ. 3 లక్షల వరకు పూచీకత్తు లేని రుణం.',
    benefitDetails: 'PM Vishwakarma Certificate & ID Card + ₹500/day training stipend + ₹15,000 Toolkit e-Voucher + Collateral-free loan up to ₹3,00,000 at 5% interest.',
    teBenefitDetails: 'విశ్వకర్మ ఐడీ కార్డు + శిక్షణ సమయంలో రోజుకు రూ. 500 + టూల్‌కిట్ కోసం రూ. 15,000 గ్రాంట్ + 5% వడ్డీతో రూ. 3 లక్షల వరకు రుణం.',
    benefitAmount: '₹15,000 Tool Incentive + ₹3,00,000 Low-Interest Loan',
    eligibilityCriteria: {
      minAge: 18,
      occupations: [
        'Carpenter (Suthar)', 'Boat Maker', 'Armourer', 'Blacksmith (Lohar)', 'Hammer and Tool Kit Maker',
        'Locksmith', 'Sculptor (Moortikar/Stone Carver)', 'Goldsmith (Sonar)', 'Potter (Kumhaar)',
        'Cobbler (Charmakar)', 'Mason (Rajmistri)', 'Basket/Mat/Broom Maker', 'Doll & Toy Maker',
        'Barber (Naai)', 'Garland Maker (Malakaar)', 'Washerman (Dhobi)', 'Tailor (Darzi)', 'Fishing Net Maker'
      ],
      additionalRules: [
        'Must be practicing one of the 18 specified traditional family crafts.',
        'Only one member per family is eligible to receive benefits.',
        'Applicant should not have availed credit under similar central or state credit schemes (PMEGP, PM SVANidhi, Mudra) in the past 5 years.'
      ],
      teAdditionalRules: [
        'నిర్దేశిత 18 సాంప్రదాయ చేతివృత్తులలో ఒక వృత్తిని ఆచరిస్తూ ఉండాలి.',
        'కుటుంబంలో ఒకరికి మాత్రమే వర్తిస్తుంది.',
        'గత 5 సంవత్సరాలలో పీఎంఈజీపీ లేదా ముద్ర రుణాలు పొంది ఉండకూడదు.'
      ]
    },
    exclusions: ['Government employees and their immediate family members'],
    requiredDocuments: [
      'Aadhaar Card and active Mobile Number linked with Aadhaar',
      'Bank Account Passbook / Statement',
      'Ration Card / Family Member details',
      'Trade Skill Declaration / Certificate if available'
    ],
    teRequiredDocuments: [
      'ఆధార్ కార్డు',
      'బ్యాంక్ ఖాతా పాస్‌బుక్',
      'రేషన్ కార్డు',
      'వృత్తి నైపుణ్య వివరాల పత్రం'
    ],
    applicationSteps: [
      'Enroll through nearest Common Service Centre (CSC) or Grama/Ward Sachivalayam on pmvishwakarma.gov.in.',
      'Three-tier verification: Gram Panchayat / Urban Local Body -> District Implementation Committee -> Screening Committee.',
      'Undergo 5-7 days basic skill training at accredited NSDC training centre.',
      'Receive ₹15,000 digital toolkit e-voucher.',
      'Apply for collateral-free credit at designated bank.'
    ],
    teApplicationSteps: [
      'CSC కేంద్రం లేదా సచివాలయం ద్వారా pmvishwakarma.gov.in లో దరఖాస్తు చేసుకోవాలి.',
      'గ్రామ పంచాయతీ మరియు జిల్లా స్థాయి అధికారులచే పరిశీలన.',
      '5 నుండి 7 రోజుల నైపుణ్య శిక్షణ పూర్తి చేయడం.',
      'పనిముట్ల కొనుగోలుకు రూ. 15,000 ఈ-వోచర్ అందుకోవడం.',
      'బ్యాంకు ద్వారా 5% వడ్డీతో రుణ మంజూరు.'
    ],
    officialApplicationUrl: 'https://pmvishwakarma.gov.in',
    officialInfoUrl: 'https://pmvishwakarma.gov.in',
    sourceUrls: [
      'https://pmvishwakarma.gov.in',
      'https://myscheme.gov.in',
      'https://msme.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'ACTIVE',
    applicationWindowStatus: 'open',
    verificationSourceType: 'central_ministry',
    published: true,
    deadline: 'Open Ongoing Scheme',
    renewalPeriod: 'Tranche 2 unlocked upon 6 months of regular repayment',
    verifiedHelpline: '1800-267-7777 / 17923 (PM Vishwakarma Helpdesk)'
  },
  {
    id: 'pradhan-mantri-mudra-yojana',
    officialName: 'Pradhan Mantri MUDRA Yojana (PMMY Enterprise Loans)',
    teName: 'ప్రధాన మంత్రి ముద్ర రుణ పథకం (చిరువ్యాపారాల ప్రోత్సాహం)',
    hiName: 'प्रधानमंत्री मुद्रा योजना (पीएमएमवाई)',
    department: 'Department of Financial Services, Ministry of Finance, Govt. of India',
    responsibleMinistry: 'Ministry of Finance, Govt. of India',
    govLevel: 'central',
    state: 'All India',
    category: 'msme_entrepreneurship',
    summary: 'Collateral-free business enterprise loans up to ₹10 Lakhs (and up to ₹20 Lakhs under Tarun Plus) across Shishu, Kishore, and Tarun categories.',
    teSummary: 'చిరు వ్యాపారులు, వర్తకులు, సేవా రంగ వ్యవస్థాపకులకు పూచీకత్తు లేకుండా రూ. 50,000 నుండి రూ. 10 లక్షల వరకు వ్యాపార రుణాలు.',
    description: 'PMMY facilitates micro-credit to non-corporate, non-farm small/micro enterprises. Three categories: Shishu (loans up to ₹50,000 for starting new ventures), Kishore (loans ₹50,001 to ₹5,00,000 for purchasing equipment/stock), and Tarun (loans ₹5,00,001 to ₹10,00,000 for business expansion). Provided through all commercial, regional rural, and cooperative banks without collateral.',
    teDescription: 'చిన్న వ్యాపారాలు, దుకాణాలు, తయారీ మరియు సేవా రంగ యూనిట్లు ప్రారంభించడానికి లేదా విస్తరించడానికి ప్రభుత్వం అందించే పూచీకత్తు లేని ముద్ర రుణాలు. శిశు (రూ. 50,000 వరకు), కిశోర్ (రూ. 5 లక్షల వరకు), తరుణ్ (రూ. 10 లక్షల వరకు).',
    benefitDetails: 'Collateral-free institutional bank loans: Shishu (up to ₹50k), Kishore (₹50k - ₹5L), Tarun (₹5L - ₹10L). Concessional processing fees.',
    teBenefitDetails: 'పూచీకత్తు లేని బ్యాంక్ రుణాలు: శిశు (రూ. 50 వేల వరకు), కిశోర్ (రూ. 5 లక్షల వరకు), తరుణ్ (రూ. 10 లక్షల వరకు).',
    benefitAmount: '₹50,000 to ₹10,00,000 Loan',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 65,
      gender: 'all',
      occupations: ['Shopkeeper', 'Trader', 'Artisan', 'Small Manufacturer', 'Service Provider', 'Food Processor'],
      additionalRules: [
        'Must have a viable business proposal for trading, manufacturing, or service activities.',
        'Must not be a defaulter with any commercial bank or financial institution.'
      ],
      teAdditionalRules: [
        'వ్యాపార లేదా సేవా రంగ యూనిట్ నడపడానికి ప్రణాళిక ఉండాలి.',
        'ఏ బ్యాంకులోనూ మొండి బకాయిలు (డిఫాల్ట్) ఉండకూడదు.'
      ]
    },
    exclusions: ['Direct agricultural crop production (allied agri is allowed)', 'Large corporate entities'],
    requiredDocuments: [
      'Proof of Identity (Aadhaar Card / Voter ID / PAN Card)',
      'Proof of Residence',
      'Business address and establishment proof (Udyam Registration)',
      'Quotations for machinery/items to be purchased',
      'Past 6 months bank statement'
    ],
    teRequiredDocuments: [
      'ఆధార్ కార్డు మరియు పాన్ కార్డు',
      'నివాస ధృవీకరణ పత్రం',
      'వ్యాపార రిజిస్ట్రేషన్ పత్రం (ఉద్యమ్ రిజిస్ట్రేషన్)',
      'బ్యాంక్ ఖాతా స్టేట్‌మెంట్ (గత 6 నెలలు)'
    ],
    applicationSteps: [
      'Register business on Udyam portal (udyamregistration.gov.in) to get Udyam number.',
      'Apply online on udyamimitra.in portal or visit nearest bank branch with business plan.',
      'Bank branch appraises proposal and sanctions loan within 15-30 days.',
      'Mudra Card (debit card) issued for drawing working capital.'
    ],
    teApplicationSteps: [
      'udyamimitra.in వెబ్‌సైట్‌లో దరఖాస్తు చేసుకోవాలి లేదా బ్యాంకును సంప్రదించాలి.',
      'వ్యాపార ప్రతిపాదన సమర్పణ.',
      'బ్యాంకు ద్వారా పరిశీలన మరియు రుణ మంజూరు.',
      'వర్కింగ్ క్యాపిటల్ కోసం ముద్ర రూపే కార్డు జారీ.'
    ],
    officialApplicationUrl: 'https://www.mudra.org.in',
    officialInfoUrl: 'https://www.mudra.org.in',
    sourceUrls: [
      'https://www.mudra.org.in',
      'https://myscheme.gov.in',
      'https://financialservices.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'ACTIVE',
    applicationWindowStatus: 'open',
    verificationSourceType: 'central_ministry',
    published: true,
    deadline: 'Continuous All-Year Operation',
    renewalPeriod: 'Annual review for working capital limits',
    verifiedHelpline: '1800-180-1111 / 1800-11-0001 (National MUDRA Helpline)'
  },
  {
    id: 'mgnregs-rural-employment',
    officialName: 'Mahatma Gandhi National Rural Employment Guarantee Scheme (MGNREGS)',
    teName: 'మహాత్మా గాంధీ జాతీయ గ్రామీణ ఉపాధి హామీ పథకం',
    hiName: 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी योजना (मनरेगा)',
    department: 'Department of Rural Development, Ministry of Rural Development, GoI & Panchayat Raj & Rural Development Department, AP',
    responsibleMinistry: 'Ministry of Rural Development, Govt. of India',
    govLevel: 'central',
    state: 'All India',
    category: 'employment',
    summary: 'Statutory guarantee of 100 days of unskilled wage employment per year to every rural household whose adult members volunteer for manual work.',
    teSummary: 'గ్రామీణ ప్రాంతాల్లోని ప్రతి కుటుంబానికి ఏడాదికి కనీసం 100 రోజుల పాటు నైపుణ్యం లేని కూలీ పనులను కల్పించే చట్టబద్ధమైన ఉపాధి హక్కు పథకం.',
    description: 'MGNREGS guarantees 100 days of wage employment per financial year to adult members of any rural household willing to do public manual work. Work must be provided within 15 days of application, failing which an unemployment allowance is legally mandated. Daily wages are revised annually and credited directly into Aadhaar-seeded bank/post office accounts.',
    teDescription: 'గ్రామీణ పేదలకు చట్టబద్ధంగా ఉపాధి కల్పించే జాతీయ పథకం. జాబ్ కార్డు కలిగిన ప్రతి కుటుంబానికి ఏడాదికి 100 రోజుల పని లభిస్తుంది. పని అడిగిన 15 రోజుల్లో పని కల్పించకపోతే నిరుద్యోగ భృతి పొందే హక్కు ఉంటుంది. కూలీ డబ్బులు నేరుగా బ్యాంకు ఖాతాలో జమవుతాయి.',
    benefitDetails: 'Guaranteed 100 days wage employment per household per year. Current Andhra Pradesh statutory wage rate is ₹300 per day credited directly via DBT.',
    teBenefitDetails: 'ఏడాదికి 100 రోజుల ఉపాధి హామీ. ఆంధ్రప్రదేశ్ కూలీ రేటు రోజుకు రూ. 300 నేరుగా బ్యాంక్ ఖాతాలో జమ.',
    benefitAmount: '100 Days of Guaranteed Wages (₹300/day in AP)',
    eligibilityCriteria: {
      minAge: 18,
      locationType: 'rural',
      additionalRules: [
        'Must be a local resident of the Gram Panchayat.',
        'Willing to perform unskilled manual physical work.',
        'Must hold or apply for a valid MGNREGS Job Card.'
      ],
      teAdditionalRules: [
        'గ్రామ పంచాయతీ పరిధిలోని స్థానిక నివాసి అయి ఉండాలి.',
        'నైపుణ్యం లేని శారీరక పనులు చేయడానికి సిద్ధంగా ఉండాలి.'
      ]
    },
    exclusions: ['Urban local body residents', 'Minor children below 18 years'],
    requiredDocuments: [
      'Aadhaar Card of all adult applicants in the household',
      'Proof of rural residence (Ration Card / Voter ID)',
      'Bank or Post Office savings account passbook',
      'Passport-size photographs for Job Card'
    ],
    teRequiredDocuments: [
      'ఆధార్ కార్డు',
      'నివాస ధృవీకరణ పత్రం (రేషన్ కార్డు)',
      'బ్యాంక్ ఖాతా లేదా పోస్టాఫీస్ పాస్‌బుక్'
    ],
    applicationSteps: [
      'Submit Form-1 application to Gram Panchayat / Village Secretariat for Job Card.',
      'Gram Panchayat issues free Job Card within 15 days of application.',
      'Submit written application for work specifying dates.',
      'Work allocated within 5 km of village within 15 days.',
      'Weekly/fortnightly wages credited via National Electronic Fund Management System (NeFMS).'
    ],
    teApplicationSteps: [
      'గ్రామ పంచాయతీ లేదా సచివాలయంలో ఉపాధి హామీ జాబ్ కార్డు కోసం దరఖాస్తు.',
      '15 రోజుల్లోపు ఉచిత జాబ్ కార్డు జారీ.',
      'పని కావాలని కోరుతూ దరఖాస్తు సమర్పణ.',
      '15 రోజుల్లో గ్రామ సమీపంలోనే పని కేటాయింపు.',
      'నేరుగా ఆధార్ ఆధారిత బ్యాంక్ ఖాతాలో వేతనం జమ.'
    ],
    officialApplicationUrl: 'https://gramawardsachivalayam.ap.gov.in',
    officialInfoUrl: 'https://nrega.nic.in',
    sourceUrls: [
      'https://nrega.nic.in',
      'https://gramawardsachivalayam.ap.gov.in',
      'https://india.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'ACTIVE',
    applicationWindowStatus: 'open',
    verificationSourceType: 'central_ministry',
    published: true,
    deadline: 'Demand-driven open all year',
    renewalPeriod: '5-year Job Card validity',
    verifiedHelpline: '1800-11-1555 / 1902'
  },
  {
    id: 'atal-pension-yojana',
    officialName: 'Atal Pension Yojana (APY Guaranteed Social Security)',
    teName: 'అటల్ పెన్షన్ యోజన (గ్యారెంటీ వృద్ధాప్య పింఛను పథకం)',
    hiName: 'अटल पेंशन योजना (एपीवाई)',
    department: 'Pension Fund Regulatory and Development Authority (PFRDA) & Ministry of Finance, Govt. of India',
    responsibleMinistry: 'Ministry of Finance, Govt. of India',
    govLevel: 'central',
    state: 'All India',
    category: 'pensions',
    summary: 'Guaranteed government lifelong monthly pension of ₹1,000 to ₹5,000 from age 60 for unorganized sector workers joining between ages 18 and 40.',
    teSummary: 'అసంఘటిత రంగ కార్మికులకు 60 సంవత్సరాల వయస్సు నుండి జీవితాంతం నెలకు రూ. 1,000 నుండి రూ. 5,000 వరకు గ్యారెంటీ పింఛను అందించే పథకం.',
    description: 'Atal Pension Yojana is a flagship national social security pension scheme administered by PFRDA under the National Pension System (NPS) architecture. Citizens aged 18 to 40 make affordable monthly contributions to receive a guaranteed monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 from the age of 60 years. On subscriber demise, spouse receives the same pension, and on demise of both, accumulated pension wealth is returned to the nominee.',
    teDescription: '18 నుండి 40 సంవత్సరాల వయస్సు గల పౌరులు చిన్న మొత్తంలో పొదుపు చేయడం ద్వారా 60 ఏళ్ల తర్వాత ప్రతి నెలా జీవితాంతం రూ. 1,000 నుంచి రూ. 5,000 వరకు నిర్ధారిత పింఛను పొందే కేంద్ర ప్రభుత్వ పథకం.',
    benefitDetails: 'Guaranteed lifelong monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 from age 60 + survivor benefits for spouse and nominee.',
    teBenefitDetails: '60 ఏళ్ల వయస్సు నుండి జీవితాంతం నెలకు రూ. 1,000 నుండి రూ. 5,000 వరకు పింఛను. భాగస్వామికి కూడా అదే పింఛను వర్తిస్తుంది.',
    benefitAmount: '₹1,000 - ₹5,000 / month guaranteed pension',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 40,
      gender: 'all',
      additionalRules: [
        'Must possess a savings bank account with auto-debit facility.',
        'Must not be an Income Tax payer (as per current PFRDA norms effective October 2022).',
        'Must not be covered under any other statutory social security scheme (EPFO/NPS).'
      ],
      teAdditionalRules: [
        'వయస్సు 18 నుండి 40 సంవత్సరాల మధ్య ఉండాలి.',
        'పొదుపు ఖాతా (Savings Bank Account) ఉండాలి.',
        'ఆదాయపు పన్ను చెల్లించేవారు అర్హులు కారు.'
      ]
    },
    exclusions: ['Income tax payers', 'Existing statutory pension members (EPFO / NPS Government)'],
    requiredDocuments: [
      'Aadhaar Card',
      'Savings Bank Account Passbook with Auto-Debit Mandate',
      'Active mobile number linked with bank',
      'Nominee identification and Aadhaar details'
    ],
    teRequiredDocuments: [
      'ఆధార్ కార్డు',
      'బ్యాంక్ పొదుపు ఖాతా పాస్‌బుక్',
      'నామినీ వివరాలు'
    ],
    applicationSteps: [
      'Visit any commercial bank, Grameena bank, or post office branch where you have a savings account.',
      'Fill APY registration form specifying chosen pension amount (₹1k to ₹5k).',
      'Submit Aadhaar and enable auto-debit mandate.',
      'PRAN (Permanent Retirement Account Number) card issued digitally via Protean NSDL CRA.',
      'Monthly contribution auto-debited until age 60.'
    ],
    teApplicationSteps: [
      'మీ ఖాతా ఉన్న బ్యాంకు లేదా పోస్టాఫీసును సంప్రదించాలి.',
      'అటల్ పెన్షన్ యోజన దరఖాస్తును పూరించి పింఛను మొత్తాన్ని ఎంచుకోవాలి.',
      'ఆటో-డెబిట్ ఆప్షన్ ఎనేబుల్ చేసుకోవాలి.',
      'ప్రాన్ (PRAN) కార్డు జారీ చేయబడుతుంది.'
    ],
    officialApplicationUrl: 'https://www.npscra.nsdl.co.in',
    officialInfoUrl: 'https://www.npscra.nsdl.co.in',
    sourceUrls: [
      'https://www.npscra.nsdl.co.in',
      'https://myscheme.gov.in',
      'https://india.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'ACTIVE',
    applicationWindowStatus: 'open',
    verificationSourceType: 'central_ministry',
    published: true,
    deadline: 'Open enrolment for citizens aged 18-40',
    renewalPeriod: 'Continuous monthly auto-debit',
    verifiedHelpline: '1800-110-069 (PFRDA APY Helpdesk)'
  },
  {
    id: 'sukanya-samriddhi-yojana',
    officialName: 'Sukanya Samriddhi Yojana (Girl Child Welfare & Higher Education)',
    teName: 'సుకన్య సమృద్ధి యోజన (బాలికా సంక్షేమ పొదుపు పథకం)',
    hiName: 'सुकन्या समृद्धि योजना (बेटी बचाओ बेटी पढ़ाओ)',
    department: 'Department of Economic Affairs, Ministry of Finance & Ministry of Women and Child Development, GoI',
    responsibleMinistry: 'Ministry of Finance & Department of Posts, Govt. of India',
    govLevel: 'central',
    state: 'All India',
    category: 'women_shg',
    summary: 'Government-backed high-yield small savings scheme with 8.2% interest rate and triple-tax-exempt (EEE) status for girl children up to age 10.',
    teSummary: '10 సంవత్సరాల లోపు ఆడపిల్లల భవిష్యత్తు మరియు ఉన్నత చదువుల కోసం 8.2% అధిక వడ్డీతో పూర్తి పన్ను మినహాయింపు గల కేంద్ర ప్రభుత్వ పొదుపు పథకం.',
    description: 'Sukanya Samriddhi Account (SSA) is a dedicated small-deposit savings scheme under the Beti Bachao Beti Padhao initiative. Parents or legal guardians can open an account for a girl child from her birth till she attains 10 years of age. Offers highest government interest rate (8.2% p.a. compounded annually) and full tax exemption under Section 80C. Matures after 21 years from account opening with partial withdrawal allowed at age 18 for higher education.',
    teDescription: 'ఆడపిల్లల ఉన్నత విద్య మరియు వివాహ ఖర్చులకు ఆర్థిక రక్షణ కల్పించే పథకం. పుట్టినప్పటి నుంచి 10 సంవత్సరాల లోపు వయసున్న ఆడపిల్లల పేరిట తల్లిదండ్రులు పోస్టాఫీసు లేదా బ్యాంకులో ఈ ఖాతాను తెరవవచ్చు. కనీసం రూ. 250 నుంచి గరిష్టంగా రూ. 1.50 లక్షల వరకు పొదుపు చేయవచ్చు.',
    benefitDetails: 'Current interest rate of 8.2% p.a. compounded annually + Triple Tax Exemption (EEE) under Section 80C. Partial withdrawal up to 50% allowed at age 18.',
    teBenefitDetails: 'ఏటా 8.2% చక్రవడ్డీ. సెక్షన్ 80C కింద పూర్తి ఆదాయపు పన్ను మినహాయింపు. 18 ఏళ్లు నిండిన తర్వాత ఉన్నత చదువుల కోసం 50% నగదు ఉపసంహరణ అవకాశం.',
    benefitAmount: 'High-Yield 8.2% Compound Interest + Tax Free Return',
    eligibilityCriteria: {
      minAge: 0,
      maxAge: 10,
      gender: 'female',
      additionalRules: [
        'Account can be opened by parents/guardians for a girl child before she attains 10 years of age.',
        'Maximum 2 accounts per family (or 3 in case of first-born twin girls).',
        'Minimum deposit of ₹250 per financial year; maximum ₹1,50,000 per financial year.'
      ],
      teAdditionalRules: [
        'ఆడపిల్ల వయస్సు 10 సంవత్సరాల లోపు ఉండాలి.',
        'ఒక కుటుంబంలో గరిష్టంగా ఇద్దరు ఆడపిల్లలకు మాత్రమే ఈ ఖాతా తెరవవచ్చు.',
        'ఏడాదికి కనీసం రూ. 250 జమ చేయాలి.'
      ]
    },
    exclusions: ['Male children', 'Girl children above 10 years of age at the time of account opening'],
    requiredDocuments: [
      'Birth Certificate of the girl child',
      'Aadhaar Card and PAN card of the parent / legal guardian',
      'Address proof of the parent / guardian',
      'Passport size photographs of child and parent'
    ],
    teRequiredDocuments: [
      'బాలిక పుట్టిన తేదీ ధృవీకరణ పత్రం (Birth Certificate)',
      'తల్లి లేదా తండ్రి ఆధార్ కార్డు మరియు పాన్ కార్డు',
      'నివాస ధృవీకరణ పత్రం',
      'పాస్‌పోర్ట్ సైజ్ ఫోటోలు'
    ],
    applicationSteps: [
      'Visit any Post Office or authorized commercial bank branch (SBI, Andhra Pragathi Grameena, etc.).',
      'Submit SSA account opening form along with child birth certificate and KYC documents.',
      'Deposit initial amount (minimum ₹250).',
      'Passbook issued with account number and interest accrual ledger.'
    ],
    teApplicationSteps: [
      'సమీపంలోని పోస్టాఫీసు లేదా జాతీయ బ్యాంకు శాఖను సంప్రదించాలి.',
      'దరఖాస్తు ఫారంతో పాటు జనన ధృవీకరణ పత్రం మరియు ఆధార్ సమర్పించాలి.',
      'కనీస మొత్తం రూ. 250 జమ చేసి ఖాతా తెరవాలి.',
      'పాస్‌బుక్ జారీ చేయబడుతుంది.'
    ],
    officialApplicationUrl: 'https://www.indiapost.gov.in',
    officialInfoUrl: 'https://www.indiapost.gov.in',
    sourceUrls: [
      'https://www.indiapost.gov.in',
      'https://myscheme.gov.in',
      'https://financialservices.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'ACTIVE',
    applicationWindowStatus: 'open',
    verificationSourceType: 'central_ministry',
    published: true,
    deadline: 'Open until child turns 10 years of age',
    renewalPeriod: 'Annual deposit tenure of 15 years',
    verifiedHelpline: '1800-266-6868 (India Post Toll-Free)'
  },
  {
    id: 'stand-up-india',
    officialName: 'Stand-Up India Scheme for SC, ST & Women Entrepreneurs',
    teName: 'స్టాండ్-అప్ ఇండియా రుణ పథకం (ఎస్సీ, ఎస్టీ మరియు మహిళా పారిశ్రామికవేత్తల కోసం)',
    hiName: 'स्टैंड-अप इंडिया योजना',
    department: 'Department of Financial Services, Ministry of Finance, Govt. of India & SIDBI',
    responsibleMinistry: 'Ministry of Finance, Govt. of India',
    govLevel: 'central',
    state: 'All India',
    category: 'msme_entrepreneurship',
    summary: 'Bank composite loans between ₹10 Lakhs and ₹1 Crore for setting up greenfield manufacturing, services, or trading enterprises by SC, ST, or women entrepreneurs.',
    teSummary: 'ఎస్సీ, ఎస్టీ మరియు మహిళా పారిశ్రామికవేత్తలు కొత్త వ్యాపారాలు, పరిశ్రమలు స్థాపించడానికి బ్యాంకుల ద్వారా రూ. 10 లక్షల నుండి రూ. 1 కోటి వరకు బ్యాంక్ రుణాలు.',
    description: 'Stand-Up India facilitates bank loans between ₹10 Lakhs and ₹1 Crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch of all scheduled commercial banks for setting up a greenfield enterprise in manufacturing, services, agri-allied, or trading sectors.',
    teDescription: 'ఎస్సీ, ఎస్టీ మరియు మహిళలు పారిశ్రామికవేత్తలుగా ఎదగడానికి భారత ప్రభుత్వం ప్రవేశపెట్టిన విశిష్ట పథకం. ప్రతి బ్యాంకు శాఖ కనీసం ఒక ఎస్సీ/ఎస్టీ మరియు ఒక మహిళా ఔత్సాహిక పారిశ్రామికవేత్తకు రూ. 10 లక్షల నుండి రూ. 1 కోటి వరకు వ్యాపార రుణాన్ని అందిస్తుంది.',
    benefitDetails: 'Composite loan (term loan + working capital) between ₹10,00,000 and ₹1,00,00,000 covering up to 85% of project cost with 15% borrower margin.',
    teBenefitDetails: 'ప్రాజెక్ట్ వ్యయంలో 85% వరకు రూ. 10 లక్షల నుండి రూ. 1 కోటి వరకు టర్మ్ లోన్ మరియు వర్కింగ్ క్యాపిటల్ రుణం.',
    benefitAmount: '₹10 Lakhs to ₹1 Crore Commercial Loan',
    eligibilityCriteria: {
      minAge: 18,
      gender: 'all',
      socialCategories: ['SC', 'ST'],
      additionalRules: [
        'Borrower must be an SC/ST individual or a woman entrepreneur.',
        'Enterprise must be a greenfield project (first-time venture in manufacturing, services, or trading).',
        'In non-individual enterprises, at least 51% shareholding and controlling stake must be held by an SC/ST or woman entrepreneur.'
      ],
      teAdditionalRules: [
        'దరఖాస్తుదారు ఎస్సీ, ఎస్టీ వర్గానికి చెందినవారు లేదా మహిళ అయి ఉండాలి.',
        'కొత్తగా ప్రారంభించే వ్యాపార లేదా తయారీ రంగ యూనిట్ అయి ఉండాలి.',
        'కంపెనీలలో కనీసం 51% యాజమాన్య వాటా ఎస్సీ/ఎస్టీ లేదా మహిళలకు ఉండాలి.'
      ]
    },
    exclusions: ['Existing businesses applying for brownfield expansion', 'Defaulters to any financial institution'],
    requiredDocuments: [
      'Aadhaar Card and PAN card',
      'Caste Certificate (for SC/ST applicants)',
      'Detailed Project Report (DPR) with projected balance sheets',
      'Proof of business premises / Lease deed / Factory site',
      'Pollution control and municipal trade clearance licenses'
    ],
    teRequiredDocuments: [
      'ఆధార్ కార్డు మరియు పాన్ కార్డు',
      'కుల ధృవీకరణ పత్రం (ఎస్సీ / ఎస్టీ లకు)',
      'ప్రాజెక్ట్ నివేదిక (Detailed Project Report - DPR)',
      'వ్యాపార స్థల యాజమాన్య లేదా లీజు పత్రాలు'
    ],
    applicationSteps: [
      'Prepare project report and apply online on Stand-Up Mitra portal at standupmitra.in.',
      'Application automatically routed to chosen scheduled commercial bank branch.',
      'Bank appraisal, interview, and sanction within 30-45 working days.',
      'Credit guarantee coverage provided through NCGTC.'
    ],
    teApplicationSteps: [
      'standupmitra.in పోర్టల్ ద్వారా ప్రాజెక్ట్ రిపోర్టుతో ఆన్‌లైన్‌లో దరఖాస్తు చేసుకోవాలి.',
      'ఎంచుకున్న బ్యాంక్ శాఖ ద్వారా ప్రాజెక్ట్ పరిశీలన.',
      'బ్యాంకు ద్వారా రుణ మంజూరు మరియు నిధుల విడుదల.'
    ],
    officialApplicationUrl: 'https://www.standupmitra.in',
    officialInfoUrl: 'https://www.standupmitra.in',
    sourceUrls: [
      'https://www.standupmitra.in',
      'https://myscheme.gov.in',
      'https://financialservices.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'ACTIVE',
    applicationWindowStatus: 'open',
    verificationSourceType: 'central_ministry',
    published: true,
    deadline: 'Active national scheme (extended to 2026-2027)',
    renewalPeriod: 'Repayment period up to 7 years with 18-month moratorium',
    verifiedHelpline: '1800-180-1111 (Toll-Free Stand-Up Mitra Helpdesk)'
  },
  {
    id: 'post-matric-scholarship-central',
    officialName: 'Centrally Sponsored Post-Matric Scholarship for SC/ST/OBC Students',
    teName: 'కేంద్ర పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ పథకం (ఎస్సీ, ఎస్టీ, ఓబీసీ విద్యార్థుల కోసం)',
    hiName: 'अनुसूचित जाति/जनजाति के लिए पोस्ट-मैट्रिक छात्रवृत्ति योजना',
    department: 'Ministry of Social Justice & Empowerment and Ministry of Tribal Affairs, Govt. of India',
    responsibleMinistry: 'Ministry of Social Justice & Empowerment, Govt. of India',
    govLevel: 'central',
    state: 'All India',
    category: 'education',
    summary: 'Government of India scholarship providing full tuition fee support and monthly maintenance allowance for post-secondary studies up to Ph.D. level.',
    teSummary: 'ఎస్సీ, ఎస్టీ, ఓబీసీ విద్యార్థులకు ఇంటర్మీడియట్ తర్వాత ఉన్నత చదువుల కోసం పూర్తి కాలేజ్ ఫీజు మరియు ప్రతి నెలా నిర్వహణ భత్యం అందించే కేంద్ర పథకం.',
    description: 'Centrally Sponsored Post-Matric Scholarship provides financial assistance to SC, ST, and OBC students pursuing post-matriculation or post-secondary courses in government recognized institutions. Covers compulsory non-refundable fees, monthly maintenance allowance up to ₹1,200/month for hostellers, study tour expenses, and thesis preparation charges.',
    teDescription: 'ఉన్నత చదువులు అభ్యసించే ఎస్సీ, ఎస్టీ, ఓబీసీ విద్యార్థులకు కేంద్ర ప్రభుత్వం అందించే ఉపకార వేతనం. ట్యూషన్ ఫీజులతో పాటు హాస్టల్ లేదా డే-స్కాలర్ విద్యార్థులకు నెలవారీ మెయింటెనెన్స్ అలవెన్స్ లభిస్తుంది.',
    benefitDetails: 'Full statutory course tuition fees + monthly maintenance allowance (₹230 - ₹1,200/month depending on course level and hostel status).',
    teBenefitDetails: 'పూర్తి కాలేజీ ఫీజులు + నెలకు రూ. 230 నుండి రూ. 1,200 వరకు నిర్వహణ భత్యం.',
    benefitAmount: 'Full Fees + Monthly Allowance',
    eligibilityCriteria: {
      minAge: 16,
      maxAge: 35,
      gender: 'all',
      maxAnnualIncome: 250000,
      socialCategories: ['SC', 'ST', 'BC'],
      educationLevels: ['Polytechnic', 'ITI', 'Undergraduate', 'Postgraduate', 'M.Phil / Ph.D.'],
      additionalRules: [
        'Candidate must belong to SC, ST, or OBC community recognized in the State list.',
        'Family annual income from all sources must not exceed ₹2.50 Lakhs.',
        'Must not be in receipt of any other regular scholarship for the same academic year.'
      ],
      teAdditionalRules: [
        'ఎస్సీ, ఎస్టీ లేదా ఓబీసీ వర్గానికి చెందినవారై ఉండాలి.',
        'కుటుంబ వార్షిక ఆదాయం రూ. 2.50 లక్షల లోపు ఉండాలి.',
        'గుర్తింపు పొందిన ఉన్నత విద్యా కోర్సులలో చదువుతూ ఉండాలి.'
      ]
    },
    exclusions: ['Students pursuing studies via distance/open university with regular employment'],
    requiredDocuments: [
      'Aadhaar Card of the Student',
      'Permanent Caste Certificate issued by competent revenue authority',
      'Income Certificate issued by Meeseva / Tehsildar',
      'Admission fee receipt and College Allotment Order',
      'Previous educational mark sheets and Bank Passbook (NPCI seeded)'
    ],
    teRequiredDocuments: [
      'విద్యార్థి ఆధార్ కార్డు',
      'కుల ధృవీకరణ పత్రం',
      'ఆదాయ ధృవీకరణ పత్రం (మీసేవ)',
      'కాలేజ్ ఫీజు రసీదు మరియు అలాట్‌మెంట్ ఆర్డర్',
      'బ్యాంక్ ఖాతా పాస్‌బుక్'
    ],
    applicationSteps: [
      'Apply online on National Scholarship Portal at scholarships.gov.in during open window.',
      'Submit academic, fee, and caste details with document uploads.',
      'Institute nodal officer validates application at college level.',
      'State welfare department approves and releases scholarship via DBT PFMS.'
    ],
    teApplicationSteps: [
      'నేషనల్ స్కాలర్‌షిప్ పోర్టల్ (scholarships.gov.in) ద్వారా ఆన్‌లైన్‌లో దరఖాస్తు చేసుకోవాలి.',
      'కళాశాల నోడల్ అధికారి ద్వారా పరిశీలన.',
      'రాష్ట్ర సంక్షేమ శాఖ ద్వారా ఆమోదం.',
      'నేరుగా విద్యార్థి బ్యాంక్ ఖాతాలో స్కాలర్‌షిప్ జమ.'
    ],
    officialApplicationUrl: 'https://scholarships.gov.in',
    officialInfoUrl: 'https://scholarships.gov.in',
    sourceUrls: [
      'https://scholarships.gov.in',
      'https://myscheme.gov.in',
      'https://socialjustice.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'ACTIVE',
    applicationWindowStatus: 'scheduled',
    verificationSourceType: 'central_ministry',
    published: true,
    deadline: 'Annual NSP portal cycle (July - November)',
    renewalPeriod: 'Annual academic progression',
    verifiedHelpline: '0120-6619540 (NSP Helpdesk)'
  },
  {
    id: 'aadabidda-nidhi-ap',
    officialName: 'Aadabidda Nidhi Scheme (Women Financial Empowerment Assistance)',
    teName: 'ఆడబిడ్డ నిధి పథకం (మహిళా ఆర్థిక సాధికారత సహాయం)',
    hiName: 'आड़ाबिड्डा निधि योजना (महिला वित्तीय सहायता)',
    department: 'Department of Women Development & Child Welfare, Govt. of Andhra Pradesh',
    responsibleMinistry: 'Women Development and Child Welfare Department, Andhra Pradesh',
    govLevel: 'state',
    state: 'Andhra Pradesh',
    category: 'women_shg',
    summary: 'Direct monthly financial assistance of ₹1,500 (₹18,000 per annum) directly credited to eligible women aged 18 to 59 years in Andhra Pradesh.',
    teSummary: 'ఆంధ్రప్రదేశ్‌లోని 18 నుండి 59 సంవత్సరాల వయస్సు గల అర్హులైన మహిళలకు నెలకు రూ. 1,500 (ఏడాదికి రూ. 18,000) నేరుగా బ్యాంక్ ఖాతాలో జమ.',
    description: 'Aadabidda Nidhi is a flagship Andhra Pradesh Super Six welfare initiative to promote gender financial independence and social security by crediting ₹1,500 per month into the Aadhaar-seeded bank account of eligible women aged between 18 and 59 years.',
    teDescription: 'మహిళల ఆర్థిక స్వావలంబన, పోషకాహార భద్రత మరియు గౌరవప్రదమైన జీవనం కోసం ఆంధ్రప్రదేశ్ ప్రభుత్వం అమలు చేస్తున్న సూపర్ సిక్స్ పథకం. 18 నుంచి 59 ఏళ్ల మధ్య ఉన్న అర్హులైన మహిళల ఖాతాల్లో ప్రతి నెలా రూ. 1,500 జమ చేయబడుతుంది.',
    benefitDetails: '₹1,500 monthly direct bank transfer (₹18,000 annually) directly to the woman\'s Aadhaar-linked NPCI bank account.',
    teBenefitDetails: 'నెలకు రూ. 1,500 (ఏడాదికి రూ. 18,000) నేరుగా మహిళ ఆధార్ అనుసంధాన బ్యాంక్ ఖాతాలో జమ.',
    benefitAmount: '₹1,500 / month (₹18,000 / year)',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 59,
      gender: 'female',
      maxAnnualIncome: 250000,
      requiresAPResidence: true,
      additionalRules: [
        'Must be a woman aged 18 to 59 years residing in Andhra Pradesh.',
        'Household must possess valid BPL White Rice Card or income certificate below ₹2.50 Lakhs.',
        'Must have an active individual bank account linked with Aadhaar and NPCI mapping.'
      ],
      teAdditionalRules: [
        'ఆంధ్రప్రదేశ్ నివాసియైన 18 నుండి 59 సంవత్సరాల వయస్సు గల మహిళలు.',
        'కుటుంబానికి తెల్ల రేషన్ కార్డు లేదా రూ. 2.50 లక్షల లోపు ఆదాయ ధృవీకరణ ఉండాలి.',
        'మహిళ వ్యక్తిగత బ్యాంక్ ఖాతాకు ఆధార్ మరియు NPCI సీడింగ్ పూర్తయి ఉండాలి.'
      ]
    },
    exclusions: [
      'Regular employees of State or Central Government or Public Sector Undertakings',
      'Income Tax paying families',
      'Families owning private four-wheelers (excluding commercial tractors and taxis)'
    ],
    requiredDocuments: [
      'Aadhaar Card of Applicant',
      'Active BPL White Rice Card / Ration Card',
      'Proof of Age (Aadhaar / Voter ID / Birth Certificate)',
      'Bank Account Passbook (Aadhaar & NPCI Seeded)'
    ],
    teRequiredDocuments: [
      'మహిళ ఆధార్ కార్డు',
      'తెల్ల రేషన్ కార్డు (White Rice Card)',
      'వయస్సు ధృవీకరణ పత్రం (ఓటర్ కార్డ్ లేదా ఆధార్)',
      'బ్యాంక్ ఖాతా పాస్‌బుక్ (NPCI సీడింగ్ పూర్తయినది)'
    ],
    applicationSteps: [
      'Submit application at nearest Grama / Ward Sachivalayam through Welfare and Education Assistant.',
      'Biometric and demographic authentication via GSWS database.',
      'Field inquiry and socioeconomic eligibility validation.',
      'Publication of social audit list for public transparency.',
      'Direct monthly bank transfer on the scheduled date.'
    ],
    teApplicationSteps: [
      'గ్రామ లేదా వార్డు సచివాలయంలో సంక్షేమ సహాయకుడిని సంప్రదించి దరఖాస్తు చేసుకోవాలి.',
      'బయోమెట్రిక్ ఈ-కేవైసీ ద్వారా ఆధార్ ధృవీకరణ.',
      'సచివాలయ సామాజిక తనిఖీ జాబితాలో అర్హుల పేర్ల ప్రదర్శన.',
      'ప్రతినెలా నిర్దేశిత తేదీన బ్యాంకు ఖాతాలో నిధుల జమ.'
    ],
    officialApplicationUrl: 'https://gramawardsachivalayam.ap.gov.in',
    officialInfoUrl: 'https://wdcw.ap.gov.in',
    sourceUrls: [
      'https://wdcw.ap.gov.in',
      'https://gramawardsachivalayam.ap.gov.in',
      'https://apfinance.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'ACTIVE',
    applicationWindowStatus: 'open',
    historicalAliases: ['Aadabidda Nidhi', 'Maha Sakthi Women Scheme', 'ఆడబిడ్డ నిధి', 'మహిళా ఆర్థిక సహాయం'],
    verificationSourceType: 'ap_gov_portal',
    published: true,
    deadline: 'Continuous Welfare Cycle',
    renewalPeriod: 'Monthly Direct Benefit Transfer',
    verifiedHelpline: '1902 (AP GSWS Grievance Helpline)'
  },
  {
    id: 'sthree-shakthi-free-bus-ap',
    officialName: 'APSRTC Sthree Shakthi Scheme (Free Bus Travel for Women)',
    teName: 'స్త్రీ శక్తి పథకం (ఆర్టీసీ బస్సుల్లో మహిళలకు ఉచిత ప్రయాణం)',
    hiName: 'स्त्री शक्ति योजना (महिलाओं के लिए मुफ्त बस यात्रा)',
    department: 'Transport, Roads & Buildings Department & APSRTC, Govt. of Andhra Pradesh',
    responsibleMinistry: 'Transport Department, Andhra Pradesh',
    govLevel: 'state',
    state: 'Andhra Pradesh',
    category: 'women_shg',
    summary: '100% free bus travel for all domicile girls, women, and transgender persons in state-run APSRTC buses across Andhra Pradesh.',
    teSummary: 'ఆంధ్రప్రదేశ్‌లోని మహిళలు, విద్యార్థినులు మరియు ట్రాన్స్‌జెండర్ పౌరులకు ఆర్టీసీ పల్లె వెలుగు, అల్ట్రా పల్లె వెలుగు, ఎక్స్‌ప్రెస్ మరియు సిటీ బస్సుల్లో పూర్తి ఉచిత ప్రయాణం.',
    description: 'Sthree Shakthi is Andhra Pradesh\'s Super Six public transport mobility welfare scheme enabling all domicile girls, women, and transgender citizens to travel free of cost on APSRTC non-AC buses (Palle Velugu, Express, City Ordinary) across the state upon presenting valid official photo identification.',
    teDescription: 'మహిళల ప్రయాణ ఖర్చులను ఆదా చేసి విద్య, ఉపాధి అవకాశాలను మెరుగుపరిచేందుకు ఆర్టీసీ బస్సుల్లో ఉచిత ప్రయాణ సౌకర్యం కల్పించే సూపర్ సిక్స్ పథకం. ఆధార్ కార్డు లేదా గుర్తింపు కార్డు చూపి జీరో టికెట్ పొందవచ్చు.',
    benefitDetails: 'Zero-fare bus ticketing across APSRTC Palle Velugu, Express, and City Ordinary bus network within Andhra Pradesh.',
    teBenefitDetails: 'ఆంధ్రప్రదేశ్ అంతటా ఆర్టీసీ సాధారణ బస్సుల్లో 100% ఉచిత జీరో టికెట్ ప్రయాణం.',
    benefitAmount: '100% Free Bus Travel',
    eligibilityCriteria: {
      minAge: 0,
      gender: 'female',
      requiresAPResidence: true,
      additionalRules: [
        'Open to all domicile girls, women, and transgender persons residing in Andhra Pradesh.',
        'Applicable on APSRTC Palle Velugu, Ultra Palle Velugu, Express, and City Ordinary buses.',
        'Passenger must carry any valid government photo identity card bearing AP domicile address.'
      ],
      teAdditionalRules: [
        'ఆంధ్రప్రదేశ్ నివాసితులైన బాలికలు, మహిళలు మరియు ట్రాన్స్‌జెండర్ వ్యక్తులందరికీ వర్తిస్తుంది.',
        'పల్లె వెలుగు, ఎక్స్‌ప్రెస్ మరియు సిటీ బస్సులలో ఉచిత ప్రయాణం.',
        'ఆధార్ కార్డు లేదా ప్రభుత్వ గుర్తింపు కార్డు కలిగి ఉండాలి.'
      ]
    },
    exclusions: ['Air-Conditioned (AC), Garuda, Night Rider, Amaravati, and Interstate long-distance services beyond state borders'],
    requiredDocuments: [
      'Aadhaar Card / Voter ID / Resident Identity Card (bearing AP address proof)'
    ],
    teRequiredDocuments: [
      'ఆధార్ కార్డు లేదా ఓటర్ గుర్తింపు కార్డు (ఆంధ్రప్రదేశ్ చిరునామాతో)'
    ],
    applicationSteps: [
      'Board any eligible APSRTC Palle Velugu, Ultra Palle Velugu, Express, or City Ordinary bus.',
      'Show your valid Andhra Pradesh Aadhaar Card or official photo ID to the bus conductor.',
      'Bus conductor issues an electronic Zero-Fare Ticket (ZFT).',
      'Travel safely to your destination without paying bus fare.'
    ],
    teApplicationSteps: [
      'అర్హతగల ఆర్టీసీ పల్లె వెలుగు లేదా ఎక్స్‌ప్రెస్ బస్సు ఎక్కండి.',
      'కండక్టర్‌కు మీ ఆధార్ కార్డు లేదా గుర్తింపు కార్డు చూపించండి.',
      'కండక్టర్ ఇచ్చే ఉచిత జీరో టికెట్ తీసుకోండి.',
      'ఉచితంగా ప్రయాణించండి.'
    ],
    officialApplicationUrl: 'https://apsrtc.ap.gov.in',
    officialInfoUrl: 'https://apsrtc.ap.gov.in',
    sourceUrls: [
      'https://apsrtc.ap.gov.in',
      'https://apfinance.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'ACTIVE',
    applicationWindowStatus: 'open',
    historicalAliases: ['Sthree Shakthi APSRTC', 'Free Bus Travel Scheme', 'స్త్రీ శక్తి', 'ఉచిత బస్సు ప్రయాణం'],
    verificationSourceType: 'ap_gov_portal',
    published: true,
    deadline: 'Instant On-Board Zero Ticket Issuance',
    renewalPeriod: 'Continuous Lifetime Access',
    verifiedHelpline: '0866-2570005 (APSRTC Call Centre) / 149'
  },
  {
    id: 'yuva-galam-unemployment-allowance-ap',
    officialName: 'Yuva Galam Nirudyoga Bhruthi & Skill Support Scheme',
    teName: 'యువగళం నిరుద్యోగ భృతి మరియు నైపుణ్యాభివృద్ధి పథకం',
    hiName: 'युवा गळम बेरोजगारी भत्ता एवं कौशल विकास योजना',
    department: 'Department of Skill Development & Training and Youth Services, Govt. of Andhra Pradesh',
    responsibleMinistry: 'Skill Development and Training Department, Andhra Pradesh',
    govLevel: 'state',
    state: 'Andhra Pradesh',
    category: 'employment',
    summary: 'Monthly financial unemployment allowance of ₹3,000 for educated unemployed youth alongside certified industry skill training and employment facilitation through APSSDC.',
    teSummary: 'డిప్లొమా, డిగ్రీ లేదా పీజీ పూర్తి చేసిన అర్హులైన నిరుద్యోగ యువతకు ఉద్యోగం లభించే వరకు నెలకు రూ. 3,000 భృతి మరియు APSSDC ద్వారా ఉచిత నైపుణ్య శిక్షణ.',
    description: 'Under the Super Six governance framework, Yuva Galam provides monthly financial relief of ₹3,000 to educated youth seeking employment while offering job-readiness skilling, technical certifications, and placement assistance through APSSDC training centers and job melas.',
    teDescription: 'ఉన్నత చదువులు చదివి ఉద్యోగం కోసం ప్రయత్నిస్తున్న యువతకు ఆర్థిక భద్రత కల్పించేందుకు నెలకు రూ. 3,000 నిరుద్యోగ భృతితో పాటు ఆధునిక ఐటీ, తయారీ రంగాలలో నైపుణ్య శిక్షణ అందించే పథకం.',
    benefitDetails: '₹3,000 monthly allowance transferred directly to beneficiary\'s verified bank account + free access to APSSDC certified skill courses.',
    teBenefitDetails: 'నెలకు రూ. 3,000 నిరుద్యోగ భృతి నేరుగా బ్యాంక్ ఖాతాలో జమ + ఉచిత నైపుణ్య శిక్షణ మరియు ప్లేస్‌మెంట్ సహాయం.',
    benefitAmount: '₹3,000 / month',
    eligibilityCriteria: {
      minAge: 21,
      maxAge: 35,
      gender: 'all',
      maxAnnualIncome: 250000,
      educationLevels: ['Diploma', 'Graduation', 'Post Graduation'],
      requiresAPResidence: true,
      additionalRules: [
        'Must be a permanent resident of Andhra Pradesh aged between 21 and 35 years.',
        'Must have completed minimum Diploma (Polytechnic) or Bachelor\'s Degree from a recognized institution.',
        'Must be actively registered on the AP Employment / APSSDC portal.',
        'Family household income must be below ₹2.50 Lakhs per annum.'
      ],
      teAdditionalRules: [
        'ఆంధ్రప్రదేశ్ నివాసియై 21 నుండి 35 సంవత్సరాల మధ్య వయస్సు ఉండాలి.',
        'గుర్తింపు పొందిన విశ్వవిద్యాలయం లేదా బోర్డు నుండి డిప్లొమా లేదా డిగ్రీ పూర్తి చేసి ఉండాలి.',
        'ఏపీ ఎంప్లాయ్‌మెంట్ లేదా APSSDC పోర్టల్‌లో నమోదై ఉండాలి.',
        'కుటుంబ వార్షిక ఆదాయం రూ. 2.50 లక్షల లోపు ఉండాలి.'
      ]
    },
    exclusions: [
      'Regular full-time employed individuals in public or private sectors',
      'Students currently pursuing regular full-time formal degree courses',
      'Income Tax payers'
    ],
    requiredDocuments: [
      'Aadhaar Card of Candidate',
      'Educational Degree / Diploma Certificate and Marks Memos',
      'Active BPL Rice Card / Income Certificate',
      'Bank Account Passbook (Aadhaar & NPCI Seeded)',
      'APSSDC / Employment Exchange Registration ID'
    ],
    teRequiredDocuments: [
      'అభ్యర్థి ఆధార్ కార్డు',
      'డిగ్రీ లేదా డిప్లొమా ఉత్తీర్ణత సర్టిఫికెట్లు',
      'బియ్యం కార్డు లేదా ఆదాయ ధృవీకరణ పత్రం',
      'బ్యాంక్ ఖాతా పాస్‌బుక్ (NPCI లింక్ అయినది)',
      'ఉపాధి కార్యాలయ నమోదు కార్డు (Employment Registration)'
    ],
    applicationSteps: [
      'Register profile on APSSDC portal (apssdc.in) or visit local Grama/Ward Sachivalayam.',
      'Upload academic credentials and complete Aadhaar biometric verification.',
      'Enroll in an industry certification track or employment facilitation module.',
      'Monthly allowance credited directly to Aadhaar-seeded bank account until suitable employment placement.'
    ],
    teApplicationSteps: [
      'APSSDC పోర్టల్ లేదా గ్రామ సచివాలయంలో దరఖాస్తు చేసుకోవాలి.',
      'విద్యార్హత సర్టిఫికెట్లు అప్‌లోడ్ చేసి బయోమెట్రిక్ ఈ-కేవైసీ పూర్తి చేయాలి.',
      'ఉచిత నైపుణ్య శిక్షణా కోర్సు ఎంచుకోవాలి.',
      'ప్రతినెలా రూ. 3,000 భృతి బ్యాంకు ఖాతాలో జమ.'
    ],
    officialApplicationUrl: 'https://apssdc.in',
    officialInfoUrl: 'https://apssdc.in',
    sourceUrls: [
      'https://apssdc.in',
      'https://gramawardsachivalayam.ap.gov.in',
      'https://apfinance.gov.in'
    ],
    lastVerifiedAt: '2026-10-15',
    verificationStatus: 'verified',
    lifecycleStatus: 'ACTIVE',
    applicationWindowStatus: 'open',
    historicalAliases: ['Yuva Galam Nirudyoga Bhruthi', 'AP Unemployment Allowance', 'యువగళం', 'నిరుద్యోగ భృతి'],
    verificationSourceType: 'ap_gov_portal',
    published: true,
    deadline: 'Rolling Continuous Intake',
    renewalPeriod: 'Monthly Validation',
    verifiedHelpline: '1800-425-4458 (APSSDC Toll-Free) / 1902'
  }
];

export { ARCHIVED_HISTORICAL_SCHEMES } from './archivedHistoricalSchemes';

