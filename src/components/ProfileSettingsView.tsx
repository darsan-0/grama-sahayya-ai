import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Download,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  LogOut,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface ProfileSettingsViewProps {
  onClose?: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({ onClose }) => {
  const { currentUser, userProfile, updateCitizenProfile, deleteAccount, logout } = useAuth();
  const {
    currentLanguage,
    setLanguage,
    voiceNarrationEnabled,
    setVoiceNarrationEnabled,
    speakNotification
  } = useLanguage();

  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    preferredLanguage: userProfile?.preferredLanguage || currentLanguage,
    state: userProfile?.state || 'Andhra Pradesh',
    district: userProfile?.district || 'Guntur',
    educationLevel: userProfile?.educationLevel || 'Undergraduate',
    occupation: userProfile?.occupation || 'Student',
    incomeRange: userProfile?.incomeRange || 'Below Rs 1.5 Lakhs',
    consentAnalytics: userProfile?.consentAnalytics ?? true,
    voiceNarration: voiceNarrationEnabled,
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      await updateCitizenProfile(formData);
      if (formData.preferredLanguage) {
        setLanguage(formData.preferredLanguage);
      }
      setVoiceNarrationEnabled(formData.voiceNarration);
      setSuccessMsg('Profile preferences updated successfully! (వివరాలు భద్రపరచబడ్డాయి)');
      speakNotification(
        currentLanguage === 'te'
          ? 'పౌరుల వివరాలు విజయవంతంగా అప్‌డేట్ చేయబడ్డాయి'
          : 'Profile preferences updated successfully'
      );
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(
      {
        profile: userProfile,
        exportedAt: new Date().toISOString(),
        platform: 'Grama Sahayya AI'
      },
      null,
      2
    );
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grama_sahayya_citizen_data_${currentUser?.uid.slice(0, 6)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      if (onClose) onClose();
    } catch (err: any) {
      alert('Failed to delete account: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-5">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900 text-amber-300 flex items-center justify-center font-bold text-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
                పౌరుల వివరాలు & గోప్యత (Profile & Preferences)
              </h1>
              <p className="text-xs text-stone-500">
                UID: <span className="font-mono text-stone-700">{currentUser?.uid || 'Not signed in'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl cursor-pointer"
          >
            Sign Out
          </button>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Profile Settings Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Display Name (పేరు)</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Preferred Language (భాష)</label>
              <select
                value={formData.preferredLanguage}
                onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300"
              >
                <option value="te">తెలుగు (Telugu)</option>
                <option value="en">English (India)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">District (జిల్లా)</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Education (చదువు)</label>
              <input
                type="text"
                value={formData.educationLevel}
                onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Occupation (వృత్తి)</label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Income Bracket (వార్షిక ఆదాయం)</label>
              <input
                type="text"
                value={formData.incomeRange}
                onChange={(e) => setFormData({ ...formData, incomeRange: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>
          </div>

          {/* Voice Narration & Privacy */}
          <div className="pt-2 border-t border-stone-100 space-y-2">
            <label className="flex items-center space-x-2 text-xs font-semibold text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.voiceNarration}
                onChange={(e) => setFormData({ ...formData, voiceNarration: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-800"
              />
              <span className="flex items-center space-x-1.5">
                <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {currentLanguage === 'te'
                    ? 'స్పీచ్ సింథసిస్ వాయిస్ వివరణ ఎల్లప్పుడూ ఆన్ చేయండి (Enable Web Speech Voice Narration)'
                    : 'Enable Web Speech API Voice Narration for schemes, assistant responses & notifications'}
                </span>
              </span>
            </label>

            <label className="flex items-center space-x-2 text-xs font-semibold text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.consentAnalytics}
                onChange={(e) => setFormData({ ...formData, consentAnalytics: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-800"
              />
              <span>Allow anonymous session metrics for public impact reporting (No PII shared)</span>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'మార్పులను భద్రపరచండి (Save)'}</span>
            </button>
          </div>
        </form>

        {/* Data Portability & GDPR / DPDP Compliance */}
        <div className="pt-6 border-t border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-stone-900 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>డేటా డౌన్‌లోడ్ & తొలగింపు (Data Privacy Rights)</span>
              </h3>
              <p className="text-[11px] text-stone-500">
                You can download your entire citizen demographic record or permanently delete your account.
              </p>
            </div>

            <button
              onClick={handleExportData}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs px-3.5 py-2 rounded-xl border border-stone-300 flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>

          {/* Delete Account */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-900 space-y-2">
            <div className="font-bold flex items-center space-x-1.5 text-rose-900">
              <Trash2 className="w-4 h-4 text-rose-700" />
              <span>శాశ్వత ఖాతా తొలగింపు (Permanent Account Deletion)</span>
            </div>
            <p className="text-stone-600 text-[11px]">
              This will permanently delete your citizen profile, isolated contact records, saved bookmarks, and preparation sessions from Cloud Firestore and Firebase Authentication.
            </p>

            {showDeleteConfirm ? (
              <div className="pt-2 flex items-center space-x-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete Everything Permanently'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-stone-600 font-semibold text-xs hover:underline cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold px-3 py-1.5 rounded-lg text-xs border border-rose-300 cursor-pointer"
              >
                Delete My Citizen Account
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
