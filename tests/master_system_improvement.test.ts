import { searchSchemes } from '../src/utils/schemeSearch.ts';
import { classifyCitizenIntent, generateGroundedResponse, preCheckQueryAnswerability } from '../src/utils/intentClassifier.ts';

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

console.log('--- RUNNING GRAMA SAHAYYA AI: MASTER SYSTEM IMPROVEMENT TEST SUITE ---\n');

// ==========================================
// 1. SCHEME SEARCH FUNCTIONALITY TESTS
// ==========================================
console.log('--- 1. Scheme Search Functionality Tests ---');

// Test 1: "Rythu" returns farmer schemes
const rythuRes = searchSchemes('Rythu');
assert(
  rythuRes.schemes.length > 0 &&
  rythuRes.schemes.some(s => s.id === 'annadata-sukhibhava-ap' || s.category === 'agriculture'),
  '1. "Rythu" returns verified farmer schemes (Annadata Sukhibhava & PM-KISAN)'
);

// Test 2: "rythu" (lowercase) returns identical results
const rythuLowerRes = searchSchemes('rythu');
assert(
  rythuLowerRes.schemes.length === rythuRes.schemes.length &&
  rythuLowerRes.schemes[0].id === rythuRes.schemes[0].id,
  '2. "rythu" case-insensitive search returns identical results'
);

// Test 3: "Rythu Bharosa" returns active farmer scheme with transition awareness
const rythuBharosaRes = searchSchemes('Rythu Bharosa');
assert(
  rythuBharosaRes.schemes.length > 0 &&
  rythuBharosaRes.schemes.some(s => s.id === 'annadata-sukhibhava-ap'),
  '3. "Rythu Bharosa" returns active matching farmer scheme with transition notice'
);

// Test 4: "Farmer" returns farmer-related schemes in English
const farmerRes = searchSchemes('Farmer');
assert(
  farmerRes.schemes.length > 0 && farmerRes.schemes[0].category === 'agriculture',
  '4. "Farmer" returns agriculture / farmer schemes'
);

// Test 5: "Pension" returns verified pension schemes
const pensionRes = searchSchemes('Pension');
assert(
  pensionRes.schemes.length > 0 &&
  pensionRes.schemes.some(s => s.id === 'ntr-bharosa-pension-ap'),
  '5. "Pension" returns verified pension schemes (NTR Bharosa)'
);

// Test 6: "Housing" returns housing schemes
const housingRes = searchSchemes('Housing');
assert(
  housingRes.schemes.length > 0 &&
  housingRes.schemes.some(s => s.category === 'housing' || s.id.includes('pedalandariki') || s.id.includes('awas')),
  '6. "Housing" returns verified housing schemes'
);

// Test 7: "Talliki Vandanam" returns matching education welfare scheme
const tallikiRes = searchSchemes('Talliki Vandanam');
assert(
  tallikiRes.schemes.length > 0 && tallikiRes.schemes[0].id === 'talliki-vandanam-ap',
  '7. "Talliki Vandanam" returns matching education welfare scheme'
);

// Test 8: "ఆరోగ్య పథకాలు" (Telugu Health Schemes) returns health schemes
const healthRes = searchSchemes('ఆరోగ్య పథకాలు');
assert(
  healthRes.schemes.length > 0 &&
  healthRes.schemes.some(s => s.category === 'health' || s.id === 'dr-ntr-vaidya-seva-ap'),
  '8. "ఆరోగ్య పథకాలు" returns health schemes (Dr. NTR Vaidya Seva)'
);

// Test 9: "రైతు" (Telugu Farmer) returns farmer schemes
const farmerTeRes = searchSchemes('రైతు');
assert(
  farmerTeRes.schemes.length > 0 &&
  farmerTeRes.schemes.some(s => s.id === 'annadata-sukhibhava-ap' || s.category === 'agriculture'),
  '9. "రైతు" returns farmer schemes in Telugu'
);

// Test 10: "pan card" triggers cross-service match notice pointing to PAN card public service
const panSearchRes = searchSchemes('pan card');
assert(
  Boolean(panSearchRes.crossServiceMatch && panSearchRes.crossServiceMatch.id === 'pan-card-services' && panSearchRes.crossServiceMatch.name.includes('PAN')),
  '10. "pan card" triggers cross-service match notice pointing to PAN card public service'
);

// ==========================================
// 2. AI CHATBOT INTENT CLASSIFICATION AND ZERO-HALLUCINATION TESTS
// ==========================================
console.log('\n--- 2. AI Chatbot Intent Classification and Zero-Hallucination Tests ---');

