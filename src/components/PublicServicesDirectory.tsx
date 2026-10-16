import React, { useState } from 'react';
import {
  FileText,
  Search,
  ExternalLink,
  ShieldCheck,
  Clock,
  IndianRupee,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Info,
  Building,
  Volume2,
  Square
} from 'lucide-react';
import { VERIFIED_PUBLIC_SERVICES } from '../data/publicServices';
import { PublicService } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  getServiceTitle,
  getServicePurpose,
  getServiceDocs,
  getServiceSteps,
  getServiceTracking
} from '../i18n/languages';

export const PublicServicesDirectory: React.FC = () => {
  const { currentLanguage, t, speak, stopSpeaking, isSpeaking } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<PublicService | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const isTe = currentLanguage === 'te';

  const filteredServices = VERIFIED_PUBLIC_SERVICES.filter((svc) => {
    if (activeCategory !== 'all' && svc.category !== activeCategory) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        svc.name.toLowerCase().includes(q) ||
        svc.teName.toLowerCase().includes(q) ||
        svc.purpose.toLowerCase().includes(q) ||
        svc.tePurpose.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Directory Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E5DF] pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#242824] flex items-center gap-2.5">
            <span>
              {isTe
                ? 'ప్రజా డిజిటల్ సేవల మార్గదర్శిని'
                : 'Public Digital Services & Certificates Directory'}
            </span>
            <span className="bg-[#EBF3F0] text-[#075B46] text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {VERIFIED_PUBLIC_SERVICES.length} {isTe ? 'అధికారిక సేవలు' : 'Official Services'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#686B66] mt-1 font-normal">
            {isTe
              ? 'ఆధార్, పాన్ కార్డు, రేషన్ కార్డు, కుల & ఆదాయ సర్టిఫికెట్లు, ఓటర్ ఐడీ, డ్రైవింగ్ లైసెన్స్, మీభూమి రికార్డుల పూర్తి అధికారిక వివరాలు'
              : 'Official government guidance for Aadhaar, PAN, Rice cards, Caste/Income certificates, Voter ID, Driving Licence, and Meebhoomi land records.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-[#8E918C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isTe ? 'సర్టిఫికెట్లు, ఆధార్, పాన్ కార్డు...' : 'Search certificates, Aadhaar, PAN, Voter ID...'}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#E5E5DF] bg-white text-xs sm:text-sm text-[#242824] focus:outline-none focus:border-[#075B46] focus:ring-1 focus:ring-[#075B46] shadow-2xs placeholder-[#8E918C]"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 text-xs font-medium">
        {[
          { id: 'all', label: isTe ? 'అన్ని సేవలు' : 'All Services' },
          { id: 'identity', label: isTe ? 'గుర్తింపు కార్డులు (ఆధార్ & పాన్)' : 'Identity (Aadhaar & PAN)' },
          { id: 'revenue_certificates', label: isTe ? 'రెవెన్యూ సర్టిఫికెట్లు' : 'Revenue Certificates' },
          { id: 'welfare_cards', label: isTe ? 'సంక్షేమ కార్డులు (రైస్ కార్డు)' : 'Welfare Cards (Rice Card)' },
          { id: 'electoral', label: isTe ? 'ఓటర్ గుర్తింపు' : 'Electoral Services (Voter ID)' },
          { id: 'transport', label: isTe ? 'రవాణా & డ్రైవింగ్ లైసెన్స్' : 'Transport & Driving Licence' },
          { id: 'land_records', label: isTe ? 'భూ రికార్డులు (మీభూమి)' : 'Meebhoomi Land Records' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-[#075B46] text-white border-[#075B46] font-semibold shadow-xs'
                : 'bg-white text-[#686B66] border-[#E5E5DF] hover:text-[#242824] hover:bg-[#F8F7F2]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl border border-[#E5E5DF] hover:border-[#075B46] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between p-5 space-y-4 group"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-medium bg-[#F8F7F2] text-[#686B66] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#E5E5DF]">
                  {service.category.replace('_', ' ')}
                </span>
                <span className="text-[11px] text-[#075B46] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Official Portal</span>
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-base text-[#242824] group-hover:text-[#075B46] transition-colors">
                  {getServiceTitle(service, currentLanguage)}
                </h3>
                {isTe && (
                  <div className="text-xs text-[#686B66] font-normal truncate">
                    {service.name}
                  </div>
                )}
              </div>

              <p className="text-xs text-[#686B66] line-clamp-2 leading-relaxed">
                {getServicePurpose(service, currentLanguage)}
              </p>

              {/* Fee and timeline box */}
              <div className="bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[#242824]">
                  <span className="text-[#686B66] flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-[#075B46]" />
                    <span>{isTe ? 'ప్రభుత్వ రుసుము:' : 'Govt Statutory Fee:'}</span>
                  </span>
                  <span className="font-semibold text-[#075B46] truncate max-w-[150px]">{service.officialFee}</span>
                </div>
                <div className="flex items-center justify-between text-[#242824]">
                  <span className="text-[#686B66] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#8E918C]" />
                    <span>{isTe ? 'సమయం:' : 'Processing Time:'}</span>
                  </span>
                  <span className="font-medium text-[#242824]">{service.processingTime}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F8F7F2] flex items-center justify-between">
              <button
                onClick={() => setSelectedService(service)}
                className="text-xs font-medium text-[#242824] hover:text-[#075B46] hover:underline cursor-pointer"
              >
                {isTe ? 'పూర్తి గైడ్ (View Guide)' : 'View Step-by-Step Guide'}
              </button>

              <a
                href={service.officialPortal.split(' ')[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#075B46] hover:bg-[#064B3A] text-white font-medium text-xs px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{isTe ? 'పోర్టల్ తెరవండి' : 'Open Portal'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-xl border border-[#E5E5DF] relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 p-1.5 text-[#8E918C] hover:text-[#242824] rounded-full hover:bg-[#F8F7F2] cursor-pointer transition-colors"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-medium bg-[#EBF3F0] text-[#075B46] px-3 py-1 rounded-full inline-block mb-2">
                  {isTe ? 'ప్రజా సేవా మార్గదర్శిని' : 'Official Service Guide'}
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#242824]">
                  {getServiceTitle(selectedService, currentLanguage)}
                </h2>
                {isTe && (
                  <div className="text-xs text-[#686B66] font-normal mt-0.5">
                    {selectedService.name}
                  </div>
                )}
              </div>

              {/* Voice Output Button */}
              <button
                type="button"
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  } else {
                    const speechText = `${getServiceTitle(selectedService, currentLanguage)}. ${getServicePurpose(selectedService, currentLanguage)}. ${isTe ? 'ప్రభుత్వ ఫీజు:' : 'Statutory Fee:'} ${selectedService.officialFee}.`;
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
            <div className="space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#686B66]">
                {isTe ? 'ఎవరు దరఖాస్తు చేసుకోవచ్చు (Eligibility):' : 'Eligibility & Criteria:'}
              </h3>
              <p className="text-xs sm:text-sm text-[#242824] bg-white p-3 rounded-xl border border-[#E5E5DF] leading-relaxed">
                {selectedService.eligibility}
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

            {/* Support helpline & Official link */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E5E5DF]">
              {selectedService.supportHelpline && (
                <div className="text-xs text-[#686B66] flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-[#075B46]" />
                  <span>{isTe ? 'సహాయవాణి:' : 'Official Helpline:'} <strong className="text-[#242824]">{selectedService.supportHelpline}</strong></span>
                </div>
              )}

              <a
                href={selectedService.officialPortal.split(' ')[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#075B46] hover:bg-[#064B3A] text-white font-medium px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs flex items-center gap-1.5 cursor-pointer ml-auto transition-colors"
              >
                <span>{isTe ? 'అధికారిక వెబ్‌సైట్ తెరవండి' : 'Launch Official Portal'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
