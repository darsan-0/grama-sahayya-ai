import React, { useState } from 'react';
import { Download, X, Share, Monitor, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../context/LanguageContext';

export const InstallAppPopup: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, shouldShowPopup, install, dismiss } = usePWAInstall();
  const { currentLanguage } = useLanguage();
  const [showInstructions, setShowInstructions] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  const isTe = currentLanguage === 'te';

  // Do not render if already installed, dismissed, or not engaged yet
  if (!shouldShowPopup || isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      setInstalling(true);
      try {
        const result = await install();
        if (result === 'accepted') {
          setInstalledSuccess(true);
          setTimeout(() => {
            dismiss();
          }, 2000);
        } else if (result === 'unsupported') {
          setShowInstructions(true);
        }
      } catch {
        setShowInstructions(true);
      } finally {
        setInstalling(false);
      }
    } else {
      setShowInstructions(prev => !prev);
    }
  };

  return (
    <aside
      role="region"
      aria-label={isTe ? 'యాప్ ఇన్‌స్టాలేషన్' : 'Install App'}
      className="fixed z-40 bottom-5 right-4 sm:bottom-6 sm:right-6 select-none animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-auto"
      style={{
        bottom: 'max(1.25rem, calc(env(safe-area-inset-bottom, 0px) + 1rem))',
        right: 'max(1rem, calc(env(safe-area-inset-right, 0px) + 1rem))'
      }}
    >
      <div className="relative">
        {/* Concise Tooltip when browser requires manual Add to Home Screen / Address Bar install */}
        {showInstructions && (
          <div
            className="absolute bottom-full mb-2 right-0 w-[250px] sm:w-[270px] p-2.5 rounded-xl border border-white/80 shadow-[0_6px_20px_rgba(0,0,0,0.1)] text-[#242824] animate-in fade-in zoom-in-95 duration-150"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)'
            }}
          >
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-[#E5E5DF]/60">
              <span className="text-[11px] font-semibold text-[#075B46] flex items-center gap-1">
                {isIOS ? (
                  <>
                    <Share className="w-3 h-3 text-[#075B46]" />
                    <span>{isTe ? 'హోమ్ స్క్రీన్‌కు చేర్చండి:' : 'Add to Home Screen:'}</span>
                  </>
                ) : (
                  <>
                    <Monitor className="w-3 h-3 text-[#075B46]" />
                    <span>{isTe ? 'బ్రౌజర్ ఇన్‌స్టాల్:' : 'Install via Browser:'}</span>
                  </>
                )}
              </span>
              <button
                type="button"
                onClick={() => setShowInstructions(false)}
                className="text-[#8E918C] hover:text-[#242824] p-0.5 rounded cursor-pointer"
                aria-label="Close instructions"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[10px] text-[#555953] leading-snug">
              {isIOS
                ? isTe
                  ? 'Safari లో Share (⎋) ఐకాన్ నొక్కి, "Add to Home Screen" ను ఎంచుకోండి.'
                  : 'Tap Safari Share (⎋) icon, then tap "Add to Home Screen".'
                : isTe
                  ? 'అడ్రస్ బార్‌లోని (⊕) గుర్తు లేదా మెనూ (⋮) నొక్కి "Install" ఎంచుకోండి.'
                  : 'Click the install icon (⊕) in address bar, or menu (⋮) → "Install app".'}
            </p>
          </div>
        )}

        {/* Floating Minimal Glassmorphism Pill Card */}
        <div
          className="w-[250px] sm:w-[270px] h-[78px] rounded-[16px] border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex items-center justify-between px-3.5 py-2.5 transition-all group"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}
        >
          {/* Circular Close Button (top-right overlapping corner) */}
          <button
            type="button"
            onClick={() => dismiss()}
            aria-label={isTe ? 'మూసివేయండి' : 'Close install prompt'}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white text-[#686B66] hover:text-[#242824] hover:scale-105 shadow-[0_2px_6px_rgba(0,0,0,0.12)] border border-[#E5E5DF]/70 flex items-center justify-center transition-all cursor-pointer z-10"
          >
            <X className="w-3 h-3" strokeWidth={2.5} />
          </button>

          {/* Left: App Logo Emblem (34px rounded square in #075B46 with golden seedling) */}
          <div className="w-[34px] h-[34px] rounded-[10px] bg-[#075B46] shrink-0 flex items-center justify-center shadow-xs overflow-hidden">
            <svg
              className="w-[20px] h-[20px]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Golden seedling sprout */}
              <path
                d="M12 21V12.5"
                stroke="#E6B84A"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M12 13.5C12 9.5 8.5 7 4 7C4 11.5 6.5 15.2 12 15.2"
                fill="#E6B84A"
              />
              <path
                d="M12 11.8C12 8.5 15 6.8 19.5 6.8C19.5 10.5 17.5 13.8 12 13.8"
                fill="#E6B84A"
                opacity="0.88"
              />
            </svg>
          </div>

          {/* Center: App Name & Subtitle */}
          <div className="flex-1 min-w-0 px-2.5">
            <h4 className="font-semibold text-[13px] leading-tight text-[#242824] tracking-tight truncate">
              Grama Sahayya AI
            </h4>
            <p className="text-[11px] leading-tight text-[#555953] mt-0.5 truncate font-normal">
              {isTe ? 'త్వరిత ప్రవేశానికి ఇన్‌స్టాల్ చేయండి.' : 'Install for quicker access.'}
            </p>
          </div>

          {/* Right: Compact Green Install Button */}
          <button
            type="button"
            onClick={handleInstallClick}
            disabled={installing || installedSuccess}
            className="h-[30px] px-2.5 rounded-[10px] bg-[#075B46] hover:bg-[#064B3A] active:bg-[#053D2F] text-white text-[12px] font-medium flex items-center gap-1 shrink-0 shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-70 focus:outline-none focus:ring-1 focus:ring-[#075B46]"
            aria-label="Install Grama Sahayya AI App"
          >
            {installedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#E6B84A]" />
                <span>{isTe ? 'అయింది' : 'Done'}</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />
                <span>{installing ? '...' : (isTe ? 'ఇన్‌స్టాల్' : 'Install')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
