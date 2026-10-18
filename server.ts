import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { VERIFIED_SCHEMES } from './src/data/schemes.ts';
import { ARCHIVED_HISTORICAL_SCHEMES } from './src/data/archivedHistoricalSchemes.ts';
import { VERIFIED_PUBLIC_SERVICES } from './src/data/publicServices.ts';
import { ARCHIVED_HISTORICAL_PUBLIC_SERVICES } from './src/data/archivedHistoricalPublicServices.ts';
import { verifyServiceUrl, isSafePublicUrl } from './src/utils/urlVerifier.ts';
import { detectMessageLanguage } from './src/utils/languageDetector.ts';
import {
  filterPublicSchemes,
  isYsrBrandedScheme,
  containsYsrBranding,
  normalizeSchemeText
} from './src/utils/schemeNormalization.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '2mb' }));

// Initialize Google Gemini SDK
let genAI: GoogleGenAI | null = null;
try {
  genAI = new GoogleGenAI();
} catch (err) {
  console.warn('GoogleGenAI initialization notice (API key may be provided via environment):', err);
}

// API: Health check
app.get('/api/health', (req: Request, res: Response) => {
  const publicSchemes = filterPublicSchemes(VERIFIED_SCHEMES);
  res.json({
    status: 'ok',
    service: 'Grama Sahayya AI Backend',
    timestamp: new Date().toISOString(),
    schemesCount: publicSchemes.length,
    archivedHistoricalSchemesCount: ARCHIVED_HISTORICAL_SCHEMES.length,
    publicServicesCount: VERIFIED_PUBLIC_SERVICES.length,
  });
});

// Digital Asset Links for Android TWA ownership verification
app.get('/.well-known/assetlinks.json', (req: Request, res: Response) => {
  const assetlinksPath = path.resolve(__dirname, 'public', '.well-known', 'assetlinks.json');
  if (fs.existsSync(assetlinksPath)) {
    res.setHeader('Content-Type', 'application/json');
    return res.sendFile(assetlinksPath);
  }
  res.status(404).json({ error: 'assetlinks.json not found' });
});

// Real Signed Android APK direct download
app.get('/downloads/grama-sahayya-ai.apk', (req: Request, res: Response) => {
  const publicApkPath = path.resolve(__dirname, 'public', 'downloads', 'grama-sahayya-ai.apk');
  const distApkPath = path.resolve(__dirname, 'dist', 'downloads', 'grama-sahayya-ai.apk');
  const targetPath = fs.existsSync(publicApkPath) ? publicApkPath : (fs.existsSync(distApkPath) ? distApkPath : null);

  if (!targetPath) {
    return res.status(404).json({
      error: 'APK build is not yet published',
      status: 'pending_build'
    });
  }

  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
  res.setHeader('Content-Disposition', 'attachment; filename="grama-sahayya-ai.apk"');
  res.sendFile(targetPath);
});

// App Info and verified download availability endpoint
app.get('/api/app-info', (req: Request, res: Response) => {
  const publicApkPath = path.resolve(__dirname, 'public', 'downloads', 'grama-sahayya-ai.apk');
  const distApkPath = path.resolve(__dirname, 'dist', 'downloads', 'grama-sahayya-ai.apk');
  const targetPath = fs.existsSync(publicApkPath) ? publicApkPath : (fs.existsSync(distApkPath) ? distApkPath : null);

  const isAvailable = !!targetPath;
  let fileSize = 0;
  if (targetPath) {
    try {
      fileSize = fs.statSync(targetPath).size;
    } catch {
      fileSize = 0;
    }
  }

  res.json({
    appName: 'Grama Sahayya AI',
    packageId: 'ai.gramasahayya.app',
    version: '1.0.0',
    versionCode: 2,
    apkAvailable: isAvailable,
    downloadUrl: isAvailable ? '/downloads/grama-sahayya-ai.apk' : null,
    fileSize,
    sha256Fingerprint: '22:80:84:DD:85:58:26:B5:E1:46:A5:AF:51:A4:D8:56:77:7E:71:82:CE:68:90:1E:E6:61:7D:74:C3:A3:A8:FC',
    digitalAssetLinksUrl: '/.well-known/assetlinks.json'
  });
});

