import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  deleteUser
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase/config';
import { UserProfile, AdminRole, AdminUserRecord } from '../types';
import { trackEngagementEvent } from '../utils/analyticsTracker';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  adminRole: AdminRole | null;
  isSuperAdmin: boolean;
  isSchemeReviewer: boolean;
  isSupportStaff: boolean;
  isAnalyticsViewer: boolean;
  signInWithGoogle: () => Promise<User>;
  sendPhoneOtp: (phoneNumber: string, appVerifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
  confirmPhoneOtp: (confirmationResult: ConfirmationResult, verificationCode: string) => Promise<User>;
  updateCitizenProfile: (updates: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);

  const isSuperAdmin = adminRole === 'super_admin';
  const isSchemeReviewer = isSuperAdmin || adminRole === 'scheme_reviewer';
  const isSupportStaff = isSuperAdmin || adminRole === 'support_staff';
  const isAnalyticsViewer = isSuperAdmin || isSchemeReviewer || adminRole === 'analytics_viewer';
  const isAdmin = adminRole !== null;

  const fetchProfileAndRole = async (uid: string, userObj?: User | null) => {
    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);

      const userEmail = userObj?.email || '';
      const userPhone = userObj?.phoneNumber || '';
      const isGoogle = userObj?.providerData?.some(p => p.providerId === 'google.com');

      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setUserProfile(data);
      } else {
        // Initial citizen profile creation
        const newProfile: UserProfile = {
          uid,
          displayName: userObj?.displayName || (userPhone ? `Citizen (${userPhone.slice(-4)})` : 'Citizen'),
          preferredLanguage: 'te',
          state: 'Andhra Pradesh',
          district: 'Guntur',
          locationType: 'rural',
          educationLevel: 'Undergraduate',
          occupation: 'Student',
          incomeRange: 'Below Rs 1.5 Lakhs',
          consentAnalytics: true,
          phoneVerified: Boolean(userPhone),
          phoneNumber: userPhone || undefined,
          authProvider: isGoogle ? 'google.com' : (userPhone ? 'phone' : 'unknown'),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await setDoc(userRef, {
          ...newProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Store isolated PII in split subcollection
        const privateRef = doc(db, 'users', uid, 'private', 'info');
        await setDoc(privateRef, {
          userId: uid,
          email: userEmail,
          phoneNumber: userPhone,
          updatedAt: serverTimestamp(),
        });

        setUserProfile(newProfile);

        // Track new account created event
        await trackEngagementEvent('account_created', {
          userId: uid,
          metadata: { authProvider: newProfile.authProvider }
        });
      }

      // Check Administrative RBAC
      if (userEmail.toLowerCase() === 'mannemdarsan@gmail.com') {
        setAdminRole('super_admin');
        // Ensure record in adminUsers for auditability
        const adminRef = doc(db, 'adminUsers', uid);
        await setDoc(adminRef, {
          uid,
          email: userEmail,
          displayName: userObj?.displayName || 'Super Administrator',
          role: 'super_admin',
          isActive: true,
          assignedBy: 'system_bootstrap',
          assignedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        }, { merge: true }).catch(() => {});
      } else {
        // Query adminUsers collection
        const adminUserRef = doc(db, 'adminUsers', uid);
        const adminUserSnap = await getDoc(adminUserRef);

        if (adminUserSnap.exists()) {
          const adminData = adminUserSnap.data() as AdminUserRecord;
          if (adminData.isActive) {
            setAdminRole(adminData.role);
          } else {
            setAdminRole(null);
          }
        } else {
          // Check legacy admins collection
          const legacyAdminRef = doc(db, 'admins', uid);
          const legacySnap = await getDoc(legacyAdminRef);
          if (legacySnap.exists()) {
            setAdminRole('super_admin');
          } else {
            setAdminRole(null);
          }
        }
      }
    } catch (err) {
      console.warn('Error fetching or initializing user profile & role:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchProfileAndRole(user.uid, user);
      } else {
        setUserProfile(null);
        setAdminRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<User> => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        await fetchProfileAndRole(res.user.uid, res.user);
        await trackEngagementEvent('login_success', {
          userId: res.user.uid,
          metadata: { method: 'google.com' }
        });
        return res.user;
      }
      throw new Error('Google Sign-In returned empty user record.');
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      throw err;
    }
  };

  const sendPhoneOtp = async (
    phoneNumber: string,
    appVerifier: RecaptchaVerifier
  ): Promise<ConfirmationResult> => {
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      return confirmationResult;
    } catch (err: any) {
      console.error('Error sending SMS OTP:', err);
      throw err;
    }
  };

  const confirmPhoneOtp = async (
    confirmationResult: ConfirmationResult,
    verificationCode: string
  ): Promise<User> => {
    try {
      const userCredential = await confirmationResult.confirm(verificationCode);
      const user = userCredential.user;

      // Update citizen profile with verified phone status
      if (user) {
        await fetchProfileAndRole(user.uid, user);
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          phoneVerified: true,
          phoneNumber: user.phoneNumber || undefined,
          updatedAt: serverTimestamp(),
        }, { merge: true }).catch(() => {});

        await trackEngagementEvent('login_success', {
          userId: user.uid,
          metadata: { method: 'phone', phoneVerified: true }
        });
      }
      return user;
    } catch (err: any) {
      console.error('Error confirming Phone OTP:', err);
      throw err;
    }
  };

  const updateCitizenProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const merged = {
        ...userProfile,
        ...updates,
        userId: currentUser.uid,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(userRef, {
        ...merged,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setUserProfile(merged as UserProfile);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
    setAdminRole(null);
  };

  const deleteAccount = async () => {
    if (!currentUser) return;
    const uid = currentUser.uid;
    try {
      await deleteDoc(doc(db, 'users', uid, 'private', 'info')).catch(() => {});
      await deleteDoc(doc(db, 'users', uid)).catch(() => {});
      await deleteDoc(doc(db, 'adminUsers', uid)).catch(() => {});
      await deleteUser(currentUser);
      setCurrentUser(null);
      setUserProfile(null);
      setAdminRole(null);
    } catch (err) {
      console.error('Error deleting account:', err);
      throw err;
    }
  };

  const refreshProfile = async () => {
    if (currentUser) {
      await fetchProfileAndRole(currentUser.uid, currentUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isAdmin,
        adminRole,
        isSuperAdmin,
        isSchemeReviewer,
        isSupportStaff,
        isAnalyticsViewer,
        signInWithGoogle,
        sendPhoneOtp,
        confirmPhoneOtp,
        updateCitizenProfile,
        logout,
        deleteAccount,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
