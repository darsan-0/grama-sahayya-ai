import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  GraduationCap,
  Tractor,
  HeartHandshake,
  Users,
  Home,
  ShieldAlert,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  PhoneCall,
  Mic,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSimpleMode } from '../context/SimpleModeContext';
import { VERIFIED_SCHEMES } from '../data/schemes';
import { Scheme } from '../types';
import {
  getSchemeTitle,
  getSchemeSubtitle,
  getSchemeBenefit,
  getSchemeSummary
} from '../i18n/languages';

interface LandingPageProps {
  onSelectScheme: (scheme: Scheme) => void;
  onNavigateTab: (tab: string) => void;
  onOpenEligibility: (scheme?: Scheme) => void;
  onSearchQuery: (query: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectScheme,
  onNavigateTab,
  onOpenEligibility,
  onSearchQuery
}) => {
  const { currentLanguage, t } = useLanguage();
  const { isSimpleMode } = useSimpleMode();
  const [searchTerm, setSearchTerm] = useState('');

  const isTe = currentLanguage === 'te';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearchQuery(searchTerm);
      onNavigateTab('schemes');
    }
  };

  const categories = [
    {
      id: 'education',
      title: 'విద్య & స్కాలర్‌షిప్‌లు',
      enTitle: 'Education & Scholarships',
      icon: GraduationCap,
      color: 'bg-blue-600',
      description: 'విద్యా దీవెన, వసతి దీవెన, పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్‌లు',
      enDescription: 'Vidya Deevena, Vasathi Deevena, Central post-matric fee reimbursement',
      count: isTe ? '4 పథకాలు' : '4 Schemes'
    },
    {
      id: 'agriculture',
      title: 'రైతు సంక్షేమం & పంటలు',
      enTitle: 'Farmers & Agriculture',
      icon: Tractor,
      color: 'bg-emerald-600',
      description: 'వైఎస్సార్ రైతు భరోసా, పీఎం-కిసాన్, కౌలు రైతుల కార్డులు',
      enDescription: 'YSR Rythu Bharosa, PM-KISAN, tenant farmer support cards',
      count: isTe ? '3 పథకాలు' : '3 Schemes'
    },
    {
      id: 'women_shg',
      title: 'మహిళా సాధికారత & డ్వాక్రా',
      enTitle: 'Women & Self Help Groups',
      icon: Users,
      color: 'bg-purple-600',
      description: 'వైఎస్సార్ చేయూత, ఆసరా, సున్నా వడ్డీ రుణాలు',
      enDescription: 'YSR Cheyutha, YSR Aasara, DWCRA interest-free loans',
      count: isTe ? '2 పథకాలు' : '2 Schemes'
    },
    {
      id: 'pensions',
      title: 'వృద్ధాప్య & వికలాంగ పింఛన్లు',
      enTitle: 'Social Security Pensions',
      icon: HeartHandshake,
      color: 'bg-rose-600',
      description: 'వైఎస్సార్ పింఛన్ కానుక, వితంతు, దివ్యాంగుల పింఛన్లు',
      enDescription: 'Doorstep monthly old-age, widow, and disability welfare pensions',
      count: isTe ? '1 పథకం' : '1 Scheme'
    },
    {
      id: 'housing',
      title: 'గృహ నిర్మాణం & సౌర విద్యుత్',
      enTitle: 'Housing & Solar Energy',
      icon: Home,
      color: 'bg-amber-600',
      description: 'పేదలందరికీ ఇళ్లు, పీఎం సూర్య ఘర్ ఉచిత విద్యుత్',
      enDescription: 'Navaratnalu house sites, PM Surya Ghar 300 units free solar power',
      count: isTe ? '2 పథకాలు' : '2 Schemes'
    },
    {
      id: 'health',
      title: 'ఉచిత వైద్యం & ఆరోగ్యశ్రీ',
      enTitle: 'Health & Medical Care',
      icon: ShieldCheck,
      color: 'bg-teal-600',
      description: 'ఆరోగ్యశ్రీ రూ. 25 లక్షల ఉచిత వైద్యం, ఆయుష్మాన్ భారత్',
      enDescription: 'Dr. YSR Aarogyasri Rs. 25 Lakhs cashless treatment, Ayushman Bharat',
      count: isTe ? '1 పథకం' : '1 Scheme'
    },
    {
      id: 'msme_entrepreneurship',
      title: 'ఉపాధి & చిరు వ్యాపారాలు',
      enTitle: 'Livelihood & Small Businesses',
      icon: Briefcase,
      color: 'bg-cyan-600',
      description: 'పీఎం స్వనిధి వీధి వ్యాపార రుణాలు, ముద్రా రుణాలు',
      enDescription: 'PM SVANidhi street vendor working capital loans, Mudra loans',
      count: isTe ? '1 పథకం' : '1 Scheme'
    },
    {
      id: 'employment',
      title: 'గ్రామీణ ఉపాధి హామీ (NREGS)',
      enTitle: 'Rural Employment Guarantee',
      icon: Users,
      color: 'bg-stone-700',
      description: 'ఏటా 100 రోజుల పని హక్కు & రోజువారీ వేతనం',
      enDescription: '100 days guaranteed unskilled manual wage work per rural household',
      count: isTe ? '1 పథకం' : '1 Scheme'
    }
  ];

  const featuredSchemes = VERIFIED_SCHEMES.slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>
              {isTe
                ? 'అధికారిక ప్రభుత్వ సంక్షేమ మార్గదర్శిని • ఆంధ్రప్రదేశ్ & కేంద్ర ప్రభుత్వ పథకాలు'
                : 'Official Government Welfare Guidance • Andhra Pradesh & Central Schemes'}
            </span>
          </div>

          <h1 className={`${isSimpleMode ? 'text-3xl sm:text-5xl font-black' : 'text-3xl sm:text-5xl lg:text-6xl font-extrabold'} tracking-tight leading-tight`}>
            {isTe ? (
              <>
                ప్రభుత్వ సేవలు, ప్రతి పౌరుడికి <span className="text-amber-400">సులభంగా</span>
              </>
            ) : (
              <>
                Government Services, <span className="text-amber-400">Made Simple</span> for Every Citizen
              </>
            )}
          </h1>

          <p className="max-w-2xl mx-auto text-emerald-100 text-sm sm:text-lg leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto pt-2">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden bg-white">
              <div className="pl-4 text-stone-400">
                <Search className="w-5 h-5 text-emerald-800" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full py-4 pl-3 pr-28 text-stone-900 text-sm sm:text-base focus:outline-none placeholder-stone-400"
              />
              <button
                type="submit"
                className="absolute right-2 bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center space-x-1"
              >
                <span>{t('searchButton')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick suggested searches */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs text-emerald-200">
              <span className="font-semibold text-amber-300">{t('quickSearch')}</span>
              {(isTe
                ? ['విద్యా దీవెన', 'రైతు భరోసా', 'ఆరోగ్యశ్రీ', 'పింఛన్', 'ఆధార్', 'పాన్ కార్డు']
                : ['Vidya Deevena (Fee)', 'Rythu Bharosa', 'Aarogyasri Health', 'Pensions', 'Aadhaar Update', 'PAN Card']
              ).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    onSearchQuery(q.split(' ')[0]);
                    onNavigateTab('schemes');
                  }}
                  className="bg-emerald-950/60 hover:bg-emerald-800 border border-emerald-700 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigateTab('chat')}
              className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-6 py-3 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer flex items-center space-x-2 text-sm sm:text-base"
            >
              <Mic className="w-5 h-5" />
              <span>{t('askAiHero')}</span>
            </button>
            <button
              onClick={() => onOpenEligibility()}
              className="bg-emerald-800/80 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl border border-emerald-600 shadow-md transition-all cursor-pointer flex items-center space-x-2 text-sm sm:text-base"
            >
              <CheckCircle2 className="w-5 h-5 text-amber-300" />
              <span>{t('myEligibilityHero')}</span>
            </button>
          </div>
        </div>

        {/* Decorative background curve */}
        <div className="absolute -bottom-1 left-0 right-0 h-8 bg-[#fcfbf7] rounded-t-[40px] pointer-events-none"></div>
      </section>

      {/* Authentic Impact & Verification Counter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-6 grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-stone-100">
          <div className="text-center pt-2 lg:pt-0">
            <div className="text-3xl font-black text-emerald-900">100%</div>
            <div className="text-xs sm:text-sm font-semibold text-stone-700 mt-1">
              {isTe ? 'అధికారిక రికార్డులు' : 'Verified Official Records'}
            </div>
            <div className="text-[11px] text-stone-500">
              {isTe ? 'అన్ని వివరాలు ప్రభుత్వ ఉత్తర్వులు & పోర్టల్స్ ఆధారితం' : 'All data grounded in official Gazette & portals'}
            </div>
          </div>
          <div className="text-center pt-2 lg:pt-0">
            <div className="text-3xl font-black text-emerald-900">22</div>
            <div className="text-xs sm:text-sm font-semibold text-stone-700 mt-1">
              {isTe ? 'భారతీయ భాషలు' : 'Scheduled Indian Languages'}
            </div>
            <div className="text-[11px] text-stone-500">
              {isTe ? 'తెలుగు & ఇంగ్లీష్ పూర్తి అనుభవం' : 'Telugu & English fully tested'}
            </div>
          </div>
          <div className="text-center pt-2 lg:pt-0">
            <div className="text-3xl font-black text-amber-600">₹0</div>
            <div className="text-xs sm:text-sm font-semibold text-stone-700 mt-1">
              {isTe ? 'పౌరులకు ఉచితం' : 'Completely Free for Citizens'}
            </div>
            <div className="text-[11px] text-stone-500">
              {isTe ? 'ఎటువంటి దళారులు లేకుండా ప్రత్యక్ష సమాచారం' : 'Zero agent commission, direct guidance'}
            </div>
          </div>
          <div className="text-center pt-2 lg:pt-0">
            <div className="text-3xl font-black text-emerald-900">Zero</div>
            <div className="text-xs sm:text-sm font-semibold text-stone-700 mt-1">
              {isTe ? 'రహస్య సమాచారం సేకరణ లేదు' : 'No Sensitive Biometrics'}
            </div>
            <div className="text-[11px] text-stone-500">
              {isTe ? 'ఆధార్ పాస్‌వర్డ్‌లు, బయోమెట్రిక్స్ అడగము' : 'No Aadhaar OTP or bank passwords collected'}
            </div>
          </div>
        </div>
      </section>

      {/* Welfare Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 flex items-center space-x-2">
              <span className="w-2.5 h-6 bg-amber-500 rounded-sm inline-block"></span>
              <span>{t('categoriesTitle')}</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              {t('categoriesSubtitle')}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('schemes')}
            className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-700 flex items-center space-x-1 cursor-pointer"
          >
            <span>{t('viewAllSchemes')} ({VERIFIED_SCHEMES.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const categoryTitle = isTe ? cat.title : cat.enTitle;
            const categoryDesc = isTe ? cat.description : cat.enDescription;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSearchQuery(cat.id);
                  onNavigateTab('schemes');
                }}
                className="bg-white hover:bg-emerald-50/40 rounded-2xl p-5 border border-stone-200 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${cat.color} text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-stone-900 group-hover:text-emerald-900 transition-colors">
                    {categoryTitle}
                  </h3>
                  {isTe && (
                    <div className="text-xs font-semibold text-emerald-800 mb-2">
                      {cat.enTitle}
                    </div>
                  )}
                  <p className="text-xs text-stone-600 line-clamp-2">
                    {categoryDesc}
                  </p>
                </div>
                <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="font-medium bg-stone-100 px-2 py-0.5 rounded-full">{cat.count}</span>
                  <span className="text-emerald-800 font-semibold group-hover:underline flex items-center space-x-0.5">
                    <span>{isTe ? 'చూడండి' : 'Explore'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured High-Impact Andhra Pradesh Schemes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-block bg-amber-500 text-stone-950 text-xs font-black uppercase px-2.5 py-0.5 rounded-full mb-2">
                {t('flagshipSchemes')}
              </div>
              <h2 className="text-2xl font-bold text-stone-900">
                {t('flagshipSubtitle')}
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('schemes')}
              className="bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md cursor-pointer self-start sm:self-auto"
            >
              {isTe ? `మొత్తం పథకాల జాబితా (${VERIFIED_SCHEMES.length})` : `All Verified Schemes (${VERIFIED_SCHEMES.length})`}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="bg-emerald-100 text-emerald-900 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {scheme.govLevel === 'state'
                        ? (isTe ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వం' : 'Govt of Andhra Pradesh')
                        : (isTe ? 'కేంద్ర ప్రభుత్వం' : 'Government of India')}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      Verified: {scheme.lastVerifiedAt}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-stone-900">
                    {getSchemeTitle(scheme, currentLanguage)}
                  </h3>
                  <div className="text-xs text-stone-500 font-medium line-clamp-1">
                    {getSchemeSubtitle(scheme, currentLanguage)}
                  </div>

                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-950">
                    <div className="font-bold text-amber-900 mb-0.5">
                      {isTe ? 'లభించే ప్రయోజనం:' : 'Key Benefit:'}
                    </div>
                    <div>{getSchemeBenefit(scheme, currentLanguage)}</div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectScheme(scheme)}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-700 underline cursor-pointer"
                  >
                    {t('viewDetails')}
                  </button>
                  <button
                    onClick={() => onOpenEligibility(scheme)}
                    className="bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold text-xs px-3 py-1.5 rounded-lg shadow-xs cursor-pointer flex items-center space-x-1"
                  >
                    <span>{t('checkEligibility')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Public Digital Services Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full inline-block">
              {isTe ? 'డిజిటల్ ప్రజా సేవలు' : 'Public Digital Services'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t('digitalCertificatesTitle')}
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed">
              {t('digitalCertificatesSubtitle')}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigateTab('services')}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-sm shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <span>{t('openServicesGuide')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigateTab('preparation')}
                className="bg-stone-800 hover:bg-stone-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm border border-stone-700 cursor-pointer"
              >
                {t('prepareApplication')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Citizen Trust & Privacy Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-stone-800 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-emerald-700" />
            <span>
              {isTe ? 'పౌరుల భద్రత & అధికారిక హామీ (Citizen Security Commitment)' : 'Citizen Security Commitment & Privacy Guarantee'}
            </span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            {t('trustNotice')}
          </p>
        </div>
      </section>
    </div>
  );
};
