import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChatMessageContent, isSafeUrl, normalizeMarkdownContent } from '../src/components/ChatMessageContent';

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

console.log('--- RUNNING GRAMA SAHAYYA AI: CHAT MARKDOWN RENDERING TEST SUITE ---\n');

// =========================================================================
// 1. URL Safety & Sanitization Checks
// =========================================================================
assert(isSafeUrl('https://www.india.gov.in/'), 'HTTPS protocol is accepted as safe');
assert(isSafeUrl('http://drntrvaidyaseva.ap.gov.in'), 'HTTP protocol is accepted as safe');
assert(isSafeUrl('mailto:support@gramasahayya.gov.in'), 'Mailto protocol is accepted as safe');
assert(!isSafeUrl('javascript:alert("hacked")'), 'javascript: protocol is blocked');
assert(!isSafeUrl('javascript:void(0)'), 'javascript:void(0) is blocked');
assert(!isSafeUrl('data:text/html,<script>alert(1)</script>'), 'data: URL scheme is blocked');
assert(!isSafeUrl('vbscript:msgbox(1)'), 'vbscript: protocol is blocked');
assert(!isSafeUrl(''), 'Empty URL is rejected');
assert(!isSafeUrl(undefined), 'Undefined URL is rejected');

// =========================================================================
// 2. Unicode Bullet & Markdown Normalization
// =========================================================================
const textWithBullets = `Key Points:
• First benefit
• Second benefit
· Third point
– Fourth point`;

const normalizedBullets = normalizeMarkdownContent(textWithBullets);
assert(normalizedBullets.includes('- First benefit'), 'Unicode bullet (•) normalized to markdown list item (-)');
assert(normalizedBullets.includes('- Second benefit'), 'Second unicode bullet normalized');
assert(normalizedBullets.includes('- Third point'), 'Middle dot (·) normalized');
assert(normalizedBullets.includes('- Fourth point'), 'En-dash bullet (–) normalized');

// =========================================================================
// 3. Official Sample Response Markdown Rendering Verification
// =========================================================================
const sampleResponse = `Hello! Here is the scheme information.

**Benefits:**
- Cashless treatment, subject to official scheme limits.
- Additional benefits where officially applicable.

**Key Eligibility Conditions:**
- Meet the official eligibility criteria.
- Verify eligibility with the responsible department.

**Required Documents:**
- Aadhaar card, if required.
- Relevant eligibility documents.

**Official Website:** [Visit the official portal](https://www.india.gov.in/)`;

const renderedHtml = renderToStaticMarkup(
  React.createElement(ChatMessageContent, { content: sampleResponse, isUser: false })
);

// Verify bold labels rendered without raw asterisks
assert(renderedHtml.includes('<strong') && renderedHtml.includes('Benefits:</strong>'), 'Bold label "**Benefits:**" rendered inside <strong>');
assert(renderedHtml.includes('Key Eligibility Conditions:</strong>'), 'Bold label "**Key Eligibility Conditions:**" rendered inside <strong>');
assert(renderedHtml.includes('Required Documents:</strong>'), 'Bold label "**Required Documents:**" rendered inside <strong>');
assert(renderedHtml.includes('Official Website:</strong>'), 'Bold label "**Official Website:**" rendered inside <strong>');
assert(!renderedHtml.includes('**Benefits:**'), 'Raw asterisks "**Benefits:**" are not exposed in output HTML');

// Verify lists rendered as structured <ul> and <li> tags
assert(renderedHtml.includes('<ul'), 'Unordered list <ul> tag is present');
assert(renderedHtml.includes('<li'), 'List items <li> tags are present');
assert(renderedHtml.includes('Cashless treatment, subject to official scheme limits.'), 'List item 1 text rendered inside list');
assert(renderedHtml.includes('Aadhaar card, if required.'), 'List item for documents rendered inside list');

// Verify links rendered as safe external links
assert(renderedHtml.includes('<a href="https://www.india.gov.in/"'), 'Official portal link rendered as <a> tag with target URL');
assert(renderedHtml.includes('target="_blank"'), 'External link has target="_blank"');
assert(renderedHtml.includes('rel="noopener noreferrer"'), 'External link has rel="noopener noreferrer"');
assert(renderedHtml.includes('Visit the official portal'), 'Link anchor text rendered properly');

