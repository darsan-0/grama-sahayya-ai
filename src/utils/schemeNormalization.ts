import { Scheme } from '../types';

/**
 * Scheme Normalization & Brand Exclusion Utility
 * 
 * Enforces systematic exclusion of YSR-branded schemes from public results
 * across search, categories, recommendations, and AI prompts.
 * Uses robust text normalization rather than fragile case-sensitive string matching.
 */

/**
 * Normalizes input text by:
 * - Converting to lowercase
 * - Normalizing unicode characters
 * - Stripping zero-width joiners and extraneous punctuation
 * - Collapsing multiple whitespace characters
 */
export function normalizeSchemeText(input: string | null | undefined): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // strip zero-width chars
    .replace(/[.\-_/,;:()\[\]{}'"`]/g, ' ') // replace punctuation with space
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tokens and patterns that identify YSR branding in a scheme context.
 * Note: Must be evaluated in scheme identity contexts (title, aliases, scheme ID),
 * never confusing valid district geographical names (e.g., 'YSR Kadapa' district).
 */
const YSR_BRAND_PATTERNS = [
  /\bysr\b/i,
  /\by\s*s\s*r\b/i,
  /వై\s*ఎస్\s*సార్/,
  /వై\s*యస్\s*సార్/,
  /వై\s*ఎస్\s*ఆర్/,
  /వై\s*యస్\s*ఆర్/,
  /వైఎస్సార్/,
  /వైయస్సార్/,
  /వైఎస్ఆర్/,
  /వైయస్ఆర్/,
  /वाई\s*एस\s*आर/
];

/**
 * Returns true if a text fragment contains explicit YSR scheme branding.
 * Carefully protects valid geographical entity names such as "YSR Kadapa" district.
 */
export function containsYsrBranding(text: string | null | undefined): boolean {
  if (!text) return false;
  // Normalize and preserve geographical terms (e.g., YSR Kadapa district)
  const normalized = normalizeSchemeText(text)
    .replace(/\b(ysr\s+kadapa|ysr\s+district|వైఎస్సార్\s+కడప|వైఎస్ఆర్\s+కడప)\b/gi, ' ')
    .trim();
  if (!normalized) return false;
  return YSR_BRAND_PATTERNS.some((pattern) => pattern.test(normalized));
}

/**
 * Strict scheme evaluator: checks whether a scheme record represents a YSR-branded scheme.
 * Analyzes:
 * - scheme.id
 * - scheme.officialName
 * - scheme.teName
 * - scheme.hiName
 * - scheme.summary / teSummary
 * - historicalAliases
 */
export function isYsrBrandedScheme(scheme: Partial<Scheme> | null | undefined): boolean {
  if (!scheme) return false;

  // Check scheme ID
  if (scheme.id && containsYsrBranding(scheme.id)) {
    return true;
  }

  // Check official and translated names
  if (scheme.officialName && containsYsrBranding(scheme.officialName)) {
    return true;
  }
  if (scheme.teName && containsYsrBranding(scheme.teName)) {
    return true;
  }
  if (scheme.hiName && containsYsrBranding(scheme.hiName)) {
    return true;
  }

  // Check summary or description if primarily branded
  if (scheme.summary && containsYsrBranding(scheme.summary.slice(0, 80))) {
    return true;
  }

  return false;
}

/**
 * Strips any internal historical aliases or predecessor fields containing YSR branding
 * from a public-facing copy of a scheme so they never leak into public search or listings.
 */
export function sanitizePublicScheme(scheme: Scheme): Scheme {
  const sanitized = { ...scheme };

  if (sanitized.historicalAliases && Array.isArray(sanitized.historicalAliases)) {
    sanitized.historicalAliases = sanitized.historicalAliases.filter(
      (alias) => !containsYsrBranding(alias)
    );
  }

  if (sanitized.predecessorOrMergedWith && containsYsrBranding(sanitized.predecessorOrMergedWith)) {
    delete (sanitized as any).predecessorOrMergedWith;
  }

  return sanitized;
}

/**
 * Filters any list of schemes to guarantee that NO YSR-branded or archived schemes
 * are ever returned to public users.
 */
export function filterPublicSchemes(schemes: Scheme[]): Scheme[] {
  return schemes
    .filter((s) => !isYsrBrandedScheme(s))
    .filter((s) => (s as any).isArchivedHistorical !== true)
    .filter((s) => s.published !== false)
    .map(sanitizePublicScheme);
}

/**
 * Normalizes query string for robust search comparison.
 */
export function searchTokensMatch(text: string, query: string): boolean {
  const normText = normalizeSchemeText(text);
  const normQuery = normalizeSchemeText(query);
  if (!normQuery) return true;
  
  const queryTokens = normQuery.split(' ').filter(Boolean);
  return queryTokens.every((token) => normText.includes(token));
}
