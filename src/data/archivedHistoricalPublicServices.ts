import { PublicService } from '../types';

export interface ArchivedPublicServiceRecord extends PublicService {
  isArchivedHistorical: boolean;
  archivedDate: string;
  archiveReason: string;
  supersededByServiceId?: string;
}

export const ARCHIVED_HISTORICAL_PUBLIC_SERVICES: ArchivedPublicServiceRecord[] = [
  {
    id: 'legacy-praja-vedika-petitions',
    name: 'Praja Vedika Physical Petition Submission',
    teName: 'ప్రజా వేదిక ఫిర్యాదుల సమర్పణ',
    category: 'grievances',
    govLevel: 'state',
    department: 'General Administration Department, Govt of AP',
    purpose: 'Physical single-hall grievance collection forum superseded by Spandana digital portal and 1902 toll-free helpline.',
    tePurpose: 'డిజిటల్ స్పందన పోర్టల్ మరియు 1902 హెల్ప్‌లైన్ ద్వారా భర్తీ చేయబడిన పాత పద్ధతి.',
    officialInfoUrl: 'https://spandana.ap.gov.in',
    officialApplicationUrl: 'https://spandana.ap.gov.in',
    officialPortal: 'https://spandana.ap.gov.in',
    status: 'DISCONTINUED',
    lastVerifiedDate: '2026-10-15',
    verificationSource: 'AP Spandana Portal Official Notice',
    officialFee: 'FREE',
    processingTime: 'Discontinued',
    eligibility: 'Historical service archived',
    requiredDocuments: [],
    teRequiredDocuments: [],
    steps: ['Service discontinued in favor of 1902 Spandana Portal and Grama Sachivalayam.'],
    teSteps: ['స్పందన 1902 పోర్టల్ ద్వారా నూతన విధానం అమలులో ఉంది.'],
    trackingInstructions: 'Use Spandana 1902 portal for current grievances.',
    teTrackingInstructions: 'స్పందన 1902 పోర్టల్ ఉపయోగించండి.',
    supportHelpline: '1902',
    isArchivedHistorical: true,
    archivedDate: '2026-10-15',
    archiveReason: 'Superseded by Spandana digital grievance management system and 1902 helpline.',
    supersededByServiceId: 'spandana-grievance-redressal'
  }
];
