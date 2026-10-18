import { VERIFIED_SCHEMES } from '../src/data/schemes';
import { ARCHIVED_HISTORICAL_SCHEMES } from '../src/data/archivedHistoricalSchemes';
import {
  containsYsrBranding,
  isYsrBrandedScheme,
  filterPublicSchemes,
  sanitizePublicScheme
} from '../src/utils/schemeNormalization';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion failed: ${message}`);
    process.exit(1);
  }
  console.log(`✅ ${message}`);
}

console.log('\n--- 1. Verification of Public Catalogue Against YSR Branding ---');

// Test 1: No public scheme in VERIFIED_SCHEMES must be identified as YSR branded
const contaminatedSchemes = VERIFIED_SCHEMES.filter(isYsrBrandedScheme);
assert(
  contaminatedSchemes.length === 0,
  `Public catalogue VERIFIED_SCHEMES contains ZERO YSR-branded schemes (found: ${contaminatedSchemes.length})`
);

// Test 2: Scan all string fields in VERIFIED_SCHEMES for accidental "YSR" tokens
VERIFIED_SCHEMES.forEach((scheme) => {
  const idHasYsr = containsYsrBranding(scheme.id);
  assert(!idHasYsr, `Scheme ID "${scheme.id}" must not contain YSR branding`);

  const nameHasYsr = containsYsrBranding(scheme.officialName);
  assert(!nameHasYsr, `Scheme "${scheme.id}" officialName ("${scheme.officialName}") must not contain YSR branding`);

  const teNameHasYsr = scheme.teName ? containsYsrBranding(scheme.teName) : false;
  assert(!teNameHasYsr, `Scheme "${scheme.id}" teName must not contain YSR branding`);

  const hiNameHasYsr = scheme.hiName ? containsYsrBranding(scheme.hiName) : false;
  assert(!hiNameHasYsr, `Scheme "${scheme.id}" hiName must not contain YSR branding`);

  // Historical aliases in public schemes must not contain YSR branding
  if (scheme.historicalAliases) {
    scheme.historicalAliases.forEach((alias) => {
      assert(
        !containsYsrBranding(alias),
        `Scheme "${scheme.id}" alias "${alias}" must not contain YSR branding`
      );
    });
  }
});

console.log('\n--- 2. Robust Brand Detection & Normalization Tests ---');

// Test 3: Standard English and case variations
assert(containsYsrBranding('ysr'), 'Detects lowercase "ysr"');
assert(containsYsrBranding('YSR'), 'Detects uppercase "YSR"');
assert(containsYsrBranding('Y.S.R.'), 'Detects punctuated "Y.S.R."');
assert(containsYsrBranding('Y S R'), 'Detects spaced "Y S R"');
assert(containsYsrBranding('ysr-rythu-bharosa'), 'Detects hyphenated token "ysr-rythu-bharosa"');
assert(containsYsrBranding('YSR Cheyutha'), 'Detects multi-word "YSR Cheyutha"');
assert(containsYsrBranding('YSR Aasara'), 'Detects multi-word "YSR Aasara"');
assert(containsYsrBranding('YSR Pension Kanuka'), 'Detects multi-word "YSR Pension Kanuka"');

// Test 4: Telugu script variations
assert(containsYsrBranding('వైఎస్సార్'), 'Detects Telugu "వైఎస్సార్"');
assert(containsYsrBranding('వై.ఎస్.ఆర్'), 'Detects punctuated Telugu "వై.ఎస్.ఆర్"');
assert(containsYsrBranding('వైఎస్ఆర్'), 'Detects Telugu variant "వైఎస్ఆర్"');
assert(containsYsrBranding('వైఎస్సార్ చేయూత'), 'Detects compound Telugu "వైఎస్సార్ చేయూత"');

// Test 5: Geographic integrity test (YSR Kadapa District MUST NOT be falsely blocked)
assert(!containsYsrBranding('YSR Kadapa'), 'Geographic district name "YSR Kadapa" does NOT trigger false scheme brand exclusion');
assert(!containsYsrBranding('Kadapa District'), '"Kadapa District" passes cleanly');

console.log('\n--- 3. Current Verified Andhra Pradesh Government Schemes Presence ---');

// Test 6: Verify key current AP schemes are present, active, and properly attributed
const keyCurrentApSchemes = [
  { id: 'annadata-sukhibhava-ap', expectedMinBenefit: 20000, deptKey: 'Agriculture' },
  { id: 'ntr-bharosa-pension-ap', expectedMinBenefit: 4000, deptKey: 'Panchayat' },
  { id: 'dr-ntr-vaidya-seva-ap', deptKey: 'Health' },
  { id: 'talliki-vandanam-ap', deptKey: 'Education' },
  { id: 'ap-deepam-free-lpg-scheme', deptKey: 'Civil Supplies' },
  { id: 'aadabidda-nidhi-ap', deptKey: 'Women' },
  { id: 'sthree-shakthi-free-bus-ap', deptKey: 'Transport' },
  { id: 'yuva-galam-unemployment-allowance-ap', deptKey: 'Skill' }
];

keyCurrentApSchemes.forEach((expected) => {
  const scheme = VERIFIED_SCHEMES.find((s) => s.id === expected.id);
  assert(!!scheme, `Current AP verified scheme "${expected.id}" exists in catalogue`);
  assert(scheme?.state === 'Andhra Pradesh', `Scheme "${expected.id}" has state = "Andhra Pradesh"`);
  assert(scheme?.verificationStatus === 'verified', `Scheme "${expected.id}" has status = "verified"`);
  assert(scheme?.lifecycleStatus === 'ACTIVE' || scheme?.lifecycleStatus === 'UPDATED', `Scheme "${expected.id}" lifecycleStatus is active or updated`);
  assert(
    Boolean(scheme?.officialApplicationUrl?.startsWith('https://')),
    `Scheme "${expected.id}" has valid secure official application URL: ${scheme?.officialApplicationUrl}`
  );
  assert(
    Boolean(scheme?.officialInfoUrl?.startsWith('https://')),
    `Scheme "${expected.id}" has valid secure official info URL: ${scheme?.officialInfoUrl}`
  );
});

console.log('\n--- 4. Archive Integrity & Separation Tests ---');

// Test 7: Verify ARCHIVED_HISTORICAL_SCHEMES exists and holds preserved historical records
assert(
  ARCHIVED_HISTORICAL_SCHEMES.length >= 5,
  `Archived historical schemes collection contains preserved records (count: ${ARCHIVED_HISTORICAL_SCHEMES.length})`
);

ARCHIVED_HISTORICAL_SCHEMES.forEach((archived) => {
  assert(
    archived.isArchivedHistorical === true,
    `Archived record "${archived.id}" has isArchivedHistorical = true`
  );
  assert(
    archived.published === false,
    `Archived record "${archived.id}" has published = false`
  );
  assert(
    !!archived.archiveReason,
    `Archived record "${archived.id}" contains explicit archiveReason: "${archived.archiveReason}"`
  );
  // Guarantee none of the archived schemes leak into VERIFIED_SCHEMES
  const leakedInPublic = VERIFIED_SCHEMES.some((pub) => pub.id === archived.id);
  assert(!leakedInPublic, `Archived scheme "${archived.id}" is NOT leaked into public VERIFIED_SCHEMES`);
});

console.log('\n--- 5. Filter & Sanitization Guard Tests ---');

// Test 8: filterPublicSchemes strips mock or poisoned records
const testBatch = [
  ...VERIFIED_SCHEMES.slice(0, 3),
  {
    ...VERIFIED_SCHEMES[0],
    id: 'ysr-test-leak',
    officialName: 'YSR Test Welfare Initiative'
  }
];

const sanitizedList = filterPublicSchemes(testBatch as any as import('../src/types').Scheme[]);
assert(sanitizedList.length === 3, 'filterPublicSchemes drops any YSR branded schemes even if marked published=true');
assert(!sanitizedList.some((s) => s.id === 'ysr-test-leak'), 'Injected YSR record was dropped');

// Test 9: sanitizeSchemeForPublic cleans historicalAliases
const mockWithLeakedAlias = {
  ...VERIFIED_SCHEMES[0],
  historicalAliases: ['Valid Alias', 'YSR Old Name', 'Another Valid Alias']
};
const cleanedScheme = sanitizePublicScheme(mockWithLeakedAlias);
assert(
  cleanedScheme.historicalAliases?.length === 2,
  'sanitizePublicScheme stripped poisoned historical alias containing YSR branding'
);
assert(
  !cleanedScheme.historicalAliases?.includes('YSR Old Name'),
  'Poisoned alias "YSR Old Name" was removed'
);

console.log('\n🎉 ALL SCHEME EXCLUSION & CURRENT CATALOGUE TESTS PASSED SUCCESSFULLY! 🎉\n');
