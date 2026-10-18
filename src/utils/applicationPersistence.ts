import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { AssistanceSession, Scheme, ApplicationStatus } from '../types';
import { recordApplicationJourney, trackEngagementEvent } from './analyticsTracker';

export interface ReferenceValidationResult {
  isValid: boolean;
  error?: string;
  trimmed: string;
}

/**
 * Validates an Application Acknowledgement / Reference Number.
 * Rejects empty input, whitespace-only, and excessively short or invalid strings.
 */
export function validateReferenceNumber(input: string | null | undefined): ReferenceValidationResult {
  if (!input) {
    return {
      isValid: false,
      trimmed: '',
      error: 'Please enter your Application Acknowledgement Number.'
    };
  }

  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return {
      isValid: false,
      trimmed: '',
      error: 'Reference number cannot be empty or whitespace only.'
    };
  }

  if (trimmed.length < 3) {
    return {
      isValid: false,
      trimmed,
      error: 'Reference number must be at least 3 characters long.'
    };
  }

  if (trimmed.length > 100) {
    return {
      isValid: false,
      trimmed,
      error: 'Reference number cannot exceed 100 characters.'
    };
  }

  // Reject suspicious control characters or script tags
  if (/[<>{}\\]/.test(trimmed)) {
    return {
      isValid: false,
      trimmed,
      error: 'Reference number contains invalid special characters.'
    };
  }

  return {
    isValid: true,
    trimmed
  };
}

/**
 * Deterministic document ID for an assistance session to ensure idempotency
 * and prevent accidental duplicate records for the same user and scheme.
 */
export function getDeterministicSessionId(userId: string, schemeId: string): string {
  const cleanUser = userId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 48);
  const cleanScheme = schemeId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 48);
  return `session_${cleanUser}_${cleanScheme}`;
}

const LOCAL_STORAGE_PREFIX = 'gs_assistance_session_';

/**
 * Save assistance session to local storage for instant zero-latency restoration.
 */
export function saveSessionToLocalStorage(session: AssistanceSession): void {
  try {
    const key = `${LOCAL_STORAGE_PREFIX}${session.userId}_${session.schemeId}`;
    localStorage.setItem(key, JSON.stringify(session));
  } catch (err) {
    console.warn('[Storage] Could not cache session locally:', err);
  }
}

/**
 * Load assistance session from local storage.
 */