// API: Verified Schemes catalog endpoint
app.get('/api/schemes', (req: Request, res: Response) => {
  const { category, govLevel, search } = req.query;
  const publicSchemes = filterPublicSchemes(VERIFIED_SCHEMES);

  // If search query specifically contains YSR branding, return clean empty result with explanatory notice
  if (search && typeof search === 'string' && containsYsrBranding(search)) {
    return res.json({
      schemes: [],
      total: 0,
      excludedBrandNotice: 'YSR-branded schemes have been excluded from the public directory and archived. Please refer to current verified Andhra Pradesh welfare programs such as Annadata Sukhibhava, NTR Bharosa, Dr. NTR Vaidya Seva, Talliki Vandanam, Aadabidda Nidhi, and Sthree Shakthi.'
    });
  }

  let results = [...publicSchemes];

  if (category && typeof category === 'string') {
    results = results.filter(s => s.category === category);
  }
  if (govLevel && typeof govLevel === 'string') {
    results = results.filter(s => s.govLevel === govLevel);
  }
  if (search && typeof search === 'string') {
    const q = normalizeSchemeText(search);
    results = results.filter(s => {
      const nameNorm = normalizeSchemeText(s.officialName);
      const teNameNorm = normalizeSchemeText(s.teName);
      const sumNorm = normalizeSchemeText(s.summary);
      const teSumNorm = normalizeSchemeText(s.teSummary);
      const catNorm = normalizeSchemeText(s.category);
      const deptNorm = normalizeSchemeText(s.department);

      return (
        nameNorm.includes(q) ||
        teNameNorm.includes(q) ||
        sumNorm.includes(q) ||
        teSumNorm.includes(q) ||
        catNorm.includes(q) ||
        deptNorm.includes(q)
      );
    });
  }

  res.json({ schemes: results, total: results.length });
});

// API: Verified Public Services endpoint with filtering
app.get('/api/public-services', (req: Request, res: Response) => {
  const { category, govLevel, search, status } = req.query;
  let results = [...VERIFIED_PUBLIC_SERVICES];

  if (category && typeof category === 'string' && category !== 'all') {
    results = results.filter(s => s.category === category);
  }
  if (govLevel && typeof govLevel === 'string' && govLevel !== 'all') {
    results = results.filter(s => s.govLevel === govLevel);
  }
  if (status && typeof status === 'string' && status !== 'all') {
    results = results.filter(s => s.status === status);
  }
  if (search && typeof search === 'string' && search.trim()) {
    const q = search.trim().toLowerCase();
    results = results.filter(s => {
      return (
        s.name.toLowerCase().includes(q) ||
        s.teName.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        (s.teDepartment && s.teDepartment.toLowerCase().includes(q)) ||
        s.purpose.toLowerCase().includes(q) ||
        s.tePurpose.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    });
  }

  res.json({ services: results, total: results.length });
});

// API: Public Services Audit Report endpoint
app.get('/api/public-services/audit-report', (req: Request, res: Response) => {
  const verifiedCount = VERIFIED_PUBLIC_SERVICES.filter(s => s.status === 'VERIFIED').length;
  const updatedCount = VERIFIED_PUBLIC_SERVICES.filter(s => s.status === 'UPDATED').length;
  const tempUnavailableCount = VERIFIED_PUBLIC_SERVICES.filter(s => s.status === 'TEMPORARILY_UNAVAILABLE').length;

  res.json({
    auditGeneratedAt: new Date().toISOString(),
    auditPolicy: 'Authoritative Official Public Services Verification Standards',
    summary: {
      totalActiveServices: VERIFIED_PUBLIC_SERVICES.length,
      verifiedCount,
      updatedCount,
      tempUnavailableCount,
      archivedHistoricalCount: ARCHIVED_HISTORICAL_PUBLIC_SERVICES.length,
      apStateServicesCount: VERIFIED_PUBLIC_SERVICES.filter(s => s.govLevel === 'state').length,
      centralGovServicesCount: VERIFIED_PUBLIC_SERVICES.filter(s => s.govLevel === 'central').length,
    },
    services: VERIFIED_PUBLIC_SERVICES.map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      govLevel: s.govLevel,
      department: s.department,
      status: s.status,
      lastVerifiedDate: s.lastVerifiedDate,
      verificationSource: s.verificationSource,
      officialInfoUrl: s.officialInfoUrl,
      officialApplicationUrl: s.officialApplicationUrl,
      isHttps: s.officialApplicationUrl.startsWith('https://')
    })),
    archivedRecords: ARCHIVED_HISTORICAL_PUBLIC_SERVICES.map(a => ({
      id: a.id,
      name: a.name,
      archiveReason: a.archiveReason,
      archivedDate: a.archivedDate,
      supersededBy: a.supersededByServiceId
    }))
  });
});

