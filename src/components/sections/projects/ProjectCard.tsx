import React from 'react';
import { ArrowUpRight, Sparkles, Pin } from 'lucide-react';
import { Project } from '../../../data/projects';

interface ProjectCardProps {
  project: Project;
  isActive: boolean;
  isPinned: boolean;
  style: React.CSSProperties;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isActive,
  isPinned,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button"
      tabIndex={0}
      aria-pressed={isPinned}
      aria-label={`Project ${project.number}: ${project.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`absolute inset-0 w-full rounded-2xl sm:rounded-3xl border cursor-pointer select-none overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
        isActive
          ? 'bg-white border-[#D4A500] shadow-[0_20px_40px_-12px_rgba(212,165,0,0.2),0_8px_16px_-4px_rgba(15,23,42,0.06)] ring-1 ring-[#D4A500]/40'
          : 'bg-slate-50/85 hover:bg-white border-slate-200/80 hover:border-[#D4A500] shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_20px_-4px_rgba(212,165,0,0.12),0_4px_8px_-2px_rgba(15,23,42,0.04)]'
      }`}
    >
      {/* Background card subtle warm off-white surface */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-slate-100/30 pointer-events-none" />

      {/* Top golden ambient accent on active card */}
      {isActive && (
        <div
          className="absolute -top-12 -right-12 w-36 h-36 bg-[radial-gradient(circle,rgba(212,165,0,0.20)_0%,transparent_70%)] rounded-full blur-xl pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Card Content Layout */}
      <div className="relative z-10 h-full p-4 sm:p-5 flex flex-col justify-between text-left">
        {/* Upper Header Row: Number Badge, Category, and Pin / Arrow Icon */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold tracking-wider transition-colors border ${
                isActive
                  ? 'bg-[#07163F] text-[#D4A500] border-[#07163F]'
                  : 'bg-slate-100 text-slate-700 border-slate-200/60'
              }`}
            >
              #{project.number}
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono line-clamp-1">
              {project.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isPinned ? (
              <span className="p-1 rounded-full bg-amber-50 text-amber-900 border border-[#D4A500]/40" title="Pinned Project">
                <Pin className="w-3.5 h-3.5 fill-[#D4A500]" />
              </span>
            ) : (
              <span
                className={`p-1 rounded-full transition-all duration-300 ${
                  isActive ? 'text-[#D4A500] translate-x-0.5 -translate-y-0.5' : 'text-slate-400 group-hover:text-[#D4A500]'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
              </span>
            )}
          </div>
        </div>

        {/* Center: Title & Short Abstract */}
        <div className="my-auto py-2">
          <h4
            className="font-heading text-base sm:text-lg lg:text-xl font-bold tracking-tight text-[#07163F] line-clamp-1"
          >
            {project.title}
          </h4>
          <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Lower Row: Tech Pills & Status */}
        <div className="pt-2 border-t border-slate-100/90 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded bg-slate-100/90 text-slate-700 text-[10px] font-mono font-medium border border-slate-200/60"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-1.5 py-0.5 rounded bg-slate-100/80 text-slate-500 text-[10px] font-mono">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>

          {project.status && (
            <span
              className={`text-[10px] font-semibold font-mono tracking-wide px-2 py-0.5 rounded-full ${
                project.status === 'Completed'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                  : 'bg-amber-50 text-amber-900 border border-amber-200/70'
              }`}
            >
              {project.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

