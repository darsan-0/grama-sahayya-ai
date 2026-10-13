export type GovLevel = 'central' | 'state' | 'district';

export type SchemeCategory =
  | 'education'
  | 'agriculture'
  | 'women_shg'
  | 'pensions'
  | 'senior_citizens'
  | 'employment'
  | 'skill_development'
  | 'health'
  | 'housing'
  | 'food_security'
  | 'disability'
  | 'social_security'
  | 'msme_entrepreneurship'
  | 'worker_welfare';

export type VerificationStatus = 'verified' | 'pending_review' | 'stale';

export interface Scheme {
  id: string;
  officialName: string;
  teName: string; // Telugu official title
  hiName?: string; // Hindi title
  department: string;
  govLevel: GovLevel;
  state: string; // 'Andhra Pradesh' or 'All India'
  districts?: string[];
  category: SchemeCategory;
  summary: string;
  teSummary: string;
  description: string;
  teDescription: string;
  benefitDetails: string;
  teBenefitDetails: string;
  benefitAmount?: string;
  eligibilityCriteria: {
    minAge?: number;
    maxAge?: number;
    gender?: 'all' | 'female' | 'male';
    maxAnnualIncome?: number; // In INR
    occupations?: string[];
    educationLevels?: string[];
    socialCategories?: string[]; // SC, ST, BC, EWS, OC, Minorities
    farmerStatus?: boolean;
    landHoldingMaxAcres?: number;
    locationType?: 'rural' | 'urban' | 'semi-urban';
    requiresAPResidence?: boolean;
    additionalRules: string[];
    teAdditionalRules: string[];
  };
  exclusions: string[];
  requiredDocuments: string[];
  teRequiredDocuments: string[];
  applicationSteps: string[];
  teApplicationSteps: string[];
  officialApplicationUrl: string;
  officialInfoUrl: string;
  sourceUrls: string[];
  lastVerifiedAt: string; // ISO date
  verificationStatus: VerificationStatus;
  published: boolean;
  deadline?: string;
  renewalPeriod?: string;
  verifiedHelpline?: string;
}

export interface PublicService {
  id: string;
  name: string;
  teName: string;
  category: 'identity' | 'revenue_certificates' | 'welfare_cards' | 'electoral' | 'transport' | 'land_records';
  purpose: string;
  tePurpose: string;
  officialPortal: string;
  officialFee: string;
  processingTime: string;
  eligibility: string;
  requiredDocuments: string[];
  teRequiredDocuments: string[];
  steps: string[];
  teSteps: string[];
  trackingInstructions: string;
  teTrackingInstructions: string;
  supportHelpline?: string;
}

export type ApplicationStatus =
  | 'interested'
  | 'eligibility_assessed'
  | 'documents_preparing'
  | 'ready_to_submit'
  | 'reported_submitted'
  | 'submission_verified'
  | 'under_review_verified'
  | 'approved_verified'
  | 'rejected_verified'
  | 'assistance_completed'
  | 'status_unknown';

