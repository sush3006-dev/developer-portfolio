import React, { useState, useEffect, useRef } from 'react';
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

  useEffect(() => {
    setHasWebGL(checkWebGLSupport());
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
      className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center py-12 lg:py-16 px-6 sm:px-10 lg:px-16 relative overflow-hidden scroll-mt-6 border-b border-slate-100/80 bg-[#FFFEFA] select-none"
    >
      {/* Subtle ambient lighting orbs matching About & Experience palette */}
      <div
        className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-bl from-amber-100/35 via-orange-50/10 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-20 w-80 h-80 bg-gradient-to-tr from-slate-100/50 via-sky-50/15 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-[1400px] mx-auto relative z-10 flex flex-col justify-center">

      {/* =========================================================================
          AREA A: SECTION INTRODUCTION
          ========================================================================= */}
      <div className="relative z-10 w-full flex flex-col items-center text-center mb-6 sm:mb-8">
        {/* Eyebrow Label with Amber Dot */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase font-mono">
            WHAT I WORK WITH
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          The Stack Behind My Work<span className="text-amber-500">.</span>
        </h2>

        {/* Subtitle Description */}
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
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
          className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between bg-slate-50/70 rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200/70 shadow-xs"
        >
          {/* Header Tag */}
          <div className="flex items-center justify-between px-2 py-1 mb-2 border-b border-slate-200/60 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                CATEGORIES
              </span>
            </div>
            <span className="text-[10px] font-mono font-semibold text-amber-800 bg-amber-100/70 border border-amber-200 px-2 py-0.5 rounded-full">
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
                  className={`group relative w-full flex items-center justify-between p-3 sm:p-3.5 rounded-xl sm:rounded-2xl text-left transition-all duration-300 ease-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15 translate-x-1.5 border border-slate-800'
                      : 'bg-white hover:bg-slate-100/80 text-slate-700 hover:text-slate-950 border border-slate-200/70 hover:border-slate-300 shadow-xs hover:shadow-md hover:translate-x-1.5'
                  }`}
                >
                  {/* Left Animated Indicator Accent */}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 rounded-r-full transition-all duration-300 ${
                      isActive
                        ? 'h-6 bg-gradient-to-b from-amber-400 to-amber-500 opacity-100 scale-y-100'
                        : 'h-4 bg-amber-400 opacity-0 group-hover:opacity-100 group-hover:scale-y-100 scale-y-50'
                    }`}
                    aria-hidden="true"
                  />

                  {/* Left Section: Number + Icon + Full Name */}
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pl-1 sm:pl-1.5">
                    {/* Category Number */}
                    <span
                      className={`text-xs font-mono font-bold transition-colors ${
                        isActive
                          ? 'text-amber-400'
                          : 'text-slate-400 group-hover:text-amber-600'
                      }`}
                    >
                      {cat.number}
                    </span>

                    {/* Icon container */}
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                        isActive
                          ? 'bg-white/10 text-amber-400'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-amber-50 group-hover:text-amber-600 group-hover:scale-105 group-hover:rotate-3'
                      }`}
                    >
                      <CategoryIcon iconName={cat.iconName} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>

                    {/* Full Category Name (Never truncated) */}
                    <span
                      className={`text-xs sm:text-sm tracking-tight transition-colors ${
                        isActive
                          ? 'font-bold text-white'
                          : 'font-medium text-slate-700 group-hover:text-slate-950 group-hover:font-semibold'
                      }`}
                    >
                      {cat.name}
                    </span>
                  </div>

                  {/* Right Section: Skill Count + Animated Chevron */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-2">
                    <span
                      className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-semibold transition-colors ${
                        isActive
                          ? 'bg-white/15 text-amber-300'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-amber-100/70 group-hover:text-amber-800'
                      }`}
                    >
                      {cat.skills.length}
                    </span>

                    <ChevronRight
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 ${
                        isActive
                          ? 'text-amber-400 translate-x-0.5'
                          : 'text-slate-400 opacity-50 group-hover:opacity-100 group-hover:text-amber-600 group-hover:translate-x-1'
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
            <span className="font-semibold text-slate-800 text-[11px]">
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
          className="lg:col-span-7 xl:col-span-8 relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-slate-50/50 via-white to-amber-50/20 border border-slate-100/90 shadow-inner overflow-hidden flex items-center justify-center min-h-[460px] sm:min-h-[520px] lg:min-h-[580px]"
        >
          {/* Subtle Ambient Scene Header Badge */}
          <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xs text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-bold text-slate-900">{activeCategory.number}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-700 font-sans font-semibold text-[11px] tracking-tight">
              {activeCategory.name}
            </span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
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
    </section>
  );
};
