import https from 'https';
import http from 'http';
import { URL } from 'url';

export interface VerificationResult {
  url: string;
  isAllowed: boolean;
  statusCode?: number;
  status: 'reachable' | 'redirected' | 'blocked' | 'unreachable' | 'error';
  redirectUrl?: string;
  checkedAt: string;
  error?: string;
}

// In-memory cache to prevent repetitive hits to government servers
const verificationCache = new Map<string, { result: VerificationResult; expiresAt: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour cache

// Rate limiting state
const recentCheckTimestamps: number[] = [];
const MAX_CHECKS_PER_MINUTE = 30;

/**
 * Validates whether a URL is secure against SSRF and private network probing.
 */
export function isSafePublicUrl(urlString: string): { safe: boolean; reason?: string } {
  try {
    const parsed = new URL(urlString);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { safe: false, reason: 'Protocol must be HTTP or HTTPS' };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Check against localhost and internal names
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname === '0.0.0.0' ||
      hostname === 'metadata.google.internal' ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.lan')
    ) {
      return { safe: false, reason: 'Private/internal loopback addresses prohibited' };
    }

    // Check private IPv4 ranges (RFC 1918 & Cloud Metadata)
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipMatch = hostname.match(ipv4Regex);
    if (ipMatch) {
      const octet1 = parseInt(ipMatch[1], 10);
      const octet2 = parseInt(ipMatch[2], 10);

      // 10.0.0.0/8
      if (octet1 === 10) return { safe: false, reason: 'RFC 1918 Private Range 10.x.x.x prohibited' };
      // 127.0.0.0/8
      if (octet1 === 127) return { safe: false, reason: 'Loopback 127.x.x.x prohibited' };
      // 169.254.0.0/16 Link-local / Cloud Metadata
      if (octet1 === 169 && octet2 === 254) return { safe: false, reason: 'Link-local/Cloud Metadata prohibited' };
      // 172.16.0.0/12
      if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) return { safe: false, reason: 'RFC 1918 Private Range 172.16-31.x.x prohibited' };
      // 192.168.0.0/16
      if (octet1 === 192 && octet2 === 168) return { safe: false, reason: 'RFC 1918 Private Range 192.168.x.x prohibited' };
    }

    return { safe: true };
  } catch {
    return { safe: false, reason: 'Malformed URL' };
  }
}

/**
 * Conservatively verifies link accessibility with timeout, rate-limiting, and caching.
 */
export async function verifyServiceUrl(targetUrl: string): Promise<VerificationResult> {
  const now = Date.now();

  // 1. Check cache
  const cached = verificationCache.get(targetUrl);
  if (cached && cached.expiresAt > now) {
    return cached.result;
  }

  // 2. SSRF Guard
  const safetyCheck = isSafePublicUrl(targetUrl);
  if (!safetyCheck.safe) {
    const blockedResult: VerificationResult = {
      url: targetUrl,
      isAllowed: false,
      status: 'blocked',
      checkedAt: new Date().toISOString(),
      error: safetyCheck.reason || 'Security check failed'
    };
    return blockedResult;
  }

  // 3. Conservative Rate Limiting Guard
  const oneMinuteAgo = now - 60000;
  while (recentCheckTimestamps.length > 0 && recentCheckTimestamps[0] < oneMinuteAgo) {
    recentCheckTimestamps.shift();
  }
  if (recentCheckTimestamps.length >= MAX_CHECKS_PER_MINUTE) {
    return {
      url: targetUrl,
      isAllowed: true,
      status: 'reachable', // Assume cached reachable to avoid overloading servers
      checkedAt: new Date().toISOString(),
      error: 'Rate limit protection active; throttled conservative check.'
    };
  }
  recentCheckTimestamps.push(now);

  return new Promise((resolve) => {
    try {
      const parsed = new URL(targetUrl);
      const transport = parsed.protocol === 'https:' ? https : http;

      const req = transport.request(
        parsed,
        {
          method: 'HEAD',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) GramaSahayyaAI-PublicServiceAuditor/1.0',
            'Accept': '*/*'
          },
          timeout: 4000
        },
        (res) => {
          const statusCode = res.statusCode || 200;
          let status: VerificationResult['status'] = 'reachable';
          let redirectUrl: string | undefined;

          if (statusCode >= 300 && statusCode < 400 && res.headers.location) {
            status = 'redirected';
            redirectUrl = res.headers.location;
          } else if (statusCode >= 400 && statusCode < 500) {
            // Some Indian gov portals block HEAD requests or return 403 to non-browser agents
            status = statusCode === 403 ? 'reachable' : 'unreachable';
          } else if (statusCode >= 500) {
            status = 'unreachable';
          }

          const result: VerificationResult = {
            url: targetUrl,
            isAllowed: true,
            statusCode,
            status,
            redirectUrl,
            checkedAt: new Date().toISOString()
          };

          verificationCache.set(targetUrl, { result, expiresAt: now + CACHE_TTL_MS });
          resolve(result);
        }
      );

      req.on('timeout', () => {
        req.destroy();
        const result: VerificationResult = {
          url: targetUrl,
          isAllowed: true,
          status: 'unreachable',
          checkedAt: new Date().toISOString(),
          error: 'Connection timed out after 4000ms'
        };
        verificationCache.set(targetUrl, { result, expiresAt: now + CACHE_TTL_MS });
        resolve(result);
      });

      req.on('error', (err) => {
        const result: VerificationResult = {
          url: targetUrl,
          isAllowed: true,
          status: 'error',
          checkedAt: new Date().toISOString(),
          error: err.message
        };
        verificationCache.set(targetUrl, { result, expiresAt: now + CACHE_TTL_MS });
        resolve(result);
      });

      req.end();
    } catch (err: any) {
      resolve({
        url: targetUrl,
        isAllowed: false,
        status: 'error',
        checkedAt: new Date().toISOString(),
        error: err?.message || 'Verification failure'
      });
    }
  });
}