export function loadSessionFromLocalStorage(userId: string, schemeId: string): AssistanceSession | null {
  try {
    const key = `${LOCAL_STORAGE_PREFIX}${userId}_${schemeId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as AssistanceSession;
  } catch (err) {
    console.warn('[Storage] Could not parse local cached session:', err);
    return null;
  }
}

/**
 * Broadcast an application update event across components so the dashboard
 * updates immediately without requiring a full page reload or login cycle.
 */
export function broadcastApplicationUpdate(detail: {
  schemeId: string;
  referenceNumber?: string;
  status?: string;
}): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('gs_application_updated', { detail }));
  }
}

/**
 * Safely parses any Firestore Timestamp, ISO string, epoch milliseconds,
 * or Date object into a valid JavaScript Date.
 */
export function parseTimestampToDate(val: any): Date {
  if (!val) return new Date(0);
  if (val instanceof Date) return isNaN(val.getTime()) ? new Date(0) : val;
  if (typeof val?.toDate === 'function') {
    try {
      return val.toDate();
    } catch {
      // Fall through
    }
  }
  if (typeof val === 'object' && typeof val.seconds === 'number') {
    return new Date(val.seconds * 1000 + (val.nanoseconds ? Math.floor(val.nanoseconds / 1000000) : 0));
  }
  const d = new Date(val);
  return isNaN(d.getTime()) ? new Date(0) : d;
}

/**
 * Formats any Firestore Timestamp or date into a localized string,
 * avoiding "Invalid Date" output.
 */
export function formatTimestampDisplay(val: any, locale: string = 'en-IN'): string {
  const d = parseTimestampToDate(val);
  if (d.getTime() === 0) return 'Recently';
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Record an application reference number securely to Firestore and local cache.
 */
export async function recordApplicationReference(params: {
  userId: string;
  scheme: Scheme;
  referenceNumber: string;
  currentStep?: number;
  preparedAnswers?: Record<string, string>;
  completedDocuments?: string[];
  documentChecks?: Record<string, boolean>;
}): Promise<{
  success: boolean;
  error?: string;
  session?: AssistanceSession;
  isDuplicate?: boolean;
}> {
  const validation = validateReferenceNumber(params.referenceNumber);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.error
    };
  }

  if (!params.userId || typeof params.userId !== 'string' || params.userId.trim() === '') {
    return {
      success: false,
      error: 'Authentication required. Please sign in to record your application reference.'
    };
  }

  const sessionId = getDeterministicSessionId(params.userId, params.scheme.id);
  const nowIso = new Date().toISOString();

  try {
    const sessionRef = doc(db, 'assistanceSessions', sessionId);
    let existingData: Partial<AssistanceSession> = {};
    let isDuplicate = false;

    try {
      const snap = await getDoc(sessionRef);
      if (snap.exists()) {
        existingData = snap.data() as Partial<AssistanceSession>;
        if (existingData.officialSubmissionReference === validation.trimmed) {
          isDuplicate = true;
        }
      }
    } catch {
      // Fallback check against local cache
      const localCached = loadSessionFromLocalStorage(params.userId, params.scheme.id);
      if (localCached && localCached.officialSubmissionReference === validation.trimmed) {
        isDuplicate = true;
      }
    }

    const answers = params.preparedAnswers || existingData.preparedAnswers || {};
    const completedDocs = params.completedDocuments || existingData.completedDocuments || [];
    const docChecks = params.documentChecks || existingData.documentChecks || {};

    const sessionData: AssistanceSession = {
      id: sessionId,
      sessionId: sessionId,
      userId: params.userId,
      schemeId: params.scheme.id,
      schemeName: params.scheme.officialName,
      teSchemeName: params.scheme.teName,
      status: 'reported_submitted',
      isVerifiedDirectSubmission: false,
      officialSubmissionReference: validation.trimmed,
      reportedSubmittedAt: nowIso,
      preparedAnswers: answers,
      completedDocuments: completedDocs,
      documentChecks: docChecks,
      currentStep: params.currentStep || existingData.currentStep || 4,
      savedAtIso: nowIso,
      lastUpdatedAtIso: nowIso,
      createdAt: existingData.createdAt ? parseTimestampToDate(existingData.createdAt).toISOString() : nowIso,
      updatedAt: nowIso
    };

    // Persist to Firestore
    await setDoc(
      sessionRef,
      {
        ...sessionData,
        sessionId,
        updatedAt: serverTimestamp(),
        createdAt: existingData.createdAt ? existingData.createdAt : serverTimestamp()
      },
      { merge: true }
    );

    // Record authoritative journey
    await recordApplicationJourney({
      userId: params.userId,
      schemeId: params.scheme.id,
      schemeName: params.scheme.teName || params.scheme.officialName,
      officialName: params.scheme.officialName,
      category: params.scheme.category,
      status: 'submitted_self_reported',
      statusSource: 'citizen_self_reported',
      officialSubmissionReference: validation.trimmed
    });

    await trackEngagementEvent('application_submission_reported', {
      userId: params.userId,
      schemeId: params.scheme.id,
      metadata: { ackNumber: validation.trimmed }
    });

    // Save to local cache
    saveSessionToLocalStorage(sessionData);

    // Broadcast immediate update for Dashboard and Tracker
    broadcastApplicationUpdate({
      schemeId: params.scheme.id,
      referenceNumber: validation.trimmed,
      status: 'reported_submitted'
    });

    return {
      success: true,
      session: sessionData,
      isDuplicate
    };
  } catch (err: any) {
    console.error('[ApplicationPersistence] Failed to record reference:', err);
    return {
      success: false,
      error: err?.message || 'Database error: Could not persist application reference. Please try again.'
    };
  }
}

/**
 * Save application progress to Firestore and local cache.
 */
export async function saveApplicationProgress(params: {
  userId: string;
  scheme: Scheme;
  currentStep: number;
  formData: Record<string, string>;
  documentChecks: Record<string, boolean>;
  reportedRefNumber?: string;
  status?: ApplicationStatus;
  eligibilityResponses?: Record<string, any>;
}): Promise<{ success: boolean; error?: string; session?: AssistanceSession }> {
  if (!params.userId || typeof params.userId !== 'string' || params.userId.trim() === '') {
    return {
      success: false,
      error: 'Authentication required. Please sign in to save your application progress.'
    };
  }

  const sessionId = getDeterministicSessionId(params.userId, params.scheme.id);
  const nowIso = new Date().toISOString();
  const trimmedRef = params.reportedRefNumber ? params.reportedRefNumber.trim() : '';

  try {
    const sessionRef = doc(db, 'assistanceSessions', sessionId);
    let existingData: Partial<AssistanceSession> = {};

    try {
      const snap = await getDoc(sessionRef);
      if (snap.exists()) {
        existingData = snap.data() as Partial<AssistanceSession>;
      }
    } catch {
      // Offline fallback
      const localCached = loadSessionFromLocalStorage(params.userId, params.scheme.id);
      if (localCached) existingData = localCached;
    }

    const completedDocuments = Object.keys(params.documentChecks).filter((k) => params.documentChecks[k]);
    const activeRef = trimmedRef || existingData.officialSubmissionReference || undefined;

    const computedStatus: ApplicationStatus = activeRef
      ? 'reported_submitted'
      : (params.status || (params.currentStep >= 4 ? 'ready_to_submit' : 'documents_preparing'));

    const eligibilityResponses = {
      applicantName: params.formData.applicantName || '',
      district: params.formData.district || '',
      courseOrOccupation: params.formData.courseOrOccupation || '',
      annualIncome: params.formData.annualIncome || '',
      rationCardAvailable: params.formData.rationCardAvailable || '',
      bankSeededAadhaar: params.formData.bankSeededAadhaar || '',
      collegeOrVillageName: params.formData.collegeOrVillageName || '',
      ...(params.eligibilityResponses || {})
    };

    const sessionData: AssistanceSession = {
      id: sessionId,
      sessionId: sessionId,
      userId: params.userId,
      schemeId: params.scheme.id,
      schemeName: params.scheme.officialName,
      teSchemeName: params.scheme.teName,
      status: computedStatus,
      isVerifiedDirectSubmission: false,
      officialSubmissionReference: activeRef,
      preparedAnswers: params.formData,
      completedDocuments,
      documentChecks: params.documentChecks,
      eligibilityResponses,
      reportedSubmittedAt: activeRef ? (existingData.reportedSubmittedAt || nowIso) : undefined,
      currentStep: params.currentStep,
      savedAtIso: nowIso,
      lastUpdatedAtIso: nowIso,
      createdAt: existingData.createdAt ? parseTimestampToDate(existingData.createdAt).toISOString() : nowIso,
      updatedAt: nowIso
    };

    // Persist to Firestore
    await setDoc(
      sessionRef,
      {
        ...sessionData,
        sessionId,
        currentStep: params.currentStep,
        updatedAt: serverTimestamp(),
        createdAt: existingData.createdAt ? existingData.createdAt : serverTimestamp()
      },
      { merge: true }
    );

    // Record application journey in schemeApplications
    await recordApplicationJourney({
      userId: params.userId,
      schemeId: params.scheme.id,
      schemeName: params.scheme.teName || params.scheme.officialName,
      officialName: params.scheme.officialName,
      category: params.scheme.category,
      status: activeRef ? 'submitted_self_reported' : 'application_in_progress',
      statusSource: activeRef ? 'citizen_self_reported' : 'guidance_workflow',
      officialSubmissionReference: activeRef
    });

    await trackEngagementEvent('assistance_started', {
      userId: params.userId,
      schemeId: params.scheme.id,
      category: params.scheme.category,
      metadata: { step: params.currentStep }
    });

    // Save to local cache for instant restoration across reloads
    saveSessionToLocalStorage(sessionData);

    // Broadcast immediate update for Dashboard and Tracker
    broadcastApplicationUpdate({
      schemeId: params.scheme.id,
      referenceNumber: activeRef,
      status: computedStatus
    });

    return {
      success: true,
      session: sessionData
    };
  } catch (err: any) {
    console.error('[ApplicationPersistence] Failed to save progress:', err);
    return {
      success: false,
      error: err?.message || 'Database error: Could not save progress. Please check your connection and try again.'
    };
  }
}

/**
 * Load saved progress for a user and scheme from Firestore, falling back to local cache.
 */
export async function loadSavedApplicationProgress(
  userId: string,
  schemeId: string
): Promise<AssistanceSession | null> {
  if (!userId || !schemeId) return null;

  // Check local cache first for instant feedback
  const localSession = loadSessionFromLocalStorage(userId, schemeId);

  try {
    const sessionId = getDeterministicSessionId(userId, schemeId);
    const sessionRef = doc(db, 'assistanceSessions', sessionId);
    const snap = await getDoc(sessionRef);

    if (snap.exists()) {
      const rawData = snap.data();
      const data: AssistanceSession = {
        ...rawData,
        id: snap.id,
        sessionId: rawData.sessionId || snap.id,
        createdAt: rawData.createdAt ? parseTimestampToDate(rawData.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: rawData.updatedAt ? parseTimestampToDate(rawData.updatedAt).toISOString() : new Date().toISOString()
      } as AssistanceSession;

      saveSessionToLocalStorage(data);
      return data;
    }
  } catch (err) {
    console.warn('[ApplicationPersistence] Could not fetch session from Firestore, using local cache:', err);
  }

  return localSession;
}
