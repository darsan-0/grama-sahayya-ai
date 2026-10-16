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
    <div className="bg-[#FAF9F5] border-b border-[#E5E5DF] px-3 sm:px-6 py-2 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Left: Primary Microphone Action & Transcript */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={handleMicToggle}
            className={`h-9 px-3.5 rounded-full font-medium text-xs sm:text-xs transition-all cursor-pointer inline-flex items-center justify-center gap-2 shrink-0 ${
              isListening
                ? 'bg-[#B91C1C] text-white voice-pulsing'
                : 'bg-[#075B46] hover:bg-[#064B3A] text-white shadow-xs'
            }`}
            title={isTe ? 'వాయిస్ ద్వారా మాట్లాడండి' : 'Click to speak via microphone'}
            aria-label="Voice input"
          >
            {isListening ? (
              <MicOff className="w-4 h-4 shrink-0 animate-spin" />
            ) : (
              <Mic className="w-4 h-4 shrink-0 text-[#E6B84A]" />
            )}
            <span className="font-semibold tracking-tight">
              {isListening
                ? (isTe ? 'వింటున్నాము...' : 'Listening...')
                : (isTe ? 'వాయిస్ మాట్లాడండి' : 'Voice Input')}
            </span>
          </button>

          {/* Transcript Preview */}
          {transcriptPreview && (
            <div className="h-9 text-xs font-normal text-[#242824] bg-white px-3 rounded-full border border-[#E5E5DF] inline-flex items-center gap-1.5 max-w-[200px] sm:max-w-xs md:max-w-md truncate shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E6B84A] shrink-0" />
              <span className="truncate">{transcriptPreview}</span>
            </div>
          )}
        </div>

        {/* Right: Cohesive Audio Playback Utility Group */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Voice Narration Master Switch */}
          <button
            onClick={toggleVoiceNarration}
            className={`h-9 px-2.5 sm:px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 shrink-0 ${
              voiceNarrationEnabled
                ? 'bg-[#EBF3F0] text-[#075B46] border-[#C8DDD6]'
                : 'bg-white text-[#686B66] border-[#E5E5DF] hover:text-[#242824] hover:bg-[#F8F7F2]'
            }`}
            title={
              voiceNarrationEnabled
                ? (isTe ? 'వాయిస్ వివరణ ఆన్ చేయబడింది (ఆపడానికి క్లిక్ చేయండి)' : 'Voice narration is ON (Click to mute)')
                : (isTe ? 'వాయిస్ వివరణ ఆఫ్ చేయబడింది (వినడానికి క్లిక్ చేయండి)' : 'Voice narration is OFF (Click to turn on)')
            }
          >
            {voiceNarrationEnabled ? (
              <Volume2 className="w-3.5 h-3.5 shrink-0 text-[#075B46]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 shrink-0 text-[#8E918C]" />
            )}
            <span>{isTe ? 'వాయిస్ వివరణ' : 'Voice Narration'}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
              voiceNarrationEnabled ? 'bg-[#075B46] text-white' : 'bg-[#E5E5DF] text-[#686B66]'
            }`}>
              {voiceNarrationEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Read Aloud / Stop Audio */}
          {isSpeaking ? (
            <button
              onClick={stopSpeaking}
              className="h-9 inline-flex items-center justify-center gap-1.5 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#991B1B] px-2.5 sm:px-3 rounded-lg text-xs font-medium border border-[#FCA5A5] cursor-pointer shrink-0 transition-colors"
            >
              <Square className="w-3 h-3 shrink-0 fill-current" />
              <span>{isTe ? 'ఆపండి' : 'Stop Audio'}</span>
            </button>
          ) : (
            <button
              onClick={handleRepeatSpeech}
              className="h-9 inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#F8F7F2] text-[#242824] px-2.5 sm:px-3 rounded-lg text-xs font-medium border border-[#E5E5DF] cursor-pointer shrink-0 transition-colors"
              title="Read last response or introduction aloud"
            >
              <Volume2 className="w-3.5 h-3.5 shrink-0 text-[#075B46]" />
              <span>{isTe ? 'చదవండి' : 'Read Aloud'}</span>
            </button>
          )}

          {/* Replay Icon Button */}
          <button
            onClick={handleRepeatSpeech}
            className="h-9 w-9 inline-flex items-center justify-center bg-white hover:bg-[#F8F7F2] text-[#686B66] hover:text-[#242824] rounded-lg border border-[#E5E5DF] cursor-pointer shrink-0 transition-colors"
            title="Repeat audio"
            aria-label="Repeat audio"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speech Rate Selector */}
          <div className="h-9 inline-flex items-center justify-center gap-1.5 bg-white px-2.5 rounded-lg border border-[#E5E5DF] text-xs text-[#686B66] shrink-0">
            <Gauge className="w-3.5 h-3.5 shrink-0 text-[#8E918C]" />
            <select
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="bg-transparent font-medium text-[#242824] focus:outline-none cursor-pointer py-1 text-xs"
              aria-label="Speech speed"
            >
              <option value="0.75">0.75x Slow</option>
              <option value="1.0">1.0x Normal</option>
              <option value="1.25">1.25x Fast</option>
            </select>
          </div>

          {/* Capability indicator */}
          <div className="hidden xl:inline-flex items-center text-[11px] text-[#8E918C] shrink-0 pl-1">
            <span>{currentLangInfo.name}</span>
          </div>
        </div>
      </div>

      {/* Permission / compatibility message banner */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto mt-2 text-xs text-[#991B1B] bg-[#FEF2F2] border border-[#FCA5A5] p-2.5 rounded-lg flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="underline font-semibold cursor-pointer shrink-0 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
