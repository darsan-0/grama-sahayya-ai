import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SCHEDULED_INDIAN_LANGUAGES, DICTIONARY, LanguageOption } from '../i18n/languages';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (langCode: string) => void;
  availableLanguages: LanguageOption[];
  currentLangInfo: LanguageOption;
  t: (key: string) => string;
  speak: (text: string, customLang?: string, onEnd?: () => void) => void;
  speakNotification: (title: string, message?: string, options?: { force?: boolean; lang?: string }) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  autoVoiceOutput: boolean;
  setAutoVoiceOutput: (enabled: boolean) => void;
  voiceNarrationEnabled: boolean;
  setVoiceNarrationEnabled: (enabled: boolean) => void;
  toggleVoiceNarration: () => void;
  startVoiceListening: (onResult: (transcript: string) => void, onError?: (err: string) => void) => void;
  stopVoiceListening: () => void;
  isListening: boolean;
  speechSupported: boolean;
  voiceInputSupported: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gs_language') || 'te';
    }
    return 'te';
  });

  const [voiceNarrationEnabled, setVoiceNarrationEnabledState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const storedNarration = localStorage.getItem('gs_voice_narration');
      if (storedNarration !== null) return storedNarration === 'true';
      const storedVoice = localStorage.getItem('gs_auto_voice');
      return storedVoice !== null ? storedVoice === 'true' : true;
    }
    return true;
  });

  const setVoiceNarrationEnabled = (enabled: boolean) => {
    setVoiceNarrationEnabledState(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gs_voice_narration', String(enabled));
      localStorage.setItem('gs_auto_voice', String(enabled));
    }
    if (!enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoiceNarration = () => {
    const nextState = !voiceNarrationEnabled;
    setVoiceNarrationEnabled(nextState);
    if (nextState) {
      // Immediate verbal confirmation
      const isTe = currentLanguage === 'te';
      speak(
        isTe ? 'వాయిస్ వివరణ ఆన్ చేయబడింది' : 'Voice narration enabled',
        currentLanguage
      );
    }
  };

  const setAutoVoiceOutput = (enabled: boolean) => {
    setVoiceNarrationEnabled(enabled);
  };

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voiceInputSupported, setVoiceInputSupported] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Persistent reference to prevent Chrome garbage collecting active utterance
  const activeUtterancesRef = React.useRef<SpeechSynthesisUtterance[]>([]);

  // Initialize SpeechSynthesis support and populate voice catalog
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);

      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setAvailableVoices(voices);
        }
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;

      const hasSpeechRec = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
      setVoiceInputSupported(Boolean(hasSpeechRec));

      return () => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      };
    }
  }, []);

  const setLanguage = (langCode: string) => {
    setCurrentLanguageState(langCode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gs_language', langCode);
    }
    if (isSpeaking) {
      stopSpeaking();
    }
  };

  const currentLangInfo = SCHEDULED_INDIAN_LANGUAGES.find(l => l.code === currentLanguage) || SCHEDULED_INDIAN_LANGUAGES[0];

  const t = useCallback((key: string): string => {
    const langDict = DICTIONARY[currentLanguage] || DICTIONARY['en'];
    if (langDict && langDict[key]) return langDict[key];
    const enDict = DICTIONARY['en'];
    return (enDict && enDict[key]) || key;
  }, [currentLanguage]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      activeUtterancesRef.current = [];
      setIsSpeaking(false);
    }
  }, []);

  // Web Speech API Synthesis Engine with robust voice selection and text preprocessing
  const speak = useCallback((text: string, customLang?: string, onEnd?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    activeUtterancesRef.current = [];

    // Clean text: strip markdown characters, urls, bullet signs, and excess punctuation
    const cleanText = text
      .replace(/[#*_`~[\]()]/g, ' ')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[•●►✓✔✕✖]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const targetLangCode = customLang || currentLanguage;
    const targetLangInfo = SCHEDULED_INDIAN_LANGUAGES.find(l => l.code === targetLangCode);
    const voiceCode = targetLangInfo?.ttsVoiceCode || (targetLangCode === 'te' ? 'te-IN' : targetLangCode === 'hi' ? 'hi-IN' : 'en-IN');

    // Split into sentences if text is large (prevents browser speech synthesis stalls)
    const sentences = cleanText.match(/[^.!?]+[.!?]+|\s*[^.!?]+$/g) || [cleanText];
    const utterances: SpeechSynthesisUtterance[] = [];

    // Resolve matching voice from available voices
    const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
    const primaryCode = voiceCode.toLowerCase();
    const langPrefix = targetLangCode.toLowerCase();

    // Prefer exact regional match (e.g. te-IN) -> language prefix (te) -> Indian English -> default
    const matchingVoice =
      voices.find(v => v.lang.toLowerCase() === primaryCode) ||
      voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(primaryCode)) ||
      voices.find(v => v.lang.toLowerCase().startsWith(langPrefix)) ||
      (targetLangCode !== 'en' ? voices.find(v => v.lang.toLowerCase().includes('in') && v.lang.toLowerCase().startsWith('en')) : null) ||
      voices.find(v => v.lang.toLowerCase().startsWith('en')) ||
      voices[0];

    sentences.forEach((chunk, index) => {
      const trimmedChunk = chunk.trim();
      if (!trimmedChunk) return;

      const utterance = new SpeechSynthesisUtterance(trimmedChunk);
      utterance.lang = voiceCode;
      utterance.rate = speechRate;
      utterance.pitch = 1.0;

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      if (index === 0) {
        utterance.onstart = () => setIsSpeaking(true);
      }

      const isLast = index === sentences.length - 1;
      if (isLast) {
        utterance.onend = () => {
          setIsSpeaking(false);
          activeUtterancesRef.current = [];
          if (onEnd) onEnd();
        };
        utterance.onerror = () => {
          setIsSpeaking(false);
          activeUtterancesRef.current = [];
        };
      }

      utterances.push(utterance);
    });

    if (utterances.length > 0) {
      activeUtterancesRef.current = utterances;
      utterances.forEach(u => window.speechSynthesis.speak(u));
    }
  }, [currentLanguage, speechRate, availableVoices]);

  // Audible notification feedback helper
  const speakNotification = useCallback((
    title: string,
    message?: string,
    options?: { force?: boolean; lang?: string }
  ) => {
    if (!voiceNarrationEnabled && !options?.force) return;
    const notificationText = message ? `${title}. ${message}` : title;
    speak(notificationText, options?.lang || currentLanguage);
  }, [voiceNarrationEnabled, speak, currentLanguage]);

  const startVoiceListening = useCallback((
    onResult: (transcript: string) => void,
    onError?: (err: string) => void
  ) => {
    if (typeof window === 'undefined') return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      if (onError) onError('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRec();
      const targetLangInfo = SCHEDULED_INDIAN_LANGUAGES.find(l => l.code === currentLanguage);
      recognition.lang = targetLangInfo?.ttsVoiceCode || (currentLanguage === 'te' ? 'te-IN' : currentLanguage === 'hi' ? 'hi-IN' : 'en-IN');
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onResult(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (onError) onError(event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognitionInstance(recognition);
      recognition.start();
    } catch (e: any) {
      console.error('Failed to start speech recognition:', e);
      setIsListening(false);
      if (onError) onError(e.message);
    }
  }, [currentLanguage]);

  const stopVoiceListening = useCallback(() => {
    if (recognitionInstance) {
      try {
        recognitionInstance.stop();
      } catch (e) {
        // ignore
      }
      setIsListening(false);
    }
  }, [recognitionInstance]);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        availableLanguages: SCHEDULED_INDIAN_LANGUAGES,
        currentLangInfo,
        t,
        speak,
        speakNotification,
        stopSpeaking,
        isSpeaking,
        speechRate,
        setSpeechRate,
        autoVoiceOutput: voiceNarrationEnabled,
        setAutoVoiceOutput,
        voiceNarrationEnabled,
        setVoiceNarrationEnabled,
        toggleVoiceNarration,
        startVoiceListening,
        stopVoiceListening,
        isListening,
        speechSupported,
        voiceInputSupported,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
