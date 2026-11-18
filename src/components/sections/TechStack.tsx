import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Code2,
  Layout,
  Server,
  Brain,
  Database,
  Wrench,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { SKILL_CATEGORIES } from '../../data/skillsData';
import { TechnologyCluster3D } from './skills/TechnologyCluster3D';
import { ClusterFallback } from './skills/ClusterFallback';
import { SkillClusterErrorBoundary } from './skills/SkillClusterErrorBoundary';
import { useSectionTransition } from '../../hooks/useSectionTransition';

gsap.registerPlugin(ScrollTrigger);

// Category icon helper
const CategoryIcon: React.FC<{ iconName: string; className?: string }> = ({
  iconName,
  className = 'w-4 h-4',
}) => {
  switch (iconName) {
    case 'Code2':
      return <Code2 className={className} />;
    case 'Layout':
      return <Layout className={className} />;
    case 'Server':
      return <Server className={className} />;
    case 'Brain':
      return <Brain className={className} />;
    case 'Database':
      return <Database className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    default:
      return <Code2 className={className} />;
  }
};

// Check WebGL availability safely on isolated throwaway canvas
function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const TechStack: React.FC = () => {
  // Category 01 selected by default
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(SKILL_CATEGORIES[0].id);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Premium scroll-driven section transition (incoming entrance & outgoing pinned receding)
  useSectionTransition(sectionRef, contentRef, {
    isOutgoingPinned: true,
    isIncomingAnimated: true,
    pinDistance: '+=80%',
  });

  useEffect(() => {
    setHasWebGL(checkWebGLSupport());
  }, []);

  // Smooth, scroll-driven progressive transitions inspired by reference video
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = sectionRef.current;
    if (!el) return;

    if (prefersReducedMotion) {
      gsap.set(
        ['.tech-header-anim', '.tech-nav-panel', '.tech-tab-item', '.tech-cluster-panel'],
        { opacity: 1, y: 0, scale: 1 }
      );
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Header parallax tracking with scroll
      gsap.fromTo(
        '.tech-header-anim',
        { y: 20 },
        {
          y: -15,
          stagger: 0.04,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );

      // 2. Left category navigation & Right 3D cluster continuous scroll depth
      gsap.fromTo(
        '.tech-cluster-panel',
        { y: 30, scale: 0.98 },
        {
          y: -25,
          scale: 1.01,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );

      // Category tab items subtle progressive alignment on scroll
      gsap.fromTo(
        '.tech-tab-item',
        { x: -10, opacity: 0.85 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.04,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.tech-nav-panel',
            start: 'top 90%',
            end: 'top 45%',
            scrub: 0.8,
          },
        }
      );

      // 3. Subtle ambient parallax drift
      gsap.fromTo(
        '.tech-ambient-orb',
        { y: -30 },
        {
          y: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  // Currently active category
  const activeCategory =
    SKILL_CATEGORIES.find((cat) => cat.id === selectedCategoryId) || SKILL_CATEGORIES[0];

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategoryId === categoryId) return;
    setSelectedCategoryId(categoryId);
  };

  return (
    <section
      ref={sectionRef}
      id="skills"
      style={{ perspective: '1200px' }}
      className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center py-12 lg:py-16 px-6 sm:px-10 lg:px-16 relative z-[40] overflow-hidden scroll-mt-6 border-b border-slate-100/80 bg-[#FFFEFA] select-none"
    >
      <div
        ref={contentRef}
        className="section-transition-inner w-full flex flex-col justify-center will-change-transform"
        style={{ transformOrigin: 'center top', transformStyle: 'preserve-3d' }}
      >
        {/* Golden ambient lighting orbs matching About section */}
      <div
        className="tech-ambient-orb absolute -top-24 -right-24 w-[480px] h-[480px] bg-[radial-gradient(circle_at_top_right,rgba(212,165,0,0.20)_0%,rgba(212,165,0,0.08)_45%,transparent_70%)] rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="tech-ambient-orb absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-bl from-amber-100/35 via-orange-50/10 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="tech-ambient-orb absolute -bottom-28 -left-24 w-96 h-96 bg-gradient-to-tr from-slate-100/60 via-sky-50/20 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-[1400px] mx-auto relative z-10 flex flex-col justify-center">

      {/* =========================================================================
          AREA A: SECTION INTRODUCTION
          ========================================================================= */}
      <div className="relative z-10 w-full flex flex-col items-center text-center mb-6 sm:mb-8">
        {/* Eyebrow Label with Golden Dot matching About Section */}
        <div className="tech-header-anim flex items-center justify-center gap-2 mb-2.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#D4A500] shadow-[0_0_8px_rgba(212,165,0,0.45)] shrink-0"
            aria-hidden="true"
          />
          <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase font-mono">
            WHAT I WORK WITH
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="tech-header-anim font-heading text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#07163F] tracking-tight leading-[1.2] mb-3">
          The Stack Behind My Work<span className="text-[#D4A500]">.</span>
        </h2>

        {/* Subtitle Description */}
        <p className="tech-header-anim text-xs sm:text-[13px] md:text-sm lg:text-[15px] text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          The technologies, tools, and financial knowledge I explore to build practical solutions and understand the world of technology and markets.
        </p>
      </div>

      {/* =========================================================================
          TWO-COLUMN INTERACTIVE SHOWCASE:
          LEFT: Vertical Category Navigation Panel
          RIGHT: Central 3D Technology Sphere Cluster
          ========================================================================= */}
      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
        
        {/* -----------------------------------------------------------------------
            LEFT COLUMN: VERTICAL CATEGORY NAVIGATION SELECTOR
            ----------------------------------------------------------------------- */}
        <div
          role="tablist"
          aria-label="Skill Categories"
          className="tech-nav-panel lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 self-start flex flex-col justify-between bg-slate-50/85 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)]"
        >
          {/* Header Tag */}
          <div className="flex items-center justify-between px-2 py-1 mb-2.5 border-b border-slate-200/60 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A500] shadow-[0_0_8px_rgba(212,165,0,0.45)]" />
              <span className="text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                CATEGORIES
              </span>
            </div>
            <span className="text-[10px] font-mono font-semibold text-[#07163F] bg-amber-50/90 border border-[#D4A500]/30 px-2 py-0.5 rounded-full">
              7 DISCIPLINES
            </span>
          </div>

          {/* Vertical Category Items (01 through 07 in exact sequence) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-2 sm:gap-2.5">
            {SKILL_CATEGORIES.map((cat) => {
              const isActive = cat.id === selectedCategoryId;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  id={`skill-tab-${cat.id}`}
                  aria-selected={isActive}
                  aria-controls="skill-cluster-panel"
                  tabIndex={0}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`tech-tab-item group relative w-full flex items-center justify-between p-3 sm:p-3.5 rounded-xl sm:rounded-2xl text-left transition-all duration-300 ease-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A500]/50 ${
                    isActive
                      ? 'bg-[#07163F] text-white shadow-md shadow-[#07163F]/15 translate-x-1 border border-[#07163F]'
                      : 'bg-white hover:bg-white text-slate-700 hover:text-[#07163F] border border-slate-200/80 hover:border-[#D4A500] shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_20px_-4px_rgba(212,165,0,0.12),0_4px_8px_-2px_rgba(15,23,42,0.04)] hover:-translate-y-0.5'
                  }`}
                >
                  {/* Left Animated Indicator Accent */}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 rounded-r-full transition-all duration-300 ${
                      isActive
                        ? 'h-6 bg-[#D4A500] opacity-100 scale-y-100'
                        : 'h-4 bg-[#D4A500] opacity-0 group-hover:opacity-100 group-hover:scale-y-100 scale-y-50'
                    }`}
                    aria-hidden="true"
                  />

                  {/* Left Section: Number + Icon + Full Name */}
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pl-1 sm:pl-1.5">
                    {/* Category Number */}
                    <span
                      className={`text-xs font-mono font-bold transition-colors ${
                        isActive
                          ? 'text-[#D4A500]'
                          : 'text-slate-400 group-hover:text-[#D4A500]'
                      }`}
                    >
                      {cat.number}
                    </span>

                    {/* Icon container matching About section */}
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                        isActive
                          ? 'bg-white/10 text-[#D4A500]'
                          : 'bg-slate-50 group-hover:bg-amber-50/90 border border-slate-200/70 group-hover:border-[#D4A500]/40 text-slate-600 group-hover:text-[#D4A500] shadow-sm group-hover:shadow-[0_0_12px_rgba(212,165,0,0.22)]'
                      }`}
                    >
                      <CategoryIcon iconName={cat.iconName} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>

                    {/* Full Category Name */}
                    <span
                      className={`text-xs sm:text-sm tracking-tight transition-colors font-heading ${
                        isActive
                          ? 'font-bold text-white'
                          : 'font-semibold text-slate-800 group-hover:text-[#07163F]'
                      }`}
                    >
                      {cat.name}
                    </span>
                  </div>

                  {/* Right Section: Skill Count + Animated Chevron */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-2">
                    <span
                      className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-semibold transition-colors border ${
                        isActive
                          ? 'bg-white/15 text-[#D4A500] border-white/20'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-amber-50 group-hover:text-amber-900 border-slate-200/60 group-hover:border-[#D4A500]/30'
                      }`}
                    >
                      {cat.skills.length}
                    </span>

                    <ChevronRight
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 ${
                        isActive
                          ? 'text-[#D4A500] translate-x-0.5'
                          : 'text-slate-400 opacity-60 group-hover:opacity-100 group-hover:text-[#D4A500] group-hover:translate-x-1'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Category Footnote */}
          <div className="mt-3 pt-2.5 border-t border-slate-200/60 px-1 hidden lg:flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              ACTIVE SELECTION
            </span>
            <span className="font-semibold text-[#07163F] text-[11px]">
              {activeCategory.skills.length} Technologies
            </span>
          </div>
        </div>

        {/* -----------------------------------------------------------------------
            RIGHT COLUMN: CENTRAL 3D TECHNOLOGY SPHERE CLUSTER
            ----------------------------------------------------------------------- */}
        <div
          id="skill-cluster-panel"
          role="tabpanel"
          aria-labelledby={`skill-tab-${activeCategory.id}`}
          className="tech-cluster-panel lg:col-span-7 xl:col-span-8 relative rounded-2xl sm:rounded-3xl bg-slate-50/60 border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] overflow-hidden flex items-center justify-center min-h-[460px] sm:min-h-[520px] lg:min-h-[580px]"
        >
          {/* Subtle Ambient Scene Header Badge */}
          <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xs text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#D4A500] animate-pulse" />
            <span className="font-bold text-[#07163F]">{activeCategory.number}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-700 font-sans font-semibold text-[11px] tracking-tight">
              {activeCategory.name}
            </span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-50 text-amber-900 border border-amber-200/60 font-bold text-[10px]">
              {activeCategory.skills.length} SKILLS
            </span>
          </div>

          {/* 3D WebGL Cluster Scene */}
          <SkillClusterErrorBoundary category={activeCategory}>
            {hasWebGL ? (
              <TechnologyCluster3D category={activeCategory} />
            ) : (
              <ClusterFallback category={activeCategory} />
            )}
          </SkillClusterErrorBoundary>
        </div>

      </div>
      </div>
      </div>
    </section>
  );
};
