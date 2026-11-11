import React, { useState } from 'react';
import { Star, ChevronRight, X } from 'lucide-react';
import { portfolioData, Testimonial } from '../../data/portfolio';

export const Testimonials: React.FC = () => {
  const { testimonials } = portfolioData;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        id="clients"
        className="rounded-[28px] sm:rounded-[32px] bg-white card-surface border border-slate-100/80 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl relative overflow-hidden"
      >
        {/* Header matching screenshot */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {testimonials.title}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-normal">
              {testimonials.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="text-xs font-semibold text-slate-700 hover:text-slate-950 flex items-center gap-0.5 group transition-colors cursor-pointer"
          >
            <span>See all reviews</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 3 Review Cards Grid matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5">
          {testimonials.items.map((item: Testimonial) => (
            <div
              key={item.id}
              className="rounded-2xl bg-slate-50/70 border border-slate-100 p-4 sm:p-4.5 flex flex-col justify-between text-left transition-all duration-200 hover:bg-slate-50 hover:border-slate-200"
            >
              {/* Star Rating */}
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-normal">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#1e2531] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  {item.initials}
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-xs font-bold text-slate-900 truncate">
                    {item.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 truncate">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* See All Reviews Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-2xl relative text-left"
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
              Client Testimonials & Feedback
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              What founders, engineering leads, and partners have to say
            </p>

            <div className="mt-6 space-y-3.5">
              {testimonials.items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="mt-3 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#1e2531] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {item.initials}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                      <p className="text-[11px] text-slate-500">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
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

export default Testimonials;
