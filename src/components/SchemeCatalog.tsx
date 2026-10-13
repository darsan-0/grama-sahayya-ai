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

  const filteredSchemes = useMemo(() => {
    return VERIFIED_SCHEMES.filter((scheme) => {
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
        const q = search.toLowerCase();
        const matchesName = scheme.officialName.toLowerCase().includes(q) || scheme.teName.toLowerCase().includes(q);
        const matchesSummary = scheme.summary.toLowerCase().includes(q) || scheme.teSummary.toLowerCase().includes(q);
        const matchesCategory = scheme.category.toLowerCase().includes(q);
        const matchesDept = scheme.department.toLowerCase().includes(q);
        if (!matchesName && !matchesSummary && !matchesCategory && !matchesDept) {
          return false;
        }
      }
      return true;
    });
  }, [search, selectedGovLevel, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 flex items-center space-x-2">
            <span>
              {isTe
                ? 'ప్రభుత్వ సంక్షేమ పథకాల జాబితా'
                : 'Government Welfare Scheme Directory'}
            </span>
            <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {filteredSchemes.length} {isTe ? 'ధృవీకరించబడింది' : 'Verified'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {isTe
              ? 'ఆంధ్రప్రదేశ్ మరియు కేంద్ర ప్రభుత్వ అధికారిక సంక్షేమ పథకాలు, అర్హత నిబంధనలు మరియు దరఖాస్తు లింకులు'
              : 'Discover verified Central and Andhra Pradesh welfare schemes with authentic eligibility rules, documents, and official portals.'}
          </p>
        </div>

        {/* Search input in catalog */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isTe ? 'పథకం పేరు, విద్యార్థి, రైతు, పింఛన్...' : 'Search by name, student, farmer, pension...'}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-2xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-3 text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {/* Gov Level buttons */}
        <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
          {[
            { id: 'all', label: isTe ? 'అన్నీ' : 'All Levels' },
            { id: 'state', label: isTe ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వం' : 'AP State Govt' },
            { id: 'central', label: isTe ? 'కేంద్ర ప్రభుత్వం' : 'Central Govt' },
          ].map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setSelectedGovLevel(lvl.id)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedGovLevel === lvl.id
                  ? 'bg-emerald-900 text-amber-300 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center space-x-1.5 ml-auto">
          <Filter className="w-4 h-4 text-stone-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-semibold bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-700 focus:outline-none cursor-pointer"
          >
            <option value="all">{isTe ? 'అన్ని విభాగాలు' : 'All Categories'}</option>
            <option value="education">{isTe ? 'విద్య & స్కాలర్‌షిప్‌లు' : 'Education & Scholarships'}</option>
            <option value="agriculture">{isTe ? 'రైతు సంక్షేమం & పంటలు' : 'Agriculture & Farmers'}</option>
            <option value="women_shg">{isTe ? 'మహిళలు & డ్వాక్రా' : 'Women & SHGs'}</option>
            <option value="pensions">{isTe ? 'వృద్ధాప్య & వితంతు పింఛన్లు' : 'Social Security Pensions'}</option>
            <option value="housing">{isTe ? 'గృహ నిర్మాణం & సోలార్' : 'Housing & Solar Energy'}</option>
            <option value="health">{isTe ? 'ఉచిత వైద్యం (ఆరోగ్యశ్రీ)' : 'Healthcare & Aarogyasri'}</option>
            <option value="msme_entrepreneurship">{isTe ? 'చిరు వ్యాపారాలు & ఉపాధి' : 'MSME & Entrepreneurship'}</option>
            <option value="employment">{isTe ? 'గ్రామీణ ఉపాధి హామీ' : 'Rural Employment (MGNREGS)'}</option>
          </select>
        </div>
      </div>

      {/* Schemes Grid */}
      {filteredSchemes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-800 text-lg">
            {isTe ? 'పథకాలు కనుగొనబడలేదు' : 'No matching schemes found'}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
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
            className="bg-emerald-900 text-amber-300 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
          >
            {isTe ? 'అన్ని ఫిల్టర్లు రీసెట్ చేయండి' : 'Reset All Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchemes.map((scheme) => {
            const isSaved = savedSchemeIds.includes(scheme.id);
            return (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl border border-stone-200 hover:border-emerald-600/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Scheme Header banner */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      scheme.govLevel === 'state'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        : 'bg-blue-100 text-blue-900 border border-blue-200'
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
                          ? 'bg-amber-100 border-amber-300 text-amber-700'
                          : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-stone-700'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save scheme to bookmarks'}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-stone-900 group-hover:text-emerald-900 transition-colors">
                      {getSchemeTitle(scheme, currentLanguage)}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium line-clamp-1 mt-0.5">
                      {getSchemeSubtitle(scheme, currentLanguage)}
                    </p>
                  </div>

                  {/* Benefit highlights pill */}
                  <div className="bg-amber-50/80 rounded-xl p-2.5 border border-amber-200/80 text-xs text-amber-950">
                    <div className="font-bold text-amber-900 mb-0.5 flex items-center space-x-1">
                      <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isTe ? 'లభించే ప్రయోజనం:' : 'Key Benefit:'}</span>
                    </div>
                    <div className="line-clamp-2">
                      {getSchemeBenefit(scheme, currentLanguage)}
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-stone-600 line-clamp-2">
                    {getSchemeSummary(scheme, currentLanguage)}
                  </p>

                  {/* Department & Verification stamp */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                    <span className="truncate max-w-[180px]">{scheme.department}</span>
                    <span className="text-emerald-700 font-semibold flex items-center space-x-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="bg-stone-50/80 px-5 py-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onSelectScheme(scheme)}
                      className="text-xs font-bold text-stone-700 hover:text-emerald-900 underline cursor-pointer"
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
                              ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {isPlayingThis ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })()}
                  </div>

                  <button
                    onClick={() => onOpenEligibility(scheme)}
                    className="bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold text-xs px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center space-x-1"
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
