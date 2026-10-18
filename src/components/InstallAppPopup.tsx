import React, { useState } from 'react';
import { Download, X, Share, Monitor, Check, Smartphone, Info } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../context/LanguageContext';

export const InstallAppPopup: React.FC = () => {
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    apkAvailable,
    apkDownloadUrl,
    apkFileSize,
    shouldShowPopup,
    install,
    downloadApk,
    dismiss
  } = usePWAInstall();

  const { currentLanguage } = useLanguage();
  const [showInstructions, setShowInstructions] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);
  const [apkDownloaded, setApkDownloaded] = useState(false);

  const isTe = currentLanguage === 'te';

  // Do not render if already installed, dismissed, or not engaged yet
  if (!shouldShowPopup || isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    // If user is on Android and verified APK is ready, open installation / download panel
    if (isAndroid) {
      if (apkAvailable) {
        setShowInstructions(true);
      } else if (isInstallable) {
        setInstalling(true);
        try {
          const res = await install();
          if (res === 'accepted') {
            setInstalledSuccess(true);
            setTimeout(() => dismiss(), 2000);
          } else {
            setShowInstructions(true);
          }
        } catch {
          setShowInstructions(true);
        } finally {
          setInstalling(false);
        }
      } else {
        setShowInstructions(true);
      }
      return;
    }

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

  const handleDirectApkDownload = () => {
    if (!apkAvailable) return;
    setApkDownloaded(true);
    downloadApk();
  };

  const formattedFileSize = apkFileSize > 0
    ? `${(apkFileSize / (1024 * 1024)).toFixed(1)} MB`
    : '~1.0 MB';

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
        {/* Concise Tooltip when browser requires manual Add to Home Screen, Android APK, or Address Bar install */}
        {showInstructions && (
          <div
            className="absolute bottom-full mb-2 right-0 w-[250px] sm:w-[270px] p-3 rounded-xl border border-white/80 shadow-[0_6px_24px_rgba(0,0,0,0.12)] text-[#242824] animate-in fade-in zoom-in-95 duration-150"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)'
            }}
          >
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#E5E5DF]/70">
              <span className="text-[11px] font-semibold text-[#075B46] flex items-center gap-1">
                {isAndroid ? (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-[#075B46]" />
                    <span>{isTe ? 'ఆండ్రాయిడ్ ఇన్‌స్టాలేషన్' : 'Android App Installation'}</span>
                  </>
                ) : isIOS ? (
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

            {/* Android specific flow: verified APK download & unknown apps permission guidance */}
            {isAndroid ? (
              <div className="space-y-2 text-[10px] text-[#555953] leading-snug">
                {apkAvailable ? (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <button
                        type="button"
                        onClick={handleDirectApkDownload}
                        className="w-full h-[30px] rounded-[9px] bg-[#075B46] hover:bg-[#064B3A] text-white font-medium text-[11px] flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isTe ? 'ఆండ్రాయిడ్ APK డౌన్‌లోడ్' : 'Download Android APK'}</span>
                        <span className="text-[9px] opacity-80 font-normal">({formattedFileSize})</span>
                      </button>

                      {isInstallable && (
                        <button
                          type="button"
                          onClick={async () => {
                            setInstalling(true);
                            try {
                              const res = await install();
                              if (res === 'accepted') {
                                setInstalledSuccess(true);
                                setTimeout(() => dismiss(), 2000);
                              }
                            } finally {
                              setInstalling(false);
                            }
                          }}
                          className="w-full h-[26px] rounded-[8px] border border-[#075B46]/30 text-[#075B46] hover:bg-[#075B46]/5 font-medium text-[10px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Monitor className="w-3 h-3" />
                          <span>{isTe ? 'లేదా బ్రౌజర్ వెబ్ యాప్‌గా వాడండి' : 'Or install as Web App (PWA)'}</span>
                        </button>
                      )}
                    </div>

                    <div className="pt-1 border-t border-[#E5E5DF]/60 space-y-1">
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-[#242824]">
                        <Info className="w-3 h-3 text-[#E6B84A] shrink-0" />
                        <span>{isTe ? 'ఇన్‌స్టాలేషన్ సూచనలు:' : 'Installation Steps:'}</span>
                      </div>
                      <ol className="list-decimal pl-3.5 space-y-0.5 text-[9.5px] text-[#555953]">
                        <li>{isTe ? 'డౌన్‌లోడ్ అయిన APK ఫైల్‌ను తెరవండి.' : 'Open the downloaded APK file.'}</li>
                        <li>{isTe ? 'అవసరమైతే సెట్టింగ్స్‌లో "Install unknown apps" అనుమతించండి.' : 'If prompted, enable "Install unknown apps" in Settings.'}</li>
                        <li>{isTe ? '"Install" నొక్కి యాప్‌ను ప్రారంభించండి.' : 'Tap "Install" to complete setup.'}</li>
                      </ol>
                      <p className="text-[9px] text-[#8E918C] italic">
                        {isTe
                          ? '* ఆండ్రాయిడ్ భద్రత కొరకు యూజర్ అనుమతి తప్పనిసరి.'
                          : '* Note: Android requires user confirmation to install standalone APKs.'}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-[#555953]">
                      {isTe
                        ? 'ఆండ్రాయిడ్ యాప్ త్వరలోనే విడుదల కానుంది. ప్రస్తుతం మీరు మీ బ్రౌజర్ మెనూ (⋮) నుండి "Install" లేదా "Add to Home screen" ఎంచుకోవచ్చు.'
                        : 'Standalone APK is preparing for release. In the meantime, tap browser menu (⋮) → "Install app" or "Add to Home screen".'}
                    </p>
                    {isInstallable && (
                      <button
                        type="button"
                        onClick={async () => {
                          setInstalling(true);
                          try {
                            const res = await install();
                            if (res === 'accepted') {
                              setInstalledSuccess(true);
                              setTimeout(() => dismiss(), 2000);
                            }
                          } finally {
                            setInstalling(false);
                          }
                        }}
                        className="w-full h-[28px] rounded-[8px] bg-[#075B46] text-white text-[11px] font-medium flex items-center justify-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isTe ? 'వెబ్ యాప్ ఇన్‌స్టాల్' : 'Install Web App'}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-[10px] text-[#555953] leading-snug">
                {isIOS
                  ? isTe
                    ? 'Safari లో Share (⎋) ఐకాన్ నొక్కి, "Add to Home Screen" ను ఎంచుకోండి.'
                    : 'Tap Safari Share (⎋) icon, then tap "Add to Home Screen".'
                  : isTe
                    ? 'అడ్రస్ బార్‌లోని (⊕) గుర్తు లేదా మెనూ (⋮) నొక్కి "Install" ఎంచుకోండి.'
                    : 'Click the install icon (⊕) in address bar, or menu (⋮) → "Install app".'}
              </p>
            )}
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
