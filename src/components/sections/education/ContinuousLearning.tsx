import React, { useEffect, useRef } from 'react';
import { Brain, Binary, Layers, TrendingUp, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONTINUOUS_LEARNING_AREAS, LearningItem } from '../../../data/educationData';

gsap.registerPlugin(ScrollTrigger);

const LearningIcon: React.FC<{ iconName: LearningItem['iconName']; className?: string }> = ({
  iconName,
  className = 'w-5 h-5',
}) => {
  switch (iconName) {
    case 'Brain':
      return <Brain className={className} />;
    case 'Binary':
      return <Binary className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    default:
      return <Brain className={className} />;
  }
};

export const ContinuousLearning: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic focal highlight tracking as user scrolls through (inspired by Reference Video Scene 3)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = containerRef.current;
    if (prefersReducedMotion || !el) return;

    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll<HTMLElement>('.edu-learning-card');
      cards.forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 65%',
          end: 'bottom 35%',
          toggleClass: { targets: card, className: 'is-focal-active' },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full flex flex-col">
      {/* Component Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 sm:mb-8 pb-3 border-b border-slate-100/90">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#D4A500] shadow-[0_0_8px_rgba(212,165,0,0.45)] shrink-0"
              aria-hidden="true"
            />
            <span className="text-[11px] font-mono font-bold tracking-widest text-slate-500 uppercase">
              03 — CONTINUOUS LEARNING
            </span>
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#07163F] tracking-tight">
            Always Learning, Always Building<span className="text-[#D4A500]">.</span>
          </h3>
        </div>
        <p className="text-xs text-slate-500 max-w-md sm:text-right">
          Beyond formal education and credentials, continuous exploration across software and financial markets.
        </p>
      </div>

      {/* 2x2 Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
        {CONTINUOUS_LEARNING_AREAS.map((item) => (
          <div
            key={item.id}
            className="edu-learning-card group relative rounded-2xl sm:rounded-3xl p-6 sm:p-7 bg-slate-50/85 hover:bg-white [&.is-focal-active]:bg-white border border-slate-200/80 hover:border-[#D4A500] [&.is-focal-active]:border-[#D4A500] shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_20px_-4px_rgba(212,165,0,0.12),0_4px_8px_-2px_rgba(15,23,42,0.04)] [&.is-focal-active]:shadow-[0_12px_28px_-6px_rgba(212,165,0,0.18),0_4px_12px_-2px_rgba(15,23,42,0.06)] [&.is-focal-active]:-translate-y-1 transition-all duration-500 ease-out flex flex-col justify-between hover:-translate-y-1"
          >
            {/* Top row: Icon & Status */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="learning-icon-box w-11 h-11 rounded-2xl bg-white group-hover:bg-amber-50/90 group-[.is-focal-active]:bg-amber-50/90 border border-slate-200/70 group-hover:border-[#D4A500]/40 group-[.is-focal-active]:border-[#D4A500]/40 flex items-center justify-center text-slate-700 group-hover:text-[#D4A500] group-[.is-focal-active]:text-[#D4A500] shadow-sm group-hover:shadow-[0_0_12px_rgba(212,165,0,0.22)] group-[.is-focal-active]:shadow-[0_0_12px_rgba(212,165,0,0.22)] transition-all duration-300 ease-out">
                  <LearningIcon iconName={item.iconName} className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" />
                </div>

                <div className="learning-status-badge flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60 font-mono text-[10px] font-bold group-hover:bg-amber-50 group-hover:text-amber-900 group-hover:border-[#D4A500]/30 group-[.is-focal-active]:bg-amber-50 group-[.is-focal-active]:text-amber-900 group-[.is-focal-active]:border-[#D4A500]/30 transition-colors">
                  <Sparkles className="w-3 h-3 text-[#D4A500]" />
                  <span>{item.status}</span>
                </div>
              </div>

              {/* Title & Description */}
              <h4 className="font-heading text-base sm:text-lg font-bold text-[#07163F] tracking-tight mb-2 group-hover:text-[#07163F] transition-colors">
                {item.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                {item.description}
              </p>
            </div>

            {/* Topics / Technologies Badges */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                ACTIVE EXPLORATIONS
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.topics.map((topic, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100/80 group-hover:bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 font-mono text-xs font-medium border border-slate-200/60 hover:border-[#D4A500]/40 transition-colors"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

