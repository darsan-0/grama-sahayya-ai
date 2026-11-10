import { Scheme, PublicService } from '../types';
import { VERIFIED_SCHEMES } from '../data/schemes';
import { VERIFIED_PUBLIC_SERVICES } from '../data/publicServices';
import { filterPublicSchemes, normalizeSchemeText } from './schemeNormalization';

/**
 * High-Precision Bilingual Telugu-English Government Search Engine
 * 
 * Capabilities:
 * - Multi-field search (names, summaries, descriptions, benefits, eligibility, docs, steps, departments, categories, aliases)
 * - Phonetic & transliteration synonym expansion (Rythu <-> Farmer <-> రైతు <-> Kisan <-> Annadata)
 * - Typo tolerance via Levenshtein edit distance
 * - Tokenized partial matching for multi-word queries
 * - Cross-directory public service detection (identifies PAN, Aadhaar, Certificates, Rice Card queries)
 */

// Bilingual synonym dictionary connecting common citizen terms in English and Telugu
const SYNONYM_GROUPS: Record<string, string[]> = {
  // Farmer / Agriculture
  farmer: ['rythu', 'raitu', 'raithu', 'rythulu', 'farmer', 'farmers', 'agriculture', 'kisan', 'krishi', 'annadata', 'e-crop', 'e-panta', 'ccrc', 'రైతు', 'రైతులు', 'వ్యవసాయం', 'అన్నదాత', 'సుఖీభవ', 'కిసాన్'],
  rythu: ['rythu', 'raitu', 'raithu', 'rythulu', 'farmer', 'farmers', 'agriculture', 'kisan', 'krishi', 'annadata', 'e-crop', 'e-panta', 'ccrc', 'రైతు', 'రైతులు', 'వ్యవసాయం', 'అన్నదాత', 'సుఖీభవ', 'కిసాన్'],
  రైతు: ['rythu', 'raitu', 'raithu', 'rythulu', 'farmer', 'farmers', 'agriculture', 'kisan', 'krishi', 'annadata', 'e-crop', 'e-panta', 'రైతు', 'రైతులు', 'వ్యవసాయం', 'అన్నదాత', 'సుఖీభవ'],
  kisan: ['kisan', 'kisaan', 'farmer', 'rythu', 'agriculture', 'annadata', 'రైతు', 'కిసాన్'],
  agriculture: ['agriculture', 'farmer', 'rythu', 'kisan', 'వ్యవసాయం', 'రైతు'],

  // Pension
  pension: ['pension', 'pensions', 'penshon', 'pensioner', 'asara', 'aasara', 'bharosa', 'ntr bharosa', 'atal pension', 'old age', 'widow', 'disability', 'పింఛన్', 'ఫించన్', 'వృద్ధాప్య', 'వితంతు', 'దివ్యాంగుల', 'భరోసా'],
  పింఛన్: ['pension', 'pensions', 'penshon', 'bharosa', 'ntr bharosa', 'old age', 'widow', 'disability', 'పింఛన్', 'ఫించన్', 'వృద్ధాప్య', 'వితంతు', 'దివ్యాంగుల'],

  // Housing
  housing: ['housing', 'housng', 'house', 'home', 'avas', 'awas', 'pmay', 'navaratnalu', 'pedalandariki illu', 'patta', 'house site', 'ఇళ్లు', 'ఇల్లు', 'ఇళ్ల స్థలాలు', 'గృహ నిర్మాణం', 'ఆవాస్'],
  ఇళ్లు: ['housing', 'house', 'awas', 'pmay', 'ఇళ్లు', 'ఇల్లు', 'ఇళ్ల స్థలాలు', 'గృహ నిర్మాణం'],

  // Health / Medical
  health: ['health', 'healthcare', 'medical', 'hospital', 'treatment', 'cashless', 'aarogyasri', 'arogyasri', 'vaidya', 'vaidya seva', 'dr ntr vaidya seva', 'ayushman', 'abha', 'ఆరోగ్య', 'ఆరోగ్యశ్రీ', 'వైద్యం', 'వైద్య సేవ', 'ఆసుపత్రి', 'చికిత్స'],
  ఆరోగ్య: ['health', 'healthcare', 'medical', 'hospital', 'aarogyasri', 'vaidya seva', 'dr ntr vaidya seva', 'ఆరోగ్య', 'ఆరోగ్యశ్రీ', 'వైద్యం', 'వైద్య సేవ', 'చికిత్స'],

  // Education / Scholarship
  scholarship: ['scholarship', 'scholarships', 'school', 'college', 'student', 'students', 'fee', 'tuition', 'vidya', 'vasathi', 'deevena', 'talliki vandanam', 'amma vodi', 'education', 'పోస్ట్ మెట్రిక్', 'విద్యా దీవెన', 'వసతి దీవెన', 'తల్లికి వందనం', 'స్కాలర్‌షిప్', 'బడి', 'విద్యార్థి'],
  విద్యార్థి: ['student', 'scholarship', 'education', 'vidya', 'deevena', 'talliki vandanam', 'విద్యార్థి', 'స్కాలర్‌షిప్', 'చదువు', 'బడి'],

  // Talliki Vandanam / School
  talliki: ['talliki', 'vandanam', 'talliki vandanam', 'taliki', 'amma vodi', 'mother', 'school assistance', 'తల్లికి వందనం', 'తల్లి', 'బడి'],
  తల్లికి: ['talliki', 'vandanam', 'amma vodi', 'తల్లికి వందనం', 'తల్లి', 'బడి'],

  // Gas / LPG
  gas: ['gas', 'cylinder', 'lpg', 'deepam', 'deepam 2', 'free gas', 'fuel', 'గ్యాస్', 'దీపం', 'సిలిండర్', 'ఉచిత గ్యాస్'],
  దీపం: ['gas', 'cylinder', 'lpg', 'deepam', 'గ్యాస్', 'దీపం', 'సిలిండర్'],

  // Bus / Transport
  bus: ['bus', 'travel', 'free bus', 'transport', 'apsrtc', 'sthree shakthi', 'women travel', 'బస్సు', 'ఆర్టీసీ', 'ఉచిత బస్సు', 'స్త్రీ శక్తి'],
  బస్సు: ['bus', 'apsrtc', 'free bus', 'sthree shakthi', 'బస్సు', 'ఆర్టీసీ', 'ఉచిత బస్సు', 'స్త్రీ శక్తి'],

  // Women / SHG
  women: ['women', 'woman', 'shg', 'dwacra', 'dvkra', 'aadabidda', 'cheyutha', 'aasara', 'sthree shakthi', 'మహిళ', 'డ్వాక్రా', 'ఆడబిడ్డ', 'స్త్రీ శక్తి'],
  మహిళ: ['women', 'shg', 'dwacra', 'aadabidda', 'sthree shakthi', 'మహిళ', 'డ్వాక్రా', 'ఆడబిడ్డ'],

  // Solar Energy
  solar: ['solar', 'surya', 'surya ghar', 'electricity', 'power', 'rooftop', '300 units', 'సౌర', 'సౌర విద్యుత్', 'సూర్య ఘర్', 'ఉచిత కరెంట్'],
  సౌర: ['solar', 'surya', 'electricity', 'rooftop', 'సౌర', 'సౌర విద్యుత్', 'సూర్య ఘర్'],

  // Identity / Certificates / Public Services
  pan: ['pan', 'pan card', 'permanent account number', 'e-pan', 'nsdl', 'utiitsl', 'income tax', 'పాన్', 'పాన్ కార్డు'],
  పాన్: ['pan', 'pan card', 'income tax', 'పాన్', 'పాన్ కార్డు'],
  aadhaar: ['aadhaar', 'aadhar', 'uidai', 'myaadhaar', 'enrolment', 'pvc card', 'ఆధార్', 'ఆధార్ కార్డు', 'యుఐడిఎఐ'],
  ఆధార్: ['aadhaar', 'aadhar', 'uidai', 'ఆధార్', 'ఆధార్ కార్డు'],
  caste: ['caste', 'community', 'integrated caste', 'sc', 'st', 'bc', 'obc', 'meeseva', 'sachivalayam', 'కుల', 'కుల ధృవీకరణ'],
  కుల: ['caste', 'community', 'కుల', 'కుల ధృవీకరణ'],
  income: ['income', 'income certificate', 'meeseva', 'ఆదాయం', 'ఆదాయ ధృవీకరణ'],
  రేషన్: ['ration', 'rice card', 'bpl', 'రేషన్ కార్డు', 'రైస్ కార్డు'],
  ration: ['ration', 'rice card', 'bpl', 'food security', 'రేషన్ కార్డు', 'రైస్ కార్డు']
};

