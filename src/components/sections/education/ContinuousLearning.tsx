import React from 'react';
import { Brain, Binary, Layers, TrendingUp, Sparkles } from 'lucide-react';
import { CONTINUOUS_LEARNING_AREAS, LearningItem } from '../../../data/educationData';

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
  return (
    <div className="w-full flex flex-col">
      {/* Component Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 sm:mb-8 pb-3 border-b border-slate-100/90">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-amber-600 uppercase block mb-1">
            03 — Continuous Learning
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Always Learning, Always Building<span className="text-amber-500">.</span>
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
            className="group relative rounded-2xl sm:rounded-3xl p-6 sm:p-7 bg-white hover:bg-slate-50/70 border border-slate-200/80 hover:border-amber-300/80 shadow-xs hover:shadow-xl transition-all duration-300 ease-out flex flex-col justify-between hover:-translate-y-1"
          >
            {/* Top row: Icon & Status */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-amber-100/80">
                  <LearningIcon iconName={item.iconName} className="w-5 h-5 text-amber-700" />
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold group-hover:bg-amber-50 group-hover:text-amber-900 transition-colors">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{item.status}</span>
                </div>
              </div>

              {/* Title & Description */}
              <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mb-2 group-hover:text-amber-900 transition-colors">
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
                    className="px-2.5 py-1 rounded-lg bg-slate-100/80 hover:bg-amber-100/60 text-slate-700 hover:text-amber-900 font-mono text-xs font-medium transition-colors"
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

