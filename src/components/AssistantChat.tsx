import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Square,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  PlusCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useSimpleMode } from '../context/SimpleModeContext';
import { ChatMessage, Scheme } from '../types';
import { VERIFIED_SCHEMES } from '../data/schemes';
import { ChatMessageContent } from './ChatMessageContent';

interface AssistantChatProps {
  onSelectScheme: (scheme: Scheme) => void;
  onPrepareApplication: (scheme: Scheme) => void;
}

export const AssistantChat: React.FC<AssistantChatProps> = ({
  onSelectScheme,
  onPrepareApplication
}) => {
  const { userProfile } = useAuth();
  const {
    currentLanguage,
    speak,
    stopSpeaking,
    isSpeaking,
    startVoiceListening,
    stopVoiceListening,
    isListening,
    voiceInputSupported,
    voiceNarrationEnabled,
    toggleVoiceNarration
  } = useLanguage();
  const { isSimpleMode } = useSimpleMode();

  const isTe = currentLanguage === 'te';

  const getWelcomeMessage = (lang: string): ChatMessage => ({
    id: 'welcome-1',
    role: 'assistant',
    content: lang === 'te'
      ? `నమస్కారం! నేను గ్రామ సహాయ AI సహాయకుడిని. మీకు ఆంధ్రప్రదేశ్ మరియు కేంద్ర ప్రభుత్వ సంక్షేమ పథకాలు, స్కాలర్‌షిప్‌లు, రైతు భరోసా, పింఛన్లు లేదా ఆధార్/పాన్ సేవల గురించి పూర్తి అధికారిక సమాచారం అందించగలను.\n\nమీరు ఏ పథకం గురించి తెలుసుకోవాలనుకుంటున్నారు?`
      : `Welcome! I am the Grama Sahayya AI Assistant. I can help you discover Andhra Pradesh and Central government welfare schemes, check your eligibility, understand required documents, and guide you through the official application process.\n\nWhich welfare scheme or public service would you like to know about?`,
    timestamp: new Date().toISOString(),
    suggestedPrompts: lang === 'te' ? [
      'నేను బి.టెక్ 2వ సంవత్సరం చదువుతున్నాను. నాకు ఏ స్కాలర్‌షిప్ వస్తుంది?',
      'అన్నదాత సుఖీభవ & పీఎం కిసాన్ పథకానికి ఎవరు అర్హులు?',
      'ఎన్టీఆర్ వైద్య సేవ కింద ఎంతవరకు ఉచిత చికిత్స లభిస్తుంది?',
      'కొత్త రేషన్ కార్డు / రైస్ కార్డు దరఖాస్తు విధానం ఏమిటి?'
    ] : [
      'I am a 2nd year B.Tech student in AP. Which scholarships can I apply for?',
      'Who is eligible for Annadata Sukhibhava & PM-KISAN?',
      'How much free healthcare is covered under Dr. NTR Vaidya Seva?',
      'How do I apply for a new Rice Card or Caste Certificate?'
    ],
    interactiveOptions: {
      type: 'buttons',
      question: lang === 'te' ? 'మీరు ఏ వర్గానికి చెందిన పథకాలు చూడాలనుకుంటున్నారు?' : 'Which category are you interested in?',
      options: lang === 'te'
        ? ['విద్యార్థుల స్కాలర్‌షిప్‌లు', 'రైతు సంక్షేమం', 'మహిళా & డ్వాక్రా', 'వృద్ధాప్య పింఛన్లు']
        : ['Student Scholarships', 'Farmer Welfare', 'Women & SHGs', 'Pensions']
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => [getWelcomeMessage(currentLanguage)]);

  // React to language switch if conversation is fresh
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1 && prev[0]?.role === 'assistant') {
        return [getWelcomeMessage(currentLanguage)];
      }
      return prev;
    });
  }, [currentLanguage]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentlyPlayingMsgId, setCurrentlyPlayingMsgId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<Record<string, 'up' | 'down'>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: currentLanguage,
          citizenProfile: userProfile,
          conversationHistory: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to reach AI assistant');
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        language: data.language,
        recommendedSchemeIds: data.recommendedSchemeIds || [],
        timestamp: new Date().toISOString(),
        suggestedPrompts: (data.language || currentLanguage) === 'en'
          ? ['What documents are required?', 'Where do I submit this?', 'Help me prepare application']
          : ['కావలసిన డాక్యుమెంట్లు ఏమిటి?', 'ఎక్కడ దరఖాస్తు చేసుకోవాలి?', 'ఈ పథకానికి దరఖాస్తు సిద్ధం చేయండి'],
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Provide automatic voice narration feedback if voice narration is enabled
      if (voiceNarrationEnabled) {
        setCurrentlyPlayingMsgId(assistantMessage.id);
        speak(data.reply, data.language || currentLanguage, () => {
          setCurrentlyPlayingMsgId(null);
        });
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      // Helpful fallback
      const errorReply: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: currentLanguage === 'te'
          ? `క్షమించండి, సర్వర్‌లో తాత్కాలిక సమస్య ఏర్పడింది. దయచేసి మళ్లీ ప్రయత్నించండి లేదా పైన ఉన్న పథకాల జాబితాలో ప్రత్యక్షంగా వెతకండి.`
          : `We experienced a temporary connectivity hiccup. Please try again or browse the verified schemes directory directly.`,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopVoiceListening();
    } else {
      startVoiceListening(
        (transcript) => {
          setInputQuery(transcript);
          handleSendMessage(transcript);
        },
        (err) => {
          console.warn('Voice error:', err);
        }
      );
    }
  };

  const handleNewConversation = () => {
    stopSpeaking();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: currentLanguage === 'te'
          ? 'కొత్త సంభాషణ ప్రారంభమైంది. మీకు ఏ పథకం గురించి తెలుసుకోవాలనుకుంటున్నారు?'
          : 'New conversation started. What government scheme or public service can I help you with?',
        timestamp: new Date().toISOString(),
        suggestedPrompts: currentLanguage === 'te' ? [
          'జగనన్న విద్యా దీవెన అర్హతలు',
          'అన్నదాత సుఖీభవ & పీఎం కిసాన్ నిబంధనలు',
          'పీఎం సూర్య ఘర్ సోలార్ సబ్సిడీ'
        ] : [
          'Post-Matric Scholarship criteria',
          'Annadata Sukhibhava guidelines',
          'PM Surya Ghar rooftop solar subsidy'
        ]
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Assistant Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E5DF] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#075B46] text-white flex items-center justify-center font-medium shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#242824] flex items-center gap-2">
              <span>{isTe ? 'గ్రామ సహాయ AI సహాయకుడు' : 'Grama Sahayya AI Assistant'}</span>
              <span className="bg-[#EBF3F0] text-[#075B46] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {isTe ? 'అధికారిక సమాచారం' : 'Official Records'}
              </span>
            </h2>
            <p className="text-xs text-[#686B66]">
              {isTe
                ? 'ఖచ్చితమైన అర్హత నిబంధనలు • శోధించదగిన లింకులు • బహుభాషా వాయిస్'
                : 'Deterministic eligibility evaluation • Grounded official records • Voice support'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleVoiceNarration}
            className={`text-xs font-medium px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors cursor-pointer ${
              voiceNarrationEnabled
                ? 'bg-[#EBF3F0] text-[#075B46] border-[#C8DDD6]'
                : 'bg-white text-[#686B66] border-[#E5E5DF] hover:bg-[#F8F7F2]'
            }`}
            title={voiceNarrationEnabled ? 'Voice narration active (Click to disable)' : 'Voice narration disabled (Click to enable)'}
          >
            {voiceNarrationEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#075B46]" /> : <VolumeX className="w-3.5 h-3.5 text-[#8E918C]" />}
            <span className="hidden sm:inline">{isTe ? 'వాయిస్' : 'Voice'}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${voiceNarrationEnabled ? 'bg-[#075B46] text-white' : 'bg-[#E5E5DF] text-[#686B66]'}`}>
              {voiceNarrationEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            onClick={handleNewConversation}
            className="text-xs font-medium text-[#242824] hover:bg-[#F8F7F2] border border-[#E5E5DF] px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#075B46]" />
            <span>{isTe ? 'కొత్త చాట్' : 'New Chat'}</span>
          </button>
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="bg-[#FAF9F5] border border-[#E5E5DF] rounded-2xl p-4 sm:p-6 min-h-[480px] max-h-[620px] overflow-y-auto space-y-5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
            >
              <div className="flex items-start gap-2.5 max-w-2xl">
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-[#075B46] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-[#075B46] text-white rounded-tr-xs'
                      : 'bg-white text-[#242824] border border-[#E5E5DF] rounded-tl-xs'
                  }`}
                >
                  {/* Render message with robust Markdown formatting & safe link guards */}
                  <ChatMessageContent content={msg.content} isUser={isUser} />

                  {/* Scheme Cards for recommendations */}
                  {msg.recommendedSchemeIds && msg.recommendedSchemeIds.length > 0 && (
                    <div className="mt-4 pt-3.5 border-t border-[#F8F7F2] space-y-2">
                      <div className="text-[11px] font-semibold text-[#075B46] uppercase tracking-wider">
                        {isTe ? 'సంబంధిత పథకాలు (Matched Schemes):' : 'Matched Schemes:'}
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {msg.recommendedSchemeIds.map((schemeId) => {
                          const found = VERIFIED_SCHEMES.find((s) => s.id === schemeId);
                          if (!found) return null;
                          return (
                            <div
                              key={found.id}
                              className="bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                              <div>
                                <div className="font-semibold text-xs text-[#242824]">
                                  {isTe ? found.teName : found.officialName}
                                </div>
                                <div className="text-[11px] text-[#686B66]">
                                  {isTe ? found.officialName : found.department} • {found.benefitAmount}
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => onSelectScheme(found)}
                                  className="text-xs font-medium text-[#242824] bg-white hover:bg-[#F8F7F2] border border-[#E5E5DF] px-2.5 py-1 rounded-lg cursor-pointer"
                                >
                                  {isTe ? 'వివరాలు' : 'View Details'}
                                </button>
                                <button
                                  onClick={() => onPrepareApplication(found)}
                                  className="text-xs font-medium text-white bg-[#075B46] hover:bg-[#064B3A] px-2.5 py-1 rounded-lg shadow-xs cursor-pointer flex items-center gap-1"
                                >
                                  <span>{isTe ? 'దరఖాస్తు' : 'Apply'}</span>
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Interactive Options if provided */}
                  {msg.interactiveOptions && (
                    <div className="mt-4 pt-3 border-t border-[#F8F7F2] space-y-2">
                      <div className="text-xs font-medium text-[#686B66]">
                        {msg.interactiveOptions.question}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.interactiveOptions.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleSendMessage(opt)}
                            className="text-xs bg-white hover:bg-[#FAF9F5] text-[#242824] font-medium px-3 py-1.5 rounded-lg border border-[#E5E5DF] transition-colors cursor-pointer"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assistant Actions: Audio, Copy, Feedback */}
                  {!isUser && (
                    <div className="mt-3 pt-3 border-t border-[#F8F7F2] flex items-center justify-between text-xs text-[#686B66]">
                      <div className="flex items-center gap-2">
                        {(() => {
                          const isThisPlaying = isSpeaking && currentlyPlayingMsgId === msg.id;
                          return (
                            <button
                              type="button"
                              onClick={() => {
                                if (isThisPlaying) {
                                  stopSpeaking();
                                  setCurrentlyPlayingMsgId(null);
                                } else {
                                  setCurrentlyPlayingMsgId(msg.id);
                                  speak(msg.content, msg.language || currentLanguage, () => {
                                    setCurrentlyPlayingMsgId(null);
                                  });
                                }
                              }}
                              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border transition-all cursor-pointer ${
                                isThisPlaying
                                  ? 'bg-[#FEF2F2] text-[#991B1B] border-[#FCA5A5]'
                                  : 'bg-[#FAF9F5] hover:bg-[#EBF3F0] text-[#075B46] border-[#E5E5DF]'
                              }`}
                              title={isThisPlaying ? (isTe ? 'ఆపండి' : 'Stop Audio') : (isTe ? 'వాయిస్ ద్వారా వినండి' : 'Listen')}
                            >
                              {isThisPlaying ? <Square className="w-3 h-3 fill-current" /> : <Volume2 className="w-3 h-3 text-[#075B46]" />}
                              <span>{isThisPlaying ? (isTe ? 'ఆపండి' : 'Stop') : (isTe ? 'వినండి' : 'Listen')}</span>
                            </button>
                          );
                        })()}
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:text-[#242824] p-1 rounded hover:bg-[#FAF9F5] cursor-pointer"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-[#075B46]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setFeedbackState({ ...feedbackState, [msg.id]: 'up' })}
                          className={`p-1 rounded cursor-pointer ${feedbackState[msg.id] === 'up' ? 'text-[#075B46] font-bold' : 'hover:text-[#242824]'}`}
                          title="Helpful response"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setFeedbackState({ ...feedbackState, [msg.id]: 'down' })}
                          className={`p-1 rounded cursor-pointer ${feedbackState[msg.id] === 'down' ? 'text-[#991B1B] font-bold' : 'hover:text-[#242824]'}`}
                          title="Not helpful"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-[#FAF4E6] text-[#242824] border border-[#E6B84A] flex items-center justify-center shrink-0 mt-0.5 font-semibold text-xs">
                    <User className="w-4 h-4 text-[#075B46]" />
                  </div>
                )}
              </div>

              {/* Suggested Follow-up Prompts */}
              {!isUser && msg.suggestedPrompts && (
                <div className="flex flex-wrap gap-1.5 ml-10">
                  {msg.suggestedPrompts.map((p) => (
                    <button
                      key={p}
                      onClick={() => handleSendMessage(p)}
                      className="text-xs bg-white hover:bg-[#FAF9F5] text-[#686B66] hover:text-[#242824] px-3 py-1 rounded-full border border-[#E5E5DF] transition-colors cursor-pointer shadow-2xs"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2.5 text-[#686B66] text-xs py-2">
            <div className="w-8 h-8 rounded-lg bg-[#075B46] text-white flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-[#E5E5DF] rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E6B84A] animate-spin" />
              <span>అధికారిక రికార్డులను పరిశీలిస్తున్నాము (Analyzing verified schemes)...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="bg-white rounded-2xl p-2.5 border border-[#E5E5DF] shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleVoiceToggle}
            className={`w-10 h-10 inline-flex items-center justify-center rounded-xl transition-all cursor-pointer shrink-0 ${
              isListening
                ? 'bg-[#B91C1C] text-white voice-pulsing'
                : 'bg-[#FAF9F5] hover:bg-[#F8F7F2] text-[#075B46] border border-[#E5E5DF]'
            }`}
            title="Speak query via microphone"
            aria-label="Speak query via microphone"
          >
            {isListening ? (
              <MicOff className="w-4 h-4 shrink-0 animate-spin" />
            ) : (
              <Mic className="w-4 h-4 shrink-0" />
            )}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={
              currentLanguage === 'te'
                ? 'ఉదాహరణ: నేను బి.టెక్ విద్యార్థిని, ఏ స్కాలర్‌షిప్ వస్తుంది? లేదా మాట్లాడండి...'
                : 'Ask a question about scholarships, pensions, farmer welfare, or public certificates...'
            }
            className="flex-1 h-10 px-3 text-xs sm:text-sm text-[#242824] focus:outline-none placeholder-[#8E918C] bg-[#FAF9F5] rounded-xl border border-[#E5E5DF] focus:border-[#075B46]"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="w-10 h-10 inline-flex items-center justify-center bg-[#075B46] hover:bg-[#064B3A] text-white font-medium rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-40 shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 shrink-0" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-[#8E918C] px-2 pt-2 border-t border-[#F8F7F2] mt-2">
          <span>AI answers grounded strictly in verified government notifications.</span>
          <span>Never guarantee government approval.</span>
        </div>
      </div>
    </div>
  );
};
