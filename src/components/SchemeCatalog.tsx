import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Calendar,
  IndianRupee,
  Building,
  GraduationCap,
  Tractor,
  Home,
  Users,
  ExternalLink,
  Volume2,
  Square
} from 'lucide-react';
import { Scheme, SchemeCategory, GovLevel } from '../types';
import { VERIFIED_SCHEMES } from '../data/schemes';
import {
  filterPublicSchemes,
  isYsrBrandedScheme,
  containsYsrBranding,
  normalizeSchemeText
} from '../utils/schemeNormalization';
import { useLanguage } from '../context/LanguageContext';
import {
  getSchemeTitle,
  getSchemeSubtitle,
  getSchemeBenefit,
  getSchemeSummary
} from '../i18n/languages';

import { useAuth } from '../context/AuthContext';
import { trackEngagementEvent } from '../utils/analyticsTracker';

interface SchemeCatalogProps {
  onSelectScheme: (scheme: Scheme) => void;
  onOpenEligibility: (scheme: Scheme) => void;
  initialQuery?: string;
  savedSchemeIds: string[];
  onToggleSaveScheme: (scheme: Scheme) => void;
}

export const SchemeCatalog: React.FC<SchemeCatalogProps> = ({
  onSelectScheme,
  onOpenEligibility,
  initialQuery = '',
  savedSchemeIds,
  onToggleSaveScheme
}) => {
  const { currentLanguage, t, speak, isSpeaking, stopSpeaking } = useLanguage();
  const { currentUser } = useAuth();
  const [search, setSearch] = useState(initialQuery);
  const [selectedGovLevel, setSelectedGovLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentlyPlayingSchemeId, setCurrentlyPlayingSchemeId] = useState<string | null>(null);

  useEffect(() => {
    if (search.trim().length >= 3) {
      const timer = setTimeout(() => {
        trackEngagementEvent('scheme_searched', {
          userId: currentUser?.uid,
          searchQuery: search.trim(),
          language: currentLanguage
        });
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [search, currentUser?.uid, currentLanguage]);

  const isTe = currentLanguage === 'te';

  const isYsrSearch = useMemo(() => containsYsrBranding(search), [search]);

  const filteredSchemes = useMemo(() => {
    // Strictly filter out any YSR-branded or unverified entries
    const publicCatalog = filterPublicSchemes(VERIFIED_SCHEMES);

    // If query contains explicit YSR branding, public results must be empty
    if (isYsrSearch) {
      return [];
    }

    return publicCatalog.filter((scheme) => {
      // Gov level filter
      if (selectedGovLevel !== 'all' && scheme.govLevel !== selectedGovLevel) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && scheme.category !== selectedCategory) {
        return false;
      }
      // Text search
      if (search.trim()) {
        const q = normalizeSchemeText(search);
        const nameNorm = normalizeSchemeText(scheme.officialName);
        const teNameNorm = normalizeSchemeText(scheme.teName);
        const sumNorm = normalizeSchemeText(scheme.summary);
        const teSumNorm = normalizeSchemeText(scheme.teSummary);
        const catNorm = normalizeSchemeText(scheme.category);
        const deptNorm = normalizeSchemeText(scheme.department);

        const matches =
          nameNorm.includes(q) ||
          teNameNorm.includes(q) ||
          sumNorm.includes(q) ||
          teSumNorm.includes(q) ||
          catNorm.includes(q) ||
          deptNorm.includes(q);

        if (!matches) {
          return false;
        }
      }
      return true;
    });
  }, [search, selectedGovLevel, selectedCategory, isYsrSearch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E5DF] pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#242824] flex items-center gap-2.5">
            <span>
              {isTe
                ? 'ప్రభుత్వ సంక్షేమ పథకాల జాబితా'
                : 'Government Welfare Scheme Directory'}
            </span>
            <span className="bg-[#EBF3F0] text-[#075B46] text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {filteredSchemes.length} {isTe ? 'ధృవీకరించబడింది' : 'Verified'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#686B66] mt-1 font-normal">
            {isTe
              ? 'ఆంధ్రప్రదేశ్ మరియు కేంద్ర ప్రభుత్వ అధికారిక సంక్షేమ పథకాలు, అర్హత నిబంధనలు మరియు దరఖాస్తు లింకులు'
              : 'Discover verified Central and Andhra Pradesh welfare schemes with authentic eligibility rules, documents, and official portals.'}
          </p>
        </div>

        {/* Search input in catalog */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-[#8E918C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isTe ? 'పథకం పేరు, విద్యార్థి, రైతు, పింఛన్...' : 'Search by name, student, farmer, pension...'}
            className="w-full h-10 pl-9 pr-14 rounded-xl border border-[#E5E5DF] bg-white text-xs sm:text-sm text-[#242824] focus:outline-none focus:border-[#075B46] focus:ring-1 focus:ring-[#075B46] shadow-2xs placeholder-[#8E918C]"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 h-6 px-1.5 inline-flex items-center justify-center text-xs text-[#8E918C] hover:text-[#242824] cursor-pointer rounded"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        {/* Gov Level buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-1 bg-[#F8F7F2] p-1 rounded-xl text-xs font-medium border border-[#E5E5DF]">
          {[
            { id: 'all', label: isTe ? 'అన్నీ' : 'All Levels' },
            { id: 'state', label: isTe ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వం' : 'AP State Govt' },
            { id: 'central', label: isTe ? 'కేంద్ర ప్రభుత్వం' : 'Central Govt' },
          ].map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setSelectedGovLevel(lvl.id)}
              className={`h-7.5 px-3 rounded-lg transition-all cursor-pointer inline-flex items-center justify-center shrink-0 whitespace-nowrap leading-none ${
                selectedGovLevel === lvl.id
                  ? 'bg-white text-[#075B46] font-semibold shadow-xs'
                  : 'text-[#686B66] hover:text-[#242824]'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Filter className="w-3.5 h-3.5 text-[#686B66] shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-8.5 text-xs font-medium bg-white border border-[#E5E5DF] rounded-xl px-2.5 text-[#242824] focus:outline-none focus:border-[#075B46] cursor-pointer shadow-2xs"
          >
            <option value="all">{isTe ? 'అన్ని విభాగాలు' : 'All Categories'}</option>
            <option value="education">{isTe ? 'విద్య & స్కాలర్‌షిప్‌లు' : 'Education & Scholarships'}</option>
            <option value="agriculture">{isTe ? 'రైతు సంక్షేమం & పంటలు' : 'Agriculture & Farmers'}</option>
            <option value="women_shg">{isTe ? 'మహిళలు & డ్వాక్రా' : 'Women & SHGs'}</option>
            <option value="pensions">{isTe ? 'వృద్ధాప్య & వితంతు పింఛన్లు' : 'Social Security Pensions'}</option>
            <option value="housing">{isTe ? 'గృహ నిర్మాణం & సోలార్' : 'Housing & Solar Energy'}</option>
            <option value="health">{isTe ? 'ఉచిత వైద్యం (NTR వైద్య సేవ)' : 'Healthcare & NTR Vaidya Seva'}</option>
            <option value="msme_entrepreneurship">{isTe ? 'చిరు వ్యాపారాలు & ఉపాధి' : 'MSME & Entrepreneurship'}</option>
            <option value="employment">{isTe ? 'గ్రామీణ ఉపాధి హామీ & యువగళం' : 'Rural Employment & Youth Skilling'}</option>
          </select>
        </div>
      </div>

      {/* Schemes Grid */}
      {filteredSchemes.length === 0 ? (
        isYsrSearch ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#E5E5DF] p-8 space-y-4 max-w-2xl mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#EBF3F0] text-[#075B46] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-[#242824] text-base">
              {isTe ? 'వైఎస్సార్ పథకాలు పబ్లిక్ కేటలాగ్ నుండి తొలగించబడ్డాయి' : 'YSR-Branded Schemes Excluded from Public Directory'}
            </h3>
            <p className="text-xs text-[#686B66] leading-relaxed">
              {isTe
                ? 'గమనిక: వైఎస్సార్ బ్రాండెడ్ పథకాలు ప్రజా కేటలాగ్ నుండి తొలగించబడ్డాయి మరియు ఆర్కైవ్ చేయబడ్డాయి. దయచేసి ప్రస్తుత ఆంధ్రప్రదేశ్ ప్రభుత్వ అధికారిక పథకాలైన అన్నదాత సుఖీభవ, ఎన్టీఆర్ భరోసా పింఛన్లు, డా. ఎన్టీఆర్ వైద్య సేవ, తల్లికి వందనం, ఆడబిడ్డ నిధి, మరియు స్త్రీ శక్తి పథకాలను పరిశీలించండి.'
                : 'Notice: YSR-branded schemes have been excluded from the public directory and safely archived. Please explore currently verified Andhra Pradesh initiatives including Annadata Sukhibhava, NTR Bharosa Pension, Dr. NTR Vaidya Seva, Talliki Vandanam, Aadabidda Nidhi, and Sthree Shakthi.'}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setSearch('అన్నదాత సుఖీభవ')}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#F8F7F2] hover:bg-[#EBF3F0] text-[#075B46] font-medium border border-[#E5E5DF] cursor-pointer"
              >
                {isTe ? 'అన్నదాత సుఖీభవ' : 'Annadata Sukhibhava'}
              </button>
              <button
                onClick={() => setSearch('NTR Bharosa')}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#F8F7F2] hover:bg-[#EBF3F0] text-[#075B46] font-medium border border-[#E5E5DF] cursor-pointer"
              >
                {isTe ? 'ఎన్టీఆర్ భరోసా' : 'NTR Bharosa'}
              </button>
              <button
                onClick={() => setSearch('NTR Vaidya Seva')}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#F8F7F2] hover:bg-[#EBF3F0] text-[#075B46] font-medium border border-[#E5E5DF] cursor-pointer"
              >
                {isTe ? 'ఎన్టీఆర్ వైద్య సేవ' : 'NTR Vaidya Seva'}
              </button>
              <button
                onClick={() => setSearch('Talliki Vandanam')}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#F8F7F2] hover:bg-[#EBF3F0] text-[#075B46] font-medium border border-[#E5E5DF] cursor-pointer"
              >
                {isTe ? 'తల్లికి వందనం' : 'Talliki Vandanam'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E5DF] p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF9F5] flex items-center justify-center mx-auto text-[#8E918C]">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-[#242824] text-base">
              {isTe ? 'పథకాలు కనుగొనబడలేదు' : 'No matching schemes found'}
            </h3>
            <p className="text-xs text-[#686B66] max-w-sm mx-auto">
              {isTe
                ? 'శోధన పదాన్ని మార్చి లేదా ఫిల్టర్లను రీసెట్ చేసి ప్రయత్నించండి.'
                : 'Try adjusting your search keyword or resetting the government level and category filters.'}
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedGovLevel('all');
                setSelectedCategory('all');
              }}
              className="bg-[#075B46] hover:bg-[#064B3A] text-white font-medium px-4 py-2 rounded-xl text-xs cursor-pointer transition-colors shadow-xs"
            >
              {isTe ? 'అన్ని ఫిల్టర్లు రీసెట్ చేయండి' : 'Reset All Filters'}
            </button>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchemes.map((scheme) => {
            const isSaved = savedSchemeIds.includes(scheme.id);
            return (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl border border-[#E5E5DF] hover:border-[#075B46] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Scheme Header banner */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                      scheme.govLevel === 'state'
                        ? 'bg-[#EBF3F0] text-[#075B46]'
                        : 'bg-[#F8F7F2] text-[#242824] border border-[#E5E5DF]'
                    }`}>
                      {scheme.govLevel === 'state'
                        ? (isTe ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వం' : 'Govt of Andhra Pradesh')
                        : (isTe ? 'కేంద్ర ప్రభుత్వం' : 'Government of India')}
                    </span>

                    <button
                      onClick={() => {
                        if (!isSaved) {
                          trackEngagementEvent('scheme_saved', {
                            userId: currentUser?.uid,
                            schemeId: scheme.id,
                            category: scheme.category
                          });
                        }
                        onToggleSaveScheme(scheme);
                      }}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isSaved
                          ? 'bg-[#FAF4E6] border-[#E6B84A] text-[#242824]'
                          : 'bg-white border-[#E5E5DF] text-[#8E918C] hover:text-[#242824]'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save scheme to bookmarks'}
                      aria-label={isSaved ? 'Saved' : 'Save'}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4 text-[#075B46]" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base text-[#242824] group-hover:text-[#075B46] transition-colors">
                      {getSchemeTitle(scheme, currentLanguage)}
                    </h3>
                    <p className="text-xs text-[#686B66] font-normal line-clamp-1 mt-0.5">
                      {getSchemeSubtitle(scheme, currentLanguage)}
                    </p>
                  </div>

                  {/* Restrained Key Benefit Box */}
                  <div className="bg-[#FAF9F5] rounded-xl p-3 border border-[#E5E5DF] text-xs text-[#242824]">
                    <div className="font-semibold text-[#075B46] mb-0.5 flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5 text-[#075B46]" />
                      <span>{isTe ? 'లభించే ప్రయోజనం:' : 'Key Benefit:'}</span>
                    </div>
                    <div className="line-clamp-2 text-[#686B66] leading-relaxed">
                      {getSchemeBenefit(scheme, currentLanguage)}
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-[#686B66] line-clamp-2 leading-relaxed">
                    {getSchemeSummary(scheme, currentLanguage)}
                  </p>

                  {/* Department & Verification stamp */}
                  <div className="pt-2 border-t border-[#F8F7F2] flex items-center justify-between text-[11px] text-[#8E918C]">
                    <span className="truncate max-w-[180px]">{scheme.department}</span>
                    <span className="text-[#075B46] font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="bg-[#FAF9F5] px-5 py-3 border-t border-[#E5E5DF] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectScheme(scheme)}
                      className="text-xs font-medium text-[#242824] hover:text-[#075B46] hover:underline cursor-pointer"
                    >
                      {t('viewDetails')}
                    </button>
                    {(() => {
                      const isPlayingThis = isSpeaking && currentlyPlayingSchemeId === scheme.id;
                      return (
                        <button
                          type="button"
                          onClick={() => {
                            if (isPlayingThis) {
                              stopSpeaking();
                              setCurrentlyPlayingSchemeId(null);
                            } else {
                              const speechText = `${getSchemeTitle(scheme, currentLanguage)}. ${getSchemeBenefit(scheme, currentLanguage)}.`;
                              setCurrentlyPlayingSchemeId(scheme.id);
                              speak(speechText, currentLanguage, () => {
                                setCurrentlyPlayingSchemeId(null);
                              });
                            }
                          }}
                          title={isPlayingThis ? (isTe ? 'ఆపండి' : 'Stop') : (isTe ? 'పథకం వివరాలు వినండి (Voice Output)' : 'Listen to scheme details (Voice Output)')}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            isPlayingThis
                              ? 'bg-[#FEF2F2] text-[#991B1B] border-[#FCA5A5]'
                              : 'bg-white text-[#686B66] border-[#E5E5DF] hover:text-[#075B46] hover:border-[#C8DDD6]'
                          }`}
                        >
                          {isPlayingThis ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })()}
                  </div>

                  <button
                    onClick={() => onOpenEligibility(scheme)}
                    className="bg-[#075B46] hover:bg-[#064B3A] text-white font-medium text-xs px-3.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>{t('checkEligibility')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