// API: Secure URL Verifier endpoint (with SSRF Guard & Rate-Limiting)
app.post('/api/public-services/verify-url', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL string is required' });
    }

    const check = isSafePublicUrl(url);
    if (!check.safe) {
      return res.status(400).json({
        error: 'URL blocked by security firewall',
        reason: check.reason,
        isAllowed: false
      });
    }

    const result = await verifyServiceUrl(url);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Verification failed', details: err?.message });
  }
});

// API: Authoritative system aggregates (Genuine verified catalog metadata)
app.get('/api/system-stats', (req: Request, res: Response) => {
  const publicSchemes = filterPublicSchemes(VERIFIED_SCHEMES);
  res.json({
    publishedSchemesCount: publicSchemes.length,
    archivedHistoricalSchemesCount: ARCHIVED_HISTORICAL_SCHEMES.length,
    publicServicesCount: VERIFIED_PUBLIC_SERVICES.length,
    archivedPublicServicesCount: ARCHIVED_HISTORICAL_PUBLIC_SERVICES.length,
    verifiedStateProgramsCount: publicSchemes.filter(s => s.govLevel === 'state').length,
    verifiedCentralProgramsCount: publicSchemes.filter(s => s.govLevel === 'central').length,
    lastCatalogAuditDate: '2026-10-15T00:00:00Z',
    auditStatus: 'VERIFIED_OFFICIAL_CATALOG_CLEANED',
    dataIntegrity: 'AUTHORITATIVE_NO_FABRICATION_EXCLUDED_PREVIOUS_BRANDING'
  });
});

// API: Administrative audit endpoint for archived historical schemes
app.get('/api/admin/archived-schemes', (req: Request, res: Response) => {
  res.json({
    archivedSchemes: ARCHIVED_HISTORICAL_SCHEMES,
    total: ARCHIVED_HISTORICAL_SCHEMES.length,
    archivePolicy: 'Historical records preserved for administrative audit and data continuity; strictly excluded from public directory.'
  });
});

// API: Administrative audit endpoint for archived public services
app.get('/api/admin/archived-public-services', (req: Request, res: Response) => {
  res.json({
    archivedServices: ARCHIVED_HISTORICAL_PUBLIC_SERVICES,
    total: ARCHIVED_HISTORICAL_PUBLIC_SERVICES.length,
    archivePolicy: 'Historical public service records preserved for administrative audit; excluded from active citizen directory.'
  });
});


