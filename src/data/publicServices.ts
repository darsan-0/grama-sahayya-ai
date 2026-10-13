import { PublicService } from '../types';

export const VERIFIED_PUBLIC_SERVICES: PublicService[] = [
  {
    id: 'aadhaar-services',
    name: 'Aadhaar Services (Enrolment, Address Update, PVC Card & Biometrics)',
    teName: 'ఆధార్ సేవలు (కొత్త నమోదు, చిరునామా మార్పు, పీవీసీ కార్డు)',
    category: 'identity',
    purpose: '12-digit unique identity number issued by UIDAI, mandatory for accessing government subsidies, scholarships, and DBT welfare schemes.',
    tePurpose: 'ప్రభుత్వ సంక్షేమ పథకాలు, స్కాలర్‌షిప్‌లు, బ్యాంక్ ఖాతాలు మరియు సబ్సిడీల కోసం తప్పనిసరి అయిన విశిష్ట గుర్తింపు సంఖ్య.',
    officialPortal: 'https://myaadhaar.uidai.gov.in',
    officialFee: 'New Enrolment: FREE; Mandatory Biometric (5 & 15 yrs): FREE; Demographic Update: Rs. 50; Biometric Update: Rs. 100; Order PVC Card: Rs. 50',
    processingTime: '5 to 15 working days',
    eligibility: 'All residents of India (including infants and newborns).',
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
    purpose: '10-digit alphanumeric identifier issued by the Income Tax Department for financial transactions, opening bank accounts, and employment.',
    tePurpose: 'బ్యాంక్ ఖాతాలు తెరవడం, ఉపకార వేతనాలు, వ్యాపార లావాదేవీలు మరియు ఆదాయ పన్ను నిమిత్తం తప్పనిసరి గుర్తింపు కార్డు.',
    officialPortal: 'https://www.onlineservices.nsdl.com / https://eportal.incometax.gov.in',
    officialFee: 'Instant e-PAN via Income Tax Portal: 100% FREE; Physical PAN Card via NSDL/UTIITSL: Rs. 107 (within India)',
    processingTime: 'Instant e-PAN: 10 minutes; Physical Card: 10 to 15 days by speed post',
    eligibility: 'Any individual residing in India. For Instant e-PAN, Aadhaar must be linked to active mobile.',
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
    category: 'revenue_certificates',
    purpose: 'Official legal proof of community and social category (SC/ST/BC/OBC/OC) required for reservation in education, jobs, and government welfare schemes.',
    tePurpose: 'విద్యా సంస్థల్లో అడ్మిషన్లు, ఫీజు రీయింబర్స్‌మెంట్, ఉద్యోగ రిజర్వేషన్లు మరియు ప్రభుత్వ పథకాలకు తప్పనిసరి.',
    officialPortal: 'https://gramawardsachivalayam.ap.gov.in / Meeseva',
    officialFee: 'Official Secretariat / Meeseva User Charge: Rs. 35',
    processingTime: '7 to 15 working days (Tahsildar Digital Signature)',
    eligibility: 'Citizens belonging to notified communities residing in Andhra Pradesh.',
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
    category: 'revenue_certificates',
    purpose: 'Certifies annual household earnings from all sources, essential for fee reimbursement, scholarships, and free medical care.',
    tePurpose: 'విద్యా దీవెన, ఆరోగ్యశ్రీ మరియు ఇతర సంక్షేమ పథకాలకు కుటుంబ వార్షిక ఆదాయాన్ని నిరూపించే పత్రం.',
    officialPortal: 'https://gramawardsachivalayam.ap.gov.in / Meeseva',
    officialFee: 'Rs. 35 (Statutory User Charge)',
    processingTime: '3 to 7 working days',
    eligibility: 'Residents of Andhra Pradesh requiring income certification for public benefits.',
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
    name: 'AP Rice Card (New Card, Splitting, Addition of Family Members & e-KYC)',
    teName: 'రైస్ కార్డు సేవలు (కొత్త కార్డు, సభ్యుల చేర్పు, విభజన, ఈ-కేవైసీ)',
    category: 'welfare_cards',
    purpose: 'Enables access to subsidized PDS food grains, Aarogyasri medical coverage, and serves as primary proof of economic eligibility for all AP state schemes.',
    tePurpose: 'ప్రజా పంపిణీ వ్యవస్థ (PDS) ద్వారా రేషన్ బియ్యం, ఆరోగ్యశ్రీ ఉచిత వైద్యం మరియు రాష్ట్ర సంక్షేమ పథకాలకు ప్రాథమిక అర్హత కార్డు.',
    officialPortal: 'https://epos.ap.gov.in / Grama Ward Sachivalayam',
    officialFee: 'FREE of charge',
    processingTime: '21 days under Citizen Charter',
    eligibility: 'Families with total monthly income below Rs. 10,000 (Rural) / Rs. 12,000 (Urban), land below 3 acres wetland / 10 acres dry land, no 4-wheelers.',
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
    purpose: 'Electoral Photo Identity Card (EPIC) issued by Election Commission of India granting constitutional right to vote and serving as valid national identity proof.',
    tePurpose: 'భారత ఎన్నికల సంఘం జారీ చేసే ఓటరు గుర్తింపు కార్డు. ఓటు హక్కుతో పాటు అధికారిక గుర్తింపు పత్రం.',
    officialPortal: 'https://voters.eci.gov.in',
    officialFee: '100% FREE',
    processingTime: '15 to 30 days',
    eligibility: 'Indian citizens who have attained 18 years of age on qualifying dates (Jan 1, Apr 1, Jul 1, Oct 1).',
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
    purpose: 'Legal authorization to drive motor vehicles on Indian roads issued by Ministry of Road Transport and Highways.',
    tePurpose: 'ద్విచక్ర మరియు నాలుగు చక్రాల వాహనాలు నడపడానికి ప్రభుత్వం జారీ చేసే అధికారిక డ్రైవింగ్ లైసెన్స్.',
    officialPortal: 'https://sarathi.parivahan.gov.in',
    officialFee: 'LLR: Rs. 150 per class of vehicle + Rs. 50 test fee; Permanent DL: Rs. 200 + Rs. 300 driving test fee',
    processingTime: 'LLR: Same day (Online test); Permanent DL: 7 days after driving test',
    eligibility: 'Age 16+ for gearless 50cc two-wheeler; Age 18+ for geared motor vehicle/car.',
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
    purpose: 'Certified digital land revenue records in Andhra Pradesh necessary for Rythu Bharosa, crop loans, PM-KISAN, and legal land transactions.',
    tePurpose: 'రైతు భరోసా, పంట రుణాలు, పీఎం కిసాన్ మరియు భూ లావాదేవీలకు అవసరమైన అధికారిక అడంగల్ మరియు 1-బి నమూనా పత్రాలు.',
    officialPortal: 'https://meebhoomi.ap.gov.in',
    officialFee: 'Online View / Download: 100% FREE; Digitally Signed Certified Copy at Secretariat: Rs. 35',
    processingTime: 'Instant online download',
    eligibility: 'Any landholder, farmer, or interested citizen in Andhra Pradesh.',
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
  }
];
