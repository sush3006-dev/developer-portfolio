/**
 * Projects.tsx
 *
 * Orchestrates the full Projects section:
 *   LEFT  : GSAP deck-shuffle card stack + progress bar + details panel
 *   RIGHT : Character video (IntersectionObserver play/pause)
 *
 * Strictly preserves all other sections.
 */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { projectsData } from '../../data/projects';
import { ProjectStack, ProjectStackHandle } from './projects/ProjectStack';
import { ProjectDetails } from './projects/ProjectDetails';
import { ProjectProgress } from './projects/ProjectProgress';
import { CharacterVideo } from './projects/CharacterVideo';

export const Projects: React.FC = () => {
  // Single source of truth for the selected project
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const stackRef = useRef<ProjectStackHandle>(null);

  // Derived state
  const isDetailOpen = selectedProjectId !== null;
  const selectedProject = selectedProjectId
    ? projectsData.find((p) => p.id === selectedProjectId) ?? null
    : null;

  /* ── Pause auto-advance while details are open ── */
  useEffect(() => {
    if (isDetailOpen) {
      stackRef.current?.pause();
    } else {
      stackRef.current?.resume();
    }
  }, [isDetailOpen]);

  // Click on a project: if already selected, clear (toggle off); otherwise select it
  const handleSelectProject = useCallback((project: (typeof projectsData)[0]) => {
    setSelectedProjectId((currentId) =>
      currentId === project.id ? null : project.id
    );
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedProjectId(null);
  }, []);

  const handleProgressChange = useCallback((p: number) => {
    setProgress(p);
  }, []);

  const timerPaused = isDetailOpen;

  return (
    <section
      id="projects"
      className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center py-12 lg:py-16 px-6 sm:px-10 lg:px-16 relative overflow-hidden scroll-mt-6 border-b border-slate-100/80 bg-[#FFFEFA]"
    >
      {/* Backward-compatible anchor */}
      <span id="works" className="absolute -top-24 pointer-events-none" aria-hidden="true" />

      {/* ── GOLDEN AMBIENT LIGHTING MATCHING ABOUT SECTION ── */}
      <div
        className="absolute -top-24 -right-24 w-[480px] h-[480px] bg-[radial-gradient(circle_at_top_right,rgba(212,165,0,0.20)_0%,rgba(212,165,0,0.08)_45%,transparent_70%)] rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-bl from-amber-100/35 via-orange-50/10 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-28 -left-24 w-96 h-96 bg-gradient-to-tr from-slate-100/60 via-sky-50/20 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-[1400px] mx-auto relative z-10 flex flex-col justify-center gap-8 sm:gap-10">

      {/* ── SECTION HEADER ── */}
      <div className="relative z-10 w-full flex flex-col items-start text-left max-w-2xl">
        <div className="flex items-center gap-2 mb-2.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#D4A500] shadow-[0_0_8px_rgba(212,165,0,0.45)] shrink-0"
            aria-hidden="true"
          />
          <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase font-mono">
            MY WORK
          </span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#07163F] tracking-tight leading-[1.2]">
          Ideas Into <span className="text-slate-700">Reality.</span>
        </h2>
        <p className="mt-2 text-xs sm:text-[13px] md:text-sm lg:text-[15px] text-slate-600 leading-relaxed font-normal">
          A collection of projects, experiments and solutions I've explored through technology,
          engineering and problem-solving.
        </p>
      </div>

      {/* ── MAIN 2-COLUMN LAYOUT ── */}
      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

        {/* ── LEFT: Card Stack + Progress + Details ── */}
        <div className="lg:col-span-7 flex flex-col items-start w-full">

          {/* Stack + prev/next row */}
          <div className="w-full flex flex-col items-start gap-5">
            {/* Card deck — shifted slightly rightwards for balanced visual weight */}
            <div className="w-full overflow-visible pl-4 sm:pl-8 lg:pl-10">
              <ProjectStack
                ref={stackRef}
                projects={projectsData}
                selectedProjectId={selectedProjectId}
                onSelectProject={handleSelectProject}
                onProgressChange={handleProgressChange}
                isDetailOpen={isDetailOpen}
              />
            </div>

            {/* Progress bar + nav controls row */}
            <div className="w-full flex items-center gap-3 max-w-[390px] pl-4 sm:pl-8 lg:pl-10">
              {/* Prev button */}
              <button
                type="button"
                onClick={() => { stackRef.current?.advance('prev'); }}
                aria-label="Previous project"
                className="p-2 rounded-xl border border-slate-200/80 bg-white hover:bg-white text-slate-700 hover:text-[#07163F] hover:border-[#D4A500] hover:shadow-[0_4px_12px_rgba(212,165,0,0.12)] transition-all duration-200 shadow-sm cursor-pointer shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Progress bar */}
              <div className="flex-1">
                <ProjectProgress
                  progress={progress}
                  paused={timerPaused}
                  accentColor="#D4A500"
                />
              </div>

              {/* Next button */}
              <button
                type="button"
                onClick={() => { stackRef.current?.advance('next'); }}
                aria-label="Next project"
                className="p-2 rounded-xl border border-slate-200/80 bg-white hover:bg-white text-slate-700 hover:text-[#07163F] hover:border-[#D4A500] hover:shadow-[0_4px_12px_rgba(212,165,0,0.12)] transition-all duration-200 shadow-sm cursor-pointer shrink-0"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Helper hint */}
            {!isDetailOpen && (
              <p className="text-[11px] text-slate-400 font-mono mt-1 pl-4 sm:pl-8 lg:pl-10">
                Click any card to view details • Click again to close
              </p>
            )}
          </div>

          {/* Details panel */}
          <div className="w-full max-w-[540px] pl-0 sm:pl-4 lg:pl-6">
            <ProjectDetails project={selectedProject} onClose={handleCloseDetails} />
          </div>
        </div>

        {/* ── RIGHT: Character — no box, composited naturally over the section bg ── */}
        <div className="lg:col-span-5 flex flex-col items-center justify-end w-full lg:sticky lg:top-20 lg:self-end">
          <CharacterVideo />
        </div>

      </div>
      </div>
    </section>
  );
};

export default Projects;
