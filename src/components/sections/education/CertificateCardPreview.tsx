import React from 'react';
import { Award, ShieldCheck, Clock, ExternalLink, Sparkles } from 'lucide-react';
import { CertificationItem } from '../../../data/certificationsData';

interface CertificateCardPreviewProps {
  item: CertificationItem;
  isActive: boolean;
  onSelect?: () => void;
  style?: React.CSSProperties;
}

export const CertificateCardPreview: React.FC<CertificateCardPreviewProps> = ({
  item,
  isActive,
  onSelect,
  style,
}) => {
  const isInProgress = item.status === 'in-progress';

  return (
    <div
      onClick={onSelect}
      style={style}
      className={`relative w-[280px] sm:w-[320px] md:w-[340px] h-[380px] sm:h-[410px] rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between select-none cursor-pointer border transition-all duration-300 ease-out ${
        isActive
          ? 'bg-white border-[#D4A500] shadow-[0_20px_40px_-12px_rgba(212,165,0,0.2),0_8px_16px_-4px_rgba(15,23,42,0.06)] ring-1 ring-[#D4A500]/40'
          : 'bg-slate-50/85 hover:bg-white border-slate-200/80 hover:border-[#D4A500] shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_20px_-4px_rgba(212,165,0,0.12),0_4px_8px_-2px_rgba(15,23,42,0.04)] opacity-85 hover:opacity-100'
      }`}
    >
      {/* Decorative Gold Seal / Certificate Frame Header */}
      <div>
        {/* Top Status & Category Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${
              isInProgress
                ? 'bg-amber-50 text-amber-900 border-amber-200/70'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
            }`}
          >
            {isInProgress ? 'IN PREPARATION' : 'VERIFIED CREDENTIAL'}
          </span>

          <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase">
            {item.category}
          </span>
        </div>

        {/* Certificate Decorative Insignia Canvas Container */}
        <div className="relative w-full h-32 sm:h-36 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#07163F] via-slate-900 to-slate-950 p-4 text-white overflow-hidden shadow-inner flex flex-col justify-between border border-slate-800 mb-4">
          {/* Subtle Guilloche Geometric Pattern */}
          <div
            className="absolute inset-0 opacity-15 bg-[radial-gradient(#D4A500_1px,transparent_1px)] [background-size:12px_12px]"
            aria-hidden="true"
          />

          {/* Golden Corner Accents */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#D4A500]/70" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#D4A500]/70" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#D4A500]/70" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#D4A500]/70" />

          {/* Insignia Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#D4A500]">
              <Award className="w-4 h-4 text-[#D4A500]" />
              <span className="text-[9px] font-mono font-bold tracking-widest uppercase">
                EXCELLENCE
              </span>
            </div>
            {isInProgress ? (
              <span className="flex items-center gap-1 text-[9px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                <Clock className="w-2.5 h-2.5" /> PREPARING
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                <ShieldCheck className="w-2.5 h-2.5" /> CERTIFIED
              </span>
            )}
          </div>

          {/* Insignia Center Title */}
          <div className="relative z-10 my-auto text-center px-1">
            <h5 className="font-heading text-xs sm:text-sm font-bold text-white tracking-tight leading-snug line-clamp-2">
              {item.title}
            </h5>
            <p className="text-[10px] font-mono text-slate-300 truncate mt-0.5">
              {item.issuer}
            </p>
          </div>

          {/* Insignia Footer */}
          <div className="relative z-10 flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-700/50 pt-1.5">
            <span>{item.credentialId ? `ID: ${item.credentialId}` : 'EXAM PREP'}</span>
            <span className="text-[#D4A500] font-semibold">{item.issueDate || 'ACTIVE'}</span>
          </div>
        </div>

        {/* Detailed Title & Issuer Below Card */}
        <div>
          <h4 className="font-heading text-sm sm:text-base font-bold text-[#07163F] leading-snug line-clamp-1">
            {item.title}
          </h4>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {item.issuer}
          </p>
        </div>

        {/* Skills Tag Pills (Active card shows more) */}
        {item.skills && item.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {item.skills.slice(0, isActive ? 4 : 2).map((skill, sIdx) => (
              <span
                key={sIdx}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200/60"
              >
                {skill}
              </span>
            ))}
            {item.skills.length > (isActive ? 4 : 2) && (
              <span className="text-[10px] font-mono text-slate-400 px-1 py-0.5">
                +{item.skills.length - (isActive ? 4 : 2)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Action Row */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {isInProgress ? (
          <div className="flex items-center gap-1.5 text-amber-800 font-mono text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A500] animate-spin-slow" />
            <span>Targeting 2025–26</span>
          </div>
        ) : item.credentialUrl ? (
          <a
            href={item.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-[#07163F] hover:text-[#D4A500] font-bold transition-colors font-mono text-[11px]"
          >
            <span>View Credential</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-[11px] font-mono text-slate-400">
            Validated Competency
          </span>
        )}

        <span
          className={`text-[10px] font-mono font-bold ${
            isActive ? 'text-[#D4A500]' : 'text-slate-400'
          }`}
        >
          {isActive ? 'SELECTED' : 'CLICK TO VIEW'}
        </span>
      </div>
    </div>
  );
};

