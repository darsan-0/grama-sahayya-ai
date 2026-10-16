import React from 'react';
import {
  User,
  Sparkles,
  Bookmark,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ChevronRight,
  SlidersHorizontal,
  Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { VERIFIED_SCHEMES } from '../data/schemes';
import { Scheme } from '../types';
import { evaluateSchemeEligibility } from '../utils/eligibilityEngine';
import {
  getSchemeTitle,
  getSchemeSubtitle,
  getSchemeBenefit
} from '../i18n/languages';

interface CitizenDashboardProps {
  onSelectScheme: (scheme: Scheme) => void;
  onOpenProfile: () => void;
  onNavigateTab: (tab: string) => void;
  savedSchemeIds: string[];
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  onSelectScheme,
  onOpenProfile,
  onNavigateTab,
  savedSchemeIds
}) => {
  const { currentUser, userProfile } = useAuth();
  const { currentLanguage, t } = useLanguage();
  const isTe = currentLanguage === 'te';

  // Calculate personalized scheme matches
  const personalizedSchemes = VERIFIED_SCHEMES.map((scheme) => ({
    scheme,
    evaluation: evaluateSchemeEligibility(scheme, userProfile)
  })).filter((item) => item.evaluation.status === 'likely_eligible' || item.evaluation.status === 'potentially_eligible');

  const savedSchemesList = VERIFIED_SCHEMES.filter((s) => savedSchemeIds.includes(s.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Citizen Welcome Card */}
      <div className="bg-forest text-white rounded-2xl p-6 sm:p-8 border border-forest/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-white/10 text-gold flex items-center justify-center font-bold text-xl border border-gold/40">
            {userProfile?.displayName ? userProfile.displayName[0].toUpperCase() : 'C'}
          </div>
          <div className="space-y-1">
            <div className="inline-block bg-white/10 text-gold border border-gold/30 text-[10px] font-medium px-2.5 py-0.5 rounded-full">
              Verified Citizen Profile
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
              {isTe ? `నమస్కారం, ${userProfile?.displayName || 'Citizen'}!` : `Welcome back, ${userProfile?.displayName || 'Citizen'}!`}
            </h1>
            <p className="text-xs text-white/70">
              {userProfile?.district || 'Andhra Pradesh'} • {userProfile?.occupation || 'Citizen'} • {userProfile?.educationLevel || ''}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenProfile}
          className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium px-4 py-2 rounded-full transition-colors cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <SlidersHorizontal className="w-4 h-4 text-gold" />
          <span>{isTe ? 'ప్రొఫైల్ సవరణ' : 'Edit Profile & Preferences'}</span>
        </button>
      </div>

      {/* Welfare Deadlines Alert Banner */}
      <div className="bg-[#FAF7EC] border border-[#EBE3CD] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-charcoal">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-[#8C6D1F] shrink-0" />
          <div>
            <strong className="font-semibold text-charcoal">
              {isTe ? 'రాబోయే సంక్షేమ గడువులు:' : 'Upcoming Welfare Deadlines & Cycles:'}
            </strong>
            <p className="text-secondary-text mt-0.5 leading-relaxed">
              {isTe
                ? 'జగనన్న విద్యా దీవెన బయోమెట్రిక్ వెరిఫికేషన్ సచివాలయాల్లో కొనసాగుతోంది. పీఎం సూర్య ఘర్ సోలార్ సబ్సిడీ పోర్టల్ అందుబాటులో ఉంది.'
                : 'Jagananna Vidya Deevena college biometric attendance cycle active. PM Surya Ghar solar rooftop claims open on national portal.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('chat')}
          className="bg-forest hover:bg-forest/90 text-white font-medium px-3.5 py-1.5 rounded-full shrink-0 cursor-pointer text-xs transition-colors shadow-2xs"
        >
          {isTe ? 'సహాయకుడిని అడగండి' : 'Ask Assistant'}
        </button>
      </div>

      {/* Personalized Matches Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-charcoal flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#8C6D1F]" />
            <span>
              {isTe ? 'మీ ప్రొఫైల్‌కు తగిన పథకాలు' : 'Schemes Recommended for Your Profile'}
            </span>
          </h2>
          <span className="text-xs font-medium text-forest bg-[#EBF3F0] px-2.5 py-0.5 rounded-full border border-forest/20">
            {personalizedSchemes.length} {isTe ? 'పథకాలు సరిపోయాయి' : 'Matched Schemes'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {personalizedSchemes.map(({ scheme, evaluation }) => (
            <div
              key={scheme.id}
              className="bg-white rounded-xl p-5 border border-[#E5E5DF] hover:border-forest/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    evaluation.status === 'likely_eligible'
                      ? 'bg-[#EBF3F0] text-forest border border-forest/20'
                      : 'bg-[#FAF7EC] text-[#8C6D1F] border border-[#EBE3CD]'
                  }`}>
                    {evaluation.status === 'likely_eligible'
                      ? (isTe ? 'అర్హత ఉండవచ్చు' : 'Likely Eligible')
                      : (isTe ? 'మరిన్ని వివరాలు అవసరం' : 'Potentially Eligible')}
                  </span>
                  <span className="text-[11px] text-secondary-text font-mono">
                    {scheme.category}
                  </span>
                </div>

                <h3 className="font-semibold text-base text-charcoal">
                  {getSchemeTitle(scheme, currentLanguage)}
                </h3>
                <p className="text-xs text-secondary-text truncate">
                  {getSchemeSubtitle(scheme, currentLanguage)}
                </p>

                <div className="bg-[#F8F7F2] rounded-lg p-3 text-xs text-charcoal border border-[#E5E5DF]">
                  <div className="font-medium text-forest mb-0.5">
                    {isTe ? 'లభించే ప్రయోజనం:' : 'Approved Benefit:'}
                  </div>
                  <div className="line-clamp-2 text-secondary-text">{getSchemeBenefit(scheme, currentLanguage)}</div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#E5E5DF] flex items-center justify-between">
                <button
                  onClick={() => onSelectScheme(scheme)}
                  className="text-xs font-medium text-forest hover:underline cursor-pointer"
                >
                  {isTe ? 'వివరాలు చూడండి' : 'View Details'}
                </button>
                <button
                  onClick={() => onNavigateTab('preparation')}
                  className="bg-forest hover:bg-forest/90 text-white font-medium text-xs px-3.5 py-1.5 rounded-full shadow-2xs cursor-pointer flex items-center space-x-1 transition-colors"
                >
                  <span>{isTe ? 'దరఖాస్తు సిద్ధం' : 'Prepare Application'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Bookmarks & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Schemes */}
        <div className="bg-white rounded-xl p-6 border border-[#E5E5DF] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base text-charcoal flex items-center space-x-2">
              <Bookmark className="w-4 h-4 text-[#8C6D1F]" />
              <span>
                {isTe ? 'దాచుకున్న పథకాలు' : 'Saved Scheme Bookmarks'}
              </span>
            </h3>
            <span className="text-xs text-secondary-text font-medium">
              {savedSchemesList.length} {isTe ? 'పథకాలు' : 'Items'}
            </span>
          </div>

          {savedSchemesList.length === 0 ? (
            <div className="text-center py-8 text-xs text-secondary-text bg-[#F8F7F2] rounded-lg border border-dashed border-[#E5E5DF]">
              {isTe
                ? 'ఇంకా ఏ పథకాన్ని సేవ్ చేయలేదు. పథకాల జాబితాలో బుక్‌మార్క్ చిహ్నం క్లిక్ చేయండి.'
                : 'No saved schemes yet. Bookmark schemes in the directory to save them here.'}
            </div>
          ) : (
            <div className="space-y-2">
              {savedSchemesList.map((scheme) => (
                <div
                  key={scheme.id}
                  className="bg-[#F8F7F2] hover:bg-[#F2F1ED] p-3 rounded-lg border border-[#E5E5DF] flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-medium text-xs text-charcoal">
                      {getSchemeTitle(scheme, currentLanguage)}
                    </div>
                    <div className="text-[11px] text-secondary-text">{scheme.benefitAmount}</div>
                  </div>
                  <button
                    onClick={() => onSelectScheme(scheme)}
                    className="text-xs font-medium text-forest hover:underline cursor-pointer"
                  >
                    {isTe ? 'చూడండి' : 'View'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Citizen Services */}
        <div className="bg-white rounded-xl p-6 border border-[#E5E5DF] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base text-charcoal flex items-center space-x-2">
              <FileText className="w-4 h-4 text-forest" />
              <span>
                {isTe ? 'ప్రజా డిజిటల్ సేవలు (Quick Access)' : 'Quick Public Digital Services'}
              </span>
            </h3>
            <button
              onClick={() => onNavigateTab('services')}
              className="text-xs font-medium text-forest hover:underline cursor-pointer"
            >
              {isTe ? 'అన్నీ చూడండి' : 'View All'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { title: isTe ? 'ఆధార్ అడ్రస్ మార్పు' : 'Aadhaar Address Update', desc: 'UIDAI Portal' },
              { title: isTe ? 'ఇన్‌స్టంట్ ఉచిత e-PAN' : 'Instant Free e-PAN', desc: 'Income Tax Portal' },
              { title: isTe ? 'కుల & ఆదాయ సర్టిఫికెట్లు' : 'Caste & Income Certificates', desc: 'Grama Sachivalayam' },
              { title: isTe ? 'మీభూమి అడంగల్ & 1-B' : 'Meebhoomi Land Records', desc: 'AP Webland Registry' },
            ].map((svc, i) => (
              <button
                key={i}
                onClick={() => onNavigateTab('services')}
                className="p-3 bg-[#F8F7F2] hover:bg-[#F2F1ED] rounded-lg border border-[#E5E5DF] text-left transition-colors cursor-pointer"
              >
                <div className="font-medium text-charcoal">{svc.title}</div>
                <div className="text-[10px] text-secondary-text mt-0.5">{svc.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
