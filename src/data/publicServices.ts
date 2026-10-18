import { PublicService } from '../types';

export const VERIFIED_PUBLIC_SERVICES: PublicService[] = [
  {
    id: 'aadhaar-services',
    name: 'Aadhaar Services (Enrolment, Address Update, PVC Card & Biometrics)',
    teName: 'ఆధార్ సేవలు (కొత్త నమోదు, చిరునామా మార్పు, పీవీసీ కార్డు & బయోమెట్రిక్స్)',
    category: 'identity',
    govLevel: 'central',
    department: 'Unique Identification Authority of India (UIDAI), Ministry of Electronics & IT',
    teDepartment: 'భారత విశిష్ట గుర్తింపు ప్రాధికార సంస్థ (UIDAI), ఎలక్ట్రానిక్స్ & ఐటీ మంత్రిత్వ శాఖ',
    purpose: '12-digit unique identity number issued by UIDAI, mandatory for accessing government subsidies, scholarships, and DBT welfare schemes.',
    tePurpose: 'ప్రభుత్వ సంక్షేమ పథకాలు, స్కాలర్‌షిప్‌లు, బ్యాంక్ ఖాతాలు మరియు సబ్సిడీల కోసం తప్పనిసరి అయిన విశిష్ట గుర్తింపు సంఖ్య.',
    officialInfoUrl: 'https://services.india.gov.in/service/detail/aadhaar-online-services',
    officialApplicationUrl: 'https://myaadhaar.uidai.gov.in',
    officialPortal: 'https://myaadhaar.uidai.gov.in',
    status: 'VERIFIED',
    lastVerifiedDate: '2026-10-15',
    verificationSource: 'services.india.gov.in / UIDAI myAadhaar Portal',
    officialFee: 'New Enrolment: FREE; Mandatory Biometric (5 & 15 yrs): FREE; Demographic Update: Rs. 50; Biometric Update: Rs. 100; Order PVC Card: Rs. 50',
    processingTime: '5 to 15 working days',
    eligibility: 'All residents of India (including infants and newborns).',
    teEligibility: 'భారతదేశంలో నివసించే పౌరులందరూ (నవజాత శిశువులతో సహా) అర్హులు.',
    requiredDocuments: [
      'Proof of Identity (PoI): Voter ID, Passport, PAN Card, Driving Licence, or Village Secretariat Certificate',
      'Proof of Address (PoA): Electricity Bill, Water Bill, Ration Card, Bank Passbook, or Secretariat Residence Certificate',
      'Proof of Date of Birth (DoB): Birth Certificate, SSC Memo, or Passport'
    ],
    teRequiredDocuments: [
      'గుర్తింపు ధృవీకరణ (PoI): ఓటర్ ఐడీ, పాన్ కార్డు, పాస్‌పోర్ట్ లేదా సచివాలయ ధృవీకరణ',
      'చిరునామా ధృవీకరణ (PoA): కరెంట్ బిల్లు, రేషన్ కార్డు, బ్యాంక్ పాస్‌బుక్',
      'పుట్టిన తేదీ ధృవీకరణ (DoB): బర్త్ సర్టిఫికెట్ లేదా 10వ తరగతి మార్కుల మెమో'
    ],
    steps: [
      'For Address Update: Log in to myAadhaar portal using Aadhaar number and OTP received on registered mobile.',
      'Upload valid supporting document (PoA) in PDF/JPEG and pay Rs. 50 fee online.',
      'For Biometrics / Mobile Linking: Visit nearest Grama Sachivalayam Aadhaar Centre or Post Office.',
      'Submit form and provide finger/iris biometric scan.',
      'Collect acknowledgement slip with 14-digit Enrolment ID (EID) / Service Request Number (SRN).'
    ],
    teSteps: [
      'చిరునామా మార్పు కోసం: myaadhaar.uidai.gov.in లో రిజిస్టర్డ్ మొబైల్ OTP తో లాగిన్ అవ్వండి.',
      'సరైన డాక్యుమెంట్ అప్‌లోడ్ చేసి రూ. 50 ఆన్‌లైన్‌లో చెల్లించండి.',
      'మొబైల్ నంబర్ లింకింగ్ లేదా బయోమెట్రిక్స్ కోసం: సమీప గ్రామ/వార్డు సచివాలయం లేదా పోస్టాఫీస్ ఆధార్ కేంద్రానికి వెళ్లండి.',
      'బయోమెట్రిక్ స్కానింగ్ పూర్తి చేసి రసీదు స్లిప్ (EID/SRN) తీసుకోండి.'
    ],
    trackingInstructions: 'Track status on myAadhaar portal using the 14-digit EID or 28-digit SRN and captcha.',
    teTrackingInstructions: 'myaadhaar.uidai.gov.in లో EID లేదా SRN నంబర్ నమోదు చేసి స్థితిని తెలుసుకోవచ్చు.',
    supportHelpline: '1947 (UIDAI Toll-Free) / help@uidai.gov.in'
  },
  {
    id: 'pan-card-services',
    name: 'PAN Card (Permanent Account Number - Instant e-PAN & New Physical Card)',
    teName: 'పాన్ కార్డు (కొత్త పాన్, ఇన్‌స్టంట్ ఈ-పాన్ మరియు దిద్దుబాట్లు)',
    category: 'identity',
    govLevel: 'central',
    department: 'Income Tax Department, Ministry of Finance, Government of India',
    teDepartment: 'ఆదాయ పన్ను శాఖ, ఆర్థిక మంత్రిత్వ శాఖ, భారత ప్రభుత్వం',
    purpose: '10-digit alphanumeric identifier issued by the Income Tax Department for financial transactions, opening bank accounts, and employment.',
    tePurpose: 'బ్యాంక్ ఖాతాలు తెరవడం, ఉపకార వేతనాలు, వ్యాపార లావాదేవీలు మరియు ఆదాయ పన్ను నిమిత్తం తప్పనిసరి గుర్తింపు కార్డు.',
    officialInfoUrl: 'https://services.india.gov.in/service/detail/apply-for-pan-card-online',
    officialApplicationUrl: 'https://eportal.incometax.gov.in',
    officialPortal: 'https://eportal.incometax.gov.in',
    status: 'VERIFIED',
    lastVerifiedDate: '2026-10-15',
    verificationSource: 'services.india.gov.in / Income Tax e-Filing Portal',
    officialFee: 'Instant e-PAN via Income Tax Portal: 100% FREE; Physical PAN Card via NSDL/UTIITSL: Rs. 107 (within India)',
    processingTime: 'Instant e-PAN: 10 minutes; Physical Card: 10 to 15 days by speed post',
    eligibility: 'Any individual residing in India. For Instant e-PAN, Aadhaar must be linked to active mobile.',
    teEligibility: 'భారతదేశంలో నివసించే ఏ పౌరుడైనా దరఖాస్తు చేసుకోవచ్చు. తక్షణ ఈ-పాన్ కోసం ఆధార్‌కు మొబైల్ నంబర్ లింక్ అయి ఉండాలి.',
    requiredDocuments: [
      'Aadhaar Card (sufficient for Instant e-PAN Paperless method)',
      'For Physical Form 49A: Aadhaar Card, Passport size photograph, Signature scan'
    ],
    teRequiredDocuments: [
      'ఆధార్ కార్డు (మొబైల్ నంబర్ లింక్ అయి ఉండాలి)',
      'పాస్‌పోర్ట్ సైజు ఫోటో మరియు సంతకం'
    ],
    steps: [
      'For Instant e-PAN: Visit eportal.incometax.gov.in -> Quick Links -> Instant e-PAN.',
      'Enter Aadhaar Number and validate with OTP sent to mobile.',
      'Confirm personal details extracted from Aadhaar and submit.',
      'Download digitally signed PDF e-PAN within minutes.',
      'For Physical Plastic Card: Apply on NSDL portal, pay Rs. 107, and card will be delivered home.'
    ],
    teSteps: [
      'ఉచిత ఈ-పాన్ కోసం: ఇన్కమ్ టాక్స్ పోర్టల్ (eportal.incometax.gov.in) లో Instant e-PAN ఎంచుకోండి.',
      'ఆధార్ నంబర్ నమోదు చేసి ఓటీపీతో ధృవీకరించండి.',
      'క్షణాల్లో డిజిటల్ ఈ-పాన్ డౌన్‌లోడ్ చేసుకోండి.',
      'ప్లాస్టిక్ కార్డు కోసం NSDL పోర్టల్‌లో రూ. 107 చెల్లించి దరఖాస్తు చేయండి.'
    ],
    trackingInstructions: 'Track application on tin-nsdl.com using 15-digit acknowledgement number.',
    teTrackingInstructions: 'NSDL పోర్టల్‌లో 15 అంకెల ఎక్నాలెడ్జ్‌మెంట్ నంబర్ ద్వారా ట్రాక్ చేయవచ్చు.',
    supportHelpline: '1800-180-1961'
  },
  {
    id: 'integrated-caste-certificate',
    name: 'Integrated Caste / Community Certificate (AP Meeseva / Sachivalayam)',
    teName: 'కుల ధృవీకరణ పత్రం (ఇంటిగ్రేటెడ్ కుల & కమ్యూనిటీ సర్టిఫికెట్)',
    category: 'certificates',
    govLevel: 'state',
    department: 'Revenue Department, Government of Andhra Pradesh',
    teDepartment: 'రెవెన్యూ శాఖ, ఆంధ్రప్రదేశ్ ప్రభుత్వం',
    purpose: 'Official legal proof of community and social category (SC/ST/BC/OBC/OC) required for reservation in education, jobs, and government welfare schemes.',
    tePurpose: 'విద్యా సంస్థల్లో అడ్మిషన్లు, ఫీజు రీయింబర్స్‌మెంట్, ఉద్యోగ రిజర్వేషన్లు మరియు ప్రభుత్వ పథకాలకు తప్పనిసరి.',
    officialInfoUrl: 'https://services.india.gov.in/service/detail/list-of-services-offered-by-meeseva-for-andhra-pradesh',
    officialApplicationUrl: 'https://gramawardsachivalayam.ap.gov.in',
    officialPortal: 'https://gramawardsachivalayam.ap.gov.in',
    status: 'VERIFIED',
    lastVerifiedDate: '2026-10-15',
    verificationSource: 'services.india.gov.in / AP GSWS Citizen Charter',
    officialFee: 'Official Secretariat / Meeseva User Charge: Rs. 35',
    processingTime: '7 to 15 working days (Tahsildar Digital Signature)',
    eligibility: 'Citizens belonging to notified communities residing in Andhra Pradesh.',
    teEligibility: 'ఆంధ్రప్రదేశ్ రాష్ట్రంలో నివసిస్తున్న గుర్తింపు పొందిన కులాలకు చెందిన పౌరులు.',
    requiredDocuments: [
      'Applicant & Parent Aadhaar Card',
      'Father/Sibling Caste Certificate OR 10th TC mentioning caste',
      'Ration Card / Rice Card / Meebhoomi RoR Extract',
      'Self-Declaration Form'
    ],
    teRequiredDocuments: [
      'దరఖాస్తుదారు మరియు తల్లిదండ్రుల ఆధార్ కార్డులు',
      'తండ్రి లేదా తోబుట్టువుల కుల ధృవీకరణ పత్రం లేదా టీసీ (TC)',
      'రైస్ కార్డు / రేషన్ కార్డు',
      'స్వయం ధృవీకరణ పత్రం'
    ],
    steps: [
      'Visit nearest Grama / Ward Sachivalayam with documents.',
      'Digital Assistant / Revenue Assistant submits application in GSWS Portal.',
      'Village Revenue Officer (VRO) and Revenue Inspector (RI) conduct field enquiry.',
      'Tahsildar approves and signs certificate digitally.',
      'Collect printed digitally signed certificate from Secretariat.'
    ],
    teSteps: [
      'సమీప గ్రామ/వార్డు సచివాలయానికి వెళ్లి డిజిటల్ అసిస్టెంట్‌కు దరఖాస్తు ఇవ్వండి.',
      'వీఆర్వో (VRO) మరియు ఆర్ఐ (RI) ద్వారా క్షేత్ర విచారణ జరుగుతుంది.',
      'తహశీల్దార్ డిజిటల్ సంతకంతో సర్టిఫికెట్ జారీ చేస్తారు.',
      'సచివాలయం నుంచి డిజిటల్ కాపీని తీసుకోవచ్చు.'
    ],
    trackingInstructions: 'Track status via AP GSWS Portal or Spandana using the Application Number (e.g., CGA...).',
    teTrackingInstructions: 'సచివాలయ పోర్టల్ లేదా స్పందన ద్వారా అప్లికేషన్ నంబర్‌తో ట్రాక్ చేయండి.',
    supportHelpline: '1902'
  },
  {
    id: 'income-certificate',
    name: 'Income Certificate (AP Meeseva / Sachivalayam)',
    teName: 'ఆదాయ ధృవీకరణ పత్రం (ఇన్‌కమ్ సర్టిఫికెట్)',
    category: 'certificates',
    govLevel: 'state',
    department: 'Revenue Department, Government of Andhra Pradesh',
    teDepartment: 'రెవెన్యూ శాఖ, ఆంధ్రప్రదేశ్ ప్రభుత్వం',
    purpose: 'Certifies annual household earnings from all sources, essential for fee reimbursement, scholarships, and free medical care.',
    tePurpose: 'విద్యా దీవెన, ఆరోగ్యశ్రీ మరియు ఇతర సంక్షేమ పథకాలకు కుటుంబ వార్షిక ఆదాయాన్ని నిరూపించే పత్రం.',
    officialInfoUrl: 'https://services.india.gov.in/service/detail/services-portal-of-andhra-pradesh-government',
    officialApplicationUrl: 'https://gramawardsachivalayam.ap.gov.in',
    officialPortal: 'https://gramawardsachivalayam.ap.gov.in',
    status: 'VERIFIED',
    lastVerifiedDate: '2026-10-15',
    verificationSource: 'services.india.gov.in / AP GSWS Citizen Charter',
    officialFee: 'Rs. 35 (Statutory User Charge)',
    processingTime: '3 to 7 working days',
    eligibility: 'Residents of Andhra Pradesh requiring income certification for public benefits.',
    teEligibility: 'ఆంధ్రప్రదేశ్ రాష్ట్రంలో నివసిస్తూ సంక్షేమ పథకాలు పొందగోరే అర్హులైన పౌరులు.',
    requiredDocuments: [
      'Aadhaar Card of Family Head and Applicant',
      'Rice Card / Ration Card',
      'Salary Slip / IT Returns (if employed) or Land Records / Village Secretariat Inquiry',
      'Electricity Bill'
    ],
    teRequiredDocuments: [
      'కుటుంబ పెద్ద మరియు దరఖాస్తుదారు ఆధార్ కార్డు',
      'రైస్ కార్డు',
      'కరెంట్ బిల్లు మరియు సచివాలయ డిక్లరేషన్'
    ],
    steps: [
      'Submit application at Grama / Ward Sachivalayam.',
      'VRO inspects landholdings, agricultural yield, or business activities.',
      'Tahsildar approves and issues digitally signed certificate valid for 1 year.'
    ],
    teSteps: [
      'గ్రామ/వార్డు సచివాలయంలో దరఖాస్తు సమర్పణ.',
      'వీఆర్వో క్షేత్ర పరిశీలన.',
      'తహశీల్దార్ డిజిటల్ సంతకంతో 1 సంవత్సరం కాలపరిమితి గల పత్రం జారీ.'
    ],
    trackingInstructions: 'Track using Service Request ID on GSWS Portal.',
    teTrackingInstructions: 'GSWS పోర్టల్‌లో రిక్వెస్ట్ ఐడీతో ట్రాక్ చేయవచ్చు.',
    supportHelpline: '1902'
  },
  {
    id: 'rice-card-services',
    name: 'AP Rice Card (New Card, Splitting, Member Addition & e-KYC)',
    teName: 'రైస్ కార్డు సేవలు (కొత్త కార్డు, సభ్యుల చేర్పు, విభజన, ఈ-కేవైసీ)',
    category: 'welfare_cards',
    govLevel: 'state',
    department: 'Consumer Affairs, Food & Civil Supplies Department, Government of Andhra Pradesh',
    teDepartment: 'పౌర సరఫరాల శాఖ, ఆంధ్రప్రదేశ్ ప్రభుత్వం',
    purpose: 'Enables access to subsidized PDS food grains, Aarogyasri medical coverage, and serves as primary proof of economic eligibility for all AP state schemes.',
    tePurpose: 'ప్రజా పంపిణీ వ్యవస్థ (PDS) ద్వారా రేషన్ బియ్యం, ఆరోగ్యశ్రీ ఉచిత వైద్యం మరియు రాష్ట్ర సంక్షేమ పథకాలకు ప్రాథమిక అర్హత కార్డు.',
    officialInfoUrl: 'https://epos.ap.gov.in',
    officialApplicationUrl: 'https://gramawardsachivalayam.ap.gov.in',
    officialPortal: 'https://epos.ap.gov.in',
    status: 'VERIFIED',
    lastVerifiedDate: '2026-10-15',
    verificationSource: 'epos.ap.gov.in / AP Civil Supplies Department',
    officialFee: 'FREE of charge',
    processingTime: '21 days under Citizen Charter',
    eligibility: 'Families with total monthly income below Rs. 10,000 (Rural) / Rs. 12,000 (Urban), land below 3 acres wetland / 10 acres dry land, no 4-wheelers.',
    teEligibility: 'గ్రామీణ ప్రాంతాల్లో నెలకు రూ. 10,000, పట్టణాల్లో రూ. 12,000 లోపు ఆదాయం గల కుటుంబాలు.',
    requiredDocuments: [
      'Aadhaar Cards of all family members',
      'Birth certificates of children below 5 years',
      'Electricity bill of residence',
      'Marriage certificate (for splitting/new couple)'
    ],
    teRequiredDocuments: [
      'కుటుంబ సభ్యులందరి ఆధార్ కార్డులు',
      'చిన్న పిల్లల బర్త్ సర్టిఫికెట్లు',
      'కరెంట్ బిల్లు',
      'వివాహ ధృవీకరణ పత్రం (కొత్త జంటలకైతే)'
    ],
    steps: [
      'Apply at Village / Ward Secretariat through Welfare Assistant.',
      'Biometric authentication of family members.',
      'Multi-department data validation (Transport, Revenue, Municipal).',
      'Doorstep biometric delivery of QR-coded Rice Card.'
    ],
    teSteps: [
      'గ్రామ/వార్డు సచివాలయంలో వెల్ఫేర్ అసిస్టెంట్ వద్ద దరఖాస్తు.',
      'కుటుంబ సభ్యుల బయోమెట్రిక్ ఈ-కేవైసీ.',
      'అర్హుల జాబితా పరిశీలన అనంతరం క్యూఆర్ కోడ్ గల రైస్ కార్డు జారీ.'
    ],
    trackingInstructions: 'Check Rice Card status at epos.ap.gov.in or Navasakam portal.',
    teTrackingInstructions: 'epos.ap.gov.in లో ఆధార్ నంబర్ ద్వారా కార్డు స్థితిని చెక్ చేయండి.',
    supportHelpline: '1902 / 1967 (PDS Helpline)'
  },
  {
    id: 'voter-id-services',
    name: 'Voter ID Card (New Registration - Form 6, Correction - Form 8 & e-EPIC)',
    teName: 'ఓటర్ ఐడీ సేవలు (కొత్త నమోదు - ఫారం 6, మార్పులు - ఫారం 8, డిజిటల్ ఓటర్ కార్డు)',
    category: 'electoral',
    govLevel: 'central',
    department: 'Election Commission of India (ECI)',
    teDepartment: 'భారత ఎన్నికల సంఘం (ECI)',
    purpose: 'Electoral Photo Identity Card (EPIC) issued by Election Commission of India granting constitutional right to vote and serving as valid national identity proof.',
    tePurpose: 'భారత ఎన్నికల సంఘం జారీ చేసే ఓటరు గుర్తింపు కార్డు. ఓటు హక్కుతో పాటు అధికారిక గుర్తింపు పత్రం.',
    officialInfoUrl: 'https://services.india.gov.in/service/detail/voters-services-portal',
    officialApplicationUrl: 'https://voters.eci.gov.in',
    officialPortal: 'https://voters.eci.gov.in',
    status: 'VERIFIED',
    lastVerifiedDate: '2026-10-15',
    verificationSource: 'services.india.gov.in / Election Commission of India',
    officialFee: '100% FREE',
    processingTime: '15 to 30 days',
    eligibility: 'Indian citizens who have attained 18 years of age on qualifying dates (Jan 1, Apr 1, Jul 1, Oct 1).',
    teEligibility: '18 సంవత్సరాలు నిండిన భారతీయ పౌరులందరూ నూతన ఓటరుగా నమోదు చేసుకోవచ్చు.',
    requiredDocuments: [
      'Proof of Age: Birth Certificate, 10th Memo, Aadhaar Card, PAN Card',
      'Proof of Residence: Aadhaar, Bank Passbook, Ration Card, Electricity Bill',
      'Passport size photograph'
    ],
    teRequiredDocuments: [
      'వయస్సు ధృవీకరణ: ఆధార్, బర్త్ సర్టిఫికెట్ లేదా 10వ తరగతి సర్టిఫికెట్',
      'నివాస ధృవీకరణ: ఆధార్, రేషన్ కార్డు లేదా కరెంట్ బిల్లు',
      'పాస్‌పోర్ట్ సైజు కలర్ ఫోటో'
    ],
    steps: [
      'Register on voters.eci.gov.in or ECIVoter Helpline App with mobile number.',
      'Fill Form 6 for new voter registration and upload photo & documents.',
      'Booth Level Officer (BLO) visits residence for physical verification.',
      'Electoral Registration Officer (ERO) approves addition to electoral roll.',
      'Download instant digital e-EPIC PDF and receive physical smart card by Speed Post.'
    ],
    teSteps: [
      'voters.eci.gov.in లేదా Voter Helpline యాప్‌లో రిజిస్టర్ చేసుకోండి.',
      'కొత్త ఓటు కోసం ఫారం-6 పూరించి డాక్యుమెంట్లు అప్‌లోడ్ చేయండి.',
      'బీఎల్వో (BLO) మీ ఇంటికి వచ్చి వివరాలను పరిశీలిస్తారు.',
      'ఈరో (ERO) ఆమోదించిన తర్వాత డిజిటల్ e-EPIC డౌన్‌లోడ్ చేసుకోవచ్చు మరియు పోస్టులో ప్లాస్టిక్ కార్డు వస్తుంది.'
    ],
    trackingInstructions: 'Track reference number on voters.eci.gov.in Track Application Status section.',
    teTrackingInstructions: 'voters.eci.gov.in లో రిఫరెన్స్ నంబర్ ఎంటర్ చేసి స్థితిని ట్రాక్ చేయండి.',
    supportHelpline: '1950 (Election Toll-Free Helpline)'
  },
  {
    id: 'driving-licence-services',
    name: 'Driving Licence & Learner\'s Licence (Parivahan Sarathi / RTA AP)',
    teName: 'డ్రైవింగ్ లైసెన్స్ & లెర్నర్స్ లైసెన్స్ (రవాణా శాఖ సేవలు)',
    category: 'transport',
    govLevel: 'central',
    department: 'Ministry of Road Transport and Highways (MoRTH) & Transport Department AP',
    teDepartment: 'రవాణా శాఖ, ఆంధ్రప్రదేశ్ మరియు కేంద్ర రహదారి రవాణా మంత్రిత్వ శాఖ',
    purpose: 'Legal authorization to drive motor vehicles on Indian roads issued by Ministry of Road Transport and Highways.',
    tePurpose: 'ద్విచక్ర మరియు నాలుగు చక్రాల వాహనాలు నడపడానికి ప్రభుత్వం జారీ చేసే అధికారిక డ్రైవింగ్ లైసెన్స్.',
    officialInfoUrl: 'https://services.india.gov.in/service/detail/apply-online-for-driving-licence-in-andhra-pradesh',
    officialApplicationUrl: 'https://sarathi.parivahan.gov.in',
    officialPortal: 'https://sarathi.parivahan.gov.in',
    status: 'VERIFIED',
    lastVerifiedDate: '2026-10-15',
    verificationSource: 'services.india.gov.in / Parivahan Sewa Portal',
    officialFee: 'LLR: Rs. 150 per class of vehicle + Rs. 50 test fee; Permanent DL: Rs. 200 + Rs. 300 driving test fee',
    processingTime: 'LLR: Same day (Online test); Permanent DL: 7 days after driving test',
    eligibility: 'Age 16+ for gearless 50cc two-wheeler; Age 18+ for geared motor vehicle/car.',
    teEligibility: 'గేర్లు లేని ద్విచక్ర వాహనాలకు 16 ఏళ్లు; గేర్ల వాహనాలు మరియు కార్లకు 18 ఏళ్లు నిండి ఉండాలి.',
    requiredDocuments: [
      'Aadhaar Card (enables Contactless LLR test from home)',
      'Proof of Age & Address',
      'Medical Certificate Form 1A (for applicants above 40 years or transport vehicles)',
      'Passport size photograph & Signature'
    ],
    teRequiredDocuments: [
      'ఆధార్ కార్డు (ఇంటి వద్ద నుంచే ఆన్‌లైన్ LLR టెస్ట్ రాయవచ్చు)',
      'వయస్సు మరియు చిరునామా పత్రాలు',
      'ఫోటో మరియు సంతకం'
    ],
    steps: [
      'Visit sarathi.parivahan.gov.in -> Select Andhra Pradesh -> Apply for Learner Licence.',
      'Authenticate with Aadhaar for Aadhaar-based faceless test (no RTO visit needed for LLR).',
      'Watch mandatory road safety tutorial video and appear for online test.',
      'Pass online test and immediately download Learner\'s Licence.',
      'After 30 days (valid up to 6 months), book driving test slot for permanent DL at nearest RTA office.'
    ],
    teSteps: [
      'sarathi.parivahan.gov.in లో ఆంధ్రప్రదేశ్‌ను ఎంచుకుని Apply for Learner Licence క్లిక్ చేయండి.',
      'ఆధార్ ఆథెంటికేషన్‌తో ఇంటి వద్ద నుంచే ఆన్‌లైన్ పరీక్ష రాయండి (RTO కి వెళ్లాల్సిన పనిలేదు).',
      'పరీక్ష పాసైన వెంటనే LLR డౌన్‌లోడ్ చేసుకోండి.',
      '30 రోజుల తర్వాత RTO వద్ద డ్రైవింగ్ టెస్ట్ స్లాట్ బుక్ చేసుకుని శాశ్వత లైసెన్స్ పొందండి.'
    ],
    trackingInstructions: 'Track application on sarathi.parivahan.gov.in using Application Number and Date of Birth.',
    teTrackingInstructions: 'సారథి పోర్టల్‌లో అప్లికేషన్ నంబర్ మరియు పుట్టిన తేదీతో ట్రాక్ చేయండి.',
    supportHelpline: '0120-4925505 / helpdesk-sarathi@gov.in'
  },
  {
    id: 'land-records-meebhoomi',
    name: 'Meebhoomi Digital Land Records (Adangal, 1-B Namuna & RoR Pattadar Passbook)',
    teName: 'మీభూమి డిజిటల్ భూ రికార్డులు (అడంగల్, 1-బి నమూనా మరియు ఈ-పాస్‌బుక్)',
    category: 'land_records',
    govLevel: 'state',
    department: 'Revenue Department (Survey and Settlement), Government of Andhra Pradesh',
    teDepartment: 'రెవెన్యూ శాఖ (భూ రికార్డులు), ఆంధ్రప్రదేశ్ ప్రభుత్వం',
    purpose: 'Certified digital land revenue records in Andhra Pradesh necessary for Rythu Bharosa, crop loans, PM-KISAN, and legal land transactions.',
    tePurpose: 'రైతు భరోసా, పంట రుణాలు, పీఎం కిసాన్ మరియు భూ లావాదేవీలకు అవసరమైన అధికారిక అడంగల్ మరియు 1-బి నమూనా పత్రాలు.',
    officialInfoUrl: 'https://meebhoomi.ap.gov.in',
    officialApplicationUrl: 'https://meebhoomi.ap.gov.in',
    officialPortal: 'https://meebhoomi.ap.gov.in',
    status: 'VERIFIED',
    lastVerifiedDate: '2026-10-15',
    verificationSource: 'AP Webland / Meebhoomi Official Revenue Portal',
    officialFee: 'Online View / Download: 100% FREE; Digitally Signed Certified Copy at Secretariat: Rs. 35',
    processingTime: 'Instant online download',
    eligibility: 'Any landholder, farmer, or interested citizen in Andhra Pradesh.',
    teEligibility: 'ఆంధ్రప్రదేశ్ రాష్ట్రంలోని ఏ రైతు లేదా భూ యజమాని అయినా తమ భూమి వివరాలను తనిఖీ చేసుకోవచ్చు.',
    requiredDocuments: [
      'Survey Number OR Khata Number OR Pattadar Aadhaar Number OR Pattadar Name'
    ],
    teRequiredDocuments: [
      'సర్వే నంబర్ లేదా ఖాతా నంబర్ లేదా పట్టాదారు ఆధార్ నంబర్'
    ],
    steps: [
      'Visit meebhoomi.ap.gov.in.',
      'Select "Adangal" or "1-B" -> Choose "Your Adangal / 1-B".',
      'Select District, Mandal, Village name.',
      'Enter Survey Number or Khata Number and captcha code.',
      'View and download official digital land record with land classification, extent, and ownership details.'
    ],
    teSteps: [
      'meebhoomi.ap.gov.in వెబ్‌సైట్‌ను సందర్శించండి.',
      '"మీ అడంగల్" లేదా "1-బి" ఆప్షన్‌ను ఎంచుకోండి.',
      'జిల్లా, మండలం, గ్రామం పేరు ఎంపిక చేయండి.',
      'సర్వే నంబర్ లేదా ఖాతా నంబర్ నమోదు చేసి రికార్డును తక్షణమే డౌన్‌లోడ్ చేసుకోండి.'
    ],
    trackingInstructions: 'Real-time record retrieval directly from Andhra Pradesh Webland database.',
    teTrackingInstructions: 'వెబ్‌ల్యాండ్ డాటాబేస్ నుండి తక్షణమే ధృవీకరించిన వివరాలు లభిస్తాయి.',
    supportHelpline: '1902 (GSWS Helpline)'
  },
  {
    id: 'digilocker-services',
    name: 'DigiLocker (Digital Document Wallet for Official Credentials & Certificates)',
    teName: 'డిజిలాకర్ (అధికారిక సర్టిఫికెట్ల డిజిటల్ వాలెట్)',
    category: 'identity',
    govLevel: 'central',
    department: 'Ministry of Electronics and Information Technology (MeitY), Government of India',
    teDepartment: 'ఎలక్ట్రానిక్స్ & ఇన్ఫర్మేషన్ టెక్నాలజీ మంత్రిత్వ శాఖ, భారత ప్రభుత్వం',
    purpose: 'Government of India digital wallet that issues authentic digital documents (Aadhaar, Driving Licence, Class X/XII memos, Ration Card) directly legally valid under IT Act 2000.',
    tePurpose: 'ఆధార్, డ్రైవింగ్ లైసెన్స్, పదవ తరగతి మార్కుల మెమో, వాహన ఆర్సీ వంటి సర్టిఫికెట్లను డిజిటల్ రూపంలో చట్టబద్ధంగా దాచుకునే కేంద్ర ప్రభుత్వ సేవ.',
    officialInfoUrl: 'https://services.india.gov.in/service/detail/access-digilocker-services',
    officialApplicationUrl: 'https://www.digilocker.gov.in',
    officialPortal: 'https://www.digilocker.gov.in',
    status: 'VERIFIED',
    lastVerifiedDate: '2026-10-15',
    verificationSource: 'services.india.gov.in / DigiLocker National Portal',
    officialFee: '100% FREE',
    processingTime: 'Instant digital document issuance',
    eligibility: 'All Indian citizens having an Aadhaar number linked to mobile.',
    teEligibility: 'మొబైల్ నంబర్ లింక్ అయిన ఆధార్ కార్డు గల భారతీయ పౌరులందరూ అర్హులు.',
    requiredDocuments: [
      'Aadhaar Number and Mobile for OTP authentication'
    ],
    teRequiredDocuments: [
      'ఆధార్ నంబర్ మరియు ఓటీపీ కోసం రిజిస్టర్డ్ మొబైల్'
    ],
    steps: [
      'Sign up at digilocker.gov.in or download the DigiLocker app.',
      'Authenticate with Aadhaar and 6-digit security PIN.',
      'Search issuer (e.g., Andhra Pradesh Board of Intermediate, Transport Dept, UIDAI).',
      'Fetch your digitally signed credential into "Issued Documents".'
    ],
    teSteps: [
      'digilocker.gov.in లో లేదా యాప్‌లో ఆధార్ ద్వారా సైన్ అప్ చేయండి.',
      'ఆధార్ ఓటీపీ మరియు 6 అంకెల సెక్యూరిటీ పిన్ సెట్ చేయండి.',
      'సంబంధిత శాఖ (రవాణా, విద్యా లేదా పౌర సరఫరాలు) ఎంచుకుని సర్టిఫికెట్ డౌన్‌లోడ్ చేసుకోండి.'
    ],
    trackingInstructions: 'Documents once fetched are perpetually stored and automatically updated in cloud wallet.',
    teTrackingInstructions: 'సర్టిఫికెట్లు క్లౌడ్ వాలెట్‌లో సురక్షితంగా నిల్వ ఉంటాయి.',
    supportHelpline: 'support@digitallocker.gov.in'
  },
  {
    id: 'spandana-grievance-redressal',
    name: 'Spandana Citizen Grievance Redressal (1902 Toll-Free & Online Portal)',
    teName: 'స్పందన ప్రజా సమస్యల పరిష్కార వేదిక (1902 టోల్ ఫ్రీ & ఆన్‌లైన్ పోర్టల్)',
    category: 'grievances',
    govLevel: 'state',
    department: 'General Administration Department, Government of Andhra Pradesh',
    teDepartment: 'సాధారణ పరిపాలనా శాఖ, ఆంధ్రప్రదేశ్ ప్రభుత్వం',
    purpose: 'Chief Minister public grievance redressal portal allowing citizens to submit complaints regarding government services, welfare schemes, and public works with strict SLA tracking.',
    tePurpose: 'సంక్షేమ పథకాలు, సచివాలయ సేవలు, ప్రభుత్వ పనులపై ఫిర్యాదులను నమోదు చేసి నిర్దిష్ట గడువులో పరిష్కారం పొందే అధికారిక వ్యవస్థ.',
    officialInfoUrl: 'https://services.india.gov.in/service/detail/services-portal-of-andhra-pradesh-government',
    officialApplicationUrl: 'https://spandana.ap.gov.in',
    officialPortal: 'https://spandana.ap.gov.in',
    status: 'VERIFIED',
    lastVerifiedDate: '2026-10-15',
    verificationSource: 'services.india.gov.in / AP Spandana Portal',
    officialFee: '100% FREE',
    processingTime: '7 to 30 days depending on grievance category',
    eligibility: 'Any citizen of Andhra Pradesh having a complaint or query regarding government administration.',
    teEligibility: 'ప్రభుత్వ సేవలు లేదా పథకాలపై ఫిర్యాదు ఉన్న ఆంధ్రప్రదేశ్ రాష్ట్ర పౌరులందరూ.',
    requiredDocuments: [
      'Aadhaar Card',
      'Supporting photos, documents, or previous application receipts'
    ],
    teRequiredDocuments: [
      'ఆధార్ కార్డు',
      'సమస్యకు సంబంధించిన డాక్యుమెంట్లు లేదా పాత దరఖాస్తు రసీదులు'
    ],
    steps: [
      'Call toll-free 1902 from any mobile or landline, or visit spandana.ap.gov.in.',
      'Provide your Aadhaar number, contact details, and precise details of grievance.',
      'Receive SMS with unique Grievance ID and assigned officer contact.',
      'Grievance is resolved within the mandated Citizen Charter timeline.'
    ],
    teSteps: [
      '1902 టోల్ ఫ్రీ నంబర్‌కు కాల్ చేయండి లేదా spandana.ap.gov.in సందర్శించండి.',
      'ఆధార్ నంబర్ మరియు సమస్య వివరాలను తెలియజేయండి.',
      'ఎస్ఎంఎస్ ద్వారా వచ్చే గ్రీవెన్స్ ఐడీతో పరిష్కారాన్ని ట్రాక్ చేయండి.'
    ],
    trackingInstructions: 'Track status via spandana.ap.gov.in using Grievance ID or mobile number.',
    teTrackingInstructions: 'గ్రీవెన్స్ నంబర్ లేదా మొబైల్ నంబర్ ద్వారా పోర్టల్‌లో స్థితిని తెలుసుకోవచ్చు.',
    supportHelpline: '1902 (Toll-Free 24x7 Grievance Helpline)'
  },
  {
    id: 'pm-kisan-portal-services',
    name: 'PM-KISAN Farmer Samman Nidhi & e-KYC Portal',
    teName: 'పీఎం కిసాన్ సమ్మాన్ నిధి & ఈ-కేవైసీ పోర్టల్',
    category: 'agriculture',
    govLevel: 'central',
    department: 'Ministry of Agriculture and Farmers Welfare, Government of India',
    teDepartment: 'వ్యవసాయ మరియు రైతు సంక్షేమ మంత్రిత్వ శాఖ, భారత ప్రభుత్వం',
    purpose: 'Direct income support of Rs. 6,000 per year in three equal installments to all cultivable landholding farmer families across India.',
    tePurpose: 'దేశంలోని రైతులందరికీ ఏటా రూ. 6,000 ఆర్థిక సాయాన్ని నేరుగా బ్యాంక్ ఖాతాల్లో జమ చేసే కేంద్ర ప్రభుత్వ పథకం.',
    officialInfoUrl: 'https://services.india.gov.in/service/detail/pm-kisan-portal',
    officialApplicationUrl: 'https://pmkisan.gov.in',
    officialPortal: 'https://pmkisan.gov.in',
    status: 'VERIFIED',
    lastVerifiedDate: '2026-10-15',
    verificationSource: 'services.india.gov.in / Ministry of Agriculture Portal',
    officialFee: 'Online Portal / e-KYC: FREE; CSC / Secretariat Operator charge: Rs. 15',
    processingTime: 'Next installment DBT cycle following district approval',
    eligibility: 'Farmer families owning cultivable land in their names (subject to exclusion criteria for high income / institutional landholders).',
    teEligibility: 'తమ పేరున సాగు భూమి ఉన్న రైతు కుటుంబాలందరూ అర్హులు (ఉద్యోగులు, పన్ను చెల్లింపుదారులు మినహా).',
    requiredDocuments: [
      'Aadhaar Card linked to Mobile and Bank Account (DBT enabled)',
      'Landholding Pattadar Passbook / RoR 1-B / Adangal copy',
      'Active Bank Account Passbook'
    ],
    teRequiredDocuments: [
      'ఆధార్ కార్డు (బ్యాంక్ ఖాతాకు డీబీటీ లింక్ అయి ఉండాలి)',
      'పట్టాదారు పాస్‌బుక్ / అడంగల్ / 1-బి కాపీ',
      'బ్యాంక్ పాస్‌బుక్'
    ],
    steps: [
      'Visit pmkisan.gov.in -> Farmers Corner -> New Farmer Registration.',
      'Enter Aadhaar number and mobile number, select State as Andhra Pradesh.',
      'Enter land details (Survey No, Khata No, Land Extent).',
      'Complete mandatory Aadhaar OTP e-KYC on the portal.'
    ],
    teSteps: [
      'pmkisan.gov.in లో న్యూ ఫార్మర్ రిజిస్ట్రేషన్ ఎంచుకోండి.',
      'ఆధార్ మరియు మొబైల్ నంబర్ నమోదు చేసి ఓటీపీతో ధృవీకరించండి.',
      'భూమి వివరాలు (సర్వే నంబర్, ఖాతా నంబర్) నమోదు చేయండి.',
      'పోర్టల్‌లో తప్పనిసరిగా ఆధార్ ఈ-కేవైసీ పూర్తి చేయండి.'
    ],
    trackingInstructions: 'Check beneficiary status at pmkisan.gov.in -> Beneficiary Status using Registration Number.',
    teTrackingInstructions: 'రిజిస్ట్రేషన్ నంబర్ లేదా మొబైల్ నంబర్ ద్వారా బెనిఫిషియరీ స్టేటస్ చెక్ చేయండి.',
    supportHelpline: '155261 / 1800-115-526 (PM-KISAN Helpline)'
  },
  {
    id: 'birth-death-registration-ap',
    name: 'Birth & Death Certificate (Civil Registration System / Grama Sachivalayam)',
    teName: 'జనన & మరణ ధృవీకరణ పత్రాలు (సివిల్ రిజిస్ట్రేషన్ సర్టిఫికెట్లు)',
    category: 'certificates',
    govLevel: 'state',
    department: 'Directorate of Public Health & Municipal Administration / Panchayat Raj, Govt of AP',
    teDepartment: 'పబ్లిక్ హెల్త్ మరియు పంచాయతీ రాజ్ శాఖ, ఆంధ్రప్రదేశ్ ప్రభుత్వం',
    purpose: 'Mandatory statutory vital records proving birth date, parentage, legal succession, insurance settlement, and family tree verification.',
    tePurpose: 'పాఠశాల ప్రవేశాలు, పాస్‌పోర్ట్, ఇన్సూరెన్స్ క్లెయిమ్‌లు మరియు చట్టపరమైన వారసత్వానికి అత్యవసరమైన జనన మరియు మరణ ధృవీకరణ పత్రాలు.',
    officialInfoUrl: 'https://services.india.gov.in/service/detail/apply-online-for-birth-certificate-in-andhra-pradesh',
    officialApplicationUrl: 'https://gramawardsachivalayam.ap.gov.in',
    officialPortal: 'https://gramawardsachivalayam.ap.gov.in',
    status: 'VERIFIED',
    lastVerifiedDate: '2026-10-15',
    verificationSource: 'services.india.gov.in / AP GSWS Citizen Charter',
    officialFee: 'Within 21 days: FREE; After 21 to 30 days: Rs. 2; After 30 days to 1 year: Rs. 5; Secretariat user fee: Rs. 35',
    processingTime: '3 to 7 working days for registered events',
    eligibility: 'Any birth or death occurrence occurring within Andhra Pradesh jurisdiction.',
    teEligibility: 'ఆంధ్రప్రదేశ్ పరిధిలో జరిగిన జనన లేదా మరణ సంఘటనలకు సంబంధించిన కుటుంబ సభ్యులు.',
    requiredDocuments: [
      'Hospital Discharge Summary / Birth Report Form',
      'Parents Aadhaar Cards',
      'For Death Certificate: Medical Death Certificate / Cremation Receipt / Doctor Memo'
    ],
    teRequiredDocuments: [
      'ఆసుపత్రి డిశ్చార్జ్ సమ్మరీ లేదా బర్త్ రిపోర్ట్',
      'తల్లిదండ్రుల ఆధార్ కార్డులు',
      'మరణ ధృవీకరణ కోసం: వైద్య నివేదిక లేదా శ్మశాన రసీదు'
    ],
    steps: [
      'Hospital automatically registers event within 21 days on CRS portal.',
      'Citizen approaches Village/Ward Secretariat with hospital reference.',
      'Panchayat Secretary or Municipal Health Officer approves digital copy.',
      'Citizen receives digitally signed QR-coded certificate.'
    ],
    teSteps: [
      'ఆసుపత్రి రిపోర్ట్ ఆధారంగా గ్రామ/వార్డు సచివాలయంలో దరఖాస్తు చేయండి.',
      'పంచాయతీ కార్యదర్శి పరిశీలించి డిజిటల్ సంతకంతో పత్రం జారీ చేస్తారు.',
      'క్యూఆర్ కోడ్ గల ఒరిజినల్ సర్టిఫికెట్ సచివాలయం నుండి పొందవచ్చు.'
    ],
    trackingInstructions: 'Track with Service Request Number on GSWS or Spandana portal.',
    teTrackingInstructions: 'సర్వీస్ రిక్వెస్ట్ నంబర్ ద్వారా సచివాలయ పోర్టల్‌లో ట్రాక్ చేయండి.',
    supportHelpline: '1902'
  },
  {
    id: 'apspeedcl-electricity-services',
    name: 'AP Electricity Services (New Connection, LT Category Change & Bill Payment)',
    teName: 'విద్యుత్ సేవలు (కొత్త కనెక్షన్, కేటగిరీ మార్పు మరియు బిల్లు చెల్లింపు)',
    category: 'utilities',
    govLevel: 'state',
    department: 'Energy Department, Government of Andhra Pradesh (APCPDCL / APSPDCL / APEPDCL)',
    teDepartment: 'ఇంధన మరియు విద్యుత్ శాఖ, ఆంధ్రప్రదేశ్ ప్రభుత్వం',
    purpose: 'Apply for residential/agricultural electricity connections, load enhancement, ownership name transfer, and online tariff payments.',
    tePurpose: 'గృహ మరియు వ్యవసాయ విద్యుత్ కనెక్షన్లు, మీటర్ మార్పిడి, పేరు మార్పు మరియు ఆన్‌లైన్ బిల్లుల చెల్లింపు.',
    officialInfoUrl: 'https://services.india.gov.in/service/detail/pay-electricity-bill-online-in-andhra-pradesh',
    officialApplicationUrl: 'https://www.apspdcl.in',
    officialPortal: 'https://www.apspdcl.in',
    status: 'VERIFIED',
    lastVerifiedDate: '2026-10-15',
    verificationSource: 'services.india.gov.in / AP Power Distribution Corporations',
    officialFee: 'Statutory Development & Security Deposit based on sanctioned load; Application processing: Rs. 25 - Rs. 50',
    processingTime: '7 days for LT domestic connection within 30 meters of existing line',
    eligibility: 'Property owners, tenants with NOC, or registered agricultural landholders in AP.',
    teEligibility: 'ఆంధ్రప్రదేశ్‌లోని గృహ యజమానులు, అద్దెదారులు మరియు వ్యవసాయదారులు.',
    requiredDocuments: [
      'Aadhaar Card of Applicant',
      'Ownership document (Registered Sale Deed / Property Tax Receipt / RoR 1-B for agriculture)',
      'Passport size photograph'
    ],
    teRequiredDocuments: [
      'దరఖాస్తుదారు ఆధార్ కార్డు',
      'ఇంటి రిజిస్ట్రేషన్ పత్రం లేదా ఆస్తి పన్ను రసీదు (రైతులకైతే పట్టాదారు పాస్‌బుక్)',
      'పాస్‌పోర్ట్ సైజు ఫోటో'
    ],
    steps: [
      'Visit DISCOM portal (apspdcl.in / apepdcl.in / apcpdcl.in) or visit Grama Sachivalayam Energy Assistant.',
      'Submit LT New Connection application with property proof.',
      'Lineman / AE conducts site inspection within 48 hours.',
      'Pay prescribed deposit fee online or at Secretariat.',
      'Meter installation and power connection completed.'
    ],
    teSteps: [
      'విద్యుత్ సంస్థ వెబ్‌సైట్‌లో లేదా సచివాలయంలో ఎనర్జీ అసిస్టెంట్ వద్ద దరఖాస్తు చేయండి.',
      'లైన్‌మెన్ / ఏఈ సైట్ తనిఖీ చేస్తారు.',
      'అవసరమైన డిపాజిట్ రుసుము చెల్లించండి.',
      'వారంలోపు మీటర్ ఏర్పాటు చేసి విద్యుత్ సరఫరా ప్రారంభిస్తారు.'
    ],
    trackingInstructions: 'Track connection request using Registration ID on the respective DISCOM portal.',
    teTrackingInstructions: 'డిస్కం వెబ్‌సైట్‌లో రిజిస్ట్రేషన్ ఐడీతో దరఖాస్తు స్థితిని తెలుసుకోవచ్చు.',
    supportHelpline: '1912 (24x7 Power Grievance Toll-Free)'
  },
  {
    id: 'national-scholarship-portal',
    name: 'National Scholarship Portal (Pre-Matric, Post-Matric & Merit-cum-Means)',
    teName: 'జాతీయ ఉపకార వేతన పోర్టల్ (ఎన్‌ఎస్‌పీ స్కాలర్‌షిప్‌లు)',
    category: 'education',
    govLevel: 'central',
    department: 'Ministry of Electronics and Information Technology & Ministry of Social Justice, Govt of India',
    teDepartment: 'ఎలక్ట్రానిక్స్ & ఇన్ఫర్మేషన్ టెక్నాలజీ మరియు సాంఘిక న్యాయ మంత్రిత్వ శాఖ, భారత ప్రభుత్వం',
    purpose: 'Centralized national platform for government scholarships for minority, SC/ST, disabled, and economically backward students across India.',
    tePurpose: 'మైనారిటీ, ఎస్సీ, ఎస్టీ, వికలాంగ మరియు ఆర్థికంగా వెనుకబడిన విద్యార్థులకు కేంద్ర ప్రభుత్వ ఉపకార వేతనాలు.',
    officialInfoUrl: 'https://services.india.gov.in/service/detail/national-scholarship-portal',
    officialApplicationUrl: 'https://scholarships.gov.in',
    officialPortal: 'https://scholarships.gov.in',
    status: 'VERIFIED',
    lastVerifiedDate: '2026-10-15',
    verificationSource: 'services.india.gov.in / National Scholarship Portal',
    officialFee: '100% FREE',
    processingTime: 'Direct Benefit Transfer (DBT) during academic disbursement cycle',
    eligibility: 'Regular students enrolled in recognized schools, colleges, or universities fulfilling annual family income caps (under Rs. 2 - 2.5 Lakhs).',
    teEligibility: 'గుర్తింపు పొందిన పాఠశాలలు, కళాశాలల్లో చదువుతూ నిర్దేశిత వార్షిక ఆదాయ పరిమితి లోపు ఉన్న విద్యార్థులు.',
    requiredDocuments: [
      'Student Aadhaar Card (linked to DBT bank account)',
      'Previous Academic Marksheet / Grade Card',
      'Current Academic Bonafide Certificate / Fee Receipt',
      'Income Certificate and Caste/Community Certificate',
      'Bank Passbook Copy'
    ],
    teRequiredDocuments: [
      'విద్యార్థి ఆధార్ కార్డు (బ్యాంక్ ఖాతాకు లింక్ అయి ఉండాలి)',
      'మునుపటి తరగతి మార్కుల జాబితా',
      'ప్రస్తుత విద్యా సంవత్సరం బోనఫైడ్ సర్టిఫికెట్',
      'ఆదాయ మరియు కుల ధృవీకరణ పత్రాలు',
      'బ్యాంక్ పాస్‌బుక్'
    ],
    steps: [
      'Register with Aadhaar / OTR (One Time Registration) on scholarships.gov.in.',
      'Fill academic details and select matching central schemes.',
      'Upload supporting documents and submit to school/college nodal officer.',
      'Institution and State Nodal Officer verify credentials online.',
      'Scholarship amount credited directly to bank account via DBT.'
    ],
    teSteps: [
      'scholarships.gov.in లో వన్ టైమ్ రిజిస్ట్రేషన్ (OTR) పూర్తి చేయండి.',
      'విద్యా వివరాలు నమోదు చేసి తగిన స్కీమ్‌ను ఎంచుకోండి.',
      'డాక్యుమెంట్లు అప్‌లోడ్ చేసి కళాశాల నోడల్ అధికారికి సమర్పించండి.',
      'పరిశీలన అనంతరం ఉపకార వేతనం నేరుగా విద్యార్థి బ్యాంక్ ఖాతాలో జమ అవుతుంది.'
    ],
    trackingInstructions: 'Track application on scholarships.gov.in using Application ID and Date of Birth.',
    teTrackingInstructions: 'అప్లికేషన్ ఐడీ మరియు పుట్టిన తేదీతో పోర్టల్‌లో ట్రాక్ చేయవచ్చు.',
    supportHelpline: '0120-6619540 / helpdesk@nsp.gov.in'
  },
  {
    id: 'ayushman-bharat-abha',
    name: 'Ayushman Bharat Health Account (ABHA / Digital Health ID Card)',
    teName: 'ఆయుష్మాన్ భారత్ హెల్త్ అకౌంట్ (ఆభా / డిజిటల్ హెల్త్ ఐడీ)',
    category: 'healthcare',
    govLevel: 'central',
    department: 'National Health Authority (NHA), Ministry of Health and Family Welfare',
    teDepartment: 'జాతీయ ఆరోగ్య ప్రాధికార సంస్థ (NHA), ఆరోగ్య మంత్రిత్వ శాఖ, భారత ప్రభుత్వం',
    purpose: '14-digit unique national health identification enabling digital storage of lab tests, prescriptions, and medical histories seamlessly across hospitals.',
    tePurpose: 'దేశవ్యాప్తంగా ఆసుపత్రుల్లో చికిత్సలు, పరీక్షలు మరియు మందుల వివరాలను సురక్షితంగా ఒకే డిజిటల్ హెల్త్ కార్డులో దాచుకునే సౌకర్యం.',
    officialInfoUrl: 'https://services.india.gov.in/service/detail/create-ayushman-bharat-health-account-abha-id',
    officialApplicationUrl: 'https://abha.abdm.gov.in',
    officialPortal: 'https://abha.abdm.gov.in',
    status: 'VERIFIED',
    lastVerifiedDate: '2026-10-15',
    verificationSource: 'services.india.gov.in / National Health Authority Portal',
    officialFee: '100% FREE',
    processingTime: 'Instant 2-minute creation and digital download',
    eligibility: 'All citizens of India possessing Aadhaar or mobile number.',
    teEligibility: 'ఆధార్ లేదా మొబైల్ నంబర్ ఉన్న భారతీయ పౌరులందరూ ఈ డిజిటల్ హెల్త్ కార్డును ఉచితంగా పొందవచ్చు.',
    requiredDocuments: [
      'Aadhaar Number or Mobile Number'
    ],
    teRequiredDocuments: [
      'ఆధార్ నంబర్ లేదా మొబైల్ నంబర్'
    ],
    steps: [
      'Visit abha.abdm.gov.in -> Click "Create ABHA Number".',
      'Enter Aadhaar Number and authenticate via OTP.',
      'Confirm personal profile and choose your unique ABHA address (e.g. name@abdm).',
      'Instantly download laminated-ready QR-coded ABHA card.'
    ],
    teSteps: [
      'abha.abdm.gov.in వెబ్‌సైట్‌లో "Create ABHA Number" ఎంచుకోండి.',
      'ఆధార్ నంబర్ నమోదు చేసి ఓటీపీతో ధృవీకరించండి.',
      'మీ ABHA చిరునామా ఎంపిక చేసుకుని వెంటనే కార్డును డౌన్‌లోడ్ చేసుకోండి.'
    ],
    trackingInstructions: 'ABHA number is active immediately upon OTP confirmation.',
    teTrackingInstructions: 'ఓటీపీ నిర్ధారణ కాగానే కార్డు తక్షణమే యాక్టివేట్ అవుతుంది.',
    supportHelpline: '1800-11-4477 / 14477'
  },
  {
    id: 'udyam-msme-registration',
    name: 'Udyam MSME Registration (Micro, Small & Medium Enterprises)',
    teName: 'ఉద్యమ్ ఎంఎస్ఎంఈ రిజిస్ట్రేషన్ (సూక్ష్మ, చిన్న & మధ్య తరహా పరిశ్రమలు)',
    category: 'business',
    govLevel: 'central',
    department: 'Ministry of Micro, Small and Medium Enterprises, Government of India',
    teDepartment: 'ఎంఎస్ఎంఈ మంత్రిత్వ శాఖ, భారత ప్రభుత్వం',
    purpose: 'Zero-cost government registration for small businesses, shops, and cottage industries unlocking collateral-free loans, subsidies, and tender protections.',
    tePurpose: 'చిన్న వ్యాపారులు, దుకాణాలు, కుటీర పరిశ్రమలకు బ్యాంకు రుణాలు, ప్రభుత్వ సబ్సిడీలు మరియు ప్రాధాన్యత కల్పించే కేంద్ర ప్రభుత్వ గుర్తింపు.',
    officialInfoUrl: 'https://services.india.gov.in/service/detail/online-registration-for-msme-in-andhra-pradesh',
    officialApplicationUrl: 'https://udyamregistration.gov.in',
    officialPortal: 'https://udyamregistration.gov.in',
    status: 'VERIFIED',
    lastVerifiedDate: '2026-10-15',
    verificationSource: 'services.india.gov.in / Ministry of MSME Udyam Portal',
    officialFee: '100% FREE (Beware of fraudulent private portals charging fees)',
    processingTime: 'Instant registration number; e-Certificate generated within 2-3 days',
    eligibility: 'Proprietorships, partnerships, self-help groups, and enterprises engaged in manufacture or service activities in India.',
    teEligibility: 'భారతదేశంలో వ్యాపారం, తయారీ లేదా సేవా రంగాలు నిర్వహిస్తున్న ఏ చిన్న వ్యాపారైనా అర్హులు.',
    requiredDocuments: [
      'Proprietor / Managing Partner Aadhaar Card',
      'PAN Card of Business / Proprietor',
      'Bank Account Number and IFSC Code',
      'Business address and electricity bill of premises'
    ],
    teRequiredDocuments: [
      'వ్యాపార యజమాని ఆధార్ కార్డు',
      'పాన్ కార్డు',
      'బ్యాంక్ ఖాతా వివరాలు మరియు ఐఎఫ్‌ఎస్‌సీ కోడ్',
      'వ్యాపార చిరునామా పత్రం'
    ],
    steps: [
      'Visit official portal udyamregistration.gov.in (Only authentic free portal).',
      'Click "For New Entrepreneurs who are not Registered yet as MSME".',
      'Enter Aadhaar number of entrepreneur and validate with OTP.',
      'Fill enterprise details, investment in plant & machinery, and turnover.',
      'Submit and download Udyam Registration Certificate with permanent QR code.'
    ],
    teSteps: [
      'అధికారిక udyamregistration.gov.in వెబ్‌సైట్‌కు వెళ్లండి (ఇది పూర్తిగా ఉచితం).',
      'యజమాని ఆధార్ నంబర్ నమోదు చేసి ఓటీపీతో ధృవీకరించండి.',
      'వ్యాపార వివరాలు, పెట్టుబడి మరియు వార్షిక టర్నోవర్ నమోదు చేయండి.',
      'పూర్తయిన తర్వాత క్యూఆర్ కోడ్‌తో కూడిన ఉద్యమ్ సర్టిఫికెట్ డౌన్‌లోడ్ చేసుకోండి.'
    ],
    trackingInstructions: 'Track status or print certificate on udyamregistration.gov.in using Udyam Registration Number.',
    teTrackingInstructions: 'ఉద్యమ్ నంబర్ ద్వారా వెబ్‌సైట్‌లో ఎప్పుడైనా సర్టిఫికెట్ ప్రింట్ తీసుకోవచ్చు.',
    supportHelpline: '011-23063288 / champions@gov.in'
  }
];
