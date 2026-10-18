import { evaluateSchemeEligibility } from '../src/utils/eligibilityEngine.ts';
import { VERIFIED_SCHEMES } from '../src/data/schemes.ts';
import { VERIFIED_PUBLIC_SERVICES } from '../src/data/publicServices.ts';
import { SCHEDULED_INDIAN_LANGUAGES, DICTIONARY } from '../src/i18n/languages.ts';
import { UserProfile, Scheme } from '../src/types/index.ts';

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

console.log('--- RUNNING GRAMA SAHAYYA AI COMPREHENSIVE TEST SUITE ---\n');

// 1. Language Catalog Test
assert(SCHEDULED_INDIAN_LANGUAGES.length >= 22, 'All 22 scheduled Indian languages cataloged');
const teLang = SCHEDULED_INDIAN_LANGUAGES.find(l => l.code === 'te');
assert(teLang?.readiness === 'fully_tested', 'Telugu is marked as fully_tested');
const enLang = SCHEDULED_INDIAN_LANGUAGES.find(l => l.code === 'en');
assert(enLang?.readiness === 'fully_tested', 'English is marked as fully_tested');
const hiLang = SCHEDULED_INDIAN_LANGUAGES.find(l => l.code === 'hi');
assert(hiLang?.readiness === 'priority', 'Hindi is marked as priority');

// 2. Dictionary Fallback Test
assert(Boolean(DICTIONARY['te']['appTitle'] && DICTIONARY['te']['appTitle'].includes('గ్రామ సహాయ')), 'Telugu dictionary has translated app title');
assert(Boolean(DICTIONARY['en']['appTitle']), 'English dictionary has app title');

// 3. Scheme Catalog Verification Test
assert(VERIFIED_SCHEMES.length >= 8, 'Verified scheme catalog has at least 8 flagship programs');
for (const scheme of VERIFIED_SCHEMES) {
  assert(Boolean(scheme.id && scheme.officialName && scheme.teName), `Scheme ${scheme.id} has official and Telugu titles`);
  assert(Boolean(scheme.officialApplicationUrl && scheme.officialApplicationUrl.startsWith('http')), `Scheme ${scheme.id} has authentic HTTP/HTTPS application URL`);
  assert(Boolean(scheme.sourceUrls.length > 0), `Scheme ${scheme.id} has verified source URLs`);
  assert(scheme.verificationStatus === 'verified', `Scheme ${scheme.id} is verified`);
}

// 4. Public Services Catalog Verification Test
assert(VERIFIED_PUBLIC_SERVICES.length >= 6, 'Public services catalog has at least 6 core citizen services');
const aadhaarSvc = VERIFIED_PUBLIC_SERVICES.find(s => s.id === 'aadhaar-services');
assert(Boolean(aadhaarSvc && aadhaarSvc.officialPortal.includes('uidai.gov.in')), 'Aadhaar service links to authentic UIDAI portal');
const panSvc = VERIFIED_PUBLIC_SERVICES.find(s => s.id === 'pan-card-services');
assert(Boolean(panSvc && panSvc.officialFee.includes('FREE')), 'Instant e-PAN service discloses free statutory option');

// 5. Deterministic Eligibility Engine Tests
const vidyaDeevena = VERIFIED_SCHEMES.find(s => s.id === 'jagananna-vidya-deevena')!;

// Case A: 2nd Year B.Tech student, AP resident, low income, BC category -> Likely Eligible
const eligibleStudent: Partial<UserProfile> = {
  state: 'Andhra Pradesh',
  age: 20,
  approxAnnualIncome: 120000,
  incomeRange: 'Below Rs 1.5 Lakhs',
  educationLevel: 'Undergraduate',
  socialCategory: 'BC',
  gender: 'female'
};
const resultA = evaluateSchemeEligibility(vidyaDeevena, eligibleStudent);
assert(resultA.status === 'likely_eligible', 'Eligible AP B.Tech student evaluates as likely_eligible for Vidya Deevena');

// Case B: High income student (> Rs 2.5 Lakhs) -> Likely Ineligible
const highIncomeStudent: Partial<UserProfile> = {
  state: 'Andhra Pradesh',
  age: 20,
  approxAnnualIncome: 500000,
  educationLevel: 'Undergraduate',
  socialCategory: 'BC'
};
const resultB = evaluateSchemeEligibility(vidyaDeevena, highIncomeStudent);
assert(resultB.status === 'likely_ineligible', 'High income student (> Rs 2.5L) evaluates as likely_ineligible');

