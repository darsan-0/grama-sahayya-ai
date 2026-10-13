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
        return { label: isTe ? 'ఆసక్తి చూపబడింది' : 'Interested', bg: 'bg-stone-100 text-stone-700' };
      case 'eligibility_assessed':
        return { label: isTe ? 'అర్హత పరిశీలించబడింది' : 'Assessed', bg: 'bg-blue-100 text-blue-800' };
      case 'documents_preparing':
        return { label: isTe ? 'డాక్యుమెంట్లు సిద్ధం అవుతున్నాయి' : 'Documents Preparing', bg: 'bg-amber-100 text-amber-800' };
      case 'ready_to_submit':
        return { label: isTe ? 'సమర్పణకు సిద్ధం' : 'Ready to Submit', bg: 'bg-emerald-100 text-emerald-800' };
      case 'reported_submitted':
        return { label: isTe ? 'పౌరుడు నమోదు చేసిన సమర్పణ' : 'Reported Submitted', bg: 'bg-purple-100 text-purple-800' };
      case 'submission_verified':
        return { label: isTe ? 'సమర్పణ ధృవీకరించబడింది' : 'Verified Submission', bg: 'bg-teal-100 text-teal-900 border border-teal-300' };
      case 'under_review_verified':
        return { label: isTe ? 'పరిశీలనలో ఉంది' : 'Under Review', bg: 'bg-amber-100 text-amber-900' };
      case 'approved_verified':
        return { label: isTe ? 'ఆమోదించబడింది' : 'Approved', bg: 'bg-emerald-200 text-emerald-950 font-bold' };
      case 'rejected_verified':
        return { label: isTe ? 'తిరస్కరించబడింది' : 'Rejected', bg: 'bg-rose-100 text-rose-900' };
      default:
        return { label: isTe ? 'స్థితి తెలియదు' : 'Status Unknown', bg: 'bg-stone-100 text-stone-600' };
    }
  };

  const isVerifiedOutcome = (status: ApplicationStatus) => {
    return status.includes('_verified');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 flex items-center space-x-2">
            <span>{isTe ? 'దరఖాస్తుల ట్రాకింగ్' : 'Application Status Tracker'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {isTe
              ? 'మీ దరఖాస్తు తయారీ పురోగతి మరియు నమోదు వివరాలను ట్రాక్ చేయండి.'
              : 'Track your guided preparation progress and citizen-reported reference numbers.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchSessions}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
            title="Refresh status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onStartNewApplication}
            className="bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm cursor-pointer shadow-xs"
          >
            {isTe ? '+ కొత్త దరఖాస్తు సిద్ధం చేయండి' : '+ Prepare New Application'}
          </button>
        </div>
      </div>

      {/* Honest Status Legend Banner */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-stone-800 space-y-1">
        <div className="font-bold text-amber-950 flex items-center space-x-1.5">
          <Info className="w-4 h-4 text-amber-700" />
          <span>{isTe ? 'పౌరుల నివేదిక vs అధికారిక ధృవీకరణ విధానం:' : 'Citizen Self-Report vs Official Verification Policy:'}</span>
        </div>
        <p>
          <strong>Reported Submitted:</strong> {isTe ? 'సచివాలయం లేదా ఆన్‌లైన్ పోర్టల్‌లో దరఖాస్తు చేసిన తర్వాత పౌరుడు నమోదు చేసిన రసీదు నంబర్.' : 'Citizen recorded application reference after visiting Sachivalayam or official portal.'}<br />
          <strong>Verified Approved/Rejected:</strong> {isTe ? 'అధికారిక శాఖ ద్వారా ధృవీకరించబడిన తుది ఫలితం.' : 'Official outcome validated through authorized government verification.'}
        </p>
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="text-center py-12 text-xs text-stone-400">
          Loading your application records from database...
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-3">
          <FileText className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-800 text-base">
            {isTe ? 'ఇంకా ఎటువంటి దరఖాస్తులు నమోదు కాలేదు' : 'No applications tracked yet'}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {isTe
              ? 'మీరు ఇంకా ఎటువంటి దరఖాస్తులను సేవ్ చేయలేదు. పథకాన్ని ఎంచుకుని దరఖాస్తు తయారీ ప్రారంభించండి.'
              : 'You haven\'t prepared or tracked any applications yet. Select a welfare scheme to start guided preparation.'}
          </p>
          <button
            onClick={onStartNewApplication}
            className="bg-emerald-900 text-amber-300 font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer shadow-xs"
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
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-stone-900">
                      {session.teSchemeName || session.schemeName}
                    </h3>
                    <div className="text-xs text-stone-500">
                      {session.schemeName} • Created: {new Date(session.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto ${badge.bg}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <div>
                    <span className="text-stone-400 font-medium block">Reference / Ack No:</span>
                    <span className="font-mono font-bold text-stone-900">
                      {session.officialSubmissionReference || 'Not yet submitted / Pending'}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium block">Documents Checked:</span>
                    <span className="font-bold text-stone-900">
                      {session.completedDocuments?.length || 0} items verified
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium block">Verification Tier:</span>
                    <span className="font-semibold text-emerald-800">
                      {verified ? 'Officially Verified' : 'Citizen Self-Reported'}
                    </span>
                  </div>
                </div>

                {/* Self-update state dropdown */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-stone-500 font-medium">Update My Progress:</span>
                    <select
                      value={session.status}
                      onChange={(e) => handleUpdateStatus(session.id, e.target.value as ApplicationStatus)}
                      className="bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none"
                    >
                      <option value="interested">Interested</option>
                      <option value="eligibility_assessed">Eligibility Assessed</option>
                      <option value="documents_preparing">Documents Preparing</option>
                      <option value="ready_to_submit">Ready to Submit</option>
                      <option value="reported_submitted">Reported Submitted</option>
                    </select>
                  </div>

                  <span className="text-[11px] text-stone-400">
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
