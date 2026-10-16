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
      description: 'విద్యా దీవెన, వసతి దీవెన, పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్‌లు',
      enDescription: 'Vidya Deevena, Vasathi Deevena, Central post-matric fee reimbursement',
      count: isTe ? '4 పథకాలు' : '4 Schemes'
    },
    {
      id: 'agriculture',
      title: 'రైతు సంక్షేమం & పంటలు',
      enTitle: 'Farmers & Agriculture',
      icon: Tractor,
      description: 'వైఎస్సార్ రైతు భరోసా, పీఎం-కిసాన్, కౌలు రైతుల కార్డులు',
      enDescription: 'YSR Rythu Bharosa, PM-KISAN, tenant farmer support cards',
      count: isTe ? '3 పథకాలు' : '3 Schemes'
    },
    {
      id: 'women_shg',
      title: 'మహిళా సాధికారత & డ్వాక్రా',
      enTitle: 'Women & Self Help Groups',
      icon: Users,
      description: 'వైఎస్సార్ చేయూత, ఆసరా, సున్నా వడ్డీ రుణాలు',
      enDescription: 'YSR Cheyutha, YSR Aasara, DWCRA interest-free loans',
      count: isTe ? '2 పథకాలు' : '2 Schemes'
    },
    {
      id: 'pensions',
      title: 'వృద్ధాప్య & వికలాంగ పింఛన్లు',
      enTitle: 'Social Security Pensions',
      icon: HeartHandshake,
      description: 'వైఎస్సార్ పింఛన్ కానుక, వితంతు, దివ్యాంగుల పింఛన్లు',
      enDescription: 'Doorstep monthly old-age, widow, and disability welfare pensions',
      count: isTe ? '1 పథకం' : '1 Scheme'
    },
    {
      id: 'housing',
      title: 'గృహ నిర్మాణం & సౌర విద్యుత్',
      enTitle: 'Housing & Solar Energy',
      icon: Home,
      description: 'పేదలందరికీ ఇళ్లు, పీఎం సూర్య ఘర్ ఉచిత విద్యుత్',
      enDescription: 'Navaratnalu house sites, PM Surya Ghar 300 units free solar power',
      count: isTe ? '2 పథకాలు' : '2 Schemes'
    },
    {
      id: 'health',
      title: 'ఉచిత వైద్యం & ఆరోగ్యశ్రీ',
      enTitle: 'Health & Medical Care',
      icon: ShieldCheck,
      description: 'ఆరోగ్యశ్రీ రూ. 25 లక్షల ఉచిత వైద్యం, ఆయుష్మాన్ భారత్',
      enDescription: 'Dr. YSR Aarogyasri Rs. 25 Lakhs cashless treatment, Ayushman Bharat',
      count: isTe ? '1 పథకం' : '1 Scheme'
    },
    {
      id: 'msme_entrepreneurship',
      title: 'ఉపాధి & చిరు వ్యాపారాలు',
      enTitle: 'Livelihood & Small Businesses',
      icon: Briefcase,
      description: 'పీఎం స్వనిధి వీధి వ్యాపార రుణాలు, ముద్రా రుణాలు',
      enDescription: 'PM SVANidhi street vendor working capital loans, Mudra loans',
      count: isTe ? '1 పథకం' : '1 Scheme'
    },
    {
      id: 'employment',
      title: 'గ్రామీణ ఉపాధి హామీ (NREGS)',
      enTitle: 'Rural Employment Guarantee',
      icon: Users,
      description: 'ఏటా 100 రోజుల పని హక్కు & రోజువారీ వేతనం',
      enDescription: '100 days guaranteed unskilled manual wage work per rural household',
      count: isTe ? '1 పథకం' : '1 Scheme'
    }
  ];

  const featuredSchemes = VERIFIED_SCHEMES.slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Spacious Apple Store-inspired Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-[#FAF9F5] to-[#F8F7F2] border-b border-[#E5E5DF]">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Restrained Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-[#EBF3F0] border border-[#C8DDD6] text-[#075B46] px-3.5 py-1.5 rounded-full text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-[#075B46] shrink-0" />
            <span className="tracking-tight">
              {isTe
                ? 'అధికారిక ప్రభుత్వ సంక్షేమ మార్గదర్శిని • ఆంధ్రప్రదేశ్ & కేంద్ర పథకాలు'
                : 'Official Government Welfare Guidance • Andhra Pradesh & All-India'}
            </span>
          </div>

          {/* Clean, Large Typography */}
          <h1 className={`${isSimpleMode ? 'text-3xl sm:text-5xl font-bold' : 'text-3xl sm:text-5xl lg:text-6xl font-semibold'} tracking-tight leading-[1.15] text-[#242824]`}>
            {isTe ? (
              <>
                ప్రభుత్వ సేవలు, ప్రతి పౌరుడికి <span className="text-[#075B46]">సులభంగా</span>
              </>
            ) : (
              <>
                Government Services, <span className="text-[#075B46]">Made Simple</span> for Every Citizen
              </>
            )}
          </h1>

          {/* Calm, readable subtitle */}
          <p className="max-w-2xl mx-auto text-[#686B66] text-sm sm:text-lg leading-relaxed font-normal">
            {t('heroSubtitle')}
          </p>

          {/* Search Bar: The Primary Focal Point */}
          <div className="max-w-2xl mx-auto pt-2 w-full">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center bg-white rounded-2xl border border-[#E5E5DF] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:border-[#C8DDD6] focus-within:border-[#075B46] focus-within:ring-2 focus-within:ring-[#075B46]/10 transition-all w-full p-1.5"
            >
              <div className="pl-3.5 text-[#075B46] pointer-events-none flex items-center justify-center">
                <Search className="w-5 h-5 shrink-0" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full h-12 sm:h-13 pl-3 pr-28 sm:pr-32 text-[#242824] text-sm sm:text-base bg-transparent focus:outline-none placeholder-[#8E918C]"
              />
              <button
                type="submit"
                className="bg-[#075B46] hover:bg-[#064B3A] text-white font-medium px-4 sm:px-5 h-10 sm:h-11 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
              >
                <span>{t('searchButton')}</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            </form>

            {/* Restrained suggested search chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-4 text-xs text-[#686B66]">
              <span className="font-medium text-[#242824] shrink-0">{t('quickSearch')}</span>
              {(isTe
                ? ['విద్యా దీవెన', 'రైతు భరోసా', 'ఆరోగ్యశ్రీ', 'పింఛన్', 'ఆధార్', 'పాన్ కార్డు']
                : ['Vidya Deevena', 'Rythu Bharosa', 'Aarogyasri Health', 'Pensions', 'Aadhaar', 'PAN Card']
              ).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    onSearchQuery(q.split(' ')[0]);
                    onNavigateTab('schemes');
                  }}
                  className="h-7 inline-flex items-center justify-center bg-white hover:bg-[#F8F7F2] border border-[#E5E5DF] text-[#686B66] hover:text-[#242824] hover:border-[#C8DDD6] px-3 rounded-full transition-colors cursor-pointer text-xs"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Primary CTA and Understated Secondary Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto sm:max-w-none">
            <button
              onClick={() => onNavigateTab('chat')}
              className="w-full sm:w-auto min-h-[46px] bg-[#075B46] hover:bg-[#064B3A] text-white font-medium px-6 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-2 text-sm sm:text-base text-center shrink-0"
            >
              <Mic className="w-4.5 h-4.5 shrink-0 text-[#E6B84A]" />
              <span>{t('askAiHero')}</span>
            </button>
            <button
              onClick={() => onOpenEligibility()}
              className="w-full sm:w-auto min-h-[46px] bg-white hover:bg-[#F8F7F2] text-[#242824] font-medium px-6 py-2.5 rounded-xl border border-[#E5E5DF] hover:border-[#C8DDD6] shadow-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-2 text-sm sm:text-base text-center shrink-0"
            >
              <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-[#075B46]" />
              <span>{t('myEligibilityHero')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Verified Official Standards Counter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-[#E5E5DF] p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-[#E5E5DF]">
          <div className="text-center pt-2 lg:pt-0">
            <div className="text-3xl font-semibold tracking-tight text-[#075B46]">100%</div>
            <div className="text-xs sm:text-sm font-semibold text-[#242824] mt-1">
              {isTe ? 'అధికారిక రికార్డులు' : 'Verified Official Records'}
            </div>
            <div className="text-[11px] text-[#686B66] mt-0.5">
              {isTe ? 'అన్ని వివరాలు ప్రభుత్వ గెజిట్ ఆధారితం' : 'All data grounded in official Gazette'}
            </div>
          </div>
          <div className="text-center pt-2 lg:pt-0">
            <div className="text-3xl font-semibold tracking-tight text-[#075B46]">22</div>
            <div className="text-xs sm:text-sm font-semibold text-[#242824] mt-1">
              {isTe ? 'భారతీయ భాషలు' : 'Scheduled Indian Languages'}
            </div>
            <div className="text-[11px] text-[#686B66] mt-0.5">
              {isTe ? 'తెలుగు & ఇంగ్లీష్ పూర్తి అనుభవం' : 'Telugu & English fully tested'}
            </div>
          </div>
          <div className="text-center pt-2 lg:pt-0">
            <div className="text-3xl font-semibold tracking-tight text-[#242824]">₹0</div>
            <div className="text-xs sm:text-sm font-semibold text-[#242824] mt-1">
              {isTe ? 'పౌరులకు ఉచితం' : 'Completely Free for Citizens'}
            </div>
            <div className="text-[11px] text-[#686B66] mt-0.5">
              {isTe ? 'ఎటువంటి దళారులు లేకుండా సమాచారం' : 'Zero agent fees, direct guidance'}
            </div>
          </div>
          <div className="text-center pt-2 lg:pt-0">
            <div className="text-3xl font-semibold tracking-tight text-[#075B46]">Zero</div>
            <div className="text-xs sm:text-sm font-semibold text-[#242824] mt-1">
              {isTe ? 'రహస్య సమాచారం సేకరణ లేదు' : 'No Sensitive Biometrics'}
            </div>
            <div className="text-[11px] text-[#686B66] mt-0.5">
              {isTe ? 'ఆధార్ పాస్‌వర్డ్‌లు అడగము' : 'No OTP or bank passwords collected'}
            </div>
          </div>
        </div>
      </section>

      {/* Welfare Categories Grid: Calm, Restrained, Uniform System */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E5E5DF] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#242824] flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#075B46] rounded-full inline-block" />
              <span>{t('categoriesTitle')}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#686B66] mt-1">
              {t('categoriesSubtitle')}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('schemes')}
            className="text-xs sm:text-sm font-medium text-[#075B46] hover:underline flex items-center gap-1 cursor-pointer"
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
                className="bg-white hover:bg-[#FAF9F5] rounded-2xl p-5 border border-[#E5E5DF] hover:border-[#075B46] transition-all text-left flex flex-col justify-between group cursor-pointer shadow-xs hover:shadow-sm"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#EBF3F0] text-[#075B46] flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-base text-[#242824] group-hover:text-[#075B46] transition-colors">
                    {categoryTitle}
                  </h3>
                  {isTe && (
                    <div className="text-xs font-normal text-[#686B66] mb-2">
                      {cat.enTitle}
                    </div>
                  )}
                  <p className="text-xs text-[#686B66] line-clamp-2 leading-relaxed">
                    {categoryDesc}
                  </p>
                </div>
                <div className="pt-4 mt-3 border-t border-[#F8F7F2] flex items-center justify-between text-xs text-[#686B66]">
                  <span className="font-medium bg-[#F8F7F2] px-2 py-0.5 rounded-md text-[11px] text-[#242824]">{cat.count}</span>
                  <span className="text-[#075B46] font-medium group-hover:underline flex items-center gap-0.5">
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
        <div className="bg-[#FAF9F5] border border-[#E5E5DF] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-block bg-[#EBF3F0] text-[#075B46] text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md mb-2">
                {t('flagshipSchemes')}
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#242824]">
                {t('flagshipSubtitle')}
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('schemes')}
              className="bg-[#075B46] hover:bg-[#064B3A] text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              {isTe ? `మొత్తం పథకాల జాబితా (${VERIFIED_SCHEMES.length})` : `All Verified Schemes (${VERIFIED_SCHEMES.length})`}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E5DF] hover:border-[#075B46] transition-all flex flex-col justify-between shadow-xs hover:shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="bg-[#EBF3F0] text-[#075B46] text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {scheme.govLevel === 'state'
                        ? (isTe ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వం' : 'Govt of Andhra Pradesh')
                        : (isTe ? 'కేంద్ర ప్రభుత్వం' : 'Government of India')}
                    </span>
                    <span className="text-[11px] text-[#8E918C]">
                      Verified: {scheme.lastVerifiedAt}
                    </span>
                  </div>

                  <h3 className="font-semibold text-lg text-[#242824]">
                    {getSchemeTitle(scheme, currentLanguage)}
                  </h3>
                  <div className="text-xs text-[#686B66] font-normal line-clamp-1">
                    {getSchemeSubtitle(scheme, currentLanguage)}
                  </div>

                  {/* Restrained Key Benefit Box */}
                  <div className="bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl p-3 text-xs text-[#242824]">
                    <div className="font-semibold text-[#075B46] mb-0.5">
                      {isTe ? 'లభించే ప్రయోజనం:' : 'Key Benefit:'}
                    </div>
                    <div className="text-[#686B66] leading-relaxed">{getSchemeBenefit(scheme, currentLanguage)}</div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#F8F7F2] flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectScheme(scheme)}
                    className="text-xs font-medium text-[#242824] hover:text-[#075B46] hover:underline cursor-pointer"
                  >
                    {t('viewDetails')}
                  </button>
                  <button
                    onClick={() => onOpenEligibility(scheme)}
                    className="bg-[#075B46] hover:bg-[#064B3A] text-white font-medium text-xs px-3.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1"
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
        <div className="bg-[#075B46] text-white rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="bg-white/10 text-white border border-white/20 text-xs font-medium px-3 py-1 rounded-full inline-block">
              {isTe ? 'డిజిటల్ ప్రజా సేవలు' : 'Public Digital Services'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              {t('digitalCertificatesTitle')}
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              {t('digitalCertificatesSubtitle')}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigateTab('services')}
                className="bg-white hover:bg-[#F8F7F2] text-[#075B46] font-medium px-5 py-2.5 rounded-xl text-sm shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>{t('openServicesGuide')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigateTab('preparation')}
                className="bg-white/10 hover:bg-white/15 text-white font-medium px-5 py-2.5 rounded-xl text-sm border border-white/20 transition-colors cursor-pointer"
              >
                {t('prepareApplication')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Citizen Trust & Privacy Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E5E5DF] rounded-2xl p-6 text-[#242824] space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-[#075B46] font-semibold text-sm">
            <ShieldAlert className="w-5 h-5 text-[#075B46]" />
            <span>
              {isTe ? 'పౌరుల భద్రత & అధికారిక హామీ (Citizen Security Commitment)' : 'Citizen Security Commitment & Privacy Guarantee'}
            </span>
          </div>
          <p className="text-xs text-[#686B66] leading-relaxed">
            {t('trustNotice')}
          </p>
        </div>
      </section>
    </div>
  );
};
