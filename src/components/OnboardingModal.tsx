import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Languages,
  MapPin,
  GraduationCap,
  Briefcase,
  IndianRupee,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserProfile } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const AP_DISTRICTS = [
  'Alluri Sitharama Raju', 'Anakapalli', 'Ananthapuramu', 'Annamayya', 'Bapatla',
  'Chittoor', 'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur',
  'Kakinada', 'Krishna', 'Kurnool', 'Nandyal', 'NTR (Vijayawada)', 'Palnadu',
  'Parvathipuram Manyam', 'Prakasam', 'Srikakulam', 'Sri Potti Sriramulu Nellore',
  'Sri Sathya Sai', 'Tirupati', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const { userProfile, updateCitizenProfile } = useAuth();
  const { setLanguage, currentLanguage } = useLanguage();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    preferredLanguage: userProfile?.preferredLanguage || currentLanguage || 'te',
    state: userProfile?.state || 'Andhra Pradesh',
    district: userProfile?.district || 'Guntur',
    locationType: userProfile?.locationType || 'rural',
    educationLevel: userProfile?.educationLevel || 'Undergraduate',
    studyYear: userProfile?.studyYear || '2nd Year',
    occupation: userProfile?.occupation || 'Student',
    incomeRange: userProfile?.incomeRange || 'Below Rs 1.5 Lakhs',
    approxAnnualIncome: userProfile?.approxAnnualIncome || 120000,
    age: userProfile?.age || 20,
    gender: userProfile?.gender || 'female',
    socialCategory: userProfile?.socialCategory || 'BC',
    hasDisability: userProfile?.hasDisability || false,
    isFarmer: userProfile?.isFarmer || false,
  });

  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSave();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (formData.preferredLanguage) {
        setLanguage(formData.preferredLanguage);
      }
      await updateCitizenProfile(formData);
      onClose();
      if (onComplete) onComplete();
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-xl border border-[#E5E5DF] relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-secondary-text hover:text-charcoal rounded-full hover:bg-[#F8F7F2] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6 border-b border-[#E5E5DF] pb-4">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  step === s
                    ? 'bg-forest text-white'
                    : step > s
                    ? 'bg-[#EBF3F0] text-forest'
                    : 'bg-[#F8F7F2] text-secondary-text border border-[#E5E5DF]'
                }`}
              >
                {step > s ? <CheckCircle2 className="w-3.5 h-3.5" /> : s}
              </div>
            ))}
          </div>
          <span className="text-xs font-medium text-secondary-text">
            Step {step} of 3 • Citizen Onboarding
          </span>
        </div>

        {/* Step 1: Language & Geography */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-charcoal flex items-center space-x-2">
                <Languages className="w-5 h-5 text-forest" />
                <span>భాష మరియు ప్రాంతం (Language & Location)</span>
              </h3>
              <p className="text-xs text-secondary-text mt-0.5">
                Used to show localized welfare information and district-specific Secretariat links.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">
                Preferred Language (మీకు కావలసిన భాష)
              </label>
              <select
                value={formData.preferredLanguage}
                onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5DF] bg-[#F8F7F2]/40 text-charcoal text-sm focus:bg-white focus:border-forest focus:outline-none transition-colors"
              >
                <option value="te">తెలుగు (Telugu - Recommended)</option>
                <option value="en">English (India)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="or">ଓଡ଼ିଆ (Odia)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">State (రాష్ట్రం)</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5DF] bg-[#F8F7F2]/40 text-charcoal text-sm focus:bg-white focus:border-forest focus:outline-none transition-colors"
                >
                  <option value="Andhra Pradesh">Andhra Pradesh (ఆంధ్రప్రదేశ్)</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Other">Other Indian State</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">District (జిల్లా)</label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5DF] bg-[#F8F7F2]/40 text-charcoal text-sm focus:bg-white focus:border-forest focus:outline-none transition-colors"
                >
                  {AP_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">Location Type (నివాస ప్రాంతం)</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'rural', label: 'గ్రామీణ (Rural)' },
                  { id: 'urban', label: 'పట్టణ (Urban)' },
                  { id: 'semi-urban', label: 'నగర శివారు (Semi-urban)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, locationType: item.id as any })}
                    className={`p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      formData.locationType === item.id
                        ? 'bg-forest text-white border-forest shadow-2xs'
                        : 'bg-[#F8F7F2] text-charcoal border-[#E5E5DF] hover:bg-[#F2F1ED]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Occupation, Education & Age */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-charcoal flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-forest" />
                <span>విద్య మరియు వృత్తి (Education & Occupation)</span>
              </h3>
              <p className="text-xs text-secondary-text mt-0.5">
                Helps filter scholarships, farmer welfare, youth training, and self-employment schemes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Occupation (వృత్తి)</label>
                <select
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5DF] bg-[#F8F7F2]/40 text-charcoal text-sm focus:bg-white focus:border-forest focus:outline-none transition-colors"
                >
                  <option value="Student">విద్యార్థి (Student)</option>
                  <option value="Farmer / Cultivator">రైతు / సాగుదారు (Farmer)</option>
                  <option value="Tenant Farmer (CCRC)">కౌలు రైతు (Tenant Farmer)</option>
                  <option value="Small Business / Vendor">చిరు వ్యాపారి (Small Business)</option>
                  <option value="Daily Wage Laborer">కూలీ కార్మికుడు (Daily Laborer)</option>
                  <option value="Self Help Group (DWCRA)">డ్వాక్రా మహిళ (SHG Member)</option>
                  <option value="Unemployed Job Seeker">ఉద్యోగార్థి (Unemployed)</option>
                  <option value="Homemaker">గృహిణి (Homemaker)</option>
                  <option value="Senior Citizen">వృద్ధులు (Senior Citizen)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Education Level (చదువు)</label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5DF] bg-[#F8F7F2]/40 text-charcoal text-sm focus:bg-white focus:border-forest focus:outline-none transition-colors"
                >
                  <option value="School (Below 10th)">10వ తరగతి లోపు</option>
                  <option value="Intermediate / 10+2">ఇంటర్మీడియట్</option>
                  <option value="Polytechnic / ITI">పాలిటెక్నిక్ / ఐటీఐ</option>
                  <option value="Undergraduate (B.Tech, Degree)">డిగ్రీ / బి.టెక్ (Undergraduate)</option>
                  <option value="Postgraduate (PG, MBA, M.Tech)">పోస్ట్ గ్రాడ్యుయేషన్ (PG)</option>
                  <option value="Non-Literate">నిరక్షరాస్యులు</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Age (వయస్సు - సంవత్సరాలు)</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value, 10) || 18 })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5DF] bg-[#F8F7F2]/40 text-charcoal text-sm focus:bg-white focus:border-forest focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Gender (లింగం)</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5DF] bg-[#F8F7F2]/40 text-charcoal text-sm focus:bg-white focus:border-forest focus:outline-none transition-colors"
                >
                  <option value="female">మహిళ (Female)</option>
                  <option value="male">పురుషుడు (Male)</option>
                  <option value="transgender">ట్రాన్స్‌జెండర్ (Transgender)</option>
                </select>
              </div>
            </div>

            {/* Checkboxes for Farmer and Disability */}
            <div className="pt-2 space-y-2">
              <label className="flex items-center space-x-2 text-xs font-medium text-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFarmer}
                  onChange={(e) => setFormData({ ...formData, isFarmer: e.target.checked })}
                  className="w-4 h-4 rounded text-forest focus:ring-forest"
                />
                <span className="text-secondary-text">మా కుటుంబానికి వ్యవసాయ భూమి ఉంది లేదా కౌలు రైతుగా ఉన్నాము (Farmer / Tenant Cultivator)</span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-medium text-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasDisability}
                  onChange={(e) => setFormData({ ...formData, hasDisability: e.target.checked })}
                  className="w-4 h-4 rounded text-forest focus:ring-forest"
                />
                <span className="text-secondary-text">సదరమ్ (SADAREM) 40%+ దివ్యాంగుల ధృవీకరణ పత్రం ఉంది (Differently Abled)</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Income Range & Social Category */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-charcoal flex items-center space-x-2">
                <IndianRupee className="w-5 h-5 text-forest" />
                <span>ఆదాయం & సామాజిక వర్గం (Income & Category)</span>
              </h3>
              <p className="text-xs text-secondary-text mt-0.5">
                Crucial for assessing Rice Card eligibility, fee reimbursement, and pension limits.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">
                కుటుంబ వార్షిక ఆదాయ పరిధి (Annual Household Income Range)
              </label>
              <select
                value={formData.incomeRange}
                onChange={(e) => {
                  const val = e.target.value;
                  let approx = 120000;
                  if (val.includes('50,000')) approx = 50000;
                  else if (val.includes('1.5 Lakhs')) approx = 120000;
                  else if (val.includes('2.5 Lakhs')) approx = 200000;
                  else if (val.includes('5 Lakhs')) approx = 400000;
                  else approx = 700000;

                  setFormData({ ...formData, incomeRange: val, approxAnnualIncome: approx });
                }}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5DF] bg-[#F8F7F2]/40 text-charcoal text-sm focus:bg-white focus:border-forest focus:outline-none transition-colors"
              >
                <option value="Below Rs 1.5 Lakhs">Below ₹1.5 Lakhs/yr (రైస్ కార్డు / బిలో పావర్టీ లైన్)</option>
                <option value="Rs 1.5 - Rs 2.5 Lakhs">₹1.5 Lakhs - ₹2.5 Lakhs/yr (విద్యా దీవెన అర్హత)</option>
                <option value="Rs 2.5 - Rs 5 Lakhs">₹2.5 Lakhs - ₹5 Lakhs/yr (ఆరోగ్యశ్రీ పరిధి)</option>
                <option value="Above Rs 5 Lakhs">Above ₹5 Lakhs/yr</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">
                సామాజిక వర్గం (Social Category / Community)
              </label>
              <select
                value={formData.socialCategory}
                onChange={(e) => setFormData({ ...formData, socialCategory: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5DF] bg-[#F8F7F2]/40 text-charcoal text-sm focus:bg-white focus:border-forest focus:outline-none transition-colors"
              >
                <option value="BC">బీసీ (Backward Classes - BC-A/B/C/D/E)</option>
                <option value="SC">ఎస్సీ (Scheduled Caste)</option>
                <option value="ST">ఎస్టీ (Scheduled Tribe)</option>
                <option value="Kapu">కాపు (Kapu Community)</option>
                <option value="Minority">మైనారిటీ (Muslim, Christian, etc.)</option>
                <option value="EWS">ఈడబ్ల్యూఎస్ (Economically Weaker Section)</option>
                <option value="OC">ఓసీ (General Category)</option>
              </select>
            </div>

            {/* Zero sensitive data guarantee */}
            <div className="bg-[#FAF7EC] rounded-xl p-4 border border-[#EBE3CD] text-xs text-charcoal space-y-1">
              <div className="flex items-center space-x-1.5 text-charcoal font-semibold">
                <ShieldCheck className="w-4 h-4 text-forest" />
                <span>వ్యక్తిగత గోప్యత రక్షణ (Zero Sensitive Identifiers)</span>
              </div>
              <p className="text-secondary-text leading-relaxed">
                We do not collect or store your 12-digit Aadhaar number, bank passwords, or biometrics. These basic criteria are only used locally to calculate matching welfare benefits.
              </p>
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#E5E5DF]">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 text-secondary-text hover:text-charcoal text-xs sm:text-sm font-medium flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>వెనుకకు (Back)</span>
            </button>
          ) : (
            <div></div>
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={saving}
            className="bg-forest hover:bg-forest/90 text-white font-medium px-6 py-2.5 rounded-full text-xs sm:text-sm shadow-2xs transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>{step === 3 ? (saving ? 'సేవ్ అవుతోంది...' : 'పూర్తి చేయండి (Finish)') : 'తరువాత (Next)'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