export interface AssistanceSession {
  id: string;
  userId: string;
  schemeId: string;
  schemeName: string;
  teSchemeName?: string;
  status: ApplicationStatus;
  isVerifiedDirectSubmission: boolean;
  officialSubmissionReference?: string;
  verifiedOutcomeNotes?: string;
  preparedAnswers: Record<string, string>;
  completedDocuments: string[];
  reportedSubmittedAt?: string;
  verifiedStatusUpdatedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  preferredLanguage: string;
  state: string;
  district: string;
  locationType: 'rural' | 'urban' | 'semi-urban';
  educationLevel: string;
  studyYear?: string;
  occupation: string;
  incomeRange: string;
  approxAnnualIncome?: number;
  age?: number;
  gender?: string;
  socialCategory?: string;
  hasDisability?: boolean;
  isFarmer?: boolean;
  landHoldingAcres?: number;
  hasSmartPhone?: boolean;
  consentAnalytics: boolean;
  phoneVerified?: boolean;
  phoneNumber?: string;
  authProvider?: 'google.com' | 'phone' | 'password' | string;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationJourneyStatus =
  | 'assistance_started'
  | 'eligibility_checked'
  | 'application_in_progress'
  | 'externally_redirected'
  | 'submitted_self_reported'
  | 'submitted_verified'
  | 'pending_verified'
  | 'approved_verified'
  | 'rejected_verified'
  | 'status_unknown';

export type ApplicationStatusSource =
  | 'citizen_self_reported'
  | 'authorized_integration'
  | 'guidance_workflow'
  | 'admin_verified';

export interface SchemeApplication {
  id: string; // Typically `${userId}_${schemeId}` for unique tracking
  userId: string;
  schemeId: string;
  schemeName: string;
  officialName: string;
  category: SchemeCategory;
  status: ApplicationJourneyStatus;
  statusSource: ApplicationStatusSource;
  officialSubmissionReference?: string;
  verificationTimestamp?: string;
  verifiedBy?: string;
  verificationNotes?: string;
  startedAt: string;
  lastUpdatedAt: string;
  submittedAt?: string;
  attemptsCount: number;
}

export interface ApplicationStatusEvent {
  id: string;
  applicationId: string;
  userId: string;
  schemeId: string;
  fromStatus?: ApplicationJourneyStatus;
  toStatus: ApplicationJourneyStatus;
  source: ApplicationStatusSource;
  changedBy: string; // 'citizen' or admin email/uid
  reason?: string;
  timestamp: string;
}

export type EngagementEventType =
  | 'account_created'
  | 'login_success'
  | 'scheme_viewed'
  | 'scheme_searched'
  | 'eligibility_check_completed'
  | 'scheme_saved'
  | 'assistance_started'
  | 'application_started'
  | 'application_redirected'
  | 'application_submission_reported'
  | 'application_submission_verified'
  | 'application_status_verified';

export interface SchemeEngagementEvent {
  id: string;
  eventType: EngagementEventType;
  userId?: string;
  schemeId?: string;
  searchQuery?: string;
  category?: string;
  language?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export type AdminRole =
  | 'super_admin'
  | 'scheme_reviewer'
  | 'support_staff'
  | 'analytics_viewer';

export interface AdminUserRecord {
  uid: string;
  email: string;
  displayName?: string;
  role: AdminRole;
  isActive: boolean;
  assignedBy: string;
  assignedAt: string;
  lastLoginAt?: string;
}

export interface AdminAuditLog {
  id: string;
  actorUid: string;
  actorEmail: string;
  action: string;
  targetCollection: string;
  targetId: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface DailyAnalyticsSummary {
  date: string; // YYYY-MM-DD
  activeUsersCount: number;
  newRegistrationsCount: number;
  searchesCount: number;
  eligibilityChecksCount: number;
  applicationsInitiatedCount: number;
  submissionsReportedCount: number;
  submissionsVerifiedCount: number;
  perSchemeCounts: Record<string, {
    views: number;
    eligibilityChecks: number;
    applicationsStarted: number;
    submissions: number;
    saves: number;
  }>;
  generatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  language?: string;
  suggestedPrompts?: string[];
  interactiveOptions?: {
    type: 'radio' | 'checkbox' | 'buttons';
    question: string;
    options: string[];
  };
  recommendedSchemeIds?: string[];
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  userId: string;
  title: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  lastMessagePreview?: string;
}

export interface SavedScheme {
  id: string;
  userId: string;
  schemeId: string;
  schemeName: string;
  teSchemeName: string;
  category: SchemeCategory;
  savedAt: string;
}

export interface EligibilityResult {
  status: 'likely_eligible' | 'potentially_eligible' | 'likely_ineligible' | 'unable_to_verify';
  schemeId: string;
  reasons: string[];
  missingInfo: string[];
  suggestedActions: string[];
}

export interface SystemStats {
  totalRegisteredUsers: number;
  verifiedPhoneUsersCount: number;
  googleUsersCount: number;
  activeUsers7Days: number;
  activeUsers30Days: number;
  totalSearchesCount: number;
  totalEligibilityChecksCount: number;
  totalSavedSchemesCount: number;
  totalAssistanceSessionsCount: number;
  totalApplicationsInitiated: number;
  totalSubmissionsReported: number;
  totalSubmissionsVerified: number;
  totalVerifiedApprovals: number;
  totalVerifiedRejections: number;
  publishedSchemesCount: number;
  publicServicesCount: number;
  lastUpdated: string;
  isRealData: boolean;
}

