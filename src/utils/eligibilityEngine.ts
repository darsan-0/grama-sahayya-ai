import { Scheme, UserProfile, EligibilityResult } from '../types';

export function evaluateSchemeEligibility(
  scheme: Scheme,
  profile: Partial<UserProfile> | null,
  lang: string = 'en'
): EligibilityResult {
  const isTe = lang === 'te';

  if (!profile) {
    return {
      status: 'potentially_eligible',
      schemeId: scheme.id,
      reasons: [
        isTe
          ? 'పౌర ప్రొఫైల్ వివరాలు లోడ్ కాలేదు. ప్రాథమిక వివరాలు నమోదు చేసి అర్హత పరిశీలించండి.'
          : 'No citizen profile loaded. Sign in or enter your basic details to check eligibility.'
      ],
      missingInfo: isTe
        ? ['వయస్సు', 'వార్షిక ఆదాయం', 'వృత్తి / చదువు', 'సామాజిక వర్గం', 'నివాస రాష్ట్రం']
        : ['Age', 'Annual Income', 'Occupation / Student Status', 'Social Category', 'State of Residence'],
      suggestedActions: [
        isTe
          ? 'ఖచ్చితమైన అర్హత ఫలితం పొందడానికి మీ ప్రొఫైల్ వివరాలను పూర్తి చేయండి.'
          : 'Complete your citizen profile to get accurate, instant eligibility results.'
      ],
    };
  }

  const reasons: string[] = [];
  const missingInfo: string[] = [];
  const suggestedActions: string[] = [];
  let isDisqualified = false;
  let matchesAllKnown = true;

  const { eligibilityCriteria, state, govLevel } = scheme;

  // 1. Residence check
  if (eligibilityCriteria.requiresAPResidence || (govLevel === 'state' && state === 'Andhra Pradesh')) {
    if (profile.state) {
      if (profile.state.toLowerCase().includes('andhra')) {
        reasons.push(
          isTe
            ? 'ఆంధ్రప్రదేశ్ రాష్ట్ర నివాస ప్రమాణాలకు సరిపోయింది.'
            : 'Meets Andhra Pradesh state residence criteria.'
        );
      } else {
        isDisqualified = true;
        reasons.push(
          isTe
            ? `ఈ పథకానికి ఆంధ్రప్రదేశ్ నివాసి అయి ఉండాలి, కానీ ప్రొఫైల్ "${profile.state}" అని సూచిస్తోంది.`
            : `This scheme requires Andhra Pradesh residence, but profile indicates "${profile.state}".`
        );
      }
    } else {
      missingInfo.push(isTe ? 'నివాస రాష్ట్రం' : 'State of residence');
      matchesAllKnown = false;
    }
  }

  // 2. Age criteria
  if (eligibilityCriteria.minAge !== undefined || eligibilityCriteria.maxAge !== undefined) {
    if (profile.age !== undefined && profile.age !== null) {
      if (eligibilityCriteria.minAge !== undefined && profile.age < eligibilityCriteria.minAge) {
        isDisqualified = true;
        reasons.push(
          isTe
            ? `కనీస వయస్సు ${eligibilityCriteria.minAge} సంవత్సరాలు ఉండాలి (ప్రస్తుత వయస్సు: ${profile.age}).`
            : `Requires minimum age of ${eligibilityCriteria.minAge} years (current age: ${profile.age}).`
        );
      } else if (eligibilityCriteria.maxAge !== undefined && profile.age > eligibilityCriteria.maxAge) {
        isDisqualified = true;
        reasons.push(
          isTe
            ? `గరిష్ట వయస్సు ${eligibilityCriteria.maxAge} సంవత్సరాలు మించకూడదు (ప్రస్తుత వయస్సు: ${profile.age}).`
            : `Requires maximum age of ${eligibilityCriteria.maxAge} years (current age: ${profile.age}).`
        );
      } else {
        reasons.push(
          isTe
            ? `వయస్సు (${profile.age} సం.) అర్హత పరిధిలో ఉంది (${eligibilityCriteria.minAge ?? 0} - ${eligibilityCriteria.maxAge ?? 'పరిమితి లేదు'}).`
            : `Age (${profile.age} years) falls within the eligible range (${eligibilityCriteria.minAge ?? 0} - ${eligibilityCriteria.maxAge ?? 'No limit'}).`
        );
      }
    } else {
      missingInfo.push(isTe ? 'వయస్సు / పుట్టిన తేదీ' : 'Age / Date of Birth');
      matchesAllKnown = false;
    }
  }

  // 3. Gender criteria
  if (eligibilityCriteria.gender && eligibilityCriteria.gender !== 'all') {
    if (profile.gender) {
      if (profile.gender.toLowerCase() === eligibilityCriteria.gender.toLowerCase()) {
        reasons.push(
          isTe
            ? `లింగ నిబంధన (${eligibilityCriteria.gender}) సరిపోయింది.`
            : `Gender requirement (${eligibilityCriteria.gender}) satisfied.`
        );
      } else {
        isDisqualified = true;
        reasons.push(
          isTe
            ? `ఈ పథకం కేవలం ${eligibilityCriteria.gender} లబ్ధిదారులకు మాత్రమే ఉద్దేశించబడింది.`
            : `Scheme is exclusively for ${eligibilityCriteria.gender} beneficiaries.`
        );
      }
    } else {
      missingInfo.push(isTe ? 'లింగం' : 'Gender');
      matchesAllKnown = false;
    }
  }

  // 4. Annual Income criteria
  if (eligibilityCriteria.maxAnnualIncome !== undefined) {
    if (profile.approxAnnualIncome !== undefined && profile.approxAnnualIncome !== null) {
      if (profile.approxAnnualIncome <= eligibilityCriteria.maxAnnualIncome) {
        reasons.push(
          isTe
            ? `వార్షిక ఆదాయం (₹${profile.approxAnnualIncome.toLocaleString('en-IN')}) పథక పరిమితి (₹${eligibilityCriteria.maxAnnualIncome.toLocaleString('en-IN')}) లోపే ఉంది.`
            : `Annual income (₹${profile.approxAnnualIncome.toLocaleString('en-IN')}) is within the threshold (₹${eligibilityCriteria.maxAnnualIncome.toLocaleString('en-IN')}).`
        );
      } else {
        isDisqualified = true;
        reasons.push(
          isTe
            ? `వార్షిక ఆదాయం (₹${profile.approxAnnualIncome.toLocaleString('en-IN')}) పథక గరిష్ట పరిమితి (₹${eligibilityCriteria.maxAnnualIncome.toLocaleString('en-IN')}) కంటే ఎక్కువ.`
            : `Annual income (₹${profile.approxAnnualIncome.toLocaleString('en-IN')}) exceeds the scheme limit (₹${eligibilityCriteria.maxAnnualIncome.toLocaleString('en-IN')}).`
        );
      }
    } else if (profile.incomeRange) {
      const isHighIncome = profile.incomeRange.includes('Above Rs 5') || profile.incomeRange.includes('Above Rs 2.5');
      if (isHighIncome && eligibilityCriteria.maxAnnualIncome <= 250000) {
        isDisqualified = true;
        reasons.push(
          isTe
            ? `ఆదాయ పరిధి "${profile.incomeRange}" పథక పరిమితి రూ. ${eligibilityCriteria.maxAnnualIncome.toLocaleString('en-IN')} కంటే ఎక్కువగా ఉన్నట్లు తెలుస్తోంది.`
            : `Income range "${profile.incomeRange}" appears to exceed scheme limit of ₹${eligibilityCriteria.maxAnnualIncome.toLocaleString('en-IN')}.`
        );
      } else {
        reasons.push(
          isTe
            ? `ఆదాయ శ్రేణి "${profile.incomeRange}" పథక నిబంధనలకు అనుకూలంగా ఉంది; ధృవీకరించిన ఆదాయ పత్రం అవసరం.`
            : `Income bracket "${profile.incomeRange}" aligns with scheme limits; verified income certificate will be required.`
        );
      }
    } else {
      missingInfo.push(isTe ? 'కుటుంబ వార్షిక ఆదాయం' : 'Annual Household Income');
      matchesAllKnown = false;
    }
  }

  // 5. Farmer criteria
  if (eligibilityCriteria.farmerStatus) {
    if (profile.isFarmer !== undefined) {
      if (profile.isFarmer) {
        reasons.push(
          isTe
            ? 'రైతు / సాగుదారు వివరాలు నిర్ధారించబడ్డాయి.'
            : 'Farmer or cultivator status verified in profile.'
        );
      } else {
        isDisqualified = true;
        reasons.push(
          isTe
            ? 'ఈ పథకానికి దరఖాస్తుదారు వ్యవసాయ భూయజమాని లేదా నమోదిత కౌలు రైతు (CCRC కార్డుదారు) అయి ఉండాలి.'
            : 'Scheme requires applicant to be an agricultural landholder or registered tenant farmer (CCRC holder).'
        );
      }
    } else {
      missingInfo.push(isTe ? 'రైతు / సాగుదారు వివరాలు' : 'Farmer / Cultivator status');
      matchesAllKnown = false;
    }
  }

  // 6. Education level criteria
  if (eligibilityCriteria.educationLevels && eligibilityCriteria.educationLevels.length > 0) {
    if (profile.educationLevel) {
      const match = eligibilityCriteria.educationLevels.some(
        lvl => profile.educationLevel?.toLowerCase().includes(lvl.toLowerCase()) || lvl.toLowerCase().includes(profile.educationLevel?.toLowerCase() || '')
      );
      if (match) {
        reasons.push(
          isTe
            ? `అర్హతగల కోర్సు/చదువులో చేరి ఉన్నారు: ${profile.educationLevel}.`
            : `Enrolled in eligible course/level: ${profile.educationLevel}.`
        );
      } else {
        reasons.push(
          isTe
            ? `కోర్సు స్థాయి "${profile.educationLevel}" గుర్తింపు పొందిన విద్యాసంస్థలతో ధృవీకరించవలసి ఉంది.`
            : `Course level "${profile.educationLevel}" requires verification against approved institutions.`
        );
      }
    } else {
      missingInfo.push(isTe ? 'ప్రస్తుత విద్యార్హత / కోర్సు' : 'Current educational level or course');
      matchesAllKnown = false;
    }
  }

  // 7. Social category criteria
  if (eligibilityCriteria.socialCategories && eligibilityCriteria.socialCategories.length > 0) {
    if (profile.socialCategory) {
      const match = eligibilityCriteria.socialCategories.some(
        cat => cat.toUpperCase() === profile.socialCategory?.toUpperCase()
      );
      if (match) {
        reasons.push(
          isTe
            ? `సామాజిక వర్గం (${profile.socialCategory}) అర్హత కలిగి ఉంది.`
            : `Social category (${profile.socialCategory}) is eligible.`
        );
      } else {
        isDisqualified = true;
        reasons.push(
          isTe
            ? `ఈ పథకం కేవలం ${eligibilityCriteria.socialCategories.join(', ')} వర్గాల వారికి మాత్రమే నిర్దేశించబడింది.`
            : `Scheme is targeted for ${eligibilityCriteria.socialCategories.join(', ')} communities.`
        );
      }
    } else {
      missingInfo.push(isTe ? 'సామాజిక వర్గం (SC/ST/BC/EWS/Minority/OC)' : 'Social category / Community (SC/ST/BC/EWS/Minority/OC)');
      matchesAllKnown = false;
    }
  }

  // Determine Final Status
  if (isDisqualified) {
    return {
      status: 'likely_ineligible',
      schemeId: scheme.id,
      reasons,
      missingInfo,
      suggestedActions: [
        isTe
          ? 'మీ పరిస్థితులకు సరిపోయే ప్రత్యామ్నాయ సంక్షేమ పథకాలను పరిశీలించండి.'
          : 'Review alternative welfare schemes matching your circumstances.',
        isTe
          ? 'మీ ప్రొఫైల్ వివరాలు తప్పుగా నమోదై ఉంటే, ప్రొఫైల్‌ను సరిచేయండి.'
          : 'If your demographic or income records were entered incorrectly, update your citizen profile.'
      ],
    };
  }

  if (!matchesAllKnown || missingInfo.length > 0) {
    return {
      status: 'potentially_eligible',
      schemeId: scheme.id,
      reasons: reasons.length > 0 ? reasons : [isTe ? 'ప్రాథమిక వివరాలు సరిపోయాయి, కానీ కీలక అంశాలు నిర్ధారించవలసి ఉంది.' : 'Preliminary details match, but key criteria require confirmation.'],
      missingInfo,
      suggestedActions: [
        isTe
          ? `మీ అర్హతను ధృవీకరించడానికి మిగిలిన వివరాలను (${missingInfo.join(', ')}) అందించండి.`
          : `Provide missing details (${missingInfo.join(', ')}) to verify your eligibility.`,
        isTe
          ? 'మీ రైస్ కార్డు, ఆధార్ మరియు సంబంధిత సర్టిఫికెట్లను సిద్ధంగా ఉంచుకోండి.'
          : 'Keep your Rice Card, Aadhaar, and relevant certificates ready.'
      ],
    };
  }

  return {
    status: 'likely_eligible',
    schemeId: scheme.id,
    reasons,
    missingInfo: [],
    suggestedActions: [
      isTe
        ? 'కింద చూపిన చెక్‌లిస్ట్ ప్రకారం అవసరమైన పత్రాలను సిద్ధం చేసుకోండి.'
        : 'Assemble the required documents shown in the checklist below.',
      isTe
        ? 'అధికారిక పోర్టల్ లేదా సచివాలయానికి వెళ్లే ముందు మీ సమాధానాలను తయారు చేసుకోవడానికి "దరఖాస్తు సిద్ధం చేయండి" క్లిక్ చేయండి.'
        : 'Click "Prepare Application" to formulate your answers before visiting the official portal or Village Secretariat.',
      isTe
        ? 'తుది మంజూరు సంబంధిత ప్రభుత్వ శాఖ పరిశీలనపై ఆధారపడి ఉంటుంది.'
        : 'Official sanction remains subject to administrative review by the competent government authority.'
    ],
  };
}
