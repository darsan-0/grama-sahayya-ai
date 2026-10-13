import { Scheme } from '../types';

export const VERIFIED_SCHEMES: Scheme[] = [
  {
    id: 'jagananna-vidya-deevena',
    officialName: 'Jagananna Vidya Deevena (RTF - Post-Matric Fee Reimbursement)',
    teName: 'జగనన్న విద్యా దీవెన (ఫీజు రీయింబర్స్‌మెంట్ పథకం)',
    hiName: 'जगन्ना विद्या दीवेना (शुल्क प्रतिपूर्ति)',
    department: 'Social Welfare & Higher Education Department, Govt. of Andhra Pradesh',
    govLevel: 'state',
    state: 'Andhra Pradesh',
    category: 'education',
    summary: 'Full tuition fee reimbursement for students pursuing Polytechnic, ITI, Degree, Engineering, Medicine, and Post-Graduate courses.',
    teSummary: 'పాలిటెక్నిక్, ఐటీఐ, డిగ్రీ, ఇంజనీరింగ్, మెడిసిన్ మరియు పీజీ చదువుతున్న పేద విద్యార్థులకు పూర్తి ఫీజు రీయింబర్స్‌మెంట్.',
    description: 'Jagananna Vidya Deevena is a flagship welfare program of Andhra Pradesh to provide complete tuition fee reimbursement deposited quarterly directly into mothers\' bank accounts to ensure higher education access for every economically weaker student.',
    teDescription: 'పేదరికం కారణంగా ఏ ఒక్క విద్యార్థి ఉన్నత చదువులకు దూరం కాకూడదనే ఉద్దేశంతో ఆంధ్రప్రదేశ్ ప్రభుత్వం అమలు చేస్తున్న సంపూర్ణ ఫీజు రీయింబర్స్‌మెంట్ పథకం. కళాశాల ఫీజు మొత్తం తల్లుల ఖాతాల్లో జమ చేయబడుతుంది.',
    benefitDetails: '100% Tuition fee reimbursement paid in 4 quarterly installments directly to the mother\'s verified bank account.',
    teBenefitDetails: '100% ట్యూషన్ ఫీజు రీయింబర్స్‌మెంట్ నేరుగా తల్లి బ్యాంక్ ఖాతాలో నాలుగు త్రైమాసిక విడతల్లో జమ.',
    benefitAmount: 'Full College Tuition Fee (100%)',
    eligibilityCriteria: {
      minAge: 16,
      maxAge: 30,
      gender: 'all',
      maxAnnualIncome: 250000, // Rs. 2.5 Lakhs
      educationLevels: ['Polytechnic', 'ITI', 'Undergraduate', 'Postgraduate', 'Engineering', 'Pharmacy', 'MBA/MCA'],
      socialCategories: ['SC', 'ST', 'BC', 'EWS', 'Kapu', 'Minority', 'Differently Abled'],
      requiresAPResidence: true,
      additionalRules: [
        'Family total landholding must be below 10 acres wetland or 25 acres dry land.',
        'No family member should be a government employee or pensioner (sanitary workers exempt).',
        'No family member should own a four-wheeler (taxis, tractors, autos exempt).',
        'Municipal property built-up area must be less than 1500 sq.ft.',
        'Minimum 75% student college attendance required.'
      ],
      teAdditionalRules: [
        'కుటుంబ వార్షిక ఆదాయం రూ. 2.50 లక్షల లోపు ఉండాలి.',
        'కుటుంబానికి 10 ఎకరాల లోపు మాగాణి లేదా 25 ఎకరాల లోపు మెట్ట భూమి ఉండాలి.',
        'కుటుంబంలో ఎవరూ ప్రభుత్వ ఉద్యోగి లేదా పెన్షనర్ అయి ఉండకూడదు (పారిశుద్ధ్య కార్మికులకు మినహాయింపు).',
        'కుటుంబానికి 4 చక్రాల వాహనం ఉండకూడదు (టాక్సీ, ట్రాక్టర్, ఆటోలకు మినహాయింపు).',
        'విద్యార్థికి కళాశాలలో కనీసం 75% హాజరు తప్పనిసరి.'
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
      'తల్లి బ్యాంక్ పాస్‌బుక్ (NPCI లింక్ అయినది)',
      '10వ తరగతి మరియు ఇంటర్ మార్కుల మెమోలు'
    ],
    applicationSteps: [
      'Enroll through college verification during semester registration.',
      'College principal validates student data on Jnanabhumi / GSWS portal.',
      'Grama / Ward Sachivalayam Welfare Assistant verifies field details.',
      'Social audit list published at Village Secretariat for objections.',
      'Funds disbursed directly to mother\'s Aadhaar-linked account.'
    ],
    teApplicationSteps: [
      'కళాశాలలో అడ్మిషన్ సమయంలో జ్ఞానభూమి పోర్టల్ ద్వారా నమోదు.',
      'కళాశాల ప్రిన్సిపాల్ ఆధ్వర్యంలో విద్యార్థి వివరాల ధృవీకరణ.',
      'గ్రామ/వార్డు సచివాలయం సంక్షేమ సహాయకుడి (Welfare Assistant) ద్వారా క్షేత్రస్థాయి పరిశీలన.',
      'సచివాలయంలో సోషల్ ఆడిట్ జాబితా ప్రదర్శన.',
      'తల్లి ఆధార్ అనుసంధాన బ్యాంక్ ఖాతాలో నిధుల జమ.'
    ],
    officialApplicationUrl: 'https://jnanabhumi.ap.gov.in',
    officialInfoUrl: 'https://gramawardsachivalayam.ap.gov.in',
    sourceUrls: [
      'https://jnanabhumi.ap.gov.in',
      'https://socialwelfare.ap.gov.in',
      'https://gramawardsachivalayam.ap.gov.in'
    ],
    lastVerifiedAt: '2026-09-15',
    verificationStatus: 'verified',
    published: true,
    deadline: 'Quarterly Academic Cycle (Nov - Dec / Mar - Apr)',
    renewalPeriod: 'Annual / Semester basis',
    verifiedHelpline: '1902 (AP Spandana / GSWS Helpline)'
  },
  {
    id: 'jagananna-vasathi-deevena',
    officialName: 'Jagananna Vasathi Deevena (Hostel & Boarding Assistance)',
    teName: 'జగనన్న వసతి దీవెన (హాస్టల్ & వసతి ఖర్చుల పథకం)',
    hiName: 'जगन्ना वसति दीवेना (आवास सहायता)',
    department: 'Social Welfare Department, Govt. of Andhra Pradesh',
    govLevel: 'state',
    state: 'Andhra Pradesh',
    category: 'education',
    summary: 'Financial aid for food and hostel expenses for post-matric polytechnic, ITI, and degree students in Andhra Pradesh.',
    teSummary: 'డిగ్రీ, ఇంజనీరింగ్, పాలిటెక్నిక్ విద్యార్థుల భోజన మరియు వసతి ఖర్చుల కోసం ఏటా రూ. 10,000 నుండి రూ. 20,000 వరకు ఆర్థిక సహాయం.',
    description: 'Provides boarding and lodging assistance to students to meet their living expenses while pursuing higher education away from home. Paid directly to mothers in two installments per year.',
    teDescription: 'ఉన్నత విద్య అభ్యసించే పేద విద్యార్థుల వసతి, భోజన ఖర్చుల భారాన్ని తగ్గించేందుకు ఈ పథకం ద్వారా ఏటా రెండు విడతల్లో తల్లుల బ్యాంక్ ఖాతాల్లో సహాయం జమ చేస్తారు.',
    benefitDetails: 'ITI students: Rs. 10,000/yr; Polytechnic: Rs. 15,000/yr; Degree & Engineering/Medicine: Rs. 20,000/yr.',
    teBenefitDetails: 'ఐటీఐ విద్యార్థులకు రూ. 10,000; పాలిటెక్నిక్ విద్యార్థులకు రూ. 15,000; డిగ్రీ/ఇంజనీరింగ్/పీజీ విద్యార్థులకు రూ. 20,000 ఏటా.',
    benefitAmount: 'Rs. 10,000 - Rs. 20,000 per year',
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
    exclusions: ['Day scholars claiming double benefits', 'Private University management quota seats'],
    requiredDocuments: [
      'Aadhaar Card of Student and Mother',
      'Rice Card / Income Certificate',
      'Hostel certificate or verified day scholar residence statement',
      'Mother\'s active bank passbook'
    ],
    teRequiredDocuments: [
      'విద్యార్థి మరియు తల్లి ఆధార్ కార్డులు',
      'రైస్ కార్డు / ఆదాయ సర్టిఫికెట్',
      'హాస్టల్ లేదా కాలేజీ ధృవీకరణ పత్రం',
      'తల్లి బ్యాంక్ పాస్‌బుక్'
    ],
    applicationSteps: [
      'Auto-synced through Jnanabhumi college registration.',
      'Field verification by Grama / Ward Sachivalayam functionary.',
      'Direct Benefit Transfer (DBT) into mother\'s bank account.'
    ],
    teApplicationSteps: [
      'జ్ఞానభూమి కళాశాల రిజిస్ట్రేషన్ ద్వారా దరఖాస్తు.',
      'గ్రామ/వార్డు సచివాలయ సంక్షేమ అసిస్టెంట్ వెరిఫికేషన్.',
      'తల్లి బ్యాంక్ ఖాతాకు నేరుగా నిధుల బదిలీ (DBT).'
    ],
    officialApplicationUrl: 'https://jnanabhumi.ap.gov.in',
    officialInfoUrl: 'https://gramawardsachivalayam.ap.gov.in',
    sourceUrls: ['https://jnanabhumi.ap.gov.in', 'https://socialwelfare.ap.gov.in'],
    lastVerifiedAt: '2026-09-15',
    verificationStatus: 'verified',
    published: true,
    verifiedHelpline: '1902'
  },
  {
    id: 'ysr-rythu-bharosa-pm-kisan',
    officialName: 'YSR Rythu Bharosa - PM KISAN (Integrated Farmer Support)',
    teName: 'వైఎస్సార్ రైతు భరోసా - పీఎం కిసాన్ (రైతు సంక్షేమ పథకం)',
    hiName: 'वाईएसआर रायथू भरोसा - पीएम किसान',
    department: 'Department of Agriculture, Govt. of AP & Ministry of Agriculture, Govt. of India',
    govLevel: 'state',
    state: 'Andhra Pradesh',
    category: 'agriculture',
    summary: 'Comprehensive annual financial assistance of Rs. 13,500 to farmer families including landholder farmers and tenant farmers in Andhra Pradesh.',
    teSummary: 'ఆంధ్రప్రదేశ్ లోని రైతు కుటుంబాలకు, కౌలు రైతులకు ఏటా రూ. 13,500 పెట్టుబడి సాయం (కేంద్రం రూ. 6,000 + రాష్ట్రం రూ. 7,500).',
    description: 'Rythu Bharosa provides critical input subsidy before Kharif, Rabi sowing and harvest. Uniquely includes eligible SC, ST, BC, and Minority landless tenant farmers (CCRC holders) and ROFR forest land cultivators.',
    teDescription: 'వ్యవసాయ పెట్టుబడి ఖర్చుల కోసం రైతులు మరియు అర్హులైన ఎస్సీ, ఎస్టీ, బీసీ, మైనారిటీ కౌలు రైతులకు (CCRC కార్డుదారులు) ఏటా 3 విడతల్లో రూ. 13,500 నగదు సాయం అందిస్తారు.',
    benefitDetails: 'Rs. 13,500 per year per eligible farmer family paid in 3 installments: Rs. 7,500 in May/June, Rs. 4,000 in October, and Rs. 2,000 in January.',
    teBenefitDetails: 'ఏటా రూ. 13,500 మూడు విడతల్లో: మే/జూన్ లో రూ. 7,500; అక్టోబర్ లో రూ. 4,000; జనవరి లో రూ. 2,000.',
    benefitAmount: 'Rs. 13,500 per year',
    eligibilityCriteria: {
      minAge: 18,
      gender: 'all',
      farmerStatus: true,
      requiresAPResidence: true,
      additionalRules: [
        'Must own cultivable agricultural land verified in Webland / e-Panta portal.',
        'Tenant farmers must hold valid Crop Cultivator Rights Card (CCRC) for the current agricultural year.',
        'SC/ST/BC/Minority tenant farmers cultivating for at least 1 acre wetland or 2 acres dry land eligible.',
        'e-KYC and Aadhaar seeding with land patta passbook mandatory.'
      ],
      teAdditionalRules: [
        'వెబ్‌ల్యాండ్ / ఈ-పంట పోర్టల్‌లో నమోదైన సాగు భూమి ఉండాలి.',
        'కౌలు రైతులు ప్రస్తుత సంవత్సరపు అధికారిక CCRC కార్డు కలిగి ఉండాలి.',
        'పట్టాదారు పాస్‌బుక్ మరియు బ్యాంక్ ఖాతాకు ఆధార్ ఈ-కేవైసీ పూర్తి కావాలి.'
      ]
    },
    exclusions: [
      'Constitutional post holders, former/present ministers, MLAs/MLCs, Mayors.',
      'Serving or retired Central/State government employees and pensioners with pension above Rs. 10,000/mo.',
      'Income tax payers in last assessment year.',
      'Professionals like Doctors, Engineers, Lawyers, Chartered Accountants registered with professional councils.'
    ],
    requiredDocuments: [
      'Aadhaar Card of Farmer',
      'Pattadar Passbook / 1B / Webland Record',
      'CCRC Card (for Tenant Farmers)',
      'Aadhaar-seeded Bank Account Passbook',
      'Active Mobile Number linked with Aadhaar'
    ],
    teRequiredDocuments: [
      'రైతు ఆధార్ కార్డు',
      'పట్టాదారు పాస్‌బుక్ / 1-బి రికార్డు',
      'కౌలు రైతులకు CCRC కార్డు',
      'బ్యాంక్ ఖాతా పాస్‌బుక్ (NPCI సీడింగ్)',
      'ఆధార్ లింక్ అయిన మొబైల్ నంబర్'
    ],
    applicationSteps: [
      'Verify land details at Rythu Bharosa Kendra (RBK) / Village Agriculture Assistant (VAA).',
      'Complete e-Panta crop booking and biometric e-KYC.',
      'Verification by Village Revenue Officer (VRO) and VAA.',
      'Social audit list published at RBK.',
      'DBT payment through PM-KISAN / State DBT portal.'
    ],
    teApplicationSteps: [
      'రైతు భరోసా కేంద్రం (RBK) వద్ద గ్రామ వ్యవసాయ సహాయకుడి (VAA) ద్వారా భూమి వివరాల నమోదు.',
      'ఈ-పంట నమోదు మరియు బయోమెట్రిక్ ఈ-కేవైసీ పూర్తి చేయడం.',
      'ఆర్బీకే వద్ద సోషల్ ఆడిట్ జాబితా పరిశీలన.',
      'పీఎం కిసాన్ మరియు రాష్ట్ర పోర్టల్ ద్వారా నేరుగా ఖాతాలో జమ.'
    ],
    officialApplicationUrl: 'https://ysrrythubharosa.ap.gov.in',
    officialInfoUrl: 'https://pmkisan.gov.in',
    sourceUrls: ['https://ysrrythubharosa.ap.gov.in', 'https://pmkisan.gov.in', 'https://apagrisnet.gov.in'],
    lastVerifiedAt: '2026-09-10',
    verificationStatus: 'verified',
    published: true,
    verifiedHelpline: '155251 / 1800-425-0302'
  },
  {
    id: 'pm-kisan-central',
    officialName: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    teName: 'పీఎం కిసాన్ సమ్మాన్ నిధి (కేంద్ర ప్రభుత్వ రైతు పథకం)',
    hiName: 'प्रधानमंत्री किसान सम्मान निधि',
    department: 'Ministry of Agriculture & Farmers Welfare, Govt. of India',
    govLevel: 'central',
    state: 'All India',
    category: 'agriculture',
    summary: 'Central sector scheme providing Rs. 6,000 per year in three equal installments to all landholding farmer families across India.',
    teSummary: 'భారతదేశంలోని అర్హులైన రైతు కుటుంబాలకు ఏటా రూ. 6,000 నగదు సాయం (రూ. 2,000 చొప్పున 3 విడతల్లో).',
    description: 'PM-KISAN aims to supplement the financial needs of farmers in procuring inputs to ensure proper crop health and appropriate yields, as well as domestic needs.',
    teDescription: 'దేశవ్యాప్తంగా భూమి ఉన్న రైతులకు వ్యవసాయ ఖర్చుల నిమిత్తం కేంద్ర ప్రభుత్వం అందించే ప్రత్యక్ష నగదు బదిలీ పథకం.',
    benefitDetails: 'Rs. 6,000 per annum paid in 3 four-monthly installments of Rs. 2,000 directly via DBT.',
    teBenefitDetails: 'ఏటా రూ. 6,000 (ప్రతి నాలుగు నెలలకు రూ. 2,000 చొప్పున 3 విడతల్లో).',
    benefitAmount: 'Rs. 6,000 per year',
    eligibilityCriteria: {
      minAge: 18,
      farmerStatus: true,
      additionalRules: [
        'Farmer family must own cultivable land.',
        'Mandatory land seeding, Aadhaar seeding, and facial/biometric e-KYC.'
      ],
      teAdditionalRules: ['సాగు భూమి రికార్డు ఉండాలి.', 'ఆధార్ ఈ-కేవైసీ మరియు ల్యాండ్ సీడింగ్ తప్పనిసరి.']
    },
    exclusions: ['Institutional landholders', 'Income tax payers', 'Government servants and retired pensioners (> Rs 10k)'],
    requiredDocuments: ['Aadhaar Card', 'Land ownership documents (RoR / Khatauni / Passbook)', 'Bank Account details'],
    teRequiredDocuments: ['ఆధార్ కార్డు', 'భూమి యాజమాన్య పత్రాలు', 'బ్యాంక్ పాస్‌బుక్'],
    applicationSteps: ['Register via PM-KISAN Portal or local CSC center / RBK.', 'Complete e-KYC via OTP or facial recognition on PM-KISAN App.'],
    teApplicationSteps: ['పీఎం కిసాన్ పోర్టల్ లేదా CSC / ఆర్బీకే కేంద్రంలో దరఖాస్తు.', 'మొబైల్ యాప్ లేదా బయోమెట్రిక్ ద్వారా ఈ-కేవైసీ పూర్తి చేయడం.'],
    officialApplicationUrl: 'https://pmkisan.gov.in',
    officialInfoUrl: 'https://pmkisan.gov.in',
    sourceUrls: ['https://pmkisan.gov.in'],
    lastVerifiedAt: '2026-09-01',
    verificationStatus: 'verified',
    published: true,
    verifiedHelpline: '155261 / 011-24300606'
  },
  {
    id: 'ysr-cheyutha',
    officialName: 'YSR Cheyutha (Empowerment for Women Aged 45-60)',
    teName: 'వైఎస్సార్ చేయూత (45-60 ఏళ్ల మహిళల స్వయం ఉపాధి పథకం)',
    hiName: 'वाईएसआर चेयूता',
    department: 'Department of Social Welfare, Govt. of Andhra Pradesh',
    govLevel: 'state',
    state: 'Andhra Pradesh',
    category: 'women_shg',
    summary: 'Financial support of Rs. 75,000 over 4 years (Rs. 18,750 per year) for women aged 45-60 belonging to SC, ST, BC, and Minority communities to establish sustainable livelihoods.',
    teSummary: '45 నుంచి 60 ఏళ్ల లోపు ఎస్సీ, ఎస్టీ, బీసీ, మైనారిటీ మహిళలకు 4 ఏళ్లలో మొత్తం రూ. 75,000 (ఏటా రూ. 18,750) ఉపాధి సాయం.',
    description: 'Aimed at economic empowerment of middle-aged marginalized women by providing financial grants paired with technical tie-ups (AMUL, ITC, P&G, Reliance) for retail, dairy, and grocery enterprises.',
    teDescription: 'ఎస్సీ, ఎస్టీ, బీసీ, మైనారిటీ వర్గాలకు చెందిన 45-60 ఏళ్ల మహిళలు చిన్న వ్యాపారాలు, కిరాణా షాపులు, పాడి పరిశ్రమ ఏర్పాటు చేసుకునేందుకు ప్రభుత్వం అందించే ఆర్థిక సహాయం.',
    benefitDetails: 'Rs. 18,750 per year for 4 continuous years (Total Rs. 75,000).',
    teBenefitDetails: 'ఏటా రూ. 18,750 చొప్పున వరుసగా నాలుగేళ్లు (మొత్తం రూ. 75,000).',
    benefitAmount: 'Rs. 18,750 per year (Total Rs. 75,000)',
    eligibilityCriteria: {
      minAge: 45,
      maxAge: 60,
      gender: 'female',
      maxAnnualIncome: 120000, // Rural Rs 10k/mo, Urban Rs 12k/mo
      socialCategories: ['SC', 'ST', 'BC', 'Minority'],
      requiresAPResidence: true,
      additionalRules: [
        'Must be between 45 and 60 years of age on the cutoff date.',
        'Family income within rural/urban limits.',
        'Not receiving social security pension simultaneously.'
      ],
      teAdditionalRules: [
        'వయస్సు 45 నుంచి 60 ఏళ్ల మధ్య ఉండాలి.',
        'ఎస్సీ, ఎస్టీ, బీసీ, మైనారిటీ వర్గాలకు చెందిన మహిళ అయి ఉండాలి.',
        'ప్రభుత్వ పెన్షన్ పొందుతూ ఉండకూడదు.'
      ]
    },
    exclusions: ['Women drawing government pension', 'Income tax paying families', 'Government employee families'],
    requiredDocuments: [
      'Aadhaar Card of Applicant',
      'Integrated Caste Certificate',
      'Date of Birth proof / SSC memo or Integrated Age Certificate',
      'Rice Card / Income Certificate',
      'Aadhaar-linked Bank Account Passbook'
    ],
    teRequiredDocuments: [
      'మహిళ ఆధార్ కార్డు',
      'కుల ధృవీకరణ పత్రం',
      'వయస్సు ధృవీకరణ పత్రం (పుట్టిన తేదీ లేదా సచివాలయ ధృవీకరణ)',
      'రైస్ కార్డు / ఆదాయ పత్రం',
      'బ్యాంక్ పాస్‌బుక్'
    ],
    applicationSteps: [
      'Apply at Village / Ward Secretariat (Grama Ward Sachivalayam) through Welfare and Education Assistant.',
      'Field verification by Village Volunteer / Secretariat functionary.',
      'Publication of beneficiary list in public social audit.',
      'DBT crediting to beneficiary bank account.'
    ],
    teApplicationSteps: [
      'గ్రామ/వార్డు సచివాలయంలో వెల్ఫేర్ అసిస్టెంట్ ద్వారా దరఖాస్తు.',
      'సచివాలయ ఉద్యోగుల ద్వారా పరిశీలన.',
      'సోషల్ ఆడిట్ జాబితా ప్రదర్శన మరియు ఆమోదం.',
      'బ్యాంక్ ఖాతాలో నిధుల జమ.'
    ],
    officialApplicationUrl: 'https://gramawardsachivalayam.ap.gov.in',
    officialInfoUrl: 'https://navasakam.ap.gov.in',
    sourceUrls: ['https://gramawardsachivalayam.ap.gov.in', 'https://navasakam.ap.gov.in'],
    lastVerifiedAt: '2026-09-12',
    verificationStatus: 'verified',
    published: true,
    verifiedHelpline: '1902'
  },
  {
    id: 'ysr-aasara',
    officialName: 'YSR Aasara (SHG Loan Relief for Women)',
    teName: 'వైఎస్సార్ ఆసరా (డ్వాక్రా మహిళల రుణ మాఫీ సహాయం)',
    hiName: 'वाईएसआर आसरा (एसएचजी ऋण राहत)',
    department: 'SERP / MEPMA, Govt. of Andhra Pradesh',
    govLevel: 'state',
    state: 'Andhra Pradesh',
    category: 'women_shg',
    summary: 'Reimbursement of outstanding bank loans of Self Help Group (DWCRA) women in 4 equal installments.',
    teSummary: 'స్వయం సహాయక సంఘాల (డ్వాక్రా) మహిళలకు గత బ్యాంకు రుణాల బకాయిలను ప్రభుత్వం 4 విడతల్లో నేరుగా చెల్లించే పథకం.',
    description: 'Supports rural and urban DWCRA women to come out of debt cycles and invest in income-generating productive activities.',
    teDescription: 'డ్వాక్రా సంఘాల మహిళలకు ఆర్థిక స్వావలంబన చేకూర్చేందుకు రుణ భారాన్ని ప్రభుత్వమే భరించి నేరుగా సంఘ సభ్యుల ఖాతాల్లో జమ చేసే పథకం.',
    benefitDetails: 'Full outstanding loan amount as on cutoff date reimbursed across 4 annual installments.',
    teBenefitDetails: 'కటాఫ్ తేదీ నాటికి ఉన్న రుణ బకాయి మొత్తాన్ని 4 విడతల్లో నేరుగా చెల్లింపు.',
    benefitAmount: 'Loan balance reimbursement in 4 installments',
    eligibilityCriteria: {
      minAge: 18,
      gender: 'female',
      requiresAPResidence: true,
      additionalRules: [
        'Must be an active member of registered DWCRA / SHG group in AP.',
        'SHG group must have valid bank linkage and loan account.'
      ],
      teAdditionalRules: ['ఆంధ్రప్రదేశ్‌లోని నమోదిత డ్వాక్రా సంఘంలో క్రియాశీల సభ్యురాలై ఉండాలి.']
    },
    exclusions: ['Groups with fake documentation or unverified members'],
    requiredDocuments: ['Aadhaar Card', 'SHG Group Member ID / Passbook', 'Bank Loan Account Number', 'Individual Savings Account Passbook'],
    teRequiredDocuments: ['ఆధార్ కార్డు', 'డ్వాక్రా సంఘ సభ్యురాలి పాస్‌బుక్', 'బ్యాంక్ లోన్ ఖాతా వివరాలు'],
    applicationSteps: ['SERP / MEPMA auto-populates SHG loan ledger.', 'Verification by Village Organization (VO) and Sachivalayam.'],
    teApplicationSteps: ['సెర్ప్ (SERP) ద్వారా సంఘాల రుణ లెక్కల పరిశీలన.', 'సచివాలయ వెల్ఫేర్ అసిస్టెంట్ ద్వారా ధృవీకరణ.'],
    officialApplicationUrl: 'https://gramawardsachivalayam.ap.gov.in',
    officialInfoUrl: 'https://serp.ap.gov.in',
    sourceUrls: ['https://serp.ap.gov.in'],
    lastVerifiedAt: '2026-08-20',
    verificationStatus: 'verified',
    published: true,
    verifiedHelpline: '1902'
  },
  {
    id: 'ysr-pension-kanuka',
    officialName: 'YSR Pension Kanuka (Social Security Welfare Pensions)',
    teName: 'వైఎస్సార్ పింఛన్ కానుక (వృద్ధాప్య, వితంతు, దివ్యాంగుల పింఛన్లు)',
    hiName: 'वाईएसआर पेंशन कानुका',
    department: 'Panchayat Raj & Rural Development Department, Govt. of AP',
    govLevel: 'state',
    state: 'Andhra Pradesh',
    category: 'pensions',
    summary: 'Monthly doorstep pension of Rs. 3,000 (Old Age, Widow, Weavers, Fishermen, Toddy Tappers) and Rs. 6,000 to Rs. 15,000 for Differently Abled and Chronic Ailments.',
    teSummary: 'నెలకు రూ. 3,000 (వృద్ధులు, వితంతువులు, ఒంటరి మహిళలు) మరియు రూ. 6,000 నుండి రూ. 15,000 వరకు (దివ్యాంగులు, కిడ్నీ రోగులు) ఇంటివద్దకే పింఛన్.',
    description: 'Delivers dignified social security to vulnerable sections of society every month right at the citizen\'s doorstep through secretariat staff and biometric / facial authentication.',
    teDescription: 'వృద్ధులు, వితంతువులు, చేనేత, కల్లుగీత కార్మికులు, దివ్యాంగులు, కిడ్నీ వ్యాధిగ్రస్తులకు ప్రతినెలా 1వ తేదీన ఇంటివద్దకే పింఛన్ అందించే ప్రతిష్టాత్మక పథకం.',
    benefitDetails: 'Rs. 3,000/month for Old Age, Widow, Weavers, Fishermen, Single Women; Rs. 6,000/month for Disabled (40-79%); Rs. 15,000/month for severe disability / dialysis patients.',
    teBenefitDetails: 'వృద్ధులు/వితంతువులకు నెలకు రూ. 3,000; దివ్యాంగులకు నెలకు రూ. 6,000; తీవ్ర వైకల్యం/డయాలసిస్ రోగులకు రూ. 15,000 వరకు.',
    benefitAmount: 'Rs. 3,000 - Rs. 15,000 per month',
    eligibilityCriteria: {
      minAge: 60, // 60 for Old Age; 18 for Widow; any age for Disability
      maxAnnualIncome: 120000, // Rural Rs 10,000/mo, Urban Rs 12,000/mo
      requiresAPResidence: true,
      additionalRules: [
        'Old Age Pension: Age 60 years or above.',
        'Widow Pension: Minimum age 18 years, Death Certificate of husband mandatory.',
        'Disabled Pension: Valid SADAREM certificate with minimum 40% permanent disability.',
        'Single Women: Age above 35 years in rural (separated > 1 year) or 30+ unmarried.',
        'Total family land below 3 acres wetland or 10 acres dry land.'
      ],
      teAdditionalRules: [
        'వృద్ధాప్య పింఛన్: 60 ఏళ్లు లేదా అంతకంటే ఎక్కువ.',
        'వితంతు పింఛన్: 18 ఏళ్లు పైబడి భర్త మరణ ధృవీకరణ పత్రం కలిగి ఉండాలి.',
        'దివ్యాంగుల పింఛన్: సదరమ్ (SADAREM) సర్టిఫికెట్‌లో కనీసం 40% వైకల్యం ఉండాలి.',
        'కుటుంబ ఆదాయ పరిమితి నెలకు రూ. 10,000 (గ్రామీణ) / రూ. 12,000 (పట్టణ).'
      ]
    },
    exclusions: ['Central or state government pensioners', 'Income tax paying families', 'Owners of 4-wheelers (taxis exempt)'],
    requiredDocuments: [
      'Aadhaar Card of Applicant',
      'Rice Card / Income Certificate',
      'Age proof / Integrated Certificate from Secretariat',
      'Death Certificate of Husband (for Widow Pension)',
      'SADAREM Certificate (for Disability Pension)',
      'Bank Account or Doorstep Cash preference'
    ],
    teRequiredDocuments: [
      'దరఖాస్తుదారు ఆధార్ కార్డు',
      'రైస్ కార్డు / ఆదాయ పత్రం',
      'వయస్సు ధృవీకరణ పత్రం',
      'భర్త డెత్ సర్టిఫికెట్ (వితంతు పింఛన్‌కు)',
      'సదరమ్ సర్టిఫికెట్ (దివ్యాంగులకు)'
    ],
    applicationSteps: [
      'Apply at Grama / Ward Sachivalayam through Welfare and Education Assistant.',
      'Field inquiry and biometric verification by secretariat staff.',
      'Verification by MPDO (Rural) or Municipal Commissioner (Urban).',
      'District Collector sanction and pension card generation.',
      'Disbursement on 1st of every month.'
    ],
    teApplicationSteps: [
      'గ్రామ/వార్డు సచివాలయంలో వెల్ఫేర్ అసిస్టెంట్ ద్వారా దరఖాస్తు సమర్పణ.',
      'సచివాలయ సిబ్బంది ద్వారా విచారణ మరియు బయోమెట్రిక్ వెరిఫికేషన్.',
      'ఎంపీడీవో / మున్సిపల్ కమిషనర్ పరిశీలన మరియు జిల్లా కలెక్టర్ ఆమోదం.',
      'ప్రతినెలా 1వ తేదీన పింఛన్ నగదు పంపిణీ.'
    ],
    officialApplicationUrl: 'https://sspensions.ap.gov.in',
    officialInfoUrl: 'https://gramawardsachivalayam.ap.gov.in',
    sourceUrls: ['https://sspensions.ap.gov.in', 'https://gramawardsachivalayam.ap.gov.in'],
    lastVerifiedAt: '2026-09-18',
    verificationStatus: 'verified',
    published: true,
    verifiedHelpline: '1902'
  },
  {
    id: 'pm-surya-ghar-muft-bijli',
    officialName: 'PM Surya Ghar: Muft Bijli Yojana (Rooftop Solar Subsidy)',
    teName: 'పీఎం సూర్య ఘర్: ఉచిత విద్యుత్ యోజన (రూఫ్‌టాప్ సోలార్ సబ్సిడీ)',
    hiName: 'पीएम सूर्य घर: मुफ्त बिजली योजना',
    department: 'Ministry of New and Renewable Energy, Govt. of India',
    govLevel: 'central',
    state: 'All India',
    category: 'housing',
    summary: 'Up to Rs. 78,000 direct central government subsidy to install rooftop solar panels and get up to 300 units of free solar electricity every month.',
    teSummary: 'ఇంటి పైకప్పుపై సోలార్ ప్యానెల్స్ ఏర్పాటు కోసం కేంద్ర ప్రభుత్వం అందించే రూ. 78,000 వరకు సబ్సిడీ మరియు నెలకు 300 యూనిట్ల ఉచిత విద్యుత్.',
    description: 'A nationwide initiative to illuminate 1 crore households with solar energy, drastically reducing electricity bills and earning money by selling surplus power back to the grid (DISCOM).',
    teDescription: 'దేశవ్యాప్తంగా కోటి ఇళ్లకు సౌర విద్యుత్ అందించే లక్ష్యంతో ప్రారంభించిన పథకం. దీని ద్వారా ఉచిత విద్యుత్‌తో పాటు మిగిలిన విద్యుత్‌ను డిస్కంకు విక్రయించి ఆదాయం పొందవచ్చు.',
    benefitDetails: '1 kW system: Rs. 30,000 subsidy; 2 kW system: Rs. 60,000 subsidy; 3 kW or higher: Rs. 78,000 maximum central financial assistance.',
    teBenefitDetails: '1 కిలోవాట్: రూ. 30,000; 2 కిలోవాట్: రూ. 60,000; 3 కిలోవాట్ లేదా అంతకంటే ఎక్కువ: గరిష్టంగా రూ. 78,000 సబ్సిడీ.',
    benefitAmount: 'Up to Rs. 78,000 subsidy + Free electricity',
    eligibilityCriteria: {
      minAge: 18,
      requiresAPResidence: false,
      additionalRules: [
        'Must be an Indian citizen with a residential home and suitable unshaded roof.',
        'Must possess an active domestic electricity connection in applicant\'s name.',
        'Must not have availed another central solar subsidy previously for the same premises.'
      ],
      teAdditionalRules: [
        'సొంత ఇల్లు మరియు సోలార్ ప్యానెల్స్ ఏర్పాటుకు అనువైన పైకప్పు ఉండాలి.',
        'దరఖాస్తుదారు పేరుతో గృహ విద్యుత్ కనెక్షన్ (సర్వీస్ నంబర్) ఉండాలి.'
      ]
    },
    exclusions: ['Commercial establishments', 'Industrial connections', 'Agricultural pump sets'],
    requiredDocuments: [
      'Aadhaar Card of Electricity Consumer',
      'Latest Domestic Electricity Bill (with Service Connection Number)',
      'Bank Account Passbook or Cancelled Cheque (for direct subsidy credit)',
      'Proof of Ownership / House Tax Receipt'
    ],
    teRequiredDocuments: [
      'విద్యుత్ కనెక్షన్ ఉన్న వ్యక్తి ఆధార్ కార్డు',
      'ఇటీవలి విద్యుత్ బిల్లు (Service Number తో)',
      'బ్యాంక్ పాస్‌బుక్ / క్యాన్సిల్డ్ చెక్కు (సబ్సిడీ జమ కోసం)',
      'ఇంటి యాజమాన్య పత్రం / పన్ను రసీదు'
    ],
    applicationSteps: [
      'Register on National Portal (pmsuryaghar.gov.in) with State, DISCOM (APCPDCL / APEPDCL / APSPDCL), and Consumer Number.',
      'Submit rooftop solar application and wait for Technical Feasibility Approval (TFA).',
      'Install system through registered DISCOM empanelled vendor.',
      'Submit net-metering request; DISCOM inspects and installs net meter.',
      'Submit commissioning certificate and bank details for subsidy release within 30 days.'
    ],
    teApplicationSteps: [
      'నేషనల్ పోర్టల్ (pmsuryaghar.gov.in) లో రాష్ట్రం, డిస్కం మరియు కన్స్యూమర్ నంబర్‌తో నమోదు.',
      'దరఖాస్తు సమర్పించి టెక్నికల్ ఫీజిబిలిటీ అప్రూవల్ (TFA) పొందడం.',
      'డిస్కం అనుమతించిన వెండర్ ద్వారా సోలార్ ప్యానెల్స్ అమర్చడం.',
      'నెట్ మీటర్ ఏర్పాటు మరియు కమిషనింగ్ సర్టిఫికెట్ అప్‌లోడ్.',
      '30 రోజుల్లో బ్యాంక్ ఖాతాకు నేరుగా కేంద్ర సబ్సిడీ జమ.'
    ],
    officialApplicationUrl: 'https://pmsuryaghar.gov.in',
    officialInfoUrl: 'https://mnre.gov.in',
    sourceUrls: ['https://pmsuryaghar.gov.in', 'https://mnre.gov.in'],
    lastVerifiedAt: '2026-09-25',
    verificationStatus: 'verified',
    published: true,
    verifiedHelpline: '15555'
  },
  {
    id: 'dr-ysr-aarogyasri-ayushman-bharat',
    officialName: 'Dr. YSR Aarogyasri / Ayushman Bharat PM-JAY (Free Healthcare Scheme)',
    teName: 'డా. వైఎస్సార్ ఆరోగ్యశ్రీ / ఆయుష్మాన్ భారత్ (ఉచిత వైద్య పథకం)',
    hiName: 'आयुष्मान भारत - डॉ. वाईएसआर आरोग्यश्री',
    department: 'Dr. YSR Aarogyasri Health Care Trust, Govt. of Andhra Pradesh',
    govLevel: 'state',
    state: 'Andhra Pradesh',
    category: 'health',
    summary: 'Cashless healthcare treatment coverage up to Rs. 25 Lakhs per family per year for over 3,257 recognized medical and surgical procedures in network hospitals.',
    teSummary: 'ఆంధ్రప్రదేశ్‌లోని పేద కుటుంబాలకు ఏటా రూ. 25 లక్షల వరకు నెట్‌వర్క్ ఆసుపత్రుల్లో 3,257 రకాల వ్యాధులకు పూర్తి ఉచిత నగదు రహిత చికిత్స.',
    description: 'Provides comprehensive tertiary health protection covering hospitalization, critical surgeries, post-operative care, and Aarogya Aasara financial allowance during recovery.',
    teDescription: 'తీవ్రమైన అనారోగ్య సమస్యలు, శస్త్రచికిత్సలకు పేదలు అప్పులపాలు కాకుండా రూ. 25 లక్షల వరకు ప్రభుత్వ మరియు ప్రైవేట్ కార్పొరేట్ నెట్‌వర్క్ ఆసుపత్రుల్లో ఉచిత చికిత్స అందిస్తారు.',
    benefitDetails: 'Cashless treatment up to Rs. 25,00,000 per family per year; Aarogya Aasara recovery allowance of Rs. 225/day up to Rs. 5,000/month.',
    teBenefitDetails: 'కుటుంబానికి ఏటా రూ. 25 లక్షల వరకు ఉచిత చికిత్స; విశ్రాంతి కాలంలో ఆరోగ్య ఆసరా కింద రోజుకు రూ. 225 జీవన భృతి.',
    benefitAmount: 'Up to Rs. 25 Lakhs per family/year',
    eligibilityCriteria: {
      minAge: 0,
      gender: 'all',
      maxAnnualIncome: 500000, // Rs. 5 Lakhs
      requiresAPResidence: true,
      additionalRules: [
        'Must hold valid Rice Card or YSR Aarogyasri Card or Meeseva Income Certificate (< Rs. 5 Lakhs).',
        'Land holding below 12 acres wetland or 35 acres dry land.',
        'Municipal property tax paid for less than 3000 sq ft.'
      ],
      teAdditionalRules: [
        'రైస్ కార్డు లేదా ఆరోగ్యశ్రీ కార్డు లేదా రూ. 5 లక్షల లోపు ఆదాయ ధృవీకరణ పత్రం ఉండాలి.',
        'భూమి 12 ఎకరాల లోపు మాగాణి లేదా 35 ఎకరాల లోపు మెట్ట ఉండాలి.'
      ]
    },
    exclusions: ['Central/State Govt employees having separate medical reimbursement schemes'],
    requiredDocuments: [
      'Aadhaar Card of Patient and Family Head',
      'Rice Card / Aarogyasri Card',
      'Doctor Reference / Hospital OP slip'
    ],
    teRequiredDocuments: [
      'రోగి మరియు కుటుంబ సభ్యుల ఆధార్ కార్డులు',
      'రైస్ కార్డు / ఆరోగ్యశ్రీ కార్డు',
      'వైద్యుల రిఫరల్ లెటర్ / ఆసుపత్రి ఓపీ స్లిప్'
    ],
    applicationSteps: [
      'Walk into any empanelled Network Hospital (Govt or Private) across AP, Hyderabad, Chennai, Bangalore.',
      'Approach the Aarogyamithra desk with Rice Card / Aadhaar.',
      'Aarogyamithra generates pre-authorization request online to Trust doctors.',
      'Upon sanction, completely cashless admission, treatment, surgery, medicines, and food provided.',
      'Free follow-up consultation and medicines provided at discharge.'
    ],
    teApplicationSteps: [
      'ఏదైనా నెట్‌వర్క్ ఆసుపత్రికి వెళ్లి నేరుగా "ఆరోగ్యమిత్ర" డెస్క్‌ను సంప్రదించాలి.',
      'ఆధార్ కార్డు లేదా రైస్ కార్డు చూపించి ప్రీ-ఆథరైజేషన్ నమోదు చేయించడం.',
      'ట్రస్ట్ ఆమోదం పొందిన వెంటనే ఉచిత అడ్మిషన్, చికిత్స, ఆపరేషన్, భోజనం సౌకర్యం.',
      'డిశ్చార్జ్ సమయంలో ఉచిత మందులు మరియు ఆరోగ్య ఆసరా సాయం.'
    ],
    officialApplicationUrl: 'https://aarogyasri.ap.gov.in',
    officialInfoUrl: 'https://pmjay.gov.in',
    sourceUrls: ['https://aarogyasri.ap.gov.in', 'https://pmjay.gov.in'],
    lastVerifiedAt: '2026-09-20',
    verificationStatus: 'verified',
    published: true,
    verifiedHelpline: '104 (Aarogyasri Toll Free)'
  },
  {
    id: 'pm-svanidhi',
    officialName: 'PM SVANidhi (Micro-Credit for Street Vendors)',
    teName: 'పీఎం స్వనిధి (వీధి వ్యాపారుల చిరు వ్యాపార రుణ పథకం)',
    hiName: 'पीएम स्वनिधि (स्ट्रीट वेंडर आत्मनिर्भर निधि)',
    department: 'Ministry of Housing and Urban Affairs, Govt. of India',
    govLevel: 'central',
    state: 'All India',
    category: 'msme_entrepreneurship',
    summary: 'Collateral-free working capital micro-loans of Rs. 10,000, Rs. 20,000, and Rs. 50,000 with 7% interest subsidy and cashback for digital transactions.',
    teSummary: 'వీధి వ్యాపారులకు ఎటువంటి పూచీకత్తు లేకుండా రూ. 10,000, రూ. 20,000 మరియు రూ. 50,000 వరకు సులభ బ్యాంక్ రుణాలు మరియు 7% వడ్డీ సబ్సిడీ.',
    description: 'Empowers urban and peri-urban street vendors to restart or expand their livelihood without falling victim to high-interest local moneylenders.',
    teDescription: 'వీధి వ్యాపారులు పెట్టుబడి కోసం ప్రైవేట్ వడ్డీ వ్యాపారులపై ఆధారపడకుండా ప్రభుత్వ బ్యాంకుల ద్వారా తక్కువ వడ్డీకే రుణాలు పొందే పథకం.',
    benefitDetails: 'First tranche: Rs. 10,000 (1 yr); Second tranche on timely repayment: Rs. 20,000; Third tranche: Rs. 50,000. 7% per annum interest subsidy + up to Rs. 1,200 annual digital cashback.',
    teBenefitDetails: 'మొదటి విడత: రూ. 10,000; సకాలంలో చెల్లిస్తే రెండో విడత: రూ. 20,000; మూడో విడత: రూ. 50,000. 7% వడ్డీ రాయితీ.',
    benefitAmount: 'Rs. 10,000 to Rs. 50,000 working capital loan',
    eligibilityCriteria: {
      minAge: 18,
      occupations: ['Street Vendor', 'Hawker', 'Fruit Seller', 'Vegetable Seller', 'Food Stall', 'Artisan'],
      additionalRules: [
        'Vending in urban / peri-urban areas prior to cutoff dates.',
        'Possessing Certificate of Vending (CoV) / Identity Card issued by Urban Local Body (ULB) / Municipality.',
        'Vendors not having CoV can obtain Letter of Recommendation (LoR) from Town Vending Committee (TVC).'
      ],
      teAdditionalRules: [
        'పట్టణ లేదా నగర ప్రాంతాల్లో వీధి వ్యాపారం చేస్తున్న వారు అర్హులు.',
        'మున్సిపాలిటీ లేదా కార్పొరేషన్ ఇచ్చిన గుర్తింపు కార్డు లేదా లెటర్ ఆఫ్ రికమండేషన్ (LoR) ఉండాలి.'
      ]
    },
    exclusions: ['Commercial showroom owners', 'Wholesale distributors'],
    requiredDocuments: [
      'Aadhaar Card',
      'Voter ID / Certificate of Vending (CoV) / LoR from Municipality',
      'Bank Account details',
      'Mobile Number linked with Aadhaar'
    ],
    teRequiredDocuments: ['ఆధార్ కార్డు', 'మున్సిపాలిటీ గుర్తింపు కార్డు / LoR', 'బ్యాంక్ పాస్‌బుక్'],
    applicationSteps: [
      'Visit pmsvanidhi.mohua.gov.in or nearest Common Service Centre (CSC) or Village/Ward Secretariat.',
      'Check vending status using ULB registry.',
      'Select preferred lending institution / bank and submit loan application.',
      'Bank disburses loan directly into vendor account.'
    ],
    teApplicationSteps: [
      'pmsvanidhi.mohua.gov.in పోర్టల్ లేదా సచివాలయం / CSC కేంద్రంలో దరఖాస్తు.',
      'మున్సిపల్ సర్వే వివరాల పరిశీలన.',
      'బ్యాంక్ ఖాతాలో రుణ మొత్తం జమ.'
    ],
    officialApplicationUrl: 'https://pmsvanidhi.mohua.gov.in',
    officialInfoUrl: 'https://mohua.gov.in',
    sourceUrls: ['https://pmsvanidhi.mohua.gov.in'],
    lastVerifiedAt: '2026-08-30',
    verificationStatus: 'verified',
    published: true,
    verifiedHelpline: '1800-11-1979'
  },
  {
    id: 'pm-awas-yojana-gramin',
    officialName: 'Pradhan Mantri Awas Yojana - Gramin (PMAY-G / Navaratnalu Pedalandariki Illu)',
    teName: 'పీఎం ఆవాస్ యోజన - గ్రామీణ్ / నవరత్నాలు పేదలందరికీ ఇళ్లు',
    hiName: 'प्रधानमंत्री आवास योजना - ग्रामीण',
    department: 'Ministry of Rural Development, GoI & AP State Housing Corporation',
    govLevel: 'central',
    state: 'Andhra Pradesh',
    category: 'housing',
    summary: 'Financial assistance of Rs. 1.80 Lakhs + 90 days MGNREGS wage employment + toilet incentive for construction of a permanent pucca house with free house site patta in rural Andhra Pradesh.',
    teSummary: 'గ్రామీణ ప్రాంతాల్లో ఇల్లు లేని పేదలకు ఉచిత ఇంటి స్థల పట్టాతో పాటు పక్కా ఇల్లు కట్టుకునేందుకు రూ. 1.80 లక్షల ఆర్థిక సాయం మరియు ఉపాధి హామీ పథకం కింద అదనపు వేతనం.',
    description: 'Ensures that every houseless family and those living in dilapidated kuccha houses can build a resilient permanent house with basic amenities including water, sanitation, and electricity connection.',
    teDescription: 'సొంత ఇల్లు లేని గ్రామీణ నిరుపేదలకు నాణ్యమైన పక్కా గృహాన్ని నిర్మించి ఇచ్చేందుకు ప్రభుత్వం అందించే గృహ నిర్మాణ సహాయం.',
    benefitDetails: 'Rs. 1,80,000 unit assistance paid in 4 stages of construction + Rs. 24,000 MGNREGS wage work + Rs. 12,000 Swachh Bharat toilet grant.',
    teBenefitDetails: 'గృహ నిర్మాణానికి దశలవారీగా రూ. 1,80,000 సహాయం + రూ. 24,000 ఉపాధి హామీ వేతనం + రూ. 12,000 టాయిలెట్ మంజూరు.',
    benefitAmount: 'Rs. 1.80 Lakhs + Rs. 36,000 converges',
    eligibilityCriteria: {
      minAge: 18,
      locationType: 'rural',
      gender: 'all',
      maxAnnualIncome: 120000,
      requiresAPResidence: true,
      additionalRules: [
        'Houseless or living in zero/one/two room kuccha wall and roof houses.',
        'Must not own any pucca residential house anywhere in India.',
        'Prioritized for female head of household or joint ownership.'
      ],
      teAdditionalRules: [
        'దేశంలో ఎక్కడా సొంత పక్కా ఇల్లు ఉండకూడదు.',
        'మహిళ పేరు మీద లేదా భార్యాభర్తల పేర్లపై పట్టా మంజూరు.'
      ]
    },
    exclusions: ['Families owning motorised three/four wheelers', 'Income tax payers', 'Government servants'],
    requiredDocuments: [
      'Aadhaar Card of Husband and Wife',
      'Rice Card / Ration Card',
      'House Site Patta document (issued by AP Govt)',
      'Bank Account Passbook (Aadhaar linked)',
      'MGNREGS Job Card'
    ],
    teRequiredDocuments: ['ఆధార్ కార్డులు', 'రైస్ కార్డు', 'ఇంటి పట్టా పత్రం', 'బ్యాంక్ పాస్‌బుక్', 'ఉపాధి హామీ జాబ్ కార్డు'],
    applicationSteps: [
      'Survey conducted by Grama Sachivalayam Housing Assistant and Panchayat Secretary.',
      'Geotagging of house site / construction stages via AwaasApp.',
      'Payment released automatically upon verification of foundation, lintel, roof, and finishing stages.'
    ],
    teApplicationSteps: [
      'సచివాలయ హౌసింగ్ అసిస్టెంట్ ద్వారా దరఖాస్తు మరియు సైట్ సర్వే.',
      'AwaasApp ద్వారా ప్రతి నిర్మాణ దశను జియోట్యాగింగ్ చేయడం.',
      'పునాది, గోడలు, శ్లాబ్ దశల్లో నేరుగా ఖాతాలో నగదు విడుదల.'
    ],
    officialApplicationUrl: 'https://housing.ap.gov.in',
    officialInfoUrl: 'https://pmayg.nic.in',
    sourceUrls: ['https://housing.ap.gov.in', 'https://pmayg.nic.in'],
    lastVerifiedAt: '2026-09-05',
    verificationStatus: 'verified',
    published: true,
    verifiedHelpline: '1902 / 1800-425-1902'
  },
  {
    id: 'post-matric-scholarship-central',
    officialName: 'National Post-Matric Scholarship Scheme for SC/ST/OBC/EBC Students',
    teName: 'కేంద్ర పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ పథకం (SC/ST/OBC/EBC విద్యార్థులకు)',
    hiName: 'पोस्ट-मैट्रिक छात्रवृत्ति योजना',
    department: 'Ministry of Social Justice & Empowerment, Govt. of India',
    govLevel: 'central',
    state: 'All India',
    category: 'education',
    summary: 'Central post-matric scholarship covering non-refundable college fees and monthly maintenance allowances for marginalized students across India.',
    teSummary: '10వ తరగతి తర్వాతి చదువుల కోసం అర్హులైన ఎస్సీ, ఎస్టీ, ఓబీసీ విద్యార్థులకు కేంద్ర ప్రభుత్వ స్కాలర్‌షిప్ మరియు నెలవారీ అలవెన్స్.',
    description: 'Enables students belonging to Scheduled Castes, Scheduled Tribes, and Other Backward Classes to pursue post-secondary education through the National Scholarship Portal (NSP).',
    teDescription: 'నేషనల్ స్కాలర్‌షిప్ పోర్టల్ (NSP) ద్వారా దేశవ్యాప్తంగా చదువుతున్న నిరుపేద విద్యార్థులకు ఫీజు మరియు మెయింటెనెన్స్ ఖర్చుల కోసం ఇచ్చే స్కాలర్‌షిప్.',
    benefitDetails: 'Full approved academic course fee plus monthly maintenance allowance from Rs. 550 to Rs. 1,200 per month.',
    teBenefitDetails: 'కోర్సు ఫీజుతో పాటు నెలకు రూ. 550 నుండి రూ. 1,200 వరకు మెయింటెనెన్స్ అలవెన్స్.',
    benefitAmount: 'Tuition fees + Maintenance allowance',
    eligibilityCriteria: {
      minAge: 15,
      maxAge: 35,
      maxAnnualIncome: 250000,
      socialCategories: ['SC', 'ST', 'OBC', 'EBC'],
      additionalRules: [
        'Must be studying in recognized government or private college post 10th standard.',
        'Only two boys from the same parents are eligible (girls have no restriction).'
      ],
      teAdditionalRules: ['గుర్తింపు పొందిన కళాశాలలో చదువుతూ ఉండాలి.', 'వార్షిక ఆదాయం రూ. 2.5 లక్షల లోపు ఉండాలి.']
    },
    exclusions: ['Students availing other full central scholarships simultaneously'],
    requiredDocuments: ['Aadhaar Card', 'Caste Certificate', 'Income Certificate', 'Previous Year Marksheet', 'College Fee Receipt', 'Bank Passbook'],
    teRequiredDocuments: ['ఆధార్ కార్డు', 'కుల ధృవీకరణ పత్రం', 'ఆదాయ ధృవీకరణ పత్రం', 'మార్కుల మెమో', 'కాలేజీ ఫీజు రసీదు'],
    applicationSteps: [
      'Apply online on National Scholarship Portal (scholarships.gov.in).',
      'Institute verification by Nodal Officer.',
      'State Nodal Officer verification followed by PFMS DBT disbursement.'
    ],
    teApplicationSteps: ['NSP పోర్టల్ (scholarships.gov.in) లో ఆన్‌లైన్ దరఖాస్తు.', 'కాలేజీ మరియు రాష్ట్ర నోడల్ అధికారి వెరిఫికేషన్.', 'PFMS ద్వారా ఖాతాలో జమ.'],
    officialApplicationUrl: 'https://scholarships.gov.in',
    officialInfoUrl: 'https://scholarships.gov.in',
    sourceUrls: ['https://scholarships.gov.in'],
    lastVerifiedAt: '2026-08-15',
    verificationStatus: 'verified',
    published: true,
    verifiedHelpline: '0120-6619540'
  },
  {
    id: 'mgnregs-rural-employment',
    officialName: 'Mahatma Gandhi National Rural Employment Guarantee Scheme (MGNREGS / ఉపాధి హామీ)',
    teName: 'మహాత్మా గాంధీ జాతీయ గ్రామీణ ఉపాధి హామీ పథకం',
    hiName: 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम',
    department: 'Ministry of Rural Development & AP Department of Panchayat Raj',
    govLevel: 'central',
    state: 'All India',
    category: 'employment',
    summary: 'Legal guarantee of at least 100 days of unskilled wage employment in a financial year to every rural household whose adult members volunteer to do unskilled manual work.',
    teSummary: 'గ్రామీణ ప్రాంతాల్లో ప్రతి కుటుంబానికి ఏటా కనీసం 100 రోజుల పాటు నైపుణ్యం లేని కూలీ పనులకు చట్టబద్ధమైన ఉపాధి మరియు రోజువారీ వేతనం గ్యారెంటీ.',
    description: 'Strengthens rural livelihood security through community water conservation, land development, rural roads, and afforestation works, with timely digital wage payments directly to Aadhaar-linked accounts.',
    teDescription: 'గ్రామీణ పేదరిక నిర్మూలనకు, వ్యవసాయేతర కాలంలో వలసలను నివారించేందుకు ప్రభుత్వం కల్పించే 100 రోజుల ఉపాధి హక్కు పథకం.',
    benefitDetails: 'Guaranteed 100 days of employment at notified wage rate of Rs. 300/day in AP; unemployment allowance if work not provided within 15 days of demand.',
    teBenefitDetails: 'ఏటా 100 రోజుల పని గ్యారెంటీ. ఆంధ్రప్రదేశ్‌లో రోజుకు రూ. 300 ప్రభుత్వ నిర్ణీత వేతనం నేరుగా బ్యాంక్ ఖాతాలో జమ.',
    benefitAmount: 'Rs. 300 per day (up to 100 days)',
    eligibilityCriteria: {
      minAge: 18,
      locationType: 'rural',
      gender: 'all',
      additionalRules: [
        'Must be a resident of the rural Gram Panchayat.',
        'Adult members willing to do unskilled manual work.',
        'Must hold valid Job Card issued by Gram Panchayat.'
      ],
      teAdditionalRules: ['గ్రామ పంచాయతీ పరిధిలో నివసిస్తూ ఉండాలి.', 'జాబ్ కార్డు కలిగి ఉండి కూలీ పనికి సిద్ధంగా ఉండాలి.']
    },
    exclusions: ['Urban area residents', 'Minors below 18 years'],
    requiredDocuments: ['Aadhaar Card of all adult members', 'Proof of residence in Gram Panchayat', 'Bank / Post Office Account details'],
    teRequiredDocuments: ['ఆధార్ కార్డు', 'గ్రామ పంచాయతీ నివాస ధృవీకరణ', 'బ్యాంక్ లేదా పోస్టాఫీస్ ఖాతా పాస్‌బుక్'],
    applicationSteps: [
      'Apply for Job Card at Grama Sachivalayam / Gram Panchayat office.',
      'Secretariat staff conducts verification and issues Job Card within 15 days.',
      'Submit written application for work; work allocated within 5 km of village.'
    ],
    teApplicationSteps: ['గ్రామ సచివాలయంలో జాబ్ కార్డు కోసం దరఖాస్తు.', '15 రోజుల్లో జాబ్ కార్డు జారీ.', 'పని కావాలని కోరుతూ దరఖాస్తు సమర్పణ.'],
    officialApplicationUrl: 'https://nrega.nic.in',
    officialInfoUrl: 'https://pnrega.ap.gov.in',
    sourceUrls: ['https://nrega.nic.in', 'https://pnrega.ap.gov.in'],
    lastVerifiedAt: '2026-09-01',
    verificationStatus: 'verified',
    published: true,
    verifiedHelpline: '1800-345-6789'
  }
];
