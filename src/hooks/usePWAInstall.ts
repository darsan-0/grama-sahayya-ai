import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const DISMISSAL_STORAGE_KEY = 'gs_pwa_dismissed_until';
const DEFAULT_DISMISSAL_DAYS = 7;

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  const [apkAvailable, setApkAvailable] = useState<boolean>(false);
  const [apkDownloadUrl, setApkDownloadUrl] = useState<string>('/downloads/grama-sahayya-ai.apk');
  const [apkFileSize, setApkFileSize] = useState<number>(0);
  const [isDismissed, setIsDismissed] = useState<boolean>(true);
  const [hasEngaged, setHasEngaged] = useState<boolean>(false);
  const [manuallyOpened, setManuallyOpened] = useState<boolean>(false);

  // Check if installation is already in standalone mode or dismissed
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Check standalone (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // 2. Check Device OS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua) && !isStandalone;
    const isAndroidDevice = /android/i.test(ua) && !isStandalone;
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // 3. Verify real signed APK availability from backend
    fetch('/api/app-info')
      .then(res => res.json())
      .then(data => {
        if (data && data.apkAvailable && data.downloadUrl) {
          setApkAvailable(true);
          setApkDownloadUrl(data.downloadUrl);
          if (data.fileSize) setApkFileSize(data.fileSize);
        }
      })
      .catch(() => {
        // Fallback: direct HEAD check on standard APK path
        fetch('/downloads/grama-sahayya-ai.apk', { method: 'HEAD' })
          .then(res => {
            if (res.ok) setApkAvailable(true);
          })
          .catch(() => setApkAvailable(false));
      });

    // 4. Check dismissal expiry
    const dismissedUntil = localStorage.getItem(DISMISSAL_STORAGE_KEY);
    if (dismissedUntil) {
      const expiry = parseInt(dismissedUntil, 10);
      if (!isNaN(expiry) && Date.now() < expiry) {
        setIsDismissed(true);
      } else {
        localStorage.removeItem(DISMISSAL_STORAGE_KEY);
        setIsDismissed(false);
      }
    } else {
      setIsDismissed(false);
    }

    // 5. Polite engagement timer (appears after 2.5 seconds or subtle interaction)
    const timer = setTimeout(() => {
      setHasEngaged(true);
    }, 2500);

    const onEngagement = () => {
      setHasEngaged(true);
    };

    window.addEventListener('scroll', onEngagement, { once: true, passive: true });
    window.addEventListener('click', onEngagement, { once: true, passive: true });

    // Listen for manual trigger from footer or settings
    const handleManualOpen = () => {
      setIsDismissed(false);
      setHasEngaged(true);
      setManuallyOpened(true);
    };
    window.addEventListener('gs-open-install-prompt', handleManualOpen);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onEngagement);
      window.removeEventListener('click', onEngagement);
      window.removeEventListener('gs-open-install-prompt', handleManualOpen);
    };
  }, []);

  // Listen to PWA lifecycle events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      localStorage.removeItem(DISMISSAL_STORAGE_KEY);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Trigger installation flow
  const install = useCallback(async (): Promise<'accepted' | 'dismissed' | 'unsupported'> => {
    if (!deferredPrompt) {
      return 'unsupported';
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return 'accepted';
      } else {
        // User clicked cancel in browser install dialog; suppress for 3 days
        dismiss(3);
        return 'dismissed';
      }
    } catch (err) {
      console.warn('Install prompt error:', err);
      return 'unsupported';
    }
  }, [deferredPrompt]);

  // Download real signed APK
  const downloadApk = useCallback(() => {
    if (typeof window !== 'undefined' && apkDownloadUrl) {
      const link = document.createElement('a');
      link.href = apkDownloadUrl;
      link.setAttribute('download', 'grama-sahayya-ai.apk');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [apkDownloadUrl]);

  // Dismiss popup and suppress for N days
  const dismiss = useCallback((days: number = DEFAULT_DISMISSAL_DAYS) => {
    setIsDismissed(true);
    setManuallyOpened(false);
    if (typeof window !== 'undefined') {
      const suppressUntil = Date.now() + days * 24 * 60 * 60 * 1000;
      localStorage.setItem(DISMISSAL_STORAGE_KEY, suppressUntil.toString());
    }
  }, []);

  const openPrompt = useCallback(() => {
    setIsDismissed(false);
    setHasEngaged(true);
    setManuallyOpened(true);
    localStorage.removeItem(DISMISSAL_STORAGE_KEY);
  }, []);

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    isAndroid,
    apkAvailable,
    apkDownloadUrl,
    apkFileSize,
    isDismissed,
    hasEngaged,
    manuallyOpened,
    install,
    downloadApk,
    dismiss,
    openPrompt,
    shouldShowPopup: !isInstalled && ((!isDismissed && hasEngaged) || manuallyOpened)
  };
}
