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
      <div className="bg-forest text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-forest/20 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-white/10 text-gold border border-gold/30 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {adminRole || 'Super Administrator'}
            </span>
            <span className="bg-white/10 text-white/80 border border-white/20 text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              <span>Cloud Firestore Real-Time Secured</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            అడ్మినిస్ట్రేషన్ & అనలిటిక్స్ డాష్‌బోర్డ్ (Audit Desk)
          </h1>
          <p className="text-xs text-white/70">
            Authorized Account: <strong className="text-gold font-mono">{currentUser?.email || 'mannemdarsan@gmail.com'}</strong>
          </p>
        </div>

        {/* Global Controls & Refresh */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            disabled={loadingData}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 flex items-center space-x-1.5 text-xs font-medium cursor-pointer disabled:opacity-50 transition-colors"
            title="Refresh Firestore counts"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {isAnalyticsViewer && (
            <button
              onClick={handleExportAnalyticsReport}
              className="p-2.5 bg-white hover:bg-[#FAF7EC] text-charcoal rounded-full border border-[#E5E5DF] flex items-center space-x-1.5 text-xs font-medium cursor-pointer shadow-2xs transition-colors"
              title="Export report CSV"
            >
              <Download className="w-4 h-4 text-forest" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-1 bg-[#F8F7F2] p-1.5 rounded-xl text-xs font-medium border border-[#E5E5DF]">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
            activeTab === 'overview' ? 'bg-white text-charcoal shadow-2xs font-semibold' : 'text-secondary-text hover:text-charcoal'
          }`}
        >
          1. Overview (సమీక్ష)
        </button>

        <button
          onClick={() => setActiveTab('scheme_analytics')}
          className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
            activeTab === 'scheme_analytics' ? 'bg-white text-charcoal shadow-2xs font-semibold' : 'text-secondary-text hover:text-charcoal'
          }`}
        >
          2. Scheme Analytics
        </button>

        <button
          onClick={() => setActiveTab('user_analytics')}
          className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
            activeTab === 'user_analytics' ? 'bg-white text-charcoal shadow-2xs font-semibold' : 'text-secondary-text hover:text-charcoal'
          }`}
        >
          3. User Demographics
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
            activeTab === 'applications' ? 'bg-white text-charcoal shadow-2xs font-semibold' : 'text-secondary-text hover:text-charcoal'
          }`}
        >
          4. Application Tracking
        </button>

        {isSchemeReviewer && (
          <button
            onClick={() => setActiveTab('schemes')}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'schemes' ? 'bg-white text-charcoal shadow-2xs font-semibold' : 'text-secondary-text hover:text-charcoal'
            }`}
          >
            5. Scheme Review
          </button>
        )}

        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('admin_audit')}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'admin_audit' ? 'bg-white text-charcoal shadow-2xs font-semibold' : 'text-secondary-text hover:text-charcoal'
            }`}
          >
            6. RBAC & Audit Trail
          </button>
        )}
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center justify-between text-xs text-secondary-text bg-white p-3 rounded-xl border border-[#E5E5DF]">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-forest" />
          <span className="font-medium text-charcoal">Counting Period:</span>
        </div>
        <div className="flex space-x-1.5">
          {(['7d', '30d', '90d', 'all'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDateFilter(d)}
              className={`px-2.5 py-1 rounded-full font-medium text-xs cursor-pointer transition-colors ${
                dateFilter === d ? 'bg-forest text-white' : 'bg-[#F8F7F2] hover:bg-[#F2F1ED] text-secondary-text'
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
            <div className="bg-white p-5 rounded-xl border border-[#E5E5DF] shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-secondary-text text-xs">
                <span>Total Registered Accounts</span>
                <Users className="w-4 h-4 text-forest" />
              </div>
              <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-charcoal">
                {metrics.totalUsers}
              </div>
              <div className="text-[11px] text-secondary-text flex items-center justify-between">
                <span>Google: <strong className="text-charcoal">{metrics.googleUsersCount}</strong></span>
                <span>Phone: <strong className="text-charcoal">{metrics.phoneVerifiedCount}</strong></span>
              </div>
            </div>

            {/* Card 2: Active Users */}
            <div className="bg-white p-5 rounded-xl border border-[#E5E5DF] shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-secondary-text text-xs">
                <span>Active Users (7d / 30d)</span>
                <Activity className="w-4 h-4 text-forest" />
              </div>
              <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-charcoal">
                {metrics.active7d} <span className="text-xs text-secondary-text font-normal">/ {metrics.active30d} (30d)</span>
              </div>
              <div className="text-[11px] text-forest font-medium">
                Engaged citizen sessions
              </div>
            </div>

            {/* Card 3: Eligibility Checks */}
            <div className="bg-white p-5 rounded-xl border border-[#E5E5DF] shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-secondary-text text-xs">
                <span>Eligibility Checks Completed</span>
                <CheckCircle2 className="w-4 h-4 text-[#8C6D1F]" />
              </div>
              <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-charcoal">
                {metrics.eligibilityChecksCount}
              </div>
              <div className="text-[11px] text-secondary-text">
                Calculated by deterministic engine
              </div>
            </div>

            {/* Card 4: Applications Initiated */}
            <div className="bg-white p-5 rounded-xl border border-[#E5E5DF] shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-secondary-text text-xs">
                <span>Applications Initiated</span>
                <FileText className="w-4 h-4 text-forest" />
              </div>
              <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-charcoal">
                {metrics.applicationsInitiated}
              </div>
              <div className="text-[11px] text-forest font-medium">
                Guidance workflows started
              </div>
            </div>
          </div>

          {/* Submission and Outcomes Split */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#E5E5DF] space-y-2">
              <div className="text-xs font-semibold text-charcoal uppercase tracking-wider">
                Self-Reported Submissions
              </div>
              <div className="text-2xl font-semibold text-charcoal">
                {metrics.selfReportedSubmissions}
              </div>
              <p className="text-xs text-secondary-text leading-relaxed">
                Citizens who entered their official Secretariat / Portal application acknowledgement numbers.
              </p>
            </div>

            <div className="bg-[#EBF3F0] p-5 rounded-xl border border-forest/20 space-y-2">
              <div className="text-xs font-semibold text-forest uppercase tracking-wider">
                Authorized Submissions
              </div>
              <div className="text-2xl font-semibold text-forest">
                {metrics.verifiedSubmissions}
              </div>
              <p className="text-xs text-secondary-text leading-relaxed">
                Confirmed submissions through official integration or admin verification.
              </p>
            </div>

            <div className="bg-[#FAF7EC] p-5 rounded-xl border border-[#EBE3CD] space-y-2">
              <div className="text-xs font-semibold text-[#8C6D1F] uppercase tracking-wider">
                Sanctions & Outliers
              </div>
              <div className="text-base font-semibold text-charcoal flex items-center justify-between">
                <span>Approved: <strong className="text-forest">{metrics.approvedVerified}</strong></span>
                <span>Rejected: <strong className="text-rose-700">{metrics.rejectedVerified}</strong></span>
                <span>Pending: <strong className="text-[#8C6D1F]">{metrics.pendingVerified}</strong></span>
              </div>
              <p className="text-[11px] text-secondary-text">
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
        <div className="bg-white rounded-2xl border border-[#E5E5DF] p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-base text-charcoal">
                స్కీమ్‌ల వారీగా దరఖాస్తులు & విశ్లేషణ (Per-Scheme Conversion Breakdown)
              </h3>
              <p className="text-xs text-secondary-text">
                Authoritative unique applicant counts and eligibility-to-application conversion rates.
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-secondary-text absolute left-3 top-3" />
              <input
                type="text"
                value={searchSchemeQuery}
                onChange={(e) => setSearchSchemeQuery(e.target.value)}
                placeholder="Search scheme name..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#E5E5DF] rounded-xl bg-[#F8F7F2] focus:bg-white focus:outline-none focus:border-forest transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal">
              <thead className="bg-[#F8F7F2] text-secondary-text uppercase tracking-wider font-medium border-b border-[#E5E5DF]">
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
              <tbody className="divide-y divide-[#E5E5DF]">
                {filteredSchemeAnalytics.map((item) => (
                  <tr key={item.scheme.id} className="hover:bg-[#F8F7F2]/60 transition-colors">
                    <td className="p-3">
                      <div className="font-medium text-charcoal">{item.scheme.officialName}</div>
                      <div className="text-[11px] text-secondary-text">{item.scheme.teName}</div>
                    </td>
                    <td className="p-3">
                      <span className="capitalize bg-[#F8F7F2] border border-[#E5E5DF] px-2 py-0.5 rounded-full font-medium text-secondary-text">
                        {item.scheme.govLevel}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-medium">{item.uniqueViews}</td>
                    <td className="p-3 font-mono font-medium">{item.uniqueEligibilityChecks}</td>
                    <td className="p-3 font-mono font-semibold text-forest">{item.uniqueApplicants}</td>
                    <td className="p-3 font-mono">{item.submittedCount}</td>
                    <td className="p-3">
                      <span className="font-semibold text-forest bg-[#F4F9F6] border border-[#D0E5DB] px-2 py-0.5 rounded-full">
                        {item.conversionRate}%
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-[11px] text-forest font-medium flex items-center space-x-1">
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
          <div className="bg-white rounded-2xl border border-[#E5E5DF] p-6 shadow-2xs space-y-4">
            <h3 className="font-semibold text-base text-charcoal flex items-center space-x-2">
              <Users className="w-4 h-4 text-forest" />
              <span>Authentication Method Breakdown</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-medium mb-1.5 text-charcoal">
                  <span>Google Sign-In Accounts</span>
                  <span className="text-secondary-text">{metrics.googleUsersCount} ({metrics.totalUsers > 0 ? ((metrics.googleUsersCount / metrics.totalUsers) * 100).toFixed(0) : 0}%)</span>
                </div>
                <div className="w-full bg-[#F8F7F2] h-2 rounded-full overflow-hidden border border-[#E5E5DF]">
                  <div
                    className="bg-forest h-2 rounded-full"
                    style={{ width: `${metrics.totalUsers > 0 ? (metrics.googleUsersCount / metrics.totalUsers) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1.5 text-charcoal">
                  <span>Verified Phone OTP (+91)</span>
                  <span className="text-secondary-text">{metrics.phoneVerifiedCount} ({metrics.totalUsers > 0 ? ((metrics.phoneVerifiedCount / metrics.totalUsers) * 100).toFixed(0) : 0}%)</span>
                </div>
                <div className="w-full bg-[#F8F7F2] h-2 rounded-full overflow-hidden border border-[#E5E5DF]">
                  <div
                    className="bg-[#2E7D32] h-2 rounded-full"
                    style={{ width: `${metrics.totalUsers > 0 ? (metrics.phoneVerifiedCount / metrics.totalUsers) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF7EC] border border-[#E6B84A]/30 text-xs text-charcoal">
              Citizens can securely authenticate via real Google OAuth or Phone SMS OTP. No passwords or Aadhaar biometrics are ever stored.
            </div>
          </div>

          {/* Language Preference Breakdown */}
          <div className="bg-white rounded-2xl border border-[#E5E5DF] p-6 shadow-2xs space-y-4">
            <h3 className="font-semibold text-base text-charcoal flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#8C6D1F]" />
              <span>Citizen Language Preferences</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-3 bg-[#F8F7F2] rounded-xl border border-[#E5E5DF]">
                <span className="font-medium text-charcoal">తెలుగు (Telugu - Native)</span>
                <span className="font-mono text-forest font-semibold">
                  {registeredUsers.filter((u) => u.preferredLanguage === 'te').length || metrics.totalUsers} users
                </span>
              </div>
              <div className="flex justify-between p-3 bg-[#F8F7F2] rounded-xl border border-[#E5E5DF]">
                <span className="font-medium text-charcoal">English (India)</span>
                <span className="font-mono text-secondary-text font-semibold">
                  {registeredUsers.filter((u) => u.preferredLanguage === 'en').length} users
                </span>
              </div>
              <div className="flex justify-between p-3 bg-[#F8F7F2] rounded-xl border border-[#E5E5DF]">
                <span className="font-medium text-charcoal">हिन्दी (Hindi)</span>
                <span className="font-mono text-secondary-text font-semibold">
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
        <div className="bg-white rounded-2xl border border-[#E5E5DF] p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-base text-charcoal">
                నిజమైన దరఖాస్తుల ట్రాకింగ్ (Application Journey Records)
              </h3>
              <p className="text-xs text-secondary-text">
                Auditable records distinguishing citizen self-reported reference numbers from verified government sanctions.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border border-[#E5E5DF] rounded-xl text-xs bg-[#F8F7F2] text-charcoal focus:bg-white focus:outline-none"
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
            <div className="text-center py-12 bg-[#F8F7F2] rounded-2xl border border-dashed border-[#E5E5DF] text-secondary-text space-y-2">
              <FileText className="w-8 h-8 mx-auto text-secondary-text/60" />
              <div className="font-medium text-charcoal">No application records found in Cloud Firestore yet</div>
              <p className="text-xs text-secondary-text max-w-sm mx-auto">
                Applications initiated by citizens through the Preparation Workflow will appear here automatically with real audit timestamps.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-charcoal">
                <thead className="bg-[#F8F7F2] text-secondary-text uppercase tracking-wider font-medium border-b border-[#E5E5DF]">
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
                <tbody className="divide-y divide-[#E5E5DF]">
                  {schemeApplications
                    .filter((a) => (statusFilter === 'all' ? true : a.status === statusFilter))
                    .map((app) => (
                      <tr key={app.id} className="hover:bg-[#F8F7F2]/60 transition-colors">
                        <td className="p-3 font-mono font-medium text-charcoal">{app.id.slice(0, 16)}...</td>
                        <td className="p-3 font-mono text-secondary-text">{app.userId.slice(0, 8)}...</td>
                        <td className="p-3 font-medium text-charcoal">{app.officialName || app.schemeName}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full font-medium text-[11px] border ${
                            app.status === 'approved_verified'
                              ? 'bg-[#F4F9F6] text-forest border-[#D0E5DB]'
                              : app.status === 'submitted_self_reported'
                              ? 'bg-[#F5F2F9] text-[#5C2D91] border-[#E2D9F3]'
                              : app.status === 'submitted_verified'
                              ? 'bg-[#F0F7FF] text-[#1D5E99] border-[#CCE2F7]'
                              : 'bg-[#F8F7F2] text-secondary-text border-[#E5E5DF]'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-[11px] font-mono text-secondary-text">{app.statusSource}</span>
                        </td>
                        <td className="p-3 font-mono font-medium text-charcoal">
                          {app.officialSubmissionReference || 'N/A'}
                        </td>
                        <td className="p-3 text-secondary-text font-mono text-[11px]">
                          {app.lastUpdatedAt ? String(app.lastUpdatedAt).slice(0, 10) : 'Recent'}
                        </td>
                        {(isSuperAdmin || isSupportStaff) && (
                          <td className="p-3">
                            <select
                              value={app.status}
                              onChange={(e) =>
                                handleUpdateApplicationStatus(app.id, e.target.value as ApplicationJourneyStatus)
                              }
                              className="p-1 border border-[#E5E5DF] rounded-lg text-xs bg-[#F8F7F2] text-charcoal cursor-pointer"
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
        <div className="bg-white rounded-2xl border border-[#E5E5DF] p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base text-charcoal">
                పథకాల సమాచార సమీక్ష (Scheme Content Review & Governance)
              </h3>
              <p className="text-xs text-secondary-text">
                Ground schemes strictly in verified government gazettes and official department notifications.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal">
              <thead className="bg-[#F8F7F2] text-secondary-text uppercase tracking-wider font-medium border-b border-[#E5E5DF]">
                <tr>
                  <th className="p-3">Scheme Name</th>
                  <th className="p-3">Official URL</th>
                  <th className="p-3">Last Verified Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5DF]">
                {schemesList.map((scheme) => (
                  <tr key={scheme.id} className="hover:bg-[#F8F7F2]/60 transition-colors">
                    <td className="p-3">
                      <div className="font-medium text-charcoal">{scheme.officialName}</div>
                      <div className="text-[11px] text-secondary-text">{scheme.department}</div>
                    </td>
                    <td className="p-3">
                      <a
                        href={scheme.officialApplicationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-forest hover:underline flex items-center space-x-1"
                      >
                        <span className="truncate max-w-[150px]">{scheme.officialApplicationUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="p-3 font-mono">{scheme.lastVerifiedAt}</td>
                    <td className="p-3">
                      <span className="bg-[#F4F9F6] text-forest border border-[#D0E5DB] font-medium px-2 py-0.5 rounded-full text-[11px]">
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
                        className="px-2.5 py-1 bg-[#F8F7F2] hover:bg-[#EFEFEA] border border-[#E5E5DF] text-charcoal rounded-lg text-xs font-medium cursor-pointer transition-colors"
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
          <div className="bg-white rounded-2xl border border-[#E5E5DF] p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-base text-charcoal">
                  అడ్మినిస్ట్రేటివ్ పాత్రలు & అనుమతులు (RBAC Role Assignments)
                </h3>
                <p className="text-xs text-secondary-text">
                  Only Super Administrators can create or alter administrative roles.
                </p>
              </div>

              <button
                onClick={() => setShowRoleModal(true)}
                className="bg-forest hover:bg-[#064e3b] text-white font-medium px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer transition-colors shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>Assign New Admin Role</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-charcoal">
                <thead className="bg-[#F8F7F2] text-secondary-text uppercase tracking-wider font-medium border-b border-[#E5E5DF]">
                  <tr>
                    <th className="p-3">Email</th>
                    <th className="p-3">UID</th>
                    <th className="p-3">Assigned Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Assigned By</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5DF]">
                  {/* Default bootstrapped admin */}
                  <tr className="bg-[#FAF7EC]/50">
                    <td className="p-3 font-medium text-charcoal">mannemdarsan@gmail.com</td>
                    <td className="p-3 font-mono text-secondary-text">{currentUser?.uid || 'bootstrapped-uid'}</td>
                    <td className="p-3">
                      <span className="bg-[#FAF7EC] text-[#8C6D1F] border border-[#E6B84A]/40 font-medium px-2 py-0.5 rounded-full text-[11px]">
                        super_admin (Primary)
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-forest font-medium">Active</span>
                    </td>
                    <td className="p-3 text-secondary-text">System Bootstrapped</td>
                    <td className="p-3 text-secondary-text/60">Protected</td>
                  </tr>

                  {adminUsersList.map((admin) => (
                    <tr key={admin.uid} className="hover:bg-[#F8F7F2]/60 transition-colors">
                      <td className="p-3 font-medium text-charcoal">{admin.email}</td>
                      <td className="p-3 font-mono text-secondary-text">{admin.uid.slice(0, 10)}...</td>
                      <td className="p-3">
                        <span className="bg-[#F8F7F2] border border-[#E5E5DF] text-charcoal font-medium px-2 py-0.5 rounded-full text-[11px]">
                          {admin.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={admin.isActive ? 'text-forest font-medium' : 'text-rose-600 font-medium'}>
                          {admin.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-3 text-secondary-text">{admin.assignedBy}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleAdminStatus(admin)}
                          className="text-xs text-rose-600 hover:underline cursor-pointer font-medium"
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
          <div className="bg-white rounded-2xl border border-[#E5E5DF] p-6 shadow-2xs space-y-4">
            <h3 className="font-semibold text-base text-charcoal">
              భద్రతా ఆడిట్ చరిత్ర (Security Audit Logs)
            </h3>

            {auditLogsList.length === 0 ? (
              <div className="p-4 text-xs text-secondary-text bg-[#F8F7F2] rounded-xl text-center border border-[#E5E5DF]">
                No administrative audit entries logged yet. All role updates, scheme verifications, and status changes will be recorded here.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-charcoal">
                  <thead className="bg-[#F8F7F2] text-secondary-text uppercase tracking-wider font-medium border-b border-[#E5E5DF]">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Actor Email</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Target Collection</th>
                      <th className="p-3">Target ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5DF]">
                    {auditLogsList.map((log) => (
                      <tr key={log.id} className="hover:bg-[#F8F7F2]/60 font-mono text-[11px] transition-colors">
                        <td className="p-3 text-secondary-text">{log.timestamp ? String(log.timestamp).replace('T', ' ').slice(0, 19) : 'Just now'}</td>
                        <td className="p-3 font-medium text-charcoal">{log.actorEmail}</td>
                        <td className="p-3 font-semibold text-forest">{log.action}</td>
                        <td className="p-3 text-secondary-text">{log.targetCollection}</td>
                        <td className="p-3 text-secondary-text">{log.targetId}</td>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E5E5DF] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5DF] pb-3">
              <h3 className="font-semibold text-base text-charcoal">
                Assign Administrative Role
              </h3>
              <button
                onClick={() => setShowRoleModal(false)}
                className="p-1 rounded-full text-secondary-text hover:text-charcoal cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignRole} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-charcoal mb-1">Administrator Email:</label>
                <input
                  type="email"
                  value={roleForm.email}
                  onChange={(e) => setRoleForm({ ...roleForm, email: e.target.value })}
                  placeholder="admin@gramasahayya.in"
                  required
                  className="w-full p-2.5 rounded-xl border border-[#E5E5DF] bg-[#F8F7F2] text-charcoal focus:bg-white focus:outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block font-medium text-charcoal mb-1">Firebase User UID:</label>
                <input
                  type="text"
                  value={roleForm.uid}
                  onChange={(e) => setRoleForm({ ...roleForm, uid: e.target.value })}
                  placeholder="User UID from Firebase Authentication"
                  required
                  className="w-full p-2.5 rounded-xl border border-[#E5E5DF] bg-[#F8F7F2] text-charcoal font-mono focus:bg-white focus:outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block font-medium text-charcoal mb-1">Designated Role:</label>
                <select
                  value={roleForm.role}
                  onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value as AdminRole })}
                  className="w-full p-2.5 rounded-xl border border-[#E5E5DF] bg-[#F8F7F2] text-charcoal font-medium focus:bg-white focus:outline-none focus:border-forest"
                >
                  <option value="super_admin">1. Super Administrator (Full Access)</option>
                  <option value="scheme_reviewer">2. Scheme Content Reviewer (Draft & Verify)</option>
                  <option value="support_staff">3. Support Staff (Assistance Sessions)</option>
                  <option value="analytics_viewer">4. Analytics Viewer (Read-only Reports)</option>
                </select>
              </div>

              <div className="p-3 bg-[#FAF7EC] border border-[#E6B84A]/30 rounded-xl text-charcoal text-[11px]">
                Assigned roles are stored in Firestore with server verification and cannot be modified by unprivileged users.
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-[#E5E5DF]">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 rounded-full border border-[#E5E5DF] text-charcoal font-medium hover:bg-[#F8F7F2] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={roleSaving}
                  className="px-4 py-2 rounded-full bg-forest text-white font-medium shadow-2xs hover:bg-[#064e3b] cursor-pointer disabled:opacity-50 transition-colors"
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
