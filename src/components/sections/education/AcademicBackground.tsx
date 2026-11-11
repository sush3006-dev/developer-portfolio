import React from 'react';
import { GraduationCap, Award, Calendar, CheckCircle2, Sparkles, Building } from 'lucide-react';
import { ACADEMIC_QUALIFICATIONS } from '../../../data/educationData';

export const AcademicBackground: React.FC = () => {
  return (
    <div className="w-full flex flex-col">
      {/* Component Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 sm:mb-8 pb-3 border-b border-slate-100/90">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-amber-600 uppercase block mb-1">
            01 — Academic Background
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Building the foundation<span className="text-amber-500">.</span>
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          2 QUALIFICATIONS
        </span>
      </div>

      {/* Academic Timeline Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
        {ACADEMIC_QUALIFICATIONS.map((item) => {
          const isCurrent = item.isCurrent;

          return (
            <div
              key={item.id}
              className={`group relative rounded-2xl sm:rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ease-out border ${
                isCurrent
                  ? 'bg-gradient-to-br from-white via-amber-50/20 to-white border-amber-300/80 shadow-md shadow-amber-900/5 ring-1 ring-amber-400/20 hover:shadow-xl hover:border-amber-400'
                  : 'bg-white hover:bg-slate-50/80 border-slate-200/70 hover:border-slate-300/90 shadow-xs hover:shadow-lg'
              } hover:-translate-y-1`}
            >
              {/* Top Accent Pill for Active Degree */}
              {isCurrent && (
                <div className="absolute top-0 right-7 -translate-y-1/2 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-mono text-[10px] font-extrabold tracking-wide shadow-sm">
                  <Sparkles className="w-3 h-3 animate-spin-slow" />
                  <span>ACTIVE PROGRAM</span>
                </div>
              )}

              {/* Card Header: Degree Title, Icon & Institution */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isCurrent
                          ? 'bg-amber-100/80 text-amber-700 ring-2 ring-amber-400/30 group-hover:scale-105'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200/80 group-hover:scale-105'
                      }`}
                    >
                      {isCurrent ? (
                        <GraduationCap className="w-5 h-5" />
                      ) : (
                        <Award className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 block">
                        {isCurrent ? "BACHELOR'S DEGREE" : 'DIPLOMA DEGREE'}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug tracking-tight">
                        {item.degree}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Institution & Duration Line */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 mb-4 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.institution}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.duration}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                  {item.description}
                </p>

                {/* Highlights List */}
                {item.highlights && item.highlights.length > 0 && (
                  <div className="space-y-1.5 mb-5">
                    {item.highlights.map((hl, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 flex-shrink-0 ${
                            isCurrent ? 'text-amber-500' : 'text-slate-400'
                          }`}
                        />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer: Status & Performance Badge */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100/90 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isCurrent ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                    }`}
                  />
                  <span className="font-mono font-semibold text-slate-700">
                    {item.status}
                  </span>
                </div>

                {item.performance ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-mono text-[11px] font-bold">
                    <span>Performance:</span>
                    <span className="text-emerald-900">{item.performance}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/70 font-mono text-[11px] font-bold">
                    <span>In Progress</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

