import React, { useState } from 'react';
import {
  Search,
  ExternalLink,
  ShieldCheck,
  Clock,
  IndianRupee,
  PhoneCall,
  CheckCircle2,
  Building,
  Volume2,
  Square,
  Landmark,
  FileCheck,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Calendar,
  X
} from 'lucide-react';
import { VERIFIED_PUBLIC_SERVICES } from '../data/publicServices';
import { PublicService, PublicServiceCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  getServiceTitle,
  getServicePurpose,
  getServiceDocs,
  getServiceSteps,
  getServiceTracking,
  getServiceDepartment
} from '../i18n/languages';

export const PublicServicesDirectory: React.FC = () => {
  const { currentLanguage, t, speak, stopSpeaking, isSpeaking } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<PublicService | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [govLevelFilter, setGovLevelFilter] = useState<'all' | 'state' | 'central'>('all');

  const isTe = currentLanguage === 'te';

  const categories: { id: string; label: string; teLabel: string }[] = [
    { id: 'all', label: 'All Services', teLabel: 'అన్ని సేవలు' },
    { id: 'certificates', label: 'Certificates (Caste & Income)', teLabel: 'ధ్రువీకరణ పత్రాలు (కుల & ఆదాయం)' },
    { id: 'identity', label: 'Identity (Aadhaar & PAN)', teLabel: 'గుర్తింపు కార్డులు (ఆధార్ & పాన్)' },
    { id: 'welfare_cards', label: 'Welfare Cards (Rice Card)', teLabel: 'సంక్షేమ కార్డులు (రైస్ కార్డు)' },
    { id: 'land_records', label: 'Land Records (Meebhoomi)', teLabel: 'భూ రికార్డులు (మీభూమి)' },
    { id: 'agriculture', label: 'Agriculture (PM-KISAN)', teLabel: 'వ్యవసాయం (పీఎం కిసాన్)' },
    { id: 'transport', label: 'Transport & Driving Licence', teLabel: 'రవాణా & డ్రైవింగ్ లైసెన్స్' },
    { id: 'healthcare', label: 'Healthcare (ABHA Health ID)', teLabel: 'వైద్యం & ఆరోగ్యం (ఆభా)' },
    { id: 'education', label: 'Education (Scholarships)', teLabel: 'విద్య & ఉపకార వేతనాలు' },
    { id: 'utilities', label: 'Utilities (Electricity)', teLabel: 'విద్యుత్ & నిత్యావసరాలు' },
    { id: 'grievances', label: 'Grievances (Spandana 1902)', teLabel: 'ప్రజా సమస్యలు (స్పందన 1902)' },
    { id: 'business', label: 'Business & MSME (Udyam)', teLabel: 'వ్యాపారం & ఎంఎస్ఎంఈ' },
  ];

  const filteredServices = VERIFIED_PUBLIC_SERVICES.filter((svc) => {
    // Category filter
    if (activeCategory !== 'all') {
      if (activeCategory === 'certificates' && svc.category !== 'certificates' && svc.category !== 'revenue_certificates') {
        return false;
      }
      if (activeCategory === 'identity' && svc.category !== 'identity' && svc.category !== 'electoral') {
        return false;
      }
      if (activeCategory !== 'certificates' && activeCategory !== 'identity' && svc.category !== activeCategory) {
        return false;
      }
    }

    // GovLevel filter
    if (govLevelFilter !== 'all' && svc.govLevel !== govLevelFilter) {
      return false;
    }

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        svc.name.toLowerCase().includes(q) ||
        svc.teName.toLowerCase().includes(q) ||
        svc.department.toLowerCase().includes(q) ||
        (svc.teDepartment && svc.teDepartment.toLowerCase().includes(q)) ||
        svc.purpose.toLowerCase().includes(q) ||
        svc.tePurpose.toLowerCase().includes(q) ||
        svc.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Directory Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E5DF] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 bg-[#EBF3F0] text-[#075B46] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#C8DDD6]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#075B46]" />
              <span>{isTe ? '100% అధికారిక ధ్రువీకరణ' : 'Official Government Portals'}</span>
            </span>
            <span className="text-xs text-[#8E918C]">
              {isTe ? 'నవీకరణ: అక్టోబర్ 2026' : 'Audited: Oct 2026'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#242824] flex items-center gap-2.5">
            <span>
              {isTe
                ? 'ప్రజా డిజిటల్ సేవల మార్గదర్శిని'
                : 'Public Digital Services & Government Directory'}
            </span>
            <span className="bg-[#FAF9F5] text-[#242824] border border-[#E5E5DF] text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {filteredServices.length} / {VERIFIED_PUBLIC_SERVICES.length}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#686B66] mt-1 font-normal max-w-2xl">
            {isTe
              ? 'ఆధార్, పాన్ కార్డు, రైస్ కార్డు, కుల & ఆదాయ సర్టిఫికెట్లు, మీభూమి, ఓటర్ ఐడీ, పీఎం కిసాన్, విద్యుత్ సేవల అధికారిక పోర్టల్స్ మరియు ఫీజు వివరాలు'
              : 'Authentic statutory fees, required documents, and official application portals for Andhra Pradesh and Central Government digital services.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-[#8E918C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isTe ? 'సేవ పేరు, శాఖ, లేదా కీలకపదం (ఆధార్, పాన్, కులం...)' : 'Search services, department, or keywords (Aadhaar, PAN, Caste...)'}
            className="w-full h-11 pl-10 pr-9 rounded-xl border border-[#E5E5DF] bg-white text-xs sm:text-sm text-[#242824] focus:outline-none focus:border-[#075B46] focus:ring-1 focus:ring-[#075B46] shadow-2xs placeholder-[#8E918C]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E918C] hover:text-[#242824] p-1"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Control Bar: Gov Level Filter & Category Navigation */}
      <div className="space-y-4">
        {/* Gov Level Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 p-1 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl">
            <button
              onClick={() => setGovLevelFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                govLevelFilter === 'all'
                  ? 'bg-white text-[#075B46] shadow-xs font-semibold'
                  : 'text-[#686B66] hover:text-[#242824]'
              }`}
            >
              {isTe ? 'అన్ని ప్రభుత్వాలు' : 'All Governments'}
            </button>
            <button
              onClick={() => setGovLevelFilter('state')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                govLevelFilter === 'state'
                  ? 'bg-white text-[#075B46] shadow-xs font-semibold'
                  : 'text-[#686B66] hover:text-[#242824]'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>{isTe ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వం' : 'Andhra Pradesh (State)'}</span>
            </button>
            <button
              onClick={() => setGovLevelFilter('central')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                govLevelFilter === 'central'
                  ? 'bg-white text-[#075B46] shadow-xs font-semibold'
                  : 'text-[#686B66] hover:text-[#242824]'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>{isTe ? 'కేంద్ర ప్రభుత్వం' : 'Central Government'}</span>
            </button>
          </div>

          <div className="text-xs text-[#8E918C]">
            {isTe
              ? `${filteredServices.length} సేవలు అందుబాటులో ఉన్నాయి`
              : `Showing ${filteredServices.length} verified public services`}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 text-xs font-medium">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#075B46] text-white border-[#075B46] font-semibold shadow-xs'
                  : 'bg-white text-[#686B66] border-[#E5E5DF] hover:text-[#242824] hover:bg-[#F8F7F2]'
              }`}
            >
              {isTe ? cat.teLabel : cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E5DF] p-12 text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-[#8E918C] mx-auto" />
          <h3 className="text-base font-semibold text-[#242824]">
            {isTe ? 'ఎటువంటి సేవలు కనుగొనబడలేదు' : 'No public services matched your search'}
          </h3>
          <p className="text-xs text-[#686B66] max-w-md mx-auto">
            {isTe
              ? 'శోధన పదాన్ని మార్చి చూడండి లేదా అన్ని సేవల కేటగిరీని ఎంచుకోండి.'
              : 'Try searching with different keywords or reset the category filters above.'}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setActiveCategory('all');
              setGovLevelFilter('all');
            }}
            className="px-4 py-2 bg-[#EBF3F0] text-[#075B46] font-medium text-xs rounded-xl hover:bg-[#DCEEE8] transition cursor-pointer"
          >
            {isTe ? 'అన్ని ఫిల్టర్లను తొలగించండి' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((service) => {
            const isAP = service.govLevel === 'state';
            const cleanAppUrl = service.officialApplicationUrl.split(' ')[0];
            const cleanInfoUrl = service.officialInfoUrl.split(' ')[0];

            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-[#E5E5DF] hover:border-[#075B46] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between p-5 space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Card Header badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold bg-[#F8F7F2] text-[#4F524D] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#E5E5DF]">
                      {isAP ? (isTe ? 'ఆంధ్రప్రదేశ్' : 'AP Govt') : (isTe ? 'కేంద్రం' : 'Central')}
                    </span>
                    <span className="text-[11px] text-[#075B46] font-medium flex items-center gap-1 bg-[#EBF3F0] px-2 py-0.5 rounded-full border border-[#C8DDD6]">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>{service.status === 'VERIFIED' ? (isTe ? 'ధ్రువీకరించబడింది' : 'Verified') : service.status}</span>
                    </span>
                  </div>

                  {/* Title & Department */}
                  <div>
                    <h3 className="font-semibold text-base text-[#242824] group-hover:text-[#075B46] transition-colors leading-snug">
                      {getServiceTitle(service, currentLanguage)}
                    </h3>
                    {isTe && (
                      <div className="text-[11px] text-[#8E918C] font-normal truncate mt-0.5">
                        {service.name}
                      </div>
                    )}
                    <div className="text-[11px] text-[#075B46] font-medium flex items-center gap-1 mt-1 truncate">
                      <Building className="w-3 h-3 shrink-0" />
                      <span className="truncate">{getServiceDepartment(service, currentLanguage)}</span>
                    </div>
                  </div>

                  {/* Purpose */}
                  <p className="text-xs text-[#686B66] line-clamp-2 leading-relaxed">
                    {getServicePurpose(service, currentLanguage)}
                  </p>

                  {/* Fee and processing time box */}
                  <div className="bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[#242824]">
                      <span className="text-[#686B66] flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5 text-[#075B46] shrink-0" />
                        <span>{isTe ? 'ప్రభుత్వ ఫీజు:' : 'Statutory Fee:'}</span>
                      </span>
                      <span className="font-semibold text-[#075B46] truncate max-w-[140px] text-right" title={service.officialFee}>
                        {service.officialFee.split(';')[0]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#242824]">
                      <span className="text-[#686B66] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#8E918C] shrink-0" />
                        <span>{isTe ? 'సమయం:' : 'Timeline:'}</span>
                      </span>
                      <span className="font-medium text-[#242824]">{service.processingTime}</span>
                    </div>
                  </div>

                  {/* Verification source tag */}
                  <div className="flex items-center justify-between text-[10px] text-[#8E918C] pt-1">
                    <span className="flex items-center gap-1 truncate max-w-[190px]" title={service.verificationSource}>
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span>{service.lastVerifiedDate}</span>
                    </span>
                    <span className="truncate max-w-[110px]" title={service.verificationSource}>
                      {service.verificationSource.split('/')[0]}
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-[#F8F7F2] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="text-xs font-semibold text-[#242824] hover:text-[#075B46] flex items-center gap-1 cursor-pointer py-1"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#075B46]" />
                    <span>{isTe ? 'పూర్తి గైడ్' : 'View Guide'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={cleanAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#075B46] hover:bg-[#064B3A] text-white font-medium text-xs px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                      title={cleanAppUrl}
                    >
                      <span>{isTe ? 'దరఖాస్తు' : 'Apply Online'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-xl border border-[#E5E5DF] relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => {
                if (isSpeaking) stopSpeaking();
                setSelectedService(null);
              }}
              className="absolute top-5 right-5 p-1.5 text-[#8E918C] hover:text-[#242824] rounded-full hover:bg-[#F8F7F2] cursor-pointer transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Title Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pr-8">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-semibold bg-[#EBF3F0] text-[#075B46] px-3 py-0.5 rounded-full border border-[#C8DDD6] inline-block">
                    {selectedService.govLevel === 'state' ? (isTe ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వం' : 'AP State Service') : (isTe ? 'కేంద్ర ప్రభుత్వం' : 'Central Govt Service')}
                  </span>
                  <span className="text-xs text-[#075B46] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{isTe ? 'ధ్రువీకరించబడిన అధికారిక సమాచారం' : 'Verified Official Guidance'}</span>
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#242824]">
                  {getServiceTitle(selectedService, currentLanguage)}
                </h2>
                {isTe && (
                  <div className="text-xs text-[#686B66] font-normal mt-0.5">
                    {selectedService.name}
                  </div>
                )}
                <div className="text-xs text-[#686B66] font-medium mt-1">
                  <strong>{isTe ? 'శాఖ:' : 'Department:'}</strong> {getServiceDepartment(selectedService, currentLanguage)}
                </div>
              </div>

              {/* Voice Readout Button */}
              <button
                type="button"
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  } else {
                    const speechText = `${getServiceTitle(selectedService, currentLanguage)}. ${getServicePurpose(selectedService, currentLanguage)}. ${isTe ? 'ప్రభుత్వ ఫీజు:' : 'Statutory Fee:'} ${selectedService.officialFee}. ${isTe ? 'సమయం:' : 'Processing timeline:'} ${selectedService.processingTime}.`;
                    speak(speechText);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs shadow-xs transition-colors cursor-pointer ${
                  isSpeaking ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FCA5A5]' : 'bg-[#EBF3F0] hover:bg-[#DCEEE8] text-[#075B46] border border-[#C8DDD6]'
                }`}
                title="Listen to service details"
              >
                {isSpeaking ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5 text-[#075B46]" />}
                <span>{isSpeaking ? (isTe ? 'ఆపండి' : 'Stop') : (isTe ? 'వాయిస్ వివరణ' : 'Voice Output')}</span>
              </button>
            </div>

            {/* Purpose & Official Costs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAF9F5] p-4 rounded-2xl border border-[#E5E5DF] text-xs">
              <div>
                <span className="font-semibold text-[#686B66] block mb-0.5">
                  {isTe ? 'అధికారిక ఫీజు (Official Fees):' : 'Official Statutory Fees:'}
                </span>
                <span className="text-[#075B46] font-semibold">{selectedService.officialFee}</span>
              </div>
              <div>
                <span className="font-semibold text-[#686B66] block mb-0.5">
                  {isTe ? 'పరిష్కార గడువు (Processing Timeline):' : 'Processing Timeline:'}
                </span>
                <span className="text-[#242824] font-medium">{selectedService.processingTime}</span>
              </div>
            </div>

            {/* Eligibility */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#686B66]">
                {isTe ? 'ఎవరు దరఖాస్తు చేసుకోవచ్చు (Eligibility):' : 'Eligibility & Criteria:'}
              </h3>
              <p className="text-xs sm:text-sm text-[#242824] bg-white p-3.5 rounded-xl border border-[#E5E5DF] leading-relaxed">
                {isTe && selectedService.teEligibility ? selectedService.teEligibility : selectedService.eligibility}
              </p>
            </div>

            {/* Documents */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#686B66]">
                {isTe ? 'కావలసిన పత్రాలు (Required Documents):' : 'Required Documents Checklist:'}
              </h3>
              <div className="space-y-1.5 text-xs text-[#242824]">
                {getServiceDocs(selectedService, currentLanguage).map((doc, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-[#FAF9F5] p-2.5 rounded-lg border border-[#E5E5DF]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#075B46] mt-0.5 shrink-0" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#686B66]">
                {isTe ? 'దరఖాస్తు విధానం (Step-by-Step Instructions):' : 'Step-by-Step Application Process:'}
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-[#242824]">
                {getServiceSteps(selectedService, currentLanguage).map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-[#FAF9F5] p-3 rounded-xl border border-[#E5E5DF]">
                    <span className="w-5 h-5 rounded-full bg-[#075B46] text-white font-medium text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Tracking Instructions */}
            <div className="bg-[#EBF3F0] rounded-2xl p-4 border border-[#C8DDD6] text-xs space-y-1">
              <span className="font-semibold text-[#075B46] block">
                {isTe ? 'స్థితిని ఎలా ట్రాక్ చేయాలి (Status Tracking):' : 'How to Track Application Status:'}
              </span>
              <p className="text-[#242824] leading-relaxed">{getServiceTracking(selectedService, currentLanguage)}</p>
            </div>

            {/* Audit & Verification Metadata */}
            <div className="bg-[#FAF9F5] rounded-xl p-3 border border-[#E5E5DF] text-[11px] text-[#686B66] space-y-1">
              <div>
                <strong>{isTe ? 'ధ్రువీకరణ మూలం:' : 'Official Verification Source:'}</strong> {selectedService.verificationSource}
              </div>
              <div>
                <strong>{isTe ? 'చివరి పరిశీలన తేదీ:' : 'Last Verified Date:'}</strong> {selectedService.lastVerifiedDate}
              </div>
            </div>

            {/* Helpline and Action Links */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E5E5DF]">
              {selectedService.supportHelpline && (
                <div className="text-xs text-[#686B66] flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-[#075B46]" />
                  <span>{isTe ? 'సహాయవాణి:' : 'Helpline:'} <strong className="text-[#242824]">{selectedService.supportHelpline}</strong></span>
                </div>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <a
                  href={selectedService.officialInfoUrl.split(' ')[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-[#F8F7F2] text-[#242824] border border-[#E5E5DF] font-medium px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                  title="Official Information Portal"
                >
                  <span>{isTe ? 'అధికారిక సమాచారం' : 'Portal Info'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#8E918C]" />
                </a>

                <a
                  href={selectedService.officialApplicationUrl.split(' ')[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#075B46] hover:bg-[#064B3A] text-white font-medium px-4 py-2 rounded-xl text-xs sm:text-sm shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>{isTe ? 'పోర్టల్ తెరవండి' : 'Open Application Portal'}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
