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
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E5DF] shadow-xs space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E5DF] pb-5">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-[#EBF3F0] text-forest flex items-center justify-center font-bold text-lg border border-forest/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-charcoal">
                పౌరుల వివరాలు & గోప్యత (Profile & Preferences)
              </h1>
              <p className="text-xs text-secondary-text mt-0.5">
                UID: <span className="font-mono text-charcoal">{currentUser?.uid || 'Not signed in'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="text-xs font-medium text-rose-700 hover:bg-rose-50 border border-rose-200 px-3.5 py-1.5 rounded-full cursor-pointer transition-colors"
          >
            Sign Out
          </button>
        </div>

        {successMsg && (
          <div className="p-3 bg-[#EBF3F0] border border-forest/20 text-forest rounded-xl text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* Profile Settings Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-charcoal mb-1">Display Name (పేరు)</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5DF] bg-[#F8F7F2]/40 text-charcoal focus:bg-white focus:border-forest focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block font-medium text-charcoal mb-1">Preferred Language (భాష)</label>
              <select
                value={formData.preferredLanguage}
                onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5DF] bg-[#F8F7F2]/40 text-charcoal focus:bg-white focus:border-forest focus:outline-none transition-colors"
              >
                <option value="te">తెలుగు (Telugu)</option>
                <option value="en">English (India)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-charcoal mb-1">District (జిల్లా)</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5DF] bg-[#F8F7F2]/40 text-charcoal focus:bg-white focus:border-forest focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block font-medium text-charcoal mb-1">Education (చదువు)</label>
              <input
                type="text"
                value={formData.educationLevel}
                onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5DF] bg-[#F8F7F2]/40 text-charcoal focus:bg-white focus:border-forest focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-charcoal mb-1">Occupation (వృత్తి)</label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5DF] bg-[#F8F7F2]/40 text-charcoal focus:bg-white focus:border-forest focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block font-medium text-charcoal mb-1">Income Bracket (వార్షిక ఆదాయం)</label>
              <input
                type="text"
                value={formData.incomeRange}
                onChange={(e) => setFormData({ ...formData, incomeRange: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5DF] bg-[#F8F7F2]/40 text-charcoal focus:bg-white focus:border-forest focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Voice Narration & Privacy */}
          <div className="pt-3 border-t border-[#E5E5DF] space-y-2.5">
            <label className="flex items-center space-x-2 text-xs font-medium text-charcoal cursor-pointer">
              <input
                type="checkbox"
                checked={formData.voiceNarration}
                onChange={(e) => setFormData({ ...formData, voiceNarration: e.target.checked })}
                className="w-4 h-4 rounded text-forest focus:ring-forest"
              />
              <span className="flex items-center space-x-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#8C6D1F]" />
                <span>
                  {currentLanguage === 'te'
                    ? 'స్పీచ్ సింథసిస్ వాయిస్ వివరణ ఎల్లప్పుడూ ఆన్ చేయండి (Enable Web Speech Voice Narration)'
                    : 'Enable Web Speech API Voice Narration for schemes, assistant responses & notifications'}
                </span>
              </span>
            </label>

            <label className="flex items-center space-x-2 text-xs font-medium text-charcoal cursor-pointer">
              <input
                type="checkbox"
                checked={formData.consentAnalytics}
                onChange={(e) => setFormData({ ...formData, consentAnalytics: e.target.checked })}
                className="w-4 h-4 rounded text-forest focus:ring-forest"
              />
              <span className="text-secondary-text">Allow anonymous session metrics for public impact reporting (No PII shared)</span>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-forest hover:bg-forest/90 text-white font-medium px-6 py-2.5 rounded-full text-xs sm:text-sm shadow-2xs transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'మార్పులను భద్రపరచండి (Save)'}</span>
            </button>
          </div>
        </form>

        {/* Data Portability & GDPR / DPDP Compliance */}
        <div className="pt-6 border-t border-[#E5E5DF] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-charcoal flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-forest" />
                <span>డేటా డౌన్‌లోడ్ & తొలగింపు (Data Privacy Rights)</span>
              </h3>
              <p className="text-[11px] text-secondary-text mt-0.5">
                You can download your entire citizen demographic record or permanently delete your account.
              </p>
            </div>

            <button
              onClick={handleExportData}
              className="bg-white hover:bg-[#F8F7F2] text-charcoal font-medium text-xs px-3.5 py-2 rounded-full border border-[#E5E5DF] flex items-center space-x-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-secondary-text" />
              <span>Export JSON</span>
            </button>
          </div>

          {/* Delete Account */}
          <div className="bg-[#FFF8F8] border border-[#F3D6D6] rounded-xl p-4 text-xs text-rose-900 space-y-2">
            <div className="font-semibold flex items-center space-x-1.5 text-rose-900">
              <Trash2 className="w-4 h-4 text-rose-700" />
              <span>శాశ్వత ఖాతా తొలగింపు (Permanent Account Deletion)</span>
            </div>
            <p className="text-secondary-text text-[11px] leading-relaxed">
              This will permanently delete your citizen profile, isolated contact records, saved bookmarks, and preparation sessions from Cloud Firestore and Firebase Authentication.
            </p>

            {showDeleteConfirm ? (
              <div className="pt-2 flex items-center space-x-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="bg-rose-700 hover:bg-rose-800 text-white font-medium px-4 py-2 rounded-full text-xs cursor-pointer shadow-2xs disabled:opacity-50 transition-colors"
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete Everything Permanently'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-secondary-text hover:text-charcoal font-medium text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-white hover:bg-rose-50 text-rose-800 font-medium px-3.5 py-1.5 rounded-full text-xs border border-rose-300 cursor-pointer transition-colors"
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