/**
 * Calculates Levenshtein edit distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Determines whether token fuzzily matches target with typo tolerance
 */
export function fuzzyWordMatch(token: string, targetWord: string): boolean {
  if (token === targetWord) return true;
  // Substring match only if token is at least 4 characters and target word starts with token
  if (token.length >= 4 && targetWord.startsWith(token)) return true;
  
  // Typo tolerance: strictly allow 1 edit for 5-7 chars, 2 edits only for >= 8 chars
  // Never allow 2 edits on short 5-6 letter words (avoids false matches like "france" -> "finance")
  if (token.length >= 5 && targetWord.length >= 5) {
    const maxDistance = token.length >= 8 ? 2 : 1;
    if (Math.abs(token.length - targetWord.length) <= maxDistance) {
      return levenshteinDistance(token, targetWord) <= maxDistance;
    }
  }
  return false;
}

/**
 * Expands query tokens using bilingual synonym sets
 */
export function expandSynonyms(tokens: string[]): string[] {
  const expanded = new Set<string>();

  for (const token of tokens) {
    expanded.add(token);
    // Direct synonym lookup
    if (SYNONYM_GROUPS[token]) {
      for (const syn of SYNONYM_GROUPS[token]) {
        expanded.add(syn);
      }
    }
    // Prefix / partial lookup
    for (const [key, list] of Object.entries(SYNONYM_GROUPS)) {
      if (key.startsWith(token) || token.startsWith(key)) {
        list.forEach(item => expanded.add(item));
      }
    }
  }

  return Array.from(expanded);
}

