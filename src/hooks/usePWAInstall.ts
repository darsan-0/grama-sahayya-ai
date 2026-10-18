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

    // 2. Check iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua) && !isStandalone;
    setIsIOS(isIOSDevice);

    // 3. Check dismissal expiry
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

    // 4. Polite engagement timer (appears after 2.5 seconds or subtle interaction)
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
    isDismissed,
    hasEngaged,
    manuallyOpened,
    install,
    dismiss,
    openPrompt,
    shouldShowPopup: !isInstalled && ((!isDismissed && hasEngaged) || manuallyOpened)
  };
}
