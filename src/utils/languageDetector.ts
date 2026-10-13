/**
 * Language Detector Utility for Grama Sahayya AI
 * Accurately detects English, Telugu (తెలుగు script), and Telugu-English mixed / transliterated messages.
 */

export interface LanguageDetectionResult {
  detectedLang: 'te' | 'en' | 'te-mixed' | 'hi' | string;
  languageCode: 'te' | 'en' | string;
  isMixed: boolean;
  confidence: number;
  hasTeluguScript: boolean;
  hasLatinScript: boolean;
  matchedMarkers: string[];
  guidance: string;
}

// Grammatical markers indicating active Telugu syntax (interrogatives, verbs, postpositions, pronouns)
const TELUGU_GRAMMAR_MARKERS = new Set([
  // Interrogatives & Question words
  'ela', 'elaga', 'eppudu', 'ekkada', 'ekkadiki', 'emiti', 'enti', 'enduku', 
  'evarki', 'evariki', 'evaru', 'edhi', 'edi', 'entha', 'yentha', 'enni',

  // Prepositions / Postpositions / Conjunctions
  'kosam', 'gurinchi', 'dwara', 'dvara', 'valana', 'tho', 'thoti', 'nunchi', 
  'nundi', 'varaku', 'kante', 'leda', 'leka', 'inka',

  // Pronouns & Demonstratives
  'nenu', 'naaku', 'naku', 'naadi', 'meeru', 'meeku', 'miku', 'mee', 
  'manaki', 'mana', 'vaallu', 'vallu', 'valla', 'atanu', 'aame', 
  'idi', 'adi', 'dheeniki', 'deniki', 'deentlo', 'andulo', 'ippudu', 'appudu',

  // Verbs, Auxiliaries & Requests
  'cheppandi', 'cheppava', 'cheppu', 'cheyali', 'cheyandi', 'chesaru', 'chesanu',
  'ivvandi', 'ivvali', 'chudandi', 'chudali', 'telusukovali', 'teliyacheyandi',
  'vasthunda', 'vastunda', 'vasthundi', 'vastundi', 'untundhi', 'untundi',
  'untara', 'unnaya', 'unnara', 'undi', 'undha', 'unda', 'paduthundi', 
  'padutundi', 'padinda', 'vellali', 'raavali', 'ravali', 'kavali', 'kavala',
  'avuthunda', 'avutunda', 'cheyadam', 'cheyavacha', 'chesukovacha'
]);

// Scheme proper names or civic entity names (often mentioned in both English and Telugu)
const TELUGU_ENTITY_NAMES = new Set([
  'pathakam', 'padhakam', 'pathakalu', 'padhakalu', 'arhatalu', 'arhata', 
  'arhhatha', 'darakhasthu', 'darakhastu', 'darakastu', 'rythu', 'raithu', 
  'rythulu', 'vidyarthi', 'vidyarthulu', 'dabbu', 'dabbulu', 'illu', 
  'pensionu', 'ammavodi', 'sachivalayam', 'sachivalayamlo', 'meeseva',
  'deevena', 'bharosa', 'cheyutha', 'aasara', 'aarogyasri', 'kanuka', 'nestham'
]);

// Common English stop words / markers to reinforce English confidence
const ENGLISH_MARKERS = new Set([
  'what', 'how', 'when', 'where', 'why', 'who', 'which', 'can', 'could',
  'is', 'are', 'was', 'were', 'do', 'does', 'did', 'have', 'has', 'had',
  'will', 'would', 'should', 'the', 'this', 'that', 'these', 'those',
  'tell', 'explain', 'show', 'give', 'apply', 'eligibility', 'documents',
  'required', 'income', 'limit', 'scholarship', 'pension', 'service',
  'portal', 'website', 'status', 'online', 'office', 'citizen', 'government',
  'for', 'to', 'in', 'of', 'and', 'or', 'about', 'from', 'with', 'any'
]);

/**
 * Detect the language of a user message.
 * Supports:
 * - 'te': Pure Telugu script
 * - 'te-mixed': Telugu script mixed with English, or Romanized Telugu with English
 * - 'en': Standard English query
 * - other Indian scripts if present (e.g. Devanagari 'hi')
 */
