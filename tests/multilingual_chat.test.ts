import { detectMessageLanguage } from '../src/utils/languageDetector.ts';
import { VERIFIED_SCHEMES } from '../src/data/schemes.ts';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`);
    failed++;
  }
}

console.log('--- RUNNING GRAMA SAHAYYA AI: MULTILINGUAL CHAT & LANGUAGE DETECTION TEST SUITE ---\n');

// 1. English Prompt Detection Tests
const englishQueries = [
  'How to apply for Jagananna Vidya Deevena?',
  'What is the income limit for Rythu Bharosa?',
  'Where can I apply for post matric scholarship online?',
  'Tell me about PM Awas Yojana Gramin housing assistance.',
  'What documents are required for instant e-PAN card?',
  'Is attendance mandatory for fee reimbursement?'
];

for (const q of englishQueries) {
  const res = detectMessageLanguage(q);
  assert(res.detectedLang === 'en' && res.languageCode === 'en' && !res.isMixed, `English query detected correctly: "${q}"`);
}

// 2. Native Telugu Script Detection Tests
const teluguQueries = [
  'జగనన్న విద్యా దీవెన అర్హతలు ఏమిటి?',
  'రైతు భరోసా ఎలా వస్తుంది?',
  'వైఎస్సార్ పింఛన్ కానుక కోసం ఏ పత్రాలు కావాలి?',
  'ఆరోగ్యశ్రీ ద్వారా ఎంత వరకు ఉచిత వైద్యం లభిస్తుంది?',
  'గ్రామ సచివాలయంలో దరఖాస్తు చేసుకోవడం ఎలా?'
];

for (const q of teluguQueries) {
  const res = detectMessageLanguage(q);
  assert(res.detectedLang === 'te' && res.languageCode === 'te', `Native Telugu query detected correctly: "${q}"`);
}

// 3. Mixed Telugu Script + English Words Detection Tests
const mixedScriptQueries = [
  'జగనన్న విద్యా దీవెన application process cheppandi',
  'రైతు భరోసా eligibility criteria ఏమిటి?',
  'Aadhaar card update cheyadam ఎలా?'
];

for (const q of mixedScriptQueries) {
  const res = detectMessageLanguage(q);
  assert(res.isMixed && (res.detectedLang === 'te-mixed' || res.detectedLang === 'te'), `Mixed script query detected as mixed: "${q}"`);
}

// 4. Romanized / Transliterated Telugu & Mixed-Language Detection Tests
const transliteratedQueries = [
  { query: 'Vidya Deevena ki ela apply cheyali?', expectedLang: 'te-mixed' },
  { query: 'Rythu Bharosa application documents emiti?', expectedLang: 'te-mixed' },
  { query: 'Family income limit entha undali?', expectedLang: 'te-mixed' },
  { query: 'Nenu diploma student ni, scholarship vasthunda?', expectedLang: 'te-mixed' },
  { query: 'YSR pension kanuka eppudu paduthundi?', expectedLang: 'te-mixed' },
  { query: 'Aadhaar update kosam sachivalayam ki vellala?', expectedLang: 'te-mixed' },
  { query: 'Meeseva lo apply cheyavacha?', expectedLang: 'te-mixed' }
];

for (const { query, expectedLang } of transliteratedQueries) {
  const res = detectMessageLanguage(query);
  assert(res.detectedLang === expectedLang && res.isMixed, `Romanized Telugu query detected as mixed: "${query}"`);
}

// 5. Dynamic Multi-Turn Language Switching (Follow-Up Language Independence)
// Simulating a conversation where the citizen switches languages between turns:
const conversationSequence = [
  { turn: 1, msg: 'What is Jagananna Vidya Deevena?', expectedLang: 'en' },
  { turn: 2, msg: 'దీనికి కావలసిన పత్రాలు ఏమిటి?', expectedLang: 'te' },
  { turn: 3, msg: 'College attendance entha undali?', expectedLang: 'te-mixed' },
  { turn: 4, msg: 'Where should I submit the application form?', expectedLang: 'en' },
  { turn: 5, msg: 'ధన్యవాదాలు, చాలా సహాయపడింది', expectedLang: 'te' }
];

for (const step of conversationSequence) {
  const res = detectMessageLanguage(step.msg);
  assert(
    res.detectedLang === step.expectedLang,
    `Turn ${step.turn} switches dynamically to "${step.expectedLang}" regardless of previous turns`
  );
}

// 6. Preservation of Official Names, Departments, and URLs in Responses
const vidyaDeevena = VERIFIED_SCHEMES.find(s => s.id === 'jagananna-vidya-deevena')!;
assert(Boolean(vidyaDeevena.officialName && vidyaDeevena.officialName.includes('Vidya Deevena')), 'Official name preserved intact');
assert(Boolean(vidyaDeevena.teName && vidyaDeevena.teName.includes('విద్యా దీవెన')), 'Telugu name preserved intact');
assert(Boolean(vidyaDeevena.officialApplicationUrl && vidyaDeevena.officialApplicationUrl.startsWith('https://')), 'Official application URL starts with secure https');
assert(vidyaDeevena.officialApplicationUrl === 'https://jnanabhumi.ap.gov.in', 'Official application URL is unaltered');
assert(Boolean(vidyaDeevena.department && vidyaDeevena.department.includes('Social Welfare')), 'Department name is unaltered');
assert(Boolean(vidyaDeevena.verifiedHelpline && vidyaDeevena.verifiedHelpline.includes('1902')), 'Verified official AP helpline 1902 is preserved');

// 7. Verify Accuracy of Eligibility Facts
assert(vidyaDeevena.eligibilityCriteria.maxAnnualIncome === 250000, 'Income limit for Vidya Deevena is accurately Rs 2.50 Lakhs');
assert(vidyaDeevena.eligibilityCriteria.additionalRules.some(r => r.includes('75%')), 'Minimum 75% attendance criterion is verified');

console.log(`\n--- TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ---`);

if (failed > 0) {
  process.exit(1);
}