// =========================================================================
// 4. Telugu & Multilingual Markdown Rendering Tests
// =========================================================================
const teluguSample = `నమస్కారం! డా. ఎన్టీఆర్ వైద్య సేవ పథకం వివరాలు:

**పథకం ప్రయోజనాలు:**
- కుటుంబానికి ఏడాదికి గరిష్టంగా రూ. 25 లక్షల వరకు ఉచిత నగదు రహిత చికిత్స.
- 3,257 రకాల శస్త్రచికిత్సలు మరియు వ్యాధులకు పూర్తి కవరేజ్.

**అవసరమైన పత్రాలు:**
- తెల్ల రేషన్ కార్డు (White Rice Card).
- ఆధార్ కార్డు.

**అధికారిక వెబ్‌సైట్:** [డా. ఎన్టీఆర్ వైద్య సేవ పోర్టల్](https://drntrvaidyaseva.ap.gov.in)`;

const renderedTelugu = renderToStaticMarkup(
  React.createElement(ChatMessageContent, { content: teluguSample, isUser: false })
);

assert(renderedTelugu.includes('పథకం ప్రయోజనాలు:</strong>'), 'Telugu bold label rendered inside <strong>');
assert(renderedTelugu.includes('అవసరమైన పత్రాలు:</strong>'), 'Telugu bold label for documents rendered inside <strong>');
assert(renderedTelugu.includes('అధికారిక వెబ్‌సైట్:</strong>'), 'Telugu bold label for official website rendered inside <strong>');
assert(renderedTelugu.includes('కుటుంబానికి ఏడాదికి గరిష్టంగా రూ. 25 లక్షల వరకు ఉచిత నగదు రహిత చికిత్స.'), 'Telugu list item text rendered inside <li>');
assert(renderedTelugu.includes('href="https://drntrvaidyaseva.ap.gov.in"'), 'Telugu anchor link points to authentic AP health portal');
assert(renderedTelugu.includes('డా. ఎన్టీఆర్ వైద్య సేవ పోర్టల్'), 'Telugu link anchor text rendered properly');

// =========================================================================
// 5. Mixed Script & Code/Emphasis Tests
// =========================================================================
const mixedSample = `Here are the details for *Talliki Vandanam*:
- Annual assistance: **₹15,000 per mother**
- Minimum attendance: \`75%\` in school/college
- AP Domicile is mandatory.`;

const renderedMixed = renderToStaticMarkup(
  React.createElement(ChatMessageContent, { content: mixedSample, isUser: false })
);

assert(renderedMixed.includes('<em') && renderedMixed.includes('Talliki Vandanam</em>'), 'Italicized text rendered inside <em>');
assert(renderedMixed.includes('₹15,000 per mother</strong>'), 'Bold financial benefit rendered inside <strong>');
assert(renderedMixed.includes('<code') && renderedMixed.includes('75%</code>'), 'Inline code attendance requirement rendered inside <code>');

// =========================================================================
// 6. Security & Malicious Link Prevention
// =========================================================================
const maliciousSample = `Click here for free money: [Malicious](javascript:alert("xss")) and [Data URI](data:text/html,bad)`;
const renderedMalicious = renderToStaticMarkup(
  React.createElement(ChatMessageContent, { content: maliciousSample, isUser: false })
);

assert(!renderedMalicious.includes('href="javascript:'), 'javascript: link is NOT rendered in href attribute');
assert(!renderedMalicious.includes('href="data:'), 'data: link is NOT rendered in href attribute');

// =========================================================================
// 7. User Message Mode
// =========================================================================
const userMessage = 'Can I apply for **Dr. NTR Vaidya Seva**?';
const renderedUser = renderToStaticMarkup(
  React.createElement(ChatMessageContent, { content: userMessage, isUser: true })
);
assert(renderedUser.includes('text-white'), 'User message retains white text styling');
assert(renderedUser.includes('Can I apply for **Dr. NTR Vaidya Seva**?'), 'User message raw text preserved without markdown mutation');

console.log(`\n--- TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ---`);
if (failed > 0) {
  process.exit(1);
}
