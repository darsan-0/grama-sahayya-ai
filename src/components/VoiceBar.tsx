import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Square,
  RotateCcw,
  Gauge,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface VoiceBarProps {
  onTranscriptReceived?: (text: string) => void;
  lastSpokenText?: string;
}

export const VoiceBar: React.FC<VoiceBarProps> = ({
  onTranscriptReceived,
  lastSpokenText
}) => {
  const {
    currentLanguage,
    currentLangInfo,
    speak,
    stopSpeaking,
    isSpeaking,
    speechRate,
    setSpeechRate,
    voiceNarrationEnabled,
    toggleVoiceNarration,
    startVoiceListening,
    stopVoiceListening,
    isListening,
    voiceInputSupported
  } = useLanguage();

  const [transcriptPreview, setTranscriptPreview] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleMicToggle = () => {
    setErrorMessage(null);
    if (isListening) {
      stopVoiceListening();
    } else {
      if (!voiceInputSupported) {
        setErrorMessage('Speech recognition is not supported in this browser. Please use standard text input.');
        return;
      }

      setTranscriptPreview('Listening... మాట్లాడండి (Speak now)...');
      startVoiceListening(
        (transcript) => {
          setTranscriptPreview(transcript);
          if (onTranscriptReceived) {
            onTranscriptReceived(transcript);
          }
        },
        (err) => {
          setErrorMessage(`Microphone error: ${err}. Please allow microphone permissions in your browser.`);
          setTranscriptPreview('');
        }
      );
    }
  };

  const handleRepeatSpeech = () => {
    if (lastSpokenText) {
      speak(lastSpokenText);
    } else {
      speak(
        currentLanguage === 'te'
          ? 'నమస్కారం! గ్రామ సహాయ AI కి స్వాగతం. మీరు సంక్షేమ పథకాలు లేదా ప్రభుత్వ సేవల గురించి అడగవచ్చు.'
          : 'Welcome to Grama Sahayya AI. You can ask questions about government welfare schemes or public digital services.'
      );
    }
  };

  const isTe = currentLanguage === 'te';

  return (
    <div className="bg-amber-50/90 border-y border-amber-200/80 px-4 py-2.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Prominent Voice Microphone Trigger */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleMicToggle}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-full font-bold text-sm transition-all shadow-md cursor-pointer ${
              isListening
                ? 'bg-rose-600 text-white voice-pulsing'
                : 'bg-emerald-800 hover:bg-emerald-700 text-white'
            }`}
            title={isTe ? 'వాయిస్ ద్వారా మాట్లాడండి' : 'Click to speak via microphone'}
          >
            {isListening ? <MicOff className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5 text-amber-300" />}
            <span>
              {isListening
                ? (isTe ? 'వింటున్నాము...' : 'Listening...')
                : (isTe ? 'వాయిస్ ద్వారా మాట్లాడండి' : 'Voice Input')}
            </span>
          </button>

          {/* Transcript Preview */}
          {transcriptPreview && (
            <div className="text-xs font-medium text-stone-700 bg-white px-3 py-1.5 rounded-lg border border-amber-300 flex items-center space-x-1.5 max-w-xs sm:max-w-md truncate">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{transcriptPreview}</span>
            </div>
          )}
        </div>

        {/* Right: Audio Playback Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Voice Narration Master Toggle */}
          <button
            onClick={toggleVoiceNarration}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              voiceNarrationEnabled
                ? 'bg-amber-300 hover:bg-amber-400 text-emerald-950 border-amber-400 shadow-xs'
                : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-200'
            }`}
            title={
              voiceNarrationEnabled
                ? (isTe ? 'వాయిస్ వివరణ ఆన్ చేయబడింది (ఆపడానికి క్లిక్ చేయండి)' : 'Voice narration is ON (Click to mute)')
                : (isTe ? 'వాయిస్ వివరణ ఆఫ్ చేయబడింది (వినడానికి క్లిక్ చేయండి)' : 'Voice narration is OFF (Click to turn on)')
            }
          >
            {voiceNarrationEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-950" /> : <VolumeX className="w-3.5 h-3.5 text-stone-400" />}
            <span>{isTe ? 'వాయిస్ వివరణ' : 'Voice Narration'}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${voiceNarrationEnabled ? 'bg-emerald-950 text-amber-300' : 'bg-stone-200 text-stone-600'}`}>
              {voiceNarrationEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Read Aloud / Stop Audio */}
          {isSpeaking ? (
            <button
              onClick={stopSpeaking}
              className="flex items-center space-x-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 px-3 py-1.5 rounded-lg text-xs font-bold border border-rose-300 cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>{isTe ? 'వాయిస్ ఆపండి' : 'Stop Audio'}</span>
            </button>
          ) : (
            <button
              onClick={handleRepeatSpeech}
              className="flex items-center space-x-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-3 py-1.5 rounded-lg text-xs font-semibold border border-emerald-300 cursor-pointer"
              title="Repeat last response or introduction aloud"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isTe ? 'వాయిస్‌లో చదవండి' : 'Read Aloud'}</span>
            </button>
          )}

          {/* Repeat */}
          <button
            onClick={handleRepeatSpeech}
            className="p-1.5 bg-white hover:bg-stone-100 text-stone-700 rounded-lg border border-stone-200 cursor-pointer"
            title="Repeat audio"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speech Rate Selector */}
          <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded-lg border border-stone-200 text-xs text-stone-600">
            <Gauge className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="bg-transparent font-medium focus:outline-none cursor-pointer"
              aria-label="Speech speed"
            >
              <option value="0.75">0.75x Slow</option>
              <option value="1.0">1.0x Normal</option>
              <option value="1.25">1.25x Fast</option>
            </select>
          </div>

          {/* Capability indicator */}
          <div className="hidden lg:flex items-center text-[11px] text-stone-500">
            <span>Voice: {currentLangInfo.name} ({currentLangInfo.nativeName})</span>
          </div>
        </div>
      </div>

      {/* Permission or compatibility error banner */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto mt-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="ml-auto underline font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
