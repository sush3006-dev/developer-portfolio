import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, X } from 'lucide-react';
import { portfolioData, ServiceItem } from '../../data/portfolio';

export const Services: React.FC = () => {
  const { servicesBanner } = portfolioData;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        id="services"
        className="rounded-[28px] sm:rounded-[32px] services-surface border border-white/70 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-300 hover:shadow-xl relative overflow-hidden"
      >
        {/* Soft decorative background spotlight */}
        <div 
          className="absolute -top-24 -left-24 w-60 h-60 bg-white/40 rounded-full blur-2xl pointer-events-none" 
          aria-hidden="true" 
        />

        {/* Left Side: Callout Text & Button matching screenshot */}
        <div className="flex-1 flex flex-col items-start text-left z-10">
          <h2 className="font-heading text-xl sm:text-2xl lg:text-[26px] font-extrabold text-slate-900 tracking-tight leading-tight">
            {servicesBanner.title}
          </h2>

          <p className="mt-2.5 text-xs sm:text-[13px] text-slate-600 leading-relaxed max-w-sm">
            {servicesBanner.subtitle}
          </p>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-slate-800 text-xs font-semibold shadow-sm hover:bg-slate-50 border border-slate-200/80 transition-all duration-200 cursor-pointer hover:shadow"
          >
            <span>{servicesBanner.buttonText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Side: Developer Character at Desk */}
        <div className="relative shrink-0 flex items-center justify-center w-56 sm:w-64 lg:w-72 h-44 sm:h-52 z-10 overflow-hidden rounded-2xl shadow-sm border border-white/60 bg-slate-900/5 group">
          <img
            src={servicesBanner.characterImage}
            alt="Developer Working at Desk Character"
            className="w-full h-full object-cover object-[50%_40%] select-none pointer-events-none transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/service_012b74e0.jpg';
            }}
          />
        </div>
      </div>

      {/* Services Detail Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              aria-label="Close dialog"
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading text-2xl font-bold text-slate-900">
              Services & Capabilities
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              High-impact engineering and user-experience solutions
            </p>

            <div className="mt-5 space-y-4">
              {servicesBanner.services.map((svc: ServiceItem) => (
                <div
                  key={svc.id}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 text-left"
                >
                  <h4 className="text-sm font-bold text-slate-900">
                    {svc.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {svc.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {svc.deliverables.map((d, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center pt-4 border-t border-slate-100">
              <a
                href="#contact"
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Inquire for Work
              </a>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Services;