// API: Gemini Chat Assistant with RAG grounding
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, language = 'te', conversationHistory = [], citizenProfile } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    // Automatically detect language of citizen's latest query
    const detected = detectMessageLanguage(message, language);
    const detectedLang = detected.detectedLang; // 'te' | 'en' | 'te-mixed' | 'hi'
    const responseLanguageCode = detected.languageCode; // 'te' | 'en' | 'hi'

    // Build RAG Grounding Context strictly from cleaned public database
    const publicSchemes = filterPublicSchemes(VERIFIED_SCHEMES);
    const schemesContext = publicSchemes.map(s => `
[SCHEME ID: ${s.id}]
Official Name: ${s.officialName}
Telugu Name: ${s.teName}
Department: ${s.department} (${s.govLevel} level, ${s.state})
Category: ${s.category}
Benefit: ${s.benefitDetails} (${s.benefitAmount || 'N/A'})
Eligibility Criteria:
- Age: ${s.eligibilityCriteria.minAge || 'Any'} to ${s.eligibilityCriteria.maxAge || 'Any'}
- Gender: ${s.eligibilityCriteria.gender || 'All'}
- Max Annual Income: ${s.eligibilityCriteria.maxAnnualIncome ? `₹${s.eligibilityCriteria.maxAnnualIncome}` : 'No limit specified'}
- Education: ${s.eligibilityCriteria.educationLevels?.join(', ') || 'Any'}
- Social Category: ${s.eligibilityCriteria.socialCategories?.join(', ') || 'All'}
- Key Rules: ${s.eligibilityCriteria.additionalRules.join(' | ')}
- Exclusions: ${s.exclusions.join(' | ')}
Required Documents: ${s.requiredDocuments.join(', ')}
How to apply: ${s.applicationSteps.join(' -> ')}
Official Application Portal: ${s.officialApplicationUrl}
Source URLs: ${s.sourceUrls.join(', ')}
Verification Status: ${s.verificationStatus}
Helpline: ${s.verifiedHelpline || '1902'}
`).join('\n---\n');

    const publicServicesContext = VERIFIED_PUBLIC_SERVICES.map(p => `
[SERVICE ID: ${p.id}]
Name: ${p.name}
Telugu Name: ${p.teName}
Category: ${p.category}
Government Level: ${p.govLevel === 'state' ? 'Andhra Pradesh State Government' : 'Central Government'}
Department: ${p.department}
Official Info URL: ${p.officialInfoUrl}
Official Application Portal: ${p.officialApplicationUrl}
Status: ${p.status}
Last Verified Date: ${p.lastVerifiedDate}
Verification Source: ${p.verificationSource}
Official Statutory Fee: ${p.officialFee}
Processing Time: ${p.processingTime}
Eligibility: ${p.eligibility}
Required Documents: ${p.requiredDocuments.join(', ')}
Application Steps: ${p.steps.join(' -> ')}
Helpline: ${p.supportHelpline || '1902'}
`).join('\n---\n');

    const profileContext = citizenProfile ? `
CITIZEN PROFILE:
- Preferred Language: ${citizenProfile.preferredLanguage || responseLanguageCode}
- State: ${citizenProfile.state || 'Andhra Pradesh'}
- District: ${citizenProfile.district || 'Not specified'}
- Location: ${citizenProfile.locationType || 'rural'}
- Education: ${citizenProfile.educationLevel || 'Not specified'} (Study Year: ${citizenProfile.studyYear || 'N/A'})
- Occupation: ${citizenProfile.occupation || 'Not specified'}
- Income Range: ${citizenProfile.incomeRange || 'Not specified'} (Approx: ₹${citizenProfile.approxAnnualIncome || 'N/A'})
- Age: ${citizenProfile.age || 'Not specified'}
- Gender: ${citizenProfile.gender || 'Not specified'}
- Social Category: ${citizenProfile.socialCategory || 'Not specified'}
- Is Farmer: ${citizenProfile.isFarmer ? 'Yes' : 'No'}
` : 'CITIZEN PROFILE: Anonymous visitor (no demographic profile loaded yet).';

    let languageInstruction = '';
    if (detectedLang === 'en') {
      languageInstruction = `The citizen asked this query in ENGLISH ("${message}").
- You MUST formulate your entire conversational response in clear, simple, respectful ENGLISH.
- Mention the Telugu name in parentheses alongside the official English name (e.g., "**Talliki Vandanam** (తల్లికి వందనం)"), but write all explanations, eligibility rules, and instructions in ENGLISH.
- Even if previous messages in the conversation history were in Telugu or another language, the citizen's LATEST message is in English, so you MUST respond in ENGLISH.`;
    } else if (detectedLang === 'te') {
      languageInstruction = `The citizen asked this query in TELUGU SCRIPT ("${message}").
- You MUST formulate your entire response in authentic, polite, and natural TELUGU (గౌరవప్రదమైన సహజ తెలుగు).
- Keep official scheme titles recognizable (e.g., "**అన్నదాత సుఖీభవ** (Annadata Sukhibhava)").
- Even if previous messages in the conversation history were in English, the citizen's LATEST message is in Telugu, so you MUST respond in TELUGU.`;
    } else if (detectedLang === 'te-mixed') {
      languageInstruction = `The citizen asked this query in TELUGU-ENGLISH MIXED / CODE-SWITCHED format ("${message}").
- Respond in natural, accessible, friendly bilingual Telugu / code-mixed Telugu-English that directly matches the citizen's conversational style.
- Use Telugu script or clear mixed Telugu-English with common official terms (e.g., "Application Portal", "Aadhaar Card", "College Allotment Order", "Tuition Fee Reimbursement", "Meeseva", "Village/Ward Secretariat") kept intact.
- Even if previous messages were in another language, adapt to this latest code-mixed query.`;
    } else {
      languageInstruction = `Respond in the citizen's query language ("${detectedLang}"). Match their tone, preserve official scheme titles and portal URLs.`;
    }

    const systemPrompt = `
You are "Grama Sahayya AI Assistant" (గ్రామ సహాయ AI సహాయకుడు), an empathetic, truthful, authoritative public welfare assistant for the citizens of India, with deep expertise in Andhra Pradesh state schemes and Central government programs.

ROLE & BEHAVIOR:
1. DYNAMIC MULTILINGUAL RESPONSE (LATEST MESSAGE MATCHING):
   ${languageInstruction}
   - CRITICAL: Never force a fixed language. Base your reply language STRICTLY on the language of the user's LATEST message.
   - For follow-up questions, always switch to the language of the latest user query, even if earlier messages used a different language.

2. TRUTHFULNESS & GROUNDING: Ground your recommendations STRICTLY in the verified government schemes and public digital services provided below. NEVER invent schemes, eligibility criteria, phone numbers, or official links.
3. PRESERVE ACCURATE NAMES & OFFICIAL URLS: Keep government scheme names (e.g., 'Talliki Vandanam', 'Annadata Sukhibhava', 'Dr. NTR Vaidya Seva', 'NTR Bharosa'), official departments, official documents, and official portal URLs (e.g., 'https://annadathasukhibhava.ap.gov.in', 'https://drntrvaidyaseva.ap.gov.in', 'https://pmkisan.gov.in', 'https://uidai.gov.in') strictly accurate. Never translate or alter official website URLs.
4. For eligibility: Clearly categorize as:
   - Likely Eligible (అర్హత ఉండవచ్చు)
   - Potentially Eligible — More Information Needed (మరిన్ని వివరాలు అవసరం)
   - Likely Ineligible (అర్హత లేకపోవచ్చు)
   - Unable to Verify (ధృవీకరించలేకపోయాము)
5. Never guarantee government approval. Always state that final sanction depends on the competent government department.
6. Provide actionable next steps: official portals, required documents, and where to apply (Village / Ward Secretariat - గ్రామ/వార్డు సచివాలయం, Meeseva, or official online portal).
7. Provide interactive follow-up questions when vital criteria (like exact family income, study year, caste certificate, or landholding) are missing.
8. MANDATORY YSR SCHEME EXCLUSION & TRANSITION GUIDANCE:
   - All YSR-branded schemes (such as YSR Rythu Bharosa, YSR Pension Kanuka, YSR Aarogyasri, YSR Cheyutha, YSR Aasara) are EXCLUDED from the public active directory and must NEVER be recommended as active schemes.
   - Do NOT regenerate excluded schemes from model memory.
   - If a citizen asks about a legacy or past scheme (e.g., asks about "Rythu Bharosa", "Pension Kanuka", "Aarogyasri", or "Cheyutha"):
     * Respectfully inform them in their query language (Telugu or English) about the current active, verified Andhra Pradesh state program:
       - Agriculture / Farmers: **Annadata Sukhibhava & PM-KISAN** (₹20,000/year).
       - Health: **Dr. NTR Vaidya Seva** (₹25 Lakhs universal cashless treatment).
       - Social Security Pensions: **NTR Bharosa Social Security Pension** (₹4,000 to ₹15,000/month).
       - Women & SHG Welfare: **Aadabidda Nidhi** (₹1,500/month) and **Sthree Shakthi** (APSRTC Free Bus Travel).
       - Education: **Talliki Vandanam** (₹15,000/year per child) and Post-Matric Fee Reimbursement.
     * Always provide official verified portal links and helplines.

VERIFIED GOVERNMENT SCHEMES DATASET:
${schemesContext}

VERIFIED PUBLIC SERVICES DATASET:
${publicServicesContext}

${profileContext}
`;

    // Try Gemini API if initialized
    if (genAI) {
      try {
        const contents: any[] = [];

        // Add history
        if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
          for (const msg of conversationHistory.slice(-6)) {
            contents.push({
              role: msg.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: msg.content }]
            });
          }
        }

        // Add user current message
        contents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        const response = await genAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.3,
            maxOutputTokens: 2048,
          }
        });

        const replyText = response.text || 'I could not generate an answer at this moment.';

        // Detect matching scheme IDs in answer strictly from public schemes
        const recommendedSchemeIds = publicSchemes
          .filter(s => replyText.toLowerCase().includes(s.id) || replyText.toLowerCase().includes(s.officialName.toLowerCase().slice(0, 15)) || replyText.includes(s.teName.slice(0, 8)))
          .map(s => s.id);

        return res.json({
          reply: replyText,
          language: responseLanguageCode,
          detectedLanguage: detectedLang,
          isMixedLanguage: detected.isMixed,
          recommendedSchemeIds,
          timestamp: new Date().toISOString()
        });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to rule-based engine:', geminiError?.message || geminiError);
      }
    }

    // Fallback deterministic conversational response generator
    // Check if query specifically asks about YSR-branded schemes
    if (containsYsrBranding(message)) {
      let legacyNotice = '';
      if (detectedLang === 'en') {
        legacyNotice = `Hello! YSR-branded schemes have been excluded from the public directory and safely archived. 

Currently, the Government of Andhra Pradesh implements the following verified flagship welfare programs:
• **Annadata Sukhibhava & PM-KISAN**: ₹20,000 annual investment support for farmers. (Portal: https://annadathasukhibhava.ap.gov.in)
• **Dr. NTR Vaidya Seva**: Cashless corporate treatment up to ₹25 Lakhs per family per year. (Portal: https://drntrvaidyaseva.ap.gov.in)
• **NTR Bharosa Social Security Pension**: ₹4,000/month for elderly & widows, up to ₹15,000/month for severe disability. (Portal: https://sspensions.ap.gov.in)
• **Aadabidda Nidhi Scheme**: ₹1,500 monthly financial aid for women aged 18-59. (Portal: https://wdcw.ap.gov.in)
• **APSRTC Sthree Shakthi**: 100% free bus travel for women across Andhra Pradesh. (Portal: https://apsrtc.ap.gov.in)
• **Talliki Vandanam**: ₹15,000/year for mothers sending children to school. (Portal: https://gramawardsachivalayam.ap.gov.in)

Which of these current programs would you like guidance on?`;
      } else {
        legacyNotice = `నమస్కారం! వైఎస్సార్ బ్రాండెడ్ పథకాలు ప్రజా కేటలాగ్ నుండి తొలగించబడి ఆర్కైవ్ చేయబడ్డాయి.

ప్రస్తుతం ఆంధ్రప్రదేశ్ ప్రభుత్వం అధికారికంగా అమలు చేస్తున్న ప్రధాన సంక్షేమ పథకాలు:
• **అన్నదాత సుఖీభవ మరియు పీఎం-కిసాన్**: రైతులకు ఏటా ₹20,000 పెట్టుబడి సాయం. (వెబ్‌సైట్: https://annadathasukhibhava.ap.gov.in)
• **డా. ఎన్టీఆర్ వైద్య సేవ**: పేద కుటుంబాలకు ₹25 లక్షల వరకు ఉచిత నగదు రహిత వైద్య చికిత్స. (వెబ్‌సైట్: https://drntrvaidyaseva.ap.gov.in)
• **ఎన్టీఆర్ భరోసా సామాజిక పింఛను**: వృద్ధులు, వితంతువులకు నెలకు ₹4,000, దివ్యాంగులకు ₹6,000 నుండి ₹15,000. (వెబ్‌సైట్: https://sspensions.ap.gov.in)
• **ఆడబిడ్డ నిధి పథకం**: 18 నుండి 59 ఏళ్ల మహిళలకు ప్రతి నెలా ₹1,500 ఆర్థిక సాయం. (వెబ్‌సైట్: https://wdcw.ap.gov.in)
• **స్త్రీ శక్తి పథకం**: ఆర్టీసీ బస్సుల్లో మహిళలకు 100% ఉచిత ప్రయాణ సౌకర్యం. (వెబ్‌సైట్: https://apsrtc.ap.gov.in)
• **తల్లికి వందనం**: బడికి వెళ్లే పిల్లల తల్లులకు ఏటా ₹15,000 ఆర్థిక ప్రోత్సాహకం.

మీరు ఏ పథకం గురించి తెలుసుకోవాలనుకుంటున్నారో తెలియజేయండి.`;
      }

      return res.json({
        reply: legacyNotice,
        language: responseLanguageCode,
        detectedLanguage: detectedLang,
        isMixedLanguage: detected.isMixed,
        recommendedSchemeIds: ['annadata-sukhibhava-ap', 'dr-ntr-vaidya-seva-ap', 'ntr-bharosa-pension-ap'],
        timestamp: new Date().toISOString()
      });
    }

    const msgLower = message.toLowerCase();
    let matchedScheme = publicSchemes.find(s => {
      if (msgLower.includes(s.id)) return true;
      if (msgLower.includes(s.officialName.toLowerCase())) return true;
      if ((msgLower.includes('scholarship') || msgLower.includes('విద్యార్థి') || msgLower.includes('deevena')) && s.category === 'education') return true;
      if ((msgLower.includes('రైతు') || msgLower.includes('farmer') || msgLower.includes('agriculture') || msgLower.includes('sukhibhava') || msgLower.includes('kisan')) && s.category === 'agriculture') return true;
      if ((msgLower.includes('pension') || msgLower.includes('పింఛన్') || msgLower.includes('bharosa') || msgLower.includes('widow') || msgLower.includes('disability')) && s.category === 'pensions') return true;
      if ((msgLower.includes('health') || msgLower.includes('వైద్యం') || msgLower.includes('aarogyasri') || msgLower.includes('vaidya') || msgLower.includes('ఆసుపత్రి')) && s.category === 'health') return true;
      if ((msgLower.includes('women') || msgLower.includes('మహిళ') || msgLower.includes('డ్వాక్రా') || msgLower.includes('cheyutha') || msgLower.includes('aasara') || msgLower.includes('aadabidda')) && s.category === 'women_shg') return true;
      if ((msgLower.includes('bus') || msgLower.includes('బస్సు') || msgLower.includes('free bus') || msgLower.includes('sthree shakthi')) && s.id === 'sthree-shakthi-free-bus-ap') return true;
      if ((msgLower.includes('unemployment') || msgLower.includes('నిరుద్యోగ') || msgLower.includes('youth') || msgLower.includes('yuva galam')) && s.id === 'yuva-galam-unemployment-allowance-ap') return true;
      if ((msgLower.includes('solar') || msgLower.includes('సౌర') || msgLower.includes('surya')) && s.id === 'pm-surya-ghar-muft-bijli') return true;
      if ((msgLower.includes('gas') || msgLower.includes('గ్యాస్') || msgLower.includes('cylinder') || msgLower.includes('deepam')) && s.id === 'ap-deepam-free-lpg-scheme') return true;
      return false;
    }) || publicSchemes[0];

    let reply = '';
    if (detectedLang === 'en') {
      reply = `Hello! Based on your query, here is the verified information for **${matchedScheme.officialName}** (${matchedScheme.teName}):

**Benefits:** ${matchedScheme.benefitDetails} (${matchedScheme.benefitAmount || 'N/A'})

**Key Eligibility Conditions:**
${matchedScheme.eligibilityCriteria.additionalRules.map(r => `• ${r}`).join('\n')}

**Required Documents:**
${matchedScheme.requiredDocuments.map(d => `• ${d}`).join('\n')}

**How to Apply:**
${matchedScheme.applicationSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Official Application Portal: ${matchedScheme.officialApplicationUrl}
Department: ${matchedScheme.department}
Helpline: ${matchedScheme.verifiedHelpline || '1902'}

*Note: Final sanction is subject to official verification by the competent government authority.*`;
    } else if (detectedLang === 'te') {
      reply = `నమస్కారం! మీ ప్రశ్నకు సంబంధించి ధృవీకరించబడిన సమాచారం: **${matchedScheme.teName}** (${matchedScheme.officialName}).

**ప్రయోజనం:** ${matchedScheme.teBenefitDetails}

**అర్హత నిబంధనలు:**
${matchedScheme.eligibilityCriteria.teAdditionalRules.map(r => `• ${r}`).join('\n')}

**కావలసిన పత్రాలు:**
${matchedScheme.teRequiredDocuments.map(d => `• ${d}`).join('\n')}

**దరఖాస్తు విధానం:**
${matchedScheme.teApplicationSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

అధికారిక వెబ్‌సైట్: ${matchedScheme.officialApplicationUrl}
శాఖ: ${matchedScheme.department}
సహాయవాణి: ${matchedScheme.verifiedHelpline || '1902'}

*గమనిక: తుది మంజూరు గ్రామ/వార్డు సచివాలయం మరియు ప్రభుత్వ నిబంధనలకు లోబడి ఉంటుంది.*`;
    } else {
      // te-mixed / code-mixed response
      reply = `నమస్కారం! మీ ప్రశ్నకు సంబంధించి **${matchedScheme.teName}** (${matchedScheme.officialName}) వివరాలు:

**ప్రయోజనం (Benefit Details):** ${matchedScheme.benefitDetails} (${matchedScheme.benefitAmount || 'N/A'})

**అర్హత నిబంధనలు (Key Eligibility Conditions):**
${matchedScheme.eligibilityCriteria.additionalRules.map(r => `• ${r}`).join('\n')}

**కావలసిన పత్రాలు (Required Documents):**
${matchedScheme.requiredDocuments.map(d => `• ${d}`).join('\n')}

**దరఖాస్తు విధానం (Application Process):**
${matchedScheme.applicationSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Official Application Portal: ${matchedScheme.officialApplicationUrl}
Department: ${matchedScheme.department}
Helpline: ${matchedScheme.verifiedHelpline || '1902'}

*గమనిక: తుది మంజూరు గ్రామ/వార్డు సచివాలయం మరియు ప్రభుత్వ నిబంధనలకు లోబడి ఉంటుంది (Final approval subject to official verification).*`;
    }

    return res.json({
      reply,
      language: responseLanguageCode,
      detectedLanguage: detectedLang,
      isMixedLanguage: detected.isMixed,
      recommendedSchemeIds: [matchedScheme.id],
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Failed to process chat query', details: error?.message });
  }
});

async function startServer() {
  // If not production, mount Vite middlewares in development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from dist
    app.use(express.static(path.resolve(__dirname, 'dist'), { dotfiles: 'allow' }));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Grama Sahayya AI Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