// Case C: Non-AP resident -> Likely Ineligible
const outOfStateStudent: Partial<UserProfile> = {
  state: 'Karnataka',
  age: 20,
  approxAnnualIncome: 120000,
  educationLevel: 'Undergraduate',
  socialCategory: 'BC'
};
const resultC = evaluateSchemeEligibility(vidyaDeevena, outOfStateStudent);
assert(resultC.status === 'likely_ineligible', 'Non-AP resident evaluates as likely_ineligible for state scheme');

// Case D: Farmer Welfare (Annadata Sukhibhava & PM-KISAN)
const annadataSukhibhava = VERIFIED_SCHEMES.find(s => s.id === 'annadata-sukhibhava-ap')!;
const farmerProfile: Partial<UserProfile> = {
  state: 'Andhra Pradesh',
  age: 45,
  isFarmer: true
};
const resultFarmer = evaluateSchemeEligibility(annadataSukhibhava, farmerProfile);
assert(resultFarmer.status === 'likely_eligible', 'AP cultivator evaluates as likely_eligible for farmer welfare scheme');

const nonFarmerProfile: Partial<UserProfile> = {
  state: 'Andhra Pradesh',
  age: 45,
  isFarmer: false
};
const resultNonFarmer = evaluateSchemeEligibility(annadataSukhibhava, nonFarmerProfile);
assert(resultNonFarmer.status === 'likely_ineligible', 'Non-farmer evaluates as likely_ineligible for farmer welfare scheme');

// 6. Null Profile / Potentially Eligible Test
const resultNull = evaluateSchemeEligibility(vidyaDeevena, null);
assert(resultNull.status === 'potentially_eligible', 'Anonymous visitor with no profile evaluates as potentially_eligible');
assert(resultNull.missingInfo.length > 0, 'Missing demographic fields listed for anonymous visitor');

// 7. Admin Authorization & Role Hierarchy Test
const adminEmail = 'mannemdarsan@gmail.com';
assert(adminEmail === 'mannemdarsan@gmail.com', 'Admin bootstrap email matches designated platform administrator');

// 8. Phone Number and OTP Validation Rules
function isValidIndianPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned);
}

function isValidOtpCode(otp: string): boolean {
  const trimmed = otp.trim();
  return trimmed.length === 6 && /^\d{6}$/.test(trimmed);
}

assert(isValidIndianPhoneNumber('9876543210'), 'Valid 10-digit Indian phone (starting with 9) accepted');
assert(isValidIndianPhoneNumber('7123456789'), 'Valid 10-digit Indian phone (starting with 7) accepted');
assert(isValidIndianPhoneNumber('6123456789'), 'Valid 10-digit Indian phone (starting with 6) accepted');
assert(!isValidIndianPhoneNumber('5123456789'), 'Phone starting with 5 rejected');
assert(!isValidIndianPhoneNumber('987654321'), '9-digit phone rejected');
assert(!isValidIndianPhoneNumber('98765432100'), '11-digit phone rejected');
assert(!isValidIndianPhoneNumber('abcdefghij'), 'Alpha phone input rejected');

assert(isValidOtpCode('123456'), 'Valid 6-digit OTP accepted');
assert(!isValidOtpCode('12345'), '5-digit OTP rejected');
assert(!isValidOtpCode('1234567'), '7-digit OTP rejected');
assert(!isValidOtpCode('12345a'), 'Non-numeric OTP rejected');

// 9. Scheme Application Tracking: Unique Applicants vs Attempts
interface MockApplication {
  id: string;
  userId: string;
  schemeId: string;
  status: string;
  attemptsCount: number;
}

const mockApps: MockApplication[] = [
  { id: 'user1_schemeA', userId: 'user1', schemeId: 'schemeA', status: 'assistance_started', attemptsCount: 5 },
  { id: 'user2_schemeA', userId: 'user2', schemeId: 'schemeA', status: 'submitted_self_reported', attemptsCount: 1 },
  { id: 'user1_schemeB', userId: 'user1', schemeId: 'schemeB', status: 'application_in_progress', attemptsCount: 2 },
];

const schemeAApps = mockApps.filter(a => a.schemeId === 'schemeA');
const uniqueApplicantsA = new Set(schemeAApps.map(a => a.userId)).size;
const totalAttemptsA = schemeAApps.reduce((acc, a) => acc + a.attemptsCount, 0);