// Test 1: "How to apply pan card?" routes to PAN_CARD intent and NEVER returns Talliki Vandanam
const q1 = 'How to apply pan card?';
const c1 = classifyCitizenIntent(q1);
const r1 = generateGroundedResponse(c1, q1, 'en');
assert(
  c1.intent === 'PAN_CARD' &&
  c1.matchedService?.id === 'pan-card-services' &&
  r1.reply.toLowerCase().includes('pan') &&
  (r1.reply.includes('tin-nsdl.com') || r1.reply.includes('incometax.gov.in')) &&
  !r1.reply.includes('Talliki Vandanam') &&
  !r1.reply.includes('School Education Financial Assistance'),
  '1. "How to apply pan card?" routes to PAN_CARD intent and NEVER returns Talliki Vandanam'
);

// Test 2: "What is the eligibility for Talliki Vandanam?" returns authentic scheme eligibility
const q2 = 'What is the eligibility for Talliki Vandanam?';
const c2 = classifyCitizenIntent(q2);
const r2 = generateGroundedResponse(c2, q2, 'en');
assert(
  c2.intent === 'SCHEME_ELIGIBILITY' &&
  c2.matchedScheme?.id === 'talliki-vandanam-ap' &&
  r2.reply.includes('Talliki Vandanam') &&
  r2.reply.includes('75%') &&
  r2.reply.includes('15,000'),
  '2. "What is the eligibility for Talliki Vandanam?" returns authentic scheme eligibility'
);

// Test 3: "Rythu schemes in Andhra Pradesh" returns Annadata Sukhibhava & PM-KISAN
const q3 = 'Rythu schemes in Andhra Pradesh';
const c3 = classifyCitizenIntent(q3);
const r3 = generateGroundedResponse(c3, q3, 'en');
assert(
  c3.intent === 'SCHEME_INFORMATION' &&
  c3.matchedScheme?.id === 'annadata-sukhibhava-ap' &&
  r3.reply.includes('Annadata Sukhibhava') &&
  r3.reply.includes('20,000'),
  '3. "Rythu schemes in Andhra Pradesh" returns Annadata Sukhibhava & PM-KISAN (₹20,000)'
);

// Test 4: "How to apply for an Aadhaar card?" routes to AADHAAR_SERVICES
const q4 = 'How to apply for an Aadhaar card?';
const c4 = classifyCitizenIntent(q4);
const r4 = generateGroundedResponse(c4, q4, 'en');
assert(
  c4.intent === 'AADHAAR_SERVICES' &&
  c4.matchedService?.id === 'aadhaar-services' &&
  r4.reply.includes('Aadhaar') &&
  r4.reply.includes('uidai.gov.in') &&
  !r4.reply.includes('Talliki Vandanam') &&
  !r4.reply.includes('Annadata Sukhibhava'),
  '4. "How to apply for an Aadhaar card?" routes to AADHAAR_SERVICES without welfare schemes'
);

// Test 5: "Hi" routes to GREETINGS intent
const q5 = 'Hi';
const c5 = classifyCitizenIntent(q5);
const r5 = generateGroundedResponse(c5, q5, 'en');
assert(
  c5.intent === 'GREETINGS' &&
  r5.reply.toLowerCase().includes('hello') &&
  r5.reply.includes('Grama Sahayya AI'),
  '5. "Hi" routes to GREETINGS intent and welcomes citizen politely'
);

// Test 6: "How to apply for a caste certificate?" routes to CERTIFICATE_SERVICES
const q6 = 'How to apply for a caste certificate?';
const c6 = classifyCitizenIntent(q6);
const r6 = generateGroundedResponse(c6, q6, 'en');
assert(
  c6.intent === 'CERTIFICATE_SERVICES' &&
  c6.matchedService?.id === 'integrated-caste-certificate' &&
  r6.reply.includes('Caste') &&
  r6.reply.includes('MeeSeva'),
  '6. "How to apply for a caste certificate?" routes to CERTIFICATE_SERVICES and returns MeeSeva steps'
);

// Test 7: "What is the capital of France?" is marked OUT_OF_SCOPE and triggers mandatory fallback
const q7 = 'What is the capital of France?';
const c7 = classifyCitizenIntent(q7);
const r7 = generateGroundedResponse(c7, q7, 'en');
assert(
  c7.intent === 'OUT_OF_SCOPE' &&
  r7.reply.includes("I couldn't find verified information for your query in the available official records") &&
  r7.reply.includes("I don't want to provide incorrect government information") &&
  !r7.reply.includes('Talliki Vandanam'),
  '7. "What is the capital of France?" is marked OUT_OF_SCOPE with mandatory strict fallback'
);

// Test 8: "Unknown scheme name xyz" returns mandatory strict fallback and NEVER defaults to scheme 0
const q8 = 'Unknown scheme name xyz random query 12345';
const c8 = classifyCitizenIntent(q8);
const r8 = generateGroundedResponse(c8, q8, 'en');
assert(
  !c8.matchedScheme &&
  r8.reply.includes("I couldn't find verified information for your query in the available official records") &&
  r8.reply.includes("I don't want to provide incorrect government information") &&
  !r8.reply.includes('Talliki Vandanam'),
  '8. "Unknown scheme name xyz" returns mandatory fallback and NEVER defaults to publicSchemes[0]'
);

