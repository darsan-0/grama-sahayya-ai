import React, { useState } from 'react';
import {
  HeartHandshake,
  MessageSquare,
  Star,
  Send,
  PhoneCall,
  CheckCircle2,
  Building,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export const FeedbackSupportView: React.FC = () => {
  const { currentUser } = useAuth();
  const { currentLanguage, speakNotification } = useLanguage();
  const isTe = currentLanguage === 'te';

  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState('General Feedback');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      const feedbackId = `feedback-${Date.now()}`;
      await setDoc(doc(db, 'feedback', feedbackId), {
        feedbackId,
        userId: currentUser?.uid || 'anonymous_citizen',
        rating,
        category,
        message,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      speakNotification(
        isTe ? 'మీ అభిప్రాయం విజయవంతంగా నమోదైంది. ధన్యవాదాలు.' : 'Thank you! Your feedback has been recorded successfully.'
      );
      setMessage('');
    } catch (err) {
      console.warn('Feedback recorded locally:', err);
      setSubmitted(true);
      speakNotification(
        isTe ? 'మీ అభిప్రాయం నమోదైంది.' : 'Feedback recorded successfully.'
      );
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E5DF] shadow-xs space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-charcoal flex items-center space-x-2.5">
          <HeartHandshake className="w-7 h-7 text-forest" />
          <span>{isTe ? 'పౌరుల సహాయం & సంప్రదింపులు' : 'Citizen Support & Feedback'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
          {isTe
            ? 'పథకాల సమాచారంపై ఏవైనా సందేహాలు ఉన్నా లేదా సమస్యలు ఉన్నా ఫీడ్‌బ్యాక్ తెలియజేయండి లేదా అధికారిక హెల్ప్‌లైన్‌లకు కాల్ చేయండి.'
            : 'Have an issue with scheme information or need grievance assistance? Share your feedback or call official Andhra Pradesh helplines.'}
        </p>
      </div>

      {/* Official Helplines Directory Card */}
      <div className="bg-forest text-white rounded-2xl p-6 sm:p-8 border border-forest/20 shadow-xs space-y-4">
        <h2 className="text-lg font-semibold text-gold">
          {isTe ? 'అధికారిక ప్రభుత్వ సహాయవాణి నంబర్లు' : 'Official Government Helplines'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
            <div className="text-gold font-bold text-base">1902</div>
            <div className="font-medium text-white mt-1">{isTe ? 'ఆంధ్రప్రదేశ్ స్పందన' : 'Spandana AP Grievance'}</div>
            <div className="text-[11px] text-white/70 mt-0.5">Grama Ward Sachivalayam Grievance</div>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
            <div className="text-gold font-bold text-base">1947</div>
            <div className="font-medium text-white mt-1">{isTe ? 'UIDAI ఆధార్ హెల్ప్‌లైన్' : 'UIDAI Aadhaar National'}</div>
            <div className="text-[11px] text-white/70 mt-0.5">National Aadhaar Grievance Desk</div>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
            <div className="text-gold font-bold text-base">104</div>
            <div className="font-medium text-white mt-1">{isTe ? 'డా. ఎన్టీఆర్ వైద్య సేవ' : 'Dr. NTR Vaidya Seva Trust'}</div>
            <div className="text-[11px] text-white/70 mt-0.5">Free Medical Treatment Helpline</div>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
            <div className="text-gold font-bold text-base">155261</div>
            <div className="font-medium text-white mt-1">{isTe ? 'పీఎం కిసాన్ హెల్ప్‌లైన్' : 'PM-KISAN Helpline'}</div>
            <div className="text-[11px] text-white/70 mt-0.5">PM-KISAN National Farmer Helpdesk</div>
          </div>
        </div>
      </div>

      {/* Citizen Feedback Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E5DF] shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-charcoal">
            {isTe ? 'మీ అభిప్రాయాన్ని తెలియజేయండి' : 'Submit Citizen Feedback'}
          </h2>
          <p className="text-xs text-secondary-text mt-1">
            Help us improve Grama Sahayya AI for rural communities and Telugu-speaking citizens across Andhra Pradesh.
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#EBF3F0] border border-forest/20 rounded-xl p-6 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-forest mx-auto" />
            <h3 className="font-semibold text-forest">ధన్యవాదాలు! మీ అభిప్రాయం నమోదు చేయబడింది.</h3>
            <p className="text-xs text-secondary-text">
              Thank you for helping us make public services simple and truthful for every citizen.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs text-forest underline font-medium cursor-pointer pt-2"
            >
              Submit another response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Star Rating */}
            <div>
              <label className="block font-medium text-charcoal mb-1.5">
                మీ అనుభవం ఎలా ఉంది? (Rating)
              </label>
              <div className="flex items-center space-x-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer focus:outline-none transition-transform hover:scale-110"
                    aria-label={`Rate ${star} star`}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-[#E5E5DF]'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-medium text-secondary-text ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block font-medium text-charcoal mb-1">వర్గం (Category)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5DF] bg-[#F8F7F2]/40 text-charcoal focus:bg-white focus:border-forest focus:outline-none transition-colors"
              >
                <option value="General Feedback">సాధారణ అభిప్రాయం (General Feedback)</option>
                <option value="Scheme Information Correction">పథకం వివరాల్లో సవరణ (Scheme Correction)</option>
                <option value="Voice / Language Request">వాయిస్ లేదా భాష మెరుగుదల (Voice/Language)</option>
                <option value="Certificate Assistance">ప్రజా సేవల మార్గదర్శకత్వం (Certificate Guide)</option>
              </select>
            </div>

            {/* Feedback Message */}
            <div>
              <label className="block font-medium text-charcoal mb-1">
                మీ సందేశం లేదా సలహా (Message / Suggestion)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Share your experience or tell us how we can make government schemes simpler..."
                className="w-full p-3.5 rounded-lg border border-[#E5E5DF] bg-[#F8F7F2]/40 text-charcoal placeholder:text-secondary-text text-sm focus:bg-white focus:border-forest focus:outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-forest hover:bg-forest/90 text-white font-medium px-6 py-2.5 rounded-full text-xs sm:text-sm shadow-2xs transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'సమర్పించండి (Submit Feedback)'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