export interface SchemeSearchFilters {
  category?: string;
  govLevel?: string;
}

export interface SchemeSearchResult {
  schemes: Scheme[];
  totalMatches: number;
  totalVerifiedInDatabase: number;
  crossServiceMatch?: PublicService | null;
  explanatoryNotice?: string;
}

/**
 * Main Government Scheme Search Engine
 */
export function searchSchemes(
  query: string,
  filters: SchemeSearchFilters = {},
  options: { includeArchivedNotice?: boolean } = {}
): SchemeSearchResult {
  const publicSchemes = filterPublicSchemes(VERIFIED_SCHEMES);
  const totalVerifiedInDatabase = publicSchemes.length;

  const rawQuery = (query || '').trim();
  const normalizedQuery = normalizeSchemeText(rawQuery);

  // Cross-service match check (e.g. if user searches "PAN Card" or "Aadhaar" in schemes directory)
  let crossServiceMatch: PublicService | null = null;
  if (normalizedQuery) {
    const panTokens = ['pan', 'pan card', 'పాన్'];
    const aadhaarTokens = ['aadhaar', 'aadhar', 'uidai', 'ఆధార్'];
    const casteTokens = ['caste', 'కుల', 'community certificate'];
    const incomeTokens = ['income certificate', 'ఆదాయ ధృవీకరణ'];

    if (panTokens.some(t => normalizedQuery.includes(t))) {
      crossServiceMatch = VERIFIED_PUBLIC_SERVICES.find(s => s.id === 'pan-card-services') || null;
    } else if (aadhaarTokens.some(t => normalizedQuery.includes(t))) {
      crossServiceMatch = VERIFIED_PUBLIC_SERVICES.find(s => s.id === 'aadhaar-services') || null;
    } else if (casteTokens.some(t => normalizedQuery.includes(t))) {
      crossServiceMatch = VERIFIED_PUBLIC_SERVICES.find(s => s.id === 'integrated-caste-certificate') || null;
    } else if (incomeTokens.some(t => normalizedQuery.includes(t))) {
      crossServiceMatch = VERIFIED_PUBLIC_SERVICES.find(s => s.id === 'income-certificate') || null;
    }
  }

  // Handle specific historical Rythu Bharosa search:
  // Connect citizen seeking "Rythu Bharosa" directly to the current verified farmer scheme "Annadata Sukhibhava & PM-KISAN"
  let explanatoryNotice: string | undefined;
  const isRythuBharosaSearch = /rythu\s*bharosa|రైతు\s*భరోసా/i.test(rawQuery);
  if (isRythuBharosaSearch) {
    explanatoryNotice = 'Showing verified farmer welfare program "Annadata Sukhibhava & PM-KISAN" (₹20,000/year), which is the active Andhra Pradesh government investment support scheme replacing the historical Rythu Bharosa program.';
  }

  // If no search query, return filtered public schemes by category / govLevel
  if (!normalizedQuery) {
    let results = [...publicSchemes];
    if (filters.govLevel && filters.govLevel !== 'all') {
      results = results.filter(s => s.govLevel === filters.govLevel);
    }
    if (filters.category && filters.category !== 'all') {
      results = results.filter(s => s.category === filters.category);
    }
    return {
      schemes: results,
      totalMatches: results.length,
      totalVerifiedInDatabase,
      crossServiceMatch,
      explanatoryNotice
    };
  }

// Stop words that should not trigger scheme matches on their own
const GENERIC_STOP_WORDS = new Set([
  'card', 'cards', 'scheme', 'schemes', 'portal', 'online', 'apply', 'details',
  'and', 'or', 'the', 'in', 'of', 'for', 'to', 'how', 'what', 'who', 'is', 'a', 'an',
  'gov', 'government', 'pradesh', 'andhra', 'ap',
  'పథకం', 'పథకాలు', 'కార్డు', 'ఎలా', 'ఏమిటి', 'ప్రభుత్వం'
]);

  // Extract query tokens (ignoring stop words if substantive keywords exist)
  const allTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const substantiveTokens = allTokens.filter(t => !GENERIC_STOP_WORDS.has(t) && t.length >= 2);
  const queryTokens = substantiveTokens.length > 0 ? substantiveTokens : allTokens;
  const expandedTokens = expandSynonyms(queryTokens);

  // If query is specifically about citizen services that have NO matching welfare schemes (like "PAN card")
  // and we found a cross-service match, don't return unrelated welfare schemes
  const isPureServiceQuery = crossServiceMatch && ['pan', 'pan card', 'పాన్'].some(t => normalizedQuery === t || normalizedQuery.startsWith(t + ' '));

  // Score and filter each scheme
  interface ScoredScheme {
    scheme: Scheme;
    score: number;
  }

  const scoredSchemes: ScoredScheme[] = [];

  if (!isPureServiceQuery) {
    for (const scheme of publicSchemes) {
      // Check Gov Level filter
      if (filters.govLevel && filters.govLevel !== 'all' && scheme.govLevel !== filters.govLevel) {
        continue;
      }

      // Check Category filter
      if (filters.category && filters.category !== 'all' && scheme.category !== filters.category) {
        continue;
      }

      // Prepare search target fields
      const nameNorm = normalizeSchemeText(scheme.officialName);
      const teNameNorm = normalizeSchemeText(scheme.teName);
      const hiNameNorm = normalizeSchemeText(scheme.hiName);
      const sumNorm = normalizeSchemeText(scheme.summary);
      const teSumNorm = normalizeSchemeText(scheme.teSummary);
      const descNorm = normalizeSchemeText(scheme.description);
      const teDescNorm = normalizeSchemeText(scheme.teDescription);
      const catNorm = normalizeSchemeText(scheme.category);
      const deptNorm = normalizeSchemeText(scheme.department);
      const aliasesNorm = (scheme.historicalAliases || []).map(a => normalizeSchemeText(a)).join(' ');
      const benefitNorm = normalizeSchemeText(scheme.benefitDetails + ' ' + scheme.teBenefitDetails + ' ' + (scheme.benefitAmount || ''));
      const eligNorm = (scheme.eligibilityCriteria.additionalRules || []).join(' ') + ' ' + (scheme.eligibilityCriteria.teAdditionalRules || []).join(' ');
      const eligNormClean = normalizeSchemeText(eligNorm);
      const docsNorm = (scheme.requiredDocuments || []).join(' ') + ' ' + (scheme.teRequiredDocuments || []).join(' ');
      const docsNormClean = normalizeSchemeText(docsNorm);
      const stepsNorm = (scheme.applicationSteps || []).join(' ') + ' ' + (scheme.teApplicationSteps || []).join(' ');
      const stepsNormClean = normalizeSchemeText(stepsNorm);

      let score = 0;

      // 1. Exact full query phrase match
      if (nameNorm.includes(normalizedQuery) || teNameNorm.includes(normalizedQuery)) {
        score += 50;
      } else if (aliasesNorm.includes(normalizedQuery)) {
        score += 40;
      } else if (sumNorm.includes(normalizedQuery) || teSumNorm.includes(normalizedQuery)) {
        score += 30;
      } else if (descNorm.includes(normalizedQuery) || teDescNorm.includes(normalizedQuery)) {
        score += 20;
      }

      // Special check: Rythu Bharosa -> Annadata Sukhibhava
      if (isRythuBharosaSearch && scheme.id === 'annadata-sukhibhava-ap') {
        score += 45;
      }

      // 2. Tokenized & Synonym Matching
      let matchedTokenCount = 0;

      for (const token of queryTokens) {
        if (GENERIC_STOP_WORDS.has(token) && substantiveTokens.length > 0) continue;
        let tokenMatched = false;

        // Direct token match in name
        if (nameNorm.includes(token) || teNameNorm.includes(token) || (hiNameNorm && hiNameNorm.includes(token))) {
          score += 25;
          tokenMatched = true;
        }
        // Direct token in aliases or category
        else if (aliasesNorm.includes(token) || catNorm.includes(token)) {
          score += 20;
          tokenMatched = true;
        }
        // Direct token in summary or description
        else if (sumNorm.includes(token) || teSumNorm.includes(token) || descNorm.includes(token) || teDescNorm.includes(token)) {
          score += 15;
          tokenMatched = true;
        }
        // Direct token in benefits or eligibility or docs or steps
        else if (benefitNorm.includes(token) || eligNormClean.includes(token) || docsNormClean.includes(token) || stepsNormClean.includes(token) || deptNorm.includes(token)) {
          score += 10;
          tokenMatched = true;
        }

        if (tokenMatched) {
          matchedTokenCount++;
        }
      }

      // 3. Synonym Group Matching (if not directly matched)
      if (matchedTokenCount === 0 || score < 15) {
        for (const syn of expandedTokens) {
          if (syn.length <= 2 || GENERIC_STOP_WORDS.has(syn)) continue;

          if (nameNorm.includes(syn) || teNameNorm.includes(syn)) {
            score += 20;
            matchedTokenCount++;
          } else if (aliasesNorm.includes(syn) || catNorm.includes(syn)) {
            score += 16;
            matchedTokenCount++;
          } else if (sumNorm.includes(syn) || teSumNorm.includes(syn) || descNorm.includes(syn) || teDescNorm.includes(syn)) {
            score += 12;
            matchedTokenCount++;
          } else if (benefitNorm.includes(syn) || eligNormClean.includes(syn) || docsNormClean.includes(syn) || stepsNormClean.includes(syn)) {
            score += 8;
            matchedTokenCount++;
          }
        }
      }

      // 4. Fuzzy typo matching for longer words
      if (score === 0) {
        for (const token of queryTokens) {
          if (token.length >= 4 && !GENERIC_STOP_WORDS.has(token)) {
            const wordsInName = nameNorm.split(' ').concat(catNorm.split(' '));
            for (const word of wordsInName) {
              if (fuzzyWordMatch(token, word)) {
                score += 12;
                matchedTokenCount++;
                break;
              }
            }
          }
        }
      }

      // Relevance threshold: require at least 15 points
      if (score >= 15) {
        scoredSchemes.push({ scheme, score });
      }
    }
  }

  // Sort by relevance score descending
  scoredSchemes.sort((a, b) => b.score - a.score);
  const results = scoredSchemes.map(s => s.scheme);

  return {
    schemes: results,
    totalMatches: results.length,
    totalVerifiedInDatabase,
    crossServiceMatch,
    explanatoryNotice
  };
}