// Test 9: "రైతు పథకాలు" provides authentic Telugu response for farmer welfare
const q9 = 'రైతు పథకాలు';
const c9 = classifyCitizenIntent(q9);
const r9 = generateGroundedResponse(c9, q9, 'te');
assert(
  c9.matchedScheme?.id === 'annadata-sukhibhava-ap' &&
  r9.reply.includes('అన్నదాత సుఖీభవ') &&
  r9.reply.includes('₹20,000') &&
  r9.reply.includes('https://annadathasukhibhava.ap.gov.in'),
  '9. "రైతు పథకాలు" provides authentic Telugu response for farmer welfare'
);

// ==========================================
// 3. LATENCY, CACHING AND PERFORMANCE TESTS
// ==========================================
console.log('\n--- 3. Latency, Caching and Performance Tests ---');

const t0 = performance.now();
for (let i = 0; i < 100; i++) {
  classifyCitizenIntent('How to apply pan card?');
  classifyCitizenIntent('రైతు పథకాలు');
  classifyCitizenIntent('What is the eligibility for Talliki Vandanam?');
}
const elapsedMs = performance.now() - t0;
const avgPerClassification = elapsedMs / 300;
assert(
  avgPerClassification < 5,
  `Deterministic intent classification avg latency: ${avgPerClassification.toFixed(3)}ms (target < 5ms)`
);

const t1 = performance.now();
for (let i = 0; i < 50; i++) {
  searchSchemes('Rythu');
  searchSchemes('ఆరోగ్య పథకాలు');
  searchSchemes('Pension');
}
const searchElapsedMs = performance.now() - t1;
const avgPerSearch = searchElapsedMs / 150;
assert(
  avgPerSearch < 10,
  `Multi-field fuzzy search avg latency: ${avgPerSearch.toFixed(3)}ms (target < 10ms)`
);

// ==========================================
// 4. ASYNC PRE-CHECK & RESTRICTED CONTEXT WINDOW TESTS
// ==========================================
console.log('\n--- 4. Async Pre-Check & Restricted Context Window Tests ---');

async function runAsyncPreCheckTests() {
  // Test 1: Civic service query confirms answerability without full LLM call
  const check1 = await preCheckQueryAnswerability('How to apply pan card?', 'en');
  assert(
    check1.isAnswerable === true &&
    check1.reason === 'verified_service_match' &&
    check1.retrievedServices[0]?.id === 'pan-card-services',
    '1. preCheckQueryAnswerability confirms PAN card is answerable from verified services'
  );

  // Test 2: Welfare scheme query confirms answerability and restricts context window to strictly 1 record
  const check2 = await preCheckQueryAnswerability('What is the eligibility for Talliki Vandanam?', 'en');
  assert(
    check2.isAnswerable === true &&
    check2.reason === 'verified_scheme_match' &&
    check2.retrievedSchemes.length === 1 &&
    check2.retrievedSchemes[0].id === 'talliki-vandanam-ap',
    '2. preCheckQueryAnswerability restricts retrieved scheme database records to exactly 1 record'
  );

  // Test 3: Unrelated trivia marks query unanswerable (avoiding LLM call entirely)
  const check3 = await preCheckQueryAnswerability('What is the capital of France?', 'en');
  assert(
    check3.isAnswerable === false &&
    check3.reason === 'out_of_scope' &&
    check3.retrievedSchemes.length === 0,
    '3. preCheckQueryAnswerability flags out-of-scope query as unanswerable before LLM call'
  );

  // Test 4: Unknown / nonexistent scheme marks query unanswerable
  const check4 = await preCheckQueryAnswerability('Tell me about unknown fake scheme xyz 99999', 'en');
  assert(
    check4.isAnswerable === false &&
    check4.retrievedSchemes.length === 0,
    '4. preCheckQueryAnswerability flags unknown scheme as unanswerable before LLM call'
  );

  // Test 5: Latency of async pre-check is ultra-fast (< 5ms)
  const preCheckStart = performance.now();
  for (let i = 0; i < 50; i++) {
    await preCheckQueryAnswerability('How to apply pan card?');
    await preCheckQueryAnswerability('What is the capital of France?');
  }
  const preCheckElapsedMs = performance.now() - preCheckStart;
  const avgPreCheckMs = preCheckElapsedMs / 100;
  assert(
    avgPreCheckMs < 5,
    `Async pre-check average latency: ${avgPreCheckMs.toFixed(3)}ms (target < 5ms)`
  );

  console.log(`\n🎉 MASTER IMPROVEMENT TEST SUITE FINISHED: ${passed} PASSED, ${failed} FAILED! 🎉\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runAsyncPreCheckTests();