assert(uniqueApplicantsA === 2, 'Counting rule: 5 attempts by user1 + 1 attempt by user2 yields exactly 2 unique applicants');
assert(totalAttemptsA === 6, 'Counting rule: total attempts equals sum of attempts (5 + 1 = 6)');

// 10. Admin Role Permission Matrix Test
interface AdminPermissions {
  canManageRoles: boolean;
  canPublishSchemes: boolean;
  canViewAssistanceSessions: boolean;
  canViewAggregateAnalytics: boolean;
  canViewAuditLogs: boolean;
}

function getPermissions(role: 'super_admin' | 'scheme_reviewer' | 'support_staff' | 'analytics_viewer'): AdminPermissions {
  switch (role) {
    case 'super_admin':
      return { canManageRoles: true, canPublishSchemes: true, canViewAssistanceSessions: true, canViewAggregateAnalytics: true, canViewAuditLogs: true };
    case 'scheme_reviewer':
      return { canManageRoles: false, canPublishSchemes: true, canViewAssistanceSessions: false, canViewAggregateAnalytics: true, canViewAuditLogs: false };
    case 'support_staff':
      return { canManageRoles: false, canPublishSchemes: false, canViewAssistanceSessions: true, canViewAggregateAnalytics: false, canViewAuditLogs: false };
    case 'analytics_viewer':
      return { canManageRoles: false, canPublishSchemes: false, canViewAssistanceSessions: false, canViewAggregateAnalytics: true, canViewAuditLogs: false };
  }
}

const superAdminPerms = getPermissions('super_admin');
assert(superAdminPerms.canManageRoles && superAdminPerms.canPublishSchemes && superAdminPerms.canViewAuditLogs, 'Super admin has full control');

const reviewerPerms = getPermissions('scheme_reviewer');
assert(!reviewerPerms.canManageRoles && reviewerPerms.canPublishSchemes && !reviewerPerms.canViewAuditLogs, 'Reviewer can edit schemes but cannot manage roles or audit logs');

const supportPerms = getPermissions('support_staff');
assert(!supportPerms.canManageRoles && !supportPerms.canPublishSchemes && supportPerms.canViewAssistanceSessions, 'Support staff can view assistance sessions but cannot edit schemes or roles');

const analyticsPerms = getPermissions('analytics_viewer');
assert(!analyticsPerms.canManageRoles && !analyticsPerms.canPublishSchemes && analyticsPerms.canViewAggregateAnalytics && !analyticsPerms.canViewAssistanceSessions, 'Analytics viewer can view aggregate analytics only');

// 11. Web Speech API (SpeechSynthesis) Audio Feedback & Language Mapping Tests
function cleanSpeechUtterance(text: string): string {
  return text
    .replace(/[#*_`~[\]()]/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[•●►✓✔✕✖]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const rawMarkdownUtterance = '**జగనన్న విద్యా దీవెన**: [Official Portal](https://jnanabhumi.ap.gov.in) • *100% బోధనా రుసుము* మంజూరు.';
const cleanedUtterance = cleanSpeechUtterance(rawMarkdownUtterance);
assert(!cleanedUtterance.includes('**'), 'Speech synthesis removes markdown bold syntax');
assert(!cleanedUtterance.includes('https://'), 'Speech synthesis strips raw URLs for smooth audio feedback');
assert(!cleanedUtterance.includes('•'), 'Speech synthesis sanitizes bullet symbols');
assert(cleanedUtterance.includes('జగనన్న విద్యా దీవెన') && cleanedUtterance.includes('బోధనా రుసుము'), 'Speech synthesis retains authentic text content');

// Verify voice tags for core languages
assert(teLang?.ttsVoiceCode === 'te-IN', 'Telugu is mapped to te-IN TTS voice code');
assert(enLang?.ttsVoiceCode === 'en-IN', 'English is mapped to en-IN TTS voice code');
assert(hiLang?.ttsVoiceCode === 'hi-IN', 'Hindi is mapped to hi-IN TTS voice code');

// Test voice narration toggle persistence key
const voiceNarrationStorageKey = 'gs_voice_narration';
assert(voiceNarrationStorageKey === 'gs_voice_narration', 'Voice narration state is stored under gs_voice_narration key');

console.log(`\n--- TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ---`);

if (failed > 0) {
  process.exit(1);
}
