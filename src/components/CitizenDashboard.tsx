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
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-emerald-950 flex items-center justify-center font-black text-2xl shadow-lg border-2 border-amber-300">
            {userProfile?.displayName ? userProfile.displayName[0].toUpperCase() : 'C'}
          </div>
          <div className="space-y-1">
            <div className="inline-block bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              Verified Citizen Profile
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              {isTe ? `నమస్కారం, ${userProfile?.displayName || 'Citizen'}!` : `Welcome back, ${userProfile?.displayName || 'Citizen'}!`}
            </h1>
            <p className="text-xs text-emerald-200">
              {userProfile?.district || 'Andhra Pradesh'} • {userProfile?.occupation || 'Citizen'} • {userProfile?.educationLevel || ''}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenProfile}
          className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <SlidersHorizontal className="w-4 h-4 text-amber-300" />
          <span>{isTe ? 'ప్రొఫైల్ సవరణ' : 'Edit Profile & Preferences'}</span>
        </button>
      </div>

      {/* Welfare Deadlines Alert Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-amber-700 shrink-0" />
          <div>
            <strong>
              {isTe ? 'రాబోయే సంక్షేమ గడువులు:' : 'Upcoming Welfare Deadlines & Cycles:'}
            </strong>
            <p className="text-stone-700">
              {isTe
                ? 'జగనన్న విద్యా దీవెన బయోమెట్రిక్ వెరిఫికేషన్ సచివాలయాల్లో కొనసాగుతోంది. పీఎం సూర్య ఘర్ సోలార్ సబ్సిడీ పోర్టల్ అందుబాటులో ఉంది.'
                : 'Jagananna Vidya Deevena college biometric attendance cycle active. PM Surya Ghar solar rooftop claims open on national portal.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('chat')}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg shrink-0 cursor-pointer"
        >
          {isTe ? 'సహాయకుడిని అడగండి' : 'Ask Assistant'}
        </button>
      </div>

      {/* Personalized Matches Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>
              {isTe ? 'మీ ప్రొఫైల్‌కు తగిన పథకాలు' : 'Schemes Recommended for Your Profile'}
            </span>
          </h2>
          <span className="text-xs font-semibold text-emerald-800">
            {personalizedSchemes.length} {isTe ? 'పథకాలు సరిపోయాయి' : 'Matched Schemes'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {personalizedSchemes.map(({ scheme, evaluation }) => (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-emerald-700/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    evaluation.status === 'likely_eligible'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {evaluation.status === 'likely_eligible'
                      ? (isTe ? 'అర్హత ఉండవచ్చు' : 'Likely Eligible')
                      : (isTe ? 'మరిన్ని వివరాలు అవసరం' : 'Potentially Eligible')}
                  </span>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {scheme.category}
                  </span>
                </div>

                <h3 className="font-bold text-base text-stone-900">
                  {getSchemeTitle(scheme, currentLanguage)}
                </h3>
                <p className="text-xs text-stone-500 truncate">
                  {getSchemeSubtitle(scheme, currentLanguage)}
                </p>

                <div className="bg-stone-50 rounded-xl p-2.5 text-xs text-stone-700">
                  <div className="font-semibold text-emerald-900 mb-0.5">
                    {isTe ? 'లభించే ప్రయోజనం:' : 'Approved Benefit:'}
                  </div>
                  <div className="line-clamp-2">{getSchemeBenefit(scheme, currentLanguage)}</div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => onSelectScheme(scheme)}
                  className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
                >
                  {isTe ? 'వివరాలు చూడండి' : 'View Details'}
                </button>
                <button
                  onClick={() => onNavigateTab('preparation')}
                  className="bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold text-xs px-3 py-1.5 rounded-lg shadow-2xs cursor-pointer flex items-center space-x-1"
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
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-stone-900 flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-amber-500" />
              <span>
                {isTe ? 'దాచుకున్న పథకాలు' : 'Saved Scheme Bookmarks'}
              </span>
            </h3>
            <span className="text-xs text-stone-400 font-semibold">
              {savedSchemesList.length} {isTe ? 'పథకాలు' : 'Items'}
            </span>
          </div>

          {savedSchemesList.length === 0 ? (
            <div className="text-center py-8 text-xs text-stone-400 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
              {isTe
                ? 'ఇంకా ఏ పథకాన్ని సేవ్ చేయలేదు. పథకాల జాబితాలో బుక్‌మార్క్ చిహ్నం క్లిక్ చేయండి.'
                : 'No saved schemes yet. Bookmark schemes in the directory to save them here.'}
            </div>
          ) : (
            <div className="space-y-2">
              {savedSchemesList.map((scheme) => (
                <div
                  key={scheme.id}
                  className="bg-stone-50 hover:bg-emerald-50/40 p-3 rounded-xl border border-stone-200 flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-bold text-xs text-stone-900">
                      {getSchemeTitle(scheme, currentLanguage)}
                    </div>
                    <div className="text-[11px] text-stone-500">{scheme.benefitAmount}</div>
                  </div>
                  <button
                    onClick={() => onSelectScheme(scheme)}
                    className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
                  >
                    {isTe ? 'చూడండి' : 'View'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Citizen Services */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-stone-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-emerald-800" />
              <span>
                {isTe ? 'ప్రజా డిజిటల్ సేవలు (Quick Access)' : 'Quick Public Digital Services'}
              </span>
            </h3>
            <button
              onClick={() => onNavigateTab('services')}
              className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
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
                className="p-3 bg-stone-50 hover:bg-emerald-50 rounded-xl border border-stone-200 text-left transition-colors cursor-pointer"
              >
                <div className="font-bold text-stone-900">{svc.title}</div>
                <div className="text-[10px] text-stone-500">{svc.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
