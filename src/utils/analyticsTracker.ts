import {
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  EngagementEventType,
  ApplicationJourneyStatus,
  ApplicationStatusSource,
  SchemeCategory
} from '../types';

/**
 * Log an engagement event for authoritative non-PII analytics.
 * Events are written with server timestamps and structured parameters.
 */
export async function trackEngagementEvent(
  eventType: EngagementEventType,
  data?: {
    userId?: string;
    schemeId?: string;
    searchQuery?: string;
    category?: string;
    language?: string;
    metadata?: Record<string, any>;
  }
): Promise<void> {
  try {
    const eventRef = doc(collection(db, 'schemeEvents'));
    await setDoc(eventRef, {
      id: eventRef.id,
      eventType,
      userId: data?.userId || 'anonymous',
      schemeId: data?.schemeId || null,
      searchQuery: data?.searchQuery ? data.searchQuery.slice(0, 100) : null,
      category: data?.category || null,
      language: data?.language || 'te',
      metadata: data?.metadata || {},
      timestamp: serverTimestamp(),
      createdAtIso: new Date().toISOString()
    });
  } catch (err) {
    // Non-blocking telemetry
    console.warn(`[Analytics] Could not log event ${eventType}:`, err);
  }
}

/**
 * Record or update a citizen's logical scheme application journey.
 * Uses a deterministic applicationId (`${userId}_${schemeId}`) to ensure idempotency.
 */
export async function recordApplicationJourney(params: {
  userId: string;
  schemeId: string;
  schemeName: string;
  officialName: string;
  category?: SchemeCategory;
  status: ApplicationJourneyStatus;
  statusSource: ApplicationStatusSource;
  officialSubmissionReference?: string;
  notes?: string;
  actor?: string; // 'citizen' or admin email
}): Promise<void> {
  try {
    const appId = `${params.userId}_${params.schemeId}`;
    const appRef = doc(db, 'schemeApplications', appId);
    const existingSnap = await getDoc(appRef);

    let fromStatus: ApplicationJourneyStatus | undefined = undefined;
    let attemptsCount = 1;

    if (existingSnap.exists()) {
      const data = existingSnap.data();
      fromStatus = data.status;
      attemptsCount = (data.attemptsCount || 1) + (params.status === 'assistance_started' ? 1 : 0);
    }

    const payload: any = {
      id: appId,
      userId: params.userId,
      schemeId: params.schemeId,
      schemeName: params.schemeName,
      officialName: params.officialName,
      category: params.category || 'social_security',
      status: params.status,
      statusSource: params.statusSource,
      lastUpdatedAt: serverTimestamp(),
      lastUpdatedAtIso: new Date().toISOString(),
      attemptsCount
    };

    if (params.officialSubmissionReference) {
      payload.officialSubmissionReference = params.officialSubmissionReference;
      payload.submittedAt = serverTimestamp();
      payload.submittedAtIso = new Date().toISOString();
    }

    if (params.notes) {
      payload.verificationNotes = params.notes;
    }

    if (!existingSnap.exists()) {
      payload.startedAt = serverTimestamp();
      payload.startedAtIso = new Date().toISOString();
    }

    await setDoc(appRef, payload, { merge: true });

    // Record auditable status change event
    if (fromStatus !== params.status) {
      const statusEventRef = doc(collection(db, 'applicationStatusEvents'));
      await setDoc(statusEventRef, {
        id: statusEventRef.id,
        applicationId: appId,
        userId: params.userId,
        schemeId: params.schemeId,
        fromStatus: fromStatus || null,
        toStatus: params.status,
        source: params.statusSource,
        changedBy: params.actor || params.userId,
        reason: params.notes || null,
        timestamp: serverTimestamp(),
        createdAtIso: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn('[ApplicationJourney] Error updating application record:', err);
  }
}

/**
 * Log a security-sensitive administrative action to auditLogs.
 */
export async function logAdminAudit(params: {
  actorUid: string;
  actorEmail: string;
  action: string;
  targetCollection: string;
  targetId: string;
  details?: Record<string, any>;
}): Promise<void> {
  try {
    const auditRef = doc(collection(db, 'auditLogs'));
    await setDoc(auditRef, {
      id: auditRef.id,
      actorUid: params.actorUid,
      actorEmail: params.actorEmail,
      action: params.action,
      targetCollection: params.targetCollection,
      targetId: params.targetId,
      details: params.details || {},
      timestamp: serverTimestamp(),
      createdAtIso: new Date().toISOString()
    });
  } catch (err) {
    console.error('[AuditLog] Failed to record audit log:', err);
  }
}
