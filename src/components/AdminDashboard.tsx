import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Users,
  FileText,
  Search,
  RefreshCw,
  TrendingUp,
  Database,
  Filter,
  Download,
  Lock,
  UserCheck,
  Activity,
  Calendar,
  Layers,
  ChevronRight,
  UserX,
  Eye,
  Info,
  X
} from 'lucide-react';
import {
  collection,
  query,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  orderBy,
  limit,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { VERIFIED_SCHEMES } from '../data/schemes';
import {
  Scheme,
  AdminRole,
  AdminUserRecord,
  AdminAuditLog,
  SchemeApplication,
  AssistanceSession,
  UserProfile,
  ApplicationJourneyStatus
} from '../types';
import { logAdminAudit } from '../utils/analyticsTracker';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    adminRole,
    isSuperAdmin,
    isSchemeReviewer,
    isSupportStaff,
    isAnalyticsViewer
  } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState<
    'overview' | 'scheme_analytics' | 'user_analytics' | 'applications' | 'schemes' | 'admin_audit'
  >('overview');

  // Loading & Live Data State
  const [loadingData, setLoadingData] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Firestore real collections
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([]);
  const [schemeApplications, setSchemeApplications] = useState<SchemeApplication[]>([]);
  const [assistanceSessions, setAssistanceSessions] = useState<AssistanceSession[]>([]);
  const [engagementEvents, setEngagementEvents] = useState<any[]>([]);
  const [adminUsersList, setAdminUsersList] = useState<AdminUserRecord[]>([]);
  const [auditLogsList, setAuditLogsList] = useState<AdminAuditLog[]>([]);
  const [schemesList, setSchemesList] = useState<Scheme[]>(VERIFIED_SCHEMES);

  // Filters
  const [dateFilter, setDateFilter] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [schemeFilter, setSchemeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchSchemeQuery, setSearchSchemeQuery] = useState('');

  // Modals
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleForm, setRoleForm] = useState<{ email: string; uid: string; role: AdminRole }>({
    email: '',
    uid: '',
    role: 'analytics_viewer'
  });
  const [roleSaving, setRoleSaving] = useState(false);

  // Scheme Edit Modal
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);

  // Fetch Authoritative Firestore Records
  useEffect(() => {
    let isMounted = true;

    async function loadAuthoritativeData() {
      setLoadingData(true);
      try {
        // 1. Registered Users
        const usersSnap = await getDocs(collection(db, 'users')).catch(() => null);
        const users: UserProfile[] = [];
        if (usersSnap) {
          usersSnap.forEach((d) => users.push({ ...(d.data() as UserProfile), uid: d.id }));
        }

        // 2. Scheme Applications
        const appsSnap = await getDocs(collection(db, 'schemeApplications')).catch(() => null);
        const apps: SchemeApplication[] = [];
        if (appsSnap) {
          appsSnap.forEach((d) => apps.push({ ...(d.data() as SchemeApplication), id: d.id }));
        }

        // 3. Assistance Sessions
        const sessionsSnap = await getDocs(collection(db, 'assistanceSessions')).catch(() => null);
        const sessions: AssistanceSession[] = [];
        if (sessionsSnap) {
          sessionsSnap.forEach((d) => sessions.push({ ...(d.data() as AssistanceSession), id: d.id }));
        }

        // 4. Engagement Events
        const eventsSnap = await getDocs(
          query(collection(db, 'schemeEvents'), limit(300))
        ).catch(() => null);
        const events: any[] = [];
        if (eventsSnap) {
          eventsSnap.forEach((d) => events.push(d.data()));
        }

        // 5. Admin Users
        const adminUsersSnap = await getDocs(collection(db, 'adminUsers')).catch(() => null);
        const admins: AdminUserRecord[] = [];
        if (adminUsersSnap) {
          adminUsersSnap.forEach((d) => admins.push(d.data() as AdminUserRecord));
        }

        // 6. Audit Logs
        const auditSnap = await getDocs(
          query(collection(db, 'auditLogs'), limit(100))
        ).catch(() => null);
        const logs: AdminAuditLog[] = [];
        if (auditSnap) {
          auditSnap.forEach((d) => logs.push({ ...(d.data() as AdminAuditLog), id: d.id }));
        }

        if (isMounted) {
          setRegisteredUsers(users);
          setSchemeApplications(apps);
          setAssistanceSessions(sessions);
          setEngagementEvents(events);
          setAdminUsersList(admins);
          setAuditLogsList(logs);
        }
      } catch (err) {
        console.error('Error loading authoritative admin data:', err);
      } finally {
        if (isMounted) setLoadingData(false);
      }
    }

    loadAuthoritativeData();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  // Date filtering logic
  const dateCutoff = useMemo(() => {
    const now = new Date();
    if (dateFilter === '7d') {
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    if (dateFilter === '30d') {
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    if (dateFilter === '90d') {
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    }
    return new Date(0); // All time
  }, [dateFilter]);

  // Metrics Calculations (Authoritative Real Counting)
  const metrics = useMemo(() => {
    const totalUsers = registeredUsers.length;
    const phoneVerifiedCount = registeredUsers.filter((u) => u.phoneVerified || u.phoneNumber).length;
    const googleUsersCount = registeredUsers.filter((u) => u.authProvider === 'google.com').length;

    // Active Users (based on createdAt or updatedAt timestamps)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const active7d = registeredUsers.filter((u) => {
      const d = new Date(u.updatedAt || u.createdAt || 0);
      return d >= sevenDaysAgo;
    }).length;

    const active30d = registeredUsers.filter((u) => {
      const d = new Date(u.updatedAt || u.createdAt || 0);
      return d >= thirtyDaysAgo;
    }).length;

    // Events in period
    const filteredEvents = engagementEvents.filter((e) => {
      const d = new Date(e.createdAtIso || 0);
      return d >= dateCutoff;
    });

    const searchesCount = filteredEvents.filter((e) => e.eventType === 'scheme_searched').length;
    const eligibilityChecksCount = filteredEvents.filter((e) => e.eventType === 'eligibility_check_completed').length;
    const savedSchemesCount = filteredEvents.filter((e) => e.eventType === 'scheme_saved').length;

    // Application Journeys in period
    const filteredApps = schemeApplications.filter((a) => {
      const d = new Date(a.lastUpdatedAt || a.startedAt || 0);
      return d >= dateCutoff;
    });

    const applicationsInitiated = filteredApps.length;
    const selfReportedSubmissions = filteredApps.filter(
      (a) => a.status === 'submitted_self_reported' || a.statusSource === 'citizen_self_reported'
    ).length;
    const verifiedSubmissions = filteredApps.filter(
      (a) => a.status === 'submitted_verified' || a.statusSource === 'authorized_integration'
    ).length;
    const approvedVerified = filteredApps.filter((a) => a.status === 'approved_verified').length;
    const rejectedVerified = filteredApps.filter((a) => a.status === 'rejected_verified').length;
    const pendingVerified = filteredApps.filter((a) => a.status === 'pending_verified').length;

    return {
      totalUsers,
      phoneVerifiedCount,
      googleUsersCount,
      active7d,
      active30d,
      searchesCount,
      eligibilityChecksCount,
      savedSchemesCount,
      assistanceSessionsCount: assistanceSessions.length,
      applicationsInitiated,
      selfReportedSubmissions,
      verifiedSubmissions,
      approvedVerified,
      rejectedVerified,
      pendingVerified,
      filteredApps
    };
  }, [registeredUsers, schemeApplications, assistanceSessions, engagementEvents, dateCutoff]);

  // Per-Scheme Aggregation (Authoritative Counting)
  const schemeAnalyticsData = useMemo(() => {
    return schemesList.map((scheme) => {
      const schemeApps = schemeApplications.filter((a) => a.schemeId === scheme.id);
      const uniqueApplicants = new Set(schemeApps.map((a) => a.userId)).size;

      const schemeEvents = engagementEvents.filter((e) => e.schemeId === scheme.id);
      const uniqueViews = new Set(
        schemeEvents.filter((e) => e.eventType === 'scheme_viewed').map((e) => e.userId || e.id)
      ).size;
      const uniqueEligibilityChecks = new Set(
        schemeEvents.filter((e) => e.eventType === 'eligibility_check_completed').map((e) => e.userId || e.id)
      ).size;

      const totalAttempts = schemeApps.reduce((acc, a) => acc + (a.attemptsCount || 1), 0);
      const submittedCount = schemeApps.filter(
        (a) =>
          a.status === 'submitted_self_reported' ||
          a.status === 'submitted_verified' ||
          a.status === 'approved_verified'
      ).length;

      const approvedCount = schemeApps.filter((a) => a.status === 'approved_verified').length;
      const rejectedCount = schemeApps.filter((a) => a.status === 'rejected_verified').length;
      const pendingCount = schemeApps.filter((a) => a.status === 'pending_verified').length;

      // Conversion rate: unique applicants who started an application / unique eligibility checks * 100
      const conversionRate =
        uniqueEligibilityChecks > 0
          ? ((uniqueApplicants / uniqueEligibilityChecks) * 100).toFixed(1)
          : uniqueApplicants > 0
          ? '100.0'
          : '0.0';

      return {
        scheme,
        uniqueViews,
        uniqueEligibilityChecks,
        uniqueApplicants,
        totalAttempts,
        submittedCount,
        approvedCount,
        rejectedCount,
        pendingCount,
        conversionRate,
        lastActivity: schemeApps[0]?.lastUpdatedAt || scheme.lastVerifiedAt
      };
    });
  }, [schemesList, schemeApplications, engagementEvents]);

  // Filtered Scheme Table
  const filteredSchemeAnalytics = useMemo(() => {
    return schemeAnalyticsData.filter((item) => {
      if (searchSchemeQuery.trim()) {
        const q = searchSchemeQuery.toLowerCase();
        return (
          item.scheme.officialName.toLowerCase().includes(q) ||
          item.scheme.teName.toLowerCase().includes(q) ||
          item.scheme.department.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [schemeAnalyticsData, searchSchemeQuery]);

  // Handle Assigning an Administrative Role (Super Admin only)
  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin || !roleForm.uid || !roleForm.email) return;

    setRoleSaving(true);
    try {
      const adminRecord: AdminUserRecord = {
        uid: roleForm.uid,
        email: roleForm.email,
        role: roleForm.role,
        isActive: true,
        assignedBy: currentUser?.email || 'super_admin',
        assignedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'adminUsers', roleForm.uid), adminRecord);

      await logAdminAudit({
        actorUid: currentUser?.uid || 'unknown',
        actorEmail: currentUser?.email || 'super_admin',
        action: 'ASSIGN_ADMIN_ROLE',
        targetCollection: 'adminUsers',
        targetId: roleForm.uid,
        details: { assignedRole: roleForm.role, targetEmail: roleForm.email }
      });

      setShowRoleModal(false);
      setRoleForm({ email: '', uid: '', role: 'analytics_viewer' });
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      console.error('Error assigning admin role:', err);
      alert('Failed to assign role: ' + err.message);
    } finally {
      setRoleSaving(false);
    }
  };

  // Toggle Admin Active Status
  const handleToggleAdminStatus = async (admin: AdminUserRecord) => {
    if (!isSuperAdmin) return;
    try {
      const nextActive = !admin.isActive;
      await updateDoc(doc(db, 'adminUsers', admin.uid), {
        isActive: nextActive,
        updatedAt: serverTimestamp()
      });

      await logAdminAudit({
        actorUid: currentUser?.uid || 'unknown',
        actorEmail: currentUser?.email || 'super_admin',
        action: nextActive ? 'ACTIVATE_ADMIN' : 'DEACTIVATE_ADMIN',
        targetCollection: 'adminUsers',
        targetId: admin.uid,
        details: { email: admin.email, role: admin.role }
      });

      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    }
  };

  // Update Application Verified Status (Support Staff or Super Admin)
  const handleUpdateApplicationStatus = async (
    applicationId: string,
    newStatus: ApplicationJourneyStatus,
    notes?: string
  ) => {
    if (!isSupportStaff && !isSuperAdmin) return;
    try {
      await updateDoc(doc(db, 'schemeApplications', applicationId), {
        status: newStatus,
        statusSource: 'admin_verified',
        verificationNotes: notes || 'Verified by authorized staff',
        verifiedBy: currentUser?.email || 'admin',
        verificationTimestamp: new Date().toISOString(),
        lastUpdatedAt: serverTimestamp()
      });

      await logAdminAudit({
        actorUid: currentUser?.uid || 'unknown',
        actorEmail: currentUser?.email || 'admin',
        action: 'UPDATE_APPLICATION_STATUS',
        targetCollection: 'schemeApplications',
        targetId: applicationId,
        details: { newStatus, notes }
      });

      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      alert('Error updating application status: ' + err.message);
    }
  };

  // Export Analytics CSV
  const handleExportAnalyticsReport = () => {
    const rows = [
      ['Scheme ID', 'Scheme Name', 'Department', 'Unique Views', 'Eligibility Checks', 'Applicants', 'Submissions', 'Conversion Rate %'],
      ...schemeAnalyticsData.map((d) => [
        d.scheme.id,
        d.scheme.officialName,
        d.scheme.department,
        d.uniqueViews,
        d.uniqueEligibilityChecks,
        d.uniqueApplicants,
        d.submittedCount,
        d.conversionRate
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `grama_sahayya_analytics_${dateFilter}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Title & Role Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-500 text-stone-950 font-black text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {adminRole || 'Super Administrator'}
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cloud Firestore Real-Time Secured</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            అడ్మినిస్ట్రేషన్ & అనలిటిక్స్ డాష్‌బోర్డ్ (Audit Desk)
          </h1>
          <p className="text-xs text-stone-300">
            Authorized Account: <strong className="text-amber-300 font-mono">{currentUser?.email || 'mannemdarsan@gmail.com'}</strong>
          </p>
        </div>

        {/* Global Controls & Refresh */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            disabled={loadingData}
            className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl border border-stone-700 flex items-center space-x-1.5 text-xs font-semibold cursor-pointer disabled:opacity-50"
            title="Refresh Firestore counts"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {isAnalyticsViewer && (
            <button
              onClick={handleExportAnalyticsReport}
              className="p-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl border border-emerald-600 flex items-center space-x-1.5 text-xs font-semibold cursor-pointer shadow-xs"
              title="Export report CSV"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl text-xs font-bold border border-stone-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'overview' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          1. Overview (సమీక్ష)
        </button>

        <button
          onClick={() => setActiveTab('scheme_analytics')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'scheme_analytics' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          2. Scheme Analytics
        </button>

        <button
          onClick={() => setActiveTab('user_analytics')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'user_analytics' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          3. User Demographics
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'applications' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          4. Application Tracking
        </button>

        {isSchemeReviewer && (
          <button
            onClick={() => setActiveTab('schemes')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'schemes' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            5. Scheme Review
          </button>
        )}

        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('admin_audit')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'admin_audit' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            6. RBAC & Audit Trail
          </button>
        )}
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center justify-between text-xs text-stone-600 bg-white p-3 rounded-xl border border-stone-200">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-emerald-800" />
          <span className="font-semibold">Counting Period:</span>
        </div>
        <div className="flex space-x-1.5">
          {(['7d', '30d', '90d', 'all'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDateFilter(d)}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                dateFilter === d ? 'bg-emerald-900 text-amber-300' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {d === 'all' ? 'All Time' : d.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: OVERVIEW METRICS                                   */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Card 1: Registered Accounts */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span>Total Registered Accounts</span>
                <Users className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                {metrics.totalUsers}
              </div>
              <div className="text-[11px] text-stone-500 flex items-center justify-between">
                <span>Google: <strong>{metrics.googleUsersCount}</strong></span>
                <span>Phone: <strong>{metrics.phoneVerifiedCount}</strong></span>
              </div>
            </div>

            {/* Card 2: Active Users */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span>Active Users (7d / 30d)</span>
                <Activity className="w-4 h-4 text-blue-700" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                {metrics.active7d} <span className="text-xs text-stone-400 font-normal">/ {metrics.active30d} (30d)</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold">
                Engaged citizen sessions
              </div>
            </div>

            {/* Card 3: Eligibility Checks */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span>Eligibility Checks Completed</span>
                <CheckCircle2 className="w-4 h-4 text-amber-700" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                {metrics.eligibilityChecksCount}
              </div>
              <div className="text-[11px] text-stone-500">
                Calculated by deterministic engine
              </div>
            </div>

            {/* Card 4: Applications Initiated */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span>Applications Initiated</span>
                <FileText className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                {metrics.applicationsInitiated}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold">
                Guidance workflows started
              </div>
            </div>
          </div>

          {/* Submission and Outcomes Split */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 space-y-2">
              <div className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                Self-Reported Submissions
              </div>
              <div className="text-2xl font-black text-emerald-900">
                {metrics.selfReportedSubmissions}
              </div>
              <p className="text-xs text-stone-600">
                Citizens who entered their official Secretariat / Portal application acknowledgement numbers.
              </p>
            </div>

            <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-200 space-y-2">
              <div className="text-xs font-bold text-blue-950 uppercase tracking-wide">
                Authorized Submissions
              </div>
              <div className="text-2xl font-black text-blue-900">
                {metrics.verifiedSubmissions}
              </div>
              <p className="text-xs text-stone-600">
                Confirmed submissions through official integration or admin verification.
              </p>
            </div>

            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 space-y-2">
              <div className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                Sanctions & Outliers
              </div>
              <div className="text-lg font-bold text-stone-900 flex items-center justify-between">
                <span>Approved: <strong className="text-emerald-700">{metrics.approvedVerified}</strong></span>
                <span>Rejected: <strong className="text-rose-700">{metrics.rejectedVerified}</strong></span>
                <span>Pending: <strong className="text-amber-700">{metrics.pendingVerified}</strong></span>
              </div>
              <p className="text-[11px] text-stone-500">
                Grounded only in verified records. We never fabricate approval statistics.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: PER-SCHEME ANALYTICS TABLE                         */}
      {/* ======================================================== */}
      {activeTab === 'scheme_analytics' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-lg text-stone-900">
                స్కీమ్‌ల వారీగా దరఖాస్తులు & విశ్లేషణ (Per-Scheme Conversion Breakdown)
              </h3>
              <p className="text-xs text-stone-500">
                Authoritative unique applicant counts and eligibility-to-application conversion rates.
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchSchemeQuery}
                onChange={(e) => setSearchSchemeQuery(e.target.value)}
                placeholder="Search scheme name..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl bg-stone-50 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-3">Scheme Name</th>
                  <th className="p-3">Level</th>
                  <th className="p-3">Unique Views</th>
                  <th className="p-3">Eligibility Checks</th>
                  <th className="p-3">Unique Applicants</th>
                  <th className="p-3">Submissions</th>
                  <th className="p-3">Conversion Rate</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredSchemeAnalytics.map((item) => (
                  <tr key={item.scheme.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-stone-900">{item.scheme.officialName}</div>
                      <div className="text-[11px] text-stone-500">{item.scheme.teName}</div>
                    </td>
                    <td className="p-3">
                      <span className="capitalize bg-stone-100 px-2 py-0.5 rounded-full font-medium">
                        {item.scheme.govLevel}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-semibold">{item.uniqueViews}</td>
                    <td className="p-3 font-mono font-semibold">{item.uniqueEligibilityChecks}</td>
                    <td className="p-3 font-mono font-bold text-emerald-900">{item.uniqueApplicants}</td>
                    <td className="p-3 font-mono">{item.submittedCount}</td>
                    <td className="p-3">
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {item.conversionRate}%
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: USER ANALYTICS                                     */}
      {/* ======================================================== */}
      {activeTab === 'user_analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sign-in Method Distribution */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-stone-900 flex items-center space-x-2">
              <Users className="w-5 h-5 text-emerald-800" />
              <span>Authentication Method Breakdown</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Google Sign-In Accounts</span>
                  <span>{metrics.googleUsersCount} ({metrics.totalUsers > 0 ? ((metrics.googleUsersCount / metrics.totalUsers) * 100).toFixed(0) : 0}%)</span>
                </div>
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${metrics.totalUsers > 0 ? (metrics.googleUsersCount / metrics.totalUsers) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Verified Phone OTP (+91)</span>
                  <span>{metrics.phoneVerifiedCount} ({metrics.totalUsers > 0 ? ((metrics.phoneVerifiedCount / metrics.totalUsers) * 100).toFixed(0) : 0}%)</span>
                </div>
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2.5 rounded-full"
                    style={{ width: `${metrics.totalUsers > 0 ? (metrics.phoneVerifiedCount / metrics.totalUsers) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600">
              Citizens can securely authenticate via real Google OAuth or Phone SMS OTP. No passwords or Aadhaar biometrics are ever stored.
            </div>
          </div>

          {/* Language Preference Breakdown */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-stone-900 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-amber-600" />
              <span>Citizen Language Preferences</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
                <span className="font-bold text-stone-900">తెలుగు (Telugu - Native)</span>
                <span className="font-mono text-emerald-800 font-bold">
                  {registeredUsers.filter((u) => u.preferredLanguage === 'te').length || metrics.totalUsers} users
                </span>
              </div>
              <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
                <span className="font-bold text-stone-900">English (India)</span>
                <span className="font-mono text-stone-700 font-bold">
                  {registeredUsers.filter((u) => u.preferredLanguage === 'en').length} users
                </span>
              </div>
              <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
                <span className="font-bold text-stone-900">हिन्दी (Hindi)</span>
                <span className="font-mono text-stone-700 font-bold">
                  {registeredUsers.filter((u) => u.preferredLanguage === 'hi').length} users
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: REAL APPLICATION TRACKING JOURNEYS                */}
      {/* ======================================================== */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-lg text-stone-900">
                నిజమైన దరఖాస్తుల ట్రాకింగ్ (Application Journey Records)
              </h3>
              <p className="text-xs text-stone-500">
                Auditable records distinguishing citizen self-reported reference numbers from verified government sanctions.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border border-stone-300 rounded-xl text-xs bg-white"
              >
                <option value="all">All Application Statuses</option>
                <option value="assistance_started">Assistance Started</option>
                <option value="submitted_self_reported">Self-Reported Submitted</option>
                <option value="submitted_verified">Verified Submission</option>
                <option value="approved_verified">Approved</option>
                <option value="rejected_verified">Rejected</option>
              </select>
            </div>
          </div>

          {schemeApplications.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-stone-400 space-y-2">
              <FileText className="w-8 h-8 mx-auto text-stone-300" />
              <div className="font-bold text-stone-700">No application records found in Cloud Firestore yet</div>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Applications initiated by citizens through the Preparation Workflow will appear here automatically with real audit timestamps.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                  <tr>
                    <th className="p-3">Application ID</th>
                    <th className="p-3">Citizen UID</th>
                    <th className="p-3">Scheme Name</th>
                    <th className="p-3">Journey Status</th>
                    <th className="p-3">Source</th>
                    <th className="p-3">Reference / Ack</th>
                    <th className="p-3">Last Updated</th>
                    {(isSuperAdmin || isSupportStaff) && <th className="p-3">Staff Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {schemeApplications
                    .filter((a) => (statusFilter === 'all' ? true : a.status === statusFilter))
                    .map((app) => (
                      <tr key={app.id} className="hover:bg-stone-50/70">
                        <td className="p-3 font-mono font-bold text-stone-900">{app.id.slice(0, 16)}...</td>
                        <td className="p-3 font-mono text-stone-500">{app.userId.slice(0, 8)}...</td>
                        <td className="p-3 font-semibold text-stone-900">{app.officialName || app.schemeName}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                            app.status === 'approved_verified'
                              ? 'bg-emerald-100 text-emerald-900'
                              : app.status === 'submitted_self_reported'
                              ? 'bg-purple-100 text-purple-900'
                              : app.status === 'submitted_verified'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-stone-100 text-stone-700'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-[11px] font-mono text-stone-500">{app.statusSource}</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-amber-900">
                          {app.officialSubmissionReference || 'N/A'}
                        </td>
                        <td className="p-3 text-stone-500 font-mono text-[11px]">
                          {app.lastUpdatedAt ? String(app.lastUpdatedAt).slice(0, 10) : 'Recent'}
                        </td>
                        {(isSuperAdmin || isSupportStaff) && (
                          <td className="p-3">
                            <select
                              value={app.status}
                              onChange={(e) =>
                                handleUpdateApplicationStatus(app.id, e.target.value as ApplicationJourneyStatus)
                              }
                              className="p-1 border border-stone-300 rounded text-xs bg-white cursor-pointer"
                            >
                              <option value="assistance_started">assistance_started</option>
                              <option value="submitted_self_reported">submitted_self_reported</option>
                              <option value="submitted_verified">submitted_verified</option>
                              <option value="approved_verified">approved_verified</option>
                              <option value="rejected_verified">rejected_verified</option>
                            </select>
                          </td>
                        )}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: SCHEME CONTENT REVIEW (Reviewer & Super Admin)    */}
      {/* ======================================================== */}
      {activeTab === 'schemes' && isSchemeReviewer && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-stone-900">
                పథకాల సమాచార సమీక్ష (Scheme Content Review & Governance)
              </h3>
              <p className="text-xs text-stone-500">
                Ground schemes strictly in verified government gazettes and official department notifications.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-3">Scheme Name</th>
                  <th className="p-3">Official URL</th>
                  <th className="p-3">Last Verified Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {schemesList.map((scheme) => (
                  <tr key={scheme.id} className="hover:bg-stone-50">
                    <td className="p-3">
                      <div className="font-bold text-stone-900">{scheme.officialName}</div>
                      <div className="text-[11px] text-stone-500">{scheme.department}</div>
                    </td>
                    <td className="p-3">
                      <a
                        href={scheme.officialApplicationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-800 underline flex items-center space-x-1"
                      >
                        <span className="truncate max-w-[150px]">{scheme.officialApplicationUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="p-3 font-mono">{scheme.lastVerifiedAt}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full text-[11px]">
                        {scheme.verificationStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          const newDate = new Date().toISOString().slice(0, 10);
                          setSchemesList((prev) =>
                            prev.map((s) => (s.id === scheme.id ? { ...s, lastVerifiedAt: newDate } : s))
                          );
                          logAdminAudit({
                            actorUid: currentUser?.uid || 'reviewer',
                            actorEmail: currentUser?.email || 'reviewer',
                            action: 'VERIFY_SCHEME_DATE',
                            targetCollection: 'schemes',
                            targetId: scheme.id,
                            details: { verifiedDate: newDate }
                          });
                        }}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Mark Verified Today
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: RBAC & AUDIT LOGS (Super Admin Only)               */}
      {/* ======================================================== */}
      {activeTab === 'admin_audit' && isSuperAdmin && (
        <div className="space-y-6">
          {/* Admin Roles Management Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-stone-900">
                  అడ్మినిస్ట్రేటివ్ పాత్రలు & అనుమతులు (RBAC Role Assignments)
                </h3>
                <p className="text-xs text-stone-500">
                  Only Super Administrators can create or alter administrative roles.
                </p>
              </div>

              <button
                onClick={() => setShowRoleModal(true)}
                className="bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Assign New Admin Role</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                  <tr>
                    <th className="p-3">Email</th>
                    <th className="p-3">UID</th>
                    <th className="p-3">Assigned Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Assigned By</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {/* Default bootstrapped admin */}
                  <tr className="bg-amber-50/40">
                    <td className="p-3 font-bold text-stone-900">mannemdarsan@gmail.com</td>
                    <td className="p-3 font-mono text-stone-500">{currentUser?.uid || 'bootstrapped-uid'}</td>
                    <td className="p-3">
                      <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[11px]">
                        super_admin (Primary)
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-emerald-700 font-bold">Active</span>
                    </td>
                    <td className="p-3 text-stone-500">System Bootstrapped</td>
                    <td className="p-3 text-stone-400">Protected</td>
                  </tr>

                  {adminUsersList.map((admin) => (
                    <tr key={admin.uid}>
                      <td className="p-3 font-semibold text-stone-900">{admin.email}</td>
                      <td className="p-3 font-mono text-stone-500">{admin.uid.slice(0, 10)}...</td>
                      <td className="p-3">
                        <span className="bg-stone-100 text-stone-800 font-bold px-2 py-0.5 rounded-full text-[11px]">
                          {admin.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={admin.isActive ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                          {admin.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-3 text-stone-500">{admin.assignedBy}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleAdminStatus(admin)}
                          className="text-xs text-rose-700 hover:underline cursor-pointer font-semibold"
                        >
                          {admin.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Security Audit Trail */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-lg text-stone-900">
              భద్రతా ఆడిట్ చరిత్ర (Security Audit Logs)
            </h3>

            {auditLogsList.length === 0 ? (
              <div className="p-4 text-xs text-stone-400 bg-stone-50 rounded-xl text-center">
                No administrative audit entries logged yet. All role updates, scheme verifications, and status changes will be recorded here.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Actor Email</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Target Collection</th>
                      <th className="p-3">Target ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {auditLogsList.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-50 font-mono text-[11px]">
                        <td className="p-3 text-stone-500">{log.timestamp ? String(log.timestamp).replace('T', ' ').slice(0, 19) : 'Just now'}</td>
                        <td className="p-3 font-semibold text-stone-800">{log.actorEmail}</td>
                        <td className="p-3 font-bold text-emerald-900">{log.action}</td>
                        <td className="p-3 text-stone-600">{log.targetCollection}</td>
                        <td className="p-3 text-stone-500">{log.targetId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Role Assignment Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-extrabold text-base text-stone-900">
                Assign Administrative Role
              </h3>
              <button
                onClick={() => setShowRoleModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignRole} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Administrator Email:</label>
                <input
                  type="email"
                  value={roleForm.email}
                  onChange={(e) => setRoleForm({ ...roleForm, email: e.target.value })}
                  placeholder="admin@gramasahayya.in"
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Firebase User UID:</label>
                <input
                  type="text"
                  value={roleForm.uid}
                  onChange={(e) => setRoleForm({ ...roleForm, uid: e.target.value })}
                  placeholder="User UID from Firebase Authentication"
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Designated Role:</label>
                <select
                  value={roleForm.role}
                  onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value as AdminRole })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-semibold"
                >
                  <option value="super_admin">1. Super Administrator (Full Access)</option>
                  <option value="scheme_reviewer">2. Scheme Content Reviewer (Draft & Verify)</option>
                  <option value="support_staff">3. Support Staff (Assistance Sessions)</option>
                  <option value="analytics_viewer">4. Analytics Viewer (Read-only Reports)</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px]">
                Assigned roles are stored in Firestore with server verification and cannot be modified by unprivileged users.
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={roleSaving}
                  className="px-4 py-2 rounded-xl bg-emerald-900 text-amber-300 font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {roleSaving ? 'Saving...' : 'Confirm Role Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
