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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 flex items-center space-x-2">
            <span>
              {isTe
                ? 'ప్రజా డిజిటల్ సేవల మార్గదర్శిని'
                : 'Public Digital Services & Certificates Directory'}
            </span>
            <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {VERIFIED_PUBLIC_SERVICES.length} {isTe ? 'అధికారిక సేవలు' : 'Official Services'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {isTe
              ? 'ఆధార్, పాన్ కార్డు, రేషన్ కార్డు, కుల & ఆదాయ సర్టిఫికెట్లు, ఓటర్ ఐడీ, డ్రైవింగ్ లైసెన్స్, మీభూమి రికార్డుల పూర్తి అధికారిక వివరాలు'
              : 'Official government guidance for Aadhaar, PAN, Rice cards, Caste/Income certificates, Voter ID, Driving Licence, and Meebhoomi land records.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isTe ? 'సర్టిఫికెట్లు, ఆధార్, పాన్ కార్డు...' : 'Search certificates, Aadhaar, PAN, Voter ID...'}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-2xs"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 text-xs font-semibold">
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
                ? 'bg-emerald-900 text-amber-300 border-emerald-900 shadow-xs font-bold'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
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
            className="bg-white rounded-2xl border border-stone-200 hover:border-emerald-600/70 shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-5 space-y-4 group"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {service.category.replace('_', ' ')}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Official Portal</span>
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-stone-900 group-hover:text-emerald-900 transition-colors">
                  {getServiceTitle(service, currentLanguage)}
                </h3>
                {isTe && (
                  <div className="text-xs text-stone-500 font-medium truncate">
                    {service.name}
                  </div>
                )}
              </div>

              <p className="text-xs text-stone-600 line-clamp-2">
                {getServicePurpose(service, currentLanguage)}
              </p>

              {/* Fee and timeline badges */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs space-y-1">
                <div className="flex items-center justify-between text-stone-800">
                  <span className="font-semibold flex items-center space-x-1">
                    <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isTe ? 'ప్రభుత్వ రుసుము:' : 'Govt Statutory Fee:'}</span>
                  </span>
                  <span className="font-bold text-amber-950 truncate max-w-[150px]">{service.officialFee}</span>
                </div>
                <div className="flex items-center justify-between text-stone-700">
                  <span className="font-semibold flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    <span>{isTe ? 'సమయం:' : 'Processing Time:'}</span>
                  </span>
                  <span className="font-medium text-stone-900">{service.processingTime}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedService(service)}
                className="text-xs font-bold text-emerald-900 hover:text-emerald-700 underline cursor-pointer"
              >
                {isTe ? 'పూర్తి గైడ్ (View Guide)' : 'View Step-by-Step Guide'}
              </button>

              <a
                href={service.officialPortal.split(' ')[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold text-xs px-3 py-1.5 rounded-lg shadow-2xs flex items-center space-x-1 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full inline-block mb-2">
                  {isTe ? 'ప్రజా సేవా మార్గదర్శిని' : 'Official Service Guide'}
                </span>
                <h2 className="text-2xl font-black text-stone-900">
                  {getServiceTitle(selectedService, currentLanguage)}
                </h2>
                {isTe && (
                  <div className="text-xs text-stone-500 font-medium mt-0.5">
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
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer ${
                  isSpeaking ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                }`}
                title="Listen to service details"
              >
                {isSpeaking ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-700" />}
                <span>{isSpeaking ? (isTe ? 'ఆపండి' : 'Stop') : (isTe ? 'వాయిస్ వివరణ' : 'Voice Output')}</span>
              </button>
            </div>

            {/* Purpose & Official Costs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
              <div>
                <span className="font-bold text-stone-700 block mb-0.5">
                  {isTe ? 'అధికారిక ఫీజు (Official Fees):' : 'Official Statutory Fees:'}
                </span>
                <span className="text-stone-900">{selectedService.officialFee}</span>
              </div>
              <div>
                <span className="font-bold text-stone-700 block mb-0.5">
                  {isTe ? 'పరిష్కార గడువు (Processing Timeline):' : 'Processing Timeline:'}
                </span>
                <span className="text-stone-900">{selectedService.processingTime}</span>
              </div>
            </div>

            {/* Eligibility */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase text-stone-700">
                {isTe ? 'ఎవరు దరఖాస్తు చేసుకోవచ్చు (Eligibility):' : 'Eligibility & Criteria:'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-800 bg-white p-3 rounded-xl border border-stone-200">
                {selectedService.eligibility}
              </p>
            </div>

            {/* Documents */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase text-stone-700">
                {isTe ? 'కావలసిన పత్రాలు (Required Documents):' : 'Required Documents Checklist:'}
              </h3>
              <div className="space-y-1.5 text-xs text-stone-800">
                {getServiceDocs(selectedService, currentLanguage).map((doc, idx) => (
                  <div key={idx} className="flex items-start space-x-2 bg-amber-50/50 p-2 rounded-lg border border-amber-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase text-stone-700">
                {isTe ? 'దరఖాస్తు విధానం (Step-by-Step Instructions):' : 'Step-by-Step Application Process:'}
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-stone-800">
                {getServiceSteps(selectedService, currentLanguage).map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Tracking Instructions */}
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs space-y-1">
              <span className="font-bold text-emerald-900 block">
                {isTe ? 'స్థితిని ఎలా ట్రాక్ చేయాలి (Status Tracking):' : 'How to Track Application Status:'}
              </span>
              <p className="text-stone-700">{getServiceTracking(selectedService, currentLanguage)}</p>
            </div>

            {/* Support helpline & Official link */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-200">
              {selectedService.supportHelpline && (
                <div className="text-xs text-stone-600 flex items-center space-x-1">
                  <PhoneCall className="w-4 h-4 text-emerald-800" />
                  <span>{isTe ? 'సహాయవాణి:' : 'Official Helpline:'} <strong>{selectedService.supportHelpline}</strong></span>
                </div>
              )}

              <a
                href={selectedService.officialPortal.split(' ')[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md flex items-center space-x-1.5 cursor-pointer ml-auto"
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
