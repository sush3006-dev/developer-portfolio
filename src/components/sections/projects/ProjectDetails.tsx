/**
 * ProjectDetails.tsx
 *
 * Slide-in details panel that appears when a project card is clicked.
 * Uses GSAP for smooth entrance, project-switch crossfade, and smooth exit.
 * Preserves displayProject during exit so the panel animates out gracefully.
 */
import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { Github, ArrowRight, X, CheckCircle2, Sparkles, Clock } from 'lucide-react';
import { Project } from '../../../data/projects';

interface ProjectDetailsProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  // displayProject preserves project data during the smooth GSAP exit animation
  const [displayProject, setDisplayProject] = useState<Project | null>(project);

  const getStatusBadge = (status?: Project['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Verified &amp; Live
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            In Active Development
          </span>
        );
      case 'In Development':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
            <Clock className="w-2.5 h-2.5" />
            Research &amp; Prototyping
          </span>
        );
      default:
        return null;
    }
  };

  /* ── Animate in, crossfade or animate out smoothly ── */
  useEffect(() => {
    const panel = panelRef.current;

    if (project) {
      const isSwitching = displayProject !== null && displayProject.id !== project.id;
      setDisplayProject(project);

      if (!panel) return;

      if (!displayProject) {
        // First open: slide up + fade in
        gsap.fromTo(
          panel,
          { y: 20, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' }
        );
      } else if (isSwitching) {
        // Switching projects: quick smooth transition
        gsap.fromTo(
          panel,
          { opacity: 0.45, x: -6 },
          { opacity: 1, x: 0, duration: 0.22, ease: 'power2.out' }
        );
      }
    } else if (displayProject) {
      // Closing: animate out smoothly, then clear displayProject
      if (panel) {
        gsap.to(panel, {
          y: 16,
          opacity: 0,
          scale: 0.98,
          duration: 0.25,
          ease: 'power2.in',
          onComplete: () => {
            setDisplayProject(null);
          },
        });
      } else {
        setDisplayProject(null);
      }
    }
  }, [project]);

  /* ── Escape key ── */
  useEffect(() => {
    if (!project) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [project, onClose]);

  if (!displayProject) return null;

  return (
    <div
      ref={panelRef}
      className="w-full mt-5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.1)] p-5 sm:p-6 relative overflow-hidden text-left"
    >
      {/* Top accent line using project color */}
      <div
        className="absolute top-0 inset-x-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${displayProject.color} 0%, ${displayProject.accentColor} 50%, transparent 100%)`,
        }}
        aria-hidden="true"
      />

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close project details"
        className="absolute top-3 right-3 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer z-10"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Header: number + category + status */}
      <div className="flex flex-wrap items-center gap-2 mb-3 pr-8">
        <span
          className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold tracking-wider"
          style={{ background: displayProject.color, color: displayProject.textColor }}
        >
          #{displayProject.number}
        </span>
        <span className="text-[11px] font-semibold text-slate-500 tracking-wide uppercase font-mono">
          {displayProject.category}
        </span>
        {getStatusBadge(displayProject.status)}
      </div>

      {/* Title */}
      <h3 className="font-heading text-lg sm:text-xl font-extrabold text-[#07163F] tracking-tight mb-1">
        {displayProject.title}
      </h3>

      {/* Role */}
      <p className="text-[11px] font-mono text-slate-500 mb-3">
        Role:{' '}
        <span style={{ color: displayProject.accentColor }} className="font-semibold">
          {displayProject.role}
        </span>
      </p>

      {/* 16:9 Project Thumbnail Preview */}
      {displayProject.thumbnail && (
        <div className="w-full aspect-video rounded-xl overflow-hidden mb-4 border border-slate-200/80 bg-slate-100 shadow-sm relative group">
          <img
            src={displayProject.thumbnail}
            alt={`${displayProject.title} Interface Preview`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      )}

      {/* Description */}
      <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mb-4">
        {displayProject.detailedDescription ?? displayProject.description}
      </p>

      {/* Highlights */}
      {displayProject.highlights && displayProject.highlights.length > 0 && (
        <div className="mb-4 space-y-1.5 bg-slate-50/85 rounded-xl p-3.5 border border-slate-200/80">
          <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase font-mono flex items-center gap-1 mb-1">
            <Sparkles className="w-3 h-3" style={{ color: displayProject.accentColor }} />
            Key Highlights
          </div>
          <ul className="space-y-1">
            {displayProject.highlights.map((item, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                <CheckCircle2
                  className="w-3.5 h-3.5 shrink-0 mt-0.5"
                  style={{ color: displayProject.accentColor }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tech pills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {displayProject.technologies.map((tech) => (
          <span
            key={tech}
            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium font-mono border border-slate-200/60"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Action links */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-3 flex-wrap">
        {/* Go Live Button (prominent CTA - only shown when liveDemoUrl exists, e.g. Janaraksha) */}
        {displayProject.liveDemoUrl && (
          <a
            href={displayProject.liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4A500] hover:bg-[#b88f00] text-[#07163F] text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.98]"
            aria-label={`Open live deployment for ${displayProject.title}`}
          >
            <span>Go Live</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        )}

        {/* Source Repository link */}
        {displayProject.githubUrl && (
          <a
            href={displayProject.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#07163F] hover:bg-slate-900 text-white text-xs font-semibold shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98]"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Source Repository</span>
          </a>
        )}

        <span className="ml-auto text-[11px] text-slate-400 font-medium">
          Press Esc or click card to close
        </span>
      </div>
    </div>
  );
};

export default ProjectDetails;