export function detectMessageLanguage(
  message: string,
  fallbackLanguage: string = 'te'
): LanguageDetectionResult {
  if (!message || typeof message !== 'string') {
    return {
      detectedLang: fallbackLanguage,
      languageCode: fallbackLanguage,
      isMixed: false,
      confidence: 0,
      hasTeluguScript: false,
      hasLatinScript: false,
      matchedMarkers: [],
      guidance: `Defaulted to fallback (${fallbackLanguage})`
    };
  }

  const trimmed = message.trim();

  // 1. Script checks
  const teluguCharCount = (trimmed.match(/[\u0C00-\u0C7F]/g) || []).length;
  const latinCharCount = (trimmed.match(/[a-zA-Z]/g) || []).length;
  const devanagariCount = (trimmed.match(/[\u0900-\u097F]/g) || []).length;

  const hasTeluguScript = teluguCharCount > 0;
  const hasLatinScript = latinCharCount > 0;

  // 2. Devanagari script detection
  if (devanagariCount > 3 && devanagariCount >= latinCharCount && devanagariCount >= teluguCharCount) {
    return {
      detectedLang: 'hi',
      languageCode: 'hi',
      isMixed: hasLatinScript,
      confidence: 0.9,
      hasTeluguScript: false,
      hasLatinScript,
      matchedMarkers: [],
      guidance: 'Devanagari script detected'
    };
  }

  // 3. Telugu script detected
  if (hasTeluguScript) {
    // Check if significant Latin characters / English words are also present
    const words = trimmed.split(/\s+/);
    const latinWords = words.filter(w => /^[a-zA-Z0-9_-]+$/.test(w) && /[a-zA-Z]/.test(w));

    if (latinWords.length >= 1 && latinCharCount > 4) {
      return {
        detectedLang: 'te-mixed',
        languageCode: 'te',
        isMixed: true,
        confidence: 0.95,
        hasTeluguScript: true,
        hasLatinScript: true,
        matchedMarkers: latinWords,
        guidance: 'Mixed Telugu script with English vocabulary detected'
      };
    }

    return {
      detectedLang: 'te',
      languageCode: 'te',
      isMixed: false,
      confidence: 0.99,
      hasTeluguScript: true,
      hasLatinScript: false,
      matchedMarkers: [],
      guidance: 'Native Telugu script detected'
    };
  }

  // 4. Latin script analysis (English vs Romanized/Transliterated Telugu)
  const normalizedText = trimmed.toLowerCase();
  const tokens = normalizedText
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 0);

  const matchedTeluguMarkers: string[] = [];
  let grammarScore = 0;
  let entityScore = 0;
  let englishScore = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Check grammatical markers
    if (TELUGU_GRAMMAR_MARKERS.has(token)) {
      matchedTeluguMarkers.push(token);
      grammarScore += 2.0;
    }

    // Check entity names
    if (TELUGU_ENTITY_NAMES.has(token)) {
      entityScore += 1.0;
    }

    // Check two-word phrases like "apply cheyali"
    if (i < tokens.length - 1) {
      const phrase = `${token} ${tokens[i + 1]}`;
      if (phrase === 'apply cheyali' || phrase === 'apply cheyadam') {
        matchedTeluguMarkers.push(phrase);
        grammarScore += 3.0;
      }
    }

    // Check common Telugu case markers / suffixes: e.g. "deevenaki", "pathakaniki", "schemelo"
    if (
      token.length > 4 &&
      !ENGLISH_MARKERS.has(token) &&
      (token.endsWith('ki') || token.endsWith('ku') || token.endsWith('lo') || token.endsWith('tho') || token.endsWith('ni'))
    ) {
      const nonTeluguExceptions = ['into', 'onto', 'solo', 'polo', 'kilo', 'auto', 'photo', 'memo'];
      if (!nonTeluguExceptions.includes(token)) {
        matchedTeluguMarkers.push(token);
        grammarScore += 1.5;
      }
    }

    if (ENGLISH_MARKERS.has(token)) {
      englishScore += 1.0;
    }
  }

  // If active Telugu grammar markers are present (e.g. ela, emiti, kosam, cheppandi, undali)
  if (grammarScore >= 1.5 || (grammarScore >= 1.0 && entityScore >= 1.0)) {
    return {
      detectedLang: 'te-mixed',
      languageCode: 'te',
      isMixed: true,
      confidence: Math.min(0.95, 0.6 + (grammarScore + entityScore) * 0.1),
      hasTeluguScript: false,
      hasLatinScript: true,
      matchedMarkers: matchedTeluguMarkers,
      guidance: `Romanized Telugu-English detected with markers: [${matchedTeluguMarkers.join(', ')}]`
    };
  }

  // If predominantly English grammar, even if mentioning a Telugu scheme entity name
  if (englishScore >= 2.0 && grammarScore === 0) {
    return {
      detectedLang: 'en',
      languageCode: 'en',
      isMixed: false,
      confidence: 0.95,
      hasTeluguScript: false,
      hasLatinScript: true,
      matchedMarkers: [],
      guidance: 'English query detected with official scheme reference'
    };
  }

  // If strong English score
  if (englishScore > 0 || hasLatinScript) {
    return {
      detectedLang: 'en',
      languageCode: 'en',
      isMixed: false,
      confidence: 0.9,
      hasTeluguScript: false,
      hasLatinScript: true,
      matchedMarkers: [],
      guidance: 'English query detected'
    };
  }

  // Default fallback
  return {
    detectedLang: fallbackLanguage,
    languageCode: fallbackLanguage,
    isMixed: false,
    confidence: 0.5,
    hasTeluguScript: false,
    hasLatinScript: false,
    matchedMarkers: [],
    guidance: `Fallback applied (${fallbackLanguage})`
  };
}
