import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Phone,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../firebase/config';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { signInWithGoogle, sendPhoneOtp, confirmPhoneOtp } = useAuth();
  const { speakNotification, currentLanguage } = useLanguage();

  const [authMode, setAuthMode] = useState<'google' | 'phone'>('google');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'enter_phone' | 'verify_otp'>('enter_phone');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

  // Dedicated, stable DOM container ref for reCAPTCHA
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);
  // Dedicated verifier ref to prevent duplicate initialization and allow clean teardown
  const verifierRef = useRef<RecaptchaVerifier | null>(null);
  const timerRef = useRef<any>(null);

  // Safely cleanup the RecaptchaVerifier instance
  const cleanupVerifier = () => {
    if (verifierRef.current) {
      try {
        verifierRef.current.clear();
      } catch (e) {
        // Suppress expected clear exceptions during widget disposal
      }
      verifierRef.current = null;
    }
  };

  // Handle countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [countdown]);

  // Clean up verifier when modal closes or unmounts
  useEffect(() => {
    if (!isOpen) {
      cleanupVerifier();
      setErrorMessage(null);
      setSuccessMessage(null);
      setPhoneDigits('');
      setOtpCode('');
      setStep('enter_phone');
      setConfirmationResult(null);
      setCountdown(0);
    }
    return () => {
      cleanupVerifier();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Map Firebase errors to clear, actionable citizen explanations
  const getFriendlyErrorMessage = (err: any): string => {
    const code = err?.code || '';
    const message = err?.message || '';

    switch (code) {
      case 'auth/operation-not-allowed':
        return 'Firebase Console లో Phone Authentication ప్రొవైడర్ ఇంకా ఎనేబుల్ చేయబడలేదు (Phone sign-in is not enabled in Firebase Console). దయచేసి Firebase Console > Authentication > Sign-in method లో "Phone" ను Enable చేయండి, లేదా సులభంగా "Google Sign-In" ద్వారా లాగిన్ అవ్వండి.';
      case 'auth/invalid-phone-number':
        return 'చెల్లని మొబైల్ నంబర్. దయచేసి సరైన 10 అంకెల భారతీయ మొబైల్ నంబర్ నమోదు చేయండి (Invalid 10-digit Indian phone number).';
      case 'auth/too-many-requests':
        return 'చాలా ఎక్కువ అభ్యర్థనలు పంపబడ్డాయి. దయచేసి కొన్ని నిమిషాలు వేచి ఉండండి లేదా Google ఖాతాతో లాగిన్ అవ్వండి (Too many requests. Please wait or use Google Sign-In).';
      case 'auth/quota-exceeded':
        return 'SMS కోటా పరిమితి దాటింది. దయచేసి Google ఖాతా ద్వారా సైన్ ఇన్ అవ్వండి (SMS quota exceeded. Please sign in with Google).';
      case 'auth/unauthorized-domain':
        return 'ఈ వెబ్‌సైట్ డొమైన్ Firebase Authentication లో అనుమతించబడలేదు. Firebase Console > Authentication > Settings > Authorized domains లో ప్రస్తుత డొమైన్ జోడించండి (Domain not authorized in Firebase Console).';
      case 'auth/invalid-verification-code':
        return 'నమోదు చేసిన ఓటీపీ తప్పుగా ఉంది. దయచేసి SMS లో వచ్చిన 6 అంకెల కోడ్‌ను సరిగ్గా నమోదు చేయండి (Invalid 6-digit OTP code).';
      case 'auth/code-expired':
        return 'ఈ ఓటీపీ కాలపరిమితి ముగిసింది. దయచేసి "ఓటీపీ మళ్ళీ పంపండి" క్లిక్ చేయండి (Verification code expired. Please request a new OTP).';
      case 'auth/captcha-check-failed':
        return 'reCAPTCHA ధృవీకరణ విఫలమైంది. దయచేసి పేజీని రీఫ్రెష్ చేసి మళ్ళీ ప్రయత్నించండి (reCAPTCHA verification failed).';
      case 'auth/popup-closed-by-user':
        return 'Google సైన్ ఇన్ పాపప్ ముగిసింది. దయచేసి మళ్ళీ ప్రయత్నించండి (Sign-in popup was closed).';
      case 'auth/popup-blocked':
        return 'బ్రౌజర్ లో పాపప్ బ్లాక్ చేయబడింది. దయచేసి పాపప్‌లను అనుమతించండి (Popup was blocked by your browser).';
      case 'auth/network-request-failed':
        return 'నెట్‌వర్క్ కనెక్షన్ లోపం. దయచేసి మీ ఇంటర్నెట్ కనెక్షన్‌ని పరిశీలించండి (Network error. Check connection).';
      default:
        return message || 'లాగిన్ ప్రక్రియలో లోపం ఏర్పడింది. దయచేసి మళ్ళీ ప్రయత్నించండి (Authentication error. Please retry).';
    }
  };

  const handleTabSwitch = (mode: 'google' | 'phone') => {
    cleanupVerifier();
    setAuthMode(mode);
    setErrorMessage(null);
    setSuccessMessage(null);
    setStep('enter_phone');
    setOtpCode('');
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await signInWithGoogle();
      const msg = 'Successfully signed in with Google! (Google ఖాతాతో విజయవంతంగా లాగిన్ అయ్యారు)';
      setSuccessMessage(msg);
      speakNotification(
        currentLanguage === 'te' ? 'Google లాగిన్ విజయవంతమైంది' : 'Successfully signed in with Google'
      );
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 700);
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      const friendlyErr = getFriendlyErrorMessage(err);
      setErrorMessage(friendlyErr);
      speakNotification(
        currentLanguage === 'te' ? 'లాగిన్ కాలేదు' : 'Sign-in failed',
        friendlyErr
      );
    } finally {
      setLoading(false);
    }
  };

  // Dedicated helper to create or retrieve the stable RecaptchaVerifier
  const getOrCreateVerifier = async (): Promise<RecaptchaVerifier> => {
    if (verifierRef.current) {
      return verifierRef.current;
    }

    const container = recaptchaContainerRef.current;
    if (!container) {
      throw new Error('reCAPTCHA container element is not available in DOM.');
    }

    // Clear any previous widget remnants inside the container
    container.innerHTML = '';

    const verifier = new RecaptchaVerifier(auth, container, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved callback
      },
      'expired-callback': () => {
        cleanupVerifier();
      }
    });

    await verifier.render();
    verifierRef.current = verifier;
    return verifier;
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loading) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate 10-digit Indian Mobile Number
    const cleaned = phoneDigits.replace(/\D/g, '');
    if (cleaned.length !== 10 || !/^[6-9]\d{9}$/.test(cleaned)) {
      setErrorMessage('దయచేసి సరైన 10 అంకెల భారతీయ మొబైల్ నంబర్ (6-9 తో ప్రారంభమయ్యేది) నమోదు చేయండి (Please enter a valid 10-digit Indian phone number starting with 6-9).');
      return;
    }

    const fullPhoneNumber = `+91${cleaned}`;
    setLoading(true);

    try {
      const verifier = await getOrCreateVerifier();
      const confResult = await sendPhoneOtp(fullPhoneNumber, verifier);
      setConfirmationResult(confResult);
      setStep('verify_otp');
      setCountdown(60);
      setSuccessMessage(`OTP sent successfully to ${fullPhoneNumber} (ఓటీపీ పంపబడింది)`);
      speakNotification(
        currentLanguage === 'te' ? 'ఓటీపీ విజయవంతంగా పంపబడింది' : 'OTP sent successfully'
      );
    } catch (err: any) {
      console.error('Error sending SMS OTP:', err);
      // Clean up consumed/broken verifier so retry starts fresh
      cleanupVerifier();
      const friendlyErr = getFriendlyErrorMessage(err);
      setErrorMessage(friendlyErr);
      speakNotification(
        currentLanguage === 'te' ? 'ఓటీపీ పంపడంలో లోపం' : 'Failed to send OTP',
        friendlyErr
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !confirmationResult) return;

    const trimmedOtp = otpCode.trim();
    if (trimmedOtp.length !== 6) {
      const msg = 'దయచేసి SMS లో వచ్చిన 6 అంకెల ఓటీపీని నమోదు చేయండి (Please enter the 6-digit OTP code).';
      setErrorMessage(msg);
      speakNotification(
        currentLanguage === 'te' ? 'సరైన 6 అంకెల ఓటీపీ నమోదు చేయండి' : 'Please enter 6-digit OTP'
      );
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await confirmPhoneOtp(confirmationResult, trimmedOtp);
      setSuccessMessage('Phone number verified successfully! (ఫోన్ నంబర్ విజయవంతంగా ధృవీకరించబడింది)');
      speakNotification(
        currentLanguage === 'te' ? 'ఫోన్ నంబర్ విజయవంతంగా ధృవీకరించబడింది' : 'Phone verified successfully'
      );
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 700);
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      const friendlyErr = getFriendlyErrorMessage(err);
      setErrorMessage(friendlyErr);
      speakNotification(
        currentLanguage === 'te' ? 'ఓటీపీ సరిపోలలేదు' : 'Invalid OTP code',
        friendlyErr
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-xl border border-[#E5E5DF] relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-secondary-text hover:text-charcoal rounded-full hover:bg-[#F8F7F2] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="text-center space-y-2 mb-6">
          <img
            src="/logo.png"
            alt="Grama Sahayya AI"
            className="w-14 h-14 rounded-2xl object-contain mx-auto shadow-xs"
          />
          <h2 className="text-xl font-semibold tracking-tight text-charcoal">
            పౌరుల లాగిన్ / Sign In to Grama Sahayya
          </h2>
          <p className="text-xs text-secondary-text">
            Official government scheme guidance, eligibility evaluation, and application tracking.
          </p>
        </div>

        {/* Tab switcher: Google vs Phone */}
        <div className="grid grid-cols-2 gap-1 bg-[#F8F7F2] p-1 rounded-xl mb-5 text-xs font-medium border border-[#E5E5DF]">
          <button
            type="button"
            onClick={() => handleTabSwitch('google')}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              authMode === 'google' ? 'bg-white text-charcoal shadow-2xs font-semibold' : 'text-secondary-text hover:text-charcoal'
            }`}
          >
            Google Sign-In (సిఫార్సు)
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('phone')}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              authMode === 'phone' ? 'bg-white text-charcoal shadow-2xs font-semibold' : 'text-secondary-text hover:text-charcoal'
            }`}
          >
            Phone OTP (+91)
          </button>
        </div>

        {/* Dynamic Contextual Feedback Banners */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#FFF5F5] border border-rose-200 text-rose-800 text-xs space-y-2">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
            {authMode === 'phone' && (
              <button
                type="button"
                onClick={() => handleTabSwitch('google')}
                className="w-full mt-1 bg-white hover:bg-[#F8F7F2] text-forest font-medium py-1.5 px-3 rounded-lg border border-[#E5E5DF] text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-2xs"
              >
                <span>👉 Continue with Google Sign-In instead (Google ఖాతాతో లాగిన్ అవ్వండి)</span>
              </button>
            )}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#EBF3F0] border border-forest/20 text-forest text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-forest" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Mode A: Google OAuth */}
        {authMode === 'google' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white hover:bg-[#F8F7F2] text-charcoal font-medium py-3 px-4 rounded-xl border border-[#E5E5DF] shadow-2xs flex items-center justify-center space-x-3 transition-colors cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'Connecting Google Account...' : 'Continue with Google Account'}</span>
            </button>

            <div className="bg-[#FAF7EC] rounded-xl p-3 text-xs text-charcoal border border-[#EBE3CD] flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-forest shrink-0 mt-0.5" />
              <span className="text-secondary-text leading-relaxed">
                Real Google OAuth verified via Firebase Authentication. We never access your Google password or private emails.
              </span>
            </div>
          </div>
        )}

        {/* Mode B: Indian Phone Number + SMS OTP */}
        {authMode === 'phone' && (
          <div>
            {step === 'enter_phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">
                    భారతీయ మొబైల్ నంబర్ (Indian Mobile Number)
                  </label>
                  <div className="flex items-center rounded-xl border border-[#E5E5DF] overflow-hidden focus-within:border-forest transition-colors">
                    <span className="bg-[#F8F7F2] px-3.5 py-3 text-sm font-semibold text-charcoal border-r border-[#E5E5DF] select-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phoneDigits}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 10) setPhoneDigits(val);
                      }}
                      placeholder="9876543210"
                      maxLength={10}
                      autoFocus
                      className="w-full px-3 py-3 text-sm focus:outline-none font-mono text-charcoal"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-secondary-text mt-1">
                    Enter valid 10 digits. Real SMS OTP will be delivered via Firebase.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || phoneDigits.length !== 10}
                  className="w-full bg-forest hover:bg-forest/90 text-white font-medium py-3 px-4 rounded-xl shadow-2xs transition-colors cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Phone className="w-4 h-4" />
                  <span>{loading ? 'Sending SMS OTP...' : 'Send SMS OTP (ఓటీపీ పంపండి)'}</span>
                </button>

                <div className="bg-[#F8F7F2] rounded-xl p-3 text-[11px] text-secondary-text border border-[#E5E5DF] flex items-start space-x-2">
                  <Info className="w-3.5 h-3.5 text-secondary-text shrink-0 mt-0.5" />
                  <span>
                    Google Sign-In is active and requires zero SMS setup. You can also sign in instantly using the Google tab above.
                  </span>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">
                    SMS లో వచ్చిన 6 అంకెల ఓటీపీ నమోదు చేయండి
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 6) setOtpCode(val);
                      }}
                      placeholder="123456"
                      maxLength={6}
                      autoFocus
                      className="w-full px-3 py-3 text-center text-2xl font-bold tracking-widest rounded-xl border border-[#E5E5DF] focus:outline-none focus:border-forest font-mono text-charcoal"
                      required
                    />
                    <Lock className="w-4 h-4 text-secondary-text absolute right-3 top-4" />
                  </div>

                  <div className="flex justify-between items-center text-xs mt-2 text-secondary-text">
                    <span>Sent to: <strong className="text-charcoal">+91 {phoneDigits}</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        cleanupVerifier();
                        setStep('enter_phone');
                        setErrorMessage(null);
                        setSuccessMessage(null);
                      }}
                      className="text-forest font-medium underline cursor-pointer hover:text-forest/80"
                    >
                      Change Number
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="w-full bg-forest hover:bg-forest/90 text-white font-medium py-3 px-4 rounded-xl shadow-2xs transition-colors cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{loading ? 'Verifying OTP...' : 'Verify OTP & Sign In'}</span>
                </button>

                {/* Resend Countdown & Retry Controls */}
                <div className="pt-2 text-center text-xs">
                  {countdown > 0 ? (
                    <span className="text-secondary-text">
                      Resend OTP in <strong className="text-charcoal font-mono">{countdown}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      disabled={loading}
                      className="text-forest font-medium hover:underline inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Resend SMS OTP (ఓటీపీ మళ్ళీ పంపండి)</span>
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}

        {/* Stable, Dedicated reCAPTCHA DOM container that is NEVER removed conditionally */}
        <div
          ref={recaptchaContainerRef}
          id="recaptcha-stable-container"
          className="flex justify-center my-1"
        ></div>

        {/* Honest Privacy & Method Distinction Notice */}
        <div className="mt-5 pt-3 border-t border-[#E5E5DF] text-center text-[11px] text-secondary-text space-y-1">
          <p>
            Google Sign-In and Phone OTP are separate methods. Browsing public schemes is always free and does not require sign-in.
          </p>
          <div className="flex items-center justify-center space-x-1 text-forest font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero middleman fees • No Aadhaar OTP or bank PIN collected</span>
          </div>
        </div>
      </div>
    </div>
  );
};
