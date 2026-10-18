import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ExternalLink,
  ChevronRight,
  Filter,
  RefreshCw,
  Info
} from 'lucide-react';
import { AssistanceSession, ApplicationStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { formatTimestampDisplay } from '../utils/applicationPersistence';

interface ApplicationTrackerProps {
  onStartNewApplication: () => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ onStartNewApplication }) => {
  const { currentUser } = useAuth();
  const { currentLanguage } = useLanguage();
  const isTe = currentLanguage === 'te';

  const [sessions, setSessions] = useState<AssistanceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const fetchSessions = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const q = query(
        collection(db, 'assistanceSessions'),
        where('userId', '==', currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const list: AssistanceSession[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data() as AssistanceSession, id: docSnap.id });
      });
      setSessions(list);
    } catch (err) {
      console.warn('Error querying assistance sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    const handleUpdate = () => {
      fetchSessions();
    };
    window.addEventListener('gs_application_updated', handleUpdate);
    return () => {
      window.removeEventListener('gs_application_updated', handleUpdate);
    };
  }, [currentUser]);

  const handleUpdateStatus = async (sessionId: string, newStatus: ApplicationStatus) => {
    try {
      const sessionRef = doc(db, 'assistanceSessions', sessionId);
      await updateDoc(sessionRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, status: newStatus } : s))
      );
    } catch (err) {
      console.error('Error updating session status:', err);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'interested':
        return { label: isTe ? 'ఆసక్తి చూపబడింది' : 'Interested', bg: 'bg-[#F8F7F2] text-secondary-text border border-[#E5E5DF]' };
      case 'eligibility_assessed':
        return { label: isTe ? 'అర్హత పరిశీలించబడింది' : 'Assessed', bg: 'bg-[#EBF3F0] text-forest border border-forest/20' };
      case 'documents_preparing':
        return { label: isTe ? 'డాక్యుమెంట్లు సిద్ధం అవుతున్నాయి' : 'Documents Preparing', bg: 'bg-[#FAF7EC] text-[#8C6D1F] border border-[#EBE3CD]' };
      case 'ready_to_submit':
        return { label: isTe ? 'సమర్పణకు సిద్ధం' : 'Ready to Submit', bg: 'bg-[#EBF3F0] text-forest font-semibold border border-forest/30' };
      case 'reported_submitted':
        return { label: isTe ? 'పౌరుడు నమోదు చేసిన సమర్పణ' : 'Reported Submitted', bg: 'bg-[#F2F1ED] text-charcoal border border-[#E5E5DF]' };
      case 'submission_verified':
        return { label: isTe ? 'సమర్పణ ధృవీకరించబడింది' : 'Verified Submission', bg: 'bg-[#EBF3F0] text-forest border border-forest/30 font-semibold' };
      case 'under_review_verified':
        return { label: isTe ? 'పరిశీలనలో ఉంది' : 'Under Review', bg: 'bg-[#FAF7EC] text-[#8C6D1F] border border-[#EBE3CD]' };
      case 'approved_verified':
        return { label: isTe ? 'ఆమోదించబడింది' : 'Approved', bg: 'bg-[#075B46] text-white font-semibold' };
      case 'rejected_verified':
        return { label: isTe ? 'తిరస్కరించబడింది' : 'Rejected', bg: 'bg-[#FFF5F5] text-rose-700 border border-rose-200' };
      default:
        return { label: isTe ? 'స్థితి తెలియదు' : 'Status Unknown', bg: 'bg-[#F8F7F2] text-secondary-text border border-[#E5E5DF]' };
    }
  };

  const isVerifiedOutcome = (status: ApplicationStatus) => {
    return status.includes('_verified');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5DF] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-charcoal">
            {isTe ? 'దరఖాస్తుల ట్రాకింగ్' : 'Application Status Tracker'}
          </h1>
          <p className="text-xs sm:text-sm text-secondary-text mt-1">
            {isTe
              ? 'మీ దరఖాస్తు తయారీ పురోగతి మరియు నమోదు వివరాలను ట్రాక్ చేయండి.'
              : 'Track your guided preparation progress and citizen-reported reference numbers.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchSessions}
            className="p-2.5 rounded-full bg-white hover:bg-[#F8F7F2] text-charcoal border border-[#E5E5DF] transition-colors cursor-pointer"
            title="Refresh status"
            aria-label="Refresh status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onStartNewApplication}
            className="bg-forest hover:bg-forest/90 text-white font-medium px-4 py-2 rounded-full text-xs sm:text-sm cursor-pointer transition-colors shadow-2xs"
          >
            {isTe ? '+ కొత్త దరఖాస్తు సిద్ధం చేయండి' : '+ Prepare New Application'}
          </button>
        </div>
      </div>

      {/* Honest Status Legend Banner */}
      <div className="bg-[#FAF7EC] rounded-xl p-4 border border-[#EBE3CD] text-xs text-charcoal space-y-1.5">
        <div className="font-semibold text-charcoal flex items-center space-x-1.5">
          <Info className="w-4 h-4 text-[#8C6D1F]" />
          <span>{isTe ? 'పౌరుల నివేదిక vs అధికారిక ధృవీకరణ విధానం:' : 'Citizen Self-Report vs Official Verification Policy:'}</span>
        </div>
        <p className="text-secondary-text leading-relaxed">
          <strong className="text-charcoal font-semibold">Reported Submitted:</strong> {isTe ? 'సచివాలయం లేదా ఆన్‌లైన్ పోర్టల్‌లో దరఖాస్తు చేసిన తర్వాత పౌరుడు నమోదు చేసిన రసీదు నంబర్.' : 'Citizen recorded application reference after visiting Sachivalayam or official portal.'}<br />
          <strong className="text-charcoal font-semibold">Verified Approved/Rejected:</strong> {isTe ? 'అధికారిక శాఖ ద్వారా ధృవీకరించబడిన తుది ఫలితం.' : 'Official outcome validated through authorized government verification.'}
        </p>
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="text-center py-12 text-xs text-secondary-text">
          Loading your application records from database...
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E5DF] p-10 text-center space-y-4">
          <FileText className="w-12 h-12 text-secondary-text/50 mx-auto" />
          <h3 className="font-semibold text-charcoal text-base">
            {isTe ? 'ఇంకా ఎటువంటి దరఖాస్తులు నమోదు కాలేదు' : 'No applications tracked yet'}
          </h3>
          <p className="text-xs text-secondary-text max-w-sm mx-auto leading-relaxed">
            {isTe
              ? 'మీరు ఇంకా ఎటువంటి దరఖాస్తులను సేవ్ చేయలేదు. పథకాన్ని ఎంచుకుని దరఖాస్తు తయారీ ప్రారంభించండి.'
              : 'You haven\'t prepared or tracked any applications yet. Select a welfare scheme to start guided preparation.'}
          </p>
          <button
            onClick={onStartNewApplication}
            className="bg-forest hover:bg-forest/90 text-white font-medium px-5 py-2.5 rounded-full text-xs cursor-pointer shadow-2xs transition-colors"
          >
            {isTe ? 'దరఖాస్తు మార్గదర్శిని ప్రారంభించండి' : 'Start Application Guide'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const badge = getStatusBadge(session.status);
            const verified = isVerifiedOutcome(session.status);

            return (
              <div
                key={session.id}
                className="bg-white rounded-xl p-5 border border-[#E5E5DF] hover:border-forest/30 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E5DF]/60 pb-3">
                  <div>
                    <h3 className="font-semibold text-base text-charcoal">
                      {session.teSchemeName || session.schemeName}
                    </h3>
                    <div className="text-xs text-secondary-text mt-0.5">
                      {session.schemeName} • Created: {formatTimestampDisplay(session.createdAt)}
                    </div>
                  </div>

                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full self-start sm:self-auto ${badge.bg}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#F8F7F2] p-3.5 rounded-lg border border-[#E5E5DF]">
                  <div>
                    <span className="text-secondary-text block mb-0.5">Reference / Ack No:</span>
                    <span className="font-mono font-semibold text-charcoal">
                      {session.officialSubmissionReference || 'Not yet submitted / Pending'}
                    </span>
                  </div>
                  <div>
                    <span className="text-secondary-text block mb-0.5">Documents Checked:</span>
                    <span className="font-semibold text-charcoal">
                      {session.completedDocuments?.length || 0} items verified
                    </span>
                  </div>
                  <div>
                    <span className="text-secondary-text block mb-0.5">Verification Tier:</span>
                    <span className="font-medium text-forest">
                      {verified ? 'Officially Verified' : 'Citizen Self-Reported'}
                    </span>
                  </div>
                </div>

                {/* Self-update state dropdown */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-secondary-text font-medium">Update My Progress:</span>
                    <select
                      value={session.status}
                      onChange={(e) => handleUpdateStatus(session.id, e.target.value as ApplicationStatus)}
                      className="bg-white border border-[#E5E5DF] rounded-lg px-2.5 py-1 text-xs text-charcoal focus:border-forest focus:outline-none"
                    >
                      <option value="interested">Interested</option>
                      <option value="eligibility_assessed">Eligibility Assessed</option>
                      <option value="documents_preparing">Documents Preparing</option>
                      <option value="ready_to_submit">Ready to Submit</option>
                      <option value="reported_submitted">Reported Submitted</option>
                    </select>
                  </div>

                  <span className="text-[11px] text-secondary-text font-mono">
                    ID: {session.id}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
